import React from "react";
import Sidebar from "./Sidebar";
import ActivitiesPage from "./ActivitiesPage";
import Footer1 from "./Footer1";
import "../styles/DashboardAdmin.css";


const Audits = () => {
  return (
    <div>
        <Sidebar />
        <ActivitiesPage />
        <Footer1 />
    </div>
  );
};

export default Audits;
