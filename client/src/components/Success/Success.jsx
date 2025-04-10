import React from "react";
import "./Success.css";

const Success = () => {
  return (
    <div className="success-page">
      <h2>🎉 Payment Successful!</h2>
      <p>Thank you for your purchase. A confirmation email will be sent shortly.</p>
      <a href="/" className="back-btn">Back to Home</a>
    </div>
  );
};

export default Success;
