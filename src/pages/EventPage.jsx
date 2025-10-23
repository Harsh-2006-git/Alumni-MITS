import { useState, useEffect } from "react";
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
  IndianRupee,
  Loader,
  TrendingUp,
  Sparkles,
  ChevronDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";

const Message = ({ type, message, onClose }) => {
  if (!message) return null;
  return (
    <div
      className={`fixed top-20 right-4 left-4 sm:right-6 sm:left-auto z-50 max-w-sm animate-fadeIn ${
        type === "success"
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
      } rounded-lg shadow-lg p-4`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 ${
            type === "success" ? "text-green-500" : "text-red-500"
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
            className={`text-sm font-medium ${
              type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${
            type === "success"
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

function AddEventModal({ isDarkMode, onClose, onSubmit, submitting }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: 0,
    organizer: "",
    category: "educational",
    type: "in-person",
    maxAttendees: 50,
    image: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "maxAttendees" ? Number(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
          isDarkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div
          className={`sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b backdrop-blur-sm z-10 ${
            isDarkMode
              ? "border-slate-800 bg-slate-900/95"
              : "border-gray-200 bg-white/95"
          }`}
        >
          <h2 className="text-xl sm:text-2xl font-bold">Create New Event</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-100"
            }`}
            disabled={submitting}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Attendees
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                required
                min="1"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="tech">Tech</option>
                <option value="trainig and mentorships">
                  Training and Mentorships
                </option>
                <option value="cultural">Cultural</option>
                <option value="sports">Sports</option>
                <option value="educational">Educational</option>
                <option value="special">Special</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              >
                <option value="in-person">In-Person</option>
                <option value="virtual">Virtual</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Organizer</label>
            <input
              type="text"
              name="organizer"
              value={formData.organizer}
              onChange={handleChange}
              required
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 sm:px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create Event
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={`px-4 sm:px-6 py-3 rounded-xl font-semibold border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode
                  ? "border-gray-700 text-white hover:bg-gray-800"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AlumniEventsPage({ isDarkMode, toggleTheme }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [registering, setRegistering] = useState(null);

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
        "https://alumni-mits-l45r.onrender.com/event/upcoming-event",
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

  const handleAddEvent = async (formData) => {
    try {
      setSubmitting(true);
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : null;
      if (!token) {
        showMessage("error", "Please login to create an event");
        return;
      }
      const response = await fetch(
        "https://alumni-mits-l45r.onrender.com/event/add-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        await fetchEvents();
        setShowAddModal(false);
        showMessage(
          "success",
          "Event created successfully! 🎉 Your event is now under varification."
        );
      } else {
        showMessage(
          "error",
          data.message || "Failed to create event. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating event:", error);
      showMessage(
        "error",
        "Error creating event. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
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
        "https://alumni-mits-l45r.onrender.com/event/registration",
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
      value: "1K+",
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
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
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
      <section className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl pt-6 pb-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-4 sm:left-10 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div
            className="absolute top-20 right-4 sm:right-20 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="mb-3 inline-block">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-full border ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700"
                  : "bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300"
              }`}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 animate-pulse" />
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isDarkMode ? "text-purple-300" : "text-purple-700"
                }`}
              >
                Alumni Events
              </span>
            </div>
          </div>
          <h1
            className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Discover Amazing{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Alumni Events
            </span>
          </h1>
          <p
            className={`text-sm sm:text-base md:text-lg mb-4 sm:mb-6 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Connect, learn, and grow with our vibrant alumni community
          </p>
          <div className="flex justify-center mb-6 sm:mb-8">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-red-500 text-white transition-all hover:shadow-2xl hover:scale-105 flex items-center gap-2 sm:gap-3 text-base sm:text-lg shadow-lg"
            >
              <Plus className="w-4 h-4 sm:w-6 sm:h-6" />
              Create New Event
            </button>
          </div>
        </div>
      </section>
      <section className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`p-3 sm:p-4 rounded-2xl border transition-all hover:scale-105 ${
                isDarkMode
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
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
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
              className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-xl border transition-all ${
                isDarkMode
                  ? "bg-slate-900/60 border-slate-800 text-white placeholder-gray-500 focus:border-purple-500"
                  : "bg-white border-gray-300 text-gray-900 focus:border-purple-400"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`sm:hidden flex items-center justify-center gap-2 px-4 py-2 rounded-xl border ${
                isDarkMode
                  ? "bg-slate-900/60 border-slate-800 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`${
                showFilters ? "flex" : "hidden"
              } sm:flex flex-col sm:flex-row gap-3 w-full`}
            >
              <div className="relative flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`appearance-none w-full pl-3 pr-8 py-2 sm:py-3 rounded-xl border transition-all ${
                    isDarkMode
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
                  className={`appearance-none w-full pl-3 pr-8 py-2 sm:py-3 rounded-xl border transition-all ${
                    isDarkMode
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
                  className={`px-4 py-2 sm:py-3 rounded-xl font-medium text-sm transition-all ${
                    isDarkMode
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
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
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
                className={`relative rounded-2xl border transition-all hover:scale-105 hover:shadow-2xl overflow-hidden group ${
                  isDarkMode
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
                      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-md ${
                        event.type === "virtual"
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
                    <div className="px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-white/90 text-gray-900 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {event.price}
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3
                    className={`text-base sm:text-lg font-bold mb-2 line-clamp-1 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {event.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {event.description}
                  </p>
                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Calendar
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
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
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`line-clamp-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Users
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
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
                    className={`flex items-center justify-between pt-3 sm:pt-4 border-t ${
                      isDarkMode ? "border-slate-800" : "border-gray-200"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs ${
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        Organizer
                      </p>
                      <p
                        className={`text-xs sm:text-sm font-semibold line-clamp-1 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {event.organizer}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRegisterEvent(event.id)}
                      disabled={registering === event.id}
                      className="ml-3 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-xs sm:text-sm hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {registering === event.id ? (
                        <>
                          <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          <span className="hidden sm:inline">
                            Registering...
                          </span>
                        </>
                      ) : (
                        <>
                          Register
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </>
                      )}
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
              className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 ${
                isDarkMode ? "bg-slate-800" : "bg-gray-100"
              }`}
            >
              <Calendar
                className={`w-8 h-8 sm:w-10 sm:h-10 ${
                  isDarkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
            </div>
            <h3
              className={`text-lg sm:text-xl font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No events found
            </h3>
            <p
              className={`max-w-md mx-auto text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
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
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create First Event
                </button>
              )}
          </div>
        )}
      </section>
      {showAddModal && (
        <AddEventModal
          isDarkMode={isDarkMode}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEvent}
          submitting={submitting}
        />
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
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
