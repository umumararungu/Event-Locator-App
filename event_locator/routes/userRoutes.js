const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

router.put('/preferences', authMiddleware, userController.updatePreferences);
router.put('/location', authMiddleware, userController.updateLocation);
router.get('/favorites', authMiddleware, userController.getFavorites);

module.exports = router;