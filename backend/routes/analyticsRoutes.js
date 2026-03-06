const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/auth');

// GET /api/analytics – accessible to all roles [cite: 85]
router.get('/', verifyToken, getAnalytics);

module.exports = router;