const { Event, User, Category, EventRating, sequelize } = require('../models');
const { Op } = require('sequelize');

const createEvent = async (req, res) => {
  try {
    const { title_key, description_key, latitude, longitude, address, 
            start_time, end_time, capacity, price, categories } = req.body;

    // Validate required fields
    if (!title_key || !latitude || !longitude || !address || !start_time) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

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

    const createdEvent = await Event.findByPk(event.id, {
      include: ['categories', 'creator']
    });

    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        ...(include || []), // Safely spreads include if it exists
        { 
          model: Category,
          as: 'categories',
          through: { attributes: [] } 
        },
        { 
          model: User, 
          as: 'creator', 
          attributes: ['username'] 
        }
      ],
      order: [['start_time', 'ASC']]
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNearbyEvents = async (req, res) => {
  try {
    const { lat, lng, radius = 5000, categories } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
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
              [Op.in]: categories.split(',')
            }
          } : {}
        ]
      },
      include: [
        { model: Category, through: { attributes: [] } },
        { 
          model: User,
          as: 'creator',
          attributes: ['id', 'username']
        }
      ],
      order: [
        [sequelize.literal(`(
          SELECT ST_Distance(
            ST_MakePoint(Event.longitude, Event.latitude)::geography,
            ST_MakePoint(${lng}, ${lat})::geography
          )
        )`), 'ASC']
      ]
    });
    
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const event = await Event.findByPk(id, {
      include: [
        { 
          model: Category, 
          as: 'categories', // Match the alias from your association
          through: { 
            attributes: [] // Hide join table attributes
          } 
        },
        { 
          model: User, 
          as: 'creator', 
          attributes: ['id', 'username'] 
        },
        { 
          model: EventRating,
          as: 'ratings', // Match the alias from your association
          include: [
            { 
              model: User, 
              attributes: ['id', 'username'] 
            }
          ]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the creator
    if (event.creator_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const { categories, ...updateData } = req.body;
    await event.update(updateData);

    if (categories) {
      await event.setCategories(categories);
    }

    const updatedEvent = await Event.findByPk(req.params.id, {
      include: ['categories', 'creator']
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the creator
    if (event.creator_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user already rated this event
    const existingRating = await EventRating.findOne({
      where: { user_id: req.userId, event_id: req.params.id }
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this event' });
    }

    const newRating = await EventRating.create({
      user_id: req.userId,
      event_id: req.params.id,
      rating,
      review
    });

    res.status(201).json(newRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEventRatings = async (req, res) => {
  try {
    const ratings = await EventRating.findAll({
      where: { event_id: req.params.id },
      include: [{ model: User, attributes: ['id', 'username'] }],
      order: [['created_at', 'DESC']]
    });

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addFavorite = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await User.findByPk(req.userId);
    await user.addFavoriteEvent(event.id);

    res.json({ message: 'Event added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await User.findByPk(req.userId);
    await user.removeFavoriteEvent(event.id);

    res.json({ message: 'Event removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createEvent, getAllEvents, getNearbyEvents, getEventById, 
  updateEvent, deleteEvent, addRating, getEventRatings,
  addFavorite, removeFavorite
};