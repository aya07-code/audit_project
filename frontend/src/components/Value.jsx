import React from "react";
import "../styles/Value.css";

function Value() {
  const values = [
    { number: "24/7", label: "Hotline Availability for All Audits" },
    { number: "100%", label: "Confidential & Secure Communication" },
    { number: "3+", label: "Languages Supported (AR • FR • EN)" },
    { number: "Wide", label: "Coverage of Social & Technical Audit Protocols" },
  ];


  return (
    <section id="value" className="value-section">
      <h2>Our Added Value</h2>
      <div className="divider"></div>

    <p className="value-intro">
      At <strong>Allo Audit</strong>, our strength lies in our commitment to 
      professionalism, confidentiality, and operational excellence.  
      We combine <strong>technical expertise, reactivity, and multilingual support</strong> 
      to provide organizations with high-quality assistance throughout every step of 
      their social and technical audits.  
      Our approach ensures clarity, compliance, and optimal performance for all 
      partners involved.
    </p>

      <div className="value-content">
        {values.map((item, index) => (
          <div key={index} className="value-card">
            <h3>{item.number}</h3>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Value;
