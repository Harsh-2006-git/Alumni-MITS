import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MessageSquare,
  Target,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  Users,
  X,
  CreditCard,
  Video,
  Download,
  AlertTriangle,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

// Date and time formatting utilities
const formatDate = (dateString) => {
  if (!dateString) return "Not scheduled";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const formatTime = (timeString) => {
  if (!timeString) return "";

  try {
    // Handle both "HH:MM" and "HH:MM:SS" formats
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const minute = minutes || "00";

    // Convert to 12-hour format with AM/PM
    const ampm = hour >= 12 ? "PM" : "AM";
    const twelveHour = hour % 12 || 12;

    return `${twelveHour}:${minute.padStart(2, "0")} ${ampm}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString;
  }
};

const formatDateTime = (dateString, timeString) => {
  if (!dateString) return "Not scheduled";

  const formattedDate = formatDate(dateString);
  const formattedTime = formatTime(timeString);

  if (!formattedTime) return formattedDate;

  return `${formattedDate} at ${formattedTime}`;
};

const formatRequestDateTime = (dateString, timeString) => {
  if (!dateString) return "Unknown date";

  const formattedDate = formatDate(dateString);
  const formattedTime = formatTime(timeString);

  return `${formattedDate} • ${formattedTime}`;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return "";
  }
};

const formatTimeForInput = (timeString) => {
  if (!timeString) return "";
  // Ensure we only have HH:MM
  return timeString.split(":").slice(0, 2).join(":");
};

// Check if session is upcoming
const isUpcomingSession = (sessionDate, sessionTime) => {
  if (!sessionDate) return false;

  try {
    const sessionDateTime = new Date(sessionDate);
    if (sessionTime) {
      const [hours, minutes] = sessionTime.split(":");
      sessionDateTime.setHours(
        parseInt(hours, 10),
        parseInt(minutes, 10),
        0,
        0
      );
    }

    const now = new Date();
    return sessionDateTime > now;
  } catch (error) {
    console.error("Error checking session date:", error);
    return false;
  }
};

const MentorshipRequestsPage = ({
  isDarkMode = false,
  toggleTheme = () => { },
}) => {
  const [myMentorships, setMyMentorships] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [formAction, setFormAction] = useState(""); // "accept", "reject", or "update"

  const [sessionForm, setSessionForm] = useState({
    session_date: "",
    session_time: "",
    mentor_notes: "",
    reschedule_message: "",
    reschedule_date: "",
    reschedule_time: "",
    meeting_link: "",
  });
  const [notification, setNotification] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
  const API_BASE = `${BASE_URL}/mentor`;

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };


  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const authToken = getAuthToken();
  const userData = JSON.parse(localStorage.getItem("auth") || "{}");
  const userType = userData.userType;
  const isLoggedIn = !!authToken;

  useEffect(() => {
    if (isLoggedIn) {
      if (userType === "student") {
        loadMyMentorships();
      } else if (userType === "alumni") {
        loadMentorRequests();
      }
    }
  }, [userType, isLoggedIn]);

  const loadMyMentorships = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/student/my-mentorships`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("Student mentorships:", response.data);
      setMyMentorships(response.data.data || []);
    } catch (error) {
      console.error("Error loading mentorships:", error);
      setMyMentorships([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMentorRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/mentor/requests`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("Mentor requests:", response.data);
      setMentorRequests(response.data.data || []);
    } catch (error) {
      console.error("Error loading mentor requests:", error);
      setMentorRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (requestId, action) => {
    try {
      setLoading(true);
      console.log(`Responding to request ${requestId} with action: ${action}`);

      const response = await axios.put(
        `${API_BASE}/requests/${requestId}/respond`,
        {
          action: action, // "accept", "reject", "verify_payment", "request_reschedule"
          mentor_notes: sessionForm.mentor_notes,
          session_date: sessionForm.session_date,
          session_time: sessionForm.session_time,
          reschedule_message: sessionForm.reschedule_message,
          reschedule_date: sessionForm.reschedule_date,
          reschedule_time: sessionForm.reschedule_time,
          meeting_link: sessionForm.meeting_link,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response successful:", response.data);
      setShowSessionForm(false);
      setSelectedMentorship(null);
      setSessionForm({ session_date: "", session_time: "", mentor_notes: "" });
      setFormAction("");

      // Show success notification based on action
      const successMessages = {
        accept: "Mentorship request accepted!",
        reject: "Mentorship request rejected.",
        verify_payment: "Payment verified successfully!",
        request_reschedule: "Reschedule request sent.",
      };
      showNotification(successMessages[action] || "Action completed successfully!", "success");

      // Reload data
      await loadMentorRequests();
    } catch (error) {
      console.error("Error responding to request:", error);
      showNotification(error.response?.data?.message || "Failed to respond to request. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // If alumni is accepting/rejecting
      if (userType === "alumni" && formAction) {
        if (formAction === "add_link") {
          // Continue to session update logic below
        } else {
          await respondToRequest(selectedMentorship.id, formAction);
          return;
        }
      }

      // For student session updates or alumni adding link
      let endpoint;
      if (userType === "student" || (userType === "alumni" && formAction === "add_link")) {
        endpoint = `${API_BASE}/mentorships/${selectedMentorship.id}/session`;
      } else {
        console.error("Invalid user type for session update");
        return;
      }

      const response = await axios.put(endpoint, sessionForm, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Session update successful:", response.data);
      setShowSessionForm(false);
      setSelectedMentorship(null);
      setSessionForm({ session_date: "", session_time: "", mentor_notes: "" });
      setFormAction("");

      // Reload data
      if (userType === "student") {
        await loadMyMentorships();
      } else if (userType === "alumni") {
        await loadMentorRequests();
      }

      showNotification("Session details updated successfully!", "success");
    } catch (error) {
      console.error("Error updating session:", error);
      showNotification(error.response?.data?.message || "Failed to update session. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (mentorship) => {
    await respondToRequest(mentorship.id, "verify_payment");
  };

  const openSessionForm = (mentorship, action = "update") => {
    setSelectedMentorship(mentorship);
    setFormAction(action);

    // If it's a student responding to a reschedule, pre-fill with the mentor's proposed time
    const isStudentRescheduleResponse = userType === "student" && mentorship.reschedule_requested;

    // Pre-fill form with existing data
    setSessionForm({
      session_date: formatDateForInput(isStudentRescheduleResponse ? (mentorship.reschedule_date || mentorship.session_date) : (mentorship.session_date || "")),
      session_time: formatTimeForInput(isStudentRescheduleResponse ? (mentorship.reschedule_time || mentorship.session_time) : (mentorship.session_time || "")),
      mentor_notes: mentorship.mentor_notes || "",
      reschedule_message: "",
      reschedule_date: formatDateForInput(mentorship.reschedule_date || ""),
      reschedule_time: formatTimeForInput(mentorship.reschedule_time || ""),
      meeting_link: mentorship.meeting_link || "",
    });

    setShowSessionForm(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40",
      active: "bg-green-400/20 text-green-300 border-green-400/40",
      completed: "bg-blue-400/20 text-blue-300 border-blue-400/40",
      cancelled: "bg-red-400/20 text-red-300 border-red-400/40",
      rejected: "bg-red-400/20 text-red-300 border-red-400/40",
    };
    return colors[status] || "bg-gray-400/20 text-gray-300 border-gray-400/40";
  };

  const getStatusDisplayText = (status) => {
    const statusMap = {
      pending: "Pending",
      active: "Active",
      completed: "Completed",
      cancelled: "Cancelled",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  };

  // Filter active mentorships with upcoming sessions for students
  const upcomingStudentMentorships = myMentorships.filter(
    (mentorship) =>
      mentorship.status === "active" &&
      isUpcomingSession(mentorship.session_date, mentorship.session_time)
  );

  // All student mentorships (including pending, rejected, etc.)
  const allStudentMentorships = myMentorships;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
        : "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 text-gray-900"
        }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
            <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              {userType === "student"
                ? "My Mentorships"
                : "Mentorship Requests"}
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-base sm:text-xl lg:text-2xl mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            {userType === "student"
              ? "Track Your Learning Journey"
              : "Manage Student Requests"}
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <div
            className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 shadow-2xl ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/90 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm border-blue-500/20"
              : "bg-gradient-to-br from-white/90 via-cyan-50/50 to-blue-50/50 backdrop-blur-sm border-blue-300"
              }`}
          >
            {/* Not Logged In View */}
            {!isLoggedIn && (
              <div className="text-center py-12">
                <Users
                  className={`mx-auto mb-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  size={64}
                />
                <h2
                  className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                >
                  Please Log In
                </h2>
                <p
                  className={`text-lg mb-6 max-w-md mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  You need to be logged in to view your mentorship requests and
                  activities.
                </p>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Log In Now
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                <p
                  className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  Loading...
                </p>
              </div>
            )}

            {/* Student View */}
            {isLoggedIn && userType === "student" && !loading && (
              <div className="space-y-8">
                {/* Upcoming Sessions Section */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4 sm:mb-6">
                    Upcoming Sessions
                  </h2>

                  {upcomingStudentMentorships.length === 0 ? (
                    <div className="text-center py-8 rounded-2xl border-2 border-dashed p-8">
                      <Calendar
                        className={`mx-auto mb-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        size={48}
                      />
                      <h3
                        className={`text-lg font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                      >
                        No upcoming sessions
                      </h3>
                      <p
                        className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        You don't have any upcoming mentorship sessions
                        scheduled.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {upcomingStudentMentorships.map((mentorship) => (
                        <MentorshipCard
                          key={mentorship.id}
                          mentorship={mentorship}
                          isDarkMode={isDarkMode}
                          onUpdateSession={openSessionForm}
                          userType="student"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* All Mentorship Requests Section */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4 sm:mb-6">
                    All Mentorship Requests
                  </h2>

                  {allStudentMentorships.length === 0 ? (
                    <div className="text-center py-8 rounded-2xl border-2 border-dashed p-8">
                      <Target
                        className={`mx-auto mb-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                        size={48}
                      />
                      <h3
                        className={`text-lg font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                      >
                        No mentorship requests
                      </h3>
                      <p
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        You haven't sent any mentorship requests yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {allStudentMentorships.map((mentorship) => (
                        <MentorshipCard
                          key={mentorship.id}
                          mentorship={mentorship}
                          isDarkMode={isDarkMode}
                          onUpdateSession={openSessionForm}
                          userType="student"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Alumni View */}
            {isLoggedIn && userType === "alumni" && !loading && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-4 sm:mb-6">
                  Mentorship Requests
                </h2>

                {mentorRequests.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl border-2 border-dashed p-8">
                    <Target
                      className={`mx-auto mb-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      size={48}
                    />
                    <h3
                      className={`text-lg font-medium mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                      No requests yet
                    </h3>
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      When students send you mentorship requests, they'll appear
                      here.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {mentorRequests.map((request) => (
                      <MentorshipCard
                        key={request.id}
                        mentorship={request}
                        isDarkMode={isDarkMode}
                        onAccept={(req) => openSessionForm(req, "accept")}
                        onReject={(req) => openSessionForm(req, "reject")}
                        onVerifyPayment={(req) => handleVerifyPayment(req)}
                        onReschedule={(req) => openSessionForm(req, "request_reschedule")}
                        onAddMeetingLink={(req) => openSessionForm(req, "add_link")}
                        userType="alumni"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 left-4 right-4 sm:left-auto sm:right-4 z-[100] animate-in slide-in-from-right duration-300 max-w-md">
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
                <p className="font-semibold text-sm sm:text-base leading-relaxed">
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

      {/* Session Form Modal */}
      {showSessionForm && selectedMentorship && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-3xl max-w-md w-full shadow-2xl ${isDarkMode
              ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
              : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-2 border-blue-300"
              }`}
          >
            <div
              className={`p-6 rounded-t-3xl border-b-2 backdrop-blur-sm ${isDarkMode
                ? "border-blue-500/30 bg-slate-900/90"
                : "border-blue-300 bg-white/90"
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    {userType === "alumni"
                      ? (formAction === "accept" ? "Accept Request"
                        : formAction === "reject" ? "Reject Request"
                          : formAction === "request_reschedule" ? "Request Reschedule"
                            : formAction === "add_link" ? "Add Meeting Link"
                              : "Update Session")
                      : (formAction === "update" && selectedMentorship.reschedule_requested ? "Respond to Reschedule" : "Update Session Details")}
                  </h2>
                  <p
                    className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {userType === "student"
                      ? `With ${selectedMentorship.mentor?.name}`
                      : `From ${selectedMentorship.student?.name}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSessionForm(false);
                    setFormAction("");
                  }}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-slate-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={updateSession} className="p-6 space-y-6">
              {/* Session date/time fields - show for accept action or student updates */}
              {/* Session date/time fields - show for reschedule request or student updates */}
              {(formAction === "request_reschedule" || userType === "student") && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {formAction === "request_reschedule" ? "Proposed Date" : "Session Date"}
                    </label>
                    <input
                      type="date"
                      value={formAction === "request_reschedule" ? sessionForm.reschedule_date : sessionForm.session_date}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          [formAction === "request_reschedule" ? "reschedule_date" : "session_date"]: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                        ? "bg-slate-800/50 border-blue-500/30 text-white"
                        : "bg-white border-blue-300 text-gray-900"
                        }`}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {formAction === "request_reschedule" ? "Proposed Time" : "Session Time"}
                    </label>
                    <input
                      type="time"
                      value={formAction === "request_reschedule" ? sessionForm.reschedule_time : sessionForm.session_time}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          [formAction === "request_reschedule" ? "reschedule_time" : "session_time"]: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                        ? "bg-slate-800/50 border-blue-500/30 text-white"
                        : "bg-white border-blue-300 text-gray-900"
                        }`}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Reschedule Message */}
              {formAction === "request_reschedule" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Reason for Reschedule
                  </label>
                  <textarea
                    value={sessionForm.reschedule_message}
                    onChange={(e) => setSessionForm({ ...sessionForm, reschedule_message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 ${isDarkMode
                      ? "bg-slate-800/50 border-blue-500/30 text-white"
                      : "bg-white border-blue-300 text-gray-900"
                      }`}
                    placeholder="Provide a reason or alternative availability..."
                    required
                  />
                </div>
              )}

              {/* Meeting Link Field - show for accept action OR add_link action */}
              {(formAction === "add_link" || (userType === "alumni" && formAction === "accept")) && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Google Meet Link {formAction === "accept" ? "(Optional)" : ""}
                  </label>
                  <div className="relative">
                    <Video className={`absolute left-4 top-3.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                    <input
                      type="url"
                      value={sessionForm.meeting_link}
                      onChange={(e) => setSessionForm({ ...sessionForm, meeting_link: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode
                        ? "bg-slate-800/50 border-blue-500/30 text-white"
                        : "bg-white border-blue-300 text-gray-900"
                        }`}
                      placeholder="https://meet.google.com/..."
                      required={formAction === "add_link"}
                    />
                  </div>
                  <p className={`text-xs mt-2 flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <AlertTriangle size={12} className="text-orange-500" />
                    {formAction === "add_link" ? "Once the link is added, the session is finalized." : "You can add the meeting link now or later."}
                  </p>
                </div>
              )}

              <div>
                {formAction === "request_reschedule" || formAction === "add_link" ? null : (
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    {userType === "alumni" ? "Notes for Student" : "Additional Notes"}
                  </label>
                )}
                {formAction === "request_reschedule" || formAction === "add_link" ? null : (
                  <textarea
                    value={sessionForm.mentor_notes}
                    onChange={(e) => setSessionForm({ ...sessionForm, mentor_notes: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 ${isDarkMode
                      ? "bg-slate-800/50 border-blue-500/30 text-white"
                      : "bg-white border-blue-300 text-gray-900"
                      }`}
                    placeholder={
                      userType === "alumni"
                        ? "Add notes for the student..."
                        : "Add any additional notes for your mentor..."
                    }
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSessionForm(false);
                    setFormAction("");
                  }}
                  className={`flex-1 px-6 py-3 border-2 rounded-xl transition-colors font-medium ${isDarkMode
                    ? "border-blue-500/30 text-gray-300 hover:bg-slate-800"
                    : "border-blue-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${formAction === "reject"
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                    : "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white"
                    }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {formAction === "accept"
                        ? "Accepting..."
                        : formAction === "reject"
                          ? "Rejecting..."
                          : "Updating..."}
                    </>
                  ) : userType === "alumni" ? (
                    formAction === "accept" ? "Accept Request"
                      : formAction === "reject" ? "Reject Request"
                        : formAction === "request_reschedule" ? "Send Reschedule Request"
                          : formAction === "add_link" ? "Finalize & Add Link"
                            : "Update"
                  ) : (
                    selectedMentorship.reschedule_requested ? "Confirm New Time" : "Update Session"
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

// Mentorship Card Component for reusability
const MentorshipCard = ({
  mentorship,
  isDarkMode,
  onUpdateSession,
  onAccept,
  onReject,
  onReschedule,
  onVerifyPayment,
  onAddMeetingLink,
  userType,
}) => {
  const isStudent = userType === "student";
  const isFinalStatus = mentorship.status === 'cancelled' || mentorship.status === 'rejected' || mentorship.status === 'completed';
  const showPaymentVerify = !isStudent && mentorship.payment_screenshot && mentorship.payment_status !== 'completed' && !isFinalStatus;
  const showReschedule = !isStudent && (mentorship.status === 'pending' || mentorship.status === 'active') && !isFinalStatus;
  const showAddLink = !isStudent && mentorship.status === 'active' && !mentorship.meeting_link && !isFinalStatus;
  const showStudentRescheduleResponse = isStudent && mentorship.reschedule_requested && !isFinalStatus;

  // Only show update session button (which opens modal without specific action) if:
  // 1. It is a student
  // 2. Status is active or pending
  // 3. NO meeting link has been added yet (finalized)
  const showUpdateSession = isStudent && (mentorship.status === 'active' || mentorship.status === 'pending') && !mentorship.meeting_link && !isFinalStatus;

  return (

    <div
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDarkMode
        ? "bg-slate-900/80 border-slate-700/50 hover:border-blue-500/30"
        : "bg-white border-white/50 hover:border-blue-200 shadow-lg shadow-blue-900/5"
        }`}
    >
      {/* Background Gradient Effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${isDarkMode ? "from-blue-600/5 via-purple-600/5 to-transparent" : "from-blue-50 via-indigo-50 to-transparent"}`} />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="relative">
            <img
              src={
                (isStudent
                  ? mentorship.mentor?.alumni?.profilePhoto
                  : mentorship.student?.profilePhoto) ||
                "https://cdn-icons-png.flaticon.com/512/219/219970.png"
              }
              alt={isStudent ? mentorship.mentor?.name : mentorship.student?.name}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover shadow-lg border-2 ${isDarkMode ? "border-slate-700" : "border-white"}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://cdn-icons-png.flaticon.com/512/219/219970.png";
              }}
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${isDarkMode ? "border-slate-900" : "border-white"} ${mentorship.status === 'active' ? "bg-green-500" : mentorship.status === 'pending' ? "bg-yellow-500" : "bg-gray-500"}`}>
              {mentorship.status === 'active' && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse" />}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className={`font-bold text-base sm:text-lg mb-0.5 sm:mb-1 flex items-center gap-2 truncate ${isDarkMode ? "text-white" : "text-slate-800"
                }`}
            >
              {isStudent ? mentorship.mentor?.name : mentorship.student?.name}
            </h3>
            <p
              className={`text-xs sm:text-sm font-medium truncate ${isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
            >
              {isStudent
                ? `${mentorship.mentor?.current_position || "Alumni"} at ${mentorship.mentor?.company || "MITS"}`
                : `${mentorship.student?.branch || "Student"} • ${mentorship.student?.email || ""}`}
            </p>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-3">
          <span
            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide uppercase border backdrop-blur-md shadow-sm ${isDarkMode
              ? mentorship.status === "pending"
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : mentorship.status === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : mentorship.status === "rejected" || mentorship.status === "cancelled"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-slate-700/50 text-slate-400 border-slate-600"
              : mentorship.status === "pending"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : mentorship.status === "active"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : mentorship.status === "rejected" || mentorship.status === "cancelled"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
          >
            {mentorship.reschedule_requested && !isFinalStatus ? "Reschedule Requested" : (mentorship.status.charAt(0).toUpperCase() + mentorship.status.slice(1))}
          </span>
          {mentorship.payment_status === 'completed' && (
            <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1.5 ${isDarkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
              <CheckCircle size={10} className="stroke-[3]" /> Verified
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4 text-sm">
        <div className="space-y-2">
          <div
            className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
          >
            <Calendar size={16} />
            <span>
              Requested:{" "}
              {formatRequestDateTime(
                mentorship.request_date,
                mentorship.request_time
              )}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
          >
            <Clock size={16} />
            <span>
              Session:{" "}
              {formatDateTime(
                mentorship.session_date,
                mentorship.session_time
              )}
              {isUpcomingSession(
                mentorship.session_date,
                mentorship.session_time
              ) && mentorship.status === 'active' && (
                  <span
                    className={`ml-2 ${isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                  >
                    ● Upcoming
                  </span>
                )}
            </span>
          </div>

          {mentorship.meeting_link && (
            <div className={`mt-2 p-3 rounded-lg border flex items-center gap-3 ${isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
              <Video className="text-blue-500" size={20} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Google Meet Link</p>
                <a href={mentorship.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-medium truncate hover:underline block">
                  {mentorship.meeting_link}
                </a>
              </div>
            </div>
          )}

          {mentorship.payment_screenshot && (
            <div className="mt-2">
              <a
                href={mentorship.payment_screenshot}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700'
                  : 'bg-gray-100 border-gray-200 text-cyan-700 hover:bg-gray-200'
                  }`}
              >
                <CreditCard size={14} />
                View Payment Screenshot
              </a>
            </div>
          )}
        </div>

        {mentorship.request_message && (
          <div>
            <p className={`text-xs uppercase font-bold mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Message:</p>
            <p
              className={`rounded-lg p-3 text-sm ${isDarkMode
                ? "bg-slate-800/50 text-gray-200"
                : "bg-gray-100 text-gray-800"
                }`}
            >
              {mentorship.request_message}
            </p>
          </div>
        )}

        {mentorship.mentor_notes && (
          <div>
            <p className={`text-xs uppercase font-bold mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{isStudent ? "Mentor's Note:" : "Your Note:"}</p>
            <p
              className={`rounded-lg p-3 border-2 text-sm ${isDarkMode
                ? "bg-blue-900/20 text-blue-200 border-blue-500/40"
                : "bg-blue-50 text-blue-800 border-blue-300"
                }`}
            >
              {mentorship.mentor_notes}
            </p>
          </div>
        )}

        {mentorship.reschedule_message && mentorship.reschedule_requested && mentorship.status !== 'cancelled' && mentorship.status !== 'rejected' && mentorship.status !== 'completed' && (
          <div className={`p-3 rounded-lg border-2 border-dashed ${isDarkMode ? 'border-orange-500/50 bg-orange-500/10' : 'border-orange-300 bg-orange-50'}`}>
            <h4 className="text-orange-500 font-bold text-sm mb-1 flex items-center gap-2">
              <AlertTriangle size={14} /> Reschedule Requested
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Reason: {mentorship.reschedule_message}
            </p>
            <div className="mt-2 text-sm font-medium">
              Proposed Time: {formatDateTime(mentorship.reschedule_date, mentorship.reschedule_time)}
            </div>
          </div>
        )}
      </div>

      {/* consolidated Action Buttons */}
      <div className="relative z-10 flex flex-col gap-3 mt-4 sm:mt-6">
        {/* Closed/Finalized Status Message */}
        {(mentorship.status === 'cancelled' || mentorship.status === 'rejected' || mentorship.status === 'completed') && (
          <div className={`p-4 rounded-xl text-center border-2 ${mentorship.status === 'completed'
            ? (isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700')
            : (isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700')
            }`}>
            <p className="font-bold flex items-center justify-center gap-2">
              {mentorship.status === 'completed' ? <CheckCircle size={18} /> : <XCircle size={18} />}
              {mentorship.status === 'completed' ? 'Session Completed' : 'Request Closed & Declined'}
            </p>
            <p className="text-xs mt-1 opacity-80">
              {mentorship.status === 'completed'
                ? 'This mentorship session has been successfully completed.'
                : 'This request is no longer active. No further actions can be taken.'}
            </p>
          </div>
        )}

        {/* Student Actions */}
        {isStudent && (
          <div className="flex gap-2">
            {(showStudentRescheduleResponse || showUpdateSession) && (
              <button
                onClick={() => onUpdateSession(mentorship)}
                className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {showStudentRescheduleResponse ? "Respond to Reschedule" : "Update Session"}
              </button>
            )}
          </div>
        )}

        {/* Mentor Actions */}
        {!isStudent && (
          <div className="space-y-3">
            {/* Payment Verification */}
            {showPaymentVerify && (
              <button
                onClick={() => onVerifyPayment(mentorship)}
                className={`w-full py-2.5 sm:py-2 rounded-xl text-sm sm:text-base font-semibold border-2 flex items-center justify-center gap-2 ${isDarkMode ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' : 'border-green-500 text-green-600 hover:bg-green-50'}`}
              >
                <CheckCircle size={16} /> Verify Payment
              </button>
            )}

            <div className="flex flex-col xs:flex-row gap-3">
              {mentorship.status === "pending" && (
                <>
                  <button
                    onClick={() => onAccept(mentorship)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Accept
                  </button>
                  <button
                    onClick={() => onReject(mentorship)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} />
                    Decline
                  </button>
                </>
              )}

              {/* Add Meeting Link if active and not set */}
              {showAddLink && (
                <button
                  onClick={() => onAddMeetingLink(mentorship)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Video size={16} />
                  Add Meeting Link
                </button>
              )}
            </div>

            {/* Reschedule Button - Available for Pending or Active */}
            {showReschedule && !mentorship.reschedule_requested && !mentorship.meeting_link && (
              <button
                onClick={() => onReschedule(mentorship)}
                className={`w-full py-2.5 sm:py-2 rounded-xl text-sm sm:text-base font-medium border-2 flex items-center justify-center gap-2 ${isDarkMode ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10' : 'border-orange-300 text-orange-600 hover:bg-orange-50'}`}
              >
                <Clock size={16} /> Request Reschedule
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipRequestsPage;
