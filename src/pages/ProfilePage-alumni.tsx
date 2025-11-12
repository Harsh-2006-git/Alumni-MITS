import { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
  X,
  Briefcase,
  GraduationCap,
  Users,
  MessageSquare,
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
  Globe,
  Calendar,
  Award,
  Building,
  ExternalLink,
  Heart,
  Target,
  FileText,
  Share2,
  Edit,
  Sparkles,
  ArrowRight,
  BookOpen,
  Plus,
  Trash2,
  Bell,
  Search,
  Home,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

interface Education {
  type: string;
  stream: string;
  institution: string;
  from: string;
  to: string;
  gpa: string;
}

interface Experience {
  designation: string;
  company: string;
  from: string;
  to: string | null;
  current: boolean;
  location: string;
  description: string;
}

interface Profile {
  id?: number;
  alumniId?: number;
  location?: string;
  branch?: string;
  about?: string;
  skills?: string[];
  achievements?: string[];
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
  education?: Education[];
  resume?: string; // Add this line
  experience?: Experience[];
  createdAt?: string;
  updatedAt?: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  resume?: string; // Add this line
  phone: string;
  userType: string;
  isVerified: boolean;
  profile?: Profile;
  profilePhoto?: string;
}

interface EditModalState {
  isOpen: boolean;
  section: string | null;
}

interface FormData {
  about?: string;
  skills?: string[];
  achievements?: string[];
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
  experience?: Experience[];
  education?: Education[];
  location?: string;
  branch?: string;
}

export default function AlumniProfilePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    section: null,
  });
  const [formData, setFormData] = useState<FormData>({});
  const [tempSkill, setTempSkill] = useState("");
  const [tempAchievement, setTempAchievement] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const API_BASE_URL = "http://localhost:3001";

  useEffect(() => {
    fetchUserData();
  }, []);

  const getAuthToken = (): string | null => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed.accessToken;
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
    return null;
  };

  const fetchUserData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = getAuthToken();

      if (!token) {
        console.error("No authentication token found");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/alumni/get-profile-alumni`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        console.error("Token expired or invalid");
        localStorage.removeItem("auth");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setUserData(data.alumni);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  const renderResumeUploadModal = () => {
    if (!showResumeModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className={`max-w-2xl w-full rounded-3xl p-8 shadow-2xl transform transition-all ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
              : "bg-gradient-to-br from-white via-blue-50 to-indigo-50"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {resumeFile ? "Review Resume" : "Upload Resume"}
              </h2>
              <p
                className={`mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                PDF format • Max 10MB
              </p>
            </div>
            <button
              onClick={() => {
                setShowResumeModal(false);
                setResumeFile(null);
              }}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-200"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {resumeFile ? (
              <div className="text-center">
                <div
                  className={`w-32 h-32 mx-auto rounded-2xl flex items-center justify-center border-4 shadow-xl ${
                    isDarkMode
                      ? "border-green-500/30 bg-green-900/20"
                      : "border-green-400 bg-green-100"
                  }`}
                >
                  <FileText
                    className={`w-16 h-16 ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <p
                    className={`font-medium text-lg ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {resumeFile.name}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • PDF
                    Document
                  </p>
                </div>
              </div>
            ) : (
              <label
                className={`block w-full p-12 border-3 border-dashed rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                  isDarkMode
                    ? "border-blue-500/50 bg-blue-900/20 hover:bg-blue-900/40 hover:border-blue-400"
                    : "border-blue-400 bg-blue-50 hover:bg-blue-100 hover:border-blue-500"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.type !== "application/pdf") {
                        alert("Please select a PDF file");
                        return;
                      }
                      if (file.size > 10 * 1024 * 1024) {
                        alert("File size must be less than 10MB");
                        return;
                      }
                      setResumeFile(file);
                    }
                  }}
                  className="hidden"
                />
                <div className="text-center">
                  <FileText
                    className={`w-20 h-20 mx-auto mb-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <p
                    className={`font-medium text-lg mb-2 ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Click to select resume
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    or drag and drop your PDF file here
                  </p>
                  <div
                    className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                      isDarkMode
                        ? "bg-blue-900/50 text-blue-300"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    PDF only, up to 10MB
                  </div>
                </div>
              </label>
            )}

            {/* Upload Progress */}
            {uploadingResume && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Uploading...
                  </span>
                  <span
                    className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                  >
                    Please wait
                  </span>
                </div>
                <div
                  className={`w-full h-2 rounded-full overflow-hidden ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowResumeModal(false);
                  setResumeFile(null);
                }}
                className={`flex-1 py-4 rounded-xl font-medium transition-all ${
                  isDarkMode
                    ? "bg-slate-800 hover:bg-slate-700 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => resumeFile && handleResumeUpload(resumeFile)}
                disabled={!resumeFile || uploadingResume}
                className={`flex-1 py-4 rounded-xl font-medium transition-all ${
                  resumeFile && !uploadingResume
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {uploadingResume ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  "Upload Resume"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const handleResumeUpload = async (file: File): Promise<void> => {
    try {
      setUploadingResume(true);
      const token = getAuthToken();

      if (!token) {
        console.error("No authentication token found");
        alert("Please log in again");
        return;
      }

      const formData = new FormData();
      formData.append("resume", file); // Changed from "file" to "resume" to match multer configuration

      const response = await fetch(`${API_BASE_URL}/alumni/upload-resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Resume upload successful:", result);

        // Update user data with the new resume URL
        if (userData && result.resumeUrl) {
          setUserData({
            ...userData,
            resume: result.resumeUrl,
          });
        }

        setShowResumeModal(false);
        setResumeFile(null);
        await fetchUserData(); // Refresh user data

        alert("Resume uploaded successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert(
        `Failed to upload resume: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUploadingResume(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<void> => {
    try {
      if (!userData) {
        console.error("No user data available");
        return;
      }

      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/alumni/profile-alumni`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          alumniId: userData.id,
          ...updates,
        }),
      });

      if (response.status === 401) {
        console.error("Token expired or invalid");
        localStorage.removeItem("auth");
        window.location.href = "/login";
        return;
      }

      if (response.ok) {
        await fetchUserData();
        setEditModal({ isOpen: false, section: null });
        setTempSkill("");
        setTempAchievement("");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const openEditModal = (section: string): void => {
    const profile = userData?.profile || {};
    const formDataMap: { [key: string]: FormData } = {
      about: { about: profile.about || "" },
      skills: { skills: profile.skills || [] },
      achievements: { achievements: profile.achievements || [] },
      social: {
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        twitter: profile.twitter || "",
        portfolio: profile.portfolio || "",
      },
      experience: { experience: profile.experience || [] },
      education: { education: profile.education || [] },
      location: {
        location: profile.location || "",
        branch: profile.branch || "",
      },
      full: {
        about: profile.about || "",
        skills: profile.skills || [],
        achievements: profile.achievements || [],
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        twitter: profile.twitter || "",
        portfolio: profile.portfolio || "",
        experience: profile.experience || [],
        education: profile.education || [],
        location: profile.location || "",
        branch: profile.branch || "",
      },
    };

    setFormData(formDataMap[section] || {});
    setEditModal({ isOpen: true, section });
  };

  const handlePhotoUpload = async (file: File): Promise<void> => {
    try {
      setUploadingPhoto(true);
      const token = getAuthToken();

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const formData = new FormData();
      formData.append("profilePhoto", file);

      const response = await fetch(`${API_BASE_URL}/alumni/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Upload successful:", result);

        // Update userData immediately with the new photo URL
        if (userData && result.imageUrl) {
          setUserData({
            ...userData,
            profilePhoto: result.imageUrl,
          });
        }

        setShowPhotoModal(false);
        setPhotoFile(null);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = (): void => {
    updateProfile(formData);
  };

  const addSkill = (): void => {
    if (tempSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), tempSkill.trim()],
      });
      setTempSkill("");
    }
  };

  const removeSkill = (index: number): void => {
    setFormData({
      ...formData,
      skills: (formData.skills || []).filter((_, i) => i !== index),
    });
  };

  const addAchievement = (): void => {
    if (tempAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [
          ...(formData.achievements || []),
          tempAchievement.trim(),
        ],
      });
      setTempAchievement("");
    }
  };

  const removeAchievement = (index: number): void => {
    setFormData({
      ...formData,
      achievements: (formData.achievements || []).filter((_, i) => i !== index),
    });
  };

  const addArrayItem = (field: "experience" | "education"): void => {
    if (field === "experience") {
      setFormData({
        ...formData,
        experience: [
          ...(formData.experience || []),
          {
            designation: "",
            company: "",
            from: "",
            to: null,
            current: false,
            location: "",
            description: "",
          },
        ],
      });
    } else if (field === "education") {
      setFormData({
        ...formData,
        education: [
          ...(formData.education || []),
          { type: "", stream: "", institution: "", from: "", to: "", gpa: "" },
        ],
      });
    }
  };

  const removeArrayItem = (
    field: "experience" | "education",
    index: number
  ): void => {
    const currentArray = formData[field];
    if (!currentArray) return;

    setFormData({
      ...formData,
      [field]: currentArray.filter((_: any, i: number) => i !== index),
    });
  };

  const updateArrayItem = (
    field: "experience" | "education",
    index: number,
    key: string,
    value: any
  ): void => {
    const currentArray = formData[field];
    if (!currentArray || index >= currentArray.length) return;

    const updated = [...currentArray];
    updated[index] = { ...updated[index], [key]: value };
    setFormData({ ...formData, [field]: updated });
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const renderPhotoUploadModal = () => {
    if (!showPhotoModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl transform transition-all ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
              : "bg-gradient-to-br from-white via-blue-50 to-indigo-50"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Update Profile Photo
            </h2>
            <button
              onClick={() => {
                setShowPhotoModal(false);
                setPhotoFile(null);
              }}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-200"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {photoFile ? (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(photoFile)}
                  alt="Preview"
                  className="w-40 h-40 mx-auto rounded-2xl object-cover border-4 border-blue-500/30 shadow-xl"
                />
                <p
                  className={`mt-3 text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {photoFile.name}
                </p>
              </div>
            ) : (
              <label
                className={`block w-full p-12 border-3 border-dashed rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                  isDarkMode
                    ? "border-blue-500/50 bg-blue-900/20 hover:bg-blue-900/40"
                    : "border-blue-400 bg-blue-50 hover:bg-blue-100"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPhotoFile(file);
                  }}
                  className="hidden"
                />
                <div className="text-center">
                  <User
                    className={`w-16 h-16 mx-auto mb-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <p
                    className={`font-medium ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Click to upload photo
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </label>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoFile(null);
                }}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  isDarkMode
                    ? "bg-slate-800 hover:bg-slate-700"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => photoFile && handlePhotoUpload(photoFile)}
                disabled={!photoFile || uploadingPhoto}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  photoFile && !uploadingPhoto
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                {uploadingPhoto ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    if (!editModal.isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div
          className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6 ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900 to-blue-900"
              : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Edit{" "}
              {editModal.section === "full"
                ? "Profile"
                : editModal.section
                ? editModal.section.charAt(0).toUpperCase() +
                  editModal.section.slice(1)
                : ""}
            </h2>
            <button
              onClick={() => setEditModal({ isOpen: false, section: null })}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-200"
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {editModal.section === "about" && (
              <textarea
                value={formData.about || ""}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                className={`w-full p-3 rounded-lg min-h-[150px] ${
                  isDarkMode
                    ? "bg-slate-800 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
                placeholder="Tell us about yourself..."
              />
            )}

            {editModal.section === "skills" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill"
                    value={tempSkill}
                    onChange={(e) => setTempSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    className={`flex-1 p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-slate-800 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.skills || []).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white flex items-center gap-2"
                    >
                      {skill}
                      <button onClick={() => removeSkill(idx)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {editModal.section === "achievements" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add achievement"
                    value={tempAchievement}
                    onChange={(e) => setTempAchievement(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAchievement()}
                    className={`flex-1 p-3 rounded-lg ${
                      isDarkMode
                        ? "bg-slate-800 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  />
                  <button
                    onClick={addAchievement}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.achievements || []).map(
                    (achievement: string, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg flex justify-between items-center ${
                          isDarkMode ? "bg-slate-800" : "bg-gray-100"
                        }`}
                      >
                        {achievement}
                        <button onClick={() => removeAchievement(idx)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {editModal.section === "social" && (
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={formData.linkedin || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                  className={`p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={formData.github || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                  className={`p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Twitter Handle"
                  value={formData.twitter || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter: e.target.value })
                  }
                  className={`p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Portfolio URL"
                  value={formData.portfolio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, portfolio: e.target.value })
                  }
                  className={`p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                />
              </div>
            )}

            {editModal.section === "location" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className={`p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Branch"
                  value={formData.branch || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className={`p-3 rounded-lg ${
                    isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                />
              </div>
            )}

            {editModal.section === "full" && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Location"
                      value={formData.location || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-800 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Branch"
                      value={formData.branch || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, branch: e.target.value })
                      }
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-800 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    />
                  </div>
                  <textarea
                    value={formData.about || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, about: e.target.value })
                    }
                    className={`w-full p-3 rounded-lg min-h-[100px] ${
                      isDarkMode
                        ? "bg-slate-800 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                    placeholder="About yourself..."
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add skill"
                      value={tempSkill}
                      onChange={(e) => setTempSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      className={`flex-1 p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-800 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    />
                    <button
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.skills || []).map(
                      (skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white flex items-center gap-2"
                        >
                          {skill}
                          <button onClick={() => removeSkill(idx)}>
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Achievements</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add achievement"
                      value={tempAchievement}
                      onChange={(e) => setTempAchievement(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addAchievement()}
                      className={`flex-1 p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-800 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    />
                    <button
                      onClick={addAchievement}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(formData.achievements || []).map(
                      (achievement: string, idx: number) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg flex justify-between items-center ${
                            isDarkMode ? "bg-slate-800" : "bg-gray-100"
                          }`}
                        >
                          {achievement}
                          <button onClick={() => removeAchievement(idx)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      value={formData.linkedin || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-800 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="GitHub URL"
                      value={formData.github || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, github: e.target.value })
                      }
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-800 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Twitter Handle"
                      value={formData.twitter || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter: e.target.value })
                      }
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-800 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Portfolio URL"
                      value={formData.portfolio || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, portfolio: e.target.value })
                      }
                      className={`p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-800 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Experience</h3>
                    <button
                      onClick={() => addArrayItem("experience")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(formData.experience || []).map(
                      (exp: Experience, idx: number) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border-2 ${
                            isDarkMode
                              ? "border-blue-600/30"
                              : "border-blue-300"
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Designation"
                              value={exp.designation}
                              onChange={(e) =>
                                updateArrayItem(
                                  "experience",
                                  idx,
                                  "designation",
                                  e.target.value
                                )
                              }
                              className={`p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) =>
                                updateArrayItem(
                                  "experience",
                                  idx,
                                  "company",
                                  e.target.value
                                )
                              }
                              className={`p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                            <input
                              type="date"
                              placeholder="From"
                              value={exp.from}
                              onChange={(e) =>
                                updateArrayItem(
                                  "experience",
                                  idx,
                                  "from",
                                  e.target.value
                                )
                              }
                              className={`p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                            <input
                              type="date"
                              placeholder="To"
                              value={exp.to || ""}
                              onChange={(e) =>
                                updateArrayItem(
                                  "experience",
                                  idx,
                                  "to",
                                  e.target.value
                                )
                              }
                              className={`p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                              disabled={exp.current}
                            />
                            <input
                              type="text"
                              placeholder="Location"
                              value={exp.location}
                              onChange={(e) =>
                                updateArrayItem(
                                  "experience",
                                  idx,
                                  "location",
                                  e.target.value
                                )
                              }
                              className={`p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) =>
                                  updateArrayItem(
                                    "experience",
                                    idx,
                                    "current",
                                    e.target.checked
                                  )
                                }
                              />
                              Current Position
                            </label>
                            <textarea
                              placeholder="Description"
                              value={exp.description}
                              onChange={(e) =>
                                updateArrayItem(
                                  "experience",
                                  idx,
                                  "description",
                                  e.target.value
                                )
                              }
                              className={`col-span-2 p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                          </div>
                          <button
                            onClick={() => removeArrayItem("experience", idx)}
                            className="mt-2 text-red-500 text-sm flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <button
                      onClick={() => addArrayItem("education")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(formData.education || []).map(
                      (edu: Education, idx: number) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border-2 ${
                            isDarkMode
                              ? "border-green-600/30"
                              : "border-green-300"
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Type (Bachelor/Master)"
                              value={edu.type}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  idx,
                                  "type",
                                  e.target.value
                                )
                              }
                              className={`p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="Stream"
                              value={edu.stream}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  idx,
                                  "stream",
                                  e.target.value
                                )
                              }
                              className={`p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  idx,
                                  "institution",
                                  e.target.value
                                )
                              }
                              className={`col-span-2 p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                            <input
                              type="date"
                              placeholder="From"
                              value={edu.from}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  idx,
                                  "from",
                                  e.target.value
                                )
                              }
                              className={`p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                            <input
                              type="date"
                              placeholder="To"
                              value={edu.to}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  idx,
                                  "to",
                                  e.target.value
                                )
                              }
                              className={`p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="GPA"
                              value={edu.gpa}
                              onChange={(e) =>
                                updateArrayItem(
                                  "education",
                                  idx,
                                  "gpa",
                                  e.target.value
                                )
                              }
                              className={`col-span-2 p-2 rounded ${
                                isDarkMode ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            />
                          </div>
                          <button
                            onClick={() => removeArrayItem("education", idx)}
                            className="mt-2 text-red-500 text-sm flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setEditModal({ isOpen: false, section: null })}
              className={`flex-1 p-3 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading profile</div>
          <button
            onClick={fetchUserData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const profile = userData.profile || {};

  const safeDateParse = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div
              className={`p-6 rounded-2xl border-2 shadow-xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/20 border-blue-600/20"
                  : "bg-gradient-to-br from-white to-blue-50 border-blue-200"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  About
                </h3>
                <button
                  onClick={() => openEditModal("about")}
                  className="p-2 rounded-lg hover:bg-blue-900/50 transition-all"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                {profile.about ||
                  "No information provided. Click edit to add your bio."}
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border-2 shadow-xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-purple-900/20 border-purple-600/20"
                  : "bg-gradient-to-br from-white to-purple-50 border-purple-200"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Skills
                </h3>
                <button
                  onClick={() => openEditModal("skills")}
                  className="p-2 rounded-lg hover:bg-purple-900/50 transition-all"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(profile.skills || []).length > 0 ? (
                  (profile.skills || []).map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                        isDarkMode
                          ? "bg-indigo-900/50 text-indigo-300 border border-indigo-500/30"
                          : "bg-indigo-100 text-indigo-700 border border-indigo-300"
                      }`}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    No skills added yet. Click edit to add your skills.
                  </p>
                )}
              </div>
            </div>

            <div
              className={`p-6 rounded-2xl border-2 shadow-xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-amber-900/20 border-amber-600/20"
                  : "bg-gradient-to-br from-white to-amber-50 border-amber-200"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Achievements
                </h3>
                <button
                  onClick={() => openEditModal("achievements")}
                  className="p-2 rounded-lg hover:bg-amber-900/50 transition-all"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {(profile.achievements || []).length > 0 ? (
                  (profile.achievements || []).map(
                    (achievement: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Award
                          className={`w-5 h-5 mt-0.5 ${
                            isDarkMode ? "text-yellow-500" : "text-yellow-600"
                          }`}
                        />
                        <span
                          className={
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          {achievement}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    No achievements added yet. Click edit to add your
                    achievements.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            {(profile.experience || []).length > 0 ? (
              (profile.experience || []).map((exp: Experience, idx: number) => {
                const fromDate = safeDateParse(exp.from);
                const toDate = safeDateParse(exp.to);

                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                      isDarkMode
                        ? "bg-slate-800/50 border-blue-600/30"
                        : "bg-white border-blue-200 shadow-lg"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-blue-900/50" : "bg-blue-100"
                        }`}
                      >
                        <Building
                          className={`w-6 h-6 ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`text-lg font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {exp.designation}
                        </h4>
                        <p
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          {exp.company}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                          <span
                            className={`flex items-center gap-1 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            {fromDate
                              ? fromDate.toLocaleDateString()
                              : "N/A"} -{" "}
                            {exp.current
                              ? "Present"
                              : toDate
                              ? toDate.toLocaleDateString()
                              : "N/A"}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </span>
                        </div>
                        <p
                          className={`mt-3 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className={`p-12 rounded-xl border-2 text-center ${
                  isDarkMode
                    ? "bg-slate-800/50 border-blue-600/30"
                    : "bg-white border-blue-200"
                }`}
              >
                <Briefcase
                  className={`w-16 h-16 mx-auto mb-4 ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  No experience added yet. Click the edit button to add your
                  work experience.
                </p>
                <button
                  onClick={() => openEditModal("full")}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Experience
                </button>
              </div>
            )}
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            {(profile.education || []).length > 0 ? (
              (profile.education || []).map((edu: Education, idx: number) => {
                const fromDate = safeDateParse(edu.from);
                const toDate = safeDateParse(edu.to);

                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                      isDarkMode
                        ? "bg-slate-800/50 border-emerald-600/30"
                        : "bg-white border-emerald-200 shadow-lg"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-emerald-900/50" : "bg-emerald-100"
                        }`}
                      >
                        <GraduationCap
                          className={`w-6 h-6 ${
                            isDarkMode ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`text-lg font-bold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {edu.type}
                        </h4>
                        <p
                          className={`text-sm font-medium ${
                            isDarkMode ? "text-emerald-400" : "text-emerald-600"
                          }`}
                        >
                          {edu.stream}
                        </p>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {edu.institution}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
                          <span
                            className={`flex items-center gap-1 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            {fromDate
                              ? fromDate.toLocaleDateString()
                              : "N/A"} -{" "}
                            {toDate ? toDate.toLocaleDateString() : "N/A"}
                          </span>
                          <span
                            className={`${
                              isDarkMode ? "text-green-400" : "text-green-600"
                            } font-medium`}
                          >
                            GPA: {edu.gpa || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className={`p-12 rounded-xl border-2 text-center ${
                  isDarkMode
                    ? "bg-slate-800/50 border-emerald-600/30"
                    : "bg-white border-emerald-200"
                }`}
              >
                <GraduationCap
                  className={`w-16 h-16 mx-auto mb-4 ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                  No education added yet. Click the edit button to add your
                  educational background.
                </p>
                <button
                  onClick={() => openEditModal("full")}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Education
                </button>
              </div>
            )}
          </div>
        );
      case "resume":
        console.log("🎯 Rendering resume section");
        console.log("📄 Current resume in userData:", userData?.resume);
        console.log("📄 Current resume in profile:", userData?.profile?.resume);

        // Check both possible locations for the resume
        const resumeUrl = userData?.resume || userData?.profile?.resume;

        return (
          <div className="space-y-6">
            {/* Resume Header Card */}
            <div
              className={`p-6 rounded-2xl border-2 shadow-xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-green-900/20 border-green-600/20"
                  : "bg-gradient-to-br from-white to-green-50 border-green-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isDarkMode ? "bg-green-900/50" : "bg-green-100"
                    }`}
                  >
                    <FileText
                      className={`w-8 h-8 ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      Your Resume
                    </h2>
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Manage and share your professional resume
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowResumeModal(true)}
                  className={`px-6 py-3 rounded-xl font-medium border-2 transition-all hover:scale-105 flex items-center gap-3 ${
                    resumeUrl
                      ? isDarkMode
                        ? "border-yellow-600/30 text-yellow-300 hover:bg-yellow-900/20"
                        : "border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                      : isDarkMode
                      ? "border-green-600/30 text-green-300 hover:bg-green-900/20"
                      : "border-green-400 text-green-600 hover:bg-green-50"
                  }`}
                >
                  {resumeUrl ? (
                    <>
                      <Edit className="w-5 h-5" />
                      Update Resume
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Upload Resume
                    </>
                  )}
                </button>
              </div>
            </div>

            {resumeUrl ? (
              <div className="space-y-6">
                {/* Resume Preview Section */}
                <div
                  className={`rounded-2xl border-2 overflow-hidden shadow-xl ${
                    isDarkMode
                      ? "bg-slate-900/80 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* Preview Header */}
                  <div
                    className={`p-4 border-b ${
                      isDarkMode
                        ? "border-gray-700 bg-slate-800"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <FileText
                          className={`w-6 h-6 ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                        />
                        <h3 className="text-lg font-semibold">
                          Resume Preview
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isDarkMode
                              ? "bg-green-900/50 text-green-300"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          PDF Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PDF Viewer */}
                  <div className="p-4">
                    <div
                      className={`rounded-xl border-2 overflow-hidden ${
                        isDarkMode
                          ? "border-gray-700 bg-gray-800"
                          : "border-gray-300 bg-gray-100"
                      }`}
                    >
                      <div className="h-96 sm:h-[500px] w-full">
                        <iframe
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(
                            resumeUrl
                          )}&embedded=true`}
                          className="w-full h-full border-0"
                          title="Resume Preview"
                          onError={(e) => {
                            console.error("PDF iframe error:", e);
                            // Fallback to direct PDF
                            (e.target as HTMLIFrameElement).src = resumeUrl;
                          }}
                        />
                      </div>
                    </div>

                    {/* Viewer Options */}
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Having trouble viewing? Try:
                      </span>
                      <div className="flex gap-2 flex-wrap justify-center">
                        <a
                          href={`https://docs.google.com/gview?url=${encodeURIComponent(
                            resumeUrl
                          )}&embedded=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs px-3 py-1 rounded-lg transition-all hover:scale-105 ${
                            isDarkMode
                              ? "bg-blue-800 text-blue-200 hover:bg-blue-700"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          Google Viewer
                        </a>
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs px-3 py-1 rounded-lg transition-all hover:scale-105 ${
                            isDarkMode
                              ? "bg-purple-800 text-purple-200 hover:bg-purple-700"
                              : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                          }`}
                        >
                          Direct View
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Download Card */}
                  <div
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer ${
                      isDarkMode
                        ? "bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-600/30 hover:border-blue-500"
                        : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-400"
                    }`}
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = resumeUrl;
                      link.download =
                        `${userData?.name?.replace(/\s+/g, "_")}_Resume.pdf` ||
                        "resume.pdf";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-blue-900/50" : "bg-blue-100"
                        }`}
                      >
                        <FileText
                          className={`w-6 h-6 ${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">Download</h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Save to device
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* View in New Tab Card */}
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer block ${
                      isDarkMode
                        ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-600/30 hover:border-green-500"
                        : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-green-900/50" : "bg-green-100"
                        }`}
                      >
                        <ExternalLink
                          className={`w-6 h-6 ${
                            isDarkMode ? "text-green-400" : "text-green-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">Open</h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          View in new tab
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Share Card */}
                  <div
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer ${
                      isDarkMode
                        ? "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-600/30 hover:border-purple-500"
                        : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-400"
                    }`}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(resumeUrl);
                        alert("Resume link copied to clipboard!");
                      } catch (err) {
                        // Fallback for older browsers
                        const textArea = document.createElement("textarea");
                        textArea.value = resumeUrl;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textArea);
                        alert("Resume link copied to clipboard!");
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-purple-900/50" : "bg-purple-100"
                        }`}
                      >
                        <Share2
                          className={`w-6 h-6 ${
                            isDarkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">Share</h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Copy link
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Update Card */}
                  <div
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer ${
                      isDarkMode
                        ? "bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-600/30 hover:border-yellow-500"
                        : "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-400"
                    }`}
                    onClick={() => setShowResumeModal(true)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-yellow-900/50" : "bg-yellow-100"
                        }`}
                      >
                        <Edit
                          className={`w-6 h-6 ${
                            isDarkMode ? "text-yellow-400" : "text-yellow-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">Update</h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Upload new version
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div
                className={`p-12 rounded-2xl border-2 text-center ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900/50 to-green-900/20 border-green-600/30"
                    : "bg-gradient-to-br from-white to-green-50 border-green-200"
                }`}
              >
                <FileText
                  className={`w-24 h-24 mx-auto mb-6 ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  No Resume Uploaded Yet
                </h3>
                <p
                  className={`text-lg mb-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Upload your resume to showcase your experience and skills
                </p>
                <p
                  className={`text-sm mb-8 ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Supported format: PDF • Maximum size: 10MB
                </p>
                <button
                  onClick={() => setShowResumeModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto shadow-lg"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-lg font-semibold">
                    Upload Your Resume
                  </span>
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      {renderPhotoUploadModal()}
      {renderEditModal()}
      {renderResumeUploadModal()}

      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Banner */}
      <div
        className={`relative h-48 ${
          isDarkMode
            ? "bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900"
            : "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400"
        }`}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-10 lg:px-16 -mt-20 relative z-10 pb-12">
        <div
          className={`rounded-2xl border-2 p-6 shadow-2xl ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900/95 to-blue-900/30 border-blue-600/20"
              : "bg-gradient-to-br from-white to-blue-50 border-blue-200"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <img
                src={
                  userData.profilePhoto ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
                }
                alt={userData.name}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl object-cover"
              />
              <button
                onClick={() => setShowPhotoModal(true)}
                className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <Edit className="w-6 h-6 text-white" />
              </button>
              {userData.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {userData.name}
                  </h1>
                  <p
                    className={`text-lg ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {profile.branch || "Not specified"}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
                    <span
                      className={`flex items-center gap-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      {userData.email}
                    </span>

                    {profile.location && (
                      <span
                        className={`flex items-center gap-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal("full")}
                    className={`px-4 py-2 rounded-lg font-medium border-2 transition-all hover:scale-105 flex items-center gap-2 ${
                      isDarkMode
                        ? "border-blue-600/30 text-blue-300 hover:bg-blue-900/50"
                        : "border-blue-300 text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium border-2 transition-all hover:scale-105 ${
                      isDarkMode
                        ? "border-purple-600/30 text-purple-300 hover:bg-purple-900/50"
                        : "border-purple-300 text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-4 flex-wrap">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                      isDarkMode
                        ? "bg-blue-900/50 text-blue-300 border border-blue-500/30"
                        : "bg-blue-100 text-blue-700 border border-blue-300"
                    }`}
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300 border border-gray-600"
                        : "bg-gray-200 text-gray-700 border border-gray-300"
                    }`}
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                      isDarkMode
                        ? "bg-sky-900/50 text-sky-300 border border-sky-500/30"
                        : "bg-sky-100 text-sky-700 border border-sky-300"
                    }`}
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="text-sm">Twitter</span>
                  </a>
                )}
                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                      isDarkMode
                        ? "bg-purple-900/50 text-purple-300 border border-purple-500/30"
                        : "bg-purple-100 text-purple-700 border border-purple-300"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Portfolio</span>
                  </a>
                )}
                {!profile.linkedin &&
                  !profile.github &&
                  !profile.twitter &&
                  !profile.portfolio && (
                    <button
                      onClick={() => openEditModal("social")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 ${
                        isDarkMode
                          ? "bg-indigo-900/50 text-indigo-300 border border-indigo-500/30"
                          : "bg-indigo-100 text-indigo-700 border border-indigo-300"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add Social Links</span>
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`mt-6 rounded-2xl border-2 shadow-xl ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
              : "bg-gradient-to-br from-white to-blue-50 border-blue-200"
          }`}
        >
          <div className="flex overflow-x-auto">
            {[
              { id: "overview", icon: FileText, label: "Overview" },
              { id: "experience", icon: Briefcase, label: "Experience" },
              { id: "education", icon: GraduationCap, label: "Education" },
              { id: "resume", icon: FileText, label: "Resume" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap border-b-2 ${
                  activeSection === tab.id
                    ? isDarkMode
                      ? "text-blue-400 border-blue-400 bg-blue-900/20"
                      : "text-blue-600 border-blue-600 bg-blue-100"
                    : isDarkMode
                    ? "text-gray-400 border-transparent hover:text-gray-300 hover:bg-gray-700/50"
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">{renderContent()}</div>
      </div>

      {<Footer isDarkMode={isDarkMode} />}
    </div>
  );
}
