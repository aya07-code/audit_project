import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building2, User, Briefcase } from "lucide-react";

const CompanyCustomer = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/customer/company-info", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!data) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-slate-700 text-center">
        Profil de Votre Entreprise
      </h2>

      <div className="space-y-8">

        {/* Entreprise */}
        <div className="p-5 bg-blue-50 border border-blue-300 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="text-blue-600" size={22} />
            <h3 className="text-xl font-semibold text-blue-700">Entreprise</h3>
          </div>
          <p className="text-slate-700"><b>Nom :</b> {data.company.name}</p>
        </div>

        {/* Activité */}
        <div className="p-5 bg-gray-100 border border-gray-300 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="text-gray-500" size={22} />
            <h3 className="text-xl font-semibold text-gray-600">Activité</h3>
          </div>
          <p><b>Nom :</b> {data.activity.name}</p>
          <p className="text-slate-700"><b>Description :</b> {data.activity.description}</p>
        </div>

        {/* Client */}
        <div className="p-5 bg-green-50  border border-green-300 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <User className="text-green-600" size={22} />
            <h3 className="text-xl font-semibold text-green-700">Client</h3>
          </div>
          <p><b>Nom :</b> {data.customer.name}</p>
          <p><b>Email :</b> {data.customer.email}</p>
          <p><b>Téléphone :</b> {data.customer.phone}</p>
          <p><b>Adresse :</b> {data.customer.address}</p>
        </div>

      </div>
    </div>
  );
};

export default CompanyCustomer;
