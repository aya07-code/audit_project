import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaPlus, FaBuilding, FaUserEdit, FaSignOutAlt,FaUser } from "react-icons/fa";
import "../styles/SidebarAdmin.css";
import axios from "axios";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/notifications/user", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const count = res.data.filter(n => !n.is_read).length;
        setUnreadCount(count);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchUnread();
  }, []);


  return (
    <aside className="sidebar-admin">
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className="sidebar-link">
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/admin/notifications" className="sidebar-link badge-wrapper">
          <FaBell /> Notifications  {unreadCount > 0 && (<span className="badge-notif">{unreadCount}</span>)}
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
