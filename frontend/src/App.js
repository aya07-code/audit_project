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
import ActivitiesPage from './components/ActivitiesPage';
import DashboardCustomer from './components/DashboardCustomer';
import DashboardAdmin from './components/DashboardAdmin';

function App() {
  return (
    <Router>
      <div className="App">
        <Topbar />
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<Services />} /> 
            <Route path="/about" element={<About />} />  
            <Route path="/contact" element={<Contact />} />  
            <Route path="/audits" element={<ProtectedRoute> <ActivitiesPage /> </ProtectedRoute> } /> 
            <Route path="/customer/dashboard" element={<DashboardCustomer />} />
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />           
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;