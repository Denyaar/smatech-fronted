import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";
import axios from "axios";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const BASE_URL = "http://127.0.0.1:8990";

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        BASE_URL + "/api/payments/process",
        {
          amount: total,
          cardNumber: e.target.card.value,
          expiryMonth,
          expiryYear,
          cvv: e.target.cvv.value,
          products: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: total,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        clearCart();
        toast.success("Payment successful!");
        window.location.href = "/products";
      } else {
        toast.error("Payment failed please check your card details");
      }
    } catch (error) {
      toast.error("Failed to process payment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleExpiryChange = (e) => {
    const [month, year] = e.target.value.split("/");
    setExpiryMonth(month);
    setExpiryYear(year);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="text-xl font-bold mt-4">Total: ${total.toFixed(2)}</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="card" className="block mb-1">
            Card Number
          </label>
          <input type="text" id="card" placeholder="1234 5678 9012 3456" required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="expiry" className="block mb-1">
              Expiry Date
            </label>
            <input type="text" id="expiry" placeholder="MM/YY" required className="w-full px-3 py-2 border rounded" onChange={handleExpiryChange} />
          </div>
          <div className="flex-1">
            <label htmlFor="cvv" className="block mb-1">
              CVV
            </label>
            <input type="text" id="cvv" placeholder="123" required className="w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Pay ${total.toFixed(2)}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
