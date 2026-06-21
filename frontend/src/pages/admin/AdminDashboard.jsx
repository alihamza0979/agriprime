import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SIDEBAR_W = 256;
  const sideW = collapsed ? 72 : SIDEBAR_W;

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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f5fced' }}>
      {/* Sidebar */}
      <aside style={{
        width: sideW,
        minWidth: sideW,
        height: '100vh',
        background: 'linear-gradient(180deg, #0a2e1a 0%, #0d3b22 60%, #0f4a2a 100%)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        zIndex: 50,
        boxShadow: '4px 0 24px rgba(0,40,15,0.18)',
      }}>
        {/* Brand */}
        <div style={{
          padding: collapsed ? '20px 10px' : '20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 72,
          cursor: 'pointer',
        }} onClick={() => setCollapsed(c => !c)}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #4caf50, #81c784)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 4px 12px rgba(76,175,80,0.4)',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 22 }}>eco</span>
          </div>
          {!collapsed && <span style={{ color: '#fff', fontWeight: 'bold' }}>AgriPrime Admin</span>}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {navItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(76, 175, 80, 0.1)';
                e.currentTarget.style.color = '#4caf50';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: 'rgba(255, 107, 107, 0.1)',
              border: 'none',
              color: '#ff6b6b',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 30px',
          background: '#fff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1b1b1b' }}>Admin Dashboard</h1>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Welcome, {user?.name}!</p>
          </div>
          <Link to="/" style={{
            padding: '10px 16px',
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            color: '#4caf50',
            borderRadius: '8px',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(76, 175, 80, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(76, 175, 80, 0.1)';
            }}
          >
            Back to Marketplace
          </Link>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
