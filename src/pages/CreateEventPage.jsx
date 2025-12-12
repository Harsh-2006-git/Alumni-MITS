import { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Video,
  IndianRupee,
  Loader,
  Sparkles,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";
import AuthPopup from "../components/AuthPopup";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const Message = ({ type, message, onClose }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-20 right-4 sm:right-6 z-[100] max-w-sm w-[calc(100%-2rem)] sm:w-auto animate-slideIn ${
        type === "success"
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
          : "bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
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
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
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
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showMessage, setShowMessage] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);

  // Check if user is logged in
  const isLoggedIn = () => {
    const authData = localStorage.getItem("auth");
    return authData && JSON.parse(authData).accessToken;
  };

  const displayMessage = (type, text) => {
    setMessage({ type, text });
    setShowMessage(true);

    // Clear message after 5 seconds
    setTimeout(() => {
      setShowMessage(false);
      setMessage({ type: "", text: "" });
    }, 5000);
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
    setMessage({ type: "", text: "" });
  };

  const handleCreateEventClick = () => {
    if (!isLoggedIn()) {
      setShowAuthPopup(true);
      return;
    }
    setShowEventDialog(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      displayMessage(
        "error",
        "Please upload a valid image file (JPEG, PNG, GIF, WebP)"
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      displayMessage("error", "Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const authData = localStorage.getItem("auth");
      const token = authData ? JSON.parse(authData).accessToken : null;

      if (!token) {
        displayMessage("error", "Please login again.");
        setShowAuthPopup(true);
        return;
      }

      // Validate required fields
      if (
        !formData.title ||
        !formData.date ||
        !formData.location ||
        !formData.organizer
      ) {
        displayMessage("error", "Please fill all required fields (*).");
        return;
      }

      // Validate date is not in the past
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        displayMessage("error", "Event date cannot be in the past.");
        return;
      }

      // Validate image
      if (!imageFile && (!formData.image || formData.image.trim() === "")) {
        displayMessage(
          "error",
          "Please upload an image or provide an image URL."
        );
        return;
      }

      // Create FormData object for file upload
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append image file if exists
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      console.log("Sending FormData to server...");

      const response = await fetch(
        `${BASE_URL}/event/add-event`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      if (response.ok) {
        displayMessage(
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
        });
        setImageFile(null);
        setImagePreview("");
        setShowEventDialog(false);
      } else {
        displayMessage(
          "error",
          data.message || `Failed to create event (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error("Error creating event:", error);
      displayMessage(
        "error",
        error.message ||
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

  // Custom hero section for create event page
  const CreateEventHeroSection = ({
    isDarkMode,
    onCreateEvent,
    isUserLoggedIn,
  }) => (
    <section className="text-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight pb-1">
            Create Event
          </h1>
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </div>

        <p className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
          Share Your Vision with the Alumni Community
        </p>

        <p
          className={`text-sm sm:text-base md:text-lg mb-4 sm:mb-6 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Organize memorable events that bring our alumni together and create
          lasting connections.
        </p>

        <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-6 sm:mb-8"></div>

        {!isUserLoggedIn && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 max-w-md mx-auto">
            <p
              className={`text-sm ${
                isDarkMode ? "text-yellow-300" : "text-yellow-700"
              }`}
            >
              💡 Please login to create events and access all features
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={onCreateEvent}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold shadow-xl hover:scale-105 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create Event
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"
            }`}
          >
            <Calendar className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="font-semibold mb-2">Easy Event Creation</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Fill out a simple form to create and manage your events with ease.
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"
            }`}
          >
            <Users className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="font-semibold mb-2">Reach Alumni Network</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Your event will be visible to MITS alumni and students who share
              your interests.
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-slate-800" : "bg-white shadow-sm"
            }`}
          >
            <Sparkles className="w-8 h-8 text-purple-500 mb-2" />
            <h3 className="font-semibold mb-2">Build Community</h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Create meaningful connections and strengthen the MITS alumni
              network.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Global Message Display */}
      {showMessage && (
        <Message
          type={message.type}
          message={message.text}
          onClose={handleCloseMessage}
        />
      )}

      {/* Auth Popup */}
      {showAuthPopup && (
        <AuthPopup
          isOpen={showAuthPopup}
          onClose={() => setShowAuthPopup(false)}
          isDarkMode={isDarkMode}
        />
      )}

      <CreateEventHeroSection
        isDarkMode={isDarkMode}
        onCreateEvent={handleCreateEventClick}
        isUserLoggedIn={isLoggedIn()}
      />

      {/* Why Create Events Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-12">
        <div
          className={`p-8 rounded-xl ${
            isDarkMode ? "bg-slate-900" : "bg-white shadow-lg"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Why Create Events on Our Platform?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? "bg-slate-800" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold mb-3 text-blue-500">
                Targeted Audience
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Reach specifically MITS alumni and students who are interested
                in networking and learning.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? "bg-slate-800" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold mb-3 text-green-500">
                Free to Create
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Create and promote your events without any platform fees or
                hidden costs.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? "bg-slate-800" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold mb-3 text-purple-500">
                Easy Management
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Manage registrations, communicate with attendees, and track
                event success all in one place.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${
                isDarkMode ? "bg-slate-800" : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold mb-3 text-orange-500">
                Alumni Engagement
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Engage with the vibrant MITS alumni community and build lasting
                professional relationships.
              </p>
            </div>
          </div>

          {!isLoggedIn() && (
            <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center">
              <h3 className="font-semibold mb-2 text-blue-400">
                Ready to Create Your Event?
              </h3>
              <p
                className={`text-sm mb-4 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Login to access the event creation form and start organizing
                memorable gatherings.
              </p>
              <button
                onClick={() => setShowAuthPopup(true)}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-all"
              >
                Login to Continue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Event Creation Dialog */}
      {showEventDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className={`rounded-2xl sm:rounded-3xl shadow-2xl ${
                isDarkMode
                  ? "bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 border-2 border-blue-500/30"
                  : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 border-2 border-blue-300"
              }`}
            >
              <div
                className={`p-4 sm:p-6 border-b-2 flex-shrink-0 ${
                  isDarkMode
                    ? "border-blue-500/30 bg-slate-900/90"
                    : "border-blue-300 bg-white/90"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    Create Event
                  </h2>
                  <button
                    onClick={() => setShowEventDialog(false)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-slate-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Event Title */}
                  <div>
                    <label className="block mb-2 font-semibold text-sm">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter an engaging event title..."
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    />
                  </div>

                  {/* Event Description */}
                  <div>
                    <label className="block mb-2 font-semibold text-sm">
                      Event Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Describe your event in detail..."
                      className={`w-full px-3 py-2 rounded-lg border text-sm resize-vertical ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    />
                  </div>

                  {/* Date & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-cyan-400"
                        } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="Venue or online platform"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                        } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      />
                    </div>
                  </div>

                  {/* Price & Attendees */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        <IndianRupee className="w-4 h-4 inline mr-1" />
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-cyan-400"
                        } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        <Users className="w-4 h-4 inline mr-1" />
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
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-600 text-white focus:border-cyan-500"
                            : "bg-white border-gray-300 text-gray-900 focus:border-cyan-400"
                        } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      />
                    </div>
                  </div>

                  {/* Category & Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
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
                      <label className="block mb-2 font-semibold text-sm">
                        <Video className="w-4 h-4 inline mr-1" />
                        Event Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
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

                  {/* Organizer & Image Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        Organizer *
                      </label>
                      <input
                        type="text"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                        required
                        placeholder="Your name or organization"
                        className={`w-full px-3 py-2 rounded-lg border text-sm ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                        } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-semibold text-sm">
                        <ImageIcon className="w-4 h-4 inline mr-1" />
                        Event Image *
                      </label>
                      <div className="space-y-2">
                        <div
                          className={`relative rounded-lg border-2 border-dashed ${
                            isDarkMode
                              ? "border-slate-600 hover:border-cyan-500"
                              : "border-gray-300 hover:border-cyan-400"
                          } transition-colors`}
                        >
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="p-4 text-center">
                            <Upload
                              className={`w-8 h-8 mx-auto mb-2 ${
                                isDarkMode ? "text-slate-400" : "text-gray-400"
                              }`}
                            />
                            <p
                              className={`text-sm ${
                                isDarkMode ? "text-slate-300" : "text-gray-600"
                              }`}
                            >
                              Click to upload image
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isDarkMode ? "text-slate-400" : "text-gray-500"
                              }`}
                            >
                              JPEG, PNG, GIF, WebP (Max 5MB)
                            </p>
                          </div>
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                          <div className="relative mt-2">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-xs ${
                                  isDarkMode
                                    ? "text-slate-300"
                                    : "text-gray-600"
                                }`}
                              >
                                Preview:
                              </span>
                              <button
                                type="button"
                                onClick={removeImage}
                                className={`text-xs flex items-center gap-1 px-2 py-1 rounded ${
                                  isDarkMode
                                    ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    : "text-red-500 hover:text-red-700 hover:bg-red-50"
                                }`}
                              >
                                <X className="w-3 h-3" />
                                Remove
                              </button>
                            </div>
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-700">
                              <img
                                src={imagePreview}
                                alt="Event preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}

                        {/* Optional URL fallback */}
                        <div className="mt-4">
                          <p
                            className={`text-xs mb-1 ${
                              isDarkMode ? "text-slate-400" : "text-gray-500"
                            }`}
                          >
                            Or provide an image URL (optional):
                          </p>
                          <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className={`w-full px-3 py-2 rounded-lg border text-sm ${
                              isDarkMode
                                ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-cyan-500"
                                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-400"
                            } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Creating Event...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Create Amazing Event
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEventDialog(false)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        isDarkMode
                          ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                          : "bg-white text-blue-600 border border-blue-300"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Form Notes */}
                  <div
                    className={`text-xs mt-4 ${
                      isDarkMode ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    <p className="mb-1">* Required fields</p>
                    <p>
                      Events will be reviewed before being published to ensure
                      quality and relevance.
                    </p>
                  </div>
                </form>
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
            transform: translateY(-10px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .resize-vertical {
          resize: vertical;
        }
      `}</style>
    </div>
  );
}
