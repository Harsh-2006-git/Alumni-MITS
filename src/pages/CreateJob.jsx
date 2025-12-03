import { useState } from "react";
import { Sparkles, Upload, Plus, Users } from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";
import PostJobDialog from "../components/PostJobDialog";
import Toast from "../components/Toast";
import AuthPopup from "../components/AuthPopup";

export default function CreateJobPage({ isDarkMode, toggleTheme }) {
  const [showPostJobDialog, setShowPostJobDialog] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [toast, setToast] = useState(null);

  // Check if user is logged in - returns boolean
  const checkLoggedIn = () => {
    const authData = localStorage.getItem("auth");
    return !!(authData && JSON.parse(authData).accessToken);
  };

  // Get the logged in state
  const isUserLoggedIn = checkLoggedIn();

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Handle post job button click
  const handlePostJobClick = () => {
    if (!isUserLoggedIn) {
      setShowAuthPopup(true);
      return;
    }
    setShowPostJobDialog(true);
  };

  // Post new job
  const postJob = async (jobData) => {
    try {
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : null;

      if (!token) {
        showToast("Please login to post a job", "error");
        setShowAuthPopup(true);
        return;
      }

      const response = await fetch(
        "https://alumni-mits-backend.onrender.com/job/create-job",
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
      } else {
        showToast(data.message || "Failed to post job", "error");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      showToast("Error posting job. Please try again.", "error");
    }
  };

  // Custom hero section for create job page
  const CreateJobHeroSection = ({ isDarkMode, onPostJob, isUserLoggedIn }) => (
    <section className="text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight pb-1">
            Post a Job
          </h1>
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </div>

        {!isUserLoggedIn && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 max-w-md mx-auto">
            <p
              className={`text-sm ${
                isDarkMode ? "text-yellow-300" : "text-yellow-700"
              }`}
            >
              💡 Please login to post jobs and access all features
            </p>
          </div>
        )}

        <p className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
          Share Opportunities with the Community
        </p>

        <p
          className={`text-sm sm:text-base md:text-lg mb-4 sm:mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Help fellow alumni and students find their next career opportunity by
          posting job openings from your company.
        </p>

        <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-6 sm:mb-8"></div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={onPostJob}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Post a Job
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"
            }`}
          >
            <Upload className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="font-semibold mb-2">Easy Job Posting</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Fill out a simple form to post job opportunities quickly and
              efficiently.
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"
            }`}
          >
            <Sparkles className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="font-semibold mb-2">Reach Qualified Candidates</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Your job will be visible to MITS alumni and students actively
              seeking opportunities.
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"
            }`}
          >
            <Users className="w-8 h-8 text-purple-500 mb-2" />
            <h3 className="font-semibold mb-2">Build Your Network</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Connect with talented individuals from the MITS community and
              strengthen your professional network.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Auth Popup */}
      {showAuthPopup && (
        <AuthPopup
          isOpen={showAuthPopup}
          onClose={() => setShowAuthPopup(false)}
          isDarkMode={isDarkMode}
        />
      )}

      <CreateJobHeroSection
        isDarkMode={isDarkMode}
        onPostJob={handlePostJobClick}
        isUserLoggedIn={isUserLoggedIn}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-12">
        <div
          className={`p-8 rounded-xl ${
            isDarkMode ? "bg-slate-900" : "bg-white shadow-lg"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Why Post Jobs on Our Platform?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? "bg-slate-800" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold mb-3 text-blue-500">
                Targeted Audience
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Reach specifically MITS alumni and students who are pre-vetted
                and qualified for various roles.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? "bg-slate-800" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold mb-3 text-green-500">
                Cost Effective
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Post jobs for free and connect with talented individuals without
                any recruitment costs.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? "bg-slate-800" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold mb-3 text-purple-500">
                Quick Hiring
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Reduce your time-to-hire by connecting directly with candidates
                from the MITS network.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? "bg-slate-800" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold mb-3 text-orange-500">
                Alumni Network
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Leverage the strong MITS alumni network for referrals and
                quality candidate recommendations.
              </p>
            </div>
          </div>

          {!isUserLoggedIn && (
            <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center">
              <h3 className="font-semibold mb-2 text-blue-400">
                Ready to Post a Job?
              </h3>
              <p
                className={`text-sm mb-4 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Login to access the job posting form and start connecting with
                talented candidates from the MITS community.
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

      {showPostJobDialog && (
        <PostJobDialog
          isOpen={showPostJobDialog}
          onClose={() => setShowPostJobDialog(false)}
          isDarkMode={isDarkMode}
          onSubmit={postJob}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
