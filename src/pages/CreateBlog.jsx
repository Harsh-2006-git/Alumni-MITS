import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Image as ImageIcon,
    Upload,
    X,
    Tag,
    Loader2,
    CheckCircle2,
    AlertCircle,
    FileText,
    Type,
    AlignLeft,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

import { useTheme } from "../context/ThemeContext";

const CreateBlog = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        shortDescription: "",
        content: "",
        blogImage: "",
        tags: "Career",
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const authData = localStorage.getItem("auth");
        if (!authData) {
            navigate("/login");
            return;
        }
        const parsed = JSON.parse(authData);
        setUser(parsed);
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (value) => {
        setFormData((prev) => ({ ...prev, content: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setStatus({ type: "error", message: "Please select an image file." });
            return;
        }

        setPreviewUrl(URL.createObjectURL(file));
        setUploading(true);

        const uploadFormData = new FormData();
        uploadFormData.append("blogImage", file);

        try {
            const response = await fetch(`${BASE_URL}/api/blogs/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
                body: uploadFormData,
            });

            const data = await response.json();
            if (data.success) {
                setFormData((prev) => ({ ...prev, blogImage: data.imageUrl }));
                setStatus({ type: "success", message: "Image uploaded successfully!" });
            } else {
                setStatus({ type: "error", message: data.message || "Upload failed." });
            }
        } catch (error) {
            console.error("Upload error:", error);
            setStatus({ type: "error", message: "Server error during upload." });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.blogImage) {
            setStatus({ type: "error", message: "Please upload a blog image." });
            return;
        }

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch(`${BASE_URL}/api/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                    ...formData,
                    tags: [formData.tags],
                }),
            });

            const data = await response.json();
            if (data.success) {
                setShowSuccessModal(true);
            } else {
                setStatus({ type: "error", message: data.message || "Failed to submit blog." });
            }
        } catch (error) {
            console.error("Submit error:", error);
            setStatus({ type: "error", message: "Server error during submission." });
        } finally {
            setLoading(false);
        }
    };

    const userName = user?.userName || user?.user?.name || "User";
    const userEmail = user?.userEmail || user?.user?.email || "";
    const profilePhoto = user?.profilePhoto || user?.user?.profilePhoto;

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDarkMode
            ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
            : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
            }`}>
            <Header />

            <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-6 sm:mb-8 text-blue-600 hover:text-blue-700 transition-colors font-semibold text-sm sm:text-base"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back to Insights
                </button>

                <div className={`rounded-2xl p-4 sm:p-10 border shadow-2xl ${isDarkMode ? "bg-slate-900/50 border-slate-800 backdrop-blur-xl" : "bg-white border-slate-200"
                    }`}>
                    <div className="mb-6 sm:mb-10 text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Create New Alumni Story
                        </h1>
                        <p className={`text-sm sm:text-base ${isDarkMode ? "text-slate-400" : "text-slate-500 font-medium"}`}>
                            Share your journey, insights, and professional experiences.
                        </p>
                    </div>

                    {status.message && (
                        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${status.type === "success"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                            }`}>
                            {status.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                            <span className="font-semibold text-sm sm:text-base">{status.message}</span>
                            <button className="ml-auto flex-shrink-0" onClick={() => setStatus({ type: "", message: "" })}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                        {/* User Info (Compact) */}
                        <div className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border ${isDarkMode ? "bg-slate-800/30 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-blue-500/20 shrink-0">
                                <img
                                    src={profilePhoto || `https://ui-avatars.com/api/?name=${userName}&background=random`}
                                    alt={userName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className={`text-sm sm:text-base font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                        {userName}
                                    </p>
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 border border-blue-600/10">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider hidden sm:inline">Verified Author</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider sm:hidden">Verified</span>
                                    </div>
                                </div>
                                <p className={`text-xs sm:text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"} truncate`}>
                                    {userEmail}
                                </p>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                <Type className="w-4 h-4 text-blue-500" /> Blog Title
                            </label>
                            <input
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Give your story a powerful title..."
                                className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl border transition-all duration-300 ${isDarkMode ? "bg-slate-800/50 border-slate-700 focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500 shadow-sm"
                                    } focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-semibold text-base sm:text-lg`}
                            />
                        </div>

                        {/* Short Description */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                <AlignLeft className="w-4 h-4 text-blue-500" /> Summary
                            </label>
                            <textarea
                                required
                                rows="2"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                placeholder="A brief overview to hook the readers in the listing page."
                                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 ${isDarkMode ? "bg-slate-800/50 border-slate-700 focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500 shadow-sm"
                                    } focus:outline-none focus:ring-4 focus:ring-blue-500/10 resize-none font-medium`}
                            />
                        </div>

                        {/* Featured Image */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                <ImageIcon className="w-4 h-4 text-blue-500" /> Featured Image
                            </label>
                            <div
                                className={`relative aspect-[21/9] rounded-2xl border-2 border-dashed overflow-hidden group cursor-pointer transition-all duration-500 ${isDarkMode ? "border-slate-700 hover:border-blue-500 bg-slate-800/20" : "border-slate-200 hover:border-blue-500 bg-slate-50/50"
                                    } ${formData.blogImage ? "border-solid" : ""}`}
                                onClick={() => document.getElementById("blogImage").click()}
                            >
                                {previewUrl || formData.blogImage ? (
                                    <img src={previewUrl || formData.blogImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                        <div className="p-4 rounded-full bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold">Drop your image here</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Recommended: 1200x600 px</p>
                                        </div>
                                    </div>
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md flex flex-col items-center justify-center text-white gap-3 z-10">
                                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                                        <span className="font-bold tracking-widest text-xs uppercase">Uploading...</span>
                                    </div>
                                )}
                            </div>
                            <input
                                id="blogImage"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                <FileText className="w-4 h-4 text-blue-500" /> Your Story
                            </label>
                            <div className={`rounded-2xl overflow-hidden border ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}`}>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    placeholder="Share your journey in detail..."
                                    className={`quill-editor ${isDarkMode ? "dark-quill" : ""}`}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': [1, 2, 3, false] }],
                                            ['bold', 'italic', 'underline', 'strike'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['link', 'blockquote', 'code-block'],
                                            ['clean']
                                        ],
                                    }}
                                />
                            </div>
                            <style>{`
                                .quill-editor .ql-container {
                                    min-height: 300px;
                                    font-size: 1.1rem;
                                    font-family: inherit;
                                }
                                .quill-editor .ql-toolbar {
                                    border: none !important;
                                    border-bottom: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'} !important;
                                    background: ${isDarkMode ? '#1e293b' : '#f8fafc'};
                                }
                                .quill-editor.dark-quill .ql-stroke {
                                    stroke: #94a3b8;
                                }
                                .quill-editor.dark-quill .ql-fill {
                                    fill: #94a3b8;
                                }
                                .quill-editor.dark-quill .ql-picker {
                                    color: #94a3b8;
                                }
                                .quill-editor.dark-quill .ql-editor.ql-blank::before {
                                    color: #475569;
                                }
                                .quill-editor .ql-editor {
                                    color: ${isDarkMode ? '#f1f5f9' : '#1e293b'};
                                }
                            `}</style>
                        </div>

                        {/* Tags / Category Dropdown */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                <Tag className="w-4 h-4 text-blue-500" /> Category
                            </label>
                            <select
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 ${isDarkMode ? "bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white" : "bg-white border-slate-200 focus:border-blue-500 shadow-sm"
                                    } focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-semibold cursor-pointer appearance-none`}
                            >
                                <option value="Career">Career Development</option>
                                <option value="Success Story">Success Story</option>
                                <option value="Technical">Technical Insights</option>
                                <option value="Campus Life">Campus Life & Memories</option>
                                <option value="Industry Trend">Industry Trends</option>
                                <option value="Mentorship">Mentorship & Guidance</option>
                                <option value="Other">Other</option>
                            </select>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select the most relevant category for your story</p>
                        </div>

                        <button
                            disabled={loading || uploading}
                            type="submit"
                            className={`w-full py-5 rounded-2xl font-bold text-white uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-3 overflow-hidden group relative ${loading || uploading
                                ? "bg-slate-700 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-blue-600/25 active:scale-95"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Publish Insights
                                    <CheckCircle2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-6 max-w-sm mx-auto leading-loose">
                            By publishing, you agree to our community guidelines. Posts are reviewed before becoming public.
                        </p>
                    </form>
                </div>
            </main>

            <Footer />

            {/* Success Confirmation Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => navigate("/blogs")}
                    />
                    <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl transform transition-all scale-100 ${isDarkMode ? "bg-slate-900 border border-slate-700" : "bg-white"
                        }`}>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>

                            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                Submission successful!
                            </h3>

                            <p className={`text-sm mb-8 leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                                Your story has been submitted for review. Our admin team will verify it shortly, after which it will be publicly visible to the community.
                            </p>

                            <button
                                onClick={() => navigate("/blogs")}
                                className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm tracking-wide hover:bg-blue-700 transition-colors"
                            >
                                Back to Insights
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateBlog;
