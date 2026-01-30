import React, { useEffect, useState } from "react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { UploadCloud, Eye } from "lucide-react"; 
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const PaymentTableCustomer = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [attachment, setAttachment] = useState(null);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get("https://alloaudit.com/api/customer/payments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPayments(res.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const handlePay = (paymentId) => {
    setSelectedPaymentId(paymentId); // Affiche le div pour ce paiement
    setPaymentMethod(""); // reset
    setAttachment(null);
  };

  const handleSubmitPayment = async () => {
    if (!paymentMethod) {
      MySwal.fire({
        icon: "warning",
        title: "Sélection manquante",
        text: "Veuillez sélectionner un mode de paiement",
      });
      return;
    }

  setPayments((prev) =>
    prev.map((p) =>
      p.id === selectedPaymentId ? { ...p, status: "sending" } : p
    )
  );

    const formData = new FormData();
    formData.append("method", paymentMethod);
    if (attachment) formData.append("attachment", attachment);

    setLoading(true);
    try {
      await axios.post(
        `https://alloaudit.com/api/customer/payments/${selectedPaymentId}/pay`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      MySwal.fire({
        icon: "success",
        title: "Paiement réussi",
        text: "Paiement enregistré avec succès !",
      });

      setSelectedPaymentId(null);
      setPaymentMethod("");
      setAttachment(null);
    } catch (error) {
      console.error("Error submitting payment:", error);
      MySwal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors du paiement.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white shadow-md rounded-lg my-8">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6 flex items-center gap-2">
        <FaMoneyCheckAlt className="text-[#10B981]" /> Payments
      </h2>

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-50 text-blue-900 uppercase text-left">
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <React.Fragment key={payment.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="p-3 font-medium">{payment.amount} MAD</td>
                    <td className="p-3 capitalize">
                      {payment.status === "paid" ? (
                        <span className="text-green-600 font-bold">Paid</span>
                      ) : (
                        <span className="text-red-600 font-semibold">{payment.status}</span>
                      )}
                    </td>
                    <td className="p-3">{payment.due_date}</td>
                    <td className="p-3">
                      {payment.status === "sending" ? (
                        <span className="text-orange-600 font-bold">Sending...</span>
                      ) : payment.is_paid ? (
                        <span className="text-green-600 font-bold">Paid</span>
                      ) : (
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md shadow-sm disabled:opacity-50"
                          onClick={() => handlePay(payment.id)}>Pay Now</button>
                      )}
                    </td>
                  </tr>

                  {selectedPaymentId === payment.id && (

                    <tr>
                      <td colSpan={4} className="p-0">
                        <div className="p-4 bg-gray-50 rounded-lg mt-2 flex flex-col gap-4">

                          {/* --- Choix du mode de paiement --- */}
                          <div>
                            <label className="font-semibold">Choose your payment method :</label>
                            <div className="flex gap-4 mt-2">
                              <label>
                                <input
                                  type="radio"
                                  name="method"
                                  value="Carte"
                                  checked={paymentMethod === "Carte"}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                />{" "}
                                Payment by Card
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="method"
                                  value="Espèces"
                                  checked={paymentMethod === "Espèces"}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                />{" "}
                                Cash payment
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="method"
                                  value="Chèque"
                                  checked={paymentMethod === "Chèque"}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                />{" "}
                                Payment by Check
                              </label>
                            </div>
                          </div>

                          {/* --- Upload bouton stylé --- */}
                          <div>
                            <label className="font-semibold mb-2 block">Attach supporting documentation (optional):</label>
                            <div className="flex items-center gap-2">
                              <label className="inline-flex items-center px-3 py-1 border rounded-lg bg-green-600 text-white cursor-pointer hover:bg-green-700">
                                <UploadCloud size={18} />
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="hidden"
                                  onChange={(e) => setAttachment(e.target.files[0])}
                                />
                              </label>
                              {attachment && (
                                <a
                                  href={URL.createObjectURL(attachment)}
                                  target="_blank"
                                  className="inline-flex items-center px-2 py-1 border rounded-lg bg-blue-600 text-white"
                                  title="View file"
                                >
                                  <Eye size={18} />
                                </a>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={handleSubmitPayment}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-2"
                            disabled={loading}
                          >
                            {loading ? "Sending..." : "Validate payment"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentTableCustomer;
