import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [category, setCategory] = useState([]);
  const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  const handleBooking = () => {
    navigate(`/book-a-technitian/${provider.id}`);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [providerRes, reviewRes, categoryRes, ratingRes] =
          await Promise.all([
            api.get(`/Provider/${id}`),
            api.get(`/Review/provider/${id}`),
            api.get("/ServiceCategory"),
            api.get(`/Review/average/${id}`),
          ]);

        setProvider(providerRes.data);
        setReviews(reviewRes.data);
        setCategory(categoryRes.data);
        setRating(ratingRes.data);
      } catch (error) {
        console.log("Error while fetching Provider Details", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  const categoryName = category.find((c) => c.id === provider?.categoryId)?.title;

  if (loading) {
    return (
      <section className="app-section app-section-hero provider-details-page">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="mb-0 text-secondary">Loading provider details...</p>
        </div>
      </section>
    );
  }

  if (!provider) {
    return (
      <section className="app-section app-section-hero provider-details-page">
        <div className="container">
          <div className="card app-card border-0 text-center p-4 p-md-5">
            <h4 className="fw-semibold mb-2">Provider not found</h4>
            <p className="text-secondary mb-0">
              We couldn’t load this provider’s details at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="app-section app-section-hero provider-details-page">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card app-card border-0 provider-hero-card mb-4">
              <div className="card-body p-4 p-lg-5">
                <div className="row align-items-center g-4">
                  <div className="col-md-3 text-center text-md-start">
                    <div className="provider-profile-avatar mx-auto mx-md-0">
                      <i className="fas fa-bolt"></i>
                    </div>
                  </div>

                  <div className="col-md-9 text-center text-md-start">
                    <h1 className="mb-2 fw-bold">
                      {provider.firstName} {provider.lastName}
                    </h1>

                    <p className="text-secondary mb-3">
                      {categoryName || "Service Provider"}
                    </p>

                    <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start align-items-center">
                      <div className="provider-rating-wrap">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`me-1 ${
                              i < Math.round(rating.averageRating)
                                ? "fas fa-star text-warning"
                                : "far fa-star text-muted"
                            }`}
                          ></i>
                        ))}
                        <span className="ms-2 fw-semibold text-dark">
                          {rating.averageRating.toFixed(1)}
                        </span>
                      </div>

                      <span className="badge rounded-pill text-bg-light border px-3 py-2">
                        {rating.totalReviews} Reviews
                      </span>

                      <span className="badge rounded-pill text-bg-light border px-3 py-2">
                        ${provider.hourlyRate}/hour
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card app-card border-0 mb-4">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h4 fw-semibold mb-3">
                  <i className="fas fa-user me-2 text-primary"></i>
                  About {provider.firstName}
                </h2>

                <p className="text-secondary mb-3">
                  {provider.bio || "No bio available."}
                </p>

                <div className="provider-skills-box">
                  <h6 className="fw-semibold mb-2">Skills</h6>
                  <p className="text-secondary mb-0">
                    {provider.skills || "No skills listed."}
                  </p>
                </div>
              </div>
            </div>

            <div className="card app-card border-0">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h4 fw-semibold mb-4">
                  <i className="fas fa-star me-2 text-primary"></i>
                  Customer Reviews
                </h2>

                {reviews.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="search-empty-icon mb-3">
                      <i className="fas fa-comment-slash"></i>
                    </div>
                    <p className="text-secondary mb-0">No reviews yet.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="provider-review-item">
                        <div className="d-flex align-items-start gap-3">
                          <div className="provider-review-avatar">
                            <i className="fas fa-user"></i>
                          </div>

                          <div className="flex-grow-1">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-2">
                              <div>
                                <h6 className="mb-1 fw-semibold">
                                  {review.customerName}
                                </h6>
                                <div className="text-warning small">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <i
                                      key={i}
                                      className={`me-1 ${
                                        i < review.rating ? "fas fa-star" : "far fa-star text-muted"
                                      }`}
                                    ></i>
                                  ))}
                                </div>
                              </div>

                              <span className="text-secondary small">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <p className="text-secondary mb-0">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card app-card border-0 provider-booking-card sticky-lg-top">
              <div className="card-body p-4">
                <h3 className="h5 fw-semibold mb-4">
                  <i className="fas fa-calendar-check me-2 text-primary"></i>
                  Book {provider.firstName}
                </h3>

                <button
                  className="btn btn-primary w-100 rounded-pill py-3 fw-semibold mb-4"
                  onClick={handleBooking}
                >
                  <i className="fas fa-calendar-plus me-2"></i>
                  Book Appointment
                </button>

                <div className="provider-contact-list d-flex flex-column gap-3">
                  <div className="provider-contact-item">
                    <div className="provider-contact-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">Phone</div>
                      <div className="text-secondary">{provider.phoneNumber || "N/A"}</div>
                    </div>
                  </div>

                  <div className="provider-contact-item">
                    <div className="provider-contact-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">Email</div>
                      <div className="text-secondary">{provider.email || "N/A"}</div>
                    </div>
                  </div>

                  <div className="provider-contact-item">
                    <div className="provider-contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">Service Area</div>
                      <div className="text-secondary">
                        {[provider.area, provider.address].filter(Boolean).join(", ") || "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="provider-contact-item">
                    <div className="provider-contact-icon">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">Starting Rate</div>
                      <div className="text-secondary">
                        {provider.hourlyRate ? `$${provider.hourlyRate}/hour` : "N/A"}
                      </div>
                    </div>
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

export default ProviderDetails;