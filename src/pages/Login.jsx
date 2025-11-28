// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "applicant",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request with role
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      );

      // Save token + user into context
      login(response.data.token, response.data.user);

      // Use backend role for redirection (more secure)
      const backendRole = response.data.user.role;

      if (backendRole === "admin") navigate("/admin/dashboard");
      else if (backendRole === "recruiter") navigate("/recruiter");
      else navigate("/applicant");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
              required
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300"
            >
              <option value="applicant">Applicant</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-gray-600 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
