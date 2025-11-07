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
      title: "Social & Environmental Audits",
      desc: "We conduct detailed assessments to ensure compliance with international standards such as SMETA, BSCI, SA8000, and ISO.",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Training & Capacity Building",
      desc: "Customized training sessions to enhance your team's knowledge in compliance, safety, and quality management.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Certification Support",
      desc: "Expert assistance to help your organization achieve and maintain international certifications effectively.",
    },
    {
      icon: <FaChartLine />,
      title: "Consulting & Continuous Improvement",
      desc: "Strategic consulting to identify growth opportunities, reduce risks, and drive sustainable improvement.",
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
