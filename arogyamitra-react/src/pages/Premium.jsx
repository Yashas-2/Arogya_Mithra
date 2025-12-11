import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import apiService from '../services/apiService';

const Premium = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const features = [
    {
      icon: 'fas fa-infinity',
      title: 'Unlimited Uploads',
      description: 'Upload as many medical reports as you want, forever'
    },
    {
      icon: 'fas fa-brain',
      title: 'Unlimited AI Analysis',
      description: 'Get AI explanations for all your reports without limits'
    },
    {
      icon: 'fas fa-ad',
      title: 'No Ads',
      description: 'Enjoy an uninterrupted, clean experience'
    },
    {
      icon: 'fas fa-headset',
      title: 'Priority Support',
      description: 'Get faster responses from our healthcare experts'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Faster Processing',
      description: 'AI analysis completes 3x faster with Premium'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile App Access',
      description: 'Access your reports on our premium mobile app'
    }
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Load subscription status
    loadSubscriptionStatus();
  }, [navigate, isAuthenticated]);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSubscriptionStatus();
      if (response.success) {
        setSubscription(response.data);
      } else {
        setError(response.error || 'Failed to load subscription status');
      }
    } catch (err) {
      setError('Failed to load subscription status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      // In a real app, this would integrate with a payment gateway
      // For demo purposes, we'll simulate a successful payment
      const paymentId = 'demo_payment_' + Date.now();
      
      const response = await apiService.upgradeToPremium({ payment_id: paymentId });
      
      if (response.success) {
        alert('Subscription upgraded successfully!');
        // Reload subscription status
        loadSubscriptionStatus();
      } else {
        alert('Failed to upgrade subscription: ' + response.error);
      }
    } catch (err) {
      alert('Failed to upgrade subscription: ' + err.message);
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
          Unlock <span className="gradient-text">Premium</span> Power
        </h1>
        <button className="btn btn-outline" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
      <p className="mt-3 text-center" style={{ color: 'var(--gray-300)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
        Get unlimited access to all ArogyaMitra AI features and empower your healthcare journey
      </p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status"></div>
          <p>Loading subscription status...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      ) : subscription ? (
        <div className="glass-card-premium" style={{ maxWidth: '900px', margin: '0 auto 3rem', padding: '3rem', textAlign: 'center' }}>
          <h2 className="mb-3">ArogyaMitra <span className="gradient-text">Premium</span></h2>
          
          {subscription.is_premium ? (
            <>
              <div className="alert alert-success">
                <h4><i className="fas fa-crown"></i> You're a Premium Member!</h4>
                <p>Your subscription is active until {new Date(subscription.end_date).toLocaleDateString()}</p>
              </div>
              
              <div className="row mt-4">
                <div className="col-md-6 mb-3">
                  <div className="glass-card">
                    <h5>AI Analysis Used</h5>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-emerald)' }}>
                      {subscription.ai_analysis_count} <span style={{ fontSize: '1rem' }}>/ ∞</span>
                    </p>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="glass-card">
                    <h5>Subscription Status</h5>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-green)' }}>
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '4rem', fontWeight: '900', margin: '1.5rem 0', background: 'var(--gradient-neon)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ₹49<span style={{ fontSize: '1.5rem' }}>/month</span>
              </div>
              <p style={{ color: 'var(--gray-300)', fontSize: '1.25rem', marginBottom: '2rem' }}>
                Billed monthly. Cancel anytime.
              </p>
              <button className="btn btn-glow" style={{ padding: '1.25rem 3rem', fontSize: '1.25rem' }} onClick={handleUpgrade}>
                <i className="fas fa-crown"></i> Get Premium Now
              </button>
              <p className="mt-3" style={{ color: 'var(--success-green)' }}>
                <i className="fas fa-fire"></i> Join 2,000+ satisfied users
              </p>
            </>
          )}
        </div>
      ) : null}

      <div className="text-center mb-5">
        <h2 className="mb-4">Premium <span className="gradient-text">Features</span></h2>
        <div className="row">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="glass-card text-center" style={{ height: '100%' }}>
                <div style={{ width: '70px', height: '70px', margin: '0 auto 1.5rem', background: 'var(--gradient-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>
                  <i className={feature.icon}></i>
                </div>
                <h4 className="mb-3">{feature.title}</h4>
                <p style={{ color: 'var(--gray-300)' }}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h3 className="mb-4">Frequently Asked Questions</h3>
        <div className="text-start">
          <div className="mb-4">
            <h5><i className="fas fa-question-circle text-primary me-2"></i> Is there a free trial?</h5>
            <p className="mt-2" style={{ color: 'var(--gray-300)' }}>Yes! All new users get 7 days free to experience all Premium features.</p>
          </div>
          <div className="mb-4">
            <h5><i className="fas fa-question-circle text-primary me-2"></i> How do I cancel my subscription?</h5>
            <p className="mt-2" style={{ color: 'var(--gray-300)' }}>You can cancel anytime from your account settings. No questions asked!</p>
          </div>
          <div className="mb-4">
            <h5><i className="fas fa-question-circle text-primary me-2"></i> What payment methods do you accept?</h5>
            <p className="mt-2" style={{ color: 'var(--gray-300)' }}>We accept all major credit/debit cards, UPI, and net banking.</p>
          </div>
          <div>
            <h5><i className="fas fa-question-circle text-primary me-2"></i> Is my health data secure?</h5>
            <p className="mt-2" style={{ color: 'var(--gray-300)' }}>Absolutely. We use bank-grade encryption to protect all your health information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;