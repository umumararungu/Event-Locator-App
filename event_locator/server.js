const app = require('./app');
const { sequelize } = require('./models');
const redis = require('./config/redis');

const PORT = process.env.PORT || 3000;

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established');
    
    // Sync models (use { force: true } in development to drop tables)
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      
      // Start notification worker
      require('./workers/notificationWorker')(redis);
    });
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
    process.exit(1);
  });
  