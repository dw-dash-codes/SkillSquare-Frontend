import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import ModalAlert from "../../components/ModalAlert";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    address: "",
    area: "",
    categoryId: "",
    skills: "",
    bio: "",
    hourlyRate: "",
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
  });

  useEffect(() => {
    loadProfile();
    loadCategories();
  }, []);

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const id =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      setUserId(id);

      const userRes = await api.get("/User/profile");

      let providerData = {};
      try {
        const providerRes = await api.get(`/Provider/${id}`);
        providerData = providerRes.data;
      } catch (error) {
        console.log("User is not a provider yet or error fetching provider details.");
      }

      setForm({
        firstName: userRes.data.firstName || "",
        lastName: userRes.data.lastName || "",
        email: userRes.data.email || "",
        phoneNumber: userRes.data.phoneNumber || "",
        city: userRes.data.city || "",
        address: userRes.data.address || "",
        area: providerData.area || "",
        categoryId: providerData.categoryId || "",
        skills: providerData.skills || "",
        bio: providerData.bio || "",
        hourlyRate: providerData.hourlyRate || "",
      });
    } catch (err) {
      console.error("Profile load error", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/ServiceCategory");
      setCategories(res.data);
    } catch (error) {
      console.error("Error loading categories", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Authentication Error",
        message: "User ID not found. Please re-login.",
        actions: [{ label: "Close" }],
      });
      return;
    }

    try {
      setSaving(true);

      await api.put("/User/profile", {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        city: form.city,
        address: form.address,
      });

      await api.put(`/Provider/UpdateProfile/${userId}`, {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        address: form.address,
        area: form.area || "",
        city: form.city,
        categoryId: Number(form.categoryId),
        skills: form.skills,
        bio: form.bio,
        hourlyRate: Number(form.hourlyRate),
        email: form.email,
        password: "DummyPassword123!",
      });

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been successfully updated.",
        actions: [{ label: "OK" }],
      });
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);

      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: `Profile update failed: ${JSON.stringify(
          err.response?.data || "Unknown Error"
        )}`,
        actions: [{ label: "Close" }],
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="provider-page">
        <div className="card app-card border rounded-4 text-center p-5 shadow-sm bg-white" style={{ borderColor: 'var(--app-border)' }}>
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <p className="mb-0 text-secondary font-body">Loading your profile...</p>
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

      <section className="provider-page" style={{ margin: '-2rem', padding: '2rem' }}>
        
        {/* Page Header */}
        <div className="mb-5">
          <span className="badge rounded-pill px-3 py-1 mb-3 fw-medium" style={{ background: 'rgba(242, 122, 33, 0.1)', color: 'var(--app-primary)' }}>
            Provider Settings
          </span>
          <h1 className="font-display fw-bold text-dark mb-2">My Profile</h1>
          <p className="text-secondary font-body mb-0">
            Update your personal details and service information.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card app-card border rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#cbd5e1' }}>
              <div className="card-body p-4 p-lg-5">
                <form onSubmit={handleSubmit} className="font-body">
                  
                  {/* --- Personal Details Section --- */}
                  <h4 className="font-display fw-bold text-dark mb-4 border-bottom pb-3">
                    <i className="fas fa-user-circle me-2" style={{ color: 'var(--app-primary)' }}></i>
                    Personal Details
                  </h4>
                  
                  <div className="row g-4 mb-5">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small mb-1">First Name</label>
                      <input
                        name="firstName"
                        className="form-control px-3 py-2 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem' }}
                        value={form.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small mb-1">Last Name</label>
                      <input
                        name="lastName"
                        className="form-control px-3 py-2 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem' }}
                        value={form.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small mb-1">Email Address</label>
                      <input
                        className="form-control px-3 py-2 border-0 shadow-none"
                        style={{ borderRadius: '0.75rem', background: '#e2e8f0', color: '#64748b' }}
                        value={form.email}
                        disabled
                        title="Email cannot be changed"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small mb-1">Phone Number</label>
                      <input
                        name="phoneNumber"
                        className="form-control px-3 py-2 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem' }}
                        value={form.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark small mb-1">City</label>
                      <input
                        name="city"
                        className="form-control px-3 py-2 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem' }}
                        value={form.city}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark small mb-1">Area / Sector</label>
                      <input
                        name="area"
                        className="form-control px-3 py-2 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem' }}
                        value={form.area}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold text-dark small mb-1">Address</label>
                      <input
                        name="address"
                        className="form-control px-3 py-2 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem' }}
                        value={form.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* --- Professional Details Section --- */}
                  <h4 className="font-display fw-bold text-dark mb-4 border-bottom pb-3 mt-4">
                    <i className="fas fa-briefcase me-2" style={{ color: 'var(--app-primary)' }}></i>
                    Professional Details
                  </h4>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small mb-1">Service Category</label>
                      <select
                        name="categoryId"
                        className="form-select px-3 py-2 bg-light border-0 shadow-none text-dark"
                        style={{ borderRadius: '0.75rem' }}
                        value={form.categoryId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold text-dark small mb-1">Hourly Rate ($)</label>
                      <input
                        type="number"
                        name="hourlyRate"
                        className="form-control px-3 py-2 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem' }}
                        value={form.hourlyRate}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold text-dark small mb-1">Skills (comma separated)</label>
                      <input
                        name="skills"
                        className="form-control px-3 py-2 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem' }}
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="e.g. plumbing, pipe fitting, installation"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold text-dark small mb-1">Professional Bio</label>
                      <textarea
                        name="bio"
                        className="form-control px-3 py-3 bg-light border-0 shadow-none"
                        style={{ borderRadius: '0.75rem', minHeight: '120px' }}
                        rows="5"
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Write a short description about your services and experience..."
                      />
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-top text-end">
                    <button
                      className="btn btn-gradient-warm rounded-pill px-5 py-3 fw-bold shadow-warm"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Save Profile
                        </>
                      )}
                    </button>
                  </div>
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;