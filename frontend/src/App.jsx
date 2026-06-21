import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProtectedRoute } from './utils/ProtectedRoute';

// Pages
import Marketplace from './pages/marketplace/Marketplace';
import Login from './screens/Login';
import Register from './screens/Register';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';

// User Dashboard
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import UserOrders from './pages/user/UserOrders';
import UserWishlist from './pages/user/UserWishlist';
import UserSettings from './pages/user/UserSettings';

// Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import LivestockManagement from './screens/LivestockManagement';
import VeterinaryBreedingCalendar from './screens/VeterinaryBreedingCalendar';
import HRWorkerProfileDashboard from './screens/HRWorkerProfileDashboard';
import InventoryFeedControl from './screens/InventoryFeedControl';
import LogisticsDeliveryTracking from './screens/LogisticsDeliveryTracking';
import FinancialProfitTracking from './screens/FinancialProfitTracking';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import ProductDetail from './pages/marketplace/ProductDetail';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* User Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="customer">
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="profile" element={<UserProfile />} />
              <Route path="orders" element={<UserOrders />} />
              <Route path="wishlist" element={<UserWishlist />} />
              <Route path="settings" element={<UserSettings />} />
              <Route index element={<UserProfile />} />
            </Route>

            {/* Worker Portal */}
            <Route
              path="/worker"
              element={
                <ProtectedRoute allowedRoles={['worker', 'veterinarian', 'manager', 'accountant']}>
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="livestock" element={<LivestockManagement />} />
              <Route path="veterinary" element={<VeterinaryBreedingCalendar />} />
              <Route path="hr" element={<HRWorkerProfileDashboard />} />
              <Route path="inventory" element={<InventoryFeedControl />} />
              <Route path="logistics" element={<LogisticsDeliveryTracking />} />
              <Route path="finance" element={<FinancialProfitTracking />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route index element={<AdminAnalytics />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

