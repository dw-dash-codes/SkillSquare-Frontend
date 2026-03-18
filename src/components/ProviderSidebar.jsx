import React, { useEffect, useState } from "react"; // 👈 Import Hooks
import { NavLink } from "react-router-dom";
import { logoutUser } from "../services/authService";
import axios from "axios"; // 👈 Import Axios

const ProviderSidebar = () => {
  // 👇 State for Badge
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // 👇 API Call Logic
  useEffect(() => {
    const checkUnreadNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "https://localhost:7095/api/Notification/myNotifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Check: Unread ho AUR Deleted na ho
        const unreadExists = res.data.some((n) => !n.isRead && !n.isDeleted);
        setHasUnreadNotifications(unreadExists);
      } catch (err) {
        console.error("Sidebar Notification Error:", err);
      }
    };

    checkUnreadNotifications();

    // Optional: Har 1 minute baad refresh kare
    const interval = setInterval(checkUnreadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <NavLink to="/provider" className="nav-link">
              Dashboard
            </NavLink>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto">
          {/* 👇 NOTIFICATION ITEM WITH BADGE */}
          <li className="nav-item">
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <i className="fas fa-bell"></i>

                {/* 👇 Red Dot Logic */}
                {hasUnreadNotifications && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-2px", // Thora adjust kia ta k icon k upar fit aye
                      right: "-2px",
                      height: "8px",
                      width: "8px",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      display: "block",
                    }}
                  ></span>
                )}
              </div>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/provider/profile" className="nav-link">
              <i className="far fa-user"></i> Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              onClick={logoutUser}
              to="/login"
              className="nav-link text-danger"
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Sidebar */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <NavLink to="/provider" className="brand-link">
          <span className="brand-text ms-2">Skill Square</span>
        </NavLink>

        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
              <li className="nav-item">
                <NavLink to="/provider" end className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/provider/profile" className="nav-link">
                  <i className="nav-icon fas fa-user-cog"></i>
                  <p>My Profile</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/provider/my-bookings" className="nav-link">
                  <i className="nav-icon fas fa-calendar-check"></i>
                  <p>Bookings</p>
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/provider/my-reviews" className="nav-link">
                  <i className="nav-icon fas fa-star"></i>
                  <p>Reviews</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default ProviderSidebar;
