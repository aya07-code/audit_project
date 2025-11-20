import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AuditQuestions = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [audit, setAudit] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 🔹 Charger audit
  const fetchAudit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://127.0.0.1:8000/api/audits/${auditId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAudit(res.data);
    } catch (err) {
      console.error("Erreur audit :", err);
      MySwal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les informations de l’audit.",
      });
    }
  };

  // 🔹 Charger les questions
  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://127.0.0.1:8000/api/questions/audits/${auditId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (err) {
      console.error("Erreur questions :", err);
      MySwal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les questions.",
      });
    }
  };

  useEffect(() => {
    fetchAudit();
    fetchQuestions();
  }, [auditId]);

  // 🔹 Ajouter une question
  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) {
      MySwal.fire({
        icon: "warning",
        title: "Champ vide",
        text: "Veuillez saisir une question avant d’ajouter.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:8000/api/questions/audits/${auditId}`,
        { text: newQuestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewQuestion("");
      fetchQuestions();

      MySwal.fire({
        icon: "success",
        title: "Question ajoutée !",
        text: "La question a été enregistrée avec succès.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Erreur ajout :", err);
      MySwal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible d’ajouter la question.",
      });
    }
  };

  // 🔹 Modifier une question
  const handleSaveEdit = async (questionId) => {
    if (!editText.trim()) {
      MySwal.fire({
        icon: "warning",
        title: "Champ vide",
        text: "Veuillez saisir un texte pour la question.",
      });
      return;
    }

    MySwal.fire({
      title: "Confirmer la modification ?",
      text: "La question sera mise à jour.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, modifier",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.put(
            `http://127.0.0.1:8000/api/questions/audits/${auditId}/questions/${questionId}`,
            { text: editText },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setEditingId(null);
          setEditText("");
          fetchQuestions();

          MySwal.fire({
            icon: "success",
            title: "Question mise à jour !",
            timer: 1200,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Erreur modification :", err);
          MySwal.fire({
            icon: "error",
            title: "Erreur",
            text: "Impossible de modifier la question.",
          });
        }
      }
    });
  };

  // 🔹 Supprimer une question
  const handleDelete = async (questionId) => {
    MySwal.fire({
      title: "Supprimer cette question ?",
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
          const token = localStorage.getItem("token");
          await axios.delete(
            `http://127.0.0.1:8000/api/questions/audits/${auditId}/questions/${questionId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          fetchQuestions();

          MySwal.fire({
            icon: "success",
            title: "Supprimée !",
            text: "La question a été supprimée avec succès.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Erreur suppression :", err);
          MySwal.fire({
            icon: "error",
            title: "Erreur",
            text: "Impossible de supprimer la question.",
          });
        }
      }
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <h2 className="text-xl font-bold text-blue-900">
            {audit ? `Questions de l’audit : ${audit.title}` : "Chargement..."}
          </h2>
        </div>

        {/* ➕ Ajouter une question */}
        <div className="flex mb-4 space-x-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Nouvelle question..."
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            onClick={handleAddQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPlus} /> Add
          </button>
        </div>

        {/* 📋 Liste des questions */}
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-3 px-4 text-left text-blue-900">Question</th>
              <th className="py-3 px-4 text-center text-blue-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  {editingId === q.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border rounded-lg px-2 py-1 w-full"
                    />
                  ) : (
                    q.text
                  )}
                </td>
                <td className="py-3 px-4 text-center space-x-3">
                  {editingId === q.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(q.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ↩️
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(q.id);
                          setEditText(q.text);
                        }}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {questions.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-6 text-gray-500">
                  No questions were found for this audit.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditQuestions;
