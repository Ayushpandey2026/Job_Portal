

import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const JobDetails = () => {
  const { id } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [simplifyingJD, setSimplifyingJD] = useState(false)
  const [simplifiedJD, setSimplifiedJD] = useState(null)
  const [simplifyError, setSimplifyError] = useState(null)

  const handleGoBack = () => {
    if (user?.role === 'applicant') {
      navigate('/applicant')
    } else if (user?.role === 'recruiter') {
      navigate('/recruiter')
    } else {
      navigate(-1) // Browser back
    }
  }

  // -------------------------------
  // FIXED ASYNC LOADING
  // -------------------------------
  useEffect(() => {
    const loadJob = async () => {
      setLoading(true)
      await fetchJob()
      setLoading(false)
    }
    loadJob()
  }, [id])

  const fetchJob = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jobs/${id}`
      )
      setJob(response.data)
    } catch (error) {
      console.error('Error fetching job:', error)
    }
  }

  const handleFileChange = (e) => {
    setResume(e.target.files[0])
  }

  // --------------------------------------
  // APPLY FUNCTION — FIXED WITH CREDENTIALS
  // --------------------------------------
  const handleApply = async () => {
    if (!resume) {
      alert('Please upload your resume')
      return
    }

    setApplying(true)
    const formData = new FormData()
    formData.append('resume', resume)

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jobs/${id}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true // 🔥 IMPORTANT FIX
        }
      )

      setApplicationSubmitted(true)
      alert('Application submitted successfully!')
    } catch (error) {
      console.error(error)
      alert('Already applied or an error occurred. Please try again later.')
    } finally {
      setApplying(false)
    }
  }

  // Simplify JD using AI
  const simplifyJobDescription = async () => {
    if (!job?.description) return

    setSimplifyingJD(true)
    setSimplifyError(null)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jd/simplify`,
        {
          jobDescription: job.description
        }
      )

      if (response.data.success) {
        setSimplifiedJD(response.data.data)
      } else {
        setSimplifyError('Failed to simplify job description')
      }
    } catch (error) {
      console.error('Error simplifying JD:', error)
      setSimplifyError(error.response?.data?.message || 'Error simplifying job description')
    } finally {
      setSimplifyingJD(false)
    }
  }

  // --------------------------------------
  // LOADING SCREEN
  // --------------------------------------
  if (!job || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading job details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            {/* Back Button */}
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-sm md:mr-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex-1 flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
                <span className="text-blue-600 font-bold text-2xl">
                  {job.company.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-gray-600 text-xl">{job.company}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600 mb-1">{job.salary}</div>
              <div className="text-gray-600">Annual Salary</div>
            </div>
          </div>

          {/* Job Meta section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-blue-600 text-2xl mb-2">📍</div>
              <div className="font-medium text-gray-900">{job.location}</div>
              <div className="text-sm text-gray-600">Location</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-green-600 text-2xl mb-2">👥</div>
              <div className="font-medium text-gray-900">{job.openings}</div>
              <div className="text-sm text-gray-600">Openings</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-purple-600 text-2xl mb-2">🏷️</div>
              <div className="font-medium text-gray-900">{job.category}</div>
              <div className="text-sm text-gray-600">Category</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-orange-600 text-2xl mb-2">⏰</div>
              <div className="font-medium text-gray-900">
                {new Date(job.deadline).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Deadline</div>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">📋</span>Job Description
            </h2>
            <button
              onClick={simplifyJobDescription}
              disabled={simplifyingJD || simplifiedJD}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                simplifyingJD || simplifiedJD
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
              }`}
            >
              {simplifyingJD ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  <span>Simplifying...</span>
                </>
              ) : simplifiedJD ? (
                <>
                  <span>✓</span>
                  <span>Simplified</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Simplify JD</span>
                </>
              )}
            </button>
          </div>

          {simplifyError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
              Error: {simplifyError}
            </div>
          )}

          {simplifiedJD ? (
            <div className="space-y-6">
              {/* Simplified Text */}
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">💡</span>Simplified Summary
                </h3>
                <p className="text-blue-800 leading-relaxed">{simplifiedJD.simplifiedText}</p>
              </div>

              {/* Experience Level */}
              {simplifiedJD.experienceLevel && (
                <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center">
                    <span className="mr-2">📊</span>Experience Level
                  </h3>
                  <p className="text-purple-800 text-lg font-semibold">{simplifiedJD.experienceLevel}</p>
                </div>
              )}

              {/* Key Responsibilities */}
              {simplifiedJD.keyPoints && simplifiedJD.keyPoints.length > 0 && (
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                  <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                    <span className="mr-2">✓</span>Key Responsibilities
                  </h3>
                  <ul className="space-y-2">
                    {simplifiedJD.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-600 font-bold mr-3">•</span>
                        <span className="text-green-800">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Required Skills */}
              {simplifiedJD.skills && simplifiedJD.skills.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
                  <h3 className="text-lg font-bold text-orange-900 mb-4 flex items-center">
                    <span className="mr-2">🔧</span>Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {simplifiedJD.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-200 text-orange-900 px-4 py-2 rounded-full font-medium text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={() => setSimplifiedJD(null)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all"
              >
                Show Original Description
              </button>
            </div>
          ) : (
            <p className="text-gray-700 text-lg leading-relaxed">{job.description}</p>
          )}
        </div>

        {/* Requirements section  */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🎯</span>Requirements & Constraints
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">{job.constraints}</p>
        </div>

        {/* Apply Section h*/}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🚀</span>Apply for this Position
          </h2>

          {user ? (
            applicationSubmitted ? (
              <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  Application Submitted!
                </h3>
                <p className="text-green-700 mb-6">
                  We'll review your profile and get back soon.
                </p>
                <Link
                  to="/applicant"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all font-medium"
                >
                  Back to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">
                        Welcome back, {user.name}!
                      </div>
                      <div className="text-gray-600">
                        Ready to apply for this opportunity?
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Upload Your Resume
                    </h3>
                    <p className="text-gray-600 mb-4">Only PDF format is allowed</p>

                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                      required
                    />

                    <label
                      htmlFor="resume-upload"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all cursor-pointer font-medium"
                    >
                      {resume ? `📄 ${resume.name}` : 'Choose Resume File'}
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleApply}
                  disabled={!resume || applying}
                  className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                    !resume || applying
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
                  }`}
                >
                  {applying ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting Application...
                    </div>
                  ) : (
                    '🚀 Submit Application'
                  )}
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h3>
              <p className="text-gray-700 mb-8 text-lg">
                You must be logged in to apply for this job.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all font-medium"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobDetails
