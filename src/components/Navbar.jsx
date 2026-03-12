import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md p-4 border-b border-gray-200 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* 🔹 Logo / Brand */}
        <Link to="/" className="text-gray-800 text-2xl font-bold">
          <span className="text-blue-600">Job</span>Wallah
        </Link>

        {/* 🔹 Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-6 mx-8">
          {user && (
            <>
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                🏠 Home
              </Link>
              <Link 
                to={`/${user.role}`} 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                📊 Dashboard
              </Link>
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                💼 Jobs
              </Link>
            </>
          )}
        </div>

        {/* 🔹 Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* 🔹 Mobile Menu */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border rounded-xl mx-4 p-4 z-50">
            <Link 
              to="/" 
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link 
              to={`/${user.role}`} 
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/" 
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              💼 Jobs
            </Link>
          </div>
        )}

        {/* 🔹 Account Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* User Profile Details - Click to view profile */}
              <div 
                className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all"
                onClick={() => user.role === 'applicant' ? navigate('/applicant/profile') : null}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 capitalize">Role: {user.role}</p>
                </div>
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
