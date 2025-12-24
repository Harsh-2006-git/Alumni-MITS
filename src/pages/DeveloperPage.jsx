import { useState } from "react";
import {
  Moon,
  Sun,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Mail,
  Phone,
  Linkedin,
  Github,
  ArrowRight,
  BookOpen,
  Sparkles,
  Users,
  Building,
  Calendar,
  Trophy,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

export default function DeveloperPage({ isDarkMode, toggleTheme }) {
  // Internships data
  const internships = [
    {
      title: "Second Brain Ventures, Noida",
      role: "Full Stack Web Development Intern",
      time: "May - July 2025",
      desc: "Built full-stack web applications using MERN stack including Project Management solutions.",
      img: "https://www.startinup.up.gov.in/crm/assets/user/images/Documents/Startup/A_STARTUP_UP_UPLC_00006623/startup_logo/168993627258128.png",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
        }`}
    >
      {/* Header */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section with Enhanced Profile Box */}
      <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 text-center relative">
        <div className="max-w-4xl mx-auto">
          <div
            className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8 shadow-2xl ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 backdrop-blur-sm border border-blue-600/20"
              : "bg-gradient-to-br from-white to-blue-100/80 backdrop-blur-sm border border-blue-200 shadow-xl"
              }`}
          >
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-blue-600/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-indigo-600/10 rounded-full blur-xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
                {/* Image Section - Left */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-40 sm:w-48 sm:h-60 lg:w-60 lg:h-80 mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-cyan-500 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img
                      src="/assets/images/harsh.png"
                      alt="Harsh Manmode"
                      className="w-full h-full object-cover"
                    />
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] animate-shine"></div>
                  </div>
                </div>

                {/* Info Section - Right */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400" />
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Harsh Manmode
                    </h2>
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-cyan-400" />
                  </div>

                  <p className="text-sm sm:text-lg lg:text-xl mb-1.5 sm:mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent font-bold">
                    INFORMATION TECHNOLOGY
                  </p>
                  <p className="text-xs sm:text-base lg:text-lg font-semibold text-cyan-400 mb-4 sm:mb-6">
                    Full Stack Web Developer
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-2 sm:gap-4 lg:gap-6 mt-4 sm:mt-6 text-[10px] sm:text-sm">
                    <span
                      className={`flex items-center justify-center lg:justify-start gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full shadow-lg transition-all hover:scale-105 ${isDarkMode
                        ? "bg-blue-900/40 text-cyan-300 border border-cyan-500/30"
                        : "bg-blue-100 text-blue-700 border border-blue-300"
                        }`}
                    >
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> harshmanmode79@gmail.com
                    </span>
                    <span
                      className={`flex items-center justify-center lg:justify-start gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-full shadow-lg transition-all hover:scale-105 ${isDarkMode
                        ? "bg-indigo-900/40 text-blue-300 border border-blue-500/30"
                        : "bg-indigo-100 text-indigo-700 border border-indigo-300"
                        }`}
                    >
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> +91-8305721431
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="container mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12">
        <h3 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7" /> Education
        </h3>
        <div
          className={`max-w-4xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-8 border sm:border-2 shadow-2xl transition-all hover:shadow-xl ${isDarkMode
            ? "bg-gradient-to-br from-slate-900/80 to-emerald-900/20 border-emerald-600/20"
            : "bg-gradient-to-br from-white to-emerald-50 border-emerald-200"
            }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${isDarkMode ? "bg-slate-800/50" : "bg-emerald-100"
                }`}
            >
              <img
                src="/assets/images/mits-logo.png"
                alt="MITS Logo"
                className="w-20 h-20 sm:w-32 sm:h-32 object-contain"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-emerald-400">
                Madhav Institute of Technology & Science, Gwalior
              </h4>
              <div className="space-y-1.5 sm:space-y-2">
                <p
                  className={`text-sm sm:text-base font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  B.Tech in INFORMATION TECHNOLOGY
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs sm:text-sm font-medium">
                  <p className="text-cyan-400">Sept 2024- Jun 2028</p>
                  <p className="text-pink-400">CGPA: 8.2/10</p>
                </div>
                <div className="flex flex-col text-[10px] sm:text-xs">
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Enrolment: BTIT24O1058
                  </p>
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Department: INFORMATION & TECHNOLOGY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="container mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12">
        <h3 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
          <Award className="w-5 h-5 sm:w-7 sm:h-7" /> Key Achievements
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {[
            "Built this platform entirely from scratch, showcasing my full-stack skills",
            "Interned at Second Brain Ventures, Noida, gaining real-world experience",
            "Achieved 8.2 SGPA in 1st year at MITS, Gwalior",
            "Active Tech Member @ Google Developer Group On Campus, MITS Club",
          ].map((achieve, i) => (
            <div
              key={i}
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border sm:border-2 shadow-lg transition-all hover:scale-105 ${isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-amber-900/20 border-amber-600/20"
                  : "bg-gradient-to-br from-white to-amber-50 border-amber-200"
                }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${isDarkMode ? "bg-amber-500/20" : "bg-amber-100"
                    }`}
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                </div>
                <p className="text-sm sm:text-lg">{achieve}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Internships Section - Same width as Education */}
      <section className="container mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12">
        <h3 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
          <Briefcase className="w-5 h-5 sm:w-7 sm:h-7" /> Internship
        </h3>
        <div className="max-w-4xl mx-auto">
          {internships.map((intern, i) => (
            <div
              key={i}
              className={`rounded-2xl sm:rounded-3xl p-4 sm:p-8 border sm:border-2 shadow-xl transition-all hover:scale-105 ${isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/20 border-blue-600/20"
                  : "bg-gradient-to-br from-white to-blue-50 border-blue-200"
                }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <div
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${isDarkMode ? "bg-slate-800/50" : "bg-blue-100"
                    }`}
                >
                  <img
                    src={intern.img}
                    alt={intern.title}
                    className="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl sm:text-2xl font-bold text-blue-400 mb-1 sm:mb-2">
                    {intern.title}
                  </h4>
                  <p className="text-sm sm:text-lg text-pink-400 font-semibold mb-1">
                    {intern.role}
                  </p>
                  <p className="text-cyan-400 text-xs sm:text-lg mb-3 sm:mb-4">{intern.time}</p>
                  <p
                    className={`text-sm sm:text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                  >
                    {intern.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Enhanced Guidance Section with Consistent Circular Images */}
      <section className="container mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12">
        <h3 className="text-xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          <BookOpen className="w-5 h-5 sm:w-7 sm:h-7" /> Under the Guidance of
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
          {/* First Mentor Box */}
          <div
            className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 border sm:border-2 shadow-2xl transition-all hover:scale-105 ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-purple-900/20 border-purple-600/20"
                : "bg-gradient-to-br from-white to-purple-50 border-purple-200"
              }`}
          >
            <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-md opacity-20"></div>
                <img
                  src="https://ams.mitsgwalior.in/images/rrs.png"
                  alt="Dr. Rajni Ranjan Singh Makwana"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 sm:border-4 border-purple-500/50 relative z-10 shadow-lg"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg sm:text-2xl text-purple-400 mb-1 sm:mb-2 leading-tight">
                  Dr. Rajni Ranjan Singh
                  <br />
                  Makwana
                </h4>
                <p
                  className={`text-sm sm:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Head, Centre for Artificial Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Second Mentor Box */}
          <div
            className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 border sm:border-2 shadow-2xl transition-all hover:scale-105 ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-indigo-900/20 border-indigo-600/20"
                : "bg-gradient-to-br from-white to-indigo-50 border-indigo-200"
              }`}
          >
            <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-md opacity-20"></div>
                <img
                  src="https://ams.mitsgwalior.in/images/atul.png"
                  alt="Atul Chauhan"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 sm:border-4 border-indigo-500/50 relative z-10 shadow-lg"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg sm:text-2xl text-indigo-400 mb-1 sm:mb-2 leading-tight">
                  Atul Chauhan
                </h4>
                <p
                  className={`text-sm sm:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  Programmer, MITS-DU
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Network Section */}
      <section className="container mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12">
        <div
          className={`max-w-4xl mx-auto rounded-2xl sm:rounded-3xl p-6 sm:p-8 border sm:border-2 shadow-2xl ${isDarkMode
              ? "bg-gradient-to-br from-slate-900/80 to-indigo-900/20 border-indigo-600/20"
              : "bg-gradient-to-br from-white to-indigo-50 border-indigo-200"
            }`}
        >
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-3 sm:mb-4">
              Connect with MITS Alumni
            </h3>
            <p
              className={`text-sm sm:text-xl mb-6 sm:mb-6 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Join a network of successful professionals, share experiences, and
              grow together. Access exclusive opportunities and stay connected
              with your alma mater.
            </p>

            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6 sm:mb-8 rounded-full"></div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <button
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all hover:scale-105 ${isDarkMode
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                  }`}
              >
                Join Network →
              </button>
              <button
                className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all hover:scale-105 ${isDarkMode
                    ? "bg-slate-800 text-indigo-300 border border-indigo-500/30"
                    : "bg-white text-indigo-600 border border-indigo-300 shadow-lg"
                  }`}
              >
                Explore Events
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Users,
                number: "5000+",
                label: "Alumni",
                color: "from-blue-400 to-cyan-500",
              },
              {
                icon: Building,
                number: "500+",
                label: "Companies",
                color: "from-purple-400 to-indigo-500",
              },
              {
                icon: Calendar,
                number: "100+",
                label: "Events",
                color: "from-green-400 to-emerald-500",
              },
              {
                icon: Trophy,
                number: "50+",
                label: "Awards",
                color: "from-amber-400 to-orange-500",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${stat.color} mb-2 sm:mb-3 shadow-lg transform transition-transform group-hover:scale-110`}
                >
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div
                  className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.number}
                </div>
                <div className={`text-[10px] sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />

      {/* Custom CSS for shine animation */}
      <style>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
}
