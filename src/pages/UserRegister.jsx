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

  const [formErrors, setFormErrors] = useState({});

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
    
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const checkEmailAvailability = async () => {
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return;

    try {
      
    } catch (error) {
      console.error("Error checking email availability:", error);
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.firstName.trim()) errors.firstName = "First Name is required.";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required.";
    
    if (!formData.email.trim()) {
      errors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else {
      const pwd = formData.password;
      if (pwd.length < 6) errors.password = "Password must be at least 6 characters long.";
      else if (!/(?=.*[a-z])/.test(pwd)) errors.password = "Password must contain at least one lowercase letter.";
      else if (!/(?=.*[A-Z])/.test(pwd)) errors.password = "Password must contain at least one uppercase letter.";
      else if (!/(?=.*\d)/.test(pwd)) errors.password = "Password must contain at least one number.";
      else if (!/(?=.*[^a-zA-Z\d])/.test(pwd)) errors.password = "Password must contain at least one special character (e.g. @$!%*?&).";
    }

    if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone Number is required.";
    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.address.trim()) errors.address = "Address is required.";

    if (Object.keys(errors).length > 0) {
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
      console.error("Registration Error:", error);

      let errorString = "";
      let displayMessage = "Something went wrong. Please try again.";

      
      if (typeof error === "string") {
        errorString = error.toLowerCase();
        displayMessage = error;
      } 

      else if (error?.response?.data) {
        if (typeof error.response.data === "string") {
          errorString = error.response.data.toLowerCase();
          displayMessage = error.response.data;
        } else {
          errorString = JSON.stringify(error.response.data).toLowerCase();
          displayMessage = error.response.data.title || error.response.data.message || displayMessage;
        }
      } 
   
      else if (error?.message) {
        errorString = error.message.toLowerCase();
        displayMessage = error.message;
      }


      if (errorString.includes("taken") || errorString.includes("already") || errorString.includes("duplicate")) {
        setFormErrors((prev) => ({
          ...prev,
          email: "This email is already registered. Please try logging in.",
        }));
      } else {
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Registration Failed",
          message: displayMessage,
          actions: [{ label: "Try Again" }],
        });
      }
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
            <div className="col-md-8 mt-5 col-lg-7 col-xl-6 col-xxl-5">
              <div className="card border-0 rounded-4 shadow-lg bg-white">
                <div className="p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h1 className="font-display fw-bold text-dark mb-2">
                      Create your account
                    </h1>
                    <p className="text-secondary font-body mb-0">
                      Join SkillSquare today to find trusted professionals
                    </p>
                  </div>

                  {Object.keys(formErrors).length > 0 && (
                    <div className="alert alert-danger rounded-3 py-2 px-3 small font-body border-0 mb-4" style={{ background: '#fef2f2', color: '#ef4444' }}>
                      <i className="fas fa-exclamation-circle me-2"></i>
                      Please fix the errors below before submitting.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="font-body" noValidate>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-dark small mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          className={`form-control px-3 py-2 bg-light shadow-none ${formErrors.firstName ? 'is-invalid border-danger' : 'border-0'}`}
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        {formErrors.firstName && <div className="invalid-feedback d-block small">{formErrors.firstName}</div>}
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-dark small mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          className={`form-control px-3 py-2 bg-light shadow-none ${formErrors.lastName ? 'is-invalid border-danger' : 'border-0'}`}
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        {formErrors.lastName && <div className="invalid-feedback d-block small">{formErrors.lastName}</div>}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control px-3 py-2 bg-light shadow-none ${formErrors.email ? 'is-invalid border-danger' : 'border-0'}`}
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={checkEmailAvailability}
                        />
                        {formErrors.email && <div className="invalid-feedback d-block small">{formErrors.email}</div>}
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-1">Password</label>
                        <input
                          type="password"
                          name="password"
                          className={`form-control px-3 py-2 bg-light shadow-none ${formErrors.password ? 'is-invalid border-danger' : 'border-0'}`}
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.password}
                          onChange={handleChange}
                        />
                        {formErrors.password && <div className="invalid-feedback d-block small">{formErrors.password}</div>}
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-dark small mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          className={`form-control px-3 py-2 bg-light shadow-none ${formErrors.phoneNumber ? 'is-invalid border-danger' : 'border-0'}`}
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                        {formErrors.phoneNumber && <div className="invalid-feedback d-block small">{formErrors.phoneNumber}</div>}
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-dark small mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          className={`form-control px-3 py-2 bg-light shadow-none ${formErrors.city ? 'is-invalid border-danger' : 'border-0'}`}
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.city}
                          onChange={handleChange}
                        />
                        {formErrors.city && <div className="invalid-feedback d-block small">{formErrors.city}</div>}
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          className={`form-control px-3 py-2 bg-light shadow-none ${formErrors.address ? 'is-invalid border-danger' : 'border-0'}`}
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.address}
                          onChange={handleChange}
                        />
                        {formErrors.address && <div className="invalid-feedback d-block small">{formErrors.address}</div>}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gradient-warm w-100 rounded-pill py-3 fw-bold mt-4 shadow-warm"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i> Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
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