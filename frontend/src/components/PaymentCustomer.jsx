import React from "react";
import SidebarCustomer from "./SidebarCustomer";  
import Sidebar from "./Sidebar";
import PaymentTableCustomer from "./PaymentTableCustomer";
import "../styles/DashboardCustomer.css";

const PaymentCustomer = () => {
  return (
    <div className="customer-dashboard">
      <Sidebar />
      <SidebarCustomer />
      <main className="customer-content">
      <PaymentTableCustomer />
      </main>
    </div>
  );
};

export default PaymentCustomer;
