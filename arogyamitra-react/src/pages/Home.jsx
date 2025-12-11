import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import useTranslation from '../hooks/useTranslation';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on user role
      const userRole = user.hospital_name ? 'HOSPITAL_STAFF' : 'PATIENT';
      if (userRole === 'HOSPITAL_STAFF') {
        navigate('/hospital-dashboard');
      } else {
        navigate('/report-vault');
      }
    }
    
    // Simple particles animation
    function createParticles() {
      const container = document.getElementById('particles');
      if (!container) return;
      
      // Clear existing particles
      container.innerHTML = '';
      
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(16, 185, 129, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
      }
    }

    createParticles();
  }, [navigate, isAuthenticated, user]);

  // Navigation handlers
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleTryWithoutLoginClick = () => {
    navigate('/scheme-checker');
  };

  const handleCheckNowClick = () => {
    navigate('/scheme-checker');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <i className="fas fa-star"></i> {t('karnatakaPlatform')}
          </div>
          
          <h1 className="hero-title">
            {t('yourHealth')}
          </h1>
          
          <p className="hero-subtitle">
            {t('heroSubtitle')}
          </p>
          
          <div className="hero-buttons">
            <button onClick={handleLoginClick} className="btn btn-glow">
              <i className="fas fa-sign-in-alt"></i> {t('loginSignup')}
            </button>
            <button onClick={handleTryWithoutLoginClick} className="btn btn-outline">
              <i className="fas fa-check-circle"></i> {t('tryWithoutLogin')}
            </button>
          </div>
        </div>
        
        {/* Animated Background Particles */}
        <div className="particles-bg" id="particles"></div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-title">
          <h2>{t('threeFeaturesTitle')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>{t('threeFeaturesDesc')}</p>
        </div>
        
        <div className="features-grid">
          {/* Feature 1: Scheme Checker */}
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3 className="feature-title">{t('schemeCheckerTitle')}</h3>
            <p className="feature-description">
              {t('schemeCheckerDesc')}
            </p>
            <button onClick={handleCheckNowClick} className="btn btn-primary mt-3" style={{ width: '100%' }}>
              <span>{t('checkNow')}</span>
            </button>
          </div>
          
          {/* Feature 2: Medical Vault */}
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--gradient-teal)' }}>
              <i className="fas fa-folder-open"></i>
            </div>
            <h3 className="feature-title">{t('medicalVaultTitle')}</h3>
            <p className="feature-description">
              {t('medicalVaultDesc')}
            </p>
            <button onClick={() => navigate('/report-vault')} className="btn btn-primary mt-3" style={{ width: '100%', background: 'var(--gradient-teal)' }}>
              <span>{t('uploadReports')}</span>
            </button>
          </div>
          
          {/* Feature 3: AI Analysis */}
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--gradient-purple)' }}>
              <i className="fas fa-brain"></i>
            </div>
            <h3 className="feature-title">{t('aiInterpreterTitle')}</h3>
            <p className="feature-description">
              {t('aiInterpreterDesc')}
            </p>
            <button onClick={() => navigate('/report-analysis')} className="btn btn-primary mt-3" style={{ width: '100%', background: 'var(--gradient-purple)' }}>
              <span>{t('analyzeReport')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="features-section" style={{ background: 'rgba(255,255,255,0.02)', padding: '6rem 2rem' }}>
        <div className="section-title">
          <h2>{t('howItWorksTitle')}</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'var(--gradient-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900' }}>1</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{t('enterDetails')}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{t('enterDetailsDesc')}</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'var(--gradient-teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900' }}>2</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{t('aiAnalysisStep')}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{t('aiAnalysisDesc')}</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'var(--gradient-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900' }}>3</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{t('getResults')}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{t('getResultsDesc')}</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: 'var(--gradient-neon)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900' }}>4</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{t('applyBenefit')}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{t('applyBenefitDesc')}</p>
          </div>
        </div>
      </section>

      {/* CTA Section for Premium */}
      <section className="features-section">
        <div className="glass-card-premium" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1rem' }}>
            {t('unlockPower')}
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {t('premiumFeatures')}
          </p>
          <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ₹49<span style={{ fontSize: '1.5rem' }}>/month</span>
          </div>
          <p style={{ color: 'var(--success-green)', marginBottom: '2rem' }}>
            <i className="fas fa-fire"></i> {t('revenueText')}
          </p>
          <button onClick={() => navigate('/premium')} className="btn btn-glow" style={{ padding: '1.25rem 3rem', fontSize: '1.125rem' }}>
            <i className="fas fa-crown"></i> <span>{t('upgradeToPremium')}</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'rgba(0,0,0,0.3)', padding: '3rem 2rem', textAlign: 'center', marginTop: '4rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem', background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t('footerTitle')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {t('footerText')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <a href="#" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-base)' }}><i className="fab fa-twitter fa-lg"></i></a>
            <a href="#" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-base)' }}><i className="fab fa-facebook fa-lg"></i></a>
            <a href="#" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-base)' }}><i className="fab fa-instagram fa-lg"></i></a>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '2rem', fontSize: '0.875rem' }}>
            {t('copyright')}
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;