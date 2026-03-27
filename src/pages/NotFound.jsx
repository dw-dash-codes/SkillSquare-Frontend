import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="app-section app-section-hero not-found-page min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="card app-card border-0 text-center not-found-card mx-auto">
          <div className="card-body p-4 p-md-5">
            <div className="not-found-icon mb-4">
              <i className="fas fa-compass"></i>
            </div>

            <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
              Error 404
            </span>

            <h1 className="display-6 fw-bold mb-3">Page not found</h1>

            <p className="text-secondary mb-4">
              The page you’re looking for doesn’t exist or may have been moved.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              <Link to="/" className="btn btn-primary rounded-pill px-4 py-3 fw-semibold">
                <i className="fas fa-home me-2"></i>
                Go Home
              </Link>

              <Link
                to="/categories"
                className="btn btn-outline-secondary rounded-pill px-4 py-3 fw-semibold"
              >
                <i className="fas fa-th-large me-2"></i>
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;