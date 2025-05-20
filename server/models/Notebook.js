// I have included comments because this is my first time dealing with security applications.
const mongoose = require('mongoose');
const crypto = require('crypto'); // Node's built-in encryption library
require('dotenv').config(); // Load environment variables

// Encryption setup
// Convert hex string from .env to Buffer for AES encryption
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
// Initialization Vector length - standard is 16 bytes for AES
const IV_LENGTH = parseInt(process.env.ENCRYPTION_IV_LENGTH || '16');

const NotebookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { 
      type: String,
      default: '',
      // Custom setter - runs when content is being saved
      set: function(content) {
        if (!content) return '';
        // Create random IV for each encryption (increases security)
        const iv = crypto.randomBytes(IV_LENGTH);
        // Create cipher using AES-256-CBC algorithm
        const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        // Encrypt content and convert to hex
        const encrypted = cipher.update(content, 'utf8', 'hex') + cipher.final('hex');
        // Store IV with encrypted content (needed for decryption)
        return iv.toString('hex') + ':' + encrypted;
      },
      // Custom getter - runs when content is being retrieved
      get: function(hashedContent) {
        if (!hashedContent) return '';
        // Split stored string into IV and encrypted content
        const [ivHex, encryptedContent] = hashedContent.split(':');
        if (!ivHex || !encryptedContent) return '';
        try {
          // Convert stored IV back to Buffer
          const iv = Buffer.from(ivHex, 'hex');
          // Create decipher with same key and IV
          const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
          // Decrypt content back to utf8 text
          return decipher.update(encryptedContent, 'hex', 'utf8') + decipher.final('utf8');
        } catch (error) {
          console.error('Decryption error:', error);
          // Return encrypted content if decryption fails
          return hashedContent;
        }
      }
    },
    userEmail: { type: String, required: true }
  },
  { 
    timestamps: true, // Automatically manage createdAt and updatedAt
    toJSON: { getters: true }, // Ensure decryption runs when converting to JSON
    toObject: { getters: true } // Ensure decryption runs when converting to object
  }
);

module.exports = mongoose.model('Notebook', NotebookSchema);