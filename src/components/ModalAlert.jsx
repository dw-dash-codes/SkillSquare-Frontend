import React from "react";
import { useNavigate } from "react-router-dom";

const ModalAlert = ({ type, title, message, actions, onClose }) => {
  const navigate = useNavigate();

  // Dynamic Icon and Color based on alert type
  const getIconDetails = () => {
    switch (type) {
      case "success":
        return { icon: "fas fa-check-circle", color: "text-success" };
      case "error":
        return { icon: "fas fa-exclamation-triangle", color: "text-danger" };
      case "info":
      default:
        return { icon: "fas fa-info-circle", color: "text-primary" };
    }
  };

  const { icon, color } = getIconDetails();

  return (
    <>
      {/* 1. Solid Dark Backdrop */}
      <div 
        className="modal-backdrop show" 
        style={{ 
          backgroundColor: "rgba(0,0,0,0.6)", 
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1040 
        }}
      ></div>

      {/* 2. Modal Container */}
      <div 
        className="modal d-block show" 
        tabIndex="-1" 
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 shadow-lg rounded-4 bg-white">
            
            {/* Header - Clean, no borders, right-aligned close button */}
            <div className="modal-header border-0 pb-0">
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Body - Centered Icon and Text */}
            <div className="modal-body text-center pt-0 px-4 pb-4">
              {/* Large Icon */}
              <i className={`${icon} ${color} mb-3`} style={{ fontSize: "3.5rem" }}></i>
              
              {/* Title */}
              <h4 className="fw-bold text-dark mb-2">{title}</h4>
              
              {/* Message */}
              <p className="text-muted mb-0">{message}</p>
            </div>

            {/* Footer - Clean buttons, full width if needed */}
            <div className="modal-footer border-0 d-flex justify-content-center bg-light rounded-bottom-4 px-4 py-3">
              {actions?.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  // Primary action gets the theme color (Primary Blue), secondary gets outline
                  className={`btn px-4 fw-bold ${
                    index === 0 ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => {
                    if (action.path) navigate(action.path);
                    if (onClose) onClose();
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ModalAlert;