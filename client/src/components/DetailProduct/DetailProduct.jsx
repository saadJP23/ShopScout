import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import "./DetailProduct.css";

const DetailProduct = () => {
  const { id } = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [detailProduct, setDetailProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const addCart = state.userAPI.addCart;
  const BASE_URL = "https://api.shopscout.org";

  useEffect(() => {
    if (id && products.length > 0) {
      const found = products.find(
        (product) => product.product_unique_id === id
      );
      if (found) {
        setDetailProduct(found);
        const firstImage = Array.isArray(found.images)
          ? found.images[0]?.url || found.images[0]
          : found.images?.url || found.images || "";
        setMainImage(firstImage);
      }
    }
  }, [id, products]);

  if (!detailProduct) return <div>Loading...</div>;

  const handleBuyNow = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const res = await axios.post(`${BASE_URL}/api/checkout-single`, {
        product: {
          title: detailProduct.title,
          price: detailProduct.price,
          email: userEmail,
        },
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment error:", err.message);
    }
  };

  const confirmAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    addCart({
      ...detailProduct,
      productId: detailProduct._id || detailProduct.id,
      size: selectedSize,
    });

    setSelectedSize("");
  };

  return (
    <div className="product-detail-page">
      <div className="product-gallery">
        <div className="main-image-box">
          <img src={mainImage} alt={detailProduct.title} />
        </div>
        <div className="thumbnail-row">
          {Array.isArray(detailProduct.images) &&
            detailProduct.images.map((img, idx) => {
              const url = img.url || img;
              return (
                <img
                  key={idx}
                  src={url}
                  alt={`thumb-${idx}`}
                  onClick={() => setMainImage(url)}
                  className={mainImage === url ? "active-thumb" : ""}
                />
              );
            })}
        </div>
      </div>

      <div className="product-info-box">
        <h2 className="product-title">{detailProduct.title}</h2>
        <span className="product-price">¥{detailProduct.price}</span>

        <h2>Product Details</h2>
        <p className="product-description">{detailProduct.description}</p>
        <p className="product-content">{detailProduct.content}</p>

        <div className="size-select">
          <label>Select Size:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">-- Choose Size --</option>
            {detailProduct.sizes?.map((s, index) => {
              const soldArray = Array.isArray(detailProduct.sold)
                ? detailProduct.sold
                : JSON.parse(detailProduct.sold || "[]");

              const soldCount =
                soldArray.find((soldItem) => soldItem.size === s.size)
                  ?.units || 0;

              const remaining = parseInt(s.units) - soldCount;
              const isDisabled = remaining <= 0;

              return (
                <option key={index} value={s.size} disabled={isDisabled}>
                  {s.size} ({remaining} left)
                </option>
              );
            })}
          </select>
        </div>

        <div className="product-action-row">
          <button className="btn-buy-now" onClick={handleBuyNow}>
            Buy Now
          </button>
          <button className="btn-add-cart" onClick={confirmAddToCart}>
            <FaShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
