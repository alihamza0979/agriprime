import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation({ cartCount = 0, onCartClick }) {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboardNavigation = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: 'linear-gradient(135deg, rgba(10, 46, 26, 0.95), rgba(15, 74, 42, 0.95))',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo / Brand */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        cursor: 'pointer',
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #4caf50, #81c784)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
        }}>
          <span className="material-symbols-outlined" style={{
            color: '#fff',
            fontSize: 22,
            fontVariationSettings: '"FILL" 1',
          }}>eco</span>
        </div>
        <span style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#fff',
          fontFamily: 'Inter, sans-serif',
        }}>AgriPrime</span>
      </Link>

      {/* Center Navigation */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
      }}>
        <Link to="/" style={{
          color: 'rgba(255, 255, 255, 0.8)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
          transition: 'color 0.3s ease',
        }} onMouseEnter={(e) => e.target.style.color = '#fff'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}>
          Marketplace
        </Link>
        <a href="#categories" style={{
          color: 'rgba(255, 255, 255, 0.8)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
          transition: 'color 0.3s ease',
        }} onMouseEnter={(e) => e.target.style.color = '#fff'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}>
          Categories
        </a>
        <a href="#about" style={{
          color: 'rgba(255, 255, 255, 0.8)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
          transition: 'color 0.3s ease',
        }} onMouseEnter={(e) => e.target.style.color = '#fff'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}>
          About
        </a>
      </div>

      {/* Right Side Actions */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}>
        {onCartClick && (
          <button onClick={onCartClick} style={{
            position: 'relative',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>shopping_cart</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: '#4caf50', color: '#fff',
                borderRadius: '50%', width: 20, height: 20,
                fontSize: 11, fontWeight: 'bold',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </button>
        )}
        {isAuthenticated ? (
          <>
            <button onClick={handleDashboardNavigation} style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.3s ease',
            }} onMouseEnter={(e) => {
              e.target.style.background = 'rgba(76, 175, 80, 0.2)';
              e.target.style.borderColor = 'rgba(76, 175, 80, 0.5)';
            }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}>
              {isAdmin ? 'Admin Panel' : 'Dashboard'}
            </button>

            <div style={{ position: 'relative' }}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #4caf50, #81c784)',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }} onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>account_circle</span>
                {user?.name}
              </button>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'linear-gradient(135deg, rgba(10, 46, 26, 0.98), rgba(15, 74, 42, 0.98))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  minWidth: '180px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  zIndex: 1000,
                }}>
                  <Link to={isAdmin ? '/admin/settings' : '/dashboard/profile'} style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.2s ease',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }} onMouseEnter={(e) => e.target.style.background = 'rgba(76, 175, 80, 0.2)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                    Profile
                  </Link>
                  {!isAdmin && (
                  <Link to="/dashboard/orders" style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.2s ease',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }} onMouseEnter={(e) => e.target.style.background = 'rgba(76, 175, 80, 0.2)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                    Orders
                  </Link>
                  )}
                  <button onClick={handleLogout} style={{
                    width: '100%',
                    padding: '12px 16px',
                    color: '#ff6b6b',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'left',
                    transition: 'background 0.2s ease',
                    borderRadius: '0 0 12px 12px',
                  }} onMouseEnter={(e) => e.target.style.background = 'rgba(255, 107, 107, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'inline-block',
            }} onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}>
              Login
            </Link>
            <Link to="/register" style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #4caf50, #81c784)',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              display: 'inline-block',
            }} onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.4)'}
              onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
