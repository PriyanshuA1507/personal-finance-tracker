const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { connectDB } = require('./config/db');
const { authLimiter, transactionLimiter, analyticsLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// 1. Connect to PostgreSQL [cite: 7, 76]
connectDB();

const app = express();

// 2. Security & Global Middleware [cite: 72, 73]
app.use(helmet({
  contentSecurityPolicy: false, // Allows Swagger UI to load correctly [cite: 93]
}));
app.use(cors());
app.use(express.json());

// 3. Swagger Configuration [cite: 93]
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Tracker API',
      version: '1.0.0',
      description: 'API documentation with Role-Based Access Control (RBAC) [cite: 15, 75]',
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

// 4. API Route Mounting with Rate Limiting [cite: 37, 68]
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/auth', authLimiter, authRoutes); // 5 req/15 min [cite: 69]
app.use('/api/transactions', transactionLimiter, transactionRoutes); // 100 req/hr [cite: 70]
app.use('/api/analytics', analyticsLimiter, analyticsRoutes); // 50 req/hr [cite: 71]

// --- PRODUCTION STATIC ASSETS & SPA ROUTING ---

// 5. Serve static files from the React frontend build folder [cite: 91, 96]
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 6. THE FIX: Regex Catch-all (Compatible with Node v22 / Express 5)
// This matches any route that does NOT start with /api and sends index.html [cite: 14, 52]
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ------------------------------------------------

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
