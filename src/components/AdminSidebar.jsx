import React from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../services/authService";

const AdminSidebar = () => {
  return (
    <>
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
            <NavLink end to="/admin" className="nav-link">
              Dashboard
            </NavLink>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink to="/admin/profile" className="nav-link">
              Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink onClick={logoutUser} to="/" className="nav-link text-danger">
              Logout
            </NavLink>
          </li>
        </ul>
      </nav>

      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <NavLink to="/admin" className="brand-link ">
          <span className="brand-text ms-2" style={{ textDecoration: "none" }}>
            Skill Square
          </span>
        </NavLink>

        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" role="menu">
              <li className="nav-item">
                <NavLink end to="/admin" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </NavLink>
              </li>

              <li className="nav-header">MANAGEMENT</li>

              <li className="nav-item">
                <NavLink to="/admin/getAllUsers" className="nav-link">
                  <i className="nav-icon fas fa-users"></i>
                  <p>Users</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/getAllProviders" className="nav-link">
                  <i className="nav-icon fas fa-user-tie"></i>
                  <p>Providers</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/getAllcategories" className="nav-link">
                  <i className="nav-icon fas fa-th-list"></i>
                  <p>Categories</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/getAllbookings" className="nav-link">
                  <i className="nav-icon fas fa-calendar-check"></i>
                  <p>Bookings</p>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/getAllReviews" className="nav-link">
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

export default AdminSidebar;
