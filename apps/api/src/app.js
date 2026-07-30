const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const requestRoutes = require('./routes/requestRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const dealRoutes = require('./routes/dealRoutes');
const app = express();
const chatRoutes = require('./routes/chatRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const itemCategoryRoutes = require('./routes/itemCategoryRoutes');

app.use(helmet());

const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());

const uploadAccessMiddleware = require('./middleware/uploadAccessMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/uploads', uploadAccessMiddleware, express.static('uploads'));
app.use('/api/ratings', ratingRoutes);
app.use('/api/item-categories', itemCategoryRoutes);



app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      message: 'carrygo_app API is running',
      databaseTime: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'File too large. Maximum size is 5MB'
    });
  }

  if (err.message === 'Only JPG and PNG image files are allowed') {
    return res.status(400).json({
      message: err.message
    });
  }

  next(err);
});
app.use(errorHandler);

module.exports = app;
