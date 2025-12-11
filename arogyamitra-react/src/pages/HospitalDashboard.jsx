import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    patient_phone: '',
    patient_aadhaar_last4: '',
    title: '',
    scan_type: '',
    hospital_name: '',
    test_date: '',
    report_file: null
  });

  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const scanTypes = [
    'MRI', 'CT', 'Blood', 'Xray', 'Ultrasound', 'ECG', 'Others'
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load upload history if on reports tab
    if (activeTab === 'reports') {
      loadUploadHistory();
    }
  }, [activeTab, navigate, isAuthenticated]);

  const loadUploadHistory = async () => {
    try {
      setLoading(true);
      // We'll need to update this to use the apiService directly since it's not in AuthProvider
      // For now, we'll keep it as is since it's a protected route
      const response = await apiService.getHospitalUploadHistory();
      if (response.success) {
        setReports(response.data);
      } else {
        setError(response.error || 'Failed to load upload history');
      }
    } catch (err) {
      setError('Failed to load upload history: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('patient_phone', formData.patient_phone);
      formDataObj.append('patient_aadhaar_last4', formData.patient_aadhaar_last4);
      formDataObj.append('title', formData.title);
      formDataObj.append('scan_type', formData.scan_type);
      formDataObj.append('hospital_name', formData.hospital_name);
      formDataObj.append('test_date', formData.test_date);
      formDataObj.append('report_file', formData.report_file);
      
      const response = await apiService.uploadMedicalReport(formDataObj);
      
      if (response.success) {
        alert('Report uploaded successfully!');
        // Reset form
        setFormData({
          patient_phone: '',
          patient_aadhaar_last4: '',
          title: '',
          scan_type: '',
          hospital_name: '',
          test_date: '',
          report_file: null
        });
      } else {
        alert('Failed to upload report: ' + response.error);
      }
    } catch (error) {
      alert('Failed to upload report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Hospital <span className="gradient-text">Dashboard</span>
        </h1>
        <button className="btn btn-outline" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
      
      <div className="glass-card mb-4">
        <div className="d-flex border-bottom border-gray" style={{ marginBottom: '1rem' }}>
          <button
            className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('upload')}
            style={{ marginRight: '0.5rem' }}
          >
            <i className="fas fa-upload"></i> Upload Report
          </button>
          <button
            className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="fas fa-file-medical"></i> Uploaded Reports
          </button>
        </div>
        
        {activeTab === 'upload' ? (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Patient Phone Number</label>
                <div className="input-wrapper">
                  <i className="fas fa-phone"></i>
                  <input
                    type="tel"
                    name="patient_phone"
                    value={formData.patient_phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter patient's phone number"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Patient Aadhaar Last 4 Digits</label>
                <div className="input-wrapper">
                  <i className="fas fa-id-card"></i>
                  <input
                    type="text"
                    name="patient_aadhaar_last4"
                    value={formData.patient_aadhaar_last4}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Last 4 digits of patient's Aadhaar"
                    maxLength="4"
                  />
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Report Title</label>
                <div className="input-wrapper">
                  <i className="fas fa-heading"></i>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter report title"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Scan Type</label>
                <div className="input-wrapper">
                  <i className="fas fa-file-medical"></i>
                  <select
                    name="scan_type"
                    value={formData.scan_type}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select scan type</option>
                    {scanTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Hospital Name</label>
                <div className="input-wrapper">
                  <i className="fas fa-hospital"></i>
                  <input
                    type="text"
                    name="hospital_name"
                    value={formData.hospital_name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter hospital name"
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Test Date</label>
                <div className="input-wrapper">
                  <i className="fas fa-calendar"></i>
                  <input
                    type="date"
                    name="test_date"
                    value={formData.test_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="col-12 mb-3">
                <label className="form-label">Upload Report File</label>
                <div className="input-wrapper">
                  <i className="fas fa-file-upload"></i>
                  <input
                    type="file"
                    name="report_file"
                    onChange={handleChange}
                    className="form-input"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-glow" 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fas fa-cloud-upload-alt"></i> Upload Report Securely
                </>
              )}
            </button>
          </form>
        ) : (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Recently Uploaded Reports</h3>
              <button className="btn btn-primary" onClick={loadUploadHistory} disabled={loading}>
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status"></div>
                <p>Loading upload history...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                {error}
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-file-medical fa-3x mb-3" style={{ color: 'var(--gray-300)' }}></i>
                <h4>No Reports Uploaded</h4>
                <p className="text-muted">Upload reports using the form to see them here</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Report Title</th>
                      <th>Scan Type</th>
                      <th>Upload Date</th>
                      <th>Analyzed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(report => (
                      <tr key={report.id} className="glass-card" style={{ marginBottom: '0.5rem' }}>
                        <td>{report.patient_name}</td>
                        <td>{report.title}</td>
                        <td>
                          <span className="badge" style={{ 
                            background: 'rgba(6, 182, 212, 0.2)', 
                            border: '1px solid var(--primary-teal)', 
                            color: 'var(--primary-teal)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '50px'
                          }}>
                            {report.scan_type}
                          </span>
                        </td>
                        <td>{new Date(report.uploaded_date).toLocaleDateString()}</td>
                        <td>
                          {report.is_analyzed ? (
                            <span className="badge bg-success">Yes</span>
                          ) : (
                            <span className="badge bg-warning">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="glass-card">
        <h3 className="mb-3">Hospital Staff Guidelines</h3>
        <ul>
          <li className="mb-2">Always verify patient identity using phone number and Aadhaar before uploading reports</li>
          <li className="mb-2">Ensure reports are clear and legible before uploading</li>
          <li className="mb-2">All reports are encrypted and securely stored in compliance with healthcare regulations</li>
          <li className="mb-2">Patients can access their reports after verifying with OTP sent to their registered mobile</li>
          <li>For any issues, contact ArogyaMitra support at support@arogyamitra.ai</li>
        </ul>
      </div>
    </div>
  );
};

export default HospitalDashboard;