import { useState, useEffect } from "react";
import {
  X,
  TrendingUp,
  Target,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Zap,
  GraduationCap,
  RefreshCw,
  User,
} from "lucide-react";

const SkillAnalysisPopup = ({ job, isOpen, onClose, isDarkMode }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && job) {
      fetchSkillAnalysis();
    }
  }, [isOpen, job]);

  const fetchSkillAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      const storedAuth = localStorage.getItem("auth");
      if (!storedAuth) {
        throw new Error("Please log in to use skill analysis");
      }

      const authData = JSON.parse(storedAuth);
      const token = authData.accessToken;

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Prepare the request payload
      const payload = {
        jobTitle: job.title,
        jobSkills: Array.isArray(job.requiredSkills)
          ? job.requiredSkills
          : job.requiredSkills.split(",").map((s) => s.trim()),
      };

      console.log("Sending skill analysis request:", payload);

      const response = await fetch(
        "https://alumni-mits-backend.onrender.com/alumni/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      // Check if response is OK
      if (!response.ok) {
        let errorMessage = "An error occurred";
        try {
          const errorData = await response.json();
          console.error("API Error Response:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          errorMessage = errorText;
        }

        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (response.status === 404) {
          throw new Error(
            errorMessage || "Please complete your profile first."
          );
        } else if (response.status === 500) {
          throw new Error("Server error occurred. Please try again later.");
        } else {
          throw new Error(`Error (${response.status}): ${errorMessage}`);
        }
      }

      const data = await response.json();
      console.log("Skill analysis response:", data);

      if (data.success) {
        setAnalysis(data.data);
      } else {
        throw new Error(data.message || "Failed to analyze skills");
      }
    } catch (err) {
      console.error("Skill analysis error:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (!score) return "text-gray-500";
    const scoreNum = parseInt(score.split("/")[0]);
    if (scoreNum >= 8) return "text-green-500";
    if (scoreNum >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score) => {
    if (!score) return "bg-gray-500/20 border-gray-500/30";
    const scoreNum = parseInt(score.split("/")[0]);
    if (scoreNum >= 8) return "bg-green-500/20 border-green-500/30";
    if (scoreNum >= 6) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
  };

  // Safe function to split skills
  const splitSkills = (skillsString) => {
    if (!skillsString || typeof skillsString !== "string") return [];
    return skillsString
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border transition-all ${
          isDarkMode
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200 shadow-2xl"
        }`}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 p-6 border-b backdrop-blur-sm"
          style={{
            background: isDarkMode
              ? "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.9) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Skill Match Analysis
                </h2>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {job.title} at {job.company}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-gray-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Analyzing your skills...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div
              className={`p-4 rounded-lg border ${
                isDarkMode
                  ? "bg-red-900/20 border-red-700/30"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className={isDarkMode ? "text-red-400" : "text-red-700"}>
                    Failed to analyze skills or Update your Profile first.
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-red-500" : "text-red-600"
                    }`}
                  >
                    {error}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={fetchSkillAnalysis}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isDarkMode
                          ? "bg-red-800 hover:bg-red-700 text-white"
                          : "bg-red-100 hover:bg-red-200 text-red-700"
                      }`}
                    >
                      Try Again
                    </button>
                    <button
                      onClick={onClose}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isDarkMode
                          ? "bg-slate-700 hover:bg-slate-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {analysis && !loading && !error && (
            <div className="space-y-6">
              {/* Score Card */}
              <div
                className={`p-6 rounded-xl border-2 ${getScoreBgColor(
                  analysis.analysis?.score
                )}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Your Match Score
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-4xl font-bold ${getScoreColor(
                          analysis.analysis?.score
                        )}`}
                      >
                        {analysis.analysis?.score?.split("/")[0] || "N/A"}
                      </span>
                      <span
                        className={`text-lg ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        /10
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      isDarkMode ? "bg-slate-800/50" : "bg-white/50"
                    }`}
                  >
                    <TrendingUp
                      className={`w-8 h-8 ${getScoreColor(
                        analysis.analysis?.score
                      )}`}
                    />
                  </div>
                </div>
              </div>

              {/* Job Overview */}
              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Job Overview
                  </h3>
                </div>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  {analysis.analysis?.jobOverview ||
                    "No job overview available."}
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Strong Matches */}
                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Strong Matches
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {splitSkills(analysis.analysis?.strongMatches).length >
                    0 ? (
                      splitSkills(analysis.analysis?.strongMatches).map(
                        (skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span
                              className={
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {skill}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <p
                        className={
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }
                      >
                        No strong matches found
                      </p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <h3
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Missing Skills
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {splitSkills(analysis.analysis?.missingSkills).length >
                    0 ? (
                      splitSkills(analysis.analysis?.missingSkills).map(
                        (skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span
                              className={
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {skill}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <p
                        className={
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }
                      >
                        No missing skills found
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* How to Cover Missing */}
              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    How to Cover Missing Skills
                  </h3>
                </div>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  {analysis.analysis?.howToCoverMissing ||
                    "No specific recommendations available."}
                </p>
              </div>

              {/* Overall Guide */}
              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-blue-900/20 border-blue-700/30"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    Quick Guide
                  </h3>
                </div>
                <p className={isDarkMode ? "text-blue-400" : "text-blue-600"}>
                  {analysis.analysis?.overallGuide ||
                    "No specific guidance available."}
                </p>
              </div>

              {/* Learning Plan */}
              <div
                className={`p-4 rounded-lg border ${
                  isDarkMode
                    ? "bg-green-900/20 border-green-700/30"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="w-5 h-5 text-green-500" />
                  <h3
                    className={`font-semibold ${
                      isDarkMode ? "text-green-300" : "text-green-700"
                    }`}
                  >
                    Learning Plan
                  </h3>
                </div>
                <p
                  className={`whitespace-pre-line ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {analysis.analysis?.learningPlan ||
                    "No learning plan available."}
                </p>
              </div>

              {/* User Skills Display */}
              {analysis.userSkills && analysis.userSkills.length > 0 && (
                <div
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-5 h-5 text-indigo-500" />
                    <h3
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Your Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.userSkills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode
                            ? "bg-indigo-900/30 text-indigo-300 border border-indigo-700/30"
                            : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {!loading && (
            <div
              className={`flex gap-3 pt-4 border-t ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={onClose}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                  isDarkMode
                    ? "bg-slate-800 hover:bg-slate-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                Close
              </button>
              {analysis && (
                <button
                  onClick={fetchSkillAnalysis}
                  className="flex-1 px-4 py-3 rounded-lg font-semibold transition-all bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Re-analyze
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillAnalysisPopup;
