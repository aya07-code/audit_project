import React, { useEffect, useState } from "react";
import '../styles/SidebarDash.css';

const SidebarDash = () => {
  const [showHeader, setShowHeader] = useState(true);

    useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 100) {
        // scrolling down
        setShowHeader(false);
      } else {
        // scrolling up
        setShowHeader(true);
      }
      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`main-header1 ${showHeader ? "" : "hide1"}`}>
      <div className="header-inner1">
        <div className="logo-wrap1">
          <img src="/img/logo.png" alt="Logo" className="site-logo1" />
        </div>

        <nav className="main-nav1" role="navigation">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/audits">Audits</a></li>
                <li><a href="/login" className="login1">Login</a></li>
                <li><a href="/register" className="signup1">Signup</a></li>
            </ul>
        </nav>
      </div>
    </header>
  );
};

export default SidebarDash;