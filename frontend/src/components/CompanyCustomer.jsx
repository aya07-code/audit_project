import React, { useEffect, useState } from "react";
import axios from "axios";
import { Building2, User, Briefcase } from "lucide-react";
import { FaBuilding } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const CompanyCustomer = () => {
  const MySwal = withReactContent(Swal);
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    ICE: "",
    RC: "",
    address: "",
    activity_id: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/customer/company-info", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setData(res.data);
        setForm({
          name: res.data.company.name,
          ICE: res.data.company.ICE,
          RC: res.data.company.RC,
          address: res.data.company.address,
          activity_id: res.data.activity.id,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/companies/${data.company.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // mettre à jour la page sans reload
      setData((prev) => ({
        ...prev,
        company: { ...prev.company, ...form },
      }));

      setEditing(false);
      Swal.fire({
        title: "Succès !",
        text: "Entreprise mise à jour avec succès.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur s'est produite lors de la mise à jour.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (!data) return <p className="text-gray-500">Chargement...</p>;

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-2">
        <FaBuilding className="text-[#10B981]" />Your Company Profile
      </h2>

      <div className="space-y-8">

        {/* === ENTREPRISE === */}
        <div className="p-5 bg-blue-50 border border-blue-300 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building2 className="text-blue-600" size={22} />
              <h3 className="text-xl font-semibold text-blue-700">Company</h3>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg"
            >
              {editing ? "Annuler" : "Modifier"}
            </button>
          </div>

          {!editing ? (
            <>
              <p className="text-slate-700"><b>Name :</b> {data.company.name}</p>
              <p className="text-slate-700"><b>ICE :</b> {data.company.ICE}</p>
              <p className="text-slate-700"><b>RC :</b> {data.company.RC}</p>
              <p className="text-slate-700"><b>Address :</b> {data.company.address}</p>
            </>
          ) : (
            <>
              <input
                className="w-full mb-2 p-2 border rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
              />
              <input
                className="w-full mb-2 p-2 border rounded"
                value={form.ICE}
                onChange={(e) => setForm({ ...form, ICE: e.target.value })}
                placeholder="ICE"
              />
              <input
                className="w-full mb-2 p-2 border rounded"
                value={form.RC}
                onChange={(e) => setForm({ ...form, RC: e.target.value })}
                placeholder="RC"
              />
              <input
                className="w-full mb-2 p-2 border rounded"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Address"
              />

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white mt-2 rounded-lg"
              >
                Enregistrer
              </button>
            </>
          )}
        </div>

        {/* === ACTIVITE === */}
        <div className="p-5 bg-gray-100 border border-gray-300 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="text-gray-500" size={22} />
            <h3 className="text-xl font-semibold text-gray-600">Activity</h3>
          </div>
          <p><b>Name :</b> {data.activity.name}</p>
          <p><b>Description :</b> {data.activity.description}</p>
        </div>

        {/* === CLIENT === */}
        <div className="p-5 bg-green-50 border border-green-300 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <User className="text-green-600" size={22} />
            <h3 className="text-xl font-semibold text-green-700">Client</h3>
          </div>
          <p><b>Full name :</b> {data.customer.name}</p>
          <p><b>Email :</b> {data.customer.email}</p>
          <p><b>Phone :</b> {data.customer.phone}</p>
          <p><b>Address :</b> {data.customer.address}</p>
        </div>

      </div>
    </div>
  );
};

export default CompanyCustomer;
