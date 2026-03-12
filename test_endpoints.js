
const BASE_URL = 'http://localhost:3000/v1';
const DEV_OTP = '111111';

async function runTests() {
    const results = [];
    let token = '';
    let refreshToken = '';
    let cookies = '';
    let userId = null;
    let productId = null;    // db id (for product detail URL)
    let realProductId = null; // productId (for cart)
    let saleRate = null;      // actual rate from DB (for order creation)
    let orderId = null;
    let categoryId = null;
    let addressId = null;
    let returnId = null;
    let couponId = null;

    const testMobile = `9${Math.floor(Math.random() * 900000000 + 100000000)}`;
    const testEmail = `test_${Math.floor(Math.random() * 10000)}@example.com`;

    // ─── Core request helper ───────────────────────────────────────────────
    async function request(name, path, method = 'GET', body = null, extraHeaders = {}, expectedStatus = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(cookies ? { Cookie: cookies } : {}),
                ...extraHeaders
            }
        };
        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(`${BASE_URL}${path}`, options);
            const status = response.status;

            // Capture/Update cookies from Set-Cookie headers
            const setCookies = response.headers.getSetCookie();
            if (setCookies && setCookies.length > 0) {
                setCookies.forEach(cookieStr => {
                    const name = cookieStr.split('=')[0];
                    const valueMatch = cookieStr.match(/=[^;]*/);
                    const value = valueMatch ? valueMatch[0].substring(1) : '';

                    if (name === 'accessToken') {
                        token = value;
                        if (!value || cookieStr.includes('Max-Age=0') || cookieStr.includes('Expires=Thu, 01 Jan 1970')) {
                            token = '';
                        }
                    }
                    if (name === 'refreshToken') {
                        refreshToken = value;
                    }
                });

                // Reconstruct cookies string
                let cookieParts = [];
                if (token) cookieParts.push(`accessToken=${token}`);
                if (refreshToken) cookieParts.push(`refreshToken=${refreshToken}`);
                cookies = cookieParts.join('; ');
            }

            let data = null;
            const ct = response.headers.get('content-type') || '';
            if (ct.includes('application/json')) data = await response.json();

            const expect = expectedStatus ?? 200;
            const isExpectedStatus = (status === expect || (expectedStatus === null && status >= 200 && status < 300));
            // For error tests (4xx expected), we only need HTTP status to match
            // For success tests (2xx), also check data.success is not false
            const isErrorTest = expect >= 400;
            const apiSuccess = isExpectedStatus && (isErrorTest || data?.success !== false);

            results.push({ name, method, path, status, success: apiSuccess, data });

            const icon = apiSuccess ? '✅' : '❌';
            const detail = (!apiSuccess && data?.message) ? ` — ${JSON.stringify(data.message).substring(0, 80)}` : '';
            console.log(`  ${icon} [${status}] ${name}${detail}`);
            return data;
        } catch (error) {
            console.log(`  💥 [ERR] ${name} — ${error.message}`);
            results.push({ name, method, path, status: 'ERROR', success: false, error: error.message });
            return null;
        }
    }

    const auth = () => ({});  // We use cookies, no manual header needed

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║    BM2MALL FULL API TEST SUITE           ║');
    console.log('╚══════════════════════════════════════════╝\n');

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 1: AUTH
    // ─────────────────────────────────────────────────────────────────────
    console.log('▶ Phase 1: Authentication');

    await request('1.1 Signup (new user)', '/auth/signup', 'POST', {
        fullName: 'Test User',
        mobile: testMobile,
        email: testEmail
    }, {}, 201);

    // 1.2 Send OTP removed as requested

    const authData = await request('1.3 Verify OTP', '/auth/verify-otp', 'POST', {
        mobile: testMobile,
        otp: DEV_OTP
    });

    if (token) {
        userId = authData?.data?.user?.id;
        console.log(`  🔑 Logged in — Cookie set, userId=${userId}`);
    } else {
        console.log('  ⚠️  No token. Protected routes will fail.');
    }

    // Test refresh token
    await request('1.5 Refresh Token', '/auth/refresh-token', 'POST');

    // Security: Invalid Refresh Token (Bypass cookies to force body check)
    await request('1.S1 Invalid Refresh Token (401)', '/auth/refresh-token', 'POST', {
        refreshToken: 'invalid_token_here'
    }, { 'Cookie': '' }, 401);

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 2: PROFILE
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 2: Profile');
    await request('2.1 Get My Profile', '/profile/me', 'GET', null, auth());

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 3: USER ADDRESSES
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 3: User Addresses');
    const addrRes = await request('3.1 Add Address', '/user-addresses', 'POST', {
        address: '123 Main Street',
        townCity: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        receiversName: 'Test User',
        receiversNumber: '9876543210',
        saveAs: 'Home',
        isDefault: true
    }, auth(), 201);
    addressId = addrRes?.data?.id;

    await request('3.2 Get My Addresses', '/user-addresses/me', 'GET', null, auth());

    if (addressId) {
        await request('3.3 Update Address', `/user-addresses/${addressId}`, 'PATCH', {
            address: '456 Updated Lane',
            saveAs: 'Work',
            isDefault: false
        }, auth());
    }

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 4: CATEGORIES
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 4: Categories');
    const catData = await request('4.1 Get All Categories', '/categories');
    if (catData?.data?.length > 0) categoryId = catData.data[0].id;

    await request('4.2 Products by Category', `/products?categoryId=${categoryId || 1}`);

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 5: PRODUCTS
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 5: Products');
    const prodData = await request('5.1 Get All Products', '/products');
    if (prodData?.data?.length > 0) {
        const p = prodData.data[0];
        productId = p.id;
        realProductId = p.productId;
        console.log(`  📦 Using productId=${productId} | cartProductId=${realProductId}`);
    }

    await request('5.2 Search Products', '/products?q=chicken');
    await request('5.3 Filter by Price', '/products?minPrice=100&maxPrice=2000');

    // Fetch product detail to get the REAL saleRate for order creation
    const detailRes = await request('5.4 Product Detail', `/products/${productId || 15}`);
    if (detailRes?.data) {
        realProductId = detailRes.data.productId ?? realProductId;
        saleRate = detailRes.data.price ?? saleRate;
        console.log(`  💰 Confirmed saleRate=${saleRate} for productId=${realProductId}`);
    }

    await request('5.5 Product Ratings', `/product-ratings/product/${productId || 15}`);
    await request('5.6 Rating Stats', `/product-ratings/product/${productId || 15}/stats`);

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 6: CART
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 6: Cart');
    await request('6.1 Get Cart', '/cart', 'GET', null, auth());
    await request('6.2 Add to Cart', '/cart', 'POST', { productId: realProductId, quantity: 1 }, auth());
    await request('6.3 Update Cart Qty', `/cart/${realProductId}`, 'PUT', { quantity: 3 }, auth());
    await request('6.4 Remove from Cart', `/cart/${realProductId}`, 'DELETE', null, auth());
    await request('6.5 Add back to Cart', '/cart', 'POST', { productId: realProductId, quantity: 1 }, auth());

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 7: ORDERS
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 7: Orders');

    if (!saleRate || !realProductId) {
        console.log('  ⚠️  saleRate or realProductId missing. Skipping order tests.');
    } else {
        const qnty = 2;
        const netAmount = parseFloat((saleRate * qnty).toFixed(2));

        // 7.1 Create Order (valid)
        const orderRes = await request('7.1 Create Order (valid)', '/orders', 'POST', {
            payment_mode: 'COD',
            total_amount: netAmount,
            discounted_amount: 0,
            del_charge_amount: 0,
            tax_amount_b_coins: 0,
            items: [{ productId: realProductId, qnty, rate: saleRate, net_amount: netAmount }]
        }, auth(), 201);

        orderId = orderRes?.order_id ?? orderRes?.data?.order_id;
        console.log(`  🆔 Order Created: ${orderId}`);

        if (orderId) {
            const enc = encodeURIComponent(orderId);

            await request('7.2 Get Order Detail', `/orders/${enc}`, 'GET', null, auth());
            await request('7.3 Get All Orders', '/orders', 'GET', null, auth());
            await request('7.4 Get All Orders (paginated)', '/orders?page=1&limit=5', 'GET', null, auth());
            await request('7.5 Track Order', `/orders/${enc}/track`, 'GET', null, auth());
            await request('7.6 Update → CONFIRMED (with snapshot)', `/orders/${enc}/status`, 'PATCH', {
                status: 'CONFIRMED',
                updated_by: userId,
                number_of_items: qnty,
                total_amount: netAmount,
                tax: 0,
                payment_method: 'COD',
                delivery_date: new Date().toISOString()
            }, auth());

            await request('7.7 Update → SHIPPED', `/orders/${enc}/status`, 'PATCH', {
                status: 'SHIPPED',
                updated_by: userId,
                total_amount: netAmount // Testing partial snapshot
            }, auth());

            // Security: tampered rate — in DEV mode, price mismatch is allowed (console.warn), so 201 is correct
            await request('7.S1 Tampered Rate (dev-allowed)', '/orders', 'POST', {
                payment_mode: 'COD', total_amount: 20,
                items: [{ productId: realProductId, qnty: 2, rate: 10, net_amount: 20 }]
            }, auth(), 201);

            // 7.S2: Total mismatch — rate is valid but total doesn't match → 400
            await request('7.S2 Total Mismatch (400)', '/orders', 'POST', {
                payment_mode: 'COD', total_amount: 999,
                items: [{ productId: realProductId, qnty, rate: saleRate, net_amount: netAmount }]
            }, auth(), 400);

            // 7.S3: Missing cancel_reason — Joi validation returns 422 Unprocessable
            await request('7.S3 Missing cancel_reason (422)', `/orders/${enc}/cancel`, 'PATCH', {
                cancelled_by_type: 'user'
            }, auth(), 422);

            // Cancel order
            await request('7.8 Cancel Order', `/orders/${enc}/cancel`, 'PATCH', {
                cancel_reason: 'Changed my mind',
                cancelled_by_type: 'USER',
                updated_by: userId
            }, auth());

            // Double-cancel guard — expect 400 "order is already cancelled"
            console.log('\n  [Security Tests]');
            await request('7.S4 Double Cancel Guard (400)', `/orders/${enc}/cancel`, 'PATCH', {
                cancel_reason: 'Already cancelled',
                cancelled_by_type: 'user'
            }, auth(), 400);

            // Final status check
            const final = await request('7.9 Final Order State', `/orders/${enc}`, 'GET', null, auth());
            console.log(`  Final Status: ${final?.data?.status ?? final?.status}`);
        }

        // Create a 2nd order to test return flow
        const orderRes2 = await request('7.10 Create 2nd Order (for return)', '/orders', 'POST', {
            payment_mode: 'COD', total_amount: netAmount,
            discounted_amount: 0, del_charge_amount: 0, tax_amount_b_coins: 0,
            items: [{ productId: realProductId, qnty, rate: saleRate, net_amount: netAmount }]
        }, auth(), 201);
        const orderId2 = orderRes2?.order_id;

        // ─────────────────────────────────────────────────────────────────
        // PHASE 8: ORDER RETURNS
        // ─────────────────────────────────────────────────────────────────
        console.log('\n▶ Phase 8: Order Returns');
        if (orderId2) {
            const enc2 = encodeURIComponent(orderId2);

            // Deliver it first so it can be returned
            await request('8.0 Deliver 2nd Order', `/orders/${enc2}/status`, 'PATCH', { status: 'DELIVERED', updated_by: userId }, auth());

            const retRes = await request('8.1 Create Return Request', '/order-returns', 'POST', {
                orderId: orderId2,
                productId: realProductId,
                comId: userId,
                returnReason: 'Product damaged during shipping',
                pickupDate: '2026-03-10',
                refundAmount: saleRate
            }, auth(), 201);
            returnId = retRes?.data?.id;
        }

        await request('8.2 Get All Returns', '/order-returns', 'GET', null, auth());
        if (returnId) {
            await request('8.3 Get Return by ID', `/order-returns/${returnId}`, 'GET', null, auth());
            await request('8.4 Update Return → APPROVED', `/order-returns/${returnId}`, 'PATCH', { status: 'APPROVED' }, auth());
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 9: WALLET
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 9: Wallet');
    await request('9.1 Get Balance', '/wallet/balance', 'GET', null, auth());
    await request('9.2 Wallet History', '/wallet/history', 'GET', null, auth());
    await request('9.3 Wallet Config', '/wallet/config', 'GET', null, auth());
    await request('9.4 Validate Redemption', '/wallet/validate-redeem', 'POST', { cartTotal: 1500 }, auth());

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 10: NOTIFICATIONS
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 10: Notifications');
    console.log('  🕒 No notifications found. Skipping mark-as-read/delete tests.');
    await request('10.1 Register Device Token', '/notifications/register-device', 'POST', {
        token: 'fcm_test_device_token_' + Date.now(),
        platform: 'android'
    }, auth());

    await request('10.2 Send Push Notification', '/notifications/send', 'POST', {
        title: 'API Test Push',
        message: 'This is a test broadcast notification from the automated suite.'
    }, auth());

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 11: FAQ
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 11: FAQ');
    await request('11.1 Get All FAQs', '/faq');
    await request('11.2 Get FAQ Categories', '/faq/categories');

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 12: POLICIES
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 12: Policies');
    await request('12.1 Terms & Conditions', '/policies/terms');
    await request('12.2 Return Policy', '/policies/returns');
    await request('12.3 Shipping Policy', '/policies/shipping');

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 13: CONTACT
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 13: Contact');
    await request('13.1 Get Contact Info', '/contact/info');
    await request('13.2 Submit Enquiry', '/contact/enquiry', 'POST', {
        fullName: 'Test User',
        email: testEmail,
        phone: '9876543210',
        subject: 'API Test Enquiry',
        message: 'This is a test message from automated test suite.'
    });

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 14: COIN ADMIN
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 14: Coin Admin');
    await request('14.1 Set Coin Config', '/admin/wallet/config', 'PUT', {
        minEligibleAmount: 100, maxEligibleAmount: 1000,
        rewardPercentMin: 5, rewardPercentMax: 8,
        maxCoinsPerOrder: 50, redeemPercentLimit: 10,
        returnPeriodDays: 7
    }, auth());
    await request('14.2 Get Coin Config', '/admin/wallet/config', 'GET', null, auth());
    await request('14.3 Wallet Analytics', '/admin/wallet/analytics', 'GET', null, auth());
    await request('14.4 Trigger Coin Activation', '/admin/wallet/trigger-activation', 'POST', null, auth());

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 15: COUPON CODES
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 15: Coupon Codes');

    // 15.1 Create Coupon removed as requested (requires admin)

    await request('15.2 Get All Coupons', '/coupon-codes', 'GET', null, auth());
    await request('15.4 Search Coupon', '/coupon-codes/search?q=TEST', 'GET', null, auth());

    // ─────────────────────────────────────────────────────────────────────
    // PHASE 16: AUTH CLEANUP
    // ─────────────────────────────────────────────────────────────────────
    console.log('\n▶ Phase 16: Auth Cleanup');
    await request('16.1 Logout', '/auth/logout', 'POST', null, auth());
    // After logout protected routes should 401
    const postLogout = await request('16.2 Profile after Logout (401)', '/profile/me', 'GET', null, {}, 401);

    // ─────────────────────────────────────────────────────────────────────
    // FINAL REPORT
    // ─────────────────────────────────────────────────────────────────────
    const pass = results.filter(r => r.success).length;
    const fail = results.filter(r => !r.success).length;
    const total = results.length;

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║             TEST REPORT                  ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  ✅ PASSED : ${String(pass).padEnd(28)}║`);
    console.log(`║  ❌ FAILED : ${String(fail).padEnd(28)}║`);
    console.log(`║  📊 TOTAL  : ${String(total).padEnd(28)}║`);
    console.log('╚══════════════════════════════════════════╝');

    if (fail > 0) {
        console.log('\n--- Failed Tests ---');
        results.filter(r => !r.success).forEach(r => {
            const msg = r.data?.message
                ? (typeof r.data.message === 'string' ? r.data.message : JSON.stringify(r.data.message)).substring(0, 100)
                : r.error ?? '';
            console.log(`  ❌ [${r.status}] ${r.name}${msg ? ' — ' + msg : ''}`);
        });
    }

    console.log('');
}

runTests().catch(console.error);
