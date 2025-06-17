import { useState } from 'react';
import axios from 'axios';
import { validateInput } from '../utils/signupUtils';
import { rateLimit } from '../utils/rateLimit';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;
export const useSignupForm = (navigate) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors
    
    // Rate limit check
    if (!rateLimit('signup')) {
      setError('Too many attempts. Please wait a minute before trying again.');
      return;
    }

    // Validation check
    const validation = validateInput(formData);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/notebooks');
    } catch (error) {
      let errorMessage = 'Failed to create account';

      if (error.response) {
        switch (error.response.status) {
          case 409:
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
            break;
          case 400:
            errorMessage = 'Please check your information and try again.';
            break;
          case 422:
            errorMessage = 'Invalid email or password format.';
            break;
          case 429:
            errorMessage = 'Too many attempts. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.response.data?.message || 'Something went wrong. Please try again.';
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    error,
    isLoading,
    validationErrors,
    handleChange,
    handleSubmit
  };
};