import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import ModalAlert from "../components/ModalAlert";

const UserRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role || "Customer";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    city: "",
  });

  // 👈 Standardized Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      role: role, // 👈 backend ke liye role add
    };

    try {
      await registerUser(payload);
      
      // 👈 Success Modal
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Registration Successful",
        message: "Your account has been created successfully.",
        actions: [
          { label: "Login Now", path: "/login" },
          { label: "Home", path: "/" },
        ],
      });
    } catch (error) {
      console.error(error);
      
      // 👈 Error Modal
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Registration Failed",
        message: error.message || error.response?.data || "Something went wrong. Please try again.",
        actions: [{ label: "Try Again" }],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 👈 Render Modal Alert conditionally at the top level */}
      {modalConfig.isOpen && (
        <ModalAlert
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          actions={modalConfig.actions}
          onClose={closeModal}
        />
      )}

      <div className="registerPage-content">
        <div className="container registration-container mt-5">
          <h1 className="brand-title">Join Our Community</h1>

          <div className="registration-card">
            <div className="row g-0">
              <div className="col-lg-6">
                <div className="form-section">
                  <div className="user-icon">
                    <i className="fas fa-user-plus"></i>
                  </div>

                  <h2 className="form-title">REGISTER ACCOUNT</h2>

                  <form id="registrationForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="firstName"
                        className="form-control mb-2"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        name="lastName"
                        className="form-control mb-2"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <div className="password-input-container">
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreeTerms"
                          required
                        />
                        <label className="form-check-label">
                          I agree to Terms & Conditions
                        </label>
                      </div>
                      <Link to="/login" className="login-link">
                        Already have an account?
                      </Link>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100 py-2 fw-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <span><i className="fas fa-spinner fa-spin me-2"></i>Registering...</span>
                      ) : (
                        <><i className="fas fa-rocket me-2"></i>Register as {role}</>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-6 d-none d-lg-block bg-light">
                <div className="illustration-section h-100 d-flex flex-column justify-content-center align-items-center p-5 text-center">
                  <div className="illustration-content">
                    <div className="illustration-character mb-4" style={{ fontSize: "4rem" }}>🚀</div>
                    <h3 className="fw-bold text-dark">Join Our Community!</h3>
                    <p className="text-muted mt-3">
                      Create your account and start connecting with trusted
                      service providers in your neighborhood.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRegister;