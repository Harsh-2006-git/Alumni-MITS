import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Calendar,
  MapPin,
  Building2,
  Sparkles,
  Shield,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthPopup from "../components/AuthPopup";
import AlumniProfileModal from "../components/AlumniProfileModal";

import { useTheme } from "../context/ThemeContext";

export default function BatchmatesFinder({
  isAuthenticated,
}) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [viewMode, setViewMode] = useState("batches");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  // Fetch alumni data from API
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        // Get token for authentication check
        const storedAuth = localStorage.getItem("auth");
        let headers = {
          "Content-Type": "application/json",
        };

        if (storedAuth) {
          try {
            const authData = JSON.parse(storedAuth);
            if (authData?.accessToken) {
              headers["Authorization"] = `Bearer ${authData.accessToken}`;
            }
          } catch (e) {
            console.error("Error parsing auth data:", e);
          }
        }

        const response = await fetch(
          `${BASE_URL}/alumni/all-alumni`,
          { headers }
        );
        const result = await response.json();
        if (result.success) {
          setAlumniData(result.data);
        }
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Extract batch information from education section
  const getBatchFromEducation = (alumni) => {
    if (!alumni.profile?.education || alumni.profile.education.length === 0) {
      return null;
    }

    // Find Bachelor's degree
    const bachelorsDegree = alumni.profile.education.find(
      (edu) => edu.type && edu.type.toLowerCase().includes("bachelor")
    );

    if (bachelorsDegree) {
      // Extract batch year from the "to" date (graduation year)
      if (bachelorsDegree.to) {
        const graduationYear = new Date(bachelorsDegree.to).getFullYear();
        return graduationYear.toString();
      }
      // If no "to" date, try to extract from "from" date + typical duration
      else if (bachelorsDegree.from) {
        const startYear = new Date(bachelorsDegree.from).getFullYear();
        const graduationYear = startYear + 4; // Assuming 4-year bachelor's degree
        return graduationYear.toString();
      }
    }

    return null;
  };

  // Extract unique batches, departments and locations from education
  const batches = [
    "All Batches",
    ...new Set(
      alumniData
        .map((alumni) => getBatchFromEducation(alumni))
        .filter((batch) => batch !== null)
    ),
  ].sort((a, b) => {
    if (a === "All Batches") return -1;
    if (b === "All Batches") return 1;
    return parseInt(b) - parseInt(a); // Sort descending (newest first)
  });

  const departments = [
    "All Departments",
    ...new Set(
      alumniData
        .map((alumni) => {
          const bachelorsDegree = alumni.profile?.education?.find(
            (edu) => edu.type && edu.type.toLowerCase().includes("bachelor")
          );
          return bachelorsDegree?.stream || alumni.profile?.branch;
        })
        .filter(Boolean)
    ),
  ];

  const locations = [
    "All Locations",
    ...new Set(alumniData.map((a) => a.profile?.location).filter(Boolean)),
  ];

  // Get stream from Bachelor's degree
  const getStreamFromEducation = (alumni) => {
    const bachelorsDegree = alumni.profile?.education?.find(
      (edu) => edu.type && edu.type.toLowerCase().includes("bachelor")
    );
    return bachelorsDegree?.stream || alumni.profile?.branch || "N/A";
  };

  // Filter alumni for batchmates based on education
  const filteredAlumni = alumniData.filter((alumni) => {
    const alumniBatch = getBatchFromEducation(alumni);
    const alumniStream = getStreamFromEducation(alumni);

    if (
      searchQuery &&
      !alumni.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedBatch !== "All Batches" && alumniBatch !== selectedBatch) {
      return false;
    }
    if (
      selectedDepartment !== "All Departments" &&
      alumniStream !== selectedDepartment
    ) {
      return false;
    }
    if (
      selectedLocation !== "All Locations" &&
      alumni.profile?.location !== selectedLocation
    ) {
      return false;
    }
    return true;
  });

  // Group alumni by batch for batch boxes
  const alumniByBatch = batches
    .filter((batch) => batch !== "All Batches")
    .reduce((acc, batch) => {
      const batchAlumni = alumniData.filter(
        (alumni) => getBatchFromEducation(alumni) === batch
      );
      if (batchAlumni.length > 0) {
        acc[batch] = batchAlumni;
      }
      return acc;
    }, {});

  const getCurrentCompany = (alumni) => {
    const currentExp = alumni.profile?.experience?.find((exp) => exp.current);
    if (currentExp) return currentExp.company;

    const experiences = alumni.profile?.experience || [];
    if (experiences.length > 0) {
      return experiences[0].company || "Not Currently Employed";
    }
    return "Not Currently Employed";
  };

  const getCurrentDesignation = (alumni) => {
    const currentExp = alumni.profile?.experience?.find((exp) => exp.current);
    if (currentExp) return currentExp.designation;

    const experiences = alumni.profile?.experience || [];
    if (experiences.length > 0) {
      return experiences[0].designation || "";
    }
    return "";
  };

  const openModal = (alumni) => {
    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }
    setSelectedAlumni(alumni);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAlumni(null);
  };

  const toggleBatch = (batch) => {
    setExpandedBatch(expandedBatch === batch ? null : batch);
  };

  // Get education details for display
  const getEducationDetails = (alumni) => {
    const bachelorsDegree = alumni.profile?.education?.find(
      (edu) => edu.type && edu.type.toLowerCase().includes("bachelor")
    );

    if (bachelorsDegree) {
      return {
        batch: getBatchFromEducation(alumni),
        stream: bachelorsDegree.stream,
        institution: bachelorsDegree.institution,
        gpa: bachelorsDegree.gpa,
      };
    }

    return null;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
        }`}
    >
      <Header />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="relative z-10">
          <section className="text-center py-4 sm:py-8 lg:py-6 px-2 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400" />
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight pb-1">
                  Batchmates Finder
                </h1>
                <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400" />
              </div>

              <div className="mb-1.5 sm:mb-3">
                <p className="text-sm sm:text-xl lg:text-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold block lg:inline">
                  Find and connect with your batchmates
                </p>
                <p
                  className={`text-xs sm:text-base lg:text-xl block lg:inline lg:ml-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                  from the same graduating year and stream
                </p>
              </div>

              <div className="w-12 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full"></div>
            </div>
          </section>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p
                  className={
                    isDarkMode ? "text-white text-lg" : "text-gray-900 text-lg"
                  }
                >
                  Loading Batchmates Data...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`rounded-2xl border p-4 sm:p-6 mb-6 ${isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                  : "bg-white border-blue-200 shadow-lg"
                  }`}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                    />
                    <input
                      type="text"
                      placeholder="Search batchmates by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-purple-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
                        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                    />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("batches")}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold border-2 transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${viewMode === "batches"
                        ? isDarkMode
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "bg-purple-500 border-purple-500 text-white"
                        : isDarkMode
                          ? "border-purple-600 text-purple-400 hover:bg-purple-900/30"
                          : "border-purple-500 text-purple-600 hover:bg-purple-50"
                        }`}
                    >
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Batches</span>
                    </button>

                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold border-2 transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${viewMode === "list"
                        ? isDarkMode
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "bg-purple-500 border-purple-500 text-white"
                        : isDarkMode
                          ? "border-purple-600 text-purple-400 hover:bg-purple-900/30"
                          : "border-purple-500 text-purple-600 hover:bg-purple-50"
                        }`}
                    >
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>List</span>
                    </button>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-3 py-2.5 rounded-xl font-semibold border-2 transition-all hover:scale-105 flex items-center justify-center gap-2 md:hidden ${isDarkMode
                        ? "border-purple-600 text-purple-400 hover:bg-purple-900/30"
                        : "border-purple-500 text-purple-600 hover:bg-purple-50"
                        }`}
                    >
                      <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Sidebar Filters for Desktop */}
                  <div className="hidden md:block w-64 flex-shrink-0">
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                        >
                          <GraduationCap className="w-4 h-4 inline mr-2" />
                          Graduation Year
                        </label>
                        <select
                          value={selectedBatch}
                          onChange={(e) => setSelectedBatch(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-colors ${isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                        >
                          {batches.map((batch) => (
                            <option key={batch} value={batch}>
                              {batch === "All Batches"
                                ? "All Graduation Years"
                                : `Class of ${batch}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                        >
                          <GraduationCap className="w-4 h-4 inline mr-2" />
                          Stream/Department
                        </label>
                        <select
                          value={selectedDepartment}
                          onChange={(e) =>
                            setSelectedDepartment(e.target.value)
                          }
                          className={`w-full px-4 py-3 rounded-xl border transition-colors ${isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                        >
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                        >
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Current Location
                        </label>
                        <select
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border transition-colors ${isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                        >
                          {locations.map((location) => (
                            <option key={location} value={location}>
                              {location}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Filters */}
                  {showFilters && (
                    <div
                      className="md:hidden grid gap-4 pt-4 border-t"
                      style={{
                        borderColor: isDarkMode
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(203, 213, 225, 1)",
                      }}
                    >
                      <select
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                        className={`px-4 py-3 rounded-xl border transition-colors ${isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      >
                        {batches.map((batch) => (
                          <option key={batch} value={batch}>
                            {batch === "All Batches"
                              ? "All Graduation Years"
                              : `Class of ${batch}`}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className={`px-4 py-3 rounded-xl border transition-colors ${isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>

                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className={`px-4 py-3 rounded-xl border transition-colors ${isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      >
                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Main Content */}
                  <div className="flex-1">
                    <div
                      className="flex justify-between items-center mb-4 pb-4 border-b"
                      style={{
                        borderColor: isDarkMode
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(203, 213, 225, 1)",
                      }}
                    >
                      <p
                        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                      >
                        {viewMode === "batches" ? (
                          <>
                            Showing{" "}
                            <span className="font-bold text-purple-500">
                              {Object.keys(alumniByBatch).length}
                            </span>{" "}
                            batches
                          </>
                        ) : (
                          <>
                            Showing{" "}
                            <span className="font-bold text-purple-500">
                              {filteredAlumni.length}
                            </span>{" "}
                            batchmates
                            {selectedBatch !== "All Batches" &&
                              ` from Class of ${selectedBatch}`}
                            {selectedDepartment !== "All Departments" &&
                              ` in ${selectedDepartment}`}
                          </>
                        )}
                      </p>
                    </div>

                    {viewMode === "batches" ? (
                      // Batch Boxes View
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(alumniByBatch).map(
                          ([batch, alumniList]) => (
                            <div
                              key={batch}
                              className={`rounded-2xl border transition-all hover:shadow-xl ${isDarkMode
                                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                                : "bg-white border-blue-200 shadow-lg"
                                }`}
                            >
                              <button
                                onClick={() => toggleBatch(batch)}
                                className={`w-full p-4 text-left flex justify-between items-center ${expandedBatch === batch
                                  ? isDarkMode
                                    ? "bg-blue-900/30"
                                    : "bg-blue-50"
                                  : ""
                                  }`}
                              >
                                <div>
                                  <h3
                                    className={`font-bold text-lg ${isDarkMode
                                      ? "text-white"
                                      : "text-gray-900"
                                      }`}
                                  >
                                    Class of {batch}
                                  </h3>
                                  <p
                                    className={`text-sm ${isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                      }`}
                                  >
                                    {alumniList.length} alumni
                                  </p>
                                </div>
                                {expandedBatch === batch ? (
                                  <ChevronUp className="w-5 h-5 text-purple-500" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-purple-500" />
                                )}
                              </button>

                              {expandedBatch === batch && (
                                <div className="px-4 pb-4 max-h-60 overflow-y-auto">
                                  <div className="space-y-3">
                                    {alumniList.slice(0, 10).map((alumni) => {
                                      const educationDetails =
                                        getEducationDetails(alumni);
                                      return (
                                        <div
                                          key={alumni.id}
                                          className={`p-3 rounded-xl border transition-all hover:scale-105 cursor-pointer ${isDarkMode
                                            ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                                            }`}
                                          onClick={() => openModal(alumni)}
                                        >
                                          <div className="flex items-center gap-3">
                                            <img
                                              src={
                                                alumni.profilePhoto ||
                                                "https://i.pinimg.com/originals/a3/f4/bc/a3f4bc0dc7d1b030b782c62d7a4781cf.jpg"
                                              }
                                              alt={alumni.name}
                                              className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                              <h4
                                                className={`font-semibold text-sm truncate ${isDarkMode
                                                  ? "text-white"
                                                  : "text-gray-900"
                                                  }`}
                                              >
                                                {alumni.name}
                                              </h4>
                                              <p
                                                className={`text-xs truncate ${isDarkMode
                                                  ? "text-gray-400"
                                                  : "text-gray-600"
                                                  }`}
                                              >
                                                {educationDetails?.stream ||
                                                  "N/A"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {alumniList.length > 10 && (
                                      <div
                                        className={`text-center text-sm ${isDarkMode
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                          }`}
                                      >
                                        +{alumniList.length - 10} more alumni
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    ) : // List View
                      filteredAlumni.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                          {filteredAlumni.map((alumni) => {
                            const educationDetails = getEducationDetails(alumni);
                            const alumniBatch = getBatchFromEducation(alumni);

                            return (
                              <div
                                key={alumni.id}
                                className={`p-4 sm:p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl cursor-pointer ${isDarkMode
                                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                                  : "bg-white border-blue-200 shadow-lg"
                                  }`}
                                onClick={() => openModal(alumni)}
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={
                                        alumni.profilePhoto ||
                                        "https://i.pinimg.com/originals/a3/f4/bc/a3f4bc0dc7d1b030b782c62d7a4781cf.jpg"
                                      }
                                      alt={alumni.name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                      <h3
                                        className={`font-bold text-lg ${isDarkMode
                                          ? "text-white"
                                          : "text-gray-900"
                                          }`}
                                      >
                                        {alumni.name}
                                      </h3>
                                      {alumni.isVerified && (
                                        <span className="inline-flex items-center gap-1 text-xs text-blue-500">
                                          <Shield className="w-3 h-3" />
                                          Verified
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                  {educationDetails && (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <GraduationCap
                                          className={`w-4 h-4 ${isDarkMode
                                            ? "text-gray-500"
                                            : "text-gray-400"
                                            }`}
                                        />
                                        <span
                                          className={`text-sm ${isDarkMode
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                            }`}
                                        >
                                          Class of {alumniBatch} •{" "}
                                          {educationDetails.stream}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Building2
                                          className={`w-4 h-4 ${isDarkMode
                                            ? "text-gray-500"
                                            : "text-gray-400"
                                            }`}
                                        />
                                        <span
                                          className={`text-sm ${isDarkMode
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                            }`}
                                        >
                                          {educationDetails.institution}
                                        </span>
                                      </div>
                                    </>
                                  )}

                                  {getCurrentCompany(alumni) !==
                                    "Not Currently Employed" && (
                                      <div className="flex items-center gap-2">
                                        <Building2
                                          className={`w-4 h-4 ${isDarkMode
                                            ? "text-gray-500"
                                            : "text-gray-400"
                                            }`}
                                        />
                                        <span
                                          className={`text-sm ${isDarkMode
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                            }`}
                                        >
                                          {getCurrentDesignation(alumni)} at{" "}
                                          {getCurrentCompany(alumni)}
                                        </span>
                                      </div>
                                    )}
                                  {alumni.profile?.location && (
                                    <div className="flex items-center gap-2">
                                      <MapPin
                                        className={`w-4 h-4 ${isDarkMode
                                          ? "text-gray-500"
                                          : "text-gray-400"
                                          }`}
                                      />
                                      <span
                                        className={`text-sm ${isDarkMode
                                          ? "text-gray-300"
                                          : "text-gray-700"
                                          }`}
                                      >
                                        {alumni.profile.location}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <button className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105">
                                  View Full Profile
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div
                          className={`text-center py-20 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-xl font-semibold mb-2">
                            No batchmates found
                          </p>
                          <p className="text-sm">
                            Try adjusting your filters to find your batchmates
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Auth Popup */}
      <AuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        isDarkMode={isDarkMode}
        isAuthenticated={isAuthenticated}
      />

      {/* Profile Modal - Only show if authenticated */}
      {showModal && selectedAlumni && isAuthenticated && (
        <AlumniProfileModal
          alumni={selectedAlumni}
          onClose={closeModal}
          isDarkMode={isDarkMode}
          getCurrentCompany={getCurrentCompany}
          getCurrentDesignation={getCurrentDesignation}
          isAuthenticated={isAuthenticated}
        />
      )}

      <Footer />
    </div>
  );
}
