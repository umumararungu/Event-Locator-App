const { Event, User, Notification } = require('../models');
const redis = require('../config/redis');

const scheduleEventNotifications = async (eventId) => {
  try {
    const event = await Event.findByPk(eventId, {
      include: [{
        model: User,
        through: { attributes: [] },
        where: {
          '$UserCategoryPreferences.preference_score$': { [Op.gt]: 0 }
        },
        include: [{
          model: Category,
          through: { attributes: [] }
        }]
      }]
    });
    
    if (!event) return;
    
    const notificationTime = new Date(event.start_time.getTime() - (24 * 60 * 60 * 1000)); // 24h before
    
    event.Users.forEach(user => {
      const delay = notificationTime - Date.now();
      
      if (delay > 0) {
        redis.publish('event_notifications', JSON.stringify({
          userId: user.id,
          eventId: event.id,
          delay
        }));
      }
    });
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

module.exports = { scheduleEventNotifications };
