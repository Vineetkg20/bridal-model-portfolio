# ✦ API CONVENTIONS & CONTRACT STANDARDS

**Project:** Bridal Model Editorial Portfolio (Mehak Sharma)  
**Date:** 2026-10-27  

---

## 1. RESTful URL & Method Standards

All API routes are prefixed under `/api/`.

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Lightweight service liveness check | Public |
| `POST` | `/api/inquiries` | Submit client booking inquiry | Public (Rate-Limited) |
| `GET` | `/api/content` | Fetch live published portfolio content | Public |
| `PUT` | `/api/content` | Update live published portfolio content | Admin Bearer Token |

---

## 2. Standardized JSON Envelope Formats

### 2.1 Success Response Schema
```json
{
  "success": true,
  "data": {
    "inquiryId": "inq_9847192348",
    "status": "received",
    "createdAt": "2026-10-27T21:30:00Z"
  },
  "meta": {
    "requestId": "req_01jh89f3abc"
  }
}
```

### 2.2 Error Response Schema
Every error response returns a structured, safe JSON envelope with an actionable error code and tracking correlation ID. Internal stack traces or database errors are never exposed.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid input fields.",
    "details": [
      {
        "field": "email",
        "issue": "Invalid email address format"
      },
      {
        "field": "eventDate",
        "issue": "Event date must be in the future"
      }
    ],
    "requestId": "req_01jh89f3abc"
  }
}
```

---

## 3. Standard HTTP Status Codes

- `200 OK`: Successful read or update.
- `201 Created`: Successful resource creation (e.g. inquiry submitted).
- `400 Bad Request`: Validation failure or malformed JSON payload.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Authenticated user lacks permission.
- `404 Not Found`: Resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded (includes `Retry-After` header).
- `500 Internal Server Error`: Unexpected server exception (redacted safe message returned).
