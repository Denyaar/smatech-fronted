import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const [imageSrc, setImageSrc] = useState("");
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(product.imageUrl, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob)); // Create a local URL for the image blob
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, [product.imageUrl]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <img src={imageSrc} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mb-4">Quantity :{product.quantity}</p>
        <div className="flex justify-between items-center">
          <button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add to Cart
          </button>
          <Link to={`/edit-product/${product.id}`} className="text-blue-500 hover:text-blue-700">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
