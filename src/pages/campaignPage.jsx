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
  Sparkles,
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
  Star,
  MessageSquare,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

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
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportAmount, setSupportAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [supporterName, setSupporterName] = useState("");
  useEffect(() => {
    if (showSupportModal && userInfo && !supporterName) {
      setSupporterName(userInfo.userName);
    }
  }, [showSupportModal, userInfo]);
  const [verifiedSupporters, setVerifiedSupporters] = useState([]);
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [isHolder, setIsHolder] = useState(false);
  const [mySupports, setMySupports] = useState([]);
  const [supportStep, setSupportStep] = useState(1); // 1: Amount, 2: QR, 3: Proof/Details
  const [createStep, setCreateStep] = useState(1); // 1: Basics, 2: Goals, 3: Media
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsData, setDetailsData] = useState({ title: "", type: "", items: [] });
  const [boosterSearch, setBoosterSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success Modal State

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
    upiId: "",
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
        `${BASE_URL}/campaign/get-approve-campaign`
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
        `${BASE_URL}/campaign/create-campaign`,
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
        setShowCreateModal(false);
        resetForm();
        fetchCampaigns();
        setShowSuccessModal(true); // Show custom success popup
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
      upiId: "",
    });
    setSelectedFiles([]);
  };

  const calculateProgress = (campaign) => {
    const total = parseFloat(campaign?.totalAmount || 0);
    const current = parseFloat(campaign?.currentAmount || 0);
    if (total <= 0 || isNaN(total) || isNaN(current)) return 0;

    const percentage = (current / total) * 100;

    if (percentage === 0) return 0;
    if (percentage >= 100) return 100;

    // For very small amounts, show up to 2 decimal places so it's not 0%
    if (percentage < 1) {
      return parseFloat(percentage.toFixed(2));
    }

    return Math.round(percentage);
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
    fetchVerifiedSupporters(campaign.id || campaign._id);
    fetchComplaints(campaign.id || campaign._id);
    fetchMySupports(campaign.id || campaign._id);

    // Check if current user is the holder
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    if (authData.userEmail === campaign.email) {
      setIsHolder(true);
      fetchCampaignHistory(campaign.id || campaign._id);
    } else {
      setIsHolder(false);
    }
  };

  const fetchVerifiedSupporters = async (campaignId) => {
    try {
      const response = await fetch(`${BASE_URL}/campaign/${campaignId}/verified-supporters`);
      const data = await response.json();
      if (response.ok) setVerifiedSupporters(data.data || []);
    } catch (error) {
      console.error("Error fetching supporters:", error);
    }
  };

  const fetchComplaints = async (campaignId) => {
    try {
      const response = await fetch(`${BASE_URL}/campaign/${campaignId}/complaints`);
      const data = await response.json();
      if (response.ok) setComplaints(data.data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchMySupports = async (campaignId) => {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    if (!authData.accessToken) return;
    try {
      const response = await fetch(`${BASE_URL}/campaign/${campaignId}/my-support`, {
        headers: { Authorization: `Bearer ${authData.accessToken}` }
      });
      const data = await response.json();
      if (response.ok) setMySupports(data.data || []);
    } catch (error) {
      console.error("Error fetching my supports:", error);
    }
  };

  const fetchCampaignHistory = async (campaignId) => {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    try {
      const response = await fetch(`${BASE_URL}/campaign/${campaignId}/supports`, {
        headers: { Authorization: `Bearer ${authData.accessToken}` }
      });
      const data = await response.json();
      if (response.ok) setCampaignHistory(data.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    if (!authData.accessToken) {
      showMessage("Please login to support campaign", "error");
      return;
    }

    if (!/^\d{12}$/.test(transactionId)) {
      showMessage("UTR must be exactly 12 digits", "error");
      return;
    }

    setSupportLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/campaign/support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.accessToken}`
        },
        body: JSON.stringify({
          campaignId: selectedCampaign.id || selectedCampaign._id,
          amount: supportAmount,
          transactionId,
          supporterName: supporterName || authData.userName || "Anonymous"
        })
      });

      const data = await response.json();
      if (response.ok) {
        showMessage("Payment submitted for verification!", "success");
        setShowSupportModal(false);
        setSupportStep(1);
        setSupportAmount("");
        setTransactionId("");
        setSupporterName("");
      } else {
        showMessage(data.message || "Failed to submit support", "error");
      }
    } catch (error) {
      showMessage("Network error", "error");
    } finally {
      setSupportLoading(false);
    }
  };

  const handleVerifySupport = async (supportId, status) => {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    try {
      const response = await fetch(`${BASE_URL}/campaign/support/${supportId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.accessToken}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        const result = await response.json();
        showMessage(`Support ${status} successful`, "success");
        if (status === 'verified' && result.updatedCurrentAmount !== undefined) {
          setSelectedCampaign(prev => ({ ...prev, currentAmount: result.updatedCurrentAmount }));
        }
        fetchCampaignHistory(selectedCampaign.id || selectedCampaign._id);
        fetchVerifiedSupporters(selectedCampaign.id || selectedCampaign._id);
        fetchCampaigns(); // Update main list for currentAmount
      }
    } catch (error) {
      showMessage("Verification failed", "error");
    }
  };

  const handleFileComplaint = async (supportId) => {
    const text = prompt("Enter your complaint details:");
    if (!text) return;

    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    try {
      const response = await fetch(`${BASE_URL}/campaign/support/${supportId}/complaint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.accessToken}`
        },
        body: JSON.stringify({ complaintText: text })
      });

      if (response.ok) {
        showMessage("Complaint filed successfully", "success");
        fetchComplaints(selectedCampaign.id || selectedCampaign._id);
      }
    } catch (error) {
      showMessage("Failed to file complaint", "error");
    }
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

  const totalRaisedValue = campaigns.reduce((acc, c) => acc + (parseFloat(c.currentAmount) || 0), 0);
  const successRateValue = campaigns.length > 0
    ? Math.round((campaigns.filter(c => parseFloat(c.currentAmount) >= parseFloat(c.totalAmount)).length / campaigns.length) * 100)
    : 0;

  const formatStatsAmount = (amt) => {
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)}Cr+`;
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L+`;
    return `₹${amt.toLocaleString()}`;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
        }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="text-center py-12 sm:py-16 lg:py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight pb-1">
              Campaigns
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            Empower Dreams, Fund Innovation
          </p>
          <p
            className={`text-sm sm:text-base md:text-lg mb-4 sm:mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
          >
            Support groundbreaking projects from MITS students, alumni, and
            faculty
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-6 sm:mb-8"></div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            <div
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all hover:scale-105 ${isDarkMode
                ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/40"
                : "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300"
                }`}
            >
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-purple-400 mb-1">
                {campaigns.length}
              </h3>
              <p
                className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Active Campaigns
              </p>
            </div>

            <div
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all hover:scale-105 ${isDarkMode
                ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/40"
                : "bg-gradient-to-br from-cyan-100 to-blue-100 border-cyan-300"
                }`}
            >
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-cyan-400 mb-1">
                {campaigns.length * 12}+
              </h3>
              <p
                className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Supporters
              </p>
            </div>

            <div
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all hover:scale-105 ${isDarkMode
                ? "bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-400/40"
                : "bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-300"
                }`}
            >
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-emerald-400 mb-1">
                {formatStatsAmount(totalRaisedValue)}
              </h3>
              <p
                className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Raised
              </p>
            </div>

            <div
              className={`p-3 sm:p-4 rounded-xl border-2 transition-all hover:scale-105 ${isDarkMode
                ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-400/40"
                : "bg-gradient-to-br from-orange-100 to-red-100 border-orange-300"
                }`}
            >
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-orange-400 mb-1">
                {successRateValue}%
              </h3>
              <p
                className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                Success Rate
              </p>
            </div>
          </div>
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
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base ${isDarkMode
                ? "bg-slate-900/50 border-cyan-500/20 text-white placeholder-gray-400"
                : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                }`}
            />
          </div>
          <div className="w-full sm:w-auto flex-shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`w-full sm:w-64 px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base appearance-none cursor-pointer ${isDarkMode
                ? "bg-slate-900/50 border-cyan-500/20 text-white"
                : "bg-white border-blue-200 text-gray-900"
                }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23${isDarkMode ? "ffffff" : "000000"
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
                  className={`rounded-3xl overflow-hidden border-2 shadow-xl transition-all hover:shadow-2xl hover:scale-105 cursor-pointer ${isDarkMode
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
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md transition-all ${isDarkMode
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
                        className={`p-2 rounded-full backdrop-blur-md transition-all hover:scale-110 ${isLiked
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
                        className={`text-xs sm:text-sm mb-4 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"
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
                          className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                          {formatAmount(campaign.currentAmount)} /{" "}
                          {formatAmount(campaign.totalAmount)}
                        </span>
                      </div>
                      <div
                        className={`h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-gray-200"
                          }`}
                      >
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                          style={{ width: `${Math.max(parseFloat(progress) > 0 ? 1.5 : 0, parseFloat(progress))}%` }}
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
                        className={`p-2 sm:p-3 rounded-xl transition-all hover:scale-110 active:scale-95 ${isDarkMode
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
            className={`w-full max-w-6xl rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto ${isDarkMode
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
                        className={`text-base sm:text-lg md:text-xl ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx
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
                      className={`p-4 sm:p-6 rounded-2xl border-2 ${isDarkMode
                        ? "bg-slate-800/50 border-cyan-500/20"
                        : "bg-blue-50 border-blue-200"
                        }`}
                    >
                      <h4 className="text-lg font-bold mb-3 sm:mb-4 text-cyan-400 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        About This Campaign
                      </h4>
                      <p
                        className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${isDarkMode ? "text-gray-300" : "text-gray-700"
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
                        className={`p-4 sm:p-6 rounded-2xl border-2 ${isDarkMode
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
                              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 text-sm sm:text-base ${isDarkMode
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
                    className={`p-4 sm:p-6 rounded-2xl border-2 shadow-xl ${isDarkMode
                      ? "bg-gradient-to-br from-slate-800/80 to-cyan-900/20 border-cyan-500/20"
                      : "bg-gradient-to-br from-white to-cyan-50 border-cyan-200"
                      }`}
                  >
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2">
                        {formatAmount(selectedCampaign.currentAmount)}
                      </div>
                      <div
                        className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
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
                        className={`h-3 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700" : "bg-gray-200"
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
                    <button
                      onClick={() => setShowSupportModal(true)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-xl hover:scale-105 transition-all active:scale-95 mb-3">
                      Support This Campaign
                    </button>

                    <button
                      className={`w-full py-2 sm:py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 text-sm sm:text-base ${isDarkMode
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
                    className={`p-4 sm:p-6 rounded-2xl border-2 ${isDarkMode
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
                    className={`p-4 sm:p-6 rounded-2xl border-2 ${isDarkMode
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


                </div>
              </div>

              {/* FULL WIDTH DETAILS SECTION */}
              <div className="mt-8 space-y-6">


                {/* MY CONTRIBUTION SECTION - FULL WIDTH */}
                {mySupports.length > 0 && (
                  <div className={`p-6 rounded-3xl border-2 mb-6 ${isDarkMode ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-50 border-amber-200"}`}>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                        <Star className="w-6 h-6 fill-amber-500" /> My Contribution
                      </h4>
                      <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                        {mySupports.length} Records
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mySupports.map((s, i) => (
                        <div key={i} className={`p-5 rounded-2xl border-2 flex flex-col justify-between group transition-all ${isDarkMode ? "bg-black/40 border-white/5 hover:border-amber-500/30" : "bg-white border-amber-100 shadow-sm"}`}>
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${s.status === 'verified' ? 'bg-emerald-100 text-emerald-600' : s.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                {s.status}
                              </span>
                              <span className={`font-black text-xl ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>{formatAmount(s.amount)}</span>
                            </div>
                            <p className={`text-xs font-bold font-mono mb-2 p-2 rounded-lg break-all ${isDarkMode ? "bg-black/20 text-gray-400" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>UTR: {s.transactionId}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(s.verifiedAt || s.createdAt).toLocaleDateString()}</p>
                          </div>

                          {(s.status === 'pending' || s.status === 'rejected') && !s.complaintText && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileComplaint(s._id);
                              }}
                              className="w-full mt-2 py-3 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-black rounded-xl transition-all border border-red-200 uppercase tracking-widest"
                            >
                              Raise Query
                            </button>
                          )}
                          {s.complaintText && (
                            <div className={`mt-2 p-3 border rounded-xl text-xs italic ${isDarkMode ? "bg-red-500/5 border-red-500/10 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>
                              "{s.complaintText}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTIVE COMPLAINTS - AFTER MY CONTRIBUTION */}
                {complaints.length > 0 && (
                  <div className={`p-6 rounded-3xl border-2 mb-6 ${isDarkMode ? "bg-red-500/5 border-red-500/20" : "bg-red-50 border-red-100"}`}>
                    <h4 className="text-xl font-bold mb-6 text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-6 h-6" /> Query & Complaints
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {complaints.map((c, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-bold text-sm text-red-300 mb-0.5">{c.supporterName}</p>
                                <p className="text-[10px] text-gray-400">{c.supporterEmail}</p>
                                {c.amount && <p className="text-sm font-black text-red-400 mt-1">{formatAmount(c.amount)}</p>}
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="p-3 bg-black/20 rounded-xl border-l-2 border-red-500/30 italic mb-2">
                              <p className="text-xs text-red-200">"{c.complaintText}"</p>
                            </div>
                            {c.transactionId && (
                              <p className="text-[10px] text-gray-500 font-mono bg-black/20 p-1.5 rounded break-all">UTR: {c.transactionId}</p>
                            )}
                          </div>

                          {isHolder && (
                            <div className="flex gap-3 mt-4 pt-3 border-t border-red-500/20">
                              <button
                                onClick={() => handleVerifySupport(c._id, 'verified')}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black py-2 rounded-lg transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-tighter"
                              >Approve</button>
                              <button
                                onClick={() => handleVerifySupport(c._id, 'rejected')}
                                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black py-2 rounded-lg transition-all shadow-lg shadow-rose-900/20 uppercase tracking-tighter"
                              >Reject</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MAIN CONTENT GRID - HOLDERS GET 2 COLUMNS, USERS GET 1 */}
                <div className={`grid grid-cols-1 ${isHolder ? 'lg:grid-cols-2' : ''} gap-6`}>

                  {/* PENDING APPROVALS - LEFT COLUMN FOR HOLDER */}
                  {isHolder && (
                    <div className={`p-6 rounded-3xl border-2 flex flex-col h-[500px] ${isDarkMode ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-50 border-amber-200"}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                          <Clock className="w-6 h-6" /> Payment Approval
                        </h4>
                        <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                          {campaignHistory.filter(h => h.status === 'pending').length} Pending
                        </span>
                      </div>

                      {/* Search Filter */}
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Search pending..."
                          value={pendingSearch}
                          onChange={(e) => setPendingSearch(e.target.value)}
                          className={`w-full p-3 rounded-xl border text-sm ${isDarkMode ? "bg-black/20 border-amber-500/30 text-white placeholder-gray-500" : "bg-white border-amber-200 text-gray-900 placeholder-gray-400"}`}
                        />
                      </div>

                      <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
                        {campaignHistory.filter(h => h.status === 'pending' && (
                          h.supporterName.toLowerCase().includes(pendingSearch.toLowerCase()) ||
                          h.transactionId.toLowerCase().includes(pendingSearch.toLowerCase())
                        )).length > 0 ? (
                          campaignHistory.filter(h => h.status === 'pending' && (
                            h.supporterName.toLowerCase().includes(pendingSearch.toLowerCase()) ||
                            h.transactionId.toLowerCase().includes(pendingSearch.toLowerCase())
                          )).map((h, i) => (
                            <div key={i} className={`p-4 rounded-2xl border flex flex-col justify-between w-full ${isDarkMode ? "bg-amber-500/5 border-amber-500/20" : "bg-white border-amber-100 shadow-sm"}`}>
                              <div className="flex justify-between items-start mb-2">
                                <div className="min-w-0 flex-1">
                                  <p className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>{h.supporterName}</p>
                                  <p className="text-[10px] text-gray-500">{h.supporterEmail}</p>
                                </div>
                                <span className={`font-black text-lg ml-4 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`}>{formatAmount(h.amount)}</span>
                              </div>
                              <p className={`text-[10px] font-mono mb-3 p-1.5 rounded break-all border ${isDarkMode ? "bg-black/30 text-gray-500 border-amber-500/10" : "bg-gray-50 text-gray-600 border-gray-100"}`}>UTR: {h.transactionId}</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleVerifySupport(h._id, 'verified')}
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black py-2 rounded-lg transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-wide"
                                >Approve</button>
                                <button
                                  onClick={() => handleVerifySupport(h._id, 'rejected')}
                                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black py-2 rounded-lg transition-all shadow-lg shadow-rose-900/20 uppercase tracking-wide"
                                >Reject</button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-6 italic opacity-50">No pending approvals found</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* RECENT BOOSTERS / VERIFIED PAYMENTS - RIGHT COLUMN FOR HOLDER, FULL FOR USER */}
                  <div className={`p-6 rounded-3xl border-2 flex flex-col h-[500px] ${isDarkMode ? "bg-cyan-500/5 border-cyan-500/20" : "bg-blue-50 border-blue-100"}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-cyan-500 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" /> {isHolder ? "Verified Payments" : "Recent Boosters"}
                      </h4>
                      <span className="text-xs font-black text-cyan-600 bg-cyan-100 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                        {verifiedSupporters.length} Verified
                      </span>
                    </div>

                    {/* Search Filter */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder={isHolder ? "Search verified..." : "Search boosters..."}
                        value={boosterSearch}
                        onChange={(e) => setBoosterSearch(e.target.value)}
                        className={`w-full p-3 rounded-xl border text-sm ${isDarkMode ? "bg-black/20 border-cyan-500/30 text-white placeholder-gray-500" : "bg-white border-blue-200 text-gray-900 placeholder-gray-400"}`}
                      />
                    </div>

                    <div className="overflow-y-auto flex-1 pr-2 space-y-1 custom-scrollbar">
                      {/* Header Row - Desktop Only */}
                      <div className={`hidden sm:flex items-center px-4 py-2 text-[10px] font-bold uppercase tracking-widest gap-8 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                        <div className="flex-1">Supporter Details</div>
                        <div className="w-24 text-right">Date</div>
                        <div className="w-28 text-right">Amount</div>
                      </div>

                      {verifiedSupporters.filter(s =>
                        s.supporterName.toLowerCase().includes(boosterSearch.toLowerCase()) ||
                        (s.transactionId && s.transactionId.toLowerCase().includes(boosterSearch.toLowerCase()))
                      ).length > 0 ? (
                        verifiedSupporters.filter(s =>
                          s.supporterName.toLowerCase().includes(boosterSearch.toLowerCase()) ||
                          (s.transactionId && s.transactionId.toLowerCase().includes(boosterSearch.toLowerCase()))
                        ).map((s, i) => (
                          <div key={i} className={`flex flex-col sm:flex-row sm:items-center px-4 py-3 rounded-xl transition-all hover:scale-[1.01] gap-2 sm:gap-8 ${isDarkMode ? "hover:bg-white/5 border border-transparent hover:border-white/5" : "hover:bg-gray-50 border border-transparent hover:border-blue-100"}`}>
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-sm break-words ${isDarkMode ? "text-white/90" : "text-gray-900"}`}>{s.supporterName}</div>
                              <div className={`text-xs break-words ${isDarkMode ? "text-cyan-400/70" : "text-blue-500/70"}`}>{s.supporterEmail}</div>
                              {isHolder && s.transactionId && (
                                <div className={`text-[10px] font-mono mt-0.5 break-all ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>UTR: {s.transactionId}</div>
                              )}
                            </div>
                            <div className="flex justify-between sm:block sm:w-24 text-right">
                              <span className="sm:hidden text-[10px] font-bold text-gray-400 uppercase">Date:</span>
                              <span className="text-xs text-gray-500 font-bold">{new Date(s.verifiedAt || s.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className={`flex justify-between sm:block sm:w-28 text-right font-black ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                              <span className="sm:hidden text-[10px] font-bold text-gray-400 uppercase">Amount:</span>
                              <span>{formatAmount(s.amount)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">No boosters found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {
        showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div
              className={`w-full max-w-3xl rounded-3xl shadow-2xl max-h-[95vh] overflow-y-auto ${isDarkMode
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
                  className={`mx-4 sm:mx-6 mt-4 sm:mt-6 p-4 rounded-xl border-2 text-sm sm:text-base ${isDarkMode
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
                  className={`mx-4 sm:mx-6 mt-4 sm:mt-6 p-4 rounded-xl text-sm sm:text-base ${message.type === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                >
                  {message.text}
                </div>
              )}

              {/* Multi-step Header */}
              <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${createStep >= step
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-800 text-gray-500 border border-white/10"
                        }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${createStep > step ? "bg-cyan-500" : "bg-slate-800"
                          }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <span>Basics</span>
                  <span>Finances</span>
                  <span>Media</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                {createStep === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                    <div>
                      <label className="block mb-2 font-semibold text-sm">Campaign Title <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        name="campaignTitle"
                        value={formData.campaignTitle}
                        onChange={handleInputChange}
                        placeholder="Enter campaign title"
                        required
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-sm">Category <span className="text-red-400">*</span></label>
                      <select
                        name="categories"
                        value={formData.categories}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
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
                    <div>
                      <label className="block mb-2 font-semibold text-sm">Tagline</label>
                      <input
                        type="text"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleInputChange}
                        placeholder="Short catchy phrase"
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-sm">Detailed Description</label>
                      <textarea
                        name="detailedDescription"
                        value={formData.detailedDescription}
                        onChange={handleInputChange}
                        placeholder="Describe your campaign..."
                        rows="4"
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                      ></textarea>
                    </div>
                  </div>
                )}

                {createStep === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 font-semibold text-sm">Start Date <span className="text-red-400">*</span></label>
                        <input
                          type="datetime-local"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold text-sm">End Date <span className="text-red-400">*</span></label>
                        <input
                          type="datetime-local"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-sm">Target Amount (₹) <span className="text-red-400">*</span></label>
                      <input
                        type="number"
                        name="totalAmount"
                        value={formData.totalAmount}
                        onChange={handleInputChange}
                        placeholder="Enter target amount"
                        required
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-sm">UPI ID for Funds <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        placeholder="yourname@upi"
                        required
                        className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                      />
                    </div>
                  </div>
                )}

                {createStep === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 font-semibold text-sm">Project Link</label>
                        <input
                          type="url"
                          name="projectLink"
                          value={formData.projectLink}
                          onChange={handleInputChange}
                          placeholder="https://..."
                          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold text-sm">GitHub</label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          placeholder="https://github..."
                          className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-sm">Contact Number <span className="text-red-400">*</span></label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="+91..."
                        required
                        className={`w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDarkMode ? "bg-slate-800 border-cyan-500/20 text-white" : "bg-gray-50 border-blue-200"}`}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-sm">Campaign Images (Max 3)</label>
                      <div className={`border-2 border-dashed rounded-xl p-6 text-center ${isDarkMode ? "border-cyan-500/30 bg-slate-800/50" : "border-blue-300 bg-gray-50"}`}>
                        <input type="file" id="fileInput" accept=".jpg,.jpeg,.png" multiple onChange={handleFileChange} className="hidden" />
                        <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-cyan-400" />
                          <span className="text-xs text-cyan-400 font-bold">Pick Images</span>
                        </label>
                      </div>
                      {selectedFiles.length > 0 && (
                        <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                          {selectedFiles.map((file, i) => (
                            <div key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-[10px] whitespace-nowrap flex items-center gap-2">
                              {file.name} <X className="w-3 h-3 cursor-pointer" onClick={() => removeFile(i)} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4">
                  {createStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCreateStep(createStep - 1)}
                      className={`flex-1 py-4 rounded-xl font-bold transition-all ${isDarkMode ? "bg-slate-800 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                      Back
                    </button>
                  )}
                  {createStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (createStep === 1 && (!formData.campaignTitle || !formData.categories)) {
                          showMessage("Please fill required fields", "error");
                          return;
                        }
                        if (createStep === 2 && (!formData.startDate || !formData.endDate || !formData.totalAmount || !formData.upiId)) {
                          showMessage("Please fill required fields", "error");
                          return;
                        }
                        setCreateStep(createStep + 1);
                      }}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={createLoading || !isAuthenticated}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {createLoading ? "Creating..." : "Launch Campaign"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* SUPPORT CAMPAIGN MODAL (QR & Proof) - STEPPED FLOW */}
      {
        showSupportModal && selectedCampaign && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? "bg-slate-900 border border-cyan-500/30" : "bg-white border border-blue-200"}`}>
              <div className="p-6 bg-gradient-to-r from-cyan-600 to-blue-700 text-white flex justify-between items-center text-center">
                <div>
                  <h3 className="font-bold text-xl">Support Campaign</h3>
                  <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Step {supportStep} of 3</p>
                </div>
                <button
                  onClick={() => {
                    setShowSupportModal(false);
                    setSupportStep(1);
                  }}
                  className="hover:rotate-90 transition-transform"
                >
                  <X />
                </button>
              </div>

              <div className="p-6">
                {/* STEP 1: ENTER AMOUNT */}
                {supportStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div className="text-center space-y-2">
                      <Target className="w-12 h-12 text-cyan-400 mx-auto" />
                      <h4 className="font-bold text-lg">Enter Donation Amount</h4>
                      <p className="text-xs text-gray-500">How much would you like to contribute?</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        required
                        min="1"
                        value={supportAmount}
                        onChange={(e) => setSupportAmount(e.target.value)}
                        className={`w-full p-5 text-2xl font-bold text-center rounded-2xl border-2 focus:ring-2 focus:ring-cyan-500 outline-none ${isDarkMode ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`}
                        placeholder="₹ 0.00"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (supportAmount > 0) setSupportStep(2);
                        else showMessage("Please enter a valid amount", "error");
                      }}
                      className="w-full bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
                    >
                      View QR for Payment <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* STEP 2: SHOW QR */}
                {supportStep === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center">
                    <div className="p-4 rounded-3xl bg-white shadow-2xl inline-block mx-auto border-4 border-cyan-500/20">
                      <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase truncate max-w-[200px]">{selectedCampaign.campaignTitle}</p>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${selectedCampaign.upiId}%26pn=${encodeURIComponent(selectedCampaign.campaignTitle)}%26am=${supportAmount}%26cu=INR`}
                        alt="Payment QR"
                        className="w-48 h-48"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className={`text-xl font-bold ${isDarkMode ? "text-cyan-400" : "text-blue-600"}`}>₹ {supportAmount}</p>
                      <p className="text-[10px] font-black uppercase text-gray-400">Scan & Pay to: {selectedCampaign.upiId}</p>
                      <p className="text-[12px] font-bold text-gray-500 italic mt-1">{selectedCampaign.campaignTitle}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <button
                        onClick={() => setSupportStep(1)}
                        className="py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setSupportStep(3)}
                        className="py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                      >
                        I Have Paid
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PROOF & DETAILS */}
                {supportStep === 3 && (
                  <form onSubmit={handleSupportSubmit} className="space-y-5 animate-in slide-in-from-right duration-300">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Verifying ₹{supportAmount} contribution</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest pl-1">UTR <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        required
                        maxLength={12}
                        value={transactionId}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 12) setTransactionId(val);
                        }}
                        className={`w-full p-4 rounded-xl border-2 focus:ring-2 focus:ring-cyan-500 outline-none ${isDarkMode ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-100 text-gray-900"}`}
                        placeholder="12-digit UTR Number"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest pl-1">Your Display Name <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        required
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value)}
                        className={`w-full p-4 rounded-xl border-2 focus:ring-2 focus:ring-cyan-500 outline-none ${isDarkMode ? "bg-black/20 border-white/10 text-white" : "bg-gray-50 border-gray-100 text-gray-900"}`}
                        placeholder="How should your name appear?"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setSupportStep(2)}
                        className="py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        Wait, Show QR
                      </button>
                      <button
                        type="submit"
                        disabled={supportLoading}
                        className="py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg flex items-center justify-center gap-2"
                      >
                        {supportLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Submit Proof"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* FULL DETAILS MODAL */}
      {
        showDetailsModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
            <div className={`w-full max-w-5xl h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col ${isDarkMode ? "bg-slate-900 border border-cyan-500/30" : "bg-white border border-blue-200"}`}>
              {/* Modal Header */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-600 to-blue-700 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold">{detailsData.title}</h3>
                  <p className="text-sm opacity-80 mt-1">Showing all {detailsData.items.length} records</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:rotate-90"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content - Scrollable Table */}
              <div className="flex-1 overflow-auto custom-scrollbar p-4 sm:p-8">
                <div className="w-full space-y-4">
                  {/* Table Header - Only for Desktop */}
                  <div className={`hidden sm:grid grid-cols-12 gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "bg-black/20 text-gray-400" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">User Details</div>
                    <div className="col-span-3">Email & Type</div>
                    <div className="col-span-2">Amount</div>
                    <div className={`col-span-${detailsData.type === 'complaints' ? '3' : '3'}`}>
                      {detailsData.type === 'complaints' ? 'Complaint Message' : 'Transaction / Date'}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4">
                    {detailsData.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 sm:p-6 rounded-3xl border transition-all ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300"}`}
                      >
                        {/* Mobile Badge for Index */}
                        <div className="sm:col-span-1 flex items-center justify-between sm:justify-start">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDarkMode ? "bg-cyan-500/20 text-cyan-400" : "bg-blue-100 text-blue-600"}`}>
                            {idx + 1}
                          </span>
                          <div className="sm:hidden">
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${item.status === 'verified' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'}`}>
                              {item.status || 'Verified'}
                            </span>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="sm:col-span-3 min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                              {item.supporterName?.charAt(0) || 'U'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`font-bold text-base break-words ${isDarkMode ? "text-white" : "text-gray-800"}`}>{item.supporterName}</p>
                              <p className="text-[10px] sm:hidden text-gray-500 break-words">{item.supporterEmail}</p>
                            </div>
                          </div>
                        </div>

                        {/* Contact & Type */}
                        <div className="sm:col-span-3 space-y-1">
                          <p className={`hidden sm:block text-sm font-semibold break-words ${isDarkMode ? "text-cyan-400/80" : "text-blue-600"}`}>{item.supporterEmail || 'N/A'}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDarkMode ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600 border border-gray-200"} uppercase`}>
                              {item.supporterUserType || 'Student'}
                            </span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="sm:col-span-2">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 sm:hidden">Amount Paid:</span>
                            <span className={`text-lg font-black ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                              {item.amount ? formatAmount(item.amount) : '---'}
                            </span>
                          </div>
                        </div>

                        {/* Dynamic Column: Complaint or Transaction */}
                        <div className="sm:col-span-3">
                          {detailsData.type === 'complaints' ? (
                            <div className={`p-3 rounded-2xl text-xs italic border ${isDarkMode ? "bg-red-500/10 text-red-300 border-red-500/20" : "bg-red-50 text-red-700 border-red-200"}`}>
                              "{item.complaintText}"
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className={`text-[10px] font-mono p-2 rounded-lg break-all ${isDarkMode ? "bg-black/20 text-gray-400" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>UTR: {item.transactionId || 'N/A'}</p>
                              <p className={`text-[10px] font-bold ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{item.verifiedAt || item.createdAt ? new Date(item.verifiedAt || item.createdAt).toLocaleString() : ''}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 bg-black/20 text-center">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-10 py-3 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl p-8 shadow-2xl text-center transform transition-all scale-100 ${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"
            }`}>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Campaign Successfully Submitted!
            </h3>
            <p className={`text-base mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Our admin will verify your campaign details. Once verified, it will be visible to everyone here.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
    </div >
  );
}
