import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ResumeChecker = () => {
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState(null)
  const [history, setHistory] = useState([])
  const [canCheckToday, setCanCheckToday] = useState(true)
  const [nextCheckTime, setNextCheckTime] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get( `${import.meta.env.VITE_API_URL}/api/resume/history`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setHistory(response.data.history)
      setCanCheckToday(response.data.canCheckToday)
      setNextCheckTime(response.data.nextCheckTime)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      setSelectedFile(file)
    } else {
      alert('Please select a PDF or TXT file')
    }
  }

  const handleCheckResume = async () => {
    if (!selectedFile) {
      alert('Please select a resume file first')
      return
    }

    if (!canCheckToday) {
      alert('You have reached your daily limit. Try again tomorrow.')
      return
    }

    setIsChecking(true)
    setUploadProgress(0)
    setAnalysisProgress(0)
    setCheckResult(null)

    const formData = new FormData()
    formData.append('resume', selectedFile)

    try {
      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/resume/check`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        }
      })

      clearInterval(uploadInterval)
      setUploadProgress(100)

      // Simulate analysis progress
      const analysisInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(analysisInterval)
            return 100
          }
          return prev + 5
        })
      }, 150)

      // Wait for analysis to complete
      setTimeout(() => {
        clearInterval(analysisInterval)
        setCheckResult(response.data)
        fetchHistory() // Refresh history
        setIsChecking(false)
        setSelectedFile(null)
        // Reset file input
        document.getElementById('resume-upload').value = ''
      }, 3000)

    } catch (error) {
      console.error('Error checking resume:', error)
      setIsChecking(false)
      if (error.response?.status === 429) {
        alert('Daily limit reached. Try again tomorrow.')
        setCanCheckToday(false)
        setNextCheckTime(error.response.data.nextCheckTime)
      } else {
        alert('Error checking resume. Please try again.')
      }
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-3">📄</span>Resume ATS Checker
        </h2>
        <p className="text-gray-600 text-lg">
          Upload your resume and get an instant ATS compatibility score with personalized improvement suggestions.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Resume</h3>
            <p className="text-gray-600">
              {canCheckToday ? 'Upload your resume for ATS analysis' : `Next check available: ${new Date(nextCheckTime).toLocaleDateString()}`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Daily Limit</div>
            <div className="text-2xl font-bold text-blue-600">1/1</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileSelect}
              disabled={isChecking || !canCheckToday}
              className="flex-1 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleCheckResume}
              disabled={!selectedFile || isChecking || !canCheckToday}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transform hover:scale-105 transition-all"
            >
              {isChecking ? 'Analyzing...' : 'Check Resume'}
            </button>
          </div>

          {selectedFile && (
            <div className="text-sm text-gray-600">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>
      </div>

      {/* Progress Section */}
      {isChecking && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Analyzing Your Resume</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>AI Analysis...</span>
                <span>{analysisProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Processing with AI...</span>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {checkResult && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 mb-8 border border-green-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your ATS Score</h3>
            <div className={`text-8xl font-bold ${getScoreColor(checkResult.score)} mb-2`}>
              {checkResult.score}
            </div>
            <div className="text-gray-600">out of 100</div>
            <div className="mt-4">
              <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg ${getScoreBgColor(checkResult.score)}`}>
                {checkResult.score >= 80 ? 'Excellent' : checkResult.score >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                <span className="mr-2">✅</span>Strong Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {checkResult.strongKeywords.map((keyword, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h4 className="text-lg font-bold text-yellow-700 mb-4 flex items-center">
                <span className="mr-2">⚠️</span>Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {checkResult.missingKeywords.map((keyword, index) => (
                  <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
            <h4 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
              <span className="mr-2">💡</span>Improvement Suggestions
            </h4>
            <ul className="space-y-3">
              {checkResult.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">📊</span>Recent Checks
          </h3>

          <div className="space-y-4">
            {history.map((check) => (
              <div key={check._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-600">
                    {new Date(check.checkedAt).toLocaleDateString()} at {new Date(check.checkedAt).toLocaleTimeString()}
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(check.atsScore)}`}>
                    {check.atsScore}/100
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-green-700 font-medium mb-1">Strong Keywords</div>
                    <div className="flex flex-wrap gap-1">
                      {check.strongKeywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                      {check.strongKeywords.length > 3 && (
                        <span className="text-gray-500 text-xs">+{check.strongKeywords.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-yellow-700 font-medium mb-1">Missing Keywords</div>
                    <div className="flex flex-wrap gap-1">
                      {check.missingKeywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                      {check.missingKeywords.length > 3 && (
                        <span className="text-gray-500 text-xs">+{check.missingKeywords.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-blue-700 font-medium mb-1">Suggestions</div>
                    <div className="text-gray-600 text-xs">
                      {check.suggestions.length} improvement tips
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeChecker
