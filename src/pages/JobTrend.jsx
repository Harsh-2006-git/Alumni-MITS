import { useState, useEffect } from "react";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  MapPin,
  Clock,
  BookOpen,
  Target,
  Briefcase,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle,
  Play,
  Bookmark,
  Share2,
  Download,
  Filter,
  Search,
  Server,
  Layers,
  Shield,
  Brain,
  Database,
  Cpu,
  Settings,
  Code,
  Globe,
  Lock,
  CircuitBoard,
  BarChart,
  Workflow,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

// Toast Component (reuse from your existing code)
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-20 right-4 z-[100] bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-md animate-slideIn`}
    >
      <CheckCircle className="w-5 h-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/20 rounded transition-colors"
      >
        <span className="w-4 h-4">×</span>
      </button>
    </div>
  );
};

// Enhanced Hero Section
const HeroSection = ({ isDarkMode }) => {
  return (
    <section className="text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight pb-1">
            Job Market Analysis
          </h1>
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </div>

        <p className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
          Insights, Trends & Career Guidance
        </p>

        <p
          className={`text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-3xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Comprehensive analysis of current job market trends, salary insights,
          and detailed career paths for tech domains
        </p>

        <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-6 sm:mb-8"></div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div
            className={`p-4 rounded-xl border ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">15.2%</div>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Job Growth
            </p>
          </div>
          <div
            className={`p-4 rounded-xl border ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">₹12.5L</div>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Avg Salary
            </p>
          </div>
          <div
            className={`p-4 rounded-xl border ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">45K+</div>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Open Roles
            </p>
          </div>
          <div
            className={`p-4 rounded-xl border ${
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-500">8.2/10</div>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Market Score
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Market Trends Section with Charts
const MarketTrendsSection = ({ isDarkMode }) => {
  const trendsData = [
    { name: "AI/ML", growth: 35, salary: "₹18.2L", demand: "Very High" },
    { name: "Cybersecurity", growth: 28, salary: "₹16.8L", demand: "High" },
    { name: "Data Science", growth: 25, salary: "₹15.5L", demand: "High" },
    { name: "DevOps", growth: 22, salary: "₹14.2L", demand: "High" },
    { name: "Full Stack", growth: 18, salary: "₹12.8L", demand: "Medium" },
    { name: "Backend", growth: 15, salary: "₹11.5L", demand: "Medium" },
    { name: "Frontend", growth: 12, salary: "₹10.2L", demand: "Medium" },
  ];

  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Current Market Trends
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Real-time insights into technology job market dynamics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Growth Chart */}
          <div
            className={`p-6 rounded-xl border ${
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200 shadow-lg"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <TrendingUp className="w-5 h-5 text-green-500" />
              Domain Growth Rate (%)
            </h3>
            <div className="space-y-4">
              {trendsData.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span
                    className={`font-medium w-24 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {trend.name}
                  </span>
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-3 rounded-full ${
                        isDarkMode ? "bg-slate-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        style={{ width: `${trend.growth}%` }}
                      ></div>
                    </div>
                  </div>
                  <span
                    className={`font-bold w-16 text-right ${
                      trend.growth > 25 ? "text-green-500" : "text-blue-500"
                    }`}
                  >
                    {trend.growth}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Salary & Demand */}
          <div
            className={`p-6 rounded-xl border ${
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200 shadow-lg"
            }`}
          >
            <h3
              className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <DollarSign className="w-5 h-5 text-green-500" />
              Salary & Demand Analysis
            </h3>
            <div className="space-y-4">
              {trendsData.map((trend, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {trend.name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        trend.demand === "Very High"
                          ? "bg-red-500 text-white"
                          : trend.demand === "High"
                          ? "bg-orange-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {trend.demand}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Avg Salary
                    </span>
                    <span
                      className={`font-bold ${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      {trend.salary}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Domain Card Component
const DomainCard = ({ domain, isDarkMode, onSelect }) => {
  return (
    <div
      className={`p-6 rounded-xl border transition-all cursor-pointer hover:scale-105 ${
        isDarkMode
          ? "bg-slate-900 border-slate-700 hover:border-slate-600"
          : "bg-white border-gray-200 shadow-sm hover:shadow-md"
      }`}
      onClick={() => onSelect(domain)}
    >
      <div
        className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center bg-gradient-to-r ${domain.color}`}
      >
        <domain.icon className="w-6 h-6 text-white" />
      </div>

      <h3
        className={`text-lg font-semibold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {domain.name}
      </h3>

      <p
        className={`text-sm mb-4 ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {domain.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isDarkMode
                ? "bg-blue-900/40 text-blue-300"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {domain.demand}
          </span>
          <span
            className={`text-xs font-bold ${
              domain.growth > 25 ? "text-green-500" : "text-blue-500"
            }`}
          >
            +{domain.growth}%
          </span>
        </div>
        <ArrowRight
          className={`w-4 h-4 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        />
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, percentage, color, isDarkMode }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span
          className={`text-sm font-medium ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </span>
        <span
          className={`text-sm font-bold ${
            percentage > 70
              ? "text-green-500"
              : percentage > 40
              ? "text-blue-500"
              : "text-orange-500"
          }`}
        >
          {percentage}%
        </span>
      </div>
      <div
        className={`h-2 rounded-full ${
          isDarkMode ? "bg-slate-700" : "bg-gray-200"
        }`}
      >
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Domain Detail Modal
const DomainDetailModal = ({ domain, isOpen, onClose, isDarkMode }) => {
  if (!isOpen || !domain) return null;

  const marketMetrics = [
    {
      label: "Market Demand",
      value: domain.demandScore || 85,
      color: "bg-green-500",
    },
    {
      label: "Salary Range",
      value: domain.salaryScore || 78,
      color: "bg-blue-500",
    },
    { label: "Growth Potential", value: domain.growth, color: "bg-purple-500" },
    {
      label: "Entry Barrier",
      value: domain.entryBarrier || 65,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-[90vw] h-[90vh] sm:w-full sm:max-w-4xl sm:h-auto sm:max-h-[90vh] overflow-hidden rounded-xl border ${
          isDarkMode
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        } shadow-2xl transform transition-all duration-300`}
      >
        {/* Header - Sticky */}
        <div
          className={`sticky top-0 z-10 p-4 sm:p-6 border-b backdrop-blur-lg ${
            isDarkMode
              ? "bg-slate-900/95 border-slate-700"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${domain.color}`}
              >
                <domain.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {domain.name}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Career Path & Market Analysis
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              <span className="w-5 h-5">×</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(90vh-80px)] sm:h-[calc(90vh-88px)] overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Market Metrics */}
            <section>
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <BarChart className="w-5 h-5 text-blue-500" />
                Market Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {marketMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <ProgressBar
                      label={metric.label}
                      percentage={metric.value}
                      color={metric.color}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Overview */}
            <section>
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <BookOpen className="w-5 h-5 text-blue-500" />
                Overview
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {domain.overview}
              </p>
            </section>

            {/* Skills Required */}
            <section>
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Target className="w-5 h-5 text-green-500" />
                Skills Required
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {domain.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {skill}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Learning Roadmap */}
            <section>
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Learning Roadmap
              </h3>
              <div className="space-y-4">
                {domain.roadmap.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isDarkMode
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold mb-2 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {step.description}
                        </p>
                        <div className="mt-3">
                          <ProgressBar
                            label="Completion"
                            percentage={Math.min(100, (index + 1) * 25)}
                            color="bg-gradient-to-r from-cyan-500 to-blue-600"
                            isDarkMode={isDarkMode}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How to Get Job/Intern */}
            <section>
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Briefcase className="w-5 h-5 text-orange-500" />
                How to Get Job/Intern
              </h3>
              <div className="space-y-3">
                {domain.jobTips.map((tip, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function JobMarketAnalysis({ isDarkMode, toggleTheme }) {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message });
  };

  const closeToast = () => {
    setToast(null);
  };

  const domains = [
    {
      name: "Frontend",
      icon: Globe,
      description: "Building user interfaces and client-side applications",
      demand: "High",
      growth: 12,
      demandScore: 82,
      salaryScore: 75,
      entryBarrior: 60,
      color: "from-blue-500 to-cyan-500",
      overview:
        "Frontend development focuses on creating the user interface and user experience of web applications. It involves working with technologies that run in the browser and ensuring responsive, accessible, and performant web applications.",
      skills: [
        "HTML5 & CSS3",
        "JavaScript (ES6+)",
        "React.js/Vue.js/Angular",
        "Responsive Design",
        "CSS Frameworks (Tailwind, Bootstrap)",
        "State Management",
        "Web Performance",
        "Browser APIs",
      ],
      roadmap: [
        {
          title: "Fundamentals",
          description:
            "Learn HTML, CSS, JavaScript basics and Git version control",
        },
        {
          title: "Framework Mastery",
          description:
            "Choose a framework (React, Vue, Angular) and build projects",
        },
        {
          title: "Advanced Concepts",
          description: "State management, performance optimization, testing",
        },
        {
          title: "Specialization",
          description:
            "Choose areas like animation, accessibility, or specific frameworks",
        },
      ],
      jobTips: [
        "Build a strong portfolio with diverse projects",
        "Contribute to open source projects",
        "Master responsive design and cross-browser compatibility",
        "Learn modern build tools and package managers",
        "Practice coding challenges and system design",
      ],
    },
    {
      name: "Backend",
      icon: Server,
      description: "Server-side development and database management",
      demand: "High",
      growth: 15,
      demandScore: 85,
      salaryScore: 80,
      entryBarrior: 70,
      color: "from-green-500 to-emerald-500",
      overview:
        "Backend development involves server-side logic, database management, and API development. It ensures data is processed, stored, and delivered efficiently to frontend applications.",
      skills: [
        "Node.js/Python/Java",
        "RESTful APIs",
        "Database Design (SQL/NoSQL)",
        "Authentication & Authorization",
        "Server Management",
        "Caching Strategies",
        "Message Queues",
        "Microservices",
      ],
      roadmap: [
        {
          title: "Programming Language",
          description: "Master one backend language (Node.js, Python, Java)",
        },
        {
          title: "Database Knowledge",
          description: "Learn SQL and NoSQL databases, ORM/ODM",
        },
        {
          title: "API Development",
          description: "Build RESTful APIs, understand HTTP protocols",
        },
        {
          title: "Architecture",
          description: "Learn microservices, cloud deployment, DevOps basics",
        },
      ],
      jobTips: [
        "Build complete applications with both frontend and backend",
        "Understand database optimization and indexing",
        "Learn about security best practices",
        "Gain experience with cloud platforms (AWS, GCP, Azure)",
        "Practice system design and scalability",
      ],
    },
    {
      name: "Full Stack",
      icon: Layers,
      description: "End-to-end web application development",
      demand: "Very High",
      growth: 18,
      demandScore: 90,
      salaryScore: 85,
      entryBarrior: 75,
      color: "from-purple-500 to-pink-500",
      overview:
        "Full stack developers work on both frontend and backend aspects of web applications. They understand the complete development process from UI design to database management.",
      skills: [
        "Frontend Frameworks",
        "Backend Technologies",
        "Database Management",
        "Version Control",
        "DevOps Basics",
        "API Integration",
        "Testing",
        "Deployment",
      ],
      roadmap: [
        {
          title: "Frontend Foundation",
          description: "Master HTML, CSS, JavaScript and a frontend framework",
        },
        {
          title: "Backend Skills",
          description: "Learn server-side programming and databases",
        },
        {
          title: "Integration",
          description: "Connect frontend and backend, build full applications",
        },
        {
          title: "Advanced Topics",
          description: "Learn deployment, DevOps, and advanced architecture",
        },
      ],
      jobTips: [
        "Build multiple full-stack projects for your portfolio",
        "Understand both client-side and server-side performance",
        "Learn about different deployment strategies",
        "Stay updated with both frontend and backend trends",
        "Practice end-to-end testing and debugging",
      ],
    },
    {
      name: "Cybersecurity",
      icon: Shield,
      description: "Protecting systems and networks from digital attacks",
      demand: "Very High",
      growth: 28,
      demandScore: 88,
      salaryScore: 82,
      entryBarrior: 80,
      color: "from-red-500 to-orange-500",
      overview:
        "Cybersecurity focuses on protecting computer systems, networks, and data from digital attacks. It involves implementing security measures and responding to security breaches.",
      skills: [
        "Network Security",
        "Cryptography",
        "Vulnerability Assessment",
        "Incident Response",
        "Security Tools",
        "Risk Management",
        "Ethical Hacking",
        "Compliance Standards",
      ],
      roadmap: [
        {
          title: "Fundamentals",
          description:
            "Learn networking, operating systems, and basic security concepts",
        },
        {
          title: "Security Tools",
          description: "Master security tools and penetration testing",
        },
        {
          title: "Specialization",
          description:
            "Choose network security, application security, or forensics",
        },
        {
          title: "Advanced Defense",
          description:
            "Learn advanced threat detection and response strategies",
        },
      ],
      jobTips: [
        "Get security certifications (CEH, CISSP, Security+)",
        "Practice on platforms like HackTheBox or TryHackMe",
        "Participate in bug bounty programs",
        "Stay updated with latest security threats and vulnerabilities",
        "Build a home lab for hands-on practice",
      ],
    },
    {
      name: "AI",
      icon: Brain,
      description: "Artificial Intelligence and intelligent systems",
      demand: "Very High",
      growth: 35,
      demandScore: 92,
      salaryScore: 88,
      entryBarrior: 85,
      color: "from-indigo-500 to-purple-500",
      overview:
        "Artificial Intelligence involves creating intelligent machines that can perform tasks typically requiring human intelligence. It includes machine learning, natural language processing, and computer vision.",
      skills: [
        "Python Programming",
        "Machine Learning",
        "Deep Learning",
        "Neural Networks",
        "Data Analysis",
        "Statistics",
        "TensorFlow/PyTorch",
        "NLP/Computer Vision",
      ],
      roadmap: [
        {
          title: "Mathematics Foundation",
          description:
            "Learn linear algebra, calculus, statistics, and probability",
        },
        {
          title: "Programming & ML Basics",
          description: "Master Python and basic machine learning algorithms",
        },
        {
          title: "Deep Learning",
          description: "Study neural networks, deep learning frameworks",
        },
        {
          title: "Specialization",
          description:
            "Choose NLP, computer vision, reinforcement learning, etc.",
        },
      ],
      jobTips: [
        "Build and deploy ML models on platforms like Kaggle",
        "Contribute to open source AI projects",
        "Stay updated with research papers and new techniques",
        "Build a portfolio of diverse AI projects",
        "Network with AI communities and attend conferences",
      ],
    },
    {
      name: "Data Science",
      icon: Database,
      description: "Extracting insights from complex data sets",
      demand: "High",
      growth: 25,
      demandScore: 85,
      salaryScore: 80,
      entryBarrior: 75,
      color: "from-teal-500 to-blue-500",
      overview:
        "Data Science combines statistics, programming, and domain knowledge to extract meaningful insights from data. It involves data analysis, visualization, and predictive modeling.",
      skills: [
        "Python/R Programming",
        "Statistics & Probability",
        "Data Visualization",
        "Machine Learning",
        "SQL & Databases",
        "Big Data Tools",
        "Data Wrangling",
        "Business Acumen",
      ],
      roadmap: [
        {
          title: "Programming & Statistics",
          description: "Learn Python/R and statistical analysis",
        },
        {
          title: "Data Manipulation",
          description: "Master data cleaning, visualization, and SQL",
        },
        {
          title: "Machine Learning",
          description: "Apply ML algorithms to real datasets",
        },
        {
          title: "Advanced Topics",
          description: "Learn big data tools and deployment",
        },
      ],
      jobTips: [
        "Build a portfolio with diverse data analysis projects",
        "Participate in Kaggle competitions",
        "Learn to communicate insights effectively to stakeholders",
        "Gain domain knowledge in specific industries",
        "Stay updated with latest data tools and techniques",
      ],
    },
    {
      name: "Machine Learning",
      icon: Cpu,
      description: "Algorithms that learn from data patterns",
      demand: "Very High",
      growth: 32,
      demandScore: 90,
      salaryScore: 85,
      entryBarrior: 82,
      color: "from-purple-500 to-red-500",
      overview:
        "Machine Learning focuses on developing algorithms that can learn from and make predictions on data. It's a subset of AI that enables computers to learn without explicit programming.",
      skills: [
        "Python Programming",
        "ML Algorithms",
        "Deep Learning",
        "Model Evaluation",
        "Feature Engineering",
        "MLOps",
        "Cloud ML Services",
        "Mathematics",
      ],
      roadmap: [
        {
          title: "Fundamentals",
          description: "Learn Python, statistics, and basic ML concepts",
        },
        {
          title: "Algorithm Mastery",
          description: "Understand and implement various ML algorithms",
        },
        {
          title: "Deep Learning",
          description: "Study neural networks and advanced architectures",
        },
        {
          title: "Production",
          description: "Learn model deployment and MLOps practices",
        },
      ],
      jobTips: [
        "Build end-to-end ML projects from data collection to deployment",
        "Master model evaluation and hyperparameter tuning",
        "Learn about different ML deployment strategies",
        "Stay current with research in ML conferences",
        "Practice on real-world datasets and problems",
      ],
    },
    {
      name: "DevOps",
      icon: Workflow,
      description: "Streamlining development and operations",
      demand: "High",
      growth: 22,
      demandScore: 83,
      salaryScore: 78,
      entryBarrior: 70,
      color: "from-orange-500 to-yellow-500",
      overview:
        "DevOps combines software development and IT operations to shorten the development lifecycle while delivering features, fixes, and updates frequently in close alignment with business objectives.",
      skills: [
        "Linux/Unix",
        "Containerization (Docker)",
        "CI/CD Pipelines",
        "Cloud Platforms",
        "Infrastructure as Code",
        "Monitoring & Logging",
        "Scripting",
        "Networking",
      ],
      roadmap: [
        {
          title: "OS & Scripting",
          description: "Master Linux and scripting languages (Bash, Python)",
        },
        {
          title: "Containerization",
          description: "Learn Docker and container orchestration (Kubernetes)",
        },
        {
          title: "Cloud & CI/CD",
          description:
            "Master cloud services and continuous integration/deployment",
        },
        {
          title: "Advanced DevOps",
          description: "Learn infrastructure as code and advanced monitoring",
        },
      ],
      jobTips: [
        "Get hands-on with major cloud platforms (AWS, Azure, GCP)",
        "Build complete CI/CD pipelines for sample projects",
        "Learn infrastructure as code tools like Terraform",
        "Get relevant certifications (AWS, Kubernetes, Docker)",
        "Practice troubleshooting and performance optimization",
      ],
    },
  ];

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setShowDomainModal(true);
  };

  const closeDomainModal = () => {
    setShowDomainModal(false);
    setSelectedDomain(null);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Enhanced Hero Section */}
      <HeroSection isDarkMode={isDarkMode} />

      {/* Market Trends Section */}
      <MarketTrendsSection isDarkMode={isDarkMode} />

      {/* Domains Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className={`text-3xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Tech Domains Analysis
            </h2>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Detailed career paths, skills, and opportunities in each
              technology domain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain, index) => (
              <DomainCard
                key={index}
                domain={domain}
                isDarkMode={isDarkMode}
                onSelect={handleDomainSelect}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Domain Detail Modal */}
      {showDomainModal && (
        <DomainDetailModal
          domain={selectedDomain}
          isOpen={showDomainModal}
          onClose={closeDomainModal}
          isDarkMode={isDarkMode}
        />
      )}

      {toast && <Toast message={toast.message} onClose={closeToast} />}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
