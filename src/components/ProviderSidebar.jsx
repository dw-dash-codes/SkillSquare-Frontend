import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../services/authService";
import axios from "axios";

const API_BASE_URL =
  "https://skillsquare-live-api-b9czenhchfhxdwbp.centralindia-01.azurewebsites.net";

const ProviderSidebar = () => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarLinkClass = ({ isActive }) =>
    `provider-sidebar-link font-body ${isActive ? "active" : ""}`;

  return (
    <>
      <style>
        {`
          @media (min-width: 992px) {
            .provider-main {
              margin-left: ${isCollapsed ? '80px' : '260px'} !important;
              transition: margin-left 0.3s ease;
            }
            .provider-sidebar {
              width: ${isCollapsed ? '80px' : '260px'} !important;
              transition: width 0.3s ease;
            }
            .provider-sidebar-link {
              justify-content: ${isCollapsed ? 'center' : 'flex-start'};
              padding: ${isCollapsed ? '0.9rem 0' : '0.9rem 1rem'} !important;
            }
            
            /* Hide text strings, but specifically keep icons visible */
            .provider-sidebar-link > span:not(.provider-link-icon-wrap) {
              display: ${isCollapsed ? 'none' : 'block'};
            }
            
            .provider-sidebar-secondary span,
            .provider-sidebar-logout span {
              display: ${isCollapsed ? 'none' : 'block'};
            }

            .provider-sidebar-brand h5, .provider-sidebar-brand p {
              display: ${isCollapsed ? 'none' : 'block'};
            }
            .collapse-btn-icon {
              transform: ${isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'};
              transition: transform 0.3s ease;
            }
            .provider-sidebar-link.active {
              background: rgba(242, 122, 33, 0.1) !important;
              color: var(--app-primary) !important;
            }
            .provider-sidebar-link.active i {
              color: var(--app-primary) !important;
            }
          }
        `}
      </style>

      {/* --- Mobile Topbar --- */}
      <header className="provider-topbar d-lg-none bg-white shadow-sm">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <NavLink to="/provider" className="text-decoration-none d-flex align-items-center">
            <img src="logo_wt_1.png" alt="Logo" style={{ height: '28px', width: 'auto', marginRight: '8px' }} />
            <span className="font-display fw-bold text-dark fs-5">
              SkillSquare
            </span>
          </NavLink>

          <div className="d-flex align-items-center gap-2">
            <NavLink
              to="/provider/notifications"
              className="provider-topbar-icon text-decoration-none"
            >
              <span className="app-notification-icon">
                <i className="fas fa-bell"></i>
                {hasUnreadNotifications && <span className="app-notification-dot" style={{ background: 'var(--app-primary)' }}></span>}
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

      {/* --- Desktop Sidebar --- */}
      <aside className="provider-sidebar d-none d-lg-flex shadow-sm bg-white border-end">
        <div className="provider-sidebar-inner w-100">
          
          <div className={`provider-sidebar-brand d-flex align-items-center ${isCollapsed ? 'justify-content-center' : ''}`}>
            <img 
              src="logo_wt_1.png" 
              alt="Logo" 
              style={{ 
                height: '32px', 
                width: 'auto', 
                marginRight: isCollapsed ? '0' : '8px',
                transition: 'margin 0.3s ease'
              }} 
            />
            <div>
              <h5 className="mb-0 fw-bold font-display text-dark fs-6 text-nowrap">SkillSquare</h5>
              <p className="mb-0 text-secondary small font-body text-nowrap">Provider Panel</p>
            </div>
          </div>

          <nav className="provider-sidebar-nav mt-2">
            <NavLink to="/provider" end className={sidebarLinkClass} title="Dashboard">
              <i className="fas fa-th-large fs-6"></i>
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/provider/profile" className={sidebarLinkClass} title="My Profile">
              <i className="fas fa-user-edit fs-6"></i>
              <span>My Profile</span>
            </NavLink>

            <NavLink to="/provider/my-bookings" className={sidebarLinkClass} title="Bookings">
              <i className="fas fa-calendar-alt fs-6"></i>
              <span>Bookings</span>
            </NavLink>

            <NavLink to="/provider/my-reviews" className={sidebarLinkClass} title="Reviews">
              <i className="fas fa-star fs-6"></i>
              <span>Reviews</span>
            </NavLink>

            <NavLink to="/provider/notifications" className={sidebarLinkClass} title="Notifications">
              <span className="provider-link-icon-wrap" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <i className="fas fa-bell fs-6"></i>
                {hasUnreadNotifications && <span className="provider-sidebar-dot" style={{ background: 'var(--app-primary)' }}></span>}
              </span>
              <span>Notifications</span>
            </NavLink>
          </nav>

          <div className="provider-sidebar-bottom mt-auto">
            {/* Collapse Toggle Button */}
            <button 
              className="btn btn-light w-100 d-flex align-items-center text-secondary border-0 mb-2 p-2 hover-primary"
              onClick={toggleCollapse}
              style={{ background: 'var(--app-surface-muted)', borderRadius: '0.75rem', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
            >
              <i className={`fas fa-chevron-left collapse-btn-icon ${isCollapsed ? '' : 'me-2'}`}></i>
              <span className="font-body fw-bold small" style={{ display: isCollapsed ? 'none' : 'block' }}>Collapse Menu</span>
            </button>

            <NavLink to="/" className={`provider-sidebar-secondary text-decoration-none font-body ${isCollapsed ? 'justify-content-center px-0' : ''}`} title="View Site">
              <i className={`fas fa-globe ${isCollapsed ? '' : 'me-2'}`}></i>
              <span>View Site</span>
            </NavLink>

            <NavLink
              to="/login"
              onClick={() => localStorage.clear()}
              className={`provider-sidebar-logout text-decoration-none font-body fw-bold ${isCollapsed ? 'justify-content-center px-0' : ''}`}
              title="Logout"
            >
              <i className={`fas fa-sign-out-alt ${isCollapsed ? '' : 'me-2'}`}></i>
              <span>Logout</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* --- Mobile Offcanvas Drawer --- */}
      <div
        className="offcanvas offcanvas-start provider-mobile-drawer border-0 shadow"
        tabIndex="-1"
        id="providerSidebarDrawer"
        aria-labelledby="providerSidebarDrawerLabel"
      >
        <div className="offcanvas-header border-bottom p-4">
          <div className="d-flex align-items-center">
            <img 
              src="logo_wt_1.png" 
              alt="Logo" 
              style={{ 
                height: '32px', 
                width: 'auto', 
                marginRight: isCollapsed ? '0' : '8px',
                transition: 'margin 0.3s ease'
              }} 
            />
            <div>
              <h5 className="mb-0 fw-bold font-display text-dark" id="providerSidebarDrawerLabel">
                SkillSquare
              </h5>
              <p className="mb-0 text-secondary small font-body">Provider Panel</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-close shadow-none"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column p-4">
          <nav className="provider-sidebar-nav">
            <NavLink
              to="/provider"
              end
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-th-large me-2"></i>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/provider/profile"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-user-edit me-2"></i>
              <span>My Profile</span>
            </NavLink>

            <NavLink
              to="/provider/my-bookings"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-calendar-alt me-2"></i>
              <span>Bookings</span>
            </NavLink>

            <NavLink
              to="/provider/my-reviews"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-star me-2"></i>
              <span>Reviews</span>
            </NavLink>

            <NavLink
              to="/provider/notifications"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <span className="provider-link-icon-wrap me-2" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <i className="fas fa-bell"></i>
                {hasUnreadNotifications && <span className="provider-sidebar-dot" style={{ background: 'var(--app-primary)' }}></span>}
              </span>
              <span>Notifications</span>
            </NavLink>
          </nav>

          <div className="provider-sidebar-bottom mt-auto">
            <NavLink
              to="/"
              className="provider-sidebar-secondary text-decoration-none font-body"
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-globe me-2"></i>
              View Site
            </NavLink>

            <NavLink
              to="/login"
              onClick={() => localStorage.clear()}
              className="provider-sidebar-logout text-decoration-none font-body fw-bold"
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