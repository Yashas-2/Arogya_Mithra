import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import useTranslation from '../hooks/useTranslation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { language, changeLanguage } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add scrolled class when scrolled down
      if (currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsHidden(true);
      } else if (lastScrollY - currentScrollY > 50) {
        // Scrolling up significantly
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Determine user role
  const userRole = user ? (user.hospital_name ? 'HOSPITAL_STAFF' : 'PATIENT') : null;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isHidden ? 'hidden' : ''}`} id="mainNavbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <i className="fas fa-heartbeat"></i> ArogyaMitra AI
        </Link>
        
        <ul className="nav-menu">
          <li><Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link></li>
          <li><Link to="/scheme-checker" className={`nav-link ${location.pathname === '/scheme-checker' ? 'active' : ''}`}>Check Eligibility</Link></li>
          
          {isAuthenticated ? (
            <>
              {userRole === 'HOSPITAL_STAFF' ? (
                <li><Link to="/hospital-dashboard" className={`nav-link ${location.pathname === '/hospital-dashboard' ? 'active' : ''}`}>Dashboard</Link></li>
              ) : (
                <>
                  <li><Link to="/report-vault" className={`nav-link ${location.pathname === '/report-vault' ? 'active' : ''}`}>My Reports</Link></li>
                  <li><Link to="/report-analysis" className={`nav-link ${location.pathname === '/report-analysis' ? 'active' : ''}`}>AI Analysis</Link></li>
                </>
              )}
              <li><Link to="/premium" className="btn btn-glow">Upgrade ₹49</Link></li>
              <li>
                <button onClick={handleLogout} className="btn btn-outline" style={{ marginLeft: '1rem' }}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login" className="btn btn-glow">Login</Link></li>
          )}
        </ul>
        
        {/* Language Toggle in Navbar */}
        <div className="nav-language-toggle">
          <button 
            className={`lang-btn-nav ${language === 'en' ? 'active' : ''}`} 
            data-lang="en" 
            onClick={() => handleLanguageChange('en')}
          >
            English
          </button>
          <button 
            className={`lang-btn-nav ${language === 'kn' ? 'active' : ''}`} 
            data-lang="kn" 
            onClick={() => handleLanguageChange('kn')}
          >
            ಕನ್ನಡ
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;