# API Documentation

This document describes the REST API endpoints for the Marketplace application.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required for these endpoints. In production, consider implementing:
- API key authentication
- JWT tokens for user sessions
- Rate limiting

## Endpoints

### Listings API

#### GET /api/listings
Browse listings with optional search and filtering.

**Query Parameters:**
- `category` (optional): Filter by category (e.g., "Electronics", "Vehicles")
- `search` (optional): Search in title and description
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example Request:**
```bash
GET /api/listings?category=Electronics&search=laptop&limit=10&offset=0
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "title": "MacBook Pro 2023",
      "price": "$1,299",
      "description": "Excellent condition laptop",
      "category": "Electronics",
      "location": "San Francisco, CA",
      "email": "seller@example.com",
      "image_url": "https://...",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### POST /api/listings
Create a new listing.

**Request Body:**
```json
{
  "title": "MacBook Pro 2023",
  "price": "$1,299",
  "email": "seller@example.com",
  "description": "Excellent condition laptop",
  "category": "Electronics",
  "location": "San Francisco, CA",
  "image_url": "https://..." // optional
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "124",
    "title": "MacBook Pro 2023",
    "price": "$1,299",
    "email": "seller@example.com",
    "description": "Excellent condition laptop",
    "category": "Electronics",
    "location": "San Francisco, CA",
    "image_url": "https://...",
    "created_at": "2025-01-15T10:30:00Z"
  },
  "message": "Listing created successfully"
}
```

### Individual Listing API

#### GET /api/listings/[id]
Get a specific listing by ID.

**Example Request:**
```bash
GET /api/listings/123
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "title": "MacBook Pro 2023",
    "price": "$1,299",
    "description": "Excellent condition laptop",
    "category": "Electronics",
    "location": "San Francisco, CA",
    "email": "seller@example.com",
    "image_url": "https://...",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### PUT /api/listings/[id]
Update a specific listing.

**Request Body:**
```json
{
  "title": "Updated MacBook Pro 2023",
  "price": "$1,199",
  "description": "Updated description"
}
```

#### DELETE /api/listings/[id]
Delete a specific listing.

**Example Response:**
```json
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

### Messages API

#### GET /api/messages
Get messages for a listing or seller.

**Query Parameters:**
- `listing_id` (optional): Get messages for specific listing
- `seller_email` (optional): Get messages for specific seller
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Example Request:**
```bash
GET /api/messages?listing_id=123&limit=20
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-456",
      "listing_id": "123",
      "buyer_name": "John Doe",
      "buyer_email": "buyer@example.com",
      "message": "Is this still available?",
      "seller_email": "seller@example.com",
      "created_at": "2025-01-15T11:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

#### POST /api/messages
Send a message to a seller.

**Request Body:**
```json
{
  "listing_id": "123",
  "buyer_name": "John Doe",
  "buyer_email": "buyer@example.com",
  "message": "Is this still available?",
  "seller_email": "seller@example.com"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg-457",
    "listing_id": "123",
    "buyer_name": "John Doe",
    "buyer_email": "buyer@example.com",
    "message": "Is this still available?",
    "seller_email": "seller@example.com",
    "created_at": "2025-01-15T11:00:00Z"
  },
  "message": "Message sent successfully"
}
```

### Upload API

#### POST /api/upload
Upload an image file to storage.

**Request:** Multipart form data with `file` field

**Example Request:**
```bash
curl -X POST \
  -F "file=@image.jpg" \
  http://localhost:3000/api/upload
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "listing-1642248000000-abc123.jpg",
    "url": "https://supabase-url/storage/v1/object/public/listing-images/listing-1642248000000-abc123.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  },
  "message": "File uploaded successfully"
}
```

#### DELETE /api/upload
Delete an uploaded image.

**Query Parameters:**
- `fileName` (required): Name of file to delete

**Example Request:**
```bash
DELETE /api/upload?fileName=listing-1642248000000-abc123.jpg
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Consider implementing rate limiting in production:
- 100 requests per minute per IP for GET requests
- 10 requests per minute per IP for POST/PUT/DELETE requests

## Security Considerations

For production deployment:
1. Implement authentication and authorization
2. Add input sanitization and validation
3. Use HTTPS only
4. Implement rate limiting
5. Add request logging and monitoring
6. Validate file uploads more strictly
7. Implement CORS policies
