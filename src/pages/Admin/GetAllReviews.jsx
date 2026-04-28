import React, { useEffect, useState } from "react";
import { getAllReviews, deleteReview } from "../../services/api";
import ModalAlert from "../../components/ModalAlert";

const GetAllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
  });

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

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const closeConfirm = () => {
    setConfirmConfig({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Review?",
      message: "Are you sure you want to permanently delete this customer review?",
      onConfirm: async () => {
        try {
          await deleteReview(id);
          setReviews((prev) => prev.filter((r) => r.id !== id));

          setModalConfig({
            isOpen: true,
            type: "success",
            title: "Review Deleted",
            message: "The review has been removed successfully.",
            actions: [{ label: "OK" }],
          });
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: "error",
            title: "Delete Failed",
            message: "Failed to delete review. Please try again.",
            actions: [{ label: "Close" }],
          });
        }
      },
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`${i < rating ? "fas fa-star text-warning" : "far fa-star text-secondary"}`}
        style={{ fontSize: '0.85rem', marginRight: '2px', opacity: i < rating ? 1 : 0.4 }}
      ></i>
    ));
  };

  const getInitials = (name) => {
    if (!name) return "C";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (loading) {
    return (
      <section className="admin-page bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ margin: '-2rem', padding: '2rem' }}>
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading platform reviews...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {modalConfig.isOpen && (
        <div className="review-alert-layer" style={{ zIndex: 1060 }}>
          <ModalAlert
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            actions={modalConfig.actions}
            onClose={closeModal}
          />
        </div>
      )}

      {confirmConfig.isOpen && (
        <div className="review-alert-layer" style={{ zIndex: 1060 }}>
          <ModalAlert
            type="info"
            title={confirmConfig.title}
            message={confirmConfig.message}
            actions={[
              {
                label: "Delete",
                onClick: async () => {
                  await confirmConfig.onConfirm?.();
                  closeConfirm();
                },
              },
              {
                label: "Cancel",
                onClick: closeConfirm,
              },
            ]}
            onClose={closeConfirm}
          />
        </div>
      )}

      <section className="admin-page bg-light min-vh-100" style={{ margin: '-2rem', padding: '2rem' }}>
        
        {/* Page Header */}
        <div className="mb-5">
          <span className="badge rounded-pill px-3 py-1 mb-3 fw-bold font-body text-uppercase" style={{ background: 'rgba(255, 193, 7, 0.1)', color: '#d97706', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
            Moderation
          </span>
          <h1 className="font-display fw-bold text-dark display-6 mb-2">Manage Reviews</h1>
          <p className="text-secondary font-body mb-0">
            Monitor customer feedback and remove inappropriate reviews.
          </p>
        </div>

        {/* Data List Card */}
        <div className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
          
          <div className="card-header bg-white border-bottom p-4">
            <h4 className="font-display fw-bold text-dark mb-1">Platform Feedback</h4>
            <p className="text-secondary font-body mb-0 small">
              Showing {reviews.length} total reviews
            </p>
          </div>

          <div className="card-body p-0">
            {reviews.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem', color: '#e2e8f0' }}>
                  <i className="fas fa-comment-slash"></i>
                </div>
                <h5 className="font-display fw-bold text-dark mb-2">No reviews found</h5>
                <p className="text-secondary font-body mb-0">Customer reviews will appear here once available.</p>
              </div>
            ) : (
              <div className="d-flex flex-column font-body">
                {reviews.map((review, index) => (
                  <div 
                    key={review.id} 
                    className="p-4" 
                    style={{ borderBottom: index === reviews.length - 1 ? 'none' : '1px solid #f1f5f9' }}
                  >
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-4">
                      
                      {/* Review Content */}
                      <div className="d-flex align-items-start gap-3 flex-grow-1">
                        
                        {/* Avatar */}
                        <div 
                          className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" 
                          style={{ width: '45px', height: '45px', background: 'var(--gradient-warm)', fontSize: '1rem' }}
                        >
                          {getInitials(review.customerName)}
                        </div>

                        <div className="w-100">
                          {/* Header Line */}
                          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-1">
                            <h6 className="mb-0 fw-bold text-dark">{review.customerName || "Anonymous Customer"}</h6>
                            <span className="text-secondary small" style={{ fontSize: '0.8rem' }}>
                              {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                          
                          {/* Sub Header & Stars */}
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="d-flex align-items-center">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-secondary small" style={{ fontSize: '0.8rem' }}>•</span>
                            <span className="text-secondary small" style={{ fontSize: '0.8rem' }}>
                              Reviewed Provider: <strong className="text-dark">{review.providerName}</strong>
                            </span>
                          </div>

                          {/* Review Text */}
                          <p className="text-dark-emphasis mb-0" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                            "{review.comment || "No written comment provided."}"
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0 mt-3 mt-lg-0 text-end">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-4 fw-bold bg-white shadow-sm"
                          title="Delete Review"
                        >
                          <i className="fas fa-trash-alt me-1"></i> Delete
                        </button>
                      </div>
                      
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </section>
    </>
  );
};

export default GetAllReviews;