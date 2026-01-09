import {
  X,
  Shield,
  Users,
  Briefcase,
  Award,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function AlumniProfileModal({
  alumni,
  onClose,
  getCurrentCompany,
  getCurrentDesignation,
  isAuthenticated, // Add this prop
}) {
  const { isDarkMode } = useTheme();
  // Add authentication check - if not authenticated, don't render the modal
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-6xl h-[95vh] rounded-3xl shadow-2xl border overflow-hidden ${isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border-blue-500/30"
          : "bg-gradient-to-br from-white via-blue-50 to-purple-50 border-blue-200/50"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all hover:scale-110 shadow-lg ${isDarkMode
            ? "bg-slate-800/80 hover:bg-slate-700"
            : "bg-white/80 hover:bg-gray-100"
            }`}
        >
          <X
            className={
              isDarkMode ? "w-6 h-6 text-white" : "w-6 h-6 text-gray-700"
            }
          />
        </button>

        <div className="custom-scrollbar h-full overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10">
          <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <div className="md:col-span-4 space-y-5">
              <div className="relative">
                <img
                  src={
                    alumni.profilePhoto ||
                    "https://i.pinimg.com/originals/a3/f4/bc/a3f4bc0dc7d1b030b782c62d7a4781cf.jpg"
                  }
                  alt={alumni.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full object-cover shadow-lg ring-2 ring-purple-500/50 mx-auto"
                />

                {alumni.isVerified && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg flex items-center gap-2">
                    <Shield className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-semibold">
                      Verified
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center md:text-left">
                <h2
                  className={
                    isDarkMode
                      ? "text-3xl md:text-4xl font-bold mb-3 text-white"
                      : "text-3xl md:text-4xl font-bold mb-3 text-gray-900"
                  }
                >
                  {alumni.name}
                </h2>
                {getCurrentCompany(alumni) !== "Not Currently Employed" && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                    <Briefcase className="w-5 h-5 text-white" />
                    <p className="text-base text-white font-medium">
                      {getCurrentDesignation(alumni)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {alumni.profile?.location && (
                  <div
                    className={
                      isDarkMode
                        ? "p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                        : "p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <span
                        className={
                          isDarkMode
                            ? "text-base text-gray-200"
                            : "text-base text-gray-800"
                        }
                      >
                        {alumni.profile.location}
                      </span>
                    </div>
                  </div>
                )}

                {alumni.profile?.branch && (
                  <div
                    className={
                      isDarkMode
                        ? "p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                        : "p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <span
                        className={
                          isDarkMode
                            ? "text-base text-gray-200"
                            : "text-base text-gray-800"
                        }
                      >
                        {alumni.profile.branch}
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className={
                    isDarkMode
                      ? "p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                      : "p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                  }
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <a
                        href={`mailto:${alumni.email}`}
                        className={
                          isDarkMode
                            ? "text-sm text-gray-300 hover:text-blue-400 break-all"
                            : "text-sm text-gray-700 hover:text-blue-600 break-all"
                        }
                      >
                        {alumni.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-green-500" />
                      <a
                        href={`tel:${alumni.phone}`}
                        className={
                          isDarkMode
                            ? "text-sm text-gray-300 hover:text-green-400"
                            : "text-sm text-gray-700 hover:text-green-600"
                        }
                      >
                        {alumni.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className={
                    isDarkMode
                      ? "p-4 rounded-xl bg-slate-800/50 border border-slate-700"
                      : "p-4 rounded-xl bg-white border border-gray-200 shadow-sm"
                  }
                >
                  <p
                    className={
                      isDarkMode
                        ? "text-sm mb-3 text-gray-400 font-medium"
                        : "text-sm mb-3 text-gray-500 font-medium"
                    }
                  >
                    Connect
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {alumni.profile?.linkedin && (
                      <a
                        href={alumni.profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-110"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {alumni.profile?.github && (
                      <a
                        href={alumni.profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          isDarkMode
                            ? "p-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white transition-all hover:scale-110"
                            : "p-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-all hover:scale-110"
                        }
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {alumni.profile?.twitter && (
                      <a
                        href={`https://twitter.com/${alumni.profile.twitter.replace(
                          "@",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-all hover:scale-110"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {alumni.profile?.portfolio && (
                      <a
                        href={alumni.profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all hover:scale-110"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="md:col-span-8 space-y-5">
              {alumni.profile?.about && (
                <div
                  className={
                    isDarkMode
                      ? "p-5 rounded-2xl bg-slate-800/50 border border-slate-700"
                      : "p-5 rounded-2xl bg-white border border-gray-200 shadow-sm"
                  }
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3
                      className={
                        isDarkMode
                          ? "text-xl font-bold text-white"
                          : "text-xl font-bold text-gray-900"
                      }
                    >
                      About
                    </h3>
                  </div>
                  <p
                    className={
                      isDarkMode
                        ? "text-base text-gray-300 leading-relaxed"
                        : "text-base text-gray-700 leading-relaxed"
                    }
                  >
                    {alumni.profile.about}
                  </p>
                </div>
              )}

              {alumni.profile?.skills && alumni.profile.skills.length > 0 && (
                <div
                  className={
                    isDarkMode
                      ? "p-5 rounded-2xl bg-slate-800/50 border border-slate-700"
                      : "p-5 rounded-2xl bg-white border border-gray-200 shadow-sm"
                  }
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3
                      className={
                        isDarkMode
                          ? "text-xl font-bold text-white"
                          : "text-xl font-bold text-gray-900"
                      }
                    >
                      Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {alumni.profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-md hover:scale-105 transition-transform"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
                {alumni.profile?.experience &&
                  alumni.profile.experience.length > 0 && (
                    <div
                      className={
                        isDarkMode
                          ? "p-5 rounded-2xl bg-slate-800/50 border border-slate-700"
                          : "p-5 rounded-2xl bg-white border border-gray-200 shadow-sm"
                      }
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-orange-500">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <h3
                          className={
                            isDarkMode
                              ? "text-xl font-bold text-white"
                              : "text-xl font-bold text-gray-900"
                          }
                        >
                          Experience
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {alumni.profile.experience.map((exp, idx) => (
                          <div
                            key={idx}
                            className={
                              isDarkMode
                                ? "p-4 rounded-xl bg-slate-900/50 border border-slate-800"
                                : "p-4 rounded-xl bg-gray-50 border border-gray-200"
                            }
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4
                                className={
                                  isDarkMode
                                    ? "text-base font-bold text-white"
                                    : "text-base font-bold text-gray-900"
                                }
                              >
                                {exp.designation}
                              </h4>
                              {exp.current && (
                                <span className="px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                                  NOW
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-purple-500 font-semibold mb-2">
                              {exp.company}
                            </p>
                            <div className="flex items-center gap-2 text-xs mb-2">
                              <Calendar
                                className={
                                  isDarkMode
                                    ? "w-4 h-4 text-gray-400"
                                    : "w-4 h-4 text-gray-500"
                                }
                              />
                              <span
                                className={
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {exp.from} - {exp.current ? "Present" : exp.to}
                              </span>
                            </div>
                            <p
                              className={
                                isDarkMode
                                  ? "text-sm text-gray-300"
                                  : "text-sm text-gray-700"
                              }
                            >
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {alumni.profile?.education &&
                  alumni.profile.education.length > 0 && (
                    <div
                      className={
                        isDarkMode
                          ? "p-5 rounded-2xl bg-slate-800/50 border border-slate-700"
                          : "p-5 rounded-2xl bg-white border border-gray-200 shadow-sm"
                      }
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-green-500">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <h3
                          className={
                            isDarkMode
                              ? "text-xl font-bold text-white"
                              : "text-xl font-bold text-gray-900"
                          }
                        >
                          Education
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {alumni.profile.education.map((edu, idx) => (
                          <div
                            key={idx}
                            className={
                              isDarkMode
                                ? "p-4 rounded-xl bg-slate-900/50 border border-slate-800"
                                : "p-4 rounded-xl bg-gray-50 border border-gray-200"
                            }
                          >
                            <h4
                              className={
                                isDarkMode
                                  ? "text-base font-bold text-white mb-1"
                                  : "text-base font-bold text-gray-900 mb-1"
                              }
                            >
                              {edu.type} in {edu.stream}
                            </h4>
                            <p className="text-sm text-purple-500 font-semibold mb-2">
                              {edu.institution}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span
                                className={
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {edu.from} - {edu.to}
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-green-500 text-white font-bold">
                                GPA: {edu.gpa}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {alumni.profile?.achievements &&
                alumni.profile.achievements.length > 0 && (
                  <div
                    className={
                      isDarkMode
                        ? "p-5 rounded-2xl bg-slate-800/50 border border-slate-700"
                        : "p-5 rounded-2xl bg-white border border-gray-200 shadow-sm"
                    }
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-yellow-500">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <h3
                        className={
                          isDarkMode
                            ? "text-xl font-bold text-white"
                            : "text-xl font-bold text-gray-900"
                        }
                      >
                        Achievements
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {alumni.profile.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span
                            className={
                              isDarkMode
                                ? "text-sm text-gray-300"
                                : "text-sm text-gray-700"
                            }
                          >
                            {achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
