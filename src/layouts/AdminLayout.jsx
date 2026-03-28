import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <main className="admin-content">
          <Outlet />
        </main>

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;