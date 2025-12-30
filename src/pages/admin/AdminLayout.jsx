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
} from "lucide-react";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
        { id: "bulk-register", label: "Bulk Register", icon: Upload, path: "/admin/bulk-register" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-50 flex items-center justify-between px-4 lg:px-8 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 p-1">
                            <img src="/assets/images/mits-logo.png" alt="MITS" className="w-full h-full object-contain" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold text-slate-800">MITS Alumni Portal</h1>
                            <p className="text-xs text-slate-500 font-medium">Admin Panel</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
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
                        fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-64px)] bg-white border-r border-slate-200 transition-all duration-300 ease-in-out overflow-hidden`}
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
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
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

                        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 border border-slate-200 shadow-sm overflow-hidden">
                                    <img src="/assets/images/mits-logo.png" alt="Admin" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Admin User</p>
                                    <p className="text-xs text-slate-500">Super Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Dynamic Content */}
                <main className="flex-1 bg-slate-50 p-4 lg:p-8 overflow-x-hidden">
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
            <footer className="bg-white border-t border-slate-200 py-4 px-8 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} MITS Alumni Management System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AdminLayout;
