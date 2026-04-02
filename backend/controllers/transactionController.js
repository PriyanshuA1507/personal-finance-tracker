const { Pool } = require('pg');
require('dotenv').config();

// Bulletproof database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @desc    Get all transactions (with optional filtering)
// @route   GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    // 1. Extract query parameters from the request URL
    const { type, category, startDate, endDate } = req.query;

    // 2. Start building the base SQL query and the parameters array
    let queryText = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [req.user.id];

    // 3. Dynamically append filters if they exist in the request
    if (type) {
      params.push(type); // Adds the type to the array (e.g., 'expense')
      queryText += ` AND type = $${params.length}`; // Becomes $2
    }

    if (category) {
      params.push(category); 
      queryText += ` AND category = $${params.length}`; 
    }

    if (startDate) {
      params.push(startDate);
      queryText += ` AND date >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      queryText += ` AND date <= $${params.length}`;
    }

    // 4. Always order by the newest first
    queryText += ' ORDER BY date DESC';

    // 5. Execute the dynamically built query
    const result = await pool.query(queryText, params);
    
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
    // Insert the transaction with the logged-in user's ID
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

// @desc    Update an existing transaction
// @route   PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, category, description, amount } = req.body;

  try {
    let query;
    let params;

    // Admin can update ANY transaction. Regular users can ONLY update their own.
    if (req.user.role === 'admin') {
      query = `UPDATE transactions 
               SET type = COALESCE($1, type), 
                   category = COALESCE($2, category), 
                   description = COALESCE($3, description), 
                   amount = COALESCE($4, amount) 
               WHERE id = $5 RETURNING *`;
      params = [type, category, description, amount, id];
    } else {
      query = `UPDATE transactions 
               SET type = COALESCE($1, type), 
                   category = COALESCE($2, category), 
                   description = COALESCE($3, description), 
                   amount = COALESCE($4, amount) 
               WHERE id = $5 AND user_id = $6 RETURNING *`;
      params = [type, category, description, amount, id, req.user.id];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found or unauthorized." });
    }

    res.status(200).json({ 
      message: 'Transaction updated successfully', 
      transaction: result.rows[0] 
    });
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    res.status(500).json({ message: "Server Error updating transaction" });
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
  updateTransaction, // <-- Exported here!
  deleteTransaction
};
