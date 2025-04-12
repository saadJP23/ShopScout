import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import "./Cart.css";
import LoadingSpinner from "../LoadingSpinner";

const Cart = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [userEmail, setUserEmail] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = state.userAPI.cart || [[], () => {}];
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });
  const BASE_URL = "https://api.shopscout.org";


  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const userRes = await axios.get(`${BASE_URL}/user/infor`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const productRes = await axios.get(`${BASE_URL}/api/products`);

        const allProducts = productRes.data.products;
        const cartItems = userRes.data.cart || [];

        const mergedCart = cartItems
          .map((item) => {
            const product = allProducts.find((p) => p.id === item.productId);
            return {
              ...item,
              _id: item.productId,
              product,
            };
          })
          .filter((item) => item.product);

        setUserInfo({ name: userRes.data.name, email: userRes.data.email });
        setIsLogged(true);
        setIsAdmin(userRes.data.role === 1);
        setCart(mergedCart);
        setUserEmail(userRes.data.email);
      } catch (err) {
        console.error("Failed to load cart:", err.response?.data?.msg || err.message);
      } finally {
        setLoading(false); // ✅ Done loading
      }
    };

    if (token) fetchCartData();
  }, [token]);

  const syncCart = async (updatedCart) => {
    try {
      const reducedCart = updatedCart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
      }));

      setCart(updatedCart);

      await axios.patch(
        `${BASE_URL}/user/addcart`,
        { cart: reducedCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Cart sync failed:", err.response?.data?.msg || err.message);
    }
  };

  const increaseQty = (id, size) => {
    const updated = cart.map((item) =>
      item._id === id && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updated);
    syncCart(updated);
  };

  const decreaseQty = (id, size) => {
    const updated = cart.map((item) =>
      item._id === id && item.size === size && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updated);
    syncCart(updated);
  };

  const removeItem = (id, size) => {
    const updated = cart.filter((item) => !(item._id === id && item.size === size));
    setCart(updated);
    syncCart(updated);
  };

  const handleSizeChange = (id, oldSize, newSize) => {
    const updated = cart.map((item) =>
      item._id === id && item.size === oldSize ? { ...item, size: newSize } : item
    );
    setCart(updated);
    syncCart(updated);
  };

  const getSubtotal = () =>
    cart.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = async () => {
    const cleanedCart = cart.map((item) => ({
      product: {
        title: item.product?.title || item.title,
        price: item.product?.price || item.price,
        image:
          item.product?.images?.[0]?.url ||
          item.product?.images?.[0] ||
          item.images?.[0]?.url ||
          item.images?.[0] ||
          "",
      },
      quantity: item.quantity,
      size: item.size,
      productId: item.product?.id || item._id || item.productId,
    }));

    try {
      const res = await axios.post(`${BASE_URL}/api/checkout-cart`, {
        cart: cleanedCart,
        email: userEmail,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Checkout failed:", err.response?.data?.msg || err.message);
      alert("Payment session could not be started.");
    }
  };

  // ✅ Show spinner while loading
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <h2 style={{ textAlign: "center", paddingTop: "90px" }}>
        Your cart is empty.
      </h2>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.map(
        (item) =>
          item.product && (
            <div key={`${item._id}-${item.size}`} className="cart-item">
              <img
                src={
                  item.product.images?.[0]?.url || item.product.images?.[0]
                }
                alt={item.product.title}
              />

              <div className="cart-details">
                <h3>{item.product.title}</h3>
                <p>Price: ¥{item.product.price}</p>

                <div className="size-select">
                  <label>Size: </label>
                  <select
                    value={item.size || ""}
                    onChange={(e) =>
                      handleSizeChange(item._id, item.size, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {item.product?.sizes?.map((s, index) => (
                      <option key={index} value={s.size}>
                        {s.size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="cart-controls">
                  <button onClick={() => decreaseQty(item._id, item.size)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item._id, item.size)}>
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item._id, item.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )
      )}
      <div className="cart-summary">
        <h3>Summary</h3>
        <p>Total Items: {getTotalItems()}</p>
        <p>Subtotal: ¥{getSubtotal().toLocaleString()}</p>
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
