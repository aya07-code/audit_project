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
        <strong>Allo Audit</strong> is a dedicated, confidential, and multilingual 
        support service specializing in <strong>remote assistance, telephone guidance, 
        and mock audits</strong> in social and technical compliance.  
        Available <strong>24/7</strong>, our mission is to facilitate and secure all audit 
        procedures by ensuring fast, reliable, and fully confidential communication 
        between workers, managers, auditors, and responsible parties.  
        We help organizations strengthen transparency, coordination, and the overall 
        reliability of their audit process while adhering to international standards.
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
