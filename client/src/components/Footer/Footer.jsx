import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiYoutube, FiMail } from "react-icons/fi";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer__inner">

      {/* Brand */}
      <div className="footer__brand">
        <img src="/images/logo.png" alt="ShopScout" className="footer__logo" />
        <h2 className="footer__brand-name">SHOP SCOUT</h2>
        <p className="footer__brand-desc">
          Premium streetwear crafted for those who dare to stand out.
        </p>
        <div className="footer__socials">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer__social" aria-label="Instagram"><FiInstagram size={18} /></a>
          <a href="https://twitter.com"   target="_blank" rel="noreferrer" className="footer__social" aria-label="Twitter"><FiTwitter size={18} /></a>
          <a href="https://youtube.com"   target="_blank" rel="noreferrer" className="footer__social" aria-label="YouTube"><FiYoutube size={18} /></a>
          <a href="mailto:support@shopscout.org"          className="footer__social" aria-label="Email"><FiMail size={18} /></a>
        </div>
      </div>

      {/* About */}
      <div className="footer__col">
        <h3 className="footer__col-title">Company</h3>
        <Link to="/about_us"             className="footer__link">About Us</Link>
        <Link to="/priacy_policy"        className="footer__link">Privacy Policy</Link>
        <Link to="/terms_and_conditions" className="footer__link">Terms & Conditions</Link>
        <Link to="/contact"              className="footer__link">Contact Us</Link>
      </div>

      {/* Shop */}
      <div className="footer__col">
        <h3 className="footer__col-title">Shop</h3>
        <Link to="/view_all"      className="footer__link">All Products</Link>
        <Link to="/category/male"   className="footer__link">Men</Link>
        <Link to="/category/female" className="footer__link">Women</Link>
        <Link to="/category/child"  className="footer__link">Kids</Link>
      </div>

      {/* Account */}
      <div className="footer__col">
        <h3 className="footer__col-title">My Account</h3>
        <Link to="/cart"         className="footer__link">View Cart</Link>
        <Link to="/history"      className="footer__link">Order History</Link>
        <Link to="/track_order"  className="footer__link">Track Order</Link>
        <Link to="/help"         className="footer__link">Help & FAQs</Link>
      </div>

    </div>

    <div className="footer__bottom">
      <p>© {new Date().getFullYear()} Shop Scout. All rights reserved.</p>
      <p>Shipping to Japan 🇯🇵</p>
    </div>
  </footer>
);

export default Footer;
