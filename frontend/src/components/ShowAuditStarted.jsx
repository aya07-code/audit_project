import Swal from "sweetalert2";

const showAuditStarted = (notif) => {
  Swal.fire({
    title: "Audit Started",
    html: `
      <div style="text-align:left; font-size:15px; color:#212345;">
        <p style="margin-bottom:6px; color:#1E3A8A;"><strong>Information:</strong></p>

        <div style="
            border:1px solid #E5E7EB;
            padding:12px;
            background:#F3F4F6;
            color:#212345;
            border-radius:10px;
            line-height:1.5;
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

export default showAuditStarted;
