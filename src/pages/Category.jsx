import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ServiceCategory");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (id) => {
    navigate(`/technitians-by-category/${id}`);
  };

  return (
    <section className="app-section app-section-hero category-page">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
            Service Directory
          </span>

          <h1 className="app-section-title mb-3">
            <i className="fas fa-th-large me-3"></i>
            Service Categories
          </h1>

          <p className="text-secondary mb-0 category-page-subtitle mx-auto">
            Discover all available service categories in your neighborhood and
            quickly connect with the right professional.
          </p>
        </div>

        <div className="row g-4">
          {loading ? (
            <div className="col-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="mb-0 text-secondary">Loading categories...</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="col-12">
              <div className="card app-card border-0 text-center p-4 p-md-5">
                <h4 className="fw-semibold mb-2">No categories found</h4>
                <p className="text-secondary mb-0">
                  There are no service categories available right now.
                </p>
              </div>
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="col-xl-3 col-lg-4 col-md-6"
              >
                <button
                  type="button"
                  className="category-grid-card card app-card border-0 text-center w-100"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <div className="card-body p-4 p-lg-5">
                    <div className="app-icon-circle mx-auto mb-3">
                      <i className={cat.iconClass || "fas fa-cog"}></i>
                    </div>
                    <h3 className="h5 fw-semibold mb-0">{cat.title}</h3>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-5">
          <div className="card app-card border-0 category-help-card d-inline-block">
            <div className="card-body p-4 p-md-5">
              <h4 className="fw-semibold mb-3">
                Can't find what you're looking for?
              </h4>
              <p className="text-secondary mb-4">
                Contact us and we’ll help you find the right professional for your
                needs.
              </p>
              <a href="#contact" className="btn btn-primary rounded-pill px-4 py-2">
                <i className="fas fa-envelope me-2"></i>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;