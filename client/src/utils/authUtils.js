import axios from 'axios';

export const validateLoginInput = (email, password) => {
  const errors = { email: '', password: '' };
  let isValid = true;

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
    isValid = false;
  }

  return { errors, isValid };
};

export const handleLogin = async ({ 
  email, 
  password, 
  setIsLoading, 
  setError, 
  setFieldErrors, 
  navigate 
}) => {
  const { errors, isValid } = validateLoginInput(email, password);
  
  if (!isValid) {
    setFieldErrors(errors);
    return;
  }

  try {
    setIsLoading(true);
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    navigate('/notebooks');
  } catch (error) {
    setError(error.response?.data?.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};