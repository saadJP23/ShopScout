import React, { useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import { Link } from "react-router-dom";
import "./ManageProduct.css";

const ManageProduct = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [callback, setCallback] = state.productsAPI.callback;
  const BASE_URL = "https://api.shopscout.org";



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        setProducts(res.data.products || res.data); // fallback for direct array
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [callback, setProducts]);

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${BASE_URL}/api/products/${id}`);
        setCallback((prev) => !prev);
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="manage-product-container">
      <h2>Manage Products</h2>
      <Link to="/admin/create" className="create-product-btn">
        + Create New Product
      </Link>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.product_unique_id} className="product-card">
            <div className="product-images">
              {Array.isArray(product.images) ? (
                product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url || img} // fallback if it's a string
                    alt={`img-${idx}`}
                    className="product-thumb"
                  />
                ))
              ) : product.images?.url ? (
                <img
                  src={product.images.url}
                  alt="product-img"
                  className="product-thumb"
                />
              ) : (
                <p>No images</p>
              )}
            </div>
            <div className="product-details">
              <h3>{product.title}</h3>
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
              <p>
                <strong>Price:</strong> ¥{product.price}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Season:</strong> {product.season}
              </p>
              <p>
                <strong>Sizes:</strong>{" "}
                {product.sizes?.map((s) => `${s.size} (${s.units})`).join(", ")}
              </p>
            </div>
            <div className="product-actions">
              <Link to={`/admin/edit/${product.id}`} className="edit-btn">
                Edit
              </Link>
              <button
                onClick={() => deleteProduct(product.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProduct;
