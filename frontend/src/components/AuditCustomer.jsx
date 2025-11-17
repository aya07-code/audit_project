import React from "react";
import SidebarCustomer from "./SidebarCustomer";  
import Sidebar from "./Sidebar";
import TableAuditC from "./TableAuditC";
import "../styles/DashboardCustomer.css";

const AuditCustomer = () => {
  return (
    <div className="customer-dashboard">
      <Sidebar />
      <SidebarCustomer />
      <main className="customer-content">
        <TableAuditC />
      </main>
    </div>
  );
};

export default AuditCustomer;
