import { useState, useEffect } from 'react';
import translations from '../utils/translations';

// Custom hook for handling translations
const useTranslation = () => {
  const [language, setLanguage] = useState('kn'); // Default to Kannada for rural users

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'kn'; // Default to Kannada
    setLanguage(savedLanguage);
  }, []);

  // Function to change language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Dispatch custom event for components to listen to language changes
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLanguage }));
  };

  // Function to get translated text
  const t = (key) => {
    // Ensure we have a valid language
    const currentLang = language || 'kn';
    
    if (translations[currentLang] && translations[currentLang][key]) {
      return translations[currentLang][key];
    }
    // Fallback to English if translation not found
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    // Fallback to key itself if not found in any language
    return key;
  };

  return {
    language,
    changeLanguage,
    t
  };
};

export default useTranslation;