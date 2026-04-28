import React, { useEffect, useState } from "react";
import { getAllCustomers, updateUserStatus } from "../../services/api";
import ModalAlert from "../../components/ModalAlert";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    userId: null,
    newStatus: false,
    actionLabel: "",
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllCustomers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
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
      userId: null,
      newStatus: false,
      actionLabel: "",
    });
  };

  const handleStatusChange = (id, currentStatus) => {
    const newStatus = !currentStatus;
    const actionLabel = newStatus ? "activate" : "block";

    setConfirmConfig({
      isOpen: true,
      userId: id,
      newStatus,
      actionLabel,
    });
  };

  const confirmStatusChange = async () => {
    try {
      const { userId, newStatus } = confirmConfig;

      await updateUserStatus(userId, newStatus);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: newStatus } : u))
      );

      closeConfirm();

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Status Updated",
        message: `The user has been successfully ${
          newStatus ? "activated" : "blocked"
        }.`,
        actions: [{ label: "OK" }],
      });
    } catch (error) {
      closeConfirm();

      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: "Failed to update user status.",
        actions: [{ label: "Close" }],
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (loading) {
    return (
      <section className="admin-page bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ margin: '-2rem', padding: '2rem' }}>
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading users...</p>
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

      {confirmConfig.isOpen && (
        <div className="review-alert-layer" style={{ zIndex: 1060 }}>
          <ModalAlert
            type="info"
            title="Confirm Action"
            message={`Are you sure you want to ${confirmConfig.actionLabel} this user?`}
            actions={[
              { label: "Proceed", onClick: confirmStatusChange },
              { label: "Cancel", onClick: closeConfirm },
            ]}
            onClose={closeConfirm}
          />
        </div>
      )}

      <section className="admin-page bg-light min-vh-100" style={{ margin: '-2rem', padding: '2rem' }}>
        
        {/* Page Header */}
        <div className="mb-5">
          <span className="badge rounded-pill px-3 py-1 mb-3 fw-bold font-body text-uppercase" style={{ background: 'rgba(13, 110, 253, 0.1)', color: 'var(--app-primary)', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
            User Management
          </span>
          <h1 className="font-display fw-bold text-dark display-6 mb-2">System Users</h1>
          <p className="text-secondary font-body mb-0">
            Review customer accounts and manage their active status.
          </p>
        </div>

        {/* Data Table Card */}
        <div className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
          <div className="card-header bg-white border-bottom p-4">
            <h4 className="font-display fw-bold text-dark mb-1">Customer Accounts</h4>
            <p className="text-secondary font-body mb-0 small">
              All registered customer accounts on the platform.
            </p>
          </div>

          <div className="card-body p-0">
            {users.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem', color: '#e2e8f0' }}>
                  <i className="fas fa-users-slash"></i>
                </div>
                <h5 className="font-display fw-bold text-dark mb-2">No customers found</h5>
                <p className="text-secondary font-body mb-0">Customer accounts will appear here once available.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 font-body">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>User</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Contact Info</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Role</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3 text-end" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                              style={{ width: '45px', height: '45px', background: 'rgba(13, 110, 253, 0.1)', color: 'var(--app-primary)', fontSize: '1rem' }}
                            >
                              {getInitials(user.fullName)}
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-0">{user.fullName}</div>
                              <div className="text-secondary small">{user.city || "No City"}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="text-dark fw-medium mb-0">{user.email}</div>
                          <div className="text-secondary small">{user.phoneNumber || "No Phone"}</div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="badge rounded-pill bg-light text-dark border px-3 py-1 fw-medium shadow-sm">
                            Customer
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {user.isActive ? (
                            <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-1 fw-bold">
                              <i className="fas fa-check-circle me-1"></i> Active
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 fw-bold">
                              <i className="fas fa-ban me-1"></i> Blocked
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-end">
                          {user.isActive ? (
                            <button
                              onClick={() => handleStatusChange(user.id, user.isActive)}
                              className="btn btn-sm btn-outline-danger rounded-pill px-4 fw-bold"
                              title="Block User"
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(user.id, user.isActive)}
                              className="btn btn-sm btn-success rounded-pill px-4 fw-bold shadow-sm"
                              title="Unblock User"
                            >
                              Unblock
                            </button>
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

export default GetAllUsers;