import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, FileDown, Save, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import AuditDetailStyle from "../styles/AuditDetailStyle.css";

const AuditDetails = () => {
  const { auditId, companyId } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 10;

  useEffect(() => {
    fetchAuditDetails();
  }, [auditId, companyId]);

  useEffect(() => {
    const container = document.getElementById("questions-container1");
    if (container) container.scrollTop = 0;
  }, [currentPage]);

  const fetchAuditDetails = async () => {
    try {
      const res = await axios.get(
        `https://alloaudit.com/api/client/audit/${auditId}/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAudit(res.data);
    } catch (err) {
      console.error("Error fetching audit details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (questionId, field, value) => {
    setAudit((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? { ...q, answer: { ...q.answer, [field]: value } }
          : q
      ),
    }));
    setEditing((prev) => ({ ...prev, [questionId]: true }));
  };

  const saveValidation = async (questionId) => {
    const q = audit.questions.find((q) => q.id === questionId);

    try {
      await axios.post(
        `https://alloaudit.com/api/answers/validate/${auditId}`,
        {
          question_id: questionId,
          customer_id: audit.customer_id,
          comment_admin: q.answer.comment_admin,
          validation_status: q.answer.validation_status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Saved successfully!",
        timer: 1000,
        showConfirmButton: false,
      });

      setEditing((prev) => ({ ...prev, [questionId]: false }));
    } catch (err) {
      console.error(err);
    }
  };

  const generatePDF = async () => {
    try {
      const res = await axios.get(
        `https://alloaudit.com/api/reports/audits/${auditId}/customer/${audit.customer_id}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Audit-${audit.title}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const generateCAP = async () => {
    try {
      const res = await axios.get(
        `https://alloaudit.com/api/reports/cap/${auditId}/customer/${audit.customer_id}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `CAP-${audit.title}.pdf`;
      link.click();
    } catch (err) {
      console.error("CAP generation error:", err);
    }
  };

  const generateZip = async () => {
    try {
      const res = await axios.get(
        `https://alloaudit.com/api/reports/zip/${auditId}/customer/${audit.customer_id}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Attachments-${audit.title}.zip`;
      link.click();
    } catch (err) {
      console.error("ZIP error:", err);
    }
  };
  
  const uploadAdminFile = async (questionId, answerId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `https://alloaudit.com/api/answers/${answerId}/admin-attachment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Attachment added!",
        timer: 1000,
        showConfirmButton: false,
      });

      fetchAuditDetails(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!audit)
    return <p className="text-center mt-20 text-red-600">Audit not found.</p>;

  const indexOfLast = currentPage * QUESTIONS_PER_PAGE;
  const indexOfFirst = indexOfLast - QUESTIONS_PER_PAGE;
  const currentQuestions = audit.questions.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(audit.questions.length / QUESTIONS_PER_PAGE);

  return (
    <div className="bg-[#F1F5F9] min-h-screen py-5 px-6 -mt-12 hide-scroll"  id="questions-container1" style={{ maxHeight: "600px", overflowY: "auto" }}>
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-700 hover:text-blue-900 mb-2 font-medium"
      >
        <ArrowLeft size={18} />
        Back
      </button>
      {/* HEADER CARD */}
      <div>
        <h3 className="text-2xl font-extrabold text-blue-900">{audit.title}</h3>
        <div className="grid grid-cols-7 gap-2">
        <button
          onClick={generatePDF}
          className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded-lg shadow"
        >
          <FileDown size={16} />
          Download Report
        </button>
        <button
           onClick={generateCAP}
          className="mt-2 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded-lg shadow"
        >
          <FileDown size={16} />
          Download CAPR
        </button>
        <button
           onClick={generateZip}
          className="mt-2 inline-flex items-center gap-2 bg-gray-400 hover:bg-gray-600 text-white px-2 py-2 rounded-lg shadow"
        >
          <FileDown size={16} />
          Photos Report
        </button>
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="mt-5 space-y-6 hide-scroll">
        {currentQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-[#E2E8F0] hover:shadow-md transition-all "
          >
            {/* Question title */}
            <p className="font-semibold text-[#1E293B] text-lg">{q.text}</p>

            {/* ANSWERS */}
            {q.answer && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:col-span-2 -mt-5">

                {/* CHOICE */}
                <div>
                  <label className="text-sm font-medium text-[#64748B]">Answer</label>
                  <input
                    disabled
                    value={q.answer.choice}
                    className="w-full mt-1 p-1 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-gray-700"
                  />
                </div>

                {/* JUSTIFICATION */}
                <div>
                  <label className="text-sm font-medium text-[#64748B]">Proof</label>
                  <textarea
                    disabled
                    value={q.answer.reponse || ""}
                    className="w-full mt-1 p-1 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-gray-700"
                    rows={1} 
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:col-span-2 -mt-5">
                {/* DATE */}
                <div>
                  <label className="text-sm font-medium text-[#64748B]">
                    Date
                  </label>
                  <input
                    disabled
                    type="date"
                    value={q.answer.date || ""}
                    className="w-full mt-1 p-1 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                  />
                </div>

                {/* ORGANIZATION */}
                <div>
                  <label className="text-sm font-medium text-[#64748B]">
                    Organization
                  </label>
                  <input
                    disabled
                    value={q.answer.certificate_organisme || ""}
                    className="w-full mt-1 p-1 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                  />
                </div>
                {/* CUSTOMERS COUNT */}
                <div>
                  <label className="text-sm font-medium text-[#64748B]">
                   Other
                  </label>
                  <input
                    disabled
                    value={q.answer.certificate_customers_count || ""}
                    className="w-full mt-1 p-1 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]"
                  />
                </div>
              </div>

                {/* FILE */}
                {q.answer.attachment && (
                  <div className="md:col-span-2">
                    <a
                      href={`https://alloaudit.com/storage/${q.answer.attachment}`}
                      target="_blank"
                      className="text-blue-600 underline text-sm"
                    >
                      📎View Attachment
                    </a>
                  </div>
                )}
              {/* PARTIE ADMIN */}
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 md:col-span-2 -mt-2 p-2 bg-[#E0F2FE] rounded-lg border border-[#BEE3F8]">
                {/* VALIDATION + ADMIN COMMENT (80%) */}
                <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* VALIDATION */}
                  <div>
                    <label className="text-sm font-semibold text-[#1E293B]">
                      Validation Status
                    </label>
                    <select
                      value={q.answer.validation_status || ""}
                      onChange={(e) =>
                        handleChange(q.id, "validation_status", e.target.value)
                      }
                      className="w-full mt-1 p-1 border border-[#E2E8F0] rounded-lg bg-white"
                    >
                      <option value="">Select...</option>
                      <option value="accurate">Correct</option>
                      <option value="inaccurate">Incorrect</option>
                    </select>
                  </div>

                  {/* ADMIN COMMENT */}
                  <div>
                    <label className="text-sm font-semibold text-[#1E293B]">
                      Auditor Feedback:
                    </label>
                    <textarea
                      value={q.answer.comment_admin || ""}
                      onChange={(e) =>
                        handleChange(q.id, "comment_admin", e.target.value)
                      }
                      className="w-full mt-1 p-1 border border-[#E2E8F0] rounded-lg bg-white text-gray-700"
                      rows={1}  
                    />
                  </div>
                </div>

                {/* ADMIN Attachment Button (20%) */}
                <div className="md:col-span-1 flex items-end">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    id={`admin-upload-${q.id}`}
                    className="hidden"
                    onChange={(e) => uploadAdminFile(q.id, q.answer.id, e.target.files[0])}
                  />
                  <label
                    htmlFor={`admin-upload-${q.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 mb-2 rounded-lg shadow cursor-pointer text-sm transition w-full"
                  >
                    + Add Attachment
                  </label>
                </div>
              </div>

              </div>
            )}

            {/* SAVE BUTTON */}
            {editing[q.id] && (
              <button
                onClick={() => saveValidation(q.id)}
                className="mt-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
              >
                <CheckCircle size={18} />
                Save changes
              </button>
            )}
          </div>
          
        ))}
{/* --- PAGINATION MODERNE --- */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2  disabled:opacity-40 transition"
            >
              ◀
            </button>
            <span className="px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full shadow">
              {currentPage} / {totalPages}
            </span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2  disabled:opacity-40 transition"
            >
              ▶
            </button>
          </div>

      </div>
    </div>
  );
};

export default AuditDetails;
