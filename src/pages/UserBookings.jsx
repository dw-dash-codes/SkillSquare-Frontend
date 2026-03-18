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

  if (loading) {
    return <div className="text-center mt-5">Loading your bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>No bookings found</h3>
        <p>You haven’t made any bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-main-content mt-5">
      <div className="container">
        <h1 className="mb-page-title">
          <i className="fas fa-calendar-alt me-3"></i>My Bookings
        </h1>
        <p className="mb-page-subtitle">
          Manage and track all your service bookings
        </p>

        <div id="bookingsList">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`mb-booking-card`}
              data-status={booking.status.toLowerCase()}
            >
              <div className="mb-booking-header">
                <div>
                  <div className="mb-booking-id">
                    <i className="fas fa-hashtag"></i> {booking.id}
                  </div>
                  <h3 className="mb-booking-service">{booking.providerName}</h3>
                  <div className="mb-booking-date">
                    <i className="fas fa-calendar"></i>{" "}
                    {new Date(booking.createdAt).toLocaleString()}
                  </div>
                </div>
                <span
                  className={`mb-status-badge ${
                    booking.status === "Confirmed"
                      ? "mb-status-confirmed"
                      : booking.status === "Pending"
                      ? "mb-status-pending"
                      : booking.status === "Completed"
                      ? "mb-status-completed"
                      : "mb-status-cancelled"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="mb-technician-info">
                <div className="mb-tech-details">
                  <h5>Work Details</h5>
                  <div className="mb-tech-role">{booking.description}</div>
                </div>
              </div>

              <div className="mb-booking-details">
                <div className="mb-detail-item">
                  <div className="mb-detail-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="mb-detail-content">
                    <h6>Location</h6>
                    <p>{booking.customerAddress}</p>
                  </div>
                </div>

                <div className="mb-detail-item">
                  <div className="mb-detail-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="mb-detail-content">
                    <h6>Phone</h6>
                    <p>{booking.customerPhone}</p>
                  </div>
                </div>

                <div className="mb-detail-item">
                  <div className="mb-detail-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="mb-detail-content">
                    <h6>Scheduled For</h6>
                    <p>
                      {new Date(booking.bookingDate).toLocaleDateString()} at{" "}
                      {booking.bookingTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="mb-booking-actions">
                {booking.status === "Pending" && (
                  <button className="mb-btn-action mb-btn-cancel">
                    <i className="fas fa-times me-2"></i>Cancel Booking
                  </button>
                )}
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
