import React from 'react';
// Changed the icons here to FaArrowUp and FaArrowDown
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './Pages.css';

const Performance = () => {
  // Mock portfolio data 
  const portfolio = [
    { id: 1, asset: 'Suzlon Energy', type: 'Equity', allocation: '35%', return: '+15.2%', isPositive: true },
    { id: 2, asset: 'MMTC Ltd', type: 'Equity', allocation: '25%', return: '+5.4%', isPositive: true },
    { id: 3, asset: 'Meesho', type: 'Private Equity', allocation: '20%', return: '+22.0%', isPositive: true },
    { id: 4, asset: 'Nifty 50 Index', type: 'ETF', allocation: '20%', return: '-1.2%', isPositive: false },
  ];

  return (
    <div className="page-container">
      <h2 className="page-title">Portfolio Performance</h2>
      <p className="page-subtitle">Track your investment growth and asset allocation.</p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Asset Type</th>
              <th>Portfolio Allocation</th>
              <th>All-Time Return</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: '600' }}>{item.asset}</td>
                <td>{item.type}</td>
                <td>{item.allocation}</td>
                <td style={{ color: item.isPositive ? '#15803d' : '#b91c1c', fontWeight: '600' }}>
                  {item.return}
                </td>
                <td>
                  {/* Updated the icons here as well! */}
                  {item.isPositive ? (
                    <FaArrowUp style={{ color: '#15803d' }} />
                  ) : (
                    <FaArrowDown style={{ color: '#b91c1c' }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Performance;