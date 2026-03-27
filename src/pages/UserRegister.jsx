import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { registerUser } from "../services/authService";
import ModalAlert from "../components/ModalAlert";

const UserRegister = () => {
  const location = useLocation();
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
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      role: role,
    };

    try {
      await registerUser(payload);

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

      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Registration Failed",
        message:
          error.message ||
          error.response?.data ||
          "Something went wrong. Please try again.",
        actions: [{ label: "Try Again" }],
      });
    } finally {
      setLoading(false);
    }
  };

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

      <section className="app-section app-section-hero auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-10 col-xl-11">
              <div className="card app-card border-0 auth-card overflow-hidden">
                <div className="row g-0">
                  <div className="col-lg-6">
                    <div className="auth-form-panel p-4 p-md-5">
                      <div className="auth-form-header text-center text-lg-start mb-4">
                        <div className="auth-icon-circle mb-3">
                          <i className="fas fa-user-plus"></i>
                        </div>

                        <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
                          Create Account
                        </span>

                        <h1 className="h3 fw-bold mb-2">
                          Register as {role}
                        </h1>

                        <p className="text-secondary mb-0">
                          Create your account and start connecting with trusted
                          services in your area.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="auth-form">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label auth-label">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              className="form-control auth-input"
                              placeholder="Enter first name"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label auth-label">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              className="form-control auth-input"
                              placeholder="Enter last name"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label auth-label">
                              Email Address
                            </label>
                            <input
                              type="email"
                              className="form-control auth-input"
                              placeholder="Enter email address"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label auth-label">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              className="form-control auth-input"
                              placeholder="Enter phone number"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label auth-label">
                              City
                            </label>
                            <input
                              type="text"
                              className="form-control auth-input"
                              placeholder="Enter city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label auth-label">
                              Address
                            </label>
                            <input
                              type="text"
                              className="form-control auth-input"
                              placeholder="Enter address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label auth-label">
                              Password
                            </label>
                            <input
                              type="password"
                              className="form-control auth-input"
                              placeholder="Enter password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
                          <div className="form-check m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="agreeTermsUser"
                              required
                            />
                            <label
                              className="form-check-label text-secondary"
                              htmlFor="agreeTermsUser"
                            >
                              I agree to Terms & Conditions
                            </label>
                          </div>

                          <Link to="/login" className="auth-link text-decoration-none">
                            Already have an account?
                          </Link>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary w-100 rounded-pill py-3 fw-semibold mt-4"
                          disabled={loading}
                        >
                          {loading ? (
                            <span>
                              <i className="fas fa-spinner fa-spin me-2"></i>
                              Registering...
                            </span>
                          ) : (
                            <>
                              <i className="fas fa-rocket me-2"></i>
                              Register as {role}
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-6 d-none d-lg-block">
                    <div className="auth-side-panel h-100">
                      <div className="auth-side-content text-center">
                        <div className="auth-side-emoji mb-4">🚀</div>
                        <h3 className="fw-bold mb-3">Join Our Community</h3>
                        <p className="text-secondary mb-0">
                          Build your account and connect with reliable local
                          service providers in a cleaner and more modern
                          platform experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserRegister;