# Orders Module API Documentation

## Overview
The Orders module manages order creation, checkout from cart, and order lifecycle management. It provides a complete integration between shopping cart items and order fulfillment.

## Table of Contents
- [Endpoints](#endpoints)
- [DTOs](#dtos)
- [Order Status](#order-status)
- [Usage Examples](#usage-examples)

## Endpoints

### 1. Create Single Order
**POST** `/orders`

Creates a single order directly without using the cart.

**Request Body:**
```json
{
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "status": "pending" // optional, defaults to "pending"
}
```

**Response:**
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
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description"
  }
}
```

**Status Codes:**
- `201 Created` - Order created successfully
- `404 Not Found` - User or product not found
- `400 Bad Request` - Invalid input data

---

### 2. Checkout (Convert Cart to Orders)
**POST** `/orders/checkout`

Converts all items in a user's cart to individual orders and clears the cart.

**Request Body:**
```json
{
  "user_id": "uuid"
}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "product_id": "uuid",
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
      "id": "uuid",
      "name": "Product 1",
      "price": 49.99,
      "description": "Product description"
    }
  },
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
      "name": "Product 2",
      "price": 79.99,
      "description": "Product description"
    }
  }
]
```

**Status Codes:**
- `201 Created` - Orders created successfully
- `404 Not Found` - User not found
- `400 Bad Request` - Cart is empty

**Notes:**
- Creates one order per cart item
- All orders start with "pending" status
- Cart is automatically cleared after successful checkout
- Transaction is atomic - if any order fails, entire checkout fails

---

### 3. Get All Orders
**GET** `/orders`

Retrieves all orders in the system with user and product details.

**Response:**
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
      "name": "Product Name",
      "price": 99.99,
      "description": "Product description"
    }
  }
]
```

**Status Codes:**
- `200 OK` - Orders retrieved successfully

**Notes:**
- Orders are sorted by creation date (newest first)
- Returns empty array if no orders exist

---

### 4. Get Orders by User ID
**GET** `/orders/user/:userId`

Retrieves all orders for a specific user.

**Path Parameters:**
- `userId` (string) - User UUID

**Response:**
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
    "product": {
      "id": "uuid",
      "name": "Product Name",
      "price": 99.99,
      "description": "Product description"
    }
  }
]
```

**Status Codes:**
- `200 OK` - Orders retrieved successfully
- `404 Not Found` - User not found

---

### 5. Get User Order Statistics
**GET** `/orders/user/:userId/stats`

Retrieves order statistics for a specific user.

**Path Parameters:**
- `userId` (string) - User UUID

**Response:**
```json
{
  "userId": "uuid",
  "totalOrders": 5,
  "totalSpent": 499.95,
  "statusCounts": {
    "pending": 2,
    "processing": 1,
    "delivered": 2
  }
}
```

**Status Codes:**
- `200 OK` - Statistics retrieved successfully
- `404 Not Found` - User not found

---

### 6. Get Single Order
**GET** `/orders/:id`

Retrieves a single order by ID with full details.

**Path Parameters:**
- `id` (string) - Order UUID

**Response:**
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
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description"
  }
}
```

**Status Codes:**
- `200 OK` - Order retrieved successfully
- `404 Not Found` - Order not found

---

### 7. Update Order
**PATCH** `/orders/:id`

Updates an order's quantity or status.

**Path Parameters:**
- `id` (string) - Order UUID

**Request Body:**
```json
{
  "quantity": 3,        // optional
  "status": "processing" // optional
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 3,
  "status": "processing",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "product": {
    "id": "uuid",
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description"
  }
}
```

**Status Codes:**
- `200 OK` - Order updated successfully
- `404 Not Found` - Order not found
- `400 Bad Request` - Invalid input data

---

### 8. Cancel Order
**PATCH** `/orders/:id/cancel`

Cancels an order by setting its status to "cancelled".

**Path Parameters:**
- `id` (string) - Order UUID

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "status": "cancelled",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "product": {
    "id": "uuid",
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description"
  }
}
```

**Status Codes:**
- `200 OK` - Order cancelled successfully
- `404 Not Found` - Order not found
- `400 Bad Request` - Order cannot be cancelled (already delivered or cancelled)

**Notes:**
- Cannot cancel orders with status "delivered" or "cancelled"

---

### 9. Delete Order
**DELETE** `/orders/:id`

Permanently deletes an order from the database.

**Path Parameters:**
- `id` (string) - Order UUID

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "status": "cancelled",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "product": {
    "id": "uuid",
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description"
  }
}
```

**Status Codes:**
- `200 OK` - Order deleted successfully
- `404 Not Found` - Order not found

---

## DTOs

### CreateOrderDto
```typescript
{
  user_id: string;      // Required - User UUID
  product_id: string;   // Required - Product UUID
  quantity: number;     // Required - Must be >= 1
  status?: string;      // Optional - Defaults to "pending"
}
```

### UpdateOrderDto
```typescript
{
  quantity?: number;    // Optional - Must be >= 1
  status?: string;      // Optional
}
```

### CheckoutDto
```typescript
{
  user_id: string;      // Required - User UUID
}
```

---

## Order Status

The following status values are commonly used:

- **pending** - Order created but not yet processed (default)
- **processing** - Order is being prepared
- **shipped** - Order has been shipped
- **delivered** - Order has been delivered to customer
- **cancelled** - Order has been cancelled

You can use custom status values as needed for your business logic.

---

## Usage Examples

### Example 1: Complete Checkout Flow

```bash
# 1. Add items to cart
POST /cart-items
{
  "user_id": "user-123",
  "product_id": "product-456",
  "quantity": 2
}

POST /cart-items
{
  "user_id": "user-123",
  "product_id": "product-789",
  "quantity": 1
}

# 2. Checkout (convert cart to orders)
POST /orders/checkout
{
  "user_id": "user-123"
}

# Response: 2 orders created, cart is now empty
```

### Example 2: Track Order Status

```bash
# 1. Create order
POST /orders
{
  "user_id": "user-123",
  "product_id": "product-456",
  "quantity": 1
}

# 2. Update to processing
PATCH /orders/{order-id}
{
  "status": "processing"
}

# 3. Update to shipped
PATCH /orders/{order-id}
{
  "status": "shipped"
}

# 4. Update to delivered
PATCH /orders/{order-id}
{
  "status": "delivered"
}
```

### Example 3: View User's Order History

```bash
# Get all orders for a user
GET /orders/user/user-123

# Get statistics
GET /orders/user/user-123/stats
```

### Example 4: Cancel Order

```bash
# Cancel an order
PATCH /orders/{order-id}/cancel

# Or update status directly
PATCH /orders/{order-id}
{
  "status": "cancelled"
}
```

---

## Error Handling

All endpoints follow standard HTTP error conventions:

### 400 Bad Request
- Invalid input data
- Cart is empty during checkout
- Cannot cancel delivered/cancelled orders

### 404 Not Found
- User not found
- Product not found
- Order not found

### 500 Internal Server Error
- Database connection issues
- Unexpected server errors

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Cart is empty. Cannot checkout.",
  "error": "Bad Request"
}
```

---

## Integration with Cart Module

The Orders module is designed to work seamlessly with the Cart Items module:

1. **Add to Cart**: Users add products to their cart using the cart-items endpoints
2. **Review Cart**: Users can view and modify their cart items
3. **Checkout**: When ready, users call `/orders/checkout` to convert cart items to orders
4. **Cart Cleared**: Upon successful checkout, the cart is automatically emptied
5. **Order Management**: Users can now track and manage their orders

---

## Best Practices

1. **Always validate user and product IDs** before creating orders
2. **Use checkout endpoint** for standard e-commerce flow (cart → orders)
3. **Track order status** throughout the fulfillment process
4. **Implement proper error handling** for failed transactions
5. **Consider adding transaction support** for critical operations
6. **Monitor order statistics** to gain business insights
7. **Implement proper authorization** to ensure users can only access their own orders

---

## Future Enhancements

Potential improvements to consider:

- Payment integration
- Order refunds and returns
- Order tracking with shipping carriers
- Email notifications for status changes
- Inventory management integration
- Multi-item orders (order with line items)
- Order history pagination
- Advanced filtering and search
- Order export functionality