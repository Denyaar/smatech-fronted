import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const { cart } = useCart();
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        setIsTokenValid(payload.exp > currentTime);
      } catch (error) {
        console.error("Error parsing token:", error);
        setIsTokenValid(false);
      }
    };

    checkTokenValidity();
    const intervalId = setInterval(checkTokenValidity, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Smatech-e-commerce Store
        </Link>
        <div className="space-x-4">
          {isTokenValid ? (
            <>
              <Link to="/products" className="hover:text-gray-300">
                Products
              </Link>
              <Link to="/checkout" className="hover:text-gray-300">
                Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </Link>
              <Link to="/add-product" className="hover:text-gray-300">
                Add Product
              </Link>
              <button onClick={logout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : location.pathname === "/" ? (
            <Link to="/register" className="text-white hover:text-gray-200">
              Register
            </Link>
          ) : (
            <Link to="/" className="text-white hover:text-gray-200">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
