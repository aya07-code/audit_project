import React from "react";
import Swal from "sweetalert2";

const showContactMessage = (notif) => {
  Swal.fire({
    title: notif.name,
    html: `
      <div style="text-align: left; font-size: 15px; color: #212345;">

        ${
          notif.company_name
            ? `<p style="margin-bottom: 8px;">
                <strong style="color: #1E3A8A;">Company:</strong> 
                <span style="color: #6B7280;">${notif.company_name}</span>
              </p>`
            : ""
        }

        ${
          notif.phone
            ? `<p style="margin-bottom: 8px;">
                <strong style="color: #1E3A8A;">Phone:</strong> 
                <span style="color: #6B7280;">${notif.phone}</span>
              </p>`
            : ""
        }

        <p style="margin-bottom: 8px;">
          <strong style="color: #1E3A8A;">Email:</strong> 
          <span style="color: #6B7280;">${notif.email}</span>
        </p>

        <p style="margin-bottom: 6px; color: #1E3A8A;">
          <strong>Message:</strong>
        </p>

        <div style="
          border: 1px solid #E5E7EB;
          padding: 12px;
          background: #F3F4F6;
          color: #212345;
          border-radius: 10px;
          line-height: 1.5;
        ">
          ${notif.text}
        </div>

      </div>
    `,
    confirmButtonText: "Close",
    width: "520px",

    background: "#FFFFFF",
    color: "#212345",

    confirmButtonColor: "#1E3A8A",
    buttonsStyling: true,

    customClass: {
      popup: "rounded-2xl shadow-lg",
    },
  });
};

export default showContactMessage;
