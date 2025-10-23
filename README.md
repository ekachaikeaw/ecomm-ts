![Github Action](https://github.com/ekachaikeaw/learn-cicd-typescript-starter/actions/workflows/ci.yml/badge.svg)
# E-Commerce API Documentation

A complete e-commerce REST API built with NestJS, Prisma, and PostgreSQL.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Setup](#project-setup)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Products](#products)
  - [Cart Items](#cart-items)
  - [Orders](#orders)
- [API Usage Examples](#api-usage-examples)
- [Error Handling](#error-handling)
- [Testing](#testing)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Project Setup

```bash
# Install dependencies
$ npm install

# Set up environment variables
# Create a .env file in the root directory
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
JWT_SECRET="your-secret-key"
PORT=3000
```

### Database Setup

```bash
# Generate Prisma Client
$ npx prisma generate

# Run database migrations
$ npx prisma migrate dev

# Seed database (optional)
$ npx prisma db seed
```

### Run the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

The API will be available at: `http://localhost:3000/api`

---

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication

### Login
Authenticate a user and receive a JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials

---

## 👥 Users

### Create User
Register a new user account.

**Endpoint:** `POST /api/users`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Get All Users
Retrieve all users. Can filter by email.

**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
- `email` (optional) - Filter by email address

**Examples:**
- `GET /api/users` - Get all users
- `GET /api/users?email=user@example.com` - Find user by email

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get User by ID
Retrieve a specific user by their ID.

**Endpoint:** `GET /api/users/:id`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `id` (string) - User UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - User not found

---

### Update User
Update user information.

**Endpoint:** `PATCH /api/users/:id`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `id` (string) - User UUID

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "newemail@example.com"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "newemail@example.com",
  "name": "Jane Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

### Delete User
Delete a user account.

**Endpoint:** `DELETE /api/users/:id`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Path Parameters:**
- `id` (string) - User UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe"
}
```

---

## 🛍️ Products

### Create Product
Add a new product to the catalog.

**Endpoint:** `POST /api/products`

**Request Body:**
```json
{
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop with 16GB RAM"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop with 16GB RAM",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Get All Products
Retrieve all products in the catalog.

**Endpoint:** `GET /api/products`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop with 16GB RAM",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": "uuid",
    "name": "Wireless Mouse",
    "price": 29.99,
    "description": "Ergonomic wireless mouse",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Product by ID
Retrieve a specific product.

**Endpoint:** `GET /api/products/:id`

**Path Parameters:**
- `id` (string) - Product UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop with 16GB RAM",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Product not found

---

### Update Product
Update product information.

**Endpoint:** `PATCH /api/products/:id`

**Path Parameters:**
- `id` (string) - Product UUID

**Request Body:**
```json
{
  "name": "Gaming Laptop",
  "price": 1299.99,
  "description": "High-performance gaming laptop with RTX 4060"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Gaming Laptop",
  "price": 1299.99,
  "description": "High-performance gaming laptop with RTX 4060",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

### Delete Product
Remove a product from the catalog.

**Endpoint:** `DELETE /api/products/:id`

**Path Parameters:**
- `id` (string) - Product UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop with 16GB RAM"
}
```

---

## 🛒 Cart Items

### Add Item to Cart
Add a product to the shopping cart.

**Endpoint:** `POST /api/cart-items`

**Request Body:**
```json
{
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 2
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 2,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "product": {
    "id": "uuid",
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop"
  }
}
```

**Error Responses:**
- `404 Not Found` - User or product not found
- `400 Bad Request` - Invalid quantity

---

### Get All Cart Items
Retrieve all items in the cart.

**Endpoint:** `GET /api/cart-items`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "product_id": "uuid",
    "quantity": 2,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "product": {
      "id": "uuid",
      "name": "Laptop",
      "price": 999.99
    }
  }
]
```

---

### Get Cart Item by ID
Retrieve a specific cart item.

**Endpoint:** `GET /api/cart-items/:id`

**Path Parameters:**
- `id` (string) - Cart item UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 2,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Update Cart Item
Update the quantity of a cart item.

**Endpoint:** `PATCH /api/cart-items/:id`

**Path Parameters:**
- `id` (string) - Cart item UUID

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 5,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

---

### Remove Cart Item
Delete an item from the cart.

**Endpoint:** `DELETE /api/cart-items/:id`

**Path Parameters:**
- `id` (string) - Cart item UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 2
}
```

---

## 📦 Orders

### Create Single Order
Create an order directly without using the cart.

**Endpoint:** `POST /api/orders`

**Request Body:**
```json
{
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "status": "pending"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "product": {
    "id": "uuid",
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop"
  }
}
```

**Validation Rules:**
- `user_id` - Required, must be valid UUID
- `product_id` - Required, must be valid UUID
- `quantity` - Required, must be >= 1
- `status` - Optional, defaults to "pending"

---

### Checkout (Cart to Orders)
Convert all cart items to orders and clear the cart.

**Endpoint:** `POST /api/orders/checkout`

**Request Body:**
```json
{
  "user_id": "uuid"
}
```

**Response:** `201 Created`
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "product_id": "uuid-1",
    "quantity": 2,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "product": {
      "id": "uuid-1",
      "name": "Laptop",
      "price": 999.99
    }
  },
  {
    "id": "uuid",
    "user_id": "uuid",
    "product_id": "uuid-2",
    "quantity": 1,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "product": {
      "id": "uuid-2",
      "name": "Mouse",
      "price": 29.99
    }
  }
]
```

**Features:**
- Creates one order per cart item
- All orders start with "pending" status
- Cart is automatically cleared after successful checkout
- Returns array of created orders

**Error Responses:**
- `404 Not Found` - User not found
- `400 Bad Request` - Cart is empty

---

### Get All Orders
Retrieve all orders in the system.

**Endpoint:** `GET /api/orders`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "product_id": "uuid",
    "quantity": 1,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "product": {
      "id": "uuid",
      "name": "Laptop",
      "price": 999.99
    }
  }
]
```

**Note:** Orders are sorted by creation date (newest first)

---

### Get User's Orders
Retrieve all orders for a specific user.

**Endpoint:** `GET /api/orders/user/:userId`

**Path Parameters:**
- `userId` (string) - User UUID

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "product_id": "uuid",
    "quantity": 1,
    "status": "delivered",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-05T00:00:00.000Z",
    "product": {
      "id": "uuid",
      "name": "Laptop",
      "price": 999.99,
      "description": "High-performance laptop"
    }
  }
]
```

**Error Responses:**
- `404 Not Found` - User not found

---

### Get User's Order Statistics
Get order analytics for a specific user.

**Endpoint:** `GET /api/orders/user/:userId/stats`

**Path Parameters:**
- `userId` (string) - User UUID

**Response:** `200 OK`
```json
{
  "userId": "uuid",
  "totalOrders": 5,
  "totalSpent": 1549.95,
  "statusCounts": {
    "pending": 1,
    "processing": 1,
    "shipped": 1,
    "delivered": 2
  }
}
```

**Calculated Fields:**
- `totalOrders` - Total number of orders
- `totalSpent` - Sum of (quantity × product price) for all orders
- `statusCounts` - Breakdown of orders by status

---

### Get Order by ID
Retrieve a specific order.

**Endpoint:** `GET /api/orders/:id`

**Path Parameters:**
- `id` (string) - Order UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "product": {
    "id": "uuid",
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop"
  }
}
```

**Error Responses:**
- `404 Not Found` - Order not found

---

### Update Order
Update order quantity or status.

**Endpoint:** `PATCH /api/orders/:id`

**Path Parameters:**
- `id` (string) - Order UUID

**Request Body:**
```json
{
  "quantity": 3,
  "status": "processing"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 3,
  "status": "processing",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "product": {
    "id": "uuid",
    "name": "Laptop",
    "price": 999.99
  }
}
```

**Valid Status Values:**
- `pending` - Order created but not yet processed
- `processing` - Order is being prepared
- `shipped` - Order has been shipped
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

---

### Cancel Order
Cancel an order by setting status to "cancelled".

**Endpoint:** `PATCH /api/orders/:id/cancel`

**Path Parameters:**
- `id` (string) - Order UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "status": "cancelled",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "product": {
    "id": "uuid",
    "name": "Laptop",
    "price": 999.99
  }
}
```

**Business Rules:**
- Cannot cancel orders with status "delivered"
- Cannot cancel orders already marked as "cancelled"

**Error Responses:**
- `404 Not Found` - Order not found
- `400 Bad Request` - Cannot cancel order with current status

---

### Delete Order
Permanently delete an order from the database.

**Endpoint:** `DELETE /api/orders/:id`

**Path Parameters:**
- `id` (string) - Order UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "status": "cancelled"
}
```

**Error Responses:**
- `404 Not Found` - Order not found

---

## 🎯 API Usage Examples

### Complete E-Commerce Flow

#### 1. User Registration and Login
```bash
# Create user account
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123",
    "name": "John Doe"
  }'

# Login to get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john@example.com",
    "password": "securePass123"
  }'
```

#### 2. Browse Products
```bash
# Get all products
curl http://localhost:3000/api/products

# Get specific product
curl http://localhost:3000/api/products/{product-id}
```

#### 3. Add Items to Cart
```bash
# Add first product
curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "product_id": "product-1-uuid",
    "quantity": 2
  }'

# Add second product
curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "product_id": "product-2-uuid",
    "quantity": 1
  }'
```

#### 4. View Cart
```bash
# Get all cart items
curl http://localhost:3000/api/cart-items
```

#### 5. Update Cart
```bash
# Update quantity
curl -X PATCH http://localhost:3000/api/cart-items/{cart-item-id} \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'

# Remove item from cart
curl -X DELETE http://localhost:3000/api/cart-items/{cart-item-id}
```

#### 6. Checkout
```bash
# Convert cart to orders
curl -X POST http://localhost:3000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid"
  }'
```

#### 7. Track Orders
```bash
# View all orders
curl http://localhost:3000/api/orders/user/{user-id}

# View order statistics
curl http://localhost:3000/api/orders/user/{user-id}/stats

# Get specific order
curl http://localhost:3000/api/orders/{order-id}
```

#### 8. Manage Orders
```bash
# Update order status
curl -X PATCH http://localhost:3000/api/orders/{order-id} \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'

# Cancel order
curl -X PATCH http://localhost:3000/api/orders/{order-id}/cancel
```

---

## ⚠️ Error Handling

### Standard Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 OK | Request succeeded |
| 201 Created | Resource created successfully |
| 400 Bad Request | Invalid request data |
| 401 Unauthorized | Authentication required or failed |
| 404 Not Found | Resource not found |
| 500 Internal Server Error | Server error |

### Common Error Scenarios

#### Authentication Errors
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

#### Validation Errors
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

#### Not Found Errors
```json
{
  "statusCode": 404,
  "message": "User with ID {id} not found",
  "error": "Not Found"
}
```

#### Business Logic Errors
```json
{
  "statusCode": 400,
  "message": "Cart is empty. Cannot checkout.",
  "error": "Bad Request"
}
```

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

### Testing with Postman

1. Import the API collection
2. Set environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `jwt_token`: Your JWT token from login
3. Run the collection

### Testing with cURL

See [API Usage Examples](#api-usage-examples) section for cURL commands.

---

## 📊 Database Schema

### User Table
```
- id: UUID (Primary Key)
- email: String (Unique)
- password: String (Hashed)
- name: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### Product Table
```
- id: UUID (Primary Key)
- name: String
- price: Float
- description: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### Cart Items Table
```
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → User)
- product_id: UUID (Foreign Key → Product)
- quantity: Integer
- createdAt: DateTime
- updatedAt: DateTime
```

### Order Table
```
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key → User)
- product_id: UUID (Foreign Key → Product)
- quantity: Integer
- status: String
- createdAt: DateTime
- updatedAt: DateTime
```

---

## 🔒 Security Best Practices

1. **Authentication**: All user endpoints require JWT authentication
2. **Password Hashing**: User passwords are hashed using bcrypt
3. **Environment Variables**: Sensitive data stored in `.env` file
4. **Validation**: Input validation on all endpoints using class-validator
5. **CORS**: Configure CORS for production deployments

---

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

## 📝 License

This project is [MIT licensed](LICENSE).

---

## 🤝 Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in `/src/orders/README.md` for detailed order API documentation

---

## 🎯 Quick Reference

### Most Used Endpoints

```bash
# Login
POST /api/auth/login

# Browse products
GET /api/products

# Add to cart
POST /api/cart-items

# Checkout
POST /api/orders/checkout

# View orders
GET /api/orders/user/:userId

# Order stats
GET /api/orders/user/:userId/stats
```

### Status Flow

```
Cart → Checkout → Orders (pending → processing → shipped → delivered)
```


**Happy Coding! 🚀**

test rm2