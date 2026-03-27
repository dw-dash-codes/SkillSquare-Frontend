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
        "Browse trusted categories and discover more professionals for your home and service needs.",
      buttonText: "Browse Services",
      buttonLink: "/categories",
    };
  };

  const footerCard = getFooterCardContent();

  return (
    <footer className="app-footer border-top mt-auto">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="pe-lg-4">
              <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                <i className={`${footerCard.icon} text-primary`}></i>
                {footerCard.title}
              </h5>
              <p className="text-secondary mb-4">
                {footerCard.description}
              </p>
              <NavLink
                to={footerCard.buttonLink}
                className="btn btn-primary rounded-pill px-4"
              >
                {footerCard.buttonText}
              </NavLink>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
              <i className="fas fa-compass text-primary"></i>
              Navigation
            </h5>
            <div className="d-flex flex-column gap-2 footer-links">
              <a href="#about" className="text-decoration-none">
                <i className="fas fa-arrow-right me-2 small"></i>
                About
              </a>
              <a href="#services" className="text-decoration-none">
                <i className="fas fa-arrow-right me-2 small"></i>
                Services
              </a>
              <a href="#contact" className="text-decoration-none">
                <i className="fas fa-arrow-right me-2 small"></i>
                Contact Us
              </a>
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
              <i className="fas fa-share-alt text-primary"></i>
              Follow Us
            </h5>
            <div className="d-flex gap-2 social-links">
              <a href="#" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row gy-3 align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-secondary">
              © 2024 Skill Square. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <NavLink to="/privacy" className="text-secondary text-decoration-none me-3">
              Privacy Policy
            </NavLink>
            <NavLink to="/terms" className="text-secondary text-decoration-none">
              Terms of Service
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;