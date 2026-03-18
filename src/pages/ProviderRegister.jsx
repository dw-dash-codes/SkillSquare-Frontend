import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerProvider } from "../services/authService";
import { getAllCategories } from "../services/api";
import ModalAlert from "../components/ModalAlert";

const ProviderRegister = () => {
  const navigate = useNavigate();

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
        message: "Make your life better.",
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

      <div className="main-content mt-5">
        <div className="container registration-container">
          <h1 className="brand-title">Join Our Platform</h1>

          <div className="registration-card">
            <div className="row g-0">
              <div className="col-lg-6">
                <div className="form-section">
                  <div className="user-icon">
                    <i className="fas fa-tools"></i>
                  </div>

                  <h2 className="form-title">Service Provider Registration</h2>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
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
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <select
                        className="form-select"
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

                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Skills (comma separated)"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <textarea
                        className="form-control textarea"
                        placeholder="Bio (Optional)"
                        value={formData.bio}
                        name="bio"
                        onChange={handleChange}
                        rows="4"
                      ></textarea>
                      <small className="optional-label">
                        Tell potential customers about your experience and skills
                      </small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreeTerms"
                          required
                        />
                        <label className="form-check-label" htmlFor="agreeTerms">
                          I agree to Terms & Conditions
                        </label>
                      </div>

                      <Link to="/login" className="login-link">
                        Already registered?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-register"
                      disabled={categoriesLoading || categories.length === 0}
                    >
                      <i className="fas fa-rocket me-2"></i>
                      Register as Service Provider
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-lg-6 d-none d-lg-block">
                <div className="illustration-section h-100">
                  <div className="illustration-content">
                    <div className="illustration-character">🔧</div>
                    <h3>Start Your Business!</h3>
                    <p>
                      Join our platform and connect with customers who need your
                      services. Build your reputation and grow your business with us.
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

export default ProviderRegister;