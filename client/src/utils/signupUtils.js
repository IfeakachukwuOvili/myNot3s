import axios from 'axios';

export const passwordRequirements = [
  { regex: /.{8,}/, text: 'At least 8 characters' },
  { regex: /[A-Z]/, text: 'One uppercase letter' },
  { regex: /[a-z]/, text: 'One lowercase letter' },
  { regex: /[0-9]/, text: 'One number' },
  { regex: /[@$!%*?&]/, text: 'One special character (@$!%*?&)' }
];

export const validateInput = (formData) => {
  if (formData.name.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }

  if (!formData.email || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(formData.password)) {
    return { 
      isValid: false, 
      message: 'Password does not meet requirements' 
    };
  }

  if (formData.password !== formData.confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }

  return { isValid: true, message: '' };
};

export const handleSignup = async (formData, setIsLoading, navigate) => {
  try {
    setIsLoading(true);
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      name: formData.name,
      email: formData.email.toLowerCase(),
      password: formData.password
    });
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    navigate('/notebooks');
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Signup failed' 
    };
  } finally {
    setIsLoading(false);
  }
};