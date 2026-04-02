const { Pool } = require('pg');
require('dotenv').config();

// Bulletproof database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    // THE FIX: Filter by req.user.id so they only see their own data
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ message: "Server Error fetching transactions" });
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
const createTransaction = async (req, res) => {
  const { type, category, description, amount } = req.body;
  
  try {
    // THE FIX: Insert the transaction with the logged-in user's ID
    const result = await pool.query(
      'INSERT INTO transactions (user_id, type, category, description, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, type, category, description, amount]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating transaction:", error.message);
    res.status(500).json({ message: "Server Error creating transaction" });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    let query;
    let params;

    // Admin can delete ANY transaction. Regular users can ONLY delete their own.
    if (req.user.role === 'admin') {
      query = 'DELETE FROM transactions WHERE id = $1 RETURNING *';
      params = [id];
    } else {
      query = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *';
      params = [id, req.user.id];
    }

    const result = await pool.query(query, params);

    // If no rows were returned, the transaction didn't exist OR didn't belong to the user
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found or you are not authorized to delete it." });
    }

    res.status(200).json({ message: 'Transaction deleted successfully', id: id });
  } catch (error) {
    console.error("Error deleting transaction:", error.message);
    res.status(500).json({ message: "Server Error deleting transaction" });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction
};
