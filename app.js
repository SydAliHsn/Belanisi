const express = require('express');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

// Routes
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/user', userRoutes);

module.exports = app;
