# AgriPrime Marketplace Restructuring - Complete Guide

## Project Transformation Summary

The AgriPrime application has been successfully restructured from a traditional dashboard-focused architecture to a professional **role-based marketplace platform** with centralized authentication and protected routes.

---

## 🏗️ Architecture Overview

### New Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Marketplace Homepage (/)                 │
│     • Featured Products   • Categories   • Search Filters   │
│     • Public Access       • Navigation Bar                  │
│     • "Admin Login" Link in Footer                          │
└────────────┬────────────────────────────────┬───────────────┘
             │                                │
             ├─► Not Authenticated           ├─► Authenticated
             │                                │
             ▼                                ▼
    ┌──────────────────┐          ┌──────────────────────────┐
    │   Login Page     │          │  Role-Based Redirect     │
    │   Register Page  │          │                          │
    │                  │          │  Customer Role ──────┐   │
    │   Demo Creds:    │          │  Admin Role ────┐    │   │
    │   • customer@... │          │                 │    │   │
    │   • admin@...    │          └─────────────────┼────┼───┘
    └──────────────────┘                           │    │
                                                   ▼    ▼
                                          ┌─────────────────────┐
                                          │  User Dashboard (/) │
                                          │  • Profile          │
                                          │  • Orders           │
                                          │  • Wishlist         │
                                          │  • Settings         │
                                          └─────────────────────┘
                                          ┌──────────────────────┐
                                          │ Admin Dashboard (/a) │
                                          │ • Analytics          │
                                          │ • Products           │
                                          │ • Categories         │
                                          │ • Orders             │
                                          │ • Users              │
                                          │ • Settings           │
                                          └──────────────────────┘
```

---

## 📁 New Project Structure

```
frontend/src/
├── App.jsx                          # Main routing component
├── main.jsx                         # Entry point
├── api.js                          # API configuration
├── index.css                       # Global styles
│
├── contexts/
│   └── AuthContext.jsx             # Centralized auth state
│
├── utils/
│   └── ProtectedRoute.jsx          # Role-based route protection
│
├── layouts/                        # (Reserved for layout components)
│
├── pages/
│   ├── marketplace/
│   │   └── Marketplace.jsx         # Public homepage
│   │
│   ├── user/
│   │   ├── UserDashboard.jsx       # Customer dashboard layout
│   │   ├── UserProfile.jsx         # Profile page
│   │   ├── UserOrders.jsx          # Orders page
│   │   ├── UserWishlist.jsx        # Wishlist page
│   │   └── UserSettings.jsx        # Settings page
│   │
│   └── admin/
│       ├── AdminDashboard.jsx      # Admin dashboard layout
│       ├── AdminAnalytics.jsx      # Analytics page
│       ├── AdminProducts.jsx       # Product management
│       ├── AdminCategories.jsx     # Category management
│       ├── AdminOrders.jsx         # Order management
│       ├── AdminUsers.jsx          # User management
│       └── AdminSettings.jsx       # Admin settings
│
├── components/
│   ├── Navigation.jsx              # Main navigation bar
│   ├── Toast.jsx                   # Notifications
│   ├── (old forms - kept for backward compatibility)
│   └── ...
│
└── screens/
    ├── Login.jsx                   # Updated login screen
    ├── Register.jsx                # New registration screen
    └── (old screens - kept for reference)
```

---

## 🔐 Authentication System

### AuthContext Features

**Location:** `src/contexts/AuthContext.jsx`

```javascript
// Provides the following:
- User state management
- Token persistence
- Login/Register functions
- Role checking (isAdmin, isCustomer)
- Automatic redirect after login based on role
```

**Usage in Components:**
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  // ... component logic
}
```

### Role-Based Access Control

**Protected Route Component:** `src/utils/ProtectedRoute.jsx`

```javascript
// Syntax
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRole="customer">
      <UserDashboard />
    </ProtectedRoute>
  }
/>
```

**Features:**
- Redirects unauthenticated users to `/login`
- Blocks access for users without required role
- Shows loading state during auth verification
- Automatically redirects based on user's actual role

---

## 🌐 Route Structure

### Public Routes
- **GET** `/` - Marketplace Homepage
- **GET** `/login` - Login Page
- **GET** `/register` - Registration Page

### Protected Routes - Customer
- **GET** `/dashboard` - User Dashboard (default: Profile)
- **GET** `/dashboard/profile` - User Profile
- **GET** `/dashboard/orders` - Order History
- **GET** `/dashboard/wishlist` - Saved Items
- **GET** `/dashboard/settings` - User Settings

### Protected Routes - Admin
- **GET** `/admin` - Admin Dashboard (default: Analytics)
- **GET** `/admin/analytics` - Dashboard Analytics
- **GET** `/admin/products` - Product Management
- **GET** `/admin/categories` - Category Management
- **GET** `/admin/orders` - Order Management
- **GET** `/admin/users` - User Management
- **GET** `/admin/settings` - Admin Settings

---

## 🔄 User Flow Examples

### New Customer Registration & Login
1. User visits `/` (Marketplace Homepage)
2. Clicks "Sign Up" button
3. Fills registration form → `/register`
4. Submits registration (backend creates account with role='customer')
5. Redirected to `/login`
6. Enters credentials
7. **Automatic redirect to `/dashboard`** (based on customer role)

### Admin Access
1. Admin visits `/` (Marketplace Homepage)
2. Scrolls to footer → clicks "Admin Login" link
3. Navigates to `/login`
4. Enters admin credentials (role='admin')
5. **Automatic redirect to `/admin`** (based on admin role)
6. Presented with admin-specific dashboard

### Session Persistence
- User credentials stored in `localStorage`:
  - `token`: JWT token for API authentication
  - `user`: User object with name, email, role
- AuthContext automatically restores session on app load
- Invalid tokens trigger re-authentication

---

## 🎨 UI/UX Features

### Navigation Component
**Location:** `src/components/Navigation.jsx`

**Features:**
- Responsive sticky navigation bar
- Logo/brand linking to marketplace
- Dynamic navigation based on auth state
- User dropdown menu (authenticated users)
- Admin login link in marketplace view
- Search bar (placeholder)
- Call-to-action buttons

### Marketplace Homepage
**Location:** `src/pages/marketplace/Marketplace.jsx`

**Sections:**
- **Hero Section**: Featured banner with CTAs
- **Categories**: Display of main product categories
- **Product Grid**: Responsive product showcase
- **Newsletter Signup**: Email subscription
- **Footer**: Links + Admin Login option

### Dashboards

#### Customer Dashboard
- Sidebar navigation
- User welcome message
- Quick access to profile, orders, wishlist, settings
- Back to Marketplace button
- Logout functionality

#### Admin Dashboard
- Extended sidebar with admin-specific menu
- Analytics overview (placeholder metrics)
- Product/Category/Order/User management interfaces
- Admin welcome message
- Collapse/expand sidebar

---

## 🔧 Backend Updates

### User Model Changes
**File:** `backend/models/User.js`

**Updated Roles (lowercase for consistency):**
- `admin` - Full administrative access
- `manager` - Management-level access
- `veterinarian` - Veterinary functions
- `worker` - Worker/staff functions
- `accountant` - Financial operations
- `customer` - Marketplace customer (default)

**Default Role:** `customer`

### Authentication Endpoints
**File:** `backend/controllers/authController.js`

**Endpoints:**
- `POST /auth/login` - Returns token + user (with role)
- `POST /auth/register` - Creates user with role
- `GET /auth/me` - Returns current user (protected)

---

## 📊 Dependencies

### Frontend Dependencies
- `react`: ^19.2.4
- `react-dom`: ^19.2.4
- `react-router-dom`: ^6.x (newly added)
- `axios`: ^1.18.0

### Build Tools
- `vite`: ^8.0.4
- `eslint`: ^9.39.4

---

## 🚀 Running the Application

### Development Mode

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Starts at `http://localhost:5173`

**Backend:**
```bash
cd backend
npm install
npm run dev
```
Starts at `http://localhost:5000` (or configured port)

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🧪 Testing the Flow

### Demo Credentials
**Customer Account:**
- Email: `customer@agriprime.com`
- Password: `password`

**Admin Account:**
- Email: `admin@agriprime.com`
- Password: `admin123`

### Test Scenarios

1. **Anonymous Access**
   - Visit `/` → See marketplace
   - Click products (no action needed)
   - Try accessing `/dashboard` → Redirect to `/login`

2. **Customer Login**
   - Go to `/login`
   - Enter customer credentials
   - Should redirect to `/dashboard`
   - Try accessing `/admin` → Redirect to `/dashboard`

3. **Admin Login**
   - Go to `/login`
   - Enter admin credentials
   - Should redirect to `/admin`
   - Can access admin features

4. **Session Persistence**
   - Log in as customer
   - Refresh page → Stay logged in
   - Close browser, reopen → Still logged in (if within token expiry)

---

## 🔒 Security Features

### Implemented
- JWT token-based authentication
- Role-based access control on frontend
- Protected route components
- Session persistence with token validation
- Logout clears all credentials

### Recommended Additions
- Refresh token mechanism
- Rate limiting on auth endpoints
- HTTPS requirement
- CORS configuration review
- Backend route protection (middleware)
- Password strength validation
- Account recovery mechanism

---

## 📝 Key Changes Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Default Landing Page** | Admin Dashboard | Marketplace (Public) |
| **Authentication** | Direct login required | Optional for marketplace |
| **Routing** | Manual state management | React Router (declarative) |
| **Auth Context** | Prop drilling | Centralized AuthContext |
| **Role Handling** | Limited | Full role-based routing |
| **User Dashboard** | Embedded in app | Separate protected route |
| **Admin Panel** | Default entry | Protected route behind login |
| **Navigation** | Sidebar only | Header + Sidebar options |
| **Session Handling** | Basic localStorage | Token + Context restoration |

---

## 🐛 Troubleshooting

### Common Issues

**Problem:** Page shows "Loading..." but never completes
- **Solution:** Check auth token validity in browser console → localStorage

**Problem:** Login redirects to wrong dashboard
- **Solution:** Verify role in user object (check API response)

**Problem:** Can access admin pages without admin role
- **Solution:** Clear localStorage, hard refresh, check ProtectedRoute logic

**Problem:** API requests fail after login
- **Solution:** Check Authorization header setup in `api.js`, verify token format

---

## 📚 Next Steps / Enhancements

1. **Product Management**
   - Implement product search/filter
   - Add shopping cart
   - Implement checkout flow

2. **Admin Features**
   - Wire up analytics to real data
   - Implement product CRUD operations
   - User management interface

3. **User Features**
   - Profile editing
   - Order tracking
   - Wishlist functionality
   - Payment integration

4. **Security**
   - Add refresh token mechanism
   - Implement 2FA
   - Rate limiting

5. **Monitoring**
   - Error logging
   - Performance monitoring
   - User analytics

---

## 📖 File Reference

| File | Purpose |
|------|---------|
| `App.jsx` | Main routing setup |
| `AuthContext.jsx` | Authentication state management |
| `ProtectedRoute.jsx` | Route access control |
| `Navigation.jsx` | Global navigation component |
| `Login.jsx` | Login page with auth integration |
| `Register.jsx` | Registration page |
| `Marketplace.jsx` | Public marketplace homepage |
| `UserDashboard.jsx` | Customer dashboard container |
| `AdminDashboard.jsx` | Admin dashboard container |

---

## ✅ Checklist for Deployment

- [ ] Environment variables configured (.env file)
- [ ] Backend database connection verified
- [ ] API endpoints tested
- [ ] Authentication flow tested with demo credentials
- [ ] Protected routes verified (403 on unauthorized access)
- [ ] Role-based redirects verified
- [ ] Session persistence tested
- [ ] Build passes without errors
- [ ] Frontend connects to correct API endpoint
- [ ] CORS configured for frontend origin

---

**Last Updated:** 2024
**Version:** 1.0 - Marketplace Restructure
