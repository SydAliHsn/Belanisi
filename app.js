const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const productRouter = require('./routes/productRoutes');
const charityRouter = require('./routes/charityRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();

// Middlewares
app.use(helmet({ crossOriginEmbedderPolicy: false }));

app.use(cors());

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
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/charities', charityRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, 'This path does not exist on this server!'));
});

// Error handler
app.use(globalErrorHandler);

module.exports = app;
