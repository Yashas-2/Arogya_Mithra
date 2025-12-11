import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import apiService from '../services/apiService';

const ReportAnalysis = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
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
      } else {
        setError(response.error || 'Failed to load reports');
      }
    } catch (err) {
      setError('Failed to load reports: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedReport) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.analyzeMedicalReport({
        report_id: selectedReport.id,
        language: language
      });
      
      if (response.success) {
        setAnalysisResult(response.data);
      } else {
        setError(response.error || 'Failed to analyze report');
      }
    } catch (err) {
      setError('Failed to analyze report: ' + err.message);
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
        <h1 className="text-center" style={{ background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI <span className="gradient-text">Report Analysis</span>
        </h1>
        <button className="btn btn-outline" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
      <p className="text-center mb-5" style={{ color: 'var(--gray-300)', fontSize: '1.25rem' }}>
        Upload your medical reports and get AI-powered explanations in simple language
      </p>

      {loading && !selectedReport && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status"></div>
          <p>Loading reports...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {!selectedReport ? (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 className="mb-4">Select a Report to Analyze</h3>
          
          <div className="mb-4">
            <label className="form-label">Preferred Language</label>
            <div className="input-wrapper">
              <i className="fas fa-language"></i>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-select"
              >
                <option value="English">English</option>
                <option value="Kannada">ಕನ್ನಡ</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status"></div>
              <p>Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-file-medical fa-3x mb-3" style={{ color: 'var(--gray-300)' }}></i>
              <h4>No Reports Available</h4>
              <p className="text-muted">Upload reports through the hospital dashboard or refresh the page</p>
              <button className="btn btn-primary" onClick={loadReports}>
                <i className="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          ) : (
            <div className="row">
              {reports.map(report => (
                <div key={report.id} className="col-md-6 mb-3">
                  <div 
                    className="glass-card" 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectReport(report)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5>{report.title}</h5>
                      {report.is_analyzed && (
                        <span className="badge" style={{ 
                          background: 'rgba(34, 197, 94, 0.2)', 
                          border: '1px solid var(--success-green)', 
                          color: 'var(--success-green)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '50px'
                        }}>
                          <i className="fas fa-check-circle"></i>
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--gray-300)', margin: '0.5rem 0' }}>
                      <i className="fas fa-file-medical"></i> {report.scan_type}
                    </p>
                    <p style={{ color: 'var(--gray-300)', margin: '0.5rem 0' }}>
                      <i className="fas fa-hospital"></i> {report.hospital_name}
                    </p>
                    <p style={{ color: 'var(--gray-300)', margin: '0.5rem 0' }}>
                      <i className="fas fa-calendar"></i> {new Date(report.uploaded_date || report.test_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-4">
            <button className="btn btn-glow" onClick={() => navigate('/report-vault')}>
              <i className="fas fa-upload"></i> View All Reports
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="glass-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>{selectedReport.title}</h3>
              <button 
                className="btn btn-outline" 
                onClick={() => setSelectedReport(null)}
              >
                <i className="fas fa-arrow-left"></i> Back to Reports
              </button>
            </div>
            <p style={{ color: 'var(--gray-300)' }}>
              <i className="fas fa-file-medical"></i> {selectedReport.scan_type} | 
              <i className="fas fa-hospital ms-2"></i> {selectedReport.hospital_name} | 
              <i className="fas fa-calendar ms-2"></i> {new Date(selectedReport.uploaded_date || selectedReport.test_date).toLocaleDateString()}
            </p>
          </div>

          {!analysisResult ? (
            <div className="glass-card text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h4 className="mb-4">Analyze with AI</h4>
              <p className="mb-4" style={{ color: 'var(--gray-300)' }}>
                Get a simple explanation of your medical report in {language}
              </p>
              <button 
                className="btn btn-glow" 
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <i className="fas fa-brain"></i> Analyze Report
                  </>
                )}
              </button>
              
              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="glass-card mb-4">
                <h3 className="mb-3 gradient-text">Summary</h3>
                <p>{analysisResult.patient_summary}</p>
              </div>

              <div className="glass-card mb-4">
                <h3 className="mb-3 gradient-text">Abnormal Findings</h3>
                {analysisResult.abnormal_findings && analysisResult.abnormal_findings.length > 0 ? (
                  analysisResult.abnormal_findings.map((finding, index) => (
                    <div key={index} className="mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>{finding.parameter}</h5>
                        <span className={`badge ${
                          finding.severity === 'High' ? 'bg-danger' : 
                          finding.severity === 'Medium' ? 'bg-warning' : 'bg-info'
                        }`} style={{ padding: '0.5rem 1rem', borderRadius: '50px' }}>
                          {finding.severity}
                        </span>
                      </div>
                      <p style={{ margin: '0.5rem 0' }}>
                        <strong>Your Value:</strong> {finding.value} | 
                        <strong> Normal Range:</strong> {finding.normal_range}
                      </p>
                      <p style={{ margin: '0.5rem 0', color: 'var(--gray-300)' }}>
                        {finding.simple_explanation}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No abnormal findings detected in this report.</p>
                )}
              </div>

              <div className="glass-card mb-4">
                <h3 className="mb-3 gradient-text">Risk Level</h3>
                <div className="text-center">
                  <span className={`badge ${
                    analysisResult.risk_level === 'High' ? 'bg-danger' : 
                    analysisResult.risk_level === 'Medium' ? 'bg-warning' : 'bg-success'
                  }`} style={{ 
                    padding: '0.75rem 2rem', 
                    fontSize: '1.25rem', 
                    borderRadius: '50px' 
                  }}>
                    {analysisResult.risk_level} Risk
                  </span>
                </div>
              </div>

              <div className="glass-card mb-4">
                <h3 className="mb-3 gradient-text">Lifestyle Recommendations</h3>
                {analysisResult.lifestyle_recommendations && analysisResult.lifestyle_recommendations.length > 0 ? (
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    {analysisResult.lifestyle_recommendations.map((rec, index) => (
                      <li key={index} className="mb-2">{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No specific lifestyle recommendations provided for this report.</p>
                )}
              </div>

              <div className="glass-card mb-4">
                <h3 className="mb-3 gradient-text">Doctor Visit Suggestion</h3>
                <p>{analysisResult.doctor_visit_suggestion}</p>
              </div>

              <div className="text-center">
                <button className="btn btn-primary me-2">
                  <i className="fas fa-download"></i> Download Report
                </button>
                <button className="btn btn-glow">
                  <i className="fas fa-share-alt"></i> Share Results
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportAnalysis;