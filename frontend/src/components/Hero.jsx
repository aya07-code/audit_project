// ...existing code...
import React, { useState } from "react";
import Slider from "react-slick";
import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [focused, setFocused] = useState(null);
   const navigate = useNavigate();

  const images = [
    "/img/1.jpg",
    "/img/ar-medical.webp",
    "/img/2.jpg",
    "/img/formation.webp",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: false,
  };

  return (
    <div className="hero-container">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <div className={`hero-slide ${focused === index ? "focused" : ""}`}>
              <div
                className="hero-bg"
                style={{ backgroundImage: `url(${img})` }}
                aria-hidden="true"
              />
              <div
                className="hero-overlay"
                onMouseEnter={() => setFocused(index)}
                onMouseLeave={() => setFocused(null)}
                onFocus={() => setFocused(index)}
                onBlur={() => setFocused(null)}
                tabIndex={0}
              >
                <h1>AUDIT • TRAINING • CERTIFICATION</h1>
                <p>
                We help businesses achieve compliance with international standards such as 
                SMETA, BSCI, SA8000, WRAP, and ISO 9001.</p>
                <button  onClick={() => navigate("/audits")}>Découvrir</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;
// ...existing code...