import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import apiService from '../services/apiService';

const SchemeChecker = () => {
  const [formData, setFormData] = useState({
    age: '',
    district: '',
    economic_status: 'APL',
    has_ration_card: false,
    has_aadhaar: false,
    disease_type: '',
    language: 'English'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  // Karnataka districts
  const districts = [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
    'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
    'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri',
    'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur',
    'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada',
    'Vijayapura', 'Yadgir'
  ];

  // Disease types
  const diseaseTypes = [
    'Cardio', 'Ortho', 'General', 'Cancer', 'Neuro', 'Kidney', 'Others'
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [navigate, isAuthenticated]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.checkSchemeEligibility({
        age: parseInt(formData.age),
        district: formData.district,
        economic_status: formData.economic_status,
        has_ration_card: formData.has_ration_card,
        has_aadhaar: formData.has_aadhaar,
        disease_type: formData.disease_type,
        language: formData.language
      });
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Failed to check eligibility');
      }
    } catch (err) {
      setError('Failed to check eligibility: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      age: '',
      district: '',
      economic_status: 'APL',
      has_ration_card: false,
      has_aadhaar: false,
      disease_type: '',
      language: 'English'
    });
    setResult(null);
    setError(null);
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
          Check Your <span className="gradient-text">Eligibility</span>
        </h1>
        <button className="btn btn-outline" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
      <p className="text-center mb-4" style={{ color: 'var(--gray-300)', fontSize: '1.25rem' }}>
        AI will find the best Karnataka & Central Government health schemes for you
      </p>

      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      {!result ? (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h3 className="mb-3">Enter Your Details</h3>
              
              <div className="form-group mb-3">
                <label className="form-label">Your Age</label>
                <div className="input-wrapper">
                  <i className="fas fa-user"></i>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your age"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group mb-3">
                <label className="form-label">District (Karnataka)</label>
                <div className="input-wrapper">
                  <i className="fas fa-map-marker-alt"></i>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select your district</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group mb-3">
                <label className="form-label">Economic Status</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                    <input
                      type="radio"
                      name="economic_status"
                      value="BPL"
                      checked={formData.economic_status === 'BPL'}
                      onChange={handleChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    BPL (Below Poverty Line)
                  </label>
                  <label className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                    <input
                      type="radio"
                      name="economic_status"
                      value="APL"
                      checked={formData.economic_status === 'APL'}
                      onChange={handleChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    APL (Above Poverty Line)
                  </label>
                </div>
              </div>
              
              <div className="form-group mb-3">
                <label className="form-label">Document Availability</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      name="has_ration_card"
                      checked={formData.has_ration_card}
                      onChange={handleChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Ration Card
                  </label>
                  <label className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      name="has_aadhaar"
                      checked={formData.has_aadhaar}
                      onChange={handleChange}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Aadhaar Card
                  </label>
                </div>
              </div>
              
              <div className="form-group mb-3">
                <label className="form-label">Disease / Medical Condition</label>
                <div className="input-wrapper">
                  <i className="fas fa-heartbeat"></i>
                  <select
                    name="disease_type"
                    value={formData.disease_type}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select condition</option>
                    {diseaseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group mb-4">
                <label className="form-label">Preferred Language</label>
                <div className="input-wrapper">
                  <i className="fas fa-language"></i>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="English">English</option>
                    <option value="Kannada">ಕನ್ನಡ</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-glow" style={{ flex: 1 }} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      AI is analyzing...
                    </>
                  ) : (
                    'Check Eligibility with AI'
                  )}
                </button>
                <button type="button" className="btn btn-outline" onClick={handleReset} style={{ flex: 1 }}>
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="text-center mb-4">
            <h2 className="gradient-text">{result.scheme_name}</h2>
            <p className="mt-2" style={{ color: 'var(--gray-300)' }}>{result.scheme_type} Scheme</p>
            <div className="mt-3">
              <span className="badge" style={{ 
                padding: '0.5rem 1rem', 
                background: 'rgba(16, 185, 129, 0.2)', 
                border: '1px solid var(--primary-emerald)', 
                borderRadius: '50px', 
                color: 'var(--primary-emerald)', 
                fontWeight: '600' 
              }}>
                Eligibility Score: {result.eligibility_score}
              </span>
            </div>
          </div>
          
          <div className="glass-card mb-4">
            <h3 className="mb-3 gradient-text">Why You're Eligible</h3>
            <p>{result.why_eligible}</p>
          </div>
          
          <div className="glass-card mb-4">
            <h3 className="mb-3 gradient-text">Required Documents</h3>
            {result.required_documents && result.required_documents.length > 0 ? (
              <ul style={{ paddingLeft: '1.5rem' }}>
                {result.required_documents.map((doc, index) => (
                  <li key={index} className="mb-2">{doc}</li>
                ))}
              </ul>
            ) : (
              <p>No specific documents required for this scheme.</p>
            )}
          </div>
          
          <div className="glass-card mb-4">
            <h3 className="mb-3 gradient-text">How to Apply</h3>
            {result.apply_steps && result.apply_steps.length > 0 ? (
              <ol style={{ paddingLeft: '1.5rem' }}>
                {result.apply_steps.map((step, index) => (
                  <li key={index} className="mb-2">{step}</li>
                ))}
              </ol>
            ) : (
              <p>No specific application steps provided for this scheme.</p>
            )}
          </div>
          
          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={handleReset}>
              <i className="fas fa-redo"></i> Check Another Scheme
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeChecker;