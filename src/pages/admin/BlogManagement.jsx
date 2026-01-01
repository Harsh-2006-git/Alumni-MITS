import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    Loader2,
    Search,
    Check,
    X,
    Eye,
    Trash2,
    FileText,
    AlertCircle,
    ChevronRight,
    Calendar,
    User,
    ArrowRight
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const BlogManagement = ({ isDarkMode }) => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [processingId, setProcessingId] = useState(null);
    const [activeTab, setActiveTab] = useState("Pending Approval");
    const [previewBlog, setPreviewBlog] = useState(null); // For Modal

    useEffect(() => {
        fetchBlogs();
    }, [activeTab]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const authData = JSON.parse(localStorage.getItem("auth"));
            if (!authData) return;

            let url = `${BASE_URL}/api/blogs/admin/pending`;
            if (activeTab === "Approved") {
                url = `${BASE_URL}/api/blogs`;
            }

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${authData.accessToken}`,
                },
            });
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

    const handleStatusUpdate = async (id, status) => {
        try {
            setProcessingId(id);
            const authData = JSON.parse(localStorage.getItem("auth"));
            const response = await fetch(`${BASE_URL}/api/blogs/admin/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.accessToken}`,
                },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();
            if (data.success) {
                setBlogs((prev) => prev.filter((blog) => blog._id !== id));
                if (previewBlog?._id === id) setPreviewBlog(null);
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        try {
            setProcessingId(id);
            const authData = JSON.parse(localStorage.getItem("auth"));
            const response = await fetch(`${BASE_URL}/api/blogs/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authData.accessToken}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setBlogs(prev => prev.filter(b => b._id !== id));
                if (previewBlog?._id === id) setPreviewBlog(null);
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredBlogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabs = [
        { id: "Pending Approval", label: "Pending Review", icon: Clock },
        { id: "Approved", label: "Accepted Blogs", icon: CheckCircle },
    ];

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Blog Moderation</h2>
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Review and manage community contributions.</p>
                </div>

                <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        className={`pl-10 pr-4 py-2 border rounded-lg w-full md:w-72 outline-none transition-all text-sm ${isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-blue-500/50"
                            : "bg-white border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500/50"
                            }`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={`flex items-center gap-1 p-1 rounded-xl w-fit ${isDarkMode ? "bg-slate-800/50 border border-slate-800" : "bg-gray-100"}`}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === tab.id
                            ? isDarkMode ? "bg-slate-800 text-blue-400 shadow-lg shadow-black/20" : "bg-white text-blue-600 shadow-sm"
                            : isDarkMode ? "text-slate-500 hover:text-slate-300" : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>


            {loading ? (
                <div className={`flex flex-col items-center justify-center py-32 gap-4 rounded-2xl border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                    <Loader2 className={`w-12 h-12 animate-spin ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                    <p className={`font-bold text-xs uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Fetching Data...</p>
                </div>
            ) : filteredBlogs.length > 0 ? (
                <div className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                    }`}>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`text-sm font-semibold border-b ${isDarkMode ? "bg-slate-800/50 text-slate-300 border-slate-800" : "bg-gray-50 text-gray-700 border-gray-200"
                                    }`}>
                                    <th className="px-6 py-4">Blog Info</th>
                                    <th className="px-6 py-4">Author</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-gray-100"}`}>
                                {filteredBlogs.map((blog) => (
                                    <tr key={blog._id} className={`transition-colors ${isDarkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                                    <img src={blog.blogImage} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="max-w-xs">
                                                    <div className={`font-bold line-clamp-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}>{blog.title}</div>
                                                    <div className={`text-xs line-clamp-1 mt-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>{blog.shortDescription}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={blog.authorPhoto || `https://ui-avatars.com/api/?name=${blog.authorName}`}
                                                    alt=""
                                                    className="w-6 h-6 rounded-full object-cover border border-blue-500/20"
                                                />
                                                <div>
                                                    <div className={`text-sm font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{blog.authorName}</div>
                                                    <div className="text-[10px] text-slate-500">{blog.authorEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                                                {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${blog.status === "Approved"
                                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                }`}>
                                                {blog.status === "Approved" ? "Published" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setPreviewBlog(blog)}
                                                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${isDarkMode ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View
                                                </button>
                                                {activeTab === "Pending Approval" ? (
                                                    <>
                                                        <button
                                                            disabled={processingId === blog._id}
                                                            onClick={() => handleStatusUpdate(blog._id, "Approved")}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                                                        >
                                                            {processingId === blog._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                            Approve
                                                        </button>
                                                        <button
                                                            disabled={processingId === blog._id}
                                                            onClick={() => handleStatusUpdate(blog._id, "Rejected")}
                                                            className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 ${isDarkMode ? "bg-slate-800 border-red-900/50 text-red-400 hover:bg-red-500/10" : "bg-white text-red-500 border-red-100 hover:bg-red-50"}`}
                                                        >
                                                            {processingId === blog._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        disabled={processingId === blog._id}
                                                        onClick={() => handleStatusUpdate(blog._id, "Pending Approval")}
                                                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${isDarkMode ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "bg-amber-50 text-amber-600 hover:bg-amber-100"}`}
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" /> Hide
                                                    </button>
                                                )}
                                                <button
                                                    disabled={processingId === blog._id}
                                                    onClick={() => handleDelete(blog._id)}
                                                    className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 ${isDarkMode ? "bg-slate-800 border-rose-900/50 text-rose-400 hover:bg-rose-500/10" : "bg-white text-rose-600 border-rose-100 hover:bg-rose-50"}`}
                                                >
                                                    {processingId === blog._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View (and Tablet) */}
                    <div className="lg:hidden divide-y divide-gray-100">
                        {filteredBlogs.map((blog) => (
                            <div key={blog._id} className={`p-4 space-y-4 transition-colors ${isDarkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50/50"}`}>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                                            <img src={blog.blogImage} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className={`font-bold leading-tight line-clamp-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}>{blog.title}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${blog.status === "Approved"
                                                    ? "bg-emerald-500/10 text-emerald-500"
                                                    : "bg-amber-500/10 text-amber-500"
                                                    }`}>
                                                    {blog.status === "Approved" ? "Published" : "Pending"}
                                                </span>
                                                <span className="text-[10px] text-slate-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setPreviewBlog(blog)} className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}><Eye className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={blog.authorPhoto || `https://ui-avatars.com/api/?name=${blog.authorName}`}
                                            alt=""
                                            className="w-5 h-5 rounded-full object-cover"
                                        />
                                        <span className={`text-[11px] font-bold ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}>{blog.authorName}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {activeTab === "Pending Approval" ? (
                                            <>
                                                <button onClick={() => handleStatusUpdate(blog._id, "Approved")} className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}><Check className="w-5 h-5" /></button>
                                                <button onClick={() => handleStatusUpdate(blog._id, "Rejected")} className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-red-400" : "bg-red-50 text-red-600"}`}><X className="w-5 h-5" /></button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleStatusUpdate(blog._id, "Pending Approval")} className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-amber-400" : "bg-amber-50 text-amber-600"}`}><XCircle className="w-5 h-5" /></button>
                                        )}
                                        <button onClick={() => handleDelete(blog._id)} className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-slate-500" : "bg-slate-50 text-slate-400"}`}><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`text-center py-20 rounded-2xl border border-dashed flex flex-col items-center ${isDarkMode ? "border-slate-800 bg-slate-900/20" : "border-slate-200 bg-white"
                    }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${activeTab === "Approved" ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                        }`}>
                        {activeTab === "Approved" ? <FileText className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}>No blogs found</h3>
                    <p className={`text-xs font-medium ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                        There are no blogs in the {activeTab} section matching your criteria.
                    </p>
                </div>
            )}

            {/* Preview Modal */}
            {previewBlog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
                        onClick={() => setPreviewBlog(null)}
                    />

                    <div className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                        }`}>
                        {/* Modal Header */}
                        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                            <div className="flex items-center gap-2.5">
                                <FileText className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
                                <span className={`font-bold text-xs uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Blog Preview</span>
                            </div>
                            <button
                                onClick={() => setPreviewBlog(null)}
                                className={`p-2 rounded-xl transition-all ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className={`flex-1 overflow-y-auto p-5 sm:p-8 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}>
                            <article className="max-w-3xl mx-auto">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {previewBlog.tags?.map((tag) => (
                                        <span key={tag} className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-wider border border-blue-500/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h2 className={`text-2xl sm:text-4xl font-black mb-6 leading-tight tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    {previewBlog.title}
                                </h2>

                                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl mb-8 transition-colors ${isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white border border-gray-200 shadow-sm"
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 overflow-hidden shadow-md shrink-0">
                                            <img src={previewBlog.authorPhoto || `https://ui-avatars.com/api/?name=${previewBlog.authorName}`} alt={previewBlog.authorName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className={`font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{previewBlog.authorName}</h4>
                                            <p className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>MITS Alumni</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <span className={`text-[9px] uppercase font-bold tracking-widest ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>Date</span>
                                            <div className={`flex items-center gap-1.5 font-bold text-xs ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                                <Calendar className="w-3 h-3 text-blue-500" />
                                                {new Date(previewBlog.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[9px] uppercase font-bold tracking-widest ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>Status</span>
                                            <div className={`flex items-center gap-1.5 font-bold text-xs ${previewBlog.status === "Approved" ? "text-green-500" : "text-amber-500"}`}>
                                                {previewBlog.status === "Approved" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {previewBlog.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-blue-500/10">
                                    <img src={previewBlog.blogImage} alt={previewBlog.title} className="w-full aspect-video object-cover" />
                                </div>

                                <div className={`space-y-6 text-lg leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-700 font-medium"}`}>
                                    {previewBlog.content.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </article>
                        </div>

                        {/* Modal Footer (Actions) */}
                        <div className={`px-6 py-4 border-t flex flex-wrap items-center justify-end gap-3 ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-100 bg-white"}`}>
                            {previewBlog.status !== "Approved" && (
                                <button
                                    onClick={() => handleStatusUpdate(previewBlog._id, "Approved")}
                                    className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Approve & Publish
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/blog/${previewBlog._id}`)}
                                className={`px-6 py-2.5 rounded-xl border font-bold text-sm transition-all flex items-center gap-2 ${isDarkMode ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-750" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                                    }`}
                            >
                                <ExternalLink className="w-4 h-4" /> View Live Page
                            </button>
                            <button
                                onClick={() => setPreviewBlog(null)}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default BlogManagement;
