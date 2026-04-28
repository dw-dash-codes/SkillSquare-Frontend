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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-2 font-body fw-bold"><i className="fas fa-check-double me-1"></i>Completed</span>;
      case "Pending":
        return <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-2 font-body fw-bold"><i className="fas fa-clock me-1"></i>Pending</span>;
      case "Accepted":
        return <span className="badge rounded-pill bg-info-subtle text-info-emphasis border border-info-subtle px-3 py-2 font-body fw-bold"><i className="fas fa-thumbs-up me-1"></i>Accepted</span>;
      case "Rejected":
        return <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 font-body fw-bold"><i className="fas fa-times me-1"></i>Rejected</span>;
      default:
        return <span className="badge rounded-pill bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 font-body fw-bold">{status}</span>;
    }
  };

  const filters = ["All", "Pending", "Accepted", "Completed", "Rejected"];

  if (loading) {
    return (
      <section className="provider-page bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ margin: '-2rem', padding: '2rem' }}>
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading bookings...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {modalConfig.isOpen && (
        <div className="review-alert-layer" style={{ zIndex: 1060 }}>
          <ModalAlert
            type={modalConfig.type}
            title={modalConfig.title}
            message={modalConfig.message}
            actions={modalConfig.actions}
            onClose={closeModal}
          />
        </div>
      )}

      <section className="provider-page bg-light min-vh-100" style={{ margin: '-2rem', padding: '2rem' }}>
        <div className="mb-4">
          <span className="badge rounded-pill px-3 py-1 mb-3 fw-medium" style={{ background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
            Provider Panel
          </span>
          <h1 className="font-display fw-bold text-dark mb-2">My Bookings</h1>
          <p className="text-secondary font-body mb-0">
            Review, manage, and update your incoming booking requests.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-5">
          <div className="d-flex flex-wrap gap-2">
            {filters.map((status) => (
              <button
                key={status}
                type="button"
                className={`btn rounded-pill px-4 py-2 font-body fw-bold ${
                  activeFilter === status 
                    ? "btn-gradient-warm text-white shadow-warm border-0" 
                    : "bg-white text-secondary border shadow-sm hover-primary"
                }`}
                style={{ borderColor: activeFilter !== status ? 'var(--app-border)' : 'transparent' }}
                onClick={() => setActiveFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {getFilteredBookings().length === 0 ? (
          <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
            <div className="mb-3" style={{ fontSize: '3rem', color: 'var(--app-primary)', opacity: '0.5' }}>
              <i className="fas fa-calendar-times"></i>
            </div>
            <h4 className="font-display fw-bold mb-2">No bookings found</h4>
            <p className="text-secondary font-body mb-0">
              There are no bookings in this filter right now.
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {getFilteredBookings().map((booking) => (
              <div key={booking.id} className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
                <div className="card-body p-4 p-lg-5">
                  
                  {/* Header */}
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4 border-bottom pb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center bg-light border shadow-sm" style={{ width: '56px', height: '56px', color: 'var(--app-primary)', fontSize: '1.5rem', borderColor: '#e2e8f0' }}>
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <h3 className="font-display fw-bold text-dark mb-1">{booking.customerName}</h3>
                        <p className="text-secondary font-body small mb-0">
                          Booking #{booking.id} • Created on {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-2 mt-md-0">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="row g-3 mb-4 font-body">
                    <div className="col-md-4">
                      <div className="d-flex align-items-start gap-3 p-3 rounded-3 h-100 bg-light" style={{ border: '1px solid var(--app-border)' }}>
                        <div className="text-primary mt-1"><i className="fas fa-phone"></i></div>
                        <div>
                          <div className="fw-bold text-dark small mb-1">Phone Number</div>
                          <div className="text-secondary small">{booking.customerPhone}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="d-flex align-items-start gap-3 p-3 rounded-3 h-100 bg-light" style={{ border: '1px solid var(--app-border)' }}>
                        <div className="text-primary mt-1"><i className="fas fa-map-marker-alt"></i></div>
                        <div>
                          <div className="fw-bold text-dark small mb-1">Address</div>
                          <div className="text-secondary small">{booking.customerAddress}</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="d-flex align-items-start gap-3 p-3 rounded-3 h-100 bg-light" style={{ border: '1px solid var(--app-border)' }}>
                        <div className="text-primary mt-1"><i className="fas fa-clock"></i></div>
                        <div>
                          <div className="fw-bold text-dark small mb-1">Scheduled For</div>
                          <div className="text-secondary small">
                            {formatDate(booking.bookingDate)} <br/>
                            at {booking.bookingTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="p-4 rounded-4 mb-4 font-body" style={{ background: 'var(--app-surface-muted)', border: '1px solid var(--app-border)' }}>
                    <h6 className="fw-bold text-dark mb-2"><i className="fas fa-clipboard-list me-2" style={{ color: 'var(--app-primary)' }}></i>Task Description</h6>
                    <p className="text-secondary mb-0" style={{ lineHeight: '1.6' }}>
                      {booking.description || "No description provided by the customer."}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="d-flex flex-wrap gap-3 font-body">
                    {booking.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm"
                          onClick={() => updateStatus(booking.id, "Accepted")}
                        >
                          <i className="fas fa-check me-2"></i> Accept Job
                        </button>
                        <button
                          className="btn btn-outline-danger rounded-pill px-4 py-2 fw-bold bg-white"
                          onClick={() => updateStatus(booking.id, "Rejected")}
                        >
                          <i className="fas fa-times me-2"></i> Reject
                        </button>
                      </>
                    )}

                    {booking.status === "Accepted" && (
                      <button
                        className="btn btn-gradient-warm rounded-pill px-5 py-2 fw-bold shadow-warm"
                        onClick={() => updateStatus(booking.id, "Completed")}
                      >
                        <i className="fas fa-check-double me-2"></i> Mark as Completed
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