import { createContext, useEffect, useState } from "react";
import ProductAPI from "./api/ProductAPI";
import axios from "axios";
import UserAPI from "./api/UserAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);
  const BASE_URL = "https://api.shopscout.org";


  const refreshToken = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/refresh_token`,
        null,
        {
          withCredentials: true,
        }
      );
      setToken(res.data.accessToken); // ✅ Save access token
    } catch (err) {
      console.error("Refresh token failed:", err.response?.data?.msg || err.message);
      setToken(false); // Clear token on failure
    }
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      refreshToken(); // ✅ auto-refresh on page load
    }
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductAPI(),
    userAPI: UserAPI(token), // ✅ userAPI gets token access
  };

  return (
    <GlobalState.Provider value={state}>
      {children}
    </GlobalState.Provider>
  );
};
