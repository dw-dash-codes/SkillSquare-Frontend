import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getAllAdminBookings, adminUpdateBookingStatus } from "../../services/api"; // Adjust path

const GetAllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on load
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

  // Handle Status Change
  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

    try {
      await adminUpdateBookingStatus(id, newStatus);
      // Update UI locally to avoid full re-fetch
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert("Error updating status");
    }
  };

  // Helper to get Badge Color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return "bg-warning text-dark";
      case "Accepted": return "bg-primary";
      case "Completed": return "bg-success";
      case "Rejected": return "bg-danger";
      case "Cancelled": return "bg-secondary";
      default: return "bg-secondary";
    }
  };

  if (loading) return <div className="p-4">Loading bookings...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;

  return (
    <>
      <div className="">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">All Bookings</h1>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Manage All Bookings</h3>
              </div>
              <div className="card-body p-0 table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Provider</th>
                      <th>Service</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th style={{ minWidth: "150px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>{booking.id}</td>
                          
                          {/* Customer Link */}
                          <td>
                            <NavLink
                              to={`/admin/getAllUsers`} // You can link to specific user detail later
                              className="text-primary text-decoration-none"
                            >
                              <strong>{booking.customerName}</strong>
                            </NavLink>
                            <br />
                            <small className="text-muted">{booking.customerPhone}</small>
                          </td>

                          {/* Provider Link */}
                          <td>
                            <NavLink
                              to={`/admin/getAllProviders`} // Link to provider detail later
                              className="text-primary text-decoration-none"
                            >
                              <strong>{booking.providerName}</strong>
                            </NavLink>
                          </td>

                          {/* Service Category */}
                          <td>
                            <span className="badge bg-info text-dark">
                              {booking.serviceCategory}
                            </span>
                          </td>

                          {/* Date/Time */}
                          <td>
                            {new Date(booking.bookingDate).toLocaleDateString()}
                            <br />
                            <small className="text-muted">{booking.bookingTime}</small>
                          </td>

                          {/* Status Badge */}
                          <td>
                            <span className={`badge ${getStatusBadge(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td>
                            {booking.status === "Pending" && (
                              <div className="d-flex gap-2">
                                <button
                                  onClick={() => handleStatusChange(booking.id, "Accepted")}
                                  className="btn btn-sm btn-success"
                                  title="Force Approve"
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button
                                  onClick={() => handleStatusChange(booking.id, "Rejected")}
                                  className="btn btn-sm btn-danger"
                                  title="Force Reject"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            )}

                            {booking.status === "Accepted" && (
                              <button
                                onClick={() => handleStatusChange(booking.id, "Cancelled")}
                                className="btn btn-sm btn-secondary"
                              >
                                Cancel
                              </button>
                            )}

                             {/* If completed/rejected/cancelled, show no actions or a delete button */}
                             {["Completed", "Rejected", "Cancelled"].includes(booking.status) && (
                                <span className="text-muted small">No actions</span>
                             )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetAllBookings;