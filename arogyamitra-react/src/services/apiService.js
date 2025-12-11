// Service to connect to Django REST Framework APIs

class ApiService {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    // Don't initialize token here, let it be set when needed
    this.token = null;
    this.refreshToken = null;
  }

  // Set authentication token
  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Ensure token has Bearer prefix if it exists
    let authToken = this.token;
    if (authToken && !authToken.startsWith('Bearer ')) {
      authToken = `Bearer ${authToken}`;
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': authToken }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      // Handle token expiration
      if (response.status === 401 && data.detail && data.detail.includes('token')) {
        // Try to refresh token
        try {
          const refreshResponse = await this.refreshTokenFunc();
          if (refreshResponse.token) {
            // Retry the original request with new token
            let newToken = refreshResponse.token;
            if (!newToken.startsWith('Bearer ')) {
              newToken = `Bearer ${newToken}`;
            }
            config.headers.Authorization = newToken;
            const retryResponse = await fetch(url, config);
            const retryData = await retryResponse.json();
            
            if (!retryResponse.ok) {
              throw new Error(retryData.detail || retryData.error || 'Something went wrong');
            }
            
            return retryData;
          }
        } catch (refreshError) {
          // If refresh fails, clear tokens and redirect to login
          this.setAuthToken(null);
          this.refreshToken = null;
          window.location.href = '/login';
        }
      }
      
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    // Determine if this is a patient or hospital login based on user_type
    const endpoint = credentials.user_type === 'patient' ? 
      '/api/auth/patient-login/' : 
      '/api/auth/hospital-login/';
      
    const data = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.token) {
      // Store token without Bearer prefix
      this.setAuthToken(data.token);
      if (data.refresh) {
        this.refreshToken = data.refresh;
        localStorage.setItem('refreshToken', data.refresh);
      }
    }
    
    return data;
  }

  async register(userData) {
    // Determine if this is a patient or hospital registration
    const endpoint = userData.user_type === 'patient' ? 
      '/api/auth/register-patient/' : 
      '/api/auth/register-hospital/';
      
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    try {
      await this.request('/api/auth/logout/', {
        method: 'POST',
      });
    } finally {
      this.setAuthToken(null);
      this.refreshToken = null;
    }
  }

  async refreshTokenFunc() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const data = await this.request('/api/auth/refresh-token/', {
      method: 'POST',
      body: JSON.stringify({ refresh: this.refreshToken }),
    });
    
    if (data.token) {
      // Store token without Bearer prefix
      this.setAuthToken(data.token);
    }
    
    return data;
  }

  // Scheme endpoints
  async checkSchemeEligibility(patientData) {
    return this.request('/api/check-eligibility/', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  // Report endpoints
  async uploadMedicalReport(formData) {
    // Ensure token has Bearer prefix if it exists
    let authToken = this.token;
    if (authToken && !authToken.startsWith('Bearer ')) {
      authToken = `Bearer ${authToken}`;
    }
    
    return this.request('/api/hospital/upload-report/', {
      method: 'POST',
      body: formData,
      headers: {
        ...(authToken && { 'Authorization': authToken }),
        // Remove Content-Type to let browser set it with boundary for file uploads
      },
    });
  }

  async getMedicalReports() {
    return this.request('/api/patient/reports/');
  }

  async analyzeMedicalReport(reportData) {
    return this.request('/api/analyze-report/', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  // Hospital Staff endpoints
  async getHospitalUploadHistory() {
    return this.request('/api/hospital/upload-history/');
  }

  // Patient OTP & Report Access endpoints
  async requestOtp() {
    return this.request('/api/patient/request-otp/', {
      method: 'POST',
    });
  }

  async verifyOtp(otpData) {
    return this.request('/api/patient/verify-otp/', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  }

  async viewReport(reportId) {
    // This will return the decrypted report file
    const url = `${this.baseUrl}/api/patient/report/${reportId}/`;
    
    // Ensure token has Bearer prefix if it exists
    let authToken = this.token;
    if (authToken && !authToken.startsWith('Bearer ')) {
      authToken = `Bearer ${authToken}`;
    }
    
    const config = {
      headers: {
        ...(authToken && { 'Authorization': authToken }),
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Something went wrong');
      }
      
      // Check if response is JSON or file
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Return blob for PDF file
        return await response.blob();
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getAccessLogs() {
    return this.request('/api/patient/access-logs/');
  }

  // Subscription endpoints
  async getSubscriptionStatus() {
    return this.request('/api/subscription/');
  }

  async upgradeToPremium(paymentData) {
    return this.request('/api/upgrade-premium/', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }
}

// Export singleton instance
const apiService = new ApiService();

export default apiService;