# Library Task Manager

A full-stack library management system with book borrowing, Stripe payments, task tracking, and admin dashboard.

## Tech Stack

**Backend:** Express 5, TypeScript, Mongoose, JWT (access + refresh tokens), Stripe, Zod validation, rate limiting

**Frontend:** React 19, Vite, Redux Toolkit, React Router 7, Tailwind CSS, Axios

**Database:** MongoDB 7 (Docker)

## Project Structure

```
├── client/          # React frontend
│   └── src/
│       ├── api/         # Axios API layer
│       ├── components/  # Reusable UI (Navbar, BookCard, SearchBar, ProtectedRoute)
│       ├── pages/       # Route pages (Books, Login, Register, AdminDashboard, etc.)
│       ├── redux/       # Redux Toolkit slices (auth, books, tasks)
│       └── types/       # TypeScript interfaces
├── server/          # Express backend
│   └── src/
│       ├── config/      # DB & Stripe config
│       ├── controllers/ # Route handlers
│       ├── middleware/  # Auth, validation, rate limiting
│       ├── models/      # Mongoose schemas (Book, User, Task)
│       ├── routes/      # Express routers
│       └── seeders/     # Book seed data
└── docker-compose.yml   # MongoDB container
```

## Prerequisites

- Node.js 18+
- Docker (for MongoDB)
- Stripe account (for payments)

## Setup

### 1. Start MongoDB

```bash
docker compose up -d
```

### 2. Backend

```bash
cd server
npm install
```

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Seed the database and start:

```bash
npm run seed
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Frontend

```bash
cd client
npm install
```

Copy the example env file:

```bash
cp .env.example .env
```

Start the dev server:

```bash
npm run dev
```

Client runs on `http://localhost:5173`

## Features

### User
- Register / Login with JWT authentication (access + refresh token rotation)
- Browse books with server-side search and pagination
- Borrow books via Stripe checkout
- Return books and manage return tasks
- View borrow history and outstanding fines
- Profile page

### Admin
- Dashboard with stats (total books, users, active borrows, overdue)
- Manage books (create, edit, delete)
- View overdue books and fines

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/books?page=&search= | No | List books (paginated, searchable) |
| GET | /api/books/:id | No | Get single book |
| POST | /api/books | Admin | Create book |
| PUT | /api/books/:id | Admin | Update book |
| DELETE | /api/books/:id | Admin | Delete book (if not borrowed) |
| POST | /api/books/borrow/:id | User | Borrow a book |
| PUT | /api/books/return/:id | User | Return a book |
| POST | /api/auth/register | No | Register |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/refresh | No | Refresh token |
| POST | /api/auth/logout | User | Logout |
| POST | /api/stripe/create-checkout-session | User | Start payment |
| POST | /api/stripe/webhook | Stripe | Payment webhook |
| GET | /api/stripe/verify-session | User | Verify payment |
| GET | /api/tasks/my-tasks | User | Get user tasks |
| POST | /api/tasks/return-task | User | Create return task |
| PATCH | /api/tasks/:taskId/toggle | User | Toggle task completion |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/overdue | Admin | Overdue books |
| GET | /api/admin/my-history | User | Borrow history |
| GET | /api/admin/my-fines | User | Outstanding fines |

## Security

- JWT access tokens (15min) + httpOnly refresh tokens (7d) with rotation
- Zod strict schema validation on all inputs
- Rate limiting on auth routes (15 req/15min)
- Regex-escaped search queries (ReDoS prevention)
- Role-based access control (user/admin)
- Stripe webhook signature verification
- No role escalation via registration

## Scripts

**Server:**
- `npm run dev` — Start with hot reload
- `npm run build` — Compile TypeScript
- `npm run seed` — Seed book data
- `npm start` — Run compiled output

**Client:**
- `npm run dev` — Vite dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build
