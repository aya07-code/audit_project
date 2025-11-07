import React from 'react';
import '../styles/Activities.css';

const ActivityCard = ({ activity, onOpen }) => {
  return (
    <div className="activity-card" onClick={onOpen}>
      <h3>{activity.name}</h3>
      <p className="small">{activity.description || 'No description'}</p>
    </div>
  );
};

export default ActivityCard;