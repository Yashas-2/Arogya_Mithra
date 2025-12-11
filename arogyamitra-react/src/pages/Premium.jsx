import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Premium = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Django premium page
    window.location.href = 'http://127.0.0.1:8000/premium/';
  }, [navigate]);

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div className="text-center">
        <h1>Redirecting to Premium Page...</h1>
        <p>If you are not redirected automatically, <a href="http://127.0.0.1:8000/premium/">click here</a>.</p>
      </div>
    </div>
  );
};

export default Premium;