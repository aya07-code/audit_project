import React, { useEffect, useState } from "react";
import { TrendingUp, PieChart, Clock, CheckCircle } from "lucide-react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const DashboardHomeC = () => {
  const [summary, setSummary] = useState(null);
  const monthNames = [
    "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/customer/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (error) {
        console.error("Erreur fetch CustomerDashboard:", error);
      }
    };
    fetchData();
  }, []);

  if (!summary) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-indigo-600 animate-spin">
          <TrendingUp size={48} />
        </div>
      </div>
    );
  }

  const cardsData = [
    { title: "Total Audits", value: summary.total_audits, icon: <TrendingUp size={28} />, gradient: "from-gray-400 to-gray-500" },
    { title: "Complétés", value: summary.completed, icon: <CheckCircle size={28} />, gradient: "from-green-500 to-emerald-600" },
    { title: "En cours", value: summary.in_progress, icon: <Clock size={28} />, gradient: "from-yellow-400 to-amber-500" },
    { title: "Score Moyen", value: summary.average_score ? `${summary.average_score}%` : "0%", icon: <PieChart size={28} />, gradient: "from-indigo-500 to-indigo-700" },
  ];

  return (
    <div className="p-2 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-slate-500 mt-6">
        📊 Tableau de bord Customer
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cardsData.map((card, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${card.gradient} text-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:scale-105 transform transition duration-300`}
          >
            <div className="flex justify-between items-center">
              <div className="bg-white/20 p-3 rounded-xl">{card.icon}</div>
              <p className="text-sm font-bold">{card.title}</p>
            </div>
            <p className="text-2xl font-bold mt-4">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Graph: Audits par mois */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
        <h2 className="font-semibold mb-4">📅 Audits par mois</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={Array.from({ length: 12 }, (_, i) => { const monthNum = i + 1; const found = summary.audits_by_month.find(m => m.month === monthNum); return { month: monthNames[monthNum], total: found ? found.total : 0 }; })}>
            <XAxis dataKey="month" interval={0} tick={{ fontSize: 12 }}/>
            <YAxis domain={[0, 3]} tickCount={4} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#10B981 " radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent audits */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
        <h2 className="font-semibold mb-4">📝 Audits récents</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="border-b bg-blue-50 text-blue-900">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Titre</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Statut</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Score</th>
              </tr>
            </thead>
            <tbody>
              {summary.recent_audits.map(audit => (
                <tr key={audit.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{audit.title}</td>
                  <td className="px-4 py-2">{new Date(audit.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 capitalize">{audit.status.replace("_", " ")}</td>
                  <td className="px-4 py-2">{audit.score !== null ? `${audit.score}%` :"0%"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomeC;
