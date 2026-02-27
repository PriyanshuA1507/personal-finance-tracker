const { Sequelize } = require('sequelize');

// Database name must match what you created in Step 2
const sequelize = new Sequelize('finance_tracker', 'priyanshubhardwaj', '', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Keeps your terminal clean
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // Sync creates the 'Users' and 'Transactions' tables automatically [cite: 16, 22]
    await sequelize.sync({ alter: true }); 
    console.log('PostgreSQL Connected & Tables Synced Successfully');
  } catch (error) {
    console.error('PostgreSQL Connection Error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };