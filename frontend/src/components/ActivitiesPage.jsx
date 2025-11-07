import React, { useEffect, useState } from 'react';
import AuthNavbar from './AuthNavbar';
import ActivityCard from './ActivityCard';
import AuditList from './AuditList';
import { apiGet } from '../utils/api';
import '../styles/Activities.css';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivityAudits, setSelectedActivityAudits] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiGet('/activities');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
      setLoading(false);
    })();
  }, []);

  const openActivity = async (activity) => {
    setSelectedActivity(activity);
    const res = await apiGet(`/audits/activities/${activity.id}`);
    if (res.ok) {
      const data = await res.json();
      setSelectedActivityAudits(data);
    } else {
      setSelectedActivityAudits([]);
    }
  };

  return (
    <div>
      <AuthNavbar />
      <main className="activities-page">
        <header className="activities-hero">
          <h1>Activities & Audits</h1>
          <p>Overview of all activities and their audits</p>
        </header>

        <section className="activities-grid">
          <aside className="activities-list">
            {loading ? <p>Loading...</p> : activities.map(a => (
              <ActivityCard key={a.id} activity={a} onOpen={() => openActivity(a)} />
            ))}
          </aside>

          <section className="audits-panel">
            {selectedActivity ? (
              <>
                <h2>Audits for: {selectedActivity.name}</h2>
                <AuditList audits={selectedActivityAudits} />
              </>
            ) : (
              <p>Select an activity to see its audits</p>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export default ActivitiesPage;