import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGet } from "../utils/api";
import "../styles/AuditDetail.css";
import Footer1 from "./Footer1";
import Sidebar from "./Sidebar";

const AuditDetail = () => {
  const { id } = useParams();
  const [audit, setAudit] = useState(null);

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
          src={"/img/auditimg.jpg"}
          alt={audit.title}
          className="audit-banner-img"
          />
          <div className="overlay">
          <h1>{audit.title}</h1>
          </div>
      </div>

      <div className="audit-detail-container">
          <Link to="/audits" className="back-btn">← Retour</Link>

          <div className="audit-content">
              <p className="audit-description">{audit.description}</p>

              <p className="audit-full-text">
                  International Associated is approved to carry out Traceability Audits to the EDFA (European Down and feather Asociation) Code of Conduct, the EDFA Traceability Standard and the EDFA Audit Standard. <br /> <br />
                  The welfare of animals and proper husbandry are of vital importance to our society. This does not only apply to the actual well-being of the animals, but also to a high degree to public health, commerce, and the international competitiveness of the European economy. <br /> <br />
                  The over 90 European feather and bedding companies that have joined forces in the European Down and Feather Association (EDFA) since 1980, produce and market about 80% of the turnover volume and thus by far the largest fraction of the products sold in Europe. Ever since its establishment, the association has advocated for the gathering of down and feathers in compliance with community legislative references on animal protection. The respective legal provisions within the EC on animal husbandry and feather gathering are automatically part of its codex.
              </p>

              <p className="audit-update">
                  🕒 Dernière modification :{" "}
                  {audit.updated_at
                  ? new Date(audit.updated_at).toLocaleDateString("fr-FR")
                  : "Non disponible"}
              </p>
          </div>
      </div>

    <Footer1 />
    </div>
  );
};

export default AuditDetail;
