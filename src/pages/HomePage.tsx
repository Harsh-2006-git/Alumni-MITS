import { useState, useEffect } from "react";
import {
  Shield,
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  Github,
  Award,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Clock,
  DollarSign,
  ChevronDown,
  Search,
  Heart,
  Eye,
  ArrowRight,
  Building,
} from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/header";
import Footer from "../components/footer";

export default function AlumniHomePage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [auth, setAuth] = useState<null | {
    userName: string;
    userEmail: string;
    userId: string;
  }>(null);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  // Load auth from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) setAuth(JSON.parse(stored));
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    setShowProfileMenu(false);
  };

  // Simulate SignIn (redirect to login page or OAuth flow)
  const handleSignIn = () => {
    // Example: redirect to login page
    window.location.href = "/login";
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      {/* Header / Navbar */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      {/* Hero Section */}
      <section className="w-full min-h-[80vh] px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url(/assets/images/bg.png)" }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/80"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-blob"></div>
          <div
            className="absolute top-40 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-blob"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/20 rounded-full filter blur-3xl animate-blob"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Decorative Dots - Hidden on mobile */}
        <div className="absolute top-10 right-4 sm:right-10 flex flex-col gap-2 sm:gap-3 opacity-30">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-10 items-center h-full">
          {/* Left Content */}
          <div className="space-y-5 sm:space-y-6">
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-500/30">
              <span className="text-xs sm:text-sm font-medium text-blue-300 tracking-wide">
                Welcome to Your Alumni Network
              </span>
            </div>

            {/* Logo and Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl sm:rounded-2xl p-2 shadow-2xl flex-shrink-0">
                <img
                  src="/assets/images/mits-logo.png"
                  alt="MITS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-black text-white tracking-tight"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                MITS
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-xl font-light">
              Join our thriving community of 5000+ alumni across the globe,
              where connections become opportunities and memories turn into
              lifelong bonds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
              <button className="group px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 text-sm w-full sm:w-auto">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                Explore Network
              </button>
              <button className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 backdrop-blur-sm shadow-lg hover:scale-105 text-sm w-full sm:w-auto">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Join Now
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-3 sm:pt-4">
              {[
                {
                  label: "Alumni",
                  value: "5000+",
                  color: "from-blue-500 to-cyan-500",
                  glow: "shadow-blue-500/50",
                  icon: "users",
                },
                {
                  label: "Companies",
                  value: "500+",
                  color: "from-purple-500 to-pink-500",
                  glow: "shadow-purple-500/50",
                  icon: "briefcase",
                },
                {
                  label: "Events",
                  value: "100+",
                  color: "from-green-500 to-emerald-500",
                  glow: "shadow-green-500/50",
                  icon: "calendar",
                },
                {
                  label: "Awards",
                  value: "50+",
                  color: "from-orange-500 to-red-500",
                  glow: "shadow-orange-500/50",
                  icon: "award",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all hover:scale-105 hover:shadow-xl ${stat.glow} bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg animate-pulse`}
                  >
                    {stat.icon === "users" && (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    )}
                    {stat.icon === "briefcase" && (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                    {stat.icon === "calendar" && (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                    {stat.icon === "award" && (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                    )}
                  </div>
                  <p
                    className={`text-xl sm:text-2xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image Card (Hidden on mobile, shown on lg+) */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              {/* Campus Image */}
              <img
                src="/assets/images/bg.png"
                alt="MITS Campus"
                className="w-full h-[400px] object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-blue-500/20 rounded-full filter blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-purple-500/20 rounded-full filter blur-2xl"></div>
          </div>

          {/* Mobile Image (Visible only on mobile) */}
          <div className="relative lg:hidden mt-6">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/assets/images/bg.png"
                alt="MITS Campus"
                className="w-full h-[250px] sm:h-[300px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        <style>{`
    @keyframes blob {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
  `}</style>
      </section>

      {/* Testimonial Section */}
      <section
        className={`w-full px-4 sm:px-6 md:px-12 lg:px-16 py-8 md:py-12 ${
          isDarkMode
            ? "bg-gradient-to-r from-slate-900/50 to-blue-900/50"
            : "bg-gradient-to-r from-slate-50 to-blue-50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[300px_1fr] md:grid-cols-[250px_1fr] gap-6 md:gap-8 items-center">
            {/* Left - Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-2xl blur-xl ${
                    isDarkMode ? "bg-blue-500/20" : "bg-blue-400/30"
                  }`}
                ></div>
                <img
                  src="/assets/images/rk.jpg"
                  alt="Dr. R.K. Pandit"
                  className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl object-cover border-4 border-blue-500/30 shadow-2xl"
                />
              </div>
            </div>

            {/* Right - Quote */}
            <div className="space-y-3 text-center lg:text-left">
              <div
                className={`text-4xl ${
                  isDarkMode ? "text-purple-400/40" : "text-purple-300/60"
                }`}
              >
                ❝
              </div>
              <blockquote
                className={`text-base sm:text-lg md:text-xl lg:text-2xl font-serif italic leading-relaxed ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                The alumni spread all over the world have been our ambassadors
                of goodwill, successfully carrying out a radiant image of
                institute.
              </blockquote>
              <div className="pt-3">
                <h3
                  className={`text-lg sm:text-xl md:text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Dr. R.K. Pandit
                </h3>
                <p
                  className={`text-sm md:text-base ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Vice Chancellor MITS-DU Gwalior
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div
              className={`flex-1 h-px ${
                isDarkMode
                  ? "bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                  : "bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
              }`}
            ></div>
            <div
              className={`flex gap-2 ${
                isDarkMode ? "opacity-30" : "opacity-40"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? "bg-blue-400" : "bg-blue-500"
                }`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? "bg-purple-400" : "bg-purple-500"
                }`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${
                  isDarkMode ? "bg-blue-400" : "bg-blue-500"
                }`}
              ></div>
            </div>
            <div
              className={`flex-1 h-px ${
                isDarkMode
                  ? "bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
                  : "bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Professional Journey Section */}
      <section className="container mx-auto px-10 lg:px-16 py-12">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Empower Your Professional Journey
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Discover powerful tools and resources designed to accelerate your
            career growth
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Briefcase,
              title: "Job Opportunities",
              description:
                "Access exclusive job and career opportunities globally.",
              color: "from-blue-500 to-cyan-500",
              image:
                "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            },
            {
              icon: Users,
              title: "Alumni Network",
              description:
                "Connect with a diverse community of successful graduates across industries.",
              color: "from-purple-500 to-pink-500",
              image:
                "https://images.unsplash.com/photo-1559028012-481c04fa702d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            },
            {
              icon: GraduationCap,
              title: "Mentorship",
              description:
                "Get guidance from experienced professionals in your field of interest.",
              color: "from-green-500 to-emerald-500",
              image:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                  : "bg-white border-blue-200 shadow-lg"
              }`}
            >
              <div className="relative h-40 rounded-xl mb-4 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`}
                ></div>
              </div>
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg -mt-12 relative z-10 mx-auto`}
              >
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3
                className={`text-xl font-bold mb-3 text-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm mb-4 text-center ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.description}
              </p>
              <button
                className={`text-sm font-semibold mx-auto block ${
                  isDarkMode
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Network Section */}
      <section className="container mx-auto px-10 lg:px-16 py-12">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Explore Our Network
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Connect with our vibrant community members
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              name: "Divya Kaurani",
              degree: "Information Technology • 2024",
              role: "Software Engineer",
              company: "Twitter",
              location: "Mumbai",
              experience: "1 year",
              skills: ["ReactJS", "NodeJS", "MongoDB"],
              image:
                "https://www.bing.com/th/id/OIP.Fd9FpzhrFkFZ3wN-uBD3lwHaHa?w=207&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
            },
            {
              name: "Gaurav Tiwari",
              degree: "Computer Engineering • 2024",
              role: "iOS Developer",
              company: "Apple",
              location: "Bangalore",
              experience: "1 year",
              skills: ["Swift", "Android", "React"],
              image:
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            },
            {
              name: "Jaymin Gajera",
              degree: "Computer Engineering • 2025",
              role: "JavaScript Developer",
              company: "MealPe",
              location: "Remote",
              experience: "1 year",
              skills: ["Reactjs", "Nodejs", "AWS"],
              image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            },
          ].map((alumni, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                  : "bg-white border-blue-200 shadow-lg"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={alumni.image}
                    alt={alumni.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-bold text-lg ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {alumni.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {alumni.degree}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {alumni.role}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {alumni.company}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {alumni.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {alumni.experience}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {alumni.skills.map((skill, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkMode
                        ? "bg-blue-900/30 text-blue-300 border border-blue-700/50"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center gap-2">
                View Profile
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 mx-auto">
            <Users className="w-5 h-5" />
            View All Alumni
          </button>
        </div>
      </section>

      {/* Job Opportunities Section */}
      <section className="container mx-auto px-10 lg:px-16 py-12">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Latest Opportunities
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Exclusive positions from top companies in your network
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Frontend Developer",
              company: "Samsung",
              location: "Ahmedabad",
              type: "full-time",
              experience: "2-6 years",
              salary: "₹8.0L - 10.0L",
              skills: ["HTML", "UI/UX Design", "CSS"],
              posted: "10 months ago",
              status: "Active",
              image:
                "https://th.bing.com/th/id/OIP.PHBp19HLEjVv25B7HObfDAHaFj?w=240&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
            },
            {
              title: "AI Developer",
              company: "Google",
              location: "Location TBA",
              type: "full-time",
              experience: "4-6 years",
              salary: "₹20.0L - 22.0L",
              skills: ["Artificial Intelligence", "Machine Learning"],
              posted: "10 months ago",
              status: "Active",
              image:
                "https://tse3.mm.bing.net/th/id/OIP.PiYEnZOW9JkSaIqYa0AnuAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
            },
            {
              title: "Frontend Developer",
              company: "TCS",
              location: "Gandhinagar",
              type: "full-time",
              experience: "3-6 years",
              salary: "₹5.0L - 7.0L",
              skills: ["UI/UX Design", "React", "CSS", "HTML"],
              posted: "10 months ago",
              status: "Active",
              image:
                "https://m.sakshipost.com/sites/default/files/styles/storypage_main/public/article_images/2022/04/23/TCS-1650701831.jpg?itok=2xEZbDuD",
            },
          ].map((job, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                  : "bg-white border-blue-200 shadow-lg"
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={job.image}
                  alt={job.company}
                  className="w-12 h-12 rounded-lg object-cover border-2 border-blue-500"
                />
                <div className="flex-1">
                  <h3
                    className={`font-bold text-lg ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {job.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {job.experience}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {job.salary}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDarkMode
                        ? "bg-purple-900/30 text-purple-300 border border-purple-700/50"
                        : "bg-purple-100 text-purple-700 border border-purple-200"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs flex items-center gap-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  Posted {job.posted}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode
                      ? "bg-green-900/30 text-green-400"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <button className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center gap-2">
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 mx-auto">
            <Briefcase className="w-5 h-5" />
            Explore All Opportunities
          </button>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Upcoming Events
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Join exciting events and connect with your community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Fusion Fiesta",
              description:
                "Annual alumni reunion with networking, music, and cultural performances",
              type: "reunion",
              status: "Upcoming",
              venue: "LDRP-ITR",
              location: "Gandhinagar",
              date: "December 4th, 2024",
              time: "9:10 AM",
              spots: "200 spots left",
              image:
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            },
            {
              title: "Data Science Bootcamp",
              description:
                "A 3-day hands-on workshop on Machine Learning and Data Analytics",
              type: "webinar",
              status: "Upcoming",
              venue: "Conference Hall",
              location: "Ahmedabad",
              date: "December 9th, 2024",
              time: "6:55 PM",
              spots: "200 spots left",
              image:
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            },
            {
              title: "AI ML Webinar",
              description:
                "A comprehensive webinar on Artificial Intelligence and Machine Learning trends",
              type: "webinar",
              status: "Upcoming",
              venue: "Venue TBA",
              location: "Location TBA",
              date: "December 12th, 2024",
              time: "3:15 PM",
              spots: "199 spots left",
              image:
                "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            },
          ].map((event, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border overflow-hidden transition-all hover:scale-105 hover:shadow-2xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                  : "bg-white border-blue-200 shadow-lg"
              }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.type === "reunion"
                        ? "bg-purple-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3
                  className={`font-bold text-xl mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {event.title}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.venue}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {event.spots}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-orange-400" : "text-orange-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {event.date}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {event.time}
                  </span>
                </div>

                <button className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Campaigns Section */}
      <section className="container mx-auto px-10 lg:px-16 py-12">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Active Campaigns
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Support meaningful initiatives in your community
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div
            className={`p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                : "bg-white border-blue-200 shadow-lg"
            }`}
          >
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Green Campus Initiative"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-green-500/20"></div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                  Infrastructure
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-600 text-white">
                  Active
                </span>
              </div>
            </div>

            <h3
              className={`font-bold text-xl mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Green Campus Initiative
            </h3>
            <p
              className={`text-sm mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Making our campus eco-friendly, one step at a time. Planting
              trees, installing solar panels, and creating sustainable
              infrastructure.
            </p>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  55.3%
                </span>
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  ₹8,29,734 of ₹15,00,000
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: "55.3%" }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₹8,29,734{" "}
                  <span
                    className={`text-sm font-normal ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    raised of ₹15,00,000
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  23 days left
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Gaurav Tiwari"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
              />
              <div>
                <p
                  className={`font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Gaurav Tiwari
                </p>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Organizer
                </p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1">
                  <Users
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    46 donors
                  </span>
                </div>
              </div>
            </div>

            <button className="w-full px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              Support Campaign
            </button>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="container mx-auto px-10 lg:px-16 py-12">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Latest Updates & Insights
          </h2>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Stay informed with the latest news, stories, and achievements from
            our community
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div
            className={`rounded-2xl border overflow-hidden transition-all hover:scale-105 hover:shadow-2xl ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                : "bg-white border-blue-200 shadow-lg"
            }`}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1417733403748-83bbc7c05140?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="The Power of Consistency"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-500/20"></div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                  General
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">☀️</span>
                <h3
                  className={`font-bold text-xl ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  The Power of Consistency: Unlocking Your True Potential
                </h3>
              </div>

              <p
                className={`text-sm mb-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                In this edition, we delve into the transformative power of
                consistency and how small, deliberate actions every day can lead
                to extraordinary results in your career and personal growth.
              </p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Alumni Success Team
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Dec 06, 2024
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    39 views
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-red-400" : "text-red-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    12 likes
                  </span>
                </div>
              </div>

              <button className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center gap-2">
                Read More
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Open Source Bookmark - Add to all pages */}
      <div className="fixed left-0 bottom-8 z-50">
        <a
          href="/opensource"
          className="flex items-center bg-red-500 text-white p-2 rounded-r-lg shadow-lg transition-all duration-300 group hover:p-3 hover:pr-5 hover:rounded-r-xl"
        >
          <Github className="w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
          <span className="ml-0 opacity-0 w-0 group-hover:ml-2 group-hover:opacity-100 group-hover:w-auto text-xs font-semibold whitespace-nowrap transition-all duration-300 overflow-hidden">
            Open Source
          </span>
        </a>
      </div>

      {/* Floating Connect Button */}
      <button
        onClick={() => navigate("/chat")}
        className={`
    fixed bottom-6 right-6 z-50 flex items-center justify-center
    rounded-full p-3 shadow-lg transition-transform hover:scale-110
    ${
      isDarkMode
        ? "bg-gradient-to-r from-purple-700 via-pink-600 to-orange-600 text-white shadow-purple-500/50"
        : "bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-white shadow-pink-300/50"
    }
  `}
        title="Connect with Alumni"
      >
        {/* On small screens show only icon, on larger show text + icon */}
        <span className="hidden sm:flex items-center gap-2 font-semibold text-sm">
          Connect with Alumni 💬
        </span>
        <span className="sm:hidden text-xl">💬</span>
      </button>
    </div>
  );
}
