const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title_key
 *         - latitude
 *         - longitude
 *         - address
 *         - start_time
 *       properties:
 *         id:
 *           type: integer
 *         title_key:
 *           type: string
 *           example: "event.beach_party.title"
 *         description_key:
 *           type: string
 *           example: "event.beach_party.description"
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
 *           example: "123 Beach Ave, Miami, FL"
 *         start_time:
 *           type: string
 *           format: date-time
 *           example: "2023-07-15T20:00:00Z"
 *         end_time:
 *           type: string
 *           format: date-time
 *           example: "2023-07-16T02:00:00Z"
 *         capacity:
 *           type: integer
 *           example: 100
 *         price:
 *           type: number
 *           format: float
 *           example: 25.99
 *         creator_id:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     EventRating:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         id:
 *           type: integer
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         review:
 *           type: string
 *         user_id:
 *           type: integer
 *         event_id:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, eventController.createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Comma-separated category IDs to filter by
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events starting after this date
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events ending before this date
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Server error
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /events/nearby:
 *   get:
 *     summary: Find events near a location
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Latitude of the center point
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *           format: float
 *         required: true
 *         description: Longitude of the center point
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 5000
 *         description: Search radius in meters
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Comma-separated category IDs to filter by
 *     responses:
 *       200:
 *         description: List of nearby events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Missing or invalid coordinates
 *       500:
 *         description: Server error
 */
router.get('/nearby', eventController.getNearbyEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.get('/:id', eventController.getEventById);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Updated event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the event creator)
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, eventController.updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the event creator)
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, eventController.deleteEvent);

/**
 * @swagger
 * /events/{id}/ratings:
 *   post:
 *     summary: Add a rating to an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventRating'
 *       400:
 *         description: Invalid rating value
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.post('/:id/ratings', authMiddleware, eventController.addRating);

/**
 * @swagger
 * /events/{id}/ratings:
 *   get:
 *     summary: Get ratings for an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: List of ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventRating'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.get('/:id/ratings', eventController.getEventRatings);

/**
 * @swagger
 * /events/{id}/favorite:
 *   post:
 *     summary: Add event to favorites
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event added to favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.post('/:id/favorite', authMiddleware, eventController.addFavorite);

/**
 * @swagger
 * /events/{id}/favorite:
 *   delete:
 *     summary: Remove event from favorites
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event removed from favorites
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
router.delete('/:id/favorite', authMiddleware, eventController.removeFavorite);

module.exports = router;