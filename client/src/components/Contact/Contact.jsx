import React, { useState } from "react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { useToast } from "../Toast/ToastProvider";
import { FiSend, FiUser, FiMail, FiMessageSquare } from "react-icons/fi";
import "./Contact.css";

const Contact = () => {
  const BASE_URL = process.env.REACT_APP_API_URL || "https://api.shopscout.org";
  const toast    = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/contact`, form);
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <section className="contact-page">
        <div className="contact-page__header">
          <h1 className="contact-page__title">Contact Us</h1>
          <p className="contact-page__sub">We'd love to hear from you. Reach out any time.</p>
        </div>

        <div className="contact-layout">
          {/* Form */}
          <div className="contact-form-card">
            <h2 className="contact-form-card__heading">Send us a message</h2>
            <form onSubmit={onSubmit} className="contact-form">
              <div className="contact-field">
                <FiUser size={15} className="contact-field__icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={onChange}
                  required
                  className="contact-field__input"
                />
              </div>
              <div className="contact-field">
                <FiMail size={15} className="contact-field__icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="contact-field__input"
                />
              </div>
              <div className="contact-field contact-field--textarea">
                <FiMessageSquare size={15} className="contact-field__icon contact-field__icon--top" />
                <textarea
                  name="message"
                  placeholder="Your message…"
                  value={form.message}
                  onChange={onChange}
                  required
                  rows={6}
                  className="contact-field__input"
                />
              </div>
              <button type="submit" className="contact-submit">
                <FiSend size={15} /> Send Message
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="contact-info-card">
            <h2 className="contact-info-card__heading">Get in touch</h2>
            <div className="contact-info-items">
              <div className="contact-info-item">
                <div className="contact-info-item__icon">✉</div>
                <div>
                  <p className="contact-info-item__label">Email</p>
                  <p className="contact-info-item__value">support@shopscout.org</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-item__icon">📍</div>
                <div>
                  <p className="contact-info-item__label">Location</p>
                  <p className="contact-info-item__value">Tokyo, Japan</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-item__icon">🕐</div>
                <div>
                  <p className="contact-info-item__label">Support Hours</p>
                  <p className="contact-info-item__value">Mon–Fri, 9am – 6pm JST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
