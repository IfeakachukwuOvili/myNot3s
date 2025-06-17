const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notebook = require('../models/Notebook'); 

const JWT_SECRET = process.env.JWT_SECRET;

// Sign Up Controller
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.json({ token, user: { name, email } });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user and normalize email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Use same message for both cases to prevent user enumeration
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token with more secure payload
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email
      }, 
      JWT_SECRET,
      { 
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );

   
    // Send response without sensitive data
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred during login' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Find and delete the user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Delete user's notebooks first
    await Notebook.deleteMany({ userEmail: email });
    
    // Delete the user
    await User.deleteOne({ email });

    return res.status(200).json({ 
      success: true, 
      message: 'Account deleted successfully' 
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error deleting account',
      error: error.message 
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update user data
    user.name = name || user.name;
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Return updated user (without password)
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  deleteUser,
  updateUser,
  resetPassword
};
