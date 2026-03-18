import React from "react";
import { Outlet } from "react-router-dom";
import ProviderSidebar from "../components/ProviderSidebar";
import ProviderFooter from "../components/ProviderFooter";

const ProviderLayout = () => {
  return (
    <>
      <div className="hold-transition sidebar-mini layout-fixed">
        <div className="wrapper">
          <ProviderSidebar />

          <div className="content-wrapper">
            <Outlet />
          </div>

          {/* Footer */}
          <ProviderFooter />
        </div>
      </div>
    </>
  );
};

export default ProviderLayout;
