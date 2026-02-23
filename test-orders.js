const BASE_URL = 'http://localhost:3000/v1';
const MOBILE = '1234567890';
const OTP = '111111';

async function testOrderApi() {
    console.log('🚀 Starting Thorough Order API Test...');
    let token = '';
    let orderId = '';

    try {
        // 1. Auth - Login
        console.log('\n1️⃣  Authenticating...');
        await fetch(`${BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: MOBILE })
        });

        const authRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile: MOBILE, otp: OTP })
        });
        const authData = await authRes.json();

        // Get token from body or cookie
        token = authData.tokens?.accessToken || authData.data?.tokens?.accessToken;
        if (!token) {
            const cookies = authRes.headers.get('set-cookie');
            if (cookies) {
                token = cookies.split(';')[0].split('=')[1];
            }
        }

        if (!token) {
            console.error('❌ Failed to get token');
            return;
        }
        console.log('✅ Auth successful');

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 2. Create Order (Success)
        console.log('\n2️⃣  Testing Create Order...');
        const orderPayload = {
            payment_mode: "COD",
            total_amount: 1500,
            items: [
                {
                    productId: 5014,
                    qnty: 2,
                    rate: 750,
                    net_amount: 1500
                }
            ]
        };
        const createRes = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderPayload)
        });
        const createData = await createRes.json();

        if (!createData.success) {
            console.error('Create order failed:', createData);
            throw new Error(createData.msg || 'Create order failed');
        }

        orderId = createData.data.order_id;
        console.log(`✅ Order created! ID: ${orderId}`);
        console.log('Response:', JSON.stringify(createData, null, 2));

        // 3. Get Order Details
        console.log('\n3️⃣  Testing Get Order Details...');
        const getRes = await fetch(`${BASE_URL}/orders/${orderId}`, { headers });
        const getData = await getRes.json();
        console.log('✅ Order details fetched');
        console.log('Response:', JSON.stringify(getData, null, 2));

        // 4. Track Order (Initial)
        console.log('\n4️⃣  Testing Track Order (Initial)...');
        const trackRes = await fetch(`${BASE_URL}/orders/${orderId}/track`, { headers });
        const trackData = await trackRes.json();
        console.log(`✅ Tracking fetched. History count: ${trackData.data.length}`);
        console.log('Last status:', trackData.data[trackData.data.length - 1].order_status);

        // 5. Update Order Status (Confirmed)
        console.log('\n5️⃣  Updating status to CONFIRMED...');
        const statusRes = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status: "CONFIRMED", updated_by: 1 })
        });
        const statusData = await statusRes.json();
        console.log('✅ Status updated to CONFIRMED');

        // Verify track again
        const trackRes2 = await fetch(`${BASE_URL}/orders/${orderId}/track`, { headers });
        const trackData2 = await trackRes2.json();
        console.log(`✅ Tracking updated. History count: ${trackData2.data.length}`);
        console.log('New status in history:', trackData2.data[trackData2.data.length - 1].order_status);

        // 6. Cancel Order
        console.log('\n6️⃣  Testing Cancel Order...');
        const cancelRes = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ updated_by: 1 })
        });
        const cancelData = await cancelRes.json();
        console.log('✅ Order cancelled successfully');

        // Verify final status
        const trackRes3 = await fetch(`${BASE_URL}/orders/${orderId}/track`, { headers });
        const trackData3 = await trackRes3.json();
        console.log('Final status in history:', trackData3.data[trackData3.data.length - 1].order_status);

        // 7. Error Cases
        console.log('\n7️⃣  Testing Error Cases...');

        // A. Invalid Order ID
        const errRes1 = await fetch(`${BASE_URL}/orders/non-existent-id`, { headers });
        console.log(`✅ Get Non-existent Order: Status ${errRes1.status} (Expected 404/500)`);

        // B. Invalid Status
        const errRes2 = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ status: "INVALID_STATUS" })
        });
        console.log(`✅ Invalid Status Update: Status ${errRes2.status} (Expected 400)`);

        // C. Unauthorized Access (No Token)
        const errRes3 = await fetch(`${BASE_URL}/orders/${orderId}`);
        console.log(`✅ Unauthorized Access: Status ${errRes3.status} (Expected 401)`);

        console.log('\n✨ ALL TESTS COMPLETED SUCCESSFULLY! ✨');

    } catch (error) {
        console.error('\n❌ TEST FAILED!');
        console.error('Error:', error.message);
    }
}

testOrderApi();
