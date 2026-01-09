import { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Lazy load all page components
const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const DeveloperPage = lazy(() => import("./pages/DeveloperPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const JobPage = lazy(() => import("./pages/JobPage"));
const AlumniPage = lazy(() => import("./pages/AlumniPage"));
const EventPage = lazy(() => import("./pages/EventPage"));
const Chatpage = lazy(() => import("./pages/ChatPage"));
const AlumniAuth = lazy(() => import("./pages/auth-alumni"));

const AdminLoginPage = lazy(() => import("./pages/AdminLogin"));
const CampaignPage = lazy(() => import("./pages/campaignPage"));

// Admin New Structure Imports
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboardMain = lazy(() => import("./pages/admin/Dashboard"));
const AlumniManagement = lazy(() => import("./pages/admin/AlumniManagement"));
const PendingRequests = lazy(() => import("./pages/admin/PendingRequests"));
const StudentManagement = lazy(() => import("./pages/admin/StudentManagement"));
const EventManagement = lazy(() => import("./pages/admin/EventManagement"));
const CampaignManagement = lazy(() => import("./pages/admin/CampaignManagement"));
const JobsManagement = lazy(() => import("./pages/admin/JobsManagement"));
const MentorshipManagement = lazy(() => import("./pages/admin/MentorshipManagement"));
const BulkRegister = lazy(() => import("./pages/admin/BulkRegister"));

const MyActivityPage = lazy(() => import("./pages/ActivityPage"));
const MentorPage = lazy(() => import("./pages/Mentor"));
const DistinguishedPage = lazy(() => import("./pages/DistinguishAlumni"));
const ALumniMapPage = lazy(() => import("./pages/AlumniMap"));
const BatchmatesPage = lazy(() => import("./pages/Alumni-Batchmates"));
const CreateEventPage = lazy(() => import("./pages/CreateEventPage"));
const EventGalleryPage = lazy(() => import("./pages/EventGallary"));
const AlumniJobsPage = lazy(() => import("./pages/AlumniJobs"));
const CreateJobPage = lazy(() => import("./pages/CreateJob"));
const JobTrendPage = lazy(() => import("./pages/JobTrend"));
const AlumniAnalyticsPage = lazy(() => import("./pages/AlumniAnalytics"));
const CreateCampaignPage = lazy(() => import("./pages/CreateCampaign"));
const MentorProfilePage = lazy(() => import("./pages/MentorProfilePage"));
const MentorshipRequestsPage = lazy(() => import("./pages/MentorshipRequestsPage"));
const ContactUsPage = lazy(() => import("./pages/ContactUsPage"));
const RecruitmentPage = lazy(() => import("./pages/RecruitmentPage"));
const BlogListing = lazy(() => import("./pages/BlogListing"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const BlogManagement = lazy(() => import("./pages/admin/BlogManagement"));

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
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white font-medium">Loading Page...</p>
              </div>
            </div>
          }>
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
          </Suspense>
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
