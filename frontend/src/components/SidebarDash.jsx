import React, { useEffect, useState } from "react";
import '../styles/SidebarDash.css';

const SidebarDash = () => {
  return (
    <header className="main-header1">
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