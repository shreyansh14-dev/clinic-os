import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Search, ShieldCheck, Clock, Terminal } from 'lucide-react';

export const AuditLogs = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(l =>
    l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>Security & Audit Event Logs</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cryptographic session authentication, database mutations & compliance audit trails</p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search user, action, log ID..."
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Initiator / User</th>
              <th>System Action Description</th>
              <th>IP Address</th>
              <th>Security Level</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id}>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <Clock size={13} style={{ display: 'inline', marginRight: '0.3rem' }} />
                  {log.timestamp}
                </td>
                <td><strong style={{ color: '#fff' }}>{log.user}</strong></td>
                <td style={{ color: 'var(--primary)', fontWeight: '600' }}>{log.action}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{log.ip}</td>
                <td>
                  <span className={`badge ${
                    log.level === 'SUCCESS' ? 'badge-success' :
                    log.level === 'WARN' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {log.level}
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
