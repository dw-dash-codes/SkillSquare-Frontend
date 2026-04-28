import React, { useEffect, useState } from "react";
import {
  getAllCategories,
  deleteCategory,
  createCategory,
  updateCategory,
} from "../../services/api";
import ModalAlert from "../../components/ModalAlert";

const GetAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    iconClass: "",
  });

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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  const closeModalAlert = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: 0, title: "", iconClass: "" });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setIsEditing(true);
    setFormData({
      id: category.id,
      title: category.title,
      iconClass: category.iconClass || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Category title is required.",
        actions: [{ label: "OK" }],
      });
      return;
    }

    const payload = {
      title: formData.title,
      iconClass: formData.iconClass,
    };

    try {
      setSaving(true);

      if (isEditing) {
        await updateCategory(formData.id, payload);
        setModalConfig({
          isOpen: true,
          type: "success",
          title: "Category Updated",
          message: "Category updated successfully.",
          actions: [{ label: "OK" }],
        });
      } else {
        await createCategory(payload);
        setModalConfig({
          isOpen: true,
          type: "success",
          title: "Category Added",
          message: "Category added successfully.",
          actions: [{ label: "OK" }],
        });
      }

      await fetchCategories();
      setShowModal(false);
    } catch (err) {
      console.error("Operation failed:", err);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Operation Failed",
        message: "Operation failed. Please check the data and try again.",
        actions: [{ label: "Close" }],
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Category?",
      message: "Are you sure you want to delete this category? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteCategory(id);
          setCategories((prev) => prev.filter((cat) => cat.id !== id));

          setModalConfig({
            isOpen: true,
            type: "success",
            title: "Category Deleted",
            message: "The category has been removed successfully.",
            actions: [{ label: "OK" }],
          });
        } catch (err) {
          setModalConfig({
            isOpen: true,
            type: "error",
            title: "Delete Failed",
            message: "Error deleting category. It might be in use.",
            actions: [{ label: "Close" }],
          });
        }
      },
    });
  };

  if (loading) {
    return (
      <section className="admin-page bg-light min-vh-100 d-flex align-items-center justify-content-center" style={{ margin: '-2rem', padding: '2rem' }}>
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading categories...</p>
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
            onClose={closeModalAlert}
          />
        </div>
      )}

      {confirmConfig.isOpen && (
        <div className="review-alert-layer" style={{ zIndex: 1060 }}>
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
        </div>
      )}

      <section className="admin-page bg-light min-vh-100" style={{ margin: '-2rem', padding: '2rem' }}>
        
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
          <div>
            <span className="badge rounded-pill px-3 py-1 mb-3 fw-bold font-body text-uppercase" style={{ background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
              Service Configuration
            </span>
            <h1 className="font-display fw-bold text-dark display-6 mb-2">Manage Categories</h1>
            <p className="text-secondary font-body mb-0">
              Add, edit, and organize service categories across the platform.
            </p>
          </div>
          <div>
            <button
              className="btn btn-gradient-warm rounded-pill px-4 py-2 fw-bold shadow-warm font-body d-flex align-items-center"
              onClick={openAddModal}
            >
              <i className="fas fa-plus me-2"></i>
              Add Category
            </button>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
          <div className="card-header bg-white border-bottom p-4">
            <h4 className="font-display fw-bold text-dark mb-1">Category List</h4>
            <p className="text-secondary font-body mb-0 small">
              All available service categories and their assigned icons.
            </p>
          </div>

          <div className="card-body p-0">
            {categories.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem', color: '#e2e8f0' }}>
                  <i className="fas fa-th-list"></i>
                </div>
                <h5 className="font-display fw-bold text-dark mb-2">No categories found</h5>
                <p className="text-secondary font-body mb-0">Categories will appear here once created.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 font-body">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', width: '80px' }}>ID</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Category Info</th>
                      <th className="text-secondary fw-bold small text-uppercase px-4 py-3 text-end" style={{ letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        
                        <td className="px-4 py-3 text-secondary fw-medium">
                          #{cat.id}
                        </td>

                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center bg-light border shadow-sm" 
                              style={{ width: '45px', height: '45px', color: 'var(--app-primary)', fontSize: '1.2rem', borderColor: '#e2e8f0' }}
                            >
                              <i className={cat.iconClass || "fas fa-wrench"}></i>
                            </div>
                            <div>
                              <div className="fw-bold text-dark mb-0 fs-6">{cat.title}</div>
                              <div className="text-secondary small font-monospace bg-light rounded px-2 py-1 mt-1 d-inline-block border">
                                {cat.iconClass || "No Icon Class"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-end">
                          <div className="d-flex justify-content-end gap-2 flex-wrap">
                            <button
                              className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold bg-white"
                              onClick={() => openEditModal(cat)}
                              title="Edit Category"
                            >
                              <i className="fas fa-edit me-1"></i>
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold bg-white"
                              onClick={() => handleDelete(cat.id)}
                              title="Delete Category"
                            >
                              <i className="fas fa-trash me-1"></i>
                              Delete
                            </button>
                          </div>
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

      {/* Add / Edit Category Modal */}
      {showModal && (
        <>
          <div 
            className="review-modal-backdrop" 
            onClick={() => setShowModal(false)}
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1040 }}
          ></div>

          <div
            className="modal d-block review-modal-wrapper"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden bg-white">
                
                {/* Modal Header */}
                <div className="modal-header border-bottom-0 pt-4 px-4 pb-0 align-items-center">
                  <h4 className="modal-title font-display fw-bold text-dark d-flex align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: '45px', height: '45px', background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}
                    >
                      <i className={isEditing ? "fas fa-edit" : "fas fa-plus"}></i>
                    </div>
                    {isEditing ? "Edit Category" : "New Category"}
                  </h4>
                  <button
                    type="button"
                    className="btn-close shadow-none"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="font-body">
                  <div className="modal-body p-4">
                    
                    <div className="mb-4">
                      <label className="form-label fw-bold text-dark small mb-1">Category Title</label>
                      <input
                        type="text"
                        className="form-control px-3 py-2 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem' }}
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Plumbing, Electrician"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold text-dark small mb-1">
                        Icon Class (FontAwesome)
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control px-3 py-2 bg-light border-0 shadow-none"
                          style={{ borderRadius: '0.75rem 0 0 0.75rem' }}
                          name="iconClass"
                          value={formData.iconClass}
                          onChange={handleInputChange}
                          placeholder="e.g. fas fa-tools"
                        />
                        <span className="input-group-text bg-white border d-flex align-items-center justify-content-center" style={{ borderRadius: '0 0.75rem 0.75rem 0', width: '50px' }}>
                          <i className={`${formData.iconClass || 'fas fa-question text-muted'} fa-lg`} style={{ color: 'var(--app-primary)' }}></i>
                        </span>
                      </div>
                      <small className="text-secondary mt-1 d-block">Check fontawesome.com for free icon classes.</small>
                    </div>

                  </div>

                  {/* Modal Footer */}
                  <div className="modal-footer border-top-0 px-4 pb-4 pt-0 justify-content-between">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill px-4 fw-bold flex-grow-1 text-dark"
                      style={{ border: '1px solid var(--app-border)' }}
                      onClick={() => setShowModal(false)}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-gradient-warm rounded-pill px-4 fw-bold flex-grow-1 shadow-warm"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i> Saving...
                        </>
                      ) : isEditing ? (
                        "Update Category"
                      ) : (
                        "Save Category"
                      )}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GetAllCategories;