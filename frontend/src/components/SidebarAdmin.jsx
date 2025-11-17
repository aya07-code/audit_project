import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaPlus, FaBuilding, FaUserEdit, FaSignOutAlt,FaUser } from "react-icons/fa";
import "../styles/SidebarAdmin.css";

const SidebarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="sidebar-admin">
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className="sidebar-link">
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/admin/notifications" className="sidebar-link">
          <FaBell /> Notifications
        </NavLink>
        <NavLink to="/admin/update-audit" className="sidebar-link">
          <FaPlus /> Update Audit
        </NavLink>
        <NavLink to="/admin/companies" className="sidebar-link">
          <FaBuilding /> Companies
        </NavLink>
        <NavLink to="/admin/customers" className="sidebar-link">
           <FaUser /> Customers
        </NavLink>
        <NavLink to="/admin/profile" className="sidebar-link">
          <FaUserEdit /> Update Profile
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default SidebarAdmin;
