import React from "react";

import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";
import AdminFooter from "../components/AdminFooter";

const AdminLayout = () => {
  return (
    <>
      <div className="hold-transition sidebar-mini layout-fixed">
        <div className="wrapper">
          <AdminSidebar />

          <div className="content-wrapper">
            <Outlet />
          </div>

          {/* Footer */}
          <AdminFooter />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
