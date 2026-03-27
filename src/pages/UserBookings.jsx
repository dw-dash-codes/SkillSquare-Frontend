import React, { useEffect, useState } from "react";
import api from "../services/api";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/Booking/user/myBookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "booking-status-confirmed";
      case "Pending":
        return "booking-status-pending";
      case "Completed":
        return "booking-status-completed";
      default:
        return "booking-status-cancelled";
    }
  };

  if (loading) {
    return (
      <section className="app-section app-section-hero user-bookings-page">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="mb-0 text-secondary">Loading your bookings...</p>
        </div>
      </section>
    );
  }

  if (bookings.length === 0) {
    return (
      <section className="app-section app-section-hero user-bookings-page">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
              My Bookings
            </span>
            <h1 className="app-section-title mb-3">No bookings found</h1>
            <p className="text-secondary mb-0">
              You haven’t made any bookings yet.
            </p>
          </div>

          <div className="card app-card border-0 text-center p-4 p-md-5 search-empty-card">
            <div className="search-empty-icon mb-3">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h4 className="fw-semibold mb-2">Nothing here yet</h4>
            <p className="text-secondary mb-0">
              Once you book a service, it will appear here for tracking and updates.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="app-section app-section-hero user-bookings-page">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
            My Bookings
          </span>

          <h1 className="app-section-title mb-3">
            <i className="fas fa-calendar-alt me-3"></i>
            My Bookings
          </h1>

          <p className="text-secondary mb-0 user-bookings-subtitle mx-auto">
            Manage and track all your booked services in one place.
          </p>
        </div>

        <div className="d-flex flex-column gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="card app-card border-0 booking-history-card"
              data-status={booking.status.toLowerCase()}
            >
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
                  <div>
                    <div className="text-secondary small mb-2">
                      <i className="fas fa-hashtag me-2"></i>
                      Booking ID: {booking.id}
                    </div>

                    <h3 className="h4 fw-semibold mb-2">{booking.providerName}</h3>

                    <div className="text-secondary">
                      <i className="fas fa-calendar me-2"></i>
                      Created on {new Date(booking.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <span className={`booking-status-badge ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-work-box mb-4">
                  <h6 className="fw-semibold mb-2">Work Details</h6>
                  <p className="text-secondary mb-0">
                    {booking.description || "No description provided."}
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="booking-detail-card h-100">
                      <div className="booking-detail-icon">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Location</h6>
                        <p className="text-secondary mb-0">
                          {booking.customerAddress || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="booking-detail-card h-100">
                      <div className="booking-detail-icon">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Phone</h6>
                        <p className="text-secondary mb-0">
                          {booking.customerPhone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="booking-detail-card h-100">
                      <div className="booking-detail-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Scheduled For</h6>
                        <p className="text-secondary mb-0">
                          {new Date(booking.bookingDate).toLocaleDateString()} at{" "}
                          {booking.bookingTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 
                <div className="mt-4 pt-3 border-top">
                  {booking.status === "Pending" && (
                    <button className="btn btn-outline-danger rounded-pill px-4">
                      <i className="fas fa-times me-2"></i>
                      Cancel Booking
                    </button>
                  )}
                </div> 
                */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserBookings;