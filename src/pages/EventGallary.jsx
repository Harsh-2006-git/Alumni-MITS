import { useState } from "react";
import { Sparkles, X, ZoomIn } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

export default function EventGalleryPage({ isDarkMode, toggleTheme }) {
  // Sample image URLs array - replace with your actual image URLs
  const [imageUrls] = useState([
    "assets/Events/Screenshot 2025-11-14 003755.png",
    "assets/Events/Screenshot 2025-11-14 003823.png",

    "assets/Events/Screenshot 2025-11-14 003845.png",
    "assets/Events/Screenshot 2025-11-14 003854.png",
    "assets/Events/Screenshot 2025-11-14 003911.png",
    "assets/Events/Screenshot 2025-11-14 003919.png",
    "assets/Events/Screenshot 2025-11-14 003456.png",
    "assets/Events/Screenshot 2025-11-14 003517.png",
    "assets/Events/Screenshot 2025-11-14 003624.png",
    "assets/Events/Screenshot 2025-11-14 003634.png",
    "assets/Events/Screenshot 2025-11-14 003647.png",
    "assets/Events/Screenshot 2025-11-14 003656.png",
    "assets/Events/Screenshot 2025-11-14 003703.png",
    "assets/Events/Screenshot 2025-11-14 003725.png",
    "assets/Events/Screenshot 2025-11-14 003735.png",
    "assets/Events/Screenshot 2025-11-14 003743.png",
    "assets/Events/Screenshot 2025-11-14 003755.png",
    "assets/Events/Screenshot 2025-11-14 003833.png",
  ]);

  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
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

      {/* Hero Section */}
      <section className="text-center py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
              Event Gallery
            </h1>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">
            Memories from Our Amazing Events
          </p>

          <p
            className={`text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Relive the special moments and experiences we've shared together
          </p>

          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-6 sm:mb-8"></div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl py-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {imageUrls.map((imageUrl, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border transition-all hover:scale-105 hover:shadow-xl overflow-hidden group cursor-pointer ${
                isDarkMode
                  ? "bg-slate-900/40 border-slate-700"
                  : "bg-white border-gray-200 shadow-md"
              }`}
              onClick={() => openModal(imageUrl)}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Event gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <div className="bg-white/90 text-gray-900 rounded-full p-3 shadow-lg">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      isDarkMode ? "text-cyan-300" : "text-cyan-600"
                    }`}
                  >
                    Event #{index + 1}
                  </span>
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {Math.floor(Math.random() * 12) + 1}/
                    {Math.floor(Math.random() * 28) + 1}/2024
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no images) */}
        {imageUrls.length === 0 && (
          <div className="text-center py-16">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 ${
                isDarkMode ? "bg-slate-800" : "bg-gray-100"
              }`}
            >
              <Sparkles
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
              No photos yet
            </h3>
            <p
              className={`max-w-md mx-auto text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Check back later for event photos and memories
            </p>
          </div>
        )}
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 p-2 text-white hover:text-cyan-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged event photo"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
