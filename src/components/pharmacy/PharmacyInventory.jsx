import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Package, Search, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const PharmacyInventory = () => {
  const { pharmacyInventory } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = pharmacyInventory.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Pharmacy Drug Inventory & Stock Control</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time stock monitoring, batch numbers, unit prices & expiry warnings</p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search medicine, category..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Batch Number</th>
              <th>Expiry Date</th>
              <th>Unit Price</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => (
              <tr key={item.id}>
                <td><strong style={{ color: '#fff' }}>{item.name}</strong></td>
                <td><span className="badge badge-purple">{item.category}</span></td>
                <td><strong style={{ color: item.stock < item.minThreshold ? 'var(--red)' : '#fff', fontSize: '1rem' }}>{item.stock} Units</strong></td>
                <td style={{ color: 'var(--text-muted)' }}>{item.batchNo}</td>
                <td>{item.expiry}</td>
                <td><strong style={{ color: 'var(--green)' }}>₹{item.price}</strong></td>
                <td>
                  <span className={`badge ${item.stock < item.minThreshold ? 'badge-danger' : 'badge-success'}`}>
                    {item.stock < item.minThreshold ? 'Low Stock Warning' : 'In Stock'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
