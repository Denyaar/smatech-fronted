import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const base_url = "http://127.0.0.1:8990/api";

  useEffect(() => {
    // Check if user is logged in (e.g., by checking local storage or making an API call)
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${base_url}/user/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error("Token not received");
      }

      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${base_url}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${base_url}/user/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error("Token not received");
      }
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const isAuthenticated = () => {
    return !!getToken();
  };

  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
