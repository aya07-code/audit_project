import React from "react";
import "../styles/Contact.css";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-wrapper">
        {/* LEFT SIDE */}
        <div className="contact-left">
          <h2>Let’s Connect</h2>
          <p>
            Have questions about our audit, training, or certification services? 
            Our dedicated team in Morocco is always ready to provide personalized 
            assistance and expert guidance.
          </p>

          <div className="contact-info1">
            <div className="info-item1">
              <FaEnvelope className="icon1" />
              <span>contact@ma.ia-net.com</span>
            </div>
            <div className="info-item1">
              <FaPhoneAlt className="icon1" />
              <span>+212 526270305</span>
            </div>
            <div className="info-item1">
              <FaMapMarkerAlt className="icon1" />
              <span>Zone Franche, Tanger 90090, Morocco</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <form className="contact-form">
          <h3>Send Us a Message</h3>
          <input type="text" placeholder="Your Full Name" required />
          <input type="email" placeholder="Your Email Address" required />
          <textarea placeholder="Your Message" rows="3" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
