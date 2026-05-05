import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom"; // Link import add kiya hai

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2 font-body fw-bold">Confirmed</span>;
      case "Pending":
        return <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 font-body fw-bold">Pending</span>;
      case "Completed":
        return <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 font-body fw-bold">Completed</span>;
      default:
        return <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 font-body fw-bold">{status}</span>;
    }
  };

  return (
    <section className="app-section bg-light min-vh-100 " style={{ paddingTop: '110px' }}>
      <div className="container">
        
        <div className="mx-auto" >
          
          <div className="mb-5">
            <Link to="/" className="text-decoration-none text-secondary font-body small hover-primary mb-3 d-inline-block">
              <i className="fas fa-arrow-left me-2"></i> Back to Home
            </Link>
            <h1 className="font-display fw-bold text-dark mb-2">
              <i className="" style={{ color: 'var(--app-primary)' }}></i>
              My Bookings
            </h1>
            <p className="text-secondary font-body mb-0">
              Manage and track all your booked services in one place.
            </p>
          </div>

          {/* Bookings Content */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="mb-0 text-secondary font-body">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="card app-card border-0 text-center p-5 rounded-4 shadow-sm bg-white">
              <div className="mb-4" style={{ fontSize: '3rem', color: 'var(--app-primary)', opacity: '0.5' }}>
                <i className="fas fa-calendar-times"></i>
              </div>
              <h4 className="font-display fw-bold mb-2">Nothing here yet</h4>
              <p className="text-secondary font-body mb-0">
                Once you book a service, it will appear here for tracking and updates.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="card app-card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
                  <div className="card-body p-4 p-lg-5">
                    
                    {/* Header Row */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
                      <div>
                        <h3 className="font-display fw-bold text-dark mb-1">
                          {booking.providerName}
                        </h3>
                        <div className="text-secondary font-body small">
                          <i className="fas fa-hashtag me-1"></i> ID: {booking.id} • <i className="fas fa-clock ms-2 me-1"></i> Created {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    {/* Description Box */}
                    {booking.description && (
                      <div className="p-3 rounded-3 mb-4 font-body" style={{ background: 'var(--app-surface-muted)', border: '1px solid var(--app-border)' }}>
                        <h6 className="fw-bold text-dark small mb-2">Work Details</h6>
                        <p className="text-secondary mb-0 small" style={{ lineHeight: '1.6' }}>
                          {booking.description}
                        </p>
                      </div>
                    )}

                    {/* Details Grid */}
                    <div className="row g-3 font-body">
                      <div className="col-md-4">
                        <div className="d-flex align-items-start gap-3 p-3 rounded-3 h-100" style={{ border: '1px solid var(--app-border)' }}>
                          <div className="text-primary mt-1"><i className="fas fa-map-marker-alt"></i></div>
                          <div>
                            <div className="fw-bold text-dark small mb-1">Location</div>
                            <div className="text-secondary small">{booking.customerAddress || "N/A"}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex align-items-start gap-3 p-3 rounded-3 h-100" style={{ border: '1px solid var(--app-border)' }}>
                          <div className="text-primary mt-1"><i className="fas fa-phone"></i></div>
                          <div>
                            <div className="fw-bold text-dark small mb-1">Phone</div>
                            <div className="text-secondary small">{booking.customerPhone || "N/A"}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex align-items-start gap-3 p-3 rounded-3 h-100" style={{ border: '1px solid var(--app-border)' }}>
                          <div className="text-primary mt-1"><i className="fas fa-calendar-check"></i></div>
                          <div>
                            <div className="fw-bold text-dark small mb-1">Scheduled For</div>
                            <div className="text-secondary small">
                              {new Date(booking.bookingDate).toLocaleDateString()} <br/>
                              at {booking.bookingTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserBookings;