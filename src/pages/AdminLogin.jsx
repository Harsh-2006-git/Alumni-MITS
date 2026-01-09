import {
  Shield,
  AlertCircle,
  Lock,
  Moon,
  Sun,
  Github,
  Linkedin,
  Twitter,
  Eye,
  EyeOff,
  UserCog,
  Activity,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const API_URL = `${BASE_URL}/auth`;

export default function AdminLoginPage({
  setIsAuthenticated,
}) {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    // Check if already authenticated
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    if (auth.accessToken && auth.userType === "admin") {
      setIsAuthenticated(true);
      navigate("/admin");
      return;
    }

    // Handle Google OAuth Callback
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userName = params.get("userName");
    const userEmail = params.get("userEmail");
    const loginSuccess = params.get("loginSuccess");
    const oauthError = params.get("error");

    if (oauthError) {
      if (oauthError === "unauthorized_faculty_domain") {
        setError("Access Denied: Admin portal access is restricted to official MITS Faculty/Staff using @mitsgwalior.in email addresses.");
      } else {
        setError("Authentication Failed: Please ensure you are using your official @mitsgwalior.in Google account to sign in.");
      }
      // Clean up URL and stay on the login page
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (loginSuccess === "true" && accessToken) {
      const userData = {
        accessToken,
        refreshToken,
        userName: decodeURIComponent(userName || ""),
        userEmail,
        userType: "admin",
        loginTime: new Date().toISOString(),
        expiry: Date.now() + 1000 * 60 * 30, // 30 minutes
      };

      console.log("✅ Admin Google Login Successful");
      localStorage.setItem("auth", JSON.stringify(userData));
      setIsAuthenticated(true);
      navigate("/admin");
    }
  }, [setIsAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store auth data in localStorage
      const userData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userName: data.admin.name,
        userEmail: data.admin.email,
        username: data.admin.username,
        userType: "admin",
        loginTime: data.admin.loginTime,
        expiry: Date.now() + 1000 * 60 * 30, // 30 minutes
      };

      console.log("✅ Admin Login Successful");
      localStorage.setItem("auth", JSON.stringify(userData));
      setIsAuthenticated(true);
      navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
        }`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 ${isDarkMode
          ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
          : "bg-white hover:bg-gray-50 text-blue-600 border border-blue-200"
          }`}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          {/* Mobile Header - Only on small screens */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center gap-3 justify-center mb-4">
              <div
                className={`w-12 h-12 rounded-xl p-2 ${isDarkMode
                  ? "bg-white/10 backdrop-blur-sm"
                  : "bg-white shadow-xl"
                  }`}
              >
                <img
                  src="/assets/images/mits-logo.png"
                  alt="MITS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1
                  className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  MITS ALUMNI
                </h1>
                <p
                  className={`text-xs ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                >
                  Admin Portal
                </p>
              </div>
            </div>

            <h2
              className={`text-3xl font-bold leading-tight mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Welcome Back,
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Administrator
              </span>
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Manage your alumni network
            </p>
          </div>

          {/* Desktop & Mobile Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Desktop Only */}
            <div className="hidden lg:block space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl p-3 ${isDarkMode
                      ? "bg-white/10 backdrop-blur-sm"
                      : "bg-white shadow-xl"
                      }`}
                  >
                    <img
                      src="/assets/images/mits-logo.png"
                      alt="MITS Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h1
                      className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      MITS ALUMNI
                    </h1>
                    <p
                      className={`text-sm ${isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                    >
                      Admin Portal
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2
                    className={`text-5xl font-bold leading-tight ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    Welcome Back,
                    <br />
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Administrator
                    </span>
                  </h2>
                  <p
                    className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                  >
                    Manage and oversee your thriving alumni community of 5000+
                    members
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[

                  {
                    icon: Activity,
                    title: "Real-time Monitoring",
                    desc: "Track alumni activities and engagement metrics",
                  },
                  {
                    icon: BarChart3,
                    title: "Analytics Dashboard",
                    desc: "Comprehensive insights and reporting tools",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm transition-all hover:translate-x-2 ${isDarkMode
                      ? "bg-white/5 border border-white/10"
                      : "bg-white/60 border border-blue-200"
                      }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                        }`}
                    >
                      <item.icon
                        className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>



              {/* Developer Credit - Desktop Only */}
              <div
                className={`mt-8 rounded-2xl p-6 backdrop-blur-xl border transition-all hover:scale-[1.02] ${isDarkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white/60 border-blue-200"
                  }`}
              >
                <div className="flex items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
                    <img
                      src="/assets/images/harsh.png"
                      alt="Harsh Manmode"
                      className="w-20 h-23 rounded-full border-2 border-blue-500 relative z-10"
                    />
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold tracking-wider mb-1 ${isDarkMode ? "text-gray-500" : "text-blue-600/60"
                        }`}
                    >
                      DEVELOPED BY
                    </p>
                    <h3
                      className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      Harsh Manmode
                    </h3>
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Information Technology, II Year
                    </p>
                    <div className="flex gap-3 mt-3">
                      {[
                        {
                          icon: Github,
                          href: "https://github.com/Harsh-2006-git",
                        },
                        {
                          icon: Linkedin,
                          href: "https://www.linkedin.com/in/harsh-manmode-2a0b91325/",
                        },
                        {
                          icon: Twitter,
                          href: "https://www.linkedin.com/in/harsh-manmode-2a0b91325/",
                        },
                      ].map((social, idx) => (
                        <a
                          key={idx}
                          href={social.href}
                          className={`p-2 rounded-lg transition-all hover:scale-110 ${isDarkMode
                            ? "bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white"
                            : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                            }`}
                        >
                          <social.icon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div
                className={`rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl border ${isDarkMode
                  ? "bg-slate-900/80 border-slate-700/50"
                  : "bg-white/90 border-blue-200"
                  }`}
              >
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isDarkMode
                      ? "bg-purple-500/10 border border-purple-500/20"
                      : "bg-purple-50 border border-purple-200"
                      }`}
                  >
                    <UserCog
                      className={`w-4 h-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                    />
                    <span
                      className={`text-xs font-medium ${isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                    >
                      Administrator Access
                    </span>
                  </div>
                  <h2
                    className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    Admin Sign In
                  </h2>
                  <p
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Enter your credentials to access the admin panel
                  </p>
                </div>

                {error && (
                  <div
                    className={`mb-6 p-4 rounded-xl border-l-4 border-red-500 ${isDarkMode ? "bg-red-900/20" : "bg-red-50"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3
                          className={`font-semibold text-sm mb-1 ${isDarkMode ? "text-red-400" : "text-red-800"
                            }`}
                        >
                          Authentication Error
                        </h3>
                        <p
                          className={`text-xs ${isDarkMode ? "text-red-300" : "text-red-700"
                            }`}
                        >
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Google Login Button */}
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${isDarkMode
                      ? "bg-blue-500/5 border-blue-500/20 text-blue-400"
                      : "bg-blue-50 border-blue-100 text-blue-700"
                      }`}>
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <p className="font-bold mb-1">Faculty & Staff Login</p>
                        <p className="opacity-80">Please use your official <span className="font-semibold underline">@mitsgwalior.in</span> email </p>
                      </div>
                    </div>

                    <button
                      onClick={() => window.location.href = `${BASE_URL}/auth/google-admin`}
                      className={`w-full rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all duration-300 font-semibold text-sm border group ${isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-750"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-blue-300"
                        } shadow-sm hover:shadow-md hover:scale-[1.01]`}
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                      <span>Faculty Google Login</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className={`px-2 ${isDarkMode ? "bg-slate-900 text-gray-500" : "bg-white text-gray-500"}`}>Or continue with Username</span>
                    </div>
                  </div>

                  {/* Username Field */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      Username
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        value={credentials.username}
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            username: e.target.value,
                          })
                        }
                        placeholder="Username"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:ring-blue-500/50"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500"
                          }`}
                        required
                      />
                      <UserCog
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${credentials.username.includes("@mitsgwalior.in")
                          ? "text-emerald-500"
                          : isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                      />

                      {/* Domain Suggestion Box */}
                      {credentials.username &&
                        !credentials.username.includes("@") && (
                          <div className={`absolute left-0 right-0 top-full mt-2 z-20 p-2 rounded-xl shadow-2xl border animate-in fade-in slide-in-from-top-2 duration-200 ${isDarkMode
                            ? "bg-slate-900 border-slate-700"
                            : "bg-white border-gray-100"
                            }`}>
                            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}>Quick Suggestion</p>
                            <button
                              type="button"
                              onClick={() => setCredentials({
                                ...credentials,
                                username: `${credentials.username}@mitsgwalior.in`
                              })}
                              className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all ${isDarkMode
                                ? "hover:bg-blue-500/10 text-blue-400"
                                : "hover:bg-blue-50 text-blue-600"
                                }`}
                            >
                              <span className="text-sm font-medium">Add @mitsgwalior.in</span>
                              <Shield className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            password: e.target.value,
                          })
                        }
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:ring-blue-500/50"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500"
                          }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDarkMode
                          ? "text-gray-500 hover:text-gray-400"
                          : "text-gray-400 hover:text-gray-600"
                          }`}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={`w-full rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed group ${isDarkMode
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      } shadow-xl hover:shadow-2xl hover:scale-[1.02]`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>Sign In to Admin Panel</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
}
