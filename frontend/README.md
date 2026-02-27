# Personal Finance Tracker (SDE Assignment)

A full-stack Personal Finance Tracker with Role-Based Access Control (RBAC), Redis caching, and PostgreSQL.

## 🚀 Features
- **User Authentication**: JWT-based login/registration with 3 roles (Admin, User, Read-Only).
- **Transaction Management**: CRUD operations for finances with owner-only access.
- **Analytics Dashboard**: Interactive Chart.js visualizations (Pie, Bar, Line).
- **Performance**: Redis caching (15m for analytics), API Rate Limiting, and Lazy Loading.
- **Security**: PostgreSQL (Sequelize) for SQL Injection prevention and Helmet for XSS.

## 🛠️ Tech Stack
- **Frontend**: React 18, Chart.js, Context API
- **Backend**: Node.js, Express.js, PostgreSQL (Sequelize), Redis
- **Documentation**: Swagger/OpenAPI

## ⚙️ Local Setup
1. **Database**: 
   - Ensure PostgreSQL is running.
   - Run `psql postgres` -> `CREATE DATABASE finance_tracker;`
2. **Environment**: Create a `.env` in the `backend` folder:
   ```env
   PORT=5001
   JWT_SECRET=your_secret
   REDIS_URL=redis://localhost:6379