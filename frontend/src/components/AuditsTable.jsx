import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AuditsTable = () => {
  const [audits, setAudits] = useState([]);
  const [editingAudit, setEditingAudit] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  // 🔹 Charger la liste des audits
  const fetchAudits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/audits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAudits(response.data);
    } catch (err) {
      console.error("Error fetching audits:", err);
      MySwal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les audits.",
      });
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  // 🔹 Quand on clique sur "modifier"
  const handleEditClick = (audit) => {
    setEditingAudit(audit.id);
    setFormData({ title: audit.title, description: audit.description || "" });
  };

  // 🔹 Quand on annule l’édition
  const handleCancelEdit = () => {
    setEditingAudit(null);
    setFormData({ title: "", description: "" });
    MySwal.fire({
      icon: "info",
      title: "Modification annulée",
      showConfirmButton: false,
      timer: 1200,
    });
  };

  // 🔹 Mise à jour des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Envoi de la mise à jour
  const handleUpdate = async (e) => {
    e.preventDefault();

    MySwal.fire({
      title: "Confirmer la mise à jour ?",
      text: "Les changements seront enregistrés.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, enregistrer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.put(
            `http://127.0.0.1:8000/api/audits/${editingAudit}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          MySwal.fire({
            icon: "success",
            title: "Audit mis à jour !",
            text: "Les informations ont été enregistrées avec succès.",
            showConfirmButton: false,
            timer: 1800,
          });

          setEditingAudit(null);
          fetchAudits();
        } catch (err) {
          console.error("Erreur lors de la mise à jour:", err);
          MySwal.fire({
            icon: "error",
            title: "Erreur",
            text: "Une erreur s’est produite lors de la mise à jour.",
          });
        }
      }
    });
  };

  // 🔹 Voir les détails
  const handleView = (auditId) => {
    navigate(`/audits/${auditId}`);
  };

  return (
    <div className="p-3 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-slate-500">
          Liste des Audits
        </h1>

        {/* 🔸 Formulaire d’édition affiché au-dessus du tableau */}
        {editingAudit && (
          <div className="mb-6 border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Modifier l’audit
            </h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block font-medium text-gray-700">
                  Titre :
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  Description :
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 flex items-center"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 🔸 Tableau des audits */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-blue-900">
                  Titre
                </th>
                <th className="py-3 px-4 text-left font-medium text-blue-900">
                  Description
                </th>
                <th className="py-3 px-4 text-center font-medium text-blue-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {audits.map((audit) => (
                <tr key={audit.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{audit.title}</td>
                  <td className="py-3 px-4">{audit.description || "—"}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex space-x-4">
                      <button
                        onClick={() => handleEditClick(audit)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleView(audit.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {audits.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Aucun audit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditsTable;
