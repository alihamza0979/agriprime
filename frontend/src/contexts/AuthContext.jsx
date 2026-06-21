import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage and refresh from server
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setToken(storedToken);

        try {
          const res = await api.get('/auth/me');
          const freshUser = res.data.data;
          const userObj = { id: freshUser._id, name: freshUser.name, email: freshUser.email, role: freshUser.role };
          localStorage.setItem('user', JSON.stringify(userObj));
          setUser(userObj);
          setIsAuthenticated(true);
        } catch {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setToken(token);
        setUser(user);
        setIsAuthenticated(true);
        return user;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      if (response.data.success) {
        return response.data;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
