import React from "react";
import SidebarAdmin from "./SidebarAdmin";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import "../styles/DashboardAdmin.css";

const DashboardAdmin = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <SidebarAdmin />
      <main className="admin-content">
        <DashboardHome />
      </main>
    </div>
  );
};

export default DashboardAdmin;
