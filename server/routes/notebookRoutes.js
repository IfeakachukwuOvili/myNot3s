const express = require('express');
const Notebook = require('../models/Notebook');
const router = express.Router();

// Get all notebooks for a user
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const notes = await Notebook.find({ userEmail: email }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notebooks' });
  }
});

// Get a single notebook
router.get('/one/:id', async (req, res) => {
  try {
    const note = await Notebook.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Notebook not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notebook' });
  }
});

// Create or update notebook
router.post('/', async (req, res) => {
  try {
    const { _id, title, content, images, userEmail } = req.body;
    let notebook;
    
    if (_id) {
      notebook = await Notebook.findByIdAndUpdate(_id, { title, content, images }, { new: true });
    } else {
      notebook = await Notebook.create({ title, content, images, userEmail });
    }
    
    res.status(_id ? 200 : 201).json(notebook);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving notebook' });
  }
});

// Delete notebook
router.delete('/:id', async (req, res) => {
  try {
    await Notebook.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting notebook' });
  }
});

module.exports = router;
