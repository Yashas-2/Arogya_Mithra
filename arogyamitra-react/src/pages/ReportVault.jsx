import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import apiService from '../services/apiService';

const ReportVault = () => {
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is already authenticated
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    // Load reports
    loadReports();
  }, [navigate, isAuthenticated]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMedicalReports();
      if (response.success) {
        setReports(response.data);
        // Check if OTP is already verified in the session
        setIsVerified(response.otp_verified);
      } else {
        setError(response.error || 'Failed to load reports');
      }
    } catch (err) {
      setError('Failed to load reports: ' + err.message);
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

  const handleRequestOtp = async () => {
    try {
      const response = await apiService.requestOtp();
      if (response.success) {
        alert(`OTP sent to your registered mobile number. Demo OTP: ${response.demo_otp}`);
      } else {
        alert('Failed to request OTP: ' + response.error);
      }
    } catch (error) {
      alert('Failed to request OTP: ' + error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiService.verifyOtp({ otp_code: otp });
      if (response.success) {
        setIsVerified(true);
        // Reload reports to update can_view status
        loadReports();
      } else {
        alert('Failed to verify OTP: ' + response.error);
      }
    } catch (error) {
      alert('Failed to verify OTP: ' + error.message);
    }
  };

  const handleViewReport = async (reportId) => {
    try {
      // Get the report blob (PDF file)
      const blob = await apiService.viewReport(reportId);
      
      // Create a URL for the blob and open it in a new tab
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, '_blank');
      
      // Revoke the URL after opening to free memory
      setTimeout(() => URL.revokeObjectURL(fileUrl), 100);
    } catch (error) {
      alert('Failed to view report: ' + error.message);
    }
  };

  const handleAnalyzeReport = async (reportId) => {
    try {
      const response = await apiService.analyzeMedicalReport({ report_id: reportId });
      if (response.success) {
        // Update the report status in the UI
        setReports(prev => prev.map(report => 
          report.id === reportId ? {...report, is_analyzed: true} : report
        ));
        alert('Report analyzed successfully!');
      } else {
        alert('Failed to analyze report: ' + response.error);
      }
    } catch (error) {
      alert('Failed to analyze report: ' + error.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      {loading ? (
        <div className="text-center" style={{ padding: '2rem' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading reports...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <h3>Error Loading Reports</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadReports}>Try Again</button>
        </div>
      ) : !isVerified ? (
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 style={{ background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Secure <span className="gradient-text">Report Access</span>
            </h1>
            <button className="btn btn-outline" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
          <p className="text-center mb-4" style={{ color: 'var(--gray-300)' }}>
            Enter OTP sent to your registered mobile number
          </p>
          
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group mb-4">
              <label className="form-label">Enter 6-digit OTP</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="form-input"
                  placeholder="Enter OTP"
                  maxLength="6"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-glow" style={{ width: '100%' }}>
              Verify & Access Reports
            </button>
          </form>
          
          <div className="text-center mt-4" style={{ color: 'var(--gray-300)' }}>
            <p>Didn't receive OTP? <a href="#" onClick={handleRequestOtp} style={{ color: 'var(--primary-emerald)' }}>Resend OTP</a></p>
          </div>
        </div>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 style={{ background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              My <span className="gradient-text">Medical Reports</span>
            </h1>
            <div>
              <button className="btn btn-primary me-2" onClick={loadReports}>
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
              <button className="btn btn-outline" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
          
          <div className="glass-card mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3>Total Reports</h3>
                <p style={{ color: 'var(--gray-300)', margin: '0.5rem 0 0' }}>{reports.length} reports</p>
              </div>
              <div>
                <h3>Analyzed</h3>
                <p style={{ color: 'var(--gray-300)', margin: '0.5rem 0 0' }}>
                  {reports.filter(r => r.is_analyzed).length} reports
                </p>
              </div>
              <div>
                <h3>Pending</h3>
                <p style={{ color: 'var(--gray-300)', margin: '0.5rem 0 0' }}>
                  {reports.filter(r => !r.is_analyzed).length} reports
                </p>
              </div>
            </div>
          </div>
          
          {reports.length === 0 ? (
            <div className="text-center" style={{ padding: '2rem' }}>
              <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--gray-300)' }}></i>
              <h3>No Reports Found</h3>
              <p style={{ color: 'var(--gray-300)' }}>Reports uploaded by authorized hospital staff will appear here</p>
            </div>
          ) : (
            <div className="row">
              {reports.map(report => (
                <div key={report.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="glass-card">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h4>{report.title}</h4>
                      {report.is_analyzed ? (
                        <span className="badge" style={{ 
                          background: 'rgba(34, 197, 94, 0.2)', 
                          border: '1px solid var(--success-green)', 
                          color: 'var(--success-green)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '50px'
                        }}>
                          <i className="fas fa-check-circle"></i> Analyzed
                        </span>
                      ) : (
                        <span className="badge" style={{ 
                          background: 'rgba(239, 68, 68, 0.2)', 
                          border: '1px solid var(--danger-red)', 
                          color: 'var(--danger-red)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '50px'
                        }}>
                          <i className="fas fa-clock"></i> Pending
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <p style={{ margin: '0.5rem 0', color: 'var(--gray-300)' }}>
                        <i className="fas fa-file-medical"></i> {report.scan_type}
                      </p>
                      <p style={{ margin: '0.5rem 0', color: 'var(--gray-300)' }}>
                        <i className="fas fa-hospital"></i> {report.hospital_name}
                      </p>
                      <p style={{ margin: '0.5rem 0', color: 'var(--gray-300)' }}>
                        <i className="fas fa-calendar"></i> {new Date(report.uploaded_date || report.test_date).toLocaleDateString()}
                      </p>
                      <p style={{ margin: '0.5rem 0', color: 'var(--gray-300)' }}>
                        <i className="fas fa-weight"></i> {report.file_size}
                      </p>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1 }}
                        onClick={() => handleViewReport(report.id)}
                      >
                        <i className="fas fa-eye"></i> View
                      </button>
                      {!report.is_analyzed && (
                        <button 
                          className="btn btn-glow" 
                          style={{ flex: 1 }}
                          onClick={() => handleAnalyzeReport(report.id)}
                        >
                          <i className="fas fa-brain"></i> Analyze
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportVault;