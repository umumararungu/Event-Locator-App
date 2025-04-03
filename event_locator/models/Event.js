module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description_key: {
      type: DataTypes.TEXT
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE
    },
    capacity: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    }
  }, {
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['latitude', 'longitude'] // For geospatial queries
      },
      {
        fields: ['start_time'] // For event scheduling
      }
    ]
  });

  Event.associate = models => {
    Event.belongsTo(models.User, { 
      foreignKey: 'creator_id',
      as: 'creator'
    });
    Event.belongsToMany(models.Category, {
      through: 'EventCategories',
      foreignKey: 'event_id',
      as: 'categories'
    });
    Event.hasMany(models.EventRating, { 
      foreignKey: 'event_id',
      as: 'ratings'
    });
    Event.belongsToMany(models.User, {
      through: 'UserFavorites',
      foreignKey: 'event_id',
      as: 'favoritedBy'
    });
  };

  return Event;
};
