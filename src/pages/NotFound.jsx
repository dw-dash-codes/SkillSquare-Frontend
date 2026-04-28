import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="app-section bg-light min-vh-100 d-flex align-items-center" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            <div className="card app-card border-0 rounded-4 shadow-lg bg-white overflow-hidden">
              <div className="row g-0">
                {/* Left Form / Text Panel */}
                <div className="col-md-7">
                  <div className="p-4 p-md-5 d-flex flex-column h-100 justify-content-center">
                    
                    <div className="text-center text-md-start mb-5">
                      <h1 className="font-display fw-bold text-dark mb-2 display-5">Page Not Found</h1>
                      <div className="mb-4">
                        <span className="badge rounded-pill text-bg-light border px-3 py-1 font-body fw-medium" style={{ color: 'var(--app-primary)' }}>
                          Error 404
                        </span>
                      </div>
                      
                      <p className="text-secondary font-body mb-0 fs-5" style={{ lineHeight: '1.7', maxWidth: '450px', margin: '0 auto' }}>
                        We're sorry, but the page you’re looking for doesn’t exist or may have been moved.
                      </p>
                    </div>

                    <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start gap-3 pt-3">
                      <Link to="/" className="btn btn-gradient-warm rounded-pill px-4 py-3 fw-bold font-body shadow-warm">
                        <i className="fas fa-home me-2"></i>
                        Go Home
                      </Link>

                      <Link
                        to="/categories"
                        className="btn btn-outline-dark rounded-pill px-4 py-3 fw-bold font-body"
                      >
                        <i className="fas fa-th-large me-2"></i>
                        Browse Services
                      </Link>
                    </div>
                    
                  </div>
                </div>

                {/* Right Graphic Panel (Modern integrated look) */}
                <div className="col-md-5 d-none d-md-block position-relative">
                  <div className="h-100" style={{ 
                      // Apply the image background directly for immersive feel
                      backgroundImage: "url('/path/to/your/reading-nook-image.jpg')", // Change this path to your actual image
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderLeft: "1px solid var(--app-border)"
                  }}>
                    {/* Optional overlay for elegant transition */}
                    <div className="h-100 w-100" style={{ 
                        background: 'linear-gradient(to right, #ffffff, transparent)' 
                    }}></div>
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

export default NotFound;