import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const role = localStorage.getItem("role"); // To check if user is logged in for the CTA

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

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?query=${searchTerm}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Helper to get initials for provider avatars
  const getInitials = (name) => {
    if (!name) return "P";
    const parts = name.split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <section className="app-section pt-5 mt-5 min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading amazing professionals...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden" style={{ paddingTop: '160px', paddingBottom: '100px', backgroundColor: '#1a1512' }}>
        {/* Subtle background gradient overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, var(--app-primary) 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f69d3c 0%, transparent 50%)"
        }} />
        
        <div className="container position-relative z-1">
          <div className="row">
            <div className="col-xl-7 col-lg-9">
              <h1 className="display-4 font-display fw-bold text-white mb-4 leading-tight">
                Find skilled pros <br />
                <span style={{ color: 'var(--app-primary)' }}>near you</span>
              </h1>

              <p className="lead font-body text-white-50 mb-5" style={{ maxWidth: '600px' }}>
                Book trusted service providers for plumbing, electrical, house cleaning, and more — verified professionals, one click away.
              </p>

              <form onSubmit={handleSearch} className="d-flex flex-column flex-sm-row gap-3" style={{ maxWidth: '550px' }}>
                <div className="input-group input-group-lg bg-white rounded-pill overflow-hidden shadow-lg flex-grow-1 p-1">
                  <span className="input-group-text bg-transparent border-0 ps-4 pe-2">
                    <i className="fas fa-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none font-body bg-transparent"
                    placeholder="What service do you need?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <button
                  className="btn btn-gradient-warm rounded-pill px-5 font-body fw-bold shadow-warm"
                  type="button"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </form>

              {!role && (
                <div className="mt-5">
                  <Link to="/getstarted" className="btn btn-outline-light rounded-pill px-4 font-body hover-primary transition">
                    Join as Provider <i className="fas fa-arrow-right ms-2"></i>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-4 border-bottom bg-white">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center justify-content-md-between gap-4 font-body text-secondary small fw-medium text-center">
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-shield-alt fs-5" style={{ color: 'var(--app-primary)' }}></i> Verified Providers
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-clock fs-5" style={{ color: 'var(--app-primary)' }}></i> Quick Booking
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-star fs-5" style={{ color: 'var(--app-primary)' }}></i> Rated & Reviewed
            </div>
            <div className="d-flex align-items-center gap-2">
              <i className="fas fa-handshake fs-5" style={{ color: 'var(--app-primary)' }}></i> Trusted Platform
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="app-section bg-light" id="services" style={{ padding: '80px 0' }}>
          <div className="container">
           <div className="d-flex flex-wrap justify-content-between align-items-end mb-5">
            <div>
              <h2 className="font-display fw-bold text-dark mb-2">Browse by category</h2>
              <p className="text-secondary font-body mb-0">Find the right professional for your needs</p>
            </div>
            
            <Link to="/categories" className="btn btn-link text-decoration-none font-body text-dark fw-bold px-0 mt-3 mt-md-0 hover-primary">
              View all <i className="fas fa-arrow-right ms-1 small"></i>
            </Link>
          </div>

            <div className="row g-4">
              {categories.slice(0, 6).map((category) => (
                <div className="col-lg-2 col-md-4 col-6" key={category.id}>
                  <div
                    className="card app-card category-card h-100 border-0 text-center rounded-4 shadow-sm"
                    role="button"
                    onClick={() => handleCategoryClick(category.id)}
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center">
                      <div className="app-icon-circle mx-auto mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem', background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
                        <i className={category.iconClass || "fas fa-tools"}></i>
                      </div>
                      <h6 className="font-body fw-bold mb-0 text-dark category-title">{category.title}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Providers Section */}
      {featuredProviders.length > 0 && (
        <section className="app-section bg-white" style={{ padding: '80px 0' }}>
          <div className="container">
            <div className="d-flex flex-wrap justify-content-between align-items-end mb-5">
              <div>
                <h2 className="font-display fw-bold text-dark mb-2">Featured providers</h2>
                <p className="text-secondary font-body mb-0">Top-rated professionals in your area</p>
              </div>
            </div>

            <div className="row g-4">
              {featuredProviders.map((provider) => (
                <div key={provider.providerId} className="col-lg-4 col-md-6">
                  <div 
                    className="card provider_card h-100 border rounded-4 text-start text-decoration-none d-flex flex-column"
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease', borderColor: 'var(--app-border)' }}
                    onClick={() => navigate(`/providerProfile/${provider.providerId}`)}
                  >
                    <div className="card-body p-4 d-flex flex-column">
                      
                      {/* Top Info: Avatar + Name + Category */}
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div 
                          className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center text-white font-display fw-bold fs-5" 
                          style={{ width: '56px', height: '56px', background: 'var(--gradient-warm)' }}
                        >
                          {getInitials(provider.name)}
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <h5 className="font-display fw-bold mb-1 text-dark text-truncate">{provider.name}</h5>
                          <p className="text-secondary font-body small mb-0 text-truncate">{provider.categoryName || "Service Provider"}</p>
                        </div>
                      </div>

                      {/* Bio / Description (Optional fallback if empty) */}
                      <p className="text-secondary font-body small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {provider.bio || `Professional ${provider.categoryName} providing top-notch services with verified expertise and customer satisfaction.`}
                      </p>

                      {/* Bottom Info: Rating + Price */}
                      <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                        <div className="d-flex align-items-center gap-1">
                          <i className="fas fa-star" style={{ color: 'var(--app-primary)' }}></i>
                          <span className="font-body fw-bold text-dark">{provider.rating ? provider.rating.toFixed(1) : "New"}</span>
                        </div>
                        {provider.hourlyRate > 0 && (
                          <div className="font-body fw-bold" style={{ color: 'var(--app-primary)' }}>
                            ${provider.hourlyRate}/hr
                          </div>
                        )}
                      </div>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA (Only for non-logged in users) */}
      {!role && (
        <section className="py-5 bg-light border-top">
          <div className="container text-center py-4">
            <h2 className="font-display fw-bold text-dark mb-3">Ready to get started?</h2>
            <p className="text-secondary font-body mb-4 max-w-md mx-auto">
              Join thousands of customers finding skilled professionals every day.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/getstarted" className="btn btn-gradient-warm rounded-pill px-5 py-2 font-body fw-bold shadow-warm">
                Create Account
              </Link>
              <Link to="/categories" className="btn btn-outline-dark rounded-pill px-5 py-2 font-body fw-bold">
                Browse Services
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Home;