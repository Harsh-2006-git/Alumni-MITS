
import { useState } from "react";
import { Upload, X, Check, Image as ImageIcon, Loader2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function ProfilePhotoUpload({ isOpen, token, onComplete, onSkip, isDarkMode, canSkip = true }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Please select an image file (JPG, PNG).");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB.");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError("");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("profilePhoto", selectedFile);

        try {
            const response = await fetch(`${BASE_URL}/alumni/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Upload failed");
            }

            // Success!
            onComplete(data.photoUrl);
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.message || "Failed to upload photo. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ${isDarkMode ? "bg-slate-900 border border-slate-700" : "bg-white border border-gray-100"
                    }`}
            >
                <div className="p-6">
                    <div className="text-center mb-6">
                        <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            Add a Profile Photo
                        </h3>
                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {canSkip ? "Help your batchmates recognize you!" : "A profile photo is required to complete your registration."}
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center mb-6">
                        <div
                            className={`relative w-32 h-32 rounded-full overflow-hidden border-4 flex items-center justify-center mb-4 group ${isDarkMode ? "border-slate-700 bg-slate-800" : "border-gray-100 bg-gray-50"
                                }`}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className={`w-12 h-12 ${isDarkMode ? "text-slate-600" : "text-gray-300"}`} />
                            )}

                            <label
                                htmlFor="photo-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium text-xs"
                            >
                                Change Photo
                            </label>
                        </div>

                        <input
                            type="file"
                            id="photo-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        {!selectedFile && (
                            <label
                                htmlFor="photo-upload"
                                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode
                                    ? "bg-slate-800 hover:bg-slate-700 text-purple-400"
                                    : "bg-purple-50 hover:bg-purple-100 text-purple-600"
                                    }`}
                            >
                                Select Image
                            </label>
                        )}
                    </div>

                    {error && (
                        <div className="mb-4 text-center text-sm text-red-500 bg-red-500/10 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        {canSkip && (
                            <button
                                onClick={onSkip}
                                className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${isDarkMode
                                    ? "bg-slate-800 hover:bg-slate-700 text-gray-400"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                                    }`}
                                disabled={uploading}
                            >
                                Skip
                            </button>
                        )}
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className={`${canSkip ? "flex-1" : "w-full"} py-2.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${!selectedFile || uploading
                                ? "bg-gray-400 cursor-not-allowed opacity-50"
                                : isDarkMode
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/25"
                                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/25"
                                }`}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    Upload
                                    <Upload className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
