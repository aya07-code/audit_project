import React, { useState } from "react";
import axios from "axios";

export default function Password({ activeTab }) {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8000/api/user/password", formData, {
          headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setSuccess("Mot de passe mis à jour !");
      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du mot de passe.");
    }

    setLoading(false);
  };

  return (
    <div className={`tabs__pane -tab-item-2 ${activeTab === 2 ? "is-active" : ""}`}>
      <form onSubmit={handleSubmit} className="contact-form row y-gap-30">
        <div className="col-12">
          <label>Current Password</label>
          <input type="password" name="current_password" value={formData.current_password} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label>New Password</label>
          <input type="password" name="new_password" value={formData.new_password} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <label>Confirm New Password</label>
          <input type="password" name="new_password_confirmation" value={formData.new_password_confirmation} onChange={handleChange} required />
        </div>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="col-12">
          <button className="button -md -purple-1 text-white" disabled={loading}>
            {loading ? "Mise à jour..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
