# AgriPrime - Digital Livestock & Farm Management Platform

A unified digital platform for livestock lifecycle management, veterinary health, workforce operations, inventory, e-commerce marketplace, logistics, and financial analytics.

## Features

- **Livestock Management** - RFID tracking, breed/lineage, weight history, lifecycle status
- **Breeding Management** - Heat cycle alerts, pregnancy tracking, offspring registration
- **Veterinary Module** - Vaccination reminders, treatment logs, quarantine tagging
- **Inventory & Feed** - Stock monitoring, diet planning, medicine expiry alerts
- **HR Management** - Employee profiles, attendance, task assignment, payroll
- **E-Commerce** - Online product marketplace with cart and checkout
- **Order Management** - Order lifecycle tracking and status updates
- **Logistics** - Delivery tracking and route assignment
- **Financial Module** - Revenue, expenses, and profit tracking

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Tailwind CSS
- **Backend**: Express 5, Mongoose, JWT Authentication
- **Database**: MongoDB

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This loads sample livestock, inventory, products, and employee data. Create your admin account through the seed script or register via the app.

### 4. Run Development Servers

```bash
# Terminal 1 - Backend (port 5000)
cd backend && npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173

## Production Deployment

### Backend

```bash
cd backend
npm install --production
NODE_ENV=production node server.js
```

Set environment variables:
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Strong random secret (required; server will refuse to start in production without it)
- `PORT` - Server port (default 5000)
- `NODE_ENV=production`

### Frontend

```bash
cd frontend
# Set VITE_API_URL to your production API URL
VITE_API_URL=https://your-api.com/api npm run build
```

Serve the `frontend/dist/` folder with any static host (Vercel, Netlify, Nginx, etc.).

## API Endpoints

| Module | Prefix | Auth |
|--------|--------|------|
| Auth | `/api/auth` | Public (register/login) |
| Products | `/api/products` | Public GET, Admin mutations |
| Orders | `/api/orders` | Authenticated |
| Animals | `/api/animals` | Admin/Staff |
| Health | `/api/health` | Admin/Vet |
| Breeding | `/api/breeding` | Admin/Vet |
| Employees | `/api/employees` | Admin/Manager |
| Inventory | `/api/inventory` | Admin/Staff |
| Financial | `/api/financial` | Admin/Accountant |
| Admin Stats | `/api/admin/stats` | Admin |

## Project Structure

```
AGRIPRIME/
├── backend/          # Express API
│   ├── models/       # Mongoose schemas
│   ├── controllers/  # Route handlers
│   ├── routes/       # API routes
│   ├── middleware/   # Auth & RBAC
│   └── seed.js       # Demo data seeder
├── frontend/         # React SPA
│   └── src/
│       ├── pages/    # Route pages
│       ├── screens/  # Admin module screens
│       ├── components/
│       └── contexts/ # Auth & Cart state
└── README.md
```

## License

Private - AgriPrime Farm Management System
