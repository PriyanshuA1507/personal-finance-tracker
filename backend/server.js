const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { connectDB } = require('./config/db');
const { authLimiter, transactionLimiter, analyticsLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// 1. Connect to PostgreSQL [cite: 7]
// Sequelize ensures protection against SQL Injection via parameterized queries 
connectDB();

const app = express();

// 2. Security & Global Middleware [cite: 72, 73]
app.use(helmet()); // Protects against XSS and various header vulnerabilities
app.use(cors());
app.use(express.json());

// 3. Swagger Configuration 
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Tracker API',
      version: '1.0.0',
      description: 'API documentation with Role-Based Access Control (RBAC) [cite: 15]',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5001}` }],
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

// 4. Route Mounting with Targeted Rate Limiting [cite: 37, 68]
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes'); // Required for charts [cite: 27]

// Auth endpoints: 5 requests per 15 minutes [cite: 69]
app.use('/api/auth', authLimiter, authRoutes);

// Transaction endpoints: 100 requests per hour [cite: 70]
app.use('/api/transactions', transactionLimiter, transactionRoutes);

// Analytics endpoints: 50 requests per hour [cite: 71]
app.use('/api/analytics', analyticsLimiter, analyticsRoutes);

// 5. Basic Health Check
app.get('/', (req, res) => {
  res.send('Finance Tracker API (PostgreSQL + Redis) is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});