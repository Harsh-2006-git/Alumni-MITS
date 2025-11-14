import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

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
      isAutoPosted: false, // Important: Set to false for manual posts
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

export default PostJobDialog;
