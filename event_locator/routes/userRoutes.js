const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
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
 *           enum: [en, es, fr, de]
 *           example: "en"
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
 *     FavoriteEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title_key:
 *           type: string
 *         start_time:
 *           type: string
 *           format: date-time
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /users/preferences:
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
 *         description: User preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/preferences', authMiddleware, userController.updatePreferences);

/**
 * @swagger
 * /users/location:
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
 *         description: User location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLocation'
 *       400:
 *         description: Invalid coordinates or missing data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/location', authMiddleware, userController.updateLocation);

/**
 * @swagger
 * /users/favorites:
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
 *                 $ref: '#/components/schemas/FavoriteEvent'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/favorites', authMiddleware, userController.getFavorites);

module.exports = router;