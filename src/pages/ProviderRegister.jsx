import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { registerProvider } from "../services/authService";
import { getAllCategories } from "../services/api";
import ModalAlert from "../components/ModalAlert";

const ProviderRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    area: "",
    city: "",
    categoryId: "",
    bio: "",
    skills: "",
  });

  const [formErrors, setFormErrors] = useState({}); 
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getAllCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Categories Load Failed",
          message: "Service categories load nahi ho sakin. Backend data check karein.",
          actions: [{ label: "OK" }],
        });
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
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
    if (!formData.area.trim()) errors.area = "Area is required.";
    if (!formData.address.trim()) errors.address = "Address is required.";
    if (!formData.categoryId) errors.categoryId = "Service Category is required.";

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

    setSubmitting(true);

    const payload = {
      ...formData,
      categoryId: Number(formData.categoryId),
    };

    try {
      await registerProvider(payload);

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Registration Successful",
        message: "Your provider account has been created successfully.",
        actions: [{ label: "Go to Login", path: "/login" }],
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Registration Failed",
        message: error.message || "Something went wrong. Please try again.",
        actions: [{ label: "Try Again" }],
      });
    } finally {
      setSubmitting(false);
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
            {/* Centered Compact Card - Removed app-card so it doesn't jump on hover */}
            <div className="col-md-10 mt-5 col-lg-8 col-xl-7 col-xxl-6">
              <div className="card border-0 rounded-4 shadow-lg bg-white">
                <div className="p-4 p-md-5">
                  <div className="text-center mb-4">
                    <span className="badge rounded-pill px-3 py-1 mb-2 fw-medium" style={{ background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
                      Service Provider
                    </span>
                    <h1 className="font-display fw-bold text-dark mb-2">
                      Join as a Professional
                    </h1>
                    <p className="text-secondary font-body mb-0">
                      Showcase your skills and connect with customers
                    </p>
                  </div>

                  {/* Summary Alert */}
                  {Object.keys(formErrors).length > 0 && (
                    <div className="alert alert-danger rounded-3 py-2 px-3 small font-body border-0 mb-4" style={{ background: '#fef2f2', color: '#ef4444' }}>
                      <i className="fas fa-exclamation-circle me-2"></i>
                      Please fix the highlighted errors before submitting.
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
                        />
                        {formErrors.email && <div className="invalid-feedback d-block small">{formErrors.email}</div>}
                      </div>
                      
                      <div className="col-sm-6">
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

                      <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-1">Service Category</label>
                        <select
                          name="categoryId"
                          className={`form-select px-3 py-2 bg-light shadow-none text-dark ${formErrors.categoryId ? 'is-invalid border-danger' : 'border-0'}`}
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.categoryId}
                          onChange={handleChange}
                          disabled={categoriesLoading || categories.length === 0}
                        >
                          <option value="">
                            {categoriesLoading
                              ? "Loading categories..."
                              : categories.length === 0
                              ? "No categories available"
                              : "Select Service Category"}
                          </option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.title}
                            </option>
                          ))}
                        </select>
                        {formErrors.categoryId && <div className="invalid-feedback d-block small">{formErrors.categoryId}</div>}
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

                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-dark small mb-1">Area</label>
                        <input
                          type="text"
                          name="area"
                          className={`form-control px-3 py-2 bg-light shadow-none ${formErrors.area ? 'is-invalid border-danger' : 'border-0'}`}
                          style={{ borderRadius: '0.75rem' }}
                          value={formData.area}
                          onChange={handleChange}
                        />
                        {formErrors.area && <div className="invalid-feedback d-block small">{formErrors.area}</div>}
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

                      <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-1">Skills (comma separated)</label>
                        <input
                          type="text"
                          name="skills"
                          className="form-control px-3 py-2 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem' }}
                          placeholder="e.g. Plumbing, Pipe fitting, Heating"
                          value={formData.skills}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-bold text-dark small mb-1">Professional Bio</label>
                        <textarea
                          name="bio"
                          className="form-control px-3 py-3 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem', minHeight: '100px' }}
                          placeholder="Tell potential customers about your experience and skills..."
                          value={formData.bio}
                          onChange={handleChange}
                          rows="3"
                        ></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gradient-warm w-100 rounded-pill py-3 fw-bold mt-4 shadow-warm"
                      disabled={submitting || categoriesLoading || categories.length === 0}
                    >
                      {submitting ? "Creating account..." : "Register as Provider"}
                    </button>
                    
                    <p className="mt-4 text-center text-secondary small mb-0">
                      Already registered?{" "}
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

export default ProviderRegister;