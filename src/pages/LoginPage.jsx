import {
  Shield,
  AlertCircle,
  Mail,
  Sparkles,
  Lock,
  Users,
  Moon,
  Sun,
  Github,
  Linkedin,
  Twitter,
  GraduationCap,
  BookOpen,
  Trophy,
  Target,
  ArrowRight,
  Award,
  UserCheck,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Use the environment variable - this will work in JSX without TypeScript errors
const API_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/auth`
  : "http://localhost:3001/auth";

export default function LoginPage({
  setIsAuthenticated,
  isDarkMode,
  toggleTheme,
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const handleAuthError = (errorType) => {
    switch (errorType) {
      case "unauthorized_domain":
        setError(
          "Only @mitsgwl.ac.in email addresses are allowed. Please use your institute email."
        );
        break;
      case "login_failed":
        setError("Google login failed. Please try again.");
        break;
      case "unauthorized":
        setError("Authentication failed. Please try again.");
        break;
      case "embedded_browser":
        setError(
          "Please open this page in Chrome or Safari browser instead of social media in-app browsers."
        );
        break;
      default:
        setError("An error occurred during login. Please try again.");
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userNameParam = params.get("name");
    const userEmailParam = params.get("email");
    const userPhone = params.get("phone");
    const userIdParam = params.get("id");
    const errorType = params.get("error");

    if (accessToken || refreshToken || errorType) {
      window.history.replaceState({}, "", "/login");
    }

    if (errorType) {
      setIsLoading(false);
      switch (errorType) {
        case "unauthorized_domain":
          setError(
            "Only @mitsgwl.ac.in email addresses are allowed. Please use your institute email."
          );
          break;
        case "login_failed":
          setError("Google login failed. Please try again.");
          break;
        case "unauthorized":
          setError("Authentication failed. Please try again.");
          break;
        case "embedded_browser":
          setError(
            "Please open this page in Chrome or Safari browser instead of social media in-app browsers."
          );
          break;
        default:
          setError("An error occurred during login. Please try again.");
      }
      return;
    }

    if (accessToken && refreshToken) {
      setIsLoading(false);
      const decodedName = decodeURIComponent(userNameParam || "");

      const userData = {
        accessToken,
        refreshToken,
        userName: decodedName,
        userEmail: userEmailParam || "",
        userPhone: userPhone || "",
        userId: userIdParam || "",
        userType: "student",
        expiry: Date.now() + 1000 * 60 * 60,
      };
      console.log("✅ Access Token:", accessToken);
      console.log("🔄 Refresh Token:", refreshToken);
      console.log("Storing auth data:", userData);
      localStorage.setItem("auth", JSON.stringify(userData));
      setIsAuthenticated(true);
      window.location.href = "/";
    }
  }, [setIsAuthenticated]);

  const handleGoogleLogin = () => {
    setError("");
    setIsLoading(true);

    const userAgent = navigator.userAgent.toLowerCase();

    const isEmbeddedBrowser =
      userAgent.includes("instagram") ||
      userAgent.includes("facebook") ||
      userAgent.includes("fb_iab") ||
      userAgent.includes("fb4a") ||
      userAgent.includes("fban") ||
      userAgent.includes("fbav") ||
      userAgent.includes("twitter") ||
      userAgent.includes("linkedin") ||
      userAgent.includes("snapchat") ||
      userAgent.includes("tiktok") ||
      userAgent.includes("line") ||
      userAgent.includes("kakao") ||
      userAgent.includes("whatsapp") ||
      (userAgent.includes("wv") && userAgent.includes("android")) ||
      (userAgent.includes("mobile") &&
        userAgent.includes("safari") &&
        !userAgent.includes("chrome"));

    const isMobileDevice =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );

    const isAllowedBrowser =
      userAgent.includes("chrome") ||
      userAgent.includes("safari") ||
      userAgent.includes("firefox") ||
      userAgent.includes("edge") ||
      userAgent.includes("opera") ||
      userAgent.includes("samsung") ||
      isMobileDevice;

    if (isEmbeddedBrowser) {
      setError(
        "Please open this page in your regular browser (Chrome, Safari, etc.) instead of social media apps. " +
          "Copy the URL and paste it in your browser to continue."
      );
      setIsLoading(false);
      return;
    }

    if (!isAllowedBrowser) {
      setError(
        "For the best experience, please use Chrome, Safari, Firefox, or Edge browser."
      );
      setIsLoading(false);
      return;
    }

    if (isMobileDevice) {
      const oauthWindow = window.open(
        `${API_URL}/google`,
        "googleOAuth",
        "width=500,height=600,scrollbars=yes"
      );

      if (!oauthWindow) {
        console.log("Popup blocked, redirecting current window...");
        window.location.href = `${API_URL}/google`;
      } else {
        const checkWindowClosed = setInterval(() => {
          if (oauthWindow.closed) {
            clearInterval(checkWindowClosed);
            setIsLoading(false);
            const params = new URLSearchParams(window.location.search);
            if (params.get("accessToken")) {
              processAuthFromURL();
            }
          }
        }, 500);

        setTimeout(() => {
          setIsLoading(false);
          clearInterval(checkWindowClosed);
        }, 30000);
      }
    } else {
      console.log("Redirecting to Google OAuth...");
      window.location.href = `${API_URL}/google`;
    }
  };

  const processAuthFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userNameParam = params.get("name");
    const userEmailParam = params.get("email");
    const userIdParam = params.get("id");
    const errorType = params.get("error");

    if (errorType) {
      setIsLoading(false);
      handleAuthError(errorType);
      return;
    }

    if (accessToken && refreshToken) {
      setIsLoading(false);
      const decodedName = decodeURIComponent(userNameParam || "");

      const userData = {
        accessToken,
        refreshToken,
        userName: decodedName,
        userEmail: userEmailParam || "",
        userId: userIdParam || "",
      };

      console.log("Storing auth data:", userData);
      localStorage.setItem("auth", JSON.stringify(userData));
      setIsAuthenticated(true);
      window.location.href = "/";
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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          {/* Mobile Header - Only on small screens */}
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
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  Student Portal
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
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Future Alumni
              </span>
            </h2>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Connect with your campus community
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
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      Student Portal
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
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Future Alumni
                    </span>
                  </h2>
                  <p
                    className={`text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Connect with your campus community and explore endless
                    opportunities
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: UserCheck, // represents verified alumni
                    title: "Verified Alumni",
                    desc: "Connect only with genuine MITS graduates",
                  },
                  {
                    icon: Users, // represents networking and connections
                    title: "Career Networking",
                    desc: "Build professional connections and mentorship",
                  },
                  {
                    icon: Award, // represents exclusive benefits/resources
                    title: "Alumni Exclusive",
                    desc: "Access resources and events only for MITS alumni",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm transition-all hover:translate-x-2 ${
                      isDarkMode
                        ? "bg-white/5 border border-white/10"
                        : "bg-white/60 border border-blue-200"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                      }`}
                    >
                      <item.icon
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
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

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div
                className={`rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl border ${
                  isDarkMode
                    ? "bg-slate-900/80 border-slate-700/50"
                    : "bg-white/90 border-blue-200"
                }`}
              >
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                      isDarkMode
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <GraduationCap
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      Student Login
                    </span>
                  </div>
                  <h2
                    className={`text-3xl font-bold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Sign In
                  </h2>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Use your institute email to continue
                  </p>
                </div>

                {error && (
                  <div
                    className={`mb-6 p-4 rounded-xl border-l-4 border-red-500 ${
                      isDarkMode ? "bg-red-900/20" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3
                          className={`font-semibold text-sm mb-1 ${
                            isDarkMode ? "text-red-400" : "text-red-800"
                          }`}
                        >
                          Authentication Error
                        </h3>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-red-300" : "text-red-700"
                          }`}
                        >
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className={`w-full rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed group ${
                    isDarkMode
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                  } shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(0,0,0,0.25)] hover:scale-[1.02]`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
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
                      <span>Continue with Google</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <div
                  className={`mt-6 p-4 rounded-xl border hidden md:block ${
                    isDarkMode
                      ? "bg-blue-500/10 border-blue-500/20"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                      }`}
                    >
                      <Mail
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold text-sm mb-1 ${
                          isDarkMode ? "text-blue-300" : "text-blue-900"
                        }`}
                      >
                        Institute Email Required
                      </h3>
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-blue-200" : "text-blue-700"
                        }`}
                      >
                        Only <strong>@mitsgwl.ac.in</strong> email addresses are
                        allowed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p
                    className={`text-sm mb-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Already graduated?
                  </p>
                  <button
                    onClick={() => navigate("/login-alumni")}
                    className={`w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    } shadow-lg hover:shadow-xl flex items-center gap-2 justify-center mx-auto`}
                  >
                    Login as Alumni
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                className={`mt-6 rounded-xl p-6 backdrop-blur-xl border flex justify-center items-center ${
                  isDarkMode
                    ? "bg-slate-900/50 border-slate-700/50"
                    : "bg-white/80 border-blue-200"
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
                  <div className="flex flex-col items-center">
                    <p
                      className={`text-xs font-semibold tracking-wider mb-2 ${
                        isDarkMode ? "text-gray-500" : "text-blue-600/60"
                      }`}
                    >
                      DEVELOPED BY
                    </p>
                    <h3
                      className={`text-lg font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Harsh Manmode
                    </h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Information Technology, II Year
                    </p>
                    <div className="flex gap-2 mt-2 justify-center">
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
                          className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                            isDarkMode
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