import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { useToast } from "../Toast/ToastProvider";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import "../Login/Login.css";
import "./Register.css";

const Register = () => {
  const BASE_URL = process.env.REACT_APP_API_URL || "https://api.shopscout.org";
  const toast    = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", password: "" });

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/user/register`, user, { withCredentials: true });
      await axios.post(`${BASE_URL}/user/login`,    user, { withCredentials: true });
      localStorage.setItem("firstLogin", true);
      localStorage.setItem("userEmail", user.email);
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-card__brand">
            <img src="/images/logo.png" alt="ShopScout" className="auth-card__logo" />
            <h1 className="auth-card__title">Create Account</h1>
            <p className="auth-card__sub">Join ShopScout and start shopping</p>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <div className="auth-field">
              <FiUser className="auth-field__icon" size={16} />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={user.name}
                onChange={onChange}
                required
                className="auth-field__input"
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <FiMail className="auth-field__icon" size={16} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={user.email}
                onChange={onChange}
                required
                className="auth-field__input"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <FiLock className="auth-field__icon" size={16} />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={user.password}
                onChange={onChange}
                required
                className="auth-field__input"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-submit">
              Create Account <FiArrowRight size={15} />
            </button>
          </form>

          <p className="auth-card__switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-card__switch-link">Sign In</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
