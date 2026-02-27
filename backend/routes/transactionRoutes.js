const express = require('express');
const router = express.Router();
// Ensure these names match the exports in your controller
const { 
  getTransactions, 
  createTransaction, 
  deleteTransaction 
} = require('../controllers/transactionController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Protect all transaction routes [cite: 14]
router.use(verifyToken);

// GET /api/transactions – accessible to all roles [cite: 83]
router.get('/', getTransactions);

// POST/DELETE – restricted to admin and user [cite: 84]
router.post('/', requireRole(['admin', 'user']), createTransaction);

// This is likely line 15 - Ensure deleteTransaction is correctly imported!
router.delete('/:id', requireRole(['admin', 'user']), deleteTransaction);

module.exports = router;