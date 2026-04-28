import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ModalAlert from "../components/ModalAlert";

const PROFILE_API = "/User/profile";
const UPDATE_PROFILE_API = "/User/profile";

const ProfileManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    area: "",
    city: "",
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
  });

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(PROFILE_API);
        const p = res.data;

        setUserDetails({
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          email: p.email || "",
          phoneNumber: p.phoneNumber || "",
          address: p.address || "",
          area: p.area || "",
          city: p.city || "",
        });

        if (p.firstName || p.lastName) {
          localStorage.setItem(
            "name",
            `${p.firstName || ""} ${p.lastName || ""}`.trim()
          );
        }
        if (p.role) localStorage.setItem("role", p.role);
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }

        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to load profile data.",
          actions: [{ label: "Close" }],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleDetailsChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const request = {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      address: userDetails.address,
      area: userDetails.area,
      city: userDetails.city,
      phoneNumber: userDetails.phoneNumber,
    };

    try {
      await api.put(UPDATE_PROFILE_API, request);

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Profile Saved",
        message: "Your profile details have been updated successfully.",
        actions: [{ label: "OK" }],
      });
    } catch (error) {
      console.error("Profile update failed:", error);

      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: error.response?.data || "Failed to update profile details.",
        actions: [{ label: "Try Again" }],
      });
    } finally {
      setSaving(false);
    }
  };

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

      <section className="app-section bg-light min-vh-100 py-5" style={{ paddingTop: '110px' }}>
        <div className="container">
          <div className="row justify-content-center">
            {/* Centered Profile Form */}
            <div className="col-md-10 col-lg-8 col-xl-7">
              
              <div className="text-center mb-5">
                <h1 className="font-display fw-bold text-dark mb-2">
                  <i className="fas fa-user-circle me-2" style={{ color: 'var(--app-primary)' }}></i>
                  Profile Management
                </h1>
                <p className="text-secondary font-body mb-0 mx-auto" style={{ maxWidth: '600px' }}>
                  Manage your personal information and keep your details up to date.
                </p>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status"></div>
                  <p className="mb-0 text-secondary font-body">Loading profile...</p>
                </div>
              ) : (
                <div className="card app-card border-0 rounded-4 shadow-lg bg-white overflow-hidden">
                  <div className="p-4 p-md-5">
                    <h4 className="font-display fw-bold mb-4 border-bottom pb-3">User Details</h4>
                    
                    <form onSubmit={handleDetailsSubmit} className="font-body">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label htmlFor="firstName" className="form-label fw-bold text-dark small mb-1">First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={userDetails.firstName}
                            onChange={handleDetailsChange}
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            placeholder="First Name"
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="lastName" className="form-label fw-bold text-dark small mb-1">Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={userDetails.lastName}
                            onChange={handleDetailsChange}
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            placeholder="Last Name"
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="email" className="form-label fw-bold text-dark small mb-1">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={userDetails.email}
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem', opacity: '0.7' }}
                            placeholder="Email"
                            readOnly
                            title="Email cannot be changed"
                          />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="phoneNumber" className="form-label fw-bold text-dark small mb-1">Phone Number</label>
                          <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={userDetails.phoneNumber}
                            onChange={handleDetailsChange}
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            placeholder="Enter your phone"
                          />
                        </div>

                        <div className="col-12">
                          <label htmlFor="address" className="form-label fw-bold text-dark small mb-1">Address</label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={userDetails.address}
                            onChange={handleDetailsChange}
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            placeholder="Full Address"
                          />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="city" className="form-label fw-bold text-dark small mb-1">City</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={userDetails.city}
                            onChange={handleDetailsChange}
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            placeholder="City"
                          />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="area" className="form-label fw-bold text-dark small mb-1">Area</label>
                          <input
                            type="text"
                            id="area"
                            name="area"
                            value={userDetails.area}
                            onChange={handleDetailsChange}
                            className="form-control px-3 py-2 bg-light border-0 shadow-none"
                            style={{ borderRadius: '0.75rem' }}
                            placeholder="Sector or Street"
                          />
                        </div>
                      </div>

                      <div className="d-flex flex-column flex-sm-row gap-3 mt-5">
                        <button
                          type="submit"
                          className="btn btn-gradient-warm rounded-pill px-5 py-3 fw-bold shadow-warm flex-grow-1"
                          disabled={saving}
                        >
                          {saving ? (
                            <><i className="fas fa-spinner fa-spin me-2"></i>Saving...</>
                          ) : (
                            <><i className="fas fa-save me-2"></i>Save Changes</>
                          )}
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-secondary rounded-pill px-5 py-3 fw-bold"
                          onClick={() => navigate(-1)}
                          disabled={saving}
                        >
                          <i className="fas fa-times me-2"></i>Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileManagement;