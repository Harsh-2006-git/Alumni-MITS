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
  Plus,
  BookOpen,
  Video,
  Camera,
} from "lucide-react";

import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ScrollingAlumni } from "./DistinguishAlumni";
import ScrollingChapters from "../components/ScrollingChapters";


import Header from "../components/header";
import Footer from "../components/footer";


interface ParallaxProps {
  isDarkMode: boolean;
}

const ParallaxImageSection = () => {
  const [textIndex, setTextIndex] = useState(0);
  const changingTexts = [
    "Fostering Innovation",
    "Building Leaders",
    "Connecting Generations",
    "Creating Impact"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % changingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full h-[400px] md:h-[500px] my-16 md:my-24 bg-fixed bg-center bg-cover bg-no-repeat relative shadow-inner flex items-center justify-center text-center px-4"
      style={{
        backgroundImage: "url('/assets/uploaded_parallax_bg.png')"
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>

      <div className="relative z-10 text-white space-y-4 md:space-y-6 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
        >
          Welcome to MITS Gwalior
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl font-medium text-blue-100/90 tracking-wide drop-shadow-md"
        >
          Mission to Innovate Technology for Society
        </motion.p>

        <div className="h-10 md:h-14 flex items-center justify-center overflow-hidden pt-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-xl sm:text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-purple-400 drop-shadow-sm"
            >
              {changingTexts[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface HomePageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

import { useTheme } from "../context/ThemeContext";

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`group rounded-2xl border transition-all duration-500 overflow-hidden ${isOpen
        ? (isDarkMode ? "bg-slate-900/80 border-blue-500/50 shadow-[0_20px_50px_rgba(30,58,138,0.4)]" : "bg-white border-blue-600 shadow-[0_20px_50px_rgba(59,130,246,0.1)]")
        : (isDarkMode ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20" : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg")
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 text-left"
      >
        <span className={`text-sm sm:text-base font-bold transition-all duration-300 ${isOpen
          ? (isDarkMode ? "text-blue-400 translate-x-1" : "text-blue-600 translate-x-1")
          : (isDarkMode ? "text-slate-300" : "text-gray-700")
          }`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${isOpen
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/40"
            : (isDarkMode ? "bg-white/10 text-slate-400 group-hover:bg-white/20" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600")
            }`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base leading-relaxed">
              <div className={`pt-4 border-t ${isDarkMode ? "border-white/5 text-slate-400" : "border-gray-100 text-gray-600"}`}>
                {answer}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AlumniHomePage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [auth, setAuth] = useState<null | {
    userName: string;
    userEmail: string;
    userId: string;
  }>(null);
  const testimonialRef = useRef(null);
  const [isTestimonialVisible, setIsTestimonialVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTestimonialVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }

    return () => {
      if (testimonialRef.current) {
        observer.unobserve(testimonialRef.current);
      }
    };
  }, []);

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const features = [
    {
      icon: "https://almashines.s3-ap-southeast-1.amazonaws.com/appdata/images/buildings.svg",
      title: "10+ Countries",
      description:
        "Complete your alumni profile to stay connected with opportunities that match your interests.",
    },
    {
      icon: "https://almashines.s3-ap-southeast-1.amazonaws.com/appdata/images/graduated.svg",
      title: "25+ Interest Groups",
      description:
        "Connect with alumni in your interest groups to grow your professional and social network.",
    },
    {
      icon: "https://almashines.s3-ap-southeast-1.amazonaws.com/appdata/images/Alumni-directory.svg",
      title: "5000+ Members",
      description:
        "Explore complete alumni directory & connect with alumni with your interests & domain.",
    },
    {
      icon: "https://almashines.s3-ap-southeast-1.amazonaws.com/appdata/images/portraits.svg",
      title: "Your Alumni Profile",
      description:
        "Stay connected. Update your alumni profile to get matched with relevant opportunities.",
    },
  ];

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || window.innerWidth >= 768) return;

    let animationId: number;
    const scrollSpeed = 1; // Slower for smoother motion

    const autoScroll = () => {
      if (!scrollContainer) return;

      const maxScroll = scrollContainer.scrollWidth / 2;

      // Smooth continuous scroll
      scrollContainer.scrollLeft += scrollSpeed;

      // Reset seamlessly when reaching halfway point
      if (scrollContainer.scrollLeft >= maxScroll) {
        scrollContainer.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      setIsScrolling(true);
      animationId = requestAnimationFrame(autoScroll);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

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
      className={`min-h-screen transition-colors duration-500 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
        }`}
    >
      {/* Header / Navbar */}
      <Header />
      {/* Hero Section */}
      <section
        className={`w-full px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-12 relative overflow-hidden transition-colors duration-500 ${isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50"
          }`}
      >
        {/* Animated Background Shapes - Parallax Layer 1 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
          <div
            className={`absolute top-20 -left-20 w-72 h-72 rounded-full filter blur-3xl animate-blob opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"
              }`}
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className={`absolute top-40 -right-20 w-96 h-96 rounded-full filter blur-3xl animate-blob animation-delay-2000 opacity-20 ${isDarkMode ? "bg-purple-500" : "bg-purple-400"
              }`}
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className={`absolute -bottom-20 left-40 w-80 h-80 rounded-full filter blur-3xl animate-blob animation-delay-4000 opacity-20 ${isDarkMode ? "bg-pink-500" : "bg-pink-400"
              }`}
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Background Image with Parallax - Layer 2 */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 opacity-30`}
          style={{
            backgroundImage: "url(/assets/images/bg.png)",
            transform: "translateZ(0) scale(1.1)",
          }}
        ></div>

        {/* Dark/Light Overlay with Animation */}
        <div
          className={`absolute inset-0 transition-all duration-500 animate-fade-in ${isDarkMode
            ? "bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/60"
            : "bg-gradient-to-b from-white/40 via-transparent to-blue-50/50"
            }`}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-10 items-center min-h-[500px]">
          {/* Left Content */}
          <div className="space-y-3 sm:space-y-6 animate-slide-up">
            {/* Welcome Badge with Pulse Animation */}
            <div
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm border transition-all duration-500 animate-fade-in-delay relative ${isDarkMode
                ? "bg-blue-500/10 border-blue-500/30"
                : "bg-white/60 border-blue-300 shadow-lg"
                }`}
              style={{ animationDelay: "0.2s" }}
            >
              <span
                className={`text-[10px] sm:text-sm font-medium tracking-wide transition-colors duration-500 ${isDarkMode ? "text-blue-300" : "text-blue-700"
                  }`}
              >
                Welcome to Your Alumni Network
              </span>
              {/* Decorative Elements with Animation */}
              <div
                className={`absolute -top-6 -right-6 w-28 h-28 rounded-full filter blur-2xl transition-colors duration-500 animate-pulse-slow ${isDarkMode ? "bg-blue-500/20" : "bg-blue-400/40"
                  }`}
              ></div>
              <div
                className={`absolute -bottom-6 -left-6 w-28 h-28 rounded-full filter blur-2xl transition-colors duration-500 animate-pulse-slow ${isDarkMode ? "bg-purple-500/20" : "bg-purple-400/40"
                  }`}
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            {/* Logo and Title with Scale Animation */}
            <div
              className="flex items-center gap-2 sm:gap-4 animate-fade-in-delay"
              style={{ animationDelay: "0.4s" }}
            >
              <div
                className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-2xl p-1.5 sm:p-2 shadow-2xl flex-shrink-0 transition-all duration-500 hover:scale-110 hover:rotate-3 ${isDarkMode ? "bg-white" : "bg-white"
                  }`}
              >
                <img
                  src="/assets/images/mits-logo.png"
                  alt="MITS Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1
                className={`text-3xl sm:text-5xl md:text-6xl lg:text-5xl font-black tracking-tight transition-colors duration-500 animate-text-shimmer ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                MITS
              </h1>
            </div>

            {/* Description with Fade In */}
            <p
              className={`text-xs sm:text-base md:text-lg leading-relaxed max-w-xl transition-colors duration-500 animate-fade-in-delay ${isDarkMode
                ? "text-gray-300 font-light"
                : "text-gray-800 font-normal"
                }`}
              style={{ animationDelay: "0.6s" }}
            >
              Join our thriving community of 5000+ alumni across the globe,
              where connections become opportunities and memories turn into
              lifelong bonds.
            </p>

            {/* CTA Buttons with Stagger Animation */}
            <div
              className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2 animate-fade-in-delay"
              style={{ animationDelay: "0.8s" }}
            >
              <button
                onClick={() => navigate("/alumni")}
                className={`group px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 text-sm w-full sm:w-auto relative overflow-hidden ${isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <svg
                  className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
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
              <button
                onClick={() => navigate("/event")}
                className={`group px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 backdrop-blur-sm shadow-lg hover:scale-105 hover:-translate-y-1 text-sm w-full sm:w-auto relative overflow-hidden ${isDarkMode
                  ? "bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600"
                  : "bg-white/70 hover:bg-white text-gray-900 border border-gray-300 hover:border-gray-400"
                  }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <svg
                  className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
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

            {/* Stats Section with Stagger Animation */}
            <div
              className="grid grid-cols-4 gap-1.5 sm:gap-4 pt-3 sm:pt-4"
              style={{ animationDelay: "1s" }}
            >
              {[
                {
                  label: "Alumni",
                  value: "5000+",
                  color: "from-blue-500 to-cyan-500",
                  glow: "shadow-blue-500/50",
                  icon: "users",
                  delay: "0s",
                },
                {
                  label: "Companies",
                  value: "500+",
                  color: "from-purple-500 to-pink-500",
                  glow: "shadow-purple-500/50",
                  icon: "briefcase",
                  delay: "0.1s",
                },
                {
                  label: "Events",
                  value: "100+",
                  color: "from-green-500 to-emerald-500",
                  glow: "shadow-green-500/50",
                  icon: "calendar",
                  delay: "0.2s",
                },
                {
                  label: "Awards",
                  value: "50+",
                  color: "from-orange-500 to-red-500",
                  glow: "shadow-orange-500/50",
                  icon: "award",
                  delay: "0.3s",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 sm:p-2 md:p-4 rounded-lg sm:rounded-xl border transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl ${stat.glow
                    } animate-fade-in-up ${isDarkMode
                      ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                      : "bg-white/70 border-gray-200 shadow-lg"
                    }`}
                  style={{ animationDelay: `${1 + idx * 0.1}s` }}
                >
                  <div
                    className={`w-6 h-6 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-1 sm:mb-3 shadow-lg animate-bounce-slow`}
                    style={{ animationDelay: stat.delay }}
                  >
                    {stat.icon === "users" && (
                      <svg
                        className="w-3 h-3 sm:w-5 sm:h-5 text-white"
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
                        className="w-3 h-3 sm:w-5 sm:h-5 text-white"
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
                        className="w-3 h-3 sm:w-5 sm:h-5 text-white"
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
                        className="w-3 h-3 sm:w-5 sm:h-5 text-white"
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
                    className={`text-sm sm:text-2xl font-bold mb-0.5 sm:mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={`text-[10px] sm:text-xs font-medium transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image Card with Parallax (Hidden on mobile, shown on lg+) */}
          <div
            className="relative hidden lg:block animate-fade-in-delay"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500 hover:shadow-blue-500/20">
              {/* Campus Image */}
              <img
                src="/assets/images/bg.png"
                alt="MITS Campus"
                className="w-full h-[400px] object-cover transition-transform duration-700 hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 transition-colors duration-500 ${isDarkMode
                  ? "bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"
                  : "bg-gradient-to-t from-white/40 via-transparent to-transparent"
                  }`}
              ></div>

              {/* Floating Badge */}
              <div
                className={`absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md ${isDarkMode
                  ? "bg-blue-500/50 text-white border border-blue-400/30"
                  : "bg-white/80 text-blue-700 border border-blue-200"
                  } font-semibold text-sm animate-float shadow-lg`}
              >
                🎓 Campus Life
              </div>
            </div>
          </div>

          {/* Mobile Image (Visible only on mobile) */}
          <div
            className="relative lg:hidden mt-6 animate-fade-in-delay"
            style={{ animationDelay: "1s" }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/assets/images/bg.png"
                alt="MITS Campus"
                className="w-full h-[250px] sm:h-[300px] object-cover"
              />
              <div
                className={`absolute inset-0 transition-colors duration-500 ${isDarkMode
                  ? "bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"
                  : "bg-gradient-to-t from-white/40 via-transparent to-transparent"
                  }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Add custom styles */}
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

    @keyframes slideLoader {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100vw);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @keyframes bounceSlow {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }

    @keyframes pulseSlow {
      0%, 100% {
        opacity: 0.3;
      }
      50% {
        opacity: 0.6;
      }
    }

    .animate-blob {
      animation: blob 7s infinite;
    }

    .animate-slide-loader {
      animation: slideLoader 2s ease-in-out;
    }

    .animate-fade-in {
      animation: fadeIn 1s ease-out forwards;
    }

    .animate-fade-in-delay {
      opacity: 0;
      animation: fadeIn 0.8s ease-out forwards;
    }

    .animate-slide-up {
      animation: slideUp 1s ease-out;
    }

    .animate-fade-in-up {
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .animate-float {
      animation: float 3s ease-in-out infinite;
    }

    .animate-bounce-slow {
      animation: bounceSlow 2s ease-in-out infinite;
    }

    .animate-pulse-slow {
      animation: pulseSlow 3s ease-in-out infinite;
    }
  `}</style>
      </section>
      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-4 md:py-6">
        <div className="relative flex items-center">
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-r from-transparent via-blue-100 to-blue-300"}`}></div>
          <div className="mx-6 flex items-center justify-center relative">
            <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`}></div>
            <div className={`w-3 h-3 rounded-full rotate-45 border-2 ${isDarkMode ? "bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white border-blue-400 shadow-sm"}`}></div>
          </div>
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-l from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-l from-transparent via-blue-100 to-blue-300"}`}></div>
        </div>
      </div>

      {/* Scrolling Alumni - Visible on all screens */}
      <div className="w-full">
        <ScrollingAlumni isDarkMode={isDarkMode} />
      </div>

      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-4 md:py-6">
        <div className="relative flex items-center">
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-r from-transparent via-blue-100 to-blue-300"}`}></div>
          <div className="mx-6 flex items-center justify-center relative">
            <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`}></div>
            <div className={`w-3 h-3 rounded-full rotate-45 border-2 ${isDarkMode ? "bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white border-blue-400 shadow-sm"}`}></div>
          </div>
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-l from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-l from-transparent via-blue-100 to-blue-300"}`}></div>
        </div>
      </div>



      {/* Features Section - Same as Video Section */}
      {/* Features Section - Same as Video Section */}
      <section className="hidden md:block w-full px-6 md:px-10 lg:px-14 py-10 mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-4">
              <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                Global Connections
              </span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500">Global Network</span>
            </h2>
            <p
              className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Connect with alumni worldwide and explore endless opportunities
            </p>
          </div>

          {/* Desktop Grid Only */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden border transition-all hover:scale-105 hover:shadow-2xl ${isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20 shadow-lg"
                  : "bg-white border-blue-200 shadow-lg"
                  }`}
              >
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full p-4">
                      <img
                        src={feature.icon}
                        alt={feature.title}
                        loading="lazy"
                        className={`w-14 h-14 object-contain ${isDarkMode ? "filter invert brightness-0" : ""
                          }`}
                      />
                    </div>
                  </div>

                  <h3
                    className={`text-lg font-semibold text-center mb-3 leading-snug ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`text-sm text-center leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Section Divider */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-8 md:py-12">
          <div className="relative flex items-center">
            <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-r from-transparent via-blue-100 to-blue-300"}`}></div>
            <div className="mx-6 flex items-center justify-center relative">
              <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`}></div>
              <div className={`w-3 h-3 rounded-full rotate-45 border-2 ${isDarkMode ? "bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white border-blue-400 shadow-sm"}`}></div>
            </div>
            <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-l from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-l from-transparent via-blue-100 to-blue-300"}`}></div>
          </div>
        </div>
      </section>









      {/* Professional Journey Section with Parallax */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-10 lg:px-16 py-12"
      >
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-4"
          >
            <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              Success Tools
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Empower Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500">Professional Journey</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Discover powerful tools and resources designed to accelerate your career growth
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          {[
            {
              icon: Briefcase,
              title: "Job Opportunities",
              description:
                "Access exclusive job and career opportunities globally.",
              color: "from-blue-500 to-cyan-500",
              image:
                "https://static.vecteezy.com/system/resources/previews/010/821/730/original/search-job-find-vacancy-employment-go-to-career-people-seek-opportunity-for-vacancy-or-work-position-search-new-work-in-internet-illustration-vector.jpg",
            },
            {
              icon: Users,
              title: "Alumni Network",
              description:
                "Connect with a diverse community of successful graduates across industries.",
              color: "from-purple-500 to-red-500",
              image:
                "https://image.shutterstock.com/z/stock-vector-group-of-students-concept-illustration-college-or-university-students-sitting-on-pile-of-books-and-2127455960.jpg",
            },
            {
              icon: GraduationCap,
              title: "Mentorship",
              description:
                "Get guidance from experienced professionals in your field of interest.",
              color: "from-green-500 to-emerald-500",
              image:
                "https://thumbs.dreamstime.com/b/mentoring-concept-illustration-mentoring-concept-idea-leadership-teamwork-support-giving-advice-to-employee-isolated-123662327.jpg?w=1200",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className={`p-4 sm:p-5 md:p-6 pt-6 sm:pt-7 md:pt-8 rounded-xl sm:rounded-2xl border transition-all hover:shadow-2xl overflow-hidden ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                : "bg-white border-blue-200 shadow-lg"
                }`}
            >
              <div className="relative mb-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative h-28 sm:h-32 md:h-40 rounded-lg sm:rounded-xl overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20`}
                  ></div>
                </motion.div>
                <div
                  className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg z-10`}
                >
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <h3
                className={`text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 text-center ${isDarkMode ? "text-white" : "text-gray-900"
                  }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-xs sm:text-sm mb-3 sm:mb-4 text-center ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                {item.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`text-xs sm:text-sm font-semibold mx-auto block ${isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
                  }`}
              >
                Learn More →
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.section>
      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="relative flex items-center">
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-r from-transparent via-blue-100 to-blue-300"}`}></div>
          <div className="mx-6 flex items-center justify-center relative">
            <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`}></div>
            <div className={`w-3 h-3 rounded-full rotate-45 border-2 ${isDarkMode ? "bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white border-blue-400 shadow-sm"}`}></div>
          </div>
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-l from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-l from-transparent via-blue-100 to-blue-300"}`}></div>
        </div>
      </div>

      {/* Campus Glimpse Video Section */}
      <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-12">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-4">
            <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              Campus Tour
            </span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            A Glimpse of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500">Our Campus</span>
          </h2>
          <p
            className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Take an aerial tour of our beautiful campus and facilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center">
          {/* Left - Text Content */}
          <div className="space-y-4">
            <p
              className={`text-base leading-relaxed hidden md:block ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Experience the breathtaking beauty of our 250-acre campus from a
              bird's eye view. Our state-of-the-art facilities, lush green
              spaces, and modern infrastructure create an inspiring environment
              for learning and innovation.
            </p>
            <p
              className={`text-base leading-relaxed hidden md:block ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Since 1957, MITS has been a beacon of academic excellence,
              fostering generations of brilliant minds who have gone on to make
              significant contributions across the globe.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 pt-2 justify-center md:justify-start">
              <div
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-center ${isDarkMode
                  ? "bg-blue-900/30 text-blue-300 border border-blue-700/50"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
                  }`}
              >
                <span className="text-[10px] sm:text-sm font-medium whitespace-nowrap">
                  250+ Acres
                </span>
              </div>
              <div
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-center ${isDarkMode
                  ? "bg-purple-900/30 text-purple-300 border border-purple-700/50"
                  : "bg-purple-100 text-purple-700 border border-purple-200"
                  }`}
              >
                <span className="text-[10px] sm:text-sm font-medium whitespace-nowrap">
                  67+ Years
                </span>
              </div>
              <div
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-center ${isDarkMode
                  ? "bg-green-900/30 text-green-300 border border-green-700/50"
                  : "bg-green-100 text-green-700 border border-green-200"
                  }`}
              >
                <span className="text-[10px] sm:text-sm font-medium whitespace-nowrap">
                  World-Class
                </span>
              </div>
            </div>
          </div>

          {/* Right - Video */}
          <div>
            <div
              className={`rounded-2xl overflow-hidden border transition-all hover:scale-105 hover:shadow-2xl ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20 shadow-lg"
                : "bg-white border-blue-200 shadow-lg"
                }`}
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.play().catch(() => {
                      // Auto-play was prevented, user interaction needed
                    });
                  }}
                  onEnded={(e) => {
                    const video = e.target as HTMLVideoElement;
                    video.currentTime = 0;
                    video.play();
                  }}
                >
                  <source src="/assets/video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="relative flex items-center">
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-r from-transparent via-blue-100 to-blue-300"}`}></div>
          <div className="mx-6 flex items-center justify-center relative">
            <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`}></div>
            <div className={`w-3 h-3 rounded-full rotate-45 border-2 ${isDarkMode ? "bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white border-blue-400 shadow-sm"}`}></div>
          </div>
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-l from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-l from-transparent via-blue-100 to-blue-300"}`}></div>
        </div>
      </div>


      {/* Job Opportunities Section with Parallax */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-10 lg:px-16 py-12"
      >
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-4"
          >
            <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              Career Growth
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500">Opportunities</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Exclusive positions from top companies in your network
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                delay: idx * 0.15,
              }}
              whileHover={{
                scale: 1.03,
                y: -8,
                transition: { type: "spring", stiffness: 400 },
              }}
              className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border transition-all hover:shadow-2xl ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                : "bg-white border-blue-200 shadow-lg"
                }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <motion.img
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  src={job.image}
                  alt={job.company}
                  loading="lazy"
                  className="w-12 h-12 rounded-lg object-cover border-2 border-blue-500"
                />
                <div className="flex-1">
                  <h3
                    className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {job.title}
                  </h3>
                  <p
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {job.company}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin
                    className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                  />
                  <span
                    className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock
                    className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                  />
                  <span
                    className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    {job.experience}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase
                    className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                  />
                  <span
                    className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign
                    className={`w-4 h-4 ${isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                  />
                  <span
                    className={`text-sm font-semibold ${isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                  >
                    {job.salary}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    whileHover={{
                      scale: 1.2,
                      y: -2,
                    }}
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${isDarkMode
                      ? "bg-purple-900/30 text-purple-300 border border-purple-700/50"
                      : "bg-purple-100 text-purple-700 border border-purple-200"
                      }`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  <Calendar className="w-3 h-3" />
                  Posted {job.posted}
                </span>
                <span
                  className={`text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full ${isDarkMode
                    ? "bg-green-900/30 text-green-400"
                    : "bg-green-100 text-green-700"
                    }`}
                >
                  {job.status}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center gap-2"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
          >
            <Briefcase className="w-5 h-5" />
            Explore All Opportunities
          </motion.button>
        </div>
      </motion.section>

      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="relative flex items-center">
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-r from-transparent via-blue-100 to-blue-300"}`}></div>
          <div className="mx-6 flex items-center justify-center relative">
            <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`}></div>
            <div className={`w-3 h-3 rounded-full rotate-45 border-2 ${isDarkMode ? "bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white border-blue-400 shadow-sm"}`}></div>
          </div>
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-l from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-l from-transparent via-blue-100 to-blue-300"}`}></div>
        </div>
      </div>

      {/* Upcoming Events Section with Parallax */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-12"
      >
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-4"
          >
            <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              Networking
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500">Events</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Join exciting events and connect with your community
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Fusion Fiesta",
              description:
                "Annual alumni reunion with networking, music, and cultural performances",
              type: "fest",
              status: "Done",
              venue: "SAC Hall",
              location: "MITS Gwalior",
              date: "April 5th, 2024",
              time: "5:00 PM",
              spots: "200 spots left",
              image:
                "https://cdn.evbuc.com/images/731735339/1351181975143/1/logo.20240330-023221",
            },
            {
              title: "Data Science Bootcamp",
              description:
                "A 3-day hands-on workshop on Machine Learning and Data Analytics",
              type: "webinar",
              status: "Done",
              venue: "Online",
              location: "Delhi",
              date: "December 9th, 2025",
              time: "6:00 PM",
              spots: "200 spots left",
              image:
                "https://mathematicalmysteries.org/wp-content/uploads/2022/01/dataquest-what-is-data-science.jpg",
            },
            {
              title: "MITS-AA Ehsas",
              description:
                "A MITS Alumni Association Annual meet",
              type: "Event",
              status: "Done",
              venue: "Venue TBA",
              location: "New Delhi",
              date: "December 12th, 2024",
              time: "3:15 PM",
              spots: "199 spots left",
              image:
                "https://th.bing.com/th/id/OIP.SnbWEqTM-MnZ8UUgHScqGAHaCy?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
            },
          ].map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                delay: idx * 0.2,
              }}
              whileHover={{
                scale: 1.05,
                y: -10,
                rotateY: 5,
              }}
              className={`rounded-2xl border overflow-hidden transition-all hover:shadow-2xl max-w-md mx-auto w-full ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                : "bg-white border-blue-200 shadow-lg"
                }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative h-48 overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${event.type === "reunion"
                      ? "bg-purple-600 text-white"
                      : "bg-blue-600 text-white"
                      }`}
                  >
                    {event.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-700"
                      }`}
                  >
                    {event.status}
                  </span>
                </div>
              </motion.div>

              <div className="p-4 sm:p-6">
                <h3
                  className={`font-bold text-lg sm:text-xl mb-1 sm:mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  {event.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                    />
                    <span
                      className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {event.venue}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                    />
                    <span
                      className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {event.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users
                      className={`w-4 h-4 ${isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                    />
                    <span
                      className={`text-sm font-semibold ${isDarkMode ? "text-green-400" : "text-green-600"
                        }`}
                    >
                      {event.spots}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar
                      className={`w-4 h-4 ${isDarkMode ? "text-orange-400" : "text-orange-600"
                        }`}
                    />
                    <span
                      className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {event.date}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    {event.time}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Register Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="relative flex items-center">
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-r from-transparent via-blue-100 to-blue-300"}`}></div>
          <div className="mx-6 flex items-center justify-center relative">
            <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`}></div>
            <div className={`w-3 h-3 rounded-full rotate-45 border-2 ${isDarkMode ? "bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white border-blue-400 shadow-sm"}`}></div>
          </div>
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-l from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-l from-transparent via-blue-100 to-blue-300"}`}></div>
        </div>
      </div>

      {/* Active Campaigns Section with Parallax */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 sm:py-8 md:py-12"
      >
        <div className="text-center mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-4"
          >
            <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              Making A Difference
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500">Campaigns</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Support meaningful initiatives in your community
          </motion.p>
        </div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{
              scale: 1.02,
              y: -5,
            }}
            className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border transition-all hover:shadow-2xl ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
              : "bg-white border-blue-200 shadow-lg"
              }`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative h-48 rounded-xl overflow-hidden mb-4"
            >
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
            </motion.div>

            <h3
              className={`font-bold text-sm sm:text-lg md:text-xl mb-1 sm:mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Green Campus Initiative
            </h3>
            <p
              className={`text-[11px] sm:text-sm mb-3 sm:mb-4 leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Making our campus eco-friendly, one step at a time. Planting
              trees, installing solar panels, and creating sustainable
              infrastructure.
            </p>

            <div className="mb-4">
              <div className="flex justify-between mb-1 sm:mb-2">
                <span
                  className={`text-xs sm:text-sm font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                >
                  55.3%
                </span>
                <span
                  className={`text-[10px] sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  ₹8.3L of ₹15L
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "55.3%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                ></motion.div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className={`text-base sm:text-lg font-bold ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  ₹8,29,734{" "}
                  <span
                    className={`text-[10px] sm:text-sm font-normal ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    raised of ₹15L
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock
                  className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                />
                <span
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  23 days left
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <motion.img
                whileHover={{ scale: 1.1, rotate: 5 }}
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Gaurav Tiwari"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
              />
              <div>
                <p
                  className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  Gaurav Tiwari
                </p>
                <p
                  className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  Organizer
                </p>
              </div>
              <div className="ml-auto">
                <div className="flex items-center gap-1">
                  <Users
                    className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  />
                  <span
                    className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    46 donors
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-2.5 sm:py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center justify-center gap-2 text-sm"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              Support Campaign
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="relative flex items-center">
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-r from-transparent via-blue-100 to-blue-300"}`}></div>
          <div className="mx-6 flex items-center justify-center relative">
            <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`}></div>
            <div className={`w-3 h-3 rounded-full rotate-45 border-2 ${isDarkMode ? "bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white border-blue-400 shadow-sm"}`}></div>
          </div>
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-l from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-l from-transparent via-blue-100 to-blue-300"}`}></div>
        </div>
      </div>




      {/* Blog Services Banner - Centered Section */}
      {/* Blog Section Heading */}
      <div className="text-center mb-10 sm:mb-14 px-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-4">
          <span className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
            Community Voices
          </span>
        </div>
        <h2
          className={`text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-4 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"
            }`}
        >
          Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500">Stories</span>
        </h2>
        <p
          className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
        >
          Explore the voices of our community and share your own experiences
        </p>
      </div>

      {/* Blog Services Banner - Compact Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10"
      >
        <div className={`relative rounded-3xl overflow-hidden border ${isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-blue-100 shadow-xl"
          }`}>
          <div className="grid md:grid-cols-2 items-stretch min-h-[160px] md:min-h-[220px] lg:min-h-[250px]">
            {/* Text Content */}
            <div className="p-5 md:p-8 lg:p-8 flex flex-col justify-center items-center text-center space-y-4 lg:space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 lg:px-3 lg:py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
                <BookOpen className={`w-3 h-3 lg:w-4 lg:h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                <span className={`text-[9px] lg:text-[11px] font-bold tracking-wider uppercase ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  Blog Portal
                </span>
              </div>

              <h2 className={`text-xl md:text-2xl lg:text-3xl font-black leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Inspire with Your <br className="hidden lg:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Alumni Blog</span>
              </h2>

              <p className={`text-[12px] md:text-sm lg:text-base leading-relaxed max-w-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Share your journey, professional insights, and campus memories. Your experiences could be the guiding light for the next generation of students.
              </p>

              <div className="flex flex-row flex-wrap justify-center gap-2 sm:gap-4 pt-2">
                <motion.button
                  onClick={() => navigate("/blogs")}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 sm:px-6 py-2.5 lg:px-8 lg:py-3 rounded-xl border-2 font-bold text-[10px] sm:text-xs lg:text-sm shadow-md flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 whitespace-nowrap ${isDarkMode
                    ? "bg-slate-800/50 border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50"
                    : "bg-white border-blue-100 text-blue-600 hover:bg-blue-50 hover:border-blue-200"
                    }`}
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 h-4" />
                  Explore Blogs
                </motion.button>
                <motion.button
                  onClick={() => navigate("/create-blog")}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-6 py-2.5 lg:px-8 lg:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-[10px] sm:text-xs lg:text-sm font-bold shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 group whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 h-4" />
                  Create Blog
                </motion.button>


              </div>
            </div>

            {/* Image Side - Desktop only */}
            <div className="relative hidden md:block overflow-hidden">
              <img
                src="/assets/images/blog_banner.png"
                alt="Blog Service"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-900/10"></div>
            </div>

            {/* Mobile Image (Taller style) */}
            <div className="md:hidden h-64 relative overflow-hidden">
              <img
                src="/assets/images/blog_banner.png"
                alt="Blog Service"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </motion.section>



      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="relative flex items-center">
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-r from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-r from-transparent via-blue-100 to-blue-300"}`}></div>
          <div className="mx-6 flex items-center justify-center relative">
            <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isDarkMode ? "bg-blue-500" : "bg-blue-400"}`}></div>
            <div className={`w-3 h-3 rounded-full rotate-45 border-2 ${isDarkMode ? "bg-slate-900 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-white border-blue-400 shadow-sm"}`}></div>
          </div>
          <div className={`flex-grow h-px ${isDarkMode ? "bg-gradient-to-l from-transparent via-blue-500/10 to-blue-500/40" : "bg-gradient-to-l from-transparent via-blue-100 to-blue-300"}`}></div>
        </div>
      </div>
      {/* Chapters & Associations */}
      <ScrollingChapters />


      {/* Empty Parallax Scroll Section - Moved to Bottom */}
      <ParallaxImageSection />

      {/* FAQ Section */}
      <section className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Heading & Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className={`text-[10px] sm:text-xs font-semibold tracking-wider uppercase ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                Questions & Answers
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-5xl font-black leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Queries</span> <span className="hidden sm:inline">About Our Network</span>
            </h2>
            <p className={`hidden sm:block text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Everything you need to know about joining, contributing, and thriving in the MITS Alumni ecosystem. Can't find what you're looking for? Reach out to our support team.
            </p>
            <div className={`w-full max-w-md p-4 sm:p-5 rounded-2xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-blue-100 shadow-xl"}`}>
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  ?
                </div>
                <div className="text-left">
                  <h4 className={`text-sm sm:text-base font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Still have questions?</h4>
                  <p className={`text-[11px] sm:text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>We're here to help you 24/7.</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/contact-us")}
                className="mt-3 sm:mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:from-blue-600 hover:to-purple-600 border border-blue-500/20 text-blue-500 hover:text-white text-[11px] sm:text-xs font-semibold transition-all duration-300"
              >
                Contact Support
              </button>
            </div>
          </motion.div>

          {/* Right Column - FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-3 w-full"
          >
            {[
              {
                q: "How can I join the MITS Alumni Network?",
                a: "Simply click on the 'Sign Up' or 'Join Now' buttons. You'll need to provide your graduation year, department, and roll number for verification. Once verified, you'll gain full access."
              },
              {
                q: "What are the benefits of being a verified alumnus?",
                a: "Verified members can access the exclusive job board, mentor students, message other alumni directly, participate in premium events, and get special campus entry privileges."
              },
              {
                q: "How can I create an event?",
                a: "Go to the 'Events' section, create your event, and submit it. After admin approval, it will go live and users can register."
              },
              {
                q: "How can I mentor current students?",
                a: "Once logged in, head to the 'Mentorship' section in your profile. You can set your availability, expertise areas, and start accepting requests from deserving students."
              },
              {
                q: "How do I post a job opportunity?",
                a: "Alumni can post jobs directly through the 'Job Portal' section. Your posting will be visible to all verified alumni and final-year students, helping you hire from your alma mater."
              },
              {
                q: "How can I start a campaign or fundraiser?",
                a: "Create a campaign from the 'Campaigns' section. After admin verification, it will go live and users can upload payment screenshots, which are then verified."
              },
              {
                "q": "How can I create a blog?",
                "a": "Go to the 'Blogs' section and create your blog post. Once submitted, it will be reviewed and verified by the admin. After approval, the blog will be published and made accessible to all users publicly."
              }

            ].map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.q}
                answer={faq.a}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}