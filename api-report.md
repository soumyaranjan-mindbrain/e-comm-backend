# 📋 BM2MALL Backend - API Comprehensive Test Report

This document provides a detailed guide on all available API endpoints, their expected JSON bodies, and a step-by-step procedure for end-to-end testing of the BM2MALL E-commerce system.

---

## 🚀 1. End-To-End Testing Flow

To test the system from scratch as a new user, follow this sequence:
1.  **Signup**: Create a new account.
2.  **Verify OTP**: Use the hardcoded `111111` (in Dev mode) to get your JWT token.
3.  **Explore Products**: Search and filter the product catalog.
4.  **Manage Addresses**: Add, Update, and View your delivery addresses.

---

## 🔐 2. Authentication Module

### A. User Signup (Step 1)
Register a new mobile number into the system.
- **Endpoint**: `POST /v1/auth/signup`
- **Body**:
```json
{
  "fullName": "Test User",
  "mobile": "9998887776",
  "email": "test@mindbrain.com"
}
```

### B. Send OTP (Optional Step 1 alternative)
Trigger an OTP for an existing user.
- **Endpoint**: `POST /v1/auth/send-otp`
- **Body**:
```json
{
  "mobile": "9998887776"
}
```

### C. Verify OTP (Final Onboarding Step)
Verify the code and receive the `accessToken`.
- **Endpoint**: `POST /v1/auth/verify-otp`
- **Body**:
```json
{
  "mobile": "9998887776",
  "otp": "111111"
}
```
*Note: The response will contain a `data.tokens.accessToken`. Copy this for all protected calls.*

---

## 📦 3. Product & Catalog Module (Public)

### A. List All Categories
- **Endpoint**: `GET /v1/categories`
- **Fuzzy Search**: `GET /v1/categories?q=ELECTORNICS` (Matches "Electronics")

### B. Product Listing & Search
- **Get all products**: `GET /v1/product-register?limit=20`
- **Search by Name**: `GET /v1/product-register/search?q=shirt`
- **Filter by Collection**: `GET /v1/product-register?slugs=new-arrivals`

### C. Advanced Filtering
- **Price Range**: `GET /v1/product-register?minPrice=500&maxPrice=5000`
- **Minimum Rating**: `GET /v1/product-register?rating=4`
- **Specific Category**: `GET /v1/product-register?categoryId=61`

### D. Single Product Details
- **Endpoint**: `GET /v1/product-register/:id` (e.g., `/v1/product-register/1`)

---

## 🏠 4. User Address Module (Protected)
*All headers below must include: `Authorization: Bearer <your_token>`*

### A. Create New Address
- **Endpoint**: `POST /v1/user-addresses`
- **Body**:
```json
{
  "address": "MindBrain HQ, Floor 9",
  "townCity": "Bhubaneswar",
  "pincode": "751024",
  "receiversName": "Test User",
  "receiversNumber": "9998887776",
  "saveAs": "Work"
}
```
*Valid `saveAs` types: [Home, Work, Other]*

### B. View My Addresses
- **Endpoint**: `GET /v1/user-addresses/me`

### C. Update Address
- **Endpoint**: `PUT /v1/user-addresses/:id`
- **Body**:
```json
{
  "address": "Updated Floor 10",
  "saveAs": "Home"
}
```

### D. Delete Address
- **Endpoint**: `DELETE /v1/user-addresses/:id`

---

## 🧪 5. Latest Test Results (Feb 18, 2026)

| Module | Test Case | Status | Notes |
| :--- | :--- | :---: | :--- |
| **Auth** | Signup + Send OTP | ✅ PASS | Created mobile `9998887776`. |
| **Auth** | Verify (111111) | ✅ PASS | Token generated successfully. |
| **Catalog**| Schema Load (77 Tables) | ✅ PASS | Verified via MySQL CLI. |
| **User** | CRUD Address | ✅ PASS | Create, Read, Update, Delete verified. |
| **System** | Health Check | ✅ PASS | Returns `{"ok":true}` |

---
**Prepared for the BM2MALL Engineering Team.**
