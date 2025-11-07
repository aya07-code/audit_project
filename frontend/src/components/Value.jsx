import React from "react";
import "../styles/Value.css";

function Value() {
  const values = [
    { number: "15+", label: "Years of Expertise in Auditing & Training" },
    { number: "250+", label: "Successful Audits & Certifications" },
    { number: "98%", label: "Client Satisfaction Rate" },
    { number: "10+", label: "International Compliance Programs" },
  ];

  return (
    <section id="value" className="value-section">
      <h2>Our Added Value</h2>
      <div className="divider"></div>

      <p className="value-intro">
        At <strong>International Associates Morocco</strong>, our strength lies in our expertise,
        commitment, and global vision. We combine quality, ethics, and innovation to deliver 
        measurable impact for our clients.
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
