import React, { useEffect, useState } from "react";
import { getAllReviews, deleteReview } from "../../services/api"; 

const GetAllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(id);
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (error) {
      alert("Failed to delete review");
    }
  };

  // Helper to verify rating stars visually
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < rating ? "text-warning" : "text-secondary"}`}
        style={{ fontSize: "0.8rem", marginRight: "2px" }}
      ></i>
    ));
  };

  if (loading) return <div className="p-4">Loading reviews...</div>;

  return (
    <>
      <div className="">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Manage Reviews</h1>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">All Customer Reviews</h3>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {reviews.length === 0 ? (
                    <li className="list-group-item text-center p-4">
                      No reviews found.
                    </li>
                  ) : (
                    reviews.map((review) => (
                      <li
                        key={review.id}
                        className="list-group-item d-flex justify-content-between align-items-start p-3"
                      >
                        <div className="ms-2 me-auto">
                          <div className="fw-bold d-flex align-items-center mb-1">
                            <span className="me-2">{review.customerName}</span>
                            <span className="badge bg-light text-dark border rounded-pill fw-normal">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="mb-2">
                             {renderStars(review.rating)} 
                             <span className="ms-2 fw-bold text-dark">"{review.comment}"</span>
                          </div>
                          
                          <small className="text-muted">
                            Review for Provider: <strong>{review.providerName}</strong>
                          </small>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="btn btn-sm btn-outline-danger ms-3"
                          title="Delete Review"
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetAllReviews;