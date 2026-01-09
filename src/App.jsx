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


import AdminLoginPage from "./pages/AdminLogin";
import CampaignPage from "./pages/campaignPage";

// Admin New Structure Imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardMain from "./pages/admin/Dashboard";
import AlumniManagement from "./pages/admin/AlumniManagement";
import PendingRequests from "./pages/admin/PendingRequests";
import StudentManagement from "./pages/admin/StudentManagement";
import EventManagement from "./pages/admin/EventManagement";
import CampaignManagement from "./pages/admin/CampaignManagement";
import JobsManagement from "./pages/admin/JobsManagement";
import MentorshipManagement from "./pages/admin/MentorshipManagement";
import BulkRegister from "./pages/admin/BulkRegister";

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
import RecruitmentPage from "./pages/RecruitmentPage";
import BlogListing from "./pages/BlogListing";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";
import BlogManagement from "./pages/admin/BlogManagement";

import ProfilePhotoUpload from "./components/ProfilePhotoUpload";

import { Contact } from "lucide-react";

import { SocketProvider } from "./context/SocketContext";

import { useTheme } from "./context/ThemeContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Simple auth check
  const checkAuth = () => {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (auth && auth.accessToken && auth.expiry > Date.now()) {
      setIsAuthenticated(true);
      setCurrentUser(auth);
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    setIsLoading(false);
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Simple, direct profile photo check
  useEffect(() => {
    if (isAuthenticated && currentUser?.userType === "alumni") {
      const hasPhoto = currentUser.user?.profilePhoto || currentUser.profilePhoto;
      const hasSkipped = sessionStorage.getItem("skippedPhotoUpload");

      if (!hasPhoto && !hasSkipped) {
        setShowPhotoUpload(true);
      } else {
        setShowPhotoUpload(false);
      }
    } else {
      setShowPhotoUpload(false);
    }
  }, [isAuthenticated, currentUser]);

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
    <div className={`min-h-screen w-full overflow-x-hidden ${isDarkMode ? "dark" : "light"}`}>
      <SocketProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
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
                  />
                );
              })()}
            />

            {/* Admin Dashboard - New Structured Routes */}
            <Route
              path="/admin"
              element={
                isAuthenticated && currentUser?.userType === "admin" ? (
                  <AdminLayout />
                ) : (
                  <Navigate to="/login-admin" replace />
                )
              }
            >
              <Route index element={<AdminDashboardMain />} />
              <Route path="alumni" element={<AlumniManagement />} />
              <Route path="pending" element={<PendingRequests />} />
              <Route path="students" element={<StudentManagement />} />
              <Route path="events" element={<EventManagement />} />
              <Route path="campaigns" element={<CampaignManagement />} />
              <Route path="jobs" element={<JobsManagement />} />
              <Route path="mentorship" element={<MentorshipManagement />} />
              <Route path="blogs" element={<BlogManagement />} />
              <Route path="bulk-register" element={<BulkRegister />} />
            </Route>

            {/* Blogs */}
            <Route
              path="/blogs"
              element={<BlogListing isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/blog/:id"
              element={<BlogDetail isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/create-blog"
              element={<CreateBlog />}
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

                    return userType === "alumni" || userType === "student" ? (
                      <ProfilePage />
                    ) : (
                      <Navigate to="/login" replace />
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
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/about"
              element={
                <AboutPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/contact-us"
              element={
                <ContactUsPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/distinguished-alumni"
              element={
                <DistinguishedPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/alumni-map"
              element={
                <ALumniMapPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />

            <Route
              path="/batchmates"
              element={
                <BatchmatesPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/alumni-analytics"
              element={
                <AlumniAnalyticsPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/mentor"
              element={
                <MentorPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/mentor-profile"
              element={
                <MentorProfilePage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/mentorship-requests"
              element={
                <MentorshipRequestsPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/job"
              element={
                <AlumniJobsPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/autoposted-jobs"
              element={
                <JobPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/create-job"
              element={
                <CreateJobPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/job-trends"
              element={
                <JobTrendPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/alumni"
              element={
                <AlumniPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/event"
              element={
                <EventPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/event-register"
              element={
                <CreateEventPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/event-gallery"
              element={
                <EventGalleryPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/campaign"
              element={
                <CampaignPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/campaigns"
              element={
                <CampaignPage
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                />
              }
            />
            <Route
              path="/create-campaign"
              element={
                <CreateCampaignPage
                  isAuthenticated={isAuthenticated}
                />
              }
            />



            <Route
              path="/recruitment"
              element={
                <RecruitmentPage
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

        <ProfilePhotoUpload
          isOpen={showPhotoUpload}
          token={currentUser?.accessToken}
          onComplete={(newPhotoUrl) => {
            setShowPhotoUpload(false);
            // Update local storage so it doesn't pop up again
            const authData = localStorage.getItem("auth");
            if (authData) {
              const parsed = JSON.parse(authData);
              parsed.user.profilePhoto = newPhotoUrl;
              localStorage.setItem("auth", JSON.stringify(parsed));
            }
          }}
          onSkip={() => {
            setShowPhotoUpload(false);
            sessionStorage.setItem("skippedPhotoUpload", "true");
          }}
        />
      </SocketProvider>
    </div>
  );
}
