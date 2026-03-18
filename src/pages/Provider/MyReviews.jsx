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

      // 1️⃣ Fetch Reviews List
      const reviewsRes = await api.get(`/Review/provider/${userId}`);
      setReviews(reviewsRes.data);

      // 2️⃣ Fetch Average Rating
      const avgRes = await api.get(`/Review/average/${userId}`);
      // Backend returns object { providerId: "...", averageRating: 4.5 }
      setAverageRating(avgRes.data.averageRating);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📅 Date Formatter
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // ⭐ Star Rating Helper (Visuals k liye)
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star text-warning"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-secondary"></i>);
      }
    }
    return stars;
  };

  if (loading) return <div className="p-4">Loading reviews...</div>;

  return (
    <>
      <div className="">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Reviews</h1>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-body">
                {/* Average Rating Header */}
                <div className="mb-4 d-flex align-items-center">
                  <h4 className="mb-0 mr-3">Average Rating:</h4>
                  <span
                    className="badge bg-warning text-dark"
                    style={{ fontSize: "1.2rem" }}
                  >
                    {averageRating.toFixed(1)}{" "}
                    <i className="fas fa-star ml-1"></i>
                  </span>
                  <span className="text-muted ml-3">
                    ({reviews.length} reviews)
                  </span>
                </div>

                {/* Reviews List */}
                <div className="list-group">
                  {reviews.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                      <i className="fas fa-comment-slash fa-3x mb-3"></i>
                      <p>No reviews yet.</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">
                            {/* Backend se agar customer object aa raha hai to review.customer.firstName */}
                            {/* Agar backend ne flatten karke bheja hai to review.customerName check karna */}
                            {review.customerName || "Customer"}
                          </h5>
                          <small className="text-muted">
                            {formatDate(review.createdAt)}
                          </small>
                        </div>

                        <div className="mb-2">{renderStars(review.rating)}</div>

                        <p className="mb-1">{review.comment}</p>

                        {/* Reply button removed as backend doesn't support it yet */}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyReviews;
