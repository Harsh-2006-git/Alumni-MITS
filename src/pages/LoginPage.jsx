import {
  Shield,
  AlertCircle,
  Mail,
  Sparkles,
  Lock,
  Users,
  Moon,
  Sun,
  Github,
  Linkedin,
  Twitter,
  GraduationCap,
  BookOpen,
  Trophy,
  Target,
  ArrowRight,
  Award,
  UserCheck,
  X,
  HelpCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";
import { cityCoordinates } from "../data/cities";
import { branches as branchList } from "../data/branches";

// Use the environment variable - this will work in JSX without TypeScript errors
const API_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/auth`
  : "http://localhost:3001/auth";

import { useTheme } from "../context/ThemeContext";

// Extra Email Popup Component
const ExtraEmailPopup = ({ isOpen, onClose, userData, onSave }) => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return "Please enter a valid email address";
    }

    // Check if email is from mitsgwl.ac.in domain
    if (email.toLowerCase().endsWith("@mitsgwl.ac.in")) {
      return "Please use a personal email address (not @mitsgwl.ac.in). After graduation, your institute email will no longer work.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Personal email is required to continue");
      return;
    }

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/update-extra-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.accessToken}`
        },
        body: JSON.stringify({
          userId: userData.userId,
          extraEmail: email.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Add extra email to user data and save
        const updatedUserData = {
          ...userData,
          extraEmail: email.trim(),
          hasExtraEmail: true
        };

        setTimeout(() => {
          onSave(updatedUserData);
          onClose();
        }, 1500);
      } else {
        if (data.data?.hasExtraEmail) {
          // User already has extra email, proceed with login
          setSuccess(true);
          setTimeout(() => {
            onSave({
              ...userData,
              extraEmail: data.data.existingExtraEmail,
              hasExtraEmail: true
            });
            onClose();
          }, 1500);
        } else {
          setError(data.message || "Failed to save email. Please try again.");
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 ${isDarkMode ? "bg-slate-900" : "bg-white"
        }`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                Personal Email Required
              </h3>
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className={`p-1.5 rounded-lg flex-shrink-0 ${isDarkMode
                  ? "hover:bg-gray-800 text-blue-400"
                  : "hover:bg-gray-100 text-blue-600"
                  }`}
                title="Why is this required?"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            <p className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
              Please provide a personal email to continue
            </p>

            {showInfo && (
              <div className={`mt-4 p-4 rounded-lg border ${isDarkMode
                ? "bg-blue-900/20 border-blue-800"
                : "bg-blue-50 border-blue-200"
                }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`} />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? "text-blue-300" : "text-blue-900"
                      }`}>
                      Why is this required?
                    </p>
                    <p className={`text-xs mt-1 ${isDarkMode ? "text-blue-200" : "text-blue-700"
                      }`}>
                      After successfully completing your degree, you will automatically become an alumni.
                      Your @mitsgwl.ac.in email will no longer work after graduation, so we need your
                      personal email for future communications and account access.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              Personal Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="example@gmail.com"
              className={`w-full px-4 py-3 rounded-lg border ${isDarkMode
                ? "border-gray-700 bg-gray-800 text-white placeholder-gray-500"
                : "border-gray-300 bg-transparent text-gray-900 placeholder-gray-400"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
              disabled={loading || success}
              autoFocus
            />
            <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
            </p>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg border ${isDarkMode
              ? "bg-red-900/20 border-red-800"
              : "bg-red-50 border-red-200"
              }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 ${isDarkMode ? "text-red-400" : "text-red-600"
                  }`} />
                <p className={`text-sm ${isDarkMode ? "text-red-400" : "text-red-600"
                  }`}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className={`mb-4 p-3 rounded-lg border ${isDarkMode
              ? "bg-green-900/20 border-green-800"
              : "bg-green-50 border-green-200"
              }`}>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className={`text-sm ${isDarkMode ? "text-green-400" : "text-green-600"
                  }`}>
                  Email saved successfully! Redirecting...
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || success || !email.trim()}
              className={`w-full px-4 py-3 rounded-lg font-medium transition ${loading || success || !email.trim()
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : success ? (
                "Saved!"
              ) : (
                "Save Email & Continue"
              )}
            </button>

            <div className={`text-xs text-center ${isDarkMode ? "text-gray-500" : "text-gray-600"
              }`}>
              <p>You must provide a personal email to access the portal</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Student Registration Popup Component
const StudentRegistrationPopup = ({ isOpen, userData, onComplete }) => {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    extraEmail: userData?.userEmail || "",
    phone: "",
    linkedin: "",
    location: "",
    branch: "",
    batch: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const branches = branchList;

  const years = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() + 4 - i).toString());

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.extraEmail || !formData.phone) {
        setError("Please fill all required fields");
        return;
      }
      if (formData.extraEmail.toLowerCase().endsWith("@mitsgwl.ac.in")) {
        setError("Please provide a personal email address");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (!formData.location) {
        setError("Location is required");
        return;
      }
      setError("");
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.branch || !formData.batch) {
      setError("Please select your branch and batch");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/register-student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.accessToken}`
        },
        body: JSON.stringify({
          userId: userData.userId,
          ...formData
        })
      });

      const data = await response.json();

      if (data.success) {
        onComplete(data);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredCities = Object.keys(cityCoordinates).filter(city =>
    city.toLowerCase().includes(formData.location.toLowerCase())
  ).slice(0, 5);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden ${isDarkMode ? "bg-slate-900/90 border border-white/10" : "bg-white/95 border border-gray-200"
            }`}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`} />
          <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 ${isDarkMode ? "bg-purple-500" : "bg-purple-400"}`} />

          <div className="relative p-8">
            {/* Progress header */}
            <div className="flex items-center justify-between mb-10 px-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="relative">
                    <motion.div
                      animate={{
                        backgroundColor: step >= s ? "#2563eb" : (isDarkMode ? "#1e293b" : "#f1f5f9"),
                        scale: step === s ? 1.1 : 1
                      }}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg transition-colors duration-500 ${step >= s ? "text-white" : isDarkMode ? "text-slate-400" : "text-gray-400"
                        }`}
                    >
                      {step > s ? "✓" : s}
                    </motion.div>
                    {step === s && (
                      <motion.div
                        layoutId="activeStep"
                        className="absolute inset-0 rounded-2xl border-2 border-blue-500/50 -m-1"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                  {s < 3 && (
                    <div className="flex-1 mx-4 h-1 rounded-full overflow-hidden bg-slate-800">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: step > s ? "100%" : "0%" }}
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <motion.h3
                key={step}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xl sm:text-3xl font-extrabold tracking-tight mb-1 sm:mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {step === 1 ? "Contact Details" : step === 2 ? "Social & Location" : "Academic Roots"}
              </motion.h3>
              <motion.p
                key={`desc-${step}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-[10px] sm:text-xs tracking-wide uppercase font-semibold ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                {step === 1 ? "Stay Connected" : step === 2 ? "Professional & Geographic" : "Define your MITS journey"}
              </motion.p>
            </div>

            <form onSubmit={step < 3 ? handleNext : handleSubmit} className="space-y-4 sm:space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="group">
                      <label className={`block text-[10px] sm:text-xs font-bold uppercase mb-1.5 sm:mb-2 pl-1 transition-colors ${isDarkMode ? "text-slate-500 group-focus-within:text-blue-400" : "text-gray-500 group-focus-within:text-blue-600"}`}>Personal Email</label>
                      <div className="relative">
                        <div className={`absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${isDarkMode ? "bg-slate-800 text-slate-400 group-focus-within:text-blue-400" : "bg-gray-100 text-gray-500 group-focus-within:text-blue-600"}`}>
                          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <input
                          type="email"
                          value={formData.extraEmail}
                          onChange={(e) => setFormData({ ...formData, extraEmail: e.target.value })}
                          className={`w-full pl-12 sm:pl-14 pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base rounded-2xl border-2 transition-all duration-300 font-medium ${isDarkMode ? "bg-slate-800/50 border-slate-700/50 text-white focus:border-blue-500/50" : "bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-500"} outline-none`}
                          placeholder="johndoe@gmail.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className={`block text-[10px] sm:text-xs font-bold uppercase mb-1.5 sm:mb-2 pl-1 transition-colors ${isDarkMode ? "text-slate-500 group-focus-within:text-blue-400" : "text-gray-500 group-focus-within:text-blue-600"}`}>Phone Number</label>
                      <div className="relative">
                        <div className={`absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 font-bold text-xs sm:text-sm ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>+91</div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                          className={`w-full pl-12 sm:pl-14 pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base rounded-2xl border-2 transition-all duration-300 font-bold tracking-widest ${isDarkMode ? "bg-slate-800/50 border-slate-700/50 text-white focus:border-blue-500/50" : "bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-500"} outline-none`}
                          placeholder="00000 00000"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div className="group">
                      <label className={`block text-[10px] sm:text-xs font-bold uppercase mb-1.5 sm:mb-2 pl-1 transition-colors ${isDarkMode ? "text-slate-500 group-focus-within:text-blue-400" : "text-gray-500 group-focus-within:text-blue-600"}`}>LinkedIn URL (Optional)</label>
                      <div className="relative">
                        <div className={`absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${isDarkMode ? "bg-slate-800 text-slate-400 group-focus-within:text-blue-400" : "bg-gray-100 text-gray-500 group-focus-within:text-blue-600"}`}>
                          <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <input
                          type="url"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                          className={`w-full pl-12 sm:pl-14 pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base rounded-2xl border-2 transition-all duration-300 font-medium ${isDarkMode ? "bg-slate-800/50 border-slate-700/50 text-white focus:border-blue-500/50" : "bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-500"} outline-none`}
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className={`block text-[10px] sm:text-xs font-bold uppercase mb-1.5 sm:mb-2 pl-1 transition-colors ${isDarkMode ? "text-slate-500 group-focus-within:text-blue-400" : "text-gray-500 group-focus-within:text-blue-600"}`}>Current Location</label>
                      <div className="relative">
                        <div className={`absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${isDarkMode ? "bg-slate-800 text-slate-400 group-focus-within:text-blue-400" : "bg-gray-100 text-gray-500 group-focus-within:text-blue-600"}`}>
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => {
                            setFormData({ ...formData, location: e.target.value });
                            setShowLocationDropdown(true);
                          }}
                          onFocus={() => setShowLocationDropdown(true)}
                          className={`w-full pl-12 sm:pl-14 pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base rounded-2xl border-2 transition-all duration-300 font-medium ${isDarkMode ? "bg-slate-800/50 border-slate-700/50 text-white focus:border-blue-500/50" : "bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-500"} outline-none`}
                          placeholder="City, State"
                          required
                        />
                        {showLocationDropdown && formData.location && filteredCities.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`absolute bottom-full left-0 right-0 mb-3 rounded-2xl shadow-2xl border-2 overflow-hidden z-[70] p-1.5 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}
                          >
                            {filteredCities.map((city) => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, location: city });
                                  setShowLocationDropdown(false);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm font-semibold flex items-center gap-3 rounded-xl transition-all ${isDarkMode ? "text-slate-300 hover:bg-blue-600 hover:text-white" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}`}
                              >
                                {city}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="group">
                      <label className={`block text-[10px] sm:text-xs font-bold uppercase mb-1.5 sm:mb-2 pl-1 transition-colors ${isDarkMode ? "text-slate-500 group-focus-within:text-blue-400" : "text-gray-500 group-focus-within:text-blue-600"}`}>Engineering Branch</label>
                      <div className="relative">
                        <select
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          className={`w-full px-4 text-sm sm:text-base py-3 sm:py-4 rounded-2xl border-2 transition-all appearance-none font-bold ${isDarkMode ? "bg-slate-800/50 border-slate-700/50 text-white focus:border-blue-500/50" : "bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-500"} outline-none`}
                          required
                        >
                          <option value="">Select Branch</option>
                          {branches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                      </div>
                    </div>

                    <div className="group">
                      <label className={`block text-[10px] sm:text-xs font-bold uppercase mb-1.5 sm:mb-2 pl-1 transition-colors ${isDarkMode ? "text-slate-500 group-focus-within:text-blue-400" : "text-gray-500 group-focus-within:text-blue-600"}`}>Graduation Year</label>
                      <div className="relative">
                        <select
                          value={formData.batch}
                          onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                          className={`w-full px-4 text-sm sm:text-base py-3 sm:py-4 rounded-2xl border-2 transition-all appearance-none font-bold tracking-wider ${isDarkMode ? "bg-slate-800/50 border-slate-700/50 text-white focus:border-blue-500/50" : "bg-gray-50 border-gray-100 text-gray-900 focus:border-blue-500"} outline-none`}
                          required
                        >
                          <option value="">Select Year</option>
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border flex gap-4 ${isDarkMode ? "bg-blue-600/5 border-blue-500/20" : "bg-blue-50/50 border-blue-100"}`}
                    >
                      <div className={`p-2 rounded-xl h-fit ${isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold mb-1 ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}>Expert Profile Setup</h4>
                        <p className={`text-[11px] leading-relaxed ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                          We'll automatically configure your MITS educational history using these details to match our community standards.
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${isDarkMode ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-red-50 border-red-100 text-red-600"}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              <div className="flex gap-3 pt-2">
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${isDarkMode ? "bg-slate-800/80 text-white hover:bg-slate-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`flex-[2] py-4 rounded-2xl font-black text-sm tracking-widest uppercase text-white shadow-xl transition-all relative overflow-hidden group ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Finalizing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {step === 1 ? (
                        <>Continue to Education <ChevronRight className="w-4 h-4" /></>
                      ) : (
                        <>Complete Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                      )}
                    </span>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


export default function LoginPage({
  setIsAuthenticated,
}) {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showExtraEmailPopup, setShowExtraEmailPopup] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [showPhotoUploadPopup, setShowPhotoUploadPopup] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);
  const [registrationUserData, setRegistrationUserData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleAuthError = (errorType) => {
    setIsLoading(false);
    switch (errorType) {
      case "unauthorized_domain":
        setError(
          "Only @mitsgwl.ac.in email addresses are allowed. Please use your institute email."
        );
        break;
      case "login_failed":
        setError("Google login failed. Please try again.");
        break;
      case "unauthorized":
        setError("Authentication failed. Please try again.");
        break;
      case "embedded_browser":
        setError(
          "Please open this page in Chrome or Safari browser instead of social media in-app browsers."
        );
        break;
      default:
        setError("An error occurred during login. Please try again.");
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const completeLogin = (userData) => {
    console.log("✅ Final Login:", userData);
    localStorage.setItem("auth", JSON.stringify(userData));
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleRegistrationComplete = (data) => {
    setShowRegistrationPopup(false);
    // After registration, we must do photo upload
    setRegistrationUserData(data);
    setShowPhotoUploadPopup(true);
  };

  const handlePhotoUploadComplete = (photoUrl) => {
    setShowPhotoUploadPopup(false);
    const finalData = {
      ...registrationUserData.user,
      accessToken: registrationUserData.accessToken,
      refreshToken: registrationUserData.refreshToken,
      profilePhoto: photoUrl,
      userType: "student",
      expiry: Date.now() + 1000 * 60 * 60,
    };
    completeLogin(finalData);
  };

  const handleExtraEmailSave = (userData) => {
    completeLogin(userData);
  };

  const checkIfNeedsExtraEmail = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/check-extra-email-status/${userData.userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${userData.accessToken}`
        }
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.needsExtraEmail) {
          // Show popup for extra email (COMPULSORY)
          setTempUserData(userData);
          setShowExtraEmailPopup(true);
        } else {
          // User already has extra email, proceed with login
          completeLogin({
            ...userData,
            extraEmail: data.data.extraEmail,
            hasExtraEmail: true
          });
        }
      } else {
        // If API fails, show error
        console.error("Failed to check extra email status:", data.message);
        setError("Unable to verify your account. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error checking extra email status:", error);
      setError("Network error. Please check your connection and try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const needsRegistration = params.get("needsRegistration");
    const userNameParam = params.get("name");
    const userEmailParam = params.get("email");
    const userIdParam = params.get("id");
    const errorType = params.get("error");

    if (accessToken || refreshToken || errorType || needsRegistration) {
      window.history.replaceState({}, "", "/login");
    }

    if (errorType) {
      handleAuthError(errorType);
      return;
    }

    if (needsRegistration === "true") {
      setIsLoading(false);
      setTempUserData({
        accessToken,
        userId: userIdParam,
        userName: decodeURIComponent(userNameParam || ""),
        userEmail: userEmailParam || ""
      });
      setShowRegistrationPopup(true);
      return;
    }

    if (accessToken && refreshToken) {
      setIsLoading(false);
      const decodedName = decodeURIComponent(userNameParam || "");

      const userData = {
        accessToken,
        refreshToken,
        userName: decodedName,
        userEmail: userEmailParam || "",
        userId: userIdParam || "",
        phone: params.get("phone") || "",
        userType: params.get("userType") || "student",
        expiry: Date.now() + 1000 * 60 * 60,
      };

      // Check if user needs extra email from backend
      checkIfNeedsExtraEmail(userData);
    }
  }, [setIsAuthenticated]);

  const handleGoogleLogin = () => {
    setError("");
    setIsLoading(true);

    const userAgent = navigator.userAgent.toLowerCase();

    const isEmbeddedBrowser =
      userAgent.includes("instagram") ||
      userAgent.includes("facebook") ||
      userAgent.includes("fb_iab") ||
      userAgent.includes("fb4a") ||
      userAgent.includes("fban") ||
      userAgent.includes("fbav") ||
      userAgent.includes("twitter") ||
      userAgent.includes("linkedin") ||
      userAgent.includes("snapchat") ||
      userAgent.includes("tiktok") ||
      userAgent.includes("line") ||
      userAgent.includes("kakao") ||
      userAgent.includes("whatsapp") ||
      (userAgent.includes("wv") && userAgent.includes("android")) ||
      (userAgent.includes("mobile") &&
        userAgent.includes("safari") &&
        !userAgent.includes("chrome"));

    const isMobileDevice =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );

    const isAllowedBrowser =
      userAgent.includes("chrome") ||
      userAgent.includes("safari") ||
      userAgent.includes("firefox") ||
      userAgent.includes("edge") ||
      userAgent.includes("opera") ||
      userAgent.includes("samsung") ||
      isMobileDevice;

    if (isEmbeddedBrowser) {
      setError(
        "Please open this page in your regular browser (Chrome, Safari, etc.) instead of social media apps. " +
        "Copy the URL and paste it in your browser to continue."
      );
      setIsLoading(false);
      return;
    }

    if (!isAllowedBrowser) {
      setError(
        "For the best experience, please use Chrome, Safari, Firefox, or Edge browser."
      );
      setIsLoading(false);
      return;
    }

    if (isMobileDevice) {
      const oauthWindow = window.open(
        `${API_URL}/google`,
        "googleOAuth",
        "width=500,height=600,scrollbars=yes"
      );

      if (!oauthWindow) {
        console.log("Popup blocked, redirecting current window...");
        window.location.href = `${API_URL}/google`;
      } else {
        const checkWindowClosed = setInterval(() => {
          if (oauthWindow.closed) {
            clearInterval(checkWindowClosed);
            setIsLoading(false);
            const params = new URLSearchParams(window.location.search);
            if (params.get("accessToken")) {
              processAuthFromURL();
            }
          }
        }, 500);

        setTimeout(() => {
          setIsLoading(false);
          clearInterval(checkWindowClosed);
        }, 30000);
      }
    } else {
      console.log("Redirecting to Google OAuth...");
      window.location.href = `${API_URL}/google`;
    }
  };

  const processAuthFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userNameParam = params.get("name");
    const userEmailParam = params.get("email");
    const userIdParam = params.get("id");
    const errorType = params.get("error");

    if (errorType) {
      setIsLoading(false);
      handleAuthError(errorType);
      return;
    }

    if (accessToken && refreshToken) {
      setIsLoading(false);
      const decodedName = decodeURIComponent(userNameParam || "");

      const userData = {
        accessToken,
        refreshToken,
        userName: decodedName,
        userEmail: userEmailParam || "",
        userId: userIdParam || "",
        phone: params.get("phone") || "",
      };

      // Check if user needs extra email from backend
      checkIfNeedsExtraEmail({
        ...userData,
        userType: "student",
        expiry: Date.now() + 1000 * 60 * 60,
      });
    }
  };

  // User cannot skip - they must enter email
  const handleClosePopup = () => {
    // Don't allow closing without entering email
    // Just show a message that it's required
    setError("Personal email is required to access the portal.");
    // Keep the popup open
  };

  return (
    <>
      <ExtraEmailPopup
        isOpen={showExtraEmailPopup}
        onClose={handleClosePopup}
        userData={tempUserData}
        onSave={handleExtraEmailSave}
      />

      <StudentRegistrationPopup
        isOpen={showRegistrationPopup}
        userData={tempUserData}
        onComplete={handleRegistrationComplete}
      />

      <ProfilePhotoUpload
        isOpen={showPhotoUploadPopup}
        token={registrationUserData?.accessToken}
        onComplete={handlePhotoUploadComplete}
        onSkip={() => { }} // Should not be accessible since canSkip={false}
        canSkip={false}
      />

      <div
        className={`min-h-screen transition-colors duration-500 ${isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
          }`}
      >
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob"></div>
          <div
            className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-blob"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`fixed top-6 right-6 z-50 p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 ${isDarkMode
            ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
            : "bg-white hover:bg-gray-50 text-blue-600 border border-blue-200"
            }`}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-6xl">
            {/* Mobile Header - Only on small screens */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center gap-3 justify-center mb-4">
                <div
                  className={`w-12 h-12 rounded-xl p-2 ${isDarkMode
                    ? "bg-white/10 backdrop-blur-sm"
                    : "bg-white shadow-xl"
                    }`}
                >
                  <img
                    src="/assets/images/mits-logo.png"
                    alt="MITS Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1
                    className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    MITS ALUMNI
                  </h1>
                  <p
                    className={`text-xs ${isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                  >
                    Student Portal
                  </p>
                </div>
              </div>

              <h2
                className={`text-3xl font-bold leading-tight mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                Welcome Back,
                <br />
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Future Alumni
                </span>
              </h2>
              <p
                className={`text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                Connect with your campus community
              </p>
            </div>

            {/* Desktop & Mobile Grid */}
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Desktop Only */}
              <div className="hidden lg:block space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl p-3 ${isDarkMode
                        ? "bg-white/10 backdrop-blur-sm"
                        : "bg-white shadow-xl"
                        }`}
                    >
                      <img
                        src="/assets/images/mits-logo.png"
                        alt="MITS Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h1
                        className={`text-3xl font-black ${isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                      >
                        MITS ALUMNI
                      </h1>
                      <p
                        className={`text-sm ${isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                      >
                        Student Portal
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2
                      className={`text-5xl font-bold leading-tight ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      Welcome Back,
                      <br />
                      <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Future Alumni
                      </span>
                    </h2>
                    <p
                      className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                      Connect with your campus community and explore endless
                      opportunities
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: UserCheck, // represents verified alumni
                      title: "Verified Alumni",
                      desc: "Connect only with genuine MITS graduates",
                    },
                    {
                      icon: Users, // represents networking and connections
                      title: "Career Networking",
                      desc: "Build professional connections and mentorship",
                    },
                    {
                      icon: Award, // represents exclusive benefits/resources
                      title: "Alumni Exclusive",
                      desc: "Access resources and events only for MITS alumni",
                    },
                    {
                      icon: Mail, // represents personal email requirement
                      title: "Personal Email Required",
                      desc: "Required for future alumni access after graduation",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-lg backdrop-blur-sm transition-all hover:translate-x-2 ${isDarkMode
                        ? "bg-white/5 border border-white/10"
                        : "bg-white/60 border border-blue-200"
                        }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                          }`}
                      >
                        <item.icon
                          className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                        />
                      </div>
                      <div>
                        <h3
                          className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="w-full max-w-md mx-auto lg:mx-0">
                <div
                  className={`rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl border ${isDarkMode
                    ? "bg-slate-900/80 border-slate-700/50"
                    : "bg-white/90 border-blue-200"
                    }`}
                >
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isDarkMode
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "bg-blue-50 border border-blue-200"
                        }`}
                    >
                      <GraduationCap
                        className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                      />
                      <span
                        className={`text-xs font-medium ${isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                      >
                        Student Login
                      </span>
                    </div>
                    <h2
                      className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      Sign In
                    </h2>
                    <p
                      className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Use your institute email to continue
                    </p>
                  </div>

                  {error && (
                    <div
                      className={`mb-6 p-4 rounded-xl border-l-4 border-red-500 ${isDarkMode ? "bg-red-900/20" : "bg-red-50"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3
                            className={`font-semibold text-sm mb-1 ${isDarkMode ? "text-red-400" : "text-red-800"
                              }`}
                          >
                            Authentication Error
                          </h3>
                          <p
                            className={`text-xs ${isDarkMode ? "text-red-300" : "text-red-700"
                              }`}
                          >
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className={`w-full rounded-xl px-6 py-4 flex items-center justify-center gap-3 transition-all duration-300 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed group ${isDarkMode
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : "bg-white text-gray-900 hover:bg-gray-50"
                      } shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:shadow-[0_0_30px_rgba(0,0,0,0.25)] hover:scale-[1.02]`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                        <span>Continue with Google</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <div
                    className={`mt-6 p-4 rounded-xl border hidden md:block ${isDarkMode
                      ? "bg-blue-500/10 border-blue-500/20"
                      : "bg-blue-50 border-blue-200"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${isDarkMode ? "bg-blue-500/20" : "bg-blue-100"
                          }`}
                      >
                        <AlertTriangle
                          className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                        />
                      </div>
                      <div>
                        <h3
                          className={`font-semibold text-sm mb-1 ${isDarkMode ? "text-blue-300" : "text-blue-900"
                            }`}
                        >
                          Institute Email Required
                        </h3>
                        <p
                          className={`text-xs ${isDarkMode ? "text-blue-200" : "text-blue-700"
                            }`}
                        >
                          Only @mitsgwl.ac.in email addresses are allowed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p
                      className={`text-xs sm:text-sm mb-2 sm:mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    >
                      Already graduated?
                    </p>
                    <button
                      onClick={() => navigate("/login-alumni")}
                      className={`w-full px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all hover:scale-105 ${isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        } shadow-lg hover:shadow-xl flex items-center gap-2 justify-center mx-auto`}
                    >
                      Login as Alumni
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                <div
                  className={`mt-4 sm:mt-6 rounded-xl p-4 sm:p-6 backdrop-blur-xl border flex justify-center items-center ${isDarkMode
                    ? "bg-slate-900/50 border-slate-700/50"
                    : "bg-white/80 border-blue-200"
                    }`}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50"></div>
                      <img
                        src="/assets/images/harsh.png"
                        alt="Harsh Manmode"
                        className="w-16 h-18 sm:w-20 sm:h-23 rounded-full border-2 border-blue-500 relative z-10"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <p
                        className={`text-[10px] sm:text-xs font-bold tracking-widest mb-1 sm:mb-2 ${isDarkMode ? "text-gray-500" : "text-blue-600/60"
                          }`}
                      >
                        DEVELOPED BY
                      </p>
                      <h3
                        className={`text-base sm:text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                      >
                        Harsh Manmode
                      </h3>
                      <p
                        className={`text-[10px] sm:text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                      >
                        Information Technology, II Year
                      </p>
                      <div className="flex gap-2 mt-2 justify-center">
                        {[
                          {
                            icon: Github,
                            href: "https://github.com/Harsh-2006-git",
                          },
                          {
                            icon: Linkedin,
                            href: "https://www.linkedin.com/in/harsh-manmode-2a0b91325/",
                          },
                        ].map((social, idx) => (
                          <a
                            key={idx}
                            href={social.href}
                            className={`p-1.5 rounded-lg transition-all hover:scale-110 ${isDarkMode
                              ? "bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white"
                              : "bg-blue-100 hover:bg-blue-200 text-blue-600"
                              }`}
                          >
                            <social.icon className="w-3.5 h-3.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
        `}</style>
      </div>
    </>
  );
}