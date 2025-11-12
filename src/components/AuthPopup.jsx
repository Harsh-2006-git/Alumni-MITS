import { X, GraduationCap, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AuthPopup({
  isOpen,
  onClose,
  isDarkMode,
  isAuthenticated,
}) {
  const navigate = useNavigate();

  // Auto-close if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-50">
      <div
        className={`w-[95%] max-w-md rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-blue-900/80 to-purple-900/80 border border-blue-500/20"
            : "bg-gradient-to-br from-white via-blue-50/80 to-purple-50/80 border border-blue-200/50"
        }`}
        style={{
          animation: "slideInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Header with gradient */}
        <div
          className={`relative p-6 text-center border-b ${
            isDarkMode
              ? "border-blue-500/20 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
              : "border-blue-200/50 bg-gradient-to-r from-blue-100 to-purple-100"
          }`}
        >
          <div className="absolute top-3 right-3">
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                isDarkMode
                  ? "bg-gray-800/80 hover:bg-gray-700 text-white"
                  : "bg-white/80 hover:bg-gray-100 text-gray-700"
              } shadow-lg backdrop-blur-sm`}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2
              className={`text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent`}
            >
              Welcome Back!
            </h2>
          </div>

          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Sign in to access exclusive features and connect with the community
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Alumni Card */}
            <button
              onClick={() => {
                navigate("/login-alumni");
                onClose();
              }}
              className={`group relative w-full p-5 rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden ${
                isDarkMode
                  ? "border-blue-500/30 hover:border-blue-400 bg-gradient-to-br from-blue-900/30 to-purple-900/30"
                  : "border-blue-200 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50"
              }`}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/10 to-purple-500/10`}
              ></div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3
                    className={`font-bold text-lg mb-1 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Alumni Login
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    For registered alumni members
                  </p>
                </div>
              </div>

              {/* Hover effect line */}
              <div
                className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500`}
              ></div>
            </button>

            {/* Student Card */}
            <button
              onClick={() => {
                navigate("/login");
                onClose();
              }}
              className={`group relative w-full p-5 rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden ${
                isDarkMode
                  ? "border-green-500/30 hover:border-green-400 bg-gradient-to-br from-green-900/30 to-emerald-900/30"
                  : "border-green-200 hover:border-green-300 bg-gradient-to-br from-green-50 to-emerald-50"
              }`}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-green-500/10 to-emerald-500/10`}
              ></div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3
                    className={`font-bold text-lg mb-1 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Student Login
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    For current or prospective students
                  </p>
                </div>
              </div>

              {/* Hover effect line */}
              <div
                className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-500`}
              ></div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <div className="flex justify-between items-center">
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Don't have an account?{" "}
                <span className="text-blue-400">Sign up</span>
              </p>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                isDarkMode ? "bg-blue-400/30" : "bg-blue-400/20"
              }`}
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
                animation: `float 3s ease-in-out ${
                  i * 0.5
                }s infinite alternate`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>
        {`
          @keyframes slideInUp {
            0% {
              transform: translateY(50px) scale(0.9);
              opacity: 0;
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
          
          @keyframes float {
            0% {
              transform: translateY(0px) translateX(0px);
            }
            50% {
              transform: translateY(-10px) translateX(5px);
            }
            100% {
              transform: translateY(0px) translateX(0px);
            }
          }
          
          .backdrop-blur-xl {
            backdrop-filter: blur(24px);
          }
        `}
      </style>
    </div>
  );
}
