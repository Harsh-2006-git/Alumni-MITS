import { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Building2,
  ExternalLink,
  BookmarkPlus,
  Share2,
  ArrowLeft,
  CheckCircle,
  Mail,
  Globe,
  TrendingUp,
  Award,
  Target,
  AlertCircle,
  X,
  Filter,
  Search,
  Bookmark,
  Menu,
  Sun,
  Moon,
  RefreshCw,
  Plus,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  Star,
  User,
  GraduationCap,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import SkillAnalysisPopup from "../components/SkillAnalysisPopup";

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";
  const Icon =
    type === "success"
      ? CheckCircle2
      : type === "error"
      ? XCircle
      : AlertCircle;

  return (
    <div
      className={`fixed top-20 right-4 z-[100] ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slideIn`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Post Job Dialog Component
const PostJobDialog = ({ isOpen, onClose, isDarkMode, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    companyLogo: "",
    type: "full-time",
    location: "",
    salary: "",
    experience: "",
    applicationDeadline: "",
    closedDate: "",
    verified: true,
    description: "",
    requiredSkills: "",
    qualifications: "",
    companyWebsite: "",
    category: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      requiredSkills: formData.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      qualifications: formData.qualifications
        .split(",")
        .map((q) => q.trim())
        .filter((q) => q),
    };

    await onSubmit(payload);
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      companyLogo: "",
      type: "full-time",
      location: "",
      salary: "",
      experience: "",
      applicationDeadline: "",
      closedDate: "",
      verified: true,
      description: "",
      requiredSkills: "",
      qualifications: "",
      companyWebsite: "",
      category: "",
      status: "active",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full sm:max-w-4xl sm:my-8 mt-0 mb-0 min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-xl border-0 sm:border ${
          isDarkMode
            ? "bg-slate-900 sm:border-slate-700"
            : "bg-white sm:border-gray-200"
        }`}
      >
        <div
          className={`sticky top-0 z-10 p-4 sm:p-6 border-b backdrop-blur-lg ${
            isDarkMode
              ? "bg-slate-900/95 border-slate-700"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
              isDarkMode
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
          <h2
            className={`text-xl sm:text-2xl font-bold pr-12 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Post a New Job
          </h2>
          <p
            className={`text-sm mt-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Fill in the details to create a job posting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Software Engineer"
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="e.g., Google"
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Company Logo URL *
              </label>
              <input
                type="url"
                name="companyLogo"
                value={formData.companyLogo}
                onChange={handleChange}
                required
                placeholder="https://example.com/logo.png"
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Job Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Bangalore, India"
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Salary Range *
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                placeholder="e.g., ₹20.0L - ₹22.0L"
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Experience Required *
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="e.g., 4-6 years"
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., AI Analysis"
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Application Deadline *
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Closed Date *
              </label>
              <input
                type="date"
                name="closedDate"
                value={formData.closedDate}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Company Website *
              </label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                required
                placeholder="https://www.company.com"
                className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="verified"
                id="verified"
                checked={formData.verified}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="verified"
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Verified Job Posting
              </label>
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the job role, responsibilities, and what makes this opportunity great..."
              className={`w-full px-4 py-2.5 rounded-lg border transition-all resize-none ${
                isDarkMode
                  ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Required Skills * (comma-separated)
            </label>
            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              required
              placeholder="e.g., Python, Machine Learning, TensorFlow"
              className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                isDarkMode
                  ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Qualifications * (comma-separated)
            </label>
            <input
              type="text"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              required
              placeholder="e.g., Bachelor's in Computer Science, 4+ years experience"
              className={`w-full px-4 py-2.5 rounded-lg border transition-all ${
                isDarkMode
                  ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
              } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background:
                  "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Post Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced Hero Section - Centered Aligned
const HeroSection = ({
  isDarkMode,
  onPostJob,
  onRefreshJobs,
  loading,
  jobCount,
}) => {
  return (
    <div
      className={`relative overflow-hidden border-b ${
        isDarkMode ? "border-slate-700" : "border-gray-200"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-12 relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Text Content */}
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 
              bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
            >
              <Star className="w-4 h-4" />
              <span>{jobCount}+ Jobs Available</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Dream Job
              </span>
            </h1>

            <p
              className={`text-base sm:text-lg mb-6 leading-relaxed max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Discover opportunities from top companies and take your career to
              the next level.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onPostJob}
                className="group px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl 
                  transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3
                  bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Post a Job
              </button>

              <button
                onClick={onRefreshJobs}
                disabled={loading}
                className={`group px-6 py-3 rounded-lg font-semibold transition-all duration-300 
                  transform hover:scale-105 flex items-center justify-center gap-3 border-2
                  ${
                    isDarkMode
                      ? "border-slate-600 hover:border-slate-500 text-white hover:bg-slate-800"
                      : "border-gray-300 hover:border-gray-400 text-gray-900 hover:bg-gray-50"
                  }`}
              >
                <RefreshCw
                  className={`w-5 h-5 ${
                    loading
                      ? "animate-spin"
                      : "group-hover:rotate-180 transition-transform"
                  }`}
                />
                {loading ? "Refreshing..." : "Refresh Jobs"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Main Component
export default function JobListingPage({ isDarkMode, toggleTheme }) {
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSkillAnalysis, setShowSkillAnalysis] = useState(false);
  const [showPostJobDialog, setShowPostJobDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    experience: "all",
  });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  const toggleBookmark = (jobId) => {
    const newBookmarks = new Set(bookmarkedJobs);
    if (newBookmarks.has(jobId)) {
      newBookmarks.delete(jobId);
      showToast("Job removed from bookmarks", "info");
    } else {
      newBookmarks.add(jobId);
      showToast("Job bookmarked successfully", "success");
    }
    setBookmarkedJobs(newBookmarks);
  };

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://alumni-mits-l45r.onrender.com/job/all-jobs"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setJobs(data.data || []);
        showToast(
          `Loaded ${data.data?.length || 0} jobs successfully`,
          "success"
        );
      } else {
        showToast(data.message || "Failed to load jobs", "error");
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      showToast("Error loading jobs. Please try again.", "error");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Post new job
  const postJob = async (jobData) => {
    try {
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : null;

      if (!token) {
        showToast("Please login to post a job", "error");
        return;
      }

      const response = await fetch(
        "https://alumni-mits-l45r.onrender.com/job/create-job",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobData),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast("Job posted successfully!", "success");
        setShowPostJobDialog(false);
        fetchJobs(); // Refresh job list
      } else {
        showToast(data.message || "Failed to post job", "error");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      showToast("Error posting job. Please try again.", "error");
    }
  };

  // Apply for job
  const applyForJob = async (jobId) => {
    try {
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : null;

      if (!token) {
        showToast("Please login to apply for jobs", "error");
        return;
      }

      const response = await fetch(
        "https://alumni-mits-l45r.onrender.com/job/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast("Application submitted successfully!", "success");
      } else {
        showToast(data.message || "Failed to submit application", "error");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      showToast("Error submitting application. Please try again.", "error");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills?.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filters.type === "all" || job.type === filters.type;
    const matchesCategory =
      filters.category === "all" || job.category === filters.category;
    const matchesExperience =
      filters.experience === "all" ||
      (filters.experience === "internship" &&
        job.experience?.includes("0-1")) ||
      (filters.experience === "entry" && job.experience?.includes("1-3")) ||
      (filters.experience === "mid" && job.experience?.includes("3-5")) ||
      (filters.experience === "senior" && job.experience?.includes("5+"));

    return matchesSearch && matchesType && matchesCategory && matchesExperience;
  });

  const openJobModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const openSkillAnalysis = (job) => {
    setSelectedJob(job);
    setShowSkillAnalysis(true);
    document.body.style.overflow = "hidden";
  };

  const closeJobModal = () => {
    setShowModal(false);
    setSelectedJob(null);
    document.body.style.overflow = "unset";
  };

  const closeSkillAnalysis = () => {
    setShowSkillAnalysis(false);
    setSelectedJob(null);
    document.body.style.overflow = "unset";
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      category: "all",
      experience: "all",
    });
    setSearchTerm("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Just now";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const JobModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
        style={{
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          paddingTop: "60px",
        }}
      >
        <div
          className={`relative w-full sm:max-w-6xl sm:my-8 mt-0 mb-0 min-h-[calc(100vh-60px)] sm:min-h-0 sm:max-h-[90vh] overflow-y-auto sm:rounded-xl rounded-t-2xl rounded-b-none sm:rounded-b-xl border-0 sm:border transition-all ${
            isDarkMode
              ? "bg-slate-900 sm:border-slate-700"
              : "bg-white sm:border-gray-200 sm:shadow-2xl"
          }`}
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <div className="relative">
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-20 p-2 rounded-lg transition-all ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 p-4 sm:p-6 lg:border-r lg:border-slate-700">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shrink-0">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full flex items-center justify-center text-base sm:text-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 100%)",
                        display: job.companyLogo ? "none" : "flex",
                      }}
                    >
                      {job.company?.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h1
                        className={`text-xl sm:text-2xl font-bold break-words ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {job.title}
                      </h1>
                      {job.verified && (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
                      <p
                        className={`text-sm sm:text-base break-words ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {job.company}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          job.type === "full-time"
                            ? "bg-green-500 text-white"
                            : job.type === "part-time"
                            ? "bg-blue-500 text-white"
                            : job.type === "internship"
                            ? "bg-purple-500 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {job.type}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode
                            ? "bg-blue-900/40 text-blue-300"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {job.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                    <span
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Location
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-medium break-words ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {job.location}
                  </p>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-3 h-3 text-green-500 shrink-0" />
                    <span
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Salary
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-medium break-words ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {job.salary}
                  </p>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3 h-3 text-blue-500 shrink-0" />
                    <span
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Experience
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {job.experience}
                  </p>
                </div>

                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3 h-3 text-orange-500 shrink-0" />
                    <span
                      className={`text-xs font-medium ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Posted
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {formatDate(job.postedDate)}
                  </p>
                </div>
              </div>

              <div
                className={`p-3 sm:p-4 rounded-lg border mb-6 ${
                  isDarkMode
                    ? "bg-blue-900/20 border-blue-700/30"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold mb-1 text-xs sm:text-sm ${
                        isDarkMode ? "text-blue-300" : "text-blue-700"
                      }`}
                    >
                      Application Deadline
                    </h3>
                    <p
                      className={`text-xs sm:text-sm break-words ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2
                  className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-purple-500 shrink-0" />
                  Job Description
                </h2>
                <p
                  className={`leading-relaxed text-xs sm:text-sm break-words ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {job.description}
                </p>
              </div>

              <div className="mb-6">
                <h2
                  className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Target className="w-4 h-4 text-blue-500 shrink-0" />
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium break-words ${
                        isDarkMode
                          ? "bg-blue-900/30 text-blue-300 border border-blue-700/30"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2
                  className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  <Award className="w-4 h-4 text-green-500 shrink-0" />
                  Qualifications
                </h2>
                <ul className="space-y-2">
                  {job.qualifications?.map((qual, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 text-xs sm:text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="break-words flex-1">{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  How to Apply
                </h3>
                <button
                  onClick={() => applyForJob(job.id)}
                  className="w-full px-4 py-3 rounded-lg font-semibold transition-all text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-2 text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)",
                  }}
                >
                  <Mail className="w-4 h-4" />
                  Apply Now
                </button>
                <button
                  onClick={() => {
                    onClose();
                    openSkillAnalysis(job);
                  }}
                  className="w-full px-4 py-3 rounded-lg font-semibold transition-all text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(236, 72, 153) 100%)",
                  }}
                >
                  <Target className="w-4 h-4" />
                  Check Skill Match
                </button>
                <p
                  className={`text-xs text-center mt-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Analyze your skills against job requirements
                </p>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Job Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium mb-0.5 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Posted
                      </p>
                      <p
                        className={`text-sm font-medium break-words ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {formatDate(job.postedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium mb-0.5 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Experience Level
                      </p>
                      <p
                        className={`text-sm font-medium break-words ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {job.experience}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-green-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium mb-0.5 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Position
                      </p>
                      <p
                        className={`text-sm font-medium break-words ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {job.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium mb-0.5 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Verified Posting
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {job.verified ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  About {job.company}
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shrink-0">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full flex items-center justify-center text-base"
                      style={{
                        background:
                          "linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 100%)",
                        display: job.companyLogo ? "none" : "flex",
                      }}
                    >
                      {job.company?.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium text-sm break-words ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {job.company}
                    </p>
                  </div>
                </div>
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm font-medium transition-all break-words ${
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="break-all">Visit Website</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Enhanced Hero Section */}
      <HeroSection
        isDarkMode={isDarkMode}
        onPostJob={() => setShowPostJobDialog(true)}
        onRefreshJobs={fetchJobs}
        loading={loading}
        jobCount={jobs.length}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-6 sm:py-12">
        <div
          className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 ${
            isDarkMode
              ? "bg-slate-900 border border-slate-700"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <div className="space-y-3">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search jobs, companies, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border transition-all text-sm ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                }`}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-medium ${
                isDarkMode
                  ? "bg-slate-800 border-slate-600 text-white hover:bg-slate-700 active:bg-slate-600"
                  : "bg-white border-gray-300 text-gray-900 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-2 ${
                showFilters ? "block" : "hidden sm:grid"
              }`}
            >
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className={`px-3 py-2.5 sm:py-3 rounded-lg border transition-all text-sm focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white focus:ring-2 focus:ring-blue-500/20"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500/20"
                }`}
              >
                <option value="all">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className={`px-3 py-2.5 sm:py-3 rounded-lg border transition-all text-sm focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white focus:ring-2 focus:ring-blue-500/20"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500/20"
                }`}
              >
                <option value="all">All Categories</option>
                <option value="AI Analysis">AI Analysis</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Design">Design</option>
              </select>

              <select
                value={filters.experience}
                onChange={(e) =>
                  setFilters({ ...filters, experience: e.target.value })
                }
                className={`px-3 py-2.5 sm:py-3 rounded-lg border transition-all text-sm focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white focus:ring-2 focus:ring-blue-500/20"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500/20"
                }`}
              >
                <option value="all">All Experience</option>
                <option value="internship">Internship</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            {(searchTerm ||
              filters.type !== "all" ||
              filters.category !== "all" ||
              filters.experience !== "all") && (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p
                  className={`text-xs sm:text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {filteredJobs.length} job
                  {filteredJobs.length !== 1 ? "s" : ""} found
                </p>
                <button
                  onClick={clearFilters}
                  className={`text-xs sm:text-sm font-medium transition-all ${
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2
                className="w-12 h-12 animate-spin mx-auto mb-4"
                style={{
                  color: "rgb(59, 130, 246)",
                }}
              />
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Loading jobs...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-700 hover:border-slate-600"
                    : "bg-white border-gray-200 shadow-sm hover:shadow-md"
                }`}
                style={{
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                }}
              >
                {/* Mobile Layout */}
                <div className="sm:hidden space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shrink-0">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center text-base"
                        style={{
                          background:
                            "linear-gradient(135deg, rgb(100, 116, 139) 0%, rgb(59, 130, 246) 100%)",
                          display: job.companyLogo ? "none" : "flex",
                        }}
                      >
                        {job.company?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className={`text-base font-semibold break-words ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {job.title}
                        </h3>
                        {job.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3 text-blue-400 shrink-0" />
                        <span
                          className={`text-sm break-words ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {job.company}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                      <span
                        className={`truncate ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-green-500 shrink-0" />
                      <span
                        className={`truncate ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {job.salary}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-blue-500 shrink-0" />
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        {job.experience}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-500 shrink-0" />
                      <span
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        {formatDate(job.postedDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                          job.type === "full-time"
                            ? "bg-green-500 text-white"
                            : job.type === "part-time"
                            ? "bg-blue-500 text-white"
                            : job.type === "internship"
                            ? "bg-purple-500 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {job.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium max-w-[150px] truncate ${
                          isDarkMode
                            ? "bg-blue-900/40 text-blue-300"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {job.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(job.id)}
                        className={`p-2 rounded-lg transition-all active:scale-95 ${
                          bookmarkedJobs.has(job.id)
                            ? "text-white"
                            : isDarkMode
                            ? "bg-slate-800 hover:bg-slate-700 text-gray-400 active:bg-slate-600"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-600 active:bg-gray-300"
                        }`}
                        style={
                          bookmarkedJobs.has(job.id)
                            ? {
                                background:
                                  "linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 100%)",
                              }
                            : {}
                        }
                        aria-label="Bookmark job"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => openJobModal(job)}
                    className="w-full px-4 py-2.5 rounded-lg font-semibold transition-all text-white shadow-sm text-sm active:scale-95"
                    style={{
                      background:
                        "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)",
                    }}
                  >
                    View Details
                  </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shrink-0">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center text-base"
                        style={{
                          background:
                            "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)",
                          display: job.companyLogo ? "none" : "flex",
                        }}
                      >
                        {job.company?.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className={`text-lg font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {job.title}
                        </h3>
                        {job.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-blue-400 shrink-0" />
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {job.company}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-purple-500 shrink-0" />
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {job.location}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-green-500 shrink-0" />
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {job.salary}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-blue-500 shrink-0" />
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {job.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                            job.type === "full-time"
                              ? "bg-green-500 text-white"
                              : job.type === "part-time"
                              ? "bg-blue-500 text-white"
                              : job.type === "internship"
                              ? "bg-purple-500 text-white"
                              : "bg-orange-500 text-white"
                          }`}
                        >
                          {job.type}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isDarkMode
                              ? "bg-blue-900/40 text-blue-300"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {job.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span
                          className={
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }
                        >
                          {formatDate(job.postedDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(job.id)}
                        className={`p-2 rounded-lg transition-all ${
                          bookmarkedJobs.has(job.id)
                            ? "text-white"
                            : isDarkMode
                            ? "bg-slate-800 hover:bg-slate-700 text-gray-400"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                        }`}
                        style={
                          bookmarkedJobs.has(job.id)
                            ? {
                                background:
                                  "linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(219, 39, 119) 100%)",
                              }
                            : {}
                        }
                        aria-label="Bookmark job"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openJobModal(job)}
                        className="px-4 py-2 rounded-lg font-semibold transition-all text-white shadow-sm text-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <div
            className={`text-center py-12 rounded-xl ${
              isDarkMode
                ? "bg-slate-900 border border-slate-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)",
              }}
            >
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No jobs found
            </h3>
            <p
              className={`text-sm mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-lg font-semibold transition-all text-white shadow-sm text-sm"
              style={{
                background:
                  "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(6, 182, 212) 100%)",
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {showModal && <JobModal job={selectedJob} onClose={closeJobModal} />}

      {showSkillAnalysis && (
        <SkillAnalysisPopup
          job={selectedJob}
          isOpen={showSkillAnalysis}
          onClose={closeSkillAnalysis}
          isDarkMode={isDarkMode}
        />
      )}

      {showPostJobDialog && (
        <PostJobDialog
          isOpen={showPostJobDialog}
          onClose={() => setShowPostJobDialog(false)}
          isDarkMode={isDarkMode}
          onSubmit={postJob}
        />
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
