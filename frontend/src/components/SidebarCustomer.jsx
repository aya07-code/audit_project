import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaPlus, FaBuilding, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import "../styles/SidebarCustomer.css";

const SidebarCustomer = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="sidebar-customer">
      <nav className="sidebar-navC">
        <NavLink to="/customer/dashboard" className="sidebar-linkC">
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/customer/notifications" className="sidebar-linkC">
          <FaBell /> Notifications
        </NavLink>
        <NavLink to="/customer/audits" className="sidebar-linkC">
          <FaPlus /> Audits
        </NavLink>
        <NavLink to="/customer/companie" className="sidebar-linkC">
          <FaBuilding /> Company
        </NavLink>
        <NavLink to="/customer/profile" className="sidebar-linkC">
          <FaUserEdit /> Update Profile
        </NavLink>
        <button onClick={handleLogout} className="sidebar-linkC logout-btnC">
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default SidebarCustomer;
