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
  HelpCircle,
  UploadCloud,
  AlertCircle,
  CreditCard,
  Copy,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

// Import or define AuthPopup component
import AuthPopup from "../components/AuthPopup"; // Make sure this path is correct

import { useTheme } from "../context/ThemeContext";

const MentorMentee = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [myMentorships, setMyMentorships] = useState([]);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

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

  const API_BASE = `${BASE_URL}/mentor`;

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const getCurrentUser = () => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsedData = JSON.parse(authData);
        if (parsedData && parsedData.accessToken) {
          return {
            isLoggedIn: true,
            userType: parsedData.userType,
            userId: parsedData.userId,
            name: parsedData.name,
          };
        }
      }
    } catch (e) {
      console.error("Error getting current user:", e);
    }
    return {
      isLoggedIn: false,
      userType: null,
      userId: null,
      name: null,
    };
  };

  const authToken = getAuthToken();

  // Load user's existing mentorship requests
  const loadMyMentorships = async (userParam) => {
    const userToCheck = userParam || currentUser;
    if (!userToCheck?.isLoggedIn || userToCheck?.userType !== "student") return;

    try {
      const response = await axios.get(`${API_BASE}/student/mentorships`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setMyMentorships(response.data.data || []);
    } catch (error) {
      console.error("Error loading mentorships:", error);
    }
  };

  useEffect(() => {
    loadMentors();
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user?.isLoggedIn && user?.userType === "student") {
      loadMyMentorships(user);
    }
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

  // Helper function to check if user already has a request with a mentor
  const hasExistingMentorship = (mentorId) => {
    return myMentorships.some(mentorship => {
      const mId = mentorship.mentor_id?._id || mentorship.mentor_id || mentorship.mentor?.id;
      return mId?.toString() === mentorId?.toString() && (mentorship.status === 'pending' || mentorship.status === 'active');
    });
  };

  const getExistingMentorshipStatus = (mentorId) => {
    // Prioritize active or pending statuses
    const now = new Date();
    const existing = myMentorships.find(mentorship => {
      const mId = mentorship.mentor_id?._id || mentorship.mentor_id || mentorship.mentor?.id;
      const isStillValid = (mentorship.status === 'pending' || mentorship.status === 'active') &&
        (!mentorship.session_date || new Date(mentorship.session_date) >= now);
      return mId?.toString() === mentorId?.toString() && isStillValid;
    }) || myMentorships.find(mentorship => {
      const mId = mentorship.mentor_id?._id || mentorship.mentor_id || mentorship.mentor?.id;
      return mId?.toString() === mentorId?.toString();
    });

    // If we found an active/pending one that is actually expired, treat it as completed
    if (existing && (existing.status === 'active' || existing.status === 'pending') &&
      existing.session_date && new Date(existing.session_date) < now) {
      return 'completed';
    }

    return existing ? existing.status : null;
  };

  const getExistingMentorship = (mentorId) => {
    return myMentorships.find(mentorship => {
      const mId = mentorship.mentor_id?._id || mentorship.mentor_id || mentorship.mentor?.id;
      return mId?.toString() === mentorId?.toString();
    });
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

    // Check if there's already an existing request
    const existingStatus = getExistingMentorshipStatus(selectedMentor.id);
    if (existingStatus) {
      showExistingMentorshipDetails(selectedMentor.id);
      return;
    }

    try {
      setLoading(true);
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("request_message", requestForm.request_message);
      formData.append("session_date", requestForm.session_date);
      formData.append("session_time", requestForm.session_time);
      if (paymentScreenshot) {
        formData.append("payment_screenshot", paymentScreenshot);
      }

      const response = await axios.post(
        `${API_BASE}/mentors/${selectedMentor.id}/request`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh the mentorship list in background
      loadMyMentorships();

      showNotification("🚀 Mentorship request sent successfully! Confirmation email will arrive shortly.", "success");

      // Reset form and close modal FIRST for immediate feedback
      setShowRequestForm(false);
      setSelectedMentor(null);
      setPaymentScreenshot(null);
      setRequestForm({
        request_message: "",
        session_date: "",
        session_time: "",
      });
    } catch (error) {
      console.error("Error sending mentorship request:", error);

      let errorMessage = "Failed to send mentorship request.";
      let errorType = "error";

      if (error.response && error.response.data) {
        if (error.response.data.message && error.response.data.message.includes("already exists")) {
          errorType = "info";
          const statusMatch = error.response.data.message.match(/status: (\w+)/);

          if (statusMatch) {
            const status = statusMatch[1];
            const mentorName = selectedMentor?.name || "this mentor";

            switch (status) {
              case "active":
                errorMessage = `You already have an active mentorship session with ${mentorName}.`;
                break;
              case "pending":
                errorMessage = `You have already sent a mentorship request to ${mentorName}. Your request is currently pending approval.`;
                break;
              case "cancelled":
                errorMessage = `Your previous mentorship request to ${mentorName} was cancelled. Please refresh the page to see updated status.`;
                break;
              default:
                errorMessage = error.response.data.message;
            }
          } else {
            errorMessage = error.response.data.message;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      showNotification(errorMessage, errorType);
    } finally {
      setLoading(false);
    }
  };

  // Function to show existing mentorship details
  const showExistingMentorshipDetails = (mentorId) => {
    const existingMentorship = getExistingMentorship(mentorId);
    const mentor = mentors.find(m => m.id === mentorId);

    if (existingMentorship) {
      const statusMessages = {
        active: {
          title: "✨ Active Mentorship",
          message: `You have an active mentorship session with ${mentor?.name}.`
        },
        pending: {
          title: "⏳ Request Pending",
          message: `Your request to ${mentor?.name} is pending approval.`
        },
        cancelled: {
          title: "❌ Request Cancelled",
          message: `Your previous request to ${mentor?.name} was cancelled.`
        },
        completed: {
          title: "✅ Mentorship Completed",
          message: `Your mentorship with ${mentor?.name} has been successfully completed.`
        }
      };

      const statusInfo = statusMessages[existingMentorship.status] || {
        title: "📋 Request Status",
        message: `Your request to ${mentor?.name} has status: ${existingMentorship.status}`
      };

      // Map status to notification type color
      const typeMap = {
        active: 'success',
        pending: 'warning',
        cancelled: 'error',
        completed: 'success'
      };

      const type = typeMap[existingMentorship.status] || 'info';

      const details = (
        <div className="flex flex-col gap-1.5">
          <span className="font-bold text-lg">{statusInfo.title}</span>
          <span className="opacity-90">{statusInfo.message}</span>
        </div>
      );

      showNotification(details, type);
    }
  };

  // Helper date formatters for notification
  const formatDateTime = (date, time) => {
    if (!date) return "";
    const d = new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return `${d}${time ? `, ${time}` : ""}`;
  };

  const formatRequestDateTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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

    // Check if there's already an active or pending mentorship with this mentor
    const currentStatus = getExistingMentorshipStatus(mentor.id);
    if (currentStatus === "pending" || currentStatus === "active") {
      showExistingMentorshipDetails(mentor.id);
      return;
    }

    // Check if previous request was rejected to show warning
    const wasRejected = myMentorships.some(mentorship => {
      const mId = mentorship.mentor_id?._id || mentorship.mentor_id || mentorship.mentor?.id;
      return mId?.toString() === mentor.id?.toString() && mentorship.status === 'rejected';
    });

    if (wasRejected) {
      if (!window.confirm("⚠️ Your previous session request was rejected. Spamming or misuse will lead to a permanent block from the platform. Do you still want to proceed?")) {
        return;
      }
    }

    setSelectedMentor(mentor);
    setShowRequestForm(true);
  };

  const openProfilePopup = (mentor) => {
    // Check if user is logged in
    if (!currentUser?.isLoggedIn) {
      // Show auth popup instead of profile popup
      setSelectedMentor(mentor);
      setShowAuthPopup(true);
      return;
    }

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
      className={`rounded-xl p-2 sm:p-4 border-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl ${isDarkMode
        ? `bg-gradient-to-br from-slate-900/90 via-${color}-900/30 to-blue-900/20 border-${color}-500/30`
        : `bg-gradient-to-br from-white via-${color}-50/50 to-blue-50/50 border-${color}-300`
        }`}
    >
      <div
        className={`flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl mb-1 sm:mb-3 ${isDarkMode
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
        className={`text-xs font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
      >
        {label}
      </div>
    </div>
  );

  if (loading && mentors.length === 0) {
    return (
      <div
        className={`min-h-screen ${isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
          : "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50"
          }`}
      >
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-cyan-500 border-r-blue-500 border-b-indigo-500 border-l-transparent mx-auto mb-4"></div>
            <p
              className={`text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
      className={`min-h-screen transition-colors duration-500 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
        }`}
    >
      <Header />

      {/* Notification Toast - Enhanced for longer messages */}
      {notification && (
        <div className="fixed top-20 right-4 z-[60] animate-in slide-in-from-right duration-300 max-w-md">
          <div
            className={`rounded-xl shadow-2xl p-4 sm:p-5 border-2 backdrop-blur-lg whitespace-pre-line ${notification.type === "success"
              ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400 text-white"
              : notification.type === "error"
                ? "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400 text-white"
                : notification.type === "info"
                  ? "bg-gradient-to-r from-blue-500/90 to-purple-500/90 border-blue-400 text-white"
                  : "bg-gradient-to-r from-yellow-500/90 to-amber-500/90 border-yellow-400 text-white"
              }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {notification.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : notification.type === "error" ? (
                  <XCircle className="w-5 h-5" />
                ) : notification.type === "info" ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base leading-relaxed">
                  {notification.message}
                </div>
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
            className={`rounded-3xl p-8 shadow-2xl ${isDarkMode
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
                className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
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
              label="My Requests"
              value={myMentorships.length}
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* Main Content - Responsive */}
      <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <div
            className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 shadow-2xl ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/90 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm border-blue-500/20"
              : "bg-gradient-to-br from-white/90 via-cyan-50/50 to-blue-50/50 backdrop-blur-sm border-blue-300"
              }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Available Mentors
              </h2>
              <div
                className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                ✨ {mentors.filter((m) => m.available).length} mentors ready to
                guide you
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {mentors
                .filter((mentor) => mentor.available)
                .map((mentor) => {
                  const existingStatus = getExistingMentorshipStatus(mentor.id);

                  return (
                    <div
                      key={mentor.id}
                      className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 transition-all duration-300 ${existingStatus ? 'hover:scale-[1.02]' : 'hover:scale-105'
                        } ${isDarkMode
                          ? existingStatus
                            ? "bg-gradient-to-br from-slate-800/50 via-blue-900/10 to-indigo-900/10 border-blue-500/20"
                            : "bg-gradient-to-br from-slate-800/70 via-blue-900/20 to-indigo-900/20 border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/20"
                          : existingStatus
                            ? "bg-gradient-to-br from-white/70 via-cyan-50/20 to-blue-50/20 border-blue-200"
                            : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-blue-300 hover:shadow-2xl hover:shadow-cyan-500/20"
                        }`}
                    >
                      {/* Mentor Header */}
                      <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <img
                          src={
                            mentor.alumni?.profilePhoto ||
                            "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                          }
                          alt={mentor.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border-2 border-blue-400/30 shadow-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`font-bold text-base sm:text-lg truncate ${isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                          >
                            {mentor.name}
                          </h3>
                          <p
                            className={`text-xs sm:text-sm flex items-center gap-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                          >
                            <Briefcase size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span className="truncate">
                              {mentor.current_position} at {mentor.company}
                            </span>
                          </p>
                          <p
                            className={`text-xs flex items-center gap-1 mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"
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
                          className={`text-xs sm:text-sm line-clamp-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"
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
                              className={`px-2 py-1 text-xs rounded-full font-medium border ${isDarkMode
                                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border-cyan-400/40"
                                : "bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border-cyan-300"
                                }`}
                            >
                              {topic}
                            </span>
                          ))}
                          {mentor.topics.length > 3 && (
                            <span
                              className={`px-2 py-1 text-xs rounded-full border ${isDarkMode
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
                            className={`text-xs font-medium ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
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
                                  className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"
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
                          className={`flex-1 border-2 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm ${isDarkMode
                            ? "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                            : "border-cyan-300 text-cyan-700 hover:bg-cyan-50"
                            }`}
                        >
                          <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
                          Details
                        </button>

                        {/* Conditionally render Request/Status button */}
                        {canRequestMentorship ? (
                          (existingStatus === "active" || existingStatus === "pending") ? (
                            <button
                              onClick={() => showExistingMentorshipDetails(mentor.id)}
                              className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm ${existingStatus === "active"
                                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30"
                                : existingStatus === "pending"
                                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:shadow-lg hover:shadow-yellow-500/30"
                                  : existingStatus === "cancelled"
                                    ? "bg-gradient-to-r from-gray-500 to-slate-600 text-white hover:shadow-lg hover:shadow-gray-500/30"
                                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                                }`}
                            >
                              {existingStatus === "active" && (
                                <>
                                  <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                                  Active
                                </>
                              )}
                              {existingStatus === "pending" && (
                                <>
                                  <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                                  Pending
                                </>
                              )}
                              {existingStatus === "cancelled" && (
                                <>
                                  <XCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                                  Cancelled
                                </>
                              )}
                              {!["active", "pending", "cancelled"].includes(existingStatus) && (
                                <>
                                  <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                                  {existingStatus.charAt(0).toUpperCase() + existingStatus.slice(1)}
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => openRequestForm(mentor)}
                              className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm"
                            >
                              <Send size={12} className="sm:w-3.5 sm:h-3.5" />
                              Request
                            </button>
                          )
                        ) : (
                          <button
                            disabled
                            className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm ${isDarkMode
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
                  );
                })}
            </div>

            {mentors.filter((m) => m.available).length === 0 && (
              <div className="text-center py-12">
                <Users
                  className={`mx-auto mb-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  size={48}
                />
                <h3
                  className={`text-lg font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-900"
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

      <Footer />

      {/* Profile Details Popup */}
      {showProfilePopup && selectedMentor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div
              className={`rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-full overflow-hidden ${isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
                : "bg-gradient-to-br from-white via-cyan-50 to-blue-50/80 border-2 border-blue-200 backdrop-blur-sm"
                }`}
            >
              <div
                className={`sticky top-0 p-4 sm:p-6 border-b-2 backdrop-blur-sm ${isDarkMode
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
                    className={`p-2 rounded-lg transition-colors ${isDarkMode
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
                        className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
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
                          className={`flex items-center gap-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                        className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
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
                        className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
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
                      className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
                        }`}
                    >
                      Expertise & Experience
                    </h4>
                    <p
                      className={`rounded-xl p-4 text-sm ${isDarkMode
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
                      className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
                        }`}
                    >
                      Mentorship Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.topics.map((topic, index) => (
                        <span
                          key={index}
                          className={`px-3 py-2 rounded-lg font-medium border text-sm ${isDarkMode
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
                      className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-cyan-300" : "text-cyan-600"
                        }`}
                    >
                      Availability Schedule
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(selectedMentor.availability).map(
                        ([day, slots]) => (
                          <div
                            key={day}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl gap-2 ${isDarkMode
                              ? "bg-slate-800/50"
                              : "bg-white border border-gray-200 shadow-sm"
                              }`}
                          >
                            <span
                              className={`font-medium capitalize text-sm ${isDarkMode ? "text-gray-200" : "text-gray-800"
                                }`}
                            >
                              {getDayDisplayName(day)}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {slots.map((slot, index) => (
                                <span
                                  key={index}
                                  className={`px-3 py-1 rounded text-sm border ${isDarkMode
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
                className={`sticky bottom-0 p-4 border-t-2 ${isDarkMode
                  ? "border-blue-500/30 bg-slate-900/90"
                  : "border-blue-200 bg-white/90"
                  }`}
              >
                {canRequestMentorship ? (
                  (() => {
                    const existingStatus = getExistingMentorshipStatus(selectedMentor.id);
                    if (existingStatus === "active" || existingStatus === "pending") {
                      return (
                        <button
                          onClick={() => {
                            setShowProfilePopup(false);
                            showExistingMentorshipDetails(selectedMentor.id);
                          }}
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${existingStatus === "active"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30"
                            : existingStatus === "pending"
                              ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:shadow-lg hover:shadow-yellow-500/30"
                              : existingStatus === "cancelled"
                                ? "bg-gradient-to-r from-gray-500 to-slate-600 text-white hover:shadow-lg hover:shadow-gray-500/30"
                                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                            }`}
                        >
                          {existingStatus === "active" && (
                            <>
                              <CheckCircle size={16} />
                              View Active Mentorship
                            </>
                          )}
                          {existingStatus === "pending" && (
                            <>
                              <Clock size={16} />
                              View Pending Request
                            </>
                          )}
                          {existingStatus === "cancelled" && (
                            <>
                              <XCircle size={16} />
                              View Cancelled Request
                            </>
                          )}
                          {!["active", "pending", "cancelled"].includes(existingStatus) && (
                            <>
                              <CheckCircle size={16} />
                              View {existingStatus.charAt(0).toUpperCase() + existingStatus.slice(1)} Request
                            </>
                          )}
                        </button>
                      );
                    } else {
                      return (
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
                      );
                    }
                  })()
                ) : (
                  <button
                    disabled
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${isDarkMode
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
            className={`rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh] ${isDarkMode
              ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
              : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-2 border-blue-300"
              }`}
          >
            <div
              className={`sticky top-0 p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl border-b-2 backdrop-blur-sm ${isDarkMode
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
                    className={`text-xs sm:text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    Send request to {selectedMentor.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode
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
              className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar flex-1"
            >
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-28 sm:h-32 text-sm sm:text-base ${isDarkMode
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
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                    className={`w-full px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${isDarkMode
                      ? "bg-slate-800/50 border-blue-500/30 text-white"
                      : "bg-white border-blue-300 text-gray-900"
                      }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                    className={`w-full px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${isDarkMode
                      ? "bg-slate-800/50 border-blue-500/30 text-white"
                      : "bg-white border-blue-300 text-gray-900"
                      }`}
                  />
                </div>
              </div>

              {/* Payment Section */}
              {selectedMentor.fees > 0 && (
                <div className={`p-4 rounded-xl border-2 ${isDarkMode ? 'bg-slate-800/30 border-blue-500/20' : 'bg-blue-50/30 border-blue-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-600'}`}>Payment Details</h4>
                    <div className="text-orange-500 font-bold">₹{selectedMentor.fees}</div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mentor's UPI ID</p>
                      <HelpCircle size={12} className="text-gray-400" />
                    </div>
                    <div className={`p-3 rounded-xl border-2 flex items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-blue-100'}`}>
                      <code className="text-sm font-mono font-bold text-blue-500">{selectedMentor.upi_id || 'Not Provided'}</code>
                      {selectedMentor.upi_id && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedMentor.upi_id);
                            showNotification("UPI ID copied!", "success");
                          }}
                          className="text-blue-500 text-xs flex items-center gap-1 hover:text-blue-600"
                        >
                          <Copy size={14} />
                          Copy
                        </button>
                      )}
                    </div>
                  </div>

                  {selectedMentor.upi_id && (
                    <div className="flex flex-col items-center mb-4">
                      <div className="bg-white p-2 rounded-lg shadow-sm mb-2">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${selectedMentor.upi_id}&pn=${selectedMentor.name}&am=${selectedMentor.fees}&cu=INR`)}`}
                          alt="UPI QR Code"
                          className="w-28 h-28"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">Scan to pay ₹{selectedMentor.fees}</p>
                    </div>
                  )}

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Payment Screenshot *
                    </label>
                    <div
                      className={`cursor-pointer border-2 border-dashed rounded-xl p-6 transition-all group ${paymentScreenshot
                        ? (isDarkMode ? 'border-green-500/50 bg-green-500/10' : 'border-green-500 bg-green-50/50')
                        : (isDarkMode ? 'border-indigo-500/30 hover:border-indigo-500 hover:bg-indigo-500/5' : 'border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/50')
                        }`}
                      onClick={() => document.getElementById('payment_screenshot').click()}
                    >
                      <input
                        type="file"
                        id="payment_screenshot"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setIsUploadingImage(true);
                            setPaymentScreenshot(file);
                            // Simulate upload feedback delay
                            setTimeout(() => setIsUploadingImage(false), 800);
                          }
                        }}
                        className="hidden"
                        required
                      />

                      {isUploadingImage ? (
                        <div className="flex flex-col items-center py-4">
                          <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3"></div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uploading to Cloudinary...</p>
                        </div>
                      ) : paymentScreenshot ? (
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mb-2 shadow-lg shadow-green-500/30 font-bold text-xl">
                            ✓
                          </div>
                          <p className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Screenshot Ready</p>
                          <p className={`text-xs mt-1 max-w-[200px] truncate ${isDarkMode ? 'text-green-500/70' : 'text-green-600/70'}`}>
                            {paymentScreenshot.name}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-2 group-hover:scale-105 transition-transform duration-300">
                          <div className={`p-3 rounded-full mb-3 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                            <UploadCloud size={28} />
                          </div>
                          <p className={`text-base font-semibold mb-1 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                            Click to upload screenshot
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            JPG, PNG (max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 italic flex items-center gap-1">
                      <AlertCircle size={10} />
                      Upload proof of payment before sending request
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-colors font-medium text-sm sm:text-base ${isDarkMode
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

      {/* Auth Popup for non-logged in users */}
      {showAuthPopup && selectedMentor && (
        <AuthPopup
          isOpen={showAuthPopup}
          onClose={() => {
            setShowAuthPopup(false);
            setSelectedMentor(null);
          }}
          isAuthenticated={currentUser?.isLoggedIn || false}
          onLoginSuccess={() => {
            if (selectedMentor) {
              // Store mentor info to open profile after login
              localStorage.setItem('pendingProfileView', JSON.stringify({
                mentorId: selectedMentor.id,
                timestamp: Date.now()
              }));
            }
          }}
        />
      )}
    </div>
  );
};

export default MentorMentee;