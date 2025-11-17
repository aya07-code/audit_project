import React from "react";
import SidebarAdmin from "./SidebarAdmin";
import Sidebar from "./Sidebar";
import CustomersTable from "./CustomersTable";
import "../styles/DashboardAdmin.css";


const Customers = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <SidebarAdmin />
      <main className="admin-content">
        <CustomersTable />
      </main>
    </div>
  );
};

export default Customers;
