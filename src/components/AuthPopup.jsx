import { X, GraduationCap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function AuthPopup({
  isOpen,
  onClose,
  isAuthenticated,
}) {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Auto-close if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className={`w-[95%] max-w-md rounded-xl shadow-lg ${isDarkMode ? "bg-gray-900" : "bg-white"
          } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2
            className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Welcome Back
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${isDarkMode
              ? "hover:bg-gray-800 text-gray-400"
              : "hover:bg-gray-100 text-gray-500"
              }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p
            className={`text-sm mb-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"
              } font-medium`}
          >
            Sign in to explore more features.
          </p>

          <div className="space-y-3">
            {/* Alumni Login */}
            <button
              onClick={() => {
                navigate("/login-alumni");
                onClose();
              }}
              className={`w-full p-4 rounded-lg border transition-all duration-200 ${isDarkMode
                ? "border-blue-600 hover:border-blue-500 bg-blue-900/20 hover:bg-blue-900/30"
                : "border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-600" : "bg-blue-500"
                    }`}
                >
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3
                    className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    Alumni Login
                  </h3>
                  <p
                    className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    For registered alumni members
                  </p>
                </div>
              </div>
            </button>

            {/* Student Login */}
            <button
              onClick={() => {
                navigate("/login");
                onClose();
              }}
              className={`w-full p-4 rounded-lg border transition-all duration-200 ${isDarkMode
                ? "border-green-600 hover:border-green-500 bg-green-900/20 hover:bg-green-900/30"
                : "border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${isDarkMode ? "bg-green-600" : "bg-green-500"
                    }`}
                >
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3
                    className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    Student Login
                  </h3>
                  <p
                    className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    For current or prospective students
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <p
                className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Don't have an account?{" "}
                <button className="text-blue-500 hover:text-blue-600 font-medium">
                  Sign up
                </button>
              </p>
              <button
                onClick={onClose}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${isDarkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
