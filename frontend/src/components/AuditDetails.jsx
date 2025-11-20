import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, FileDown, Save } from "lucide-react";

const AuditDetails = () => {
  const { auditId, companyId } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAuditDetails();
  }, [auditId, companyId]);

  const fetchAuditDetails = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/client/audit/${auditId}/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAudit(res.data);
    } catch (err) {
      console.error("Error fetching audit details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, field, value) => {
    setAudit(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, answer: { ...q.answer, [field]: value } } : q
      )
    }));
    setEditing(prev => ({ ...prev, [questionId]: true }));
  };

  const saveAnswer = async (questionId) => {
    const q = audit.questions.find(q => q.id === questionId);
    if (!q?.answer) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/answers/update-or-create/${auditId}`,
        {
          question_id: questionId,
          choice: q.answer.choice,
          justification: q.answer.justification,
          customer_id: audit.customer_id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditing(prev => ({ ...prev, [questionId]: false }));
      fetchAuditDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const generatePDF = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/reports/audits/${auditId}/customer/${audit.customer_id}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `audit ${audit.title} of company ${audit.company_name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading audit...</p>;
  if (!audit) return <p className="text-center mt-20 text-red-600">Audit not found.</p>;

  return (
    <div className="-mt-[60px]">
     <div className="px-6 py-10 max-w-4xl mx-auto">
      
      {/* Retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-700 hover:underline mb-6"
      >
        <ArrowLeft size={18} /> Retour
      </button>

    {/* Header Card */}
    <div className="bg-white shadow-xl rounded-2xl p-7 border border-blue-50 relative overflow-hidden">

    {/* Decorative Top Bar */}
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-200 to-blue-100 rounded-t-2xl"></div>

    <h2 className="text-2xl text-blue-900 font-extrabold mb-2">
        {audit.title}
    </h2>

    <p className="text-gray-700 mb-4 text-base leading-relaxed">
        {audit.description}
    </p>

    {/* Info Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <strong className="text-blue-800">Date :</strong>
        <span className="ml-2">
            {new Date(audit.date).toLocaleDateString()}
        </span>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <strong className="text-blue-800">Score :</strong>
        <span className="ml-2">{audit.score ?? "—"}%</span>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 ">
        <strong className="text-blue-800">Status :</strong>
        <span className={"ml-2"}>{audit.status}</span>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <strong className="text-blue-800">Answered :</strong>
        <span className="ml-2">
            {audit.answered_count}/{audit.total_questions}
        </span>
        </div>
    </div>

    {/* Button */}
    <button
        onClick={generatePDF}
        className="mt-5 flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-lg hover:bg-blue-800 transition shadow-md"
    >
        <FileDown size={18} />
        Download PDF Report
    </button>
    </div>


    {/* Questions */}
    <div className="mt-10">

    <div className="space-y-5">
        {audit.questions.map((q) => (
        <div
            key={q.id}
            className="p-5 bg-gradient-to-br from-white to-blue-100 border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
            {/* Question Title */}
            <div className="flex items-start justify-between">
            <p className="font-semibold text-gray-700 text-lg">{q.text}</p>

            {q.answer ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Answered
                </span>
            ) : (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                Not answered
                </span>
            )}
            </div>

            {/* If answered */}
            {q.answer && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Choice */}
                <div>
                <label className="text-sm font-medium text-gray-600">Choice</label>
                <select
                    value={q.answer.choice}
                    onChange={(e) => handleAnswerChange(q.id, "choice", e.target.value)}
                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400"
                >
                    <option value="Oui">Yes</option>
                    <option value="Non">No</option>
                    <option value="N/A">N/A</option>
                </select>
                </div>

                {/* Justification */}
                <div>
                <label className="text-sm font-medium text-gray-600">
                    Justification
                </label>
                <input
                    type="text"
                    value={q.answer.justification || ""}
                    onChange={(e) =>
                    handleAnswerChange(q.id, "justification", e.target.value)
                    }
                    className="mt-1 w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400"
                />
                </div>
            </div>
            )}

            {/* Save Button */}
            {editing[q.id] && (
            <button
                onClick={() => saveAnswer(q.id)}
                className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                <Save size={16} /> Sauvegarder
            </button>
            )}
        </div>
        ))}
    </div>
    </div>

     </div>
    </div>
  );
};

export default AuditDetails;
