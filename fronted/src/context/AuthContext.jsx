import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=> JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token) return;
    // optionally verify token on mount
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };
  const logout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}