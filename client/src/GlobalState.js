import { createContext, useEffect, useState } from "react";
import ProductAPI from "./api/ProductAPI";
import axios from "axios";

import UserAPI from "./api/UserAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  const refreshToken = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/user/refresh_token",
        null,
        {
          withCredentials: true,
        }
      );
      setToken(res.data.accessToken);
    } catch (err) {
      console.error("Refresh token failed: Please log in.");
    }
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) refreshToken();
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductAPI(),
    userAPI: UserAPI(token), // always call it here
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
