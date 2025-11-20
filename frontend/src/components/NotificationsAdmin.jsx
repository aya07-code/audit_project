import React from "react";
import SidebarAdmin from "./SidebarAdmin"; 
import Sidebar from "./Sidebar";
import Notifications from "./Notifications";
import "../styles/DashboardAdmin.css";

const NotificationsAdmin = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <SidebarAdmin />
      <main className="admin-content">
        <Notifications />
      </main>
    </div>
  );
};

export default NotificationsAdmin;
