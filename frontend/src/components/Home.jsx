import React from "react";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Partners from "./Partners";
import Value from "./Value";
import Contact from "./Contact";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import '../styles/Home.css';

function Home() {
  return (
    <div className="contenthome">
      <Sidebar />
      <section id="hero"><Hero /></section>
      <section id="about"><About /></section>
      <section id="services"><Services /></section>
      <section id="partners"><Partners /></section>
      <section id="value"><Value /></section>
      <section id="contact"><Contact /></section>
      <Footer />
    </div>
  );
}

export default Home;
