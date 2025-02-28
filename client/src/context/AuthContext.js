import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || null);

  useEffect(() => {
    const handleStorageChange = () => setUserId(sessionStorage.getItem("userId"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (id) => {
    sessionStorage.setItem("userId", id);
    setUserId(id);
  };

  const logout = () => {
    sessionStorage.removeItem("userId");
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};