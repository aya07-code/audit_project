import React, { useEffect, useState } from "react";
import { TrendingUp, Building2, PieChart, DollarSign, Loader } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart as Pie,
  Pie as PieSlice,
  Cell,
} from "recharts";
import axios from "axios";

const DashboardAdmin = () => {
  const [summary, setSummary] = useState(null); 
  const colors = ["#4f46e5", "#10B981 ", "#3b82f6", "#facc15", "#ef4444", "#6B7280 "];
  const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  useEffect(() => {
      const fetchSummary = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("http://127.0.0.1:8000/api/dashboard/summary", {
            headers: { Authorization: `Bearer ${token}` },
          });

          // 🧩 Diagnostic console
          console.log("📦 Données brutes de l’API:", res.data);

          const data = res.data;

          // Transformation pour cohérence camelCase
          const formatted = {
            audits_count: data.audits_count || 0,
            companies_count: data.companies_count || 0,
            average_audit_score: data.average_audit_score || 0,
            revenue_this_month: data.revenue_this_month || "0",
            auditsByMonth: data.audits_by_month ?? [],
            revenueByMonth: data.revenue_by_month ?? [],
            auditsByActivity: data.audits_by_activity ?? [],
          };

          console.log("✅ Données formatées pour le dashboard:", formatted);
          setSummary(formatted);
        } catch (error) {
          console.error("❌ Erreur lors du fetch summary:", error);
        }
      };

      fetchSummary();
    }, []);


  if (!summary) {
    // Affiche un loader tant que les données ne sont pas là
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-indigo-600 animate-spin">
          <TrendingUp size={48} />
        </div>
      </div>
    );
  }

  const cardsData = [
    {
      title: "Total Audits",
      value: summary.audits_count,
      icon: <TrendingUp size={32} />,
      gradient: "from-gray-400 to-gray-500",
    },
    {
      title: "Entreprises",
      value: summary.companies_count,
      icon: <Building2 size={32} />,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Score Moyen",
      value: `${summary.average_audit_score}%`,
      icon: <PieChart size={32} />,
      gradient: "from-yellow-400 to-amber-500",
    },
    {
      title: "Revenu Mois",
      value: `${summary.revenue_this_month} MAD`,
      icon: <DollarSign size={32} />,
      gradient: "from-indigo-500 to-indigo-700",
    },
  ];

  return (
    <div className="p-2 bg-gray-100 min-h-screen ">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 Tableau de bord Admin</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cardsData.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} text-white rounded-2xl shadow-lg p-6 flex flex-col justify-between backdrop-blur-lg border border-white/20 hover:scale-105 hover:shadow-2xl transform transition duration-300`}
          >
            <div className="flex justify-between items-center">
              <div className="bg-white/20 p-3 rounded-xl">{card.icon}</div>
              <p className="text-sm font-bold">{card.title}</p>
            </div>
            <p className="text-2xl font-bold mt-4">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 flex justify-center">
        {/* Audits par mois */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="font-semibold mb-4">📅 Audits par mois</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.auditsByMonth}>
              <XAxis  dataKey="month"     
                      tickFormatter={(monthName) => {
                      const monthIndex = monthNames.indexOf(monthName);
                      return monthIndex; 
                    }} />
              <YAxis />
              <Tooltip  formatter={(value, name, props) => [value, name]} 
                        labelFormatter={(monthName) => monthName} />
              <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Camembert activités */}
        <div className="bg-white p-6 rounded-2xl shadow-lg ">
          <h2 className="font-semibold mb-4">📈 Répartition des audits par activité</h2>
          <ResponsiveContainer width="100%" height={310}>
            <Pie>
              <PieSlice
                data={summary.auditsByActivity}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {summary.auditsByActivity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </PieSlice>
              <Tooltip />
            </Pie>
          </ResponsiveContainer>
        </div>

        {/* Revenus mensuels */}
        <div className="bg-white p-6 rounded-2xl shadow-lg w-[600px] mx-auto col-span-2">
          <h2 className="font-semibold mb-4 ">💰 Revenus mensuels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.revenueByMonth}>
              <XAxis
                dataKey="month"
                tickFormatter={(monthName) => monthNames.indexOf(monthName)}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [value, name]}
                labelFormatter={(monthName) => monthName}
              />
              <Bar dataKey="total" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardAdmin;
