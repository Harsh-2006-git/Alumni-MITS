import { useState, useEffect } from "react";
import { Upload, Sparkles, CheckCircle, X } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
        if (parsedAuth.accessToken) {
          setUserInfo(parsedAuth);
          setIsCheckingAuth(false);
          return;
        }
      }
      // If no valid auth found, redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Error checking authentication:", error);
      navigate("/login");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Rest of your component code remains the same...
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
        "https://alumni-mits-l45r.onrender.com/campaign/create-campaign",
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
        showMessage("Campaign created successfully! Redirecting...", "success");
        resetForm();
        setTimeout(() => {
          navigate("/campaigns");
        }, 2000);
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

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-slate-900" : "bg-gray-50"
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

  // If not authenticated, this won't render because we redirect in checkAuthentication
  if (!userInfo) {
    return null; // This should not happen due to the redirect
  }

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
      <section className="text-center py-8 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 ">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight pb-1">
              Create Campaign
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            Launch Your Vision, Inspire Change
          </p>
          <p
            className={`text-sm sm:text-base md:text-lg mb-4 sm:mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Share your innovative project with the MITS community and get the
            support you need
          </p>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full "></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* User Info Display */}
          {userInfo && (
            <div
              className={`mb-6 p-4 sm:p-6 rounded-2xl border-2 ${
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
              className={`mb-6 p-4 rounded-xl text-sm sm:text-base ${
                message.type === "success"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xl ${
              isDarkMode
                ? "bg-slate-900/50 border-cyan-500/20"
                : "bg-white border-blue-200"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Title */}
              <div>
                <label className="block mb-3 font-semibold text-sm sm:text-base">
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
                      ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                      : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block mb-3 font-semibold text-sm sm:text-base">
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
                <label className="block mb-3 font-semibold text-sm sm:text-base">
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
                      ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                      : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-3 font-semibold text-sm sm:text-base">
                  Detailed Description
                </label>
                <textarea
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleInputChange}
                  placeholder="Describe your campaign..."
                  rows="6"
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isDarkMode
                      ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                      : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                  }`}
                ></textarea>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-3 font-semibold text-sm sm:text-base">
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
                  <label className="block mb-3 font-semibold text-sm sm:text-base">
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
                <label className="block mb-3 font-semibold text-sm sm:text-base">
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
                      ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                      : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Links */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-3 font-semibold text-sm sm:text-base">
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
                        ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
                <div>
                  <label className="block mb-3 font-semibold text-sm sm:text-base">
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
                        ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                        : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block mb-3 font-semibold text-sm sm:text-base">
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
                      ? "bg-slate-800 border-cyan-500/20 text-white placeholder-gray-400"
                      : "bg-gray-50 border-blue-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Images */}
              <div>
                <label className="block mb-3 font-semibold text-sm sm:text-base">
                  Campaign Images (Max 3)
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center ${
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
                    className="cursor-pointer flex flex-col items-center gap-3 sm:gap-4"
                  >
                    <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400" />
                    <span className="text-lg sm:text-xl text-cyan-400 font-semibold">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-sm text-gray-400">
                      PNG, JPG, JPEG (Max 5MB each)
                    </span>
                  </label>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-cyan-400">
                      Selected Files:
                    </h4>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-xl text-sm ${
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
                          className="ml-2 p-2 hover:bg-red-500/20 rounded-lg transition-all flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {createLoading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Campaign...
                    </span>
                  ) : (
                    "Create Campaign"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/campaigns")}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 ${
                    isDarkMode
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
      </section>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
