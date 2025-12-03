import React, { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Calendar,
  Briefcase,
  Target,
  X,
  Save,
  MapPin,
  DollarSign,
  CheckCircle,
  Users,
  Mail,
  Phone,
  Clock,
  Download,
  Sparkles,
  Trophy,
  Heart,
  Star,
  Building2,
  Award,
  Zap,
  Loader,
  Image as ImageIcon,
  Globe,
  Tag,
  User,
  BriefcaseIcon,
  TrendingUp,
  Link,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

// Separate Edit Event Modal Component
const EditEventModal = ({ event, onClose, onSave, isDarkMode }) => {
  const [formData, setFormData] = useState(event);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div
        className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all ${
          isDarkMode
            ? "bg-slate-900 border border-slate-700"
            : "bg-white border border-gray-100"
        }`}
      >
        <div
          className={`sticky top-0 border-b px-6 py-5 flex justify-between items-center backdrop-blur-sm ${
            isDarkMode
              ? "bg-slate-900/95 border-slate-700"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-semibold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Edit Event
            </h2>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Update event details and information
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2.5 rounded-xl transition-all hover:rotate-90 ${
              isDarkMode
                ? "hover:bg-slate-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="p-6 space-y-5">
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Event Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter event title"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your event"
                className={`w-full px-4 py-3 rounded-xl border-2 h-28 resize-none transition-all focus:ring-4 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <Calendar size={16} />
                  Event Date
                </label>
                <input
                  type="date"
                  value={formData.date ? formData.date.split("T")[0] : ""}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <MapPin size={16} />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Event location"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <DollarSign size={16} />
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleChange("price", Number(e.target.value))
                  }
                  placeholder="0"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <Users size={16} />
                  Max Attendees
                </label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) =>
                    handleChange("maxAttendees", Number(e.target.value))
                  }
                  placeholder="100"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Organizer
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => handleChange("organizer", e.target.value)}
                placeholder="Organizer name"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                >
                  <option value="educational">Educational</option>
                  <option value="networking">Networking</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Event Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                >
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Image URL
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => handleChange("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => onSave(formData)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Save size={18} /> Save Changes
              </button>
              <button
                onClick={onClose}
                className={`px-6 py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.02] ${
                  isDarkMode
                    ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate Edit Job Modal Component
const EditJobModal = ({ job, onClose, onSave, isDarkMode }) => {
  const [formData, setFormData] = useState(job);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div
        className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all ${
          isDarkMode
            ? "bg-slate-900 border border-slate-700"
            : "bg-white border border-gray-100"
        }`}
      >
        <div
          className={`sticky top-0 border-b px-6 py-5 flex justify-between items-center backdrop-blur-sm ${
            isDarkMode
              ? "bg-slate-900/95 border-slate-700"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-semibold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Edit Job Posting
            </h2>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Update job listing information
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2.5 rounded-xl transition-all hover:rotate-90 ${
              isDarkMode
                ? "hover:bg-slate-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="p-6 space-y-5">
            <div>
              <label
                className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <Briefcase size={16} />
                Job Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter job title"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <Building2 size={16} />
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Company name"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Company Logo URL
                </label>
                <input
                  type="text"
                  value={formData.companyLogo}
                  onChange={(e) => handleChange("companyLogo", e.target.value)}
                  placeholder="Logo URL"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Job Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <MapPin size={16} />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Job location"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <DollarSign size={16} />
                  Salary Range
                </label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleChange("salary", e.target.value)}
                  placeholder="$50k - $80k"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <Clock size={16} />
                  Experience Required
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  placeholder="2-5 years"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Job Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the role and responsibilities"
                className={`w-full px-4 py-3 rounded-xl border-2 h-28 resize-none transition-all focus:ring-4 focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="e.g., Engineering"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Company Website
                </label>
                <input
                  type="text"
                  value={formData.companyWebsite}
                  onChange={(e) =>
                    handleChange("companyWebsite", e.target.value)
                  }
                  placeholder="https://company.com"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={
                    formData.applicationDeadline
                      ? formData.applicationDeadline.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleChange("applicationDeadline", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Closed Date
                </label>
                <input
                  type="date"
                  value={
                    formData.closedDate ? formData.closedDate.split("T")[0] : ""
                  }
                  onChange={(e) => handleChange("closedDate", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:ring-4 focus:outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-750"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.verified || false}
                  onChange={(e) => handleChange("verified", e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex items-center gap-2">
                  <CheckCircle
                    size={18}
                    className={
                      formData.verified
                        ? "text-green-500"
                        : isDarkMode
                        ? "text-gray-500"
                        : "text-gray-400"
                    }
                  />
                  <span
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Verified Job Posting
                  </span>
                </div>
              </label>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => onSave(formData)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Save size={18} /> Save Changes
              </button>
              <button
                onClick={onClose}
                className={`px-6 py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.02] ${
                  isDarkMode
                    ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyActivityPage = ({ isDarkMode, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState({
    events: false,
    jobs: false,
    campaigns: false,
    all: true,
  });
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [hasFetched, setHasFetched] = useState({
    events: false,
    jobs: false,
    campaigns: false,
  });

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const token = getAuthToken();
    if (!token) return;

    setLoading((prev) => ({ ...prev, all: true }));

    try {
      // Fetch events
      const eventsPromise = fetch(
        "https://alumni-mits-backend.onrender.com/event/my-events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      // Fetch jobs
      const jobsPromise = fetch(
        "https://alumni-mits-backend.onrender.com/job/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      // Fetch campaigns
      const campaignsPromise = fetch(
        "https://alumni-mits-backend.onrender.com/campaign/get-my-campaigns",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      const [eventsData, jobsData, campaignsData] = await Promise.allSettled([
        eventsPromise,
        jobsPromise,
        campaignsPromise,
      ]);

      if (eventsData.status === "fulfilled") {
        setEvents(eventsData.value.events || []);
        setHasFetched((prev) => ({ ...prev, events: true }));
      }

      if (jobsData.status === "fulfilled") {
        setJobs(jobsData.value.data || []);
        setHasFetched((prev) => ({ ...prev, jobs: true }));
      }

      if (campaignsData.status === "fulfilled") {
        setCampaigns(campaignsData.value.campaigns || []);
        setHasFetched((prev) => ({ ...prev, campaigns: true }));
      }
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, all: false }));
    }
  };

  const fetchSingleSection = async (section) => {
    if (hasFetched[section]) return;

    setLoading((prev) => ({ ...prev, [section]: true }));
    const token = getAuthToken();

    try {
      let url, dataKey;
      switch (section) {
        case "events":
          url = "https://alumni-mits-backend.onrender.com/event/my-events";
          dataKey = "events";
          break;
        case "jobs":
          url = "https://alumni-mits-backend.onrender.com/job/my-jobs";
          dataKey = "data";
          break;
        case "campaigns":
          url =
            "https://alumni-mits-backend.onrender.com/campaign/get-my-campaigns";
          dataKey = "campaigns";
          break;
        default:
          return;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      switch (section) {
        case "events":
          setEvents(data[dataKey] || []);
          break;
        case "jobs":
          setJobs(data[dataKey] || []);
          break;
        case "campaigns":
          setCampaigns(data[dataKey] || []);
          break;
      }

      setHasFetched((prev) => ({ ...prev, [section]: true }));
    } catch (error) {
      console.error(`Error fetching ${section}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (!hasFetched[tab]) {
      fetchSingleSection(tab);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const token = getAuthToken();
    const endpoints = {
      events: `https://alumni-mits-backend.onrender.com/event/delete/${id}`,
      jobs: `https://alumni-mits-backend.onrender.com/job/delete/${id}`,
      campaigns: `https://alumni-mits-backend.onrender.com/campaign/delete/${id}`,
    };

    try {
      const res = await fetch(endpoints[type], {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Deleted successfully!");
        // Refresh the specific section
        fetchSingleSection(type);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete");
    }
  };

  const handleUpdateEvent = async (formData) => {
    const token = getAuthToken();
    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      price: formData.price,
      organizer: formData.organizer,
      category: formData.category,
      type: formData.type,
      maxAttendees: formData.maxAttendees,
      image: formData.image,
    };

    try {
      const res = await fetch(
        `https://alumni-mits-backend.onrender.com/event/update/${formData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert("Updated successfully!");
        setEditingEvent(null);
        fetchSingleSection("events");
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update");
    }
  };

  const handleUpdateJob = async (formData) => {
    const token = getAuthToken();
    const payload = {
      title: formData.title,
      company: formData.company,
      companyLogo: formData.companyLogo,
      type: formData.type,
      location: formData.location,
      salary: formData.salary,
      experience: formData.experience,
      applicationDeadline: formData.applicationDeadline,
      closedDate: formData.closedDate,
      verified: formData.verified,
      description: formData.description,
      requiredSkills: formData.requiredSkills,
      qualifications: formData.qualifications,
      companyWebsite: formData.companyWebsite,
      category: formData.category,
      status: formData.status,
    };

    try {
      const res = await fetch(
        `https://alumni-mits-backend.onrender.com/job/update/${formData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert("Updated successfully!");
        setEditingJob(null);
        fetchSingleSection("jobs");
      }
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update");
    }
  };

  const fetchRegistrations = async (eventId) => {
    setLoadingRegistrations(true);
    setShowRegistrationsModal(true);
    const token = getAuthToken();

    try {
      const res = await fetch(
        `https://alumni-mits-backend.onrender.com/event/event-registrations/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setRegistrations(data.registrations || data.data || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const downloadExcel = (eventId, eventTitle) => {
    const token = getAuthToken();
    fetch(
      `https://alumni-mits-backend.onrender.com/event/download-registrations/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${eventTitle.replace(/\s+/g, "_")}_registrations.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert("Excel file downloaded successfully!");
      })
      .catch((error) => {
        console.error("Error downloading Excel:", error);
        alert("Failed to download Excel file");
      });
  };

  const EventCard = ({ event }) => (
    <div
      className={`rounded-xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-blue-500/50"
          : "bg-white border border-gray-200 hover:border-blue-300 shadow-lg"
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <img
          src={event.image}
          alt={event.title}
          className="w-full lg:w-48 h-48 object-cover rounded-xl shadow-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3 sm:mb-4 gap-3">
            <div className="min-w-0 flex-1">
              <h3
                className={`text-lg sm:text-xl font-bold mb-2 truncate ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {event.title}
              </h3>
              <p
                className={`text-xs sm:text-sm mb-3 line-clamp-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {event.description}
              </p>
            </div>
            <div className="flex gap-2 self-start lg:self-auto">
              <button
                onClick={() => fetchRegistrations(event.id)}
                className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex-shrink-0"
                title="View Registrations"
              >
                <Users size={16} className="sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => setEditingEvent(event)}
                className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex-shrink-0"
              >
                <Edit2 size={16} className="sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => handleDelete(event.id, "events")}
                className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg flex-shrink-0"
              >
                <Trash2 size={16} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs sm:text-sm mb-3 sm:mb-4">
            <span
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full ${
                isDarkMode
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              <Calendar size={14} className="flex-shrink-0" />
              <span className="truncate">
                {new Date(event.date).toLocaleDateString()}
              </span>
            </span>
            <span
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full ${
                isDarkMode
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              📍 <span className="truncate">{event.location}</span>
            </span>
            <span
              className={`px-2 sm:px-3 py-1 rounded-full ${
                isDarkMode
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "bg-cyan-100 text-cyan-700"
              }`}
            >
              {event.category}
            </span>
          </div>

          <div
            className={`flex flex-col xs:flex-row xs:items-center gap-2 text-xs sm:text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span className="font-semibold text-sm sm:text-lg bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              ₹{event.price}
            </span>
            <span className="hidden xs:block">•</span>
            <span>{event.maxAttendees} seats available</span>
            <span className="hidden xs:block">•</span>
            <span className="truncate">Organized by {event.organizer}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const JobCard = ({ job }) => (
    <div
      className={`rounded-xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-green-500/50"
          : "bg-white border border-gray-200 hover:border-green-300 shadow-lg"
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <img
            src={job.companyLogo}
            alt={job.company}
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl shadow-lg flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3
              className={`text-lg sm:text-xl font-bold mb-1 truncate ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {job.title}
            </h3>
            <p
              className={`font-semibold mb-2 text-sm sm:text-base ${
                isDarkMode ? "text-cyan-400" : "text-cyan-600"
              }`}
            >
              {job.company}
            </p>
            <p
              className={`text-xs sm:text-sm mb-3 line-clamp-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {job.description}
            </p>
          </div>
        </div>

        <div className="flex lg:flex-col gap-2 lg:ml-auto self-start">
          <button
            onClick={() => setEditingJob(job)}
            className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg flex-shrink-0"
          >
            <Edit2 size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => handleDelete(job.id, "jobs")}
            className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg flex-shrink-0"
          >
            <Trash2 size={16} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs sm:text-sm mt-3 sm:mt-4 mb-3">
        <span
          className={`px-2 sm:px-3 py-1 rounded-full ${
            isDarkMode
              ? "bg-green-500/20 text-green-300"
              : "bg-green-100 text-green-700"
          }`}
        >
          {job.type}
        </span>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full ${
            isDarkMode
              ? "bg-purple-500/20 text-purple-300"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          📍 <span className="truncate">{job.location}</span>
        </span>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full ${
            isDarkMode
              ? "bg-amber-500/20 text-amber-300"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          💰 <span className="truncate">{job.salary}</span>
        </span>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full ${
            isDarkMode
              ? "bg-blue-500/20 text-blue-300"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          📅 <span className="truncate">{job.experience}</span>
        </span>
      </div>

      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
          {job.requiredSkills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded-lg text-xs ${
                isDarkMode
                  ? "bg-slate-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span
              className={`px-2 py-1 rounded-lg text-xs ${
                isDarkMode
                  ? "bg-slate-700 text-gray-400"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );

  const CampaignCard = ({ campaign }) => (
    <div
      className={`rounded-xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-purple-500/50"
          : "bg-white border border-gray-200 hover:border-purple-300 shadow-lg"
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <img
          src={campaign.images?.[0]}
          alt={campaign.campaignTitle}
          className="w-full lg:w-48 h-48 object-cover rounded-xl shadow-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3 sm:mb-4 gap-3">
            <div className="min-w-0 flex-1">
              <h3
                className={`text-lg sm:text-xl font-bold mb-2 truncate ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {campaign.campaignTitle}
              </h3>
              <p
                className={`italic text-xs sm:text-sm mb-2 ${
                  isDarkMode ? "text-purple-300" : "text-purple-600"
                }`}
              >
                {campaign.tagline}
              </p>
              <p
                className={`text-xs sm:text-sm mb-3 line-clamp-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {campaign.detailedDescription}
              </p>
            </div>
            <div className="flex gap-2 self-start lg:self-auto">
              <button
                onClick={() => handleDelete(campaign.id, "campaigns")}
                className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg flex-shrink-0"
              >
                <Trash2 size={16} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <div className="flex justify-between text-xs sm:text-sm mb-2">
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Funding Progress
              </span>
              <span
                className={`font-semibold ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                ₹{parseFloat(campaign.currentAmount).toFixed(0)} / ₹
                {parseFloat(campaign.totalAmount).toFixed(0)}
              </span>
            </div>
            <div
              className={`w-full rounded-full h-2 sm:h-3 ${
                isDarkMode ? "bg-slate-700" : "bg-gray-200"
              }`}
            >
              <div
                className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 sm:h-3 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    (parseFloat(campaign.currentAmount) /
                      parseFloat(campaign.totalAmount)) *
                      100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            <span
              className={`px-2 sm:px-3 py-1 rounded-full ${
                isDarkMode
                  ? "bg-purple-500/20 text-purple-300"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {campaign.categories}
            </span>
            {campaign.isApproved && (
              <span
                className={`px-2 sm:px-3 py-1 rounded-full ${
                  isDarkMode
                    ? "bg-green-500/20 text-green-300"
                    : "bg-green-100 text-green-700"
                }`}
              >
                ✓ Approved
              </span>
            )}
            <span
              className={`px-2 sm:px-3 py-1 rounded-full ${
                isDarkMode
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "bg-cyan-100 text-cyan-700"
              }`}
            >
              {Math.round(
                (parseFloat(campaign.currentAmount) /
                  parseFloat(campaign.totalAmount)) *
                  100
              )}
              % Funded
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const HeroSection = () => (
    <section className="text-center py-12 sm:py-16 lg:py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
            My Activities
          </h1>
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </div>
        <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
          Manage Your Events, Jobs, and Campaigns
        </p>
        <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-8 sm:mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          <div
            className={`p-4 sm:p-6 lg:p-8 rounded-2xl border-2 transition-all hover:scale-105 ${
              isDarkMode
                ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-600/20"
                : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2 sm:mb-3">
              Events
            </h3>
            <p
              className={`text-xs sm:text-sm lg:text-base ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Create and manage events, track registrations, and engage with
              your audience
            </p>
          </div>

          <div
            className={`p-4 sm:p-6 lg:p-8 rounded-2xl border-2 transition-all hover:scale-105 ${
              isDarkMode
                ? "bg-gradient-to-br from-green-900/30 to-emerald-900/20 border-green-600/20"
                : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-2 sm:mb-3">
              Jobs
            </h3>
            <p
              className={`text-xs sm:text-sm lg:text-base ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Post career opportunities, manage applications, and connect with
              talent
            </p>
          </div>

          <div
            className={`p-4 sm:p-6 lg:p-8 rounded-2xl border-2 transition-all hover:scale-105 ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-900/30 to-violet-900/20 border-purple-600/20"
                : "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200"
            }`}
          >
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-purple-400 mb-2 sm:mb-3">
              Campaigns
            </h3>
            <p
              className={`text-xs sm:text-sm lg:text-base ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Launch fundraising campaigns, track progress, and make an impact
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const LoadingSpinner = ({ size = "large" }) => (
    <div className="flex justify-center items-center py-20">
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${
          size === "large" ? "h-16 w-16" : "h-8 w-8"
        }`}
      ></div>
    </div>
  );

  const renderContent = () => {
    if (loading.all) {
      return <LoadingSpinner />;
    }

    const sectionLoading = loading[activeTab];

    if (sectionLoading) {
      return <LoadingSpinner size="small" />;
    }

    const items = {
      events: events,
      jobs: jobs,
      campaigns: campaigns,
    };

    const currentItems = items[activeTab];

    if (!currentItems || currentItems.length === 0) {
      const emptyStates = {
        events: {
          icon: Calendar,
          text: "No events found",
          subtext: "Create your first event to get started",
        },
        jobs: {
          icon: Briefcase,
          text: "No jobs found",
          subtext: "Post your first job opportunity",
        },
        campaigns: {
          icon: Target,
          text: "No campaigns found",
          subtext: "Launch your first fundraising campaign",
        },
      };

      const EmptyIcon = emptyStates[activeTab].icon;

      return (
        <div
          className={`text-center py-20 rounded-2xl ${
            isDarkMode
              ? "bg-slate-800/50 text-gray-400"
              : "bg-white text-gray-500"
          }`}
        >
          <EmptyIcon size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-xl">{emptyStates[activeTab].text}</p>
          <p className="text-sm mt-2">{emptyStates[activeTab].subtext}</p>
        </div>
      );
    }

    switch (activeTab) {
      case "events":
        return events.map((event) => (
          <EventCard key={event.id} event={event} />
        ));
      case "jobs":
        return jobs.map((job) => <JobCard key={job.id} job={job} />);
      case "campaigns":
        return campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ));
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <HeroSection />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        <div
          className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 border-2 shadow-2xl mb-6 sm:mb-8 ${
            isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 backdrop-blur-sm border-blue-600/20"
              : "bg-gradient-to-br from-white to-blue-100/80 backdrop-blur-sm border-blue-200 shadow-xl"
          }`}
        >
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-center ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Manage Your Activities
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-12">
            <button
              onClick={() => handleTabChange("events")}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "events"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105"
                  : isDarkMode
                  ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow"
              }`}
            >
              <Calendar size={20} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span className="text-sm sm:text-base lg:text-lg">
                Events ({events.length})
              </span>
            </button>
            <button
              onClick={() => handleTabChange("jobs")}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "jobs"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                  : isDarkMode
                  ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow"
              }`}
            >
              <Briefcase size={20} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span className="text-sm sm:text-base lg:text-lg">
                Jobs ({jobs.length})
              </span>
            </button>
            <button
              onClick={() => handleTabChange("campaigns")}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "campaigns"
                  ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg scale-105"
                  : isDarkMode
                  ? "bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow"
              }`}
            >
              <Target size={20} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              <span className="text-sm sm:text-base lg:text-lg">
                Campaigns ({campaigns.length})
              </span>
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">{renderContent()}</div>
        </div>
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleUpdateEvent}
          isDarkMode={isDarkMode}
        />
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleUpdateJob}
          isDarkMode={isDarkMode}
        />
      )}

      {showRegistrationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div
            className={`rounded-xl sm:rounded-2xl max-w-4xl lg:max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                    <Users size={24} className="sm:w-7 sm:h-7" />
                    Event Registrations
                  </h2>
                  {!loadingRegistrations && (
                    <p className="text-green-100 mt-1 text-sm sm:text-base">
                      Total Registrations: {registrations.length}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 sm:gap-3">
                  {registrations.length > 0 && (
                    <button
                      onClick={() =>
                        downloadExcel(
                          registrations[0]?.eventId,
                          registrations[0]?.eventTitle
                        )
                      }
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold shadow-lg text-sm sm:text-base"
                    >
                      <Download size={16} className="sm:w-5 sm:h-5" />
                      Download Excel
                    </button>
                  )}
                  <button
                    onClick={() => setShowRegistrationsModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition"
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div
              className="p-4 sm:p-6 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 180px)" }}
            >
              {loadingRegistrations ? (
                <LoadingSpinner size="small" />
              ) : registrations.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                  {registrations.map((reg, index) => (
                    <div
                      key={index}
                      className={`rounded-xl p-4 sm:p-6 border-2 transition-all hover:scale-105 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 hover:border-green-400"
                          : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-green-300 shadow-lg"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg flex-shrink-0">
                            {(reg.name || reg.userName || "U")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3
                              className={`font-bold text-base sm:text-lg truncate ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {reg.name || reg.userName || "Unknown User"}
                            </h3>
                            {reg.userType && (
                              <span
                                className={`inline-block px-2 sm:px-3 py-1 text-xs font-semibold rounded-full mt-1 sm:mt-2 ${
                                  isDarkMode
                                    ? "bg-blue-500/20 text-blue-300"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {reg.userType}
                              </span>
                            )}
                          </div>
                        </div>
                        {reg.status && (
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
                              reg.status === "confirmed"
                                ? isDarkMode
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-green-100 text-green-700"
                                : reg.status === "pending"
                                ? isDarkMode
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-yellow-100 text-yellow-700"
                                : isDarkMode
                                ? "bg-gray-500/20 text-gray-300"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {reg.status.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div
                          className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                            isDarkMode ? "bg-slate-700/50" : "bg-gray-100"
                          }`}
                        >
                          <Mail
                            size={16}
                            className="text-green-500 flex-shrink-0 sm:w-4 sm:h-4"
                          />
                          <span
                            className={`text-xs sm:text-sm truncate ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {reg.email || reg.userEmail || "No email provided"}
                          </span>
                        </div>

                        {reg.phone && (
                          <div
                            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                              isDarkMode ? "bg-slate-700/50" : "bg-gray-100"
                            }`}
                          >
                            <Phone
                              size={16}
                              className="text-green-500 flex-shrink-0 sm:w-4 sm:h-4"
                            />
                            <span
                              className={`text-xs sm:text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {reg.phone}
                            </span>
                          </div>
                        )}

                        {reg.registeredAt && (
                          <div
                            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-t ${
                              isDarkMode
                                ? "border-slate-600"
                                : "border-gray-200"
                            }`}
                          >
                            <Clock
                              size={14}
                              className="text-gray-400 flex-shrink-0 sm:w-4 sm:h-4"
                            />
                            <span
                              className={`text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Registered on{" "}
                              {new Date(reg.registeredAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 sm:py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4">
                    <Users
                      size={32}
                      className="sm:w-10 sm:h-10 text-gray-400"
                    />
                  </div>
                  <p
                    className={`text-base sm:text-lg font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    No registrations yet
                  </p>
                  <p
                    className={`text-xs sm:text-sm mt-2 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Registrations will appear here once people sign up
                  </p>
                </div>
              )}
            </div>

            <div
              className={`border-t p-3 sm:p-4 flex justify-end ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <button
                onClick={() => setShowRegistrationsModal(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-xl hover:from-gray-700 hover:to-slate-800 transition font-semibold shadow-lg text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default MyActivityPage;
