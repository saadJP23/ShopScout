import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const BASE_URL = "https://api.shopscout.org";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/user/reset_password`, {
        token,
        newPassword: password,
      });
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="reset-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            Reset
          </button>
        </form>
        {msg && (
          <p
            className={
              msg.toLowerCase().includes("success")
                ? "success-message"
                : "error-message"
            }
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
