# Numeric Discussions

Full-stack application for numeric discussions - a tree-based calculation system where users create root numbers and reply with mathematical operations.

## Features

- View calculation tree (no registration required)
- User registration and login with JWT authentication
- Create root numbers as starting points
- Reply to any node with operations (add, subtract, multiply, divide)
- Expand/collapse root numbers
- Delete root numbers (creator only)
- Automatic result computation
- Nested tree visualization

## Tech Stack

**Backend:**
- Node.js + Express
- JWT authentication
- bcryptjs for password hashing
- In-memory storage

**Frontend:**
- React 18 + JavaScript
- Vite
- Minimalist Tokyo-style UI

**Deployment:**
- Docker + Docker Compose

## Quick Start

### Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env  # Edit .env with your settings
npm start
```

Backend runs on `http://localhost:4000`

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Docker

**Prerequisites:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop).

```bash
docker-compose up --build
```

- Frontend: `http://localhost:80`
- Backend: `http://localhost:4000`

To stop containers:
```bash
docker compose down
```

## API Endpoints

### Authentication

**POST** `/api/auth/register`
```json
{
  "username": "string",
  "password": "string"
}
```

**POST** `/api/auth/login`
```json
{
  "username": "string",
  "password": "string"
}
```

### Calculations

**GET** `/api/calcs` - Get all nodes (public)

**POST** `/api/calcs/root` - Create root number (auth required)
```json
{
  "startingNumber": 10
}
```

**POST** `/api/calcs/:parentId/reply` - Create reply (auth required)
```json
{
  "operationType": "add",
  "rightOperand": 5
}
```

**DELETE** `/api/calcs/:nodeId` - Delete node and all children (auth required, creator only)

## Data Models

**User:**
```javascript
{
  id: string,
  username: string,
  passwordHash: string
}
```

**CalcNode:**
```javascript
{
  id: string,
  parentId: string | null,
  createdBy: string,
  createdAt: string,
  operationType: "add" | "sub" | "mul" | "div" | null,
  rightOperand: number | null,
  result: number
}
```

## Project Structure

```
backend/
  ├── middleware/auth.js
  ├── routes/auth.js
  ├── routes/calcs.js
  ├── store/index.js
  └── server.js

frontend/
  ├── src/
  │   ├── api/
  │   ├── components/
  │   ├── hooks/
  │   └── utils/
  └── vite.config.js
```

## Security

- Password hashing with bcryptjs (10 rounds)
- JWT tokens (7-day expiration)
- Protected routes require authentication
- CORS enabled

## Notes

- In-memory storage (data lost on server restart)
- No database (intentional for simplicity)
