import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { GlobalState } from "../../GlobalState";
import axios from "axios";
import { FiShoppingBag, FiSearch, FiX, FiMenu, FiLogOut, FiClock, FiChevronDown } from "react-icons/fi";

const Navbar = () => {
  const state = useContext(GlobalState);
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  const [isAdmin, setIsAdmin]   = state.userAPI.isAdmin;
  const [cart, setCart]         = state.userAPI.cart;
  const navigate   = useNavigate();
  const location   = useLocation();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catOpen, setCatOpen]       = useState(false);
  const searchRef = useRef(null);
  const BASE_URL  = process.env.REACT_APP_API_URL || "https://api.shopscout.org";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const logoutUser = async () => {
    await axios.get(`${BASE_URL}/user/logout`, { withCredentials: true });
    localStorage.removeItem("firstLogin");
    localStorage.removeItem("cart");
    setIsAdmin(false);
    setIsLogged(false);
    setCart([]);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/view_all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const cartCount = cart?.reduce((t, i) => t + i.quantity, 0) || 0;

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">

        {/* ── Logo ── */}
        <Link to="/" className="navbar__logo">
          <img src="/images/logo.png" alt="ShopScout" className="navbar__logo-img" />
          <span className="navbar__logo-text">SHOP SCOUT</span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="navbar__links">
          {isAdmin ? (
            <>
              <Link to="/admin/products" className="navbar__link">Manage Products</Link>
              <Link to="/admin/create"   className="navbar__link">Create Product</Link>
            </>
          ) : (
            <>
              <Link to="/view_all" className="navbar__link">All Products</Link>

              {/* Categories — always visible */}
              <div className="navbar__dropdown" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                <span className="navbar__link navbar__link--cat">
                  Categories <FiChevronDown size={13} style={{ marginLeft: 4, verticalAlign: "middle" }} />
                </span>
                <div className={`navbar__dropdown-menu ${catOpen ? "open" : ""}`}>
                  <Link to="/category/male"   className="navbar__dropdown-item">Men</Link>
                  <Link to="/category/female" className="navbar__dropdown-item">Women</Link>
                  <Link to="/category/child"  className="navbar__dropdown-item">Kids</Link>
                </div>
              </div>

              <Link to="/contact" className="navbar__link">Contact</Link>
            </>
          )}
        </nav>

        {/* ── Right Actions ── */}
        <div className="navbar__actions">
          {/* Search */}
          <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
            {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
          </button>

          {!isAdmin && isLogged && (
            <Link to="/cart" className="navbar__icon-btn navbar__cart" aria-label="Cart">
              <FiShoppingBag size={20} />
              {cartCount > 0 && <span className="navbar__badge">{cartCount}</span>}
            </Link>
          )}

          {isLogged ? (
            <>
              {!isAdmin && (
                <Link to="/history" className="navbar__icon-btn" aria-label="History">
                  <FiClock size={20} />
                </Link>
              )}
              <button className="navbar__icon-btn" onClick={logoutUser} aria-label="Logout">
                <FiLogOut size={20} />
              </button>
            </>
          ) : (
            <div className="navbar__auth">
              <Link to="/login"    className="navbar__auth-link">Login</Link>
              <Link to="/register" className="navbar__auth-btn">Register</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className={`navbar__search-bar ${searchOpen ? "open" : ""}`}>
        <form onSubmit={handleSearch} className="navbar__search-form">
          <FiSearch size={18} className="navbar__search-icon" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar__search-input"
          />
          <button type="submit" className="navbar__search-submit">Search</button>
        </form>
      </div>

      {/* ── Mobile Drawer ── */}
      {menuOpen && <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />}
      <nav className={`navbar__drawer ${menuOpen ? "open" : ""}`}>
        <div className="navbar__drawer-header">
          <span className="navbar__logo-text">SHOP SCOUT</span>
          <button onClick={() => setMenuOpen(false)} className="navbar__icon-btn"><FiX size={22} /></button>
        </div>

        {isAdmin ? (
          <>
            <Link to="/admin/products" className="navbar__drawer-link">Manage Products</Link>
            <Link to="/admin/create"   className="navbar__drawer-link">Create Product</Link>
          </>
        ) : (
          <>
            <Link to="/view_all"        className="navbar__drawer-link">All Products</Link>
            <Link to="/category/male"   className="navbar__drawer-link">Men</Link>
            <Link to="/category/female" className="navbar__drawer-link">Women</Link>
            <Link to="/category/child"  className="navbar__drawer-link">Kids</Link>
            <Link to="/contact"         className="navbar__drawer-link">Contact</Link>
          </>
        )}

        <div className="navbar__drawer-divider" />

        {isLogged ? (
          <>
            {!isAdmin && (
              <>
                <Link to="/cart"    className="navbar__drawer-link">Cart {cartCount > 0 && `(${cartCount})`}</Link>
                <Link to="/history" className="navbar__drawer-link">Order History</Link>
              </>
            )}
            <button className="navbar__drawer-link navbar__drawer-logout" onClick={logoutUser}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    className="navbar__drawer-link">Login</Link>
            <Link to="/register" className="navbar__drawer-link">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
