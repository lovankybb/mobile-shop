# Mobile Shop Backend - AI Development Log

## Overview
A modern e-commerce backend API for a mobile shop. Designed to manage a complex product catalog with variants (colors, versions), handle stateless authentication, and process orders for both registered users and guests. The shopping cart state is managed on the server for logged-in users, and on the client side for guests.

## Tech Stack
- **Framework:** Java 17, Spring Boot 3.x
- **Build Tool:** Maven
- **Database:** PostgreSQL 15 (via Docker)
- **Caching:** Redis 7 (via Docker, used for JWT blacklisting)
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **Image Storage:** Cloudinary (Planned)

## Current Status
- **Authentication:** Fully implemented (Login, Register, Logout with Redis blacklisting, Role-based access control).
- **Entities:** All DBML tables have been mapped to JPA Entities. Compilation is passing.
- **Exception Handling:** Unified global exception handling utilizing custom `AppException` and standardized `ApiResponse`.

## Recent Updates
- Configured Redis and implemented `TokenBlacklistService` to correctly invalidate JWT tokens upon logout.
- Built JPA entities for the Product Catalog (`Product`, `ProductVariant`, `ProductImage`, `Brand`, `Category`, `Color`, `ProductVersion`).
- Added `@Version` to `ProductVariant` to handle inventory concurrency (Optimistic Locking).
- Built JPA entities for the Order Domain (`Order`, `OrderDetail`, `PaymentAttempt`) with full support for optional/guest users.
- Wrapped all authentication and user endpoints into a standardized `ApiResponse` structure.
- Updated Shop name to "Bảo Bình Mobile" and stored logo URL in frontend `.env`.
- Added unit and integration tests for crucial checkout features (`OrderServiceTest` and `OrderControllerIntegrationTest`).
- Created an "About Us" page with shop info, addresses, and contacts. Updated navigation bar accordingly.
- Integrated the Rating and Review feature on the frontend (`ProductReviews` component in `ProductDetail.jsx`), allowing logged-in buyers to submit and view product feedback.
- Implemented a custom `404 Not Found` page with a catch-all route to gracefully handle invalid URLs in both public and admin areas.

## Todo Lists

### 1. Product Catalog Module (Next)
- [x] Create Repositories for `Brand`, `Category`, `Product`, and `ProductVariant`.
- [x] Implement Cloudinary service for image uploading.
- [x] Build Product Services (CRUD, fetching by category/brand).
- [x] Implement dynamic search, filtering, and pagination for products (using Spring Data JPA `Specification`).
- [x] Build Product Controllers.

### 2. Order Processing Module
- [x] Create Repositories for `Order`, `OrderDetail`, and `PaymentAttempt`.
- [x] Build Checkout Service (must re-calculate totals using DB prices and safely decrement stock).
- [x] Support Guest checkout logic (handle null `user_id` but save customer details).
- [x] Build Order Controllers (Admin view all, User view own).

### 3. Polish & Integration
- [x] Swagger / OpenAPI documentation setup.
- [x] Payment gateway integration (VNPAY / Momo).
- [x] Write integration tests / Postman collection updates.

### 4. Shopping Cart Module (Completed)
- [x] Create `Cart` and `CartItem` Entities linking to `User` and `ProductVariant`.
- [x] Create `CartRepository` and `CartItemRepository`.
- [x] Build `CartService` to add/remove/update cart items and clear cart.
- [x] Build `CartController` for the API endpoints.

### 5. Reviews & Ratings Module (Completed)
- [x] Create `Review` Entity with relations to `User` and `Product`. (Done)
- [x] Create `ReviewRepository` for fetching product reviews and calculating average ratings.
- [x] Build `ReviewService` with logic to ensure only buyers can leave reviews.
- [x] Build `ReviewController` for posting and getting reviews.
- [x] Update `ProductDetailResponse` to include average rating and review count.

### 6. Admin Dashboard / Statistics Module (Completed)
- [x] Create `StatisticResponse` DTO to hold aggregated metrics.
- [x] Add custom aggregation queries to `OrderRepository` for calculating revenue and order counts.
- [x] Build `StatisticService` to aggregate total revenue, user count, product count, and recent orders.
- [x] Build `StatisticController` restricted to `ADMIN` role.

### 7. Frontend Application (React + Vite)
- [x] Initialize Vite React project with TailwindCSS.
- [x] Set up routing and core layout.
- [x] Implement robust state management and API integration structure.
- [x] Build Authentication Flow (Login & Register).
- [x] Build Product Catalog (ProductList & ProductCard).
- [x] Build Admin Management Dashboard.
  - [x] Color Management.
  - [x] Version Management.
  - [x] Brand Management.
  - [x] Category Management.
  - [x] Product Management.
  - [x] Order Management.

### Known Bugs / Tech Debt
- [x] CORS issue still persists on frontend `GET /api/products` (Backend configuration not fully applied or intercepted by another filter). To be fixed later.
