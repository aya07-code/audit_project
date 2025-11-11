import React from "react";
import SidebarAdmin from "./SidebarAdmin";
import SidebarDash from "./SidebarDash";
import CompaniesTable from "./CompaniesTable";
import "../styles/DashboardAdmin.css";


const Companies = () => {
  return (
    <div className="admin-dashboard">
      <SidebarDash />
      <SidebarAdmin />
      <main className="admin-content">
        <CompaniesTable />
      </main>
    </div>
  );
};

export default Companies;
