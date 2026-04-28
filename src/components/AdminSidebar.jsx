import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../services/authService";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarLinkClass = ({ isActive }) =>
    `admin-sidebar-link font-body ${isActive ? "active" : ""}`;

  return (
    <>
      <style>
        {`
          @media (min-width: 992px) {
            .admin-main {
              margin-left: ${isCollapsed ? '80px' : '260px'} !important;
              transition: margin-left 0.3s ease;
            }
            .admin-sidebar {
              width: ${isCollapsed ? '80px' : '260px'} !important;
              transition: width 0.3s ease;
            }
            .admin-sidebar-link {
              justify-content: ${isCollapsed ? 'center' : 'flex-start'};
              padding: ${isCollapsed ? '0.9rem 0' : '0.9rem 1rem'} !important;
            }
            
            /* Hide text for main links AND bottom links when collapsed */
            .admin-sidebar-link span, 
            .admin-sidebar-label,
            .admin-sidebar-secondary span,
            .admin-sidebar-logout span {
              display: ${isCollapsed ? 'none' : 'block'};
            }

            .admin-sidebar-brand h5, .admin-sidebar-brand p {
              display: ${isCollapsed ? 'none' : 'block'};
            }
            .collapse-btn-icon {
              transform: ${isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'};
              transition: transform 0.3s ease;
            }
            .admin-sidebar-link.active {
              background: rgba(242, 122, 33, 0.1) !important;
              color: var(--app-primary) !important;
            }
            .admin-sidebar-link.active i {
              color: var(--app-primary) !important;
            }
          }
        `}
      </style>

      {/* Mobile Header */}
      <header className="admin-topbar d-lg-none bg-white shadow-sm">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <NavLink to="/admin" className="text-decoration-none d-flex align-items-center">
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
            <span className="font-display fw-bold text-dark fs-5">
              SkillSquare
            </span>
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

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar d-none d-lg-flex shadow-sm bg-white border-end">
        <div className="admin-sidebar-inner w-100">
          <div className={`admin-sidebar-brand d-flex align-items-center ${isCollapsed ? 'justify-content-center' : ''}`}>
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
              <p className="mb-0 text-secondary small font-body text-nowrap">Admin Panel</p>
            </div>
          </div>

          <nav className="admin-sidebar-nav mt-2">
            <NavLink end to="/admin" className={sidebarLinkClass} title="Dashboard">
              <i className="fas fa-th-large fs-6"></i>
              <span>Dashboard</span>
            </NavLink>

            <div className="admin-sidebar-label mt-3 mb-2 text-uppercase text-secondary fw-bold small" style={{ letterSpacing: '1px', fontSize: '0.75rem', paddingLeft: '1rem' }}>
              Management
            </div>

            <NavLink to="/admin/getAllUsers" className={sidebarLinkClass} title="Users">
              <i className="fas fa-users fs-6"></i>
              <span>Users</span>
            </NavLink>

            <NavLink to="/admin/getAllProviders" className={sidebarLinkClass} title="Providers">
              <i className="fas fa-user-tie fs-6"></i>
              <span>Providers</span>
            </NavLink>

            <NavLink to="/admin/getAllcategories" className={sidebarLinkClass} title="Categories">
              <i className="fas fa-th-list fs-6"></i>
              <span>Categories</span>
            </NavLink>

            <NavLink to="/admin/getAllbookings" className={sidebarLinkClass} title="Bookings">
              <i className="fas fa-calendar-check fs-6"></i>
              <span>Bookings</span>
            </NavLink>

            <NavLink to="/admin/getAllReviews" className={sidebarLinkClass} title="Reviews">
              <i className="fas fa-star fs-6"></i>
              <span>Reviews</span>
            </NavLink>
          </nav>

          <div className="admin-sidebar-bottom mt-auto">
            <button 
              className="btn btn-light w-100 d-flex align-items-center text-secondary border-0 mb-2 p-2 hover-primary"
              onClick={toggleCollapse}
              style={{ background: 'var(--app-surface-muted)', borderRadius: '0.75rem', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
            >
              <i className={`fas fa-chevron-left collapse-btn-icon ${isCollapsed ? '' : 'me-2'}`}></i>
              <span className="font-body fw-bold small" style={{ display: isCollapsed ? 'none' : 'block' }}>Collapse Menu</span>
            </button>

            <NavLink to="/" className={`admin-sidebar-secondary text-decoration-none font-body ${isCollapsed ? 'justify-content-center px-0' : ''}`} title="View Site">
              <i className={`fas fa-globe ${isCollapsed ? '' : 'me-2'}`}></i>
              <span>View Site</span>
            </NavLink>

            <NavLink
              onClick={logoutUser}
              to="/"
              className={`admin-sidebar-logout text-decoration-none font-body fw-bold ${isCollapsed ? 'justify-content-center px-0' : ''}`}
              title="Logout"
            >
              <i className={`fas fa-sign-out-alt ${isCollapsed ? '' : 'me-2'}`}></i>
              <span>Logout</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div
        className="offcanvas offcanvas-start admin-mobile-drawer border-0 shadow"
        tabIndex="-1"
        id="adminSidebarDrawer"
        aria-labelledby="adminSidebarDrawerLabel"
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
              <h5 className="mb-0 fw-bold font-display text-dark" id="adminSidebarDrawerLabel">SkillSquare</h5>
              <p className="mb-0 text-secondary small font-body">Admin Panel</p>
            </div>
          </div>
          <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <div className="offcanvas-body d-flex flex-column p-4">
          <nav className="admin-sidebar-nav">
            <NavLink end to="/admin" className={sidebarLinkClass} data-bs-dismiss="offcanvas">
              <i className="fas fa-th-large me-2"></i><span>Dashboard</span>
            </NavLink>

            <div className="admin-sidebar-label mt-3 mb-2 text-uppercase text-secondary fw-bold small" style={{ letterSpacing: '1px', fontSize: '0.75rem', paddingLeft: '1rem' }}>
              Management
            </div>

            <NavLink to="/admin/getAllUsers" className={sidebarLinkClass} data-bs-dismiss="offcanvas">
              <i className="fas fa-users me-2"></i><span>Users</span>
            </NavLink>
            <NavLink to="/admin/getAllProviders" className={sidebarLinkClass} data-bs-dismiss="offcanvas">
              <i className="fas fa-user-tie me-2"></i><span>Providers</span>
            </NavLink>
            <NavLink to="/admin/getAllcategories" className={sidebarLinkClass} data-bs-dismiss="offcanvas">
              <i className="fas fa-th-list me-2"></i><span>Categories</span>
            </NavLink>
            <NavLink to="/admin/getAllbookings" className={sidebarLinkClass} data-bs-dismiss="offcanvas">
              <i className="fas fa-calendar-check me-2"></i><span>Bookings</span>
            </NavLink>
            <NavLink to="/admin/getAllReviews" className={sidebarLinkClass} data-bs-dismiss="offcanvas">
              <i className="fas fa-star me-2"></i><span>Reviews</span>
            </NavLink>
            <NavLink to="/admin/profile" className={sidebarLinkClass} data-bs-dismiss="offcanvas">
              <i className="fas fa-user me-2"></i><span>Profile</span>
            </NavLink>
          </nav>

          <div className="admin-sidebar-bottom mt-auto">
            <NavLink to="/" className="admin-sidebar-secondary text-decoration-none font-body" data-bs-dismiss="offcanvas">
              <i className="fas fa-globe me-2"></i> View Site
            </NavLink>
            <NavLink onClick={logoutUser} to="/" className="admin-sidebar-logout text-decoration-none font-body fw-bold" data-bs-dismiss="offcanvas">
              <i className="fas fa-sign-out-alt me-2"></i> Logout
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;