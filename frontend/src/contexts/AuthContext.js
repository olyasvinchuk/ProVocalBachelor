import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserAdmin, setIsAdmin] = useState(false); // Default to false

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserRole(token); // Fetch user role if token is present
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    fetchUserRole(token); // Fetch user role on login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false); // Reset admin status on logout
  };

  const fetchUserRole = async (token) => {
    try {
      const response = await fetch("http://localhost:1234/api/users/token", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user role");
      }

      const userData = await response.json();
      setIsAdmin(userData.isAdmin);
    } catch (error) {
      console.error("Error fetching user role:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, isUserAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
