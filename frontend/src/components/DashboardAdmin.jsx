import React from "react";
import SidebarAdmin from "./SidebarAdmin";
import SidebarDash from "./SidebarDash";
import DashboardHome from "./DashboardHome";
import "../styles/DashboardAdmin.css";

const DashboardAdmin = () => {
  return (
    <div className="admin-dashboard">
      <SidebarDash />
      <SidebarAdmin />
      <main className="admin-content">
        <DashboardHome />
      </main>
    </div>
  );
};

export default DashboardAdmin;
