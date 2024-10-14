import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error("Error fetching product");
    }
  };

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
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
      toast.success("Product updated successfully");
      navigate("/products");
    } catch (error) {
      toast.error("Error updating product");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
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
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
