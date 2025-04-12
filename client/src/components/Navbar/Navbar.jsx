// ✅ Updated Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { GlobalState } from "../../GlobalState";
import axios from "axios";

const Navbar = () => {
  const state = useContext(GlobalState);
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;
  const [cart, setCart] = state.userAPI.cart;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const BASE_URL = "https://api.shopscout.org";



  const logoutUser = async () => {
    await axios.get(`${BASE_URL}/user/logout`, {
      withCredentials: true,
    });
    localStorage.removeItem("firstLogin");
    localStorage.removeItem("cart");
    setIsAdmin(false);
    setIsLogged(false);
    setCart([]);
    navigate("/");
  };

  const adminRouter = () => (
    <>
      <li><Link to="/admin/products">Manage Products</Link></li>
      <li><Link to="/admin/create">Create Product</Link></li>
      <li><Link to="/" onClick={() => { logoutUser(); setMenuOpen(false); }}>Logout</Link></li>
    </>
  );

  const loggedRouter = () => (
    <>
      <li><Link to="/history" onClick={() => setMenuOpen(false)}>History</Link></li>
      <li><Link to="/" onClick={() => { logoutUser(); setMenuOpen(false); }}>Logout</Link></li>
      {!isAdmin && (
        <div className="dropdown">
          <span className="dropbtn">Category</span>
          <div className="dropdown-content">
            <Link to="/category/male" onClick={() => setMenuOpen(false)}>Male</Link>
            <Link to="/category/female" onClick={() => setMenuOpen(false)}>Female</Link>
            <Link to="/category/child" onClick={() => setMenuOpen(false)}>Child</Link>
          </div>
        </div>
      )}
    </>
  );

  return (
    <header className="flex items-center">
      <div id="header">
        <div className="header-logo">
          <Link to="/">
            {isAdmin ? (
              <div className="admin-box">Admin</div>
            ) : (
              <div className="logo-container">
                <img src="/images/logo.png" alt="Mandala" className="glow-logo" />
              </div>
            )}
          </Link>

          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
          </div>
        </div>

        <div className={`header-list ${menuOpen ? "open" : ""}`}>
          <nav className="header-list-nav">
            <ul className="flex items-center justify-center">
              {!isAdmin && (
                <>
                  <li><Link to="/view_all" onClick={() => setMenuOpen(false)}>View All Product</Link></li>
                  <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
                </>
              )}

              {isAdmin ? adminRouter() : isLogged ? loggedRouter() : (
                <>
                  <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
                  <li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
                </>
              )}

              {!isAdmin && (
                <li className="cart-mobile">
                  <Link to="/cart" onClick={() => setMenuOpen(false)}>
                    <div className="cart-icon-wrapper">
                      <i className="fa-solid fa-bag-shopping"></i>
                      <span className="count-badge">{cart?.reduce((t, i) => t + i.quantity, 0) || 0}</span>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;