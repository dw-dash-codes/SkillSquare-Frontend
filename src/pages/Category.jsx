import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/ServiceCategory");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryClick = (id) => {
    navigate(`/technitians-by-category/${id}`);
  };

  return (
    <div className="category-content mt-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="cateogry-page-title">
            <i className="fas fa-th-large me-3"></i>Service Categories
          </h1>
          <br />
          <p className="category-subtitle">
            Discover all available service categories in your neighborhood
          </p>
        </div>

        {/* <div className="stats-section">
          <div className="row">
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">{categories.length}</div>
                <div className="stat-label">Categories</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Professionals</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Services Completed</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">4.8</div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Dynamic Category Cards */}
        <div className="row g-4">
          {categories.length === 0 ? (
            <p className="text-center">Loading categories...</p>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="col-lg-3 col-md-4 col-sm-6"
                onClick={() => handleCategoryClick(cat.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="category-card text-center">
                  <div className="category-icon">
                    <i className={cat.iconClass || "fas fa-cog"}></i>
                  </div>
                  <h3 className="category-title">{cat.title}</h3>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-5">
          <div className="bg-white p-4 rounded-3 shadow-sm d-inline-block">
            <h4 className="mb-3">Can't find what you're looking for?</h4>
            <p className="text-muted mb-3">
              Contact us and we'll help you find the right professional for your
              needs.
            </p>
            <a href="#contact" className="btn btn-primary btn-lg px-4">
              <i className="fas fa-envelope me-2"></i>Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
