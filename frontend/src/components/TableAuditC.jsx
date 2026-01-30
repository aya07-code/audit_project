import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Save, Lock, UploadCloud, FileDown } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaClipboardList } from "react-icons/fa";
import "../styles/TableAuditStyle.css";

const QUESTIONS_PER_PAGE = 10;

const TableAuditC = () => {
  const [audits, setAudits] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [answers, setAnswers] = useState({});
  const MySwal = withReactContent(Swal);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://alloaudit.com/api/client/détails/audits",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAudits(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAudits();
  }, []);

  useEffect(() => {
    const container = document.getElementById("questions-container");
    if (container) container.scrollTop = 0;
  }, [currentPage]);

  const openAudit = (audit) => {
    if (selectedAudit?.id === audit.id) return setSelectedAudit(null);

    const formatted = {};
    audit.questions?.forEach((q) => {
      formatted[q.id] = {
        choice: q.answer?.choice || "N/A",
        reponse: q.answer?.reponse || "",
        date: q.answer?.date || "",
        certificate_organisme: q.answer?.certificate_organisme || "",
        certificate_customers_count: q.answer?.certificate_customers_count || "",
        attachment: {
          old: q.answer?.attachment || null,
          new: null,
        },
      };
    });

    setAnswers(formatted);
    setSelectedAudit(audit);
  };

  const handleAnswerChange = (questionId, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], [field]: value },
    }));
  };

  const handleFileChange = (questionId, file) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], attachment: { ...prev[questionId].attachment, new: file } },
    }));
  };

  const saveAllAnswers = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.keys(answers).forEach((qId) => {
        formData.append(`answers[${qId}][question_id]`, qId);
        formData.append(`answers[${qId}][choice]`, answers[qId].choice);
        formData.append(`answers[${qId}][reponse]`, answers[qId].reponse);
        formData.append(`answers[${qId}][date]`, answers[qId].date);
        formData.append(`answers[${qId}][certificate_organisme]`, answers[qId].certificate_organisme);
        formData.append(`answers[${qId}][certificate_customers_count]`, answers[qId].certificate_customers_count);
        if (answers[qId].attachment.new) {
          formData.append(`answers[${qId}][attachment]`, answers[qId].attachment.new);
        }
      });

      const res = await axios.post(
        `https://alloaudit.com/api/answers/audit/${selectedAudit.id}/save-all`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      setSelectedAudit((prev) => ({ ...prev, score: res.data.score, status: res.data.status }));
      setAudits((prev) =>
        prev.map((a) => (a.id === selectedAudit.id ? { ...a, score: res.data.score, status: res.data.status } : a))
      );

      MySwal.fire({ title: "✔️", text: "Answers saved", icon: "success", timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      MySwal.fire({ title: "Error", text: "Unable to save", icon: "error" });
    }
  };

  const handleSubmitAnswers = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.keys(answers).forEach((qId) => {
        formData.append(`answers[${qId}][question_id]`, qId);
        formData.append(`answers[${qId}][choice]`, answers[qId].choice);
        formData.append(`answers[${qId}][reponse]`, answers[qId].reponse);
        formData.append(`answers[${qId}][date]`, answers[qId].date);
        formData.append(`answers[${qId}][certificate_organisme]`, answers[qId].certificate_organisme);
        formData.append(`answers[${qId}][certificate_customers_count]`, answers[qId].certificate_customers_count);
        if (answers[qId].attachment.new) {
          formData.append(`answers[${qId}][attachment]`, answers[qId].attachment.new);
        }
      });

      const res = await axios.post(
        `https://alloaudit.com/api/answers/submit/${selectedAudit.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      setSelectedAudit((prev) => ({ ...prev, submitted: true, score: res.data.final_score, status: res.data.final_status }));
      setAudits((prev) =>
        prev.map((a) => (a.id === selectedAudit.id ? { ...a, submitted: true, score: res.data.final_score, status: res.data.final_status } : a))
      );

      MySwal.fire({ title: "Submitted 🎉", text: "Audit sent to admin", icon: "success", timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      MySwal.fire({ title: "Error", text: "Unable to submit audit", icon: "error" });
    }
  };

  const downloadCAPR = async (audit) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://alloaudit.com/api/reports/cap/${audit.id}/client`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `CAPR-${audit.title}.pdf`;
      link.click();
    } catch (err) {
      console.error("CAPR generation error:", err);
    }
  };

  const questionsToDisplay = selectedAudit
    ? selectedAudit.questions.slice((currentPage - 1) * QUESTIONS_PER_PAGE, currentPage * QUESTIONS_PER_PAGE)
    : [];

  const totalPages = selectedAudit ? Math.ceil(selectedAudit.questions.length / QUESTIONS_PER_PAGE) : 0;

  const goNext = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
  const goPrev = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

  return (
    <div
      className="table-responsive p-4 bg-white shadow-md rounded-lg my-8 hide-scroll"
      id="questions-container"
      style={{ maxHeight: "600px", overflowY: "auto" }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#1E3A8A]">
        <FaClipboardList className="text-[#10B981]" /> Details of audits
      </h2>

      {/* --- Audits Table --- */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
       <div className="table-scroll-x">
        <table className=" audit-table min-w-full table-auto">
          <thead className="bg-blue-50 text-blue-900 text-left">
            <tr>
              <th className="px-4 py-2">List of Audits</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit) => (
              <tr key={audit.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{audit.title}</td>
                <td className="px-4 py-2">{new Date(audit.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{audit.status}</td>
                <td className="px-4 py-2">{audit.score}%</td>
                <td className="px-4 py-2 flex items-center justify-center space-x-3">
                  <button onClick={() => openAudit(audit)} className="flex items-center space-x-1 text-green-500 hover:text-green-700">
                    <Eye size={18} /> <span className="text-sm">Details</span>
                  </button>
                  {audit.submitted && (
                    <div className="flex items-center text-sm text-red-500">
                      <Lock size={16} className="mr-1" /> Submitted
                    </div>
                  )}
                  <button onClick={() => downloadCAPR(audit)} className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <FileDown size={14} />CAPR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
      </div>

      {/* --- Questions Table --- */}
      {selectedAudit && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-blue-700">{selectedAudit.title}</h3>
            {!selectedAudit.submitted && (
              <button onClick={saveAllAnswers} className="font-bold text-green-600 hover:text-green-800 flex items-center">
                <Save size={18} /> <span className="ml-2 text-sm">To safeguard</span>
              </button>
            )}
            {selectedAudit.submitted && (
              <span className="text-sm text-red-500 flex items-center">
                <Lock size={16} className="mr-1" /> Audit locked
              </span>
            )}
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
           <div className="table-scroll-x">
            <table className="audit-table min-w-full table-auto">
              <thead className="bg-blue-50 text-blue-900 text-left">
                <tr>
                  <th className="px-4 py-2">Question</th>
                  <th className="px-4 py-2">Choice</th>
                  <th className="px-4 py-2">Answer</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Organization</th>
                  <th className="px-4 py-2">Other</th>
                  <th className="px-4 py-2">Attachment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {questionsToDisplay.map((q) => {
                  const current = answers[q.id] || {};
                  const isDisabled = selectedAudit.submitted;

                  return (
                    <tr key={q.id} className="hover:bg-gray-50 transition-all">
                      <td data-label="Question" className="px-3 py-2 text-sm">{q.text}</td>
                      <td data-label="Choice" className="px-3 py-2">
                        <select
                          value={current.choice || "N/A"}
                          disabled={isDisabled}
                          onChange={(e) => handleAnswerChange(q.id, "choice", e.target.value)}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-full max-w-[120px] focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="In Progress">In Progress</option>
                          <option value="N/A">N/A</option>
                        </select>
                      </td>
                      <td data-label="Answer" className="px-3 py-2">
                        <input
                          value={current.reponse || ""}
                          disabled={isDisabled}
                          onChange={(e) => handleAnswerChange(q.id, "reponse", e.target.value)}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-full max-w-[200px] focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </td>
                      <td data-label="Date" className="px-3 py-2">
                        <input
                          type="date"
                          value={current.date || ""}
                          disabled={isDisabled}
                          onChange={(e) => handleAnswerChange(q.id, "date", e.target.value)}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-full max-w-[140px] focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </td>
                      <td data-label="Organization" className="px-3 py-2">
                        <input
                          value={current.certificate_organisme || ""}
                          disabled={isDisabled}
                          onChange={(e) => handleAnswerChange(q.id, "certificate_organisme", e.target.value)}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-full max-w-[140px] focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </td>
                      <td data-label="Other" className="px-3 py-2">
                        <input
                          placeholder="nbr,..."
                          value={current.certificate_customers_count || ""}
                          disabled={isDisabled}
                          onChange={(e) => handleAnswerChange(q.id, "certificate_customers_count", e.target.value)}
                          className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-full max-w-[80px] focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </td>
                      <td data-label="Attachment" className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <label className={`inline-flex items-center px-1 py-1 border rounded-lg bg-green-600 text-white cursor-pointer hover:bg-green-700 ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}>
                            <UploadCloud size={18} />
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                              className="hidden"
                              disabled={isDisabled}
                              onChange={(e) => handleFileChange(q.id, e.target.files[0])}
                            />
                          </label>
                          {answers[q.id]?.attachment?.old && (
                            <a
                              href={`https://alloaudit.com/storage/${answers[q.id].attachment.old}`}
                              target="_blank"
                              className="inline-flex items-center px-1 py-1 border rounded-lg bg-blue-600 text-white"
                              title="Open file"
                            >
                              <Eye size={18} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
           </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button onClick={goPrev} disabled={currentPage === 1} className="px-4 py-2 disabled:opacity-40 transition">◀</button>
            <span className="px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full shadow">{currentPage} / {totalPages}</span>
            <button onClick={goNext} disabled={currentPage === totalPages} className="px-4 py-2 disabled:opacity-40 transition">▶</button>
          </div>

          {!selectedAudit.submitted && (
            <button onClick={handleSubmitAnswers} className="bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded-lg mt-4 w-full max-w-[200px]">
              Submit answers
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableAuditC;
