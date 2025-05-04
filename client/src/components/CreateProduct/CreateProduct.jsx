import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./CreateProduct.css";

const CreateProduct = () => {
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

  const handleChange = (name, value) => {
    setProduct({ ...product, [name]: value });
  };

  const handleSizeChange = (index, name, value) => {
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

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    setLoading(true);

    const uploadedImages = [];
    const previewUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(`${BASE_URL}/api/upload`, formData, {
          headers: { "content-type": "multipart/form-data" },
        });
        uploadedImages.push(res.data);
        previewUrls.push(res.data.url);
      } catch (err) {
        alert("Image upload failed");
        console.error(err);
        setLoading(false);
        return;
      }
    }

    setImages([...images, ...uploadedImages]);
    setImagePreview([...imagePreview, ...previewUrls]);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/products`, {
        ...product,
        images,
      });

      alert("Product created!");
      window.location.href = "/"; // Navigate to homepage
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {loading && <p className="loading">Creating product...</p>}
      <h2>Create New Product</h2>
      <input
        type="text"
        placeholder="Product ID"
        value={product.product_id}
        onChange={(e) => handleChange("product_id", e.target.value)}
      />
      <input
        type="text"
        placeholder="Title"
        value={product.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={product.price}
        onChange={(e) => handleChange("price", e.target.value)}
      />
      <input
        type="text"
        placeholder="Brand"
        value={product.brand}
        onChange={(e) => handleChange("brand", e.target.value)}
      />
      <textarea
        placeholder="Short description"
        value={product.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <h4>Sizes and Units</h4>
      {product.sizes.map((item, index) => (
        <div className="size-unit-row" key={index}>
          <input
            type="text"
            placeholder="Size"
            value={item.size}
            onChange={(e) => handleSizeChange(index, "size", e.target.value)}
          />
          <input
            type="number"
            placeholder="Units"
            value={item.units}
            onChange={(e) => handleSizeChange(index, "units", e.target.value)}
          />
          <button onClick={() => removeSizeRow(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addSizeRow}>+ Add Size</button>

      <input
        type="text"
        placeholder="Category"
        value={product.category}
        onChange={(e) => handleChange("category", e.target.value)}
      />
      <input
        type="text"
        placeholder="Season"
        value={product.season}
        onChange={(e) => handleChange("season", e.target.value)}
      />

      <input type="file" multiple onChange={handleUpload} />
      <div className="preview-grid">
        {imagePreview.map((url, index) => (
          <img key={index} src={url} alt="preview" className="preview-image" />
        ))}
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Create Product"}
      </button>
    </div>
  );
};

export default CreateProduct;
