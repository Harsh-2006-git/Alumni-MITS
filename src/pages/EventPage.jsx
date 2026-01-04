import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  Video,
  Award,
  X,
  Plus,
  Eye,
  Loader,
  TrendingUp,
  Sparkles,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Mail,
  Clock,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const Message = ({ type, message, onClose }) => {
  if (!message) return null;
  return (
    <div
      className={`fixed top-20 right-4 left-4 sm:right-6 sm:left-auto z-50 max-w-sm animate-fadeIn ${type === "success"
        ? "bg-green-50 border border-green-200"
        : "bg-red-50 border border-red-200"
        } rounded-lg shadow-lg p-4`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 ${type === "success" ? "text-green-500" : "text-red-500"
            }`}
        >
          {type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${type === "success" ? "text-green-800" : "text-red-800"
              }`}
          >
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${type === "success"
            ? "text-green-400 hover:text-green-600"
            : "text-red-400 hover:text-red-600"
            }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};



export default function AlumniEventsPage({ isDarkMode, toggleTheme }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [registering, setRegistering] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registeringInModal, setRegisteringInModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : null;
      const response = await fetch(
        `${BASE_URL}/event/upcoming-event`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await response.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      setRegistering(eventId);
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : null;
      if (!token) {
        showMessage("error", "Please login to register for this event");
        return;
      }
      const response = await fetch(
        `${BASE_URL}/event/registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        showMessage(
          "success",
          "🎉 Successfully registered! You're all set for this amazing event. Check your email for confirmation."
        );
        await fetchEvents();
      } else {
        showMessage(
          "error",
          data.message || "Failed to register. Please try again."
        );
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      showMessage(
        "error",
        "Unable to register at the moment. Please check your connection and try again."
      );
    } finally {
      setRegistering(null);
    }
  };

  const handleRegisterFromModal = async () => {
    if (!selectedEvent) return;

    try {
      setRegisteringInModal(true);
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : null;

      if (!token) {
        showMessage("error", "Please login to register for this event");
        setShowRegisterModal(false);
        setSelectedEvent(null);
        return;
      }

      // Show immediate confirmation
      showMessage(
        "success",
        "🎉 Registration confirmed! Sending confirmation email..."
      );

      // Start registration in background
      const registrationPromise = fetch(
        `${BASE_URL}/event/registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: selectedEvent.id }),
        }
      );

      // Close modal immediately
      setTimeout(() => {
        setShowRegisterModal(false);
        setSelectedEvent(null);
        setRegisteringInModal(false);
      }, 800);

      // Handle response in background
      registrationPromise.then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          // Update success message
          showMessage(
            "success",
            "✅ Registration complete! Check your email for event details and QR code."
          );
          await fetchEvents();
        } else {
          showMessage(
            "error",
            data.message || "Registration saved but email failed. Please contact support."
          );
        }
      }).catch((error) => {
        console.error("Error in background registration:", error);
        showMessage(
          "error",
          "Registration may have failed. Please check your registrations."
        );
      });

    } catch (error) {
      console.error("Error registering for event:", error);
      showMessage(
        "error",
        "Unable to register at the moment. Please try again."
      );
      setRegisteringInModal(false);
    }
  };

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "tech", label: "Tech" },
    { id: "cultural", label: "Cultural" },
    { id: "sports", label: "Sports" },
    { id: "educational", label: "Educational" },
    { id: "special", label: "Special" },
  ];

  const typeFilters = [
    { id: "all", label: "All Types" },
    { id: "virtual", label: "Virtual" },
    { id: "in-person", label: "In-Person" },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  const stats = [
    {
      label: "Total Alumni",
      value: "5K+",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Currently Employed",
      value: "95%",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Different Companies",
      value: "200+",
      icon: Award,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Cities",
      value: "50+",
      icon: MapPin,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode
        ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
        : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
        }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Message
        type={message.type}
        message={message.text}
        onClose={() => setMessage({ type: "", text: "" })}
      />
      <section className="text-center py-12 sm:py-16 lg:py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight pb-1">
              Events
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            Discover Amazing Alumni Events
          </p>

          <p
            className={`text-sm sm:text-base lg:text-xl mb-4 sm:mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
          >
            Connect, learn, and grow with our vibrant alumni community
          </p>

          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-6 sm:mb-8"></div>

          {/* Action Button */}
          {/* <div className="flex justify-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-all active:scale-95 text-sm lg:text-base"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> Create New Event
            </button>
          </div> */}
        </div>
      </section>
      <section className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-3 sm:p-4 rounded-2xl border transition-all hover:scale-105 ${isDarkMode
                ? "bg-slate-900/40 border-slate-800"
                : "bg-white border-gray-200 shadow-sm"
                }`}
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 sm:mb-3`}
              >
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <p
                className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </p>
              <p
                className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl py-4">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-xl border transition-all ${isDarkMode
                ? "bg-slate-900/60 border-slate-800 text-white placeholder-gray-500 focus:border-purple-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-purple-400"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-xl border ${isDarkMode
                ? "bg-slate-900/60 border-slate-800 text-white"
                : "bg-white border-gray-300 text-gray-900"
                }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""
                  }`}
              />
            </button>
            <div
              className={`${showFilters ? "flex" : "hidden"
                } sm:flex flex-col sm:flex-row gap-3 w-full`}
            >
              <div className="relative flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`appearance-none w-full pl-3 pr-8 py-2 sm:py-3 rounded-xl border transition-all ${isDarkMode
                    ? "bg-slate-900/60 border-slate-800 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer`}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`appearance-none w-full pl-3 pr-8 py-2 sm:py-3 rounded-xl border transition-all ${isDarkMode
                    ? "bg-slate-900/60 border-slate-800 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer`}
                >
                  {typeFilters.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {(selectedCategory !== "all" ||
                selectedType !== "all" ||
                searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedType("all");
                      setSearchQuery("");
                    }}
                    className={`px-4 py-2 sm:py-3 rounded-xl font-medium text-sm transition-all ${isDarkMode
                      ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    Clear Filters
                  </button>
                )}
            </div>
          </div>
        </div>
        <p
          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
        >
          Showing{" "}
          <span className="font-semibold text-purple-500">
            {filteredEvents.length}
          </span>{" "}
          of {events.length} events
          {(selectedCategory !== "all" ||
            selectedType !== "all" ||
            searchQuery) && (
              <span className="ml-2">
                •{" "}
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedType("all");
                    setSearchQuery("");
                  }}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Clear all filters
                </button>
              </span>
            )}
        </p>
      </section>
      <section className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl py-4 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`relative rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl overflow-hidden group ${isDarkMode
                  ? "bg-slate-900/60 border-slate-800"
                  : "bg-white border-gray-200 shadow-md"
                  }`}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-500"></div>
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={
                      event.image ||
                      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop"
                    }
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md ${event.type === "virtual"
                        ? "bg-purple-500/80 text-white"
                        : "bg-blue-500/80 text-white"
                        }`}
                    >
                      {event.type === "virtual" ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <MapPin className="w-3 h-3" />
                      )}
                      {event.type === "virtual" ? "Virtual" : "In-Person"}
                    </div>

                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3
                    className={`text-base sm:text-lg font-bold mb-2 line-clamp-1 ${isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                  >
                    {event.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {event.description}
                  </p>
                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Calendar
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                      />
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <MapPin
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                      />
                      <span
                        className={`line-clamp-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Users
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"
                          }`}
                      />
                      <span
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }
                      >
                        Max {event.maxAttendees} Attendees
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center justify-between pt-3 sm:pt-4 border-t ${isDarkMode ? "border-slate-800" : "border-gray-200"
                      }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                      >
                        Organizer
                      </p>
                      <p
                        className={`text-xs sm:text-sm font-semibold line-clamp-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                      >
                        {event.organizer}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="ml-3 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs sm:text-sm hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 hover:scale-105"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 ${isDarkMode ? "bg-slate-800" : "bg-gray-100"
                }`}
            >
              <Calendar
                className={`w-8 h-8 sm:w-10 sm:h-10 ${isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
              />
            </div>
            <h3
              className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              No events found
            </h3>
            <p
              className={`max-w-md mx-auto text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              {searchQuery ||
                selectedCategory !== "all" ||
                selectedType !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Be the first to create an event for our alumni community!"}
            </p>
            {!searchQuery &&
              selectedCategory === "all" &&
              selectedType === "all" && (
                <button
                  onClick={() => navigate('/event-register')}
                  className="mt-4 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create First Event
                </button>
              )}
          </div>
        )}
      </section>

      {/* Event Details Modal - Admin Style */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-16 sm:pt-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-4xl max-h-none sm:max-h-[95vh] overflow-hidden flex flex-col mb-8 sm:mb-0">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Event Details</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-6 overflow-y-auto bg-gray-50">
              <div className="space-y-6 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Image & Stats */}
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative">
                      {selectedEvent.image ? (
                        <img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Calendar className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="px-2 py-1 bg-black/50 backdrop-blur text-white rounded text-xs font-semibold">
                          {selectedEvent.category || 'General'}
                        </span>
                        <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-semibold">
                          {selectedEvent.type || 'in-person'}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Category</p>
                        <p className="font-semibold text-gray-900 text-sm mt-1">{selectedEvent.category || 'General'}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Capacity</p>
                        <p className="font-semibold text-gray-900 text-sm mt-1">{selectedEvent.maxAttendees}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Format</p>
                        <p className="font-semibold text-gray-900 text-sm mt-1">{selectedEvent.type || 'in-person'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="flex flex-col h-full space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 leading-tight">{selectedEvent.title}</h1>
                      <div className="flex items-center gap-2 mt-2">
                        {selectedEvent.isRegistered ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <p className="text-sm font-medium text-green-600">You're Registered</p>
                          </>
                        ) : (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <p className="text-sm font-medium text-gray-500">Available for Registration</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Location</p>
                          <p className="text-gray-600">{selectedEvent.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Date & Time</p>
                          <p className="text-gray-600">
                            {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">Max Attendees</p>
                          <p className="text-gray-600">{selectedEvent.maxAttendees} People</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900">Description</h4>
                      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {selectedEvent.description || "Join us for an amazing event! More details coming soon."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 mt-auto space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Organizer</p>
                          <p className="font-semibold text-gray-900">{selectedEvent.organizer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">Contact</p>
                          <p className="font-medium text-indigo-600">{selectedEvent.organizerEmail || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Registration Status Message */}
                      {selectedEvent.isRegistered && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-green-900">Already Registered</p>
                            <p className="text-xs text-green-700 mt-0.5">
                              You have successfully registered for this event. Check your email for confirmation details.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {selectedEvent.isRegistered ? (
                          <button
                            disabled
                            className="flex-1 py-2.5 bg-gray-100 text-gray-500 rounded-lg font-medium text-sm cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Already Registered
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowRegisterModal(true)}
                            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                          >
                            Register for Event
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedEvent(null)}
                          className="px-6 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Confirmation Modal */}
      {showRegisterModal && selectedEvent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => !registeringInModal && setShowRegisterModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>

          {/* Modal Content */}
          <div
            className={`relative w-full max-w-md rounded-2xl shadow-2xl animate-scaleIn ${isDarkMode
              ? "bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900"
              : "bg-gradient-to-br from-white via-purple-50 to-pink-50"
              } border-2 ${isDarkMode ? "border-purple-500/50" : "border-purple-300"} overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative p-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className={`text-2xl font-bold text-center mb-3 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                Confirm Registration
              </h3>

              {/* Event Info */}
              <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? "bg-slate-800/50" : "bg-white/80"
                } backdrop-blur-sm`}>
                <p className={`font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {selectedEvent.title}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                    <span className={`truncate ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {selectedEvent.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <p className={`text-center mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                You're about to register for this event. A confirmation email with event details and QR code will be sent to your registered email address.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegisterModal(false)}
                  disabled={registeringInModal}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${isDarkMode
                    ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegisterFromModal}
                  disabled={registeringInModal}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {registeringInModal ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}
