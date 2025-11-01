import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Users,
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  Sparkles,
  X,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Phone,
  Calendar,
  Award,
  Map as MapIcon,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function AlumniDirectory({ isDarkMode, toggleTheme }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

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
          console.log(result.data);
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

  // Missing functions - Add these
  const openModal = (alumni) => {
    setSelectedAlumni(alumni);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAlumni(null);
  };

  // City coordinates for India (Latitude, Longitude)
  const cityCoordinates = {
    Mumbai: [19.076, 72.8777],
    Delhi: [28.7041, 77.1025],
    Bangalore: [12.9716, 77.5946],
    Hyderabad: [17.385, 78.4867],
    Chennai: [13.0827, 80.2707],
    Kolkata: [22.5726, 88.3639],
    Pune: [18.5204, 73.8567],
    Ahmedabad: [23.0225, 72.5714],
    Jaipur: [26.9124, 75.7873],
    Lucknow: [26.8467, 80.9462],
    Chandigarh: [30.7333, 76.7794],
    Bhopal: [23.2599, 77.4126],
    Indore: [22.7196, 75.8577],
    Nagpur: [21.1458, 79.0882],
    Kochi: [9.9312, 76.2673],
    Gurgaon: [28.4595, 77.0266],
    Noida: [28.5355, 77.391],
    Goa: [15.2993, 74.124],
    Surat: [21.1702, 72.8311],
    Visakhapatnam: [17.6868, 83.2185],
    Gwalior: [26.2183, 78.1828],
    Kanpur: [26.4499, 80.3319],
    Patna: [25.5941, 85.1376],
    Vadodara: [22.3072, 73.1812],
    Coimbatore: [11.0168, 76.9558],
    Thiruvananthapuram: [8.5241, 76.9366],
    Mysore: [12.2958, 76.6394],
    Ranchi: [23.3441, 85.3096],
    Jabalpur: [23.1815, 79.9864],
    Raipur: [21.2514, 81.6296],
  };

  // Group alumni by location
  const getAlumniByLocation = () => {
    const locationMap = {};
    alumniData.forEach((alumni) => {
      const location = alumni.profile?.location;
      if (location) {
        const cityName = Object.keys(cityCoordinates).find((city) =>
          location.toLowerCase().includes(city.toLowerCase())
        );
        if (cityName) {
          if (!locationMap[cityName]) {
            locationMap[cityName] = [];
          }
          locationMap[cityName].push(alumni);
        }
      }
    });
    return locationMap;
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current) {
      // Load Leaflet CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        const L = window.L;

        // Initialize map centered on India
        const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

        // Add tile layer (always light theme)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map);

        const locationData = getAlumniByLocation();

        // Add markers for each city
        Object.entries(locationData).forEach(([city, alumni]) => {
          const coords = cityCoordinates[city];
          if (coords) {
            // Create custom marker with count
            const markerIcon = L.divIcon({
              className: "custom-marker",
              html: `
                <div style="
                  position: relative;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <div style="
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #8b5cf6, #ec4899);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.5);
                    border: 3px solid white;
                    cursor: pointer;
                    transition: transform 0.2s;
                  ">
                    ${alumni.length}
                  </div>
                </div>
              `,
              iconSize: [40, 40],
              iconAnchor: [20, 20],
            });

            const marker = L.marker(coords, { icon: markerIcon }).addTo(map);

            // Create popup content with alumni list
            const popupDiv = document.createElement("div");
            popupDiv.style.cssText = `
              padding: 12px;
              min-width: 250px;
              max-width: 300px;
              background: ${isDarkMode ? "#1e293b" : "#ffffff"};
              color: ${isDarkMode ? "#ffffff" : "#000000"};
              border-radius: 12px;
            `;

            popupDiv.innerHTML = `
              <h3 style="
                margin: 0 0 12px 0;
                font-size: 18px;
                font-weight: bold;
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">${city}</h3>
              <p style="margin: 8px 0; font-size: 14px; font-weight: 600;">
                <span style="color: #8b5cf6;">${
                  alumni.length
                }</span> Alumni Found
              </p>
              <div style="margin-top: 12px; max-height: 200px; overflow-y: auto;" id="alumni-list-${city}">
                ${alumni
                  .slice(0, 5)
                  .map(
                    (a, idx) => `
                  <div 
                    data-alumni-index="${idx}" 
                    style="
                      padding: 10px;
                      margin: 6px 0;
                      background: ${isDarkMode ? "#334155" : "#f1f5f9"};
                      border-radius: 8px;
                      font-size: 13px;
                      cursor: pointer;
                      transition: all 0.2s;
                    " 
                    class="alumni-card-item"
                    onmouseover="this.style.background='${
                      isDarkMode ? "#475569" : "#e2e8f0"
                    }'; this.style.transform='scale(1.02)'"
                    onmouseout="this.style.background='${
                      isDarkMode ? "#334155" : "#f1f5f9"
                    }'; this.style.transform='scale(1)'"
                  >
                    <div style="font-weight: bold; margin-bottom: 4px;">${
                      a.name
                    }</div>
                    <div style="opacity: 0.8; font-size: 12px;">${
                      a.profile?.branch || "N/A"
                    }</div>
                    ${
                      getCurrentCompany(a) !== "Not Currently Employed"
                        ? `<div style="opacity: 0.7; font-size: 11px; margin-top: 4px;">@ ${getCurrentCompany(
                            a
                          )}</div>`
                        : ""
                    }
                  </div>
                `
                  )
                  .join("")}
                ${
                  alumni.length > 5
                    ? `<div style="text-align: center; margin-top: 8px; font-size: 12px; opacity: 0.7; font-weight: 600;">+${
                        alumni.length - 5
                      } more alumni</div>`
                    : ""
                }
              </div>
            `;

            const popup = L.popup({
              maxWidth: 300,
              className: "custom-popup",
            }).setContent(popupDiv);

            marker.bindPopup(popup);

            // Add click events after popup opens
            marker.on("popupopen", () => {
              const alumniCards =
                document.querySelectorAll(".alumni-card-item");
              alumniCards.forEach((card) => {
                card.addEventListener("click", function () {
                  const index = parseInt(
                    this.getAttribute("data-alumni-index")
                  );
                  const selectedAlumniData = alumni[index];
                  if (selectedAlumniData) {
                    openModal(selectedAlumniData);
                    map.closePopup();
                  }
                });
              });
            });

            // Add hover effect
            marker.on("mouseover", function () {
              this.openPopup();
            });
          }
        });

        mapInstanceRef.current = map;
      };
      document.body.appendChild(script);
    }

    // Cleanup map on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap, alumniData, isDarkMode]);

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
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className={`px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:scale-105 flex items-center gap-2 ${
                      showMap
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent"
                        : isDarkMode
                        ? "border-pink-600 text-pink-400 hover:bg-pink-900/30"
                        : "border-pink-500 text-pink-600 hover:bg-pink-50"
                    }`}
                  >
                    <MapIcon className="w-5 h-5" />
                    {showMap ? "Hide Map" : "Show Map"}
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

              {/* MAP SECTION */}
              {showMap && (
                <div
                  className={`rounded-2xl border p-4 mb-6 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                      : "bg-white border-blue-200 shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Alumni Distribution Map
                    </h2>
                    <MapPin className="w-6 h-6 text-purple-500" />
                  </div>
                  <div
                    ref={mapRef}
                    style={{ height: "500px", borderRadius: "12px" }}
                    className="w-full"
                  ></div>
                </div>
              )}

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

      {/* Modal */}
      {showModal && selectedAlumni && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-md"
          onClick={closeModal}
        >
          <div
            className={`relative w-full max-w-6xl h-[95vh] rounded-3xl shadow-2xl border overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border-blue-500/30"
                : "bg-gradient-to-br from-white via-blue-50 to-purple-50 border-blue-200/50"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all hover:scale-110 shadow-lg ${
                isDarkMode
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

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${
            isDarkMode ? "rgba(15, 23, 42, 0.5)" : "rgba(241, 245, 249, 0.5)"
          };
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>

            <div className="custom-scrollbar h-full overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10">
              <div className="grid md:grid-cols-12 gap-6 lg:gap-8">
                {/* Left Sidebar */}
                <div className="md:col-span-4 space-y-5">
                  <div className="relative">
                    <img
                      src={
                        selectedAlumni.profilePhoto ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedAlumni.name
                        )}&size=500&background=random`
                      }
                      alt={selectedAlumni.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full object-cover shadow-lg ring-2 ring-purple-500/50 mx-auto"
                    />

                    {selectedAlumni.isVerified && (
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
                      {selectedAlumni.name}
                    </h2>
                    {getCurrentCompany(selectedAlumni) !==
                      "Not Currently Employed" && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                        <Briefcase className="w-5 h-5 text-white" />
                        <p className="text-base text-white font-medium">
                          {getCurrentDesignation(selectedAlumni)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedAlumni.profile?.location && (
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
                            {selectedAlumni.profile.location}
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedAlumni.profile?.branch && (
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
                            {selectedAlumni.profile.branch}
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
                            href={`mailto:${selectedAlumni.email}`}
                            className={
                              isDarkMode
                                ? "text-sm text-gray-300 hover:text-blue-400 break-all"
                                : "text-sm text-gray-700 hover:text-blue-600 break-all"
                            }
                          >
                            {selectedAlumni.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-green-500" />
                          <a
                            href={`tel:${selectedAlumni.phone}`}
                            className={
                              isDarkMode
                                ? "text-sm text-gray-300 hover:text-green-400"
                                : "text-sm text-gray-700 hover:text-green-600"
                            }
                          >
                            {selectedAlumni.phone}
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
                        {selectedAlumni.profile?.linkedin && (
                          <a
                            href={selectedAlumni.profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all hover:scale-110"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {selectedAlumni.profile?.github && (
                          <a
                            href={selectedAlumni.profile.github}
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
                        {selectedAlumni.profile?.twitter && (
                          <a
                            href={`https://twitter.com/${selectedAlumni.profile.twitter.replace(
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
                        {selectedAlumni.profile?.portfolio && (
                          <a
                            href={selectedAlumni.profile.portfolio}
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
                  {selectedAlumni.profile?.about && (
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
                        {selectedAlumni.profile.about}
                      </p>
                    </div>
                  )}

                  {selectedAlumni.profile?.skills &&
                    selectedAlumni.profile.skills.length > 0 && (
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
                          {selectedAlumni.profile.skills.map((skill, idx) => (
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
                    {selectedAlumni.profile?.experience &&
                      selectedAlumni.profile.experience.length > 0 && (
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
                            {selectedAlumni.profile.experience.map(
                              (exp, idx) => (
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
                                        isDarkMode
                                          ? "text-gray-400"
                                          : "text-gray-600"
                                      }
                                    >
                                      {exp.from} -{" "}
                                      {exp.current ? "Present" : exp.to}
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
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {selectedAlumni.profile?.education &&
                      selectedAlumni.profile.education.length > 0 && (
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
                            {selectedAlumni.profile.education.map(
                              (edu, idx) => (
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
                                        isDarkMode
                                          ? "text-gray-400"
                                          : "text-gray-600"
                                      }
                                    >
                                      {edu.from} - {edu.to}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full bg-green-500 text-white font-bold">
                                      GPA: {edu.gpa}
                                    </span>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {selectedAlumni.profile?.achievements &&
                    selectedAlumni.profile.achievements.length > 0 && (
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
                          {selectedAlumni.profile.achievements.map(
                            (achievement, idx) => (
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
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
