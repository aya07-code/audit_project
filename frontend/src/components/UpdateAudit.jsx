import React from "react";
import SidebarAdmin from "./SidebarAdmin";
import Sidebar from "./Sidebar";
import AuditsTable from "./AuditsTable";
import "../styles/DashboardAdmin.css";


const UpdateAudit = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <SidebarAdmin />
      <main className="admin-content">
        <AuditsTable />
      </main>
    </div>
  );
};

export default UpdateAudit;
