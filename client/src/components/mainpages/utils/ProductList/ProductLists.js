import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./productList.css";
import { FiShoppingCart, FiHeart, FiZap } from "react-icons/fi";
import { GlobalState } from "../../../../GlobalState";
import { useToast } from "../../../../components/Toast/ToastProvider";
import axios from "axios";

const getWishlist = () => {
  try { return JSON.parse(localStorage.getItem("ss_wishlist") || "[]"); }
  catch { return []; }
};

const ProductLists = ({ products }) => {
  const state   = useContext(GlobalState);
  const addCart = state.userAPI.addCart;
  const toast   = useToast();

  const [showModal, setShowModal]     = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading]         = useState(false);
  const [wished, setWished]           = useState(false);

  const BASE_URL = process.env.REACT_APP_API_URL || "https://api.shopscout.org";

  useEffect(() => {
    const wl = getWishlist();
    setWished(wl.some(id => id === (products._id || products.id)));
  }, [products]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wl = getWishlist();
    const pid = products._id || products.id;
    const updated = wished ? wl.filter(id => id !== pid) : [...wl, pid];
    localStorage.setItem("ss_wishlist", JSON.stringify(updated));
    setWished(!wished);
    toast.info(wished ? "Removed from wishlist" : "Added to wishlist ♥");
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("userEmail");
      const res = await axios.post(`${BASE_URL}/api/checkout-single`, {
        product: { title: products.title, price: products.price, email: userEmail },
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Payment could not be started.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const confirmAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size."); return; }
    addCart({ ...products, productId: products._id || products.id, size: selectedSize });
    toast.success(`${products.title} added to cart!`);
    setShowModal(false);
    setSelectedSize("");
  };

  const firstImage = Array.isArray(products.images) && products.images.length > 0
    ? (products.images[0].url || products.images[0])
    : "/placeholder.png";

  return (
    <>
      <div className="pcard">
        {/* Wishlist Button */}
        <button
          className={`pcard__wish ${wished ? "pcard__wish--active" : ""}`}
          onClick={toggleWishlist}
          aria-label="Wishlist"
        >
          <FiHeart size={15} />
        </button>

        {/* Image */}
        <Link to={`/detail/${products.product_unique_id}`} className="pcard__img-wrap">
          <img src={firstImage} alt={products.title} className="pcard__img" />
          <div className="pcard__overlay">
            <span className="pcard__overlay-text">View Details</span>
          </div>
        </Link>

        {/* Info */}
        <div className="pcard__body">
          <p className="pcard__title">{products.title}</p>
          <span className="pcard__price">¥{products.price?.toLocaleString()}</span>
        </div>

        {/* Actions */}
        <div className="pcard__actions">
          <button
            className="pcard__btn-buy"
            onClick={handleBuyNow}
            disabled={loading}
          >
            <FiZap size={14} />
            {loading ? "…" : "Buy Now"}
          </button>
          <button
            className="pcard__btn-cart"
            onClick={openModal}
            aria-label="Add to cart"
          >
            <FiShoppingCart size={15} />
          </button>
        </div>
      </div>

      {/* Size Modal */}
      {showModal && (
        <div className="size-modal" onClick={() => setShowModal(false)}>
          <div className="size-modal__box" onClick={e => e.stopPropagation()}>
            <h4 className="size-modal__title">Select Size</h4>
            <p  className="size-modal__product">{products.title}</p>

            <div className="size-modal__chips">
              {products.sizes?.map((s, i) => {
                const soldArray = Array.isArray(products.sold)
                  ? products.sold
                  : JSON.parse(products.sold || "[]");
                const sold    = soldArray.find(x => x.size === s.size)?.units || 0;
                const avail   = parseInt(s.units) - sold;
                const isOut   = avail <= 0;
                return (
                  <button
                    key={i}
                    className={`size-chip ${selectedSize === s.size ? "active" : ""} ${isOut ? "disabled" : ""}`}
                    onClick={() => !isOut && setSelectedSize(s.size)}
                    disabled={isOut}
                  >
                    {s.size}
                    {isOut && <span className="size-chip__out">Out</span>}
                  </button>
                );
              })}
            </div>

            <div className="size-modal__footer">
              <button className="size-modal__confirm" onClick={confirmAddToCart}>
                <FiShoppingCart size={15} /> Add to Cart
              </button>
              <button className="size-modal__cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductLists;
