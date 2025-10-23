# API Testing Guide

Complete guide for testing all API endpoints in the E-Commerce application.

## 📋 Table of Contents

- [Setup](#setup)
- [Authentication Flow](#authentication-flow)
- [Testing Users](#testing-users)
- [Testing Products](#testing-products)
- [Testing Cart Items](#testing-cart-items)
- [Testing Orders](#testing-orders)
- [Complete E-Commerce Flow](#complete-e-commerce-flow)
- [Error Scenarios](#error-scenarios)

---

## 🚀 Setup

### Prerequisites
```bash
# Start the application
npm run start:dev

# Application runs on: http://localhost:3000/api
```

### Tools
- **cURL** - Command line testing
- **Postman** - GUI testing
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

---

## 🔐 Authentication Flow

### 1. Create a User Account
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "test@example.com",
  "name": "Test User",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** Password is NOT returned in response (security feature).

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "Password123!"
  }'
```

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**Save the access_token for authenticated requests!**

---

## 👥 Testing Users

### Get All Users
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get User by Email
```bash
curl -X GET "http://localhost:3000/api/users?email=test@example.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get User by ID
```bash
curl -X GET http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update User
```bash
curl -X PATCH http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🛍️ Testing Products

### Create Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop with 16GB RAM"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop with 16GB RAM",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get All Products
```bash
curl -X GET http://localhost:3000/api/products
```

### Get Product by ID
```bash
curl -X GET http://localhost:3000/api/products/660e8400-e29b-41d4-a716-446655440001
```

**Expected Response (200 OK):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop with 16GB RAM",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Product
```bash
curl -X PATCH http://localhost:3000/api/products/660e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899.99,
    "description": "Updated description"
  }'
```

### Delete Product
```bash
curl -X DELETE http://localhost:3000/api/products/660e8400-e29b-41d4-a716-446655440001
```

---

## 🛒 Testing Cart Items

### Add Item to Cart
```bash
curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "660e8400-e29b-41d4-a716-446655440001",
    "quantity": 2
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "product_id": "660e8400-e29b-41d4-a716-446655440001",
  "quantity": 2,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "name": "Test User"
  },
  "product": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop"
  }
}
```

### Get All Cart Items
```bash
curl -X GET http://localhost:3000/api/cart-items
```

### Get Cart Item by ID
```bash
curl -X GET http://localhost:3000/api/cart-items/770e8400-e29b-41d4-a716-446655440002
```

### Update Cart Item Quantity
```bash
curl -X PATCH http://localhost:3000/api/cart-items/770e8400-e29b-41d4-a716-446655440002 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

### Remove Item from Cart
```bash
curl -X DELETE http://localhost:3000/api/cart-items/770e8400-e29b-41d4-a716-446655440002
```

---

## 📦 Testing Orders

### Create Single Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "660e8400-e29b-41d4-a716-446655440001",
    "quantity": 1,
    "status": "pending"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440003",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "product_id": "660e8400-e29b-41d4-a716-446655440001",
  "quantity": 1,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "name": "Test User"
  },
  "product": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop"
  }
}
```

### Checkout (Convert Cart to Orders)
```bash
curl -X POST http://localhost:3000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Expected Response (201 Created):**
Returns array of created orders. Cart is automatically cleared.

### Get All Orders
```bash
curl -X GET http://localhost:3000/api/orders
```

### Get User's Orders
```bash
curl -X GET http://localhost:3000/api/orders/user/550e8400-e29b-41d4-a716-446655440000
```

### Get User's Order Statistics
```bash
curl -X GET http://localhost:3000/api/orders/user/550e8400-e29b-41d4-a716-446655440000/stats
```

**Expected Response (200 OK):**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "totalOrders": 3,
  "totalSpent": 2999.97,
  "statusCounts": {
    "pending": 2,
    "processing": 1
  }
}
```

### Get Order by ID
```bash
curl -X GET http://localhost:3000/api/orders/880e8400-e29b-41d4-a716-446655440003
```

### Update Order Status
```bash
curl -X PATCH http://localhost:3000/api/orders/880e8400-e29b-41d4-a716-446655440003 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "processing"
  }'
```

### Cancel Order
```bash
curl -X PATCH http://localhost:3000/api/orders/880e8400-e29b-41d4-a716-446655440003/cancel
```

### Delete Order
```bash
curl -X DELETE http://localhost:3000/api/orders/880e8400-e29b-41d4-a716-446655440003
```

---

## 🎯 Complete E-Commerce Flow

### Step-by-Step Test Scenario

```bash
# 1. Create User
USER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "shopper@example.com",
    "password": "Shop123!",
    "name": "John Shopper"
  }')
USER_ID=$(echo $USER_RESPONSE | jq -r '.id')
echo "User ID: $USER_ID"

# 2. Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "shopper@example.com",
    "password": "Shop123!"
  }')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
echo "Token: $TOKEN"

# 3. Create Products
PRODUCT1=$(curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "description": "Gaming laptop"
  }')
PRODUCT1_ID=$(echo $PRODUCT1 | jq -r '.id')
echo "Product 1 ID: $PRODUCT1_ID"

PRODUCT2=$(curl -s -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mouse",
    "price": 29.99,
    "description": "Wireless mouse"
  }')
PRODUCT2_ID=$(echo $PRODUCT2 | jq -r '.id')
echo "Product 2 ID: $PRODUCT2_ID"

# 4. Browse Products
curl -X GET http://localhost:3000/api/products

# 5. Add Items to Cart
curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"product_id\": \"$PRODUCT1_ID\",
    \"quantity\": 1
  }"

curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\",
    \"product_id\": \"$PRODUCT2_ID\",
    \"quantity\": 2
  }"

# 6. View Cart
curl -X GET http://localhost:3000/api/cart-items

# 7. Checkout
curl -X POST http://localhost:3000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$USER_ID\"
  }"

# 8. View Orders
curl -X GET http://localhost:3000/api/orders/user/$USER_ID

# 9. View Order Statistics
curl -X GET http://localhost:3000/api/orders/user/$USER_ID/stats

# 10. Verify Cart is Empty
curl -X GET http://localhost:3000/api/cart-items
```

---

## ⚠️ Error Scenarios

### Test 404 - Not Found

```bash
# Non-existent user
curl -X GET http://localhost:3000/api/users/00000000-0000-0000-0000-000000000000

# Expected: 404 Not Found
{
  "statusCode": 404,
  "message": "User with ID 00000000-0000-0000-0000-000000000000 not found",
  "error": "Not Found"
}
```

### Test 400 - Bad Request

```bash
# Invalid quantity (must be >= 1)
curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "valid-uuid",
    "product_id": "valid-uuid",
    "quantity": 0
  }'

# Expected: 400 Bad Request
{
  "statusCode": 400,
  "message": ["quantity must not be less than 1"],
  "error": "Bad Request"
}
```

### Test 401 - Unauthorized

```bash
# Access protected endpoint without token
curl -X GET http://localhost:3000/api/users

# Expected: 401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Test Empty Cart Checkout

```bash
# Try to checkout with empty cart
curl -X POST http://localhost:3000/api/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "valid-uuid"
  }'

# Expected: 400 Bad Request
{
  "statusCode": 400,
  "message": "Cart is empty. Cannot checkout.",
  "error": "Bad Request"
}
```

### Test Cancel Delivered Order

```bash
# Try to cancel already delivered order
curl -X PATCH http://localhost:3000/api/orders/{order-id}/cancel

# Expected: 400 Bad Request
{
  "statusCode": 400,
  "message": "Cannot cancel order with status: delivered",
  "error": "Bad Request"
}
```

---

## 📊 Validation Tests

### Test Required Fields

```bash
# Missing required field
curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "valid-uuid"
  }'

# Expected: 400 Bad Request with validation errors
```

### Test Invalid Data Types

```bash
# String instead of number
curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "valid-uuid",
    "product_id": "valid-uuid",
    "quantity": "not-a-number"
  }'

# Expected: 400 Bad Request
```

### Test Extra Fields (Stripped)

```bash
# Extra field will be stripped due to whitelist
curl -X POST http://localhost:3000/api/cart-items \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "valid-uuid",
    "product_id": "valid-uuid",
    "quantity": 2,
    "extra_field": "will be removed"
  }'

# Expected: 201 Created (extra_field ignored)
```

---

## 🧪 Postman Collection

### Import Collection
1. Open Postman
2. Click Import
3. Create new collection: "E-Commerce API"
4. Add environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `user_id`: (set after user creation)
   - `product_id`: (set after product creation)
   - `jwt_token`: (set after login)

### Sample Request in Postman

**POST Create User**
- URL: `{{base_url}}/users`
- Method: POST
- Body (JSON):
```json
{
  "email": "{{$randomEmail}}",
  "password": "Password123!",
  "name": "{{$randomFullName}}"
}
```
- Tests:
```javascript
pm.test("Status is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("User created", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('id');
    pm.environment.set("user_id", response.id);
});
```

---

## 📝 Test Checklist

### Pre-Testing
- [ ] Application is running
- [ ] Database is connected
- [ ] Environment variables are set

### Users Module
- [ ] Create user (password excluded from response)
- [ ] Login (JWT token returned)
- [ ] Get all users
- [ ] Get user by ID
- [ ] Get user by email
- [ ] Update user
- [ ] Delete user
- [ ] 404 on non-existent user

### Products Module
- [ ] Create product
- [ ] Get all products
- [ ] Get product by ID
- [ ] Update product
- [ ] Delete product
- [ ] 404 on non-existent product

### Cart Items Module
- [ ] Add item to cart (with relations)
- [ ] Get all cart items (with relations)
- [ ] Get cart item by ID
- [ ] Update cart item quantity
- [ ] Delete cart item
- [ ] 404 on non-existent cart item
- [ ] 404 when invalid user_id
- [ ] 404 when invalid product_id
- [ ] Validation on quantity < 1

### Orders Module
- [ ] Create single order
- [ ] Checkout (cart → orders)
- [ ] Get all orders
- [ ] Get user's orders
- [ ] Get user's statistics
- [ ] Get order by ID
- [ ] Update order status
- [ ] Cancel order
- [ ] Delete order
- [ ] 400 on empty cart checkout
- [ ] 400 on cancel delivered order
- [ ] 404 on non-existent order

### Complete Flow
- [ ] Register → Login → Browse → Add to Cart → Checkout → Track Order
- [ ] Cart cleared after checkout
- [ ] Order statistics calculated correctly

---

## 🔧 Troubleshooting

### Common Issues

**Issue: 401 Unauthorized**
- Solution: Include JWT token in Authorization header

**Issue: 404 Not Found**
- Solution: Verify IDs are correct UUIDs

**Issue: 400 Bad Request**
- Solution: Check request body format and required fields

**Issue: 500 Internal Server Error**
- Solution: Check server logs and database connection

---

## 📚 Additional Resources

- [API Documentation](README.md)
- [Orders Module Documentation](src/orders/README.md)
- [API Alignment Changes](API_ALIGNMENT_CHANGES.md)
- [NestJS Documentation](https://docs.nestjs.com)

---

**Happy Testing! 🚀**