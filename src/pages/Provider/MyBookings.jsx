import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ModalAlert from "../../components/ModalAlert"; // 👈 Import the ModalAlert

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  // 👈 Modal State Added Here
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

  // Modal Close Handler
  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // 📥 Fetch Bookings from API
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

  // 🔄 Update Status (Accept/Reject/Complete)
  const updateStatus = async (id, status) => {
    try {
      if (status === "Completed") {
        await api.put(`/Booking/${id}/complete`);
      } else {
        await api.put(`/Booking/${id}/status?status=${status}`);
      }

      // Update UI immediately without refresh
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: status } : b))
      );
      
      // 👈 Success Modal instead of alert()
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Status Updated",
        message: `The booking has been successfully marked as ${status}.`,
        actions: [{ label: "OK" }],
      });

    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
      
      // 👈 Error Modal instead of alert()
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: "Failed to update the booking status. Please try again.",
        actions: [{ label: "Close" }],
      });
    }
  };

  // 🔍 Filter Logic
  const getFilteredBookings = () => {
    if (activeFilter === "All") return bookings;
    return bookings.filter((b) => b.status === activeFilter);
  };

  // 📅 Date Helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 🎨 Status Badge Helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "status-completed";
      case "Pending":
        return "status-pending";
      case "Accepted":
        return "badge bg-info"; // Custom class for Accepted
      case "Rejected":
        return "badge bg-danger"; // Custom class for Rejected
      default:
        return "badge bg-secondary";
    }
  };

  if (loading) return <div className="p-4">Loading bookings...</div>;

  return (
    <>
      {/* 👈 Render Modal Alert conditionally */}
      {modalConfig.isOpen && (
        <ModalAlert
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          actions={modalConfig.actions}
          onClose={closeModal}
        />
      )}

      <div className="">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">
                  <i className="fas fa-calendar-check mr-2"></i>My Bookings
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            {/* Filter Section */}
            <div className="filter-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <i className="fas fa-filter mr-2"></i>Filter Bookings
                </h5>
              </div>

              <div className="filter-tabs">
                {["All", "Pending", "Accepted", "Completed", "Rejected"].map(
                  (status) => (
                    <div
                      key={status}
                      className={`filter-tab ${
                        activeFilter === status ? "active" : ""
                      }`}
                      onClick={() => setActiveFilter(status)}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`fas ${
                          status === "All"
                            ? "fa-list"
                            : status === "Completed"
                            ? "fa-check-circle"
                            : "fa-hourglass-half"
                        } mr-2`}
                      ></i>
                      {status}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Bookings Container */}
            <div id="provider-bookingsContainer">
              {getFilteredBookings().length === 0 ? (
                <p className="text-center mt-4">
                  No bookings found in this category.
                </p>
              ) : (
                getFilteredBookings().map((booking) => (
                  <div key={booking.id} className="provider-booking-card">
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">Booking #{booking.id}</h5>
                          <small className="text-muted">
                            <i className="fas fa-calendar mr-1"></i>
                            {formatDate(booking.bookingDate)} at{" "}
                            {booking.bookingTime}
                          </small>
                        </div>
                        <span
                          className={`status-badge ${getStatusBadgeClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="provider-booking-info-grid">
                        <div className="info-item">
                          <span className="info-label">Customer Name</span>
                          <span className="info-value">
                            <i className="fas fa-user mr-2 text-primary"></i>
                            {booking.customerName}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Phone Number</span>
                          <span className="info-value">
                            <i className="fas fa-phone mr-2 text-success"></i>
                            {booking.customerPhone}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Address</span>
                          <span className="info-value">
                            <i className="fas fa-map-marker-alt mr-2 text-danger"></i>
                            {booking.customerAddress}
                          </span>
                        </div>
                      </div>

                      <div className="info-item mb-0 mt-3">
                        <span className="info-label">Description</span>
                        <span className="info-value">
                          {booking.description || "No description provided."}
                        </span>
                      </div>

                      <div className="provider-booking-actions mt-3">
                        {/* 1. If Pending: Show Accept & Reject */}
                        {booking.status === "Pending" && (
                          <>
                            <button
                              className="btn btn-success mr-2"
                              onClick={() =>
                                updateStatus(booking.id, "Accepted")
                              }
                            >
                              <i className="fas fa-check mr-2"></i>Accept
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                updateStatus(booking.id, "Rejected")
                              }
                            >
                              <i className="fas fa-times mr-2"></i>Reject
                            </button>
                          </>
                        )}

                        {/* 2. If Accepted: Show Complete */}
                        {booking.status === "Accepted" && (
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              updateStatus(booking.id, "Completed")
                            }
                          >
                            <i className="fas fa-check-double mr-2"></i>Mark
                            Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyBookings;