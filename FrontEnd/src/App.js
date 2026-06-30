import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Chatbot from "./components/chatbot/Chatbot";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MortgageCalculator from "./pages/MortgageCalculator";
import MortgageApplication from "./pages/MortgageApplication";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BulkUpload from "./components/admin/BulkDataUpload";
import PowerBIReport from "./components/powerbi/PowerBIReport";

// Protected Routes
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Components
import GlobalAnalytics from "./components/analytics/GlobalAnalytics";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/calculator" element={<MortgageCalculator />} />
            <Route path="/global-analytics" element={<GlobalAnalytics />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/apply" element={<MortgageApplication />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/application/:id" element={<ApplicationDetail />} />
              <Route path="/bulk-upload" element={<BulkUpload />} />
              <Route path="/powerbi" element={<PowerBIReport />} />
            </Route>
          </Routes>
        </AnimatePresence>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
