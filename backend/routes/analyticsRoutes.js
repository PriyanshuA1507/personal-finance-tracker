const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { verifyToken, requireRole } = require('../middleware/auth'); // THE FIX: Imported requireRole

// THE FIX: Explicitly allow Viewer, Analyst, and Admin to view dashboard insights
router.get('/', verifyToken, requireRole(['viewer', 'analyst', 'admin']), getAnalytics);

module.exports = router;
