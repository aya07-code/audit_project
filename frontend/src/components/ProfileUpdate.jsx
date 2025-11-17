import React, { useState } from "react";
import SidebarAdmin from "./SidebarAdmin";
import Sidebar from "./Sidebar";
import ProfileTable from "./ProfileTable";
import "../styles/DashboardAdmin.css";


const tabs = ["Edit Profile", "Password"];

const ProfileUpdate = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <SidebarAdmin />
      <main className="admin-content">
        <ProfileTable />
      </main>
    </div>
  );
};

export default ProfileUpdate;
