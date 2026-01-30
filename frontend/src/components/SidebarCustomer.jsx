import React , { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaBell, FaPlus, FaBuilding, FaUserEdit, FaSignOutAlt , FaCreditCard, FaBars} from "react-icons/fa";
import "../styles/SidebarCustomer.css";

const SidebarCustomer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
        <>
    <button className="sidebar-toggle-btn" onClick={() => setOpen(!open)}>
      <FaBars />
    </button>
    <aside className={`sidebar-customer ${open ? "open" : ""}`}>
      <nav className="sidebar-navC">
        <NavLink to="/customer/dashboard" className="sidebar-linkC" onClick={() => setOpen(false)}>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/customer/notifications" className="sidebar-linkC" onClick={() => setOpen(false)}>
          <FaBell /> Notifications
        </NavLink>
        <NavLink to="/customer/audits" className="sidebar-linkC" onClick={() => setOpen(false)}>
          <FaPlus /> Audits
        </NavLink>
        <NavLink to="/customer/companie" className="sidebar-linkC" onClick={() => setOpen(false)}>
          <FaBuilding /> Company
        </NavLink>
        <NavLink to="/customer/profile" className="sidebar-linkC" onClick={() => setOpen(false)}>
          <FaUserEdit /> Update Profile
        </NavLink>
          <NavLink to="/customer/payment" className="sidebar-linkC" onClick={() => setOpen(false)}>
          <FaCreditCard /> Payment
        </NavLink>
        <button onClick={handleLogout} className="sidebar-linkC logout-btnC" >
          <FaSignOutAlt /> Logout
        </button>
      </nav>
    </aside>
    </>
  );
};

export default SidebarCustomer;
