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

      // Har provider ke liye rating fetch karna
      const providersWithRatings = await Promise.all(
        providers.map(async (p) => {
          try {
            const ratingRes = await api.get(`/Review/average/${p.providerId}`);
            return {
              ...p,
              rating: ratingRes.data.averageRating, // backend se aane wala field
            };
          } catch (error) {
            console.error(
              `Error fetching rating for provider ${p.providerId}`,
              error
            );
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
      // User ko Search Results page par redirect karo query k sath
      navigate(`/search-results?query=${searchTerm}`);
    }
  };

  // Enter key press support
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <section className="hero-section" style={{ paddingTop: "120px" }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="hero-title">Find Local and Trusted Technicians</h1>
              <p className="hero-subtitle">
                Search for electricians, plumbers, house cleaners, and more.
              </p>

              <div className="search-wrap-container">
                <div className="search-container ">
                  <div className="input-group">
                    {/* 👇 INPUT FIELD */}
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search for services (e.g. Plumber)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    {/* 👇 BUTTON */}
                    <button
                      className="btn btn-primary search-btn"
                      type="button"
                      onClick={handleSearch}
                    >
                      <i className="fas fa-search me-2"></i>Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="service-categories" id="services">
        <div className="container">
          <h2 className="section-title">Service Categories</h2>
          <div className="row">
            {categories.slice(0, 6).map((category) => (
              <div className="col-lg-4 col-md-6 mb-4" key={category.id}>
                <div
                  className="category-card text-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="category-icon">
                    <i className={category.iconClass}></i>
                  </div>
                  <h3 className="category-title">{category.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center">
          <Link
            to="/categories"
            className="btn rounded-pill"
            style={{
              background: "linear-gradient(135deg, #ff6b6b, #ff8e8e)",
              border: "none",
              padding: "10px 25px",
              fontWeight: 600,
              borderRadius: "25px",
              boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            See More Services
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Featured Technicians</h2>
          <div className="row">
            {featuredProviders.map((provider) => (
              <div key={provider.providerId} className="col-lg-4 col-md-6">
                <div className="technician-card text-center">
                  <div className="technician-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <h3 className="technician-name">{provider.name}</h3>
                  <h5>{provider.categoryName}</h5>
                  <p className="technician-rate">${provider.hourlyRate}/hr</p>

                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={
                          i < provider.rating
                            ? "fas fa-star text-warning"
                            : "far fa-star text-muted"
                        }
                      ></i>
                    ))}
                  </div>

                  <button
                    className="btn btn-primary mt-2"
                    onClick={() =>
                      navigate(`/providerProfile/${provider.providerId}`)
                    }
                  >
                    View Profile
                  </button>
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
