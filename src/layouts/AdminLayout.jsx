import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminFooter from "../components/AdminFooter";

const AdminLayout = () => {
  return (
    <div className="admin-layout font-body bg-light min-vh-100">
      <AdminSidebar />

      <div className="admin-main d-flex flex-column min-vh-100">
        <main className="admin-content flex-grow-1 p-4 p-md-5">
          <Outlet />
        </main>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout;