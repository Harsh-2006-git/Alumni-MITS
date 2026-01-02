import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Menu,
    X,
    LogOut,
    Users,
    Upload,
    Calendar,
    TrendingUp,
    Bell,
    LayoutDashboard,
    UserCheck,
    UserX,
    GraduationCap,
    Home,
    ChevronRight,
    Briefcase,
    Handshake,
    FileText,
    Trash2,
    Pencil,
} from "lucide-react";


const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const AdminLayout = ({ isDarkMode, toggleTheme }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Notification State
    const [showNotifications, setShowNotifications] = useState(false);
    const [showNotificationInput, setShowNotificationInput] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [editNotificationId, setEditNotificationId] = useState(null);

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    const fetchNotifications = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/notification/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.data.map(n => ({
                    id: n._id,
                    message: n.message,
                    type: n.type,
                    time: new Date(n.createdAt).toLocaleString()
                })));
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleSendNotification = async () => {
        if (!notificationMessage.trim()) return;
        setIsSending(true);

        try {
            const token = getAuthToken();
            let url = `${BASE_URL}/notification/create`;
            let method = "POST";

            if (editNotificationId) {
                url = `${BASE_URL}/notification/${editNotificationId}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ message: notificationMessage })
            });

            if (response.ok) {
                setNotificationMessage("");
                setEditNotificationId(null);
                setShowNotificationInput(false);
                fetchNotifications();
            }
        } catch (error) {
            console.error("Error saving notification:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteNotification = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this notification?")) return;
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/notification/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                fetchNotifications();
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const startEditNotification = (notif, e) => {
        e.stopPropagation();
        setNotificationMessage(notif.message);
        setEditNotificationId(notif.id);
        setShowNotificationInput(true);
    };

    const handleCancelInput = () => {
        setShowNotificationInput(false);
        setNotificationMessage("");
        setEditNotificationId(null);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth");
        navigate("/login");
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
        { id: "alumni", label: "Alumni Management", icon: Users, path: "/admin/alumni" },
        { id: "pending", label: "Pending Requests", icon: UserCheck, path: "/admin/pending" },
        { id: "students", label: "Student Management", icon: GraduationCap, path: "/admin/students" },
        { id: "events", label: "Event Management", icon: Calendar, path: "/admin/events" },
        { id: "campaigns", label: "Campaign Management", icon: TrendingUp, path: "/admin/campaigns" },
        { id: "jobs", label: "Jobs Management", icon: Briefcase, path: "/admin/jobs" },
        { id: "mentorship", label: "Mentorship Management", icon: Handshake, path: "/admin/mentorship" },
        { id: "blogs", label: "Blog Management", icon: FileText, path: "/admin/blogs" },
        { id: "bulk-register", label: "Bulk Register", icon: Upload, path: "/admin/bulk-register" },
    ];


    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
            {/* Header */}
            <header className={`h-16 border-b sticky top-0 z-50 flex items-center justify-between px-4 lg:px-8 shadow-sm transition-colors duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-2 rounded-lg transition ${isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 p-1">
                            <img src="/assets/images/mits-logo.png" alt="MITS" className="w-full h-full object-contain" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>MITS Alumni Portal</h1>
                            <p className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Admin Panel</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Notification System */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-2 rounded-lg transition relative ${isDarkMode
                                ? "text-slate-300 hover:bg-slate-800"
                                : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            <Bell className="w-5 h-5" />
                            {notifications.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-xl border animate-in slide-in-from-top-2 fade-in-0 z-50 overflow-hidden ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                                }`}>
                                <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                                    <h3 className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                        Notifications
                                    </h3>
                                    <button
                                        onClick={handleCancelInput}
                                        className={`text-xs px-2 py-1 rounded transition font-medium ${isDarkMode
                                            ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                                            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                            }`}
                                    >
                                        {showNotificationInput ? "Cancel" : "+ New"}
                                    </button>
                                </div>

                                {showNotificationInput && (
                                    <div className={`p-4 border-b ${isDarkMode ? "bg-slate-800/50 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                                        <textarea
                                            value={notificationMessage}
                                            onChange={(e) => setNotificationMessage(e.target.value)}
                                            placeholder="Type message to push..."
                                            className={`w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none ${isDarkMode
                                                ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                                                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                                                }`}
                                            rows="2"
                                        />
                                        <button
                                            onClick={handleSendNotification}
                                            disabled={!notificationMessage.trim() || isSending}
                                            className={`mt-3 w-full py-2 text-xs font-bold uppercase tracking-wider text-white rounded-lg transition flex items-center justify-center gap-2 ${!notificationMessage.trim() || isSending
                                                ? "bg-slate-400 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                                                }`}
                                        >
                                            {isSending ? "Processing..." : (editNotificationId ? "Update Alert" : "Push Alert")}
                                        </button>
                                    </div>
                                )}

                                <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group/item ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className={`text-sm flex-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                                                        {notif.message}
                                                    </p>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => startEditNotification(notif, e)}
                                                            className={`p-1 rounded text-blue-500`}
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteNotification(notif.id, e)}
                                                            className={`p-1 rounded text-red-500`}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className={`text-xs mt-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                                    {notif.time}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={`p-8 text-center ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm">No notifications yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside
                    className={`${isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-0"} 
                        fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-64px)] border-r transition-all duration-300 ease-in-out overflow-hidden shadow-xl ${isDarkMode ? "bg-slate-900 border-slate-800 shadow-slate-950/50" : "bg-white border-slate-200"
                        }`}
                >
                    <div className="p-4 h-full flex flex-col">
                        <nav className="flex-1 space-y-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path || (item.path === "/admin" && location.pathname === "/admin");
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            navigate(item.path);
                                            if (isMobile) setIsSidebarOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                            : isDarkMode
                                                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-indigo-600"}`} />
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4" />}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className={`mt-auto p-4 rounded-2xl border transition-colors ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 border border-slate-200 shadow-sm overflow-hidden">
                                    <img src="/assets/images/mits-logo.png" alt="Admin" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Admin User</p>
                                    <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Super Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Dynamic Content */}
                <main className={`flex-1 p-4 lg:p-8 overflow-x-hidden min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-950" : "bg-slate-50"}`}>
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Backdrop */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 pointer-events-auto transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Footer */}
            <footer className={`border-t py-6 px-8 text-center text-sm font-medium transition-colors duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-600"
                }`}>
                <p>&copy; {new Date().getFullYear()} MITS Alumni Portal. Engineered with Excellence.</p>
            </footer>
        </div>
    );
};

export default AdminLayout;
