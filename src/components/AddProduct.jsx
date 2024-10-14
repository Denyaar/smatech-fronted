import axios from "axios";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const BASE_URL = "http://127.0.0.1:8990/api/product";

  const [file, setFile] = useState(undefined);

  const [products, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const parsedValue = name === "price" || name === "quantity" ? parseInt(value, 10) : value;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: parsedValue,
    }));
  };

  const addProduct = async (productData) => {
    try {
      debugger;
      const response = await axios.post(BASE_URL + "/create", productData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error while adding product", error);
      throw error;
    }
  };

  const updatePhoto = async (formData) => {
    try {
      const response = await axios.post(BASE_URL + "/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error while adding product", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await addProduct(products);

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", data.id);

      const { data: imageUrl } = await updatePhoto(formData);

      setFile(undefined);
      fileRef.current.value = null;
      setProduct({
        name: "",
        price: "",
        quantity: "",
      });
      toast.success(data.name + " has been added successfully");
      navigate("/products");
    } catch (error) {
      console.error("Error while adding contact", error);
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
          <input type="text" id="name" name="name" value={products.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label htmlFor="price" className="block mb-1">
            Price
          </label>
          <input type="number" id="price" name="price" value={products.price} onChange={handleChange} required step="0.01" min="0" className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label htmlFor="quantity" className="block mb-1">
            Quantity
          </label>
          <textarea id="quantity" name="quantity" value={products.quantity} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block mb-1">
            Product Photo
          </label>
          <input type="file" onChange={(event) => setFile(event.target.files[0])} ref={fileRef} name="photo" required className="w-full px-3 py-2 border rounded" />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
