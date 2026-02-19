# BM2MALL BACKEND - PROFESSIONAL API REFERENCE
**Version:** 1.1.0 | **Updated:** 2026-02-19 | **Environment:** Development

---

## 1. Authentication
Endpoints for user lifecycle and session management.

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/v1/auth/signup` | Register new user. Requires `fullName`, `mobile`, `email`. |
| `POST` | `/v1/auth/send-otp` | Trigger login OTP for registered mobile. |
| `POST` | `/v1/auth/verify-otp` | Validate OTP. Returns Session Cookie + JWT. |
| `POST` | `/v1/auth/logout` | Invalidate session. |

---

## 2. Product Catalog (Enhanced)
Core shopping endpoints with support for variants and stock state.

### `GET` /v1/products
Fetched product listing with global filters.
- **`q`**: Fuzzy name search.
- **`categoryId`**: Filter by Category ID.
- **`minPrice` / `maxPrice`**: Numeric range filters.
- **`slugs`**: Collections (e.g., `new-arrivals`).
- **`limit` / `cursor`**: Pagination parameters.

### `GET` /v1/products/:id
**Full Details View.** Returns deep product data including:
- **`variants`**: Array of sizes, colors, individual pricing, and SKUs.
- **`inStock`**: Boolean flag calculated from live inventory.
- **`relatedProducts`**: Recommendation array based on current category.

---

## 3. Categories
Navigation and organization data.

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/v1/categories` | List all active categories. Supports `?q=` search. |
| `GET` | `/v1/categories/:id` | Fetch category detail and description. |

---

## 4. Account & Profile (Protected)
Requires `Authorization: Bearer <token>` or Session Cookie.

### Profile Management
- `GET /v1/profile/me`: Current user data summary.
- `PATCH /v1/profile/me`: Update name, email, or profile URL.
- `POST /v1/profile/upload-photo`: Multipart upload for profile images.

### Address Book
- `GET /v1/user-addresses/me`: List all saved locations.
- `POST /v1/user-addresses`: Create new address entry.
- `PUT /v1/user-addresses/:id`: Edit existing record.
- `DELETE /v1/user-addresses/:id`: Remove record.

---

## 5. Reviews & Marketing
Engagement and discount systems.

### Product Ratings
- `GET /v1/product-ratings/product/:id`: Fetch user reviews for a specific item.
- `POST /v1/product-ratings`: Submit review (Rating 1-5 + Message).

### Coupon Codes
- `GET /v1/coupon-codes`: Available public offers.
- `GET /v1/coupon-codes/search?name=X`: Validate specific code.

---

## Technical Summary
- **Base URL:** `http://localhost:3000/v1`
- **Response Format:** Custom JSON `{ success: boolean, data: any, message?: string }`
- **Security:** CSRF Protection + JWT Bearer + Session Cookies.
- **Errors:** 
  - `400`: Validation / Bad Request
  - `401`: Unauthorized
  - `404`: Resource Not Found
  - `500`: System Exception
