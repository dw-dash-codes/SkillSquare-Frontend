import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ModalAlert from "../../components/ModalAlert";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get("/Booking/provider/myBookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      if (status === "Completed") {
        await api.put(`/Booking/${id}/complete`);
      } else {
        await api.put(`/Booking/${id}/status?status=${status}`);
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Status Updated",
        message: `The booking has been successfully marked as ${status}.`,
        actions: [{ label: "OK" }],
      });
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);

      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: "Failed to update the booking status. Please try again.",
        actions: [{ label: "Close" }],
      });
    }
  };

  const getFilteredBookings = () => {
    if (activeFilter === "All") return bookings;
    return bookings.filter((b) => b.status === activeFilter);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "booking-status-completed";
      case "Pending":
        return "booking-status-pending";
      case "Accepted":
        return "booking-status-confirmed";
      case "Rejected":
        return "booking-status-cancelled";
      default:
        return "booking-status-cancelled";
    }
  };

  const filters = ["All", "Pending", "Accepted", "Completed", "Rejected"];

  if (loading) {
    return (
      <>
        {modalConfig.isOpen && (
          <ModalAlert
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            actions={modalConfig.actions}
            onClose={closeModal}
          />
        )}

        <section className="provider-page">
          <div className="card app-card border-0 text-center p-4 p-md-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="mb-0 text-secondary">Loading bookings...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {modalConfig.isOpen && (
        <ModalAlert
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          actions={modalConfig.actions}
          onClose={closeModal}
        />
      )}

      <section className="provider-page">
        <div className="provider-page-header mb-4">
          <div>
            <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-2">
              Provider Panel
            </span>
            <h1 className="provider-page-title mb-2">My Bookings</h1>
            <p className="text-secondary mb-0">
              Review, manage, and update your incoming booking requests.
            </p>
          </div>
        </div>

        <div className="card app-card border-0 provider-booking-filter-card mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="d-flex flex-wrap gap-2">
              {filters.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`provider-filter-pill ${
                    activeFilter === status ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {getFilteredBookings().length === 0 ? (
          <div className="card app-card border-0 text-center p-4 p-md-5">
            <div className="search-empty-icon mb-3">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h4 className="fw-semibold mb-2">No bookings found</h4>
            <p className="text-secondary mb-0">
              There are no bookings in this filter right now.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {getFilteredBookings().map((booking) => (
              <div key={booking.id} className="card app-card border-0 provider-booking-card-v2">
                <div className="card-body p-4 p-lg-5">
                  <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-4">
                    <div>
                      <h3 className="h5 fw-semibold mb-2">Booking #{booking.id}</h3>
                      <p className="text-secondary mb-0">
                        <i className="fas fa-calendar me-2"></i>
                        {formatDate(booking.bookingDate)} at {booking.bookingTime}
                      </p>
                    </div>

                    <span className={`booking-status-badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="booking-detail-card h-100">
                        <div className="booking-detail-icon">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-1">Customer Name</h6>
                          <p className="text-secondary mb-0">{booking.customerName}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="booking-detail-card h-100">
                        <div className="booking-detail-icon">
                          <i className="fas fa-phone"></i>
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-1">Phone Number</h6>
                          <p className="text-secondary mb-0">{booking.customerPhone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="booking-detail-card h-100">
                        <div className="booking-detail-icon">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-1">Address</h6>
                          <p className="text-secondary mb-0">{booking.customerAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="booking-work-box mb-4">
                    <h6 className="fw-semibold mb-2">Description</h6>
                    <p className="text-secondary mb-0">
                      {booking.description || "No description provided."}
                    </p>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {booking.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-success rounded-pill px-4"
                          onClick={() => updateStatus(booking.id, "Accepted")}
                        >
                          <i className="fas fa-check me-2"></i>
                          Accept
                        </button>
                        <button
                          className="btn btn-outline-danger rounded-pill px-4"
                          onClick={() => updateStatus(booking.id, "Rejected")}
                        >
                          <i className="fas fa-times me-2"></i>
                          Reject
                        </button>
                      </>
                    )}

                    {booking.status === "Accepted" && (
                      <button
                        className="btn btn-primary rounded-pill px-4"
                        onClick={() => updateStatus(booking.id, "Completed")}
                      >
                        <i className="fas fa-check-double me-2"></i>
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default MyBookings;