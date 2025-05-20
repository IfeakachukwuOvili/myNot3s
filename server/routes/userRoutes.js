const express = require('express');
const router = express.Router();
const { signup, login, deleteUser, updateUser, resetPassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.delete('/delete/:email', authMiddleware, deleteUser);
router.put('/update/:email', authMiddleware, updateUser);
router.post('/reset-password', resetPassword);

module.exports = router;
