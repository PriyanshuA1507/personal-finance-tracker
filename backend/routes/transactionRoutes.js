const express = require('express');
const router = express.Router();
// Ensure these names match the exports in your controller
const { 
  getTransactions, 
  createTransaction, 
  deleteTransaction 
} = require('../controllers/transactionController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Protect all transaction routes
router.use(verifyToken);

// THE FIX: GET /api/transactions – Analyst & Admin ONLY (Viewers blocked)
router.get('/', requireRole(['analyst', 'admin']), getTransactions);

// THE FIX: POST/DELETE – Admin ONLY
router.post('/', requireRole(['admin']), createTransaction);

// THE FIX: DELETE – Admin ONLY
router.delete('/:id', requireRole(['admin']), deleteTransaction);

module.exports = router;
