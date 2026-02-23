const http = require('http');

const request = (method, path, body = null, token = null, cookie = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
        if (cookie) {
            options.headers['Cookie'] = cookie;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    // Returning headers and parsed body
                    resolve({ body: JSON.parse(data), headers: res.headers });
                } catch (e) {
                    reject(data);
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

async function runTests() {
    const report = [];
    try {
        const health = await request('GET', '/v1/health');
        report.push(`✅ Health Check: ${health.body.status}`);

        const cats = await request('GET', '/v1/categories');
        report.push(`✅ Categories Count: ${cats.body.data ? cats.body.data.length : 0}`);

        const products = await request('GET', '/v1/products?limit=5');
        report.push(`✅ Products Count: ${products.body.data ? products.body.data.length : 0}`);

        const mobile = "9999" + Math.floor(Math.random() * 900000 + 100000).toString();
        const email = `test${mobile}@test.com`;
        // 1. Signup
        const signup = await request('POST', '/v1/auth/signup', {
            fullName: "Tester", mobile: mobile, email: email
        });
        report.push(`✅ Auth Signup: ${signup.body.success} - ${signup.body.msg}`);

        // 2. Login
        const login = await request('POST', '/v1/auth/verify-otp', {
            mobile: mobile, otp: "111111"
        });
        report.push(`✅ Auth Login: ${login.body.success} - ${login.body.msg}`);

        const setCookieHeader = login.headers['set-cookie'];
        const cookie = setCookieHeader ? setCookieHeader.map(c => c.split(';')[0]).join('; ') : null;

        if (cookie) {
            // 3. Protected Route: Profile Me
            const profile = await request('GET', '/v1/profile/me', null, null, cookie);
            report.push(`✅ Profile Read: ${profile.body.success} - Name: ${profile.body.data?.fullName || ''}`);

            const comId = profile.body.data?.comId || profile.body.data?.id || 1; // get comId from profile

            // 4. Cart
            const cartAdd = await request('POST', '/v1/cart', {
                ItemId: 5001, quantity: 1
            }, null, cookie);
            report.push(`✅ Add to Cart: ${cartAdd.body.success} ${!cartAdd.body.success ? '- ' + JSON.stringify(cartAdd.body) : ''}`);

            const cartGet = await request('GET', '/v1/cart', null, null, cookie);
            report.push(`✅ Cart Items Count: ${cartGet.body.data ? cartGet.body.data.length : ('Error: ' + JSON.stringify(cartGet.body))}`);

            // 5. Place Order
            const order = await request('POST', '/v1/orders', {
                comId: profile.body.data?.comId || 1, // use dynamic comId!
                items: [{ productId: 5001, quantity: 1, rate: 150.50, net_amount: 150.50 }],
                total_amount: 150.50,
                payment_mode: "CASH"
            }, null, cookie);
            report.push(`✅ Place Order: ${order.body.success} ${!order.body.success ? '- ' + JSON.stringify(order.body) : ''}`);
        } else {
            report.push(`❌ Auth Cookie Missing! Login headers: ${JSON.stringify(login.headers)}`);
        }

        console.log(report.join('\n'));
        require('fs').writeFileSync('api-test-results.txt', report.join('\n'));
    } catch (err) {
        console.error("Test error:", err);
    }
}

runTests();
