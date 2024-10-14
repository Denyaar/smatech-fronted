import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductList from "./components/ProductList";
import Checkout from "./components/Checkout";
import EditProduct from "./components/EditProduct";
import AddProduct from "./components/AddProduct";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <main className="container mx-auto mt-4 px-4">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/edit-product/:id" element={<EditProduct />} />
                  <Route path="/add-product" element={<AddProduct />} />
                </Route>
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
