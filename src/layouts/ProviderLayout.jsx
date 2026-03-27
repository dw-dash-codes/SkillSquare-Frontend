import React from "react";
import { Outlet } from "react-router-dom";
import ProviderSidebar from "../components/ProviderSidebar";
import ProviderFooter from "../components/ProviderFooter";

const ProviderLayout = () => {
  return (
    <div className="provider-layout">
      <ProviderSidebar />

      <div className="provider-main">
        <main className="provider-content">
          <Outlet />
        </main>
        <ProviderFooter />
      </div>
    </div>
  );
};

export default ProviderLayout;