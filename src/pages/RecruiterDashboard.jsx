
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
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
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs/my-jobs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setJobs(response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/jobs', formData, {
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
      const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}/applications`, {
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
      await axios.put(`http://localhost:5000/api/jobs/${selectedJob}/applications/${appId}`, {
        status,
        rejectionReason
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      // Refresh applications
      viewApplications(selectedJob)
    } catch (error) {
      console.error('Error updating application:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Recruiter Dashboard</h1>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-6 hover:bg-blue-700 transition-all font-medium shadow-md"
        >
          {showCreateForm ? 'Cancel' : 'Create New Job'}
        </button>

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
            <div key={job._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-2">{job.company}</p>
              <p className="text-blue-600 mb-2">{job.location}</p>
              <p className="text-green-600 mb-2 font-medium">{job.category}</p>
              <p className="text-yellow-600 mb-4 font-medium">Openings: {job.openings}</p>
              <button
                onClick={() => viewApplications(job._id)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                View Applications
              </button>
            </div>
          ))}
        </div>

        {showApplications && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
                <button
                  onClick={() => setShowApplications(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{app.applicant.name}</h3>
                        <p className="text-gray-600">{app.applicant.email}</p>
                        <p className="text-sm text-gray-500">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded text-sm font-bold ${
                          app.status === 'selected' ? 'bg-green-500 text-white' :
                          app.status === 'rejected' ? 'bg-red-500 text-white' :
                          'bg-yellow-500 text-white'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-blue-600 font-bold">ATS Score: {app.atsScore}/100</span>
                      </div>
                    </div>

                    {app.resume && (
                      <div className="mb-4">
                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Resume
                        </a>
                      </div>
                    )}

                    {app.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateApplicationStatus(app._id, 'selected')}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Rejection reason:')
                            if (reason) updateApplicationStatus(app._id, 'rejected', reason)
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {app.status === 'rejected' && app.rejectionReason && (
                      <p className="text-red-600 text-sm mt-2">Reason: {app.rejectionReason}</p>
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
