import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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

  return (
    <section className="app-section app-section-hero search-results-page">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
            Search Directory
          </span>

          <h1 className="app-section-title mb-3">
            Search Results for{" "}
            <span className="text-primary">
              {query ? `"${query}"` : "your search"}
            </span>
          </h1>

          <p className="text-secondary mb-0 search-results-subtitle mx-auto">
            Browse matching technicians and service providers based on your search.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="mb-0 text-secondary">Searching...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="card app-card border-0 text-center p-4 p-md-5 search-empty-card">
            <div className="search-empty-icon mb-3">
              <i className="fas fa-search"></i>
            </div>
            <h4 className="fw-semibold mb-2">No technicians found</h4>
            <p className="text-secondary mb-0">
              Try broader keywords like <strong>Electrician</strong>,{" "}
              <strong>Cleaner</strong>, or <strong>Plumber</strong>.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {providers.map((provider) => (
              <div key={provider.providerId} className="col-xl-4 col-md-6">
                <div className="card app-card border-0 h-100 text-center provider-result-card">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="app-avatar-circle mx-auto mb-3">
                      <i className="fas fa-user"></i>
                    </div>

                    <h3 className="h5 fw-semibold mb-1">{provider.name}</h3>
                    <p className="text-secondary mb-2">{provider.categoryName}</p>

                    <p className="text-secondary small mb-2">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {provider.city || "Location not available"}
                    </p>

                    <div className="provider-rate mb-3">
                      ${provider.hourlyRate}/hr
                    </div>

                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`me-1 ${
                            i < provider.rating
                              ? "fas fa-star text-warning"
                              : "far fa-star text-muted"
                          }`}
                        ></i>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <button
                        className="btn btn-primary rounded-pill px-4"
                        onClick={() =>
                          navigate(`/providerProfile/${provider.providerId}`)
                        }
                      >
                        View Profile
                      </button>
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