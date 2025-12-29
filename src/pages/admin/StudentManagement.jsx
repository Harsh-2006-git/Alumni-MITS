import React, { useState, useEffect } from 'react';
import { branches } from '../../data/branches';
import {
    GraduationCap, Mail, Phone, MapPin, Building, Trash2, Eye, Search, Loader,
    X, CheckCircle, AlertCircle, Globe, Link, Github, Twitter, Briefcase, FileText, Calendar, Award, Activity
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

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/alumni/all-students`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setStudents(data.data || []);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/alumni/delete/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                setStudents(students.filter(s => s.id !== id));
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesBranch = selectedBranch ? student.branch === selectedBranch : true;
        const matchesBatch = selectedBatch ? student.batch === selectedBatch : true;
        const matchesLocation = locationFilter ? student.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;

        return matchesSearch && matchesBranch && matchesBatch && matchesLocation;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
                    <p className="text-sm text-gray-500">Comprehensive control over all registered student accounts and profiles.</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 md:flex md:flex-row gap-2 sm:gap-4 items-center">
                    <div className="relative col-span-2 md:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Filter by name, email..."
                            className="pl-9 pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-gray-700 font-medium"
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
                        {[...Array(10)].map((_, i) => {
                            const year = new Date().getFullYear() + 4 - i;
                            return <option key={year} value={year}>{year}</option>
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
                    <p className="text-slate-500 font-medium">Synchronizing student records...</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 text-sm font-semibold border-b border-gray-200">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Branch & Batch</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {student.profilePhoto ? (
                                                        <img
                                                            src={student.profilePhoto}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                                                        />
                                                    ) : null}
                                                    <span className="text-xl font-bold text-indigo-600" style={{ display: student.profilePhoto ? 'none' : 'block' }}>{student.name?.[0]}</span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{student.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono tracking-tighter">ID: {student.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-700">{student.branch}</div>
                                            <div className="text-[11px] text-indigo-500 font-black uppercase tracking-wider bg-indigo-50 w-fit px-1.5 py-0.5 rounded leading-none mt-1">Class of {student.batch}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700 font-medium">{student.email}</div>
                                            <div className="text-[11px] text-slate-500 font-mono">{student.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                                {student.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="p-2.5 text-indigo-600 hover:bg-white hover:shadow-md border border-transparent hover:border-indigo-100 rounded-xl transition-all"
                                                    title="View Profile"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setStudentToDelete(student);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="p-2.5 text-rose-600 hover:bg-white hover:shadow-md border border-transparent hover:border-rose-100 rounded-xl transition-all"
                                                    title="Delete Student"
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
                        {filteredStudents.map((student) => (
                            <div key={student.id} className="p-4 space-y-4 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden flex items-center justify-center">
                                            {student.profilePhoto ? (
                                                <img src={student.profilePhoto} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold text-indigo-600">{student.name?.[0]}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-lg leading-tight">{student.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono tracking-tighter mt-1 overflow-hidden">ID: {student.id}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setSelectedStudent(student)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"><Eye className="w-5 h-5" /></button>
                                        <button onClick={() => { setStudentToDelete(student); setIsDeleteModalOpen(true); }} className="p-2 text-rose-600 bg-rose-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Academic</p>
                                        <p className="text-sm font-bold text-indigo-600 leading-tight">Class of {student.batch}</p>
                                        <p className="text-xs text-slate-500 font-medium truncate">{student.branch}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Location</p>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                                            {student.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-2 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Mail className="w-3.5 h-3.5" /> {student.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                        <Phone className="w-3.5 h-3.5" /> {student.phone}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Student Profile Modal */}
            <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Student Details">
                {selectedStudent && (
                    <div className="space-y-6 pb-6">
                        {/* Header Info */}
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                {selectedStudent.profilePhoto ? (
                                    <img
                                        src={selectedStudent.profilePhoto}
                                        className="w-full h-full object-cover"
                                        alt={selectedStudent.name}
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-4xl font-semibold" style={{ display: selectedStudent.profilePhoto ? 'none' : 'flex' }}>
                                    {selectedStudent.name?.[0]}
                                </div>
                            </div>

                            <div className="flex-1 space-y-2 sm:space-y-3 w-full">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                                    <p className="text-sm sm:text-lg text-gray-600 font-medium">
                                        {selectedStudent.branch} <span className="text-gray-400 mx-1 sm:mx-2">•</span> Batch {selectedStudent.batch}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 sm:gap-4 text-[11px] sm:text-sm text-gray-700 pt-1">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> {selectedStudent.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" /> {selectedStudent.phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" /> {selectedStudent.location || "Location not specified"}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    {selectedStudent.resume && (
                                        <a href={selectedStudent.resume} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium">
                                            <FileText className="w-4 h-4" /> View Resume
                                        </a>
                                    )}
                                    <div className="flex gap-2">
                                        {selectedStudent.linkedin && (
                                            <a href={selectedStudent.linkedin} target="_blank" className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-blue-600" title="LinkedIn">
                                                <Link className="w-5 h-5" />
                                            </a>
                                        )}
                                        {selectedStudent.github && (
                                            <a href={selectedStudent.github} target="_blank" className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-800" title="GitHub">
                                                <Github className="w-5 h-5" />
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
                                {/* About */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-indigo-500" /> About
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                        {selectedStudent.about || "No bio provided."}
                                    </p>
                                </div>

                                {/* Education - now consistent with Alumni Management */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-indigo-500" /> Education
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedStudent.education?.length > 0 ? (
                                            selectedStudent.education.map((edu, i) => {
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
                                                const isCurrentlyEnrolled = edu.to && (new Date(edu.to) > new Date());
                                                const isCompleted = edu.to && (new Date(edu.to) <= new Date());

                                                return (
                                                    <div key={i} className="border border-gray-100 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-start gap-3">
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
                                                <p className="text-gray-500 text-sm italic">No education details available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* Academic Info */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
                                        Academic Info
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Branch</p>
                                            <p className="text-gray-900 font-medium mt-0.5">{selectedStudent.branch}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Batch</p>
                                            <p className="text-gray-900 font-medium mt-0.5">Class of {selectedStudent.batch}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Joined</p>
                                            <p className="text-gray-900 mt-0.5">
                                                {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Just now"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-indigo-500" /> Experience
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedStudent.experience?.length > 0 ? (
                                            selectedStudent.experience.map((exp, i) => (
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

                                {/* Skills */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                    <h3 className="text-lg font-bold text-indigo-600 mb-3 flex items-center gap-2">
                                        <Award className="w-5 h-5 text-indigo-500" /> Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedStudent.skills?.length > 0 ? (
                                            selectedStudent.skills.map((skill, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
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
                                    <ul className="space-y-2">
                                        {selectedStudent.achievements?.length > 0 ? (
                                            selectedStudent.achievements.map((ach, i) => (
                                                <li key={i} className="flex gap-2 items-start text-gray-700 text-sm">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                                    <span>{ach}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm italic">No achievements listed.</p>
                                        )}
                                    </ul>
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
                            Do you really want to delete <span className="font-semibold text-gray-900">{studentToDelete?.name}</span>? This process cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3 pt-4 px-4 justify-center">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium">Cancel</button>
                        <button onClick={() => handleDelete(studentToDelete.id)} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StudentManagement;
