import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  // const [showHeader, setShowHeader] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 🔑 Vérifie si l'utilisateur est connecté (présence du token)
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // useEffect(() => {
  //   let lastY = window.scrollY;
  //   const onScroll = () => {
  //     const currentY = window.scrollY;
  //     setShowHeader(!(currentY > lastY && currentY > 100));
  //     lastY = currentY;
  //   };

  //   window.addEventListener("scroll", onScroll, { passive: true });
  //   return () => window.removeEventListener("scroll", onScroll);
  // }, []);

  return (
    // <header className={`main-header ${showHeader ? "" : "hide"}`}>
    <header className="main-header">
      <div className="header-inner">
        <div className="logo-wrap">
          <img src="/img/logo.png" alt="Logo" className="site-logo" />
        </div>

        <nav className="main-nav" role="navigation">
          <ul>
            {isAuthenticated ? (
              // 🧭 Si connecté
              <>
                <li><a href="/">Home</a></li>
                <li><a href="/audits">Audits</a></li>
                <li><a href="/admin/dashboard">Profile</a></li>
              </>
            ) : (
              // 🚪 Si non connecté
              <>
                <li><a href="/">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="/audits">Audits</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="/login" className="login">Login</a></li>
                <li><a href="/register" className="signup">Signup</a></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Sidebar;
