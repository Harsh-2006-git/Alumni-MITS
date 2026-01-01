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
  Bell, // Added Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Header({ isDarkMode, toggleTheme }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAlumniDropdown, setShowAlumniDropdown] = useState(false);
  const [showEventsDropdown, setShowEventsDropdown] = useState(false);
  const [showJobsDropdown, setShowJobsDropdown] = useState(false);
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);
  const [showMentorDropdown, setShowMentorDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);

  // Notification State
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  const [auth, setAuth] = useState(null);
  const dropdownRef = useRef(null);
  const alumniDropdownRef = useRef(null);
  const eventsDropdownRef = useRef(null);
  const jobsDropdownRef = useRef(null);
  const campaignDropdownRef = useRef(null);
  const mentorDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const refreshIntervalRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const notificationsModalRef = useRef(null); // Ref for modal click outside

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
  const toggleAlumniDropdown = () => {
    setShowAlumniDropdown(!showAlumniDropdown);
  };
  const toggleEventsDropdown = () => {
    setShowEventsDropdown(!showEventsDropdown);
  };
  const toggleJobsDropdown = () => {
    setShowJobsDropdown(!showJobsDropdown);
  };
  const toggleCampaignDropdown = () => {
    setShowCampaignDropdown(!showCampaignDropdown);
  };
  const toggleMentorDropdown = () => {
    setShowMentorDropdown(!showMentorDropdown);
  };
  const toggleAboutDropdown = () => {
    setShowAboutDropdown(!showAboutDropdown);
  };

  const refreshAccessToken = async (refreshToken) => {
    console.log("Refreshing token:", refreshToken);
    try {
      const res = await fetch(
        `${BASE_URL}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!res.ok) throw new Error("Failed to refresh token");

      const data = await res.json();
      // Return both tokens as the backend rotates them
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      };
    } catch (err) {
      console.error("Token refresh error:", err);
      return null;
    }
  };

  const fetchNotifications = async () => {
    if (!auth?.accessToken) return;
    try {
      const response = await fetch(`${BASE_URL}/notification/all`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (auth && auth.accessToken) {
      fetchNotifications();
      // Poll every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [auth]);

  const setupTokenRefresh = (authData) => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    if (authData?.refreshToken) {
      // Refresh token every 50 minutes (slightly before 1h expiry)
      const refreshTime = 50 * 60 * 1000;

      refreshIntervalRef.current = setInterval(async () => {
        console.log("Auto-refreshing token...");
        const tokens = await refreshAccessToken(authData.refreshToken);

        if (tokens?.accessToken) {
          const updatedAuth = {
            ...authData,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken || authData.refreshToken,
            expiry: Date.now() + 60 * 60 * 1000, // 1 hour expiry
          };

          localStorage.setItem("auth", JSON.stringify(updatedAuth));
          setAuth(updatedAuth);
          console.log("Token auto-refreshed successfully");
        } else {
          // If refresh fails, logout user
          console.error("Auto-refresh failed, logging out...");
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
          const tokens = await refreshAccessToken(parsed.refreshToken);
          if (tokens?.accessToken) {
            parsed.accessToken = tokens.accessToken;
            parsed.refreshToken = tokens.refreshToken || parsed.refreshToken;
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
    setIsMenuOpen(false);
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
  };

  const handleSignIn = () => {
    window.location.href = "/login";
  };

  const handleMessages = () => {
    navigate("/chat");
    setIsMenuOpen(false);
  };

  // Handling click outside for Notification Modal
  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (notificationsModalRef.current && !notificationsModalRef.current.contains(event.target)) {
        setShowNotificationsModal(false);
      }
    }
    if (showNotificationsModal) {
      document.addEventListener("mousedown", handleClickOutsideModal)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal)
    }
  }, [showNotificationsModal])

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
    {
      label: "Alumni Analytics",
      path: "/alumni-analytics",
    },
    {
      label: "Alumni Insights (Blogs)",
      path: "/blogs",
    },
  ];

  // Events dropdown options with their navigation handlers
  const eventsOptions = [
    {
      label: "All Events",
      path: "/event",
    },
    {
      label: "Create Event",
      path: "/event-register",
    },
    {
      label: "Event Gallery",
      path: "/event-gallery",
    },
  ];

  // Jobs dropdown options with their navigation handlers
  const jobsOptions = [
    {
      label: "Alumni/Admin Jobs",
      path: "/job",
    },
    {
      label: "Auto Posted Jobs",
      path: "/autoposted-jobs",
    },
    {
      label: "Create Jobs",
      path: "/create-job",
    },
    {
      label: "Job Market Analysis",
      path: "/job-trends",
    },
    {
      label: "Student Recruitment",
      path: "/recruitment",
    },
  ];

  // Campaign dropdown options with their navigation handlers
  const campaignOptions = [
    {
      label: "All Campaigns",
      path: "/campaign",
    },
    {
      label: "Create Campaign",
      path: "/create-campaign",
    },
  ];

  // Mentor dropdown options with their navigation handlers
  const mentorOptions = [
    {
      label: "All Mentors",
      path: "/mentor",
    },
    {
      label: "Become a Mentor",
      path: "/mentor-profile",
    },
    {
      label: "Mentorship Requests",
      path: "/mentorship-requests",
    },
  ];

  const aboutOptions = [
    {
      label: "History",
      path: "/about#history",
    },
    {
      label: "Vision & Mission",
      path: "/about#vision",
    },
    {
      label: "Interaction Cell",
      path: "/about#aiic",
    },
    {
      label: "Meet Our Leadership",
      path: "/about#leadership",
    },
    {
      label: "Contact Us",
      path: "/contact-us",
    },
  ];

  const handleAlumniOptionClick = (path) => {
    navigate(path);
    setShowAlumniDropdown(false);
    setIsMenuOpen(false);
  };

  const handleEventsOptionClick = (path) => {
    navigate(path);
    setShowEventsDropdown(false);
    setIsMenuOpen(false);
  };

  const handleJobsOptionClick = (path) => {
    navigate(path);
    setShowJobsDropdown(false);
    setIsMenuOpen(false);
  };

  const handleCampaignOptionClick = (path) => {
    navigate(path);
    setShowCampaignDropdown(false);
    setIsMenuOpen(false);
  };

  const handleMentorOptionClick = (path) => {
    navigate(path);
    setShowMentorDropdown(false);
    setIsMenuOpen(false);
  };

  // Navigation handlers for main nav items
  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleAboutOptionClick = (path) => {
    navigate(path);
    setShowAboutDropdown(false);
    setIsMenuOpen(false);
  };

  // Handle click outside for all dropdowns and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      // Only close alumni dropdown on desktop, not mobile
      if (
        alumniDropdownRef.current &&
        !alumniDropdownRef.current.contains(event.target) &&
        window.innerWidth >= 1250
      ) {
        setShowAlumniDropdown(false);
      }
      // Only close events dropdown on desktop, not mobile
      if (
        eventsDropdownRef.current &&
        !eventsDropdownRef.current.contains(event.target) &&
        window.innerWidth >= 1250
      ) {
        setShowEventsDropdown(false);
      }
      // Only close jobs dropdown on desktop, not mobile
      if (
        jobsDropdownRef.current &&
        !jobsDropdownRef.current.contains(event.target) &&
        window.innerWidth >= 1250
      ) {
        setShowJobsDropdown(false);
      }
      // Only close campaign dropdown on desktop, not mobile
      if (
        campaignDropdownRef.current &&
        !campaignDropdownRef.current.contains(event.target) &&
        window.innerWidth >= 1250
      ) {
        setShowCampaignDropdown(false);
      }
      // Only close mentor dropdown on desktop, not mobile
      if (
        mentorDropdownRef.current &&
        !mentorDropdownRef.current.contains(event.target) &&
        window.innerWidth >= 1250
      ) {
        setShowMentorDropdown(false);
      }
      // Close mobile menu when clicking outside
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle menu"]') &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
      // Update click outside handler for about dropdown
      if (
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(event.target) &&
        window.innerWidth >= 1250
      ) {
        setShowAboutDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* NOTIFICATION MODAL */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-end p-4 sm:p-6 lg:p-12 pointer-events-none">
          {/* Click away layer - Transparent */}
          <div
            className="fixed inset-0 pointer-events-auto"
            onClick={() => setShowNotificationsModal(false)}
          ></div>
          <div
            ref={notificationsModalRef}
            className={`w-full max-w-sm rounded-xl shadow-2xl pointer-events-auto transform transition-all animate-in slide-in-from-right-5 fade-in-0 duration-200 mt-12 bg-white border border-gray-200 z-[101] ${isDarkMode ? "!bg-gray-900 !border-gray-700" : ""
              }`}
          >
            <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? "border-gray-800" : "border-blue-50"}`}>
              <div className="flex items-center gap-2">
                <Bell className={`w-5 h-5 ${isDarkMode ? "text-indigo-400" : "text-blue-600"}`} />
                <h3 className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className={`p-1 rounded-lg ${isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-blue-50 text-gray-500"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
              {notifications.length > 0 ? (
                notifications.map((notif, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg mb-1 last:mb-0 transition-colors ${isDarkMode
                      ? "hover:bg-gray-800 border border-transparent hover:border-gray-700"
                      : "hover:bg-blue-50/50 border border-transparent hover:border-blue-100"
                      }`}
                  >
                    <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${notif.type === 'alert'
                        ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                        : isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                        }`}>
                        {notif.type || 'System'}
                      </span>
                      <span className={`text-[10px] ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                  <Bell className="w-12 h-12 mb-3 text-gray-400" />
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    No new notifications
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Header Content - preserved from original file logic but ensuring imports are correct */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${isDarkMode
          ? "bg-gray-900/95 border-gray-800"
          : "bg-white/80 border-blue-200"
          }`}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <img
                src="/assets/images/mits-logo.png"
                alt="MITS Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
              />
              <div>
                <h1
                  className={`text-base sm:text-base md:text-lg font-bold ${isDarkMode
                    ? "text-white"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                    }`}
                >
                  MITS Alumni
                </h1>
                <p
                  className={`text-[11px] sm:text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Connect & Grow
                </p>
              </div>
            </div>

            {/* Desktop Navigation - Hidden below 1250px */}
            <nav className="hidden xl:flex items-center justify-center flex-1 mx-4 gap-2 lg:gap-3">
              <button
                onClick={() => handleNavClick("/")}
                className={`text-sm font-medium transition-colors cursor-pointer px-2 lg:px-3 py-2 rounded-lg ${isDarkMode
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
                  className={`relative flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer z-20 ${isDarkMode
                    ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    } ${showAlumniDropdown
                      ? isDarkMode
                        ? "text-indigo-400 bg-gray-800"
                        : "text-blue-600 bg-blue-50"
                      : ""
                    }`}
                >
                  Alumni
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showAlumniDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showAlumniDropdown && (
                  <div
                    className={`absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg border overflow-hidden transition-all duration-300 z-50 ${isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-blue-200"
                      }`}
                  >
                    <div className="py-1">
                      {alumniOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAlumniOptionClick(option.path)}
                          className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${isDarkMode
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

              {/* Events Dropdown for Desktop */}
              <div
                className="relative"
                ref={eventsDropdownRef}
                onMouseEnter={() => setShowEventsDropdown(true)}
                onMouseLeave={() => setShowEventsDropdown(false)}
              >
                {/* Invisible click box for better hover area */}
                <div className="absolute -inset-2 z-10 cursor-pointer" />

                <button
                  className={`relative flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer z-20 ${isDarkMode
                    ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    } ${showEventsDropdown
                      ? isDarkMode
                        ? "text-indigo-400 bg-gray-800"
                        : "text-blue-600 bg-blue-50"
                      : ""
                    }`}
                >
                  Events
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showEventsDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showEventsDropdown && (
                  <div
                    className={`absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg border overflow-hidden transition-all duration-300 z-50 ${isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-blue-200"
                      }`}
                  >
                    <div className="py-1">
                      {eventsOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleEventsOptionClick(option.path)}
                          className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${isDarkMode
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

              {/* Jobs Dropdown for Desktop */}
              <div
                className="relative"
                ref={jobsDropdownRef}
                onMouseEnter={() => setShowJobsDropdown(true)}
                onMouseLeave={() => setShowJobsDropdown(false)}
              >
                {/* Invisible click box for better hover area */}
                <div className="absolute -inset-2 z-10 cursor-pointer" />

                <button
                  className={`relative flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer z-20 ${isDarkMode
                    ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    } ${showJobsDropdown
                      ? isDarkMode
                        ? "text-indigo-400 bg-gray-800"
                        : "text-blue-600 bg-blue-50"
                      : ""
                    }`}
                >
                  Jobs
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showJobsDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showJobsDropdown && (
                  <div
                    className={`absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg border overflow-hidden transition-all duration-300 z-50 ${isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-blue-200"
                      }`}
                  >
                    <div className="py-1">
                      {jobsOptions.filter(option =>
                        option.label !== "Create Jobs" || (auth?.userType === "alumni" || auth?.userType === "admin" || !auth)
                      ).map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleJobsOptionClick(option.path)}
                          className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${isDarkMode
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

              {/* Campaign Dropdown for Desktop */}
              <div
                className="relative"
                ref={campaignDropdownRef}
                onMouseEnter={() => setShowCampaignDropdown(true)}
                onMouseLeave={() => setShowCampaignDropdown(false)}
              >
                {/* Invisible click box for better hover area */}
                <div className="absolute -inset-2 z-10 cursor-pointer" />

                <button
                  className={`relative flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer z-20 ${isDarkMode
                    ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    } ${showCampaignDropdown
                      ? isDarkMode
                        ? "text-indigo-400 bg-gray-800"
                        : "text-blue-600 bg-blue-50"
                      : ""
                    }`}
                >
                  Campaign
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showCampaignDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showCampaignDropdown && (
                  <div
                    className={`absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg border overflow-hidden transition-all duration-300 z-50 ${isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-blue-200"
                      }`}
                  >
                    <div className="py-1">
                      {campaignOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleCampaignOptionClick(option.path)}
                          className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${isDarkMode
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

              {/* Mentor Dropdown for Desktop */}
              <div
                className="relative"
                ref={mentorDropdownRef}
                onMouseEnter={() => setShowMentorDropdown(true)}
                onMouseLeave={() => setShowMentorDropdown(false)}
              >
                {/* Invisible click box for better hover area */}
                <div className="absolute -inset-2 z-10 cursor-pointer" />

                <button
                  className={`relative flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer z-20 ${isDarkMode
                    ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    } ${showMentorDropdown
                      ? isDarkMode
                        ? "text-indigo-400 bg-gray-800"
                        : "text-blue-600 bg-blue-50"
                      : ""
                    }`}
                >
                  Mentorship
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showMentorDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showMentorDropdown && (
                  <div
                    className={`absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg border overflow-hidden transition-all duration-300 z-50 ${isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-blue-200"
                      }`}
                  >
                    <div className="py-1">
                      {mentorOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleMentorOptionClick(option.path)}
                          className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${isDarkMode
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

              {/* About Dropdown for Desktop */}
              <div
                className="relative"
                ref={aboutDropdownRef}
                onMouseEnter={() => setShowAboutDropdown(true)}
                onMouseLeave={() => setShowAboutDropdown(false)}
              >
                <div className="absolute -inset-1 z-10 cursor-pointer" />
                <button
                  className={`relative flex items-center gap-1 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer z-20 whitespace-nowrap ${isDarkMode
                    ? "text-gray-300 hover:text-indigo-400 hover:bg-gray-800"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    } ${showAboutDropdown
                      ? isDarkMode
                        ? "text-indigo-400 bg-gray-800"
                        : "text-blue-600 bg-blue-50"
                      : ""
                    }`}
                >
                  About
                  <ChevronDown
                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${showAboutDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showAboutDropdown && (
                  <div
                    className={`absolute left-0 top-full mt-1 w-48 rounded-lg shadow-lg border overflow-hidden transition-all duration-300 z-50 ${isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-blue-200"
                      }`}
                  >
                    <div className="py-1">
                      {aboutOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAboutOptionClick(option.path)}
                          className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 cursor-pointer ${isDarkMode
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
                onClick={() => handleNavClick("/developer")}
                className={`relative inline-block text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer px-2 lg:px-3 py-2 rounded-lg ${isDarkMode
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 hover:from-indigo-400 hover:via-pink-400 hover:to-orange-400 hover:bg-gray-800"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-500 hover:bg-blue-50"
                  }`}
              >
                Developer
                <span
                  className={`absolute left-0 -bottom-1 w-0 h-[2px] transition-all duration-500 ${isDarkMode
                    ? "bg-gradient-to-r from-pink-400 to-indigo-400"
                    : "bg-gradient-to-r from-purple-600 to-orange-500"
                    } group-hover:w-full`}
                ></span>
              </button>
            </nav>

            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                  }`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 sm:w-5 sm:h-5" />
                ) : (
                  <Moon className="w-5 h-5 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* Messages Button - Only for authenticated users */}
              {auth && (
                <>
                  {/* Desktop Messages Button - Hidden below 1250px */}
                  <button
                    onClick={handleMessages}
                    className={`hidden xl:flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-indigo-400"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                      }`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Messages</span>
                  </button>

                  {/* Mobile Messages Button - Show below 1250px */}
                  <button
                    onClick={handleMessages}
                    className={`xl:hidden p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-indigo-400"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                      }`}
                  >
                    <MessageCircle className="w-5 h-5 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}

              {auth ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-lg transition-all duration-300 focus:outline-none ${isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                      }`}
                  >
                    <User className="w-5 h-5 sm:w-5 sm:h-5" />
                    <span className="hidden xl:inline text-sm font-medium">
                      Profile
                    </span>
                  </button>

                  {showProfileMenu && (
                    <div
                      className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg border overflow-hidden transition-all duration-300 z-50 ${isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-blue-200"
                        }`}
                    >
                      <div
                        className={`px-4 py-3 border-b transition-colors duration-200 ${isDarkMode
                          ? "bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-gray-700"
                          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                          }`}
                      >
                        <div className="flex flex-col py-0.5 overflow-hidden">
                          {auth.userType === "student" && auth.userName && auth.userName.includes(" ") ? (
                            <>
                              <span
                                className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isDarkMode
                                  ? "text-blue-400/90"
                                  : "text-blue-600/90"
                                  }`}
                              >
                                {auth.userName.split(" ")[0]}
                              </span>
                              <span
                                className={`text-sm sm:text-base font-bold truncate ${isDarkMode
                                  ? "text-gray-100"
                                  : "text-blue-900"
                                  }`}
                                title={auth.userName.split(" ").slice(1).join(" ")}
                              >
                                {auth.userName.split(" ").slice(1).join(" ")}
                              </span>
                            </>
                          ) : (
                            <span
                              className={`text-sm sm:text-base font-bold truncate ${isDarkMode
                                ? "text-gray-100"
                                : "text-blue-900"
                                }`}
                              title={auth.userName}
                            >
                              {auth.userName || "User"}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                          {auth.userEmail}
                        </p>
                      </div>

                      <div className="flex flex-col py-2">
                        <button
                          onClick={() => handleNavClick("/profile")}
                          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer ${isDarkMode
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </button>
                        <button
                          onClick={() => handleNavClick("/activity")}
                          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer ${isDarkMode
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                          <Activity className="w-4 h-4" />
                          My Activity
                        </button>
                        <button
                          onClick={() => {
                            setShowNotificationsModal(true);
                            setShowProfileMenu(false);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer ${isDarkMode
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                          <div className="relative">
                            <Bell className="w-4 h-4" />
                            {notifications.length > 0 && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </div>
                          Notifications
                        </button>
                        <button
                          onClick={handleMessages}
                          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 rounded-lg cursor-pointer xl:hidden ${isDarkMode
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Messages
                        </button>

                        <button
                          onClick={handleLogout}
                          className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-colors duration-200 rounded-lg ${isDarkMode
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
                  className={`flex items-center gap-2 px-3 py-2 xl:px-6 xl:py-2.5 rounded-lg font-medium text-sm transition-all ${isDarkMode
                    ? "bg-white hover:bg-gray-100 text-gray-800 shadow-lg hover:shadow-xl"
                    : "bg-white hover:bg-gray-50 text-gray-800 shadow-lg hover:shadow-xl"
                    } hover:scale-105 border ${isDarkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                >
                  <svg
                    className="w-4 h-4 xl:w-5 xl:h-5"
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
                  <span className="hidden xl:inline">Sign in with Google</span>
                </button>
              )}

              {/* Mobile Menu Button - Show below 1250px */}
              <button
                onClick={toggleMenu}
                className={`xl:hidden p-1.5 sm:p-2 rounded-lg ${isDarkMode ? "text-white" : "text-gray-700"
                  }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        ref={mobileMenuRef}
        className={`fixed inset-y-0 right-0 z-50 w-[65%] max-w-sm transform transition-transform duration-300 ease-in-out xl:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Backdrop */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar Content - 60% width */}
        <div
          className={`relative h-full w-full flex flex-col z-50 shadow-2xl ${isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
        >
          {/* Header Section */}
          <div
            className={`p-4 border-b flex-shrink-0 ${isDarkMode ? "border-gray-800" : "border-blue-200"
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/images/mits-logo.png"
                  alt="MITS Logo"
                  className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
                />
                <div>
                  <h1
                    className={`text-base sm:text-lg font-bold ${isDarkMode
                      ? "text-white"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                      }`}
                  >
                    MITS Alumni
                  </h1>
                  <p
                    className={`text-[10px] sm:text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Connect & Grow
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={`p-1.5 sm:p-2 rounded-lg ${isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-700 hover:bg-blue-50"
                  }`}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Navigation Section - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              <button
                onClick={() => handleNavClick("/")}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-3 ${isDarkMode
                  ? "text-white hover:bg-gray-800"
                  : "text-blue-600 hover:bg-blue-50"
                  }`}
              >
                Home
              </button>

              {/* Alumni Dropdown for Mobile */}
              <div className="flex flex-col">
                <button
                  onClick={() => setShowAlumniDropdown(!showAlumniDropdown)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                    } ${showAlumniDropdown
                      ? isDarkMode
                        ? "bg-gray-800"
                        : "bg-blue-50"
                      : ""
                    }`}
                >
                  <span>Alumni</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showAlumniDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showAlumniDropdown && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {alumniOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAlumniOptionClick(option.path)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isDarkMode
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

              {/* Events Dropdown for Mobile */}
              <div className="flex flex-col">
                <button
                  onClick={() => setShowEventsDropdown(!showEventsDropdown)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                    } ${showEventsDropdown
                      ? isDarkMode
                        ? "bg-gray-800"
                        : "bg-blue-50"
                      : ""
                    }`}
                >
                  <span>Events</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showEventsDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showEventsDropdown && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {eventsOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleEventsOptionClick(option.path)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isDarkMode
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

              {/* Jobs Dropdown for Mobile */}
              <div className="flex flex-col">
                <button
                  onClick={() => setShowJobsDropdown(!showJobsDropdown)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                    } ${showJobsDropdown
                      ? isDarkMode
                        ? "bg-gray-800"
                        : "bg-blue-50"
                      : ""
                    }`}
                >
                  <span>Jobs</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showJobsDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showJobsDropdown && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {jobsOptions.filter(option =>
                      option.label !== "Create Jobs" || (auth?.userType === "alumni" || auth?.userType === "admin" || !auth)
                    ).map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleJobsOptionClick(option.path)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isDarkMode
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

              {/* Campaign Dropdown for Mobile */}
              <div className="flex flex-col">
                <button
                  onClick={() => setShowCampaignDropdown(!showCampaignDropdown)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                    } ${showCampaignDropdown
                      ? isDarkMode
                        ? "bg-gray-800"
                        : "bg-blue-50"
                      : ""
                    }`}
                >
                  <span>Campaign</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showCampaignDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showCampaignDropdown && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {campaignOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleCampaignOptionClick(option.path)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isDarkMode
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

              {/* Mentor Dropdown for Mobile */}
              <div className="flex flex-col">
                <button
                  onClick={() => setShowMentorDropdown(!showMentorDropdown)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                    } ${showMentorDropdown
                      ? isDarkMode
                        ? "bg-gray-800"
                        : "bg-blue-50"
                      : ""
                    }`}
                >
                  <span>Mentorship</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showMentorDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showMentorDropdown && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {mentorOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleMentorOptionClick(option.path)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isDarkMode
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

              {/* About Dropdown for Mobile */}
              <div className="flex flex-col">
                <button
                  onClick={() => setShowAboutDropdown(!showAboutDropdown)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                    } ${showAboutDropdown
                      ? isDarkMode
                        ? "bg-gray-800"
                        : "bg-blue-50"
                      : ""
                    }`}
                >
                  <span>About</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showAboutDropdown ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showAboutDropdown && (
                  <div className="ml-4 mt-1 flex flex-col gap-1">
                    {aboutOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAboutOptionClick(option.path)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${isDarkMode
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
                onClick={() => handleNavClick("/developer")}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${isDarkMode
                  ? "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 hover:from-pink-500/20 hover:via-purple-500/20 hover:to-indigo-500/20"
                  : "bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20"
                  }`}
              >
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode
                    ? "from-pink-400 via-purple-400 to-indigo-400"
                    : "from-purple-600 via-pink-500 to-orange-500"
                    }`}
                >
                  ✨ Developer
                </span>
              </button>
            </nav>
          </div>

          {/* Bottom Section - Always Visible */}
          <div
            className={`p-4 border-t flex-shrink-0 ${isDarkMode ? "border-gray-800" : "border-blue-200"
              }`}
          >
            {auth ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick("/profile")}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-3 ${isDarkMode
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-blue-50"
                    }`}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>

                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center gap-3 ${isDarkMode
                    ? "text-red-400 hover:bg-gray-800 hover:text-red-500"
                    : "text-red-600 hover:bg-red-50 hover:text-red-700"
                    }`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${isDarkMode
                  ? "bg-white hover:bg-gray-100 text-gray-800"
                  : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
                  } hover:scale-105`}
              >
                <svg
                  className="w-6 h-6"
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
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
