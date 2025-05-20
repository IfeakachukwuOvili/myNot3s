const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header: "Bearer <token>"
  const token = req.headers.authorization?.split(' ')[1];

  // Check if token exists
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    // Verify token signature using JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET);
    // Add user email to request object for downstream use
    req.user = decoded.email;
    // Continue to next middleware/route handler
    next();
  } catch (err) {
    // Return error if token is invalid or expired
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
