import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getTransactions, createTransaction, deleteTransaction } from '../services/transactionService';
import TransactionForm from '../components/TransactionForm'; 

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  const handleAdd = useCallback(async (newTx) => {
    try {
      const savedTx = await createTransaction(newTx);
      setTransactions((prev) => [savedTx, ...prev]);
    } catch (err) {
      alert("Failed to add transaction");
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter(tx => tx.id !== id));
    } catch (err) {
      alert("Failed to delete transaction");
    }
  };

  // THE FIX: Define who has Admin powers
  const isAdmin = user?.role === 'admin';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', paddingBottom: '3rem' }}>
      <h2>Manage Transactions</h2>
      
      {/* THE FIX: Only render the Add Form if they are an Admin */}
      {isAdmin && <TransactionForm onSubmit={handleAdd} disabled={!isAdmin} />}

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              {/* THE FIX: Hide Actions column header if user is not an Admin */}
              {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
                  No transactions found. {isAdmin && "Try adding one above!"}
                </td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${tx.type}`}>
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{tx.category}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{tx.description || '-'}</td>
                  <td style={{ fontWeight: 600 }}>${parseFloat(tx.amount).toFixed(2)}</td>
                  
                  {/* THE FIX: Only render the Delete button if they are an Admin */}
                  {isAdmin && (
                    <td style={{ textAlign: 'right' }}>
                      <button className="danger" onClick={() => handleDelete(tx.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
