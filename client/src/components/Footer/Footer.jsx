// ✅ Updated Footer.jsx to match new branding
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div id="footer">
        <div className="footer-container">
          <h1 className="logo-title">SHOP SCOUT</h1>
        </div>

        <div className="footer-sections">
          <div className="about">
            <h3>About</h3>
            <Link to="/about_us">About Us</Link>
            <Link to="/priacy_policy">Privacy Policy</Link>
            <Link to="/terms_and_conditions">Terms & Conditions</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="myaccount">
            <h3>My Account</h3>
            <Link to="/cart">View Cart</Link>
            {/* <Link to="/track_order">Track My Order</Link> */}
            <Link to="/help">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
