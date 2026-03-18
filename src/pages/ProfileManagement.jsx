import React, { useEffect, useState } from "react";
import api from "../services/api"; // <-- adjust path if yours is different (e.g. ../api or ../../services/api)
import { useNavigate } from "react-router-dom";
import ModalAlert from "../components/ModalAlert"; // 👈 Import the ModalAlert

const PROFILE_API = "/User/profile"; // <-- CHANGE if your controller route is different (e.g. "/profile" or "/Account/profile")
const UPDATE_PROFILE_API = "/User/profile"; // same as PUT endpoint
const CHANGE_PASSWORD_API = "/User/change-password"; // <-- change if your endpoint path different (e.g. "/Account/change-password")

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

  // 👈 Modal State Added Here
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    actions: [],
  });

  // Modal Close Handler
  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // ---- fetch profile on mount ----
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(PROFILE_API);
        const p = res.data;

        // build a readable location string from address/area/city
        const locationParts = [];
        if (p.address) locationParts.push(p.address);
        if (p.area) locationParts.push(p.area);
        if (p.city) locationParts.push(p.city);

        setUserDetails({
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email ?? "",
          phoneNumber: p.phoneNumber ?? "",
          address: p.address ?? "",
          area: p.area ?? "", 
          city: p.city ?? "", 
        });

        // also store name in localStorage for navbar (optional)
        if (p.firstName || p.lastName) {
          localStorage.setItem(
            "name",
            `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim()
          );
        }
        if (p.role) localStorage.setItem("role", p.role);
      } catch (err) {
        console.error("Failed to load profile:", err);
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }
        // Show error modal if fetch fails
        setModalConfig({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to load profile data.",
          actions: [{ label: "Close" }]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ---- handlers ----
  const handleDetailsChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Save profile -> call PUT /profile
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
      
      // 👈 Success Modal
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Profile Saved",
        message: "Your profile details have been updated successfully.",
        actions: [{ label: "OK" }]
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      
      // 👈 Error Modal
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: error.response?.data || "Failed to update profile details.",
        actions: [{ label: "Try Again" }]
      });
    } finally {
      setSaving(false);
    }
  };

  // Change password -> call change password endpoint
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // 👈 Validation Error Modal
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "New password and confirm password do not match.",
        actions: [{ label: "OK" }]
      });
      return;
    }

    try {
      setPwSaving(true);
      await api.post(CHANGE_PASSWORD_API, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Clear the form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // 👈 Success Modal
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Password Changed",
        message: "Your password has been successfully updated.",
        actions: [{ label: "Done" }]
      });
      
    } catch (err) {
      console.error("Password change failed:", err);
      
      // 👈 Error Modal
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Change Failed",
        message: err.response?.data || "Failed to change your password. Please ensure your current password is correct.",
        actions: [{ label: "Close" }]
      });
    } finally {
      setPwSaving(false);
    }
  };

  // ---- render content ----
  const renderContent = () => {
    if (loading)
      return <div className="content-section text-center p-5">Loading profile...</div>;

    switch (activeTab) {
      case "details":
        return (
          <div className="content-section">
            <h2 className="section-heading">
              <i className="fas fa-user-edit me-2"></i>
              User Details
            </h2>

            <form onSubmit={handleDetailsSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={userDetails.firstName}
                    onChange={handleDetailsChange}
                    className="form-input"
                    placeholder="First Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={userDetails.lastName}
                    onChange={handleDetailsChange}
                    className="form-input"
                    placeholder="Last Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userDetails.email}
                    className="form-input bg-light"
                    placeholder="Email"
                    readOnly
                    title="Email cannot be changed"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={userDetails.phoneNumber}
                    onChange={handleDetailsChange}
                    className="form-input"
                    placeholder="Enter your phone"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={userDetails.address}
                    onChange={handleDetailsChange}
                    className="form-input"
                    placeholder="Address"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={userDetails.city}
                    onChange={handleDetailsChange}
                    className="form-input"
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="area">Area</label>
                  <input
                    type="text"
                    id="area"
                    name="area"
                    value={userDetails.area}
                    onChange={handleDetailsChange}
                    className="form-input"
                    placeholder="Sector, or Street number"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                >
                  <i className="fas fa-times me-2"></i>Cancel
                </button>
              </div>
            </form>
          </div>
        );

      case "password":
        return (
          <div className="content-section">
            <h2 className="section-heading">
              <i className="fas fa-lock me-2"></i>Change Password
            </h2>

            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group-full">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group-full">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group-full">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              <div className="password-info">
                <i className="fas fa-info-circle me-2"></i>
                Password must be at least 8 characters long and include
                uppercase, lowercase, and numbers.
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={pwSaving}
                >
                  {pwSaving ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-key me-2"></i>Update Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={pwSaving}
                  onClick={() =>
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                  }
                >
                  <i className="fas fa-times me-2"></i>Clear
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* 👈 Render Modal Alert conditionally at the top level */}
      {modalConfig.isOpen && (
        <ModalAlert
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          actions={modalConfig.actions}
          onClose={closeModal}
        />
      )}

      <div className="profile-container">
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          }

          .profile-container {
            margin-top: 50px;
            min-height: 100vh;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 40px 20px;
          }

          /* Tabs Navigation */
          .tabs-nav {
            max-width: 1200px;
            margin: 0 auto 40px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 10px;
            display: flex;
            gap: 10px;
          }

          .tab-btn {
            flex: 1;
            padding: 15px 30px;
            background: transparent;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            color: #6c757d;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .tab-btn:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
          }

          .tab-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }

          .tab-btn i {
            font-size: 1.2rem;
          }

          /* Content Section */
          .content-section {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 40px;
          }

          .section-heading {
            font-size: 2rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            align-items: center;
          }

          /* Form Styles */
          .profile-form {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-group-full {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: 600px;
          }

          .form-group label,
          .form-group-full label {
            font-weight: 600;
            color: #2c3e50;
            font-size: 0.95rem;
          }

          .form-input {
            padding: 12px 18px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
            font-family: inherit;
          }

          .form-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          .form-input::placeholder {
            color: #adb5bd;
          }

          /* Password Info */
          .password-info {
            background: rgba(102, 126, 234, 0.1);
            padding: 15px 20px;
            border-radius: 10px;
            color: #667eea;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
          }

          /* Form Actions */
          .form-actions {
            display: flex;
            gap: 15px;
            padding-top: 20px;
          }

          .btn-primary {
            background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
            color: white;
            border: none;
            padding: 14px 35px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .btn-primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #ff5252, #ff7979);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
          }

          .btn-primary:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .btn-secondary {
            background: transparent;
            color: #6c757d;
            border: 2px solid #e9ecef;
            padding: 14px 35px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .btn-secondary:hover:not(:disabled) {
            border-color: #667eea;
            color: #667eea;
            background: rgba(102, 126, 234, 0.05);
          }

          .btn-secondary:disabled {
             opacity: 0.7;
             cursor: not-allowed;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .profile-container {
              padding: 20px 15px;
            }

            .tabs-nav {
              flex-direction: column;
              gap: 5px;
            }

            .content-section {
              padding: 25px 20px;
            }

            .section-heading {
              font-size: 1.5rem;
            }

            .form-row {
              grid-template-columns: 1fr;
              gap: 20px;
            }

            .form-actions {
              flex-direction: column;
            }

            .btn-primary,
            .btn-secondary {
              width: 100%;
              justify-content: center;
            }
          }

          @media (max-width: 480px) {
            .tab-btn {
              font-size: 0.9rem;
              padding: 12px 20px;
            }

            .tab-btn i {
              font-size: 1rem;
            }

            .section-heading {
              font-size: 1.3rem;
            }
          }
        `}</style>

        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            <i className="fas fa-user"></i> User Details
          </button>
          <button
            className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            <i className="fas fa-lock"></i> Change Password
          </button>
        </div>

        {renderContent()}
      </div>
    </>
  );
};

export default ProfileManagement;