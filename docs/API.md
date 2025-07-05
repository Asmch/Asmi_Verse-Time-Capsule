# 🔧 AsmiVerse API Documentation

## 📋 Overview

The AsmiVerse API is built with Next.js API Routes and provides endpoints for user authentication, capsule management, file uploads, and admin operations.

**Base URL**: `https://yourdomain.com/api`

## 🔐 Authentication

Most endpoints require authentication. Include the session cookie in your requests.

### **Session Management**
- Uses NextAuth.js with JWT strategy
- Sessions are automatically handled via cookies
- No need to manually include tokens

---

## 👤 User Authentication

### **Register User**
```http
POST /api/users/JoinUs
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "User already exists"
}
```

### **Login User**
```http
POST /api/auth/[...nextauth]
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

### **Logout User**
```http
POST /api/auth/signout
```

---

## 📦 Capsule Management

### **Create Capsule**
```http
POST /api/Capsules
```

**Request Body:**
```json
{
  "title": "Birthday Message",
  "message": "Happy Birthday! Hope you have an amazing day!",
  "recipientName": "Jane Doe",
  "recipientEmail": "jane@example.com",
  "timeLock": "2024-12-31T00:00:00.000Z",
  "password": "optional_password",
  "mediaUrl": "https://res.cloudinary.com/..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Time capsule created successfully",
  "capsule": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Birthday Message",
    "message": "Happy Birthday! Hope you have an amazing day!",
    "recipientName": "Jane Doe",
    "recipientEmail": "jane@example.com",
    "timeLock": "2024-12-31T00:00:00.000Z",
    "isDelivered": false,
    "createdAt": "2024-01-01T10:30:00.000Z"
  },
  "capsuleCount": 5
}
```

### **Get User Capsules**
```http
GET /api/Capsules
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "capsules": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Birthday Message",
      "recipientName": "Jane Doe",
      "recipientEmail": "jane@example.com",
      "timeLock": "2024-12-31T00:00:00.000Z",
      "isDelivered": false,
      "createdAt": "2024-01-01T10:30:00.000Z"
    }
  ]
}
```

### **Get Single Capsule**
```http
GET /api/Capsules/{id}
```

**Response:**
```json
{
  "success": true,
  "capsule": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Birthday Message",
    "message": "Happy Birthday! Hope you have an amazing day!",
    "recipientName": "Jane Doe",
    "recipientEmail": "jane@example.com",
    "timeLock": "2024-12-31T00:00:00.000Z",
    "mediaUrl": "https://res.cloudinary.com/...",
    "isDelivered": false,
    "createdAt": "2024-01-01T10:30:00.000Z"
  }
}
```

### **Update Capsule**
```http
PUT /api/Capsules/{id}
```

**Request Body:**
```json
{
  "title": "Updated Birthday Message",
  "message": "Updated message content"
}
```

### **Delete Capsule**
```http
DELETE /api/Capsules/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "Capsule deleted successfully"
}
```

---

## 📁 File Upload

### **Upload File**
```http
POST /api/upload
```

**Request Body:**
```
Content-Type: multipart/form-data

file: [binary file data]
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/filename.jpg",
  "publicId": "filename"
}
```

**Supported File Types:**
- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, AVI, MOV
- Documents: PDF, DOC, DOCX
- Audio: MP3, WAV

**File Size Limit:** 10MB

---

## 👨‍💼 Admin Endpoints

*All admin endpoints require admin privileges*

### **Get Dashboard Stats**
```http
GET /api/admin/stats
```

**Response:**
```json
{
  "success": true,
  "totalUsers": 150,
  "totalCapsules": 300,
  "unlockedCapsules": 50,
  "newCapsules": 25,
  "newUsers": 10,
  "recentCapsules": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Birthday Message",
      "recipientName": "Jane Doe",
      "recipientEmail": "jane@example.com",
      "createdAt": "2024-01-01T10:30:00.000Z"
    }
  ],
  "recentUsers": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T10:30:00.000Z"
    }
  ]
}
```

### **Get All Users**
```http
GET /api/admin/users?page=1&limit=10&search=john
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "isAdmin": false,
      "isBanned": false,
      "createdAt": "2024-01-01T10:30:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

### **Get All Capsules**
```http
GET /api/admin/capsules?page=1&limit=10&search=birthday
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title, recipient name, or email

**Response:**
```json
{
  "success": true,
  "capsules": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Birthday Message",
      "recipientName": "Jane Doe",
      "recipientEmail": "jane@example.com",
      "timeLock": "2024-12-31T00:00:00.000Z",
      "isDelivered": false,
      "createdAt": "2024-01-01T10:30:00.000Z"
    }
  ],
  "total": 300,
  "page": 1,
  "limit": 10,
  "totalPages": 30
}
```

### **Ban/Unban User**
```http
PATCH /api/admin/users
```

**Request Body:**
```json
{
  "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "action": "ban"
}
```

**Available Actions:**
- `ban` - Ban user
- `unban` - Unban user
- `makeAdmin` - Grant admin privileges
- `removeAdmin` - Remove admin privileges

**Response:**
```json
{
  "success": true,
  "message": "User banned successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "isBanned": true
  }
}
```

### **Delete Capsule (Admin)**
```http
DELETE /api/admin/capsules?id={capsuleId}
```

**Response:**
```json
{
  "success": true,
  "message": "Capsule deleted successfully"
}
```

### **Get Reports**
```http
GET /api/admin/reports
```

**Response:**
```json
{
  "success": true,
  "flaggedCapsules": [],
  "flaggedUsers": []
}
```

---

## 📧 Email Management

### **Send Test Email**
```http
POST /api/test-email
```

**Request Body:**
```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "message": "This is a test email"
}
```

---

## 🔍 Error Responses

### **Authentication Error**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```
**Status Code:** 401

### **Validation Error**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "timeLock": "Date must be in the future"
  }
}
```
**Status Code:** 400

### **Not Found Error**
```json
{
  "success": false,
  "error": "Capsule not found"
}
```
**Status Code:** 404

### **Server Error**
```json
{
  "success": false,
  "error": "Internal server error"
}
```
**Status Code:** 500

---

## 📊 Rate Limiting

- **General API:** 100 requests per 15 minutes per IP
- **Authentication:** 5 requests per 15 minutes per IP
- **File Upload:** 10 requests per 15 minutes per IP

---

## 🔒 Security

### **CORS Policy**
- Allowed Origins: Your domain and localhost:3000
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed Headers: Content-Type, Authorization

### **Data Validation**
- All inputs are validated server-side
- SQL injection prevention (MongoDB + Mongoose)
- XSS prevention with input sanitization
- File type and size validation

### **Authentication**
- JWT tokens with expiration
- Secure session management
- Password hashing with bcrypt
- Admin-only endpoint protection

---

## 📝 Usage Examples

### **JavaScript/Node.js**
```javascript
// Create a capsule
const createCapsule = async (capsuleData) => {
  const response = await fetch('/api/Capsules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(capsuleData)
  });
  
  return await response.json();
};

// Upload a file
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
};
```

### **cURL**
```bash
# Create a capsule
curl -X POST http://localhost:3000/api/Capsules \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Capsule",
    "message": "Hello from the future!",
    "recipientName": "John Doe",
    "recipientEmail": "john@example.com",
    "timeLock": "2024-12-31T00:00:00.000Z"
  }'

# Get user capsules
curl -X GET http://localhost:3000/api/Capsules
```

---

## 📞 Support

For API support, please contact:
- **Email**: api-support@asmiverse.com
- **Documentation**: [https://docs.asmiverse.com](https://docs.asmiverse.com)
- **GitHub Issues**: [https://github.com/yourusername/asmiverse/issues](https://github.com/yourusername/asmiverse/issues) 