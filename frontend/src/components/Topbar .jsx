import React from 'react';
import '../styles/Topbar.css';

const Topbar = () => {
    return (
        <div className="topbar">
            <div className="contact-info">
                <span><i className="fas fa-map-marker-alt"></i> Zone franche,Tanger 90090</span>
                <span><i className="fas fa-envelope"></i> contact@ma.ia-net.com</span>
                <span><i className="fas fa-phone"></i> +212 526270305</span>
            </div>
            <div className="social-connect">
                <span>Social connect</span>
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-linkedin"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
        </div>
    );
};

export default Topbar;