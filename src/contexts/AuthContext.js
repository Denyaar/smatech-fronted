import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const base_url = "http://127.0.0.1:8990/api";

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(localStorage.getItem("user"));
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
      const response = await axios.post(`${base_url}/user/logout`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.status === 200) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem("token");
      navigate("/");
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

      if (!response.status === 200) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
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

  const checkTokenExpiration = () => {
    let decodedToken = jwtDecode(localStorage.getItem("token"));
    let currentDate = new Date();

    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      console.log("Token expired.");
      window.location.href = "/";
      sessionStorage.removeItem("token");
      return true;
    }
    return false;
  };

  return <AuthContext.Provider value={{ user, login, logout, register, checkTokenExpiration }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
