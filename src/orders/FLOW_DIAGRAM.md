# Cart-to-Order Flow Diagram

## 🛒 Complete E-Commerce Flow

```
┌─────────────┐
│   Browser   │
│   /Client   │
└──────┬──────┘
       │
       │ 1. Add items to cart
       ▼
┌─────────────────────────────────────────────────────────┐
│                    CART PHASE                            │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  POST /cart-items                                        │
│  {                                                        │
│    user_id: "uuid",                                      │
│    product_id: "uuid",                                   │
│    quantity: 2                                           │
│  }                                                        │
│                                                           │
│  ┌─────────────────────────────────────┐                │
│  │     cart_items TABLE                 │                │
│  ├─────────────────────────────────────┤                │
│  │ id        | uuid                     │                │
│  │ user_id   | uuid (FK → User)        │                │
│  │ product_id| uuid (FK → Product)     │                │
│  │ quantity  | 2                        │                │
│  │ createdAt | timestamp                │                │
│  └─────────────────────────────────────┘                │
│                                                           │
│  User can:                                               │
│  • GET /cart-items (view cart)                          │
│  • PATCH /cart-items/:id (update quantity)              │
│  • DELETE /cart-items/:id (remove item)                 │
│                                                           │
└───────────────────────┬───────────────────────────────┘
                        │
                        │ 2. Ready to checkout
                        ▼
                ┌──────────────────┐
                │   CHECKOUT API   │
                │ POST /orders/    │
                │      checkout    │
                └────────┬─────────┘
                         │
        ┌────────────────┴─────────────────┐
        │                                   │
        │ 3. Process Checkout               │
        │    • Validate user exists         │
        │    • Get all cart items           │
        │    • Check cart not empty         │
        │    • Create orders from cart      │
        │    • Clear cart                   │
        │                                   │
        └────────────────┬─────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    ORDER PHASE                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Cart Item 1 → Order 1                                   │
│  Cart Item 2 → Order 2                                   │
│  Cart Item 3 → Order 3                                   │
│                                                           │
│  ┌─────────────────────────────────────┐                │
│  │     Order TABLE                      │                │
│  ├─────────────────────────────────────┤                │
│  │ id        | uuid                     │                │
│  │ user_id   | uuid (FK → User)        │                │
│  │ product_id| uuid (FK → Product)     │                │
│  │ quantity  | 2                        │                │
│  │ status    | "pending"                │                │
│  │ createdAt | timestamp                │                │
│  └─────────────────────────────────────┘                │
│                                                           │
│  Cart is now EMPTY ✓                                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
       │
       │ 4. Track orders
       ▼
┌──────────────────────────────────────────────────────────┐
│              ORDER MANAGEMENT                             │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  GET /orders/user/:userId                                 │
│  → View all orders                                        │
│                                                            │
│  GET /orders/user/:userId/stats                          │
│  → View statistics                                        │
│                                                            │
│  PATCH /orders/:id                                        │
│  { status: "processing" }                                │
│  → Update status                                          │
│                                                            │
│  PATCH /orders/:id/cancel                                │
│  → Cancel order                                           │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

## 📊 Order Status Lifecycle

```
┌─────────┐
│ pending │ ◄── Created via checkout or direct order
└────┬────┘
     │
     ▼
┌────────────┐
│ processing │ ◄── Order accepted, being prepared
└─────┬──────┘
      │
      ▼
┌─────────┐
│ shipped │ ◄── Order dispatched to customer
└────┬────┘
     │
     ▼
┌───────────┐
│ delivered │ ◄── Order received by customer [FINAL]
└───────────┘

     │
     └──────► ┌───────────┐
               │ cancelled │ ◄── Can cancel before delivery
               └───────────┘
```

## 🔄 Data Flow Diagram

```
┌──────────┐        ┌──────────────┐        ┌──────────┐
│   User   │───────►│  cart_items  │───────►│  Orders  │
│  Table   │        │    Table     │        │  Table   │
└──────────┘        └──────────────┘        └──────────┘
     │                     │                      │
     │                     │                      │
     └─────────────────────┴──────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Product    │
                    │    Table     │
                    └──────────────┘

Relationships:
• User → cart_items (one-to-many)
• User → Orders (one-to-many)
• Product → cart_items (one-to-many)
• Product → Orders (one-to-many)
```

## 🎯 Checkout Process (Detailed)

```
┌─────────────────────────────────────────────────────────┐
│ POST /orders/checkout                                    │
│ Body: { user_id: "uuid" }                               │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │ Validate User │
            └───────┬───────┘
                    │
                    ├─► User not found? → 404 Error
                    │
                    ▼
        ┌─────────────────────┐
        │ Get Cart Items      │
        │ WHERE user_id = X   │
        └───────┬─────────────┘
                │
                ├─► Cart empty? → 400 Error
                │
                ▼
        ┌─────────────────────────┐
        │ FOR EACH cart_item:     │
        │                          │
        │  1. Create Order {      │
        │       user_id           │
        │       product_id        │
        │       quantity          │
        │       status: "pending" │
        │     }                    │
        │                          │
        │  2. Add to orders[]     │
        └───────┬─────────────────┘
                │
                ▼
        ┌─────────────────────────┐
        │ Delete All Cart Items   │
        │ WHERE user_id = X       │
        └───────┬─────────────────┘
                │
                ▼
        ┌─────────────────────────┐
        │ Return Created Orders   │
        │ Status: 201             │
        └─────────────────────────┘
```

## 🔍 Service Method Interactions

```
OrdersService Methods:
┌────────────────────────────────────────────────────────┐
│                                                         │
│  create()              → Create single order           │
│  ↓                                                      │
│  • Validate user                                       │
│  • Validate product                                    │
│  • Create order with relations                         │
│                                                         │
│  checkout() ⭐         → Convert cart to orders        │
│  ↓                                                      │
│  • Validate user                                       │
│  • Get all cart items                                  │
│  • Loop: create order for each item                    │
│  • Clear cart                                          │
│                                                         │
│  findAll()            → Get all orders                 │
│  findByUserId()       → Get user's orders              │
│  findOne()            → Get single order               │
│                                                         │
│  update()             → Update order                   │
│  cancel()             → Cancel order (status change)   │
│  remove()             → Delete order                   │
│                                                         │
│  getUserOrderStats()  → Calculate statistics           │
│  ↓                                                      │
│  • Total orders                                        │
│  • Total spent (quantity × price)                      │
│  • Status breakdown                                    │
│                                                         │
└────────────────────────────────────────────────────────┘
```

## 🗄️ Database Schema Relationships

```
┌─────────────────────┐
│      User           │
│ ─────────────────── │
│ id: String (PK)     │◄────────┐
│ email: String       │         │
│ name: String?       │         │
└─────────────────────┘         │
         ▲                       │
         │                       │
         │ user_id               │ user_id
         │                       │
         │                       │
┌────────┴──────────┐  ┌────────┴──────────┐
│   cart_items      │  │      Order        │
│ ───────────────── │  │ ───────────────── │
│ id: String (PK)   │  │ id: String (PK)   │
│ user_id: String   │  │ user_id: String   │
│ product_id: String│  │ product_id: String│
│ quantity: Int     │  │ quantity: Int     │
│ createdAt: Date   │  │ status: String    │
│ updatedAt: Date   │  │ createdAt: Date   │
└─────────┬─────────┘  │ updatedAt: Date   │
          │            └─────────┬─────────┘
          │ product_id           │ product_id
          │                      │
          │                      │
          └──────────┬───────────┘
                     ▼
          ┌─────────────────────┐
          │      Product        │
          │ ─────────────────── │
          │ id: String (PK)     │
          │ name: String        │
          │ price: Float        │
          │ description: String?│
          └─────────────────────┘

Key:
PK = Primary Key
FK = Foreign Key (shown as connection lines)
? = Optional field
```

## 🎬 Real-World Example

```
Scenario: User buys 2 products

Step 1: Add to Cart
──────────────────────
POST /cart-items
{ user_id: "john-123", product_id: "laptop-456", quantity: 1 }

POST /cart-items
{ user_id: "john-123", product_id: "mouse-789", quantity: 2 }

Current State:
cart_items table has 2 rows

Step 2: Checkout
────────────────
POST /orders/checkout
{ user_id: "john-123" }

Process:
1. Find user "john-123" ✓
2. Get cart items (2 items found) ✓
3. Create Order #1 (laptop × 1) ✓
4. Create Order #2 (mouse × 2) ✓
5. Delete all cart items ✓

Result:
• Orders table has 2 new rows
• cart_items table is empty
• Returns array of 2 orders

Step 3: Track Orders
────────────────────
GET /orders/user/john-123
→ Returns 2 orders

GET /orders/user/john-123/stats
→ {
    totalOrders: 2,
    totalSpent: 1149.97,
    statusCounts: { pending: 2 }
  }

Step 4: Update Status
────────────────────
PATCH /orders/order-1-id
{ status: "processing" }

PATCH /orders/order-1-id
{ status: "shipped" }

PATCH /orders/order-1-id
{ status: "delivered" }

Final State:
• Order #1: delivered
• Order #2: pending
```

## 💡 Key Takeaways

1. **One-Way Flow**: Cart → Orders (not reversible)
2. **Atomic Operation**: Checkout is all-or-nothing
3. **Auto-Clear**: Cart empties after successful checkout
4. **One Order Per Item**: Each cart item becomes separate order
5. **Status Tracking**: Orders progress through lifecycle
6. **User-Centric**: All operations tied to user_id
7. **Rich Relations**: Responses include user + product data

## 🔗 Integration Points

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Products   │────►│  Cart Items  │────►│   Orders    │
│   Module    │     │    Module    │     │   Module    │
└─────────────┘     └──────────────┘     └─────────────┘
      │                     │                    │
      │                     │                    │
      └─────────────────────┴────────────────────┘
                            │
                      ┌─────▼──────┐
                      │   Users    │
                      │   Module   │
                      └────────────┘
```

All modules interact through:
- Shared DatabaseService (Prisma)
- Consistent UUID format
- Standardized error handling
- RESTful API conventions