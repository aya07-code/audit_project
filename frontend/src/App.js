import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Topbar from './components/Topbar ';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import Audits from './components/Audits';
import DashboardCustomer from './components/DashboardCustomer';
import DashboardAdmin from './components/DashboardAdmin';
import AuditDetail from "./components/AuditDetail";
import NotificationsAdmin from './components/NotificationsAdmin';
import UpdateAudit from './components/UpdateAudit';
import ProfileUpdate from './components/ProfileUpdate';
import AuditQuestions from "./components/AuditQuestions";
import Companies from "./components/Companies";
import Customers from "./components/Customers";
import AuditCustomer from './components/AuditCustomer';
import CompanieCustomer from './components/CompanieCustomer';
import NotificationsCustomer from './components/NotificationsCustomer';
import ProfileUpdateCustomer from './components/ProfileUpdateCustomer';
import AuditDetails from './components/AuditDetails';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentCustomer from './components/PaymentCustomer';
import PaymentDetail from './components/PaymentDetail';
import CustomerAuditDetail from './components/CustomerAuditDetail';

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
            <Route path="/audits" element={<Audits /> } /> 
            <Route path="/admin/dashboard" element={<ProtectedRoute> <DashboardAdmin /> </ProtectedRoute>} />    
            <Route path="/audit/:id" element={<AuditDetail />} />
            <Route path="/admin/notifications" element={<NotificationsAdmin />} />
            <Route path="/admin/update-audit" element={<UpdateAudit />} />    
            <Route path="/audits/:auditId" element={<AuditQuestions />} /> 
            <Route path="/admin/update-audit/:auditId" element={<UpdateAudit />} />
            <Route path="/admin/payments/:paymentId" element={<PaymentDetail />} /> 
            <Route path="/admin/companies" element={<Companies />} /> 
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/profile" element={ <ProtectedRoute> <ProfileUpdate /> </ProtectedRoute>} /> 
            <Route path="/customer/profile" element={<ProtectedRoute> <ProfileUpdateCustomer /> </ProtectedRoute>} /> 
            <Route path="/customer/dashboard" element={<ProtectedRoute> <DashboardCustomer /></ProtectedRoute>} />
            <Route path="/customer/notifications" element={<NotificationsCustomer />} />
            <Route path="/customer/audits" element={<AuditCustomer />} />  
            <Route path="/customer/companie" element={<CompanieCustomer />} />
            <Route path="/customer/payment" element={<PaymentCustomer />} />
            <Route path="/audit-details/:auditId/:companyId" element={<AuditDetails />} />
            <Route path="/audit/details/:id" element={<CustomerAuditDetail />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;