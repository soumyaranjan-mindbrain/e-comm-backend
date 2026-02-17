# API Endpoints List

## Authentication
- `POST /v1/auth/signup` - Register a new user
- `POST /v1/auth/send-otp` - Send OTP to mobile number
- `POST /v1/auth/verify-otp` - Verify OTP and login (returns JWT tokens)

## Products & Inventory
- `GET /v1/products` - List all products (with search/filters)
- `GET /v1/products/:id` - Get single product details
- `GET /v1/product-register` - List product registers
- `GET /v1/product-register/:id` - Get product register details
- `GET /v1/product-image-register` - List product images
- `GET /v1/product-ratings` - List product ratings
- `POST /v1/product-ratings` - Submit a new product rating

## Categories
- `GET /v1/categories` - List all categories
- `GET /v1/categories/:id` - Get category details

## User Management
- `GET /v1/user-addresses` - List user saved addresses
- `POST /v1/user-addresses` - Add a new address
- `PUT /v1/user-addresses/:id` - Update an address
- `DELETE /v1/user-addresses/:id` - Delete an address

## Coupons & Discounts
- `GET /v1/coupon-codes` - List available coupon codes
- `GET /v1/coupon-codes/:id` - Get coupon details

## System
- `GET /health` - Server health check
- `GET /api-docs` - Swagger API Documentation
