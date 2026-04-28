import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/Provider/search?query=${query}`);
        setProviders(res.data);
      } catch (err) {
        console.error("Search API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setLoading(false);
      setProviders([]);
    }
  }, [query]);

  const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <section className="app-section bg-light min-vh-100" style={{ paddingTop: '120px' }}>
      <div className="container">
        <div className="mb-5">
          <Link to="/" className="text-decoration-none text-secondary font-body small hover-primary mb-3 d-inline-block">
            <i className="fas fa-arrow-left me-2"></i> Back to Home
          </Link>
          <h1 className="font-display fw-bold text-dark mb-2">
            Results for <span style={{ color: 'var(--app-primary)' }}>"{query}"</span>
          </h1>
          <p className="text-secondary font-body mb-0">
            {providers.length} provider{providers.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="mb-0 text-secondary font-body">Searching professionals...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="card app-card border-0 text-center p-5 rounded-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="mb-4" style={{ fontSize: '3rem', color: 'var(--app-primary)', opacity: '0.5' }}>
              <i className="fas fa-search"></i>
            </div>
            <h4 className="font-display fw-bold mb-2">No technicians found</h4>
            <p className="text-secondary font-body mb-0">
              Try broader keywords like <strong>Electrician</strong>, <strong>Cleaner</strong>, or <strong>Plumber</strong>.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {providers.map((provider) => (
              <div key={provider.providerId} className="col-lg-4 col-md-6">
                <div 
                  className="card app-card h-100 border rounded-4 text-start text-decoration-none d-flex flex-column bg-white shadow-sm"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease', borderColor: 'var(--app-border)' }}
                  onClick={() => navigate(`/providerProfile/${provider.providerId}`)}
                >
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div 
                        className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center text-white font-display fw-bold fs-5" 
                        style={{ width: '56px', height: '56px', background: 'var(--gradient-warm)' }}
                      >
                        {getInitials(provider.name)}
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-display fw-bold mb-1 text-dark text-truncate">{provider.name}</h5>
                        <p className="text-secondary font-body small mb-0 text-truncate">{provider.categoryName || "Service Provider"}</p>
                      </div>
                    </div>

                    <p className="text-secondary font-body small mb-4">
                      <i className="fas fa-map-marker-alt me-2" style={{ color: 'var(--app-primary)' }}></i>
                      {provider.city || "Location not available"}
                    </p>

                    <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                      <div className="d-flex align-items-center gap-1">
                        <i className="fas fa-star" style={{ color: 'var(--app-primary)' }}></i>
                        <span className="font-body fw-bold text-dark">{provider.rating ? provider.rating.toFixed(1) : "New"}</span>
                      </div>
                      {provider.hourlyRate > 0 && (
                        <div className="font-body fw-bold" style={{ color: 'var(--app-primary)' }}>
                          ${provider.hourlyRate}/hr
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;