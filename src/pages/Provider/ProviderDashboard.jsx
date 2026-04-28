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
    <section className="provider-dashboard-page bg-light min-vh-100" style={{ margin: '-2rem', padding: '2rem' }}>
      {/* Page Header */}
      <div className="mb-5">
        <span className="badge rounded-pill px-3 py-1 mb-3 fw-medium" style={{ background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
          Overview
        </span>
        <h1 className="font-display fw-bold text-dark mb-2">Provider Dashboard</h1>
        <p className="text-secondary font-body mb-0">
          Track your bookings, completed jobs, and reviews from one place.
        </p>
      </div>

      {loading ? (
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stat Cards Row - Added Borders to make them look like distinct cards */}
          <div className="row g-4 mb-5">
            
            {/* Upcoming Bookings Card */}
            <div className="col-md-6 col-xl-4">
              <div 
                className="card app-card border rounded-4 shadow-sm h-100 bg-white" 
                style={{ borderColor: '#d1d5db', transition: 'all 0.3s ease' }} 
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = 'var(--app-primary)'; }} 
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#d1d5db'; }}
              >
                <div className="card-body p-4 p-lg-5 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="rounded-3 d-flex align-items-center justify-content-center text-white shadow-warm" style={{ width: '56px', height: '56px', background: 'var(--gradient-warm)', fontSize: '1.5rem' }}>
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <h2 className="font-display fw-bold mb-0 text-dark display-6">{upcomingCount}</h2>
                  </div>
                  <h5 className="font-body fw-bold text-dark mb-3">Upcoming Bookings</h5>
                  <div className="mt-auto pt-3 border-top">
                    <NavLink to="/provider/my-bookings" className="text-decoration-none fw-bold font-body d-flex align-items-center hover-primary" style={{ color: 'var(--app-primary)' }}>
                      Manage <i className="fas fa-arrow-right ms-2 small"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Completed Jobs Card */}
            <div className="col-md-6 col-xl-4">
              <div 
                className="card app-card border rounded-4 shadow-sm h-100 bg-white" 
                style={{ borderColor: '#d1d5db', transition: 'all 0.3s ease' }} 
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#198754'; }} 
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#d1d5db'; }}
              >
                <div className="card-body p-4 p-lg-5 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="rounded-3 d-flex align-items-center justify-content-center text-success" style={{ width: '56px', height: '56px', background: 'rgba(25, 135, 84, 0.1)', fontSize: '1.5rem' }}>
                      <i className="fas fa-clipboard-check"></i>
                    </div>
                    <h2 className="font-display fw-bold mb-0 text-dark display-6">{completedCount}</h2>
                  </div>
                  <h5 className="font-body fw-bold text-dark mb-3">Completed Jobs</h5>
                  <div className="mt-auto pt-3 border-top">
                    <NavLink to="/provider/my-bookings" className="text-decoration-none fw-bold font-body d-flex align-items-center text-secondary hover-primary">
                      View History <i className="fas fa-arrow-right ms-2 small"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Reviews Card */}
            <div className="col-md-6 col-xl-4">
              <div 
                className="card app-card border rounded-4 shadow-sm h-100 bg-white" 
                style={{ borderColor: '#d1d5db', transition: 'all 0.3s ease' }} 
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#ffc107'; }} 
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#d1d5db'; }}
              >
                <div className="card-body p-4 p-lg-5 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="rounded-3 d-flex align-items-center justify-content-center text-warning" style={{ width: '56px', height: '56px', background: 'rgba(255, 193, 7, 0.1)', fontSize: '1.5rem' }}>
                      <i className="fas fa-star"></i>
                    </div>
                    <h2 className="font-display fw-bold mb-0 text-dark display-6">{reviewCount}</h2>
                  </div>
                  <h5 className="font-body fw-bold text-dark mb-3">Total Reviews</h5>
                  <div className="mt-auto pt-3 border-top">
                    <NavLink to="/provider/my-reviews" className="text-decoration-none fw-bold font-body d-flex align-items-center text-secondary hover-primary">
                      View Reviews <i className="fas fa-arrow-right ms-2 small"></i>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Next Bookings Section - Added prominent border to the main container */}
          <div className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
            <div className="card-body p-4 p-lg-5">
              
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 border-bottom pb-4">
                <div>
                  <h3 className="font-display fw-bold text-dark mb-1">Next Bookings</h3>
                  <p className="text-secondary font-body mb-0 small">
                    Your nearest upcoming customer appointments.
                  </p>
                </div>
                <NavLink to="/provider/my-bookings" className="btn btn-outline-dark rounded-pill px-4 fw-bold font-body">
                  View All
                </NavLink>
              </div>

              {nextBookings.length === 0 ? (
                <div className="text-center py-5 rounded-4 border" style={{ background: 'var(--app-surface-muted)', borderColor: '#e2e8f0' }}>
                  <div className="mb-3" style={{ fontSize: '2.5rem', color: 'var(--app-primary)', opacity: '0.5' }}>
                    <i className="fas fa-calendar-times"></i>
                  </div>
                  <h5 className="font-display fw-bold mb-2">No upcoming bookings</h5>
                  <p className="text-secondary font-body mb-0">
                    Your future bookings will appear here.
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3 font-body">
                  {nextBookings.map((b) => (
                    /* Individual Booking Row with its own border */
                    <div key={b.id} className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 p-4 rounded-4" style={{ border: '1px solid #e2e8f0', background: 'var(--app-surface-muted)' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-white border shadow-sm" style={{ width: '48px', height: '48px', color: 'var(--app-primary)', borderColor: '#cbd5e1' }}>
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark mb-1">{b.customerName}</div>
                          <div className="text-secondary small">
                            <i className="far fa-calendar-alt me-1"></i>
                            {new Date(b.bookingDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 fw-bold">
                        <i className="fas fa-circle me-2" style={{ fontSize: '0.5rem', verticalAlign: 'middle' }}></i>
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