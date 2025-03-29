const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { generateToken } = require('../utils/jwt');
const { User,Category } = require('../models');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      preferred_language: req.body.preferred_language || 'en'
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // 1. Verify the user ID exists and is valid
    if (!req.userId || isNaN(req.userId)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or missing User ID in request',
      });
    }

    // 2. Find user with associations
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password_hash', 'resetToken'] },
      include: [
        {
          model: Category,
          as: 'preferredCategories',
          through: { attributes: [] },
          attributes: ['id', 'name_key'],
        },
      ],
    });

    // 3. Handle user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with the provided ID',
      });
    }

    // 4. Return successful response
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching current user:', { userId: req.userId, error });

    // Specific error handling
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while fetching user data',
      });
    }

    // Generic fallback
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user dataaaaa',
    });
  }
};

module.exports = { register, login, getCurrentUser };