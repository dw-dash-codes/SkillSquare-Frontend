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
        <div className="card app-card border-0 text-center p-4 p-md-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="mb-0 text-secondary">Loading profile...</p>
        </div>
      </section>
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

      <section className="provider-page">
        <div className="provider-page-header mb-4">
          <div>
            <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-2">
              Provider Panel
            </span>
            <h1 className="provider-page-title mb-2">My Profile</h1>
            <p className="text-secondary mb-0">
              Update your personal details and service information.
            </p>
          </div>
        </div>

        <div className="card app-card border-0 provider-profile-card">
          <div className="card-body p-4 p-lg-5">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label auth-label">First Name</label>
                  <input
                    name="firstName"
                    className="form-control auth-input"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label auth-label">Last Name</label>
                  <input
                    name="lastName"
                    className="form-control auth-input"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label auth-label">Email</label>
                  <input
                    className="form-control auth-input bg-light"
                    value={form.email}
                    disabled
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label auth-label">Phone</label>
                  <input
                    name="phoneNumber"
                    className="form-control auth-input"
                    value={form.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label auth-label">City</label>
                  <input
                    name="city"
                    className="form-control auth-input"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label auth-label">Area</label>
                  <input
                    name="area"
                    className="form-control auth-input"
                    value={form.area}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label auth-label">Hourly Rate</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    className="form-control auth-input"
                    value={form.hourlyRate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label auth-label">Address</label>
                  <input
                    name="address"
                    className="form-control auth-input"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label auth-label">Service Category</label>
                  <select
                    name="categoryId"
                    className="form-select auth-input"
                    value={form.categoryId}
                    onChange={handleChange}
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
                  <label className="form-label auth-label">Skills</label>
                  <input
                    name="skills"
                    className="form-control auth-input"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="e.g. plumbing, pipe fitting, installation"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label auth-label">Bio</label>
                  <textarea
                    name="bio"
                    className="form-control auth-input auth-textarea"
                    rows="5"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Write a short description about your services and experience"
                  />
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                <button
                  className="btn btn-primary rounded-pill px-4 py-3 fw-semibold"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Saving...
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
      </section>
    </>
  );
};

export default Profile;