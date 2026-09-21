import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  
  const exchangeAuthCode = async (code) => {
    try {
      const res = await api.post('/github/exchange-code', { code });
      const token = res.data.token;
      
      // Temporarily store just the token in userInfo so api.js interceptor picks it up
      // for the /auth/me call
      localStorage.setItem('userInfo', JSON.stringify({ token }));
      
      const userRes = await api.get('/auth/me');
      
      // Now store the full userInfo with the token
      const fullUserInfo = { ...userRes.data, token };
      setUser(fullUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(fullUserInfo));
      
      return true;
    } catch (error) {
      console.error(error);
      localStorage.removeItem('userInfo');
      return false;
    }
  };



  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, 
    exchangeAuthCode, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
