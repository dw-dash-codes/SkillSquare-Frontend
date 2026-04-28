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
      <div 
        className="review-modal-backdrop" 
        onClick={onClose}
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
      ></div>

      <div
        className="modal d-block review-modal-wrapper"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden bg-white">
            
            {/* Header */}
            <div className="modal-header border-bottom-0 pt-4 px-4 pb-0 align-items-center">
              <h4 className="modal-title font-display fw-bold text-dark d-flex align-items-center">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: '45px', height: '45px', background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}
                >
                  <i className="fas fa-star"></i>
                </div>
                Rate Experience
              </h4>
              <button
                type="button"
                className="btn-close shadow-none"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4 font-body">
              {fetchingDetails ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary mb-2" role="status"></div>
                  <p className="text-secondary small mb-0">Loading details...</p>
                </div>
              ) : bookingInfo ? (
                <div className="bg-light p-3 rounded-4 border-0 mb-4">
                  <h6 className="fw-bold mb-2 text-dark font-display">
                    {bookingInfo.serviceCategory} Service
                  </h6>
                  <p className="mb-1 small text-secondary">
                    <strong className="text-dark">Provider:</strong> {bookingInfo.providerName}
                  </p>
                  <p className="mb-1 small text-secondary">
                    <strong className="text-dark">Task:</strong> {bookingInfo.taskDescription}
                  </p>
                  <p className="mb-0 small text-secondary">
                    <i className="far fa-calendar-alt me-2"></i>
                    {bookingInfo.date}
                  </p>
                </div>
              ) : (
                <div className="alert alert-danger small rounded-3 border-0 py-2">
                  Could not load booking details.
                </div>
              )}

              <div className="text-center mb-4">
                <h5 className="mb-3 text-dark font-display fw-bold">How did they do?</h5>
                <div className="d-flex justify-content-center gap-2">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    const active = ratingValue <= (hover || rating);

                    return (
                      <button
                        key={ratingValue}
                        type="button"
                        className="btn p-0 border-0 bg-transparent"
                        onClick={() => setRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(rating)}
                        style={{
                          fontSize: '2.5rem',
                          lineHeight: '1',
                          color: active ? 'var(--app-primary)' : '#e2e8f0',
                          transition: 'all 0.2s ease',
                          transform: active ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-start">
                <label className="form-label fw-bold text-dark small mb-2">
                  Write a Review (Optional)
                </label>
                <textarea
                  className="form-control px-3 py-3 bg-light border-0 shadow-none"
                  rows="3"
                  style={{ borderRadius: '0.75rem', resize: 'none' }}
                  placeholder="Tell us what you liked about the service..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top-0 px-4 pb-4 pt-0 justify-content-between font-body">
              <button
                className="btn btn-light rounded-pill px-4 fw-bold flex-grow-1 text-dark"
                style={{ border: '1px solid var(--app-border)' }}
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-gradient-warm rounded-pill px-4 fw-bold flex-grow-1 shadow-warm"
                onClick={handleSubmit}
                disabled={loading || fetchingDetails}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i> Submitting...
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
        <div className="review-alert-layer" style={{ zIndex: 1060 }}>
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