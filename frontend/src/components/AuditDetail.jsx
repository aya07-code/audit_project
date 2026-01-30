import React, { useEffect, useState } from "react";
import { useParams, Link,  useNavigate} from "react-router-dom";
import { apiGet } from "../utils/api";
import "../styles/AuditDetail.css";
import Footer1 from "./Footer1";
import Sidebar from "./Sidebar";
import axios from "axios";
import { ArrowLeft} from "lucide-react";

const AuditDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [audit, setAudit] = useState(null);

  const handleStartAudit = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate(`/login?redirect=audit-${id}`);

    try {
      // 1️⃣ Ajouter l’audit à la company
      const res = await fetch("https://alloaudit.com/api/customer/audit/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ audit_id: id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'ajout de l'audit");

      // 2️⃣ Créer le paiement associé à cet audit
      await fetch("https://alloaudit.com/api/customer/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ audit_id: id })
      });

      // 3️⃣ Notifier l’admin
      await fetch("https://alloaudit.com/api/notifications/audit-start", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ audit_id: id })
      });

      // 4️⃣ Redirection vers liste des audits
      navigate(`/customer/audits?audit=${id}`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    const fetchAudit = async () => {
      const res = await apiGet(`/audits/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAudit(data);
      }
    };
    fetchAudit();
  }, [id]);

  if (!audit) return <p>Chargement...</p>;

  return (
    <div className="audit-detail-page">
      <Sidebar />
      <div className="audit-banner">
          <img
          // src={audit.image || "/img/auditimg.jpg"}
          src={"/img/auditimg.png"}
          alt={audit.title}
          className="audit-banner-img"
          />
          <div className="overlay">
          <h1>{audit.title}</h1>
          </div>
      </div>

      <div className="audit-detail-container">
          <Link to="/audits" className="back-btn"><ArrowLeft size={18} />Back</Link>

          <div className="audit-content">
              <p className="audit-description">{audit.description}</p>
              <div className="audit-full-text" dangerouslySetInnerHTML={{ __html: audit.langDescription }}/>
              <p className="audit-update">
                  🕒 Last modification :{" "}
                  {audit.updated_at
                  ? new Date(audit.updated_at).toLocaleDateString("fr-FR")
                  : "Non disponible"}
              </p>
              <button 
                onClick={handleStartAudit}
                className="start-audit-btn"
              >
                Start this Audit
              </button>
          </div>
      </div>

    <Footer1 />
    </div>
  );
};

export default AuditDetail;
