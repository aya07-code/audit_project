import React from 'react';
import '../styles/Topbar.css';

const Topbar = () => {
    return (
        <div className="topbar">
            <div className="contact-info">
                <span><i className="fas fa-envelope"></i> contact@alloaudit.com</span>
                <span><i className="fas fa-phone"></i> +212 682730829</span>
            </div>
        </div>
    );
};

export default Topbar;