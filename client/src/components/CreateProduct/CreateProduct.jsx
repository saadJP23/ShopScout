import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./CreateProduct.css";
import { useNavigate } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { v4 as uuidv4 } from "uuid";

const CreateProduct = () => {
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const [callback, setCallback] = state.productsAPI.callback;
  const BASE_URL = "https://api.shopscout.org";
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    product_unique_id: uuidv4(),
    product_id: "",
    title: "",
    price: "",
    description: "",
    category: "",
    season: "",
    brand: "",
    sizes: [{ size: "", units: "" }],
  });

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSizes = [...product.sizes];
    updatedSizes[index][name] = value;
    setProduct({ ...product, sizes: updatedSizes });
  };

  const addSizeRow = () => {
    setProduct({
      ...product,
      sizes: [...product.sizes, { size: "", units: "" }],
    });
  };

  const removeSizeRow = (index) => {
    const updatedSizes = product.sizes.filter((_, i) => i !== index);
    setProduct({ ...product, sizes: updatedSizes });
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
          headers: { "content-type": "multipart/form-data" },
        });
        uploadedImages.push(res.data);
      } catch (err) {
        alert("Image upload failed");
        console.error(err);
      }
    }

    setImages([...images, ...uploadedImages]);
    setImagePreview([...imagePreview, ...uploadedImages.map((img) => img.url)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images) return alert("Please upload an image");

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/products`, {
        ...product,
        images,
      });

      alert("Product created!");
      setCallback((prev) => !prev);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product">
      {loading ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>
          Creating product...
        </p>
      ) : (
        <>
          <h2>Create New Product</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="product_id"
              placeholder="Product ID"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Short description"
              onChange={handleChange}
              required
            />

            <h4>Sizes and Units</h4>
            {product.sizes.map((item, index) => (
              <div key={index} className="size-unit-row">
                <select
                  name="size"
                  value={item.size}
                  onChange={(e) => handleSizeChange(e, index)}
                  required
                >
                  <option value="">Select Size</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                </select>

                <input
                  type="number"
                  name="units"
                  placeholder="Units"
                  value={item.units}
                  onChange={(e) => handleSizeChange(e, index)}
                  required
                />

                <button type="button" onClick={() => removeSizeRow(index)}>
                  Remove
                </button>
              </div>
            ))}

            <button type="button" onClick={addSizeRow}>
              + Add Size
            </button>

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
              <option value="child">Infant</option>
            </select>

            <select
              name="season"
              value={product.season}
              onChange={handleChange}
              required
            >
              <option value="">Select Season</option>
              <option value="summer">Summer</option>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
              <option value="autumn">Autumn</option>
            </select>

            <input type="file" multiple onChange={handleUpload} />
            {imagePreview.length > 0 && (
              <div className="preview-grid">
                {imagePreview.map((url, idx) => (
                  <img key={idx} src={url} alt={`Preview ${idx}`} width="150" />
                ))}
              </div>
            )}

            <button type="submit">Create Product</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateProduct;
