import { useState } from "react";
import {
  Users,
  Target,
  BookOpen,
  Award,
  Sparkles,
  Building,
  Globe,
  Heart,
  Lightbulb,
  TrendingUp,
  UserCheck,
  Handshake,
  Briefcase,
  GraduationCap,
  FileText,
  FlaskConical,
  DollarSign,
  Calendar,
  Eye,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

export default function AboutPage({ isDarkMode, toggleTheme }) {
  const [activeSection, setActiveSection] = useState("history");

  const sections = {
    history: {
      title: "Our Rich History",
      icon: Building,
      color: "from-blue-400 to-cyan-500",
      content: {
        paragraphs: [
          "Madhav Institute of Technology and Science (MITS) Gwalior, established in 1957, has a rich history of academic excellence and notable contributions to various fields. In 2024, the institute was declared a 'Deemed to be University' under the Distinct Category by the Ministry of Education, Government of India.",
          "Over the decades, MITS has evolved into a premier technical institution, fostering innovation, research, and academic excellence. The institute's journey from a regional engineering college to a deemed university reflects its unwavering commitment to quality education and technological advancement.",
        ],
      },
    },
    vision: {
      title: "Vision & Mission",
      icon: Eye,
      color: "from-purple-400 to-indigo-500",
      content: {
        vision: {
          title: "Vision",
          text: "To create world class quality Engineers and Technocrats capable of providing leadership in all spheres of life and society",
        },
        mission: {
          title: "Mission",
          points: [
            "To provide quality education in technical and allied disciplines.",
            "To organize and arrange innovative courses in Engineering and Technology.",
            "To arrange vocational courses in the upcoming fields and innovative subjects to meet global advancement.",
            "To promote research in the fields of Technology and Science.",
          ],
        },
      },
    },
    aiic: {
      title: "Alumni & Industry Interaction Cell",
      icon: Handshake,
      color: "from-green-400 to-emerald-500",
      content: {
        intro:
          "The AIIC at MITS serves as a bridge connecting our alumni network with current students and industry partners, creating a vibrant ecosystem of knowledge exchange and professional growth.",
        initiatives: [
          {
            icon: Users,
            title: "Alumni Relations",
            text: "Strengthening connections between the institute and its alumni through engagement programs, networking events, and communication channels.",
          },
          {
            icon: Briefcase,
            title: "Institute-Industry Partnerships",
            text: "Collaborating with industries to enhance academic curricula, research opportunities, and practical training for students.",
          },
          {
            icon: FileText,
            title: "MoUs/Collaborative Projects",
            text: "Establishing formal agreements with industries and institutions for joint initiatives, research projects, and skill development programs.",
          },
          {
            icon: FlaskConical,
            title: "Joint Research Collaborations",
            text: "Encouraging research partnerships between faculty, students, and industry professionals to solve real-world problems and innovate new technologies.",
          },
          {
            icon: GraduationCap,
            title: "Corporate Training",
            text: "Conducting training programs led by industry professionals to equip students and faculty with the latest skills and knowledge in emerging fields.",
          },
          {
            icon: Heart,
            title: "Corporate Social Responsibility",
            text: "Partnering with companies to undertake social initiatives, such as community development, environmental sustainability, and educational support programs.",
          },
          {
            icon: DollarSign,
            title: "Funding and Scholarships",
            text: "Facilitating financial aid, merit-based scholarships, and sponsorships through alumni and corporate contributions to support students in need.",
          },
          {
            icon: Calendar,
            title: "Alumni & Industry Meets",
            text: "Organizing events where alumni share their experiences, industry experts provide insights, and students gain career guidance and inspiration.",
          },
        ],
      },
    },
    leadership: {
      title: "Meet Our Leadership",
      icon: UserCheck,
      color: "from-amber-400 to-orange-500",
      content: {
        intro:
          "Our institution is guided by visionaries who bring decades of experience in academia, research, and industry collaboration.",
        administration: [
          {
            name: "Shrimant Jyotiraditya M. Scindia",
            role: "Chancellor",
            category: "University Administration",
          },
          {
            name: "Prof. K. K. Aggarwal",
            role: "Pro-Chancellor",
            category: "University Administration",
          },
          {
            name: "Dr. Rajindra Kumar Pandit",
            role: "Vice-Chancellor",
            category: "University Administration",
          },
        ],
        deans: [
          {
            name: "Dr. Akhilesh Tiwari",
            role: "Dean, Academics",
          },
          {
            name: "Dr. Manish Dixit",
            role: "Dean, Public Relations",
          },
          {
            name: "Dr. Manjaree Pandit",
            role: "Dean, Faculty of Engineering & Technology",
          },
          {
            name: "Dr. R. S. Jadon",
            role: "Dean, Students Administration",
          },
          {
            name: "Dr. P. K. Singhal",
            role: "Dean, Quality Assurance",
          },
          {
            name: "Mr. Vikram Singh Rajput",
            role: "Head, T&P Cell",
          },
        ],
      },
    },
  };

  const renderContent = () => {
    const section = sections[activeSection];

    if (activeSection === "history") {
      return (
        <div className="space-y-6">
          {section.content.paragraphs.map((para, index) => (
            <p
              key={index}
              className={`text-lg leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {para}
            </p>
          ))}

          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div
              className={`p-8 rounded-2xl border-2 transition-all hover:scale-105 ${
                isDarkMode
                  ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-600/20"
                  : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-8 h-8 text-blue-400" />
                <h4 className="text-2xl font-bold text-blue-400">1957</h4>
              </div>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Established as a premier technical institution
              </p>
            </div>

            <div
              className={`p-8 rounded-2xl border-2 transition-all hover:scale-105 ${
                isDarkMode
                  ? "bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border-cyan-600/20"
                  : "bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-8 h-8 text-cyan-400" />
                <h4 className="text-2xl font-bold text-cyan-400">2024</h4>
              </div>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                Declared "Deemed to be University" under Distinct Category
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "vision") {
      return (
        <div className="space-y-8">
          <div
            className={`p-8 rounded-2xl border-2 ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border-purple-600/20"
                : "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-purple-400" />
              <h4 className="text-2xl font-bold text-purple-400">
                {section.content.vision.title}
              </h4>
            </div>
            <p
              className={`text-lg leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {section.content.vision.text}
            </p>
          </div>

          <div
            className={`p-8 rounded-2xl border-2 ${
              isDarkMode
                ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border-indigo-600/20"
                : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-indigo-400" />
              <h4 className="text-2xl font-bold text-indigo-400">
                {section.content.mission.title}
              </h4>
            </div>
            <ul className="space-y-4">
              {section.content.mission.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full mt-1 ${
                      isDarkMode ? "bg-indigo-500/20" : "bg-indigo-100"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p
                    className={`text-lg flex-1 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (activeSection === "aiic") {
      return (
        <div className="space-y-8">
          <p
            className={`text-lg leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {section.content.intro}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {section.content.initiatives.map((initiative, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900/80 to-emerald-900/20 border-emerald-600/20"
                    : "bg-gradient-to-br from-white to-emerald-50 border-emerald-200"
                }`}
              >
                <div
                  className={`inline-flex p-3 rounded-full mb-4 ${
                    isDarkMode ? "bg-emerald-500/20" : "bg-emerald-100"
                  }`}
                >
                  <initiative.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold text-emerald-400 mb-2">
                  {initiative.title}
                </h4>
                <p
                  className={`text-base ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {initiative.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeSection === "leadership") {
      return (
        <div className="space-y-10">
          <p
            className={`text-lg leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {section.content.intro}
          </p>

          {/* University Administration */}
          <div>
            <h4 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" />
              University Administration
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              {section.content.administration.map((member, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-6 border-2 shadow-lg transition-all hover:scale-105 text-center ${
                    isDarkMode
                      ? "bg-gradient-to-br from-slate-900/80 to-amber-900/20 border-amber-600/20"
                      : "bg-gradient-to-br from-white to-amber-50 border-amber-200"
                  }`}
                >
                  <div
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      isDarkMode ? "bg-amber-500/20" : "bg-amber-100"
                    }`}
                  >
                    <UserCheck className="w-10 h-10 text-amber-400" />
                  </div>
                  <h5 className="font-bold text-lg text-amber-400 mb-2">
                    {member.name}
                  </h5>
                  <p
                    className={`text-base font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Deans */}
          <div>
            <h4 className="text-2xl font-bold text-orange-400 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Academic Deans
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.content.deans.map((dean, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-6 border-2 shadow-lg transition-all hover:scale-105 text-center ${
                    isDarkMode
                      ? "bg-gradient-to-br from-slate-900/80 to-orange-900/20 border-orange-600/20"
                      : "bg-gradient-to-br from-white to-orange-50 border-orange-200"
                  }`}
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      isDarkMode ? "bg-orange-500/20" : "bg-orange-100"
                    }`}
                  >
                    <BookOpen className="w-8 h-8 text-orange-400" />
                  </div>
                  <h5 className="font-bold text-base text-orange-400 mb-2">
                    {dean.name}
                  </h5>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {dean.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="container mx-auto px-8 lg:px-12 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              About MITS Alumni
            </h1>
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-xl lg:text-2xl mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            Connecting Generations, Building Futures
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="container mx-auto px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(sections).map(([key, section]) => {
              const Icon = section.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    activeSection === key
                      ? isDarkMode
                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg scale-105`
                        : `bg-gradient-to-r ${section.color} text-white shadow-lg scale-105`
                      : isDarkMode
                      ? "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div
            className={`rounded-3xl p-8 lg:p-12 border-2 shadow-2xl transition-all ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 backdrop-blur-sm border-blue-600/20"
                : "bg-gradient-to-br from-white to-blue-100/80 backdrop-blur-sm border-blue-200 shadow-xl"
            }`}
          >
            <div className="flex items-center gap-3 mb-8">
              {(() => {
                const Icon = sections[activeSection].icon;
                return (
                  <Icon
                    className="w-8 h-8 text-transparent bg-gradient-to-r"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                    }}
                  />
                );
              })()}
              <h2
                className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${sections[activeSection].color} bg-clip-text text-transparent`}
              >
                {sections[activeSection].title}
              </h2>
            </div>

            {renderContent()}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
