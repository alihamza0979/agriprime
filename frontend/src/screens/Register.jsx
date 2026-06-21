import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password, 'customer');
      // After successful registration, redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a2e1a] to-[#0f4a2a] p-4 font-inter">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 p-10 relative overflow-hidden">
        {/* Decorative eco circle */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-secondary/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-lg transition-all text-white">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div className="flex-1 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/30 mb-4 mx-auto">
                <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>eco</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white font-manrope tracking-tight">AgriPrime</h1>
              <p className="text-white/60 text-sm mt-1 tracking-widest uppercase font-bold text-center">Create Account</p>
            </div>
            <div className="w-10"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white/60 text-sm mb-2">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">person</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">mail</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">lock</span>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">lock_check</span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold font-manrope text-lg shadow-lg hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-white/60 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:text-primary-container transition-all">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
