import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  getAllAdminBookings,
  adminUpdateBookingStatus,
} from "../../services/api";
import ModalAlert from "../../components/ModalAlert";

const GetAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

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

  const closeConfirm = () => {
    setConfirmConfig({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleStatusChange = (id, newStatus) => {
    setConfirmConfig({
      isOpen: true,
      title: "Confirm Action",
      message: `Are you sure you want to mark this booking as ${newStatus}?`,
      onConfirm: async () => {
        try {
          await adminUpdateBookingStatus(id, newStatus);
          setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
          );

          setModalConfig({
            isOpen: true,
            type: "success",
            title: "Status Updated",
            message: `The booking has been marked as ${newStatus}.`,
            actions: [{ label: "OK" }],
          });
        } catch (err) {
          setModalConfig({
            isOpen: true,
            type: "error",
            title: "Update Failed",
            message: "Error updating booking status.",
            actions: [{ label: "Close" }],
          });
        }
      },
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "booking-status-pending";
      case "Accepted":
        return "booking-status-confirmed";
      case "Completed":
        return "booking-status-completed";
      case "Rejected":
      case "Cancelled":
      default:
        return "booking-status-cancelled";
    }
  };

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

        <section className="admin-page">
          <div className="card app-card border-0 text-center p-4 p-md-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="mb-0 text-secondary">Loading bookings...</p>
          </div>
        </section>
      </>
    );
  }

  if (error) {
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

        <section className="admin-page">
          <div className="card app-card border-0 text-center p-4 p-md-5">
            <div className="search-empty-icon mb-3">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h5 className="fw-semibold mb-2">Unable to load bookings</h5>
            <p className="text-danger mb-0">{error}</p>
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

      {confirmConfig.isOpen && (
        <ModalAlert
          type="info"
          title={confirmConfig.title}
          message={confirmConfig.message}
          actions={[
            {
              label: "Proceed",
              onClick: async () => {
                await confirmConfig.onConfirm?.();
                closeConfirm();
              },
            },
            {
              label: "Cancel",
              onClick: closeConfirm,
            },
          ]}
          onClose={closeConfirm}
        />
      )}

      <section className="admin-page">
        <div className="admin-page-header mb-4">
          <div>
            <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-2">
              Admin Panel
            </span>
            <h1 className="admin-page-title mb-2">All Bookings</h1>
            <p className="text-secondary mb-0">
              Review and manage all bookings across the platform.
            </p>
          </div>
        </div>

        <div className="card app-card border-0 admin-table-card">
          <div className="card-body p-0">
            <div className="p-4 pb-3 border-bottom">
              <h2 className="h5 fw-semibold mb-1">Manage All Bookings</h2>
              <p className="text-secondary mb-0">
                Booking records, customer details, providers, and current statuses.
              </p>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center p-4 p-md-5">
                <div className="search-empty-icon mb-3">
                  <i className="fas fa-calendar-times"></i>
                </div>
                <h5 className="fw-semibold mb-2">No bookings found</h5>
                <p className="text-secondary mb-0">
                  Booking records will appear here once available.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 admin-data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Provider</th>
                      <th>Service</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="fw-semibold">#{booking.id}</td>

                        <td>
                          <NavLink
                            to="/admin/getAllUsers"
                            className="text-decoration-none"
                          >
                            <div className="fw-semibold text-dark">
                              {booking.customerName}
                            </div>
                            <div className="text-secondary small">
                              {booking.customerPhone}
                            </div>
                          </NavLink>
                        </td>

                        <td>
                          <NavLink
                            to="/admin/getAllProviders"
                            className="text-decoration-none"
                          >
                            <div className="fw-semibold text-dark">
                              {booking.providerName}
                            </div>
                          </NavLink>
                        </td>

                        <td>
                          <span className="badge rounded-pill text-bg-light border px-3 py-2">
                            {booking.serviceCategory}
                          </span>
                        </td>

                        <td>
                          <div>{new Date(booking.bookingDate).toLocaleDateString()}</div>
                          <div className="text-secondary small">
                            {booking.bookingTime}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`booking-status-badge ${getStatusBadgeClass(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>

                        <td className="text-end">
                          {booking.status === "Pending" && (
                            <div className="d-flex justify-content-end gap-2 flex-wrap">
                              <button
                                onClick={() =>
                                  handleStatusChange(booking.id, "Accepted")
                                }
                                className="btn btn-sm btn-success rounded-pill px-3"
                                title="Force Approve"
                              >
                                <i className="fas fa-check me-1"></i>
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(booking.id, "Rejected")
                                }
                                className="btn btn-sm btn-danger rounded-pill px-3"
                                title="Force Reject"
                              >
                                <i className="fas fa-times me-1"></i>
                                Reject
                              </button>
                            </div>
                          )}

                          {booking.status === "Accepted" && (
                            <div className="d-flex justify-content-end">
                              <button
                                onClick={() =>
                                  handleStatusChange(booking.id, "Cancelled")
                                }
                                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          {["Completed", "Rejected", "Cancelled"].includes(
                            booking.status
                          ) && (
                            <span className="text-secondary small">
                              No actions
                            </span>
                          )}
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