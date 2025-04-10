import React, { useRef, useState } from "react";
import "./Contact.css";
import axios from 'axios'

const Contact = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      alert("Message sent!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Message failed to send.");
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData(prev => ({...prev, [name]:value}));
  }

  return (
    <section id="contact">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Reach out to us for any inquiries.</p>

        <div className="contact-content">
          <div className="contact-form">
            <h3>Send us a message</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Your Name"  onChange={handleChange}  value={formData.name} required />
              <input type="email" name="email" placeholder="Your Email" onChange={handleChange}  value={formData.email} required />
              <textarea name="message" placeholder="Your Message" required  onChange={handleChange} value={formData.message}></textarea>
              <button type="submit" className="submit-btn">Send Message</button>
             
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
