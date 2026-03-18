import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query"); // URL se word nikalo (e.g. "plumber")
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        // 👇 Backend API Call
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
    }
  }, [query]);

  return (
    <div
      className="container"
      style={{ marginTop: "100px", marginBottom: "50px" }}
    >
      <h2 className="mb-4">
        Search Results for: <span className="text-primary">"{query}"</span>
      </h2>

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Searching...</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center mt-5 p-5 bg-light rounded">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h4>No technicians found.</h4>
          <p>Try using broader keywords like "Electrician" or "Cleaner".</p>
        </div>
      ) : (
        <div className="row">
          {providers.map((provider) => (
            <div key={provider.providerId} className="col-lg-4 col-md-6 mb-4">
              {/* 👇 UPDATED CARD DESIGN (Matches Home Page) */}
              <div className="technician-card text-center">
                <div className="technician-avatar">
                  <i className="fas fa-user"></i>
                </div>

                <h3 className="technician-name">{provider.name}</h3>
                <h5>{provider.categoryName}</h5>

                {/* Optional: Show City for search context, styled subtly */}
                <p className="text-muted small mb-1">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  {provider.city}
                </p>

                <p className="technician-rate">${provider.hourlyRate}/hr</p>

                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={
                        i < provider.rating
                          ? "fas fa-star text-warning"
                          : "far fa-star text-muted"
                      }
                    ></i>
                  ))}
                </div>

                <button
                  className="btn btn-primary mt-2"
                  onClick={() =>
                    navigate(`/providerProfile/${provider.providerId}`)
                  }
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
