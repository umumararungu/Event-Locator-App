module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      name_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      icon: {
        type: DataTypes.STRING
      }
    }, {
      timestamps: true,
      underscored: true
    });
  
    Category.associate = models => {
      Category.belongsToMany(models.User, {
        through: 'UserCategoryPreferences',
        foreignKey: 'category_id'
      });
      Category.belongsToMany(models.Event, {
        through: 'EventCategories',
        foreignKey: 'category_id'
      });
    };
  
    return Category;
  };