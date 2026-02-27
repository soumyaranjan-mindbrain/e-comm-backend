
const BASE_URL = 'http://localhost:3000/v1';
const DEV_OTP = '111111';

async function runTests() {
    const results = [];
    let token = '';
    let refreshToken = '';
    let userId = null;
    let productId = null;
    let realProductId = null; // The one for cart
    let orderId = null;
    let categoryId = null;

    const testMobile = `9${Math.floor(Math.random() * 900000000 + 100000000)}`;
    const testEmail = `test_${Math.floor(Math.random() * 10000)}@example.com`;

    async function request(name, path, method = 'GET', body = null, headers = {}) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${BASE_URL}${path}`, options);
            const data = await response.json();
            const status = response.status;

            // Extract tokens from cookies if present
            const setCookie = response.headers.get('set-cookie');
            if (setCookie) {
                const accessMatch = setCookie.match(/accessToken=([^;]+)/);
                if (accessMatch) token = accessMatch[1];

                const refreshMatch = setCookie.match(/refreshToken=([^;]+)/);
                if (refreshMatch) refreshToken = refreshMatch[1];
            }

            const success = status >= 200 && status < 300 && data.success !== false;
            results.push({ name, method, path, status, success, data });

            if (!success) {
                console.log(`  ❌ ${name} - Failed (Status ${status})`);
            } else {
                console.log(`  ✅ ${name} - Success`);
            }
            return data;
        } catch (error) {
            console.log(`  💥 ${name} - Error: ${error.message}`);
            results.push({ name, method, path, status: 'ERROR', success: false, error: error.message });
            return null;
        }
    }

    console.log('\n--- STARTING BM2MALL API TESTS ---\n');

    // 1. AUTH
    console.log('[Phase 1: Auth]');
    await request('Signup', '/auth/signup', 'POST', {
        fullName: 'Test User',
        mobile: testMobile,
        email: testEmail
    });

    await new Promise(r => setTimeout(r, 500));

    await request('Send OTP', '/auth/send-otp', 'POST', {
        mobile: testMobile
    });

    const authData = await request('Verify OTP', '/auth/verify-otp', 'POST', {
        mobile: testMobile,
        otp: DEV_OTP
    });

    if (token) {
        userId = authData?.data?.user?.id;
        console.log(`  (Token obtained from cookies, user ID: ${userId})`);
    } else {
        console.log('  ⚠️ WARNING: Token not obtained. Skipping protected routes.');
    }

    const getAuthHeader = () => token ? { 'Authorization': `Bearer ${token}` } : {};

    // 2. USER ADDRESSES
    let addressId = null;
    if (token) {
        console.log('\n[Phase 2: User Addresses]');
        const createAddr = await request('Add Address', '/user-addresses', 'POST', {
            address: "123 Main Street",
            townCity: "Bangalore",
            state: "Karnataka",
            pincode: "560001",
            receiversName: "Test User",
            receiversNumber: "9876543210",
            saveAs: "Home",
            isDefault: true
        }, getAuthHeader());

        if (createAddr && createAddr.data) {
            addressId = createAddr.data.id;
        }

        await request('Get My Addresses', '/user-addresses/me', 'GET', null, getAuthHeader());

        if (addressId) {
            await request('Update Address', `/user-addresses/${addressId}`, 'PATCH', {
                address: "456 Updated Lane",
                saveAs: "Work"
            }, getAuthHeader());
        }
    }

    // 3. CATEGORIES
    console.log('\n[Phase 3: Categories]');
    const catData = await request('Get Categories', '/categories');
    if (catData && catData.data && Array.isArray(catData.data) && catData.data.length > 0) {
        categoryId = catData.data[0].id;
    }

    // 4. PRODUCTS
    console.log('\n[Phase 4: Products]');
    const prodData = await request('Get All Products', '/products');
    if (prodData && prodData.data && Array.isArray(prodData.data) && prodData.data.length > 0) {
        const product = prodData.data[0];
        productId = product.id;
        realProductId = product.productId;
        console.log(`  (Using Product ID: ${productId}, Cart Product ID: ${realProductId})`);
    }

    // 6. ORDERS
    if (token && realProductId) {
        console.log('\n[Phase 6: Orders]');
        const orderResponse = await request('Create Order', '/orders', 'POST', {
            payment_mode: 'COD',
            total_amount: 1500,
            items: [{ productId: realProductId, qnty: 2, rate: 750, net_amount: 1500 }]
        }, getAuthHeader());

        if (orderResponse && orderResponse.data) {
            orderId = orderResponse.data.order_id;
        }
    }

    if (token && orderId) {
        const encodedOrderId = encodeURIComponent(orderId);

        console.log(`\n--- VERIFYING STATUS UPDATE FOR ORDER ${orderId} ---`);

        // Initial Status
        const iDetail = await request('Initial Detail', `/orders/${encodedOrderId}`, 'GET', null, getAuthHeader());
        console.log(`  Initial Master Status: ${iDetail?.data?.status}`);

        // Update Status
        await request('Update Status to SHIPPED', `/orders/${encodedOrderId}/status`, 'PATCH', { status: 'SHIPPED', updated_by: userId }, getAuthHeader());

        // Verify Status
        const vDetail = await request('Verify Detail', `/orders/${encodedOrderId}`, 'GET', null, getAuthHeader());
        console.log(`  Verified Master Status: ${vDetail?.data?.status}`);

        if (vDetail?.data?.status === 'SHIPPED') {
            console.log('  🎉 SUCCESS: Master status updated correctly!');
        } else {
            console.log('  ❌ FAILURE: Master status did not update.');
        }

        await request('Cancel Order', `/orders/${encodedOrderId}/cancel`, 'PATCH', { updated_by: userId }, getAuthHeader());
        const cDetail = await request('Final Detail', `/orders/${encodedOrderId}`, 'GET', null, getAuthHeader());
        console.log(`  Final Master Status: ${cDetail?.data?.status}`);
    }

    console.log('\n--- API TESTS COMPLETED ---\n');
}

runTests();
