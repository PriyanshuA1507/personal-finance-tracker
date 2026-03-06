const Transaction = require('../models/Transaction');
const redisClient = require('../config/redis'); // Required for caching [cite: 62]

// 1. Get all transactions (accessible to all roles) [cite: 83]
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({ 
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Create transaction (admin and user only) [cite: 23, 84]
exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.user.id
    });
    
    // Invalidate analytics cache because data has changed [cite: 65]
    await redisClient.del(`analytics:${req.user.id}`);
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Delete transaction (admin and user only) [cite: 23, 84]
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) return res.status(404).json({ message: 'Not found' });

    // Ensure users can only delete their own data [cite: 18, 79]
    if (transaction.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await transaction.destroy();
    await redisClient.del(`analytics:${req.user.id}`); // Clear cache [cite: 65]
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};