const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const HttpError = require('./utils/http-error');
const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const productRoutes = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({
    code: 0,
    message: 'ok',
    data: {
      status: 'up'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/products', productRoutes);

app.use((req, res, next) => {
  next(new HttpError(404, 'Route not found'));
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({
    code: status,
    message: error.message || 'Internal server error'
  });
});

module.exports = app;
