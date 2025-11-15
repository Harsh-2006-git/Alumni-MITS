import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  DollarSign,
  Clock,
  Edit2,
  Save,
  X,
  Calendar,
  Star,
  Award,
  Users,
  MessageSquare,
  Target,
  Sparkles,
  CheckCircle,
  XCircle,
  Linkedin,
  Mail,
  Phone,
  Globe,
  BookOpen,
  Heart,
  Lightbulb,
  TrendingUp,
  Plus,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

const AlumniProfile = ({ isDarkMode = false, toggleTheme = () => {} }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    batch_year: "",
    branch: "",
    current_position: "",
    company: "",
    location: "",
    linkedin_url: "",
    website: "",
    bio: "",
  });

  const [mentorForm, setMentorForm] = useState({
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

  const API_BASE = "https://alumni-mits-l45r.onrender.com";
  const MENTOR_API = `${API_BASE}/mentor`;

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Auth check
  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const checkAuth = () => {
    const authData = localStorage.getItem("auth");
    if (!authData) {
      navigate("/login");
      return false;
    }

    const user = JSON.parse(authData);
    if (user.userType !== "alumni") {
      showNotification("Only alumni can access this page", "error");
      navigate("/");
      return false;
    }

    setUserData(user);
    return true;
  };

  useEffect(() => {
    if (checkAuth()) {
      loadUserProfile();
      loadMentorProfile();
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const authToken = getAuthToken();
      const authData = JSON.parse(localStorage.getItem("auth"));
      setProfileForm((prev) => ({
        ...prev,
        name: authData.name || "",
        email: authData.email || "",
      }));
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadMentorProfile = async () => {
    try {
      const authToken = getAuthToken();
      const response = await axios.get(`${MENTOR_API}/my-profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const mentorData = response.data.data;
      setMentorProfile(mentorData);

      // Update both profile form and mentor form with mentor data
      if (mentorData) {
        setProfileForm((prev) => ({
          ...prev,
          name: mentorData.name || "",
          email: mentorData.email || "",
          phone: mentorData.phone || "",
          batch_year: mentorData.batch_year || "",
          branch: mentorData.branch || "",
          current_position: mentorData.current_position || "",
          company: mentorData.company || "",
          linkedin_url: mentorData.linkedin_url || "",
        }));

        // Update mentor form with mentor data including availability
        setMentorForm((prev) => ({
          ...prev,
          expertise: mentorData.expertise || "",
          topics: mentorData.topics || [],
          availability: mentorData.availability || {
            sunday: [{ from: "09:00", to: "17:00" }],
            saturday: [{ from: "10:00", to: "16:00" }],
            other_days: [{ from: "18:00", to: "20:00" }],
          },
          fees: mentorData.fees || "",
          available: mentorData.available !== false,
        }));
      }
    } catch (error) {
      console.error("Error loading mentor profile:", error);
      // It's okay if no mentor profile exists yet
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const authToken = getAuthToken();

      // If mentor profile exists, update it, otherwise create it
      if (mentorProfile) {
        await axios.put(`${MENTOR_API}/edit/${mentorProfile.id}`, profileForm, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        // Create mentor profile with profile data
        const response = await axios.post(`${MENTOR_API}/create`, profileForm, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        setMentorProfile(response.data.data);
      }

      setShowProfileForm(false);
      showNotification("Profile updated successfully!", "success");
      loadMentorProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Failed to update profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const createMentorProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const authToken = getAuthToken();

      // Prepare the data with proper structure
      const mentorData = {
        ...mentorForm,
        batch_year: profileForm.batch_year,
        branch: profileForm.branch,
        current_position: profileForm.current_position,
        company: profileForm.company,
        linkedin_url: profileForm.linkedin_url,
      };

      const response = await axios.post(`${MENTOR_API}/create`, mentorData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      setMentorProfile(response.data.data);
      setShowMentorForm(false);
      showNotification("Mentor profile created successfully!", "success");
      loadMentorProfile();
    } catch (error) {
      console.error("Error creating mentor profile:", error);
      showNotification(
        "Failed to create mentor profile. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const updateMentorProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const authToken = getAuthToken();

      // Prepare the data with proper structure
      const mentorData = {
        ...mentorForm,
        batch_year: profileForm.batch_year,
        branch: profileForm.branch,
        current_position: profileForm.current_position,
        company: profileForm.company,
        linkedin_url: profileForm.linkedin_url,
      };

      const response = await axios.put(
        `${MENTOR_API}/edit/${mentorProfile.id}`,
        mentorData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMentorProfile(response.data.data);
      setShowMentorForm(false);
      showNotification("Mentor profile updated successfully!", "success");
      loadMentorProfile();
    } catch (error) {
      console.error("Error updating mentor profile:", error);
      showNotification(
        "Failed to update mentor profile. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

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
        [day]: newSlots.length > 0 ? newSlots : [],
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

  const openProfileForm = () => {
    setShowProfileForm(true);
  };

  const openMentorForm = () => {
    setShowMentorForm(true);
  };

  if (loading) {
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
              Loading your profile...
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
                : "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400 text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Alumni Profile
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-base sm:text-xl lg:text-2xl mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            Manage Your Profile & Mentor Status
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Profile Overview */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Profile Card */}
              <div
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 shadow-2xl ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900/90 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm border-blue-500/20"
                    : "bg-white border-blue-300 shadow-xl"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <img
                      src={
                        mentorProfile?.alumni?.profilePhoto ||
                        "https://via.placeholder.com/100"
                      }
                      alt={profileForm.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-400/30 shadow-lg"
                    />
                    <div>
                      <h2
                        className={`text-xl sm:text-2xl font-bold mb-2 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {profileForm.name || "Your Name"}
                      </h2>
                      <p
                        className={`text-cyan-500 text-sm sm:text-base mb-3 ${
                          isDarkMode ? "text-cyan-400" : "text-cyan-600"
                        }`}
                      >
                        {profileForm.current_position || "Add your position"}
                        {profileForm.company && ` at ${profileForm.company}`}
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                        {profileForm.batch_year && (
                          <span
                            className={`flex items-center gap-1 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            <GraduationCap size={14} />
                            Batch {profileForm.batch_year}
                          </span>
                        )}
                        {profileForm.branch && (
                          <span
                            className={`flex items-center gap-1 ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            • {profileForm.branch}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={openProfileForm}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all text-sm sm:text-base"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {profileForm.email && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                        }`}
                      >
                        <Mail size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Email
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {profileForm.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {profileForm.phone && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-green-500/20" : "bg-green-100"
                        }`}
                      >
                        <Phone size={16} className="text-green-500" />
                      </div>
                      <div>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Phone
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {profileForm.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {profileForm.linkedin_url && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-blue-600/20" : "bg-blue-100"
                        }`}
                      >
                        <Linkedin size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          LinkedIn
                        </p>
                        <a
                          href={profileForm.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}

                  {profileForm.website && (
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
                        }`}
                      >
                        <Globe size={16} className="text-purple-500" />
                      </div>
                      <div>
                        <p
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Website
                        </p>
                        <a
                          href={profileForm.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors"
                        >
                          Visit Site
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mentor Profile Card */}
              <div
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 shadow-2xl ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900/90 via-purple-900/20 to-indigo-900/20 backdrop-blur-sm border-purple-500/20"
                    : "bg-white border-purple-300 shadow-xl"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div>
                    <h2
                      className={`text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent`}
                    >
                      Mentor Profile
                    </h2>
                    <p
                      className={`text-sm sm:text-base ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {mentorProfile
                        ? "Manage your mentorship availability and preferences"
                        : "Become a mentor and guide the next generation"}
                    </p>
                  </div>
                  <button
                    onClick={openMentorForm}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all text-sm sm:text-base"
                  >
                    <Users size={16} />
                    {mentorProfile ? "Edit Mentor Profile" : "Become Mentor"}
                  </button>
                </div>

                {mentorProfile ? (
                  <div className="space-y-6">
                    {/* Status & Fees */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div
                        className={`rounded-xl p-4 border-2 ${
                          isDarkMode
                            ? mentorProfile.available
                              ? "bg-green-500/20 border-green-500/40"
                              : "bg-red-500/20 border-red-500/40"
                            : mentorProfile.available
                            ? "bg-green-100 border-green-300"
                            : "bg-red-100 border-red-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${
                              isDarkMode ? "bg-white/20" : "bg-white"
                            }`}
                          >
                            {mentorProfile.available ? (
                              <CheckCircle
                                size={16}
                                className="text-green-500"
                              />
                            ) : (
                              <XCircle size={16} className="text-red-500" />
                            )}
                          </div>
                          <div>
                            <p
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Status
                            </p>
                            <p
                              className={`text-sm font-bold ${
                                mentorProfile.available
                                  ? "text-green-600"
                                  : "text-red-600"
                              } ${
                                isDarkMode
                                  ? mentorProfile.available
                                    ? "text-green-400"
                                    : "text-red-400"
                                  : ""
                              }`}
                            >
                              {mentorProfile.available
                                ? "Available"
                                : "Not Available"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`rounded-xl p-4 border-2 ${
                          isDarkMode
                            ? "bg-orange-500/20 border-orange-500/40"
                            : "bg-orange-100 border-orange-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${
                              isDarkMode ? "bg-white/20" : "bg-white"
                            }`}
                          >
                            <DollarSign size={16} className="text-orange-500" />
                          </div>
                          <div>
                            <p
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Session Fee
                            </p>
                            <p
                              className={`text-sm font-bold ${
                                isDarkMode
                                  ? "text-orange-400"
                                  : "text-orange-600"
                              }`}
                            >
                              ₹{mentorProfile.fees}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expertise */}
                    {mentorProfile.expertise && (
                      <div>
                        <h3
                          className={`text-lg font-semibold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}
                        >
                          Expertise
                        </h3>
                        <p
                          className={`text-sm sm:text-base ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {mentorProfile.expertise}
                        </p>
                      </div>
                    )}

                    {/* Topics */}
                    {mentorProfile.topics &&
                      mentorProfile.topics.length > 0 && (
                        <div>
                          <h3
                            className={`text-lg font-semibold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}
                          >
                            Mentorship Topics
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {mentorProfile.topics.map((topic, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1.5 rounded-full font-medium border text-xs sm:text-sm ${
                                  isDarkMode
                                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border-purple-400/40"
                                    : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300"
                                }`}
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Availability */}
                    {mentorProfile.availability && (
                      <div>
                        <h3
                          className={`text-lg font-semibold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent`}
                        >
                          Availability
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(mentorProfile.availability).map(
                            ([day, slots]) => (
                              <div
                                key={day}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl gap-2 ${
                                  isDarkMode ? "bg-slate-800/50" : "bg-gray-100"
                                }`}
                              >
                                <span
                                  className={`font-medium capitalize text-sm flex items-center gap-2 ${
                                    isDarkMode
                                      ? "text-gray-200"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <Calendar size={14} />
                                  {day === "other_days"
                                    ? "Weekdays (Mon-Fri)"
                                    : day}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {slots && slots.length > 0 ? (
                                    slots.map((slot, index) => (
                                      <span
                                        key={index}
                                        className={`px-3 py-1.5 rounded-lg text-xs border flex items-center gap-2 ${
                                          isDarkMode
                                            ? "bg-slate-700 text-gray-200 border-slate-600"
                                            : "bg-white text-gray-800 border-gray-400"
                                        }`}
                                      >
                                        <Clock size={12} />
                                        {slot.from} - {slot.to}
                                      </span>
                                    ))
                                  ) : (
                                    <span
                                      className={`text-xs ${
                                        isDarkMode
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      Not available
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users
                      className={`mx-auto mb-4 ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                      size={48}
                    />
                    <h3
                      className={`text-lg font-medium mb-2 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Not a Mentor Yet
                    </h3>
                    <p
                      className={`mb-6 max-w-md mx-auto ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Share your knowledge and experience with students. Become
                      a mentor to guide the next generation of professionals.
                    </p>
                    <button
                      onClick={openMentorForm}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all"
                    >
                      Setup Mentor Profile
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Stats & Quick Actions */}
            <div className="space-y-6 sm:space-y-8">
              {/* Quick Stats */}
              <div
                className={`rounded-2xl sm:rounded-3xl p-6 border-2 shadow-xl ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900/90 via-blue-900/20 to-indigo-900/20 backdrop-blur-sm border-blue-500/20"
                    : "bg-white border-blue-300 shadow-xl"
                }`}
              >
                <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Profile Completion
                    </span>
                    <span className="text-sm font-bold text-cyan-500">85%</span>
                  </div>
                  <div
                    className={`w-full rounded-full h-2 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full w-4/5"></div>
                  </div>

                  {mentorProfile && (
                    <>
                      <div className="flex items-center justify-between pt-2">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Mentor Status
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            mentorProfile.available
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {mentorProfile.available ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Session Fee
                        </span>
                        <span className="text-sm font-bold text-orange-500">
                          ₹{mentorProfile.fees}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div
                className={`rounded-2xl sm:rounded-3xl p-6 border-2 shadow-xl ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900/90 via-green-900/20 to-emerald-900/20 backdrop-blur-sm border-green-500/20"
                    : "bg-white border-green-300 shadow-xl"
                }`}
              >
                <h3 className="text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={openProfileForm}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      isDarkMode
                        ? "border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                        : "border-blue-300 text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    <User size={16} />
                    Update Profile
                  </button>

                  <button
                    onClick={openMentorForm}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      isDarkMode
                        ? "border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                        : "border-purple-300 text-purple-700 hover:bg-purple-50"
                    }`}
                  >
                    <Users size={16} />
                    {mentorProfile ? "Edit Mentor" : "Become Mentor"}
                  </button>

                  {mentorProfile && (
                    <button
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        isDarkMode
                          ? "border-green-500/30 text-green-300 hover:bg-green-500/10"
                          : "border-green-300 text-green-700 hover:bg-green-50"
                      }`}
                    >
                      <MessageSquare size={16} />
                      View Requests
                    </button>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div
                className={`rounded-2xl sm:rounded-3xl p-6 border-2 shadow-xl ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900/90 via-amber-900/20 to-orange-900/20 backdrop-blur-sm border-amber-500/20"
                    : "bg-white border-amber-300 shadow-xl"
                }`}
              >
                <h3 className="text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-4">
                  Profile Tips
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Lightbulb
                      size={16}
                      className="text-amber-500 mt-0.5 flex-shrink-0"
                    />
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Keep your profile updated with current position and
                      company
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp
                      size={16}
                      className="text-amber-500 mt-0.5 flex-shrink-0"
                    />
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Add a professional bio to attract more mentorship requests
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Heart
                      size={16}
                      className="text-amber-500 mt-0.5 flex-shrink-0"
                    />
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Set clear availability to help students schedule sessions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />

      {/* Profile Form Modal */}
      {showProfileForm && (
        <ProfileFormModal
          isDarkMode={isDarkMode}
          profileForm={profileForm}
          setProfileForm={setProfileForm}
          saving={saving}
          onClose={() => setShowProfileForm(false)}
          onSubmit={updateProfile}
        />
      )}

      {/* Mentor Form Modal */}
      {showMentorForm && (
        <MentorFormModal
          isDarkMode={isDarkMode}
          mentorForm={mentorForm}
          setMentorForm={setMentorForm}
          saving={saving}
          isEdit={!!mentorProfile}
          onClose={() => setShowMentorForm(false)}
          onSubmit={mentorProfile ? updateMentorProfile : createMentorProfile}
          addAvailabilitySlot={addAvailabilitySlot}
          removeAvailabilitySlot={removeAvailabilitySlot}
          updateAvailabilitySlot={updateAvailabilitySlot}
        />
      )}
    </div>
  );
};

// Profile Form Modal Component
const ProfileFormModal = ({
  isDarkMode,
  profileForm,
  setProfileForm,
  saving,
  onClose,
  onSubmit,
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="max-w-2xl w-full max-h-[90vh] flex flex-col">
      <div
        className={`rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-full overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
            : "bg-white border-blue-300"
        }`}
      >
        <div
          className={`p-4 sm:p-6 border-b-2 flex-shrink-0 ${
            isDarkMode
              ? "border-blue-500/30 bg-slate-900/90"
              : "border-blue-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
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

        <div className="overflow-y-auto flex-1">
          <form
            onSubmit={onSubmit}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
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
                  Email *
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
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
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
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
                  Batch Year *
                </label>
                <input
                  type="number"
                  value={profileForm.batch_year}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
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
                  value={profileForm.branch}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, branch: e.target.value })
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
                  value={profileForm.current_position}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      current_position: e.target.value,
                    })
                  }
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                    isDarkMode
                      ? "bg-slate-800/50 border-blue-500/30 text-white"
                      : "bg-white border-blue-300 text-gray-900"
                  }`}
                  placeholder="e.g., Software Engineer"
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
                  value={profileForm.company}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, company: e.target.value })
                  }
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                    isDarkMode
                      ? "bg-slate-800/50 border-blue-500/30 text-white"
                      : "bg-white border-blue-300 text-gray-900"
                  }`}
                  placeholder="e.g., Google, Microsoft"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={profileForm.linkedin_url}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      linkedin_url: e.target.value,
                    })
                  }
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                    isDarkMode
                      ? "bg-slate-800/50 border-blue-500/30 text-white"
                      : "bg-white border-blue-300 text-gray-900"
                  }`}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t-2 ${
                isDarkMode ? "border-blue-500/30" : "border-blue-300"
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-colors font-medium text-sm sm:text-base ${
                  isDarkMode
                    ? "border-blue-500/30 text-gray-300 hover:bg-slate-800"
                    : "border-blue-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

// Mentor Form Modal Component
const MentorFormModal = ({
  isDarkMode,
  mentorForm,
  setMentorForm,
  saving,
  isEdit,
  onClose,
  onSubmit,
  addAvailabilitySlot,
  removeAvailabilitySlot,
  updateAvailabilitySlot,
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="max-w-2xl w-full max-h-[90vh] flex flex-col">
      <div
        className={`rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-full overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-purple-900/30 to-indigo-900/20 border-2 border-purple-500/30"
            : "bg-white border-purple-300"
        }`}
      >
        <div
          className={`p-4 sm:p-6 border-b-2 flex-shrink-0 ${
            isDarkMode
              ? "border-purple-500/30 bg-slate-900/90"
              : "border-purple-300 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              {isEdit ? "Edit Mentor Profile" : "Create Mentor Profile"}
            </h2>
            <button
              onClick={onClose}
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

        <div className="overflow-y-auto flex-1">
          <form
            onSubmit={onSubmit}
            className="p-4 sm:p-6 space-y-4 sm:space-y-6"
          >
            <div>
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
                  setMentorForm({ ...mentorForm, expertise: e.target.value })
                }
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-24 text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-slate-800/50 border-purple-500/30 text-white"
                    : "bg-white border-purple-300 text-gray-900"
                }`}
                placeholder="Describe your expertise, experience, and what you can mentor on..."
                required
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Mentorship Topics *
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-slate-800/50 border-purple-500/30 text-white"
                    : "bg-white border-purple-300 text-gray-900"
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-slate-800/50 border-purple-500/30 text-white"
                    : "bg-white border-purple-300 text-gray-900"
                }`}
                placeholder="0.00"
              />
            </div>

            {/* Availability Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Availability Schedule *
                </label>
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Set your available time slots
                </span>
              </div>

              <div className="space-y-4">
                {Object.entries(mentorForm.availability).map(([day, slots]) => (
                  <div
                    key={day}
                    className={`rounded-lg p-4 border-2 ${
                      isDarkMode
                        ? "bg-slate-800/30 border-purple-500/20"
                        : "bg-gray-50 border-purple-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-sm font-semibold capitalize flex items-center gap-2 ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        <Calendar size={14} />
                        {day === "other_days" ? "Weekdays (Mon-Fri)" : day}
                      </span>
                      <button
                        type="button"
                        onClick={() => addAvailabilitySlot(day)}
                        className="text-xs px-3 py-1.5 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Add Slot
                      </button>
                    </div>

                    <div className="space-y-3">
                      {slots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1 flex items-center gap-2">
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
                              className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                                isDarkMode
                                  ? "bg-slate-700 border-slate-600 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                            />
                            <span
                              className={
                                isDarkMode ? "text-gray-400" : "text-gray-600"
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
                              className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                                isDarkMode
                                  ? "bg-slate-700 border-slate-600 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                            />
                          </div>

                          {slots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAvailabilitySlot(day, index)}
                              className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center"
                              title="Remove time slot"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {slots.length === 0 && (
                      <div
                        className={`text-center py-4 rounded-lg ${
                          isDarkMode ? "bg-slate-700/50" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          No time slots added
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                Available for Mentorship
              </label>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t-2 ${
                isDarkMode ? "border-purple-500/30" : "border-purple-300"
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-colors font-medium text-sm sm:text-base ${
                  isDarkMode
                    ? "border-purple-500/30 text-gray-300 hover:bg-slate-800"
                    : "border-purple-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isEdit ? "Updating..." : "Creating..."}
                  </span>
                ) : isEdit ? (
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
);

export default AlumniProfile;
