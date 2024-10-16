import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductList from "./components/ProductList";
import Checkout from "./components/Checkout";
import EditProduct from "./components/EditProduct";
import AddProduct from "./components/AddProduct";
import ResetPassword from "./components/ResetPassword";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

function App() {
  const checkTokenExpiration = useAuth();

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <main className="container mx-auto mt-4 px-4">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {!checkTokenExpiration ? (
                  <>
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/edit-product/:id" element={<EditProduct />} />
                    <Route path="/add-product" element={<AddProduct />} />
                  </>
                ) : (
                  <Route path="*" element={<Navigate to="/" replace />} />
                )}
              </Routes>
            </main>
            <ToastContainer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
