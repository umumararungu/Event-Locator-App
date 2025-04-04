const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  // Skip auth for these paths
  const publicPaths = [
    '/api/auth/register',
    '/api/auth/login',
    '/api-docs'
  ];

  if (publicPaths.includes(req.path)) {
    return next(); 
  }
  
  try {
    // 1. Get token from header 
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authorization token required' 
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    // 3. Find user 
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password_hash', 'resetToken'] }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found for this token' 
      });
    }

    // 4. Attach user to request
    req.user = user; 
    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error);

    // Handle specific JWT errors
    let message = 'Invalid token';
    if (error instanceof jwt.TokenExpiredError) {
      message = 'Token expired';
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = 'Malformed token';
    }

    res.status(401).json({ 
      success: false,
      message 
    });
  }
};