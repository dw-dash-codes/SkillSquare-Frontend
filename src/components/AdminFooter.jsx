import React from "react";

const AdminFooter = () => {
  return (
    <footer className="admin-footer border-top bg-white py-3 mt-auto font-body">
      <div className="container-fluid px-4 px-lg-5">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-secondary small">
          <p className="mb-0">
            <strong className="text-dark fw-bold">© {new Date().getFullYear()} SkillSquare.</strong> All rights reserved.
          </p>
          <p className="mb-0 fw-medium px-3 py-1 rounded-pill" style={{ background: 'var(--app-surface-muted)' }}>
            System Administration
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;