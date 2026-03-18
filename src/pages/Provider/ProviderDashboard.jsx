import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";

const ProviderDashboard = () => {
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [nextBookings, setNextBookings] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // 🔐 Decode token
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const providerId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      // 📦 Provider bookings
      const bookingsRes = await api.get("/Booking/provider/myBookings");
      const bookings = bookingsRes.data;

      const completed = bookings.filter((b) => b.status === "Completed");
      const upcoming = bookings.filter((b) => b.status !== "Completed");

      setCompletedCount(completed.length);
      setUpcomingCount(upcoming.length);

      // ⏭ Next 3 bookings
      const next = upcoming
        .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
        .slice(0, 3);

      setNextBookings(next);

      // ⭐ Reviews
      const reviewsRes = await api.get(`/Review/provider/${providerId}`);
      setReviewCount(reviewsRes.data.length);
    } catch (error) {
      console.error("Dashboard load failed", error);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="content-header">
        <div className="container-fluid">
          <h1 className="m-0">Provider Dashboard</h1>
        </div>
      </div>

      {/* Content */}
      <div className="content">
        <div className="container-fluid">
          {/* Stats */}
          <div className="row">
            <div className="col-lg-4 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{upcomingCount}</h3>
                  <p>Upcoming Bookings</p>
                </div>
                <div className="icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <NavLink
                  to="/provider/my-bookings"
                  className="small-box-footer"
                >
                  Manage <i className="fas fa-arrow-circle-right"></i>
                </NavLink>
              </div>
            </div>

            <div className="col-lg-4 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>{completedCount}</h3>
                  <p>Completed Jobs</p>
                </div>
                <div className="icon">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <NavLink to="/provider-bookings" className="small-box-footer">
                  View History <i className="fas fa-arrow-circle-right"></i>
                </NavLink>
              </div>
            </div>

            <div className="col-lg-4 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>{reviewCount}</h3>
                  <p>Total Reviews</p>
                </div>
                <div className="icon">
                  <i className="fas fa-star"></i>
                </div>
                <NavLink to="/provider/my-reviews" className="small-box-footer">
                  View Reviews <i className="fas fa-arrow-circle-right"></i>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Next bookings */}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Next Bookings</h3>
                </div>
                <div className="card-body">
                  <ul className="list-group">
                    {nextBookings.length === 0 && (
                      <li className="list-group-item text-muted">
                        No upcoming bookings
                      </li>
                    )}

                    {nextBookings.map((b) => (
                      <li key={b.id} className="list-group-item">
                        {new Date(b.bookingDate).toLocaleDateString()} —{" "}
                        {b.customerName}
                        <span className="badge bg-primary float-end">
                          {b.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
