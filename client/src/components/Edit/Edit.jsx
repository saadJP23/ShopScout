import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import "../CreateProduct/CreateProduct.css";
import "./Edit.css";

const Edit = () => {
  const { id } = useParams(); // product DB id (not product_unique_id)
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const [callback, setCallback] = state.productsAPI.callback;
  const BASE_URL = 'https://shopscout-production-7795.up.railway.app';


  const [product, setProduct] = useState({
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products`);
        const productToEdit = res.data.products.find(
          (p) => p.id === parseInt(id)
        );
        if (!productToEdit) return alert("Product not found");

        setProduct(productToEdit);
        setImages(productToEdit.images || []);
        let previewImages = [];

        if (Array.isArray(productToEdit.images)) {
          previewImages = productToEdit.images.map((img) => img.url || img);
        } else if (productToEdit.images?.url) {
          previewImages = [productToEdit.images.url];
        } else if (typeof productToEdit.images === "string") {
          previewImages = [productToEdit.images];
        }

        setImagePreview(previewImages);
        setImages(
          Array.isArray(productToEdit.images)
            ? productToEdit.images
            : [productToEdit.images]
        );
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDeleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreview = imagePreview.filter((_, i) => i !== index);

    setImages(updatedImages);
    setImagePreview(updatedPreview);
  };

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
        const res = await axios.post(
          `${BASE_URL}/api/upload`,
          formData,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );
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
    if (!images.length) return alert("Please upload at least one image");

    try {
      await axios.put(`${BASE_URL}/api/products/${id}`, {
        ...product,
        images,
      });

      alert("Product updated!");
      setCallback((prev) => !prev);
      navigate("/admin/products");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update product");
      console.error(err);
    }
  };

  return (
    <div className="create-product">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="brand"
          value={product.brand}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          value={product.description}
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
          <option value="child">Child</option>
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
              <div key={idx} className="preview-box">
                <img src={url} alt={`preview-${idx}`} />
                <button type="button" onClick={() => handleDeleteImage(idx)}>
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default Edit;
