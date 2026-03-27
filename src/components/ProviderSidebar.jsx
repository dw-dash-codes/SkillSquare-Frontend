import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../services/authService";
import axios from "axios";

const API_BASE_URL =
  "https://skillsquare-live-api-b9czenhchfhxdwbp.centralindia-01.azurewebsites.net";

const ProviderSidebar = () => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const checkUnreadNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `${API_BASE_URL}/api/Notification/myNotifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const unreadExists = res.data.some((n) => !n.isRead && !n.isDeleted);
        setHasUnreadNotifications(unreadExists);
      } catch (err) {
        console.error("Sidebar Notification Error:", err);
      }
    };

    checkUnreadNotifications();
    const interval = setInterval(checkUnreadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const sidebarLinkClass = ({ isActive }) =>
    `provider-sidebar-link ${isActive ? "active" : ""}`;

  return (
    <>
      <header className="provider-topbar d-lg-none">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <NavLink to="/provider" className="provider-mobile-brand text-decoration-none">
            Skill Square
          </NavLink>

          <div className="d-flex align-items-center gap-2">
            <NavLink
              to="/provider/notifications"
              className="provider-topbar-icon text-decoration-none"
            >
              <span className="app-notification-icon">
                <i className="fas fa-bell"></i>
                {hasUnreadNotifications && <span className="app-notification-dot"></span>}
              </span>
            </NavLink>

            <button
              className="btn provider-topbar-icon"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#providerSidebarDrawer"
              aria-controls="providerSidebarDrawer"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      <aside className="provider-sidebar d-none d-lg-flex">
        <div className="provider-sidebar-inner">
          <div className="provider-sidebar-brand">
            <h5 className="mb-0 fw-bold">Skill Square</h5>
            <p className="mb-0 text-secondary small">Provider Panel</p>
          </div>

          <nav className="provider-sidebar-nav">
            <NavLink to="/provider" end className={sidebarLinkClass}>
              <i className="fas fa-th-large"></i>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/provider/profile" className={sidebarLinkClass}>
              <i className="fas fa-user"></i>
              <span>My Profile</span>
            </NavLink>

            <NavLink to="/provider/my-bookings" className={sidebarLinkClass}>
              <i className="fas fa-calendar-alt"></i>
              <span>Bookings</span>
            </NavLink>

            <NavLink to="/provider/my-reviews" className={sidebarLinkClass}>
              <i className="fas fa-star"></i>
              <span>Reviews</span>
            </NavLink>

            <NavLink to="/provider/notifications" className={sidebarLinkClass}>
              <span className="provider-link-icon-wrap">
                <i className="fas fa-bell"></i>
                {hasUnreadNotifications && <span className="provider-sidebar-dot"></span>}
              </span>
              <span>Notifications</span>
            </NavLink>
          </nav>

          <div className="provider-sidebar-bottom">
            <NavLink to="/" className="provider-sidebar-secondary text-decoration-none">
              <i className="fas fa-globe me-2"></i>
              View Site
            </NavLink>

            <NavLink
              to="/login"
              onClick={logoutUser}
              className="provider-sidebar-logout text-decoration-none"
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </NavLink>
          </div>
        </div>
      </aside>

      <div
        className="offcanvas offcanvas-start provider-mobile-drawer"
        tabIndex="-1"
        id="providerSidebarDrawer"
        aria-labelledby="providerSidebarDrawerLabel"
      >
        <div className="offcanvas-header">
          <div>
            <h5 className="mb-0 fw-bold" id="providerSidebarDrawerLabel">
              Skill Square
            </h5>
            <p className="mb-0 text-secondary small">Provider Panel</p>
          </div>

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          <nav className="provider-sidebar-nav">
            <NavLink
              to="/provider"
              end
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-th-large"></i>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/provider/profile"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-user"></i>
              <span>My Profile</span>
            </NavLink>

            <NavLink
              to="/provider/my-bookings"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-calendar-alt"></i>
              <span>Bookings</span>
            </NavLink>

            <NavLink
              to="/provider/my-reviews"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-star"></i>
              <span>Reviews</span>
            </NavLink>

            <NavLink
              to="/provider/notifications"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <span className="provider-link-icon-wrap">
                <i className="fas fa-bell"></i>
                {hasUnreadNotifications && <span className="provider-sidebar-dot"></span>}
              </span>
              <span>Notifications</span>
            </NavLink>
          </nav>

          <div className="provider-sidebar-bottom mt-auto">
            <NavLink
              to="/"
              className="provider-sidebar-secondary text-decoration-none"
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-globe me-2"></i>
              View Site
            </NavLink>

            <NavLink
              to="/login"
              onClick={logoutUser}
              className="provider-sidebar-logout text-decoration-none"
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderSidebar;