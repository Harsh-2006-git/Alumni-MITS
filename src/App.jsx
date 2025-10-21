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
import ProfileAlumni from "./pages/ProfilePage-alumni";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLogin";
import CampaignPage from "./pages/campaignPage";
import OpenSourcePage from "./pages/OpenSource";
import MyActivityPage from "./pages/ActivityPage";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth on app load
  useEffect(() => {
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

    setIsLoading(false);
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
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
          }
        />

        {/* Student Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage setIsAuthenticated={setIsAuthenticated} />
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
              <AlumniAuth setIsAuthenticated={setIsAuthenticated} />
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
              <AdminLoginPage setIsAuthenticated={setIsAuthenticated} />
            );
          })()}
        />
        {/* Admin Dashboard (protected - admin only) */}
        <Route
          path="/admin"
          element={(() => {
            const authData = localStorage.getItem("auth");
            const parsedAuth = authData ? JSON.parse(authData) : null;
            const userType = parsedAuth?.userType;

            return isAuthenticated && userType === "admin" ? (
              <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login-admin" replace />
            );
          })()}
        />
        {/* Profile (protected, student or alumni) */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              (() => {
                const authData = localStorage.getItem("auth");
                const parsedAuth = authData ? JSON.parse(authData) : null;
                const userType = parsedAuth?.userType;

                // Redirect admin to admin dashboard
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
        {/* Other pages */}
        <Route path="/developer" element={<DeveloperPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/job" element={<JobPage />} />
        <Route path="/alumni" element={<AlumniPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/campaign" element={<CampaignPage />} />
        <Route path="/opensource" element={<OpenSourcePage />} />
        {/* Chat (protected) */}
        <Route
          path="/chat"
          element={
            isAuthenticated ? <Chatpage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/activity"
          element={
            isAuthenticated ? (
              <MyActivityPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
