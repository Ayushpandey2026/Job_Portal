import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context
import { AuthProvider } from "./contexts/AuthContext";

// Common Components
import Navbar from "./components/Navbar";

// Pages (User + Recruiter + Applicant)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import ApplicantProfile from "./pages/ApplicantProfile";
import JobDetails from "./pages/JobDetails";

// ATS Component
import ATSChecker from "./components/ATSChecker";

// Admin Components
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageJobs from "./pages/admin/ManageJobs";
import Analytics from "./pages/admin/Analytics";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen pt-20">
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Dashboards */}
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/applicant" element={<ApplicantDashboard />} />
            <Route path="/applicant/profile" element={<ApplicantProfile />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/applicant/ats-checker" element={<ATSChecker />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedAdminRoute>
                  <ManageUsers />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/jobs"
              element={
                <ProtectedAdminRoute>
                  <ManageJobs />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ProtectedAdminRoute>
                  <Analytics />
                </ProtectedAdminRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
