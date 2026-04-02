const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
// Ensure pool is exported from your db.js to use the inline register route
const { connectDB, pool } = require('./config/db'); 

// Load environment variables
dotenv.config();

// 1. Connect to PostgreSQL
connectDB();

const app = express();

// 2. Security & Global Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allows Swagger UI to load correctly
}));
app.use(cors());
app.use(express.json());

// 3. Swagger Configuration
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

// 4. NEW: User Registration Route
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
    console.error(err.message);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// 5. API Route Mounting (Rate Limiters Removed to prevent lockouts)
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Rate limiters (authLimiter, etc.) are removed from these calls
app.use('/api/auth', authRoutes); 
app.use('/api/transactions', transactionRoutes); 
app.use('/api/analytics', analyticsRoutes); 

// --- PRODUCTION STATIC ASSETS & SPA ROUTING ---

// 6. Serve static files from the React frontend build folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 7. SPA Catch-all: Matches any route that does NOT start with /api and sends index.html
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
