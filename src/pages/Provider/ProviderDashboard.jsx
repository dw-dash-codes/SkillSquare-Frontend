import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

const ProviderDashboard = () => {
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [nextBookings, setNextBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const providerId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      const bookingsRes = await api.get("/Booking/provider/myBookings");
      const bookings = bookingsRes.data;

      const completed = bookings.filter((b) => b.status === "Completed");
      const upcoming = bookings.filter((b) => b.status !== "Completed");

      setCompletedCount(completed.length);
      setUpcomingCount(upcoming.length);

      const next = upcoming
        .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
        .slice(0, 3);

      setNextBookings(next);

      const reviewsRes = await api.get(`/Review/provider/${providerId}`);
      setReviewCount(reviewsRes.data.length);
    } catch (error) {
      console.error("Dashboard load failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="provider-dashboard-page">
      <div className="provider-page-header mb-4">
        <div>
          <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-2">
            Provider Panel
          </span>
          <h1 className="provider-page-title mb-2">Provider Dashboard</h1>
          <p className="text-secondary mb-0">
            Track your bookings, completed jobs, and reviews from one place.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card app-card border-0 text-center p-4 p-md-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="mb-0 text-secondary">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-xl-4">
              <div className="card app-card border-0 provider-stat-card h-100">
                <div className="card-body p-4">
                  <div className="provider-stat-top">
                    <div className="provider-stat-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="provider-stat-number">{upcomingCount}</div>
                  </div>

                  <h3 className="provider-stat-label">Upcoming Bookings</h3>

                  <NavLink
                    to="/provider/my-bookings"
                    className="provider-stat-link"
                  >
                    Manage
                    <i className="fas fa-arrow-right ms-2"></i>
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div className="card app-card border-0 provider-stat-card h-100">
                <div className="card-body p-4">
                  <div className="provider-stat-top">
                    <div className="provider-stat-icon">
                      <i className="fas fa-clipboard-check"></i>
                    </div>
                    <div className="provider-stat-number">{completedCount}</div>
                  </div>

                  <h3 className="provider-stat-label">Completed Jobs</h3>

                  <NavLink
                    to="/provider/my-bookings"
                    className="provider-stat-link"
                  >
                    View History
                    <i className="fas fa-arrow-right ms-2"></i>
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-4">
              <div className="card app-card border-0 provider-stat-card h-100">
                <div className="card-body p-4">
                  <div className="provider-stat-top">
                    <div className="provider-stat-icon">
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="provider-stat-number">{reviewCount}</div>
                  </div>

                  <h3 className="provider-stat-label">Total Reviews</h3>

                  <NavLink
                    to="/provider/my-reviews"
                    className="provider-stat-link"
                  >
                    View Reviews
                    <i className="fas fa-arrow-right ms-2"></i>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          <div className="card app-card border-0 provider-bookings-overview">
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
                <div>
                  <h2 className="h4 fw-semibold mb-1">Next Bookings</h2>
                  <p className="text-secondary mb-0">
                    Your nearest upcoming customer appointments.
                  </p>
                </div>

                <NavLink
                  to="/provider/my-bookings"
                  className="btn btn-outline-primary rounded-pill px-4"
                >
                  View All
                </NavLink>
              </div>

              {nextBookings.length === 0 ? (
                <div className="provider-empty-state text-center py-4">
                  <div className="search-empty-icon mb-3">
                    <i className="fas fa-calendar-times"></i>
                  </div>
                  <h5 className="fw-semibold mb-2">No upcoming bookings</h5>
                  <p className="text-secondary mb-0">
                    Your future bookings will appear here.
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {nextBookings.map((b) => (
                    <div key={b.id} className="provider-booking-row">
                      <div>
                        <div className="fw-semibold">
                          {new Date(b.bookingDate).toLocaleDateString()}
                        </div>
                        <div className="text-secondary">{b.customerName}</div>
                      </div>

                      <span className="booking-status-badge booking-status-pending">
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProviderDashboard;