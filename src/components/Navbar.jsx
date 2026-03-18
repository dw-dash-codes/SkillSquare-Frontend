import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import axios from "axios"; // 👈 Import Axios

const Navbar = () => {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const navigate = useNavigate();

  // 👇 State to track unread notifications
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  // 👇 API Fetch Logic (Sirf tab chalega jab user logged in ho)
  useEffect(() => {
    if (role) {
      const checkUnreadNotifications = async () => {
        try {
          const res = await axios.get(
            "https://localhost:7095/api/Notification/myNotifications",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // Check karo agar koi bhi notification unread hai
          // (Assuming tumhari backend "isDeleted" bhi handle kar rahi hai, usko filter kar lena behtar hai)
          const unreadExists = res.data.some((n) => !n.isRead && !n.isDeleted);
          setHasUnreadNotifications(unreadExists);
        } catch (err) {
          console.error("Navbar Notification Check Error:", err);
        }
      };

      checkUnreadNotifications();

      // Optional: Har 1 minute baad dobara check karo (Polling)
      const interval = setInterval(checkUnreadNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [role]);

  // 👇 Reusable Notification Icon Component with Badge
  const NotificationIcon = () => (
    <div style={{ position: "relative", display: "inline-block" }}>
      <i className="fas fa-bell"></i>
      {hasUnreadNotifications && (
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            height: "10px",
            width: "10px",
            backgroundColor: "red",
            borderRadius: "50%",

            display: "block",
          }}
        ></span>
      )}
    </div>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img src="nav_logo.png" alt="" style={{ width: "150px", height: "auto" }}/>
          </NavLink>

          <button
            className="navbar-toggler"
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
            <ul className="navbar-nav ms-auto align-items-lg-center">
              {/* ✅ If role === Admin */}
              {role === "Admin" && (
                <>
                  <li className="nav-item">
                    <NavLink 
                      to="/admin" 
                      className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                    >
                      <i className="fas fa-user-shield me-1"></i>Admin Panel
                    </NavLink>
                  </li>
                  
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger ms-lg-2"
                    >
                      <i className="fas fa-sign-out-alt me-1"></i>Logout
                    </button>
                  </li>
                </>
              )}
              {/* ✅ If role === Provider */}
              {role === "Provider" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/provider"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      <i className="fas fa-tachometer-alt me-1"></i>Dashboard
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/provider/profile"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      <i className="fas fa-user-circle me-1"></i>Profile
                    </NavLink>
                  </li>

                  {/* 🔔 Notification Link with Dot */}
                  <li className="nav-item">
                    <NavLink
                      to="/notifications"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      {/* Using the component created above */}
                      <NotificationIcon />
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger ms-lg-2"
                    >
                      <i className="fas fa-sign-out-alt me-1"></i>Logout
                    </button>
                  </li>
                </>
              )}

              {/* ✅ If role === Customer */}
              {role === "Customer" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/categories"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      <i className="fas fa-tools me-1"></i>Services
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/my-bookings"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      <i className="fas fa-bookmark me-1"></i>My Bookings
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/user-profile"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      <i className="fas fa-user-circle me-1"></i>Profile
                    </NavLink>
                  </li>

                  {/* 🔔 Notification Link with Dot */}
                  <li className="nav-item">
                    <NavLink
                      to="/notifications"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      <NotificationIcon />
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger ms-lg-2"
                    >
                      <i className="fas fa-sign-out-alt me-1"></i>Logout
                    </button>
                  </li>
                </>
              )}

              {/* Guest Logic (No Changes needed here usually) */}
              {!role && (
                <>
                  {/* ... Baki same guest links ... */}
                  <li className="nav-item">
                    <NavLink to="/categories" className="nav-link">
                      <i className="fas fa-tools me-1"></i>Services
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      <i className="fas fa-sign-in-alt me-1"></i>Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/getstarted"
                      className="btn btn-primary ms-lg-2"
                    >
                      <i className="fas fa-rocket me-1"></i>Get Started
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
