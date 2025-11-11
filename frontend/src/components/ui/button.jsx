export const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 ${className || ""}`}
  >
    {children}
  </button>
);
