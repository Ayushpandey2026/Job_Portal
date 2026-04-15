import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ATSChecker.css";

/**
 * ATS Resume Checker Component
 * Allows users to upload resume and JD for matching
 * Displays comprehensive ATS score and recommendations
 * Enforces once-per-day limit on checks
 */

const ATSChecker = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saveResult, setSaveResult] = useState(true);
  const [canCheckToday, setCanCheckToday] = useState(true);
  const [nextCheckTime, setNextCheckTime] = useState(null);
  const [checksRemaining, setChecksRemaining] = useState(1);
  const fileInputRef = useRef(null);

  // Check daily limit on component mount
  useEffect(() => {
    checkDailyLimit();
  }, []);

  // Check if user can check resume today
  const checkDailyLimit = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ats/daily-check`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCanCheckToday(response.data.canCheckToday);
      setChecksRemaining(response.data.checksRemaining || 1);
      if (!response.data.canCheckToday) {
        setNextCheckTime(response.data.nextCheckTime);
      }
    } catch (error) {
      console.error("Error checking daily limit:", error);
      // Default to allowing check if API fails
      setCanCheckToday(true);
    }
  };

  // Handle resume file upload
  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        setResumeFile(null);
        return;
      }

      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        setError("Only PDF and DOCX files are supported");
        setResumeFile(null);
        return;
      }

      setResumeFile(file);
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Check daily limit first
    if (!canCheckToday) {
      const formattedTime = new Date(nextCheckTime).toLocaleString();
      setError(
        `You have reached your daily limit for ATS checks. You can check again on ${formattedTime}.`
      );
      return;
    }

    // Validation
    if (!resumeFile) {
      setError("Please upload a resume (PDF or DOCX)");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError("Job description must be at least 50 characters");
      return;
    }

    // Perform matching
    await performMatching();
  };

  // Call ATS matching API
  const performMatching = async () => {
    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);
      formData.append("saveResult", saveResult);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ats/match`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
        setCanCheckToday(false);
        setChecksRemaining(0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(response.data.message || "Failed to perform ATS matching");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to perform ATS matching";
      setError(errorMessage);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Clear form
  const handleReset = () => {
    setResumeFile(null);
    setJobDescription("");
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get color for score
  const getScoreColor = (score) => {
    if (score >= 85) return "#10b981"; // Green
    if (score >= 75) return "#3b82f6"; // Blue
    if (score >= 65) return "#f59e0b"; // Amber
    if (score >= 50) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getReadinessColor = (readiness) => {
    return readiness === "Ready to Apply" ? "#10b981" : "#f59e0b";
  };

  return (
    <div className="ats-checker-container">
      {/* Header */}
      <div className="ats-header">
        <h1>🎯 ATS Resume Matcher</h1>
        <p>Check how well your resume matches a job description</p>
      </div>

      {/* Error Message */}
      {error && <div className="ats-error">{error}</div>}

      {/* Daily Limit Message */}
      {!canCheckToday && (
        <div className="ats-warning">
          <p>
            ⏱️ You've already used your daily ATS check. Please come back
            tomorrow to check another resume!
          </p>
          {nextCheckTime && (
            <small>
              Next check available:{" "}
              {new Date(nextCheckTime).toLocaleString()}
            </small>
          )}
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="ats-results">
          <div className="results-header">
            <h2>Matching Results</h2>
            <button onClick={handleReset} className="btn-reset">
              Check Another
            </button>
          </div>

          {/* Main Score Display */}
          <div className="score-display">
            <div className="score-card main-score">
              <div className="score-circle" style={{ color: getScoreColor(result.finalScore) }}>
                <div className="score-value">{result.finalScore}</div>
                <div className="score-outof">/100</div>
              </div>
              <div className="score-info">
                <h3>{result.level}</h3>
                <p className="grade" style={{ color: getScoreColor(result.finalScore) }}>
                  Grade: <strong>{result.grade}</strong>
                </p>
                <p className="description">{result.description}</p>
              </div>
            </div>

            {/* Readiness Status */}
            <div className="score-card readiness-card">
              <div className="readiness-indicator" style={{ color: getReadinessColor(result.readiness) }}>
                {result.readiness === "Ready to Apply" ? "✓" : "!"}
              </div>
              <div>
                <p className="readiness-label">Readiness Score</p>
                <p className="readiness-score">{result.readinessScore}%</p>
                <p className="readiness-status">{result.readiness}</p>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="score-breakdown">
            <h3>Score Breakdown</h3>
            <div className="breakdown-grid">
              <div className="breakdown-item">
                <div className="breakdown-label">Semantic Score</div>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-fill"
                    style={{
                      width: `${result.semanticScore}%`,
                      backgroundColor: getScoreColor(result.semanticScore),
                    }}
                  ></div>
                </div>
                <div className="breakdown-value">{result.semanticScore}/100</div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-label">Keyword Score</div>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-fill"
                    style={{
                      width: `${result.keywordScore}%`,
                      backgroundColor: getScoreColor(result.keywordScore),
                    }}
                  ></div>
                </div>
                <div className="breakdown-value">{result.keywordScore}/100</div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-label">Skill Match %</div>
                <div className="breakdown-bar">
                  <div
                    className="breakdown-fill"
                    style={{
                      width: `${result.matchPercentage}%`,
                      backgroundColor: getScoreColor(result.matchPercentage),
                    }}
                  ></div>
                </div>
                <div className="breakdown-value">{result.matchPercentage}%</div>
              </div>
            </div>
          </div>

          {/* Skill Analysis */}
          <div className="skill-analysis">
            <h3>Skill Analysis</h3>
            <p className="skill-summary">
              Matched <strong>{result.matchedCount}</strong> of <strong>{result.totalRequired}</strong> required skills
            </p>

            {/* Matched Skills */}
            <div className="skills-section">
              <h4>✓ Matched Skills ({result.matchedSkills.length})</h4>
              {result.matchedSkills.length > 0 ? (
                <div className="skills-tags">
                  {result.matchedSkills.slice(0, 10).map((skill, idx) => (
                    <span key={idx} className="skill-tag matched">
                      {skill}
                    </span>
                  ))}
                  {result.matchedSkills.length > 10 && (
                    <span className="skill-tag more">+{result.matchedSkills.length - 10} more</span>
                  )}
                </div>
              ) : (
                <p className="no-skills">No matched skills found</p>
              )}
            </div>

            {/* Missing Skills */}
            {result.missingSkills.length > 0 && (
              <div className="skills-section">
                <h4>✗ Missing Skills ({result.missingSkills.length})</h4>
                <div className="skills-tags">
                  {result.missingSkills.slice(0, 10).map((skill, idx) => (
                    <span key={idx} className="skill-tag missing">
                      {skill}
                    </span>
                  ))}
                  {result.missingSkills.length > 10 && (
                    <span className="skill-tag more">+{result.missingSkills.length - 10} more</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="suggestions-section">
              <h3>💡 Recommendations</h3>
              {result.suggestions.map((suggestion, idx) => (
                <div key={idx} className={`suggestion suggestion-${suggestion.type}`}>
                  <div className="suggestion-header">
                    <span className="suggestion-type">{suggestion.type.toUpperCase()}</span>
                    {suggestion.priority && (
                      <span className={`priority priority-${suggestion.priority}`}>
                        {suggestion.priority}
                      </span>
                    )}
                  </div>
                  <p>{suggestion.message}</p>
                  {suggestion.skills && suggestion.skills.length > 0 && (
                    <div className="suggestion-skills">
                      {suggestion.skills.map((skill, sidx) => (
                        <span key={sidx} className="suggestion-skill">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Insights */}
          {result.insights && result.insights.length > 0 && (
            <div className="insights-section">
              <h3>📊 Key Insights</h3>
              {result.insights.map((insight, idx) => (
                <div key={idx} className={`insight insight-${insight.type}`}>
                  <div className="insight-header">
                    <strong>{insight.area}</strong>
                  </div>
                  <p>{insight.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form Section */}
      {!result && (
        <form
          className="ats-form"
          onSubmit={handleSubmit}
          style={{ opacity: canCheckToday ? 1 : 0.5, pointerEvents: canCheckToday ? "auto" : "none" }}
        >
          {/* Resume Upload */}
          <div className="form-group">
            <label htmlFor="resume" className="form-label">
              Upload Resume <span className="required">*</span>
            </label>
            <div
              className="file-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="resume"
                accept=".pdf,.docx"
                onChange={handleResumeChange}
                hidden
              />
              {resumeFile ? (
                <div className="file-selected">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{resumeFile.name}</span>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="file-placeholder">
                  <span className="upload-icon">📥</span>
                  <p>Click to upload or drag and drop</p>
                  <small>PDF or DOCX (Max 5MB)</small>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="form-group">
            <label htmlFor="jobDescription" className="form-label">
              Job Description <span className="required">*</span>
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="form-textarea"
              rows={8}
            />
            <small className="char-count">
              {jobDescription.length} characters (minimum 50)
            </small>
          </div>

          {/* Save Result Option */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={saveResult}
                onChange={(e) => setSaveResult(e.target.checked)}
              />
              Save this result for future reference
            </label>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !resumeFile || !jobDescription.trim() || !canCheckToday}
            >
              {loading ? (
                <>
                  <span className="spinner">⚙️</span> Analyzing...
                </>
              ) : !canCheckToday ? (
                <>
                  <span className="btn-icon">⏱️</span> Check limit reached today
                </>
              ) : (
                <>
                  <span className="btn-icon">🔍</span> Check ATS Match
                </>
              )}
            </button>
            <button type="reset" className="btn btn-secondary" onClick={handleReset} disabled={!canCheckToday}>
              Clear
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-animation"></div>
            <p>Analyzing your resume and job description...</p>
            <small>This may take a minute as we extract and compare content</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSChecker;
