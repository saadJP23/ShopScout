import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import ProductLists from "../mainpages/utils/ProductList/ProductLists";
import LoadingSpinner from "../LoadingSpinner";
import { useToast } from "../Toast/ToastProvider";
import { FiArrowRight, FiMail } from "react-icons/fi";
import "./Home.css";

const FEATURES = [
  { icon: "🚚", label: "Free Shipping",  desc: "On all orders over ¥5,000" },
  { icon: "📦", label: "Easy Returns",   desc: "30-day hassle-free returns" },
  { icon: "🔒", label: "Secure Payment", desc: "Protected by Stripe" },
  { icon: "🎁", label: "Promotions",     desc: "Members-only deals" },
  { icon: "⭐", label: "Top Quality",    desc: "Curated premium products" },
  { icon: "💬", label: "24/7 Support",   desc: "We're always here for you" },
];

const Home = () => {
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const loading    = state.productsAPI.loading;
  const toast      = useToast();
  const [email, setEmail]     = useState("");
  const [subSent, setSubSent] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubSent(true);
    setEmail("");
    toast.success("You're subscribed! Check your inbox for 10% off.");
  };

  return (
    <div className="home">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">New Collection · Spring 2025</p>
          <h1 className="hero__title">
            Own Your <span className="hero__title-accent">Style</span>
          </h1>
          <p className="hero__subtitle">
            Premium streetwear crafted for those who dare to stand out.
            Quality you can feel, style you can own.
          </p>
          <div className="hero__actions">
            <Link to="/view_all" className="hero__cta-primary">
              Shop Now <FiArrowRight size={16} />
            </Link>
            <Link to="/about_us" className="hero__cta-secondary">
              Our Story
            </Link>
          </div>
        </div>
        <div className="hero__image-wrap">
          <div className="hero__image-glow" />
          <img
            src="/images/shopping-cart-red-bags.jpg"
            alt="ShopScout Collection"
            className="hero__image"
          />
        </div>
      </section>

      {/* ── Features Strip ───────────────────────────────────────── */}
      <section className="features">
        <div className="features__grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <span className="feature-card__icon">{f.icon}</span>
              <div>
                <h6 className="feature-card__label">{f.label}</h6>
                <p  className="feature-card__desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────────── */}
      {loading ? <LoadingSpinner /> : (
        <>
          <section className="products-section">
            <div className="products-section__header">
              <div>
                <h2 className="products-section__title">Featured Products</h2>
                <p  className="products-section__sub">Our top picks for this season</p>
              </div>
              <Link to="/view_all" className="products-section__more">
                View All <FiArrowRight size={14} />
              </Link>
            </div>
            <div className="products-grid">
              {products.slice(0, 4).map(p => (
                <ProductLists key={p.id} products={p} spaced={false} />
              ))}
            </div>
          </section>

          {products.length > 4 && (
            <section className="products-section">
              <div className="products-section__header">
                <div>
                  <h2 className="products-section__title">New Arrivals</h2>
                  <p  className="products-section__sub">Fresh designs just dropped</p>
                </div>
                <Link to="/view_all" className="products-section__more">
                  View All <FiArrowRight size={14} />
                </Link>
              </div>
              <div className="products-grid">
                {products.slice(4, 8).map(p => (
                  <ProductLists key={p.id} products={p} spaced={false} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Offer Banner ─────────────────────────────────────────── */}
      <section className="offer-banner">
        <div className="offer-banner__content">
          <p className="offer-banner__label">Limited Time Offer</p>
          <h2 className="offer-banner__title">Discover Premium Style<br />for Every Season</h2>
          <Link to="/view_all" className="offer-banner__btn">
            Explore Collection <FiArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────── */}
      <section className="newsletter">
        <div className="newsletter__content">
          <FiMail size={28} className="newsletter__icon" />
          <h2 className="newsletter__title">Get 10% Off Your First Order</h2>
          <p className="newsletter__sub">
            Subscribe to our newsletter and never miss a new drop.
          </p>
          {subSent ? (
            <p className="newsletter__success">✓ You're on the list — check your inbox!</p>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="newsletter__input"
              />
              <button type="submit" className="newsletter__btn">Subscribe</button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
