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
  const [showFilters, setShowFilters] = useState(false);
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  // Fetch alumni data from API
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch("http://localhost:3001/alumni/all-alumni");
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

  // Extract unique departments and locations
  const departments = [
    "All Departments",
    ...new Set(alumniData.map((a) => a.profile?.branch).filter(Boolean)),
  ];

  const locations = [
    "All Locations",
    ...new Set(alumniData.map((a) => a.profile?.location).filter(Boolean)),
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
      alumni.profile?.branch !== selectedDepartment
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

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <section className="container mx-auto px-10 lg:px-16 py-0">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  {
                    label: "Total Alumni",
                    value: totalAlumni,
                    icon: Users,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    label: "Alumni with Experience",
                    value: employedCount,
                    icon: Briefcase,
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    label: "Different Companies",
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
                    className={`p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl ${
                      isDarkMode
                        ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                        : "bg-white border-blue-200 shadow-lg"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p
                      className={`text-3xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className={`rounded-2xl border p-6 mb-6 ${
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
                </div>

                {showFilters && (
                  <div
                    className="grid md:grid-cols-2 gap-4 pt-4 border-t"
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
                </div>
              </div>

              {filteredAlumni.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredAlumni.map((alumni) => (
                    <div
                      key={alumni.id}
                      className={`p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl cursor-pointer ${
                        isDarkMode
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
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                alumni.name
                              )}&background=random`
                            }
                            alt={alumni.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3
                              className={`font-bold text-lg ${
                                isDarkMode ? "text-white" : "text-gray-900"
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
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {alumni.profile?.branch || alumni.branch || "N/A"}
                        </p>
                        {getCurrentCompany(alumni) !==
                          "Not Currently Employed" && (
                          <div className="flex items-center gap-2">
                            <Building2
                              className={`w-4 h-4 ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
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
                              className={`w-4 h-4 ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {alumni.profile.location}
                            </span>
                          </div>
                        )}
                      </div>

                      <button className="w-full px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105">
                        View Full Profile
                      </button>
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
