import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const role = localStorage.getItem("role");
  const isLoggedIn = !!role;

  const getFooterCardContent = () => {
    if (!isLoggedIn) {
      return {
        icon: "fas fa-rocket",
        title: "Join Our Platform",
        description:
          "Connect with customers or local technicians through a clean, reliable, and trusted service platform.",
        buttonText: "Get Started",
        buttonLink: "/getstarted",
      };
    }

    if (role === "Provider") {
      return {
        icon: "fas fa-briefcase",
        title: "Manage Your Services",
        description:
          "Keep your profile updated, manage bookings, and grow your service business with confidence.",
        buttonText: "Go to Dashboard",
        buttonLink: "/provider",
      };
    }

    return {
      icon: "fas fa-search",
      title: "Explore More Services",
      description:
        "Browse trusted categories and discover professionals for your home and service needs.",
      buttonText: "Browse Services",
      buttonLink: "/categories",
    };
  };

  const footerCard = getFooterCardContent();

  return (
    <footer className="app-footer border-top mt-auto" style={{ backgroundColor: 'var(--app-surface)' }}>
      <div className="container py-5">
        <div className="row g-4">
          
          {/* Brand & Dynamic Card Column */}
          <div className="col-lg-5 col-md-12 pe-lg-4">
            <NavLink className="align-items-center text-decoration-none mb-4" to="/">
                <img 
                  src="/hero_logo_1.png" 
                  alt="SkillSquare" 
                  style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
                />
              
            </NavLink>
            
            <div className="p-4 rounded-4" style={{ background: 'var(--app-surface-muted)', border: '1px solid var(--app-border)' }}>
              <h6 className="font-display fw-bold mb-2 d-flex align-items-center gap-2" style={{ color: 'var(--app-text)' }}>
                <i className={`${footerCard.icon}`} style={{ color: 'var(--app-primary)' }}></i>
                {footerCard.title}
              </h6>
              <p className="text-secondary small font-body mb-3 leading-relaxed">
                {footerCard.description}
              </p>
              <NavLink
                to={footerCard.buttonLink}
                className="btn btn-gradient-warm rounded-pill px-4 btn-sm font-body fw-medium"
              >
                {footerCard.buttonText}
              </NavLink>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="col-lg-3 col-md-6 offset-lg-1">
            <h6 className="font-display fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="fas fa-compass" style={{ color: 'var(--app-primary)' }}></i>
              Platform
            </h6>
            <div className="d-flex flex-column gap-2 footer-links font-body text-secondary small">
              <NavLink to="/categories" className="text-decoration-none text-secondary hover-primary transition">
                Browse Services
              </NavLink>
              <NavLink to="/getstarted" className="text-decoration-none text-secondary hover-primary transition">
                Become a Provider
              </NavLink>
              <NavLink to="/about" className="text-decoration-none text-secondary hover-primary transition">
                About Us
              </NavLink>
              <NavLink to="/contact" className="text-decoration-none text-secondary hover-primary transition">
                Help Center & Contact
              </NavLink>
            </div>
          </div>

          {/* Social Links Column */}
          <div className="col-lg-3 col-md-6">
            <h6 className="font-display fw-bold mb-3 d-flex align-items-center gap-2">
              <i className="fas fa-share-alt" style={{ color: 'var(--app-primary)' }}></i>
              Follow Us
            </h6>
            <div className="d-flex gap-2 social-links">
              <a href="#" target="_blank" rel="noreferrer" className="social-icon rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px', background: 'var(--app-surface-muted)', color: 'var(--app-text)' }}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="social-icon rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px', background: 'var(--app-surface-muted)', color: 'var(--app-text)' }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="social-icon rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px', background: 'var(--app-surface-muted)', color: 'var(--app-text)' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="social-icon rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px', background: 'var(--app-surface-muted)', color: 'var(--app-text)' }}>
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'var(--app-border)' }} />

        <div className="row gy-3 align-items-center font-body small">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0 text-secondary">
              © {new Date().getFullYear()} Skill Square. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <NavLink to="/privacy" className="text-secondary text-decoration-none me-3 hover-primary">
              Privacy Policy
            </NavLink>
            <NavLink to="/terms" className="text-secondary text-decoration-none hover-primary">
              Terms of Service
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;