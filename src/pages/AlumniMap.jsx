import { useState, useEffect, useRef } from "react";
import { MapPin, Sparkles, Users, Building2, Briefcase } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthPopup from "../components/AuthPopup";
import AlumniProfileModal from "../components/AlumniProfileModal";

export default function AlumniMap({
  isDarkMode,
  toggleTheme,
  isAuthenticated,
}) {
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Fetch alumni data from API
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch(
          "https://alumni-mits-backend.onrender.com/alumni/all-alumni"
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

  const totalAlumni = alumniData.length;
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

  // City coordinates for India
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
    if (mapRef.current && !mapInstanceRef.current && alumniData.length > 0) {
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
  }, [alumniData, isDarkMode]);

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
                  Alumni Map
                </h1>
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              </div>

              <div className="mb-2 sm:mb-3">
                <p className="text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold block lg:inline">
                  Discover our alumni network across
                </p>
                <p
                  className={`text-sm sm:text-base lg:text-xl block lg:inline lg:ml-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {citiesCount} cities worldwide
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
                  Alumni Map
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span
                      className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                    >
                      {totalAlumni} Alumni
                    </span>
                  </div>
                  <MapPin className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div
                ref={mapRef}
                style={{ height: "600px", borderRadius: "12px" }}
                className="w-full"
              ></div>
            </div>
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
