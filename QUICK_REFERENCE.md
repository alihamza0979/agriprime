# AgriPrime - Quick Reference Guide

## 🎯 Quick Start

### Install Dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### Run Development Servers
```bash
# Terminal 1 - Frontend (runs on http://localhost:5173)
cd frontend && npm run dev

# Terminal 2 - Backend (runs on http://localhost:5000)
cd backend && npm run dev
```

---

## 🔐 Authentication Quick Reference

### Using Auth in Components
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { 
    user,                 // { id, name, email, role }
    isAuthenticated,      // boolean
    isAdmin,              // boolean
    isCustomer,           // boolean
    login,                // async function
    logout,               // function
    error                 // string or null
  } = useAuth();
  
  return (
    <>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </>
  );
}
```

### Protected Routes
```javascript
// In App.jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRole="customer">
      <UserDashboard />
    </ProtectedRoute>
  }
>
  {/* Nested routes */}
  <Route path="profile" element={<UserProfile />} />
</Route>
```

---

## 📍 Key URLs

| Path | Access | Purpose |
|------|--------|---------|
| `/` | Public | Marketplace homepage |
| `/login` | Public | Login page |
| `/register` | Public | Registration |
| `/dashboard` | Customer* | Customer dashboard |
| `/dashboard/profile` | Customer* | View profile |
| `/dashboard/orders` | Customer* | View orders |
| `/dashboard/wishlist` | Customer* | View wishlist |
| `/dashboard/settings` | Customer* | User settings |
| `/admin` | Admin* | Admin dashboard |
| `/admin/analytics` | Admin* | Analytics |
| `/admin/products` | Admin* | Manage products |
| `/admin/categories` | Admin* | Manage categories |
| `/admin/orders` | Admin* | Manage orders |
| `/admin/users` | Admin* | Manage users |
| `/admin/settings` | Admin* | Admin settings |

*Protected - requires authentication and specific role

---

## 🔑 Demo Credentials

### Customer
```
Email: customer@agriprime.com
Password: password
```

### Admin
```
Email: admin@agriprime.com
Password: admin123
```

---

## 📋 User Roles

```
'admin'        → Full system access
'customer'     → Marketplace customer (default)
'manager'      → Management access
'veterinarian' → Veterinary functions
'worker'       → Worker functions
'accountant'   → Accounting functions
```

---

## 🔧 Component Templates

### Creating a Protected Page
```javascript
// pages/user/MyNewPage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function MyNewPage() {
  const { user } = useAuth();
  
  return (
    <div style={{ padding: '30px' }}>
      <h2>My Page</h2>
      <p>Welcome, {user?.name}</p>
    </div>
  );
}

// Add to App.jsx
import MyNewPage from './pages/user/MyNewPage';

// Add route
<Route path="my-page" element={<MyNewPage />} />
```

### Creating a Protected Route
```javascript
// In App.jsx
<Route
  path="/new-route"
  element={
    <ProtectedRoute requiredRole="admin">
      <MyAdminComponent />
    </ProtectedRoute>
  }
/>
```

---

## 🎨 Styling Reference

### Color Scheme
- Primary Green: `#4caf50`
- Dark Green: `#0a2e1a`
- Light Background: `#f5fced`
- Text Dark: `#1b1b1b`
- Text Light: `#666`

### Common Styles
```javascript
// Button style
{
  padding: '12px 24px',
  background: '#4caf50',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
}

// Card style
{
  background: '#fff',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}

// Sidebar style
{
  background: 'linear-gradient(180deg, #0a2e1a 0%, #0f4a2a 100%)',
  color: '#fff',
}
```

---

## 📦 API Integration

### Login Request
```javascript
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Register Request
```javascript
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "role": "customer"
}

Response:
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## 🐛 Debugging Tips

### Check Authentication State
```javascript
// In browser console
localStorage.getItem('token')       // JWT token
localStorage.getItem('user')        // User object (JSON)
```

### Test Protected Routes
```javascript
// Try accessing admin route as customer
// Should redirect to /dashboard

// Try accessing without token
// Should redirect to /login
```

### Check API Requests
```javascript
// In browser DevTools Network tab
// Look for /auth/login POST request
// Check response for token and user data
```

---

## 📚 Project Structure Quick Reference

```
frontend/
├── src/
│   ├── App.jsx                 ← Main routing
│   ├── contexts/AuthContext    ← Auth state
│   ├── utils/ProtectedRoute    ← Route guards
│   ├── components/Navigation   ← Nav bar
│   ├── pages/
│   │   ├── marketplace/        ← Public pages
│   │   ├── user/              ← Customer pages
│   │   └── admin/             ← Admin pages
│   └── screens/               ← Old screens

backend/
├── models/User.js             ← User schema
├── controllers/authController ← Auth logic
├── middleware/authMiddleware  ← Auth checks
├── routes/authRoutes          ← Auth endpoints
└── server.js                  ← Express server
```

---

## 🚀 Common Tasks

### Add a New Protected Route
1. Create component in `pages/user/` or `pages/admin/`
2. Import in `App.jsx`
3. Add route with `<ProtectedRoute>`
4. Add navigation link in appropriate dashboard

### Update User Profile
1. Modify `UserProfile.jsx`
2. Use `useAuth()` hook to get/update user
3. Call backend API if needed
4. Update localStorage in AuthContext

### Add Admin Feature
1. Create component in `pages/admin/`
2. Import in `App.jsx`
3. Add route under `/admin`
4. Add navigation link in `AdminDashboard.jsx`
5. Implement feature logic

### Handle Logout
```javascript
const { logout } = useAuth();

const handleLogout = () => {
  logout();  // Clears token, user, and localStorage
  navigate('/');  // Redirect to home
};
```

---

## ⚠️ Common Mistakes to Avoid

1. **Wrong Import Path**
   - ❌ `import Navigation from '../components/Navigation'`
   - ✅ `import Navigation from '../../components/Navigation'`

2. **Forgetting ProtectedRoute**
   - ❌ `<Route path="/admin" element={<AdminDashboard />} />`
   - ✅ `<Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />`

3. **Not Using AuthContext**
   - ❌ `const user = localStorage.getItem('user')`
   - ✅ `const { user } = useAuth()`

4. **Direct localStorage Access**
   - ❌ `localStorage.setItem('user', JSON.stringify(userData))`
   - ✅ Use `login()` from AuthContext

---

## 🆘 Getting Help

1. **Check Build Errors**
   ```bash
   npm run build
   ```

2. **Check API Connection**
   - Browser DevTools → Network tab
   - Check requests to `/auth/`

3. **Check Auth State**
   - Browser Console → `localStorage`
   - Check token expiration

4. **Check Route Logic**
   - Browser Console → Errors
   - Check browser history

---

**Last Updated:** 2024
