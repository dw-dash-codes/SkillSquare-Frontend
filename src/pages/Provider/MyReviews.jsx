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
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star text-warning me-1"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-secondary me-1"></i>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="provider-page">
        <div className="card app-card border-0 text-center p-4 p-md-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="mb-0 text-secondary">Loading reviews...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="provider-page">
      <div className="provider-page-header mb-4">
        <div>
          <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-2">
            Provider Panel
          </span>
          <h1 className="provider-page-title mb-2">My Reviews</h1>
          <p className="text-secondary mb-0">
            View customer feedback and track your service rating.
          </p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-4">
          <div className="card app-card border-0 provider-stat-card h-100">
            <div className="card-body p-4">
              <div className="provider-stat-top">
                <div className="provider-stat-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="provider-stat-number">
                  {Number(averageRating || 0).toFixed(1)}
                </div>
              </div>

              <h3 className="provider-stat-label">Average Rating</h3>

              <div className="text-warning">{renderStars(Math.round(averageRating || 0))}</div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-4">
          <div className="card app-card border-0 provider-stat-card h-100">
            <div className="card-body p-4">
              <div className="provider-stat-top">
                <div className="provider-stat-icon">
                  <i className="fas fa-comment"></i>
                </div>
                <div className="provider-stat-number">{reviews.length}</div>
              </div>

              <h3 className="provider-stat-label">Total Reviews</h3>

              <p className="text-secondary mb-0">
                Reviews shared by your customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card app-card border-0 provider-bookings-overview">
        <div className="card-body p-4 p-lg-5">
          <div className="mb-4">
            <h2 className="h4 fw-semibold mb-1">Customer Reviews</h2>
            <p className="text-secondary mb-0">
              All feedback received on your completed jobs.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="provider-empty-state text-center py-4">
              <div className="search-empty-icon mb-3">
                <i className="fas fa-comment-slash"></i>
              </div>
              <h5 className="fw-semibold mb-2">No reviews yet</h5>
              <p className="text-secondary mb-0">
                Reviews from your customers will appear here.
              </p>
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
                            {review.customerName || "Customer"}
                          </h6>
                          <div className="small">{renderStars(review.rating)}</div>
                        </div>

                        <span className="text-secondary small">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      <p className="text-secondary mb-0">
                        {review.comment || "No comment provided."}
                      </p>
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