import React, { useState, useMemo } from "react";
import { Sparkles, Search } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

const alumni = [
  {
    name: "Dr. Vijay Kumar Saraswat",
    image: "assets/AlumniImages/Prominent-Alumni-1.webp",
    post: "Member, NITI Aayog",
    description:
      "Serving as a key member in India's national policy think-tank and strategic planning body.",
    city: "Delhi",
  },
  {
    name: "Shri S.K. Jain",
    image: "assets/AlumniImages/Prominent-Alumni-2.webp",
    post: "Former Chairman, Nuclear Power Corporation of India",
    description:
      "Led India's nuclear power generation operations and safety management.",
    city: "Mumbai",
  },
  {
    name: "Dr. R K Shevgaonkar",
    image: "assets/AlumniImages/Prominent-Alumni-3.webp",
    post: "Former Director, IIT Delhi",
    description: "Served as the administrative and academic head of IIT Delhi.",
    city: "Delhi",
  },
  {
    name: "Prof. Abhay Karandikar",
    image: "assets/AlumniImages/Prominent-Alumni-4.webp",
    post: "Secretary, Department of Science & Technology (DST)",
    description:
      "Oversees national science and technology policies and research programs.",
    city: "Delhi",
  },
  {
    name: "Shri Vimal Kaushik",
    image: "assets/AlumniImages/Prominent-Alumni-5.webp",
    post: "Former CEO & MD, IL&FS Engineering",
    description:
      "Managed large-scale infrastructure and engineering projects across India.",
    city: "Mumbai",
  },
  {
    name: "Shri Anil Kumar Lahoti",
    image: "assets/AlumniImages/Prominent-Alumni-6.webp",
    post: "Chairman, Telecom Regulatory Authority of India (TRAI)",
    description:
      "Responsible for regulating telecommunications and digital communication services in India.",
    city: "Delhi",
  },
  {
    name: "Shri Sudhir Saxena",
    image: "assets/AlumniImages/SS.png",
    post: "DGP of Madhya Pradesh",
    description:
      "Leads the police force and oversees law enforcement operations in Madhya Pradesh.",
    city: "Bhopal",
  },
  {
    name: "Shri Ishan Shankar",
    image: "assets/AlumniImages/Prominent-Alumni-7.webp",
    post: "Former Chairman Advisory Board, Enginuity Pvt. Ltd.",
    description:
      "Provided strategic guidance in engineering and industrial solutions.",
    city: "Mumbai",
  },
  {
    name: "Shri Sanjay Dubey",
    image: "assets/AlumniImages/new.png",
    post: "Principal Secretary, Energy & Renewable Energy, Govt. of MP",
    description:
      "Responsible for planning and administration of renewable and energy projects in Madhya Pradesh.",
    city: "Bhopal",
  },
  {
    name: "Shri R K Khandelwal",
    image: "assets/AlumniImages/new2.png",
    post: "Secretary, National Commission, Ministry of Social Justice & Empowerment",
    description:
      "Oversees initiatives related to social welfare and empowerment programs.",
    city: "Delhi",
  },
  {
    name: "Shri Sanjay Choudhary",
    image: "assets/AlumniImages/SC.png",
    post: "Former Director General of Police - Public Prosecution, MP",
    description:
      "Supervised legal proceedings and prosecution processes within the police department.",
    city: "Bhopal",
  },
  {
    name: "Er. Ramesh Agrawal",
    image: "assets/AlumniImages/ERA.png",
    post: "Former MLA, Gwalior",
    description:
      "Represented the Gwalior constituency and participated in legislative activities.",
    city: "Gwalior",
  },
  {
    name: "Dr. R. K. Saxena",
    image: "assets/AlumniImages/RKSS.png",
    post: "Former Director, SGSITS Indore",
    description:
      "Led one of the leading engineering and technology institutes in Central India.",
    city: "Indore",
  },
  {
    name: "Er. Lokesh Saxena",
    image: "assets/AlumniImages/Prominent-Alumni-8.webp",
    post: "Managing Director, DISA India Limited",
    description:
      "Heads operations and business strategies for a leading industrial equipment manufacturer.",
    city: "Indore",
  },
  {
    name: "Shri Narendra Nahata",
    image: "assets/AlumniImages/Prominent-Alumni-9.webp",
    post: "Former Minister of Commerce & Industry, Govt. of MP",
    description:
      "Handled industrial development and commercial policy-making in the state.",
    city: "Indore",
  },
  {
    name: "Shri S. Manasvi",
    image: "assets/AlumniImages/Prominent-Alumni-10.webp",
    post: "Filmmaker & Writer",
    description:
      "Works in the Indian film industry and creative content production.",
    city: "Mumbai",
  },
  {
    name: "Shri Tarun Khulbe",
    image: "assets/AlumniImages/RT.png",
    post: "Senior Vice President, Jindal Stainless Steel",
    description:
      "Leads business strategies in steel manufacturing and operations.",
    city: "Delhi",
  },
  {
    name: "Shri Arun Kapoor",
    image: "assets/AlumniImages/Ak.png",
    post: "Director, Ford Motors (USA)",
    description: "Manages global automotive operations at Ford Motors.",
    city: "International",
  },
  {
    name: "Shri Arun Bansal",
    image:
      "assets/AlumniImages/WhatsApp Image 2023-06-06 at 2.55.43 PM 1 (1).jpeg",
    post: "CEO, Adani Airports Holding Ltd",
    description:
      "Oversees airport development and management under Adani Group.",
    city: "Mumbai",
  },
  {
    name: "Shri Anand Bhanpurkar",
    image: "assets/AlumniImages/AB.png",
    post: "Business Head - Distribution Transformers, CG Power",
    description:
      "Leads transformer manufacturing and power distribution business operations.",
    city: "Mumbai",
  },
  {
    name: "Shri Anurag Shukla",
    image: "assets/AlumniImages/AS.png",
    post: "Director, Ericsson India",
    description:
      "Responsible for telecom technology and business operations in India.",
  },
  {
    name: "Shri Pradeep Kumar Tambey",
    image: "assets/AlumniImages/PKT.png",
    post: "President, Tata Steel BSL",
    description:
      "Leads production and corporate operations for Tata Steel BSL.",
  },
  {
    name: "Shri Praveen Kumar Gupta",
    image: "assets/AlumniImages/PKG.png",
    post: "General Manager (Central Procurement), Aditya Birla Group",
    description:
      "Handles nationwide procurement and vendor strategy for the group.",
    city: "Mumbai",
  },
  {
    name: "Shri Vijay Kalra",
    image: "assets/AlumniImages/VK.png",
    post: "Head - Mahindra Institute of Quality",
    description:
      "Leads training and quality initiatives for the Mahindra Group.",
    city: "Mumbai",
  },
  {
    name: "Shri Anoop Bhatnagar",
    image: "assets/AlumniImages/ABH.png",
    post: "President (India Chapter), International Business Council of Australia",
    description:
      "Promotes international business collaborations and trade relations.",
    city: "Delhi",
  },
  {
    name: "Shri Gangaram Baderiya",
    image: "assets/AlumniImages/GB.png",
    post: "Additional Chief Secretary, Government of Karnataka",
    description:
      "Manages senior administrative responsibilities across key government departments.",
    city: "Bangalore",
  },
  {
    name: "Shri Rahul Chaudhry",
    image: "assets/AlumniImages/RC.png",
    post: "CEO, TATA Power SED",
    description:
      "Leads strategic defence and power sector engineering at Tata Power SED.",
    city: "Mumbai",
  },
  {
    name: "Shri Basant Jain",
    image: "assets/AlumniImages/bj.png",
    post: "Founder, Aplos Ventures Pvt. Ltd.",
    description: "Entrepreneur in technology and business investment ventures.",
    city: "Bangalore",
  },
  {
    name: "Dr. Tripta Thakur",
    image: "assets/AlumniImages/TT.png",
    post: "Director General, National Power Training Institute",
    description:
      "Heads training and skill development in the power sector across India.",
    city: "Delhi",
  },
  {
    name: "Shri Keshav Jaiswal",
    image: "assets/AlumniImages/KJ.png",
    post: "Vice President, Global Client Experience, JPMorgan Chase & Co.",
    description:
      "Manages global client operations and customer experience programs.",
    city: "Mumbai",
  },
  {
    name: "Shri Rakesh Atre",
    image: "assets/AlumniImages/RAT.png",
    post: "Associate Vice President, Munjal Showa Ltd",
    description:
      "Responsible for business and operational growth of automotive components.",
    city: "Gurgaon",
  },
  {
    name: "Shri Santosh Kumar Mantri",
    image: "assets/AlumniImages/SKM.png",
    post: "Vice President - Sales & Commercial, Kadevi Industries Ltd",
    description:
      "Oversees nationwide sales and commercial strategies for the company.",
    city: "Pune",
  },
  {
    name: "Shri N.K. Gupta",
    image: "assets/AlumniImages/NKG.png",
    post: "Former Dy Director & Project Director, Cryogenics Liquid Propulsion, ISRO",
    description:
      "Worked on cryogenic propulsion and satellite launch vehicle projects.",
    city: "Bangalore",
  },
  {
    name: "Shri K.K. Sharma",
    image: "assets/AlumniImages/KKS.png",
    post: "Executive Director, NTPC (1981–2009)",
    description:
      "Supervised power plant operations and national thermal power management.",
    city: "Delhi",
  },

  {
    name: "Dr. P.K. Shrivastava",
    image: "assets/AlumniImages/PK.png",
    post: "Air Vice Marshal",
    description:
      "Served in a senior leadership position in the Indian Air Force.",
    city: "Delhi",
  },
  {
    name: "Shri Sachin Agrawal",
    image: "assets/AlumniImages/Sachin Agrawal.png",
    post: "Senior Vice President – R & D and Technology, Volvo Eicher",
    description:
      "Heads research, innovation and automotive technology development.",
    city: "Gurgaon",
  },
];

// Compact Scrolling Alumni Component
export function ScrollingAlumni({ isDarkMode }) {
  return (
    <section className="w-full py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header - Compact */}
        <div className="text-center mb-6 sm:mb-8">
          <h2
            className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            Our Distinguished Alumni
          </h2>
          <p
            className={`text-xs sm:text-sm md:text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Meet our distinguished alumni shaping industries and driving
            innovation worldwide.
          </p>
        </div>

        {/* Scrolling Container */}
        <div className="relative">
          {/* Light gradient overlays */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none ${isDarkMode
              ? "bg-gradient-to-r from-slate-900 to-transparent"
              : "bg-gradient-to-r from-white to-transparent"
              }`}
          ></div>
          <div
            className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none ${isDarkMode
              ? "bg-gradient-to-l from-slate-900 to-transparent"
              : "bg-gradient-to-l from-white to-transparent"
              }`}
          ></div>

          {/* Scrolling Content */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll">
              {/* First Set */}
              <div className="flex space-x-4 pr-4">
                {alumni.map((alumnus, index) => (
                  <AlumniCard
                    key={index}
                    alumnus={alumnus}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
              {/* Duplicate Set for Continuous Scroll */}
              <div className="flex space-x-4 pr-4">
                {alumni.map((alumnus, index) => (
                  <AlumniCard
                    key={`dup-${index}`}
                    alumnus={alumnus}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 120s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 90s linear infinite;
          }
        }
      `}</style>
    </section>
  );
}

// Compact Alumni Card Component
function AlumniCard({ alumnus, isDarkMode }) {
  return (
    <div
      className={`flex-shrink-0 w-40 sm:w-56 rounded-xl border transition-all ${isDarkMode
        ? "bg-slate-800 border-blue-600/20"
        : "bg-white border-blue-200"
        }`}
    >
      <div className="p-3 sm:p-4">
        <div className="flex justify-center mb-2 sm:mb-3">
          <img
            src={alumnus.image}
            alt={alumnus.name}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover shadow-md"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
            }}
          />
        </div>

        <div className="text-center">
          <h3
            className={`text-[12px] sm:text-sm font-bold mb-0.5 sm:line-clamp-2 ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            {alumnus.name}
          </h3>

          <p className="text-[10px] sm:text-xs mb-0.5 font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent line-clamp-1 sm:line-clamp-2 leading-tight">
            {alumnus.post}
          </p>

          <p
            className={`text-[9px] sm:text-xs mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
          >
            📍 {alumnus.city}
          </p>

          {alumnus.description && (
            <p
              className={`text-[10px] sm:text-xs leading-relaxed line-clamp-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              {alumnus.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Component (your original component)
export default function DistinguishedAlumni({ isDarkMode, toggleTheme }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");

  const cities = useMemo(() => {
    const citySet = new Set(
      alumni
        .map((a) => a.city || "Unknown") // Handle missing cities
        .filter(city => city && city.trim() !== "") // Filter out empty strings
    );
    return ["All", ...Array.from(citySet).sort()];
  }, []);

  const citiesCount = useMemo(() => {
    return new Set(alumni.map((a) => a.city)).size;
  }, []);

  const filteredAlumni = useMemo(() => {
    return alumni.filter((alumnus) => {
      const matchesSearch =
        alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumnus.post.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumnus.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity =
        selectedCity === "All" ||
        (alumnus.city || "Unknown") === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [searchQuery, selectedCity]);

  const totalAlumni = alumni.length;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className="w-full px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
              Distinguished Alumni
            </h1>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          </div>

          <div className="mb-2">
            <p className="text-base sm:text-lg lg:text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold block lg:inline">
              Connect with our growing community
            </p>
            <p
              className={`text-xs sm:text-sm lg:text-lg block lg:inline lg:ml-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
            >
              of {totalAlumni}+ alumni across {citiesCount} cities
            </p>
          </div>

          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
            {/* Alumni Count */}
            <div
              className={`rounded-xl p-4 text-center border transition-all ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                : "bg-white border-blue-200"
                }`}
            >
              <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
                {totalAlumni}+
              </div>
              <div
                className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                Distinguished Alumni
              </div>
            </div>

            {/* Cities Count */}
            <div
              className={`rounded-xl p-4 text-center border transition-all ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                : "bg-white border-blue-200"
                }`}
            >
              <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-1">
                {citiesCount}
              </div>
              <div
                className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                Cities Represented
              </div>
            </div>

            {/* Years of Excellence */}
            <div
              className={`rounded-xl p-4 text-center border transition-all ${isDarkMode
                ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20"
                : "bg-white border-blue-200"
                }`}
            >
              <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-1">
                50+
              </div>
              <div
                className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                Years of Excellence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="w-full px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              />
              <input
                type="text"
                placeholder="Search by name, position, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 transition-colors text-sm ${isDarkMode
                  ? "bg-slate-800 border-blue-600/20 text-white placeholder-gray-400 focus:border-cyan-400"
                  : "bg-white border-blue-200 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } focus:outline-none`}
              />
            </div>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className={`px-3 py-2 rounded-lg border-2 transition-colors text-sm ${isDarkMode
                ? "bg-slate-800 border-blue-600/20 text-white focus:border-cyan-400"
                : "bg-white border-blue-200 text-gray-900 focus:border-blue-500"
                } focus:outline-none cursor-pointer`}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div
            className={`text-center text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
          >
            Showing {filteredAlumni.length} of {totalAlumni} alumni
          </div>
        </div>
      </section>

      {/* Alumni Grid */}
      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAlumni.map((alumnus, index) => (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden border transition-all hover:scale-105 hover:shadow-2xl ${isDarkMode
                  ? "bg-gradient-to-br from-slate-900/80 to-blue-900/30 border-blue-600/20 shadow-lg"
                  : "bg-white border-blue-200 shadow-lg"
                  }`}
              >
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <img
                      src={alumnus.image}
                      alt={alumnus.name}
                      className="w-32 h-32 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/160x160?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="text-center">
                    <h2
                      className={`text-lg font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                      {alumnus.name}
                    </h2>

                    <p className="text-sm mb-2 font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {alumnus.post}
                    </p>

                    <p
                      className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                      📍 {alumnus.city}
                    </p>

                    {alumnus.description && (
                      <p
                        className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                      >
                        {alumnus.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAlumni.length === 0 && (
            <div className="text-center py-12">
              <p
                className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                No alumni found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}
