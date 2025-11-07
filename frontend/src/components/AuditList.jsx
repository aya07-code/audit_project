import React from 'react';
import '../styles/Activities.css';

const AuditList = ({ audits }) => {
  if (!audits || audits.length === 0) return <p>No audits</p>;
  return (
    <div className="audit-list">
      {audits.map(a => (
        <div key={a.id} className="audit-card">
          <h4>{a.title}</h4>
          <p>{a.description}</p>
          <div className="meta">
            <span>Date: {a.date}</span>
            <span>Score: {a.score ?? '-'}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditList;