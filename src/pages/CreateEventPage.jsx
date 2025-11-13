import { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Video,
  IndianRupee,
  Loader,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
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

export default function CreateEventPage({ isDarkMode, toggleTheme }) {
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
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        showMessage(
          "success",
          "🎉 Event created successfully! Your event is now under verification and will be visible soon."
        );
        // Reset form
        setFormData({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "maxAttendees" ? Number(value) : value,
    }));
  };

  const categories = [
    { value: "tech", label: "Technology" },
    { value: "training and mentorships", label: "Training & Mentorships" },
    { value: "cultural", label: "Cultural" },
    { value: "sports", label: "Sports" },
    { value: "educational", label: "Educational" },
    { value: "special", label: "Special" },
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

      {/* Hero Section */}
      <section className="text-center py-8 sm:py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
              Create Event
            </h1>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            Share Your Vision with the Alumni Community
          </p>

          <p
            className={`text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Organize memorable events that bring our alumni together
          </p>

          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-6 sm:mb-8"></div>
        </div>
      </section>

      {/* Create Event Form */}
      <section className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl py-6 pb-16">
        <div
          className={`rounded-2xl border p-6 sm:p-8 ${
            isDarkMode
              ? "bg-slate-900/40 border-slate-700"
              : "bg-white border-gray-200 shadow-md"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-lg font-bold mb-3 text-cyan-400">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter an engaging event title..."
                className={`w-full px-4 py-3 rounded-xl border transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-lg font-bold mb-3 text-cyan-400">
                Event Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your event in detail... What makes it special? What will attendees learn or experience?"
                className={`w-full px-4 py-3 rounded-xl border transition-all resize-vertical ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              />
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold mb-3 text-cyan-400">
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-cyan-400"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-3 text-cyan-400">
                  <MapPin className="w-5 h-5 inline mr-2" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Venue or online platform"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
              </div>
            </div>

            {/* Price & Attendees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold mb-3 text-cyan-400">
                  <IndianRupee className="w-5 h-5 inline mr-2" />
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-cyan-400"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-3 text-cyan-400">
                  <Users className="w-5 h-5 inline mr-2" />
                  Max Attendees *
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="50"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-cyan-400"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
              </div>
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold mb-3 text-cyan-400">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-cyan-400"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer`}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold mb-3 text-cyan-400">
                  <Video className="w-5 h-5 inline mr-2" />
                  Event Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-cyan-400"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer`}
                >
                  <option value="in-person">In-Person</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
            </div>

            {/* Organizer & Image URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold mb-3 text-cyan-400">
                  Organizer *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  required
                  placeholder="Your name or organization"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-3 text-cyan-400">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-4 py-3 rounded-xl border transition-all ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                  } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Amazing Event
                  </>
                )}
              </button>

              <a
                href="/events"
                className={`px-6 py-4 rounded-xl font-bold border-2 transition-all text-center ${
                  isDarkMode
                    ? "border-gray-600 text-white hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </section>

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
      `}</style>
    </div>
  );
}
