import React from "react";
import { Outlet } from "react-router-dom";
import ProviderSidebar from "../components/ProviderSidebar";
import ProviderFooter from "../components/ProviderFooter";

const ProviderLayout = () => {
  return (
    <div className="provider-layout font-body bg-light min-vh-100">
      <ProviderSidebar />

      <div className="provider-main d-flex flex-column min-vh-100">
        <main className="provider-content flex-grow-1 p-4 p-md-5">
          <Outlet />
        </main>
        <ProviderFooter />
      </div>
    </div>
  );
};

export default ProviderLayout;