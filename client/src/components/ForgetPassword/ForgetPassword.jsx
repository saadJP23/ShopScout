import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ForgetPassword.css";
import LoadingSpinner from "../LoadingSpinner";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const BASE_URL = "https://api.shopscout.org";

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await axios.post(`${BASE_URL}/user/forget_password`, {
        email,
      });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Something went wrong");
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <>
    {loading && <LoadingSpinner />}
    <div className="forgot-page">
      <div className="forgot-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {msg && (
          <p
            className={
              msg.toLowerCase().includes("sent")
                ? "success-message"
                : "error-message"
            }
          >
            {msg}
          </p>
        )}
      </div>
    </div>
    </>
  );
};

export default ForgetPassword;
