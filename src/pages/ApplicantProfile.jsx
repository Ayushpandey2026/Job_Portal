import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const ApplicantProfile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [tempData, setTempData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user && user.role === 'applicant') {
      fetchProfile();
      fetchApplications();
    } else {
      navigate('/applicant');
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applicant/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setTempData(res.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setTempData(profile.profile);
  };

  const updateTempData = (path, value) => {
    setTempData(prev => {
      const newData = { ...prev };
      let current = newData;
      const parts = path.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = current[parts[i]] || {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newData;
    });
  };

  const addArrayItem = (field) => {
    setTempData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), {}]
    }));
  };

  const removeArrayItem = (field, index) => {
    setTempData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/applicant/profile`, { profile: tempData }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProfile();
      setEditingSection(null);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile updated successfully!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applicant/resume-upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });
      await fetchProfile();
      setUploadProgress(0);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Resume uploaded successfully!',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Upload error:', error.response?.data || error);
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    }
  };

  const getStatusColor = (status) => ({
    selected: 'bg-green-500',
    rejected: 'bg-red-500',
    pending: 'bg-yellow-500'
  })[status] || 'bg-gray-500';

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">Profile not found. <button onClick={fetchProfile} className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-2">Reload</button></div>
    </div>
  );

  const sections = [
    { id: 'about', title: 'About Me', field: 'about', type: 'text', placeholder: 'Tell about yourself...' },
    { id: 'preferences', title: 'Job Preferences', field: 'preferences', type: 'object' },
    { id: 'education', title: 'Education', field: 'education', type: 'array', subfields: ['institution', 'degree', 'year'] },
{ id: 'key-skills', title: 'Key Skills', field: 'keySkills', type: 'text' },
    { id: 'languages', title: 'Languages', field: 'languages', type: 'array', subfields: ['name', 'proficiency'] },
    { id: 'internships', title: 'Internships', field: 'internships', type: 'array', subfields: ['company', 'role', 'duration'] },
    { id: 'projects', title: 'Projects', field: 'projects', type: 'array', subfields: ['name', 'description', 'url'] },
    { id: 'profile-summary', title: 'Profile Summary', field: 'profileSummary', type: 'text', placeholder: 'Professional summary...' }
  ];

  const renderSectionContent = (section) => {
    const value = tempData[section.field];
    if (!value) return <p className="text-gray-500 italic">No data added yet.</p>;

    switch (section.type) {
      case 'text':
        return <p className="text-gray-800 leading-relaxed">{value}</p>;
      case 'object':
        return Object.entries(value).map(([key, val]) => (
          <div key={key} className="mb-1">
            <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {val}
          </div>
        ));
      case 'array':
        return (value || []).length > 0 ? (
          <div className="space-y-2">
            {value.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                {section.subfields.map(sf => (
                  <div key={sf} className="mb-1">
                    <strong>{sf.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {item[sf] || 'N/A'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500 italic">No items added.</p>;
      default:
        return <p className="text-gray-500">Section type not supported.</p>;
    }
  };

  const renderEditForm = (section) => {
    const value = tempData[section.field];
    return (
      <div className="space-y-4">
        {section.type === 'text' && (
          <textarea
            value={value || ''}
            onChange={(e) => updateTempData(section.field, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            rows="4"
            placeholder={section.placeholder}
          />
        )}
        {section.type === 'object' && section.field === 'preferences' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={value?.jobType || ''}
              onChange={(e) => updateTempData('preferences.jobType', e.target.value)}
              placeholder="Job Type (Full-time, Internship, etc.)"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={value?.location || ''}
              onChange={(e) => updateTempData('preferences.location', e.target.value)}
              placeholder="Preferred Location"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={value?.salaryExpectation || ''}
              onChange={(e) => updateTempData('preferences.salaryExpectation', e.target.value)}
              placeholder="Salary Expectation"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {section.type === 'array' && (
          <div className="space-y-3">
            {(value || []).map((item, index) => (
              <div key={index} className="flex gap-2 items-end">
                {section.subfields.map(sf => (
                  <input
                    key={sf}
                    value={item[sf] || ''}
                    onChange={(e) => {
                      const newArray = [...value];
                      newArray[index][sf] = e.target.value;
                      updateTempData(section.field, newArray);
                    }}
                    placeholder={sf.charAt(0).toUpperCase() + sf.slice(1)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => removeArrayItem(section.field, index)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(section.field)}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              + Add {section.title.toLowerCase()}
            </button>
          </div>
        )}
{section.field === 'keySkills' && (
          <div>
            <input
              type="text"
              value={Array.isArray(value) ? value.join(', ') : value || ''}
              onChange={(e) => updateTempData(section.field, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter skills separated by commas..."
            />
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => setEditingSection(null)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/applicant')}
          className="mb-8 inline-flex items-center space-x-2 bg-white shadow-lg hover:shadow-xl px-5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
              {profile.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{profile.name}</h1>
              <p className="text-lg md:text-xl text-gray-600 mt-1">{profile.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Applicant</span>
                {profile.phone && <span className="text-sm text-gray-500">📞 {profile.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Applications Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">📋 My Applications</h2>
                <Link to="/applicant" className="text-blue-600 hover:text-blue-800 font-medium text-sm">View All →</Link>
              </div>
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map(app => (
                    <div key={app._id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 text-base">{app.job.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(app.status)}`}>
                          {app.status?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{app.job.company}</p>
                      <p className="text-xs text-gray-500 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📭</div>
                  <p className="text-gray-600 text-lg font-medium">No applications yet</p>
                  <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-medium">
                    Browse Jobs
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Sections */}
            {sections.map(section => (
              <div key={section.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-2xl">📄</span> {section.title}
                  </h2>
                  <button
                    onClick={() => handleEdit(section.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all font-medium text-sm"
                  >
                    Edit
                  </button>
                </div>
                <div className="min-h-[120px]">
                  {renderSectionContent(section)}
                </div>
              </div>
            ))}

            {/* Resume Section */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-2xl">📄</span> Resume
                </h2>
              </div>
              <div className="space-y-4">
                {tempData.resumeUrl ? (
                  <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <a
                          href={`${import.meta.env.VITE_API_URL}${tempData.resumeUrl}`}
                          download
                          className="font-semibold text-lg text-green-800 hover:text-green-900"
                        >
                          Resume uploaded ✓
                        </a>
                        <p className="text-sm text-green-700">Click to download</p>
                      </div>
                    </div>
                    <label className="block w-full cursor-pointer">
                      <input
                        type="file"
                        onChange={handleResumeUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                      />
                      <div className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-all text-center shadow-md hover:shadow-lg">
                        📤 Replace Resume
                      </div>
                    </label>
                    {uploadProgress > 0 && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-blue-600 mt-1 font-medium">{uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                    <div className="text-5xl mb-4 text-gray-400">📄</div>
                    <p className="text-lg font-medium text-gray-700 mb-4">No resume uploaded</p>
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        onChange={handleResumeUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                      />
                      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white py-4 px-8 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all mx-auto">
                        Upload Resume Now
                      </div>
                    </label>
                    <p className="text-sm text-gray-500 mt-3">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-dashed border-purple-200 shadow-lg">
              <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> Profile Tips
              </h3>
              <ul className="space-y-3 text-sm leading-relaxed text-purple-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Complete all sections for better matches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Quantify achievements (saved 30% cost, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-0.5">★</span>
                  <span>ATS-friendly resume (keywords)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 shadow-lg">
              <h3 className="text-lg font-bold text-emerald-800 mb-4">📊 Profile Completeness</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Sections filled</span>
                  <span>8/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingSection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit {sections.find(s => s.id === editingSection)?.title}</h2>
                <button onClick={() => setEditingSection(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              {renderEditForm(sections.find(s => s.id === editingSection))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantProfile;
