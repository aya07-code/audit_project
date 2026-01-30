import React from "react";
import "../styles/Services.css";
import {
  FaClipboardCheck,
  FaChartLine,
  FaShieldAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";

function Services() {
  const services = [
      {
        icon: <FaClipboardCheck />,
        title: "Pre-Audit Preparation",
        desc: "Thorough guidance to anticipate needs, organize your pre-audit, and ensure readiness for social and technical assessments.",
      },
      {
        icon: <FaChalkboardTeacher />,
        title: "Real-Time Technical Support",
        desc: "Immediate and personalized remote assistance during every stage of the audit, ensuring clarity, compliance, and quick problem resolution.",
      },
      {
        icon: <FaShieldAlt />,
        title: "Confidential Worker Interviews",
        desc: "Secure, multilingual, and confidential communication line dedicated to facilitating worker–auditor interactions during social audits.",
      },
      {
        icon: <FaChartLine />,
        title: "On-Audit Coordination & Follow-Up",
        desc: "Full support on the audit day: coordination, direct follow-up of each step, and targeted recommendations for optimal compliance.",
      },
  ];

  return (
    <section id="services" className="services-section">
      <h2>Our Services</h2>
      <div className="divider"></div>
      <div className="services-grid">
        {services.map((s, index) => (
          <div key={index} className="service-card">
            <div className="icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
