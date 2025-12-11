// Validation utilities

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone number validation regex (Indian format)
const PHONE_REGEX = /^[6-9]\d{9}$/;

// Aadhaar last 4 digits validation
const AADHAAR_LAST4_REGEX = /^\d{4}$/;

// Validation functions
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!PHONE_REGEX.test(phone)) return 'Please enter a valid Indian phone number';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters long';
  return null;
};

export const validateAge = (age) => {
  if (!age) return 'Age is required';
  if (isNaN(age) || age < 1 || age > 120) return 'Please enter a valid age between 1 and 120';
  return null;
};

export const validateAadhaarLast4 = (aadhaar) => {
  if (aadhaar && !AADHAAR_LAST4_REGEX.test(aadhaar)) return 'Please enter last 4 digits of Aadhaar';
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value) return `${fieldName} is required`;
  return null;
};

// Form validation for different forms
export const validateLoginForm = (data) => {
  const errors = {};
  
  if (!data.username) {
    errors.username = 'Username is required';
  }
  
  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }
  
  return errors;
};

export const validateRegisterForm = (data) => {
  const errors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  
  const ageError = validateAge(data.age);
  if (ageError) errors.age = ageError;
  
  if (!data.district) {
    errors.district = 'District is required';
  }
  
  if (!data.disease_type) {
    errors.disease_type = 'Disease type is required';
  }
  
  if (!data.username) {
    errors.username = 'Username is required';
  }
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(data.password, data.confirm_password);
  if (confirmPasswordError) errors.confirm_password = confirmPasswordError;
  
  return errors;
};

export const validateHospitalRegisterForm = (data) => {
  const errors = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  if (!data.hospital_name) {
    errors.hospital_name = 'Hospital name is required';
  }
  
  if (!data.license_number) {
    errors.license_number = 'License number is required';
  }
  
  if (!data.username) {
    errors.username = 'Username is required';
  }
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  const confirmPasswordError = validateConfirmPassword(data.password, data.confirm_password);
  if (confirmPasswordError) errors.confirm_password = confirmPasswordError;
  
  return errors;
};

export const validateSchemeCheckForm = (data) => {
  const errors = {};
  
  const ageError = validateAge(data.age);
  if (ageError) errors.age = ageError;
  
  if (!data.district) {
    errors.district = 'District is required';
  }
  
  if (!data.disease_type) {
    errors.disease_type = 'Disease type is required';
  }
  
  return errors;
};

export const validateReportUploadForm = (data) => {
  const errors = {};
  
  if (!data.patient_phone) {
    errors.patient_phone = 'Patient phone number is required';
  } else {
    const phoneError = validatePhone(data.patient_phone);
    if (phoneError) errors.patient_phone = phoneError;
  }
  
  if (data.patient_aadhaar_last4) {
    const aadhaarError = validateAadhaarLast4(data.patient_aadhaar_last4);
    if (aadhaarError) errors.patient_aadhaar_last4 = aadhaarError;
  }
  
  if (!data.report_title) {
    errors.report_title = 'Report title is required';
  }
  
  if (!data.scan_type) {
    errors.scan_type = 'Scan type is required';
  }
  
  if (!data.hospital_name) {
    errors.hospital_name = 'Hospital name is required';
  }
  
  if (!data.test_date) {
    errors.test_date = 'Test date is required';
  }
  
  if (!data.report_file) {
    errors.report_file = 'Report file is required';
  }
  
  return errors;
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateAge,
  validateAadhaarLast4,
  validateRequired,
  validateLoginForm,
  validateRegisterForm,
  validateHospitalRegisterForm,
  validateSchemeCheckForm,
  validateReportUploadForm
};