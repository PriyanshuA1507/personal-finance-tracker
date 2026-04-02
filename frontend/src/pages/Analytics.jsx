import React, { useState, useEffect } from 'react';
import { FaWallet, FaArrowUp, FaChartPie } from 'react-icons/fa';
import api from '../services/api'; // Uses your configured Axios instance
import './Pages.css'; 

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the logged-in user's specific data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching data for analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 2. Financial Math Calculations
  // Filter and sum income and expenses
  const totalIncome = transactions
    .filter(t => t.type.toLowerCase() === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type.toLowerCase() === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Calculate Net Worth
  const netWorth = totalIncome - totalExpense;

  // Calculate Savings Rate (Prevent division by zero)
  const savingsRate = totalIncome > 0 
    ? ((netWorth / totalIncome) * 100).toFixed(1) 
    : 0;

  // 3. Find the Top Expense Category
  const expenseCategories = transactions
    .filter(t => t.type.toLowerCase() === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});

  const topCategory = Object.keys(expenseCategories).length > 0
    ? Object.keys(expenseCategories).reduce((a, b) => expenseCategories[a] > expenseCategories[b] ? a : b)
    : 'None';

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h2>Loading your financial data...</h2>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Analytics Overview</h2>
      <p className="page-subtitle">A detailed breakdown of your financial metrics.</p>

      {/* Professional Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon-wrapper icon-blue">
            <FaWallet />
          </div>
          <div className="stat-info">
            <p>Total Net Worth</p>
            {/* Format numbers securely with commas and 2 decimals */}
            <h2>${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-wrapper icon-green">
            <FaArrowUp />
          </div>
          <div className="stat-info">
            <p>Monthly Savings Rate</p>
            <h3>{savingsRate}%</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-wrapper icon-purple">
            <FaChartPie />
          </div>
          <div className="stat-info">
            <p>Top Expense Category</p>
            <h3>{topCategory}</h3>
          </div>
        </div>
      </div>

      <div className="admin-table-container" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
        <p>Advanced predictive charts and historical data visualizer will be deployed in v2.0.</p>
      </div>
    </div>
  );
};

export default Analytics;
