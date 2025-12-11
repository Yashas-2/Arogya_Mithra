import { useState } from 'react';

// Mock scheme data for demonstration
const useSchemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkEligibility = async (patientData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on patient data
      const mockResult = {
        scheme_name: patientData.economic_status === 'BPL' ? 'Vajpayee Arogyashree' : 'Suvarna Arogya Suraksha',
        scheme_type: 'Karnataka',
        eligibility_score: '85%',
        why_eligible: `You qualify for this scheme based on your ${patientData.economic_status} status and ${patientData.disease_type} condition.`,
        required_documents: [
          'Aadhaar Card (Mandatory)',
          'Ration Card (BPL/APL)',
          'Income Certificate from Tahsildar',
          'Medical Records / Doctor Prescription',
          'Bank Account Details'
        ],
        apply_steps: [
          'Step 1: Visit your nearest Arogya Karnataka center or government hospital',
          'Step 2: Carry all required documents (originals + photocopies)',
          'Step 3: Fill the application form with help of Arogya Mitra staff',
          'Step 4: Submit documents and get acknowledgement receipt',
          'Step 5: Verification will take 7-15 working days',
          'Step 6: You\'ll receive SMS/Email once approved'
        ]
      };
      
      // Add to schemes history
      setSchemes(prev => [mockResult, ...prev]);
      
      return mockResult;
    } catch (err) {
      setError(err.message || 'Failed to check eligibility');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    schemes,
    loading,
    error,
    checkEligibility
  };
};

export default useSchemes;