import React from "react";
import { useNavigate } from "react-router-dom";

const ModalAlert = ({ type, title, message, actions, onClose }) => {
  const navigate = useNavigate();

  const getIconDetails = () => {
    switch (type) {
      case "success":
        return {
          icon: "fas fa-check-circle",
          iconClass: "modal-alert-icon-success", // Uses existing CSS (green)
        };
      case "error":
        return {
          icon: "fas fa-exclamation-triangle",
          iconClass: "modal-alert-icon-error", // Uses existing CSS (red)
        };
      case "info":
      default:
        return {
          icon: "fas fa-info-circle",
          // Info ke liye warm theme apply kiya hai direct inline taake match kare
          iconClass: "", 
          customStyle: { background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }
        };
    }
  };

  const { icon, iconClass, customStyle } = getIconDetails();

  return (
    <>
      <div 
        className="modal-alert-backdrop" 
        onClick={onClose}
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
      ></div>

      <div
        className="modal d-block modal-alert-wrapper"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-0 rounded-4 shadow-lg bg-white overflow-hidden">
            
            <div className="modal-header border-0 pb-0 justify-content-end">
              <button
                type="button"
                className="btn-close shadow-none"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body text-center pt-0 px-4 pb-4">
              <div 
                className={`modal-alert-icon ${iconClass}`} 
                style={customStyle || {}}
              >
                <i className={icon}></i>
              </div>

              <h4 className="font-display fw-bold text-dark mb-2">{title}</h4>
              <p className="text-secondary font-body mb-0" style={{ lineHeight: '1.6' }}>{message}</p>
            </div>

            <div className="modal-footer border-0 d-flex flex-column flex-sm-row justify-content-center gap-2 pb-4 pt-0 px-4 font-body">
              {actions?.map((action, index) => (
                <button
                  key={index}
                  type="button"
                  className={`btn fw-bold px-4 py-2 rounded-pill flex-grow-1 ${
                    index === 0 ? "btn-gradient-warm shadow-warm" : "btn-light text-dark border"
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