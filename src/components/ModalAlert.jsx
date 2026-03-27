import React from "react";
import { useNavigate } from "react-router-dom";

const ModalAlert = ({ type, title, message, actions, onClose }) => {
  const navigate = useNavigate();

  const getIconDetails = () => {
    switch (type) {
      case "success":
        return {
          icon: "fas fa-check-circle",
          iconClass: "modal-alert-icon-success",
        };
      case "error":
        return {
          icon: "fas fa-exclamation-triangle",
          iconClass: "modal-alert-icon-error",
        };
      case "info":
      default:
        return {
          icon: "fas fa-info-circle",
          iconClass: "modal-alert-icon-info",
        };
    }
  };

  const { icon, iconClass } = getIconDetails();

  return (
    <>
      <div className="modal-alert-backdrop" onClick={onClose}></div>

      <div
        className="modal d-block modal-alert-wrapper"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 modal-alert-card">
            <div className="modal-header border-0 pb-0">
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body text-center pt-0 px-4 pb-4">
              <div className={`modal-alert-icon ${iconClass}`}>
                <i className={icon}></i>
              </div>

              <h4 className="fw-bold text-dark mb-2">{title}</h4>
              <p className="text-secondary mb-0">{message}</p>
            </div>

            <div className="modal-footer border-0 modal-alert-footer">
              {actions?.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  className={`btn fw-semibold px-4 rounded-pill ${
                    index === 0 ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => {
                    if (action.onClick) {
                      action.onClick();
                    } else if (action.path) {
                      navigate(action.path);
                    }

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