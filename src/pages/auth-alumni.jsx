import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
  Moon,
  Sun,
  ArrowRight,
  Award,
  BookOpen,
  Trophy,
  Users,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function AlumniAuth({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
        setError("");
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccessMessage("");
    setShowMessage(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const closeMessage = () => {
    setShowMessage(false);
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setShowMessage(false);

    try {
      const endpoint = isLogin
        ? "http://localhost:3001/auth/login-alumni"
        : "http://localhost:3001/auth/register-alumni";

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (isLogin) {
        // Login successful - use acessToken instead of token
        if (!data.accessToken) {
          console.error("Missing accessToken in response:", data);
          throw new Error(
            "Invalid response from server - missing authentication token"
          );
        }

        const userData = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || data.accessToken,
          userName: data.user?.name || formData.name,
          userEmail: data.user?.email || formData.email,
          userPhone: data.user?.phone || formData.phone || "",
          userId: data.user?.id?.toString() || "",
          userType: "alumni",
          expiry: Date.now() + 1000 * 60 * 15,
        };

        console.log("Storing auth data:", userData);
        localStorage.setItem("auth", JSON.stringify(userData));

        setSuccessMessage("Login successful! Redirecting...");
        setShowMessage(true);

        // Navigate to home page after successful login
        setTimeout(() => {
          setIsAuthenticated(true);
          navigate("/");
        }, 1500);
      } else {
        // Registration successful
        setSuccessMessage(
          "Registration successful! Your account is under verification. You can now login."
        );
        setShowMessage(true);

        // Swap to login form after successful registration
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
          });
        }, 2000);
      }
    } catch (err) {
      // Proper error handling
      if (err instanceof Error) {
        setError(err.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      }`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-blob"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl animate-blob"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 ${
          isDarkMode
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

      {/* Student Login Button */}
      <button
        onClick={() => navigate("/login")}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 ${
          isDarkMode
            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        }`}
      >
        <span className="text-sm font-semibold">Student Login</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Verification Status Message - Bottom Left */}

      {/* Message Toast */}
      {(error || successMessage) && showMessage && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl backdrop-blur-xl border shadow-2xl transition-all duration-300 ${
            error
              ? isDarkMode
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-red-100 border-red-200 text-red-700"
              : isDarkMode
              ? "bg-green-500/10 border-green-500/20 text-green-300"
              : "bg-green-100 border-green-200 text-green-700"
          }`}
        >
          {error ? (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {error ? "Authentication Error" : "Success"}
            </p>
            <p className="text-xs opacity-80 truncate">
              {error || successMessage}
            </p>
          </div>
          <button
            onClick={closeMessage}
            className={`p-1 rounded-lg transition-colors ${
              error
                ? isDarkMode
                  ? "hover:bg-red-500/20"
                  : "hover:bg-red-200"
                : isDarkMode
                ? "hover:bg-green-500/20"
                : "hover:bg-green-200"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center gap-3 justify-center mb-4">
              <div
                className={`w-12 h-12 rounded-xl p-2 ${
                  isDarkMode
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
                  className={`text-2xl font-black ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  MITS ALUMNI
                </h1>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  Alumni Portal
                </p>
              </div>
            </div>

            <h2
              className={`text-3xl font-bold leading-tight mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome Back,
              <br />
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Distinguished Alumni
              </span>
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Reconnect with your alma mater
            </p>
          </div>

          {/* Desktop & Mobile Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Desktop Only */}
            <div className="hidden lg:block space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl p-3 ${
                      isDarkMode
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
                      className={`text-3xl font-black ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      MITS ALUMNI
                    </h1>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      Alumni Portal
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2
                    className={`text-5xl font-bold leading-tight ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Welcome Back,
                    <br />
                    <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                      Distinguished Alumni
                    </span>
                  </h2>
                  <p
                    className={`text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Reconnect with your alma mater and guide the next generation
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Trophy,
                    title: "Exclusive Network",
                    desc: "Connect with successful MITS graduates worldwide",
                  },
                  {
                    icon: Users,
                    title: "Mentor Students",
                    desc: "Share your experience and guide current students",
                  },
                  {
                    icon: BookOpen,
                    title: "Career Opportunities",
                    desc: "Access exclusive job postings and networking events",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm transition-all hover:translate-x-2 ${
                      isDarkMode
                        ? "bg-white/5 border border-white/10"
                        : "bg-white/60 border border-purple-200"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
                      }`}
                    >
                      <item.icon
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-sm ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div
                className={`rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl border ${
                  isDarkMode
                    ? "bg-slate-900/80 border-slate-700/50"
                    : "bg-white/90 border-purple-200"
                }`}
              >
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                      isDarkMode
                        ? "bg-purple-500/10 border border-purple-500/20"
                        : "bg-purple-50 border border-purple-200"
                    }`}
                  >
                    <Award
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {isLogin ? "Alumni Login" : "Alumni Registration"}
                    </span>
                  </div>
                  <h2
                    className={`text-3xl font-bold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {isLogin ? "Sign In" : "Join Network"}
                  </h2>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {isLogin
                      ? "Access your alumni account"
                      : "Create your alumni account"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl outline-none transition ${
                            isDarkMode
                              ? "bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                              : "bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                          }`}
                          placeholder="John Doe"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl outline-none transition ${
                          isDarkMode
                            ? "bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                            : "bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                        }`}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone
                          className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl outline-none transition ${
                            isDarkMode
                              ? "bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                              : "bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                          }`}
                          placeholder="+91 1234567890"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-12 py-3 rounded-xl outline-none transition ${
                          isDarkMode
                            ? "bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                            : "bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                          isDarkMode
                            ? "text-gray-500 hover:text-gray-300"
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

                  {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                        />
                        <span
                          className={`ml-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Remember me
                        </span>
                      </label>
                      <button
                        type="button"
                        className={`font-medium ${
                          isDarkMode
                            ? "text-purple-400 hover:text-purple-300"
                            : "text-purple-600 hover:text-purple-700"
                        }`}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    } shadow-xl hover:shadow-2xl hover:scale-[1.02]`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        {isLogin ? "Signing In..." : "Creating Account..."}
                      </span>
                    ) : isLogin ? (
                      "Sign In to Alumni Network"
                    ) : (
                      "Join Alumni Network"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {isLogin
                      ? "Don't have an alumni account? "
                      : "Already have an alumni account? "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError("");
                        setSuccessMessage("");
                        setShowMessage(false);
                        setFormData({
                          name: "",
                          email: "",
                          password: "",
                          phone: "",
                        });
                      }}
                      className={`font-semibold ${
                        isDarkMode
                          ? "text-purple-400 hover:text-purple-300"
                          : "text-purple-600 hover:text-purple-700"
                      }`}
                    >
                      {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
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
