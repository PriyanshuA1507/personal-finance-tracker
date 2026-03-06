const rateLimit = require('express-rate-limit');

// Auth endpoints: 5 requests per 15 minutes [cite: 69]
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

// Transaction endpoints: 100 requests per hour [cite: 70]
const transactionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: { message: 'Transaction limit reached for this hour' }
});

// Analytics endpoints: 50 requests per hour 
const analyticsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: { message: 'Analytics view limit reached' }
});

module.exports = { authLimiter, transactionLimiter, analyticsLimiter };