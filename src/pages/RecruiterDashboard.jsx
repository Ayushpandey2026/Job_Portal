 
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const RecruiterDashboard = () => {
  const { user, role, loading } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [allApplications, setAllApplications] = useState([])
  const [receivedApplications, setReceivedApplications] = useState([])
  const [selectedApplications, setSelectedApplications] = useState([])
  const [filterScore, setFilterScore] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    openings: 1,
    deadline: '',
    constraints: '',
    company: '',
    location: '',
    salary: '',
    category: ''
  })

  useEffect(() => {
    if (loading) return
    if (!user || role !== 'recruiter') {
      navigate('/')
      return
    }
    fetchJobs()
    fetchAllApplications()
    fetchReceivedApplications()
    fetchSelectedApplications()
  }, [user, role, navigate, loading])

  const fetchJobs = async () => {
    try {
      const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchAllApplications = async () => {
    try {
      const params = filterScore ? { minScore: filterScore } : {}
      const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/jobs/my-applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params
      })
      setAllApplications(response.data)
    } catch (error) {
      console.error('Error fetching all applications:', error)
    }
  }

  const fetchReceivedApplications = async () => {
    try {
      const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/jobs/my-applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setReceivedApplications(response.data)
    } catch (error) {
      console.error('Error fetching received applications:', error)
    }
  }

  const fetchSelectedApplications = async () => {
    try {
      const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/jobs/my-selected-applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setSelectedApplications(response.data)
    } catch (error) {
      console.error('Error fetching selected applications:', error)
    }
  }

  useEffect(() => {
    fetchAllApplications()
  }, [filterScore])

  const handleFilterChange = (e) => {
    setFilterScore(e.target.value)
  }

  const applyFilter = () => {
    fetchAllApplications()
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post( `${import.meta.env.VITE_API_URL}/api/jobs`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setShowCreateForm(false)
      setFormData({
        title: '',
        description: '',
        openings: 1,
        deadline: '',
        constraints: '',
        company: '',
        location: '',
        salary: '',
        category: ''
      })
      fetchJobs()
    } catch (error) {
      alert('Error creating job')
    }
  }

  const [applications, setApplications] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [showApplications, setShowApplications] = useState(false)

  const viewApplications = async (jobId) => {
    try {
      const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/jobs/${jobId}/applications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setApplications(response.data)
      setSelectedJob(jobId)
      setShowApplications(true)
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const updateApplicationStatus = async (appId, status, rejectionReason = '') => {
    try {
      // Find the application to get jobId
      const app = allApplications.find(a => a._id === appId) || applications.find(a => a._id === appId) || receivedApplications.find(a => a._id === appId)
      const jobId = app ? app.job._id : selectedJob

      await axios.put(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}/applications/${appId}`, {
        status,
        rejectionReason
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      // Refresh all data
      fetchAllApplications()
      fetchReceivedApplications()
      fetchSelectedApplications()
      if (showApplications) viewApplications(selectedJob)
    } catch (error) {
      console.error('Error updating application:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Recruiter Dashboard</h1>
          <p className="text-xl opacity-90">Manage your job postings and applications</p>
        </div>

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
              onClick={() => setActiveTab('jobs')}
              className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💼 My Jobs
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                activeTab === 'applications'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Applications
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">{jobs.length}</div>
                      <div className="text-gray-700 font-medium">Active Jobs</div>
                    </div>
                    <div className="text-4xl">💼</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-green-600">{receivedApplications.length}</div>
                      <div className="text-gray-700 font-medium">Received Apps</div>
                    </div>
                    <div className="text-4xl">📥</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">{selectedApplications.length}</div>
                      <div className="text-gray-700 font-medium">Selected</div>
                    </div>
                    <div className="text-4xl">✅</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-orange-600">{allApplications.length}</div>
                      <div className="text-gray-700 font-medium">Total Apps</div>
                    </div>
                    <div className="text-4xl">📊</div>
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Applications</h3>
                {receivedApplications.slice(0, 3).length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-600 text-lg">No applications received yet.</p>
                    <p className="text-gray-500">Applications will appear here once candidates apply to your jobs.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedApplications.slice(0, 3).map(app => (
                      <div key={app._id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-1">{app.applicant.name}</h4>
                            <p className="text-gray-600 mb-2">{app.applicant.email}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="mr-4">📅 {new Date(app.appliedAt).toLocaleDateString()}</span>
                              <span className="mr-4">🎯 ATS: {app.atsScore}/100</span>
                              <span>🏢 {app.job.title}</span>
                            </div>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold text-white flex items-center ${
                            app.status === 'selected' ? 'bg-green-500' :
                            app.status === 'rejected' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}>
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

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">My Job Postings</h3>
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md"
                >
                  {showCreateForm ? 'Cancel' : '+ Create New Job'}
                </button>
              </div>

              {showCreateForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Job Posting</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="title"
                        placeholder="Job Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        name="company"
                        placeholder="Company Name"
                        value={formData.company}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="number"
                        name="openings"
                        placeholder="Number of Openings"
                        value={formData.openings}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="text"
                        name="salary"
                        placeholder="Salary Range"
                        value={formData.salary}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="p-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
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
                    </div>
                    <textarea
                      name="description"
                      placeholder="Job Description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                      rows="4"
                      required
                    />
                    <textarea
                      name="constraints"
                      placeholder="Constraints/Requirements"
                      value={formData.constraints}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-4"
                      rows="3"
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 hover:bg-green-700 transition-all font-medium"
                    >
                      Create Job
                    </button>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                  <div key={job._id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h4>
                        <p className="text-gray-600 mb-1">{job.company}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="mr-4">📍 {job.location}</span>
                          <span>👥 {job.openings} openings</span>
                        </div>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {job.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => viewApplications(job._id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md"
                    >
                      View Applications ({job.applications?.length || 0})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-8">
              {/* Filter */}
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <input
                  type="number"
                  placeholder="Min ATS Score (0-100)"
                  value={filterScore}
                  onChange={handleFilterChange}
                  className="p-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
                <button
                  onClick={applyFilter}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Apply Filter
                </button>
              </div>

              {/* All Applications Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">All Applications</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {allApplications.map(app => (
                    <div key={app._id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{app.applicant.name}</h4>
                          <p className="text-gray-600 mb-2">{app.applicant.email}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="mr-4">📅 {new Date(app.appliedAt).toLocaleDateString()}</span>
                            <span className="mr-4">🎯 ATS: {app.atsScore}/100</span>
                            <span>🏢 {app.job.title} at {app.job.company}</span>
                          </div>
                          {app.resume && (
                            <a
                              href={ `${import.meta.env.VITE_API_URL}/${app.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                              📄 View Resume
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
                            app.status === 'selected' ? 'bg-green-500' :
                            app.status === 'rejected' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}>
                            {app.status}
                          </span>
                          {app.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateApplicationStatus(app._id, 'selected')}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all text-sm"
                              >
                                Select
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Rejection reason:')
                                  if (reason) updateApplicationStatus(app._id, 'rejected', reason)
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all text-sm"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
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
              </div>

              {/* Selected Applications Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Selected Applications</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedApplications.map(app => (
                    <div key={app._id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{app.applicant.name}</h4>
                          <p className="text-gray-600 mb-2">{app.applicant.email}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="mr-4">📅 {new Date(app.appliedAt).toLocaleDateString()}</span>
                            <span className="mr-4">🎯 ATS: {app.atsScore}/100</span>
                            <span>🏢 {app.job.title} at {app.job.company}</span>
                          </div>
                          {app.resume && (
                            <a
                              href={ `${import.meta.env.VITE_API_URL}/${app.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                            >
                              📄 View Resume
                            </a>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold text-white bg-green-500`}>
                            selected
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal for Applications */}
        {showApplications && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Job Applications</h2>
                <button
                  onClick={() => setShowApplications(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-light"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {applications.map(app => (
                  <div key={app._id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-1">{app.applicant.name}</h4>
                        <p className="text-gray-600 mb-2">{app.applicant.email}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="mr-4">📅 {new Date(app.appliedAt).toLocaleDateString()}</span>
                          <span>🎯 ATS: {app.atsScore}/100</span>
                        </div>
                        {app.resume && (
                          <a
                            href={app.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            📄 View Resume
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${
                          app.status === 'selected' ? 'bg-green-500' :
                          app.status === 'rejected' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}>
                          {app.status}
                        </span>
                        {app.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateApplicationStatus(app._id, 'selected')}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all text-sm"
                            >
                              Select
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Rejection reason:')
                                if (reason) updateApplicationStatus(app._id, 'rejected', reason)
                              }}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecruiterDashboard
