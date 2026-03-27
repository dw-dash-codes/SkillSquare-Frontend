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
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        message: error.message || "Kuch galat ho gaya, dobara try karein.",
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

      <section className="app-section app-section-hero auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-10 col-xl-11">
              <div className="card app-card border-0 auth-card overflow-hidden">
                <div className="row g-0">
                  <div className="col-lg-7">
                    <div className="auth-form-panel p-4 p-md-5">
                      <div className="auth-form-header text-center text-lg-start mb-4">
                        <div className="auth-icon-circle mb-3">
                          <i className="fas fa-tools"></i>
                        </div>

                        <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
                          Service Provider
                        </span>

                        <h1 className="h3 fw-bold mb-2">
                          Register Your Provider Account
                        </h1>

                        <p className="text-secondary mb-0">
                          Join the platform, showcase your skills, and connect
                          with customers who need your services.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="auth-form">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label auth-label">First Name</label>
                            <input
                              type="text"
                              className="form-control auth-input"
                              placeholder="Enter first name"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label auth-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control auth-input"
                              placeholder="Enter last name"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label auth-label">Phone Number</label>
                            <input
                              type="tel"
                              className="form-control auth-input"
                              placeholder="Enter phone number"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label auth-label">Email Address</label>
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
                            <label className="form-label auth-label">Password</label>
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

                          <div className="col-md-6">
                            <label className="form-label auth-label">
                              Service Category
                            </label>
                            <select
                              className="form-select auth-input"
                              name="categoryId"
                              value={formData.categoryId}
                              onChange={handleChange}
                              required
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
                          </div>

                          <div className="col-md-6">
                            <label className="form-label auth-label">City</label>
                            <input
                              type="text"
                              className="form-control auth-input"
                              placeholder="Enter city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label auth-label">Area</label>
                            <input
                              type="text"
                              className="form-control auth-input"
                              placeholder="Enter area"
                              name="area"
                              value={formData.area}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label auth-label">Address</label>
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
                            <label className="form-label auth-label">Skills</label>
                            <input
                              type="text"
                              className="form-control auth-input"
                              placeholder="Skills (comma separated)"
                              name="skills"
                              value={formData.skills}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="col-12">
                            <label className="form-label auth-label">Bio</label>
                            <textarea
                              className="form-control auth-input auth-textarea"
                              placeholder="Tell potential customers about your experience and skills"
                              name="bio"
                              value={formData.bio}
                              onChange={handleChange}
                              rows="4"
                            ></textarea>
                            <small className="text-secondary">
                              This helps customers understand your experience better.
                            </small>
                          </div>
                        </div>

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-4">
                          <div className="form-check m-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="agreeTermsProvider"
                              required
                            />
                            <label
                              className="form-check-label text-secondary"
                              htmlFor="agreeTermsProvider"
                            >
                              I agree to Terms & Conditions
                            </label>
                          </div>

                          <Link to="/login" className="auth-link text-decoration-none">
                            Already registered?
                          </Link>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary w-100 rounded-pill py-3 fw-semibold mt-4"
                          disabled={
                            submitting || categoriesLoading || categories.length === 0
                          }
                        >
                          {submitting ? (
                            <>
                              <i className="fas fa-spinner fa-spin me-2"></i>
                              Registering...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-rocket me-2"></i>
                              Register as Service Provider
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="col-lg-5 d-none d-lg-block">
                    <div className="auth-side-panel h-100">
                      <div className="auth-side-content text-center">
                        <div className="auth-side-emoji mb-4">🔧</div>
                        <h3 className="fw-bold mb-3">Start Your Business</h3>
                        <p className="text-secondary mb-0">
                          Join our platform, build trust with customers, and
                          grow your service business with a clean and modern
                          profile presence.
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

export default ProviderRegister;