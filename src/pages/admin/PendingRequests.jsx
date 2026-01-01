import React, { useState, useEffect } from 'react';
import { branches } from '../../data/branches';
import {
    UserCheck, UserX, Search, Loader, Eye, Check, X,
    Mail, Phone, MapPin, Building, GraduationCap, Globe, Link, Github, Twitter, AlertCircle, FileText,
    Calendar, CheckCircle, Activity, Award
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const Modal = ({ isOpen, onClose, title, children, isDarkMode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto pt-16 sm:pt-4">
            <div className={`rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-none sm:max-h-[95vh] overflow-hidden flex flex-col mb-8 sm:mb-0 border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                <div className={`p-4 sm:p-6 border-b flex items-center justify-between sticky top-0 z-10 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
                    }`}>
                    <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{title}</h2>
                    <button onClick={onClose} className={`p-2 rounded-full transition ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className={`p-3 sm:p-6 overflow-y-auto ${isDarkMode ? "bg-slate-950" : "bg-gray-50"}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

const PendingRequests = ({ isDarkMode }) => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAlumni, setSelectedAlumni] = useState(null);

    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    const fetchPending = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/alumni/all-nonvarified-alumni`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setPending(data.data || []);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleVerifyAction = async (id, action) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/alumni/${id}/verify`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action }),
            });
            if (response.ok) {
                setPending(pending.filter(a => a.id !== id));
                if (selectedAlumni?.id === id) setSelectedAlumni(null);
            }
        } catch (error) {
            console.error(`Error ${action}ing alumni:`, error);
        }
    };

    const filteredPending = pending.filter(alum => {
        const matchesSearch = (alum.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alum.email?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesBranch = selectedBranch ? (alum.profile?.branch === selectedBranch) : true;

        const matchesBatch = selectedBatch ? (
            alum.profile?.batch === selectedBatch ||
            (selectedBatch.includes('-') && (alum.profile?.batch === selectedBatch))
        ) : true;

        const matchesLocation = locationFilter ? (alum.profile?.location)?.toLowerCase().includes(locationFilter.toLowerCase()) : true;

        return matchesSearch && matchesBranch && matchesBatch && matchesLocation;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Pending Requests</h2>
                    <p className={`text-sm mt-1 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Manage alumni verification requests.</p>
                </div>

                <div className={`p-3 rounded-xl border shadow-sm grid grid-cols-2 md:flex md:flex-row gap-2 sm:gap-4 items-center ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
                    }`}>
                    <div className="relative col-span-2 md:flex-1">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDarkMode ? "text-slate-500" : "text-gray-400"}`} />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            className={`pl-9 pr-4 py-1.5 sm:py-2 border rounded-lg w-full outline-none text-sm transition-all ${isDarkMode
                                ? "bg-slate-800 border-slate-700 text-white focus:ring-2 focus:ring-blue-500/50"
                                : "bg-white border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500"
                                }`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:border-gray-400 transition"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value="">All Branches</option>
                        {branches.map((branch, index) => (
                            <option key={index} value={branch}>{branch}</option>
                        ))}
                    </select>

                    <select
                        className="px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:border-gray-400 transition"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        <option value="">All Batches</option>
                        {[...Array(60)].map((_, i) => {
                            const startYear = new Date().getFullYear() - i - 1;
                            const range = `${startYear}-${startYear + 4}`;
                            return <option key={startYear} value={range}>{range}</option>
                        })}
                    </select>

                    <input
                        type="text"
                        placeholder="Location"
                        className="col-span-2 md:w-40 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white rounded-xl border border-gray-200">
                    <Loader className="w-10 h-10 animate-spin text-indigo-500" />
                    <p className="text-gray-500 text-sm font-medium">Loading requests...</p>
                </div>
            ) : (
                <div className={`border rounded-xl overflow-hidden shadow-sm transition-colors ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
                    }`}>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`text-sm font-semibold border-b ${isDarkMode ? "bg-slate-800/50 text-slate-300 border-slate-800" : "bg-gray-50 text-gray-700 border-gray-200"
                                    }`}>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Branch & Batch</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-gray-100"}`}>
                                {filteredPending.map((alum) => (
                                    <tr key={alum.id} className={`transition-colors ${isDarkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50"}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-700"
                                                    }`}>
                                                    {alum.name?.[0]}
                                                </div>
                                                <div>
                                                    <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{alum.name}</div>
                                                    <div className={`text-xs font-medium px-2 py-0.5 rounded w-fit mt-1 ${isDarkMode ? "bg-amber-500/10 text-amber-500" : "bg-amber-50 text-amber-600"
                                                        }`}>Pending</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm ${isDarkMode ? "text-slate-300" : "text-gray-800"}`}>{alum.profile?.branch || "-"}</div>
                                            <div className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>Batch {alum.profile?.batch || "N/A"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>{alum.email}</div>
                                            <div className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>{alum.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedAlumni(alum)}
                                                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${isDarkMode ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}
                                                >
                                                    <Eye className="w-4 h-4" /> View
                                                </button>
                                                <button
                                                    onClick={() => handleVerifyAction(alum.id, "accept")}
                                                    className={`px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-700 transition-all active:scale-95`}
                                                >
                                                    <Check className="w-4 h-4" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleVerifyAction(alum.id, "reject")}
                                                    className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${isDarkMode ? "bg-slate-800 border-rose-900/50 text-rose-400 hover:bg-rose-500/10" : "bg-white text-rose-600 border-rose-100 hover:bg-rose-50"}`}
                                                >
                                                    <X className="w-4 h-4" /> Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className={`md:hidden divide-y ${isDarkMode ? "divide-slate-800" : "divide-gray-100"}`}>
                        {filteredPending.map((alum) => (
                            <div key={alum.id} className={`p-4 space-y-4 transition-colors ${isDarkMode ? "hover:bg-slate-800/30" : "hover:bg-gray-50/50"}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-700"
                                            }`}>
                                            {alum.name?.[0]}
                                        </div>
                                        <div>
                                            <div className={`font-bold leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>{alum.name}</div>
                                            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-fit mt-1 uppercase tracking-wider ${isDarkMode ? "bg-amber-500/10 text-amber-500" : "bg-amber-50 text-amber-600"
                                                }`}>Pending</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setSelectedAlumni(alum)} className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}><Eye className="w-5 h-5" /></button>
                                        <button onClick={() => handleVerifyAction(alum.id, "accept")} className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}><Check className="w-5 h-5" /></button>
                                        <button onClick={() => handleVerifyAction(alum.id, "reject")} className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-rose-400" : "bg-rose-50 text-rose-600"}`}><X className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Academic</p>
                                        <p className={`text-xs font-semibold line-clamp-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>{alum.profile?.branch || "-"}</p>
                                        <p className="text-[10px] text-slate-500">Batch {alum.profile?.batch || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Contact</p>
                                        <p className={`text-xs line-clamp-1 ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>{alum.email}</p>
                                        <p className="text-[10px] text-slate-500">{alum.phone}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Request Details Modal */}
            <Modal isOpen={!!selectedAlumni} onClose={() => setSelectedAlumni(null)} title="Request Details" isDarkMode={isDarkMode}>
                {selectedAlumni && (
                    <div className="space-y-6 pb-6">
                        {/* Header Info */}
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left">
                            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center text-3xl sm:text-4xl font-bold flex-shrink-0 ${isDarkMode ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-600"
                                }`}>
                                {selectedAlumni.name?.[0]}
                            </div>

                            <div className="flex-1 space-y-2 sm:space-y-3 w-full">
                                <div>
                                    <h2 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedAlumni.name}</h2>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-1">
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded text-[10px] sm:text-sm font-medium ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"
                                            }`}>
                                            <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" /> {selectedAlumni.profile?.branch || "Unknown Branch"}
                                        </div>
                                        <span className="hidden sm:inline text-gray-400">•</span>
                                        <span className={`text-[10px] sm:text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>Batch {selectedAlumni.profile?.batch || "N/A"}</span>
                                    </div>
                                </div>

                                <div className={`flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 sm:gap-4 text-[11px] sm:text-sm pt-1 ${isDarkMode ? "text-slate-400" : "text-gray-700"}`}>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> {selectedAlumni.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" /> {selectedAlumni.phone}
                                    </div>
                                </div>

                                {selectedAlumni.alumniResume && (
                                    <div className="pt-2">
                                        <a href={selectedAlumni.alumniResume} target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium">
                                            <FileText className="w-4 h-4" /> View Resume
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className={`border rounded-lg p-5 shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
                                    }`}>
                                    <h3 className="text-lg font-bold text-indigo-500 mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-indigo-500" /> Education
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedAlumni.profile?.education?.length > 0 ? (
                                            selectedAlumni.profile.education.map((edu, i) => {
                                                const institution = edu.institution || edu.school || "Educational Institution";
                                                const degree = edu.type || edu.degree || "Degree";
                                                const field = edu.stream || edu.field || edu.major || "Field of Study";
                                                const grade = edu.gpa || edu.grade || edu.score;

                                                // Format dates
                                                let fromYear = "Start";
                                                let toYear = "Present";

                                                if (edu.from) {
                                                    try {
                                                        const fromDate = new Date(edu.from);
                                                        fromYear = fromDate.getFullYear();
                                                    } catch (error) {
                                                        fromYear = edu.from;
                                                    }
                                                }

                                                if (edu.to) {
                                                    try {
                                                        const toDate = new Date(edu.to);
                                                        toYear = toDate.getFullYear();
                                                    } catch (error) {
                                                        toYear = edu.to;
                                                    }
                                                }

                                                const duration = `${fromYear} - ${toYear}`;
                                                const isCurrentlyEnrolled = edu.to && new Date(edu.to) > new Date();
                                                const isCompleted = edu.to && new Date(edu.to) <= new Date();

                                                return (
                                                    <div key={i} className={`border rounded-lg p-4 transition-colors ${isDarkMode ? "border-slate-800 bg-slate-800/20 hover:bg-slate-800/40" : "border-gray-100 bg-white hover:bg-gray-50"
                                                        }`}>
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                                                    <div>
                                                                        <h4 className={`font-bold text-base ${isDarkMode ? "text-white" : "text-gray-900"}`}>{institution}</h4>
                                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                            {degree && (
                                                                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                                                                                    {degree}
                                                                                </span>
                                                                            )}
                                                                            {field && (
                                                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                                                    {field}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex flex-col items-start sm:items-end gap-1 whitespace-nowrap flex-shrink-0">
                                                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                                                            <Calendar className="w-3.5 h-3.5" />
                                                                            <span>{duration}</span>
                                                                        </div>
                                                                        {grade && (
                                                                            <div className="text-sm font-semibold text-emerald-700">
                                                                                GPA: {grade}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {edu.description && (
                                                                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                                                        {edu.description}
                                                                    </p>
                                                                )}

                                                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                                                    {isCurrentlyEnrolled && (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded whitespace-nowrap">
                                                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                                                            Currently Enrolled
                                                                        </span>
                                                                    )}
                                                                    {isCompleted && (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded whitespace-nowrap">
                                                                            <CheckCircle className="w-3 h-3" />
                                                                            Completed
                                                                        </span>
                                                                    )}
                                                                    {edu.activities && (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded whitespace-nowrap">
                                                                            <Activity className="w-3 h-3" />
                                                                            {edu.activities}
                                                                        </span>
                                                                    )}
                                                                    {edu.honors && (
                                                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded whitespace-nowrap">
                                                                            <Award className="w-3 h-3" />
                                                                            {edu.honors}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500 text-sm italic">No education details available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className={`border rounded-lg p-5 shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
                                    }`}>
                                    <h3 className="text-lg font-bold text-indigo-500 mb-4">Profile Info</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className={`text-xs uppercase font-semibold ${isDarkMode ? "text-slate-500" : "text-gray-500"}`}>Location</p>
                                            <p className={`flex items-center gap-2 mt-0.5 ${isDarkMode ? "text-slate-300" : "text-gray-900"}`}>
                                                <MapPin className="w-4 h-4 text-slate-500" /> {selectedAlumni.profile?.location || "Not specified"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Joined</p>
                                            <p className="text-gray-900 mt-0.5">
                                                {selectedAlumni.createdAt ? new Date(selectedAlumni.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Just now"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-4">Social Links</h3>
                                    <div className="flex gap-3">
                                        {[
                                            { val: selectedAlumni.profile?.linkedin, icon: Link, title: "LinkedIn" },
                                            { val: selectedAlumni.profile?.github, icon: Github, title: "GitHub" },
                                            { val: selectedAlumni.profile?.twitter, icon: Twitter, title: "Twitter" },
                                            { val: selectedAlumni.profile?.portfolio, icon: Globe, title: "Portfolio" },
                                        ].map((link, i) => (
                                            link.val ? (
                                                <a key={i} href={link.val} target="_blank" className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700" title={link.title}>
                                                    <link.icon className="w-5 h-5" />
                                                </a>
                                            ) : null
                                        ))}
                                        {!selectedAlumni.profile?.linkedin && !selectedAlumni.profile?.github && !selectedAlumni.profile?.twitter && !selectedAlumni.profile?.portfolio && (
                                            <p className="text-sm text-gray-500 italic">No links provided.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col justify-center gap-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase text-center mb-2">Actions</h3>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            onClick={() => handleVerifyAction(selectedAlumni.id, "accept")}
                                            className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2"
                                        >
                                            <Check className="w-5 h-5" /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleVerifyAction(selectedAlumni.id, "reject")}
                                            className="flex-1 py-3 bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition font-medium flex items-center justify-center gap-2"
                                        >
                                            <X className="w-5 h-5" /> Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PendingRequests;
