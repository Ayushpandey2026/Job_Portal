import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ResumeChecker from '../components/ResumeChecker'

const ApplicantDashboard = () => {
  const [applications, setApplications] = useState([])
  const [applicationsByCategory, setApplicationsByCategory] = useState({})
  const [jobs, setJobs] = useState([])
  const [resumeScore, setResumeScore] = useState(null)
  const [suggestions, setSuggestions] = useState({})
  const [activeTab, setActiveTab] = useState('overview')
  const [jobFilters, setJobFilters] = useState({
    title: '',
    location: '',
    category: '',
    type: ''
  })

  useEffect(() => {
    fetchApplications()
    fetchResumeScore()
    fetchJobs()
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [jobFilters])

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/applications/my-applications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setApplications(response.data)

      // Group applications by category
      const grouped = response.data.reduce((acc, app) => {
        const category = app.job.category || 'Other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(app)
        return acc
      }, {})
      setApplicationsByCategory(grouped)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const fetchResumeScore = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/resume/score', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setResumeScore(response.data.score)
      setSuggestions(response.data.suggestions)
    } catch (error) {
      console.error('Error fetching resume score:', error)
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs', { params: jobFilters })
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const handleJobFilterChange = (e) => {
    setJobFilters({ ...jobFilters, [e.target.name]: e.target.value })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'selected': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-yellow-500'
    }
  }

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'selected': return '🎉'
      case 'rejected': return '❌'
      default: return '⏳'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Welcome to Your Dashboard</h1>
          <p className="text-xl opacity-90">Track your applications and discover new opportunities</p>
        </div>

        {/* Resume Score Card */}
        {resumeScore && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Resume Score</h2>
              <div className="text-right">
                <div className="text-6xl font-bold text-blue-600">{resumeScore}</div>
                <div className="text-gray-600">out of 100</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-green-700 font-bold mb-3 flex items-center">
                  <span className="mr-2">✅</span>Strong Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.strong?.map(keyword => (
                    <span key={keyword} className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-yellow-700 font-bold mb-3 flex items-center">
                  <span className="mr-2">⚠️</span>Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions.missing?.map(keyword => (
                    <span key={keyword} className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                activeTab === 'applications'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 My Applications
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔍 Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab('resume-checker')}
              className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                activeTab === 'resume-checker'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📄 Resume Checker
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">{applications.length}</div>
                      <div className="text-gray-700 font-medium">Total Applications</div>
                    </div>
                    <div className="text-4xl">📄</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-green-600">
                        {applications.filter(app => app.status === 'selected').length}
                      </div>
                      <div className="text-gray-700 font-medium">Selected</div>
                    </div>
                    <div className="text-4xl">🎯</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">
                        {applications.filter(app => app.status === 'pending').length}
                      </div>
                      <div className="text-gray-700 font-medium">Pending</div>
                    </div>
                    <div className="text-4xl">⏳</div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Applications</h3>
                {applications.slice(0, 3).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-600 text-lg">No applications yet. Start applying to jobs!</p>
                    <Link
                      to="/applicant"
                      className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 3).map(app => (
                      <div key={app._id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-1">{app.job.title}</h4>
                            <p className="text-gray-600 mb-2">{app.job.company}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="mr-4">📅 {new Date(app.appliedAt).toLocaleDateString()}</span>
                              {app.atsScore && (
                                <span className="mr-4">🎯 ATS: {app.atsScore}/100</span>
                              )}
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold text-white flex items-center ${getStatusColor(app.status)}`}>
                            <span className="mr-2">{getStatusEmoji(app.status)}</span>
                            {app.status}
                          </span>
                        </div>
                        {app.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                            <div className="text-red-700 font-medium mb-1">Rejection Reason:</div>
                            <div className="text-red-600">{app.rejectionReason}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-8">
              {Object.keys(applicationsByCategory).length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-600 text-lg">No applications yet. Start applying to jobs!</p>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                Object.entries(applicationsByCategory).map(([category, apps]) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2 flex items-center">
                      <span className="mr-3">🏷️</span>{category}
                      <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {apps.length} application{apps.length !== 1 ? 's' : ''}
                      </span>
                    </h3>
                    {apps.map(app => (
                      <div key={app._id} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-1">{app.job.title}</h4>
                            <p className="text-gray-600 mb-2">{app.job.company}</p>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <span className="mr-4">📅 Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                              {app.atsScore && (
                                <span className="mr-4">🎯 ATS Score: {app.atsScore}/100</span>
                              )}
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold text-white flex items-center ${getStatusColor(app.status)}`}>
                            <span className="mr-2">{getStatusEmoji(app.status)}</span>
                            {app.status}
                          </span>
                        </div>

                        {app.rejectionReason && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="text-red-700 font-medium mb-1">Rejection Reason:</div>
                            <div className="text-red-600">{app.rejectionReason}</div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {app.strongKeywords && app.strongKeywords.length > 0 && (
                            <div>
                              <div className="text-green-700 font-medium mb-2 flex items-center">
                                <span className="mr-2">✅</span>Strong Keywords
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {app.strongKeywords.map(keyword => (
                                  <span key={keyword} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {app.missingKeywords && app.missingKeywords.length > 0 && (
                            <div>
                              <div className="text-yellow-700 font-medium mb-2 flex items-center">
                                <span className="mr-2">⚠️</span>Missing Keywords
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {app.missingKeywords.map(keyword => (
                                  <span key={keyword} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">🔍</span>Discover New Opportunities
              </h3>

              {/* Filters */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Job Title or Keywords"
                    value={jobFilters.title}
                    onChange={handleJobFilterChange}
                    className="p-4 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={jobFilters.location}
                    onChange={handleJobFilterChange}
                    className="p-4 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <select
                    name="category"
                    value={jobFilters.category}
                    onChange={handleJobFilterChange}
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
                  <button
                    onClick={() => fetchJobs()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium transform hover:scale-105"
                  >
                    🔍 Search Jobs
                  </button>
                </div>
              </div>

              {/* Job Listings */}
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 text-lg">No jobs found matching your criteria.</p>
                    <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  jobs.map(job => (
                    <div key={job._id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
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
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span className="mr-4 flex items-center">
                              <span className="mr-1">📍</span>{job.location}
                            </span>
                            <span className="mr-4 flex items-center">
                              <span className="mr-1">🏷️</span>{job.category}
                            </span>
                            <span className="flex items-center">
                              <span className="mr-1">👥</span>{job.openings} openings
                            </span>
                          </div>
                          <p className="text-gray-700 line-clamp-2">{job.description}</p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Link
                          to={`/job/${job._id}`}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium transform hover:scale-105"
                        >
                          View Details & Apply
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Resume Checker Tab */}
          {activeTab === 'resume-checker' && (
            <div>
              <ResumeChecker />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicantDashboard
