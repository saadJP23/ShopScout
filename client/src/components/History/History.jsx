import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./History.css";
import { GlobalState } from "../../GlobalState";

const History = () => {
  const [history, setHistory] = useState([]);
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [isLogged] = state.userAPI.isLogged;
  const BASE_URL = 'https://shopscout-production-7795.up.railway.app';


  useEffect(() => {
    const getHistory = async () => {
      try {
        if (isLogged) {
          const res = await axios.get(`${BASE_URL}/user/history`, {
            headers: { Authorization: token },
            withCredentials: true,
          });
          setHistory(res.data.history);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
        alert("Failed to load purchase history.");
      }
    };

    getHistory();
  }, [isLogged, token]);

  if (!isLogged) {
    return (
      <div className="history-page">
        <h2>Purchase History</h2>
        <p>Please log in to view your purchase history.</p>
      </div>
    );
  }

  console.log(history);
  return (
    <div className="history-page">
      <h2>Purchase History</h2>

      {history.length === 0 ? (
        <p>No purchases yet.</p>
      ) : (
        <div className="history-list">
          {history.map((item, i) => (
            <div className="history-card" key={i}>
              {item.product.image ? (
                <img src={item.product.image} alt={item.product.title} />
              ) : null}

              <h3>{item.product.title}</h3>

              <p>
                <strong>Price:</strong> ¥{item.product.price}
              </p>
              <p>
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p>
                <strong>Size:</strong> {item.size}
              </p>
              <p>
                <strong>Date:</strong> {item.date}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
