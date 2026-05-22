import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag, FiClock } from "react-icons/fi";
import "./Success.css";

const Success = () => (
  <div className="success-page">
    <div className="success-card">
      <div className="success-card__icon-wrap">
        <FiCheckCircle size={52} className="success-card__icon" />
      </div>
      <h1 className="success-card__title">Payment Successful!</h1>
      <p className="success-card__message">
        Thank you for shopping with ShopScout. Your order has been placed and
        a confirmation email is on its way.
      </p>
      <div className="success-card__perks">
        <div className="success-perk">
          <FiClock size={18} />
          <span>Processing your order</span>
        </div>
        <div className="success-perk">
          <FiShoppingBag size={18} />
          <span>Shipping to Japan</span>
        </div>
      </div>
      <div className="success-card__actions">
        <Link to="/history"  className="success-btn success-btn--secondary">View Order History</Link>
        <Link to="/"         className="success-btn success-btn--primary">Back to Home</Link>
      </div>
    </div>
  </div>
);

export default Success;
