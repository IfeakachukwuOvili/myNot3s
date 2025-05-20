import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useNotebooks = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState(null);
  const navigate = useNavigate();

  // Get user email from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
      return;
    }

    fetchNotebooks();
  }, [userEmail, navigate]);

  const fetchNotebooks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notebooks/${userEmail}`);
      setNotebooks(res.data);
    } catch (error) {
      console.error('Failed to fetch notebooks:', error);
      alert('Failed to fetch notebooks');
    }
  };

  const handleDeleteClick = (id) => {
    setNotebookToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!notebookToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/notebooks/${notebookToDelete}`);
      setNotebooks((prev) => prev.filter((note) => note._id !== notebookToDelete));
      setIsModalOpen(false);
      setNotebookToDelete(null);
    } catch (error) {
      console.error('Failed to delete notebook:', error);
      alert('Failed to delete notebook');
    }
  };

  return {
    notebooks,
    isModalOpen,
    setIsModalOpen,
    handleDeleteClick,
    confirmDelete
  };
};