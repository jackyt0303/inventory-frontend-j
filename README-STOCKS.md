# 📦 Stock Management API Documentation

This document provides comprehensive documentation for all stock-related endpoints in the Inventory Backend API.

## 🚀 Base URL
```
http://localhost:3333/api/stocks
```

## 🔐 Authentication
All write operations (POST, PUT, PATCH, DELETE) require authentication using Supabase JWT tokens. 

### How to Authenticate:
1. **Sign in through your Supabase client application**
2. **Extract the JWT token from the session**
3. **Include it in the Authorization header**

### Example Authentication Flow:

**JavaScript/TypeScript (Frontend):**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('your-supabase-url', 'your-supabase-anon-key')

// Sign in user
const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Use the session token for API calls
const token = session.access_token

// Make authenticated API request
const response = await fetch('http://localhost:3333/api/stocks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    product_id: 'ITEM001',
    product_name: 'New Item',
    quantity: 100,
    unit_price: 29.99
  })
})
```

**cURL Example:**
```bash
# First get your token from Supabase session, then:
curl -X POST "http://localhost:3333/api/stocks" \
  -H "Authorization: Bearer your-supabase-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"product_id": "ITEM001", "quantity": 100}'
```

### Authentication Responses:
- **✅ Success**: Request proceeds with user info attached
- **❌ Missing token**: `401 {"error": "Authentication required"}`
- **❌ Invalid token**: `401 {"error": "Invalid token"}`

## 📊 Rate Limiting
- **General endpoints**: 100 requests per 15 minutes
- **Write operations**: 30 requests per 15 minutes  
- **Bulk operations**: 10 requests per hour

---

## 📋 Table of Contents
1. [General Endpoints](#general-endpoints)
2. [Analytics & Reports](#analytics--reports)
3. [CRUD Operations](#crud-operations)
4. [Search & Filtering](#search--filtering)
5. [Bulk Operations](#bulk-operations)
6. [Error Handling](#error-handling)
7. [Response Format](#response-format)

---

## 🏠 General Endpoints

### Check API Status
**GET** `/`

Check if the stocks API is running and Supabase connection is established.

```bash
curl -X GET "http://localhost:3333/api/stocks/"
```

**Response:**
```
Supabase connection is established
```

### Test Endpoint with Pagination
**GET** `/test?page=1&limit=5`

Test endpoint that returns paginated stock data.

```bash
curl -X GET "http://localhost:3333/api/stocks/test?page=1&limit=5"
```

**Response:**
```json
{
  "data": [
    {
      "id": "cb87d4b8-9e34-457f-9277-d56ed5985798",
      "product_name": "Laptop Computer",
      "product_id": "LAP001",
      "quantity": 25,
      "unit_price": 899.99,
      "supplier": "Tech Supplier Inc",
      "branch_id": "550e8400-e29b-41d4-a716-446655440001",
      "created_at": "2025-05-27T13:39:44.435698+00:00",
      "updated_at": "2025-05-27T13:39:44.435698+00:00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 11,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 📊 Analytics & Reports

### Total Inventory Value
**GET** `/total-inventory-value`

Calculate the total value of all inventory items.

```bash
curl -X GET "http://localhost:3333/api/stocks/total-inventory-value"
```

**Response:**
```json
{
  "total_inventory_value": 56366.61,
  "currency": "USD",
  "items_counted": 11
}
```

### Stock Item Counts
**GET** `/total-stock-item-counts`

Get total quantities and product counts across all inventory.

```bash
curl -X GET "http://localhost:3333/api/stocks/total-stock-item-counts"
```

**Response:**
```json
{
  "total_items": 849,
  "unique_products": 11,
  "average_quantity_per_product": 77.18
}
```

### Low Stock Alerts
**GET** `/alerts/low-stock?threshold=20&page=1&limit=10`

Get items with stock below specified threshold.

**Parameters:**
- `threshold` (optional): Stock level threshold (default: 10)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

```bash
curl -X GET "http://localhost:3333/api/stocks/alerts/low-stock?threshold=20&page=1&limit=3"
```

**Response:**
```json
{
  "threshold": 20,
  "low_stock_items": [
    {
      "id": "b1155aca-69ad-4573-b74f-737fb43a8d4d",
      "product_name": "Filing Cabinet",
      "product_id": "FIL001",
      "quantity": 6,
      "unit_price": 149.99,
      "supplier": "Storage Solutions",
      "branch_id": "550e8400-e29b-41d4-a716-446655440003"
    }
  ],
  "count": 5,
  "pagination": {
    "page": 1,
    "limit": 3,
    "total": 5,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Comprehensive Analytics
**GET** `/analytics/summary`

Get comprehensive inventory analytics including supplier stats, branch breakdown, and top items.

```bash
curl -X GET "http://localhost:3333/api/stocks/analytics/summary"
```

**Response:**
```json
{
  "overview": {
    "total_products": 11,
    "total_quantity": 849,
    "total_value": 56366.61,
    "average_unit_price": 266.99
  },
  "suppliers": [
    {
      "name": "Tech Supplier Inc",
      "products": 3,
      "total_quantity": 185,
      "total_value": 38998.25
    }
  ],
  "branches": [
    {
      "branch_id": "550e8400-e29b-41d4-a716-446655440001",
      "products": 7,
      "total_quantity": 480,
      "total_value": 43770.3
    }
  ],
  "top_items": {
    "most_expensive": [...],
    "highest_quantity": [...],
    "lowest_quantity": [...]
  }
}
```

---

## 🔧 CRUD Operations

### Create Stock Item
**POST** `/` 🔐

Create a new stock item.

**Required Headers:**
```
Authorization: Bearer your-token-here
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_name": "Gaming Mouse",
  "product_id": "MOU002",
  "quantity": 50,
  "unit_price": 79.99,
  "supplier": "Gaming Gear Co",
  "branch_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

```bash
curl -X POST "http://localhost:3333/api/stocks/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "product_name": "Gaming Mouse",
    "product_id": "MOU002",
    "quantity": 50,
    "unit_price": 79.99,
    "supplier": "Gaming Gear Co",
    "branch_id": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

**Response:**
```json
{
  "message": "Stock item created successfully",
  "data": {
    "id": "d3670cbf-ada2-4515-9c7f-b1ee3840fb38",
    "product_name": "Gaming Mouse",
    "product_id": "MOU002",
    "quantity": 50,
    "unit_price": 79.99,
    "supplier": "Gaming Gear Co",
    "branch_id": "550e8400-e29b-41d4-a716-446655440001",
    "created_at": "2025-06-04T15:15:04.67929+00:00",
    "updated_at": "2025-06-04T15:15:04.67929+00:00"
  }
}
```

### Get Stock Item by ID
**GET** `/:id`

Retrieve a specific stock item by its ID.

```bash
curl -X GET "http://localhost:3333/api/stocks/cb87d4b8-9e34-457f-9277-d56ed5985798"
```

**Response:**
```json
{
  "id": "cb87d4b8-9e34-457f-9277-d56ed5985798",
  "product_name": "Laptop Computer",
  "product_id": "LAP001",
  "quantity": 25,
  "unit_price": 899.99,
  "supplier": "Tech Supplier Inc",
  "branch_id": "550e8400-e29b-41d4-a716-446655440001",
  "created_at": "2025-05-27T13:39:44.435698+00:00",
  "updated_at": "2025-05-27T13:39:44.435698+00:00",
  "total_value": 22499.75
}
```

### Update Stock Item
**PUT** `/:id` 🔐

Update an existing stock item.

```bash
curl -X PUT "http://localhost:3333/api/stocks/cb87d4b8-9e34-457f-9277-d56ed5985798" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "product_name": "Premium Laptop Computer",
    "unit_price": 999.99
  }'
```

**Response:**
```json
{
  "message": "Stock item updated successfully",
  "data": {
    "id": "cb87d4b8-9e34-457f-9277-d56ed5985798",
    "product_name": "Premium Laptop Computer",
    "unit_price": 999.99,
    ...
  }
}
```

### Update Stock Quantity
**PATCH** `/:id/quantity` 🔐

Quick quantity updates with different operations.

**Operations:**
- `set`: Set exact quantity
- `add`: Add to current quantity
- `subtract`: Subtract from current quantity

```bash
# Add 10 units
curl -X PATCH "http://localhost:3333/api/stocks/cb87d4b8-9e34-457f-9277-d56ed5985798/quantity" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "quantity": 10,
    "operation": "add"
  }'

# Set to exact quantity
curl -X PATCH "http://localhost:3333/api/stocks/cb87d4b8-9e34-457f-9277-d56ed5985798/quantity" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "quantity": 50,
    "operation": "set"
  }'
```

**Response:**
```json
{
  "message": "Stock quantity updated successfully",
  "previous_quantity": 25,
  "new_quantity": 35,
  "data": {
    "id": "cb87d4b8-9e34-457f-9277-d56ed5985798",
    "quantity": 35,
    ...
  }
}
```

### Delete Stock Item
**DELETE** `/:id` 🔐

Delete a stock item by ID.

```bash
curl -X DELETE "http://localhost:3333/api/stocks/cb87d4b8-9e34-457f-9277-d56ed5985798" \
  -H "Authorization: Bearer your-token-here"
```

**Response:**
```json
{
  "message": "Stock item deleted successfully",
  "deleted_item": {
    "id": "cb87d4b8-9e34-457f-9277-d56ed5985798",
    "product_name": "Laptop Computer",
    ...
  }
}
```

---

## 🔍 Search & Filtering

### Search Products
**GET** `/search/:searchTerm?page=1&limit=10`

Search products by name or product ID.

```bash
curl -X GET "http://localhost:3333/api/stocks/search/laptop?page=1&limit=5"
```

**Response:**
```json
{
  "search_term": "laptop",
  "results": [
    {
      "id": "cb87d4b8-9e34-457f-9277-d56ed5985798",
      "product_name": "Laptop Computer",
      "product_id": "LAP001",
      ...
    }
  ],
  "count": 2,
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### Filter by Supplier
**GET** `/supplier/:supplier?page=1&limit=10`

Get all products from a specific supplier.

```bash
curl -X GET "http://localhost:3333/api/stocks/supplier/Tech%20Supplier%20Inc?page=1&limit=10"
```

**Response:**
```json
{
  "supplier": "Tech Supplier Inc",
  "products": [...],
  "summary": {
    "total_products": 3,
    "total_quantity": 185,
    "total_value": 38998.25
  },
  "pagination": {...}
}
```

### Filter by Branch
**GET** `/branch/:branchId?page=1&limit=10`

Get all products in a specific branch.

```bash
curl -X GET "http://localhost:3333/api/stocks/branch/550e8400-e29b-41d4-a716-446655440001?page=1&limit=10"
```

**Response:**
```json
{
  "branch_id": "550e8400-e29b-41d4-a716-446655440001",
  "products": [...],
  "summary": {
    "total_products": 7,
    "total_quantity": 480,
    "total_value": 43770.3
  },
  "pagination": {...}
}
```

---

## 📦 Bulk Operations

### Bulk Create Items
**POST** `/bulk` 🔐

Create multiple stock items in a single request.

```bash
curl -X POST "http://localhost:3333/api/stocks/bulk" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "items": [
      {
        "product_name": "Wireless Keyboard",
        "product_id": "KEY001",
        "quantity": 75,
        "unit_price": 49.99,
        "supplier": "Input Devices Co",
        "branch_id": "550e8400-e29b-41d4-a716-446655440001"
      },
      {
        "product_name": "USB Drive 32GB",
        "product_id": "USB001",
        "quantity": 200,
        "unit_price": 12.99,
        "supplier": "Storage Solutions",
        "branch_id": "550e8400-e29b-41d4-a716-446655440002"
      }
    ]
  }'
```

**Response:**
```json
{
  "message": "Stock items created successfully",
  "created_count": 2,
  "data": [
    {
      "id": "fd2c7e2e-2f4c-4195-b999-f3b3e1454314",
      "product_name": "Wireless Keyboard",
      ...
    },
    {
      "id": "98d0a7bf-973e-44cc-b757-ab26a75720a4",
      "product_name": "USB Drive 32GB",
      ...
    }
  ]
}
```

### Bulk Delete by IDs
**DELETE** `/bulk/by-ids` 🔐

Delete multiple items by providing their IDs.

```bash
curl -X DELETE "http://localhost:3333/api/stocks/bulk/by-ids" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "ids": [
      "fd2c7e2e-2f4c-4195-b999-f3b3e1454314",
      "98d0a7bf-973e-44cc-b757-ab26a75720a4"
    ]
  }'
```

**Response:**
```json
{
  "message": "Stock items deleted successfully",
  "deleted_count": 2,
  "deleted_items": [...]
}
```

### Delete by Supplier (⚠️ Dangerous)
**DELETE** `/supplier/:supplier?confirm=true` 🔐

Delete all items from a specific supplier. **Requires confirmation**.

```bash
curl -X DELETE "http://localhost:3333/api/stocks/supplier/Old%20Supplier?confirm=true" \
  -H "Authorization: Bearer your-token-here"
```

**Response:**
```json
{
  "message": "All stock items from supplier 'Old Supplier' deleted successfully",
  "deleted_count": 5,
  "deleted_items": [...]
}
```

### Upsert Operation
**POST** `/upsert` 🔐

Create a new item or update existing one based on `product_id`.

```bash
curl -X POST "http://localhost:3333/api/stocks/upsert" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token-here" \
  -d '{
    "product_name": "Updated Product",
    "product_id": "EXISTING001",
    "quantity": 100,
    "unit_price": 29.99,
    "supplier": "Updated Supplier",
    "branch_id": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

---

## ⚠️ Error Handling

### Common Error Responses

**Authentication Required (401):**
```json
{
  "error": "Authentication required",
  "message": "Please provide a valid Bearer token in the Authorization header"
}
```

**Validation Error (400):**
```json
{
  "error": "Validation failed",
  "details": [
    "product_name is required and must be a string",
    "quantity must be a non-negative number"
  ]
}
```

**Not Found (404):**
```json
{
  "error": "Stock item not found"
}
```

**Rate Limit Exceeded (429):**
```json
{
  "error": "Too many requests from this IP",
  "retryAfter": "15 minutes"
}
```

**Server Error (500):**
```json
{
  "error": "Database operation failed"
}
```

---

## 📄 Response Format

### Pagination Parameters
All paginated endpoints accept these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)

### Pagination Response Structure
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Stock Item Structure
```json
{
  "id": "uuid",
  "product_name": "string",
  "product_id": "string", 
  "quantity": "number",
  "unit_price": "number",
  "supplier": "string",
  "branch_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

## 🛡️ Security Features

- **Rate Limiting**: Multi-tier protection against abuse
- **Input Sanitization**: All inputs are sanitized to prevent injection attacks
- **Authentication**: Required for all write operations
- **Validation**: Comprehensive input validation with detailed error messages
- **Error Handling**: Secure error messages that don't leak sensitive information

---

## 📚 Common Use Cases

### 1. Inventory Dashboard
```bash
# Get overview analytics
curl -X GET "http://localhost:3333/api/stocks/analytics/summary"

# Check low stock items
curl -X GET "http://localhost:3333/api/stocks/alerts/low-stock?threshold=10"

# Get total inventory value
curl -X GET "http://localhost:3333/api/stocks/total-inventory-value"
```

### 2. Stock Management
```bash
# Add new stock
curl -X POST "http://localhost:3333/api/stocks/" \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"product_name":"New Item","product_id":"NEW001",...}'

# Update quantity when stock arrives
curl -X PATCH "http://localhost:3333/api/stocks/item-id/quantity" \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"quantity":50,"operation":"add"}'

# Update quantity when items are sold
curl -X PATCH "http://localhost:3333/api/stocks/item-id/quantity" \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"quantity":5,"operation":"subtract"}'
```

### 3. Reporting
```bash
# Get supplier performance
curl -X GET "http://localhost:3333/api/stocks/supplier/Tech%20Supplier%20Inc"

# Get branch inventory
curl -X GET "http://localhost:3333/api/stocks/branch/branch-id"

# Search for specific products
curl -X GET "http://localhost:3333/api/stocks/search/laptop"
```

### 4. Bulk Operations
```bash
# Import new inventory
curl -X POST "http://localhost:3333/api/stocks/bulk" \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"items":[...]}'

# Clean up discontinued items
curl -X DELETE "http://localhost:3333/api/stocks/bulk/by-ids" \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"ids":["id1","id2","id3"]}'
```

---

## 🔧 Development Notes

- All endpoints use proper HTTP status codes
- Input validation prevents invalid data entry
- Pagination helps handle large datasets efficiently
- Rate limiting prevents API abuse
- Comprehensive error messages aid debugging
- All string inputs are sanitized for security

For additional help or feature requests, please refer to the main API documentation or contact the development team.

## ✅ Authentication Migration Complete

**What Changed:**
- ❌ **Removed**: Complex custom JWT/API key authentication system (440+ lines)
- ✅ **Added**: Simple Supabase JWT token validation (~50 lines)
- 🔄 **Updated**: All 8 protected routes now use `supabaseAuth` middleware
- 📚 **Enhanced**: Documentation with complete authentication examples

**Benefits:**
- **Simplified**: No more custom JWT generation, API key hashing, or session management
- **Secure**: Leverages Supabase's robust authentication infrastructure
- **Maintainable**: Minimal code footprint with clear error handling
- **Scalable**: Handles user management, password resets, social logins via Supabase

**Testing Verified:**
- ✅ Unprotected endpoints work without authentication
- ✅ Protected endpoints require valid Bearer tokens
- ✅ Invalid tokens return proper 401 errors
- ✅ Missing tokens return clear error messages
- ✅ Rate limiting continues to function correctly

---
