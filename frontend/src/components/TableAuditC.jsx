import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Save, Lock } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const TableAuditC = () => {
  const [audits, setAudits] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [answers, setAnswers] = useState({});
  const [editing, setEditing] = useState({});
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchAudits = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:8000/api/client/détails/audits", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAudits(res.data);
    };
    fetchAudits();
  }, []);

  const openAudit = (audit) => {
    if (selectedAudit?.id === audit.id) return setSelectedAudit(null);

    const formatted = {};
    audit.questions?.forEach(q => {
      formatted[q.id] = {
        id: q.answer?.id || null,
        choice: q.answer?.choice || "N/A",
        justification: q.answer?.justification || "",
      };
    });

    setAnswers(formatted);
    setSelectedAudit(audit);
    setEditing(prev => ({ ...prev, [audit.id]: false }));
  };

  const handleAnswerChange = (questionId, field, value) => {
    if (!selectedAudit) return;
    if (selectedAudit.submitted && !editing[selectedAudit.id]) return;

    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], [field]: value }
    }));
  };

  const handleSubmitAnswers = async () => {
    const token = localStorage.getItem("token");
    const payload = Object.keys(answers).map(qId => ({
      question_id: parseInt(qId),
      choice: answers[qId].choice,
      justification: answers[qId].justification
    }));

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/answers/submit/${selectedAudit.id}`,
        { answers: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedAudit(prev => ({ ...prev, submitted: true, score: res.data.final_score }));
      setAudits(prev => prev.map(a => a.id === selectedAudit.id ? { ...a, submitted: true, score: res.data.final_score } : a));
      setEditing(prev => ({ ...prev, [selectedAudit.id]: false }));

      MySwal.fire({ title: "Bravo 🎉", text: "Audit soumis avec succès", icon: "success", timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      MySwal.fire({ title: "Erreur", text: "Impossible de soumettre l'audit", icon: "error" });
    }
  };

  const saveAllAnswers = async () => {
    const token = localStorage.getItem("token");

    const payload = Object.keys(answers).map(qId => ({
      question_id: parseInt(qId),
      choice: answers[qId].choice,
      justification: answers[qId].justification
    }));

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/answers/audit/${selectedAudit.id}/save-all`,
        { answers: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // mettre à jour le score dans le front
      setSelectedAudit(prev => ({ ...prev, score: res.data.score }));
      setAudits(prev => 
        prev.map(a => a.id === selectedAudit.id ? { ...a, score: res.data.score } : a)
      );

      MySwal.fire({
        title: "✔️",
        text: "Modifications sauvegardées",
        icon: "success",
        timer: 1200,
        showConfirmButton: false
      });

    } catch (err) {
      console.error(err);
      MySwal.fire({
        title: "Erreur",
        text: "Impossible de sauvegarder",
        icon: "error"
      });
    }
  };

  if (!audits.length) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-500">Liste des Audits</h2>
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-blue-50 text-blue-900 text-left">
          <tr>
            <th className="px-4 py-2">Titre</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Score</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {audits.map(audit => (
            <tr key={audit.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{audit.title}</td>
              <td className="px-4 py-2">{new Date(audit.date).toLocaleDateString()}</td>
              <td className="px-4 py-2 capitalize">{audit.status.replace("_"," ")}</td>
              <td className="px-4 py-2">{audit.score}%</td>
              <td className="px-4 py-2 flex items-center space-x-3">
                <button onClick={() => openAudit(audit)} className="flex items-center space-x-1 text-green-500 hover:text-green-700">
                  <Eye size={18} /><span className="text-sm">Détails</span>
                </button>
                {audit.submitted && <div className="flex items-center text-sm text-red-500"><Lock size={16} className="mr-1" /> Soumis</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedAudit && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{selectedAudit.title} - Questions & Réponses</h3>
            <div>
              {selectedAudit.submitted ? <span className="text-sm text-gray-500 flex items-center"><Lock size={16} className="mr-1"/> Audit verrouillé</span>
              // Sauvegarder les modification de custumer avant envoyer a admin dans front et backend 
              : <button onClick={saveAllAnswers} className="font-bold text-green-600 hover:text-green-800 flex items-center"><Save size={18} /> <span className="ml-2 text-sm">sauvegarder</span></button>}
            </div>
          </div>

          <table className="min-w-full table-auto border-collapse mb-4">
            <thead className="bg-blue-50 text-blue-900 text-left">
              <tr>
                <th className="px-3 py-2">Question</th>
                <th className="px-3 py-2">Réponse</th>
                <th className="px-3 py-2">Justification</th>
              </tr>
            </thead>
            <tbody>
              {selectedAudit.questions.map(q => {
                const current = answers[q.id] ?? { choice: "N/A", justification: "" };
                const isDisabled = selectedAudit.submitted && !(editing[selectedAudit.id] ?? false);
                return (
                  <tr key={q.id} className="border-b">
                    <td className="px-3 py-2">{q.text}</td>
                    <td className="px-3 py-2">
                      <select value={current.choice} disabled={isDisabled} onChange={e => handleAnswerChange(q.id,"choice",e.target.value)} className="border rounded px-2 py-1">
                        <option value="Oui">Oui</option>
                        <option value="Non">Non</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input value={current.justification} disabled={isDisabled} onChange={e => handleAnswerChange(q.id,"justification",e.target.value)} className="border rounded px-2 py-1 w-full"/>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!selectedAudit.submitted && <button onClick={() => handleSubmitAnswers(selectedAudit.id)} className="bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded">Envoyer les réponses</button>}
        </div>
      )}
    </div>
  );
};

export default TableAuditC;
