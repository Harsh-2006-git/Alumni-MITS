import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  UserCheck,
  MessageSquare,
  Calendar,
  Clock,
  Edit2,
  X,
  Send,
  CheckCircle,
  XCircle,
  Star,
  Briefcase,
  GraduationCap,
  DollarSign,
  MapPin,
  Sparkles,
  Target,
  BookOpen,
  Award,
  Eye,
  Handshake,
  FileText,
  FlaskConical,
  Heart,
  Lightbulb,
  TrendingUp,
  Menu,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

const MentorMentee = ({ isDarkMode = false, toggleTheme = () => {} }) => {
  const [activeTab, setActiveTab] = useState("browse");
  const [mentors, setMentors] = useState([]);
  const [myMentorProfile, setMyMentorProfile] = useState(null);
  const [myMentorships, setMyMentorships] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [notification, setNotification] = useState(null);

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const [mentorForm, setMentorForm] = useState({
    batch_year: "",
    branch: "",
    current_position: "",
    company: "",
    linkedin_url: "",
    expertise: "",
    topics: [],
    availability: {
      sunday: [{ from: "09:00", to: "17:00" }],
      saturday: [{ from: "10:00", to: "16:00" }],
      other_days: [{ from: "18:00", to: "20:00" }],
    },
    fees: "",
    available: true,
  });

  const addAvailabilitySlot = (day) => {
    setMentorForm({
      ...mentorForm,
      availability: {
        ...mentorForm.availability,
        [day]: [
          ...mentorForm.availability[day],
          { from: "09:00", to: "17:00" },
        ],
      },
    });
  };

  const removeAvailabilitySlot = (day, index) => {
    const newSlots = mentorForm.availability[day].filter((_, i) => i !== index);
    setMentorForm({
      ...mentorForm,
      availability: {
        ...mentorForm.availability,
        [day]:
          newSlots.length > 0 ? newSlots : [{ from: "09:00", to: "17:00" }],
      },
    });
  };

  const updateAvailabilitySlot = (day, index, field, value) => {
    const newSlots = [...mentorForm.availability[day]];
    newSlots[index][field] = value;
    setMentorForm({
      ...mentorForm,
      availability: {
        ...mentorForm.availability,
        [day]: newSlots,
      },
    });
  };

  const [requestForm, setRequestForm] = useState({
    request_message: "",
    session_date: "",
    session_time: "",
  });

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

  useEffect(() => {
    loadMentors();
    if (userType === "alumni") {
      loadMyMentorProfile();
      loadMentorRequests();
    }
    if (userType === "student") {
      loadMyMentorships();
    }
  }, [userType]);

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

  const loadMyMentorProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/my-profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setMyMentorProfile(response.data.data);
    } catch (error) {
      console.error("Error loading mentor profile:", error);
    }
  };

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

  const createMentorProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/create`, mentorForm, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      setMyMentorProfile(response.data.data);
      setShowMentorForm(false);
      showNotification("🎉 Mentor profile created successfully!", "success");
    } catch (error) {
      console.error("Error creating mentor profile:", error);
      showNotification(
        "Failed to create mentor profile. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateMentorProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE}/edit/${myMentorProfile.id}`,
        mentorForm,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMyMentorProfile(response.data.data);
      setShowMentorForm(false);
      showNotification("✅ Mentor profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating mentor profile:", error);
      showNotification(
        "Failed to update mentor profile. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const sendMentorshipRequest = async (e) => {
    e.preventDefault();
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
      loadMyMentorships();
      showNotification("🚀 Mentorship request sent successfully!", "success");
    } catch (error) {
      console.error("Error sending mentorship request:", error);
      showNotification(
        "Failed to send mentorship request. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
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
      loadMyMentorships();
      if (action === "accept") {
        showNotification("✅ Mentorship request accepted!", "success");
      } else {
        showNotification("Request declined.", "info");
      }
    } catch (error) {
      console.error("Error responding to request:", error);
      showNotification(
        "Failed to respond to request. Please try again.",
        "error"
      );
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
      showNotification("✅ Session details updated successfully!", "success");
    } catch (error) {
      console.error("Error updating session:", error);
      showNotification("Failed to update session. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openRequestForm = (mentor) => {
    setSelectedMentor(mentor);
    setShowRequestForm(true);
  };

  const openMentorForm = () => {
    if (myMentorProfile) {
      setMentorForm({
        batch_year: myMentorProfile.batch_year,
        branch: myMentorProfile.branch,
        current_position: myMentorProfile.current_position,
        company: myMentorProfile.company,
        linkedin_url: myMentorProfile.linkedin_url,
        expertise: myMentorProfile.expertise,
        topics: myMentorProfile.topics,
        availability: myMentorProfile.availability,
        fees: myMentorProfile.fees,
        available: myMentorProfile.available,
      });
    } else {
      setMentorForm({
        batch_year: "",
        branch: "",
        current_position: "",
        company: "",
        linkedin_url: "",
        expertise: "",
        topics: [],
        availability: {
          sunday: [{ from: "09:00", to: "17:00" }],
          saturday: [{ from: "10:00", to: "16:00" }],
          other_days: [{ from: "18:00", to: "20:00" }],
        },
        fees: "",
        available: true,
      });
    }
    setShowMentorForm(true);
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

  const TabButton = ({ active, onClick, children, icon: Icon, count }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 relative text-sm sm:text-base whitespace-nowrap ${
        active
          ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-2xl shadow-blue-500/30 scale-105"
          : isDarkMode
          ? "bg-slate-800/70 text-gray-300 hover:bg-slate-700/70 border-2 border-blue-500/30 hover:scale-105 hover:border-cyan-500/40"
          : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-blue-300 shadow-lg hover:shadow-xl hover:border-cyan-400"
      }`}
    >
      <Icon size={18} className="sm:w-5 sm:h-5" />
      <span className="hidden sm:inline">{children}</span>
      <span className="sm:hidden">{children.split(" ")[0]}</span>
      {count > 0 && (
        <span
          className={`absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full text-xs flex items-center justify-center font-bold ${
            active
              ? "bg-white text-blue-600 shadow-lg"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  const StatCard = ({ icon: Icon, label, value, color = "purple" }) => (
    <div
      className={`rounded-xl p-3 sm:p-4 border-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl ${
        isDarkMode
          ? `bg-gradient-to-br from-slate-900/90 via-${color}-900/30 to-blue-900/20 border-${color}-500/30`
          : `bg-gradient-to-br from-white via-${color}-50/50 to-blue-50/50 border-${color}-300`
      }`}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl mb-2 sm:mb-3 ${
          isDarkMode
            ? `bg-gradient-to-br from-${color}-500/30 to-blue-500/20`
            : `bg-gradient-to-br from-${color}-100 to-blue-100`
        }`}
      >
        <Icon className={`text-${color}-500`} size={16} />
      </div>
      <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
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
                  <MessageSquare className="w-6 h-6" />
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

      {/* Header Actions - Responsive */}
      <section className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <StatCard
                icon={Users}
                label="Available Mentors"
                value={mentors.filter((m) => m.available).length}
                color="cyan"
              />
              {userType === "student" && (
                <StatCard
                  icon={MessageSquare}
                  label="My Requests"
                  value={myMentorships.length}
                  color="blue"
                />
              )}
              {userType === "alumni" && (
                <StatCard
                  icon={Target}
                  label="Pending Requests"
                  value={
                    mentorRequests.filter((r) => r.status === "pending").length
                  }
                  color="indigo"
                />
              )}
            </div>

            {/* Mentor Profile Action */}
            {userType === "alumni" && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-end gap-2 sm:gap-3">
                {myMentorProfile && (
                  <div
                    className={`text-center sm:text-right px-3 py-2 sm:px-4 sm:py-2 rounded-lg border-2 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-slate-800/50 to-blue-900/30 border-blue-500/30"
                        : "bg-gradient-to-r from-white to-blue-50 border-blue-300"
                    }`}
                  >
                    <p
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Status
                    </p>
                    <p
                      className={`text-sm sm:text-base font-bold ${
                        myMentorProfile.available
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {myMentorProfile.available
                        ? "✓ Available"
                        : "✗ Unavailable"}
                    </p>
                  </div>
                )}
                <button
                  onClick={openMentorForm}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all text-sm"
                >
                  <UserCheck size={16} />
                  {myMentorProfile ? "Edit Profile" : "Become Mentor"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Tabs - Responsive */}
      <section className="container mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto">
          <div
            className={`rounded-xl sm:rounded-2xl p-2 shadow-xl overflow-x-auto ${
              isDarkMode
                ? "bg-slate-900/70 border-2 border-blue-500/20"
                : "bg-white/80 backdrop-blur-sm border-2 border-blue-200"
            }`}
          >
            <div className="flex gap-2 min-w-max">
              <TabButton
                active={activeTab === "browse"}
                onClick={() => setActiveTab("browse")}
                icon={Users}
              >
                Browse Mentors
              </TabButton>

              {userType === "student" && (
                <TabButton
                  active={activeTab === "my-mentorships"}
                  onClick={() => setActiveTab("my-mentorships")}
                  icon={MessageSquare}
                  count={myMentorships.length}
                >
                  My Mentorships
                </TabButton>
              )}

              {userType === "alumni" && (
                <>
                  <TabButton
                    active={activeTab === "my-profile"}
                    onClick={() => setActiveTab("my-profile")}
                    icon={UserCheck}
                  >
                    My Profile
                  </TabButton>
                  <TabButton
                    active={activeTab === "requests"}
                    onClick={() => setActiveTab("requests")}
                    icon={Target}
                    count={
                      mentorRequests.filter((r) => r.status === "pending")
                        .length
                    }
                  >
                    Requests
                  </TabButton>
                </>
              )}
            </div>
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
            {/* Browse Mentors Tab */}
            {activeTab === "browse" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    Available Mentors
                  </h2>
                  <div
                    className={`text-xs sm:text-sm font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ✨ {mentors.filter((m) => m.available).length} mentors ready
                    to guide you
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
                              "https://via.placeholder.com/64"
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
                              <Briefcase
                                size={12}
                                className="sm:w-3.5 sm:h-3.5"
                              />
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

                        {/* Fees & Availability */}
                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                          <div className="flex items-center gap-1 text-orange-400 font-bold text-sm sm:text-base">
                            <DollarSign size={14} className="sm:w-4 sm:h-4" />
                            <span>₹{mentor.fees}</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-400 text-xs sm:text-sm font-medium">
                            <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span>Available</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        {userType === "student" && (
                          <button
                            onClick={() => openRequestForm(mentor)}
                            className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            <Send size={14} className="sm:w-4 sm:h-4" />
                            Request Mentorship
                          </button>
                        )}
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
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      Check back later for available mentors.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* My Mentorships Tab */}
            {activeTab === "my-mentorships" && userType === "student" && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-6 sm:mb-8">
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
                    <button
                      onClick={() => setActiveTab("browse")}
                      className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:shadow-blue-500/30 transition-all font-semibold"
                    >
                      Browse Mentors
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {myMentorships.map((mentorship) => (
                      <div
                        key={mentorship.id}
                        className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 transition-all ${
                          isDarkMode
                            ? "bg-gradient-to-br from-slate-800/70 via-blue-900/20 to-indigo-900/20 border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/20"
                            : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-blue-300 hover:shadow-xl"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <img
                              src={
                                mentorship.mentor?.alumni?.profilePhoto ||
                                "https://via.placeholder.com/48"
                              }
                              alt={mentorship.mentor?.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
                            />
                            <div>
                              <h3
                                className={`font-bold text-sm sm:text-base ${
                                  isDarkMode ? "text-gray-200" : "text-gray-900"
                                }`}
                              >
                                {mentorship.mentor?.name}
                              </h3>
                              <p
                                className={`text-xs sm:text-sm ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {mentorship.mentor?.current_position} at{" "}
                                {mentorship.mentor?.company}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border-2 w-fit ${getStatusColor(
                              mentorship.status
                            )}`}
                          >
                            {mentorship.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:gap-6 text-xs sm:text-sm">
                          <div className="space-y-2 sm:space-y-3">
                            <div
                              className={`flex items-center gap-2 ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <Calendar size={14} className="sm:w-4 sm:h-4" />
                              <span>Requested: {mentorship.request_date}</span>
                            </div>

                            {mentorship.session_date && (
                              <div
                                className={`flex items-center gap-2 ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                <Clock size={14} className="sm:w-4 sm:h-4" />
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
                                className={`rounded-lg p-3 sm:p-4 text-xs sm:text-sm ${
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
                                className={`rounded-lg p-3 sm:p-4 border-2 text-xs sm:text-sm ${
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
                          <div className="flex gap-3 mt-4 sm:mt-6">
                            <button
                              onClick={() => openSessionForm(mentorship)}
                              className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
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

            {/* My Profile Tab */}
            {activeTab === "my-profile" && userType === "alumni" && (
              <div>
                {!myMentorProfile ? (
                  <div className="text-center py-12">
                    <UserCheck
                      className={`mx-auto mb-4 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                      size={48}
                    />
                    <h3
                      className={`text-xl sm:text-2xl font-bold mb-2 ${
                        isDarkMode ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      Become a Mentor
                    </h3>
                    <p
                      className={`mb-6 max-w-md mx-auto text-sm sm:text-base ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Share your knowledge and experience with students. Guide
                      the next generation of professionals.
                    </p>
                    <button
                      onClick={openMentorForm}
                      className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                    >
                      Create Mentor Profile
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Profile Header */}
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6">
                      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full lg:w-auto">
                        <img
                          src={
                            myMentorProfile.alumni?.profilePhoto ||
                            "https://via.placeholder.com/80"
                          }
                          alt={myMentorProfile.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-400/30 shadow-lg"
                        />
                        <div className="flex-1">
                          <h2
                            className={`text-xl sm:text-2xl font-bold ${
                              isDarkMode ? "text-gray-200" : "text-gray-900"
                            }`}
                          >
                            {myMentorProfile.name}
                          </h2>
                          <p className="text-cyan-400 text-sm sm:text-base">
                            {myMentorProfile.current_position} at{" "}
                            {myMentorProfile.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm">
                            <span
                              className={`flex items-center gap-1 ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <GraduationCap size={14} />
                              Batch {myMentorProfile.batch_year} •{" "}
                              {myMentorProfile.branch}
                            </span>
                            <span
                              className={`flex items-center gap-1 font-medium ${
                                myMentorProfile.available
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {myMentorProfile.available
                                ? "✓ Available"
                                : "✗ Not available"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={openMentorForm}
                        className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
                      >
                        <Edit2 size={14} className="sm:w-4 sm:h-4" />
                        Edit Profile
                      </button>
                    </div>

                    {/* Profile Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                      {/* Left Column */}
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-3">
                            Expertise
                          </h3>
                          <p
                            className={`rounded-xl p-3 sm:p-4 text-xs sm:text-sm ${
                              isDarkMode
                                ? "bg-slate-800/50 text-gray-200"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {myMentorProfile.expertise}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-3">
                            Mentorship Topics
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {myMentorProfile.topics.map((topic, index) => (
                              <span
                                key={index}
                                className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium border text-xs sm:text-sm ${
                                  isDarkMode
                                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border-cyan-400/40"
                                    : "bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border-cyan-300"
                                }`}
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-3">
                            Session Fees
                          </h3>
                          <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-orange-500">
                            <DollarSign size={20} className="sm:w-6 sm:h-6" />
                            <span>₹{myMentorProfile.fees}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-3">
                          Availability
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {Object.entries(myMentorProfile.availability).map(
                            ([day, slots]) => (
                              <div
                                key={day}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl gap-2 ${
                                  isDarkMode ? "bg-slate-800/50" : "bg-gray-100"
                                }`}
                              >
                                <span
                                  className={`font-medium capitalize text-sm sm:text-base ${
                                    isDarkMode
                                      ? "text-gray-200"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {day === "other_days" ? "Weekdays" : day}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {slots.map((slot, index) => (
                                    <span
                                      key={index}
                                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm border ${
                                        isDarkMode
                                          ? "bg-slate-700 text-gray-200 border-slate-600"
                                          : "bg-white text-gray-800 border-gray-400"
                                      }`}
                                    >
                                      {slot.from} - {slot.to}
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
                )}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "requests" && userType === "alumni" && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-6 sm:mb-8">
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
                  <div className="space-y-4 sm:space-y-6">
                    {mentorRequests.map((request) => (
                      <div
                        key={request.id}
                        className={`rounded-lg border-2 p-3 sm:p-4 transition-all hover:shadow-lg ${
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
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
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
                            className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </div>

                        {request.request_message && (
                          <div className="mb-3">
                            <p
                              className={`rounded-lg p-2 text-xs line-clamp-2 ${
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

      {/* Mentor Profile Form Modal - Responsive */}
      {showMentorForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div
              className={`rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-full overflow-hidden ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
                  : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-2 border-blue-300"
              }`}
            >
              <div
                className={`p-4 sm:p-6 border-b-2 flex-shrink-0 ${
                  isDarkMode
                    ? "border-blue-500/30 bg-slate-900/90"
                    : "border-blue-300 bg-white/90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    {myMentorProfile
                      ? "Edit Mentor Profile"
                      : "Create Mentor Profile"}
                  </h2>
                  <button
                    onClick={() => setShowMentorForm(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-slate-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                <form
                  onSubmit={
                    myMentorProfile ? updateMentorProfile : createMentorProfile
                  }
                  className="p-4 sm:p-6 space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Batch Year *
                      </label>
                      <input
                        type="number"
                        value={mentorForm.batch_year}
                        onChange={(e) =>
                          setMentorForm({
                            ...mentorForm,
                            batch_year: e.target.value,
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-slate-800/50 border-blue-500/30 text-white"
                            : "bg-white border-blue-300 text-gray-900"
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Branch *
                      </label>
                      <input
                        type="text"
                        value={mentorForm.branch}
                        onChange={(e) =>
                          setMentorForm({
                            ...mentorForm,
                            branch: e.target.value,
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-slate-800/50 border-blue-500/30 text-white"
                            : "bg-white border-blue-300 text-gray-900"
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Current Position
                      </label>
                      <input
                        type="text"
                        value={mentorForm.current_position}
                        onChange={(e) =>
                          setMentorForm({
                            ...mentorForm,
                            current_position: e.target.value,
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
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
                        Company
                      </label>
                      <input
                        type="text"
                        value={mentorForm.company}
                        onChange={(e) =>
                          setMentorForm({
                            ...mentorForm,
                            company: e.target.value,
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-slate-800/50 border-blue-500/30 text-white"
                            : "bg-white border-blue-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={mentorForm.linkedin_url}
                        onChange={(e) =>
                          setMentorForm({
                            ...mentorForm,
                            linkedin_url: e.target.value,
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-slate-800/50 border-blue-500/30 text-white"
                            : "bg-white border-blue-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Expertise *
                      </label>
                      <textarea
                        value={mentorForm.expertise}
                        onChange={(e) =>
                          setMentorForm({
                            ...mentorForm,
                            expertise: e.target.value,
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-20 sm:h-24 text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-slate-800/50 border-blue-500/30 text-white"
                            : "bg-white border-blue-300 text-gray-900"
                        }`}
                        placeholder="Describe your expertise, experience, and what you can mentor on..."
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Topics *
                      </label>
                      <input
                        type="text"
                        value={mentorForm.topics.join(", ")}
                        onChange={(e) =>
                          setMentorForm({
                            ...mentorForm,
                            topics: e.target.value
                              .split(",")
                              .map((topic) => topic.trim())
                              .filter((topic) => topic),
                          })
                        }
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-slate-800/50 border-blue-500/30 text-white"
                            : "bg-white border-blue-300 text-gray-900"
                        }`}
                        placeholder="Web Development, Interview Prep, Resume Review, Career Guidance"
                        required
                      />
                      <p
                        className={`text-xs sm:text-sm mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Separate topics with commas
                      </p>
                    </div>

                    {/* Availability Section */}
                    <div className="sm:col-span-2">
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Availability Schedule *
                      </label>
                      <div className="space-y-4">
                        {Object.entries(mentorForm.availability).map(
                          ([day, slots]) => (
                            <div
                              key={day}
                              className={`rounded-lg p-3 sm:p-4 border-2 ${
                                isDarkMode
                                  ? "bg-slate-800/30 border-blue-500/20"
                                  : "bg-gray-50 border-blue-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className={`text-sm font-semibold capitalize ${
                                    isDarkMode
                                      ? "text-gray-200"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {day === "other_days" ? "Weekdays" : day}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => addAvailabilitySlot(day)}
                                  className="text-xs px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                >
                                  + Add Slot
                                </button>
                              </div>
                              <div className="space-y-2">
                                {slots.map((slot, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <input
                                      type="time"
                                      value={slot.from}
                                      onChange={(e) =>
                                        updateAvailabilitySlot(
                                          day,
                                          index,
                                          "from",
                                          e.target.value
                                        )
                                      }
                                      className={`flex-1 px-2 py-1.5 rounded border text-xs ${
                                        isDarkMode
                                          ? "bg-slate-700 border-slate-600 text-white"
                                          : "bg-white border-gray-300 text-gray-900"
                                      }`}
                                    />
                                    <span
                                      className={
                                        isDarkMode
                                          ? "text-gray-400"
                                          : "text-gray-600"
                                      }
                                    >
                                      to
                                    </span>
                                    <input
                                      type="time"
                                      value={slot.to}
                                      onChange={(e) =>
                                        updateAvailabilitySlot(
                                          day,
                                          index,
                                          "to",
                                          e.target.value
                                        )
                                      }
                                      className={`flex-1 px-2 py-1.5 rounded border text-xs ${
                                        isDarkMode
                                          ? "bg-slate-700 border-slate-600 text-white"
                                          : "bg-white border-gray-300 text-gray-900"
                                      }`}
                                    />
                                    {slots.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeAvailabilitySlot(day, index)
                                        }
                                        className="p-1.5 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                                      >
                                        <X size={14} />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Session Fees (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={mentorForm.fees}
                        onChange={(e) =>
                          setMentorForm({ ...mentorForm, fees: e.target.value })
                        }
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          isDarkMode
                            ? "bg-slate-800/50 border-blue-500/30 text-white"
                            : "bg-white border-blue-300 text-gray-900"
                        }`}
                      />
                    </div>

                    <div className="flex items-center">
                      <label
                        className={`flex items-center gap-3 text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={mentorForm.available}
                          onChange={(e) =>
                            setMentorForm({
                              ...mentorForm,
                              available: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        Available for Mentorship
                      </label>
                    </div>
                  </div>

                  <div
                    className={`flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t-2 ${
                      isDarkMode ? "border-blue-500/30" : "border-blue-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setShowMentorForm(false)}
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
                      className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving...
                        </span>
                      ) : myMentorProfile ? (
                        "Update Profile"
                      ) : (
                        "Create Profile"
                      )}
                    </button>
                  </div>
                </form>
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

      {/* Session Update Form Modal - Responsive */}
      {showSessionForm && selectedMentorship && (
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
                    {userType === "alumni" &&
                    selectedMentorship.status === "pending"
                      ? "Respond to Request"
                      : "Update Session Details"}
                  </h2>
                  <p
                    className={`text-xs sm:text-sm mt-1 ${
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
                  : (e) => {
                      e.preventDefault();
                      if (selectedMentorship.status === "pending") {
                        return;
                      }
                      updateSession(e);
                    }
              }
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                    className={`w-full px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${
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
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-20 sm:h-24 text-sm sm:text-base ${
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

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSessionForm(false)}
                  className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-colors font-medium text-sm sm:text-base ${
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
                      className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      className="flex-1 bg-gradient-to-r from-red-400 to-pink-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

export default MentorMentee;
