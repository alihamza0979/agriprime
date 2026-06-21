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
    <nav className="flex flex-wrap justify-between items-center px-4 md:px-8 py-4 bg-gradient-to-br from-[#0a2e1a]/95 to-[#0f4a2a]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-[100] gap-4">
      {/* Logo / Brand */}
      <Link to="/" className="flex items-center gap-3 text-white no-underline">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center shadow-lg shadow-green-500/40 shrink-0">
          <span className="material-symbols-outlined text-white text-2xl font-bold">eco</span>
        </div>
        <span className="text-xl font-bold font-body text-white tracking-tight">AgriPrime</span>
      </Link>

      {/* Center Navigation - Hidden on mobile */}
      <div className="hidden md:flex gap-8 items-center">
        <Link to="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors font-body">Marketplace</Link>
        <a href="#categories" className="text-white/80 hover:text-white text-sm font-medium transition-colors font-body">Categories</a>
        <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors font-body">About</a>
      </div>

      {/* Right Side Actions */}
      <div className="flex gap-2 md:gap-4 items-center">
        {onCartClick && (
          <button onClick={onCartClick} className="relative p-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center">
            <span className="material-symbols-outlined text-xl">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        )}
        {isAuthenticated ? (
          <>
            <button onClick={handleDashboardNavigation} className="hidden sm:block px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-green-500/20 hover:border-green-500/50 transition-all font-body">
              {isAdmin ? 'Admin Panel' : 'Dashboard'}
            </button>

            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="px-4 py-2 bg-gradient-to-br from-green-500 to-green-400 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-500/40 transition-all flex items-center gap-2 font-body border-none">
                <span className="material-symbols-outlined text-lg">account_circle</span>
                <span className="hidden sm:inline">{user?.name}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-gradient-to-br from-[#0a2e1a]/98 to-[#0f4a2a]/98 border border-white/10 rounded-xl min-w-[180px] shadow-2xl z-[1000] overflow-hidden">
                  <Link to={isAdmin ? '/admin/settings' : '/dashboard/profile'} className="block px-4 py-3 text-white text-sm hover:bg-green-500/20 transition-colors border-b border-white/10 font-body">
                    Profile
                  </Link>
                  {!isAdmin && (
                    <Link to="/dashboard/orders" className="block px-4 py-3 text-white text-sm hover:bg-green-500/20 transition-colors border-b border-white/10 font-body">
                      Orders
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 text-sm hover:bg-red-500/10 transition-colors font-body border-none bg-transparent cursor-pointer">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-all font-body hidden sm:inline-block">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-gradient-to-br from-green-500 to-green-400 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-green-500/40 transition-all font-body">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
