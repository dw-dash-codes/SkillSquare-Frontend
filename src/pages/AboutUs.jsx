import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <section className="app-section bg-light min-vh-100 py-5 mt-5" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            
            <div className="text-center mb-5">
              <span className="badge rounded-pill px-3 py-1 mb-3 fw-bold font-body text-uppercase" style={{ background: 'var(--gradient-warm)', color: 'white', letterSpacing: '1px' }}>
                Our Story
              </span>
              <h1 className="font-display fw-bold text-dark display-5 mb-3">About SkillSquare</h1>
              <p className="text-secondary font-body lead mx-auto" style={{ maxWidth: '700px' }}>
                We are on a mission to bridge the gap between everyday people and trusted local professionals.
              </p>
            </div>

            <div className="card border-0 rounded-4 shadow-sm bg-white p-4 p-md-5 mb-4">
              <h3 className="font-display fw-bold text-dark mb-3">Who We Are</h3>
              <p className="text-secondary font-body" style={{ lineHeight: '1.8' }}>
                SkillSquare was founded with a simple idea: finding reliable, skilled help shouldn't be a hassle. Whether you need a plumber to fix a leak, an electrician for a quick repair, or a cleaner to refresh your home, the process of finding the right person has traditionally been stressful and unpredictable. 
              </p>
              <p className="text-secondary font-body" style={{ lineHeight: '1.8' }}>
                We built SkillSquare to change that. We are a premier service marketplace that connects individuals and businesses with highly skilled, verified professionals in their local area.
              </p>

              <h3 className="font-display fw-bold text-dark mt-5 mb-3">Our Core Values</h3>
              <div className="row g-4 mt-2">
                <div className="col-md-4">
                  <div className="p-4 bg-light rounded-4 h-100 border text-center">
                    <i className="fas fa-shield-alt fa-2x mb-3" style={{ color: 'var(--app-primary)' }}></i>
                    <h5 className="fw-bold text-dark">Trust & Safety</h5>
                    <p className="text-secondary small mb-0">We prioritize security and verify our professionals to ensure your peace of mind.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-4 bg-light rounded-4 h-100 border text-center">
                    <i className="fas fa-star fa-2x mb-3" style={{ color: 'var(--app-primary)' }}></i>
                    <h5 className="fw-bold text-dark">Quality Service</h5>
                    <p className="text-secondary small mb-0">Our review system ensures that only the best, most dedicated professionals thrive on our platform.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-4 bg-light rounded-4 h-100 border text-center">
                    <i className="fas fa-handshake fa-2x mb-3" style={{ color: 'var(--app-primary)' }}></i>
                    <h5 className="fw-bold text-dark">Empowerment</h5>
                    <p className="text-secondary small mb-0">We empower skilled workers to grow their independent businesses and find consistent work.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;