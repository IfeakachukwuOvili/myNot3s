// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Custom sanitization middleware (replaces mongoSanitize)
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Remove $ and . from keys and values (MongoDB injection prevention)
        const sanitizedKey = key.replace(/[\$\.]/g, '');
        const sanitizedValue = req.body[key].replace(/[\$\.]/g, '');
        req.body[sanitizedKey] = sanitizedValue;
      }
    }
  }
  next();
};

// Custom XSS prevention middleware
const preventXSS = (req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Escape HTML special characters
        req.body[key] = req.body[key]
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
    }
  }
  next();
};

// Custom security headers middleware (replaces helmet)
const securityHeaders = (req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
};

// Simple CSRF token middleware
const csrfToken = (req, res, next) => {
  if (req.method === 'GET') {
    next();
    return;
  }
  
  const token = req.headers['x-csrf-token'];
  const storedToken = req.session?.csrfToken;
  
  if (!token || token !== storedToken) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  next();
};

// Basic middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Parses JSON bodies
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(preventXSS);
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('Successfully connected to MongoDB Atlas'))
.catch(err => {
  console.error('MongoDB Atlas connection error:', err.message);
  process.exit(1); // Exit if cannot connect to database
});

// Rate limiting
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 requests per window
});

// Apply rate limiting to login route
app.use('/api/auth/login', loginLimiter);

// Debug middleware (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}

// Routes
app.use('/api/notebooks', require('./routes/notebookRoutes'));
app.use('/api/auth', require('./routes/userRoutes'));

// Generate CSRF token endpoint (simplified)
app.get('/api/csrf-token', (req, res) => {
  const token = Math.random().toString(36).substring(2);
  req.session.csrfToken = token;
  res.json({ csrfToken: token });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
