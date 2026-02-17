# API Endpoints & Test Payloads

## Authentication

### 1. Signup (New User)
- **URL**: `POST /v1/auth/signup`
- **Body**:
```json
{
  "fullName": "Rahul Sharma",
  "mobile": "9876543210",
  "email": "rahul@example.com"
}
```

### 2. Send OTP
- **URL**: `POST /v1/auth/send-otp`
- **Body**:
```json
{
  "mobile": "9876543210"
}
```

### 3. Verify OTP & Login
- **URL**: `POST /v1/auth/verify-otp`
- **Body**:
```json
{
  "mobile": "9876543210",
  "otp": "111111"
}
```

---

## Products & Inventory

### List Products (with Search/Filters)
- **URL**: `GET /v1/products?q=book&minPrice=100&maxPrice=500&limit=10`
- **Body**: None

### Submit Product Rating
- **URL**: `POST /v1/product-ratings`
- **Body**:
```json
{
  "productId": 1,
  "givenRatings": 5,
  "message": "Excellent quality product!"
}
```

---

## User Management

### Add User Address
- **URL**: `POST /v1/user-addresses`
- **Headers**: `Authorization: Bearer <your_access_token>`
- **Body**:
```json
{
  "receiversName": "Rahul Sharma",
  "receiversNumber": "9876543210",
  "address": "Flat 402, Sunshine Apartment",
  "townCity": "Mumbai",
  "pincode": "400001",
  "saveAs": "Home"
}
```

### Update User Address
- **URL**: `PUT /v1/user-addresses/:id`
- **Body**:
```json
{
  "address": "Updated Street Address 789",
  "townCity": "Pune"
}
```

---

## System Info
- `GET /health` - Health check status
- `GET /api-docs` - Full interactive documentation (Swagger)
