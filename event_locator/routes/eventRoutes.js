const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/nearby', eventController.getNearbyEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id', authMiddleware, eventController.updateEvent);
router.delete('/:id', authMiddleware, eventController.deleteEvent);

// Ratings
router.post('/:id/ratings', authMiddleware, eventController.addRating);
router.get('/:id/ratings', eventController.getEventRatings);

// Favorites
router.post('/:id/favorite', authMiddleware, eventController.addFavorite);
router.delete('/:id/favorite', authMiddleware, eventController.removeFavorite);

module.exports = router;