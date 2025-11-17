import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Send,
  X,
  CheckCircle,
  XCircle,
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock,
  Sparkles,
  Calendar,
  MapPin,
  ExternalLink,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

const MentorMentee = ({ isDarkMode = false, toggleTheme = () => {} }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const [requestForm, setRequestForm] = useState({
    request_message: "",
    session_date: "",
    session_time: "",
  });

  const API_BASE = "https://alumni-mits-l45r.onrender.com/mentor";

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const getCurrentUser = () => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsedData = JSON.parse(authData);
      return {
        isLoggedIn: true,
        userType: parsedData.userType,
        userId: parsedData.userId,
        name: parsedData.name,
      };
    }
    return {
      isLoggedIn: false,
      userType: null,
      userId: null,
      name: null,
    };
  };

  const authToken = getAuthToken();

  useEffect(() => {
    loadMentors();
    setCurrentUser(getCurrentUser());
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/all`);

      // Transform data to convert Decimal objects
      const transformedMentors = response.data.data.map((mentor) => ({
        ...mentor,
        fees:
          mentor.fees &&
          typeof mentor.fees === "object" &&
          mentor.fees.$numberDecimal
            ? parseFloat(mentor.fees.$numberDecimal)
            : mentor.fees,
      }));

      setMentors(transformedMentors);
    } catch (error) {
      console.error("Error loading mentors:", error);
      showNotification("Failed to load mentors. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const sendMentorshipRequest = async (e) => {
    e.preventDefault();

    // Check if user is logged in and is a student
    if (!currentUser.isLoggedIn) {
      showNotification("Please log in to send mentorship requests.", "error");
      return;
    }

    if (currentUser.userType !== "student") {
      showNotification("Only students can send mentorship requests.", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/mentors/${selectedMentor.id}/request`,
        requestForm,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowRequestForm(false);
      setSelectedMentor(null);
      setRequestForm({
        request_message: "",
        session_date: "",
        session_time: "",
      });
      showNotification("🚀 Mentorship request sent successfully!", "success");
    } catch (error) {
      console.error("Error sending mentorship request:", error);
      showNotification("Failed to send mentorship request.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openRequestForm = (mentor) => {
    // Check if user is logged in and is a student
    if (!currentUser.isLoggedIn) {
      showNotification("Please log in to send mentorship requests.", "error");
      return;
    }

    if (currentUser.userType !== "student") {
      showNotification("Only students can send mentorship requests.", "error");
      return;
    }

    setSelectedMentor(mentor);
    setShowRequestForm(true);
  };

  const openProfilePopup = (mentor) => {
    setSelectedMentor(mentor);
    setShowProfilePopup(true);
  };

  const formatTimeSlot = (slot) => {
    return `${slot.from} - ${slot.to}`;
  };

  const getDayDisplayName = (day) => {
    const dayMap = {
      sunday: "Sunday",
      saturday: "Saturday",
      other_days: "Weekdays",
    };
    return dayMap[day] || day;
  };

  // Check if user can request mentorship
  const canRequestMentorship =
    currentUser?.isLoggedIn && currentUser?.userType === "student";

  const StatCard = ({ icon: Icon, label, value, color = "purple" }) => (
    <div
      className={`rounded-xl p-2 sm:p-4 border-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl ${
        isDarkMode
          ? `bg-gradient-to-br from-slate-900/90 via-${color}-900/30 to-blue-900/20 border-${color}-500/30`
          : `bg-gradient-to-br from-white via-${color}-50/50 to-blue-50/50 border-${color}-300`
      }`}
    >
      <div
        className={`flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl mb-1 sm:mb-3 ${
          isDarkMode
            ? `bg-gradient-to-br from-${color}-500/30 to-blue-500/20`
            : `bg-gradient-to-br from-${color}-100 to-blue-100`
        }`}
      >
        <Icon className={`text-${color}-500`} size={14} />
      </div>
      <div className="text-sm sm:text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
        {value}
      </div>
      <div
        className={`text-xs font-medium ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </div>
    </div>
  );

  if (loading && mentors.length === 0) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
            : "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50"
        }`}
      >
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-cyan-500 border-r-blue-500 border-b-indigo-500 border-l-transparent mx-auto mb-4"></div>
            <p
              className={`text-sm sm:text-base ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading mentorship platform...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-[60] animate-in slide-in-from-right duration-300">
          <div
            className={`rounded-xl shadow-2xl p-4 sm:p-5 max-w-sm border-2 backdrop-blur-lg ${
              notification.type === "success"
                ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400 text-white"
                : notification.type === "error"
                ? "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400 text-white"
                : "bg-gradient-to-r from-blue-500/90 to-purple-500/90 border-blue-400 text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <CheckCircle className="w-6 h-6" />
                ) : notification.type === "error" ? (
                  <XCircle className="w-6 h-6" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm sm:text-base">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70]">
          <div
            className={`rounded-3xl p-8 shadow-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 to-blue-900/50"
                : "bg-gradient-to-br from-white to-blue-50"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-blue-500 animate-spin"></div>
              </div>
              <p
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Processing...
              </p>
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Responsive */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              MITS Mentorship
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-base sm:text-xl lg:text-2xl mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            Connect • Learn • Grow Together
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            <StatCard
              icon={Users}
              label="Available Mentors"
              value={mentors.filter((m) => m.available).length}
              color="cyan"
            />
            <StatCard
              icon={Briefcase}
              label="Total Mentors"
              value={mentors.length}
              color="blue"
            />
            <StatCard
              icon={GraduationCap}
              label="Active Sessions"
              value={mentors.filter((m) => m.available).length}
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Main Content - Responsive */}
      <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <div
            className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 shadow-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900/90 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm border-blue-500/20"
                : "bg-gradient-to-br from-white/90 via-cyan-50/50 to-blue-50/50 backdrop-blur-sm border-blue-300"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Available Mentors
              </h2>
              <div
                className={`text-xs sm:text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                ✨ {mentors.filter((m) => m.available).length} mentors ready to
                guide you
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {mentors
                .filter((mentor) => mentor.available)
                .map((mentor) => (
                  <div
                    key={mentor.id}
                    className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-slate-800/70 via-blue-900/20 to-indigo-900/20 border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/20"
                        : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-blue-300 hover:shadow-2xl hover:shadow-cyan-500/20"
                    }`}
                  >
                    {/* Mentor Header */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <img
                        src={
                          mentor.alumni?.profilePhoto ||
                          "https://img.freepik.com/premium-vector/man-avatar-glasses-young_594966-9.jpg"
                        }
                        alt={mentor.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border-2 border-blue-400/30 shadow-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-bold text-base sm:text-lg truncate ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {mentor.name}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm flex items-center gap-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <Briefcase size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span className="truncate">
                            {mentor.current_position} at {mentor.company}
                          </span>
                        </p>
                        <p
                          className={`text-xs flex items-center gap-1 mt-1 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <GraduationCap
                            size={12}
                            className="sm:w-3.5 sm:h-3.5"
                          />
                          Batch {mentor.batch_year} • {mentor.branch}
                        </p>
                      </div>
                    </div>

                    {/* Expertise */}
                    <div className="mb-3 sm:mb-4">
                      <p
                        className={`text-xs sm:text-sm line-clamp-2 ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {mentor.expertise}
                      </p>
                    </div>

                    {/* Topics */}
                    <div className="mb-3 sm:mb-4">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {mentor.topics.slice(0, 3).map((topic, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 text-xs rounded-full font-medium border ${
                              isDarkMode
                                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border-cyan-400/40"
                                : "bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border-cyan-300"
                            }`}
                          >
                            {topic}
                          </span>
                        ))}
                        {mentor.topics.length > 3 && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${
                              isDarkMode
                                ? "bg-gray-700/50 text-gray-300 border-gray-600/40"
                                : "bg-gray-200 text-gray-700 border-gray-400"
                            }`}
                          >
                            +{mentor.topics.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="mb-3 sm:mb-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Clock size={12} className="text-cyan-400" />
                        <span
                          className={`text-xs font-medium ${
                            isDarkMode ? "text-cyan-300" : "text-cyan-600"
                          }`}
                        >
                          Available Time Slots
                        </span>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(mentor.availability)
                          .slice(0, 2)
                          .map(([day, slots]) => (
                            <div
                              key={day}
                              className="flex justify-between items-center text-xs"
                            >
                              <span
                                className={
                                  isDarkMode ? "text-gray-300" : "text-gray-600"
                                }
                              >
                                {getDayDisplayName(day)}
                              </span>
                              <span
                                className={`font-medium ${
                                  isDarkMode ? "text-gray-200" : "text-gray-800"
                                }`}
                              >
                                {formatTimeSlot(slots[0])}
                              </span>
                            </div>
                          ))}
                        {Object.keys(mentor.availability).length > 2 && (
                          <div className="text-xs text-center pt-1">
                            <span
                              className={
                                isDarkMode ? "text-cyan-300" : "text-cyan-600"
                              }
                            >
                              +{Object.keys(mentor.availability).length - 2}{" "}
                              more days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fees & Availability */}
                    <div className="flex justify-between items-center mb-4 sm:mb-4">
                      <div className="flex items-center gap-1 text-orange-400 font-bold text-sm sm:text-base">
                        <DollarSign size={14} className="sm:w-4 sm:h-4" />
                        <span>₹{mentor.fees}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-400 text-xs sm:text-sm font-medium">
                        <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span>Available</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openProfilePopup(mentor)}
                        className={`flex-1 border-2 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm ${
                          isDarkMode
                            ? "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                            : "border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                        }`}
                      >
                        <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
                        Details
                      </button>

                      {/* Conditionally render Request button */}
                      {canRequestMentorship ? (
                        <button
                          onClick={() => openRequestForm(mentor)}
                          className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm"
                        >
                          <Send size={12} className="sm:w-3.5 sm:h-3.5" />
                          Request
                        </button>
                      ) : (
                        <button
                          disabled
                          className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm ${
                            isDarkMode
                              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          <Send size={12} className="sm:w-3.5 sm:h-3.5" />
                          {!currentUser?.isLoggedIn
                            ? "Login to Request"
                            : "Students Only"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {mentors.filter((m) => m.available).length === 0 && (
              <div className="text-center py-12">
                <Users
                  className={`mx-auto mb-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                  size={48}
                />
                <h3
                  className={`text-lg font-medium mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  No mentors available
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  Check back later for available mentors.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />

      {/* Profile Details Popup */}
      {showProfilePopup && selectedMentor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div
              className={`rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-full overflow-hidden ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
                  : "bg-gradient-to-br from-white via-cyan-50 to-blue-50/80 border-2 border-blue-200 backdrop-blur-sm"
              }`}
            >
              <div
                className={`sticky top-0 p-4 sm:p-6 border-b-2 backdrop-blur-sm ${
                  isDarkMode
                    ? "border-blue-500/30 bg-slate-900/90"
                    : "border-blue-200 bg-white/90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    Mentor Profile
                  </h2>
                  <button
                    onClick={() => setShowProfilePopup(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-slate-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 p-4 sm:p-6">
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <img
                      src={
                        selectedMentor.alumni?.profilePhoto ||
                        "https://img.freepik.com/premium-vector/man-avatar-glasses-young_594966-9.jpg"
                      }
                      alt={selectedMentor.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-400/30 shadow-lg"
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-xl sm:text-2xl font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {selectedMentor.name}
                      </h3>
                      <p className="text-cyan-500 text-sm sm:text-base">
                        {selectedMentor.current_position} at{" "}
                        {selectedMentor.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm">
                        <span
                          className={`flex items-center gap-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <GraduationCap size={14} />
                          Batch {selectedMentor.batch_year} •{" "}
                          {selectedMentor.branch}
                        </span>
                        <span className="flex items-center gap-1 text-green-500">
                          <Clock size={14} />
                          Available for mentorship
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4
                        className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? "text-cyan-300" : "text-cyan-600"
                        }`}
                      >
                        Contact Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          <strong>Email:</strong> {selectedMentor.email}
                        </p>
                        <p
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          <strong>Phone:</strong> {selectedMentor.phone}
                        </p>
                        {selectedMentor.linkedin_url && (
                          <p
                            className={
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            <strong>LinkedIn:</strong>{" "}
                            <a
                              href={selectedMentor.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 underline"
                            >
                              View Profile
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? "text-cyan-300" : "text-cyan-600"
                        }`}
                      >
                        Session Fees
                      </h4>
                      <div className="flex items-center gap-2 text-xl font-bold text-orange-500">
                        <DollarSign size={20} />
                        <span>₹{selectedMentor.fees}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expertise */}
                  <div>
                    <h4
                      className={`text-sm font-semibold mb-3 ${
                        isDarkMode ? "text-cyan-300" : "text-cyan-600"
                      }`}
                    >
                      Expertise & Experience
                    </h4>
                    <p
                      className={`rounded-xl p-4 text-sm ${
                        isDarkMode
                          ? "bg-slate-800/50 text-gray-200"
                          : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                      }`}
                    >
                      {selectedMentor.expertise}
                    </p>
                  </div>

                  {/* Topics */}
                  <div>
                    <h4
                      className={`text-sm font-semibold mb-3 ${
                        isDarkMode ? "text-cyan-300" : "text-cyan-600"
                      }`}
                    >
                      Mentorship Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.topics.map((topic, index) => (
                        <span
                          key={index}
                          className={`px-3 py-2 rounded-lg font-medium border text-sm ${
                            isDarkMode
                              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border-cyan-400/40"
                              : "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 border-cyan-200 shadow-sm"
                          }`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Availability Schedule */}
                  <div>
                    <h4
                      className={`text-sm font-semibold mb-3 ${
                        isDarkMode ? "text-cyan-300" : "text-cyan-600"
                      }`}
                    >
                      Availability Schedule
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(selectedMentor.availability).map(
                        ([day, slots]) => (
                          <div
                            key={day}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl gap-2 ${
                              isDarkMode
                                ? "bg-slate-800/50"
                                : "bg-white border border-gray-200 shadow-sm"
                            }`}
                          >
                            <span
                              className={`font-medium capitalize text-sm ${
                                isDarkMode ? "text-gray-200" : "text-gray-800"
                              }`}
                            >
                              {getDayDisplayName(day)}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {slots.map((slot, index) => (
                                <span
                                  key={index}
                                  className={`px-3 py-1 rounded text-sm border ${
                                    isDarkMode
                                      ? "bg-slate-700 text-gray-200 border-slate-600"
                                      : "bg-cyan-50 text-cyan-700 border-cyan-200"
                                  }`}
                                >
                                  {formatTimeSlot(slot)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`sticky bottom-0 p-4 border-t-2 ${
                  isDarkMode
                    ? "border-blue-500/30 bg-slate-900/90"
                    : "border-blue-200 bg-white/90"
                }`}
              >
                {canRequestMentorship ? (
                  <button
                    onClick={() => {
                      setShowProfilePopup(false);
                      openRequestForm(selectedMentor);
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Request Mentorship
                  </button>
                ) : (
                  <button
                    disabled
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
                    }`}
                  >
                    <Send size={16} />
                    {!currentUser?.isLoggedIn
                      ? "Login to Request Mentorship"
                      : "Students Only"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mentorship Request Form Modal - Responsive */}
      {showRequestForm && selectedMentor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
                : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-2 border-blue-300"
            }`}
          >
            <div
              className={`sticky top-0 p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl border-b-2 backdrop-blur-sm ${
                isDarkMode
                  ? "border-blue-500/30 bg-slate-900/90"
                  : "border-blue-300 bg-white/90"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    Request Mentorship
                  </h2>
                  <p
                    className={`text-xs sm:text-sm mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Send request to {selectedMentor.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-slate-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form
              onSubmit={sendMentorshipRequest}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Your Message *
                </label>
                <textarea
                  value={requestForm.request_message}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      request_message: e.target.value,
                    })
                  }
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-28 sm:h-32 text-sm sm:text-base ${
                    isDarkMode
                      ? "bg-slate-800/50 border-blue-500/30 text-white"
                      : "bg-white border-blue-300 text-gray-900"
                  }`}
                  placeholder="Introduce yourself and explain why you're interested in mentorship..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={requestForm.session_date}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        session_date: e.target.value,
                      })
                    }
                    className={`w-full px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${
                      isDarkMode
                        ? "bg-slate-800/50 border-blue-500/30 text-white"
                        : "bg-white border-blue-300 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={requestForm.session_time}
                    onChange={(e) =>
                      setRequestForm({
                        ...requestForm,
                        session_time: e.target.value,
                      })
                    }
                    className={`w-full px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${
                      isDarkMode
                        ? "bg-slate-800/50 border-blue-500/30 text-white"
                        : "bg-white border-blue-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-colors font-medium text-sm sm:text-base ${
                    isDarkMode
                      ? "border-blue-500/30 text-gray-300 hover:bg-slate-800"
                      : "border-blue-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={14} className="sm:w-4 sm:h-4" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorMentee;
