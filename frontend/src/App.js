import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Topbar from './components/Topbar ';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import ProtectedRoute from './components/ProtectedRoute';
import Audits from './components/Audits';
import DashboardCustomer from './components/DashboardCustomer';
import DashboardAdmin from './components/DashboardAdmin';
import AuditDetail from "./components/AuditDetail";
import Notifications from './components/Notifications';
import UpdateAudit from './components/UpdateAudit';
import ProfileUpdate from './components/ProfileUpdate';
import AuditQuestions from "./components/AuditQuestions";
import Companies from "./components/Companies";

function App() {
  return (
    <Router>
      <div className="App">
        <Topbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} /> 
            <Route path="/about" element={<About />} />  
            <Route path="/contact" element={<Contact />} />  
            <Route path="/audits" element={<ProtectedRoute> <Audits /> </ProtectedRoute> } /> 
            <Route path="/customer/dashboard" element={<DashboardCustomer />} />
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />    
            <Route path="/audit/:id" element={<AuditDetail />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/update-audit" element={<UpdateAudit />} />
            <Route path="/admin/profile" element={<ProfileUpdate />} />     
            <Route path="/audits/:auditId" element={<AuditQuestions />} /> 
            <Route path="/admin/update-audit/:auditId" element={<UpdateAudit />} /> 
            <Route path="/admin/companies" element={<Companies />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;