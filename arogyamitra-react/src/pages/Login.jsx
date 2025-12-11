import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const Login = () => {
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const credentials = {
        username: formData.username,
        password: formData.password,
        user_type: userType
      };
      
      const response = await login(credentials);
      
      if (response.success) {
        // Redirect based on user role
        if (response.role === 'PATIENT') {
          navigate('/report-vault'); // Redirect to report vault for patients
        } else if (response.role === 'HOSPITAL_STAFF') {
          navigate('/hospital-dashboard'); // Redirect to hospital dashboard
        }
      } else {
        alert('Login failed: ' + (response.message || 'Invalid credentials'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative corner elements */}
        <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent)', top: '-50px', right: '-50px', zIndex: '-1' }}></div>
        <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent)', bottom: '-50px', left: '-50px', zIndex: '-1' }}></div>
        
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 1.5rem' }}>
            <div style={{ width: '100%', height: '100%', background: 'var(--gradient-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)', position: 'relative', zIndex: '2' }}>
              <i className="fas fa-heartbeat" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>
            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', borderRadius: '50%', background: 'var(--gradient-emerald)', opacity: '0.4', animation: 'pulse 2s infinite', zIndex: '1' }}></div>
          </div>
          <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '2.2rem', fontWeight: '800', background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
            ArogyaMitra <span className="gradient-text">AI</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>
            {userType === 'patient' ? 'Access your health reports and AI analysis' : 'Upload and manage patient reports'}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '16px', boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <button
            type="button"
            style={{ flex: '1', padding: '1.1rem', border: `2px solid ${userType === 'patient' ? 'var(--accent-emerald)' : 'transparent'}`, background: userType === 'patient' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))' : 'transparent', color: userType === 'patient' ? 'var(--text-primary)' : 'var(--text-secondary)', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', position: 'relative', overflow: 'hidden', fontSize: '0.95rem', outline: 'none' }}
            onClick={() => setUserType('patient')}
          >
            <i className="fas fa-user"></i> Patient
          </button>
          <button
            type="button"
            style={{ flex: '1', padding: '1.1rem', border: `2px solid ${userType === 'hospital' ? 'var(--accent-emerald)' : 'transparent'}`, background: userType === 'hospital' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))' : 'transparent', color: userType === 'hospital' ? 'var(--text-primary)' : 'var(--text-secondary)', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', position: 'relative', overflow: 'hidden', fontSize: '0.95rem', outline: 'none' }}
            onClick={() => setUserType('hospital')}
          >
            <i className="fas fa-hospital"></i> Hospital Staff
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: '500', fontSize: '0.95rem' }}>Username</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <i className="fas fa-user-circle" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1.1rem', transition: 'color 0.3s ease' }}></i>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your username"
                required
                style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '2px solid var(--card-border)', borderRadius: '14px', color: 'var(--text-primary)', fontSize: '1.05rem', transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)', backdropFilter: 'blur(10px)' }}
              />
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: '500', fontSize: '0.95rem' }}>Password</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <i className="fas fa-lock" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1.1rem', transition: 'color 0.3s ease' }}></i>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
                style={{ width: '100%', padding: '1.25rem 3.5rem 1.25rem 3.5rem', background: 'rgba(255, 255, 255, 0.03)', border: '2px solid var(--card-border)', borderRadius: '14px', color: 'var(--text-primary)', fontSize: '1.05rem', transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)', backdropFilter: 'blur(10px)' }}
              />
              <button type="button" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', transition: 'all 0.2s ease', outline: 'none' }}>
                <i className="fas fa-eye"></i>
              </button>
            </div>
          </div>
          
          <button type="submit" className="btn btn-glow" style={{ width: '100%', padding: '1.3rem', background: 'var(--gradient-emerald)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: '600', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)', marginTop: '1rem', position: 'relative', overflow: 'hidden', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3), 0 0 0 1px rgba(16, 185, 129, 0.2)', outline: 'none' }}>
            <i className="fas fa-sign-in-alt"></i> Secure Login
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
          <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
            {userType === 'patient' ? "Don't have an account?" : "Don't have an account?"} 
            <Link to="/register" style={{ display: 'inline-block', color: 'var(--accent-emerald)', fontWeight: '600', textDecoration: 'none', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))', borderRadius: '50px', border: '1px solid var(--accent-emerald)', transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)', marginLeft: '0.5rem' }}>
              Register Now
            </Link>
          </p>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', color: 'var(--text-secondary)', textDecoration: 'none', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50px', transition: 'all 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)', fontWeight: '500' }}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;