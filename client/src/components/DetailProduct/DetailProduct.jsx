import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { FiShoppingCart, FiHeart, FiZap, FiPackage, FiRefreshCcw } from "react-icons/fi";
import { useToast } from "../Toast/ToastProvider";
import axios from "axios";
import "./DetailProduct.css";

const getWishlist = () => {
  try { return JSON.parse(localStorage.getItem("ss_wishlist") || "[]"); }
  catch { return []; }
};

const DetailProduct = () => {
  const { id }   = useParams();
  const state    = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const addCart  = state.userAPI.addCart;
  const toast    = useToast();

  const [detailProduct, setDetailProduct] = useState(null);
  const [mainImage, setMainImage]         = useState("");
  const [selectedSize, setSelectedSize]   = useState("");
  const [wished, setWished]               = useState(false);
  const [buying, setBuying]               = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL || "https://api.shopscout.org";

  useEffect(() => {
    if (id && products.length > 0) {
      const found = products.find(p => p.product_unique_id === id);
      if (found) {
        setDetailProduct(found);
        setMainImage(Array.isArray(found.images) ? (found.images[0]?.url || found.images[0]) : "");
        const wl = getWishlist();
        setWished(wl.some(pid => pid === (found._id || found.id)));
      }
    }
  }, [id, products]);

  if (!detailProduct) return (
    <div className="dp-loading">
      <div className="dp-loading__spinner" />
    </div>
  );

  const toggleWishlist = () => {
    const wl  = getWishlist();
    const pid = detailProduct._id || detailProduct.id;
    const updated = wished ? wl.filter(x => x !== pid) : [...wl, pid];
    localStorage.setItem("ss_wishlist", JSON.stringify(updated));
    setWished(!wished);
    toast.info(wished ? "Removed from wishlist" : "Added to wishlist ♥");
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    try {
      setBuying(true);
      const userEmail = localStorage.getItem("userEmail");
      const res = await axios.post(`${BASE_URL}/api/checkout-single`, {
        product: { title: detailProduct.title, price: detailProduct.price, email: userEmail },
      });
      window.location.href = res.data.url;
    } catch {
      toast.error("Payment could not be started.");
    } finally {
      setBuying(false);
    }
  };

  const confirmAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size first."); return; }
    addCart({ ...detailProduct, productId: detailProduct._id || detailProduct.id, size: selectedSize, quantity: 1 });
    toast.success(`${detailProduct.title} added to cart!`);
    setSelectedSize("");
  };

  const images = Array.isArray(detailProduct.images) ? detailProduct.images : [];

  const getSoldCount = (size) => {
    const arr = Array.isArray(detailProduct.sold)
      ? detailProduct.sold
      : JSON.parse(detailProduct.sold || "[]");
    return arr.find(x => x.size === size)?.units || 0;
  };

  return (
    <div className="dp">
      {/* ── Gallery ── */}
      <div className="dp__gallery">
        <div className="dp__main-img">
          <img src={mainImage} alt={detailProduct.title} />
        </div>
        {images.length > 1 && (
          <div className="dp__thumbs">
            {images.map((img, i) => {
              const url = img.url || img;
              return (
                <button
                  key={i}
                  className={`dp__thumb ${mainImage === url ? "active" : ""}`}
                  onClick={() => setMainImage(url)}
                >
                  <img src={url} alt={`${detailProduct.title} ${i+1}`} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="dp__info">
        <div className="dp__info-header">
          <h1 className="dp__title">{detailProduct.title}</h1>
          <button
            className={`dp__wish-btn ${wished ? "active" : ""}`}
            onClick={toggleWishlist}
            aria-label="Wishlist"
          >
            <FiHeart size={20} />
          </button>
        </div>

        <span className="dp__price">¥{detailProduct.price?.toLocaleString()}</span>

        {detailProduct.description && (
          <p className="dp__desc">{detailProduct.description}</p>
        )}

        {/* Size Selector */}
        <div className="dp__size-section">
          <p className="dp__size-label">
            Select Size
            {selectedSize && <span className="dp__size-selected"> — {selectedSize}</span>}
          </p>
          <div className="dp__size-chips">
            {detailProduct.sizes?.map((s, i) => {
              const avail = parseInt(s.units) - getSoldCount(s.size);
              const isOut = avail <= 0;
              return (
                <button
                  key={i}
                  className={`dp__size-chip ${selectedSize === s.size ? "active" : ""} ${isOut ? "out" : ""}`}
                  onClick={() => !isOut && setSelectedSize(s.size)}
                  disabled={isOut}
                >
                  {s.size}
                  {isOut && <span className="dp__size-out-badge">Out</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="dp__actions">
          <button
            className="dp__btn-buy"
            onClick={handleBuyNow}
            disabled={buying}
          >
            <FiZap size={16} />
            {buying ? "Redirecting…" : "Buy Now"}
          </button>
          <button className="dp__btn-cart" onClick={confirmAddToCart}>
            <FiShoppingCart size={16} /> Add to Cart
          </button>
        </div>

        {/* Perks */}
        <div className="dp__perks">
          <div className="dp__perk"><FiPackage size={16} /> Free shipping on orders over ¥5,000</div>
          <div className="dp__perk"><FiRefreshCcw size={16} /> 30-day returns — no questions asked</div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
