const crypto = require('crypto');
require('dotenv').config();

// Store these in .env file
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

module.exports = {
  ENCRYPTION_KEY,
  IV_LENGTH
};