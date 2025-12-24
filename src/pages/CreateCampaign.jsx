import { useState, useEffect } from "react";
import { Upload, Sparkles, CheckCircle, X, Plus, Users } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthPopup from "../components/AuthPopup";

export default function CreateCampaignPage({
  isDarkMode,
  toggleTheme,
  isAuthenticated,
}) {
  const [createLoading, setCreateLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

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
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        if (parsedAuth && parsedAuth.accessToken) {
          setUserInfo(parsedAuth);
          setIsCheckingAuth(false);
          return;
        }
      }
      setUserInfo(null); // Explicitly set to null if no valid auth
      setIsCheckingAuth(false);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setUserInfo(null);
      setIsCheckingAuth(false);
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
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      showMessage(
        "Some files were invalid. Only JPG, PNG files under 5MB are allowed.",
        "error"
      );
    }

    setSelectedFiles(validFiles);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleCreateCampaignClick = () => {
    if (!userInfo) {
      setShowAuthPopup(true);
      return;
    }
    setShowCampaignDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.campaignTitle.trim()) {
      showMessage("Campaign title is required", "error");
      return;
    }

    if (!formData.categories) {
      showMessage("Please select a category", "error");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      showMessage("Start and end dates are required", "error");
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

    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      showMessage("Please enter a valid target amount", "error");
      return;
    }

    if (!formData.contact) {
      showMessage("Contact number is required", "error");
      return;
    }

    let token = null;
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        const parsedAuth = JSON.parse(authData);
        token = parsedAuth.accessToken;
      }
    } catch (error) {
      console.error("Error loading token:", error);
      showMessage("Authentication error", "error");
      return;
    }

    if (!token) {
      showMessage("Please login to create a campaign", "error");
      setShowAuthPopup(true);
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
        showMessage("Campaign created successfully!", "success");
        resetForm();
        setShowCampaignDialog(false);
      } else {
        showMessage(data.message || "Error creating campaign", "error");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
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

  // Custom hero section for create campaign page
  const CreateCampaignHeroSection = ({
    isDarkMode,
    onCreateCampaign,
    isUserLoggedIn,
  }) => (
    <section className="text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight pb-1">
            Create Campaign
          </h1>
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </div>

        <p className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
          Launch Your Vision, Inspire Change
        </p>

        <p
          className={`text-sm sm:text-base md:text-lg mb-4 sm:mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
        >
          Share your innovative project with the MITS community and get the
          support you need to make it happen.
        </p>

        <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-6 sm:mb-8"></div>

        {!isUserLoggedIn && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 max-w-md mx-auto">
            <p
              className={`text-sm ${isDarkMode ? "text-yellow-300" : "text-yellow-700"
                }`}
            >
              💡 Please login to create campaigns and access all features
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={onCreateCampaign}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create Campaign
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"
              }`}
          >
            <Upload className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="font-semibold mb-2">Easy Campaign Creation</h3>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Fill out a simple form to launch your campaign and start receiving
              support.
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"
              }`}
          >
            <Sparkles className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="font-semibold mb-2">Reach Supporters</h3>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Your campaign will be visible to MITS alumni and students who want
              to support great ideas.
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"
              }`}
          >
            <Users className="w-8 h-8 text-purple-500 mb-2" />
            <h3 className="font-semibold mb-2">Build Community</h3>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Connect with like-minded individuals from the MITS community and
              grow your network.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900" : "bg-gray-50"
          }`}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={isDarkMode ? "text-white" : "text-gray-900"}>
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
        }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {showAuthPopup && (
        <AuthPopup
          isOpen={showAuthPopup}
          onClose={() => setShowAuthPopup(false)}
          isDarkMode={isDarkMode}
          isAuthenticated={!!userInfo}
        />
      )}

      <CreateCampaignHeroSection
        isDarkMode={isDarkMode}
        onCreateCampaign={handleCreateCampaignClick}
        isUserLoggedIn={!!userInfo}
      />

      {/* Why Create Campaigns Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-12">
        <div
          className={`p-8 rounded-xl ${isDarkMode ? "bg-slate-900" : "bg-white shadow-lg"
            }`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Why Create Campaigns on Our Platform?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`p-6 rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-gray-50"
                }`}
            >
              <h3 className="font-semibold mb-3 text-blue-500">
                Targeted Support
              </h3>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Reach specifically MITS alumni and students who understand and
                value your vision.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-gray-50"
                }`}
            >
              <h3 className="font-semibold mb-3 text-green-500">
                No Platform Fees
              </h3>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Launch your campaigns for free and keep more of the funds you
                raise.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-gray-50"
                }`}
            >
              <h3 className="font-semibold mb-3 text-purple-500">
                Alumni Network
              </h3>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Leverage the strong MITS alumni network for mentorship,
                guidance, and support.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-gray-50"
                }`}
            >
              <h3 className="font-semibold mb-3 text-orange-500">
                Community Driven
              </h3>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                Build lasting relationships with supporters who genuinely care
                about your success.
              </p>
            </div>
          </div>

          {!userInfo && (
            <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center">
              <h3 className="font-semibold mb-2 text-blue-400">
                Ready to Launch Your Campaign?
              </h3>
              <p
                className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                Login to access the campaign creation form and start bringing
                your vision to life.
              </p>
              <button
                onClick={() => setShowAuthPopup(true)}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-all"
              >
                Login to Continue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Creation Dialog */}
      {showCampaignDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className={`rounded-2xl sm:rounded-3xl shadow-2xl ${isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
                : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-2 border-blue-300"
                }`}
            >
              <div
                className={`p-4 sm:p-6 border-b-2 flex-shrink-0 ${isDarkMode
                  ? "border-blue-500/30 bg-slate-900/90"
                  : "border-blue-300 bg-white/90"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    Create Campaign
                  </h2>
                  <button
                    onClick={() => setShowCampaignDialog(false)}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode
                      ? "text-gray-400 hover:text-white hover:bg-slate-800"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {message.text && (
                  <div
                    className={`mb-4 p-4 rounded-xl text-sm ${message.type === "success"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                  >
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Campaign Title */}
                  <div>
                    <label className="block mb-2 font-semibold text-sm">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      name="campaignTitle"
                      value={formData.campaignTitle}
                      onChange={handleInputChange}
                      placeholder="Enter campaign title"
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                        }`}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block mb-2 font-semibold text-sm">
                      Category *
                    </label>
                    <select
                      name="categories"
                      value={formData.categories}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
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
                    <label className="block mb-2 font-semibold text-sm">
                      Tagline
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      placeholder="Short catchy phrase"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                        }`}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block mb-2 font-semibold text-sm">
                      Detailed Description
                    </label>
                    <textarea
                      name="detailedDescription"
                      value={formData.detailedDescription}
                      onChange={handleInputChange}
                      placeholder="Describe your campaign..."
                      rows="4"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                        }`}
                    ></textarea>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        Start Date *
                      </label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                          ? "bg-slate-800 border-cyan-500/20 text-white"
                          : "bg-gray-50 border-blue-200 text-gray-900"
                          }`}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        End Date *
                      </label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                          ? "bg-slate-800 border-cyan-500/20 text-white"
                          : "bg-gray-50 border-blue-200 text-gray-900"
                          }`}
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block mb-2 font-semibold text-sm">
                      Target Amount (₹) *
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
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                        }`}
                    />
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        Project Link
                      </label>
                      <input
                        type="url"
                        name="projectLink"
                        value={formData.projectLink}
                        onChange={handleInputChange}
                        placeholder="https://your-project.com"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                          ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                          : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                          }`}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        GitHub
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="https://github.com/your-repo"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                          ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                          : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                          }`}
                      />
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block mb-2 font-semibold text-sm">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${isDarkMode
                        ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                        }`}
                    />
                  </div>

                  {/* Images */}
                  <div>
                    <label className="block mb-2 font-semibold text-sm">
                      Campaign Images (Max 3)
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${isDarkMode
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
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-8 h-8 text-cyan-400" />
                        <span className="text-cyan-400 font-semibold text-sm">
                          Click to upload
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG, JPEG (Max 5MB each)
                        </span>
                      </label>
                    </div>

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-semibold text-cyan-400 text-sm">
                          Selected Files:
                        </h4>
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-2 rounded text-xs ${isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                          >
                            <span className="truncate flex-1">
                              {file.name} (
                              {(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="ml-2 p-1 hover:bg-red-500/20 rounded transition-all"
                            >
                              <X className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={createLoading}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </span>
                      ) : (
                        "Create Campaign"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCampaignDialog(false)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${isDarkMode
                        ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                        : "bg-white text-blue-600 border border-blue-300"
                        }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
