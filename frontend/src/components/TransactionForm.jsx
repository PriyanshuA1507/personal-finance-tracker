import React, { useState } from 'react';

const TransactionForm = React.memo(({ onSubmit, disabled }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Stylish warning for Read-Only users
  if (disabled) {
    return (
      <div className="card" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d', color: '#b45309', marginBottom: '2rem' }}>
        <strong>Read-Only Mode:</strong> Your role does not have permission to add or modify transactions.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, amount: Number(amount), category, description });
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginTop: 0, color: 'var(--text-main)' }}>Add New Transaction</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end', marginTop: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Amount ($)</label>
          <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Category</label>
          <input type="text" placeholder="e.g., Food, Salary" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Description</label>
          <input type="text" placeholder="Optional details" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit" style={{ height: '42px' }}>+ Add Transaction</button>
      </form>
    </div>
  );
});

export default TransactionForm;