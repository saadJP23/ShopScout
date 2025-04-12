import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductAPI = () => {
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);
  const BASE_URL = "https://api.shopscout.org";

  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/products`);
      console.log("✅ Products response:", res.data);
      setProducts(res.data.products); // Or adapt if your key is different
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    getProducts();
  }, [callback]);

  return {
    products: [products, setProducts],
    callback: [callback, setCallback],
    loading,
  };
};

export default ProductAPI;
