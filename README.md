# Donation Box Management API

A comprehensive RESTful API backend for managing donation boxes, areas, volunteers, and collection records. Built with Node.js, Express, TypeScript, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Areas](#areas)
  - [Boxes](#boxes)
  - [Collections](#collections)
  - [Users](#users)
- [Error Handling](#error-handling)
- [Development](#development)
- [Production Deployment](#production-deployment)

## Overview

This API provides a complete backend solution for managing a donation box system with the following features:

- **User Management**: Admin and volunteer roles with different permission levels
- **Area Management**: Organize donation boxes by geographical areas
- **Box Management**: Track donation boxes with location, caretaker, and volunteer assignment
- **Collection Tracking**: Record collection visits with amounts, visit types, and notes
- **Role-Based Access Control**: Secure endpoints with JWT authentication and role-based permissions

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript 5.3.3
- **Database**: MongoDB (via Mongoose 9.0.0)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 3.0.3
- **CORS**: Enabled for cross-origin requests

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud instance like MongoDB Atlas)
- **Git** (for cloning the repository)

## Installation & Setup

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/donation-box-db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Start the server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify the server is running**:
   ```bash
   curl http://localhost:3001/ping
   # Should return: pong
   ```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | `3001` |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | - |

### Example `.env` file:
```env
PORT=3001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/donation-box-db?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-min-32-characters-long
```

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.ts              # MongoDB connection configuration
│   ├── controllers/
│   │   ├── authController.ts  # Authentication logic
│   │   ├── areaController.ts  # Area CRUD operations
│   │   ├── boxController.ts   # Box CRUD operations
│   │   ├── collectionController.ts # Collection CRUD operations
│   │   └── userController.ts  # User CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.ts  # JWT authentication middleware
│   │   ├── authOptional.ts    # Optional authentication middleware
│   │   └── roleMiddleware.ts  # Role-based access control
│   ├── models/
│   │   ├── User.ts            # User schema
│   │   ├── Area.ts            # Area schema
│   │   ├── Box.ts             # Box schema
│   │   └── Collection.ts      # Collection schema
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   ├── areas.ts           # Area routes
│   │   ├── boxes.ts           # Box routes
│   │   ├── collections.ts     # Collection routes
│   │   └── users.ts           # User routes
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   └── index.ts               # Application entry point
├── dist/                      # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

## Database Models

### User Model
```typescript
{
  _id: ObjectId,
  name: string (required),
  email: string (required, unique),
  phone?: string,
  password: string (required, hashed),
  role: "admin" | "volunteer" (default: "volunteer"),
  areaId?: ObjectId (reference to Area),
  createdAt: Date,
  updatedAt: Date
}
```

### Area Model
```typescript
{
  _id: ObjectId,
  name: string (required, unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Box Model
```typescript
{
  _id: ObjectId,
  locationName: string (required),
  caretakerName?: string,
  caretakerPhone?: string,
  locationLink?: string,
  areaId?: ObjectId (reference to Area),
  assignedVolunteerId?: ObjectId (reference to User),
  lastCollectionAt?: Date,
  nextCollectionAt?: Date,
  status: "active" | "inactive" (default: "active"),
  createdAt: Date,
  updatedAt: Date
}
```

### Collection Model
```typescript
{
  _id: ObjectId,
  boxId: ObjectId (required, reference to Box),
  volunteerId: ObjectId (required, reference to User),
  areaId?: ObjectId (reference to Area),
  amount?: number,
  visitType: "collected" | "empty" | "failed" (required),
  note?: string,
  visitedAt: Date (default: current date),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication & Authorization

### Authentication Flow

1. **Register/Login**: Users authenticate via `/auth/register` or `/auth/login`
2. **JWT Token**: Upon successful authentication, a JWT token is returned
3. **Token Usage**: Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
4. **Token Expiry**: Tokens expire after 7 days

### User Roles

- **Admin**: Full access to all endpoints
  - Can create, read, update, and delete all resources
  - Can manage users, areas, boxes, and collections
  - Can assign volunteers to areas and boxes

- **Volunteer**: Limited access based on assignments
  - Can create boxes (automatically assigned to their area and themselves)
  - Can view only boxes assigned to them
  - Can add collections only for boxes assigned to them
  - Cannot modify or delete resources (except their own box creation)

### Special Registration Rules

- **First User**: Must be an admin (no authentication required)
- **Subsequent Users**: Only authenticated admins can create new users

## API Endpoints

Base URL: `http://localhost:3001` (or your deployed server URL)

All endpoints return JSON responses. Error responses follow this format:
```json
{
  "message": "Error description"
}
```

### Authentication

#### Register User
**POST** `/auth/register`

**Description**: Register a new user. First user must be an admin. Subsequent registrations require admin authentication.

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <token> (optional - required only if admin exists)
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9999999999",
  "password": "securepassword123",
  "role": "volunteer",
  "areaId": "507f1f77bcf86cd799439011" (optional)
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9999999999",
    "role": "volunteer",
    "areaId": "507f1f77bcf86cd799439011"
  }
}
```

**Error Responses**:
- `400`: Missing required fields, user already exists, invalid areaId
- `403`: Only admin can create users (when admin exists)
- `404`: Area not found

---

#### Login
**POST** `/auth/login`

**Description**: Authenticate user and receive JWT token.

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "volunteer",
    "areaId": "507f1f77bcf86cd799439011"
  }
}
```

**Error Responses**:
- `400`: Missing email/password, invalid password
- `404`: User not found

---

### Areas

All area endpoints require **Admin** authentication.

#### Create Area
**POST** `/areas`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "South Nagpur"
}
```

**Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "South Nagpur",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### Get All Areas
**GET** `/areas`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "South Nagpur",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "North Nagpur",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
]
```

---

#### Update Area
**PUT** `/areas/:id`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Updated Area Name"
}
```

**Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Updated Area Name",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

#### Delete Area
**DELETE** `/areas/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "Area deleted successfully"
}
```

---

### Boxes

#### Create Box

**POST** `/boxes`

**Description**: 
- **Admin**: Can set all fields including `areaId`, `assignedVolunteerId`, and `status`
- **Volunteer**: Can only set basic box info. `areaId` and `assignedVolunteerId` are automatically set from volunteer's profile. `status` is always set to "active"

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (Admin)**:
```json
{
  "locationName": "Shree Medical Store",
  "caretakerName": "Ramesh",
  "caretakerPhone": "9998877665",
  "locationLink": "https://maps.app.goo.gl/abcd123",
  "areaId": "507f1f77bcf86cd799439011",
  "assignedVolunteerId": "507f1f77bcf86cd799439020",
  "status": "active"
}
```

**Request Body (Volunteer)**:
```json
{
  "locationName": "New Donation Box",
  "caretakerName": "John Doe",
  "caretakerPhone": "9998877665",
  "locationLink": "https://maps.app.goo.gl/abcd123"
}
```

**Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439030",
  "locationName": "Shree Medical Store",
  "caretakerName": "Ramesh",
  "caretakerPhone": "9998877665",
  "locationLink": "https://maps.app.goo.gl/abcd123",
  "areaId": "507f1f77bcf86cd799439011",
  "assignedVolunteerId": "507f1f77bcf86cd799439020",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `400`: Missing locationName, invalid areaId/assignedVolunteerId, volunteer not assigned to area
- `401`: Authentication required
- `403`: Access denied
- `404`: Area or volunteer not found

---

#### Get All Boxes
**GET** `/boxes`

**Description**: Returns all boxes. **Admin only**.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439030",
    "locationName": "Shree Medical Store",
    "caretakerName": "Ramesh",
    "caretakerPhone": "9998877665",
    "locationLink": "https://maps.app.goo.gl/abcd123",
    "areaId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "South Nagpur"
    },
    "assignedVolunteerId": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### Get Box by ID
**GET** `/boxes/:id`

**Description**: 
- **Admin**: Can view any box
- **Volunteer**: Can only view boxes assigned to them

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200): Same format as Create Box response

**Error Responses**:
- `400`: Invalid box ID format
- `401`: Authentication required
- `403`: Access denied (volunteer trying to view unassigned box)
- `404`: Box not found

---

#### Get Boxes by Volunteer
**GET** `/boxes/by-volunteer/:id`

**Description**: Get all boxes assigned to a specific volunteer.
- **Admin**: Can view boxes for any volunteer
- **Volunteer**: Can only view their own boxes

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200): Array of boxes (same format as Get All Boxes)

---

#### Update Box
**PUT** `/boxes/:id`

**Description**: Update box details. **Admin only**.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "locationName": "Updated Store",
  "caretakerName": "Updated Name",
  "caretakerPhone": "8888888888",
  "locationLink": "https://maps.app.goo.gl/newlink",
  "areaId": "507f1f77bcf86cd799439012",
  "assignedVolunteerId": "507f1f77bcf86cd799439021",
  "status": "inactive",
  "lastCollectionAt": "2024-01-15T10:00:00.000Z",
  "nextCollectionAt": "2024-01-22T10:00:00.000Z"
}
```

**Response** (200): Updated box object

---

#### Delete Box
**DELETE** `/boxes/:id`

**Description**: Soft delete (sets status to "inactive"). **Admin only**.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "Box deleted successfully",
  "box": { /* box object with status: "inactive" */ }
}
```

---

### Collections

#### Add Collection Entry
**POST** `/collections`

**Description**: Record a collection visit. Volunteers can only add collections for boxes assigned to them.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "boxId": "507f1f77bcf86cd799439030",
  "volunteerId": "507f1f77bcf86cd799439020", (optional - defaults to authenticated user)
  "areaId": "507f1f77bcf86cd799439011", (optional - defaults to box's areaId)
  "amount": 3500,
  "visitType": "collected",
  "note": "Everything normal"
}
```

**Visit Types**:
- `"collected"`: Money was collected
- `"empty"`: Box was empty
- `"failed"`: Collection attempt failed

**Response** (200):
```json
{
  "_id": "507f1f77bcf86cd799439040",
  "boxId": "507f1f77bcf86cd799439030",
  "volunteerId": "507f1f77bcf86cd799439020",
  "areaId": "507f1f77bcf86cd799439011",
  "amount": 3500,
  "visitType": "collected",
  "note": "Everything normal",
  "visitedAt": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `400`: Missing boxId/visitType, invalid ObjectId, box is inactive
- `401`: Authentication required
- `403`: Volunteer trying to add collection for unassigned box

---

#### Get All Collections
**GET** `/collections`

**Description**: Get all collection entries. **Admin only**. Sorted by `visitedAt` (newest first).

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439040",
    "boxId": {
      "_id": "507f1f77bcf86cd799439030",
      "locationName": "Shree Medical Store"
    },
    "volunteerId": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "areaId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "South Nagpur"
    },
    "amount": 3500,
    "visitType": "collected",
    "note": "Everything normal",
    "visitedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### Get Collections by Box
**GET** `/collections/box/:id`

**Description**: Get all collection entries for a specific box.
- **Admin**: Can view collections for any box
- **Volunteer**: Can only view collections for boxes assigned to them

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200): Array of collections (same format as Get All Collections)

---

#### Update Collection
**PUT** `/collections/:id`

**Description**: Update a collection entry. **Admin only**.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "boxId": "507f1f77bcf86cd799439031",
  "amount": 4000,
  "visitType": "collected",
  "note": "Updated note"
}
```

**Response** (200): Updated collection object with populated references

---

#### Delete Collection
**DELETE** `/collections/:id`

**Description**: Delete a collection entry. **Admin only**.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "Collection deleted successfully"
}
```

---

### Users

All user endpoints require **Admin** authentication.

#### Get All Users
**GET** `/users`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9999999999",
    "role": "volunteer",
    "areaId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "South Nagpur"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Note**: Password field is excluded from responses.

---

#### Get Volunteers
**GET** `/users/volunteers`

**Description**: Get all users with role "volunteer".

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200): Array of volunteer users (same format as Get All Users)

---

#### Get User by ID
**GET** `/users/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200): Single user object (same format as Get All Users)

---

#### Update User
**PUT** `/users/:id`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "8888888888",
  "role": "admin",
  "areaId": "507f1f77bcf86cd799439012"
}
```

**Response** (200): Updated user object

**Error Responses**:
- `400`: Invalid user ID, email already exists, invalid areaId
- `404`: User or area not found

---

#### Delete User
**DELETE** `/users/:id`

**Description**: Delete a user. Cannot delete the last admin.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses**:
- `400`: Cannot delete the last admin

---

## Error Handling

The API uses standard HTTP status codes:

- **200**: Success
- **400**: Bad Request (validation errors, missing fields)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

All error responses follow this format:
```json
{
  "message": "Error description"
}
```

### Common Error Scenarios

1. **Invalid ObjectId Format**:
   ```json
   {
     "message": "Invalid box ID format"
   }
   ```

2. **Authentication Required**:
   ```json
   {
     "message": "Authentication required"
   }
   ```

3. **Access Denied**:
   ```json
   {
     "message": "Access denied. You can only view boxes assigned to you."
   }
   ```

4. **Resource Not Found**:
   ```json
   {
     "message": "Box not found"
   }
   ```

## Development

### Available Scripts

```bash
# Run in development mode with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Run tests (if configured)
npm test
```

### Development Workflow

1. Make changes to TypeScript files in `src/`
2. The development server (`npm run dev`) automatically restarts on file changes
3. For production, build first: `npm run build`, then `npm start`

### Code Structure Guidelines

- **Controllers**: Handle request/response logic and business rules
- **Models**: Define database schemas using Mongoose
- **Routes**: Define API endpoints and apply middleware
- **Middleware**: Handle authentication, authorization, and request processing
- **Types**: TypeScript interfaces and type definitions

## Production Deployment

### Pre-deployment Checklist

1. **Environment Variables**: Ensure all required environment variables are set
2. **JWT Secret**: Use a strong, randomly generated secret (minimum 32 characters)
3. **MongoDB**: Use a production MongoDB instance (MongoDB Atlas recommended)
4. **CORS**: Configure CORS settings for your frontend domain
5. **Build**: Run `npm run build` to compile TypeScript
6. **Dependencies**: Ensure `node_modules` are installed (`npm install --production`)

### Recommended Production Settings

1. **Process Manager**: Use PM2 or similar for process management
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name donation-api
   ```

2. **Environment Variables**: Use environment variable management (AWS Secrets Manager, etc.)

3. **Database**: Use MongoDB Atlas with connection string authentication

4. **Security**:
   - Use HTTPS
   - Implement rate limiting
   - Validate and sanitize all inputs
   - Use strong JWT secrets
   - Regularly update dependencies

### Example PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'donation-api',
    script: 'dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

Run with: `pm2 start ecosystem.config.js`

## Frontend Integration Examples

### JavaScript/TypeScript Fetch Example

```typescript
const API_BASE_URL = 'http://localhost:3001';

// Login and store token
async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data;
  }
  throw new Error(data.message);
}

// Authenticated request example
async function getBoxes() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/boxes`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}

// Create box (volunteer)
async function createBox(boxData: {
  locationName: string;
  caretakerName?: string;
  caretakerPhone?: string;
  locationLink?: string;
}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/boxes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(boxData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}
```

### Axios Example

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Usage
const boxes = await api.get('/boxes');
const newBox = await api.post('/boxes', boxData);
```

## Support & Contribution

For issues, questions, or contributions, please contact the development team or open an issue in the repository.

---

**Last Updated**: January 2024
**API Version**: 1.0.0

