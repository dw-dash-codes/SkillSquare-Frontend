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
      message: "Are you sure you want to delete this review?",
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
            message: "Failed to delete review.",
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
        className={`fas fa-star ${i < rating ? "text-warning" : "text-secondary"}`}
      ></i>
    ));
  };

  if (loading) {
    return (
      <>
        {modalConfig.isOpen && (
          <ModalAlert
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            actions={modalConfig.actions}
            onClose={closeModal}
          />
        )}

        <section className="admin-page">
          <div className="card app-card border-0 text-center p-4 p-md-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="mb-0 text-secondary">Loading reviews...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {modalConfig.isOpen && (
        <ModalAlert
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          actions={modalConfig.actions}
          onClose={closeModal}
        />
      )}

      {confirmConfig.isOpen && (
        <ModalAlert
          type="info"
          title={confirmConfig.title}
          message={confirmConfig.message}
          actions={[
            {
              label: "Proceed",
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
      )}

      <section className="admin-page">
        <div className="admin-page-header mb-4">
          <div>
            <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-2">
              Admin Panel
            </span>
            <h1 className="admin-page-title mb-2">Manage Reviews</h1>
            <p className="text-secondary mb-0">
              Monitor customer feedback and remove inappropriate reviews when needed.
            </p>
          </div>
        </div>

        <div className="card app-card border-0 admin-table-card">
          <div className="card-body p-0">
            <div className="p-4 pb-3 border-bottom">
              <h2 className="h5 fw-semibold mb-1">All Customer Reviews</h2>
              <p className="text-secondary mb-0">
                Ratings, comments, and provider feedback shared by customers.
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center p-4 p-md-5">
                <div className="search-empty-icon mb-3">
                  <i className="fas fa-comment-slash"></i>
                </div>
                <h5 className="fw-semibold mb-2">No reviews found</h5>
                <p className="text-secondary mb-0">
                  Customer reviews will appear here once available.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column">
                {reviews.map((review) => (
                  <div key={review.id} className="admin-review-row">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 w-100">
                      <div className="flex-grow-1">
                        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-2 mb-2">
                          <h6 className="mb-0 fw-semibold">{review.customerName}</h6>
                          <span className="badge rounded-pill text-bg-light border px-3 py-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="d-flex align-items-center flex-wrap gap-2 mb-2 admin-review-stars">
                          <div>{renderStars(review.rating)}</div>
                          <span className="fw-semibold text-dark">
                            “{review.comment}”
                          </span>
                        </div>

                        <small className="text-secondary">
                          Review for Provider: <strong>{review.providerName}</strong>
                        </small>
                      </div>

                      <div className="d-flex justify-content-end">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          title="Delete Review"
                        >
                          <i className="fas fa-trash-alt me-1"></i>
                          Delete
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