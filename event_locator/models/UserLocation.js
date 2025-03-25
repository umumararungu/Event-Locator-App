module.exports = (sequelize, DataTypes) => {
    const UserLocation = sequelize.define('UserLocation', {
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      timestamps: true,
      underscored: true
    });
  
    UserLocation.associate = models => {
      UserLocation.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
    };
  
    return UserLocation;
  };