import React, { useEffect, useState } from "react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    checkAuth(); 
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const getProfileLink = () => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "customer") return "/customer/dashboard";
    return "/login"; 
  };


  return (
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
                <li><a href={getProfileLink()}>Profile</a></li>
              </>
            ) : (
              // 🚪 Si non connecté
              <>
                <li><a href="/">Home</a></li>
                {/* <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li> */}
                <li><a href="/audits">Audits</a></li>
                {/* <li><a href="#contact">Contact</a></li>  */}
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
