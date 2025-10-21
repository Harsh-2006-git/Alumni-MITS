import { useNavigate } from "react-router-dom";
export default function Footer({ isDarkMode }) {
  const navigate = useNavigate();
  return (
    <footer
      className={`${isDarkMode ? "bg-gray-900" : "bg-white"} border-t ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      }`}
    >
      <div className="container mx-auto px-6 py-8">
        {/* Copyright Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/assets/images/mits-logo.png"
              alt="MITS Logo"
              className="w-8 h-8 object-contain"
            />
            <h3
              className={`text-lg font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              MITS Alumni
            </h3>
          </div>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            © 2025 MITS Alumni Network. All rights reserved. | Developed by{" "}
            <a
              onClick={() => navigate("/developer")}
              className="font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent cursor-pointer hover:underline"
            >
              Harsh Manmode
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
