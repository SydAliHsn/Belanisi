const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
app.use(helmet());

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from your IP. Please try again in some time',
});
app.use('/api', limiter);

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

app.use(xss());

app.use(mongoSanitize());

// Routes
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/user', userRoutes);

// Error handler
app.use(globalErrorHandler);

module.exports = app;
