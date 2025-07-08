# 📚 GroqGenie API Documentation

## 🔗 Base URL
```
Production: https://your-deployment-url.vercel.app
Development: http://localhost:8000
```

## 🔐 Authentication

All protected endpoints require a JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Or use cookie-based authentication (automatically handled by the frontend).

## 📋 API Endpoints

### 🔑 Authentication Endpoints

#### Register User
```http
POST /api/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "credits": 100,
  "premium": false,
  "plan": "basic",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Login User
```http
POST /api/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "credits": 100,
  "premium": false,
  "plan": "basic"
}
```

#### Get Current User
```http
GET /api/auth/user
```
*Requires Authentication*

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "credits": 100,
  "premium": false,
  "plan": "basic"
}
```

#### Logout
```http
POST /api/logout
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### 🎬 Video Generation Endpoints

#### Optimize Prompt
```http
POST /api/prompt/optimize
```
*Requires Authentication*

**Request Body:**
```json
{
  "prompt": "A cat walking in a garden",
  "style": "realistic",
  "cartoonStyle": "pixar",
  "duration": "5s",
  "cameraMovement": "tracking",
  "lighting": "natural",
  "effects": ["particles", "glow"],
  "realisticLevel": 80,
  "hideTextOnScreen": true
}
```

**Response:**
```json
{
  "optimizedPrompt": "A majestic orange tabby cat gracefully walking through a sunlit garden, soft natural lighting, shallow depth of field, cinematic composition, gentle camera tracking movement, warm golden hour atmosphere, photorealistic details, professional cinematography"
}
```

#### Generate Video
```http
POST /api/video/generate
```
*Requires Authentication*

**Request Body:**
```json
{
  "prompt": "Optimized video prompt",
  "model": "video-01"
}
```

**Response:**
```json
{
  "taskId": "task_abc123",
  "status": "processing",
  "message": "Video generation started"
}
```

#### Check Video Status
```http
GET /api/video/status/:taskId
```
*Requires Authentication*

**Response (Processing):**
```json
{
  "status": "processing",
  "progress": 45,
  "message": "Generating video..."
}
```

**Response (Completed):**
```json
{
  "status": "completed",
  "fileId": "file_xyz789",
  "message": "Video generation completed"
}
```

**Response (Failed):**
```json
{
  "status": "failed",
  "message": "Generation failed: Invalid prompt"
}
```

#### Download Video
```http
GET /api/video/download/:fileId
```
*Requires Authentication*

**Response:**
```json
{
  "downloadUrl": "https://download-url.com/video.mp4"
}
```

### 💰 Credit Management Endpoints

#### Get User Credits
```http
GET /api/credits
```
*Requires Authentication*

**Response:**
```json
{
  "credits": 85,
  "transactions": [
    {
      "id": 1,
      "amount": -15,
      "type": "usage",
      "description": "Video generation",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

#### Add Credits
```http
POST /api/credits/add
```
*Requires Authentication*

**Request Body:**
```json
{
  "amount": 100
}
```

**Response:**
```json
{
  "message": "Credits added successfully",
  "newBalance": 185
}
```

#### Deduct Credits
```http
POST /api/credits/deduct
```
*Requires Authentication*

**Request Body:**
```json
{
  "amount": 15
}
```

**Response:**
```json
{
  "message": "Credits deducted successfully",
  "newBalance": 70
}
```

### 💬 Chat Endpoints

#### Get User Chats
```http
GET /api/chats
```
*Requires Authentication*

**Response:**
```json
[
  {
    "id": 1,
    "title": "Video Creation Chat",
    "icon": "video",
    "model": "llama-3.3-70b-versatile",
    "lastMessage": "How can I create a better video?",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:30:00.000Z"
  }
]
```

#### Create Chat
```http
POST /api/chats
```
*Requires Authentication*

**Request Body:**
```json
{
  "title": "New Video Chat",
  "icon": "video",
  "model": "llama-3.3-70b-versatile",
  "messages": []
}
```

#### Get Chat Messages
```http
GET /api/chats/:id
```
*Requires Authentication*

**Response:**
```json
{
  "id": 1,
  "title": "Video Creation Chat",
  "messages": [
    {
      "role": "user",
      "content": "How do I create a good video prompt?",
      "timestamp": "2024-01-01T10:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "Here are some tips for creating effective video prompts...",
      "timestamp": "2024-01-01T10:01:00.000Z"
    }
  ]
}
```

#### Send Message
```http
POST /api/chats/:id/messages
```
*Requires Authentication*

**Request Body:**
```json
{
  "message": "What camera movements work best for nature videos?",
  "model": "llama-3.3-70b-versatile"
}
```

### 💳 Payment Endpoints

#### Create Checkout Session
```http
POST /api/create-checkout-session
```
*Requires Authentication*

**Request Body:**
```json
{
  "priceId": "price_1234567890"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/session_id"
}
```

#### Handle Webhook
```http
POST /api/webhook
```
*Stripe webhook endpoint for payment processing*

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## 🔄 Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Video generation**: 3 requests per minute
- **Prompt optimization**: 10 requests per minute
- **General API**: 100 requests per minute

## 📝 Error Responses

All error responses follow this format:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

## 🎯 Usage Examples

### JavaScript/TypeScript
```javascript
// Optimize a prompt
const response = await fetch('/api/prompt/optimize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    prompt: 'A sunset over mountains',
    style: 'realistic',
    cameraMovement: 'pan'
  })
});

const data = await response.json();
console.log(data.optimizedPrompt);
```

### Python
```python
import requests

# Generate video
response = requests.post(
    'https://your-app.vercel.app/api/video/generate',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    },
    json={
        'prompt': 'Optimized video prompt',
        'model': 'video-01'
    }
)

data = response.json()
task_id = data['taskId']
```

### cURL
```bash
# Check video status
curl -X GET   "https://your-app.vercel.app/api/video/status/task_abc123"   -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 SDK Integration

For easier integration, consider using our official SDKs:
- JavaScript/TypeScript SDK (coming soon)
- Python SDK (coming soon)
- REST API wrapper libraries

## 📞 Support

For API support and questions:
- Documentation: [API Docs URL]
- Support Email: support@groqgenie.com
- Discord: [Discord Server]
