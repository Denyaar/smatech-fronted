import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
  const navigate = useNavigate;
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      toast.success("Product added successfully");
      navigate("/products");
    } catch (error) {
      toast.error("Error adding product");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input type="text" id="name" name="name" value={product.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea id="description" name="description" value={product.description} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="price" className="block mb-1">
            Price
          </label>
          <input type="number" id="price" name="price" value={product.price} onChange={handleChange} required step="0.01" min="0" className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block mb-1">
            Image URL
          </label>
          <input type="url" id="imageUrl" name="imageUrl" value={product.imageUrl} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
