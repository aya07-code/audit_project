import React from "react";
import "../styles/Partners.css";

const Partners = () => {
  const partners = [
    { name: "SMETA", logo: "/img/smeta.png" },
    { name: "SA8000", logo: "/img/sa.jpeg" },
    { name: "AMFORI", logo: "/img/amfori.png" },
    { name: "ISO", logo: "/img/iso.png" },
    { name: "SOCIAL", logo: "/img/social2.png" },
    { name: "WRAP", logo: "/img/wrap.png" },
  ];

  // Duplicate list to create infinite scrolling effect
  const repeatedPartners = [...partners, ...partners];

  return (
    <section className="partners-section">
      <div className="slider">
        {repeatedPartners.map((partner, index) => (
          <div key={index} className="partner-card">
            <img src={partner.logo} alt={partner.name} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Partners;
