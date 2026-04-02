import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check local storage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    
    // Safety check: Ensure we don't accidentally load the literal string "undefined"
    if (token && role && role !== 'undefined') {
      setUser({ token, role, username });
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    // THE FIX: Correctly target the nested 'user' object from the backend response
    const token = data.token;
    const role = data.user ? data.user.role : data.role;
    const username = data.user ? data.user.username : data.username;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    
    // Keep the state structure perfectly matched with useEffect
    setUser({ token, role, username });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
