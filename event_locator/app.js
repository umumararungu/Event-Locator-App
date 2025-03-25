const express = require('express');
const cors = require('cors');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const authMiddleware = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

// Initialize i18n
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    }
  });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(i18nextMiddleware.handle(i18next));
app.use(authMiddleware);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handler
app.use(errorHandler);

module.exports = app;
