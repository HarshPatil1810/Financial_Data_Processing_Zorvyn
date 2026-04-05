import React from "react";
import Sidebar from './components/sidebar/Sidebar';
import TopNavbar from './components/sidebar/TopNavbar';
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      {/* Sidebar always visible */}
      <Sidebar />
       <TopNavbar />

      {/* Page content */}
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
