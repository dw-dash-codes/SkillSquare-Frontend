import React, { useState, useEffect } from "react";
import api from "../services/api";
import { getBookingDetails } from "../services/api";
import ModalAlert from "./ModalAlert";

const ReviewModal = ({ isOpen, onClose, bookingId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(true);
  const [bookingInfo, setBookingInfo] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
    onCloseCallback: null,
  });

  useEffect(() => {
    if (isOpen && bookingId) {
      loadBookingInfo();
    } else {
      setRating(0);
      setHover(0);
      setComment("");
      setBookingInfo(null);
    }
  }, [isOpen, bookingId]);

  const loadBookingInfo = async () => {
    setFetchingDetails(true);
    try {
      const data = await getBookingDetails(bookingId);
      setBookingInfo(data);
    } catch (error) {
      console.error("Failed to load booking details:", error);
    } finally {
      setFetchingDetails(false);
    }
  };

  const closeAlert = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    if (modalConfig.onCloseCallback) {
      modalConfig.onCloseCallback();
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Rating Required",
        message: "Please select a star rating before submitting! ⭐",
        actions: [{ label: "OK" }],
        onCloseCallback: null,
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/Review", {
        bookingId: bookingId,
        rating: rating,
        comment: comment,
      });

      setRating(0);
      setHover(0);
      setComment("");

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Thank You!",
        message: "Review submitted successfully! 🎉",
        actions: [{ label: "Done" }],
        onCloseCallback: () => {
          if (onSuccess) onSuccess();
          onClose();
        },
      });
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        "Something went wrong.";

      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Submission Failed",
        message: errorMsg,
        actions: [{ label: "Try Again" }],
        onCloseCallback: null,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="review-modal-backdrop" onClick={onClose}></div>

      <div
        className="modal d-block review-modal-wrapper"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 review-modal-card">
            <div className="modal-header review-modal-header border-0">
              <h5 className="modal-title fw-bold">
                <i className="fas fa-star me-2 text-warning"></i>
                Rate Your Experience
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body p-4 text-center">
              {fetchingDetails ? (
                <div className="spinner-border text-primary my-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : bookingInfo ? (
                <div className="review-booking-info text-start mb-4">
                  <h6 className="fw-bold mb-1 text-primary">
                    {bookingInfo.serviceCategory} Service
                  </h6>
                  <p className="mb-1 small">
                    <strong>Provider:</strong> {bookingInfo.providerName}
                  </p>
                  <p className="mb-1 small text-secondary">
                    <strong>Task:</strong> {bookingInfo.taskDescription}
                  </p>
                  <p className="mb-0 small text-secondary">
                    <i className="far fa-calendar-alt me-1"></i>
                    {bookingInfo.date}
                  </p>
                </div>
              ) : (
                <p className="text-danger small">Could not load booking details.</p>
              )}

              <h5 className="mb-3 text-dark fw-bold">How did they do?</h5>

              <div className="review-stars-wrap mb-4">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  const active = ratingValue <= (hover || rating);

                  return (
                    <button
                      key={ratingValue}
                      type="button"
                      className={`review-star-btn ${active ? "active" : ""}`}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(rating)}
                      aria-label={`Rate ${ratingValue} star${ratingValue > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>

              <div className="text-start">
                <label className="form-label auth-label">
                  Write a Review (Optional)
                </label>
                <textarea
                  className="form-control auth-input auth-textarea review-comment-box"
                  rows="3"
                  placeholder="Tell us what you liked about the service..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer review-modal-footer border-0">
              <button
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary rounded-pill px-4 fw-semibold"
                onClick={handleSubmit}
                disabled={loading || fetchingDetails}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalConfig.isOpen && (
        <div className="review-alert-layer">
          <ModalAlert
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            actions={modalConfig.actions}
            onClose={closeAlert}
          />
        </div>
      )}
    </>
  );
};

export default ReviewModal;