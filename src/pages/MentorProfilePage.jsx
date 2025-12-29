import React, { useState, useEffect } from "react";
import axios from "axios";

import {
    UserCheck,
    X,
    CheckCircle,
    XCircle,
    GraduationCap,
    DollarSign,
    Sparkles,
    Edit2,
    Briefcase,
    MessageSquare,
    AlertCircle,
    CreditCard,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";
import { branches } from "../data/branches";

const currentYear = new Date().getFullYear();
const batchYears = Array.from({ length: currentYear + 5 - 1960 }, (_, i) => 1960 + i).reverse();

const MentorProfile = ({ isDarkMode = false, toggleTheme = () => { } }) => {
    const [myMentorProfile, setMyMentorProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showMentorForm, setShowMentorForm] = useState(false);
    const [notification, setNotification] = useState(null);

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
        upi_id: "",
        available: true,
    });

    const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
    const API_BASE = `${BASE_URL}/mentor`;

    // Show notification helper
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
        if (userType === "alumni" && isLoggedIn) {
            loadMyMentorProfile();
        }
    }, [userType, isLoggedIn]);

    const loadMyMentorProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/my-profile`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setMyMentorProfile(response.data.data);
        } catch (error) {
            console.error("Error loading mentor profile:", error);
            if (error.response?.status !== 404) {
                const errorMessage =
                    error.response?.data?.message || "Failed to load mentor profile";
                showNotification(errorMessage, "error");
            }
        } finally {
            setLoading(false);
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
            showNotification(
                response.data.message || "Mentor profile created successfully!",
                "success"
            );
        } catch (error) {
            console.error("Error creating mentor profile:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Failed to create mentor profile. Please try again.";
            showNotification(errorMessage, "error");
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
            showNotification(
                response.data.message || "Mentor profile updated successfully!",
                "success"
            );
        } catch (error) {
            console.error("Error updating mentor profile:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Failed to update mentor profile. Please try again.";
            showNotification(errorMessage, "error");
        } finally {
            setLoading(false);
        }
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
                upi_id: myMentorProfile.upi_id || "",
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
                upi_id: "",
                available: true,
            });
        }
        setShowMentorForm(true);
    };

    // Not logged in state
    if (!isLoggedIn) {
        return (
            <div
                className={`min-h-screen transition-colors duration-500 ${isDarkMode
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-gray-900"
                    }`}
            >
                <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                Mentor Profile
                            </h1>
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-center min-h-[60vh] px-4">
                    <div
                        className={`rounded-3xl p-8 sm:p-12 shadow-lg border max-w-md w-full text-center ${isDarkMode
                            ? "bg-slate-900 border-slate-800"
                            : "bg-white border-slate-200"
                            }`}
                    >
                        <UserCheck className="mx-auto mb-6 text-cyan-400" size={64} />
                        <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            Login Required
                        </h2>
                        <p
                            className={`text-base sm:text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                        >
                            Please log in to access mentor profile features
                        </p>
                        <a
                            href="/login"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md"
                        >
                            Go to Login
                        </a>
                    </div>
                </div>

                <Footer isDarkMode={isDarkMode} />
            </div>
        );
    }

    // Student state
    if (userType === "student") {
        return (
            <div
                className={`min-h-screen transition-colors duration-500 ${isDarkMode
                    ? "bg-slate-950 text-white"
                    : "bg-slate-50 text-gray-900"
                    }`}
            >
                <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
                                Mentor Profile
                            </h1>
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
                        </div>
                    </div>
                </section>

                <div className="flex items-center justify-center min-h-[60vh] px-4">
                    <div
                        className={`rounded-3xl p-8 sm:p-12 shadow-lg border max-w-md w-full text-center ${isDarkMode
                            ? "bg-slate-900 border-slate-800"
                            : "bg-white border-slate-200"
                            }`}
                    >
                        <MessageSquare className="mx-auto mb-6 text-orange-400" size={64} />
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                            Alumni Only
                        </h2>
                        <p
                            className={`text-base sm:text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                        >
                            Only alumni can create mentor profiles. Students can browse
                            mentors and request mentorship sessions.
                        </p>
                    </div>
                </div>

                <Footer isDarkMode={isDarkMode} />
            </div>
        );
    }

    // Loading state
    if (loading && !myMentorProfile) {
        return (
            <div
                className={`min-h-screen ${isDarkMode
                    ? "bg-slate-950"
                    : "bg-slate-50"
                    }`}
            >
                <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-t-cyan-500 border-r-blue-500 border-b-indigo-500 border-l-transparent mx-auto mb-4"></div>
                        <p
                            className={`text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                        >
                            Loading mentor profile...
                        </p>
                    </div>
                </div>

                <Footer isDarkMode={isDarkMode} />
            </div>
        );
    }

    // Alumni - Main content
    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${isDarkMode
                ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
                : "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 text-gray-900"
                }`}
        >
            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 left-4 right-4 sm:left-auto sm:right-4 z-[100] animate-in slide-in-from-right duration-300 max-w-md">
                    <div
                        className={`rounded-xl shadow-2xl p-4 border-2 backdrop-blur-lg ${notification.type === "success"
                            ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400 text-white"
                            : notification.type === "error"
                                ? "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400 text-white"
                                : "bg-gradient-to-r from-blue-500/90 to-purple-500/90 border-blue-400 text-white"
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {notification.type === "success" ? (
                                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                ) : notification.type === "error" ? (
                                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                ) : (
                                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
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

            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-12 lg:py-16 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-6">
                        <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                            Mentor Profile
                        </h1>
                        <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400 animate-pulse" />
                    </div>
                    <p className="text-sm sm:text-xl lg:text-2xl mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent font-semibold">
                        Share Your Knowledge • Guide Future Leaders
                    </p>
                    <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-cyan-400/40 to-indigo-500/40 mx-auto rounded-full shadow-sm"></div>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
                <div className="max-w-7xl mx-auto">
                    <div
                        className={`rounded-xl sm:rounded-3xl p-3 sm:p-8 border shadow-xl ${isDarkMode
                            ? "bg-slate-900/90 backdrop-blur-md border-blue-500/10"
                            : "bg-white border-blue-100"
                            }`}
                    >
                        {!myMentorProfile ? (
                            <div className="text-center py-12">
                                <UserCheck
                                    className={`mx-auto mb-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                                        }`}
                                    size={48}
                                />
                                <h3
                                    className={`text-xl sm:text-2xl font-bold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-900"
                                        }`}
                                >
                                    Become a Mentor
                                </h3>
                                <p
                                    className={`mb-6 max-w-md mx-auto text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                >
                                    Share your knowledge and experience with students. Guide the
                                    next generation of professionals.
                                </p>
                                <button
                                    onClick={openMentorForm}
                                    className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-md"
                                >
                                    Create Mentor Profile
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 sm:space-y-8">
                                {/* Profile Header */}
                                <div className="flex flex-col lg:flex-row items-start justify-between gap-3 sm:gap-6">
                                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 w-full lg:w-auto">
                                        <img
                                            src={
                                                myMentorProfile.alumni?.profilePhoto ||
                                                "https://img.freepik.com/premium-vector/man-avatar-glasses-young_594966-9.jpg"
                                            }
                                            alt={myMentorProfile.name}
                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-xl border-2 border-white dark:border-slate-800 transition-transform hover:scale-105"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h2
                                                className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                                                    }`}
                                            >
                                                {myMentorProfile.name}
                                            </h2>
                                            <p className="text-cyan-400 text-xs sm:text-base">
                                                {myMentorProfile.current_position} at{" "}
                                                {myMentorProfile.company}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm">
                                                <span
                                                    className={`flex items-center gap-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                        }`}
                                                >
                                                    <GraduationCap size={14} className="text-blue-500" />
                                                    Batch {myMentorProfile.batch_year} • {myMentorProfile.branch}
                                                </span>
                                                <span
                                                    className={`flex items-center gap-1.5 font-bold ${myMentorProfile.available
                                                        ? "text-emerald-500"
                                                        : "text-rose-500"
                                                        }`}
                                                >
                                                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                                    {myMentorProfile.available ? "Available" : "Busy"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={openMentorForm}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transition-all text-sm sm:text-base active:scale-95"
                                    >
                                        <Edit2 size={16} />
                                        Edit Profile
                                    </button>
                                </div>

                                {/* Profile Details */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                                    {/* Left Column */}
                                    <div className="space-y-4 sm:space-y-8">
                                        <div>
                                            <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-4 flex items-center gap-2">
                                                <Sparkles size={16} className="text-cyan-400" />
                                                Expertise
                                            </h3>
                                            <p
                                                className={`rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed border shadow-sm ${isDarkMode
                                                    ? "bg-slate-800/50 border-blue-500/20 text-gray-200"
                                                    : "bg-gray-50 border-blue-100 text-gray-800"
                                                    }`}
                                            >
                                                {myMentorProfile.expertise}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-4 flex items-center gap-2">
                                                <MessageSquare size={16} className="text-cyan-400" />
                                                Mentorship Topics
                                            </h3>
                                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                                {myMentorProfile.topics.map((topic, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-4 py-1.5 rounded-xl font-bold border shadow-sm text-xs sm:text-sm transition-all hover:scale-105 ${isDarkMode
                                                            ? "bg-blue-900/20 text-cyan-300 border-blue-500/30"
                                                            : "bg-blue-50 text-blue-700 border-blue-200"
                                                            }`}
                                                    >
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 sm:gap-8">
                                            <div>
                                                <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-4">
                                                    Fees
                                                </h3>
                                                <div className="flex items-center gap-2 text-xl sm:text-3xl font-black text-orange-500">
                                                    <DollarSign size={20} className="sm:w-8 sm:h-8" />
                                                    <span>₹{myMentorProfile.fees}</span>
                                                </div>
                                            </div>
                                            {myMentorProfile.upi_id && (
                                                <div>
                                                    <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-4">
                                                        UPI ID
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs sm:text-lg font-bold">
                                                        <CreditCard size={18} className="sm:w-8 sm:h-8 text-emerald-500" />
                                                        <span className={isDarkMode ? "text-gray-300" : "text-gray-800"} title={myMentorProfile.upi_id}>
                                                            {myMentorProfile.upi_id.length > 18 ? `${myMentorProfile.upi_id.substring(0, 15)}...` : myMentorProfile.upi_id}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="mt-6 sm:mt-0">
                                        <h3 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3 sm:mb-4 flex items-center gap-2">
                                            <Briefcase size={16} className="text-cyan-400" />
                                            Availability
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            {Object.entries(myMentorProfile.availability).map(
                                                ([day, slots]) => (
                                                    <div
                                                        key={day}
                                                        className={`flex items-center justify-between p-3.5 sm:p-5 rounded-2xl gap-3 border shadow-sm ${isDarkMode ? "bg-slate-800/40 border-slate-700/50" : "bg-gray-50/80 border-blue-100/50"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`font-bold capitalize text-xs sm:text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"
                                                                }`}
                                                        >
                                                            {day === "other_days" ? "Weekdays" : day}
                                                        </span>
                                                        <div className="flex flex-wrap justify-end gap-2 max-w-[65%]">
                                                            {slots.map((slot, index) => (
                                                                <span
                                                                    key={index}
                                                                    className={`px-3 py-1 rounded-lg text-[10px] sm:text-sm font-bold border-2 ${isDarkMode
                                                                        ? "bg-slate-700/50 text-cyan-400 border-cyan-500/20 shadow-inner"
                                                                        : "bg-white text-indigo-600 border-indigo-50 shadow-sm"
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
                </div>
            </section>

            <Footer isDarkMode={isDarkMode} />

            {/* Mentor Profile Form Modal */}
            {showMentorForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="max-w-2xl w-full max-h-[90vh] flex flex-col scale-in-center">
                        <div
                            className={`rounded-3xl shadow-2xl flex flex-col max-h-full overflow-hidden border-2 ${isDarkMode
                                ? "bg-slate-900 border-blue-500/20"
                                : "bg-white border-blue-100"
                                }`}
                        >
                            <div
                                className={`p-4 sm:p-6 border-b-2 flex-shrink-0 backdrop-blur-md ${isDarkMode
                                    ? "border-blue-500/10 bg-slate-900/90"
                                    : "border-blue-50 bg-white/90"
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
                                        className={`p-1.5 rounded-lg transition-colors ${isDarkMode
                                            ? "text-gray-400 hover:text-white hover:bg-slate-800"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            }`}
                                    >
                                        <X size={18} className="sm:w-6 sm:h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-1">
                                <form
                                    onSubmit={
                                        myMentorProfile ? updateMentorProfile : createMentorProfile
                                    }
                                    className="p-3 sm:p-6 space-y-3 sm:space-y-6"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                                        <div>
                                            <label
                                                className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                Batch Year *
                                            </label>
                                            <select
                                                value={mentorForm.batch_year}
                                                onChange={(e) =>
                                                    setMentorForm({
                                                        ...mentorForm,
                                                        batch_year: e.target.value,
                                                    })
                                                }
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${isDarkMode
                                                    ? "bg-slate-800/50 border-blue-500/30 text-white"
                                                    : "bg-white border-blue-300 text-gray-900"
                                                    }`}
                                                required
                                            >
                                                <option value="">Select Batch Year</option>
                                                {batchYears.map((year) => (
                                                    <option key={year} value={year}>
                                                        {year}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                Branch *
                                            </label>
                                            <select
                                                value={mentorForm.branch}
                                                onChange={(e) =>
                                                    setMentorForm({
                                                        ...mentorForm,
                                                        branch: e.target.value,
                                                    })
                                                }
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${isDarkMode
                                                    ? "bg-slate-800/50 border-blue-500/30 text-white"
                                                    : "bg-white border-blue-300 text-gray-900"
                                                    }`}
                                                required
                                            >
                                                <option value="">Select Branch</option>
                                                {branches.map((branch) => (
                                                    <option key={branch} value={branch}>
                                                        {branch}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${isDarkMode
                                                    ? "bg-slate-800/50 border-blue-500/30 text-white"
                                                    : "bg-white border-blue-300 text-gray-900"
                                                    }`}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${isDarkMode
                                                    ? "bg-slate-800/50 border-blue-500/30 text-white"
                                                    : "bg-white border-blue-300 text-gray-900"
                                                    }`}
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${isDarkMode
                                                    ? "bg-slate-800/50 border-blue-500/30 text-white"
                                                    : "bg-white border-blue-300 text-gray-900"
                                                    }`}
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-20 sm:h-24 text-xs sm:text-base ${isDarkMode
                                                    ? "bg-slate-800/50 border-blue-500/30 text-white"
                                                    : "bg-white border-blue-300 text-gray-900"
                                                    }`}
                                                placeholder="Describe your expertise, experience..."
                                                required
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                Topics *
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    Array.isArray(mentorForm.topics)
                                                        ? mentorForm.topics.join(", ")
                                                        : mentorForm.topics || ""
                                                }
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    setMentorForm({
                                                        ...mentorForm,
                                                        topics: inputValue
                                                            .split(",")
                                                            .map((topic) => topic.trim()),
                                                    });
                                                }}
                                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs sm:text-base ${isDarkMode
                                                    ? "bg-slate-800/50 border-blue-500/30 text-white"
                                                    : "bg-white border-blue-300 text-gray-900"
                                                    }`}
                                                placeholder="Web Dev, Interview Prep..."
                                                required
                                            />
                                            <p
                                                className={`text-[10px] sm:text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                    }`}
                                            >
                                                Separate topics with commas
                                            </p>
                                        </div>

                                        {/* Availability Section */}
                                        <div className="sm:col-span-2">
                                            <label
                                                className={`block text-xs sm:text-sm font-medium mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                Availability Schedule *
                                            </label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {Object.entries(mentorForm.availability).map(
                                                    ([day, slots]) => (
                                                        <div
                                                            key={day}
                                                            className={`rounded-lg p-3 sm:p-4 border ${isDarkMode
                                                                ? "bg-slate-800/50 border-slate-800"
                                                                : "bg-slate-50 border-slate-200"
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span
                                                                    className={`text-xs font-semibold capitalize ${isDarkMode
                                                                        ? "text-gray-200"
                                                                        : "text-gray-800"
                                                                        }`}
                                                                >
                                                                    {day === "other_days" ? "Weekdays" : day}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addAvailabilitySlot(day)}
                                                                    className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                                                >
                                                                    + Slot
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
                                                                            className={`flex-1 px-2 py-1.5 rounded border text-[10px] ${isDarkMode
                                                                                ? "bg-slate-700 border-slate-600 text-white"
                                                                                : "bg-white border-gray-300 text-gray-900"
                                                                                }`}
                                                                        />
                                                                        <span className="text-[10px] text-gray-400">to</span>
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
                                                                            className={`flex-1 px-2 py-1.5 rounded border text-[10px] ${isDarkMode
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
                                                                                className="p-1 text-red-400 hover:bg-red-500/20"
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

                                        <div className="sm:col-span-2 space-y-3 sm:space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                                                <div>
                                                    <label
                                                        className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                            }`}
                                                    >
                                                        Fees (₹) *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={mentorForm.fees}
                                                        onChange={(e) =>
                                                            setMentorForm({ ...mentorForm, fees: e.target.value })
                                                        }
                                                        className={`w-full px-3 py-2 sm:py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 text-xs sm:text-base ${isDarkMode
                                                            ? "bg-slate-800 border-slate-700 text-white"
                                                            : "bg-white border-slate-300 text-gray-900"
                                                            }`}
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        className={`block text-xs sm:text-sm font-medium mb-1.5 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                                            }`}
                                                    >
                                                        UPI ID *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={mentorForm.upi_id || ""}
                                                        onChange={(e) =>
                                                            setMentorForm({ ...mentorForm, upi_id: e.target.value })
                                                        }
                                                        placeholder="yourname@upi"
                                                        className={`w-full px-3 py-2 sm:py-3 rounded-lg border-2 focus:ring-2 focus:ring-blue-500 text-xs sm:text-base ${isDarkMode
                                                            ? "bg-slate-800/50 border-blue-500/30 text-white"
                                                            : "bg-white border-blue-300 text-gray-900"
                                                            }`}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <label
                                                    className={`flex items-center gap-2.5 text-xs sm:text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    Available for Mentorship
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-6 border-t border-slate-200 dark:border-slate-800"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setShowMentorForm(false)}
                                            className={`flex-1 px-6 py-3 border-2 rounded-xl transition-all font-bold text-sm sm:text-base ${isDarkMode
                                                ? "border-slate-700 text-gray-400 hover:bg-slate-800"
                                                : "border-slate-300 text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-[2] bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all text-sm sm:text-base disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Saving...
                                                </span>
                                            ) : myMentorProfile ? (
                                                "Update Changes"
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
        </div>
    );
};

export default MentorProfile;
