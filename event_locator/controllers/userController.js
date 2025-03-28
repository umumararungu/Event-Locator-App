const { User, UserLocation, Category, Event } = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserPreferences:
 *       type: object
 *       properties:
 *         preferred_language:
 *           type: string
 *           example: en
 *         categories:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 3, 5]
 *     UserLocation:
 *       type: object
 *       required:
 *         - latitude
 *         - longitude
 *         - address
 *       properties:
 *         latitude:
 *           type: number
 *           format: float
 *           example: 40.7128
 *         longitude:
 *           type: number
 *           format: float
 *           example: -74.0060
 *         address:
 *           type: string
 *           example: "123 Main St, New York, NY"
 *         is_primary:
 *           type: boolean
 *           default: true
 */

/**
 * @swagger
 * /api/users/preferences:
 *   put:
 *     summary: Update user preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPreferences'
 *     responses:
 *       200:
 *         description: Updated user preferences
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const updatePreferences = async (req, res) => {
  try {
    const { categories, preferred_language } = req.body;
    const user = await User.findByPk(req.userId, {
      include: ['preferredCategories']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update preferred categories if provided
    if (categories) {
      // Validate categories exist
      const existingCategories = await Category.findAll({
        where: { id: { [Op.in]: categories } }
      });
      
      if (existingCategories.length !== categories.length) {
        return res.status(400).json({ message: 'One or more categories not found' });
      }

      await user.setPreferredCategories(categories);
    }

    // Update language preference if provided
    if (preferred_language) {
      const validLanguages = ['en', 'kin', 'fr']; // Add your supported languages
      if (!validLanguages.includes(preferred_language)) {
        return res.status(400).json({ message: 'Invalid language preference' });
      }
      await user.update({ preferred_language });
    }

    // Return updated user with preferences
    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Category,
        as: 'preferredCategories',
        through: { attributes: [] }
      }]
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ message: 'Server error while updating preferences' });
  }
};

/**
 * @swagger
 * /api/users/location:
 *   put:
 *     summary: Update user location
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLocation'
 *     responses:
 *       200:
 *         description: Updated user location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLocation'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, address, is_primary = true } = req.body;
    
    // Validate required fields
    if (!latitude || !longitude || !address) {
      return res.status(400).json({ message: 'Latitude, longitude, and address are required' });
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    // Set all other locations as non-primary if this is primary
    if (is_primary) {
      await UserLocation.update(
        { is_primary: false },
        { where: { user_id: req.userId } }
      );
    }

    // Create new location
    const location = await UserLocation.create({
      user_id: req.userId,
      latitude,
      longitude,
      address,
      is_primary
    });

    res.json(location);
  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({ message: 'Server error while updating location' });
  }
};

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Get user's favorite events
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const getFavorites = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: [],
      include: [{
        association: 'favoriteEvents',
        include: [
          {
            model: Category,
            as: 'categories',
            through: { attributes: [] }
          },
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'username']
          }
        ]
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favoriteEvents || []);
  } catch (error) {
    console.error('Error getting user favorites:', error);
    res.status(500).json({ message: 'Server error while getting favorites' });
  }
};

module.exports = { 
  updatePreferences, 
  updateLocation, 
  getFavorites 
};