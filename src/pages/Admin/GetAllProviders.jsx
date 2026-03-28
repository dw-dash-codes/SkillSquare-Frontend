import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  getAllProviders,
  updateProviderStatus,
  
} from "../../services/api";
import ModalAlert from "../../components/ModalAlert";

const GetAllProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    type: "",
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
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const data = await getAllProviders();
      setProviders(data);
    } catch (error) {
      console.error("Error loading providers:", error);
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
      type: "",
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleStatusChange = (id, newStatus) => {
    const action = newStatus ? "approve" : "suspend";

    setConfirmConfig({
      isOpen: true,
      type: "info",
      title: "Confirm Action",
      message: `Are you sure you want to ${action} this provider?`,
      onConfirm: async () => {
        try {
          await updateProviderStatus(id, newStatus);

          setProviders((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p))
          );

          setModalConfig({
            isOpen: true,
            type: "success",
            title: "Status Updated",
            message: `The provider has been successfully ${
              newStatus ? "approved" : "suspended"
            }.`,
            actions: [{ label: "OK" }],
          });
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: "error",
            title: "Update Failed",
            message: "Failed to update provider status.",
            actions: [{ label: "Close" }],
          });
        }
      },
    });
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      type: "error",
      title: "Reject Provider?",
      message:
        "Are you sure you want to reject and delete this provider? This cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteProvider(id);
          setProviders((prev) => prev.filter((p) => p.id !== id));

          setModalConfig({
            isOpen: true,
            type: "success",
            title: "Provider Deleted",
            message: "The provider has been rejected and removed successfully.",
            actions: [{ label: "OK" }],
          });
        } catch (error) {
          setModalConfig({
            isOpen: true,
            type: "error",
            title: "Delete Failed",
            message: "Failed to delete provider.",
            actions: [{ label: "Close" }],
          });
        }
      },
    });
  };

  const getStatusBadgeClass = (isActive) =>
    isActive ? "booking-status-confirmed" : "booking-status-pending";

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
            <p className="mb-0 text-secondary">Loading providers...</p>
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
          type={confirmConfig.type}
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
            <h1 className="admin-page-title mb-2">Manage Providers</h1>
            <p className="text-secondary mb-0">
              Review provider accounts and manage their approval status.
            </p>
          </div>
        </div>

        <div className="card app-card border-0 admin-table-card">
          <div className="card-body p-0">
            <div className="p-4 pb-3 border-bottom">
              <h2 className="h5 fw-semibold mb-1">Service Providers</h2>
              <p className="text-secondary mb-0">
                All registered provider accounts on the platform.
              </p>
            </div>

            {providers.length === 0 ? (
              <div className="text-center p-4 p-md-5">
                <div className="search-empty-icon mb-3">
                  <i className="fas fa-user-slash"></i>
                </div>
                <h5 className="fw-semibold mb-2">No providers found</h5>
                <p className="text-secondary mb-0">
                  Provider accounts will appear here once available.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 admin-data-table">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Name & Contact</th>
                      <th>Category</th>
                      <th>City</th>
                      <th>Rate</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-provider-avatar">
                            {p.fullName?.charAt(0).toUpperCase()}
                          </div>
                        </td>

                        <td>
                          <strong>{p.fullName}</strong>
                          <br />
                          <small className="text-muted">{p.email}</small>
                        </td>

                        <td>
                          <span className="badge rounded-pill text-bg-light border px-3 py-2">
                            {p.categoryName}
                          </span>
                        </td>

                        <td>{p.city || "N/A"}</td>

                        <td>{p.hourlyRate ? `$${p.hourlyRate}/hr` : "N/A"}</td>

                        <td>
                          <span
                            className={`booking-status-badge ${getStatusBadgeClass(
                              p.isActive
                            )}`}
                          >
                            {p.isActive ? "Active" : "Pending / Suspended"}
                          </span>
                        </td>

                        <td className="text-end">
                          {!p.isActive ? (
                            <div className="d-flex justify-content-end gap-2 flex-wrap">
                              <button
                                onClick={() => handleStatusChange(p.id, true)}
                                className="btn btn-sm btn-success rounded-pill px-3"
                                title="Approve / Activate"
                              >
                                <i className="fas fa-check me-1"></i>
                                Approve
                              </button>

                              <button
                                onClick={() => handleDelete(p.id)}
                                className="btn btn-sm btn-danger rounded-pill px-3"
                                title="Reject / Delete"
                              >
                                <i className="fas fa-times me-1"></i>
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-end gap-2 flex-wrap">
                              {/* <NavLink
                                to={`/admin/providerProfile/${p.id}`}
                                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                title="View Details"
                              >
                                <i className="fas fa-eye me-1"></i>
                                View
                              </NavLink> */}

                              <button
                                onClick={() => handleStatusChange(p.id, false)}
                                className="btn btn-sm btn-outline-warning rounded-pill px-3"
                                title="Suspend / Deactivate"
                              >
                                <i className="fas fa-ban me-1"></i>
                                Suspend
                              </button>
                            </div>
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

export default GetAllProviders;