const Transaction = require('../models/Transaction');
const redisClient = require('../config/redis');

exports.getAnalytics = async (req, res) => {
  try {
    const cacheKey = `analytics:${req.user.id}`;
    
    // Check Redis Cache first [cite: 36, 62]
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving from Redis Cache');
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from PostgreSQL
    const transactions = await Transaction.findAll({ where: { userId: req.user.id } });

    // Calculate totals for charts [cite: 48]
    const analytics = {
      totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      totalExpense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      transactions // Data for Chart.js [cite: 55]
    };

    // Save to Redis for 15 minutes (900 seconds) 
    await redisClient.setEx(cacheKey, 900, JSON.stringify(analytics));

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};