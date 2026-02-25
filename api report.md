# BM2MALL API Report

Base URL: `http://localhost:3000/v1`

---

## Important Notes

- In dev mode, OTP is always `111111` — no SMS is sent
- After verify OTP, you get a `token` in the response body — use that as `Bearer token` in all protected routes
- Cart is a bit tricky — `productId` in cart is NOT the same as `id` in product list. When you open a product detail, there are two IDs:
  - `data.id` → e.g. `15` — this is used in product URLs like `/products/15`
  - `data.productId` → e.g. `5014` — this is what goes into the cart
- Tokens expire in 15 minutes. Use the refresh token to get a new one.

---

## Auth

### Register

```
POST /v1/auth/signup
```

No auth needed.

```json
{
  "fullName": "Test User",
  "mobile": "9876543210",
  "email": "test@example.com"
}
```

Success response:

```json
{
  "success": true,
  "msg": "signup successful",
  "data": null
}
```

If the mobile is already taken:

```json
{
  "success": false,
  "msg": "mobile number already registered."
}
```

---

### Login — Send OTP

```
POST /v1/auth/send-otp
```

```json
{
  "mobile": "9876543210"
}
```

Success:

```json
{
  "success": true,
  "msg": "otp sent successfully",
  "data": null
}
```

If mobile not registered:

```json
{
  "success": false,
  "msg": "mobile number not registered. please signup first."
}
```

If you already got an OTP in the last 60 seconds:

```json
{
  "success": false,
  "msg": "please wait 60 seconds before requesting a new otp."
}
```

---

### Verify OTP

```
POST /v1/auth/verify-otp
```

In dev, OTP is always `111111`.

```json
{
  "mobile": "9876543210",
  "otp": "111111"
}
```

Success — copy the `token` from here:

```json
{
  "success": true,
  "msg": "otp verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 15,
      "mobile": "9876543210",
      "name": "Test User"
    }
  }
}
```

Wrong OTP:

```json
{
  "success": false,
  "msg": "invalid otp"
}
```

OTP expired:

```json
{
  "success": false,
  "msg": "otp has expired"
}
```

---

### Logout

```
POST /v1/auth/logout
Authorization: Bearer <token>
```

No body needed.

```json
{
  "success": true,
  "msg": "logged out successfully",
  "data": null
}
```

---

## Profile

### Get My Profile

```
GET /v1/profile/me
Authorization: Bearer <token>
```

```json
{
  "success": true,
  "data": {
    "id": 15,
    "fullName": "Test User",
    "mobile": "9876543210",
    "email": "test@example.com",
    "profileImage": null
  }
}
```

---

### Update Profile

```
PATCH /v1/profile/me
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Fields (all optional):

- `fullName`
- `email`
- `profileImage` (file)

For the profile image, use Postman or Thunder Client — can't easily test file uploads in .http files.

```json
{
  "success": true,
  "data": {
    "id": 15,
    "fullName": "John Updated",
    "email": "john.updated@example.com"
  }
}
```

---

## Categories

### Get All Categories

```
GET /v1/categories
```

No auth. No params.

```json
{
  "success": true,
  "count": 5,
  "data": [
    { "id": 1, "catName": "Electronics", "slugs": "electronics" },
    { "id": 2, "catName": "Fashion", "slugs": "fashion" },
    { "id": 3, "catName": "Grocery", "slugs": "grocery" }
  ],
  "nextCursor": null
}
```

---

### Products by Category

Pass the category `id` as a query param:

```
GET /v1/products?categoryId=1
```

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 15,
      "productId": 5014,
      "productName": "Tasty Bronze Chicken",
      "price": 969.88,
      "mrp": 1212.35,
      "inStock": true
    }
  ],
  "nextCursor": null
}
```

---

## Products

### Product List

```
GET /v1/products
```

No auth needed. Supports these query params:

| param | what it does |
|---|---|
| `q` | search by product name |
| `minPrice` | filter by min price |
| `maxPrice` | filter by max price |
| `rating` | filter by min rating (1–5) |
| `categoryId` | filter by category |
| `limit` | items per page |
| `cursor` | for pagination (pass nextCursor from last response) |

Basic call with no filters:

```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": 15,
      "productId": 5014,
      "productName": "Tasty Bronze Chicken",
      "price": 969.88,
      "mrp": 1212.35,
      "inStock": true,
      "images": [
        { "id": 15, "proimgs": "https://images.unsplash.com/photo-1771995?q=80&w=500" }
      ]
    }
  ],
  "nextCursor": null
}
```

---

### Product Detail

```
GET /v1/products/15
```

Replace `15` with the `id` from the product list.

```json
{
  "success": true,
  "data": {
    "id": 15,
    "productId": 5014,
    "productName": "Tasty Bronze Chicken",
    "price": 969.88,
    "mrp": 1212.35,
    "totalStock": 100,
    "inStock": true,
    "shdesc": "The Extended context-sensitive analyzer...",
    "images": [
      { "id": 15, "proimgs": "https://images.unsplash.com/photo-1771995?q=80&w=500" }
    ],
    "variants": [
      { "id": 15, "price": 969.88, "mrp": 1212.35, "curQty": 100, "inStock": true }
    ]
  },
  "relatedProducts": [...]
}
```

**Note:** `data.productId` (5014 here) is what you use when adding to cart. Not `data.id` (15).

If you pass a non-numeric ID like `/products/abc`:

```json
{
  "success": false,
  "message": "Invalid product ID"
}
```

---

### Product Ratings

Get all ratings for a product:

```
GET /v1/product-ratings/product/15
```

Replace `15` with the product `id`.

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "givenRatings": 5,
      "message": "Really good product, happy with the purchase.",
      "createdBy": 15
    }
  ],
  "nextCursor": null
}
```

Get rating summary/stats:

```
GET /v1/product-ratings/product/15/stats
```

```json
{
  "success": true,
  "data": {
    "average": 4.5,
    "total": 10
  }
}
```

---

## Cart

All cart routes need `Authorization: Bearer <token>`.

**Quick reminder on productId:**
When you open `/products/15`, the response has:
- `data.id = 15` → used in product URLs
- `data.productId = 5014` → used in cart

Always use `5014` (or whatever your product's `productId` is) in cart.

---

### Get Cart

```
GET /v1/cart
Authorization: Bearer <token>
```

```json
{
  "success": true,
  "count": 1,
  "data": {
    "items": [
      {
        "cartId": 1,
        "productId": 5014,
        "productName": "Tasty Bronze Chicken",
        "productImage": null,
        "quantity": 1,
        "price": 969.88,
        "itemTotal": 969.88
      }
    ],
    "grandTotal": 969.88
  }
}
```

Empty cart:

```json
{
  "success": true,
  "count": 0,
  "data": { "items": [], "grandTotal": 0 }
}
```

---

### Add to Cart

```
POST /v1/cart
Authorization: Bearer <token>
```

```json
{
  "productId": 5014,
  "quantity": 1
}
```

`productId` = `data.productId` from product detail. Not `data.id`.

```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cartId": 1,
    "ItemId": 5014,
    "comId": 15,
    "quantity": 1,
    "isDeleted": false
  }
}
```

If you send the wrong productId (one that doesn't exist in DB):

```json
{
  "success": false,
  "message": "Foreign key constraint violated: product_id"
}
```

---

### Update Cart

Change quantity of a cart item.

```
PUT /v1/cart/5014
Authorization: Bearer <token>
```

Replace `5014` in the URL with the `productId` of the item in your cart.

```json
{
  "quantity": 3
}
```

```json
{
  "success": true,
  "message": "Cart quantity updated successfully",
  "data": {
    "cartId": 1,
    "ItemId": 5014,
    "quantity": 3
  }
}
```

If item not in cart:

```json
{
  "success": false,
  "message": "Cart item not found"
}
```

---

### Remove from Cart

Remove a single item.

```
DELETE /v1/cart/5014
Authorization: Bearer <token>
```

Replace `5014` with the `productId` of the item to remove. No body needed.

```json
{
  "success": true,
  "message": "Item removed from cart successfully"
}
```

---

### Clear Cart

Remove everything from cart.

```
DELETE /v1/cart/clear/all
Authorization: Bearer <token>
```

No body needed.

---

## Orders

All order routes need `Authorization: Bearer <token>`.

### Create Order

```
POST /v1/orders
Authorization: Bearer <token>
```

```json
{
  "payment_mode": "COD",
  "total_amount": 1500,
  "items": [
    {
      "productId": 5014,
      "qnty": 2,
      "rate": 750,
      "net_amount": 1500
    }
  ]
}
```

Success response:

```json
{
  "success": true,
  "msg": "order placed successfully",
  "data": {
    "message": "Order Created Successfully",
    "order_id": "e73b7504-5507-4d30-a38a-ae9faf3d74de",
    "order": {
      "id": 2,
      "order_id": "e73b7504-5507-4d30-a38a-ae9faf3d74de",
      "comId": 100,
      "total_amount": "1500",
      ...
    }
  }
}
```

---

### Track Order (Status History)

```
GET /v1/orders/e73b7504-5507-4d30-a38a-ae9faf3d74de/track
Authorization: Bearer <token>
```

Success:

```json
{
  "success": true,
  "msg": "order tracking history fetched",
  "data": [
    {
      "order_id": "e73b7504-5507-4d30-a38a-ae9faf3d74de",
      "order_status": "PENDING",
      "created_at": "2026-02-23T12:23:50.000Z"
    },
    {
      "order_id": "e73b7504-5507-4d30-a38a-ae9faf3d74de",
      "order_status": "CONFIRMED",
      "created_at": "2026-02-23T12:24:05.000Z"
    }
  ]
}
```

---

### Get Order Details

```
GET /v1/orders/e73b7504-5507-4d30-a38a-ae9faf3d74de
Authorization: Bearer <token>
```

Success includes items and current status:

```json
{
  "success": true,
  "msg": "order fetched successfully",
  "data": {
    "order_id": "e73b7504-5507-4d30-a38a-ae9faf3d74de",
    "total_amount": "1500",
    "payment_mode": "COD",
    "orderDetails": [...],
    "orderStatus": [...]
  }
}
```

---

### Cancel Order

```
PATCH /v1/orders/e73b7504-5507-4d30-a38a-ae9faf3d74de/cancel
Authorization: Bearer <token>
```

Success:

```json
{
  "success": true,
  "msg": "order cancelled successfully",
  "data": { ... }
}
```

---

## Order Returns

All return routes need `Authorization: Bearer <token>`.

### Create Return Request

```
POST /v1/order-returns
Authorization: Bearer <token>
```

```json
{
  "orderId": "e73b7504-5507-4d30-a38a-ae9faf3d74de",
  "productId": 5014,
  "comId": 15,
  "returnReason": "Product damaged during shipping",
  "pickupDate": "2026-03-01",
  "refundAmount": 750
}
```

Success response:

```json
{
  "success": true,
  "message": "Return request created",
  "data": {
    "id": 1,
    "orderId": "e73b7504-5507-4d30-a38a-ae9faf3d74de",
    "productId": 5014,
    "status": "PENDING",
    ...
  }
}
```

---

### Get All Returns

```
GET /v1/order-returns
Authorization: Bearer <token>
```

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "orderId": "e73b7504-5507-4d30-a38a-ae9faf3d74de",
      "status": "PENDING",
      ...
    }
  ]
}
```

---

### Get Return by ID

```
GET /v1/order-returns/1
Authorization: Bearer <token>
```

---

### Update Return Status (Admin)

```
PATCH /v1/order-returns/1
Authorization: Bearer <token>
```

```json
{
  "status": "APPROVED"
}
```

Valid statuses: `APPROVED`, `REJECTED`.
