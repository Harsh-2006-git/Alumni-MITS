import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  Sun,
  ArrowRight,
  Award,
  BookOpen,
  Trophy,
  Users,
  X,
  CheckCircle,
  MapPin,
  Link,
  Calendar,
} from "lucide-react";
import ForgotPasswordPopup from "../components/ForgotPasswordPopup";
import VerificationPendingPopup from "../components/VerificationPendingPopup";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";
import { cityCoordinates } from "../data/cities";
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/auth`
  : "http://localhost:3001/auth";

export default function AlumniAuth({
  setIsAuthenticated,
  isDarkMode,
  toggleTheme,
}) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleVerified, setGoogleVerified] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [tempAuthToken, setTempAuthToken] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [currentYearRange, setCurrentYearRange] = useState(
    Math.floor(new Date().getFullYear() / 12) * 12
  );
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [regStep, setRegStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    branch: "",
    batchYear: "",
    location: "",
    linkedinUrl: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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

  // Handle Google OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userName = params.get("name");
    const userEmail = params.get("email");
    const userId = params.get("id");
    const errorType = params.get("error");

    if (errorType) {
      setLoading(false);
      switch (errorType) {
        case "alumni_not_registered":
          setError(
            "This email is not registered as an alumni. Please register first."
          );
          break;
        case "alumni_not_verified":
          setError(
            "Your account is under verification. Please wait for approval."
          );
          break;
        case "unauthorized":
          setError("Authentication failed. Please try again.");
          break;
        case "email_exists":
          setError("This email is already registered. Please login instead.");
          break;
        default:
          setError("An error occurred during login. Please try again.");
      }
      setShowMessage(true);
      window.history.replaceState({}, "", "/auth-alumni");
      return;
    }

    if (accessToken && refreshToken) {
      const userProfilePhoto = params.get("profilePhoto");

      console.log("✅ OAuth Success - Tokens received:", { accessToken, refreshToken, userName, userEmail, userId });

      const userData = {
        accessToken,
        refreshToken,
        userName: decodeURIComponent(userName || ""),
        userEmail: userEmail || "",
        userId: userId || "",
        userType: "alumni",
        user: {
          id: userId || "",
          name: decodeURIComponent(userName || ""),
          email: userEmail || "",
          userType: "alumni",
          phone: params.get("phone") || "",
          profilePhoto: userProfilePhoto ? decodeURIComponent(userProfilePhoto) : null,
        },
        phone: params.get("phone") || "",
        expiry: Date.now() + 1000 * 60 * 60,
      };

      console.log("💾 Storing auth data in localStorage:", userData);
      localStorage.setItem("auth", JSON.stringify(userData));

      // Verify it was stored
      const stored = localStorage.getItem("auth");
      console.log("✅ Verified localStorage:", stored ? "Data saved successfully" : "❌ Failed to save");

      setSuccessMessage("Login successful! Redirecting...");
      setShowMessage(true);
      setLoading(false);

      // Wait a bit to ensure localStorage is fully written
      setTimeout(() => {
        console.log("🔄 Setting authentication and navigating...");
        setIsAuthenticated(true);
        navigate("/");
      }, 500);

      window.history.replaceState({}, "", "/auth-alumni");
    }
  }, [setIsAuthenticated, navigate]);

  // Handle Google OAuth registration callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const registerWithGoogle = params.get("register");
    const googleEmail = params.get("googleEmail");
    const googleName = params.get("googleName");

    if (registerWithGoogle === "true" && googleEmail && googleName) {
      const decodedEmail = decodeURIComponent(googleEmail);

      // Block college emails
      if (decodedEmail.toLowerCase().endsWith("@mitsgwl.ac.in")) {
        setError("College email (@mitsgwl.ac.in) is not allowed for alumni registration. Please use your personal email.");
        setShowMessage(true);
        setIsLogin(false);
        window.history.replaceState({}, "", "/auth-alumni");
        return;
      }

      // Pre-fill the registration form with Google data
      setFormData(prev => ({
        ...prev,
        email: decodedEmail,
        name: decodeURIComponent(googleName),
      }));
      setGoogleVerified(true);
      setIsLogin(false); // Switch to registration form
      setSuccessMessage("Email verified with Google! Please complete your registration.");
      setShowMessage(true);

      // Clean up URL
      window.history.replaceState({}, "", "/auth-alumni");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for batch year input
    if (name === "batchYear") {
      let formattedValue = value.replace(/\D/g, ""); // Remove non-digits

      // Auto-insert dash after 4 digits
      if (formattedValue.length > 4) {
        formattedValue =
          formattedValue.slice(0, 4) + "-" + formattedValue.slice(4, 8);
      }

      // Limit to 9 characters (YYYY-YYYY)
      if (formattedValue.length <= 9) {
        setFormData({ ...formData, [name]: formattedValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setError("");
    setSuccessMessage("");
    setShowMessage(false);
  };

  const closeMessage = () => {
    setShowMessage(false);
    setError("");
    setSuccessMessage("");
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (regStep === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        setError("Please fill all required fields");
        setShowMessage(true);
        return;
      }
      setRegStep(2);
    } else if (regStep === 2) {
      if (!formData.branch || !formData.batchYear) {
        setError("Please fill all required fields");
        setShowMessage(true);
        return;
      }
      setRegStep(3);
    }
  };

  const handlePrevStep = () => {
    setRegStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (regStep < 3) {
      handleNextStep(e);
      return;
    }
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Validate email for alumni registration
    if (!isLogin && formData.email.toLowerCase().endsWith("@mitsgwl.ac.in")) {
      setError("College email (@mitsgwl.ac.in) is not allowed for alumni registration. Please use your personal email.");
      setShowMessage(true);
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin
        ? `${BASE_URL}/login-alumni`
        : `${BASE_URL}/register-alumni`;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      console.log("Sending payload:", payload);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        // Handle specific error messages
        if (data.message?.includes("Email already exists") || data.message?.includes("email already exists")) {
          throw new Error("This email is already registered. Please use a different email or try logging in.");
        } else if (data.message?.includes("Phone") && data.message?.includes("already exists")) {
          throw new Error("This phone number is already registered. Please use a different phone number.");
        } else {
          throw new Error(data.message || "Authentication failed");
        }
      }

      if (isLogin) {
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
          expiry: Date.now() + 1000 * 60 * 60,
        };

        console.log("Storing auth data:", userData);
        localStorage.setItem("auth", JSON.stringify(userData));

        setSuccessMessage("Login successful! Redirecting...");
        setShowMessage(true);

        setTimeout(() => {
          setIsAuthenticated(true);
          navigate("/");
        }, 100);
      } else {
        // Registration Successful - Show verification pending popup
        setShowVerificationPopup(true);
      }
    } catch (err) {
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

  const handleGoogleLogin = () => {
    setError("");
    setLoading(true);
    window.location.href = `${BASE_URL}/google-alumni`;
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



      {/* Message Toast */}
      {(error || successMessage) && showMessage && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl backdrop-blur-xl border shadow-2xl transition-all duration-300 ${error
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
            className={`p-1 rounded-lg transition-colors ${error
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
                  className={`text-xs ${isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                >
                  Alumni Portal
                </p>
              </div>
            </div>

            <h2
              className={`text-3xl font-bold leading-tight mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Welcome Back,
              <br />
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                Distinguished Alumni
              </span>
            </h2>
            <p
              className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              Reconnect with your alma mater
            </p>
          </div>

          {/* Desktop & Mobile Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Desktop Only */}
            {isLogin ? (
              // Login - Full left side content
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
                        className={`text-sm ${isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                      >
                        Alumni Portal
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
                      <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                        Distinguished Alumni
                      </span>
                    </h2>
                    <p
                      className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                      Reconnect with your alma mater and guide the next
                      generation
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
                      className={`flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm transition-all hover:translate-x-2 ${isDarkMode
                        ? "bg-white/5 border border-white/10"
                        : "bg-white/60 border border-purple-200"
                        }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
                          }`}
                      >
                        <item.icon
                          className={`w-4 h-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"
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
              </div>
            ) : (
              // Registration - Compact left side
              <div className="hidden lg:block space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
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
                        className={`text-sm ${isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                      >
                        Join Our Network
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2
                      className={`text-4xl font-bold leading-tight ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      Join the
                      <br />
                      <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                        Alumni Network
                      </span>
                    </h2>
                    <p
                      className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                      Connect with fellow graduates and create lasting impact
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: Users,
                      title: "Global Community",
                      desc: "Connect with alumni across the world",
                    },
                    {
                      icon: Trophy,
                      title: "Career Growth",
                      desc: "Access exclusive opportunities and mentorship",
                    },
                    {
                      icon: BookOpen,
                      title: "Give Back",
                      desc: "Guide the next generation of students",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm ${isDarkMode
                        ? "bg-white/5 border border-white/10"
                        : "bg-white/60 border border-purple-200"
                        }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
                          }`}
                      >
                        <item.icon
                          className={`w-4 h-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"
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
              </div>
            )}

            <div
              className={`w-full ${!googleVerified ? "max-w-md mx-auto" : "max-w-4xl mx-auto"
                }`}
            >
              {!googleVerified ? (
                // Clean Entry Card - Two Buttons Only
                <div
                  className={`rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl border ${isDarkMode
                    ? "bg-slate-900/80 border-slate-700/50"
                    : "bg-white/90 border-purple-200"
                    }`}
                >
                  <div className="text-center mb-8">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isDarkMode
                        ? "bg-purple-500/10 border border-purple-500/20"
                        : "bg-purple-50 border border-purple-200"
                        }`}
                    >
                      <Award
                        className={`w-4 h-4 ${isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                      />
                      <span
                        className={`text-xs font-medium ${isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                      >
                        Alumni Portal
                      </span>
                    </div>
                    <h2
                      className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      Welcome Back
                    </h2>
                    <p
                      className={`text-base mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Choose how you would like to continue
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Primary Action: Google Login */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${isDarkMode
                          ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                          : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                          } shadow-sm hover:shadow transition-transform hover:scale-[1.01]`}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Sign in with Google
                      </button>
                      <p className={`text-xs text-center ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        Use your registered Google account
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div
                          className={`w-full border-t ${isDarkMode ? "border-slate-700" : "border-gray-200"
                            }`}
                        ></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase tracking-wider">
                        <span
                          className={`px-4 ${isDarkMode
                            ? "bg-slate-900/80 text-gray-500"
                            : "bg-white/90 text-gray-400"
                            }`}
                        >
                          New Here?
                        </span>
                      </div>
                    </div>

                    {/* Alumni Register Card - Reduced Height */}
                    <div
                      className={`relative p-6 rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl
${isDarkMode
                          ? "bg-gradient-to-br from-slate-800/60 via-purple-900/20 to-slate-800/60 border-purple-500/30"
                          : "bg-white border-gray-200 shadow-lg"
                        }`}
                    >
                      {/* Subtle Background Gradient - Only in Dark Mode */}
                      {isDarkMode && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 opacity-50"></div>
                      )}

                      <div className="relative">
                        <div className="text-center mb-5">
                          {/* Icon Badge */}
                          <div className="flex items-center justify-center mb-3">
                            <div className={`p-2 rounded-xl ${isDarkMode ? "bg-purple-500/20" : "bg-purple-100"}`}>
                              <GraduationCap className={`w-6 h-6 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                            </div>
                          </div>

                          <h3
                            className={`text-2xl font-bold tracking-tight mb-2
${isDarkMode ? "text-white" : "text-gray-900"}`}
                          >
                            Become a MITS Alumni
                          </h3>

                          <p
                            className={`text-sm leading-relaxed
${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            Connect with legends. Access exclusive opportunities and lifetime alumni privileges.
                          </p>
                        </div>

                        {/* Features Grid - More Compact */}
                        <div className="grid grid-cols-3 gap-2 mb-5">
                          {[
                            { icon: Trophy, label: "Network" },
                            { icon: Users, label: "Mentor" },
                            { icon: BookOpen, label: "Grow" },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isDarkMode
                                ? "bg-slate-700/50"
                                : "bg-gray-50 hover:bg-gray-100"
                                }`}
                            >
                              <item.icon
                                className={`w-4 h-4 mb-1 ${isDarkMode ? "text-purple-400" : "text-purple-600"
                                  }`}
                              />
                              <span
                                className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                  }`}
                              >
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Button - More Compact */}
                        <div className="w-full">
                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = `${BASE_URL}/google-alumni-register`;
                            }}
                            disabled={loading}
                            className={`group relative w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden
${isDarkMode
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
                              } hover:scale-[1.02]`}
                          >
                            {/* Button Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                            <svg className="w-4 h-4 relative z-10" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z" />
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="relative z-10">Register with Google</span>
                          </button>
                        </div>


                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Registration Form (Only shown after Google Verify)
                <div
                  className={`rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl border ${isDarkMode
                    ? "bg-slate-900/80 border-slate-700/50"
                    : "bg-white/90 border-purple-200"
                    }`}
                >

                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${isDarkMode
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-green-50 border border-green-200"
                        }`}
                    >
                      <CheckCircle
                        className={`w-3.5 h-3.5 ${isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                      />
                      <span
                        className={`text-[10px] sm:text-xs font-medium ${isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                      >
                        Email Verified
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-8 max-w-xs mx-auto">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center flex-1 last:flex-none">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${regStep >= s
                              ? "bg-purple-600 text-white shadow-lg"
                              : isDarkMode
                                ? "bg-slate-800 text-gray-500"
                                : "bg-gray-100 text-gray-400"
                              }`}
                          >
                            {regStep > s ? "✓" : s}
                          </div>
                          {s < 3 && (
                            <div className={`flex-1 h-0.5 mx-2 ${regStep > s ? "bg-purple-600" : isDarkMode ? "bg-slate-800" : "bg-gray-100"}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    <h2
                      className={`text-xl sm:text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      {regStep === 1 ? "Account Info" : regStep === 2 ? "Education" : "Last Steps"}
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <AnimatePresence mode="wait">
                      {regStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Full Name</label>
                            <div className="relative">
                              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl outline-none transition ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:border-purple-500`}
                                placeholder="John Doe"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email</label>
                            <div className="relative">
                              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                readOnly={googleVerified}
                                className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl outline-none transition ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:border-purple-500 ${googleVerified ? "opacity-75 cursor-not-allowed" : ""}`}
                                placeholder="you@example.com"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Phone Number</label>
                            <div className="relative">
                              <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl outline-none transition ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:border-purple-500`}
                                placeholder="+91 1234567890"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Password</label>
                            <div className="relative">
                              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full pl-10 sm:pl-11 pr-12 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl outline-none transition ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:border-purple-500`}
                                placeholder="••••••••"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {regStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Branch</label>
                            <div className="relative">
                              <GraduationCap className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                              <input
                                type="text"
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl outline-none transition ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:border-purple-500`}
                                placeholder="Computer Science Engineering"
                                required
                              />
                            </div>
                          </div>

                          <div className="relative">
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Batch Year</label>
                            <div className="relative">
                              <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 z-10 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                              <button
                                type="button"
                                onClick={() => setShowYearPicker(!showYearPicker)}
                                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl outline-none transition-all flex items-center justify-between ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                              >
                                <span className="truncate">{formData.batchYear || "Select Batch Year"}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showYearPicker ? "rotate-180" : ""}`} />
                              </button>
                              {showYearPicker && (
                                <div className={`absolute z-50 mt-1 w-full rounded-xl shadow-xl border overflow-hidden ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                                  <div className="p-3">
                                    <div className="flex justify-between items-center mb-3">
                                      <button type="button" onClick={() => setCurrentYearRange(currentYearRange - 4)} className="p-1 hover:bg-purple-100 rounded text-purple-600 font-bold">←</button>
                                      <span className="text-xs font-bold">{currentYearRange}-{currentYearRange + 3}</span>
                                      <button type="button" onClick={() => setCurrentYearRange(currentYearRange + 4)} className="p-1 hover:bg-purple-100 rounded text-purple-600 font-bold">→</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      {Array.from({ length: 4 }, (_, i) => {
                                        const year = currentYearRange + i;
                                        const range = `${year}-${year + 4}`;
                                        return (
                                          <button
                                            key={year}
                                            type="button"
                                            onClick={() => {
                                              setFormData({ ...formData, batchYear: range });
                                              setShowYearPicker(false);
                                            }}
                                            className={`p-2 rounded text-xs font-semibold ${formData.batchYear === range ? "bg-purple-600 text-white" : isDarkMode ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                                          >
                                            {range}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {regStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div className="relative">
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Location</label>
                            <div className="relative">
                              <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                              <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={(e) => { handleChange(e); setShowLocationDropdown(true); }}
                                className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl outline-none transition ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:border-purple-500`}
                                placeholder="City, Country"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>LinkedIn URL</label>
                            <div className="relative">
                              <Link className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                              <input
                                type="url"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                                className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl outline-none transition ${isDarkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-300 text-gray-900"} focus:border-purple-500`}
                                placeholder="https://linkedin.com/in/..."
                                required
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-4 mt-8">
                      {regStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition ${isDarkMode ? "bg-slate-800 text-white border border-slate-700" : "bg-gray-100 text-gray-700"}`}
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex-[2] py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isDarkMode
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                          }`}
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          regStep < 3 ? "Continue" : "Complete Registration"
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center">
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Already an alumni?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(true);
                          setGoogleVerified(false);
                          setFormData({
                            name: "", email: "", password: "", phone: "",
                            branch: "", batchYear: "", location: "", linkedinUrl: ""
                          });
                        }}
                        className="font-semibold text-purple-600 hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* New "Different Way" to move to Student Login */}
          {!googleVerified && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex justify-center"
            >
              <button
                onClick={() => navigate("/login")}
                className={`group relative px-8 py-4 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] ${isDarkMode ? "bg-slate-900/50" : "bg-white"
                  } border ${isDarkMode ? "border-slate-800" : "border-gray-200"}`}
              >
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10`} />

                <div className="relative flex items-center gap-6">
                  <div className={`p-3 rounded-xl transition-transform duration-500 group-hover:rotate-12 ${isDarkMode ? "bg-slate-800" : "bg-gray-100"
                    }`}>
                    <GraduationCap className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                  </div>

                  <div className="text-left">
                    <p className={`text-[10px] font-black tracking-widest uppercase mb-0.5 ${isDarkMode ? "text-slate-500" : "text-gray-400"
                      }`}>
                      Current Student?
                    </p>
                    <h4 className={`text-base font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}>
                      Access Student Portal
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </h4>
                  </div>
                </div>
              </button>
            </motion.div>
          )}
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
      <ForgotPasswordPopup
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        isDarkMode={isDarkMode}
      />
      <VerificationPendingPopup
        isOpen={showVerificationPopup}
        onClose={() => navigate("/")}
        isDarkMode={isDarkMode}
      />

      <ProfilePhotoUpload
        isOpen={showUploadPopup}
        token={tempAuthToken}
        onComplete={() => {
          setShowUploadPopup(false);
          setTempAuthToken(null);
          setShowVerificationPopup(true);
        }}
        onSkip={() => {
          setShowUploadPopup(false);
          setTempAuthToken(null);
          setShowVerificationPopup(true);
        }}
        isDarkMode={isDarkMode}
      />
    </div >
  );
}