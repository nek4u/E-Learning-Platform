# InAcademy - Enterprise E-Learning Platform

A production-ready full-stack MERN e-learning platform inspired by Unacademy, Physics Wallah, Coursera, and Udemy.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, TanStack Query, Socket.io |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Socket.io, Redis |
| Payments | Razorpay, Stripe |
| DevOps | Docker, Docker Compose, Nginx |

## Project Structure

```
Inacademy/
├── client/          # React frontend
├── server/          # Express API
├── docker/          # Docker & deployment configs
├── docs/            # Documentation
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB (local or Docker)
- npm

### 1. Start MongoDB

```bash
# Using Docker
cd docker
docker compose up mongodb redis -d
```

Or install MongoDB locally and ensure it runs on `mongodb://127.0.0.1:27017`.

### 2. Setup Backend

```bash
cd server
cp .env.example .env   # Edit as needed
npm install
npm run seed           # Seed demo data
npm run dev
```

API runs at **http://localhost:5000**

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

App runs at **http://localhost:5173**

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@inacademy.com | Admin@123456 |
| Educator | educator@inacademy.com | Educator@123 |
| Student | student@inacademy.com | Student@123 |

## Features

- **Authentication**: JWT, refresh tokens, OTP, password reset, RBAC (5 roles)
- **Courses**: CRUD, curriculum, video player, progress tracking, certificates
- **Live Classes**: Socket.io real-time chat, reactions, raise hand, polls
- **Tests**: Mock tests, timer, negative marking, leaderboards, AI analysis
- **AI**: Chatbot, study planner, summaries, recommendations
- **Payments**: Razorpay & Stripe integration
- **Dashboards**: Student, Educator, Admin panels
- **Community**: Discussions, likes, replies
- **PWA**: Offline-ready progressive web app

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

| Module | Endpoints |
|--------|-----------|
| Auth | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/me` |
| Home | `/home` |
| Courses | `/courses`, `/courses/:slug`, `/courses/:id/enroll` |
| Categories | `/categories`, `/categories/:slug` |
| Quizzes | `/quizzes`, `/quizzes/:id/submit` |
| Live | `/live`, `/live/:id/join` |
| AI | `/ai/chat`, `/ai/study-planner` |
| Admin | `/admin/dashboard`, `/admin/users` |

## Docker (Full Stack)

```bash
cd docker
docker compose up --build
```

## Environment Variables

See `server/.env.example` for all backend variables including:
- MongoDB, Redis, JWT secrets
- Cloudinary, AWS S3
- Razorpay, Stripe
- Google/GitHub OAuth
- AI API key (OpenAI-compatible)

## Production Build

```bash
# Frontend
cd client && npm run build

# Backend
cd server && npm start
```

## License

MIT
