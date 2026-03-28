import React from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../services/authService";

const AdminSidebar = () => {
  const sidebarLinkClass = ({ isActive }) =>
    `admin-sidebar-link ${isActive ? "active" : ""}`;

  return (
    <>
      <header className="admin-topbar d-lg-none">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <NavLink to="/admin" className="admin-mobile-brand text-decoration-none">
            Skill Square
          </NavLink>

          <button
            className="btn admin-topbar-icon"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#adminSidebarDrawer"
            aria-controls="adminSidebarDrawer"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      <aside className="admin-sidebar d-none d-lg-flex">
        <div className="admin-sidebar-inner">
          <div className="admin-sidebar-brand">
            <h5 className="mb-0 fw-bold">Skill Square</h5>
            <p className="mb-0 text-secondary small">Admin Panel</p>
          </div>

          <nav className="admin-sidebar-nav">
            <NavLink end to="/admin" className={sidebarLinkClass}>
              <i className="fas fa-th-large"></i>
              <span>Dashboard</span>
            </NavLink>

            <div className="admin-sidebar-label">Management</div>

            <NavLink to="/admin/getAllUsers" className={sidebarLinkClass}>
              <i className="fas fa-users"></i>
              <span>Users</span>
            </NavLink>

            <NavLink to="/admin/getAllProviders" className={sidebarLinkClass}>
              <i className="fas fa-user-tie"></i>
              <span>Providers</span>
            </NavLink>

            <NavLink to="/admin/getAllcategories" className={sidebarLinkClass}>
              <i className="fas fa-th-list"></i>
              <span>Categories</span>
            </NavLink>

            <NavLink to="/admin/getAllbookings" className={sidebarLinkClass}>
              <i className="fas fa-calendar-check"></i>
              <span>Bookings</span>
            </NavLink>

            <NavLink to="/admin/getAllReviews" className={sidebarLinkClass}>
              <i className="fas fa-star"></i>
              <span>Reviews</span>
            </NavLink>

            
          </nav>

          <div className="admin-sidebar-bottom">
            <NavLink to="/" className="admin-sidebar-secondary text-decoration-none">
              <i className="fas fa-globe me-2"></i>
              View Site
            </NavLink>

            <NavLink
              onClick={logoutUser}
              to="/"
              className="admin-sidebar-logout text-decoration-none"
            >
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </NavLink>
          </div>
        </div>
      </aside>

      <div
        className="offcanvas offcanvas-start admin-mobile-drawer"
        tabIndex="-1"
        id="adminSidebarDrawer"
        aria-labelledby="adminSidebarDrawerLabel"
      >
        <div className="offcanvas-header">
          <div>
            <h5 className="mb-0 fw-bold" id="adminSidebarDrawerLabel">
              Skill Square
            </h5>
            <p className="mb-0 text-secondary small">Admin Panel</p>
          </div>

          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          <nav className="admin-sidebar-nav">
            <NavLink
              end
              to="/admin"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-th-large"></i>
              <span>Dashboard</span>
            </NavLink>

            <div className="admin-sidebar-label">Management</div>

            <NavLink
              to="/admin/getAllUsers"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-users"></i>
              <span>Users</span>
            </NavLink>

            <NavLink
              to="/admin/getAllProviders"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-user-tie"></i>
              <span>Providers</span>
            </NavLink>

            <NavLink
              to="/admin/getAllcategories"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-th-list"></i>
              <span>Categories</span>
            </NavLink>

            <NavLink
              to="/admin/getAllbookings"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-calendar-check"></i>
              <span>Bookings</span>
            </NavLink>

            <NavLink
              to="/admin/getAllReviews"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-star"></i>
              <span>Reviews</span>
            </NavLink>

            <NavLink
              to="/admin/profile"
              className={sidebarLinkClass}
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </NavLink>
          </nav>

          <div className="admin-sidebar-bottom mt-auto">
            <NavLink
              to="/"
              className="admin-sidebar-secondary text-decoration-none"
              data-bs-dismiss="offcanvas"
            >
              <i className="fas fa-globe me-2"></i>
              View Site
            </NavLink>

            <NavLink
              onClick={logoutUser}
              to="/"
              className="admin-sidebar-logout text-decoration-none"
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

export default AdminSidebar;