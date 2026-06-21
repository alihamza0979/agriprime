import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: 'analytics', path: '/admin/analytics' },
    { id: 'products', label: 'Products', icon: 'inventory_2', path: '/admin/products' },
    { id: 'categories', label: 'Categories', icon: 'category', path: '/admin/categories' },
    { id: 'orders', label: 'Orders', icon: 'shopping_cart', path: '/admin/orders' },
    { id: 'users', label: 'Users', icon: 'people', path: '/admin/users' },
    { id: 'livestock', label: 'Livestock', icon: 'pets', path: '/admin/livestock' },
    { id: 'veterinary', label: 'Veterinary', icon: 'medical_services', path: '/admin/veterinary' },
    { id: 'hr', label: 'HR', icon: 'groups', path: '/admin/hr' },
    { id: 'inventory', label: 'Inventory', icon: 'inventory', path: '/admin/inventory' },
    { id: 'logistics', label: 'Logistics', icon: 'local_shipping', path: '/admin/logistics' },
    { id: 'finance', label: 'Finance', icon: 'paid', path: '/admin/finance' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-surface-container-low flex-col md:flex-row">
      {/* Mobile Header (Only visible on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-[#0a2e1a] to-[#0f4a2a] text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg">eco</span>
          </div>
          <span className="font-bold text-lg">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${mobileOpen ? 'flex' : 'hidden'} md:flex
        flex-col absolute md:relative z-50
        h-[calc(100vh-64px)] md:h-screen
        bg-gradient-to-b from-[#0a2e1a] via-[#0d3b22] to-[#0f4a2a]
        transition-all duration-300 ease-in-out shadow-2xl md:shadow-[4px_0_24px_rgba(0,40,15,0.18)]
        ${collapsed ? 'md:w-[72px]' : 'md:w-64'} w-full
      `}>
        {/* Brand - hidden on mobile, visible on md+ */}
        <div 
          className="hidden md:flex items-center gap-3 p-5 border-b border-white/10 min-h-[72px] cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/40">
            <span className="material-symbols-outlined text-white text-xl">eco</span>
          </div>
          {!collapsed && <span className="text-white font-bold whitespace-nowrap">AgriPrime Admin</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 no-scrollbar">
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 mx-2 my-1 text-white/70 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-xl shrink-0">
                {item.icon}
              </span>
              <span className={`whitespace-nowrap md:${collapsed ? 'hidden' : 'block'} block`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all cursor-pointer border-none text-left"
          >
            <span className="material-symbols-outlined text-xl shrink-0">logout</span>
            <span className={`whitespace-nowrap md:${collapsed ? 'hidden' : 'block'} block`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col w-full relative">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center p-4 md:p-6 bg-white border-b border-black/5 gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Welcome, {user?.name}!</p>
          </div>
          <Link 
            to="/" 
            className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-600 rounded-xl hover:bg-green-500/20 transition-all font-medium text-sm whitespace-nowrap"
          >
            Back to Marketplace
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-surface-container-low">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
