import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          const data = await authService.getCurrentUser();
          setUser(data.me);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials, rememberMe) => {
    const data = await authService.login(credentials);
    setUser({ ...data.user, token: data.token });
    
    if (rememberMe) {
        localStorage.setItem('token', data.token);
    } else {
        sessionStorage.setItem('token', data.token);
    }
    
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser({ ...data.user, token: data.token });
    localStorage.setItem('token', data.token); // Default to localStorage for new signups
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (formData) => {
    const data = await authService.updateProfile(formData);
    setUser(data.user);
    return data;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
