import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "P";
    const f = firstName ? firstName[0] : "";
    const l = lastName ? lastName[0] : "";
    return (f + l).toUpperCase() || "P";
  };

  if (loading) {
    return (
      <section className="app-section bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ paddingTop: '120px' }}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading provider details...</p>
        </div>
      </section>
    );
  }

  if (!provider) {
    return (
      <section className="app-section bg-light min-vh-100" style={{ paddingTop: '120px' }}>
        <div className="container">
          <div className="card app-card border-0 text-center p-5 rounded-4 shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="mb-4" style={{ fontSize: '3rem', color: 'var(--app-primary)', opacity: '0.5' }}>
              <i className="fas fa-user-times"></i>
            </div>
            <h4 className="font-display fw-bold mb-2">Provider not found</h4>
            <p className="text-secondary font-body mb-0">
              We couldn’t load this provider’s details at the moment.
            </p>
            <button onClick={() => navigate(-1)} className="btn btn-outline-dark rounded-pill px-4 mt-4 font-body fw-bold">
              Go Back
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="app-section bg-light min-vh-100" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
      <div className="container">
        
        {/* Back Navigation */}
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-secondary font-body small p-0 hover-primary">
            <i className="fas fa-arrow-left me-2"></i> Back to Providers
          </button>
        </div>

        <div className="row g-4">
          {/* Main Content Column */}
          <div className="col-lg-8">
            
            {/* Hero Profile Card */}
            <div className="card app-card border-0 rounded-4 shadow-sm mb-4 bg-white">
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
                  {/* Avatar */}
                  <div 
                    className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center text-white font-display fw-bold shadow-sm" 
                    style={{ width: '100px', height: '100px', fontSize: '2.5rem', background: 'var(--gradient-warm)' }}
                  >
                    {getInitials(provider.firstName, provider.lastName)}
                  </div>

                  {/* Info */}
                  <div className="text-center text-md-start flex-grow-1">
                    <h1 className="font-display fw-bold text-dark mb-1">
                      {provider.firstName} {provider.lastName}
                    </h1>
                    <p className="text-secondary font-body mb-3 fs-5">
                      {categoryName || "Service Provider"}
                    </p>

                    <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start align-items-center font-body">
                      {/* Rating */}
                      <div className="d-flex align-items-center px-3 py-2 rounded-pill" style={{ background: 'var(--app-surface-muted)', border: '1px solid var(--app-border)' }}>
                        <i className="fas fa-star me-2" style={{ color: 'var(--app-primary)' }}></i>
                        <span className="fw-bold text-dark me-1">{rating.averageRating.toFixed(1)}</span>
                        <span className="text-secondary small">({rating.totalReviews} reviews)</span>
                      </div>

                      {/* Rate */}
                      {provider.hourlyRate > 0 && (
                        <div className="d-flex align-items-center px-3 py-2 rounded-pill fw-bold text-dark" style={{ background: 'var(--app-surface-muted)', border: '1px solid var(--app-border)' }}>
                          <i className="fas fa-clock me-2" style={{ color: 'var(--app-primary)' }}></i>
                          ${provider.hourlyRate}/hr
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Card */}
            <div className="card app-card border-0 rounded-4 shadow-sm mb-4 bg-white">
              <div className="card-body p-4 p-lg-5">
                <h3 className="font-display fw-bold text-dark mb-4 border-bottom pb-3">
                  About
                </h3>
                <p className="text-secondary font-body mb-4" style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>
                  {provider.bio || "No bio available for this provider yet."}
                </p>

                {provider.skills && (
                  <div>
                    <h6 className="font-display fw-bold text-dark mb-3">Expertise & Skills</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {/* Splitting skills by comma if it's a string, or just displaying it */}
                      {provider.skills.split(',').map((skill, index) => (
                        <span key={index} className="badge rounded-pill text-dark font-body fw-medium px-3 py-2" style={{ background: 'var(--app-surface-muted)', border: '1px solid var(--app-border)', fontSize: '0.9rem' }}>
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Card */}
            <div className="card app-card border-0 rounded-4 shadow-sm bg-white">
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <h3 className="font-display fw-bold text-dark mb-0">
                    Reviews <span className="text-secondary fs-5">({reviews.length})</span>
                  </h3>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3" style={{ fontSize: '2.5rem', color: 'var(--app-primary)', opacity: '0.5' }}>
                      <i className="fas fa-comment-slash"></i>
                    </div>
                    <p className="text-secondary font-body mb-0">No reviews yet for this provider.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 rounded-4" style={{ border: '1px solid var(--app-border)', background: 'var(--app-surface)' }}>
                        <div className="d-flex align-items-start gap-3">
                          {/* Reviewer Avatar */}
                          <div 
                            className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center text-primary font-body fw-bold" 
                            style={{ width: '48px', height: '48px', background: 'rgba(242, 122, 33, 0.1)', fontSize: '1.1rem' }}
                          >
                            {getInitials(review.customerName, "")}
                          </div>

                          <div className="flex-grow-1">
                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-2">
                              <h6 className="font-display fw-bold text-dark mb-1 mb-sm-0">
                                {review.customerName || "Customer"}
                              </h6>
                              <span className="text-secondary font-body small">
                                {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>

                            <div className="mb-2">
                              {Array.from({ length: 5 }, (_, i) => (
                                <i
                                  key={i}
                                  className={`me-1 ${
                                    i < review.rating ? "fas fa-star" : "far fa-star"
                                  }`}
                                  style={{ color: i < review.rating ? 'var(--app-primary)' : '#e4e5e9', fontSize: '0.9rem' }}
                                ></i>
                              ))}
                            </div>

                            <p className="text-secondary font-body mb-0" style={{ lineHeight: '1.6' }}>
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

          {/* Sidebar / Booking Column */}
          <div className="col-lg-4">
            <div className="card app-card border-0 rounded-4 shadow-sm bg-white" style={{ position: 'sticky', top: '100px' }}>
              <div className="card-body p-4 p-lg-5">
                <h4 className="font-display fw-bold text-dark mb-4 text-center">
                  Book {provider.firstName}
                </h4>

                <button
                  className="btn btn-gradient-warm w-100 rounded-pill py-3 font-body fw-bold mb-4 shadow-warm"
                  onClick={handleBooking}
                >
                  <i className="fas fa-calendar-alt me-2"></i>
                  Book Appointment
                </button>

                <hr style={{ borderColor: 'var(--app-border)' }} />

                <div className="d-flex flex-column gap-4 mt-4 font-body">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '45px', height: '45px', background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <p className="text-secondary small mb-0 fw-medium">Phone</p>
                      <p className="text-dark fw-bold mb-0">{provider.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '45px', height: '45px', background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div style={{ wordBreak: 'break-word' }}>
                      <p className="text-secondary small mb-0 fw-medium">Email</p>
                      <p className="text-dark fw-bold mb-0">{provider.email || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '45px', height: '45px', background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <p className="text-secondary small mb-0 fw-medium">Service Area</p>
                      <p className="text-dark fw-bold mb-0">
                        {[provider.area, provider.city].filter(Boolean).join(", ") || "Location not set"}
                      </p>
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