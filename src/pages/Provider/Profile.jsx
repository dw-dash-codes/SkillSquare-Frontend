import React, { useEffect, useState } from "react";
import api from "../../services/api"; // Make sure path is correct
import { jwtDecode } from "jwt-decode";
import ModalAlert from "../../components/ModalAlert"; // 👈 Import the ModalAlert

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  // 1️⃣ ID store karne ke liye state add ki
  const [userId, setUserId] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    address: "",
    categoryId: "",
    skills: "",
    bio: "",
    hourlyRate: "",
  });

  // 👈 Modal State Added Here
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

  // Modal Close Handler
  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);

      // Token se ID extract ki
      const id =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      // 2️⃣ ID ko state me set kiya taake submit k waqt use kar sakein
      setUserId(id);

      // 👤 Basic profile fetch
      const userRes = await api.get("/User/profile");

      // 🧑‍🔧 Provider profile fetch
      // Note: Backend might return 404 if provider doesn't exist yet, handle gracefully if needed
      let providerData = {};
      try {
        const providerRes = await api.get(`/Provider/${id}`);
        providerData = providerRes.data;
      } catch (error) {
        console.log(
          "User is not a provider yet or error fetching provider details."
        );
      }

      setForm({
        firstName: userRes.data.firstName || "",
        lastName: userRes.data.lastName || "",
        email: userRes.data.email || "",
        phoneNumber: userRes.data.phoneNumber || "",
        city: userRes.data.city || "",
        address: userRes.data.address || "",
        // Provider data (handle nulls safely)
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
      // 👈 Error Modal for missing ID
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
      // 1️⃣ Update USER profile
      await api.put("/User/profile", {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        city: form.city,
        address: form.address,
      });

      // 2️⃣ Update PROVIDER profile (FIXED URL)
      // Ab hum URL me userId pass kar rahe hain
      await api.put(`/Provider/UpdateProfile/${userId}`, {
        firstName: form.firstName, // Backend model validation ke liye ye fields bhejni par sakti hain
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        address: form.address,
        area: form.area || "", // Added default empty string if area is missing
        city: form.city,
        categoryId: Number(form.categoryId), // Ensure number
        skills: form.skills,
        bio: form.bio,
        hourlyRate: Number(form.hourlyRate),
        email: form.email,
        password: "DummyPassword123!",
      });

      // 👈 Success Modal
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been successfully updated.",
        actions: [{ label: "OK" }],
      });
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
      
      // 👈 Error Modal for Update Failure
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: `Profile update failed: ${JSON.stringify(
          err.response?.data || "Unknown Error"
        )}`,
        actions: [{ label: "Close" }],
      });
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <>
      {/* 👈 Render Modal Alert conditionally */}
      {modalConfig.isOpen && (
        <ModalAlert
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          actions={modalConfig.actions}
          onClose={closeModal}
        />
      )}

      <div>
        <div className="content-header">
          <div className="container-fluid">
            <h1 className="m-0">My Profile</h1>
          </div>
        </div>

        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label>First Name</label>
                          <input
                            name="firstName"
                            className="form-control"
                            value={form.firstName}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label>Last Name</label>
                          <input
                            name="lastName"
                            className="form-control"
                            value={form.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label>Email</label>
                        <input
                          className="form-control"
                          value={form.email}
                          disabled
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label>Phone</label>
                          <input
                            name="phoneNumber"
                            className="form-control"
                            value={form.phoneNumber}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label>City</label>
                          <input
                            name="city"
                            className="form-control"
                            value={form.city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label>Address</label>
                        <input
                          name="address"
                          className="form-control"
                          value={form.address}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label>Service Category</label>
                        <select
                          name="categoryId"
                          className="form-select"
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

                      <div className="mb-3">
                        <label>Skills</label>
                        <input
                          name="skills"
                          className="form-control"
                          value={form.skills}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label>Bio</label>
                        <textarea
                          name="bio"
                          className="form-control"
                          rows="4"
                          value={form.bio}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3">
                        <label>Hourly Rate</label>
                        <input
                          type="number"
                          name="hourlyRate"
                          className="form-control"
                          value={form.hourlyRate}
                          onChange={handleChange}
                        />
                      </div>

                      <button className="btn btn-primary">Save Profile</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;