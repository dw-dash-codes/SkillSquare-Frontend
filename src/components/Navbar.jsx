import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import axios from "axios";
import ModalAlert from "./ModalAlert";

const API_BASE_URL =
  "https://skillsquare-live-api-b9czenhchfhxdwbp.centralindia-01.azurewebsites.net";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [showProviderNotifPrompt, setShowProviderNotifPrompt] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  useEffect(() => {
    if (!role) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/Notification/myNotifications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setNotifications(res.data || []);
        const unreadExists = (res.data || []).some(
          (n) => !n.isRead && !n.isDeleted
        );
        setHasUnreadNotifications(unreadExists);
      } catch (err) {
        console.error("Navbar Notification Check Error:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [role]);

  const latestNotifications = useMemo(() => {
    return notifications
      .filter((n) => !n.isDeleted)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [notifications]);

  const handleNotificationAction = async (notif) => {
    try {
      const token = localStorage.getItem("token");

      if (!notif.isRead) {
        await axios.put(
          `${API_BASE_URL}/api/Notification/${notif.id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );

      const remainingUnread = notifications.some(
        (n) => n.id !== notif.id && !n.isRead && !n.isDeleted
      );
      setHasUnreadNotifications(remainingUnread);

      const isReviewType = notif.type === "BookingCompleted";
      const isReviewMessage =
        notif.message &&
        (notif.message.includes("marked as completed") ||
          notif.message.includes("leave a review"));

      if (isReviewType || isReviewMessage) {
        if (role === "Provider") {
          navigate("/provider/notifications");
        } else {
          navigate("/notifications");
        }
        return;
      }

      if (role === "Provider") {
        navigate("/provider/my-bookings");
      } else {
        navigate("/my-bookings");
      }
    } catch (err) {
      console.error("Error handling navbar notification click:", err);

      if (role === "Provider") {
        navigate("/provider/notifications");
      } else {
        navigate("/notifications");
      }
    }
  };

  const handleSeeAllNotifications = () => {
    if (role === "Provider") {
      setShowProviderNotifPrompt(true);
    } else {
      navigate("/notifications");
    }
  };

  const handleProviderBellClick = () => {
    setShowProviderNotifPrompt(true);
  };

  const NotificationPreview = () => (
    <div className="app-notification-menu">
      <div className="app-notification-menu-header">
        <h6 className="mb-0 fw-semibold">Notifications</h6>
      </div>

      <div className="app-notification-menu-body">
        {latestNotifications.length === 0 ? (
          <div className="app-notification-empty">
            <i className="far fa-bell-slash mb-2"></i>
            <p className="mb-0">No notifications yet.</p>
          </div>
        ) : (
          latestNotifications.map((notif) => (
            <button
              key={notif.id}
              type="button"
              className={`app-notification-preview-item ${
                notif.isRead ? "is-read" : "is-unread"
              }`}
              onClick={() => handleNotificationAction(notif)}
            >
              <div className="app-notification-preview-icon">
                {notif.type === "BookingCompleted" ||
                (notif.message && notif.message.includes("review")) ? (
                  <i className="fas fa-star"></i>
                ) : (
                  <i className="fas fa-bell"></i>
                )}
              </div>

              <div className="app-notification-preview-content">
                <div className="app-notification-preview-text">
                  {notif.message}
                </div>
                <div className="app-notification-preview-time">
                  {new Date(notif.createdAt).toLocaleString()}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="app-notification-menu-footer">
        <button
          type="button"
          className="btn btn-primary btn-sm rounded-pill px-3"
          onClick={handleSeeAllNotifications}
        >
          See all notifications
        </button>
      </div>
    </div>
  );

  const navLinkClass = ({ isActive }) =>
    `nav-link app-nav-link ${isActive ? "active" : ""}`;

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top app-navbar">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="nav_logo.png"
              alt="Skill Square"
              className="img-fluid app-navbar-logo"
            />
          </NavLink>

          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              {role === "Admin" && (
                <>
                  <li className="nav-item">
                    <NavLink to="/admin" className={navLinkClass}>
                      <i className="fas fa-user-shield me-2"></i>
                      Admin Panel
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger rounded-pill px-4 ms-lg-2"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </>
              )}

              {role === "Provider" && (
                <>
                  <li className="nav-item">
                    <NavLink to="/provider" className={navLinkClass}>
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/provider/profile" className={navLinkClass}>
                      <i className="fas fa-user-circle me-2"></i>
                      Profile
                    </NavLink>
                  </li>

                  <li className="nav-item app-notification-nav-item d-none d-lg-block">
                    <button
                      type="button"
                      className="nav-link app-nav-link border-0 bg-transparent"
                      onClick={handleProviderBellClick}
                    >
                      <span className="app-notification-icon">
                        <i className="fas fa-bell"></i>
                        {hasUnreadNotifications && (
                          <span className="app-notification-dot"></span>
                        )}
                      </span>
                    </button>
                    <NotificationPreview />
                  </li>

                  <li className="nav-item d-lg-none">
                    <button
                      type="button"
                      className="nav-link app-nav-link border-0 bg-transparent"
                      onClick={handleProviderBellClick}
                    >
                      <span className="app-notification-icon">
                        <i className="fas fa-bell"></i>
                        {hasUnreadNotifications && (
                          <span className="app-notification-dot"></span>
                        )}
                      </span>
                    </button>
                  </li>

                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger rounded-pill px-4 ms-lg-2"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </>
              )}

              {role === "Customer" && (
                <>
                  <li className="nav-item">
                    <NavLink to="/categories" className={navLinkClass}>
                      <i className="fas fa-tools me-2"></i>
                      Services
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/my-bookings" className={navLinkClass}>
                      <i className="fas fa-bookmark me-2"></i>
                      My Bookings
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/user-profile" className={navLinkClass}>
                      <i className="fas fa-user-circle me-2"></i>
                      Profile
                    </NavLink>
                  </li>

                  <li className="nav-item app-notification-nav-item d-none d-lg-block">
                    <NavLink to="/notifications" className={navLinkClass}>
                      <span className="app-notification-icon">
                        <i className="fas fa-bell"></i>
                        {hasUnreadNotifications && (
                          <span className="app-notification-dot"></span>
                        )}
                      </span>
                    </NavLink>
                    <NotificationPreview />
                  </li>

                  <li className="nav-item d-lg-none">
                    <NavLink to="/notifications" className={navLinkClass}>
                      <span className="app-notification-icon">
                        <i className="fas fa-bell"></i>
                        {hasUnreadNotifications && (
                          <span className="app-notification-dot"></span>
                        )}
                      </span>
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger rounded-pill px-4 ms-lg-2"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </>
              )}

              {!role && (
                <>
                  <li className="nav-item">
                    <NavLink to="/categories" className={navLinkClass}>
                      <i className="fas fa-tools me-2"></i>
                      Services
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/login" className={navLinkClass}>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Login
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/getstarted"
                      className="btn btn-primary rounded-pill px-4 ms-lg-2"
                    >
                      <i className="fas fa-rocket me-2"></i>
                      Get Started
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {showProviderNotifPrompt && (
        <ModalAlert
          type="info"
          title="Open Provider Notifications?"
          message="This will take you to the Provider Dashboard notifications page."
          actions={[
            {
              label: "Proceed",
              onClick: () => {
                setShowProviderNotifPrompt(false);
                navigate("/provider/notifications");
              },
            },
            {
              label: "Cancel",
              onClick: () => {
                setShowProviderNotifPrompt(false);
              },
            },
          ]}
          onClose={() => setShowProviderNotifPrompt(false)}
        />
      )}
    </>
  );
};

export default Navbar;