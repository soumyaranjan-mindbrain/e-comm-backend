# BM2MALL BACKEND - COMPREHENSIVE API REPORT
**Version:** 1.2.0 | **Updated:** 2026-02-23 | **Environment:** Development

All endpoints are prefixed with `/v1`. Base URL: `http://localhost:3000/v1`

---

## 1. System & Health
Endpoints for monitoring server status.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/health` | Check server health, uptime, and timestamp. | No |

---

## 2. Authentication Module
User lifecycle, login, and session management.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `POST` | `/auth/send-otp` | Trigger login OTP for registered mobile number. | No |
| `POST` | `/auth/verify-otp` | Validate OTP. Returns Session Cookie + JWT. | No |
| `POST` | `/auth/signup` | Register new user. Requires `fullName`, `mobile`, `email`. | No |
| `POST` | `/auth/refresh-token` | Obtain a new Access Token using a Refresh Token. | No |
| `POST` | `/auth/logout` | Invalidate session and clear cookies. | Yes |

---

## 3. Product Catalog (Unified)
Shopping endpoints for browsing and searching products.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/products` | List products with filters (`q`, `minPrice`, `maxPrice`, `rating`, `categoryId`). | No |
| `GET` | `/products/search` | Fast search by name (returns simpler data). | No |
| `GET` | `/products/:id` | Full detail view with variants and related products. | No |
| `GET` | `/product-register` | List product registers (internal/admin data). Supports `?slugs=new-arrivals`. | No |
| `GET` | `/product-register/search` | Search within registers. | No |
| `GET` | `/product-register/:id` | Get raw register details by ID. | No |

---

## 4. Categories
Navigation and structural organization.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/categories` | List all active categories. Supports `?q=` search. | No |
| `GET` | `/categories/:id` | Fetch category detail and description. | No |

---

## 5. Shopping Cart
User-specific cart management (persisted in DB).

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/cart` | Get current user's basket items. | Yes |
| `POST` | `/cart` | Add item to cart or increase quantity. | Yes |
| `PUT` | `/cart/:itemId` | Set absolute quantity for a specific item. | Yes |
| `DELETE` | `/cart/:itemId` | Remove a single item from the cart. | Yes |
| `DELETE` | `/cart/clear/all` | Wipe the entire cart for the user. | Yes |

---

## 6. Order Management
Order lifecycle from placement to cancellation.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `POST` | `/orders` | Place a new order (multi-item transaction). | Yes |
| `GET` | `/orders/:orderId` | View status and details of a specific order. | Yes |
| `GET` | `/orders/:orderId/track` | Get historical status trace (Tracking). | Yes |
| `PATCH` | `/orders/:orderId/status`| Update order status (Admin/Staff only). | Yes |
| `PATCH` | `/orders/:orderId/cancel`| Cancel an order. | Yes |

---

## 7. Account & Profile
Personal data management.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/profile/me` | Fetch detailed summary of own profile. | Yes |
| `PATCH` | `/profile/me` | Update name/email. Supports `profileImage` (File). | Yes |
| `POST` | `/profile/upload-photo`| Direct multipart file upload to Cloudinary. | Yes |

---

## 8. User Address Book
Delivery location management.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/user-addresses/me` | List all saved addresses. | Yes |
| `GET` | `/user-addresses/:id` | Get single address detail. | Yes |
| `POST` | `/user-addresses` | Save a new delivery location. | Yes |
| `PUT` | `/user-addresses/:id` | Edit an existing address record. | Yes |
| `DELETE` | `/user-addresses/:id` | Remove an address record. | Yes |

---

## 9. Product Ratings & Reviews
Customer feedback system.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/product-ratings` | List global ratings. | No |
| `GET` | `/product-ratings/:id` | Get single review detail. | No |
| `GET` | `/product-ratings/product/:productId` | List all reviews for one product. | No |
| `GET` | `/product-ratings/product/:productId/stats`| Get avg rating and count overview. | No |
| `POST` | `/product-ratings` | Submit a new review/rating. | Yes |
| `PUT` | `/product-ratings/:id` | Edit own review. | Yes |
| `DELETE` | `/product-ratings/:id` | Remove review. | Yes |

---

## 10. Coupon Codes & Offers
Discount management.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/coupon-codes` | List public offers. | No |
| `GET` | `/coupon-codes/search` | Search valid codes by name. | No |
| `GET` | `/coupon-codes/:id` | Get specific offer details. | No |
| `POST` | `/coupon-codes` | Create new code (Admin). | Yes |
| `PUT` | `/coupon-codes/:id` | Update code parameters (Admin). | Yes |
| `DELETE` | `/coupon-codes/:id` | Delete coupon code (Admin). | Yes |

---

## 11. Product Media
Raw access to product image registers.

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/product-image-register` | List all images. | No |
| `GET` | `/product-image-register/:id` | Get details of one image record. | No |
| `GET` | `/product-image-register/product/:productId`| List all images belonging to a product. | No |

---

## Technical Summary
- **Response Format:** Custom JSON `{ success: boolean, data: any, count?: number, message?: string, nextCursor?: any }`
- **Security:** CSRF Protection + JWT Bearer + Session Cookies.
- **Middleware:** `authenticateUser` (Header/Cookie), `validateRequest` (Joi Body/Query), `upload` (Multer).
- **Pagination:** Most listing endpoints support `?limit=N` and `?cursor=ID`.
