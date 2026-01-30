import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../styles/CompaniesTable.css";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaBuilding } from "react-icons/fa";
import {
  faTrash,
  faBuilding,
  faEnvelope,
  faUser,
  faCity,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";

const CompaniesTable = () => {
  const MySwal = withReactContent(Swal);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [city, setCity] = useState("");
  const [activity, setActivity] = useState("");
  const [audit, setAudit] = useState("");

  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [audits, setAudits] = useState([]);

  const fetchFiltersData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://alloaudit.com/api/filters/companies-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        setCities(res.data.cities);
        setActivities(res.data.activities);
        setAudits(res.data.audits);
      } catch (err) {
        console.error("Error loading filters", err);
      }
  };

  // Charger les compagnies
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://alloaudit.com/api/companies", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          city,
          activity_id: activity,
          audit_id: audit,
        }
      });
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les compagnies.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersData();
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [city, activity, audit]);

  // Supprimer une compagnie (avec son customer lié)
  const handleDelete = async (companyId, companyName) => {
    MySwal.fire({
      title: `Supprimer "${companyName}" ?`,
      text: "Cette action supprimera aussi le client associé.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`https://alloaudit.com/api/companies/${companyId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Supprimer localement dans la table
          setCompanies((prev) => prev.filter((c) => c.id !== companyId));

          MySwal.fire({
            icon: "success",
            title: "Supprimée !",
            text: `La compagnie "${companyName}" et son client ont été supprimés.`,
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error(err);
          MySwal.fire({
            icon: "error",
            title: "Erreur",
            text: "Impossible de supprimer cette compagnie.",
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
          Loading companies...
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-8">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-2">
        <FaBuilding className="text-[#10B981]" /> List of companies
      </h2>

      <div className="flex gap-4 mb-4">

        {/* Filter by City */}
        <select
          className="border border-green-500 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">All City</option>
          {cities.map((c, index) => (
            <option key={index} value={c}>{c}</option>
          ))}
        </select>

        {/* Filter by Activity */}
        <select
          className="border border-green-500 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        >
          <option value="">All Activity</option>
          {activities.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {/* Filter by Audit */}
        <select
          className="border border-green-500 bg-white px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          value={audit}
          onChange={(e) => setAudit(e.target.value)}
        >
          <option value="">All Audit</option>
          {audits.map((a) => (
            <option key={a.id} value={a.id}>{a.title}</option>
          ))}
        </select>

      </div>

      {companies.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          No registered company.
        </p>
      ) : (
        <div className="companies-table-wrapper">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-blue-50 text-blue-900">
              <tr>
                <th className="py-3 px-2 text-left">
                  <FontAwesomeIcon icon={faBuilding} className="text-gray-500 ml-1" /> Company
                </th>
                <th className="py-3 px-2 text-left">
                  <FontAwesomeIcon icon={faBriefcase} className="text-gray-500 ml-1" /> Activity
                </th>
                <th className="py-3 px-4 text-left">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500" /> Owner
                </th>
                <th className="py-3 px-2 text-left">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" /> Email
                </th>
                <th className="py-3 px-2 text-left">
                  <FontAwesomeIcon icon={faCity} className="text-gray-500" /> City
                </th>
                <th className="py-3 px-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {companies.map((company, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {company.company_name}
                  </td>
                  <td className="py-3 px-5">{company.activity_name || "—"}</td>
                  <td className="py-3 px-4">{company.owner_name || "—"}</td>
                  <td className="py-3 px-4">{company.owner_email || "—"}</td>
                  <td className="py-3 px-4">{company.owner_ville || "—"}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(company.id, company.company_name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;
