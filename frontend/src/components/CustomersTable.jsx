import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaUsers } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUser, faEnvelope, faBuilding, faCity } from "@fortawesome/free-solid-svg-icons";

const CustomersTable = () => {
  const MySwal = withReactContent(Swal);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les clients depuis l'API
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      MySwal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les clients.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Supprimer un client
  const handleDelete = async (customerId, customerName) => {
    MySwal.fire({
      title: `Supprimer "${customerName}" ?`,
      text: "Cette action est irréversible !",
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
          await axios.delete(`http://127.0.0.1:8000/api/customers/${customerId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Supprimer localement
          setCustomers((prev) => prev.filter((c) => c.id !== customerId));

          MySwal.fire({
            icon: "success",
            title: "Supprimé !",
            text: `Le client "${customerName}" a été supprimé.`,
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error(err);
          MySwal.fire({
            icon: "error",
            title: "Erreur",
            text: "Impossible de supprimer ce client.",
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 text-lg">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-8">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-4 flex items-center gap-2">
         <FaUsers className="text-[#10B981]" /> Customer list
      </h2>

      {customers.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          No registered customers.
        </p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead className="bg-blue-50 text-blue-900">
            <tr>
              <th className="py-3 px-2 text-left">
                <FontAwesomeIcon icon={faUser} className="text-gray-500 ml-1" /> Name
              </th>
              <th className="py-3 px-2 text-left">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 ml-1" /> Email
              </th>
              <th className="py-3 px-2 text-left">
                <FontAwesomeIcon icon={faBuilding} className="text-gray-500 ml-1" /> Company
              </th>
              <th className="py-3 px-2 text-left">
                <FontAwesomeIcon icon={faCity} className="text-gray-500 ml-1" /> City
              </th>
              <th className="py-3 px-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-800">{customer.name}</td>
                <td className="py-3 px-4">{customer.email}</td>
                <td className="py-3 px-4">{customer.company_name || "—"}</td>
                <td className="py-3 px-4">{customer.ville || "—"}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDelete(customer.id, customer.name)}
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

export default CustomersTable;
