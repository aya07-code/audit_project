import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Save, UploadCloud } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const QUESTIONS_PER_PAGE = 17;

const CustomerAuditDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [audit, setAudit] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://alloaudit.com/api/client/audit/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAudit(res.data);

        const formatted = {};
        res.data.questions.forEach((q) => {
        const answer = q.answers?.find(a => a.audit_id === res.data.id) || {};
        formatted[q.id] = {
          choice: answer.choice || "",
          reponse: answer.reponse || "",
          date: answer.date || "",
          certificate_organisme: answer.certificate_organisme || "",
          certificate_customers_count: answer.certificate_customers_count || "",
          attachment: answer.attachment || null
          };
        });
        setAnswers(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [id]);

  const handleAnswerChange = (questionId, field, value) => {
    if (audit?.submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], [field]: value },
    }));
  };

  const handleFileChange = (questionId, file) => {
    if (audit?.submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], attachment: file },
    }));
  };

  const saveAllAnswers = async () => {
    if (!audit) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.keys(answers).forEach((qId) => {
      const ans = answers[qId];
      formData.append(`answers[${qId}][question_id]`, qId);
      formData.append(`answers[${qId}][choice]`, ans.choice);
      formData.append(`answers[${qId}][reponse]`, ans.reponse);
      formData.append(`answers[${qId}][date]`, ans.date);
      formData.append(`answers[${qId}][certificate_organisme]`, ans.certificate_organisme);
      formData.append(`answers[${qId}][certificate_customers_count]`, ans.certificate_customers_count);
      if (ans.attachment) formData.append(`answers[${qId}][attachment]`, ans.attachment);
    });

    try {
      await axios.post(
        `https://alloaudit.com/api/answers/audit/${audit.id}/save-all`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      MySwal.fire({ title: "✔️ Saved", icon: "success", timer: 1200, showConfirmButton: false });
      window.dispatchEvent(new Event("auditSaved"));
    } catch (err) {
      console.error(err);
      MySwal.fire({ title: "Error", text: "Unable to save", icon: "error" });
    }
  };

  const handleSubmitAnswers = async () => {
    if (!audit) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.keys(answers).forEach((qId) => {
      const ans = answers[qId];
      formData.append(`answers[${qId}][question_id]`, qId);
      formData.append(`answers[${qId}][choice]`, ans.choice);
      formData.append(`answers[${qId}][reponse]`, ans.reponse);
      formData.append(`answers[${qId}][date]`, ans.date);
      formData.append(`answers[${qId}][certificate_organisme]`, ans.certificate_organisme);
      formData.append(`answers[${qId}][certificate_customers_count]`, ans.certificate_customers_count);
      if (ans.attachment instanceof File) {
        formData.append(`answers[${qId}][attachment]`, ans.attachment);
      }    
    });
 
    try {
      const res = await axios.post(
        `https://alloaudit.com/api/answers/submit/${audit.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      setAudit((prev) => ({ ...prev, submitted: true, score: res.data.final_score }));
      window.dispatchEvent(new Event("auditSubmitted"));
      MySwal.fire({ title: "🎉 Submitted", text: "Audit sent to admin", icon: "success", timer: 1800, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      MySwal.fire({ title: "Error", text: "Unable to submit audit", icon: "error" });
    }
  };

  const totalPages = audit ? Math.ceil(audit.questions.length / QUESTIONS_PER_PAGE) : 1;
  const paginatedQuestions = audit
    ? audit.questions.slice((currentPage - 1) * QUESTIONS_PER_PAGE, currentPage * QUESTIONS_PER_PAGE)
    : [];

  if (loading) return <div className="text-center p-6">Loading…</div>;
  if (!audit) return <div className="text-center text-red-500 p-6">Audit not found.</div>;

  return (
    <div className="p-6 my-[-38px] bg-gray-100 ">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-700 hover:text-blue-900 mb-5">
        <ArrowLeft size={18} className="mr-1" /> Back
      </button>

      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6">{audit.title}</h2>

      <div className="space-y-6">
        {paginatedQuestions.map((q) => {
          const current = answers[q.id] || {};
          const disabled = audit.submitted;
          return (
            <div key={q.id} className="bg-white shadow rounded-lg p-5 border border-gray-300  hover:shadow-[10px_10px_15px_rgba(0,0,0,0.35)] transition-shadow duration-300">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">{q.text}</h3>
            {/* Dynamic form based on type */}
              {q.type === "questionsSimples" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  {/* <label className="block text-sm font-medium text-gray-600 mb-1">Answer</label> */}
                  <select
                    value={current.choice || ""}
                    disabled={disabled}
                    onChange={(e) => handleAnswerChange(q.id, "choice", e.target.value)}
                    className="w-full  rounded px-3 py-2 border-[2px] border-blue-100  focus:ring-1 focus:ring-blue-300 outline-none"
                  >
                    <option value="">-- Choice --</option>
                    <option value="Oui">Yes</option>
                    <option value="Non">No</option>
                    <option value="N/A">N/A</option>
                  </select>
                  <textarea
                    rows="2"
                    value={current.reponse || ""}
                    disabled={disabled}
                    onChange={(e) => handleAnswerChange(q.id, "reponse", e.target.value)}
                    className="w-full  rounded px-3 py-2 border-[2px] border-blue-100  focus:ring-1 focus:ring-blue-300 outline-none"
                    placeholder="Your justification"
                  />
                </div>
              )}

              {q.type === "questionsLibre" && (
                <textarea
                  rows="3"
                  value={current.reponse || ""}
                  disabled={disabled}
                  onChange={(e) => handleAnswerChange(q.id, "reponse", e.target.value)}
                  className="w-full  rounded px-3 py-2 border-[2px] border-blue-100  focus:ring-1 focus:ring-blue-300 outline-none"
                  placeholder="Your answer"
                />
              )}

              {q.type === "questionsOrganisme" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Organisme"
                    value={current.certificate_organisme || ""}
                    disabled={disabled}
                    onChange={(e) => handleAnswerChange(q.id, "certificate_organisme", e.target.value)}
                    className="w-full  rounded px-3 py-2 border-[2px] border-blue-100  focus:ring-1 focus:ring-blue-300 outline-none "
                  />
                  <input
                    type="text"
                    placeholder="Date"
                    value={current.date || ""}
                    disabled={disabled}
                    onChange={(e) => handleAnswerChange(q.id, "date", e.target.value)}
                    className="w-full  rounded px-3 py-2 border-[2px] border-blue-100  focus:ring-1 focus:ring-blue-300 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Number of customers"
                    value={current.certificate_customers_count || ""}
                    disabled={disabled}
                    onChange={(e) => handleAnswerChange(q.id, "certificate_customers_count", e.target.value)}
                    className="w-full  rounded px-3 py-2 border-[2px] border-blue-100  focus:ring-1 focus:ring-blue-300 outline-none"
                  />
                </div>
              )}

              {q.type === "questionsInfo" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 ">
                    <textarea
                    rows="2"
                    value={current.reponse || ""}
                    disabled={disabled}
                    onChange={(e) => handleAnswerChange(q.id, "reponse", e.target.value)}
                    className="w-full  rounded px-3 py-2 border-[2px] border-blue-100  focus:ring-1 focus:ring-blue-300 outline-none"
                    placeholder="Information"
                    />
                    <input
                        type="text"
                        placeholder="Date"
                        value={current.date || ""}
                        disabled={disabled}
                        onChange={(e) => handleAnswerChange(q.id, "date", e.target.value)}
                        className="w-full  rounded px-3 py-2 border-[2px] border-blue-100  focus:ring-1 focus:ring-blue-300 outline-none"
                    />
                </div>
                
              )}

            <div className="mb-3">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 border rounded-md bg-[#10B981] text-sm font-medium text-white cursor-pointer hover:bg-[#059669] transition-colors duration-200 ">
              <UploadCloud size={16} />
              <span >Choose a file</span>
              <input
                type="file"
                className="hidden"
                disabled={disabled}
                onChange={(e) => handleFileChange(q.id, e.target.files[0])}
              />
            </label>
              <div className="mt-2 space-y-1 ">
                {current.attachment && (
                  <>
                    <p className="text-sm text-green-500">
                      {typeof current.attachment === "string"
                        ? current.attachment.split('/').pop()
                        : current.attachment.name}
                    </p>

                    {typeof current.attachment === "string" && (
                      <a
                        href={`https://alloaudit.com/storage/${current.attachment}`}
                        target="_blank"
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                      >
                        View file
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>


            </div>
          );
        })}

        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >Prev</button>
          <span className="px-4 py-1">{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >Next</button>
        </div>

        {!audit.submitted && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={saveAllAnswers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
            >
              <Save size={18} className="mr-2" /> Save
            </button>
            <button
              onClick={handleSubmitAnswers}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Submit Audit
            </button>
          </div>
        )}

        {audit.submitted && (
          <div className="flex items-center text-red-500 mt-4">
            <Lock size={18} className="mr-2" /> Audit submitted — Locked
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAuditDetail;
