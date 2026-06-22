import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (['worker', 'veterinarian', 'manager', 'accountant'].includes(user.role)) {
        navigate('/worker', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (['worker', 'veterinarian', 'manager', 'accountant'].includes(userData.role)) {
        navigate('/worker', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a2e1a] via-[#0d3d24] to-[#0f4a2a] p-4 font-inter">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="p-2 hover:bg-white/10 rounded-xl transition-all text-white/80 hover:text-white">
                <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              <div className="w-10" />
            </div>

            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/30 mb-5 mx-auto">
                <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>eco</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white font-manrope tracking-tight">Welcome Back</h1>
              <p className="text-white/50 text-sm mt-2">Sign in to your AgriPrime account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-500/15 border border-red-400/30 rounded-xl text-red-100 text-sm text-center font-medium flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">mail</span>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full bg-black/25 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 ml-1">Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40">lock</span>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full bg-black/25 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end mt-2">
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold font-manrope text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-white/50 text-sm mt-8">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary font-bold hover:text-white transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          AgriPrime Farm Management Platform
        </p>
      </div>
    </div>
  );
}
