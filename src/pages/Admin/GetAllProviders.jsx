import React, { useEffect, useState } from "react";
import {
  getAllProviders,
  updateProviderStatus
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

  const getInitials = (name) => {
    if (!name) return "P";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  if (loading) {
    return (
      <section className="admin-page bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ margin: '-2rem', padding: '2rem' }}>
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading providers...</p>
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
        </div>
      )}

      <section className="admin-page bg-light min-vh-100" style={{ margin: '-2rem', padding: '2rem' }}>
        
        {/* Page Header */}
        <div className="mb-5">
          <span className="badge rounded-pill px-3 py-1 mb-3 fw-bold font-body text-uppercase" style={{ background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
            Provider Management
          </span>
          <h1 className="font-display fw-bold text-dark display-6 mb-2">Service Providers</h1>
          <p className="text-secondary font-body mb-0">
            Review provider accounts and manage their approval status.
          </p>
        </div>

        {/* Data Table Card */}
        <div className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
          <div className="card-header bg-white border-bottom p-4">
            <h4 className="font-display fw-bold text-dark mb-1">Provider Accounts</h4>
            <p className="text-secondary font-body mb-0 small">
              All registered provider accounts on the platform.
            </p>
          </div>

          <div className="card-body p-0">
            {providers.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem', color: '#e2e8f0' }}>
                  <i className="fas fa-user-slash"></i>
                </div>
                <h5 className="font-display fw-bold text-dark mb-2">No providers found</h5>
                <p className="text-secondary font-body mb-0">Provider accounts will appear here once available.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 font-body">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Avatar</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Name & Contact</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Category</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>City</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Rate</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Status</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3 text-end" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        
                        <td className="px-4 py-3">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" 
                            style={{ width: '45px', height: '45px', background: 'var(--gradient-warm)', fontSize: '1rem' }}
                          >
                            {getInitials(p.fullName)}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="fw-bold text-dark mb-0">{p.fullName}</div>
                          <div className="text-secondary small">{p.email}</div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="badge rounded-pill bg-light text-dark border px-3 py-1 fw-medium shadow-sm">
                            {p.categoryName || "N/A"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-secondary small fw-medium">
                          {p.city || "N/A"}
                        </td>

                        <td className="px-4 py-3 text-success fw-bold small">
                          {p.hourlyRate ? `$${p.hourlyRate}/hr` : "N/A"}
                        </td>

                        <td className="px-4 py-3">
                          {p.isActive ? (
                            <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-1 fw-bold">
                              <i className="fas fa-check-circle me-1"></i> Active
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis border border-warning-subtle px-3 py-1 fw-bold">
                              <i className="fas fa-clock me-1"></i> Pending
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-end">
                          {!p.isActive ? (
                            <div className="d-flex justify-content-end gap-2 flex-wrap">
                              <button
                                onClick={() => handleStatusChange(p.id, true)}
                                className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm"
                                title="Approve / Activate"
                              >
                                <i className="fas fa-check me-1"></i>
                                Approve
                              </button>

                              <button
                                onClick={() => handleDelete(p.id)}
                                className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold"
                                title="Reject / Delete"
                              >
                                <i className="fas fa-times me-1"></i>
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-end gap-2 flex-wrap">
                              <button
                                onClick={() => handleStatusChange(p.id, false)}
                                className="btn btn-sm btn-outline-warning rounded-pill px-3 fw-bold"
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