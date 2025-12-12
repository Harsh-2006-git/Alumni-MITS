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
  toggleTheme = () => {},
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
  });

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
  const API_BASE = `${BASE_URL}/mentor`;

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
          action: action, // "accept" or "reject"
          mentor_notes: sessionForm.mentor_notes,
          session_date: sessionForm.session_date,
          session_time: sessionForm.session_time,
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

      // Reload data
      await loadMentorRequests();
    } catch (error) {
      console.error("Error responding to request:", error);
      alert("Failed to respond to request. Please try again.");
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
        await respondToRequest(selectedMentorship.id, formAction);
        return;
      }

      // For student session updates
      let endpoint;
      if (userType === "student") {
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
      }
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Failed to update session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openSessionForm = (mentorship, action = "update") => {
    setSelectedMentorship(mentorship);
    setFormAction(action);

    // Pre-fill form with existing data
    setSessionForm({
      session_date: mentorship.session_date || "",
      session_time: mentorship.session_time || "",
      mentor_notes: mentorship.mentor_notes || "",
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
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
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
            className={`rounded-3xl p-6 lg:p-8 border-2 shadow-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900/90 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm border-blue-500/20"
                : "bg-gradient-to-br from-white/90 via-cyan-50/50 to-blue-50/50 backdrop-blur-sm border-blue-300"
            }`}
          >
            {/* Not Logged In View */}
            {!isLoggedIn && (
              <div className="text-center py-12">
                <Users
                  className={`mx-auto mb-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                  size={64}
                />
                <h2
                  className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  Please Log In
                </h2>
                <p
                  className={`text-lg mb-6 max-w-md mx-auto ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
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
                  className={`mt-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
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
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-6">
                    Upcoming Sessions
                  </h2>

                  {upcomingStudentMentorships.length === 0 ? (
                    <div className="text-center py-8 rounded-2xl border-2 border-dashed p-8">
                      <Calendar
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
                        No upcoming sessions
                      </h3>
                      <p
                        className={`mb-6 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
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
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-6">
                    All Mentorship Requests
                  </h2>

                  {allStudentMentorships.length === 0 ? (
                    <div className="text-center py-8 rounded-2xl border-2 border-dashed p-8">
                      <Target
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
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-6">
                  Mentorship Requests
                </h2>

                {mentorRequests.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl border-2 border-dashed p-8">
                    <Target
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

      {/* Session Form Modal */}
      {showSessionForm && selectedMentorship && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-3xl max-w-md w-full shadow-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
                : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-2 border-blue-300"
            }`}
          >
            <div
              className={`p-6 rounded-t-3xl border-b-2 backdrop-blur-sm ${
                isDarkMode
                  ? "border-blue-500/30 bg-slate-900/90"
                  : "border-blue-300 bg-white/90"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    {userType === "alumni"
                      ? `${
                          formAction === "accept" ? "Accept" : "Reject"
                        } Request`
                      : "Update Session Details"}
                  </h2>
                  <p
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
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

            <form onSubmit={updateSession} className="p-6 space-y-6">
              {/* Session date/time fields - show for accept action or student updates */}
              {(formAction === "accept" || userType === "student") && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Session Date
                    </label>
                    <input
                      type="date"
                      value={sessionForm.session_date}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          session_date: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-slate-800/50 border-blue-500/30 text-white"
                          : "bg-white border-blue-300 text-gray-900"
                      }`}
                      required={formAction === "accept"}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Session Time
                    </label>
                    <input
                      type="time"
                      value={sessionForm.session_time}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          session_time: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDarkMode
                          ? "bg-slate-800/50 border-blue-500/30 text-white"
                          : "bg-white border-blue-300 text-gray-900"
                      }`}
                      required={formAction === "accept"}
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
                  {userType === "alumni"
                    ? "Notes for Student"
                    : "Additional Notes"}
                </label>
                <textarea
                  value={sessionForm.mentor_notes}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      mentor_notes: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 ${
                    isDarkMode
                      ? "bg-slate-800/50 border-blue-500/30 text-white"
                      : "bg-white border-blue-300 text-gray-900"
                  }`}
                  placeholder={
                    userType === "alumni"
                      ? "Add notes for the student..."
                      : "Add any additional notes for your mentor..."
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSessionForm(false);
                    setFormAction("");
                  }}
                  className={`flex-1 px-6 py-3 border-2 rounded-xl transition-colors font-medium ${
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
                  className={`flex-1 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    formAction === "reject"
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
                    formAction === "accept" ? (
                      "Accept Request"
                    ) : (
                      "Reject Request"
                    )
                  ) : (
                    "Update Session"
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
  userType,
}) => {
  const isStudent = userType === "student";

  return (
    <div
      className={`rounded-2xl border-2 p-6 transition-all ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-800/70 via-blue-900/20 to-indigo-900/20 border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/20"
          : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-blue-300 hover:shadow-xl"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <img
            src={
              (isStudent
                ? mentorship.mentor?.alumni?.profilePhoto
                : mentorship.student?.profilePhoto) ||
              "https://img.freepik.com/premium-vector/man-avatar-glasses-young_594966-9.jpg"
            }
            alt={isStudent ? mentorship.mentor?.name : mentorship.student?.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <h3
              className={`font-bold text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {isStudent ? mentorship.mentor?.name : mentorship.student?.name}
            </h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {isStudent
                ? `${mentorship.mentor?.current_position || "Alumni"} at ${
                    mentorship.mentor?.company || "MITS"
                  }`
                : `${mentorship.student?.branch || "Student"} • ${
                    mentorship.student?.batch || "Current Batch"
                  }`}
            </p>
          </div>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium border-2 w-fit ${
            isDarkMode
              ? mentorship.status === "pending"
                ? "bg-yellow-400/20 text-yellow-300 border-yellow-400/40"
                : mentorship.status === "active"
                ? "bg-green-400/20 text-green-300 border-green-400/40"
                : mentorship.status === "rejected"
                ? "bg-red-400/20 text-red-300 border-red-400/40"
                : "bg-gray-400/20 text-gray-300 border-gray-400/40"
              : mentorship.status === "pending"
              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
              : mentorship.status === "active"
              ? "bg-green-100 text-green-800 border-green-300"
              : mentorship.status === "rejected"
              ? "bg-red-100 text-red-800 border-red-300"
              : "bg-gray-100 text-gray-800 border-gray-300"
          }`}
        >
          {mentorship.status.charAt(0).toUpperCase() +
            mentorship.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 text-sm">
        <div className="space-y-2">
          <div
            className={`flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
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

          {mentorship.session_date && (
            <div
              className={`flex items-center gap-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
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
                ) && (
                  <span
                    className={`ml-2 ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    ● Upcoming
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {mentorship.request_message && (
          <div>
            <p
              className={`rounded-lg p-4 text-sm ${
                isDarkMode
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
            <p
              className={`rounded-lg p-4 border-2 text-sm ${
                isDarkMode
                  ? "bg-blue-900/20 text-blue-200 border-blue-500/40"
                  : "bg-blue-50 text-blue-800 border-blue-300"
              }`}
            >
              <strong>{isStudent ? "Mentor's Note:" : "Your Note:"}</strong>{" "}
              {mentorship.mentor_notes}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        {isStudent && mentorship.status === "active" && (
          <button
            onClick={() => onUpdateSession(mentorship)}
            className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Update Session
          </button>
        )}

        {!isStudent && mentorship.status === "pending" && (
          <>
            <button
              onClick={() => onAccept(mentorship)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              Accept
            </button>
            <button
              onClick={() => onReject(mentorship)}
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <XCircle size={16} />
              Decline
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MentorshipRequestsPage;
