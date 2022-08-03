const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const cors = require('cors');

const visitController = require('./controllers/visitController');
const AppError = require('./utils/AppError');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const productRouter = require('./routes/productRoutes');
const campaignRouter = require('./routes/campaignRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const visitRouter = require('./routes/visitRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
// app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", '*'],
        // 'script-src': ["'self'", '*'],
      },
    },
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(cors({ credentials: true, origin: 'http://127.0.0.1:3000' }));
}
if (process.env.NODE_ENV === 'production') {
  app.use(cors({ credentials: true }));
}

const limiter = rateLimit({
  max: 999,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from your IP. Please try again in some time',
});
app.use('/api', limiter);

app.use(cookieParser());

app.use(express.json());

app.use(xss());

app.use(mongoSanitize());

// Routes
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/campaigns', campaignRouter);
app.use('/api/v1/visits', visitRouter);
app.use('/api/v1/transactions', transactionRouter);

// Admin Frontend
// app.use('/admin', visitController.createVisit, express.static('build-admin'));
app.use('/admin', express.static('build-admin'));
app.use('/admin/:routes', express.static('build-admin'));
app.use('/admin/:routes/:more', express.static('build-admin'));

// General Frontend
app.use('/', visitController.createVisit, express.static('build'));
app.use('/:routes/', express.static('build'));
app.use('/:routes/:more', express.static('build'));
app.use('/:routes/:more/:evenMore', express.static('build'));

app.all('*', (req, res, next) => {
  next(new AppError(404, 'This path does not exist on this server!'));
});

// Error handler
app.use(globalErrorHandler);

module.exports = app;
