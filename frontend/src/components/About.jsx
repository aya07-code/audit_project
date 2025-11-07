import React from "react";
import "../styles/About.css";

function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-text">
          <h2>Who We Are</h2>
          <div className="divider"></div>
          <p>
             <strong>AuditEase Pro</strong> 
            <strong>International Associates Morocco</strong> is a consulting and auditing firm dedicated to supporting organizations in achieving excellence, compliance, and sustainability.
            With a strong expertise in <strong>Audit, Training, and Certification</strong>, we help businesses meet international standards such as <strong>SMETA, BSCI, SA8000, WRAP, and ISO 9001.</strong> 
            Our mission is to empower companies to improve their <strong>social responsibility</strong>, <strong>quality management</strong>, and <strong>environmental performance</strong> through personalized guidance and continuous improvement.
            Headquartered in <strong>Morocco </strong>, we collaborate with national and international partners to deliver <strong>high-impact and reliable audit services</strong>.
          </p>
        </div>
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="About AuditEase"
          />
        </div>
      </div>
    </section>
  );
}

export default About;
