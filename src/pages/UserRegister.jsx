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

      <section className="app-section bg-light min-vh-100 d-flex align-items-center py-5" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="row justify-content-center">
            {/* Centered Compact Card */}
            <div className="col-md-8 mt-5 col-lg-7 col-xl-6 col-xxl-5">
              <div className="card app-card border-0 rounded-4 shadow-lg bg-white">
                <div className="p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h1 className="font-display fw-bold text-dark mb-2">
                      Create your account
                    </h1>
                    <p className="text-secondary font-body mb-0">
                      Join SkillSquare today to find trusted professionals
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="font-body">
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-dark small mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          className="form-control px-3 py-2 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-dark small mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          className="form-control px-3 py-2 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control px-3 py-2 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-1">Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control px-3 py-2 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-dark small mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          className="form-control px-3 py-2 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-dark small mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          className="form-control px-3 py-2 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          className="form-control px-3 py-2 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gradient-warm w-100 rounded-pill py-3 fw-bold mt-4 shadow-warm"
                      disabled={loading}
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </button>
                    
                    <p className="mt-4 text-center text-secondary small mb-0">
                      Already have an account?{" "}
                      <Link to="/login" className="text-decoration-none fw-bold hover-primary" style={{ color: 'var(--app-primary)' }}>
                        Sign in
                      </Link>
                    </p>
                  </form>
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