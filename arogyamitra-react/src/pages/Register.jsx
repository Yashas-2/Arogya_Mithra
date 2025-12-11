import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const Register = () => {
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    district: '',
    economic_status: 'APL',
    has_ration_card: false,
    has_aadhaar: false,
    aadhaar_last4: '',
    disease_type: '',
    username: '',
    password: '',
    confirm_password: '',
    hospital_name: '',
    department: '',
    license_number: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      let userData;
      
      if (userType === 'patient') {
        userData = {
          user_type: 'patient',
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.name,
          phone_number: formData.phone,
          age: parseInt(formData.age),
          district: formData.district,
          economic_status: formData.economic_status,
          has_ration_card: formData.has_ration_card,
          has_aadhaar: formData.has_aadhaar,
          aadhaar_last4: formData.aadhaar_last4,
          disease_type: formData.disease_type
        };
      } else {
        userData = {
          user_type: 'hospital',
          username: formData.username,
          email: formData.email,
          password: formData.password,
          staff_name: formData.name,
          hospital_name: formData.hospital_name,
          department: formData.department,
          license_number: formData.license_number
        };
      }
      
      const response = await register(userData);
      
      if (response.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        alert('Registration failed: ' + (response.message || 'Please try again'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 className="text-center mb-4" style={{ background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Create <span className="gradient-text">Account</span>
        </h1>
        
        <div className="text-center mb-4">
          <h3>Select your account type to get started</h3>
        </div>
        
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn ${userType === 'patient' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setUserType('patient')}
            >
              <i className="fas fa-user me-2"></i> Patient Registration
            </button>
            <button
              type="button"
              className={`btn ${userType === 'hospital' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setUserType('hospital')}
            >
              <i className="fas fa-hospital me-2"></i> Hospital Staff Registration
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {userType === 'patient' ? (
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <div className="input-wrapper">
                    <i className="fas fa-phone"></i>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Age</label>
                  <div className="input-wrapper">
                    <i className="fas fa-birthday-cake"></i>
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
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">District</label>
                  <div className="input-wrapper">
                    <i className="fas fa-map-marker-alt"></i>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Economic Status</label>
                  <div className="input-wrapper">
                    <i className="fas fa-rupee-sign"></i>
                    <select
                      name="economic_status"
                      value={formData.economic_status}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="APL">APL (Above Poverty Line)</option>
                      <option value="BPL">BPL (Below Poverty Line)</option>
                    </select>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Disease Type</label>
                  <div className="input-wrapper">
                    <i className="fas fa-heartbeat"></i>
                    <select
                      name="disease_type"
                      value={formData.disease_type}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Disease</option>
                      {diseaseTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Aadhaar Last 4 Digits</label>
                  <div className="input-wrapper">
                    <i className="fas fa-id-card"></i>
                    <input
                      type="text"
                      name="aadhaar_last4"
                      value={formData.aadhaar_last4}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Last 4 digits of Aadhaar"
                      maxLength="4"
                    />
                  </div>
                </div>
                
                <div className="col-12 mb-3">
                  <label className="form-label">Document Availability</label>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <label className="btn btn-outline">
                      <input
                        type="checkbox"
                        name="has_ration_card"
                        checked={formData.has_ration_card}
                        onChange={handleChange}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Have Ration Card?
                    </label>
                    <label className="btn btn-outline">
                      <input
                        type="checkbox"
                        name="has_aadhaar"
                        checked={formData.has_aadhaar}
                        onChange={handleChange}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Have Aadhaar Card?
                    </label>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <i className="fas fa-user"></i>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <div className="input-wrapper">
                    <i className="fas fa-envelope"></i>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your email"
                      required
                    />
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
                  <label className="form-label">Department</label>
                  <div className="input-wrapper">
                    <i className="fas fa-stethoscope"></i>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter department"
                    />
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">License Number</label>
                  <div className="input-wrapper">
                    <i className="fas fa-id-card"></i>
                    <input
                      type="text"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter license number"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Username</label>
              <div className="input-wrapper">
                <i className="fas fa-user-circle"></i>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn btn-glow" style={{ width: '100%' }}>
            <i className="fas fa-user-plus"></i> Register
          </button>
        </form>
        
        <div className="text-center mt-4" style={{ color: 'var(--gray-300)' }}>
          <p>
            Already have an account? 
            <Link to="/login" className="ms-2" style={{ color: 'var(--primary-emerald)' }}>
              Sign In
            </Link>
          </p>
          <p>
            <Link to="/" style={{ color: 'var(--primary-emerald)' }}>
              <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;