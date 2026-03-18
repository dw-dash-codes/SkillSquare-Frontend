import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            {/* Join Our Platform */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5>
                <i className="fas fa-rocket me-2"></i>Join Our Platform
              </h5>
              <p className="text-muted mb-4">
                Connect with customers or local technicians.
              </p>
              <NavLink to="/getstarted" className="btn btn-primary">
                Get Started
              </NavLink>
            </div>

            {/* Navigation */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5>
                <i className="fas fa-compass me-2"></i>Navigation
              </h5>
              {/* Yeh scroll anchors hain → inko NavLink me convert karne ki zaroorat nahi */}
              <a href="#about">
                <i className="fas fa-arrow-right me-2"></i>About
              </a>
              <a href="#services">
                <i className="fas fa-arrow-right me-2"></i>Services
              </a>
              <a href="#contact">
                <i className="fas fa-arrow-right me-2"></i>Contact Us
              </a>
            </div>


            {/* Social Links */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h5>
                <i className="fas fa-share-alt me-2"></i>Follow Us
              </h5>
              <div className="d-flex gap-3 social-links ">
                {/* External links as normal <a> */}
                <a href="#" target="_blank" rel="noreferrer">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" target="_blank" rel="noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0">© 2024 Skill Square. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <NavLink to="/privacy" className="text-muted me-3">
                Privacy Policy
              </NavLink>
              <NavLink to="/terms" className="text-muted">
                Terms of Service
              </NavLink>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
