# 📋 BM2MALL Backend - API Test Report

## 1. Executive Summary
This report documents the end-to-end (E2E) verification of the BM2MALL E-commerce backend. The testing was performed against the Dockerized environment to ensure database integrity, API responsiveness, and authentication security.

**Overall Status:** ✅ **STABLE**
- **Public APIs:** 100% Operational
- **Authenticated APIs:** Verified via fresh token generation
- **Database:** Full synchronization confirmed (77 Tables, Latest Product Set)

---

## 2. Test Environment
- **Base URL:** `http://localhost:3000/v1`
- **Environment:** Docker (Node.js 22-alpine + MySQL 8.0)
- **Database Source:** `latest_ecommerce_shop.sql`
- **Test Tools:** REST Client, PowerShell, Docker CLI

---

## 3. End-to-End Testing Procedure
To perform a complete test of the system, follow these steps in order:

### Phase A: User Onboarding
1.  **Signup:** Create a new user account.
2.  **OTP Generation:** Request an OTP to be sent to the mobile number.
3.  **Verification:** Verify the OTP and receive a JWT `accessToken`.

### Phase B: Catalog Discovery
4.  **Category Listing:** Retrieve the list of active categories.
5.  **Product Search:** Search for products using keywords and filters.
6.  **Product Details:** Fetch specific details of an individual item.

### Phase C: Authenticated Actions
7.  **Address Management:** Use the JWT token to create and retrieve user-specific delivery addresses.

---

## 4. Detailed API Catalog & Payloads

### 🔐 Authentication Module
| Endpoint | Method | Purpose | Payload (JSON) |
| :--- | :--- | :--- | :--- |
| `/auth/signup` | `POST` | Create new user | `{ "fullName": "John Doe", "mobile": "9998887776", "email": "john@example.com" }` |
| `/auth/send-otp` | `POST` | Trigger OTP | `{ "mobile": "9998887776" }` |
| `/auth/verify-otp`| `POST` | Login & Get Token | `{ "mobile": "9998887776", "otp": "111111" }` |

**Verification Result:** ✅ Login returns `accessToken` and `refreshToken`.

---

### 📦 Product & Category Module
| Endpoint | Method | Filters | Purpose |
| :--- | :--- | :--- | :--- |
| `/categories` | `GET` | `q` (Search) | List all active product categories. |
| `/product-register` | `GET` | `limit`, `slugs` | List all products or collection-based products. |
| `/product-register/search`| `GET`| `q` | Fuzzy search products by name. |
| `/product-register/:id` | `GET` | `-` | Get full details (description, images, specs). |
| `/product-register` (Filter)| `GET` | `minPrice`, `rating`| Advanced filtering of the catalog. |

**Example Search Payload:**
`GET /v1/product-register/search?q=shirt`

---

### 🏠 User Module (Protected)
*Note: These require `Authorization: Bearer <token>` in headers.*

#### Create Address
- **Endpoint:** `POST /v1/user-addresses`
- **Payload:**
```json
{
  "address": "MindBrain HQ, Floor 9",
  "townCity": "Bhubaneswar",
  "pincode": "751024",
  "receiversName": "John Doe",
  "receiversNumber": "9998887776",
  "saveAs": "Work"
}
```
*Note: `saveAs` must be one of [Home, Work, Other].*

#### Get My Addresses
- **Endpoint:** `GET /v1/user-addresses/me`
- **Status:** ✅ Returns array of saved addresses for the current user.

---

## 5. System Health & Docs
- **Health Check:** `http://localhost:3000/health`
- **Interactive Docs (Swagger):** `http://localhost:3000/api-docs`

---
**Report generated for BM2MALL Development Team.**
