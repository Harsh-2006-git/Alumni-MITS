import React, { useState, useEffect } from 'react';
import { branches } from '../../data/branches';
import {
    Users, Mail, Phone, MapPin, Building, Trash2, Eye, Search, Loader,
    X, CheckCircle, AlertCircle, Globe, Link, Github, Twitter, GraduationCap, Briefcase, FileText, Calendar, Award, Activity
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-16 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-5xl max-h-none sm:max-h-[95vh] overflow-hidden flex flex-col mb-8 sm:mb-0">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                <div className="p-3 sm:p-6 overflow-y-auto bg-slate-50">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AlumniManagement = () => {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [alumniToDelete, setAlumniToDelete] = useState(null);

    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/alumni/all-alumni`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setAlumni(data.data || []);
        } catch (error) {
            console.error("Error fetching alumni:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/alumni/delete/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                setAlumni(alumni.filter(a => a.id !== id));
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error("Error deleting alumni:", error);
        }
    };

    const filteredAlumni = alumni.filter(alum => {
        const matchesSearch = (alum.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alum.email?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesBranch = selectedBranch ? (alum.branch === selectedBranch || alum.profile?.branch === selectedBranch) : true;

        const matchesBatch = selectedBatch ? (
            alum.batch === selectedBatch ||
            alum.profile?.batch === selectedBatch ||
            (selectedBatch.includes('-') && (alum.batch === selectedBatch))
        ) : true;

        const matchesLocation = locationFilter ? (alum.location || alum.profile?.location)?.toLowerCase().includes(locationFilter.toLowerCase()) : true;

        return matchesSearch && matchesBranch && matchesBatch && matchesLocation;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Alumni Directory</h2>
                    <p className="text-sm text-slate-500">Managing verified alumni credentials and professional achievements.</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 md:flex md:flex-row gap-2 sm:gap-4 items-center">
                    <div className="relative col-span-2 md:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Filter by name, email..."
                            className="pl-9 pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-gray-700"
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
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white rounded-2xl border border-slate-200">
                    <Loader className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-slate-500 font-medium">Validating network nodes...</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 text-sm font-semibold border-b border-gray-200">
                                    <th className="px-6 py-4">Name & Experience</th>
                                    <th className="px-6 py-4">Current Company</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Branch & Batch</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAlumni.map((alum) => (
                                    <tr key={alum.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {alum.profilePhoto ? (
                                                        <img
                                                            src={alum.profilePhoto}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                                                        />
                                                    ) : null}
                                                    <span className="text-xl font-bold text-indigo-600 font-bold" style={{ display: alum.profilePhoto ? 'none' : 'block' }}>{alum.name?.[0]}</span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{alum.name}</div>
                                                    <div className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter w-fit">Verified</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-black text-indigo-600 underline-offset-4 decoration-indigo-100">{alum.currentRole}</div>
                                            <div className="text-xs text-slate-500 font-bold">{alum.company}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700 font-medium">{alum.email}</div>
                                            <div className="text-[10px] text-slate-400 font-mono tracking-tight">{alum.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-800">Branch: {alum.branch || alum.profile?.branch || "-"}</div>
                                            <div className="text-sm text-gray-500">Batch: {alum.batch}</div>
                                            <div className="text-xs text-gray-400 mt-1">{alum.location}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedAlumni(alum)}
                                                    className="p-2.5 text-indigo-600 hover:bg-white hover:shadow-md border border-transparent hover:border-indigo-100 rounded-xl transition-all"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setAlumniToDelete(alum);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="p-2.5 text-rose-600 hover:bg-white hover:shadow-md border border-transparent hover:border-rose-100 rounded-xl transition-all"
                                                    title="Delete Alumni"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {filteredAlumni.map((alum) => (
                            <div key={alum.id} className="p-4 space-y-4 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden flex items-center justify-center">
                                            {alum.profilePhoto ? (
                                                <img src={alum.profilePhoto} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold text-indigo-600">{alum.name?.[0]}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-lg leading-tight">{alum.name}</div>
                                            <div className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter w-fit mt-1">Verified</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedAlumni(alum)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"><Eye className="w-5 h-5" /></button>
                                        <button onClick={() => { setAlumniToDelete(alum); setIsDeleteModalOpen(true); }} className="p-2 text-rose-600 bg-rose-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Current Role</p>
                                        <p className="text-sm font-bold text-indigo-600 leading-tight">{alum.currentRole}</p>
                                        <p className="text-xs text-slate-500">{alum.company}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Education</p>
                                        <p className="text-sm text-gray-800 leading-tight">Batch {alum.batch}</p>
                                        <p className="text-xs text-gray-500 truncate">{alum.branch || alum.profile?.branch || "-"}</p>
                                    </div>
                                </div>
                                <div className="pt-2 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Mail className="w-3.5 h-3.5" /> {alum.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Phone className="w-3.5 h-3.5" /> {alum.phone}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Alumni Profile Modal */}
            <Modal isOpen={!!selectedAlumni} onClose={() => setSelectedAlumni(null)} title="Alumni Details">
                {selectedAlumni && (
                    <div className="space-y-6 pb-6">
                        {/* Header Info */}
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                {selectedAlumni.profilePhoto ? (
                                    <img
                                        src={selectedAlumni.profilePhoto}
                                        className="w-full h-full object-cover"
                                        alt={selectedAlumni.name}
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-4xl font-semibold" style={{ display: selectedAlumni.profilePhoto ? 'none' : 'flex' }}>
                                    {selectedAlumni.name?.[0]}
                                </div>
                            </div>

                            <div className="flex-1 space-y-2 sm:space-y-3 w-full">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedAlumni.name}</h2>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-base sm:text-lg text-gray-700 mt-0.5 sm:mt-1 font-medium">
                                        <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                        <span>{selectedAlumni.currentRole} at <span className="font-semibold">{selectedAlumni.company}</span></span>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2 sm:mt-2">
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold">
                                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            Batch {selectedAlumni.batch}
                                        </span>
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold">
                                            <Building className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            {selectedAlumni.branch || selectedAlumni.profile?.branch || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 sm:gap-4 text-[11px] sm:text-sm text-gray-700 pt-1">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> {selectedAlumni.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" /> {selectedAlumni.phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" /> {selectedAlumni.location || "Not specified"}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    {selectedAlumni.alumniResume && (
                                        <a href={selectedAlumni.alumniResume} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium">
                                            <FileText className="w-4 h-4" /> View Resume
                                        </a>
                                    )}
                                    <div className="flex gap-2">
                                        {selectedAlumni.linkedin && (
                                            <a href={selectedAlumni.linkedin} target="_blank" className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-blue-600" title="LinkedIn">
                                                <Link className="w-5 h-5" />
                                            </a>
                                        )}
                                        {selectedAlumni.github && (
                                            <a href={selectedAlumni.github} target="_blank" className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-800" title="GitHub">
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                        {selectedAlumni.profile?.portfolio && (
                                            <a href={selectedAlumni.profile.portfolio} target="_blank" className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-purple-600" title="Portfolio">
                                                <Globe className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* About */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-indigo-500" /> About
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                        {selectedAlumni.profile?.about || "No bio provided."}
                                    </p>
                                </div>

                                {/* Experience */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-indigo-500" /> Work Experience
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedAlumni.profile?.experience?.length > 0 ? (
                                            selectedAlumni.profile.experience.map((exp, i) => (
                                                <div key={i} className="border-l-2 border-gray-200 pl-4 py-1">
                                                    <h4 className="font-semibold text-gray-800">{exp.role}</h4>
                                                    <p className="text-sm font-medium text-indigo-600">{exp.company}</p>
                                                    <p className="text-xs text-gray-500 mb-2">{exp.from} - {exp.to}</p>
                                                    <p className="text-sm text-gray-600">{exp.description}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">No experience details available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Education - Now consistent in size with other sections */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
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
                                                    <div key={i} className="border border-gray-100 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                                                                </div>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900 text-base">{institution}</h4>
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
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <GraduationCap className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 text-sm italic">No education details available</p>
                                                <p className="text-gray-400 text-xs mt-1">Educational background hasn't been added yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-indigo-500" /> Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAlumni.profile?.skills?.length > 0 ? (
                                            selectedAlumni.profile.skills.map((skill, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">No skills listed.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-indigo-500" /> Achievements
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedAlumni.profile?.achievements?.length > 0 ? (
                                            selectedAlumni.profile.achievements.map((ach, i) => (
                                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <Award className="w-3.5 h-3.5 text-indigo-600" />
                                                    </div>
                                                    <p className="text-gray-700 text-sm">{ach}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">No achievements listed.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="space-y-4 text-center py-4">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Are you sure?</h3>
                        <p className="text-gray-500 mt-2">
                            Do you really want to delete <span className="font-semibold text-gray-900">{alumniToDelete?.name}</span>? This process cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3 pt-4 px-4 justify-center">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">Cancel</button>
                        <button onClick={() => handleDelete(alumniToDelete.id)} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AlumniManagement;