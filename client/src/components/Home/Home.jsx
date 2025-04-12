// Redesigned Home.jsx with enhanced styling, consistent cards, and call-to-actions

import React, { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import ProductLists from "../mainpages/utils/ProductList/ProductLists";
import { GlobalState } from "../../GlobalState";
import { useContext } from "react";
import LoadingSpinner from "../LoadingSpinner";

const Home = () => {
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [loading, setLoading] = useState(false);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h4>Clean + Modern Streetwear Vibe</h4>
          <h1>Own Your Style</h1>
          <p>
            Explore collections made to stand out. Express yourself boldly and
            effortlessly.
          </p>

          <Link to="/view_all" className="hero-btn">
            Shop Now
          </Link>
        </div>
        <div className="hero-image">
          <img src="/images/shopping-cart-red-bags.jpg" alt="hero" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        {[
          { img: "f1.png", label: "Free Shipping" },
          { img: "f2.png", label: "Online Order" },
          { img: "f3.png", label: "Save Money" },
          { img: "f4.png", label: "Promotions" },
          { img: "f5.png", label: "Happy Sell" },
          { img: "f6.png", label: "24/7 Support" },
        ].map((f, i) => (
          <div key={i} className="feature-box">
            <img src={`/images/features/${f.img}`} alt={f.label} />
            <h6>{f.label}</h6>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Featured Products */}
          <section className="product-section">
            <h2>Featured Products</h2>
            <p className="subtitle">Top picks for this season</p>
            <div className="products_container">
              {products.slice(0, 4).map((product) => (
                <ProductLists
                  key={product.id}
                  products={product}
                  spaced={false}
                />
              ))}
            </div>
          </section>

          {/* New Arrivals */}
          <section className="product-section">
            <h2>New Arrivals</h2>
            <p className="subtitle">Fresh designs just dropped</p>
            <div className="products_container">
              {products.slice(8, 12).map((product) => (
                <ProductLists
                  key={product.id}
                  products={product}
                  spaced={false}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Offer Banner */}
      <section className="offer-banner">
        <h2>Discover Premium Style for Every Season</h2>

        <Link to="/view_all">Explore More</Link>
      </section>

      {/* Newsletter */}
      {/* <section className="newsletter">
        <div className="newsletter-text">
          <h2>Get 10% Off Your First Order</h2>
          <p>Subscribe to our newsletter and never miss an update</p>
        </div>
        <div className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
