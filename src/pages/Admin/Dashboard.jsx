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
      <section className="admin-page">
        <div className="card app-card border-0 text-center p-4 p-md-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mb-0 text-secondary">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-page-header mb-4">
        <div>
          <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-2">
            Admin Panel
          </span>
          <h1 className="admin-page-title mb-2">Admin Dashboard</h1>
          <p className="text-secondary mb-0">
            Monitor platform activity, users, providers, bookings, and reviews.
          </p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card app-card border-0 admin-stat-card h-100">
            <div className="card-body p-4">
              <div className="admin-stat-top">
                <div className="admin-stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="admin-stat-number">{stats.totalUsers}</div>
              </div>

              <h3 className="admin-stat-label">Active Customers</h3>

              <NavLink to="/admin/getAllUsers" className="admin-stat-link">
                Manage Users
                <i className="fas fa-arrow-right ms-2"></i>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card app-card border-0 admin-stat-card h-100">
            <div className="card-body p-4">
              <div className="admin-stat-top">
                <div className="admin-stat-icon">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div className="admin-stat-number">{stats.totalProviders}</div>
              </div>

              <h3 className="admin-stat-label">Service Providers</h3>

              <NavLink to="/admin/getAllProviders" className="admin-stat-link">
                Manage Providers
                <i className="fas fa-arrow-right ms-2"></i>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card app-card border-0 admin-stat-card h-100">
            <div className="card-body p-4">
              <div className="admin-stat-top">
                <div className="admin-stat-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="admin-stat-number">{stats.totalBookings}</div>
              </div>

              <h3 className="admin-stat-label">Total Bookings</h3>

              <NavLink to="/admin/getAllBookings" className="admin-stat-link">
                View Bookings
                <i className="fas fa-arrow-right ms-2"></i>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card app-card border-0 admin-stat-card h-100">
            <div className="card-body p-4">
              <div className="admin-stat-top">
                <div className="admin-stat-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="admin-stat-number">{stats.pendingReviews}</div>
              </div>

              <h3 className="admin-stat-label">Total Reviews</h3>

              <NavLink to="/admin/getAllReviews" className="admin-stat-link">
                Moderate Reviews
                <i className="fas fa-arrow-right ms-2"></i>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="card app-card border-0 admin-list-card">
        <div className="card-body p-0">
          <div className="p-4 pb-3">
            <h2 className="h5 fw-semibold mb-1">Recently Joined Providers</h2>
            <p className="text-secondary mb-0">
              New provider accounts added to the platform.
            </p>
          </div>

          {stats.recentProviders.length === 0 ? (
            <div className="text-center p-4 p-md-5">
              <div className="search-empty-icon mb-3">
                <i className="fas fa-user-slash"></i>
              </div>
              <h5 className="fw-semibold mb-2">No providers found</h5>
              <p className="text-secondary mb-0">
                Recently joined providers will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-provider-list">
              {stats.recentProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="admin-provider-list-item"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="admin-provider-avatar">
                      {provider.fullName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h6 className="mb-1 fw-semibold">{provider.fullName}</h6>
                      <p className="text-secondary mb-0 small">
                        {provider.city}
                        {provider.hourlyRate ? ` • $${provider.hourlyRate}/hr` : ""}
                      </p>
                    </div>
                  </div>

                  <span className="badge rounded-pill text-bg-light border px-3 py-2">
                    {provider.categoryName}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="admin-list-footer text-center border-top p-3">
            <NavLink
              to="/admin/getAllProviders"
              className="btn btn-outline-primary rounded-pill px-4"
            >
              View All Providers
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;