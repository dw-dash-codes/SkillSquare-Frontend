import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ModalAlert from "../components/ModalAlert";

const PROFILE_API = "/User/profile";
const UPDATE_PROFILE_API = "/User/profile";
const CHANGE_PASSWORD_API = "/User/change-password";

const ProfileManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    area: "",
    city: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email ?? "",
          phoneNumber: p.phoneNumber ?? "",
          address: p.address ?? "",
          area: p.area ?? "",
          city: p.city ?? "",
        });

        if (p.firstName || p.lastName) {
          localStorage.setItem(
            "name",
            `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()
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

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "New password and confirm password do not match.",
        actions: [{ label: "OK" }],
      });
      return;
    }

    try {
      setPwSaving(true);
      await api.post(CHANGE_PASSWORD_API, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Password Changed",
        message: "Your password has been successfully updated.",
        actions: [{ label: "Done" }],
      });
    } catch (err) {
      console.error("Password change failed:", err);

      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Change Failed",
        message:
          err.response?.data ||
          "Failed to change your password. Please ensure your current password is correct.",
        actions: [{ label: "Close" }],
      });
    } finally {
      setPwSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="card app-card border-0 profile-panel-card text-center p-4 p-md-5">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="mb-0 text-secondary">Loading profile...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "details":
        return (
          <div className="card app-card border-0 profile-panel-card">
            <div className="card-body p-4 p-lg-5">
              <h2 className="h4 fw-semibold mb-4">
                <i className="fas fa-user-edit me-2 text-primary"></i>
                User Details
              </h2>

              <form onSubmit={handleDetailsSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label auth-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userDetails.firstName}
                      onChange={handleDetailsChange}
                      className="form-control auth-input"
                      placeholder="First Name"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label auth-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userDetails.lastName}
                      onChange={handleDetailsChange}
                      className="form-control auth-input"
                      placeholder="Last Name"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label auth-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userDetails.email}
                      className="form-control auth-input bg-light"
                      placeholder="Email"
                      readOnly
                      title="Email cannot be changed"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phoneNumber" className="form-label auth-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={userDetails.phoneNumber}
                      onChange={handleDetailsChange}
                      className="form-control auth-input"
                      placeholder="Enter your phone"
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="address" className="form-label auth-label">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={userDetails.address}
                      onChange={handleDetailsChange}
                      className="form-control auth-input"
                      placeholder="Address"
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="city" className="form-label auth-label">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={userDetails.city}
                      onChange={handleDetailsChange}
                      className="form-control auth-input"
                      placeholder="City"
                    />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="area" className="form-label auth-label">
                      Area
                    </label>
                    <input
                      type="text"
                      id="area"
                      name="area"
                      value={userDetails.area}
                      onChange={handleDetailsChange}
                      className="form-control auth-input"
                      placeholder="Sector or Street"
                    />
                  </div>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3 mt-4 pt-2">
                  <button
                    type="submit"
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
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4 py-3 fw-semibold"
                    onClick={() => navigate(-1)}
                    disabled={saving}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "password":
        return (
          <div className="card app-card border-0 profile-panel-card">
            <div className="card-body p-4 p-lg-5">
              <h2 className="h4 fw-semibold mb-4">
                <i className="fas fa-lock me-2 text-primary"></i>
                Change Password
              </h2>

              <form onSubmit={handlePasswordSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="currentPassword" className="form-label auth-label">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-control auth-input"
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="newPassword" className="form-label auth-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-control auth-input"
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="confirmPassword" className="form-label auth-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-control auth-input"
                      placeholder="Re-enter new password"
                      required
                    />
                  </div>
                </div>

                <div className="profile-info-note mt-4">
                  <i className="fas fa-info-circle me-2"></i>
                  Password must be at least 8 characters long and include uppercase,
                  lowercase, and numbers.
                </div>

                <div className="d-flex flex-column flex-sm-row gap-3 mt-4 pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 py-3 fw-semibold"
                    disabled={pwSaving}
                  >
                    {pwSaving ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-key me-2"></i>
                        Update Password
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4 py-3 fw-semibold"
                    disabled={pwSaving}
                    onClick={() =>
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      })
                    }
                  >
                    <i className="fas fa-times me-2"></i>
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return null;
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

      <section className="app-section app-section-hero profile-page">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
              Account Settings
            </span>

            <h1 className="app-section-title mb-3">
              <i className="fas fa-user-cog me-3"></i>
              Profile Management
            </h1>

            <p className="text-secondary mb-0 profile-page-subtitle mx-auto">
              Manage your account information and update your password securely.
            </p>
          </div>

          <div className="profile-tabs-wrap mb-4">
            <button
              className={`profile-tab-btn ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
              type="button"
            >
              <i className="fas fa-user me-2"></i>
              User Details
            </button>

            <button
              className={`profile-tab-btn ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
              type="button"
            >
              <i className="fas fa-lock me-2"></i>
              Change Password
            </button>
          </div>

          {renderContent()}
        </div>
      </section>
    </>
  );
};

export default ProfileManagement;