import React, { useState, useEffect } from 'react';
import {
    Users, Briefcase, Eye, Search, Loader, X
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-16 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-4xl max-h-none sm:max-h-[95vh] overflow-hidden flex flex-col mb-8 sm:mb-0">
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

const MentorshipManagement = ({ isDarkMode }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    const fetchData = async () => {
        setLoading(true);
        setData([]);
        try {
            const token = getAuthToken();

            try {
                const mentorsResponse = await fetch(`${BASE_URL}/mentor/all`);
                const mentorsResult = await mentorsResponse.json();
                let mentors = mentorsResult.data || [];

                const requestsResponse = await fetch(`${BASE_URL}/mentor/mentor/requests`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const requestsResult = await requestsResponse.json();
                const allRequests = requestsResult.data || [];

                mentors = mentors.map(mentor => {
                    // Find mentorship requests for this mentor (pending or active)
                    const mentorRequests = allRequests.filter(req =>
                        req.mentor && req.mentor.id === mentor.id &&
                        (req.status === 'active' || req.status === 'pending')
                    );
                    const students = [];
                    const seenIds = new Set();
                    mentorRequests.forEach(req => {
                        if (req.student && !seenIds.has(req.student.id)) {
                            students.push({
                                ...req.student,
                                requestStatus: req.status // Add status to student object
                            });
                            seenIds.add(req.student.id);
                        }
                    });

                    return {
                        ...mentor,
                        students,
                        mentees: students.length,
                    };
                });
                setData(mentors);
            } catch (err) {
                console.error("Error fetching mentors:", err);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter(item => {
        const search = searchTerm.toLowerCase();
        return item.name?.toLowerCase().includes(search) || item.expertise?.toLowerCase().includes(search);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Mentorship Management</h2>
                        <p className="text-sm text-slate-500">Oversee active mentors and their assigned mentees.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 sm:gap-4 items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Search mentors..."
                            className="pl-9 pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-gray-700 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white rounded-2xl border border-slate-200">
                    <Loader className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-slate-500 font-medium">Loading mentors...</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Mentor Info</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Expertise</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Active Mentees</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm overflow-hidden border border-indigo-200">
                                                        {item.alumni?.profilePhoto ? (
                                                            <img src={item.alumni.profilePhoto} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : item.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{item.name}</p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Briefcase className="w-3 h-3" /> {item.company}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{item.expertise}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.mentees > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                        {item.mentees} Student{item.mentees !== 1 && 's'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedItem(item)}
                                                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${isDarkMode ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}
                                                >
                                                    <Eye className="w-4 h-4" /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            No mentors found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className={`md:hidden divide-y ${isDarkMode ? "divide-slate-800" : "divide-slate-100"}`}>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <div key={item.id} className={`p-4 space-y-4 transition-colors ${isDarkMode ? "hover:bg-slate-800/30" : "hover:bg-slate-50/50"}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold overflow-hidden border flex-shrink-0 ${isDarkMode ? "bg-slate-800 text-indigo-400 border-slate-700" : "bg-indigo-100 text-indigo-600 border-indigo-200"}`}>
                                                {item.alumni?.profilePhoto ? (
                                                    <img src={item.alumni.profilePhoto} alt={item.name} className="w-full h-full object-cover" />
                                                ) : item.name[0]}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={`font-bold leading-tight truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{item.name}</div>
                                                <div className={`text-xs flex items-center gap-1 mt-1 truncate ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                    <Briefcase className="w-3 h-3" /> {item.company}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className={`p-2 rounded-lg shrink-0 ${isDarkMode ? "bg-slate-800 text-indigo-400 border border-slate-700" : "bg-indigo-50 text-indigo-600"}`}
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 pt-1">
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-[10px] uppercase font-black tracking-tight mb-0.5 ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>Expertise</div>
                                            <div className={`text-xs font-medium line-clamp-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{item.expertise}</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className={`text-[10px] uppercase font-black tracking-tight mb-1 ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>Mentees</div>
                                            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.mentees > 0
                                                ? (isDarkMode ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-700 border-green-200')
                                                : (isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200')}`}>
                                                {item.mentees} {item.mentees === 1 ? 'Student' : 'Students'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-slate-500">
                                <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                <p className="font-medium">No results found.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Mentor Profile">
                {selectedItem && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 pb-4 border-b border-slate-200 text-center md:text-left">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center text-3xl font-bold text-indigo-700 overflow-hidden shadow-md flex-shrink-0">
                                {selectedItem.alumni?.profilePhoto ? (
                                    <img src={selectedItem.alumni.profilePhoto} alt={selectedItem.name} className="w-full h-full object-cover" />
                                ) : selectedItem.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 w-full">
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{selectedItem.name}</h3>
                                <div className="text-sm sm:text-base text-slate-600 flex items-center justify-center md:justify-start gap-2 mb-2 font-medium">
                                    <Briefcase className="w-4 h-4 text-indigo-500" />
                                    {selectedItem.current_position} at {selectedItem.company}
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 flex-wrap">
                                    <span className="text-[11px] sm:text-sm text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                        Batch {selectedItem.batch_year} • {selectedItem.branch}
                                    </span>
                                    {selectedItem.available && (
                                        <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                            Available
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Expertise */}
                        {selectedItem.expertise && (
                            <div>
                                <h4 className="text-sm font-bold text-indigo-600 uppercase mb-2 tracking-wide">Expertise</h4>
                                <p className="text-slate-700 leading-relaxed">{selectedItem.expertise}</p>
                            </div>
                        )}

                        {/* Mentorship Topics */}
                        {selectedItem.topics && selectedItem.topics.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-indigo-600 uppercase mb-2 tracking-wide">Mentorship Topics</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedItem.topics.map((topic, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fees & UPI */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <h4 className="text-sm font-bold text-indigo-600 uppercase mb-1 tracking-wide">Fees</h4>
                                <p className="text-2xl font-bold text-slate-900">₹{selectedItem.fees}</p>
                            </div>
                            {selectedItem.upi_id && (
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <h4 className="text-sm font-bold text-indigo-600 uppercase mb-1 tracking-wide">UPI ID</h4>
                                    <p className="text-sm font-mono text-slate-700 break-all">{selectedItem.upi_id}</p>
                                </div>
                            )}
                        </div>

                        {/* Availability Schedule */}
                        {selectedItem.availability && Object.keys(selectedItem.availability).length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-indigo-600 uppercase mb-3 tracking-wide">Availability</h4>
                                <div className="space-y-2">
                                    {Object.entries(selectedItem.availability).map(([day, slots]) => (
                                        <div key={day} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <span className="font-semibold text-slate-700 capitalize">
                                                {day === "other_days" ? "Weekdays" : day}
                                            </span>
                                            <div className="flex flex-wrap justify-end gap-2">
                                                {Array.isArray(slots) ? (
                                                    slots.map((slot, idx) => (
                                                        <span key={idx} className="text-slate-600 font-medium text-sm">
                                                            {slot.from} - {slot.to}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-600 font-medium text-sm">
                                                        {slots.from} - {slots.to}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mentees & Requests */}
                        {selectedItem.students && selectedItem.students.length > 0 && (
                            <div className="pt-4 border-t border-slate-200">
                                <h4 className="text-sm font-bold text-indigo-600 uppercase mb-3 tracking-wide">
                                    Mentees & Requests ({selectedItem.students.length})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedItem.students.map((student, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 text-sm font-bold overflow-hidden flex-shrink-0">
                                                {student.profilePhoto ? (
                                                    <img src={student.profilePhoto} alt={student.name} className="w-full h-full object-cover" />
                                                ) : student.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-semibold text-slate-900 truncate">{student.name}</p>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${student.requestStatus === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {student.requestStatus}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 truncate">{student.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MentorshipManagement;
