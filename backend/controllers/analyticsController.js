const { Pool } = require('pg');
const redisClient = require('../config/redis');
require('dotenv').config();

// Standardized database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `analytics:${userId}`;
    
    // 1. Check Redis Cache first (Sub-millisecond response time)
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving from Redis Cache');
      return res.json(JSON.parse(cachedData));
    }

    // 2. If not in cache, run the SQL Aggregations concurrently
    const [summaryResult, categoryResult, trendResult] = await Promise.all([
      
      // Calculate Total Income & Expenses in a single scan
      pool.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN LOWER(type) = 'income' THEN amount ELSE 0 END), 0) AS total_income,
          COALESCE(SUM(CASE WHEN LOWER(type) = 'expense' THEN amount ELSE 0 END), 0) AS total_expense
        FROM transactions
        WHERE user_id = $1
      `, [userId]),

      // Group expenses by category
      pool.query(`
        SELECT category, SUM(amount) AS total_amount
        FROM transactions
        WHERE user_id = $1 AND LOWER(type) = 'expense'
        GROUP BY category
        ORDER BY total_amount DESC
      `, [userId]),

      // Fetch raw transactions to pass down for Chart.js / Datatables
      pool.query(`
        SELECT id, type, category, description, amount, date 
        FROM transactions 
        WHERE user_id = $1 
        ORDER BY date DESC
      `, [userId])
    ]);

    const totalIncome = parseFloat(summaryResult.rows[0].total_income);
    const totalExpense = parseFloat(summaryResult.rows[0].total_expense);
    const netBalance = totalIncome - totalExpense;

    // 3. Construct the payload matching your frontend's exact needs
    const analytics = {
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        savingsRate: totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0
      },
      expensesByCategory: categoryResult.rows.map(row => ({
        category: row.category,
        amount: parseFloat(row.total_amount)
      })),
      transactions: trendResult.rows // Preserved for your Chart.js configurations
    };

    // 4. Save to Redis for 15 minutes (900 seconds) 
    await redisClient.setEx(cacheKey, 900, JSON.stringify(analytics));

    res.status(200).json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error.message);
    res.status(500).json({ error: "Server Error fetching analytics" });
  }
};
