import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthStorage = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data);
      } catch {
        clearAuthStorage();
      }
    }
    setLoading(false);
  }, [clearAuthStorage]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const persistUser = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, user: userData } = response.data;
      persistUser(token, userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
  };

  const isAdmin = () => user?.role === 'administrador';
  const isCommitteeMember = () => user?.isCommitteeMember === true;

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isCommitteeMember,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;