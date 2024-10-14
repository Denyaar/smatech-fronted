import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Smatech-e-commerce Store
        </Link>
        <div className="space-x-4">
          <Link to="/products" className="hover:text-gray-300">
            Products
          </Link>
          {user ? (
            <>
              <Link to="/checkout" className="hover:text-gray-300">
                Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </Link>
              {user.isAdmin && (
                <Link to="/add-product" className="hover:text-gray-300">
                  Add Product
                </Link>
              )}
              <button onClick={logout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
