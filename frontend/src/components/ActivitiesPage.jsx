import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../utils/api";
import "../styles/Activities.css";

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [selectedAudits, setSelectedAudits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const auditsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await apiGet("/activities");
        if (res.ok) {
          const data = await res.json();
          setActivities(data);

          // Load all audits (unique)
          const allAuditsMap = new Map();
          for (let act of data) {
            const resA = await apiGet(`/audits/activities/${act.id}`);
            if (resA.ok) {
              const audits = await resA.json();
              audits.forEach((audit) => {
                if (!allAuditsMap.has(audit.id)) {
                  allAuditsMap.set(audit.id, audit);
                }
              });
            }
          }
          setSelectedAudits(Array.from(allAuditsMap.values()));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivities();
  }, []);

  const handleFilter = async (activity) => {
    setSelectedActivity(activity);
    setCurrentPage(1);

    if (activity === "All") {
      const allAuditsMap = new Map();
      for (let act of activities) {
        const resA = await apiGet(`/audits/activities/${act.id}`);
        if (resA.ok) {
          const audits = await resA.json();
          audits.forEach((audit) => {
            if (!allAuditsMap.has(audit.id)) {
              allAuditsMap.set(audit.id, audit);
            }
          });
        }
      }
      setSelectedAudits(Array.from(allAuditsMap.values()));
    } else {
      const resA = await apiGet(`/audits/activities/${activity.id}`);
      if (resA.ok) {
        const audits = await resA.json();
        setSelectedAudits(audits);
      }
    }
  };

  // Pagination logic
  const indexOfLastAudit = currentPage * auditsPerPage;
  const indexOfFirstAudit = indexOfLastAudit - auditsPerPage;
  const currentAudits = selectedAudits.slice(indexOfFirstAudit, indexOfLastAudit);
  const totalPages = Math.ceil(selectedAudits.length / auditsPerPage);

  return (
    <div className="activities-page">
      <header className="activities-header">
        <div className="header-top">
          <h1>All Audits</h1>
          <div className="activities-filter">
            <p>Filter By:</p>
            <select
              value={selectedActivity === "All" ? "All" : selectedActivity.id}
              onChange={(e) => {
                const act =
                  e.target.value === "All"
                    ? "All"
                    : activities.find((a) => a.id === parseInt(e.target.value));
                handleFilter(act);
              }}
            >
              <option value="All">All Activities</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="audits-grid">
        {currentAudits.length === 0 ? (
          <p>No audits found</p>
        ) : (
          currentAudits.map((audit) => (
            <div key={audit.id} className="audit-card" onClick={() => navigate(`/audit/${audit.id}`)}>
              <img
                src={audit.image || "https://via.placeholder.com/300x150"}
                alt={audit.title}
                className="audit-image"
              />
              <div className="audit-content">
                <h3>{audit.title}</h3>
                <p>{audit.description}</p>
                <div className="audit-meta">
                  <span>Dernière modification: {new Date(audit.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
          className="n"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}

          <button
          className="n"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
