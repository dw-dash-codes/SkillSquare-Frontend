import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProviders();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/ServiceCategory");
      setCategories(res.data);
    } catch (error) {
      console.error("Error While fetching categories", error);
    }
  };

  const fetchFeaturedProviders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Provider/featured");
      const providers = res.data;

      const providersWithRatings = await Promise.all(
        providers.map(async (p) => {
          try {
            const ratingRes = await api.get(`/Review/average/${p.providerId}`);
            return {
              ...p,
              rating: ratingRes.data.averageRating,
            };
          } catch (error) {
            console.error(`Error fetching rating for provider ${p.providerId}`, error);
            return { ...p, rating: 0 };
          }
        })
      );

      setFeaturedProviders(providersWithRatings);
    } catch (err) {
      console.error("Error fetching featured providers", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (id) => {
    navigate(`/technitians-by-category/${id}`);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search-results?query=${searchTerm}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading) {
    return (
      <section className="app-section pt-5 mt-5">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="mb-0 text-secondary">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="hero-section app-section app-section-hero">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-xl-8 col-lg-10">
              <span className="badge rounded-pill text-bg-light border mb-3 px-3 py-2">
                Trusted Local Services
              </span>

              <h1 className="display-5 fw-bold mb-3">
                Find Local and Trusted Technicians
              </h1>

              <p className="lead text-secondary mb-4">
                Search for electricians, plumbers, house cleaners, and more in
                a cleaner, faster, and more reliable way.
              </p>

              <div className="app-search-card mx-auto">
                <div className="input-group input-group-lg">
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search for services (e.g. Plumber)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <button
                    className="btn btn-primary px-4"
                    type="button"
                    onClick={handleSearch}
                  >
                    <i className="fas fa-search me-2"></i>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-section" id="services">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="app-section-title">Service Categories</h2>
            <p className="text-secondary mb-0">
              Explore the most popular services available on Skill Square.
            </p>
          </div>

          <div className="row g-4">
            {categories.slice(0, 6).map((category) => (
              <div className="col-lg-4 col-md-6" key={category.id}>
                <div
                  className="card app-card category-card h-100 border-0 text-center"
                  role="button"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="card-body p-4">
                    <div className="app-icon-circle mx-auto mb-3">
                      <i className={category.iconClass}></i>
                    </div>
                    <h5 className="fw-semibold mb-0">{category.title}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link to="/categories" className="btn btn-primary rounded-pill px-4">
              See More Services
            </Link>
          </div>
        </div>
      </section>

      <section className="app-section app-section-muted">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="app-section-title">Featured Technicians</h2>
            <p className="text-secondary mb-0">
              Discover top-rated professionals selected from our platform.
            </p>
          </div>

          <div className="row g-4">
            {featuredProviders.map((provider) => (
              <div key={provider.providerId} className="col-lg-4 col-md-6">
                <div className="card app-card h-100 border-0 text-center">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="app-avatar-circle mx-auto mb-3">
                      <i className="fas fa-user"></i>
                    </div>

                    <h5 className="fw-semibold mb-1">{provider.name}</h5>
                    <p className="text-secondary mb-2">{provider.categoryName}</p>
                    <h6 className="text-primary fw-bold mb-3">
                      ${provider.hourlyRate}/hr
                    </h6>

                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`me-1 ${
                            i < provider.rating
                              ? "fas fa-star text-warning"
                              : "far fa-star text-muted"
                          }`}
                        ></i>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <button
                        className="btn btn-outline-primary rounded-pill px-4"
                        onClick={() =>
                          navigate(`/providerProfile/${provider.providerId}`)
                        }
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;