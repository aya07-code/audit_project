import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faBuilding, faEnvelope, faUser, faCity } from "@fortawesome/free-solid-svg-icons";

const CompaniesTable = () => {
  const MySwal = withReactContent(Swal);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Charger la liste des compagnies
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/companies", {
        headers: { Authorization: `Bearer ${token}` },
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
    fetchCompanies();
  }, []);

  // 🔹 Supprimer une compagnie (exemple : future route API)
  const handleDelete = async (companyName) => {
    MySwal.fire({
      title: "Supprimer cette compagnie ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ⚠️ Exemple de suppression — adapter si API delete existe
          // await axios.delete(`http://127.0.0.1:8000/api/companies/${id}`, {
          //   headers: { Authorization: `Bearer ${token}` },
          // });

          // Ici, on simule la suppression côté front
          setCompanies((prev) =>
            prev.filter((c) => c.company_name !== companyName)
          );

          MySwal.fire({
            icon: "success",
            title: "Supprimée !",
            text: `La compagnie "${companyName}" a été supprimée.`,
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Erreur suppression :", err);
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
        Chargement des compagnies...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
        <FontAwesomeIcon icon={faBuilding} className="mr-2" /> Liste des compagnies
      </h2>

      {companies.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          Aucune compagnie enregistrée.
        </p>
      ) : (
        <table className="min-w-full border border-gray-200">
        <thead className="bg-blue-50 text-blue-900">
            <tr>
            <th className="py-3 px-4 text-left">Nom de la compagnie</th>
            <th className="py-3 px-4 text-left">Activité</th>
            <th className="py-3 px-4 text-left">Propriétaire</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Ville</th>
            <th className="py-3 px-4 text-center">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
            {companies.map((company, index) => (
            <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">
                {company.company_name}
                </td>
                <td className="py-3 px-4">{company.activity_name || "—"}</td>
                <td className="py-3 px-4  items-center space-x-2">
                <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                <span>{company.owner_name || "—"}</span>
                </td>
                <td className="py-3 px-4  items-center space-x-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-green-500" />
                <span>{company.owner_email || "—"}</span>
                </td>
                <td className="py-3 px-4  items-center space-x-2">
                <FontAwesomeIcon icon={faCity} className="text-gray-500" />
                <span>{company.owner_ville || "—"}</span>
                </td>
                <td className="py-3 px-4 text-center">
                <button
                    onClick={() => handleDelete(company.company_name)}
                    className="text-red-600 hover:text-red-800"
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>


      )}
    </div>
  );
};

export default CompaniesTable;
