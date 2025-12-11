import { useState, useEffect } from 'react';

// Mock auth state for demonstration
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (in a real app, this would check tokens/localStorage)
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    // In a real app, this would call the API
    const userData = {
      id: 1,
      username: credentials.username,
      name: 'Demo User',
      email: 'demo@example.com',
      role: credentials.userType
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    // In a real app, this would call the API
    const newUser = {
      id: Date.now(),
      username: userData.username,
      name: userData.name,
      email: userData.email,
      role: userData.userType
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout
  };
};

export default useAuth;