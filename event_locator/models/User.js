module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      preferred_language: {
        type: DataTypes.STRING(10),
        defaultValue: 'en'
      }
    }, {
      timestamps: true,
      underscored: true
    });
  
    User.associate = models => {
      User.hasMany(models.Event, { foreignKey: 'creator_id' });
      User.hasMany(models.UserLocation, { foreignKey: 'user_id' });
      User.belongsToMany(models.Category, {
        through: 'UserCategoryPreferences',
        foreignKey: 'user_id'
      });
      User.belongsToMany(models.Event, {
        through: 'UserFavorites',
        foreignKey: 'user_id'
      });
    };
  
    return User;
  };
  