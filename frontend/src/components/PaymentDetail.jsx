import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const PaymentDetail = () => {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`https://alloaudit.com/api/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setPayment(res.data.data))
      .catch((err) => console.error(err));
  }, [paymentId]);

  const handleValidatePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://alloaudit.com/api/admin/payments/${payment.id}/validate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Met à jour localement
      setPayment({ ...payment, status: "validated" });
    } catch (error) {
      console.error(error);
    }
  };

  if (!payment) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl -mt-10">
      <button
        className="flex items-center gap-2 mb-4 text-blue-700 hover:text-black"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className="text-2xl font-bold mb-4 text-blue-800">Payment Details</h2>

      <div className="border rounded-lg p-4 mx-4 bg-white shadow">
        {payment.client?.company && (
          <p><strong className=" text-blue-900">Business:</strong> {payment.client.company.name}</p>
        )}
        <p><strong className=" text-blue-900">Amount:</strong> {payment.amount} MAD</p>
        <p><strong className=" text-blue-900">Method:</strong> {payment.method}</p>
        <p><strong className=" text-blue-900">Status:</strong> {payment.status}</p>
        <p><strong className=" text-blue-900">Date:</strong> {payment.due_date}</p>
        {payment.client && (
          <p><strong className=" text-blue-900">Customer:</strong> {payment.client.name}</p>
        )}
        <p><strong className=" text-blue-900">Audit:</strong> {payment.audit.title}</p>
        <p><strong className=" text-blue-900">Attachment: </strong>{payment.attachment && (
                <a
                  href= {`https://alloaudit.com/storage/${payment.attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 "
                >
                  📎View Attachment
                </a> 
          )}
        </p>

        {payment.status === "sending" && (
          <button 
          className="bg-blue-600 text-white px-2 py-1 rounded mr-2 font-bold mt-4"
          onClick={handleValidatePayment}>Validate Payment</button>
        )}

        {payment.status === "validated" && (
          <span className=" text-green-600 font-bold mt-4 py-3">Payment Validated</span>
        )}

      </div>
    </div>
  );
};

export default PaymentDetail;
