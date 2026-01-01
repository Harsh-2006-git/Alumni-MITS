import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Eye,
    Share2,
    Bookmark,
    MessageSquare,
    Loader2,
    User as UserIcon,
    Tag,
    ArrowRight,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthPopup from "../components/AuthPopup";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const BlogDetail = ({ isDarkMode, toggleTheme, isAuthenticated }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated && !loading && blog) {
            setIsAuthPopupOpen(true);
        }
    }, [isAuthenticated, loading, blog]);

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const authData = localStorage.getItem("auth");
            const token = authData ? JSON.parse(authData).accessToken : null;

            const response = await fetch(`${BASE_URL}/api/blogs/single/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await response.json();

            if (data.success) {
                setBlog(data.data);
            } else {
                setError(data.message || "Failed to load blog.");
            }
        } catch (err) {
            console.error("Error fetching blog:", err);
            setError("Server error.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-950 text-white" : "bg-white text-gray-900"}`}>
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"}`}>
                <h2 className="text-2xl font-bold">{error || "Blog not found"}</h2>
                <button onClick={() => navigate("/blogs")} className="px-6 py-2 bg-blue-600 text-white rounded-xl">Back to Blogs</button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"}`}>
            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <AuthPopup
                isOpen={isAuthPopupOpen}
                onClose={() => {
                    setIsAuthPopupOpen(false);
                    navigate("/blogs");
                }}
                isDarkMode={isDarkMode}
                isAuthenticated={isAuthenticated}
            />

            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                </div>
            ) : error ? (
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-xl font-bold">{error}</p>
                </div>
            ) : !blog ? null : (
                <main className="container mx-auto px-4 sm:px-6 lg:px-12 py-6 md:py-10">
                    <button
                        onClick={() => navigate("/blogs")}
                        className="flex items-center gap-2 mb-6 md:mb-8 text-blue-500 hover:text-blue-600 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back to Insights
                    </button>

                    <article className={!isAuthenticated ? "blur-sm pointer-events-none select-none" : ""}>
                        {/* Header Section */}
                        <header className="mb-8 md:mb-12">
                            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                                {blog.tags?.map((tag) => (
                                    <span key={tag} className="px-2 py-1 md:px-3 md:py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] md:text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8 leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {blog.title}
                            </h1>

                            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl border ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-blue-500/5 border-blue-500/10"}`}>
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-blue-500/30 overflow-hidden shadow-lg shadow-blue-500/10">
                                        <img
                                            src={blog.authorPhoto || `https://ui-avatars.com/api/?name=${blog.authorName}`}
                                            alt={blog.authorName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-base md:text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>{blog.authorName}</h4>
                                        <p className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>MITS Alumni Community</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 md:gap-6 flex-wrap">
                                    <div className="flex flex-col">
                                        <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Date</span>
                                        <div className={`flex items-center gap-1.5 font-bold text-xs md:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                            <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-500" />
                                            {new Date(blog.publishedDate || blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Read Time</span>
                                        <div className={`flex items-center gap-1.5 font-bold text-xs md:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-500" />
                                            5 min
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Views</span>
                                        <div className={`flex items-center gap-1.5 font-bold text-xs md:text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                            <Eye className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-500" />
                                            {blog.views}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Two-Column Layout: Image Left, Content Preview Right */}
                        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                            {/* Left: Featured Image */}
                            <div className="rounded-xl md:rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-500/10 border border-blue-500/10 h-fit lg:sticky lg:top-8">
                                <img
                                    src={blog.blogImage}
                                    alt={blog.title}
                                    className="w-full aspect-[4/3] object-cover"
                                />
                            </div>

                            {/* Right: Short Description & Meta */}
                            <div className="space-y-4 md:space-y-6">
                                <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                    <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>About This Story</h3>
                                    <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                        {blog.shortDescription}
                                    </p>
                                </div>

                                <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                                    <h4 className={`text-xs md:text-sm font-bold uppercase tracking-wider mb-3 md:mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Article Info</h4>
                                    <div className="space-y-2 md:space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Published</span>
                                            <span className={`text-xs md:text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                                {new Date(blog.publishedDate || blog.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Category</span>
                                            <span className="text-xs md:text-sm font-semibold text-blue-500">{blog.tags?.[0] || "General"}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Views</span>
                                            <span className={`text-xs md:text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{blog.views}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full-Width Content Section */}
                        <div className={`max-w-4xl mx-auto mb-12 md:mb-16 p-4 md:p-8 rounded-xl md:rounded-2xl border ${isDarkMode ? "bg-slate-800/30 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                            <h2 className={`text-xl md:text-2xl font-bold mb-6 md:mb-8 pb-3 md:pb-4 border-b ${isDarkMode ? "text-white border-slate-700" : "text-gray-900 border-slate-200"}`}>
                                Full Story
                            </h2>
                            <div
                                className={`blog-content prose prose-sm md:prose-lg max-w-none ${isDarkMode ? "prose-invert" : ""}`}
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                            <style>{`
                                .blog-content {
                                    color: ${isDarkMode ? '#e2e8f0' : '#1e293b'};
                                    font-size: 15px;
                                    line-height: 1.8;
                                    white-space: pre-wrap !important;
                                    word-wrap: break-word;
                                }
                                
                                @media (min-width: 768px) {
                                    .blog-content {
                                        font-size: 17px;
                                        line-height: 1.9;
                                    }
                                }
                                
                                .blog-content * {
                                    white-space: pre-wrap !important;
                                }
                                
                                .blog-content h1, 
                                .blog-content h2, 
                                .blog-content h3,
                                .blog-content h4,
                                .blog-content h5,
                                .blog-content h6 {
                                    color: ${isDarkMode ? '#f1f5f9' : '#0f172a'};
                                    font-weight: 700;
                                    margin-top: 2rem;
                                    margin-bottom: 1rem;
                                    line-height: 1.4;
                                }
                                
                                .blog-content h1 {
                                    font-size: 1.75rem;
                                }
                                
                                .blog-content h2 {
                                    font-size: 1.5rem;
                                }
                                
                                .blog-content h3 {
                                    font-size: 1.25rem;
                                }
                                
                                .blog-content p {
                                    margin-bottom: 1rem;
                                    margin-top: 0;
                                    line-height: 1.8;
                                    white-space: pre-wrap !important;
                                    word-wrap: break-word;
                                }
                                
                                .blog-content p:not(:last-child) {
                                    margin-bottom: 1rem;
                                }
                                
                                .blog-content br {
                                    display: block !important;
                                    content: "" !important;
                                    margin: 0 !important;
                                }
                                
                                
                                .blog-content ul, 
                                .blog-content ol {
                                    margin: 1.5rem 0;
                                    padding-left: 1.5rem;
                                }
                                
                                @media (min-width: 768px) {
                                    .blog-content ul, 
                                    .blog-content ol {
                                        padding-left: 2rem;
                                    }
                                }
                                
                                .blog-content li {
                                    margin-bottom: 0.75rem;
                                    line-height: 1.7;
                                }
                                
                                .blog-content li p {
                                    margin-bottom: 0.5rem;
                                }
                                
                                .blog-content a {
                                    color: #3b82f6;
                                    text-decoration: underline;
                                    transition: color 0.2s;
                                }
                                
                                .blog-content a:hover {
                                    color: #2563eb;
                                }
                                
                                .blog-content strong,
                                .blog-content b {
                                    font-weight: 600;
                                    color: ${isDarkMode ? '#f1f5f9' : '#0f172a'};
                                }
                                
                                .blog-content em,
                                .blog-content i {
                                    font-style: italic;
                                }
                                
                                .blog-content code {
                                    background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
                                    padding: 0.2rem 0.4rem;
                                    border-radius: 0.25rem;
                                    font-size: 0.9em;
                                    font-family: 'Courier New', monospace;
                                }
                                
                                .blog-content pre {
                                    background: ${isDarkMode ? '#1e293b' : '#f1f5f9'};
                                    padding: 1rem;
                                    border-radius: 0.5rem;
                                    overflow-x: auto;
                                    margin: 1.5rem 0;
                                }
                                
                                .blog-content pre code {
                                    background: transparent;
                                    padding: 0;
                                }
                                
                                .blog-content blockquote {
                                    border-left: 4px solid #3b82f6;
                                    padding-left: 1rem;
                                    margin: 1.5rem 0;
                                    font-style: italic;
                                    color: ${isDarkMode ? '#94a3b8' : '#475569'};
                                }
                                
                                .blog-content img {
                                    max-width: 100%;
                                    height: auto;
                                    border-radius: 0.5rem;
                                    margin: 1.5rem 0;
                                }
                                
                                .blog-content hr {
                                    border: none;
                                    border-top: 2px solid ${isDarkMode ? '#334155' : '#e2e8f0'};
                                    margin: 2rem 0;
                                }
                                
                                .blog-content table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin: 1.5rem 0;
                                }
                                
                                .blog-content th,
                                .blog-content td {
                                    border: 1px solid ${isDarkMode ? '#334155' : '#e2e8f0'};
                                    padding: 0.75rem;
                                    text-align: left;
                                }
                                
                                .blog-content th {
                                    background: ${isDarkMode ? '#1e293b' : '#f8fafc'};
                                    font-weight: 600;
                                }
                            `}</style>
                        </div>

                        {/* Footer Info */}
                        <div className={`pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8 ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-bold ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Share this insight</span>
                                <div className="flex gap-2">
                                    {[Share2, Bookmark, MessageSquare].map((Icon, i) => (
                                        <button key={i} className={`p-3 rounded-2xl transition-all ${isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-blue-400" : "bg-white shadow-sm hover:shadow-md text-blue-600"
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {blog.tags?.map(tag => (
                                    <span key={tag} className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all ${isDarkMode ? "bg-slate-800 text-gray-400 hover:text-white" : "bg-white text-gray-500 hover:text-blue-600 shadow-sm"
                                        }`}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>
                </main>
            )}

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
};

export default BlogDetail;
