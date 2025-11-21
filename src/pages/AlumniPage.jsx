import { useState, useEffect } from "react";
import {
  Users,
  Briefcase,
  Building2,
  MapPin,
  Sparkles,
  Search,
  Filter,
  Map as MapIcon,
  Shield,
  GraduationCap,
  Calendar,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthPopup from "../components/AuthPopup";
import AlumniProfileModal from "../components/AlumniProfileModal";

export default function AlumniDirectory({
  isDarkMode,
  toggleTheme,
  isAuthenticated,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [showFilters, setShowFilters] = useState(false);
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  // Utility functions - defined before they're used
  const getAlumniBatch = (alumni) => {
    // Priority: profile.batch -> education array -> alumni.batch
    if (alumni.profile?.batch) return alumni.profile.batch;

    if (alumni.profile?.education?.length > 0) {
      const education = alumni.profile.education[0];
      if (education.from && education.to) {
        return `${education.from.split("-")[0]}-${education.to.split("-")[0]}`;
      }
    }

    return alumni.batch;
  };

  const getAlumniBranch = (alumni) => {
    return alumni.profile?.branch || alumni.branch || "N/A";
  };

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

  // Fetch alumni data from API
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch(
          "https://alumni-mits-l45r.onrender.com/alumni/all-alumni"
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

  // Extract unique departments, locations, and batches
  const departments = [
    "All Departments",
    ...new Set(
      alumniData
        .map((a) => a.profile?.branch || a.branch)
        .filter(Boolean)
        .sort()
    ),
  ];

  const locations = [
    "All Locations",
    ...new Set(
      alumniData
        .map((a) => a.profile?.location)
        .filter(Boolean)
        .sort()
    ),
  ];

  const batches = [
    "All Batches",
    ...new Set(
      alumniData
        .map((a) => getAlumniBatch(a))
        .filter(Boolean)
        .sort((a, b) => b.localeCompare(a)) // Sort batches in descending order (newest first)
    ),
  ];

  // Filter alumni
  const filteredAlumni = alumniData.filter((alumni) => {
    if (
      searchQuery &&
      !alumni.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      selectedDepartment !== "All Departments" &&
      (alumni.profile?.branch || alumni.branch) !== selectedDepartment
    ) {
      return false;
    }
    if (
      selectedLocation !== "All Locations" &&
      alumni.profile?.location !== selectedLocation
    ) {
      return false;
    }
    if (selectedBatch !== "All Batches") {
      const alumniBatch = getAlumniBatch(alumni);
      if (alumniBatch !== selectedBatch) {
        return false;
      }
    }
    return true;
  });

  const totalAlumni = alumniData.length;
  const employedCount = alumniData.filter(
    (a) => a.profile?.experience && a.profile.experience.length > 0
  ).length;
  const companiesCount = [
    ...new Set(
      alumniData
        .flatMap((a) => a.profile?.experience?.map((exp) => exp.company))
        .filter(Boolean)
    ),
  ].length;
  const citiesCount = [
    ...new Set(alumniData.map((a) => a.profile?.location)),
  ].filter(Boolean).length;

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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("All Departments");
    setSelectedLocation("All Locations");
    setSelectedBatch("All Batches");
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

      <section className="container mx-auto px-4 md:px-10 lg:px-16 py-0">
        <div className="relative z-10">
          <section className="text-center py-6 sm:py-8 lg:py-6 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight pb-1">
                  Alumni Directory
                </h1>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              </div>

              <div className="mb-2 sm:mb-3">
                <p className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold block lg:inline">
                  Connect with our growing community
                </p>
                <p
                  className={`text-sm sm:text-base lg:text-xl block lg:inline lg:ml-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  of {totalAlumni}+ alumni across {citiesCount} cities
                </p>
              </div>

              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full"></div>
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
                  Loading Alumni Data...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Section - Mobile Responsive */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                {[
                  {
                    label: "Total Alumni",
                    value: totalAlumni,
                    icon: Users,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    label: "With Experience",
                    value: employedCount,
                    icon: Briefcase,
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    label: "Companies",
                    value: companiesCount,
                    icon: Building2,
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    label: "Cities",
                    value: citiesCount,
                    icon: MapPin,
                    color: "from-orange-500 to-red-500",
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-3 md:p-6 rounded-xl md:rounded-2xl border transition-all hover:scale-105 hover:shadow-xl md:hover:shadow-2xl ${
                      isDarkMode
                        ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                        : "bg-white border-blue-200 shadow-md md:shadow-lg"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 md:mb-4 shadow-lg`}
                    >
                      <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                    </div>
                    <p
                      className={`text-lg md:text-3xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs md:text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className={`rounded-2xl border p-4 md:p-6 mb-6 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                    : "bg-white border-blue-200 shadow-lg"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Search alumni by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-purple-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500"
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:scale-105 flex items-center gap-2 ${
                        isDarkMode
                          ? "border-purple-600 text-purple-400 hover:bg-purple-900/30"
                          : "border-purple-500 text-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      <Filter className="w-5 h-5" />
                      Filters
                    </button>
                    <button
                      onClick={clearFilters}
                      className={`px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:scale-105 flex items-center gap-2 ${
                        isDarkMode
                          ? "border-gray-600 text-gray-400 hover:bg-gray-900/30"
                          : "border-gray-500 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div
                    className="grid md:grid-cols-3 gap-4 pt-4 border-t"
                    style={{
                      borderColor: isDarkMode
                        ? "rgba(59, 130, 246, 0.2)"
                        : "rgba(203, 213, 225, 1)",
                    }}
                  >
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className={`px-4 py-3 rounded-xl border transition-colors ${
                        isDarkMode
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
                      className={`px-4 py-3 rounded-xl border transition-colors ${
                        isDarkMode
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

                    <select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className={`px-4 py-3 rounded-xl border transition-colors ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                    >
                      {batches.map((batch) => (
                        <option key={batch} value={batch}>
                          {batch}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div
                  className="flex justify-between items-center mt-4 pt-4 border-t"
                  style={{
                    borderColor: isDarkMode
                      ? "rgba(59, 130, 246, 0.2)"
                      : "rgba(203, 213, 225, 1)",
                  }}
                >
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Showing{" "}
                    <span className="font-bold text-purple-500">
                      {filteredAlumni.length}
                    </span>{" "}
                    of {totalAlumni} alumni
                  </p>

                  {(searchQuery !== "" ||
                    selectedDepartment !== "All Departments" ||
                    selectedLocation !== "All Locations" ||
                    selectedBatch !== "All Batches") && (
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-cyan-400" : "text-blue-600"
                      }`}
                    >
                      {selectedDepartment !== "All Departments" &&
                        `${selectedDepartment} • `}
                      {selectedLocation !== "All Locations" &&
                        `${selectedLocation} • `}
                      {selectedBatch !== "All Batches" && `${selectedBatch}`}
                    </p>
                  )}
                </div>
              </div>

              {filteredAlumni.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                  {filteredAlumni.map((alumni) => (
                    <div
                      key={alumni.id}
                      className={`rounded-xl md:rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-xl md:hover:shadow-2xl cursor-pointer overflow-hidden flex flex-col md:flex-col h-full ${
                        isDarkMode
                          ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                          : "bg-white border-blue-200 shadow-md md:shadow-lg"
                      }`}
                      onClick={() => openModal(alumni)}
                    >
                      {/* Mobile Layout: Image on left with grey bg, content on right with white bg */}
                      <div className="flex flex-row md:flex-col h-full">
                        {/* Grey Background Section - Left side on mobile, top on desktop */}
                        <div className="bg-gray-100 w-24 md:w-full md:h-40 flex flex-col items-center justify-center py-3 md:py-0 relative">
                          {/* Profile Image */}
                          <div className="flex items-center justify-center mb-2 md:mb-0">
                            <img
                              src={
                                alumni.profilePhoto ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  alumni.name
                                )}&background=random&size=200`
                              }
                              alt={alumni.name}
                              className="h-16 w-16 md:h-32 md:w-32 object-cover rounded-full border-2 md:border-4 border-white shadow-lg"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  alumni.name
                                )}&background=random&size=200`;
                              }}
                            />
                          </div>

                          {/* Verified Badge - Below image on mobile, top right on desktop */}
                          {alumni.isVerified && (
                            <>
                              {/* Mobile - Below image in grey section */}
                              <div className="block md:hidden">
                                <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                                  <Shield className="w-3 h-3" />
                                  <span className="text-xs">Verified</span>
                                </div>
                              </div>

                              {/* Desktop - Top right corner */}
                              <div className="hidden md:block absolute top-3 right-3">
                                <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                                  <Shield className="w-3 h-3" />
                                  <span className="text-xs">Verified</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Content Section - Right side on mobile with white background */}
                        <div
                          className={`flex-1 p-3 md:p-6 flex flex-col bg-white md:bg-transparent ${
                            isDarkMode
                              ? "md:bg-transparent"
                              : "md:bg-transparent"
                          }`}
                        >
                          <div className="mb-2 md:mb-4 flex-1">
                            <h3
                              className={`font-bold text-sm md:text-xl mb-1 md:mb-3 md:text-center ${
                                isDarkMode
                                  ? "md:text-white text-gray-900"
                                  : "text-gray-900"
                              }`}
                            >
                              {alumni.name}
                            </h3>

                            {/* Branch Information */}
                            <div className="flex items-center gap-1 md:justify-center md:gap-2 mb-1 md:mb-3">
                              <GraduationCap
                                className={`w-3 h-3 md:w-4 md:h-4 ${
                                  isDarkMode
                                    ? "md:text-cyan-400 text-blue-600"
                                    : "text-blue-600"
                                }`}
                              />
                              <span
                                className={`text-xs md:text-sm font-medium ${
                                  isDarkMode
                                    ? "md:text-cyan-400 text-blue-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {getAlumniBranch(alumni)}
                              </span>
                            </div>

                            {/* Batch Information */}
                            {getAlumniBatch(alumni) && (
                              <div className="flex items-center gap-1 md:justify-center md:gap-2 mb-2 md:mb-4">
                                <Calendar
                                  className={`w-3 h-3 md:w-4 md:h-4 ${
                                    isDarkMode
                                      ? "md:text-green-400 text-green-600"
                                      : "text-green-600"
                                  }`}
                                />
                                <span
                                  className={`text-xs md:text-sm font-medium ${
                                    isDarkMode
                                      ? "md:text-green-400 text-green-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {getAlumniBatch(alumni)}
                                </span>
                              </div>
                            )}

                            <div className="space-y-1.5 md:space-y-3">
                              {getCurrentCompany(alumni) !==
                                "Not Currently Employed" && (
                                <div className="md:text-center">
                                  <div className="flex items-center gap-1 md:justify-center md:gap-2 mb-0.5 md:mb-1">
                                    <Building2
                                      className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ${
                                        isDarkMode
                                          ? "md:text-gray-400 text-gray-500"
                                          : "text-gray-500"
                                      }`}
                                    />
                                    <span
                                      className={`text-xs md:text-sm font-semibold ${
                                        isDarkMode
                                          ? "md:text-gray-300 text-gray-700"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {getCurrentDesignation(alumni)}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-xs md:text-sm ${
                                      isDarkMode
                                        ? "md:text-gray-400 text-gray-600"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    at {getCurrentCompany(alumni)}
                                  </span>
                                </div>
                              )}

                              {alumni.profile?.location && (
                                <div className="flex items-center gap-1 md:justify-center md:gap-2">
                                  <MapPin
                                    className={`w-3 h-3 md:w-4 md:h-4 flex-shrink-0 ${
                                      isDarkMode
                                        ? "md:text-gray-400 text-gray-500"
                                        : "text-gray-500"
                                    }`}
                                  />
                                  <span
                                    className={`text-xs md:text-sm ${
                                      isDarkMode
                                        ? "md:text-gray-300 text-gray-700"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {alumni.profile.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Fixed bottom button */}
                          <div className="mt-auto pt-2 md:pt-4">
                            <button className="w-full px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-xs md:text-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg">
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className={`text-center py-20 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-semibold mb-2">No alumni found</p>
                  <p className="text-sm">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
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

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
