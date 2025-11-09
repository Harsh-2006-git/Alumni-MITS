import React, { useState } from "react";
import {
  Plus,
  Github,
  Users,
  Tag,
  ExternalLink,
  Search,
  X,
  Upload,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Code,
  Sparkles,
  Lightbulb,
  Target,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

export default function ProjectHub({ isDarkMode, toggleTheme }) {
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Projects data
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI Resume Scanner",
      shortDesc:
        "Automated resume parsing and job matching using machine learning",
      detailedDesc:
        "A comprehensive tool that uses Natural Language Processing to extract key information from resumes and intelligently match candidates with relevant job postings. The system analyzes skills, experience, and qualifications to provide accurate recommendations.",
      techStack: ["Python", "TensorFlow", "React", "MongoDB"],
      category: "Open Source",
      lookingForContributors: true,
      contributorsNeeded: 3,
      roles: ["Backend Dev", "ML Engineer", "Frontend Dev"],
      repoLink: "https://github.com/example/ai-resume",
      contactLink: "https://discord.gg/example",
      visibility: "Public",
      tags: ["AI", "Machine Learning", "Career"],
      thumbnail:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400",
      guidelines:
        "Please follow the coding standards mentioned in CONTRIBUTING.md. All PRs must include tests.",
      author: "John Doe",
      authorType: "Alumni",
    },
    {
      id: 2,
      title: "Campus Event Manager",
      shortDesc:
        "Centralized platform for organizing and managing campus events",
      detailedDesc:
        "A full-stack web application designed to streamline event management across campus. Features include event creation, ticketing, attendee tracking, and real-time notifications.",
      techStack: ["Node.js", "React", "PostgreSQL", "Socket.io"],
      category: "Hackathon Project",
      lookingForContributors: true,
      contributorsNeeded: 2,
      roles: ["UI/UX Designer", "Backend Dev"],
      repoLink: "https://github.com/example/event-manager",
      contactLink: "",
      visibility: "Public",
      tags: ["Events", "Web App", "Social"],
      thumbnail:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
      guidelines: "",
      author: "Jane Smith",
      authorType: "Student",
    },
  ]);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    detailedDesc: "",
    techStack: [],
    category: "Open Source",
    lookingForContributors: true,
    contributorsNeeded: "",
    roles: [],
    repoLink: "",
    contactLink: "",
    visibility: "Public",
    tags: [],
    thumbnail: "",
    guidelines: "",
    author: "Current User",
    authorType: "Student",
  });

  const [currentInput, setCurrentInput] = useState({
    tech: "",
    role: "",
    tag: "",
  });

  // Constants
  const categories = [
    "All",
    "Open Source",
    "Research",
    "Startup Idea",
    "Hackathon Project",
  ];

  const techOptions = [
    "React",
    "Node.js",
    "Python",
    "MongoDB",
    "TensorFlow",
    "Django",
    "Java",
    "C++",
    "Go",
    "Docker",
    "PostgreSQL",
    "Express",
    "Vue.js",
    "Angular",
  ];

  // Functions
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addArrayItem = (field, value) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));

      // Clear the appropriate input field
      const inputFieldMap = {
        techStack: "tech",
        roles: "role",
        tags: "tag",
      };

      setCurrentInput((prev) => ({
        ...prev,
        [inputFieldMap[field]]: "",
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      ...formData,
      id: projects.length + 1,
      contributorsNeeded: formData.contributorsNeeded
        ? parseInt(formData.contributorsNeeded)
        : null,
    };

    setProjects([...projects, newProject]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      shortDesc: "",
      detailedDesc: "",
      techStack: [],
      category: "Open Source",
      lookingForContributors: true,
      contributorsNeeded: "",
      roles: [],
      repoLink: "",
      contactLink: "",
      visibility: "Public",
      tags: [],
      thumbnail: "",
      guidelines: "",
      author: "Current User",
      authorType: "Student",
    });
    setCurrentInput({ tech: "", role: "", tag: "" });
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      filterCategory === "All" || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // View project details
  const viewProjectDetails = (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
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

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Code className="w-8 h-8 text-cyan-400" />
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Collaborate & Innovate
            </h2>
            <Lightbulb className="w-8 h-8 text-indigo-400" />
          </div>
          <p
            className={`text-lg lg:text-xl mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Share your projects, find contributors, and build amazing things
            together
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create New Project
          </button>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container mx-auto px-6 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div
              className={`flex-1 relative ${
                isDarkMode ? "bg-slate-900/50" : "bg-white"
              } rounded-xl border-2 ${
                isDarkMode ? "border-blue-600/20" : "border-blue-200"
              }`}
            >
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search projects, tags, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "text-white placeholder-gray-400"
                    : "text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                    filterCategory === cat
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                      : isDarkMode
                      ? "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-700"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container mx-auto px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-2xl ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                    : "bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg"
                }`}
              >
                {project.thumbnail && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-cyan-400 flex-1">
                      {project.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.authorType === "Alumni"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {project.authorType}
                    </span>
                  </div>
                  <p
                    className={`text-sm mb-4 line-clamp-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {project.shortDesc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          isDarkMode
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          isDarkMode
                            ? "bg-slate-700 text-gray-300"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {project.lookingForContributors && (
                    <div
                      className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
                        isDarkMode
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-green-50 border border-green-200"
                      }`}
                    >
                      <Users className="w-4 h-4 text-green-400" />
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-green-300" : "text-green-700"
                        }`}
                      >
                        Looking for {project.contributorsNeeded} contributors
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {project.repoLink && (
                      <a
                        href={project.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isDarkMode
                            ? "bg-slate-800 hover:bg-slate-700 text-gray-200"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                      >
                        <Github className="w-4 h-4" />
                        View
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProject(project);
                        setShowDetailModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all"
                    >
                      <Target className="w-4 h-4" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <Code
                className={`w-16 h-16 mx-auto mb-4 ${
                  isDarkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <p
                className={`text-xl ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No projects found. Be the first to create one!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={`w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 to-blue-900/30 border-blue-600/20"
                : "bg-gradient-to-br from-white to-blue-50 border-blue-200"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`sticky top-0 z-10 border-b ${
                isDarkMode
                  ? "bg-slate-900/95 border-blue-600/20 backdrop-blur"
                  : "bg-white/95 border-blue-200 backdrop-blur"
              }`}
            >
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
                      {selectedProject.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                          selectedProject.authorType === "Alumni"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {selectedProject.authorType}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                          isDarkMode
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {selectedProject.category}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1 ${
                          selectedProject.visibility === "Public"
                            ? isDarkMode
                              ? "bg-green-500/20 text-green-300"
                              : "bg-green-100 text-green-700"
                            : isDarkMode
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {selectedProject.visibility === "Public" ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {selectedProject.visibility}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                      isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-200"
                    }`}
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content - Two Column Layout for Desktop */}
            <div className="p-4 md:p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Thumbnail - Smaller for Desktop */}
                  {selectedProject.thumbnail && (
                    <div className="rounded-2xl overflow-hidden">
                      <img
                        src={selectedProject.thumbnail}
                        alt={selectedProject.title}
                        className="w-full h-48 md:h-56 object-cover"
                      />
                    </div>
                  )}

                  {/* Overview */}
                  <div>
                    <h3
                      className={`text-lg md:text-xl font-bold mb-3 ${
                        isDarkMode ? "text-cyan-400" : "text-blue-700"
                      }`}
                    >
                      Overview
                    </h3>
                    <p
                      className={`text-sm md:text-base ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {selectedProject.shortDesc}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h3
                      className={`text-lg md:text-xl font-bold mb-3 ${
                        isDarkMode ? "text-cyan-400" : "text-blue-700"
                      }`}
                    >
                      Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold ${
                            isDarkMode
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-blue-100 text-blue-700 border border-blue-300"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedProject.tags.length > 0 && (
                    <div>
                      <h3
                        className={`text-lg md:text-xl font-bold mb-3 ${
                          isDarkMode ? "text-cyan-400" : "text-blue-700"
                        }`}
                      >
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag, i) => (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                              isDarkMode
                                ? "bg-purple-500/20 text-purple-300"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Author Info */}
                  <div
                    className={`p-4 rounded-xl border-2 ${
                      isDarkMode
                        ? "bg-slate-800/30 border-blue-600/20"
                        : "bg-blue-50/50 border-blue-200"
                    }`}
                  >
                    <p
                      className={`text-xs md:text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Posted by{" "}
                      <span className="font-semibold text-cyan-400">
                        {selectedProject.author}
                      </span>{" "}
                      ({selectedProject.authorType})
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Detailed Description */}
                  <div>
                    <h3
                      className={`text-lg md:text-xl font-bold mb-3 ${
                        isDarkMode ? "text-cyan-400" : "text-blue-700"
                      }`}
                    >
                      Detailed Description
                    </h3>
                    <div
                      className={`p-4 rounded-xl border-2 max-h-64 overflow-y-auto ${
                        isDarkMode
                          ? "bg-slate-800/30 border-blue-600/20"
                          : "bg-blue-50/50 border-blue-200"
                      }`}
                    >
                      <p
                        className={`text-sm md:text-base leading-relaxed whitespace-pre-line ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {selectedProject.detailedDesc}
                      </p>
                    </div>
                  </div>

                  {/* Contributors Section */}
                  {selectedProject.lookingForContributors && (
                    <div
                      className={`p-4 md:p-6 rounded-2xl border-2 ${
                        isDarkMode
                          ? "bg-gradient-to-br from-green-900/20 to-emerald-900/10 border-green-600/20"
                          : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                        <h3 className="text-lg md:text-xl font-bold text-green-400">
                          Looking for Contributors
                        </h3>
                      </div>

                      {selectedProject.contributorsNeeded && (
                        <p
                          className={`text-sm md:text-base mb-4 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <span className="font-semibold text-green-400">
                            {selectedProject.contributorsNeeded}
                          </span>{" "}
                          contributors needed
                        </p>
                      )}

                      {selectedProject.roles.length > 0 && (
                        <div>
                          <p
                            className={`text-xs md:text-sm font-semibold mb-2 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Expected Roles:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.roles.map((role, i) => (
                              <span
                                key={i}
                                className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                                  isDarkMode
                                    ? "bg-green-500/20 text-green-300"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contribution Guidelines */}
                  {selectedProject.guidelines && (
                    <div>
                      <h3
                        className={`text-lg md:text-xl font-bold mb-3 ${
                          isDarkMode ? "text-cyan-400" : "text-blue-700"
                        }`}
                      >
                        Contribution Guidelines
                      </h3>
                      <div
                        className={`p-4 rounded-xl border-2 max-h-48 overflow-y-auto ${
                          isDarkMode
                            ? "bg-slate-800/30 border-blue-600/20"
                            : "bg-blue-50/50 border-blue-200"
                        }`}
                      >
                        <p
                          className={`text-sm md:text-base leading-relaxed whitespace-pre-line ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {selectedProject.guidelines}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 pt-4">
                    {selectedProject.repoLink && (
                      <a
                        href={selectedProject.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                          isDarkMode
                            ? "bg-slate-800 hover:bg-slate-700 text-gray-200"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                      >
                        <Github className="w-5 h-5" />
                        View Repository
                      </a>
                    )}
                    {selectedProject.contactLink && (
                      <a
                        href={selectedProject.contactLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Join Discussion
                      </a>
                    )}
                    {!selectedProject.contactLink &&
                      selectedProject.lookingForContributors && (
                        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all">
                          <Users className="w-5 h-5" />
                          Express Interest
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 to-blue-900/30 border-blue-600/20"
                : "bg-gradient-to-br from-white to-blue-50 border-blue-200"
            }`}
          >
            <div
              className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
                isDarkMode
                  ? "bg-slate-900/95 border-blue-600/20 backdrop-blur"
                  : "bg-white/95 border-blue-200 backdrop-blur"
              }`}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Create New Project
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-200"
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Project Title */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-cyan-400" : "text-blue-700"
                  }`}
                >
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., AI-Powered Resume Scanner"
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                      : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Short Description */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-cyan-400" : "text-blue-700"
                  }`}
                >
                  Short Description * (100-200 characters)
                </label>
                <textarea
                  name="shortDesc"
                  required
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  placeholder="Brief summary of your project..."
                  maxLength={200}
                  rows={2}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                      : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {formData.shortDesc.length}/200 characters
                </p>
              </div>

              {/* Detailed Description */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-cyan-400" : "text-blue-700"
                  }`}
                >
                  Detailed Description / README *
                </label>
                <textarea
                  name="detailedDesc"
                  required
                  value={formData.detailedDesc}
                  onChange={handleInputChange}
                  placeholder="Full details about your project, goals, inspiration..."
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                      : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-cyan-400" : "text-blue-700"
                  }`}
                >
                  Tech Stack / Skills Required *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentInput.tech}
                    onChange={(e) =>
                      setCurrentInput((prev) => ({
                        ...prev,
                        tech: e.target.value,
                      }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArrayItem("techStack", currentInput.tech);
                      }
                    }}
                    placeholder="Type and press Enter..."
                    className={`flex-1 px-4 py-2 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                        : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem("techStack", currentInput.tech)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        isDarkMode
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeArrayItem("techStack", i)}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {techOptions
                    .filter((t) => !formData.techStack.includes(t))
                    .slice(0, 8)
                    .map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => addArrayItem("techStack", tech)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          isDarkMode
                            ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        + {tech}
                      </button>
                    ))}
                </div>
              </div>

              {/* Category & Contributors */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-cyan-400" : "text-blue-700"
                    }`}
                  >
                    Project Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-slate-800/50 border-blue-600/20 text-white"
                        : "bg-white border-blue-200 text-gray-900"
                    }`}
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-cyan-400" : "text-blue-700"
                    }`}
                  >
                    Looking for Contributors? *
                  </label>
                  <div className="flex items-center gap-4 h-[50px]">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          lookingForContributors: true,
                        }))
                      }
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        formData.lookingForContributors
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                          : isDarkMode
                          ? "bg-slate-800/50 text-gray-400 border border-slate-700"
                          : "bg-gray-200 text-gray-600 border border-gray-300"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          lookingForContributors: false,
                        }))
                      }
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        !formData.lookingForContributors
                          ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
                          : isDarkMode
                          ? "bg-slate-800/50 text-gray-400 border border-slate-700"
                          : "bg-gray-200 text-gray-600 border border-gray-300"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Contributor Details */}
              {formData.lookingForContributors && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? "text-cyan-400" : "text-blue-700"
                      }`}
                    >
                      Number of Contributors Needed
                    </label>
                    <input
                      type="number"
                      name="contributorsNeeded"
                      min="1"
                      value={formData.contributorsNeeded}
                      onChange={handleInputChange}
                      placeholder="e.g., 3"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                          : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? "text-cyan-400" : "text-blue-700"
                      }`}
                    >
                      Expected Roles
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentInput.role}
                        onChange={(e) =>
                          setCurrentInput((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addArrayItem("roles", currentInput.role);
                          }
                        }}
                        placeholder="e.g., Frontend Dev"
                        className={`flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode
                            ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                            : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => addArrayItem("roles", currentInput.role)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.roles.map((role, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            isDarkMode
                              ? "bg-green-500/20 text-green-300"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {role}
                          <button
                            type="button"
                            onClick={() => removeArrayItem("roles", i)}
                            className="hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Repo Link & Contact */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-cyan-400" : "text-blue-700"
                    }`}
                  >
                    GitHub / GitLab Repository Link *
                  </label>
                  <div className="relative">
                    <LinkIcon
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <input
                      type="url"
                      name="repoLink"
                      required
                      value={formData.repoLink}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username/repo"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                          : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-cyan-400" : "text-blue-700"
                    }`}
                  >
                    Contact / Communication Link
                  </label>
                  <div className="relative">
                    <ExternalLink
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <input
                      type="url"
                      name="contactLink"
                      value={formData.contactLink}
                      onChange={handleInputChange}
                      placeholder="Discord, Slack, WhatsApp group..."
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                          : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Visibility & Tags */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-cyan-400" : "text-blue-700"
                    }`}
                  >
                    Visibility *
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: "Public",
                        }))
                      }
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        formData.visibility === "Public"
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                          : isDarkMode
                          ? "bg-slate-800/50 text-gray-400 border border-slate-700"
                          : "bg-gray-200 text-gray-600 border border-gray-300"
                      }`}
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: "Private",
                        }))
                      }
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        formData.visibility === "Private"
                          ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                          : isDarkMode
                          ? "bg-slate-800/50 text-gray-400 border border-slate-700"
                          : "bg-gray-200 text-gray-600 border border-gray-300"
                      }`}
                    >
                      Private
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? "text-cyan-400" : "text-blue-700"
                    }`}
                  >
                    Tags / Keywords
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentInput.tag}
                      onChange={(e) =>
                        setCurrentInput((prev) => ({
                          ...prev,
                          tag: e.target.value,
                        }))
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addArrayItem("tags", currentInput.tag);
                        }
                      }}
                      placeholder="e.g., AI, Web Dev"
                      className={`flex-1 px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                          : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => addArrayItem("tags", currentInput.tag)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          isDarkMode
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeArrayItem("tags", i)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-cyan-400" : "text-blue-700"
                  }`}
                >
                  Thumbnail / Cover Image URL
                </label>
                <div className="relative">
                  <Upload
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="url"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                        : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
              </div>

              {/* Contribution Guidelines */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-cyan-400" : "text-blue-700"
                  }`}
                >
                  Contribution Guidelines
                </label>
                <textarea
                  name="guidelines"
                  value={formData.guidelines}
                  onChange={handleInputChange}
                  placeholder="How to contribute, coding style, PR process..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-slate-800/50 border-blue-600/20 text-white placeholder-gray-400"
                      : "bg-white border-blue-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    isDarkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-gray-300"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
