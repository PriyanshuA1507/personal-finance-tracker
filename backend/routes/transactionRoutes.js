const express = require('express');
const router = express.Router();

// Ensure these names match the exports in your controller
const { 
  getTransactions, 
  createTransaction, 
  updateTransaction, // <-- Imported here!
  deleteTransaction 
} = require('../controllers/transactionController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Protect all transaction routes
router.use(verifyToken);

// GET /api/transactions – Analyst & Admin ONLY (Viewers blocked)
router.get('/', requireRole(['analyst', 'admin']), getTransactions);

// POST – Admin ONLY
router.post('/', requireRole(['admin']), createTransaction);

// THE FIX: PUT (Update) – Admin ONLY
router.put('/:id', requireRole(['admin']), updateTransaction);

// DELETE – Admin ONLY
router.delete('/:id', requireRole(['admin']), deleteTransaction);

module.exports = router;
