import { useEffect, useState } from "react";
import axios from "axios";

const UserAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
  });
  const BASE_URL = 'https://shopscout-production-7795.up.railway.app';

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/user/infor`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUserInfo({ name: res.data.name, email: res.data.email });
          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          const formattedCart = (res.data.cart || []).map((item) => ({
            ...item.product,
            quantity: item.quantity,
            _id: item.productId || item.product_id || item._id,
            size: item.size || "", // ✅ include size if returned from backend
          }));

          setCart(formattedCart);
        } catch (err) {
          console.error(
            "Failed to fetch user info:",
            err.response?.data?.msg || err.message
          );
        }
      };
      getUser();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLogged) return alert("Please log in first.");

    const alreadyInCart = cart.some(
      (item) => item._id === product.productId && item.size === product.size
    );
    if (alreadyInCart) return alert("This product with the same size is already in the cart.");

    const updatedCart = [...cart, { ...product, quantity: 1, productId: product._id || product.id }];

    setCart(updatedCart);

    try {
      const formattedCart = updatedCart.map((item) => ({
        productId: item._id || item.id || item.productId, // ✅ make sure it's saved
        quantity: item.quantity,
        size: item.size,
      }));
      

      await axios.patch(
        `${BASE_URL}/user/addcart`,
        { cart: formattedCart },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("🛒 Cart successfully synced to backend.");
    } catch (err) {
      console.error(
        "❌ Cart sync failed:",
        err.response?.data?.msg || err.message
      );
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart,
    userInfo: [userInfo, setUserInfo],
  };
};

export default UserAPI;
