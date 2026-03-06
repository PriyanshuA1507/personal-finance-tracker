const { sequelize } = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await sequelize.sync({ force: true }); // DANGER: This clears the DB
  const hashedPassword = await bcrypt.hash('pass123', 10);
  
  await User.bulkCreate([
    { username: 'admin', password: hashedPassword, role: 'admin' },
    { username: 'user', password: hashedPassword, role: 'user' },
    { username: 'readonly', password: hashedPassword, role: 'read-only' }
  ]);
  
  console.log('PostgreSQL Seeded!');
  process.exit();
};

seed();