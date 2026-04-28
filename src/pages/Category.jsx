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
    <section className="app-section bg-light min-vh-100" style={{ paddingTop: '120px' }}>
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="font-display fw-bold text-dark mb-3">
            Service Directory
          </h1>
          <p className="text-secondary font-body mb-0 mx-auto" style={{ maxWidth: '600px' }}>
            Discover all available service categories in your neighborhood and
            quickly connect with the right professional.
          </p>
        </div>

        <div className="row g-4">
          {loading ? (
            <div className="col-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="mb-0 text-secondary font-body">Loading categories...</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="col-12">
              <div className="card app-card border-0 text-center p-4 p-md-5 rounded-4 shadow-sm">
                <h4 className="font-display fw-bold mb-2">No categories found</h4>
                <p className="text-secondary font-body mb-0">
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
                <div
                  className="card app-card category-card h-100 border-0 text-center rounded-4 shadow-sm"
                  role="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                >
                  <div className="card-body p-4 p-lg-5 d-flex flex-column align-items-center justify-content-center">
                    <div className="app-icon-circle mx-auto mb-3" style={{ width: '70px', height: '70px', fontSize: '1.8rem', background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
                      <i className={cat.iconClass || "fas fa-tools"}></i>
                    </div>
                    <h5 className="font-body fw-bold mb-0 text-dark">{cat.title}</h5>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-5 pt-4">
          <div className="card app-card border-0 d-inline-block rounded-4 shadow-sm" style={{ maxWidth: '600px' }}>
            <div className="card-body p-4 p-md-5">
              <h4 className="font-display fw-bold mb-3">
                Can't find what you're looking for?
              </h4>
              <p className="text-secondary font-body mb-4">
                Contact us and we’ll help you find the right professional for your needs.
              </p>
              <a href="#contact" className="btn btn-outline-dark rounded-pill px-5 py-2 font-body fw-bold">
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