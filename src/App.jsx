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
import MentorPage from "./pages/Mentor";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
    <div className={isDarkMode ? "dark" : "light"}>
      <Router>
        {/* REMOVED Header from here since it's in individual pages */}

        <Routes>
          <Route
            path="/"
            element={
              <HomePage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
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

          {/* Other pages */}
          <Route
            path="/developer"
            element={
              <DeveloperPage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              />
            }
          />
          <Route
            path="/about"
            element={
              <AboutPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/mentor"
            element={
              <MentorPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/job"
            element={
              <JobPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/alumni"
            element={
              <AlumniPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/event"
            element={
              <EventPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/campaign"
            element={
              <CampaignPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            }
          />
          <Route
            path="/opensource"
            element={
              <OpenSourcePage
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              />
            }
          />

          {/* Chat */}
          <Route
            path="/chat"
            element={
              isAuthenticated ? (
                <Chatpage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
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
