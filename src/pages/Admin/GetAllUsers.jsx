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

  const getStatusBadgeClass = (isActive) =>
    isActive ? "booking-status-confirmed" : "booking-status-cancelled";

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
            <p className="mb-0 text-secondary">Loading users...</p>
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
          title="Confirm Action"
          message={`Are you sure you want to ${confirmConfig.actionLabel} this user?`}
          actions={[
            { label: "Proceed", onClick: confirmStatusChange },
            { label: "Cancel", onClick: closeConfirm },
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
            <h1 className="admin-page-title mb-2">Manage Users</h1>
            <p className="text-secondary mb-0">
              Review customer accounts and manage their active status.
            </p>
          </div>
        </div>

        <div className="card app-card border-0 admin-table-card">
          <div className="card-body p-0">
            <div className="p-4 pb-3 border-bottom">
              <h2 className="h5 fw-semibold mb-1">System Users (Customers)</h2>
              <p className="text-secondary mb-0">
                All registered customer accounts on the platform.
              </p>
            </div>

            {users.length === 0 ? (
              <div className="text-center p-4 p-md-5">
                <div className="search-empty-icon mb-3">
                  <i className="fas fa-users-slash"></i>
                </div>
                <h5 className="fw-semibold mb-2">No customers found</h5>
                <p className="text-secondary mb-0">
                  Customer accounts will appear here once available.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 admin-data-table">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Name & Email</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="admin-provider-avatar">
                            {user.fullName?.charAt(0).toUpperCase()}
                          </div>
                        </td>

                        <td>
                          <div className="fw-semibold">{user.fullName}</div>
                          <div className="text-secondary small">{user.email}</div>
                        </td>

                        <td>{user.phoneNumber || "N/A"}</td>
                        <td>{user.city || "N/A"}</td>

                        <td>
                          <span className="badge rounded-pill text-bg-light border px-3 py-2">
                            Customer
                          </span>
                        </td>

                        <td>
                          <span
                            className={`booking-status-badge ${getStatusBadgeClass(
                              user.isActive
                            )}`}
                          >
                            {user.isActive ? "Active" : "Blocked"}
                          </span>
                        </td>

                        <td className="text-end">
                          {user.isActive ? (
                            <button
                              onClick={() =>
                                handleStatusChange(user.id, user.isActive)
                              }
                              className="btn btn-sm btn-outline-danger rounded-pill px-3"
                              title="Block User"
                            >
                              <i className="fas fa-ban me-1"></i>
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleStatusChange(user.id, user.isActive)
                              }
                              className="btn btn-sm btn-success rounded-pill px-3"
                              title="Unblock User"
                            >
                              <i className="fas fa-unlock me-1"></i>
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