import React, { useState } from "react";
import SidebarCustomer from "./SidebarCustomer";  
import Sidebar from "./Sidebar";
import ProfileTable from "./ProfileTable";
import "../styles/DashboardCustomer.css";


const tabs = ["Edit Profile", "Password"];

const ProfileUpdateCustomer = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className="customer-dashboard">
      <Sidebar />
      <SidebarCustomer />
      <main className="customer-content">
        <ProfileTable />
      </main>
    </div>
  );
};

export default ProfileUpdateCustomer;
