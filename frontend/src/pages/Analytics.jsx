import React from 'react';
import { FaWallet, FaArrowUp, FaChartPie } from 'react-icons/fa';
import './Pages.css'; 

const Analytics = () => {
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
            <h2>${netWorth || '0.00'}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-wrapper icon-green">
            <FaArrowUp />
          </div>
          <div className="stat-info">
            <p>Monthly Savings Rate</p>
            <h3>32.4%</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-wrapper icon-purple">
            <FaChartPie />
          </div>
          <div className="stat-info">
            <p>Top Expense Category</p>
            <h3>Housing</h3>
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
