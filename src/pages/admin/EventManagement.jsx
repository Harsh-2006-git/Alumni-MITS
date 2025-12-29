import React, { useState, useEffect } from 'react';
import {
    Calendar, MapPin, Users, Clock, DollarSign, Eye, Check, X,
    Trash2, Search, Loader, Filter, Plus, AlertCircle, Info, Edit, Mail, Link, Globe, Layers, Activity
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-16 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-4xl max-h-none sm:max-h-[95vh] overflow-hidden flex flex-col mb-8 sm:mb-0">
                <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-3 sm:p-6 overflow-y-auto bg-gray-50">
                    {children}
                </div>
            </div>
        </div>
    );
};

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTab, setActiveTab] = useState("all");

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/event/all-event`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setEvents(data.events || []);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEventAction = async (eventId, action) => {
        try {
            const token = getAuthToken();
            let response;

            if (action === "delete") {
                response = await fetch(`${BASE_URL}/event/delete/${eventId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                response = await fetch(`${BASE_URL}/event/review/${eventId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ action }),
                });
            }

            if (response.ok) {
                fetchEvents();
                if (selectedEvent?.id === eventId) setSelectedEvent(null);
            }
        } catch (error) {
            console.error(`Error ${action} event:`, error);
        }
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === "all" ||
            (activeTab === "pending" && !event.isScheduled) ||
            (activeTab === "scheduled" && event.isScheduled);
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage and track all events.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                {['all', 'pending', 'scheduled'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab === 'all' ? 'All Events' : tab === 'pending' ? 'Pending' : 'Scheduled'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                    <Loader className="w-12 h-12 animate-spin text-indigo-500" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Synchronizing Matrix...</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 text-sm font-semibold border-b border-gray-200">
                                    <th className="px-6 py-4">Event</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Organizer</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
                                                    {event.image ? (
                                                        <img src={event.image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Calendar className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="max-w-xs">
                                                    <div className="text-gray-900 font-semibold line-clamp-1">{event.title}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3 h-3" /> {event.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium border ${event.isScheduled
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-amber-50 text-amber-700 border-amber-100"
                                                }`}>
                                                {event.isScheduled ? "Scheduled" : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700">{new Date(event.date).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{event.time || "TBD"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{event.organizer}</div>
                                            <div className="text-xs text-gray-500 capitalize">{event.userType}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setSelectedEvent(event)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details"><Eye className="w-5 h-5" /></button>
                                                {!event.isScheduled && (
                                                    <button onClick={() => handleEventAction(event.id, "accept")} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Approve"><Check className="w-5 h-5" /></button>
                                                )}
                                                <button onClick={() => handleEventAction(event.id, "delete")} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {filteredEvents.map((event) => (
                            <div key={event.id} className="p-4 space-y-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                                        {event.image ? (
                                            <img src={event.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-gray-900 font-bold leading-tight line-clamp-2">{event.title}</div>
                                        <div className="flex items-center gap-2 mt-1.5 font-bold uppercase tracking-tighter text-[10px]">
                                            <span className={`px-1.5 py-0.5 rounded border ${event.isScheduled
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-amber-50 text-amber-700 border-amber-100"
                                                }`}>
                                                {event.isScheduled ? "Scheduled" : "Pending"}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-500 flex items-center gap-1 font-bold">
                                                <MapPin className="w-2.5 h-2.5" /> {event.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-bold text-indigo-600">{new Date(event.date).toLocaleDateString()}</div>
                                        <div className="text-[10px] text-gray-500">{event.time || "TBD"}</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => setSelectedEvent(event)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"><Eye className="w-5 h-5" /></button>
                                        {!event.isScheduled && (
                                            <button onClick={() => handleEventAction(event.id, "accept")} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg"><Check className="w-5 h-5" /></button>
                                        )}
                                        <button onClick={() => handleEventAction(event.id, "delete")} className="p-2 text-rose-600 bg-rose-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Event Details Modal */}
            <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="Event Details">
                {selectedEvent && (
                    <div className="space-y-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column: Image & Stats */}
                            <div className="space-y-4">
                                <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative">
                                    {selectedEvent.image ? (
                                        <img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Calendar className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <span className="px-2 py-1 bg-black/50 backdrop-blur text-white rounded text-xs font-semibold">{selectedEvent.category}</span>
                                        <span className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-semibold">{selectedEvent.type}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Category</p>
                                        <p className="font-semibold text-gray-900 text-sm mt-1">{selectedEvent.category}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Capacity</p>
                                        <p className="font-semibold text-gray-900 text-sm mt-1">{selectedEvent.maxAttendees}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Format</p>
                                        <p className="font-semibold text-gray-900 text-sm mt-1">{selectedEvent.type}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Details */}
                            <div className="flex flex-col h-full space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">{selectedEvent.title}</h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${selectedEvent.isScheduled ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                        <p className="text-sm font-medium text-gray-500">{selectedEvent.isScheduled ? 'Scheduled' : 'Pending Approval'}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 text-sm">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Location</p>
                                            <p className="text-gray-600">{selectedEvent.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-gray-900">Date & Time</p>
                                            <p className="text-gray-600">
                                                {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time || "TBD"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-gray-900">Description</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        {selectedEvent.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 mt-auto space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="text-gray-500 text-xs">Organizer</p>
                                            <p className="font-semibold text-gray-900">{selectedEvent.organizer}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-500 text-xs">Contact</p>
                                            <p className="font-medium text-indigo-600">{selectedEvent.organizerEmail}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {!selectedEvent.isScheduled ? (
                                            <button
                                                onClick={() => handleEventAction(selectedEvent.id, "accept")}
                                                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                                            >
                                                Approve Event
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEventAction(selectedEvent.id, "reject")}
                                                className="flex-1 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium text-sm"
                                            >
                                                Revoke Approval
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleEventAction(selectedEvent.id, "delete")}
                                            className="px-6 py-2.5 bg-white text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition font-medium text-sm"
                                        >
                                            Delete
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

export default EventManagement;
