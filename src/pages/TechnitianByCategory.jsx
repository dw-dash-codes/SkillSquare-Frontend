import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
          setCategoryName(providers[0].categoryName || "Technicians Near You");
        } else {
          setCategoryName("Technicians Near You");
        }
      } catch (error) {
        console.error("Error fetching technicians:", error.message);
        setCategoryName("Technicians Near You");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [categoryId]);

  return (
    <section className="app-section app-section-hero technicians-category-page">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
            Category Results
          </span>

          <h1 className="app-section-title mb-3">
            <i className="fas fa-bolt me-3"></i>
            {categoryName || "Technicians Near You"}
          </h1>

          <p className="text-secondary mb-0 technicians-category-subtitle mx-auto">
            Explore professionals available in this category and view their
            profile details before booking.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="mb-0 text-secondary">Loading technicians...</p>
          </div>
        ) : technicians.length > 0 ? (
          <div className="row g-4">
            {technicians.map((tech) => (
              <div
                key={tech.id || tech.providerId}
                className="col-xl-3 col-lg-4 col-md-6"
              >
                <div className="card app-card border-0 h-100 text-center provider-result-card">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="app-avatar-circle mx-auto mb-3">
                      <i className="fas fa-user"></i>
                    </div>

                    <h3 className="h5 fw-semibold mb-1">
                      {tech.firstName + " " + tech.lastName}
                    </h3>

                    <p className="text-secondary mb-2">{tech.categoryName}</p>

                    <div className="provider-rate mb-3">
                      {tech.hourlyRate ? `$${tech.hourlyRate}/hr` : "N/A"}
                    </div>

                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`me-1 ${
                            i < (tech.rating || 0)
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
                          navigate(`/providerProfile/${tech.id || tech.providerId}`)
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
        ) : (
          <div className="card app-card border-0 text-center p-4 p-md-5 search-empty-card">
            <div className="search-empty-icon mb-3">
              <i className="fas fa-user-slash"></i>
            </div>
            <h4 className="fw-semibold mb-2">
              No technicians found for this category
            </h4>
            <p className="text-secondary mb-0">
              Try another category or check back later for more professionals.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechnitianByCategory;