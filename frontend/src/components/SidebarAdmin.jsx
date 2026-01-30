import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaPlus, FaBuilding, FaUserEdit, FaSignOutAlt,FaUser,FaBars } from "react-icons/fa";
import "../styles/SidebarAdmin.css";
import axios from "axios";

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://alloaudit.com/api/notifications/user", {
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
     <>
      {/* زر الموبايل */}
      <button className="sidebar-toggle-btn" onClick={() => setOpen(!open)}>
        <FaBars />
      </button>
    <aside className={`sidebar-admin ${open ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/admin/notifications" className="sidebar-link badge-wrapper" onClick={() => setOpen(false)}>
          <FaBell /> Notifications  {unreadCount > 0 && (<span className="badge-notif">{unreadCount}</span>)}
        </NavLink>
        {/* <NavLink to="/admin/update-audit" className="sidebar-link">
          <FaPlus /> Update Audit
        </NavLink> */}
        <NavLink to="/admin/companies" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaBuilding /> Companies
        </NavLink>
        <NavLink to="/admin/customers" className="sidebar-link" onClick={() => setOpen(false)}>
           <FaUser /> Customers
        </NavLink>
        <NavLink to="/admin/profile" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaUserEdit /> Update Profile
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
     </>
  );
};

export default SidebarAdmin;
