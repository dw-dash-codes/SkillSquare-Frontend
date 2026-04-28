import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAllAdminBookings } from "../../services/api";
import ModalAlert from "../../components/ModalAlert";

const GetAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const fetchBookings = async () => {
    try {
      const data = await getAllAdminBookings();
      setBookings(data);
    } catch (err) {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-1 fw-bold"><i className="fas fa-check-double me-1"></i>Completed</span>;
      case "Pending":
        return <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 fw-bold"><i className="fas fa-clock me-1"></i>Pending</span>;
      case "Accepted":
        return <span className="badge rounded-pill bg-info-subtle text-info-emphasis border border-info-subtle px-3 py-1 fw-bold"><i className="fas fa-thumbs-up me-1"></i>Accepted</span>;
      case "Rejected":
      case "Cancelled":
        return <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 fw-bold"><i className="fas fa-times-circle me-1"></i>{status}</span>;
      default:
        return <span className="badge rounded-pill bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-1 fw-bold">{status}</span>;
    }
  };

  if (loading) {
    return (
      <section className="admin-page bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ margin: '-2rem', padding: '2rem' }}>
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading all system bookings...</p>
        </div>
      </section>
    );
  }

  if (error) {
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

        <section className="admin-page bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ margin: '-2rem', padding: '2rem' }}>
          <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: '#fca5a5' }}>
            <div className="mb-3" style={{ fontSize: '3rem', color: '#ef4444', opacity: '0.5' }}>
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h4 className="font-display fw-bold text-dark mb-2">Unable to load data</h4>
            <p className="text-secondary font-body mb-0">{error}</p>
          </div>
        </section>
      </>
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

      <section className="admin-page bg-light min-vh-100" style={{ margin: '-2rem', padding: '2rem' }}>
        
        {/* Page Header */}
        <div className="mb-5">
          <span className="badge rounded-pill px-3 py-1 mb-3 fw-bold font-body text-uppercase" style={{ background: 'rgba(25, 135, 84, 0.1)', color: '#198754', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
            Job Operations
          </span>
          <h1 className="font-display fw-bold text-dark display-6 mb-2">Master Booking List</h1>
          <p className="text-secondary font-body mb-0">
            Monitor and review bookings across the entire platform.
          </p>
        </div>

        {/* Data Table Card */}
        <div className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
          <div className="card-header bg-white border-bottom p-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <h4 className="font-display fw-bold text-dark mb-1">System Bookings</h4>
              <p className="text-secondary font-body mb-0 small">
                Showing {bookings.length} total records
              </p>
            </div>
          </div>

          <div className="card-body p-0">
            {bookings.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem', color: '#e2e8f0' }}>
                  <i className="fas fa-calendar-times"></i>
                </div>
                <h5 className="font-display fw-bold text-dark mb-2">No bookings found</h5>
                <p className="text-secondary font-body mb-0">Platform booking records will appear here.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 font-body">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>ID</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Parties Involved</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Service</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Date & Time</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        
                        <td className="px-4 py-3 text-secondary fw-bold">
                          #{booking.id}
                        </td>

                        <td className="px-4 py-3">
                          <div className="d-flex flex-column gap-2">
                            {/* Customer Badge */}
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge rounded text-bg-light border px-2 py-1 text-secondary" style={{ width: '35px', textAlign: 'center' }}>C</span>
                              <div className="lh-1">
                                <span className="fw-bold text-dark d-block mb-1">{booking.customerName}</span>
                                <span className="text-secondary small d-block" style={{ fontSize: '0.75rem' }}>{booking.customerPhone || "No Phone"}</span>
                              </div>
                            </div>
                            {/* Provider Badge */}
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge rounded border px-2 py-1" style={{ width: '35px', textAlign: 'center', background: 'var(--gradient-warm)', color: 'white' }}>P</span>
                              <div className="lh-1">
                                <span className="fw-bold text-dark d-block mb-1">{booking.providerName}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="badge rounded-pill bg-light text-dark border px-3 py-2 fw-medium shadow-sm">
                            {booking.serviceCategory || "General"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="fw-medium text-dark mb-1">
                            <i className="far fa-calendar-alt text-secondary me-2"></i>
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </div>
                          <div className="text-secondary small">
                            <i className="far fa-clock me-2"></i>
                            {booking.bookingTime}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {getStatusBadge(booking.status)}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </section>
    </>
  );
};

export default GetAllBookings;