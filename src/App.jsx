import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import DeveloperPage from "./pages/DeveloperPage";
import AboutPage from "./pages/AboutPage";
import JobPage from "./pages/JobPage";
import AlumniPage from "./pages/AlumniPage";
import EventPage from "./pages/EventPage";
import Chatpage from "./pages/ChatPage";
import AlumniAuth from "./pages/auth-alumni";
import ProfileAlumni from "./pages/ProfilePage-alumni.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLogin";
import CampaignPage from "./pages/campaignPage";

import MyActivityPage from "./pages/ActivityPage";
import MentorPage from "./pages/Mentor";
import DistinguishedPage from "./pages/DistinguishAlumni";
import ALumniMapPage from "./pages/AlumniMap";
import BatchmatesPage from "./pages/Alumni-Batchmates";
import CreateEventPage from "./pages/CreateEventPage";
import EventGalleryPage from "./pages/EventGallary";
import AlumniJobsPage from "./pages/AlumniJobs";
import CreateJobPage from "./pages/CreateJob";
import JobTrendPage from "./pages/JobTrend";
import AlumniAnalyticsPage from "./pages/AlumniAnalytics";
import CreateCampaignPage from "./pages/CreateCampaign";
import MentorProfilePage from "./pages/MentorProfilePage";
import MentorshipRequestsPage from "./pages/MentorshipRequestsPage";
import ContactUsPage from "./pages/ContactUsPage";


import { Contact } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Check auth on app load and listen for storage changes
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem("auth");

      if (authData) {
        try {
          const parsedAuth = JSON.parse(authData);

          if (
            parsedAuth.accessToken &&
            parsedAuth.expiry &&
            Date.now() < parsedAuth.expiry
          ) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("auth");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
          localStorage.removeItem("auth");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    setIsLoading(false);

    // Listen for storage changes (login/logout from other tabs/pages)
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />

          {/* Student Login */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage
                  setIsAuthenticated={setIsAuthenticated}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              )
            }
          />

          {/* Alumni Login */}
          <Route
            path="/login-alumni"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AlumniAuth
                  setIsAuthenticated={setIsAuthenticated}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              )
            }
          />

          {/* Alumni Auth (OAuth callback route) */}
          <Route
            path="/auth-alumni"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <AlumniAuth
                  setIsAuthenticated={setIsAuthenticated}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              )
            }
          />

          {/* Admin Login */}
          <Route
            path="/login-admin"
            element={(() => {
              const authData = localStorage.getItem("auth");
              const parsedAuth = authData ? JSON.parse(authData) : null;
              const userType = parsedAuth?.userType;

              return isAuthenticated && userType === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <AdminLoginPage
                  setIsAuthenticated={setIsAuthenticated}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              );
            })()}
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={(() => {
              const authData = localStorage.getItem("auth");
              const parsedAuth = authData ? JSON.parse(authData) : null;
              const userType = parsedAuth?.userType;

              return isAuthenticated && userType === "admin" ? (
                <AdminDashboard
                  setIsAuthenticated={setIsAuthenticated}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              ) : (
                <Navigate to="/login-admin" replace />
              );
            })()}
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                (() => {
                  const authData = localStorage.getItem("auth");
                  const parsedAuth = authData ? JSON.parse(authData) : null;
                  const userType = parsedAuth?.userType;

                  if (userType === "admin") {
                    return <Navigate to="/admin" replace />;
                  }

                  return userType === "alumni" ? (
                    <ProfileAlumni />
                  ) : (
                    <ProfilePage />
                  );
                })()
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Other pages - Pass authentication props */}
          <Route
            path="/developer"
            element={
              <DeveloperPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/about"
            element={
              <AboutPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/contact-us"
            element={
              <ContactUsPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/distinguished-alumni"
            element={
              <DistinguishedPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/alumni-map"
            element={
              <ALumniMapPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />

          <Route
            path="/batchmates"
            element={
              <BatchmatesPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/alumni-analytics"
            element={
              <AlumniAnalyticsPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/mentor"
            element={
              <MentorPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/mentor-profile"
            element={
              <MentorProfilePage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/mentorship-requests"
            element={
              <MentorshipRequestsPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/job"
            element={
              <AlumniJobsPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/autoposted-jobs"
            element={
              <JobPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/create-job"
            element={
              <CreateJobPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/job-trends"
            element={
              <JobTrendPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/alumni"
            element={
              <AlumniPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/event"
            element={
              <EventPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/event-register"
            element={
              <CreateEventPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/event-gallery"
            element={
              <EventGalleryPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/campaign"
            element={
              <CampaignPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/campaigns"
            element={
              <CampaignPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route
            path="/create-campaign"
            element={
              <CreateCampaignPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isAuthenticated={isAuthenticated}
              />
            }
          />



          {/* Chat */}
          <Route
            path="/chat"
            element={
              isAuthenticated ? (
                <Chatpage
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/activity"
            element={
              isAuthenticated ? (
                <MyActivityPage
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}
