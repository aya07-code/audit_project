import React from "react";
import SidebarCustomer from "./SidebarCustomer";  
import Sidebar from "./Sidebar";
import CompanyCustomer from "./CompanyCustomer";
import "../styles/DashboardCustomer.css";

const CompanieCustomer = () => {
  return (
    <div className="customer-dashboard">
      <Sidebar />
      <SidebarCustomer />
      <main className="customer-content">
      <CompanyCustomer />
      </main>
    </div>
  );
};

export default CompanieCustomer;
