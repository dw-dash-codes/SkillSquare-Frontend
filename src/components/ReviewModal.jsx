import React, { useState, useEffect } from "react";
import api from "../services/api"; 
import { getBookingDetails } from "../services/api"; 
import ModalAlert from "./ModalAlert";

const ReviewModal = ({ isOpen, onClose, bookingId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  
  // States for fetching booking info
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(true);
  const [bookingInfo, setBookingInfo] = useState(null);

  // 👈 Modal Alert State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
    onCloseCallback: null // Special callback to close the main modal after success
  });

  useEffect(() => {
    if (isOpen && bookingId) {
      loadBookingInfo();
    } else {
      // Clear the form when modal closes
      setRating(0);
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

  // Handle closing the Alert Modal
  const closeAlert = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    // If there is a special callback (like closing the main modal), run it
    if (modalConfig.onCloseCallback) {
      modalConfig.onCloseCallback();
    }
  };

  const handleSubmit = async () => {
    // Validation Alert
    if (rating === 0) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Rating Required",
        message: "Please select a star rating before submitting! ⭐",
        actions: [{ label: "OK" }],
        onCloseCallback: null
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

      // Reset State
      setRating(0);
      setComment("");
      
      // 👈 Success Alert
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Thank You!",
        message: "Review submitted successfully! 🎉",
        actions: [{ label: "Done" }],
        onCloseCallback: () => {
          if (onSuccess) onSuccess(); 
          onClose(); // Close the main Review modal after they click "Done"
        }
      });

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || error.response?.data || "Something went wrong.";
      
      // 👈 Error Alert
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Submission Failed",
        message: errorMsg,
        actions: [{ label: "Try Again" }],
        onCloseCallback: null
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Backdrop for Review Modal */}
      <div 
        className="modal-backdrop show" 
        style={{ backgroundColor: "rgba(0,0,0,0.75)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1040 }}
      ></div>

      {/* 2. Review Modal Container */}
      <div 
        className="modal d-block show" 
        tabIndex="-1" 
        style={{ zIndex: 1050, opacity: 1 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 rounded-4 bg-white">
            
            {/* Header */}
            <div className="modal-header bg-primary text-white border-0 rounded-top-4">
              <h5 className="modal-title fw-bold">
                <i className="fas fa-star me-2 text-warning"></i> Rate Your Experience
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4 text-center bg-white">
              
              {/* Dynamic Booking Info Section */}
              {fetchingDetails ? (
                <div className="spinner-border text-primary my-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : bookingInfo ? (
                <div className="bg-light p-3 rounded-3 mb-4 text-start border shadow-sm">
                  <h6 className="fw-bold mb-1 text-primary">
                    {bookingInfo.serviceCategory} Service
                  </h6>
                  <p className="mb-1 small">
                    <strong>Provider:</strong> {bookingInfo.providerName}
                  </p>
                  <p className="mb-1 small text-muted">
                    <strong>Task:</strong> {bookingInfo.taskDescription}
                  </p>
                  <p className="mb-0 small text-muted">
                    <i className="far fa-calendar-alt me-1"></i> {bookingInfo.date}
                  </p>
                </div>
              ) : (
                <p className="text-danger small">Could not load booking details.</p>
              )}

              <h5 className="mb-3 text-dark fw-bold">How did they do?</h5>

              {/* Interactive Stars */}
              <div className="d-flex justify-content-center mb-4 gap-2">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <button
                      key={ratingValue}
                      type="button"
                      className="btn btn-link p-0 text-decoration-none border-0 bg-transparent"
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(rating)}
                      style={{ fontSize: "2.5rem", color: ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9", transition: "color 0.2s" }}
                    >
                      ★
                    </button>
                  );
                })}
              </div>

              {/* Comment Box */}
              <div className="text-start">
                <label className="form-label fw-bold text-dark">Write a Review (Optional)</label>
                <textarea
                  className="form-control bg-light"
                  rows="3"
                  placeholder="Tell us what you liked about the service..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 bg-light rounded-bottom-4">
              <button
                className="btn btn-secondary px-4"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary px-4 fw-bold"
                onClick={handleSubmit}
                disabled={loading || fetchingDetails}
              >
                {loading ? (
                  <span><i className="fas fa-spinner fa-spin me-2"></i>Submitting...</span>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Modal Alert rendered on top if triggered */}
      {modalConfig.isOpen && (
        <div style={{ position: "relative", zIndex: 1060 }}>
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