import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const TechnitianByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [technicians, setTechnicians] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/Provider/by-category/${categoryId}`);
        const providers = response.data;

        const providersWithRatings = await Promise.all(
          providers.map(async (p) => {
            try {
              const idToUse = p.id || p.providerId;
              const ratingRes = await api.get(`/Review/average/${idToUse}`);
              return {
                ...p,
                rating: ratingRes.data.averageRating,
              };
            } catch (error) {
              return { ...p, rating: 0 };
            }
          })
        );

        setTechnicians(providersWithRatings);

        if (providers.length > 0) {
          setCategoryName(providers[0].categoryName || "Technicians");
        } else {
          setCategoryName("Technicians");
        }
      } catch (error) {
        console.error("Error fetching technicians:", error.message);
        setCategoryName("Technicians");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [categoryId]);

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "P";
    const f = firstName ? firstName[0] : "";
    const l = lastName ? lastName[0] : "";
    return (f + l).toUpperCase();
  };

  return (
    <section className="app-section bg-light min-vh-100" style={{ paddingTop: '120px' }}>
      <div className="container">
        <div className="mb-5">
          <Link to="/categories" className="text-decoration-none text-secondary font-body small hover-primary mb-3 d-inline-block">
            <i className="fas fa-arrow-left me-2"></i> Back to Categories
          </Link>
          <h1 className="font-display fw-bold text-dark mb-2">
            {categoryName || "Technicians Near You"}
          </h1>
          <p className="text-secondary font-body mb-0">
            {technicians.length} provider{technicians.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="mb-0 text-secondary font-body">Loading technicians...</p>
          </div>
        ) : technicians.length > 0 ? (
          <div className="row g-4">
            {technicians.map((tech) => (
              <div key={tech.id || tech.providerId} className="col-lg-4 col-md-6">
                <div 
                  className="card app-card h-100 border rounded-4 text-start text-decoration-none d-flex flex-column bg-white shadow-sm"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease', borderColor: 'var(--app-border)' }}
                  onClick={() => navigate(`/providerProfile/${tech.id || tech.providerId}`)}
                >
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div 
                        className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center text-white font-display fw-bold fs-5" 
                        style={{ width: '56px', height: '56px', background: 'var(--gradient-warm)' }}
                      >
                        {getInitials(tech.firstName, tech.lastName)}
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <h5 className="font-display fw-bold mb-1 text-dark text-truncate">
                          {tech.firstName} {tech.lastName}
                        </h5>
                        <p className="text-secondary font-body small mb-0 text-truncate">{tech.categoryName || categoryName}</p>
                      </div>
                    </div>

                    <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                      <div className="d-flex align-items-center gap-1">
                        <i className="fas fa-star" style={{ color: 'var(--app-primary)' }}></i>
                        <span className="font-body fw-bold text-dark">{tech.rating ? tech.rating.toFixed(1) : "New"}</span>
                      </div>
                      {tech.hourlyRate > 0 && (
                        <div className="font-body fw-bold" style={{ color: 'var(--app-primary)' }}>
                          ${tech.hourlyRate}/hr
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card app-card border-0 text-center p-5 rounded-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="mb-4" style={{ fontSize: '3rem', color: 'var(--app-primary)', opacity: '0.5' }}>
              <i className="fas fa-user-slash"></i>
            </div>
            <h4 className="font-display fw-bold mb-2">
              No technicians found for this category
            </h4>
            <p className="text-secondary font-body mb-0">
              Try another category or check back later for more professionals.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechnitianByCategory;