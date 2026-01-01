import React, { useState, useEffect } from 'react';
import { Users, UserCheck, GraduationCap, Calendar, TrendingUp, Loader, ArrowRight, Activity, ShieldCheck, Briefcase, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const Dashboard = ({ isDarkMode }) => {
    const [stats, setStats] = useState({
        totalAlumni: 0,
        pendingAlumni: 0,
        activeEvents: 0,
        activeCampaigns: 0,
        totalStudents: 0,
        totalJobs: 0,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    const fetchStats = async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            // Define fetch promises with error handling wrappers
            const fetchWithFallback = async (url) => {
                try {
                    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
                    if (!res.ok) throw new Error(`Status: ${res.status}`);
                    return await res.json();
                } catch (err) {
                    console.error(`Failed to fetch ${url}`, err);
                    return null; // Return null on failure
                }
            };

            const [
                alumniData,
                pendingData,
                eventsData,
                campaignsData,
                studentsData,
                jobsData
            ] = await Promise.all([
                fetchWithFallback(`${BASE_URL}/alumni/all-alumni`),
                fetchWithFallback(`${BASE_URL}/alumni/all-nonvarified-alumni`),
                fetchWithFallback(`${BASE_URL}/event/all-event`),
                fetchWithFallback(`${BASE_URL}/campaign/all-campaign`),
                fetchWithFallback(`${BASE_URL}/alumni/all-students`),
                fetchWithFallback(`${BASE_URL}/job/all-jobs`),
            ]);

            setStats({
                totalAlumni: alumniData?.count || 0,
                pendingAlumni: pendingData?.count || 0,
                activeEvents: eventsData?.events?.length || 0,
                activeCampaigns: campaignsData?.campaigns?.length || 0,
                totalStudents: studentsData?.count || 0,
                totalJobs: jobsData?.data?.filter(job => !job.isAutoPosted).length || 0,
            });

        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Alumni', value: stats.totalAlumni, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', path: '/admin/alumni' },
        { label: 'Pending Approvals', value: stats.pendingAlumni, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50', path: '/admin/pending' },
        { label: 'Total Students', value: stats.totalStudents, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50', path: '/admin/students' },
        { label: 'Active Events', value: stats.activeEvents, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', path: '/admin/events' },
        { label: 'Campaigns', value: stats.activeCampaigns, icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50', path: '/admin/campaigns' },
        { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', path: '/admin/jobs' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-50 rounded-full animate-ping"></div>
                    <Loader className={`w-16 h-16 animate-spin absolute top-0 left-0 ${isDarkMode ? "text-indigo-400" : "text-indigo-500"}`} />
                </div>
                <p className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} font-medium`}>Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in pb-10">
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Dashboard</h2>
                    <p className={`${isDarkMode ? "text-slate-400" : "text-gray-500"} text-sm mt-1`}>Overview of system activity and management.</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDarkMode ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-100"
                    }`}>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className={`text-xs font-semibold ${isDarkMode ? "text-green-400" : "text-green-700"}`}>System Online</span>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-6">
                {statCards.map((stat, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(stat.path)}
                        className={`p-3 sm:p-6 rounded-xl border transition-all text-left flex flex-col gap-2 sm:gap-4 group relative overflow-hidden ${isDarkMode ? "bg-slate-900 border-slate-800 hover:border-indigo-500/50" : "bg-white border-slate-100 hover:border-indigo-100 hover:shadow-lg shadow-sm"
                            }`}
                    >
                        <div className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
                            <stat.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h3 className={`text-lg sm:text-3xl font-bold leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>{stat.value}</h3>
                            <p className={`text-[9px] sm:text-xs font-black uppercase tracking-tighter sm:tracking-normal mt-0.5 ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>{stat.label}</p>
                        </div>
                    </button>
                ))}
            </div>

            <div className={`w-full p-6 rounded-xl border shadow-sm transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                }`}>
                <div className="flex items-center justify-between mb-6">
                    <h4 className={`font-bold text-lg flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                        <Activity className="w-5 h-5 text-indigo-500" /> Quick Actions
                    </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <button onClick={() => navigate('/admin/pending')} className={`p-4 border rounded-lg transition-all text-left flex flex-col gap-2 ${isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-indigo-500/50" : "bg-gray-50 border-gray-100 hover:bg-white hover:border-indigo-200 hover:shadow-md"
                        }`}>
                        <div className="flex items-center justify-between">
                            <ShieldCheck className="w-6 h-6 text-indigo-500" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Pending Requests</h5>
                            <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Review and approve new alumni.</p>
                        </div>
                    </button>
                    <button onClick={() => navigate('/admin/events')} className="p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Calendar className="w-6 h-6 text-purple-500" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-900">Manage Events</h5>
                            <p className="text-xs text-gray-500 leading-relaxed">Create and edit events.</p>
                        </div>
                    </button>
                    <button onClick={() => navigate('/admin/alumni')} className="p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Users className="w-6 h-6 text-blue-500" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-900">Alumni Directory</h5>
                            <p className="text-xs text-gray-500 leading-relaxed">View all verified alumni.</p>
                        </div>
                    </button>
                    <button onClick={() => navigate('/admin/students')} className="p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <GraduationCap className="w-6 h-6 text-emerald-500" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-900">Student List</h5>
                            <p className="text-xs text-gray-500 leading-relaxed">View registered students.</p>
                        </div>
                    </button>
                    <button onClick={() => navigate('/admin/jobs')} className="p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <Briefcase className="w-6 h-6 text-indigo-600" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-900">Jobs Management</h5>
                            <p className="text-xs text-gray-500 leading-relaxed">Oversee recruitment & job posts.</p>
                        </div>
                    </button>
                    <button onClick={() => navigate('/admin/mentorship')} className="p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all text-left flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <MessageSquare className="w-6 h-6 text-cyan-500" />
                            <ArrowRight className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-900">Mentorship Programs</h5>
                            <p className="text-xs text-gray-500 leading-relaxed">Manage mentor-mentee relations.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
