import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Calendar,
    User as UserIcon,
    Tag,
    ArrowRight,
    Loader2,
    Clock,
    Sparkles,
    Bookmark,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthPopup from "../components/AuthPopup";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const BlogListing = ({ isDarkMode, toggleTheme, isAuthenticated }) => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/api/blogs`);
            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReadArticle = (blogId) => {
        if (!isAuthenticated) {
            setIsAuthPopupOpen(true);
        } else {
            navigate(`/blog/${blogId}`);
        }
    };

    const handleCreateBlog = () => {
        if (!isAuthenticated) {
            setIsAuthPopupOpen(true);
        } else {
            navigate("/create-blog");
        }
    };

    const allTags = ["All", ...new Set(blogs.flatMap((blog) => blog.tags || []))];

    const filteredBlogs = blogs.filter((blog) => {
        const matchesSearch =
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag === "All" || blog.tags?.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    return (
        <div className={`min-h-screen transition-all duration-300 ${isDarkMode ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"}`}>
            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <AuthPopup
                isOpen={isAuthPopupOpen}
                onClose={() => setIsAuthPopupOpen(false)}
                isDarkMode={isDarkMode}
                isAuthenticated={isAuthenticated}
            />

            <main>
                {/* Hero Section */}
                <section className="w-full px-4 py-6 sm:py-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                            <h1 className="text-3xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
                                Alumni Insights & Stories
                            </h1>
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                        </div>

                        <div className="mb-2">
                            <p className="text-base sm:text-lg lg:text-xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold block lg:inline">
                                Connect with our growing community
                            </p>
                            <p className={`text-xs sm:text-sm lg:text-lg block lg:inline lg:ml-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                of excellence-driven alumni stories
                            </p>
                        </div>

                        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full mb-8"></div>

                        <button
                            onClick={handleCreateBlog}
                            className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto text-sm ${isDarkMode
                                ? "bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700"
                                : "bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 shadow-blue-100"
                                }`}
                        >
                            Share Your Story <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </section>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
                    {/* Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-8 md:mb-10">
                        <div className="relative flex-1 group">
                            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDarkMode ? "text-slate-600 group-focus-within:text-blue-500" : "text-slate-400 group-focus-within:text-blue-600"}`} />
                            <input
                                type="text"
                                placeholder="Search articles, keywords, or authors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-14 pr-6 py-3 md:py-4 rounded-2xl border outline-none transition-all ${isDarkMode ? "bg-slate-900/50 border-slate-800 focus:border-blue-500 text-white" : "bg-white border-slate-200 focus:border-blue-600 shadow-sm"
                                    } font-medium text-sm md:text-base`}
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative lg:w-64">
                            <Filter className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDarkMode ? "text-slate-600" : "text-slate-400"}`} />
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className={`w-full pl-12 pr-10 py-3 md:py-4 rounded-2xl border outline-none transition-all appearance-none cursor-pointer ${isDarkMode
                                    ? "bg-slate-900/50 border-slate-800 focus:border-blue-500 text-white"
                                    : "bg-white border-slate-200 focus:border-blue-600 shadow-sm text-gray-900"
                                    } font-semibold text-sm md:text-base`}
                            >
                                {allTags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag === "All" ? "All Categories" : tag}
                                    </option>
                                ))}
                            </select>
                            <Tag className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDarkMode ? "text-slate-600" : "text-slate-400"}`} />
                        </div>
                    </div>

                    {/* Blog Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            <p className={`font-bold uppercase tracking-widest text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Loading Insights...</p>
                        </div>
                    ) : filteredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                            {filteredBlogs.map((blog) => (
                                <article
                                    key={blog._id}
                                    onClick={() => handleReadArticle(blog._id)}
                                    className={`group rounded-xl md:rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer ${isDarkMode ? "bg-slate-900/40 border-slate-800 hover:border-blue-500/50" : "bg-white border-slate-100 shadow-sm hover:shadow-xl"
                                        } hover:-translate-y-1 md:hover:-translate-y-2`}
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[16/9] md:aspect-[16/10] overflow-hidden">
                                        <img
                                            src={blog.blogImage}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity items-end p-6">
                                            <span className="text-white font-bold text-sm flex items-center gap-2">Read Article <ArrowRight className="w-4 h-4" /></span>
                                        </div>
                                        {blog.tags?.[0] && (
                                            <span className="absolute top-2 left-2 md:top-4 md:left-4 px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-blue-600 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                                {blog.tags[0]}
                                            </span>
                                        )}
                                    </div>

                                    {/* Body */}
                                    <div className="p-3 md:p-6">
                                        <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-4">
                                            <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-blue-500">
                                                <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                {new Date(blog.publishedDate || blog.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                5m
                                            </div>
                                        </div>

                                        <h3 className={`text-base md:text-xl font-bold mb-1.5 md:mb-3 line-clamp-2 leading-snug ${isDarkMode ? "text-white group-hover:text-blue-400" : "text-slate-900 group-hover:text-blue-600"} transition-colors`}>
                                            {blog.title}
                                        </h3>

                                        <p className={`text-xs md:text-sm leading-relaxed mb-3 md:mb-6 line-clamp-2 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                                            {blog.shortDescription}
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="w-6 h-6 md:w-10 md:h-10 rounded-full overflow-hidden border border-slate-200">
                                                <img
                                                    src={blog.authorPhoto || `https://ui-avatars.com/api/?name=${blog.authorName}`}
                                                    alt={blog.authorName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] md:text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-900"}`}>{blog.authorName}</span>
                                                <span className={`text-[9px] md:text-xs font-medium ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>Verified Alumni</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 rounded-[3rem] border border-dashed border-slate-300 dark:border-slate-800">
                            <div className="w-20 h-20 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>No insights found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
};

export default BlogListing;