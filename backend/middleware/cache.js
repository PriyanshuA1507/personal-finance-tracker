const redisClient = require('../config/redisClient');

// Cache user analytics data for 15 minutes (900 seconds) 
exports.cacheAnalytics = async (req, res, next) => {
  const userId = req.user.id; 
  const key = `analytics:${userId}`;
  
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (err) {
    next();
  }
};

// Cache category lists for 1 hour (3600 seconds) 
exports.cacheCategories = async (req, res, next) => {
  const key = `categories`;
  
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    next();
  } catch (err) {
    next();
  }
};

// Implement cache invalidation on data updates 
exports.invalidateUserCache = async (userId) => {
  try {
    await redisClient.del(`analytics:${userId}`);
  } catch (err) {
    console.error("Cache invalidation failed", err);
  }
};