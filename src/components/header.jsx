import { useState, useEffect, useRef } from "react";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
  X,
  Activity,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Header({ isDarkMode, toggleTheme }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAlumniDropdown, setShowAlumniDropdown] = useState(false);
  const [auth, setAuth] = useState(null);
  const dropdownRef = useRef(null);
  const alumniDropdownRef = useRef(null);
  const refreshIntervalRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
  const toggleAlumniDropdown = () => {
    setShowAlumniDropdown(!showAlumniDropdown);
  };

  const refreshAccessToken = async (refreshToken) => {
    console.log("Refreshing token:", refreshToken);
    try {
      const res = await fetch("http://localhost:3001/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Failed to refresh token");

      const data = await res.json();
      return data.accessToken;
    } catch (err) {
      console.error("Token refresh error:", err);
      return null;
    }
  };

  const setupTokenRefresh = (authData) => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    if (authData?.refreshToken) {
      // Refresh token every 55 minutes (3300000 ms)
      const refreshTime = 55 * 60 * 1000;

      refreshIntervalRef.current = setInterval(async () => {
        console.log("Auto-refreshing token...");
        const newAccessToken = await refreshAccessToken(authData.refreshToken);

        if (newAccessToken) {
          const updatedAuth = {
            ...authData,
            accessToken: newAccessToken,
            expiry: Date.now() + 60 * 60 * 1000, // 1 hour expiry
          };

          localStorage.setItem("auth", JSON.stringify(updatedAuth));
          setAuth(updatedAuth);
          console.log("Token auto-refreshed successfully");
        } else {
          // If refresh fails, logout user
          handleLogout();
          clearInterval(refreshIntervalRef.current);
        }
      }, refreshTime);
    }
  };

  useEffect(() => {
    const loadAuth = async () => {
      const stored = localStorage.getItem("auth");
      if (!stored) {
        setAuth(null);
        return;
      }

      let parsed = JSON.parse(stored);

      if (parsed.accessToken) {
        try {
          const decoded = jwtDecode(parsed.accessToken);
          parsed.userName = decoded.name || parsed.userName;
          parsed.userEmail = decoded.email || parsed.userEmail;
          parsed.userType = decoded.userType || parsed.userType;
        } catch (e) {
          console.error("Invalid token:", e);
        }
      }

      if (parsed.expiry && Date.now() > parsed.expiry) {
        if (parsed.refreshToken) {
          const newAccessToken = await refreshAccessToken(parsed.refreshToken);
          if (newAccessToken) {
            parsed.accessToken = newAccessToken;
            parsed.expiry = Date.now() + 60 * 60 * 1000; // 1 hour expiry
            localStorage.setItem("auth", JSON.stringify(parsed));
            setAuth(parsed);
          } else {
            localStorage.removeItem("auth");
            setAuth(null);
          }
        } else {
          localStorage.removeItem("auth");
          setAuth(null);
        }
      } else {
        setAuth(parsed);
      }

      // Setup auto refresh for the token
      setupTokenRefresh(parsed);
    };

    loadAuth();

    const handleStorageChange = (event) => {
      if (event.key === "auth") {
        loadAuth();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    setShowProfileMenu(false);
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  };

  const handleSignIn = () => {
    window.location.href = "/login";
  };

  const handleMessages = () => {
    navigate("/chat");
  };

  // Handle click outside for both dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      // Only close alumni dropdown on desktop, not mobile
      if (
        alumniDropdownRef.current &&
        !alumniDropdownRef.current.contains(event.target) &&
        window.innerWidth >= 768
      ) {
        setShowAlumniDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Alumni dropdown options with their navigation handlers
  const alumniOptions = [
    {
      label: "Distinguished Alumni",
      path: "/distinguished-alumni",
    },
    {
      label: "Alumni Directory",
      path: "/alumni",
    },
    {
      label: "Alumni Map",
      path: "/alumni-map",
    },
    {
      label: "Your BatchMates",
      path: "/batchmates",
    },
  ];

  const handleAlumniOptionClick = (path) => {
    navigate(path);
    setShowAlumniDropdown(false);
    setIsMenuOpen(false);
  };

  // Navigation handlers for main nav items
  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900/95 border-gray-800"
          : "bg-white/80 border-blue-200"
      }`}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-3 cursor-pointer flex-shrink-0"
            onClick={() => navigate("/")}
          >
            <img
              src="/assets/images/mits-logo.png"
              alt="MITS Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1
                className={`text-lg font-bold ${
                  isDarkMode
                    ? "text-white"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                }`}
              >
                MITS Alumni
              </h1>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Connect & Grow
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center justify-center flex-1 mx-4 gap-1 lg:gap-2 xl:gap-3">
            <button
              onClick={() => handleNavClick("/")}
              className={`text-sm font-medium transition-colors cursor-pointer px-2 lg:px-3 py-2 rounded-lg ${
                isDarkMode
                  ? "text-white hover:text-indigo-400 hover:bg-gray-800"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Home
            </button>

            {/* Alumni Dropdown for Desktop */}
            <div
              className="relative"
              ref={alumniDropdownRef}
              onMouseEnter={() => setShowAlumniDropdown(true)}
              onMouseLeave={() => setShowAlumniDropdown(false)}
            >
              {/* Invisible click box for better hover area */}
              <div className="absolute -inset-2 z-10 cursor-pointer" />

              <button
                className={`relative flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer z-20 ${
                  isDarkMode
                    ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                } ${
                  showAlumniDropdown
                    ? isDarkMode
                      ? "text-indigo-400 bg-gray-800"
                      : "text-blue-600 bg-blue-50"
                    : ""
                }`}
              >
                Alumni
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showAlumniDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showAlumniDropdown && (
                <div
                  className={`absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg border overflow-hidden transition-all duration-300 z-50 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-blue-200"
                  }`}
                >
                  <div className="py-1">
                    {alumniOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAlumniOptionClick(option.path)}
                        className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick("/event")}
              className={`text-sm font-medium transition-colors cursor-pointer px-2 lg:px-3 py-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => handleNavClick("/job")}
              className={`text-sm font-medium transition-colors cursor-pointer px-2 lg:px-3 py-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Jobs
            </button>
            <button
              onClick={() => handleNavClick("/campaign")}
              className={`text-sm font-medium transition-colors cursor-pointer px-2 lg:px-3 py-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Campaign
            </button>
            <button
              onClick={() => handleNavClick("/mentor")}
              className={`text-sm font-medium transition-colors cursor-pointer px-2 lg:px-3 py-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              Mentorship
            </button>
            <button
              onClick={() => handleNavClick("/about")}
              className={`text-sm font-medium transition-colors cursor-pointer px-2 lg:px-3 py-2 rounded-lg ${
                isDarkMode
                  ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("/developer")}
              className={`relative inline-block text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer px-2 lg:px-3 py-2 rounded-lg ${
                isDarkMode
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 hover:from-indigo-400 hover:via-pink-400 hover:to-orange-400 hover:bg-gray-800"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-500 hover:bg-blue-50"
              }`}
            >
              Developer
              <span
                className={`absolute left-0 -bottom-1 w-0 h-[2px] transition-all duration-500 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-pink-400 to-indigo-400"
                    : "bg-gradient-to-r from-purple-600 to-orange-500"
                } group-hover:w-full`}
              ></span>
            </button>
          </nav>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-600"
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Messages Button - Only for authenticated users */}
            {auth && (
              <>
                {/* Desktop Messages Button */}
                <button
                  onClick={handleMessages}
                  className={`hidden md:flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-indigo-400"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Messages</span>
                </button>

                {/* Mobile Messages Button */}
                <button
                  onClick={handleMessages}
                  className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-indigo-400"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </>
            )}

            {auth ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileMenu}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 focus:outline-none ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">
                    Profile
                  </span>
                </button>

                {showProfileMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg border overflow-hidden transition-all duration-300 z-50 ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-blue-200"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 border-b transition-colors duration-200 ${
                        isDarkMode
                          ? "bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-gray-700"
                          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                      }`}
                    >
                      <p className="font-bold flex flex-col">
                        {auth.userType === "student" ? (
                          <>
                            <span
                              className={`text-sm ${
                                isDarkMode
                                  ? "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                                  : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                              }`}
                            >
                              {auth.userName.split(" ")[0]}
                            </span>
                            <span
                              className={`text-sm ${
                                isDarkMode
                                  ? "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                                  : "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                              }`}
                            >
                              {auth.userName.split(" ").slice(1).join(" ")}
                            </span>
                          </>
                        ) : (
                          <span
                            className={`text-sm ${
                              isDarkMode
                                ? "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                                : "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                            }`}
                          >
                            {auth.userName}
                          </span>
                        )}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {auth.userEmail}
                      </p>
                    </div>

                    <div className="flex flex-col py-2">
                      <button
                        onClick={() => handleNavClick("/profile")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => handleNavClick("/activity")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <Activity className="w-4 h-4" />
                        My Activity
                      </button>
                      <button
                        onClick={handleMessages}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer md:hidden ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Messages
                      </button>

                      <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors duration-200 rounded-lg ${
                          isDarkMode
                            ? "text-red-400 hover:bg-gray-700 hover:text-red-500"
                            : "text-red-600 hover:bg-red-50 hover:text-red-700"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className={`flex items-center gap-2 px-3 py-2 md:px-6 md:py-2.5 rounded-lg font-medium text-sm transition-all ${
                  isDarkMode
                    ? "bg-white hover:bg-gray-100 text-gray-800 shadow-lg hover:shadow-xl"
                    : "bg-white hover:bg-gray-50 text-gray-800 shadow-lg hover:shadow-xl"
                } hover:scale-105 border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                <span className="hidden md:inline">Sign in with Google</span>
              </button>
            )}

            <button
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-lg ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            className={`md:hidden py-4 border-t ${
              isDarkMode ? "border-gray-800" : "border-blue-200"
            }`}
          >
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => handleNavClick("/")}
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer text-left ${
                  isDarkMode
                    ? "text-white bg-gray-800"
                    : "text-blue-600 bg-blue-50"
                }`}
              >
                Home
              </button>

              {/* Alumni Dropdown for Mobile */}
              <div className="flex flex-col" ref={alumniDropdownRef}>
                <button
                  onClick={() => {
                    setShowAlumniDropdown((prev) => !prev);
                  }}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-blue-50"
                  } ${
                    showAlumniDropdown
                      ? isDarkMode
                        ? "bg-gray-800"
                        : "bg-blue-50"
                      : ""
                  }`}
                >
                  <span>Alumni</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showAlumniDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showAlumniDropdown && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {alumniOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAlumniOptionClick(option.path)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                          isDarkMode
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-600 hover:bg-blue-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavClick("/event")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                Events
              </button>
              <button
                onClick={() => handleNavClick("/job")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                Jobs
              </button>
              <button
                onClick={() => handleNavClick("/campaign")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                Campaign
              </button>
              <button
                onClick={() => handleNavClick("/mentor")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                Mentorship
              </button>
              <button
                onClick={() => handleNavClick("/about")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick("/developer")}
                className={`relative w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 overflow-hidden group cursor-pointer ${
                  isDarkMode
                    ? "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 hover:from-pink-500/20 hover:via-purple-500/20 hover:to-indigo-500/20"
                    : "bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20"
                }`}
              >
                <span
                  className={`relative z-10 bg-clip-text text-transparent bg-gradient-to-r ${
                    isDarkMode
                      ? "from-pink-400 via-purple-400 to-indigo-400 group-hover:from-pink-300 group-hover:via-purple-300 group-hover:to-indigo-300"
                      : "from-purple-600 via-pink-500 to-orange-500 group-hover:from-purple-700 group-hover:via-pink-600 group-hover:to-orange-600"
                  } transition-all duration-300`}
                >
                  ✨ Developer
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
                      : "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500"
                  }`}
                ></span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
