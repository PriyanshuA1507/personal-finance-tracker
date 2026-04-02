import React, { useEffect, useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { getTransactions } from '../services/transactionService';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 1. Optimize expensive calculations: Income vs Expenses (Bar Chart)
  const incomeVsExpenseData = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(tx => {
      if (tx.type.toLowerCase() === 'income') income += Number(tx.amount);
      if (tx.type.toLowerCase() === 'expense') expense += Number(tx.amount);
    });

    return {
      labels: ['Income vs Expenses'],
      datasets: [
        { label: 'Income', data: [income], backgroundColor: 'rgba(75, 192, 192, 0.6)' },
        { label: 'Expenses', data: [expense], backgroundColor: 'rgba(255, 99, 132, 0.6)' }
      ]
    };
  }, [transactions]);

  // 2. Optimize expensive calculations: Expenses by Category (Pie Chart)
  const categoryData = useMemo(() => {
    const categories = {};
    transactions.filter(tx => tx.type.toLowerCase() === 'expense').forEach(tx => {
      categories[tx.category] = (categories[tx.category] || 0) + Number(tx.amount);
    });

    return {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    };
  }, [transactions]);

  // 3. THE FIX: Dynamic Monthly Trend (Line Chart)
  const trendData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = {};
    
    // Initialize all months to 0
    monthNames.forEach(m => monthlyTotals[m] = 0);

    // Add up expenses for each month
    transactions.forEach(tx => {
      if (tx.type.toLowerCase() === 'expense') {
        const date = new Date(tx.date);
        const month = monthNames[date.getMonth()];
        monthlyTotals[month] += Number(tx.amount);
      }
    });

    return {
      labels: monthNames,
      datasets: [{
        label: 'Monthly Spending',
        data: monthNames.map(m => monthlyTotals[m]),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.3, // Adds a slight curve to the line
        fill: true
      }]
    };
  }, [transactions]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
      <h2>Financial Overview</h2>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3>Expenses by Category</h3>
          {transactions.length > 0 ? <Pie data={categoryData} /> : <p style={{ color: 'var(--text-muted)' }}>No data available yet.</p>}
        </div>

        <div className="card">
          <h3>Income vs Expenses</h3>
          <Bar data={incomeVsExpenseData} options={{ responsive: true }} />
        </div>

        <div className="card">
          <h3>Spending Trends</h3>
          <Line data={trendData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
