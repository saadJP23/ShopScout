import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import { useToast } from "../Toast/ToastProvider";
import LoadingSpinner from "../LoadingSpinner";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const state = useContext(GlobalState);
  const [token]   = state.token;
  const [cart, setCart] = state.userAPI.cart || [[], () => {}];
  const toast  = useToast();
  const [loading, setLoading]   = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const BASE_URL = process.env.REACT_APP_API_URL || "https://api.shopscout.org";

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userRes    = await axios.get(`${BASE_URL}/user/infor`, { headers: { Authorization: `Bearer ${token}` } });
        const productRes = await axios.get(`${BASE_URL}/api/products`);
        const allProducts = productRes.data.products;
        const cartItems   = userRes.data.cart || [];
        const merged = cartItems
          .map(item => ({ ...item, _id: item.productId, product: allProducts.find(p => p.id === item.productId) }))
          .filter(i => i.product);
        setUserEmail(userRes.data.email);
        setCart(merged);
      } catch (err) {
        console.error("Cart load failed:", err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCart();
    else setLoading(false);
  }, [token]);

  const syncCart = async (updated) => {
    const slim = updated.map(({ productId, quantity, size }) => ({ productId, quantity, size }));
    setCart(updated);
    try {
      await axios.patch(`${BASE_URL}/user/addcart`, { cart: slim }, { headers: { Authorization: `Bearer ${token}` } });
    } catch {}
  };

  const changeQty = (id, size, delta) => {
    const updated = cart.map(item =>
      item._id === id && item.size === size
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    syncCart(updated);
  };

  const removeItem = (id, size) => {
    syncCart(cart.filter(i => !(i._id === id && i.size === size)));
    toast.info("Item removed from cart.");
  };

  const handleSizeChange = (id, oldSize, newSize) => {
    syncCart(cart.map(i => i._id === id && i.size === oldSize ? { ...i, size: newSize } : i));
  };

  const getSubtotal = () => cart.reduce((t, i) => t + (i.product?.price || 0) * i.quantity, 0);
  const getTotalQty = () => cart.reduce((t, i) => t + i.quantity, 0);

  const handleCheckout = async () => {
    const cleaned = cart.map(item => ({
      product: {
        title: item.product?.title || "",
        price: item.product?.price || 0,
        image: item.product?.images?.[0]?.url || item.product?.images?.[0] || "",
      },
      quantity: item.quantity,
      size: item.size,
      productId: item.product?.id || item._id || item.productId,
    }));
    try {
      const res = await axios.post(`${BASE_URL}/api/checkout-cart`, { cart: cleaned, email: userEmail });
      window.location.href = res.data.url;
    } catch {
      toast.error("Checkout could not be started. Please try again.");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!Array.isArray(cart) || cart.length === 0) return (
    <div className="cart-empty">
      <FiShoppingBag size={64} className="cart-empty__icon" />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <Link to="/view_all" className="cart-empty__btn">Browse Products</Link>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <h1 className="cart-page__title">Your Cart</h1>
        <p className="cart-page__sub">{getTotalQty()} item{getTotalQty() !== 1 ? "s" : ""}</p>
      </div>

      <div className="cart-page__layout">
        {/* ── Items ── */}
        <div className="cart-items">
          {cart.map(item => item.product && (
            <div key={`${item._id}-${item.size}`} className="cart-item">
              <div className="cart-item__img-wrap">
                <img
                  src={item.product.images?.[0]?.url || item.product.images?.[0]}
                  alt={item.product.title}
                  className="cart-item__img"
                />
              </div>

              <div className="cart-item__details">
                <h3 className="cart-item__name">{item.product.title}</h3>
                <p className="cart-item__price">¥{item.product.price?.toLocaleString()}</p>

                <div className="cart-item__meta">
                  <div className="cart-item__size">
                    <label>Size</label>
                    <select
                      value={item.size || ""}
                      onChange={e => handleSizeChange(item._id, item.size, e.target.value)}
                      className="cart-item__size-select"
                    >
                      <option value="">—</option>
                      {item.product?.sizes?.map((s, i) => (
                        <option key={i} value={s.size}>{s.size}</option>
                      ))}
                    </select>
                  </div>

                  <div className="cart-item__qty">
                    <button onClick={() => changeQty(item._id, item.size, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQty(item._id, item.size, +1)}>+</button>
                  </div>
                </div>
              </div>

              <div className="cart-item__right">
                <p className="cart-item__total">
                  ¥{((item.product?.price || 0) * item.quantity).toLocaleString()}
                </p>
                <button
                  className="cart-item__remove"
                  onClick={() => removeItem(item._id, item.size)}
                  aria-label="Remove"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Summary ── */}
        <div className="cart-summary">
          <h3 className="cart-summary__title">Order Summary</h3>
          <div className="cart-summary__rows">
            <div className="cart-summary__row">
              <span>Subtotal ({getTotalQty()} items)</span>
              <span>¥{getSubtotal().toLocaleString()}</span>
            </div>
            <div className="cart-summary__row">
              <span>Shipping</span>
              <span className="cart-summary__free">{getSubtotal() >= 5000 ? "Free" : "¥500"}</span>
            </div>
            <div className="cart-summary__divider" />
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>¥{(getSubtotal() + (getSubtotal() >= 5000 ? 0 : 500)).toLocaleString()}</span>
            </div>
          </div>
          <button className="cart-summary__checkout" onClick={handleCheckout}>
            <FiShoppingBag size={16} /> Proceed to Checkout
          </button>
          <Link to="/view_all" className="cart-summary__continue">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
