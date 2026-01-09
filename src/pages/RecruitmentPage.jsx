import { useState, useEffect } from "react";
import {
    Users,
    Briefcase,
    Building2,
    MapPin,
    Sparkles,
    Search,
    Filter,
    GraduationCap,
    Calendar,
    FileText,
    Mail,
    Phone,
    ArrowRight,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import AuthPopup from "../components/AuthPopup";
import AlumniProfileModal from "../components/AlumniProfileModal";
import { branches } from "../data/branches";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

import { useTheme } from "../context/ThemeContext";

export default function RecruitmentPage({
    isAuthenticated,
}) {
    const { isDarkMode, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("All Branches");
    const [selectedBatch, setSelectedBatch] = useState("All Batches");
    const [skillSearch, setSkillSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [studentData, setStudentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAuthPopup, setShowAuthPopup] = useState(false);

    // Fetch student data from API
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                let url = `${BASE_URL}/alumni/all-students`;
                const params = new URLSearchParams();
                if (selectedBranch !== "All Branches") params.append("branch", selectedBranch);
                if (selectedBatch !== "All Batches") params.append("batch", selectedBatch);
                if (searchQuery) params.append("name", searchQuery);
                if (skillSearch) params.append("skills", skillSearch);

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

                const response = await fetch(url);
                const result = await response.json();
                if (result.success) {
                    setStudentData(result.data);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchStudents();
        }, 500); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchQuery, selectedBranch, selectedBatch, skillSearch]);

    const batches = [
        "All Batches",
        ...new Set(
            studentData
                .map((s) => s.batch)
                .filter(Boolean)
                .sort((a, b) => b.localeCompare(a))
        ),
    ];

    const openModal = (student) => {
        if (!isAuthenticated) {
            setShowAuthPopup(true);
            return;
        }
        // Transform student object to match modal expectations if necessary
        // Modal expects profile: {} and getCurrentCompany/Designation as functions
        setSelectedStudent(student);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedStudent(null);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedBranch("All Branches");
        setSelectedBatch("All Batches");
        setSkillSearch("");
    };

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${isDarkMode
                ? "bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white"
                : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
                }`}
        >
            <Header />

            <main className="container mx-auto px-4 md:px-10 lg:px-16 py-8">
                <div className="relative z-10">
                    {/* Hero Section */}
                    <section className="text-center mb-12">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                                <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent leading-tight">
                                    Talent Acquisition
                                </h1>
                                <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                            </div>
                            <p className={`text-xl md:text-2xl mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Discover and recruit the brightest minds from MITS
                            </p>
                            <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full shadow-lg shadow-cyan-500/20"></div>
                        </div>
                    </section>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: "Available Students", value: studentData.length, icon: Users, color: "text-blue-500" },
                            { label: "Partner Companies", value: "50+", icon: Building2, color: "text-purple-500" },
                            { label: "Recent Hires", value: "200+", icon: Briefcase, color: "text-green-500" },
                            { label: "Average Package", value: "8.5 LPA", icon: Sparkles, color: "text-orange-500" },
                        ].map((stat, i) => (
                            <div key={i} className={`p-6 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 ${isDarkMode ? "bg-slate-900/50 border-white/10" : "bg-white border-blue-100 shadow-xl shadow-blue-500/5"
                                }`}>
                                <div className={`${stat.color} mb-3`}><stat.icon className="w-6 h-6" /></div>
                                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filters Section */}
                    <div className={`rounded-3xl border p-6 mb-10 shadow-2xl backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-white/10" : "bg-white/80 border-blue-100"
                        }`}>
                        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                            <div className="flex-1 relative">
                                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all ${isDarkMode
                                        ? "bg-slate-800/50 border-white/10 text-white focus:border-cyan-500"
                                        : "bg-blue-50/50 border-blue-100 text-gray-900 focus:border-blue-500"
                                        } outline-none`}
                                />
                            </div>

                            <div className="flex-1 relative">
                                <Sparkles className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                                <input
                                    type="text"
                                    placeholder="Skills (e.g. React, Python)..."
                                    value={skillSearch}
                                    onChange={(e) => setSkillSearch(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all ${isDarkMode
                                        ? "bg-slate-800/50 border-white/10 text-white focus:border-cyan-500"
                                        : "bg-blue-50/50 border-blue-100 text-gray-900 focus:border-blue-500"
                                        } outline-none`}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${isDarkMode
                                        ? "bg-indigo-600 text-white hover:bg-indigo-500"
                                        : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                                        }`}
                                >
                                    <Filter className="w-5 h-5" />
                                    Advanced
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className={`px-6 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 ${isDarkMode
                                        ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {showFilters && (
                            <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/10">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-400 ml-2">Department / Branch</label>
                                    <select
                                        value={selectedBranch}
                                        onChange={(e) => setSelectedBranch(e.target.value)}
                                        className={`w-full px-5 py-3.5 rounded-2xl border transition-all outline-none ${isDarkMode ? "bg-slate-800 border-white/10 text-white" : "bg-blue-50/30 border-blue-100 text-gray-900"
                                            }`}
                                    >
                                        <option value="All Branches">All Departments</option>
                                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-400 ml-2">Graduation Year</label>
                                    <select
                                        value={selectedBatch}
                                        onChange={(e) => setSelectedBatch(e.target.value)}
                                        className={`w-full px-5 py-3.5 rounded-2xl border transition-all outline-none ${isDarkMode ? "bg-slate-800 border-white/10 text-white" : "bg-blue-50/30 border-blue-100 text-gray-900"
                                            }`}
                                    >
                                        {batches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Area */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                            <p className="text-xl font-medium animate-pulse">Scanning student database...</p>
                        </div>
                    ) : studentData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {studentData.map((student) => (
                                <div
                                    key={student.id}
                                    className={`group relative rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isDarkMode
                                        ? "bg-slate-900/60 border-white/10 hover:border-cyan-500/50"
                                        : "bg-white border-blue-100 hover:border-blue-500/50 shadow-xl shadow-blue-500/5"
                                        }`}
                                >
                                    {/* Card Header Background */}
                                    <div className={`h-24 transition-colors duration-500 ${isDarkMode ? "bg-gradient-to-r from-blue-950 to-indigo-950" : "bg-gradient-to-r from-blue-50 to-indigo-50"
                                        }`}></div>

                                    {/* Profile Info Overlay */}
                                    <div className="px-6 pb-8 -mt-12">
                                        <div className="flex justify-between items-end mb-4">
                                            <div className="relative group/photo">
                                                <img
                                                    src={student.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=0284c7&color=fff&size=200`}
                                                    alt={student.name}
                                                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-blue-100"
                                                />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity rounded-2xl flex items-center justify-center pointer-events-none">
                                                    <Sparkles className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {student.resume && (
                                                    <a href={student.resume} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-110">
                                                        <FileText className="w-5 h-5" />
                                                    </a>
                                                )}
                                                <button onClick={() => openModal(student)} className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-110">
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-1 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{student.name}</h3>
                                        <div className="flex items-center gap-2 mb-4 opacity-75">
                                            <GraduationCap className="w-4 h-4" />
                                            <span className="text-sm font-medium">{student.branch} | {student.batch}</span>
                                        </div>

                                        <div className={`p-4 rounded-2xl mb-6 ${isDarkMode ? "bg-black/20" : "bg-blue-50/50"}`}>
                                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Key Expertise</div>
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                {student.skills.slice(0, 4).map((skill, i) => (
                                                    <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold uppercase">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {student.skills.length > 4 && (
                                                    <span className="px-2.5 py-1 rounded-lg bg-gray-500/10 text-gray-400 font-semibold uppercase">
                                                        +{student.skills.length - 4} More
                                                    </span>
                                                )}
                                                {student.skills.length === 0 && (
                                                    <span className="text-gray-500 italic">No skills listed yet</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex gap-3">
                                                <a href={`mailto:${student.email}`} className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                    <Mail className="w-5 h-5" />
                                                </a>
                                                <a href={`tel:${student.phone}`} className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                    <Phone className="w-5 h-5" />
                                                </a>
                                            </div>
                                            <button
                                                onClick={() => openModal(student)}
                                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 ${isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
                                                    }`}
                                            >
                                                Hire This Talent
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-32 rounded-3xl border-2 border-dashed ${isDarkMode ? "border-white/10 text-gray-500" : "border-blue-100 text-gray-400"}`}>
                            <Users className="w-20 h-20 mx-auto mb-6 opacity-30" />
                            <h3 className="text-2xl font-bold mb-2">No matching talent found</h3>
                            <p>Try broadening your search criteria or skills requirements</p>
                            <button onClick={clearFilters} className="mt-8 px-8 py-3 bg-cyan-500 text-white rounded-2xl font-bold hover:bg-cyan-400 transition-all">
                                Reset Search
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Auth Popup */}
            <AuthPopup
                isOpen={showAuthPopup}
                onClose={() => setShowAuthPopup(false)}
                isAuthenticated={isAuthenticated}
            />

            {/* Profile Modal */}
            {showModal && selectedStudent && (
                <AlumniProfileModal
                    alumni={{
                        ...selectedStudent,
                        profile: selectedStudent // Pass student as profile since we flattened them
                    }}
                    onClose={closeModal}
                    getCurrentCompany={() => ""}
                    getCurrentDesignation={() => ""}
                    isAuthenticated={isAuthenticated}
                />
            )}

            <Footer />
        </div>
    );
}
