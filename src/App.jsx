import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RecruiterDashboard from './pages/RecruiterDashboard'
import ApplicantDashboard from './pages/ApplicantDashboard'
import JobDetails from './pages/JobDetails'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen pt-20">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/applicant" element={<ApplicantDashboard />} />
            <Route path="/job/:id" element={<JobDetails />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
