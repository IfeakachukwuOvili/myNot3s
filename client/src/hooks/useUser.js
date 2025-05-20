import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user?.email || !token) {
        throw new Error('User information not found');
      }

      const response = await axios.delete(
        `http://localhost:5000/api/auth/delete/${encodeURIComponent(user.email)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        return true;
      }
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Failed to delete account');
      setMessageType('error');
      return false;
    }
  };

  const updateProfile = async (newName, currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/auth/update/${user.email}`,
        {
          name: newName || user.name,
          currentPassword,
          newPassword: newPassword || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setStatusMessage('Profile updated successfully!');
        setMessageType('success');
        return true;
      }
    } catch (error) {
      setStatusMessage(error.response?.data?.message || 'Failed to update profile');
      setMessageType('error');
      return false;
    }
  };

  return {
    user,
    statusMessage,
    messageType,
    handleSignOut,
    handleDeleteAccount,
    updateProfile
  };
};