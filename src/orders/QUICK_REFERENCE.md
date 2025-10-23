# Orders API Quick Reference

## 🚀 Quick Start

### Base URL
```
http://localhost:3000/orders
```

## 📋 Endpoints Cheat Sheet

### Create Single Order
```http
POST /orders
Content-Type: application/json

{
  "user_id": "uuid",
  "product_id": "uuid",
  "quantity": 1,
  "status": "pending"
}
```

### Checkout Cart → Orders
```http
POST /orders/checkout
Content-Type: application/json

{
  "user_id": "uuid"
}
```
**Note:** Converts all cart items to orders and clears cart

### Get All Orders
```http
GET /orders
```

### Get User's Orders
```http
GET /orders/user/:userId
```

### Get User's Order Stats
```http
GET /orders/user/:userId/stats
```
**Returns:** Total orders, total spent, status breakdown

### Get Single Order
```http
GET /orders/:id
```

### Update Order
```http
PATCH /orders/:id
Content-Type: application/json

{
  "quantity": 3,
  "status": "processing"
}
```

### Cancel Order
```http
PATCH /orders/:id/cancel
```

### Delete Order
```http
DELETE /orders/:id
```

## 📊 Order Status Values

- `pending` - Default status after creation
- `processing` - Order is being prepared
- `shipped` - Order has been shipped
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

## 🔄 Common Workflows

### Workflow 1: Complete Checkout
```bash
# 1. Add items to cart
POST /cart-items { user_id, product_id, quantity }

# 2. Checkout
POST /orders/checkout { user_id }

# 3. Cart is now empty, orders created
```

### Workflow 2: Order Tracking
```bash
# 1. Create order (pending)
POST /orders

# 2. Update to processing
PATCH /orders/:id { status: "processing" }

# 3. Update to shipped
PATCH /orders/:id { status: "shipped" }

# 4. Update to delivered
PATCH /orders/:id { status: "delivered" }
```

### Workflow 3: Order Management
```bash
# View all user orders
GET /orders/user/:userId

# Check statistics
GET /orders/user/:userId/stats

# Cancel if needed
PATCH /orders/:id/cancel
```

## ⚠️ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | User/Product/Order doesn't exist | Verify IDs are correct |
| 400 Bad Request | Cart is empty | Add items to cart first |
| 400 Bad Request | Cannot cancel delivered order | Check order status |
| 400 Bad Request | Invalid quantity | Use quantity >= 1 |

## 💡 Tips

1. **Always checkout via `/orders/checkout`** for standard flow
2. **Cart auto-clears** after successful checkout
3. **Cannot cancel** orders with status `delivered` or `cancelled`
4. **Use stats endpoint** for analytics and reporting
5. **All IDs are UUIDs** - ensure proper format

## 🧪 Testing with cURL

### Create Order
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"user_id":"USER_UUID","product_id":"PRODUCT_UUID","quantity":2}'
```

### Checkout
```bash
curl -X POST http://localhost:3000/orders/checkout \
  -H "Content-Type: application/json" \
  -d '{"user_id":"USER_UUID"}'
```

### Get Orders
```bash
curl http://localhost:3000/orders/user/USER_UUID
```

### Update Status
```bash
curl -X PATCH http://localhost:3000/orders/ORDER_UUID \
  -H "Content-Type: application/json" \
  -d '{"status":"processing"}'
```

### Cancel Order
```bash
curl -X PATCH http://localhost:3000/orders/ORDER_UUID/cancel
```

## 📦 Response Format

All successful responses include:
- Order details (id, quantity, status, timestamps)
- User info (id, email, name)
- Product info (id, name, price, description)

Example:
```json
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
    "name": "Product Name",
    "price": 99.99,
    "description": "Description"
  }
}
```

## 🔗 Related Endpoints

- **Cart Items**: `/cart-items` - Manage shopping cart
- **Products**: `/products` - Browse products
- **Users**: `/users` - User management

## 📚 Full Documentation

See `src/orders/README.md` for complete API documentation.