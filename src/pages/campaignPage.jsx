import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Plus,
  X,
  Upload,
  Calendar,
  DollarSign,
  Target,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Github,
  ExternalLink,
  Phone,
  Mail,
  Share2,
  Filter,
  User,
  BookOpen,
  Search,
  ChevronRight,
  Heart,
  MessageSquare,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function CampaignPage({ isDarkMode, toggleTheme }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [likedCampaigns, setLikedCampaigns] = useState(new Set());

  const [formData, setFormData] = useState({
    campaignTitle: "",
    categories: "",
    tagline: "",
    detailedDescription: "",
    startDate: "",
    endDate: "",
    totalAmount: "",
    projectLink: "",
    github: "",
    contact: "",
  });

  useEffect(() => {
    fetchCampaigns();
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        if (parsedAuth.accessToken) {
          setIsAuthenticated(true);
          setUserInfo(parsedAuth);
        }
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:3001/campaign/get-approve-campaign"
      );
      const data = await response.json();
      if (response.ok) {
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      showMessage("Failed to load campaigns", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      showMessage("Maximum 3 images allowed", "error");
      return;
    }

    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/jpg", "image/png"].includes(
        file.type
      );
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidType) showMessage(`Invalid file type: ${file.name}`, "error");
      if (!isValidSize) showMessage(`File too large: ${file.name}`, "error");
      return isValidType && isValidSize;
    });

    setSelectedFiles(validFiles);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let token = null;
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        token = parsedAuth.accessToken;
      }
    } catch (error) {
      console.error("Error loading token:", error);
    }

    if (!token) {
      showMessage("Please login to create a campaign", "error");
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    if (startDate < now) {
      showMessage("Start date cannot be in the past", "error");
      return;
    }

    if (endDate <= startDate) {
      showMessage("End date must be after start date", "error");
      return;
    }

    setCreateLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      selectedFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const response = await fetch(
        "http://localhost:3001/campaign/create-campaign",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        showMessage("Campaign created successfully!", "success");
        setShowCreateModal(false);
        resetForm();
        fetchCampaigns();
      } else {
        showMessage(data.message || "Error creating campaign", "error");
      }
    } catch (error) {
      showMessage("Network error: " + error.message, "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      campaignTitle: "",
      categories: "",
      tagline: "",
      detailedDescription: "",
      startDate: "",
      endDate: "",
      totalAmount: "",
      projectLink: "",
      github: "",
      contact: "",
    });
    setSelectedFiles([]);
  };

  const calculateProgress = (campaign) => {
    const total = parseFloat(campaign.totalAmount);
    const current = parseFloat(campaign.currentAmount);
    if (total === 0) return 0;
    return Math.min(Math.round((current / total) * 100), 100);
  };

  const getDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    });
  };

  const openCampaignDetail = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
    setActiveImageIndex(0);
  };

  const closeCampaignDetail = () => {
    setShowDetailModal(false);
    setSelectedCampaign(null);
  };

  const toggleLike = (campaignId) => {
    const newLiked = new Set(likedCampaigns);
    if (newLiked.has(campaignId)) {
      newLiked.delete(campaignId);
    } else {
      newLiked.add(campaignId);
    }
    setLikedCampaigns(newLiked);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.campaignTitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || campaign.categories === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent leading-tight">
          Empower Dreams, Fund Innovation
        </h2>
        <p
          className={`text-base sm:text-lg md:text-xl mb-6 sm:mb-8 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Support groundbreaking projects from MITS students, alumni, and
          faculty
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12">
          {isAuthenticated ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" /> Create Campaign
            </button>
          ) : (
            <button
              onClick={() =>
                showMessage("Please login to create a campaign", "error")
              }
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" /> Login to Create
            </button>
          )}
          <button
            className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 ${
              isDarkMode
                ? "bg-slate-800 text-cyan-300 border border-cyan-500/30"
                : "bg-white text-blue-600 border border-blue-300 shadow-lg"
            }`}
          >
            Browse All
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: Target,
              number: campaigns.length,
              label: "Active Campaigns",
            },
            { icon: Users, number: "500+", label: "Supporters" },
            { icon: DollarSign, number: "₹2.5M+", label: "Raised" },
            { icon: TrendingUp, number: "95%", label: "Success Rate" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-4 sm:p-6 rounded-2xl border-2 shadow-lg transition-all hover:scale-105 ${
                isDarkMode
                  ? "bg-slate-900/50 border-cyan-500/20"
                  : "bg-white border-blue-200"
              }`}
            >
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-cyan-400" />
              <div className="text-xl sm:text-2xl font-bold text-cyan-400">
                {stat.number}
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-full">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base ${
                isDarkMode
                  ? "bg-slate-900/50 border-cyan-500/20 text-white placeholder-gray-400"
                  : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
          <div className="w-full sm:w-auto flex-shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`w-full sm:w-64 px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base appearance-none cursor-pointer ${
                isDarkMode
                  ? "bg-slate-900/50 border-cyan-500/20 text-white"
                  : "bg-white border-blue-200 text-gray-900"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23${
                  isDarkMode ? "ffffff" : "000000"
                }' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                paddingRight: "2.5rem",
              }}
            >
              <option value="all">All Categories</option>
              <option value="startup">Startup</option>
              <option value="research">Research</option>
              <option value="innovation">Innovation</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="scholarship">Scholarship</option>
              <option value="community">Community</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading campaigns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredCampaigns.map((campaign) => {
              const progress = calculateProgress(campaign);
              const daysLeft = getDaysLeft(campaign.endDate);
              const isLiked = likedCampaigns.has(campaign.id);

              return (
                <div
                  key={campaign.id}
                  className={`rounded-3xl overflow-hidden border-2 shadow-xl transition-all hover:shadow-2xl hover:scale-105 cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-900/50 border-cyan-500/20 hover:border-cyan-500/40"
                      : "bg-white border-blue-200 hover:border-blue-400"
                  }`}
                >
                  {/* Campaign Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden group">
                    {campaign.images && campaign.images.length > 0 ? (
                      <img
                        src={campaign.images[0]}
                        alt={campaign.campaignTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Target className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md transition-all ${
                          isDarkMode
                            ? "bg-slate-900/80 text-cyan-400"
                            : "bg-white/90 text-blue-600"
                        }`}
                      >
                        {campaign.categories}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(campaign.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-all hover:scale-110 ${
                          isLiked
                            ? "bg-red-500 text-white"
                            : "bg-slate-900/50 text-gray-300 hover:text-red-400"
                        }`}
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={isLiked ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Campaign Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-cyan-400 line-clamp-2 hover:line-clamp-none transition-all">
                      {campaign.campaignTitle}
                    </h3>
                    {campaign.tagline && (
                      <p
                        className={`text-xs sm:text-sm mb-4 line-clamp-2 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {campaign.tagline}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-cyan-400">
                          {progress}% Funded
                        </span>
                        <span
                          className={`text-xs sm:text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {formatAmount(campaign.currentAmount)} /{" "}
                          {formatAmount(campaign.totalAmount)}
                        </span>
                      </div>
                      <div
                        className={`h-2 rounded-full overflow-hidden ${
                          isDarkMode ? "bg-slate-800" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Campaign Stats */}
                    <div className="flex items-center justify-between mb-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>{daysLeft} days left</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Approved</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCampaignDetail(campaign);
                        }}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-3 sm:py-3 rounded-xl font-semibold hover:scale-105 transition-all active:scale-95 text-sm sm:text-base"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className={`p-2 sm:p-3 rounded-xl transition-all hover:scale-110 active:scale-95 ${
                          isDarkMode
                            ? "bg-slate-800 text-cyan-400"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredCampaigns.length === 0 && (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg text-gray-400">No campaigns found</p>
          </div>
        )}
      </section>

      {/* Campaign Detail Modal */}
      {showDetailModal && selectedCampaign && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={closeCampaignDetail}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-6xl rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto ${
              isDarkMode
                ? "bg-slate-900 border-2 border-cyan-500/20"
                : "bg-white border-2 border-blue-200"
            }`}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 sm:p-6 flex justify-between items-center">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="bg-white/20 p-2 rounded-full flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
                    Campaign Details
                  </h2>
                  <p className="text-xs sm:text-sm opacity-90 truncate">
                    {selectedCampaign.categories}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCampaignDetail}
                className="p-2 hover:bg-white/20 rounded-full transition-all flex-shrink-0"
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {selectedCampaign.campaignTitle}
                    </h3>
                    {selectedCampaign.tagline && (
                      <p
                        className={`text-base sm:text-lg md:text-xl ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedCampaign.tagline}
                      </p>
                    )}
                  </div>

                  {/* Image Gallery */}
                  {selectedCampaign.images &&
                    selectedCampaign.images.length > 0 && (
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-lg sm:text-xl font-bold text-cyan-400 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Campaign Images
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                          {/* Main Image */}
                          <div className="rounded-2xl overflow-hidden border-2 border-cyan-500/20">
                            <img
                              src={selectedCampaign.images[activeImageIndex]}
                              alt={`Campaign ${activeImageIndex + 1}`}
                              className="w-full h-64 sm:h-80 object-cover"
                            />
                          </div>

                          {/* Thumbnail Gallery */}
                          {selectedCampaign.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {selectedCampaign.images.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveImageIndex(idx)}
                                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                    activeImageIndex === idx
                                      ? "border-cyan-500"
                                      : "border-cyan-500/20"
                                  }`}
                                >
                                  <img
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Description */}
                  {selectedCampaign.detailedDescription && (
                    <div
                      className={`p-4 sm:p-6 rounded-2xl border-2 ${
                        isDarkMode
                          ? "bg-slate-800/50 border-cyan-500/20"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <h4 className="text-lg font-bold mb-3 sm:mb-4 text-cyan-400 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        About This Campaign
                      </h4>
                      <p
                        className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedCampaign.detailedDescription}
                      </p>
                    </div>
                  )}

                  {/* Links */}
                  {(selectedCampaign.github ||
                    selectedCampaign.projectLink) && (
                    <div
                      className={`p-4 sm:p-6 rounded-2xl border-2 ${
                        isDarkMode
                          ? "bg-slate-800/50 border-cyan-500/20"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <h4 className="text-lg font-bold mb-3 sm:mb-4 text-cyan-400">
                        Resources & Links
                      </h4>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {selectedCampaign.github && (
                          <a
                            href={selectedCampaign.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 text-sm sm:text-base ${
                              isDarkMode
                                ? "bg-slate-700 text-white hover:bg-slate-600"
                                : "bg-gray-800 text-white hover:bg-gray-700"
                            }`}
                          >
                            <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                            GitHub
                          </a>
                        )}
                        {selectedCampaign.projectLink && (
                          <a
                            href={selectedCampaign.projectLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
                          >
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                            Project
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Stats */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Funding Progress Card */}
                  <div
                    className={`p-4 sm:p-6 rounded-2xl border-2 shadow-xl ${
                      isDarkMode
                        ? "bg-gradient-to-br from-slate-800/80 to-cyan-900/20 border-cyan-500/20"
                        : "bg-gradient-to-br from-white to-cyan-50 border-cyan-200"
                    }`}
                  >
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2">
                        {formatAmount(selectedCampaign.currentAmount)}
                      </div>
                      <div
                        className={`text-xs sm:text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        of {formatAmount(selectedCampaign.totalAmount)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-cyan-400">
                          {calculateProgress(selectedCampaign)}% Funded
                        </span>
                      </div>
                      <div
                        className={`h-3 rounded-full overflow-hidden ${
                          isDarkMode ? "bg-slate-700" : "bg-gray-200"
                        }`}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 rounded-full"
                          style={{
                            width: `${calculateProgress(selectedCampaign)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Support Button */}
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-xl hover:scale-105 transition-all active:scale-95 mb-3">
                      Support This Campaign
                    </button>

                    <button
                      className={`w-full py-2 sm:py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 text-sm sm:text-base ${
                        isDarkMode
                          ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                          : "bg-white text-blue-600 border border-blue-300"
                      }`}
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                      Share
                    </button>
                  </div>

                  {/* Timeline */}
                  <div
                    className={`p-4 sm:p-6 rounded-2xl border-2 ${
                      isDarkMode
                        ? "bg-slate-800/50 border-cyan-500/20"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-cyan-400">
                      Campaign Timeline
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm text-gray-400">
                            Start Date
                          </div>
                          <div className="font-semibold text-xs sm:text-base break-words">
                            {new Date(
                              selectedCampaign.startDate
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm text-gray-400">
                            End Date
                          </div>
                          <div className="font-semibold text-xs sm:text-base break-words">
                            {new Date(
                              selectedCampaign.endDate
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm text-gray-400">
                            Days Remaining
                          </div>
                          <div className="font-semibold text-cyan-400 text-xs sm:text-base">
                            {getDaysLeft(selectedCampaign.endDate)} days
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div
                    className={`p-4 sm:p-6 rounded-2xl border-2 ${
                      isDarkMode
                        ? "bg-slate-800/50 border-cyan-500/20"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-cyan-400">
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      {selectedCampaign.email && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                            <Mail className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm text-gray-400">
                              Email
                            </div>
                            <a
                              href={`mailto:${selectedCampaign.email}`}
                              className="font-semibold text-xs sm:text-sm hover:text-cyan-400 transition-colors break-all"
                            >
                              {selectedCampaign.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedCampaign.contact && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                            <Phone className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm text-gray-400">
                              Phone
                            </div>
                            <a
                              href={`tel:${selectedCampaign.contact}`}
                              className="font-semibold text-xs sm:text-sm hover:text-cyan-400 transition-colors"
                            >
                              {selectedCampaign.contact}
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedCampaign.userType && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                            <User className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm text-gray-400">
                              Created by
                            </div>
                            <div className="font-semibold text-xs sm:text-sm capitalize">
                              {selectedCampaign.userType}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`p-3 sm:p-4 rounded-2xl border-2 text-center ${
                      isDarkMode
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-green-400" />
                    <div className="font-bold text-green-400 text-xs sm:text-sm">
                      ✓ Verified Campaign
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Approved by MITS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div
            className={`w-full max-w-3xl rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto ${
              isDarkMode
                ? "bg-slate-900 border border-cyan-500/20"
                : "bg-white border border-blue-200"
            }`}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold truncate">
                Create New Campaign
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white/20 rounded-full transition-all flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Authentication Warning */}
            {!isAuthenticated && (
              <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 p-4 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">
                    Please login to create a campaign
                  </span>
                </div>
              </div>
            )}

            {/* User Info Display */}
            {isAuthenticated && userInfo && (
              <div
                className={`mx-4 sm:mx-6 mt-4 sm:mt-6 p-4 rounded-xl border-2 text-sm sm:text-base ${
                  isDarkMode
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-green-400 break-words">
                      Logged in as: {userInfo.userName || userInfo.userEmail}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      Type: {userInfo.userType || "student"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {message.text && (
              <div
                className={`mx-4 sm:mx-6 mt-4 sm:mt-6 p-4 rounded-xl text-sm sm:text-base ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              {/* Campaign Title */}
              <div>
                <label className="block mb-2 font-semibold text-sm sm:text-base">
                  Campaign Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="campaignTitle"
                  value={formData.campaignTitle}
                  onChange={handleInputChange}
                  placeholder="Enter campaign title"
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isDarkMode
                      ? "bg-slate-800 border-cyan-500/20 text-white"
                      : "bg-gray-50 border-blue-200 text-gray-900"
                  }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 font-semibold text-sm sm:text-base">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isDarkMode
                      ? "bg-slate-800 border-cyan-500/20 text-white"
                      : "bg-gray-50 border-blue-200 text-gray-900"
                  }`}
                >
                  <option value="">Select a category</option>
                  <option value="startup">Startup</option>
                  <option value="research">Research</option>
                  <option value="innovation">Innovation</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="community">Community</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Tagline */}
              <div>
                <label className="block mb-2 font-semibold text-sm sm:text-base">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="Short catchy phrase"
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isDarkMode
                      ? "bg-slate-800 border-cyan-500/20 text-white"
                      : "bg-gray-50 border-blue-200 text-gray-900"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 font-semibold text-sm sm:text-base">
                  Detailed Description
                </label>
                <textarea
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleInputChange}
                  placeholder="Describe your campaign..."
                  rows="4"
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isDarkMode
                      ? "bg-slate-800 border-cyan-500/20 text-white"
                      : "bg-gray-50 border-blue-200 text-gray-900"
                  }`}
                ></textarea>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-sm sm:text-base">
                    Start Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDarkMode
                        ? "bg-slate-800 border-cyan-500/20 text-white"
                        : "bg-gray-50 border-blue-200 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-sm sm:text-base">
                    End Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDarkMode
                        ? "bg-slate-800 border-cyan-500/20 text-white"
                        : "bg-gray-50 border-blue-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block mb-2 font-semibold text-sm sm:text-base">
                  Target Amount (₹) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleInputChange}
                  placeholder="Enter target amount"
                  step="0.01"
                  min="0"
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isDarkMode
                      ? "bg-slate-800 border-cyan-500/20 text-white"
                      : "bg-gray-50 border-blue-200 text-gray-900"
                  }`}
                />
              </div>

              {/* Links */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-sm sm:text-base">
                    Project Link
                  </label>
                  <input
                    type="url"
                    name="projectLink"
                    value={formData.projectLink}
                    onChange={handleInputChange}
                    placeholder="https://your-project.com"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDarkMode
                        ? "bg-slate-800 border-cyan-500/20 text-white"
                        : "bg-gray-50 border-blue-200 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-sm sm:text-base">
                    GitHub
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/your-repo"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                      isDarkMode
                        ? "bg-slate-800 border-cyan-500/20 text-white"
                        : "bg-gray-50 border-blue-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block mb-2 font-semibold text-sm sm:text-base">
                  Contact Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isDarkMode
                      ? "bg-slate-800 border-cyan-500/20 text-white"
                      : "bg-gray-50 border-blue-200 text-gray-900"
                  }`}
                />
              </div>

              {/* Images */}
              <div>
                <label className="block mb-2 font-semibold text-sm sm:text-base">
                  Campaign Images (Max 3)
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center ${
                    isDarkMode
                      ? "border-cyan-500/30 bg-slate-800/50"
                      : "border-blue-300 bg-gray-50"
                  }`}
                >
                  <input
                    type="file"
                    id="fileInput"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer flex flex-col items-center gap-2 sm:gap-3"
                  >
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
                    <span className="text-xs sm:text-base text-cyan-400 font-semibold">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG, JPEG (Max 5MB each)
                    </span>
                  </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-xl text-sm ${
                          isDarkMode ? "bg-slate-800" : "bg-gray-100"
                        }`}
                      >
                        <span className="truncate flex-1">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                          MB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 p-1 hover:bg-red-500/20 rounded-lg transition-all flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createLoading || !isAuthenticated}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg shadow-xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {createLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Campaign...
                  </span>
                ) : !isAuthenticated ? (
                  "Please Login First"
                ) : (
                  "Create Campaign"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
