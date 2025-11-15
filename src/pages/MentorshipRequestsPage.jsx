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

const MentorshipRequestsPage = ({
  isDarkMode = false,
  toggleTheme = () => {},
}) => {
  const [myMentorships, setMyMentorships] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState(null);

  const [sessionForm, setSessionForm] = useState({
    session_date: "",
    session_time: "",
    mentor_notes: "",
  });

  const API_BASE = "https://alumni-mits-l45r.onrender.com/mentor";

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const authToken = getAuthToken();
  const userData = JSON.parse(localStorage.getItem("auth") || "{}");
  const userType = userData.userType;
  const isLoggedIn = !!authToken; // Check if user is logged in

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
      const response = await axios.get(`${API_BASE}/student/my-mentorships`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setMyMentorships(response.data.data);
    } catch (error) {
      console.error("Error loading mentorships:", error);
    }
  };

  const loadMentorRequests = async () => {
    try {
      const response = await axios.get(`${API_BASE}/mentor/requests`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setMentorRequests(response.data.data);
    } catch (error) {
      console.error("Error loading mentor requests:", error);
    }
  };

  const respondToRequest = async (requestId, action) => {
    try {
      setLoading(true);
      await axios.put(
        `${API_BASE}/requests/${requestId}/respond`,
        {
          action,
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
      setShowSessionForm(false);
      setSelectedMentorship(null);
      setSessionForm({ session_date: "", session_time: "", mentor_notes: "" });
      loadMentorRequests();
      if (userType === "student") loadMyMentorships();
    } catch (error) {
      console.error("Error responding to request:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSession = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(
        `${API_BASE}/mentorships/${selectedMentorship.id}/session`,
        sessionForm,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setShowSessionForm(false);
      setSelectedMentorship(null);
      setSessionForm({ session_date: "", session_time: "", mentor_notes: "" });
      if (userType === "student") loadMyMentorships();
      if (userType === "alumni") loadMentorRequests();
    } catch (error) {
      console.error("Error updating session:", error);
    } finally {
      setLoading(false);
    }
  };

  const openSessionForm = (mentorship, action = "update") => {
    setSelectedMentorship(mentorship);
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
    };
    return colors[status] || "bg-gray-400/20 text-gray-300 border-gray-400/40";
  };

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
        <div className="max-w-4xl mx-auto">
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

            {/* Student View */}
            {isLoggedIn && userType === "student" && (
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-8">
                  My Mentorship Requests
                </h2>

                {myMentorships.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare
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
                      className={`mb-6 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Start by browsing available mentors and sending requests.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {myMentorships.map((mentorship) => (
                      <div
                        key={mentorship.id}
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
                                mentorship.mentor?.alumni?.profilePhoto ||
                                "https://via.placeholder.com/48"
                              }
                              alt={mentorship.mentor?.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h3
                                className={`font-bold text-base ${
                                  isDarkMode ? "text-gray-200" : "text-gray-900"
                                }`}
                              >
                                {mentorship.mentor?.name}
                              </h3>
                              <p
                                className={`text-sm ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {mentorship.mentor?.current_position} at{" "}
                                {mentorship.mentor?.company}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 w-fit ${getStatusColor(
                              mentorship.status
                            )}`}
                          >
                            {mentorship.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-6 text-sm">
                          <div className="space-y-3">
                            <div
                              className={`flex items-center gap-2 ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <Calendar size={16} />
                              <span>Requested: {mentorship.request_date}</span>
                            </div>

                            {mentorship.session_date && (
                              <div
                                className={`flex items-center gap-2 ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                <Clock size={16} />
                                <span>
                                  Session: {mentorship.session_date} at{" "}
                                  {mentorship.session_time}
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
                                <strong>Mentor's Note:</strong>{" "}
                                {mentorship.mentor_notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {mentorship.status === "active" && (
                          <div className="flex gap-3 mt-6">
                            <button
                              onClick={() => openSessionForm(mentorship)}
                              className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                              Update Session
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Alumni View */}
            {isLoggedIn && userType === "alumni" && (
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-8">
                  Mentorship Requests
                </h2>

                {mentorRequests.length === 0 ? (
                  <div className="text-center py-12">
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
                  <div className="space-y-6">
                    {mentorRequests.map((request) => (
                      <div
                        key={request.id}
                        className={`rounded-lg border-2 p-4 transition-all hover:shadow-lg ${
                          isDarkMode
                            ? "bg-slate-800/50 border-blue-500/20 hover:border-blue-500/40"
                            : "bg-white border-blue-200 hover:border-blue-400"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <img
                              src={
                                request.student?.profilePhoto ||
                                "https://via.placeholder.com/40"
                              }
                              alt={request.student?.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h3
                                className={`font-bold text-sm truncate ${
                                  isDarkMode ? "text-gray-200" : "text-gray-900"
                                }`}
                              >
                                {request.student?.name}
                              </h3>
                              <p
                                className={`text-xs truncate ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                              >
                                {request.request_date} • {request.request_time}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </div>

                        {request.request_message && (
                          <div className="mb-3">
                            <p
                              className={`rounded-lg p-3 text-xs line-clamp-2 ${
                                isDarkMode
                                  ? "bg-slate-900/50 text-gray-300"
                                  : "bg-gray-50 text-gray-700"
                              }`}
                            >
                              {request.request_message}
                            </p>
                          </div>
                        )}

                        {request.session_date && (
                          <div
                            className={`flex items-center gap-1 mb-3 text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <Calendar size={12} />
                            <span>
                              {request.session_date} at {request.session_time}
                            </span>
                          </div>
                        )}

                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openSessionForm(request, "accept")}
                              className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-1 text-xs"
                            >
                              <CheckCircle size={14} />
                              Accept
                            </button>
                            <button
                              onClick={() => openSessionForm(request, "reject")}
                              className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-1 text-xs"
                            >
                              <XCircle size={14} />
                              Decline
                            </button>
                          </div>
                        )}

                        {request.status === "active" && (
                          <button
                            onClick={() => openSessionForm(request)}
                            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all text-xs"
                          >
                            Update Session
                          </button>
                        )}
                      </div>
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
                    {userType === "alumni" &&
                    selectedMentorship.status === "pending"
                      ? "Respond to Request"
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
                  onClick={() => setShowSessionForm(false)}
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
              onSubmit={
                userType === "student"
                  ? updateSession
                  : (e) => e.preventDefault()
              }
              className="p-6 space-y-6"
            >
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
                  />
                </div>
              </div>

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
                      ? "Add any notes or instructions for the student..."
                      : "Add any additional notes..."
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSessionForm(false)}
                  className={`flex-1 px-6 py-3 border-2 rounded-xl transition-colors font-medium ${
                    isDarkMode
                      ? "border-blue-500/30 text-gray-300 hover:bg-slate-800"
                      : "border-blue-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>

                {userType === "alumni" &&
                selectedMentorship.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        respondToRequest(selectedMentorship.id, "accept")
                      }
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        "Accept"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        respondToRequest(selectedMentorship.id, "reject")
                      }
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing...
                        </>
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      "Update Session"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipRequestsPage;
