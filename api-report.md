# BM2MALL BACKEND - COMPLETE API DOCUMENTATION
Updated: 2026-02-18 | Total Modules: 9

--------------------------------------------------
1. AUTHENTICATION MODULE
--------------------------------------------------

[POST] /v1/auth/signup
Description: Register a new user and send OTP.
Request Body:
{
  "fullName": "Name",
  "mobile": "10-digit number",
  "email": "email@test.com"
}

[POST] /v1/auth/send-otp
Description: Send OTP to an existing registered mobile number.
Request Body: { "mobile": "9876543210" }

[POST] /v1/auth/verify-otp
Description: Verify OTP and login (Sets Http-Only session cookies).
Request Body:
{
  "mobile": "9876543210",
  "otp": "111111"
}

[POST] /v1/auth/logout
Description: Clear session and logout. (Requires Auth)
Endpoint: `http://localhost:3000/v1/auth/logout`


--------------------------------------------------
2. USER PROFILE MODULE
--------------------------------------------------

[GET] /v1/profile/me
Description: Fetch logged-in user details (Name, Email, Mobile, Profile Image). (Requires Auth)
Endpoint: `http://localhost:3000/v1/profile/me`

[PATCH] /v1/profile/me
Description: Edit/Update profile name, email, or photo. (Requires Auth)
Request Body:
{
  "fullName": "New Name",
  "email": "new@email.com",
  "profileImage": "https://example.com/photo.jpg"
}


--------------------------------------------------
3. USER ADDRESS MODULE
--------------------------------------------------

[GET] /v1/user-addresses/me
Description: List all saved addresses for the current user. (Requires Auth)
Endpoint: `http://localhost:3000/v1/user-addresses/me`

[POST] /v1/user-addresses
Description: Add a new delivery address. (Requires Auth)
Request Body:
{
  "address": "Full Address String",
  "townCity": "City Name",
  "pincode": "654321",
  "receiversName": "Person Name",
  "receiversNumber": "9876543210",
  "saveAs": "Home" // Home, Work, Other
}

[PUT] /v1/user-addresses/:id
Description: Edit an existing address. (Requires Auth)
Example: `http://localhost:3000/v1/user-addresses/15`

[DELETE] /v1/user-addresses/:id
Description: Delete an address. (Requires Auth)
Example: `http://localhost:3000/v1/user-addresses/15`


--------------------------------------------------
4. CATEGORY MODULE
--------------------------------------------------

[GET] /v1/categories
Description: List all categories. Supports fuzzy search and pagination.
Endpoints:
- All: `http://localhost:3000/v1/categories`
- Search: `http://localhost:3000/v1/categories?search=men`
- Pagination: `http://localhost:3000/v1/categories?limit=10&cursor=5`

[GET] /v1/categories/:id
Description: Get details of a single category.
Example: `http://localhost:3000/v1/categories/61`


--------------------------------------------------
5. PRODUCT REGISTER MODULE (CATALOG)
--------------------------------------------------

[GET] /v1/product-register
Description: Main product listing with advanced filters.
Special Query Parameters:
- q: Search by Name
- minPrice / maxPrice: Price filters
- rating: Minimum rating (e.g., 4.5)
- categoryId: Filter by category ID
- slugs: "new-arrivals" for latest products
- limit / cursor: For pagination

Example (Combined): 
`http://localhost:3000/v1/product-register?q=shirt&minPrice=100&rating=3&limit=5`

[GET] /v1/product-register/search
Description: Direct fuzzy search for products.
Example: `http://localhost:3000/v1/product-register/search?q=shirt`

[GET] /v1/product-register/:id
Description: Full product details (Images, Pricing, Description).
Example: `http://localhost:3000/v1/product-register/5001`


--------------------------------------------------
6. PRODUCT IMAGE MODULE
--------------------------------------------------

[GET] /v1/product-image-register
Description: List all product images across catalog.

[GET] /v1/product-image-register/product/:productId
Description: Get all images belonging to a specific product.
Example: `http://localhost:3000/v1/product-image-register/product/5001`

[GET] /v1/product-image-register/:id
Description: Get single image details by its record ID.


--------------------------------------------------
7. PRODUCT RATINGS MODULE
--------------------------------------------------

[GET] /v1/product-ratings
Description: Global list of all ratings/reviews.

[GET] /v1/product-ratings/product/:productId
Description: All reviews for a specific product.

[GET] /v1/product-ratings/product/:productId/stats
Description: Rating stats (Average, total counts).

[POST] /v1/product-ratings
Description: Post a new review.
Request Body: { "productId": 5001, "givenRatings": 5, "message": "Good!" }

[PUT] /v1/product-ratings/:id
Description: Edit a review.

[DELETE] /v1/product-ratings/:id
Description: Delete a review.


--------------------------------------------------
8. COUPON CODES MODULE
--------------------------------------------------

[GET] /v1/coupon-codes
Description: List all available coupons.

[GET] /v1/coupon-codes/search
Description: Search for a specific coupon code by name.

[POST] /v1/coupon-codes
Description: Create a new coupon (Admin/Backend).

[DELETE] /v1/coupon-codes/:id
Description: Remove a coupon.


--------------------------------------------------
9. SYSTEM / UTILITY
--------------------------------------------------

[GET] /v1/health
Description: Check if API server and Database are online.
Endpoint: `http://localhost:3000/v1/health`


--------------------------------------------------
ERROR CODES FOR TESTERS
--------------------------------------------------
- ERR_AUTH: Login required/Session expired.
- ERR_VALID: Request data invalid (e.g. bad email).
- ERR_CONFLICT: Conflict (e.g. mobile already exists).
- ERR_NOT_FOUND: Record not found.
