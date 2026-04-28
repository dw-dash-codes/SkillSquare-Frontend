import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getDashboardStats } from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    pendingReviews: 0,
    recentProviders: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-page bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ margin: '-2rem', padding: '2rem' }}>
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading Admin Data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page bg-light min-vh-100" style={{ margin: '-2rem', padding: '2rem' }}>
      
      {/* Page Header */}
      <div className="mb-5">
        <span className="badge rounded-pill px-3 py-1 mb-3 fw-bold font-body text-uppercase" style={{ background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
          Overview
        </span>
        <h1 className="font-display fw-bold text-dark display-6 mb-2">Admin Dashboard</h1>
        <p className="text-secondary font-body mb-0">
          Monitor platform activity, users, providers, bookings, and reviews.
        </p>
      </div>

      {/* Stat Cards Row */}
      <div className="row g-4 mb-5">
        
        <div className="col-md-6 col-xl-3">
          <div className="card app-card border rounded-4 shadow-sm h-100 bg-white" style={{ borderColor: '#cbd5e1', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body p-4 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-primary" style={{ width: '50px', height: '50px', background: 'rgba(13, 110, 253, 0.1)', fontSize: '1.2rem' }}>
                  <i className="fas fa-users"></i>
                </div>
                <h2 className="font-display fw-bold mb-0 text-dark">{stats.totalUsers}</h2>
              </div>
              <h6 className="font-body fw-bold text-dark mb-3">Active Customers</h6>
              <div className="mt-auto pt-3 border-top">
                <NavLink to="/admin/getAllUsers" className="text-decoration-none fw-bold font-body d-flex align-items-center text-secondary hover-primary">
                  Manage Users <i className="fas fa-arrow-right ms-auto small"></i>
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card app-card border rounded-4 shadow-sm h-100 bg-white" style={{ borderColor: '#cbd5e1', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body p-4 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-warm" style={{ width: '50px', height: '50px', background: 'var(--gradient-warm)', fontSize: '1.2rem' }}>
                  <i className="fas fa-user-tie"></i>
                </div>
                <h2 className="font-display fw-bold mb-0 text-dark">{stats.totalProviders}</h2>
              </div>
              <h6 className="font-body fw-bold text-dark mb-3">Service Providers</h6>
              <div className="mt-auto pt-3 border-top">
                <NavLink to="/admin/getAllProviders" className="text-decoration-none fw-bold font-body d-flex align-items-center text-secondary hover-primary">
                  Manage Providers <i className="fas fa-arrow-right ms-auto small"></i>
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card app-card border rounded-4 shadow-sm h-100 bg-white" style={{ borderColor: '#cbd5e1', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body p-4 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-success" style={{ width: '50px', height: '50px', background: 'rgba(25, 135, 84, 0.1)', fontSize: '1.2rem' }}>
                  <i className="fas fa-calendar-check"></i>
                </div>
                <h2 className="font-display fw-bold mb-0 text-dark">{stats.totalBookings}</h2>
              </div>
              <h6 className="font-body fw-bold text-dark mb-3">Total Bookings</h6>
              <div className="mt-auto pt-3 border-top">
                <NavLink to="/admin/getAllBookings" className="text-decoration-none fw-bold font-body d-flex align-items-center text-secondary hover-primary">
                  View Bookings <i className="fas fa-arrow-right ms-auto small"></i>
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card app-card border rounded-4 shadow-sm h-100 bg-white" style={{ borderColor: '#cbd5e1', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body p-4 d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-warning" style={{ width: '50px', height: '50px', background: 'rgba(255, 193, 7, 0.1)', fontSize: '1.2rem' }}>
                  <i className="fas fa-star"></i>
                </div>
                <h2 className="font-display fw-bold mb-0 text-dark">{stats.pendingReviews}</h2>
              </div>
              <h6 className="font-body fw-bold text-dark mb-3">Total Reviews</h6>
              <div className="mt-auto pt-3 border-top">
                <NavLink to="/admin/getAllReviews" className="text-decoration-none fw-bold font-body d-flex align-items-center text-secondary hover-primary">
                  Moderate Reviews <i className="fas fa-arrow-right ms-auto small"></i>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Providers Table/List */}
      <div className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
        
        <div className="card-header bg-white border-bottom p-4">
          <h4 className="font-display fw-bold text-dark mb-1">Recently Joined Providers</h4>
          <p className="text-secondary font-body mb-0 small">
            New provider accounts added to the platform.
          </p>
        </div>

        <div className="card-body p-0">
          {stats.recentProviders.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3" style={{ fontSize: '3rem', color: '#e2e8f0' }}>
                <i className="fas fa-user-slash"></i>
              </div>
              <h5 className="font-display fw-bold text-dark mb-2">No providers found</h5>
              <p className="text-secondary font-body mb-0">Recently joined providers will appear here.</p>
            </div>
          ) : (
            <div className="list-group list-group-flush font-body">
              {stats.recentProviders.map((provider) => (
                <div key={provider.id} className="list-group-item d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '45px', height: '45px', background: 'var(--gradient-warm)', fontSize: '1.1rem' }}>
                      {provider.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold text-dark">{provider.fullName}</h6>
                      <p className="text-secondary mb-0 small">
                        <i className="fas fa-map-marker-alt me-1 text-primary" style={{ opacity: 0.7 }}></i> {provider.city || 'Location N/A'}
                        {provider.hourlyRate ? <span className="ms-2"><i className="fas fa-dollar-sign me-1 text-success" style={{ opacity: 0.7 }}></i>{provider.hourlyRate}/hr</span> : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-md-end">
                    <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-medium shadow-sm">
                      {provider.categoryName}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-footer bg-light border-top text-center p-3">
          <NavLink to="/admin/getAllProviders" className="btn btn-outline-dark rounded-pill px-4 fw-bold font-body small">
            View All Providers
          </NavLink>
        </div>
      </div>

    </section>
  );
};

export default Dashboard;