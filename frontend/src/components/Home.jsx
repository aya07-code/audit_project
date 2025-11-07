import React from "react";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Partners from "./Partners";
import Value from "./Value";
import Contact from "./Contact";
import Footer from "./Footer";

function Home() {
  return (
    <div className="contenthome">
      <Hero />
      <About />
      <Services />
      <Partners />
      <Value />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
