import React, { useState, useEffect } from 'react';
import {
    Briefcase, Building, MapPin, DollarSign, Clock, Trash2, Eye, Search, Loader,
    X, CheckCircle, AlertCircle, FileText
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

const JobsManagement = () => {
    const [jobs, setJobs] = useState([]); // Replace [] with initial state if testing without API
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [locationFilter, setLocationFilter] = useState("");

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    // Placeholder fetch - replace with actual API endpoint
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            // Using the public route which returns all jobs
            const response = await fetch(`${BASE_URL}/job/all-jobs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();

            // Filter out automated jobs
            const manualJobs = (data.data || []).filter(job => {
                return !job.isAutoPosted &&
                    job.userType !== 'Auto' &&
                    job.source !== 'internshala' &&
                    job.source !== 'linkedin' &&
                    job.source !== 'indeed';
            });

            setJobs(manualJobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/api/jobs/${id}`, { // Adjust endpoint
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                setJobs(jobs.filter(j => j.id !== id));
                setIsDeleteModalOpen(false);
            }
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = (job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesLocation = locationFilter ? job.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;

        return matchesSearch && matchesLocation;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Jobs Management</h2>
                    <p className="text-sm text-slate-500">Oversee job postings and recruitment opportunities.</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm grid grid-cols-2 md:flex md:flex-row gap-2 sm:gap-4 items-center">
                    <div className="relative col-span-2 md:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <input
                            type="text"
                            placeholder="Search by title, company..."
                            className="pl-9 pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Location"
                        className="col-span-2 md:w-40 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white rounded-2xl border border-slate-200">
                    <Loader className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="text-slate-500 font-medium">Loading jobs...</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location/Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Posted By</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden border border-indigo-100 flex-shrink-0">
                                                        {job.companyLogo ? (
                                                            <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1" />
                                                        ) : (
                                                            <Briefcase className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{job.title}</p>
                                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Building className="w-3 h-3" /> {job.company}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-slate-700 flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location || "Remote"}
                                                    </p>
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                        {job.type || "Full-time"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-700">{job.postedBy || "Alumni"}</div>
                                                <div className="text-xs text-gray-500">
                                                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Just now"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedJob(job)}
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setJobToDelete(job); setIsDeleteModalOpen(true); }}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete Job"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                    <Search className="w-6 h-6" />
                                                </div>
                                                <p>No jobs found matching your filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div key={job.id} className="p-4 space-y-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden border border-indigo-100 flex-shrink-0">
                                                {job.companyLogo ? (
                                                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-1" />
                                                ) : (
                                                    <Briefcase className="w-5 h-5" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-bold text-slate-900 leading-tight line-clamp-1">{job.title}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                                                    <Building className="w-3 h-3" /> {job.company}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 shrink-0 ml-2">
                                            <button onClick={() => setSelectedJob(job)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => { setJobToDelete(job); setIsDeleteModalOpen(true); }} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4 pt-1">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location || "Remote"}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider leading-none">
                                                    {job.type || "Full-time"}
                                                </span>
                                                <span className="text-[10px] text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recent"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Posted By</div>
                                            <div className="text-xs font-bold text-indigo-600">{job.postedBy || "Alumni"}</div>
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

            {/* Job Details Modal */}
            <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title="Job Details">
                {selectedJob && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left">
                            {selectedJob.companyLogo && (
                                <img src={selectedJob.companyLogo} alt={selectedJob.company} className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white rounded-lg shadow-sm p-2" />
                            )}
                            <div className="flex-1 w-full">
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">{selectedJob.title}</h3>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                                    <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> {selectedJob.company}</span>
                                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> {selectedJob.location}</span>
                                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> {selectedJob.type}</span>
                                    {selectedJob.salary && <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> {selectedJob.salary}</span>}
                                    {selectedJob.experience && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" /> {selectedJob.experience}</span>}
                                </div>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                    <span className={`px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold border ${selectedJob.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                        {selectedJob.status?.toUpperCase() || 'ACTIVE'}
                                    </span>
                                    {selectedJob.verified && (
                                        <span className="px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Verified
                                        </span>
                                    )}
                                    <span className="px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                        {selectedJob.category || 'General'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="prose prose-sm max-w-none text-slate-600">
                                <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Description
                                </h4>
                                <div className="whitespace-pre-line bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                                    {selectedJob.description}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Required Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedJob.requiredSkills.map((skill, i) => (
                                                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Qualifications</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                                            {selectedJob.qualifications.map((qual, i) => (
                                                <li key={i}>{qual}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Contact & Application</h4>
                                <div className="space-y-1 text-slate-600">
                                    <p>Website: <a href={selectedJob.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{selectedJob.companyWebsite || "N/A"}</a></p>
                                    <p>Apply Link: <a href={selectedJob.applyLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{selectedJob.applyLink || "N/A"}</a></p>
                                    <p>Posted By Email: {selectedJob.email || "N/A"}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Dates</h4>
                                <div className="space-y-1 text-slate-600">
                                    <p>Posted: {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : "N/A"}</p>
                                    <p>Deadline: {selectedJob.applicationDeadline ? new Date(selectedJob.applicationDeadline).toLocaleDateString() : "N/A"}</p>
                                    {selectedJob.closedDate && <p>Closed: {new Date(selectedJob.closedDate).toLocaleDateString()}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal - Can be extracted to potentially reusable component */}
            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                            <div className="flex items-center gap-3 text-red-600 mb-4">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold">Delete Job?</h3>
                            </div>
                            <p className="text-slate-600 mb-6">
                                Are you sure you want to delete <span className="font-semibold">{jobToDelete?.title}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(jobToDelete._id || jobToDelete.id)}
                                    className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition shadow-lg shadow-red-100"
                                >
                                    Delete Job
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default JobsManagement;
