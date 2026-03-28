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
      message: "Are you sure you want to delete this category?",
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
            message: "Error deleting category.",
            actions: [{ label: "Close" }],
          });
        }
      },
    });
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
            onClose={closeModalAlert}
          />
        )}

        <section className="admin-page">
          <div className="card app-card border-0 text-center p-4 p-md-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="mb-0 text-secondary">Loading categories...</p>
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
          onClose={closeModalAlert}
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
            <h1 className="admin-page-title mb-2">Manage Categories</h1>
            <p className="text-secondary mb-0">
              Add, edit, and organize service categories across the platform.
            </p>
          </div>

          <div>
            <button
              className="btn btn-primary rounded-pill px-4"
              onClick={openAddModal}
            >
              <i className="fas fa-plus me-2"></i>
              Add Category
            </button>
          </div>
        </div>

        <div className="card app-card border-0 admin-table-card">
          <div className="card-body p-0">
            <div className="p-4 pb-3 border-bottom">
              <h2 className="h5 fw-semibold mb-1">Category List</h2>
              <p className="text-secondary mb-0">
                All available service categories and their assigned icons.
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="text-center p-4 p-md-5">
                <div className="search-empty-icon mb-3">
                  <i className="fas fa-th-list"></i>
                </div>
                <h5 className="fw-semibold mb-2">No categories found</h5>
                <p className="text-secondary mb-0">
                  Categories will appear here once created.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0 admin-data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Category Name</th>
                      <th>Icon Class</th>
                      <th>Preview</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td className="fw-semibold">#{cat.id}</td>
                        <td>
                          <strong>{cat.title}</strong>
                        </td>
                        <td>
                          <code>{cat.iconClass || "N/A"}</code>
                        </td>
                        <td>
                          <div className="admin-category-preview">
                            <i className={`${cat.iconClass} fa-lg`}></i>
                          </div>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2 flex-wrap">
                            <button
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                              onClick={() => openEditModal(cat)}
                            >
                              <i className="fas fa-edit me-1"></i>
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill px-3"
                              onClick={() => handleDelete(cat.id)}
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

      {showModal && (
        <>
          <div className="modal-alert-backdrop" onClick={() => setShowModal(false)}></div>

          <div
            className="modal d-block review-modal-wrapper"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 review-modal-card">
                <div className="modal-header review-modal-header border-0">
                  <h5 className="modal-title fw-bold">
                    <i className="fas fa-th-list me-2"></i>
                    {isEditing ? "Edit Category" : "Add New Category"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label auth-label">Category Title</label>
                      <input
                        type="text"
                        className="form-control auth-input"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label auth-label">
                        Icon Class (FontAwesome)
                      </label>
                      <input
                        type="text"
                        className="form-control auth-input"
                        name="iconClass"
                        value={formData.iconClass}
                        onChange={handleInputChange}
                        placeholder="e.g. fas fa-tools"
                      />
                    </div>

                    {formData.iconClass && (
                      <div className="admin-category-modal-preview">
                        <span className="text-secondary small d-block mb-2">
                          Preview
                        </span>
                        <div className="admin-category-preview">
                          <i className={`${formData.iconClass} fa-lg`}></i>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer review-modal-footer border-0">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => setShowModal(false)}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill px-4"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Saving...
                        </>
                      ) : isEditing ? (
                        "Update"
                      ) : (
                        "Save"
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