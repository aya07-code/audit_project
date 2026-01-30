import React, { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";
import Swal from "sweetalert2";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);
      await axios.post("https://alloaudit.com/api/contact-message", formData);
      Swal.fire({
      icon: "success",
      title: "Message Sent",
      text: "Your message has been delivered successfully!",
      confirmButtonColor: "#3085d6",
    });
      setFormData({
        name: "",
        company: "",
        phone: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while sending the message.",
        confirmButtonColor: "#d33",
      });
          }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-wrapper">
        {/* LEFT SIDE */}
        <div className="contact-left">
          <h2>Let’s Connect</h2>
          <p>
            Do you have questions about our social or technical audit services?  
            Our dedicated team in Morocco is available to offer clear, personalized,  
            and confidential support for all your audit, compliance, and training needs.  
            We are here to guide you at every step and ensure an optimal, reliable  
            experience aligned with international standards.
          </p>

          <div className="contact-info1">
            <div className="info-item1">
              <FaEnvelope className="icon1" />
              <span>contact@alloaudit.com</span>
            </div>
            <div className="info-item1">
              <FaPhoneAlt className="icon1" />
              <span>+212 682730829</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send Us a Message</h3>
          <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange}/>
          <input type="text" name="company_name" placeholder="Company Name" value={formData.company} onChange={handleChange}/>
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange}/>
          <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange}/>
          <textarea  name="message"  placeholder="Your Message"  rows="3"  required  value={formData.message}  onChange={handleChange}></textarea>
          <button type="submit">Send Message</button>
        </form>

      </div>
    </section>
  );
}

export default Contact;
