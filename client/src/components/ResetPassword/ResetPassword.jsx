import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const BASE_URL = "https://api.shopscout.org";



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/user/reset_password`,
        {
          token, // ✅ Send token in the body, not URL
          newPassword: password,
        }
      );
      setMsg(res.data.msg);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Reset failed");
    }
  };

  return (
    <div className="reset-page">
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
          <button type="submit">Reset</button>
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
