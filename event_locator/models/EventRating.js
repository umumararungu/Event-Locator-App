module.exports = (sequelize, DataTypes) => {
    const EventRating = sequelize.define('EventRating', {
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      review: {
        type: DataTypes.TEXT
      }
    }, {
      timestamps: true,
      underscored: true
    });
  
    EventRating.associate = models => {
      EventRating.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
      EventRating.belongsTo(models.Event, {
        foreignKey: 'event_id'
      });
    };
  
    return EventRating;
  };