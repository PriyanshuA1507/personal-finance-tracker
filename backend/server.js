const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { connectDB } = require('./config/db'); 
const { Pool } = require('pg'); 

// Load environment variables
dotenv.config();

// 1. Connect to PostgreSQL via your existing db.js
connectDB();

// 2. Create a direct database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 3. THE FIX: Force the creation of the tables immediately on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
  );
  
  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    amount NUMERIC(12, 2) NOT NULL
  );
`).then(() => {
  console.log("SUCCESS: Verified 'users' and 'transactions' tables exist!");
}).catch(err => {
  console.error("ERROR: Failed to create tables:", err.message);
});

const app = express();

// 4. Security & Global Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(express.json());

// 5. Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Tracker API',
      version: '1.0.0',
      description: 'API documentation with Role-Based Access Control (RBAC)',
    },
    servers: [{ url: process.env.LIVE_URL || `http://localhost:${process.env.PORT || 5001}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 6. User Registration Route
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Insert new user with default 'user' role
    const newUser = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, password, 'user']
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// 7. API Route Mounting
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/auth', authRoutes); 
app.use('/api/transactions', transactionRoutes); 
app.use('/api/analytics', analyticsRoutes); 

// --- PRODUCTION STATIC ASSETS & SPA ROUTING ---
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
