
const BASE_URL = "http://localhost:3000/v1";

async function runTests() {
    console.log("=".repeat(50));
    console.log("BM2MALL API TEST SUITE");
    console.log("=".repeat(50) + "\n");

    // ─────────────────────────────────────────────
    // 1. AUTH
    // ─────────────────────────────────────────────
    console.log("─── 1. AUTHENTICATION ───");

    let res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: "9875654235" }),
    });
    let body = await res.json();
    console.log(`  [${res.status}] Send OTP:`, body.success ? "✓ SUCCESS" : "✗ FAILED", "-", body.msg || body.message);

    res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: "9875654235", otp: "111111" }),
    });
    body = await res.json();
    console.log(`  [${res.status}] Verify OTP:`, body.success ? "✓ SUCCESS" : "✗ FAILED", "-", body.msg || body.message);

    if (!body.success) { console.error("\n  FATAL: Auth failed. Stopping tests."); return; }

    const token = body.data?.token;
    const userId = body.data?.user?.id;
    const authHeaders = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
    console.log(`  User ID: ${userId}, Token acquired: ${token ? "✓ Yes" : "✗ No"}`);

    // Test Logout (we will re-login after)
    res = await fetch(`${BASE_URL}/auth/logout`, { method: "POST", headers: authHeaders });
    body = await res.json();
    console.log(`  [${res.status}] Logout:`, body.success ? "✓ SUCCESS" : "✗ FAILED", "-", body.msg || body.message);

    // Re-login for rest of tests
    await fetch(`${BASE_URL}/auth/send-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: "9875654235" }) });
    res = await fetch(`${BASE_URL}/auth/verify-otp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: "9875654235", otp: "111111" }) });
    body = await res.json();
    const finalToken = body.data?.token;
    const finalAuthHeaders = { "Content-Type": "application/json", "Authorization": `Bearer ${finalToken}` };

    // ─────────────────────────────────────────────
    // 2. CATEGORIES
    // ─────────────────────────────────────────────
    console.log("\n─── 2. CATEGORIES ───");

    res = await fetch(`${BASE_URL}/categories`);
    body = await res.json();
    console.log(`  [${res.status}] Get All Categories:`, body.success ? "✓ SUCCESS" : "✗ FAILED", `- Count: ${body.count}`);
    const firstCategory = body.data?.[0];

    if (firstCategory) {
        res = await fetch(`${BASE_URL}/categories/${firstCategory.id}`);
        body = await res.json();
        console.log(`  [${res.status}] Get Category by ID (${firstCategory.id}):`, body.success ? "✓ SUCCESS" : "✗ FAILED");

        res = await fetch(`${BASE_URL}/products?categoryId=${firstCategory.id}`);
        body = await res.json();
        console.log(`  [${res.status}] Products by Category (${firstCategory.id}):`, body.success ? "✓ SUCCESS" : "✗ FAILED", `- Count: ${body.count}`);
    }

    // ─────────────────────────────────────────────
    // 3. PRODUCTS
    // ─────────────────────────────────────────────
    console.log("\n─── 3. PRODUCTS ───");

    res = await fetch(`${BASE_URL}/products`);
    body = await res.json();
    console.log(`  [${res.status}] Product List:`, body.success ? "✓ SUCCESS" : "✗ FAILED", `- Count: ${body.count}`);
    const firstProduct = body.data?.[0];

    res = await fetch(`${BASE_URL}/products?q=chicken`);
    body = await res.json();
    console.log(`  [${res.status}] Product Search (q=chicken):`, body.success ? "✓ SUCCESS" : "✗ FAILED", `- Count: ${body.count}`);

    res = await fetch(`${BASE_URL}/products?minPrice=100&maxPrice=2000`);
    body = await res.json();
    console.log(`  [${res.status}] Product Filter (price 100-2000):`, body.success ? "✓ SUCCESS" : "✗ FAILED", `- Count: ${body.count}`);

    if (firstProduct) {
        res = await fetch(`${BASE_URL}/products/${firstProduct.id}`);
        body = await res.json();
        console.log(`  [${res.status}] Product Detail (id=${firstProduct.id}):`, body.success ? "✓ SUCCESS" : "✗ FAILED");
        // NOTE: body.data.productId is the cart-level ID
        var cartProductId = body.data?.productId;
        var productRegisterId = firstProduct.id;
        console.log(`         → productId for cart: ${cartProductId}`);
    }

    // Invalid ID check
    res = await fetch(`${BASE_URL}/products/INVALID`);
    body = await res.json();
    console.log(`  [${res.status}] Product Detail (INVALID id):`, body.success === false ? "✓ Properly caught (400)" : "✗ FAILED");

    // ─────────────────────────────────────────────
    // 4. PRODUCT RATINGS
    // ─────────────────────────────────────────────
    console.log("\n─── 4. PRODUCT RATINGS ───");

    if (productRegisterId) {
        res = await fetch(`${BASE_URL}/product-ratings/product/${productRegisterId}`);
        body = await res.json();
        console.log(`  [${res.status}] Get Ratings by Product (${productRegisterId}):`, body.success ? "✓ SUCCESS" : "✗ FAILED", `- Count: ${body.count}`);

        res = await fetch(`${BASE_URL}/product-ratings/product/${productRegisterId}/stats`);
        body = await res.json();
        console.log(`  [${res.status}] Get Rating Stats (${productRegisterId}):`, body.success ? "✓ SUCCESS" : "✗ FAILED");
    }

    // ─────────────────────────────────────────────
    // 5. CART
    // ─────────────────────────────────────────────
    console.log("\n─── 5. CART ───");

    // First clear to start fresh
    await fetch(`${BASE_URL}/cart/clear/all`, { method: "DELETE", headers: finalAuthHeaders });

    res = await fetch(`${BASE_URL}/cart`, { headers: finalAuthHeaders });
    body = await res.json();
    console.log(`  [${res.status}] Get Cart:`, body.success ? "✓ SUCCESS" : "✗ FAILED", `- Items: ${body.count}`);

    if (cartProductId) {
        // Add to cart — uses product_id (productId field from ProductRegister)
        res = await fetch(`${BASE_URL}/cart`, {
            method: "POST",
            headers: finalAuthHeaders,
            body: JSON.stringify({ productId: cartProductId, quantity: 1 })
        });
        body = await res.json();
        console.log(`  [${res.status}] Add To Cart (productId=${cartProductId}):`, body.success ? "✓ SUCCESS" : "✗ FAILED", body.success ? "" : body.message);

        // Get cart to find itemId
        res = await fetch(`${BASE_URL}/cart`, { headers: finalAuthHeaders });
        let cartData = await res.json();
        const cartItemId = cartData.data?.items?.[0]?.productId;
        console.log(`  [${res.status}] Get Cart After Add:`, cartData.success ? "✓ SUCCESS" : "✗ FAILED", `- Items: ${cartData.count}`);

        if (cartItemId) {
            // Update cart
            res = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
                method: "PUT",
                headers: finalAuthHeaders,
                body: JSON.stringify({ quantity: 3 })
            });
            body = await res.json();
            console.log(`  [${res.status}] Update Cart Qty (itemId=${cartItemId}):`, body.success ? "✓ SUCCESS" : "✗ FAILED");

            // Remove single item
            res = await fetch(`${BASE_URL}/cart/${cartItemId}`, { method: "DELETE", headers: finalAuthHeaders });
            body = await res.json();
            console.log(`  [${res.status}] Remove Cart Item (itemId=${cartItemId}):`, body.success ? "✓ SUCCESS" : "✗ FAILED");
        } else {
            console.log("  ⚠ Could not get cartItemId from cart response to test update/remove");
        }
    } else {
        console.log("  ⚠ Skipping cart add: cartProductId not found from product detail");
    }

    // Add again and clear all
    if (cartProductId) {
        await fetch(`${BASE_URL}/cart`, { method: "POST", headers: finalAuthHeaders, body: JSON.stringify({ productId: cartProductId, quantity: 2 }) });
    }
    res = await fetch(`${BASE_URL}/cart/clear/all`, { method: "DELETE", headers: finalAuthHeaders });
    body = await res.json();
    console.log(`  [${res.status}] Clear All Cart:`, body.success ? "✓ SUCCESS" : "✗ FAILED");

    console.log("\n" + "=".repeat(50));
    console.log("TESTS COMPLETE");
    console.log("=".repeat(50));
}

runTests().catch(console.error);
