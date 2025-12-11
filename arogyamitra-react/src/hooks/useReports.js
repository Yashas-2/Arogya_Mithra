import { useState, useEffect } from 'react';

// Mock reports data for demonstration
const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load reports from localStorage or initialize with mock data
  useEffect(() => {
    const savedReports = localStorage.getItem('medicalReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      // Initialize with mock data
      const mockReports = [
        {
          id: 1,
          title: 'Complete Blood Count',
          scan_type: 'Blood Test',
          hospital_name: 'Manipal Hospital',
          test_date: '2023-10-15',
          file_size: '2.4 MB',
          is_analyzed: true
        },
        {
          id: 2,
          title: 'MRI Brain Scan',
          scan_type: 'MRI',
          hospital_name: 'Narayana Health',
          test_date: '2023-09-22',
          file_size: '15.7 MB',
          is_analyzed: false
        },
        {
          id: 3,
          title: 'X-Ray Chest',
          scan_type: 'X-Ray',
          hospital_name: 'Apollo Hospitals',
          test_date: '2023-08-30',
          file_size: '1.2 MB',
          is_analyzed: true
        }
      ];
      setReports(mockReports);
      localStorage.setItem('medicalReports', JSON.stringify(mockReports));
    }
  }, []);

  const addReport = (report) => {
    const newReport = {
      ...report,
      id: Date.now(),
      file_size: report.file_size || '2.5 MB',
      is_analyzed: false
    };
    
    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem('medicalReports', JSON.stringify(updatedReports));
    return newReport;
  };

  const analyzeReport = (reportId) => {
    const updatedReports = reports.map(report => 
      report.id === reportId ? {...report, is_analyzed: true} : report
    );
    setReports(updatedReports);
    localStorage.setItem('medicalReports', JSON.stringify(updatedReports));
  };

  const deleteReport = (reportId) => {
    const updatedReports = reports.filter(report => report.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('medicalReports', JSON.stringify(updatedReports));
  };

  return {
    reports,
    loading,
    error,
    addReport,
    analyzeReport,
    deleteReport
  };
};

export default useReports;