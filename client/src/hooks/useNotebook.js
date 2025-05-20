import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useNotebook = (id) => {
  const [title, setTitle] = useState('Untitled Notebook');
  const [notebookId, setNotebookId] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userEmail = user?.email;

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
      return;
    }

    if (id && id !== 'new') {
      fetchNotebook(id);
    }
  }, [id, userEmail, navigate]);

  const fetchNotebook = async (notebookId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notebooks/one/${notebookId}`);
      setNotebookId(res.data._id);
      setTitle(res.data.title);
      setContent(res.data.content);
    } catch (error) {
      setSaveMsg('Error loading notebook!');
      setTimeout(() => setSaveMsg(''), 2000);
    }
  };

  const saveNotebook = async () => {
    try {
      setIsSaving(true);
      const res = await axios.post('http://localhost:5000/api/notebooks', {
        _id: notebookId,
        title,
        content,
        userEmail,
        images: [],
      });

      setNotebookId(res.data._id);
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (err) {
      setSaveMsg('Error saving!');
      setTimeout(() => setSaveMsg(''), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    isSaving,
    saveMsg,
    saveNotebook
  };
};