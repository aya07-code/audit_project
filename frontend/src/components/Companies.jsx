import React from "react";
import SidebarAdmin from "./SidebarAdmin";
import Sidebar from "./Sidebar";
import CompaniesTable from "./CompaniesTable";
import "../styles/DashboardAdmin.css";


const Companies = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <SidebarAdmin />
      <main className="admin-content">
        <CompaniesTable />
      </main>
    </div>
  );
};

export default Companies;
