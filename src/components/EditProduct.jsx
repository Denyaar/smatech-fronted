import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const base_url = "http://127.0.0.1:8990/api";
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);

  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    Quantity: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(base_url + `/product/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  const updateProduct = async (productData) => {
    try {
      const response = await axios.put(base_url + `/product/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response;
    } catch (error) {
      console.error("Error while adding product", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const product1 = await updateProduct(product);

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", product1.data.id);

      const response = await axios.post(base_url + "/product/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.status === 200) {
        throw new Error("Something went wrong");
      }

      toast.success(product1.data.name + " has been updated successfully");
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
          <label htmlFor="price" className="block mb-1">
            Price
          </label>
          <input type="number" id="price" name="price" value={product.price} onChange={handleChange} required step="0.01" min="0" className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label htmlFor="quantity" className="block mb-1">
            Quantity
          </label>
          <textarea id="quantity" name="quantity" value={product.quantity} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block mb-1">
            Product Photo
          </label>
          <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name="photo" required className="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
