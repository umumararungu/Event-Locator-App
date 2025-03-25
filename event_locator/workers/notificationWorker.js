const { Notification, User, Event } = require('../models');

module.exports = (redis) => {
  const subscriber = redis.duplicate();
  
  subscriber.subscribe('event_notifications');
  
  subscriber.on('message', async (channel, message) => {
    if (channel === 'event_notifications') {
      const { userId, eventId, delay } = JSON.parse(message);
      
      setTimeout(async () => {
        try {
          const user = await User.findByPk(userId);
          const event = await Event.findByPk(eventId);
          
          if (user && event) {
            await Notification.create({
              user_id: userId,
              event_id: eventId,
              message_key: 'notifications.upcoming_event',
              is_read: false,
              scheduled_at: new Date(Date.now() + delay)
            });
            
            // In a real app, you would send an email/push notification here
            console.log(`Notification sent to user ${userId} about event ${eventId}`);
          }
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }, delay);
    }
  });
};
