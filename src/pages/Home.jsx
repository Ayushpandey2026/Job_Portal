import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { user, logout } = useAuth()


  
  const [jobs, setJobs] = useState([])
  const [visibleJobsCount, setVisibleJobsCount] = useState(6)
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    category: '',
    type: ''
  })

  useEffect(() => {
    fetchJobs()
    setVisibleJobsCount(6) // Reset visible count when filters change
  }, [filters])

  const fetchJobs = async () => {
    try {
      const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/jobs`, { params: filters })
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const loadMoreJobs = () => {
    setVisibleJobsCount(prev => prev + 6)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">
            Discover Your <span className="text-yellow-300">Dream Career</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with top companies and find the perfect job that matches your skills and aspirations.
            Your next big opportunity is just a click away!
          </p>



          {!user && (
            <div className="flex justify-center space-x-4">
              <Link
                to="/register"
                className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
              <div className="text-5xl font-bold text-blue-600 mb-3">10K+</div>
              <div className="text-gray-700 font-medium text-lg">Active Jobs</div>
              <div className="text-sm text-gray-500 mt-2">Updated daily</div>
            </div>
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
              <div className="text-5xl font-bold text-green-600 mb-3">5K+</div>
              <div className="text-gray-700 font-medium text-lg">Companies</div>
              <div className="text-sm text-gray-500 mt-2">Top brands hiring</div>
            </div>
            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
              <div className="text-5xl font-bold text-purple-600 mb-3">50K+</div>
              <div className="text-gray-700 font-medium text-lg">Job Seekers</div>
              <div className="text-sm text-gray-500 mt-2">Active professionals</div>
            </div>
            <div className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
              <div className="text-5xl font-bold text-orange-600 mb-3">95%</div>
              <div className="text-gray-700 font-medium text-lg">Success Rate</div>
              <div className="text-sm text-gray-500 mt-2">Job placement rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose <span className="text-blue-600">JobPortal</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast & Easy</h3>
              <p className="text-gray-600">Apply to multiple jobs with just one click. Our streamlined process saves you time and effort.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Matching</h3>
              <p className="text-gray-600">Our AI-powered system matches you with the perfect jobs based on your skills and preferences.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Top Companies</h3>
              <p className="text-gray-600">Connect with industry-leading companies and startups looking for talented professionals.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What Our Users <span className="text-green-600">Say</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  S
                </div>
                <div>
                  <div className="font-bold text-gray-900">Sarah Johnson</div>
                  <div className="text-gray-600 text-sm">Software Engineer</div>
                </div>
              </div>
              <p className="text-gray-700 italic">"JobPortal helped me find my dream job in just 2 weeks! The platform is incredibly user-friendly."</p>
              <div className="flex text-yellow-400 mt-4">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  M
                </div>
                <div>
                  <div className="font-bold text-gray-900">Mike Chen</div>
                  <div className="text-gray-600 text-sm">Product Manager</div>
                </div>
              </div>
              <p className="text-gray-700 italic">"The job matching algorithm is spot on! I got interviews from 5 top companies within a month."</p>
              <div className="flex text-yellow-400 mt-4">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  A
                </div>
                <div>
                  <div className="font-bold text-gray-900">Anna Rodriguez</div>
                  <div className="text-gray-600 text-sm">UX Designer</div>
                </div>
              </div>
              <p className="text-gray-700 italic">"Amazing platform! The interface is beautiful and the job recommendations are incredibly accurate."</p>
              <div className="flex text-yellow-400 mt-4">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Search Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Find the Perfect <span className="text-blue-600">Job</span> for You
        </h2>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <input
              type="text"
              name="title"
              placeholder="Job Title or Keywords"
              value={filters.title}
              onChange={handleFilterChange}
              className="p-4 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filters.location}
              onChange={handleFilterChange}
              className="p-4 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="p-4 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            >
              <option value="">All Categories</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="p-4 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Featured Jobs Section */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔥 <span className="text-orange-500">Featured Jobs</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.slice(0, visibleJobsCount).map(job => (
              <div key={job._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold text-xl">
                      {job.company.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-blue-600 mb-2 flex items-center">
                    <span className="mr-2">📍</span>{job.location}
                  </p>
                  <p className="text-green-600 font-medium flex items-center">
                    <span className="mr-2">🏷️</span>{job.category}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 font-bold bg-yellow-100 px-3 py-1 rounded-full">
                    {job.openings} openings
                  </span>
                  <Link
                    to={`/job/${job._id}`}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium transform hover:scale-105"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {jobs.length > visibleJobsCount && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreJobs}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium transform hover:scale-105"
              >
                Load More Jobs
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-12 text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Take the Next Step?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who found their dream jobs through our platform
          </p>
          <Link
            to="/register"
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 inline-block"
          >
            Create Your Account Today
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
