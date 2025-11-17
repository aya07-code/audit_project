import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity } from "react-icons/fa";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    adress: "",
    ville: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setFormData(user);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("http://127.0.0.1:8000/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setSuccess("✅ Profil mis à jour !");
      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (err) {
      setError("❌ Erreur lors de la mise à jour du profil.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded-lg p-6">
      {[
        { label: "Name", icon: <FaUser />, name: "name" },
        { label: "Email", icon: <FaEnvelope />, name: "email" },
        { label: "Phone", icon: <FaPhone />, name: "phone" },
        { label: "Adress", icon: <FaMapMarkerAlt />, name: "adress" },
        { label: "Ville", icon: <FaCity />, name: "ville" },
      ].map((field, i) => (
        <div key={i}>
          <label className="block text-gray-700 mb-1">{field.label}</label>
          <div className="flex items-center border rounded-md px-3 py-2 bg-[#F9FAFB] focus-within:ring-2 focus-within:ring-[#10B981]">
            <span className="text-[#6B7280] mr-2">{field.icon}</span>
            <input
              type="text"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full bg-transparent outline-none text-gray-800"
            />
          </div>
        </div>
      ))}

      {success && <p className="text-green-600">{success}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-[#10B981] text-white px-6 py-2 rounded-md hover:bg-[#0d9966] transition-all duration-200"
      >
        {loading ? "Mise à jour..." : "Update Profile"}
      </button>
    </form>
  );
}
