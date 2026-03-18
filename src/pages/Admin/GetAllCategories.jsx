import React, { useEffect, useState } from "react";
import { 
  getAllCategories, 
  deleteCategory, 
  createCategory, 
  updateCategory 
} from "../../services/api"; 

const GetAllCategories = () => {
  // State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    iconClass: ""
  });

  // 1. Fetch Data
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

  // 2. Handle Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 3. Open Modals
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
      iconClass: category.iconClass || "" 
    });
    setShowModal(true);
  };

  // 4. Submit Form (The Critical Part)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert("Category Title is required!");
      return;
    }

    // Prepare Payload (Matches Backend DTO)
    const payload = {
        title: formData.title,
        iconClass: formData.iconClass
    };

    try {
      if (isEditing) {
        // UPDATE
        await updateCategory(formData.id, payload);
        alert("Category updated successfully!");
      } else {
        // CREATE
        await createCategory(payload);
        alert("Category added successfully!");
      }
      
      // Refresh list & Close modal
      await fetchCategories();
      setShowModal(false);

    } catch (err) {
      console.error("Operation failed:", err);
      alert("Operation failed. Check console for details.");
    }
  };

  // 5. Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      alert("Error deleting category.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <>
      <div className="">
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">Manage Categories</h1>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0">Category List</h3>
                <button className="btn btn-primary btn-sm ms-auto" onClick={openAddModal}>
                  <i className="fas fa-plus me-2"></i> Add Category
                </button>
              </div>

              <div className="card-body p-0">
                <table className="table table-striped mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th style={{ width: "50px" }}>ID</th>
                      <th>Category Name</th>
                      <th>Icon Class</th>
                      <th>Preview</th>
                      <th style={{ width: "150px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr><td colSpan="5" className="text-center p-3">No categories found.</td></tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat.id}>
                          <td>{cat.id}</td>
                          <td><strong>{cat.title}</strong></td>
                          <td><code>{cat.iconClass}</code></td>
                          <td className="text-center"><i className={`${cat.iconClass} fa-lg`}></i></td>
                          <td>
                            <button className="btn btn-sm btn-info me-2 text-white" onClick={() => openEditModal(cat)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>
                              <i className="fas fa-trash"></i>
                            </button>
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

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">{isEditing ? "Edit Category" : "Add New Category"}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Category Title</label>
                      <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Icon Class (FontAwesome)</label>
                      <input type="text" className="form-control" name="iconClass" value={formData.iconClass} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{isEditing ? "Update" : "Save"}</button>
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