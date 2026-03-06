const { sequelize } = require('./config/db');
const Transaction = require('./models/Transaction');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // Warning: This clears existing data!

    // 1. Create Demo Users for each RBAC role
    const hashedPass = await bcrypt.hash('pass123', 10);
    const admin = await User.create({ username: 'admin', password: hashedPass, role: 'admin' });
    const standardUser = await User.create({ username: 'user', password: hashedPass, role: 'user' });
    const readOnly = await User.create({ username: 'readonly', password: hashedPass, role: 'read-only' });

    // 2. Add realistic Transactions for the 'user' account
    const categories = ['Food', 'Rent', 'Salary', 'Shopping', 'Investment', 'Utilities'];
    const transactions = [];

    for (let i = 0; i < 20; i++) {
      const isIncome = Math.random() > 0.7;
      transactions.push({
        title: isIncome ? 'Monthly Credit' : `Expense ${i + 1}`,
        amount: isIncome ? Math.floor(Math.random() * 5000) + 2000 : Math.floor(Math.random() * 500) + 50,
        type: isIncome ? 'income' : 'expense',
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
        userId: standardUser.id
      });
    }

    await Transaction.bulkCreate(transactions);
    console.log('✅ Database seeded with Demo Users and 20 Transactions!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
