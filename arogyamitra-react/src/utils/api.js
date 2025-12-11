// API utility functions

const API_BASE_URL = 'http://localhost:8000/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  login: (credentials) => apiCall('/login/', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => apiCall('/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  logout: () => apiCall('/logout/', {
    method: 'POST',
  }),
};

// Scheme APIs
export const schemeAPI = {
  checkEligibility: (patientData) => apiCall('/check-scheme-eligibility/', {
    method: 'POST',
    body: JSON.stringify(patientData),
  }),
};

// Report APIs
export const reportAPI = {
  upload: (formData) => {
    return apiCall('/upload-medical-report/', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it with boundary
    });
  },
  
  getAll: () => apiCall('/get-medical-reports/'),
  
  analyze: (reportData) => apiCall('/analyze-medical-report/', {
    method: 'POST',
    body: JSON.stringify(reportData),
  }),
};

// Subscription APIs
export const subscriptionAPI = {
  getStatus: () => apiCall('/get-subscription-status/'),
  
  upgrade: (paymentData) => apiCall('/upgrade-to-premium/', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
};

export default {
  authAPI,
  schemeAPI,
  reportAPI,
  subscriptionAPI,
};