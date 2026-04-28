import React from "react";
import { Link } from "react-router-dom";

const GetStarted = () => {
  return (
    <section className="app-section bg-light min-vh-100 d-flex align-items-center" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-9 col-lg-10">
            
            <div className="text-center mb-5">
              <Link to="/" className="text-decoration-none text-secondary font-body small hover-primary mb-3 d-inline-block">
                <i className="fas fa-arrow-left me-2"></i> Back to Home
              </Link>
              <h1 className="font-display fw-bold text-dark mb-3">
                Join SkillSquare
              </h1>
              <p className="text-secondary font-body mb-0 fs-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
                Choose how you want to use the platform and we'll take you to the right setup.
              </p>
            </div>

            <div className="row g-4 justify-content-center">
              {/* Customer Option */}
              <div className="col-md-6">
                <Link
                  to="/userRegister"
                  state={{ role: "Customer" }}
                  className="text-decoration-none d-block h-100"
                >
                  <div 
                    className="card app-card h-100 border rounded-4 text-center p-4 p-lg-5 bg-white shadow-sm"
                    style={{ transition: 'all 0.3s ease', cursor: 'pointer', borderColor: 'var(--app-border)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.borderColor = 'var(--app-primary)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-warm)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--app-border)';
                      e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                    }}
                  >
                    <div 
                      className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '80px', height: '80px', background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)', fontSize: '2rem' }}
                    >
                      <i className="fas fa-search"></i>
                    </div>

                    <h4 className="font-display fw-bold text-dark mb-3">Hire a Professional</h4>

                    <p className="text-secondary font-body mb-0" style={{ lineHeight: '1.6' }}>
                      I want to find and book trusted technicians, cleaners, or service providers near me.
                    </p>
                  </div>
                </Link>
              </div>

              {/* Provider Option */}
              <div className="col-md-6">
                <Link
                  to="/providerRegister"
                  state={{ role: "Provider" }}
                  className="text-decoration-none d-block h-100"
                >
                  <div 
                    className="card app-card h-100 border rounded-4 text-center p-4 p-lg-5 bg-white shadow-sm"
                    style={{ transition: 'all 0.3s ease', cursor: 'pointer', borderColor: 'var(--app-border)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.borderColor = 'var(--app-primary)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-warm)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--app-border)';
                      e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                    }}
                  >
                    <div 
                      className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center text-white shadow-warm"
                      style={{ width: '80px', height: '80px', background: 'var(--gradient-warm)', fontSize: '2rem' }}
                    >
                      <i className="fas fa-tools"></i>
                    </div>

                    <h4 className="font-display fw-bold text-dark mb-3">Offer My Services</h4>

                    <p className="text-secondary font-body mb-0" style={{ lineHeight: '1.6' }}>
                      I want to join the platform, list my services, and start earning by helping customers.
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="text-center mt-5">
              <p className="text-secondary font-body small mb-0">
                Already have an account? <Link to="/login" className="text-decoration-none fw-bold hover-primary" style={{ color: 'var(--app-primary)' }}>Sign In</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;