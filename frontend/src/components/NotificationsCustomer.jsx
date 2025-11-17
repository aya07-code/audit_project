import React from "react";
import SidebarCustomer from "./SidebarCustomer";  
import Sidebar from "./Sidebar";
import "../styles/DashboardCustomer.css";

const NotificationsCustomer = () => {
  return (
    <div className="customer-dashboard">
      <Sidebar />
      <SidebarCustomer />
      <main className="customer-content">
        
      </main>
    </div>
  );
};

export default NotificationsCustomer;
