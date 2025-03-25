const { Event, Category, sequelize } = require('../models');
const { Op } = require('sequelize');

const createEvent = async (req, res, next) => {
  try {
    const { title_key, description_key, latitude, longitude, address, 
            start_time, end_time, capacity, price, categories } = req.body;
    
    const event = await Event.create({
      title_key,
      description_key,
      latitude,
      longitude,
      address,
      start_time,
      end_time,
      capacity,
      price,
      creator_id: req.userId
    });
    
    if (categories && categories.length > 0) {
      await event.setCategories(categories);
    }
    
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

const getNearbyEvents = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000, categories } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: req.t('event.lat_lng_required') });
    }
    
    const events = await Event.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn(
              'ST_DWithin',
              sequelize.fn('ST_MakePoint', sequelize.col('Event.longitude'), 
              sequelize.col('Event.latitude')),
              sequelize.fn('ST_MakePoint', parseFloat(lng), parseFloat(lat)),
              parseInt(radius)
            ),
            true
          ),
          categories ? {
            '$Categories.id$': { 
              [Op.in]: Array.isArray(categories) ? categories : [categories]
            }
          } : {}
        ]
      },
      include: [
        { model: Category, through: { attributes: [] } },
        { 
          attributes: [
            'id', 'username',
            [sequelize.literal(`(
              SELECT ST_Distance(
                ST_MakePoint(Event.longitude, Event.latitude)::geography,
                ST_MakePoint(${lng}, ${lat})::geography
            )`), 'distance']
          ],
          model: User,
          as: 'creator',
          attributes: { exclude: ['password_hash'] }
        }
      ],
      order: [
        [sequelize.literal('distance'), 'ASC']
      ]
    });
    
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// Add other event controller methods (getEventById, updateEvent, deleteEvent, etc.)

module.exports = { createEvent, getNearbyEvents };
