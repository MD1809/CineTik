import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cinetik_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('cinetik_token');
      const storedUser = localStorage.getItem('cinetik_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verify with backend me endpoint
          const response = await apiClient.get('/auth/me');
          if (response.data && response.data.data) {
            setUser(response.data.data);
            localStorage.setItem('cinetik_user', JSON.stringify(response.data.data));
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const data = response.data.data; // LoginResponse (token, user)
      const jwtToken = data.token;
      const userInfo = data.user;

      setToken(jwtToken);
      setUser(userInfo);
      localStorage.setItem('cinetik_token', jwtToken);
      localStorage.setItem('cinetik_user', JSON.stringify(userInfo));
      return { success: true, user: userInfo };
    } catch (error) {
      const msg = error.response?.data?.message || 'Đăng nhập thất bại';
      return { success: false, message: msg };
    }
  };

  const register = async (registerData) => {
    try {
      const response = await apiClient.post('/auth/register', registerData);
      return { success: true, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Đăng ký thất bại';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cinetik_token');
    localStorage.removeItem('cinetik_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
