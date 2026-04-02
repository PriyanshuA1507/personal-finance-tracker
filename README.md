# Personal Finance Tracker (SDE Assignment)

A production-ready full-stack Personal Finance Tracker featuring Role-Based Access Control (RBAC), Redis caching, and a PostgreSQL database.

## 🔗 Live Demo
**Application URL**: [https://personal-finance-tracker-1-64th.onrender.com/login](https://personal-finance-tracker-1-64th.onrender.com/login)  
**API Documentation (Swagger)**: [https://personal-finance-tracker-1-64th.onrender.com/api-docs](https://personal-finance-tracker-1-64th.onrender.com/api-docs)


## Testing Credentials & Role Verification:
To evaluate the Role-Based Access Control (RBAC) and data isolation features, please use the following pre-configured test accounts. The password for all accounts is: 12345

Admin Account
Username: priyanshu_admin
Password: 12345

Access: Full management of Dashboard, Analytics, and Transactions.

Analyst Account
Username: equity_analyst
Password: 12345

Access: Can view Dashboard and Transactions, but "Add" and "Delete" buttons are hidden.
Viewer Account
Username: audit_viewer
Password: 12345

Access: Restricted to high-level Dashboard and Analytics views only.
## 🛠️ Tech Stack
- **Frontend**: React 18, Chart.js, Context API, Tailwind CSS
- **Backend**: Node.js, Express.js, PostgreSQL (Sequelize ORM)
- **Caching**: Redis (Valkey)
- **Security**: JWT Authentication, Helmet (XSS protection), Sequelize (SQL Injection prevention)

## 🚀 Key Features Implemented
- **RBAC**: Three distinct user roles with conditional UI rendering and backend permission checks.
- **Performance**: Redis caching for analytics (15m) and categories (1h) to reduce database load.
- **Rate Limiting**: Tiered API limits (Auth: 5/15m, Transactions: 100/1h, Analytics: 50/1h).
- **Responsive Dashboard**: Interactive data visualizations for financial tracking.

## ⚙️ Local Setup Instructions
If you prefer to run the project locally:
1. **Database**: Create a PostgreSQL DB named `finance_tracker`.
2. **Environment**: Create a `.env` in `/backend` with `DATABASE_URL`, `REDIS_URL`, and `JWT_SECRET`.
3. **Install**:
   ```bash
   # In /backend and /frontend
   npm install
   # Start backend
cd backend && npm run dev
# Start frontend
cd frontend && npm run dev
