import React from "react";
import SidebarCustomer from "./SidebarCustomer";  
import Sidebar from "./Sidebar";
import "../styles/DashboardCustomer.css";
import DashboardHomeC from "./DashboardHomeC";

const DashboardCustomer = () => {
  return (
    <div className="customer-dashboard">
      <Sidebar />
      <SidebarCustomer />
      <main className="customer-content">
        <DashboardHomeC />
      </main>
    </div>
  );
};

export default DashboardCustomer;
