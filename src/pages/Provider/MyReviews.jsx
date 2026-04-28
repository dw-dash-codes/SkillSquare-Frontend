import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviewsData();
  }, []);

  const loadReviewsData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const userId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      const reviewsRes = await api.get(`/Review/provider/${userId}`);
      setReviews(reviewsRes.data);

      const avgRes = await api.get(`/Review/average/${userId}`);
      setAverageRating(avgRes.data.averageRating);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`${i < Math.round(rating) ? "fas fa-star" : "far fa-star"}`}
        style={{ color: i < Math.round(rating) ? '#ffc107' : '#e2e8f0', marginRight: '2px' }}
      ></i>
    ));
  };

  const getInitials = (name) => {
    if (!name) return "C";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (loading) {
    return (
      <section className="provider-page bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ margin: '-2rem', padding: '2rem' }}>
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading your feedback...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="provider-page bg-light min-vh-100" style={{ margin: '-2rem', padding: '2rem' }}>
      {/* Page Header */}
      <div className="mb-5">
        <span className="badge rounded-pill px-3 py-1 mb-3 fw-medium" style={{ background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
          Reputation
        </span>
        <h1 className="font-display fw-bold text-dark mb-2">My Reviews</h1>
        <p className="text-secondary font-body mb-0">
          View customer feedback and track your service rating performance.
        </p>
      </div>

      {/* Stat Cards Row */}
      <div className="row g-4 mb-5 font-body">
        <div className="col-md-6 col-xl-4">
          <div className="card app-card border rounded-4 shadow-sm h-100 bg-white" style={{ borderColor: '#d1d5db' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-warning" style={{ width: '48px', height: '48px', background: 'rgba(255, 193, 7, 0.1)', fontSize: '1.2rem' }}>
                  <i className="fas fa-star"></i>
                </div>
                <div>
                  <h6 className="text-secondary mb-0 small fw-bold">Average Rating</h6>
                  <h2 className="font-display fw-bold mb-0 text-dark">{Number(averageRating || 0).toFixed(1)}</h2>
                </div>
              </div>
              <div className="pt-2 border-top">
                {renderStars(averageRating)}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-4">
          <div className="card app-card border rounded-4 shadow-sm h-100 bg-white" style={{ borderColor: '#d1d5db' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-primary" style={{ width: '48px', height: '48px', background: 'rgba(242, 122, 33, 0.1)', fontSize: '1.2rem' }}>
                  <i className="fas fa-comment-dots"></i>
                </div>
                <div>
                  <h6 className="text-secondary mb-0 small fw-bold">Total Reviews</h6>
                  <h2 className="font-display fw-bold mb-0 text-dark">{reviews.length}</h2>
                </div>
              </div>
              <p className="text-secondary small mb-0 pt-2 border-top">Feedback from {reviews.length} customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List Section */}
      <div className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
        <div className="card-body p-4 p-lg-5">
          <h3 className="font-display fw-bold text-dark mb-4 border-bottom pb-4">Customer Feedback</h3>

          {reviews.length === 0 ? (
            <div className="text-center py-5 rounded-4 border" style={{ background: 'var(--app-surface-muted)', borderColor: '#e2e8f0' }}>
              <div className="mb-3" style={{ fontSize: '3rem', color: 'var(--app-primary)', opacity: '0.5' }}>
                <i className="fas fa-comment-slash"></i>
              </div>
              <h5 className="font-display fw-bold mb-2">No reviews yet</h5>
              <p className="text-secondary font-body mb-0">
                Feedback from your customers will appear here after job completion.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-4" style={{ border: '1px solid #e2e8f0', background: 'var(--app-surface-muted)' }}>
                  <div className="d-flex align-items-start gap-3">
                    {/* User Avatar Circle */}
                    <div 
                      className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center text-white font-body fw-bold shadow-sm" 
                      style={{ width: '50px', height: '50px', background: 'var(--gradient-warm)', fontSize: '1.1rem' }}
                    >
                      {getInitials(review.customerName)}
                    </div>

                    <div className="flex-grow-1 font-body">
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-start mb-2">
                        <div>
                          <h6 className="fw-bold text-dark mb-1">{review.customerName || "Customer"}</h6>
                          <div className="mb-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <span className="text-secondary small">
                          <i className="far fa-calendar-alt me-1"></i>
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      <div className="p-3 rounded-3 bg-white" style={{ borderColor: '#e2e8f0' }}>
                        <p className="text-secondary mb-0 italic" style={{ lineHeight: '1.6', fontStyle: 'italic' }}>
                          "{review.comment || "The customer did not leave a written comment."}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyReviews;