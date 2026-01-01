import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Target, DollarSign, Clock, Eye, CheckCircle, Check, X,
    Search, Loader, AlertCircle, Info, Trash2, Globe, Github, Mail, Phone, Calendar, Briefcase, User, Layers, ShieldCheck
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto pt-16 sm:pt-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-5xl max-h-none sm:max-h-[95vh] overflow-hidden flex flex-col mb-8 sm:mb-0">
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

const CampaignManagement = ({ isDarkMode }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [filter, setFilter] = useState("all");
    const [supports, setSupports] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [history, setHistory] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsData, setDetailsData] = useState({ title: "", type: "", items: [] });

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/campaign/all-campaign`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setCampaigns(data.campaigns || []);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaignDetails = async (campaignId) => {
        setLoadingDetails(true);
        try {
            const token = getAuthToken();
            const [supportsRes, complaintsRes] = await Promise.all([
                fetch(`${BASE_URL}/campaign/${campaignId}/supports`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                fetch(`${BASE_URL}/campaign/${campaignId}/complaints`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const supportsData = await supportsRes.json();
            const complaintsData = await complaintsRes.json();

            if (supportsRes.ok) setSupports(supportsData.data || []);
            if (complaintsRes.ok) setComplaints(complaintsData.data || []);
        } catch (error) {
            console.error("Error fetching campaign details:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleCampaignAction = async (campaignId, action, isApproved = null) => {
        try {
            const token = getAuthToken();
            let response;

            if (action === "delete") {
                response = await fetch(`${BASE_URL}/campaign/delete/${campaignId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else if (action === "approve") {
                response = await fetch(`${BASE_URL}/campaign/${campaignId}/approval`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ isApproved }),
                });
            }

            if (response.ok) {
                fetchCampaigns();
                if (selectedCampaign?.id === campaignId) setSelectedCampaign(null);
            }
        } catch (error) {
            console.error(`Error ${action}ing campaign:`, error);
        }
    };

    const handleVerifySupport = async (supportId, status) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${BASE_URL}/campaign/support/${supportId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                const result = await response.json();
                if (status === 'verified' && result.updatedCurrentAmount !== undefined) {
                    setSelectedCampaign(prev => ({ ...prev, currentAmount: result.updatedCurrentAmount }));
                }
                fetchCampaignDetails(selectedCampaign.id || selectedCampaign._id);
                fetchCampaigns();
            }
        } catch (error) {
            console.error("Verification failed", error);
        }
    };

    const filteredCampaigns = campaigns.filter(campaign => {
        const matchesSearch = campaign.campaignTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.tagline?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" ||
            (filter === "pending" && !campaign.isApproved) ||
            (filter === "approved" && campaign.isApproved);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage fundraising campaigns and initiatives.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                {['all', 'pending', 'approved'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-white rounded-xl border border-gray-200">
                    <Loader className="w-10 h-10 animate-spin text-indigo-500" />
                    <p className="text-gray-500 text-sm font-medium">Loading campaigns...</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 text-sm font-semibold border-b border-gray-200">
                                    <th className="px-6 py-4">Campaign</th>
                                    <th className="px-6 py-4">Progress</th>
                                    <th className="px-6 py-4">End Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCampaigns.map((campaign) => {
                                    const progress = (campaign.currentAmount / campaign.totalAmount) * 100;
                                    return (
                                        <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                                        <Layers className="w-6 h-6" />
                                                    </div>
                                                    <div className="max-w-xs">
                                                        <div className="text-gray-900 font-semibold line-clamp-1">{campaign.campaignTitle}</div>
                                                        <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{campaign.tagline}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-48 space-y-1.5">
                                                    <div className="flex justify-between items-end text-xs">
                                                        <span className="font-semibold text-gray-900">₹{campaign.currentAmount.toLocaleString()}</span>
                                                        <span className="text-gray-500">Goal: ₹{campaign.totalAmount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700">{new Date(campaign.endDate).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${campaign.isApproved
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                                    }`}>
                                                    {campaign.isApproved ? "Active" : "Pending"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCampaign(campaign);
                                                            fetchCampaignDetails(campaign.id);
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${isDarkMode ? "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"}`}
                                                    >
                                                        <Eye className="w-4 h-4" /> View
                                                    </button>
                                                    {!campaign.isApproved && (
                                                        <button
                                                            onClick={() => handleCampaignAction(campaign.id, "approve", true)}
                                                            className={`px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-700 transition-all active:scale-95`}
                                                        >
                                                            <Check className="w-4 h-4" /> Approve
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleCampaignAction(campaign.id, "delete")}
                                                        className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 ${isDarkMode ? "bg-slate-800 border-rose-900/50 text-rose-400 hover:bg-rose-500/10" : "bg-white text-rose-600 border-rose-100 hover:bg-rose-50"}`}
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {filteredCampaigns.map((campaign) => {
                            const progress = (campaign.currentAmount / campaign.totalAmount) * 100;
                            return (
                                <div key={campaign.id} className="p-4 space-y-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 flex-shrink-0">
                                                <Layers className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-gray-900 font-bold leading-tight line-clamp-1">{campaign.campaignTitle}</div>
                                                <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{campaign.tagline}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => {
                                                setSelectedCampaign(campaign);
                                                fetchCampaignDetails(campaign.id);
                                            }} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => handleCampaignAction(campaign.id, "delete")} className="p-2 text-rose-600 bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Raised</span>
                                                <span className="font-bold text-slate-800">₹{campaign.currentAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-[10px] text-gray-400 uppercase font-black tracking-tight">Goal</span>
                                                <span className="font-bold text-indigo-600">₹{campaign.totalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${campaign.isApproved
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                : "bg-amber-50 text-amber-700 border-amber-100"
                                                }`}>
                                                {campaign.isApproved ? "Active" : "Pending"}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                                <Calendar className="w-2.5 h-2.5" /> {new Date(campaign.endDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {!campaign.isApproved && (
                                            <button onClick={() => handleCampaignAction(campaign.id, "approve", true)} className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shadow-sm">APPROVE</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Campaign Details Modal */}
            <Modal isOpen={!!selectedCampaign} onClose={() => setSelectedCampaign(null)} title="Campaign Details">
                {selectedCampaign && (
                    <div className="space-y-6 pb-6">
                        <div className="bg-gray-900 rounded-xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <span className="px-2 py-1 bg-indigo-500 text-white rounded text-xs font-semibold">{selectedCampaign.categories}</span>
                                <h1 className="text-2xl font-bold mt-3 mb-1">{selectedCampaign.campaignTitle}</h1>
                                <p className="text-gray-300 italic text-sm">"{selectedCampaign.tagline}"</p>

                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-semibold">Raised</p>
                                        <p className="font-bold text-lg">₹{selectedCampaign.currentAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-semibold">Goal</p>
                                        <p className="font-bold text-lg">₹{selectedCampaign.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-semibold">Status</p>
                                        <p className={`font-bold ${selectedCampaign.isApproved ? "text-emerald-400" : "text-amber-400"}`}>
                                            {selectedCampaign.isApproved ? "Active" : "Pending"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase font-semibold">End Date</p>
                                        <p className="font-bold">{new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                    <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                        {selectedCampaign.detailedDescription}
                                    </div>
                                </div>

                                {/* ADMIN VIEW: SUPPORTERS & COMPLAINTS */}
                                <div className="space-y-6">
                                    {/* Pending Payments Section */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-amber-500">
                                                <Clock className="w-5 h-5" /> Payment Approval
                                            </h3>
                                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{supports.filter(s => s.status === 'pending').length} Pending</span>
                                        </div>
                                        <div className="space-y-3">
                                            {loadingDetails ? (
                                                <div className="text-center py-4"><Loader className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></div>
                                            ) : supports.filter(s => s.status === 'pending').length > 0 ? (
                                                <>
                                                    {supports.filter(s => s.status === 'pending').slice(0, 5).map((s, i) => (
                                                        <div key={i} className="p-4 rounded-xl border border-amber-100 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <p className="font-bold text-gray-900 break-words">{s.supporterName}</p>
                                                                </div>
                                                                <p className="text-xs text-gray-500 break-words">{s.supporterEmail} • <span className="uppercase">{s.supporterUserType}</span></p>
                                                                <p className="text-[10px] text-gray-400 font-mono mt-1 break-all">UTR: {s.transactionId}</p>
                                                            </div>
                                                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                                                <p className="font-black text-amber-600 text-lg">₹{s.amount}</p>
                                                                <div className="flex gap-1">
                                                                    <button onClick={() => handleVerifySupport(s._id, 'verified')} className="p-1 px-2 bg-emerald-500 text-white rounded text-[10px] font-bold hover:bg-emerald-600 shadow-sm">Approve</button>
                                                                    <button onClick={() => handleVerifySupport(s._id, 'rejected')} className="p-1 px-2 bg-red-500 text-white rounded text-[10px] font-bold hover:bg-red-600 shadow-sm">Reject</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {supports.filter(s => s.status === 'pending').length > 5 && (
                                                        <button
                                                            onClick={() => {
                                                                setDetailsData({ title: "Pending Payment Approval", type: "supporters", items: supports.filter(s => s.status === 'pending') });
                                                                setShowDetailsModal(true);
                                                            }}
                                                            className="w-full py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-amber-100 transition-all border border-amber-100"
                                                        >
                                                            See All Pending ({supports.filter(s => s.status === 'pending').length})
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-center py-4 text-xs text-gray-500 italic">No pending verifications</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Verified Contributions Section */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-emerald-500">
                                                <CheckCircle className="w-5 h-5" /> Accepted Payments
                                            </h3>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{supports.filter(s => s.status === 'verified').length} Accepted</span>
                                        </div>
                                        <div className="space-y-3">
                                            {loadingDetails ? (
                                                <div className="text-center py-4"><Loader className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></div>
                                            ) : supports.filter(s => s.status === 'verified').length > 0 ? (
                                                <>
                                                    {supports.filter(s => s.status === 'verified').slice(0, 5).map((s, i) => (
                                                        <div key={i} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-gray-900 break-words">{s.supporterName}</p>
                                                                <p className="text-xs text-gray-500 break-words">{s.supporterEmail} • <span className="uppercase">{s.supporterUserType}</span></p>
                                                                <p className="text-[10px] text-gray-400 font-mono mt-0.5 break-all">Verified on: {new Date(s.verifiedAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="flex justify-between sm:block">
                                                                <span className="sm:hidden text-[10px] font-bold text-gray-400 uppercase">Amount:</span>
                                                                <p className="font-black text-emerald-600 text-lg">₹{s.amount}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {supports.filter(s => s.status === 'verified').length > 5 && (
                                                        <button
                                                            onClick={() => {
                                                                setDetailsData({ title: "Accepted Payments", type: "supporters", items: supports.filter(s => s.status === 'verified') });
                                                                setShowDetailsModal(true);
                                                            }}
                                                            className="w-full py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
                                                        >
                                                            See All Accepted ({supports.filter(s => s.status === 'verified').length})
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-center py-4 text-xs text-gray-500 italic">No payments accepted yet</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Complaints Section */}
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 text-rose-500">
                                                <AlertCircle className="w-5 h-5" /> Query / Complaints
                                            </h3>
                                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">{complaints.length} Total</span>
                                        </div>
                                        <div className="space-y-3">
                                            {complaints.length > 0 ? (
                                                <>
                                                    {complaints.slice(0, 5).map((c, i) => (
                                                        <div key={i} className="p-4 rounded-xl border border-rose-100 bg-rose-50/30">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <p className="font-bold text-gray-900">{c.supporterName}</p>
                                                                    <p className="text-xs text-gray-500">{c.supporterEmail} • <span className="uppercase">{c.supporterUserType}</span></p>
                                                                </div>
                                                                <span className="text-[10px] text-gray-400 font-bold">{new Date(c.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="p-3 bg-white border border-rose-100 rounded-lg text-sm text-rose-700 italic">
                                                                "{c.complaintText}"
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {complaints.length > 5 && (
                                                        <button
                                                            onClick={() => {
                                                                setDetailsData({ title: "All Queries", type: "complaints", items: complaints });
                                                                setShowDetailsModal(true);
                                                            }}
                                                            className="w-full py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
                                                        >
                                                            See All Queries ({complaints.length})
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <p className="text-center py-4 text-xs text-gray-500 italic">No active complaints</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {selectedCampaign.images?.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Gallery</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedCampaign.images.map((img, i) => (
                                                <div key={i} className="aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Contact Info</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="font-medium text-gray-900 break-all">{selectedCampaign.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="font-medium text-gray-900">{selectedCampaign.contact}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm border-t border-gray-100 pt-3 mt-3">
                                            <User className="w-4 h-4 text-indigo-400" />
                                            <div>
                                                <p className="text-xs text-gray-500">User Identity</p>
                                                <p className="font-bold text-indigo-600 uppercase text-[10px] tracking-widest">{selectedCampaign.userType || 'Student'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase text-center mb-2">Campaign Actions</h3>
                                    {!selectedCampaign.isApproved && (
                                        <button
                                            onClick={() => handleCampaignAction(selectedCampaign.id, "approve", true)}
                                            className="w-full py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm shadow-sm"
                                        >
                                            Approve Campaign
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleCampaignAction(selectedCampaign.id, "delete")}
                                        className="w-full py-2.5 bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition font-medium text-sm"
                                    >
                                        Delete Campaign
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* FULL DETAILS MODAL */}
            {showDetailsModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-slate-900/90 backdrop-blur-xl">
                    <div className={`w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-white border border-gray-200`}>
                        {/* Modal Header */}
                        <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-blue-700 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-bold">{detailsData.title}</h3>
                                <p className="text-sm opacity-80 mt-1">Showing all {detailsData.items.length} records</p>
                            </div>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:rotate-90"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable Table */}
                        <div className="flex-1 overflow-auto custom-scrollbar p-4 sm:p-8 bg-gray-50/50">
                            <div className="space-y-4">
                                {/* Table Header */}
                                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-200 min-w-[900px]">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-3">User Details</div>
                                    <div className="col-span-3">Email & Type</div>
                                    <div className="col-span-2">Amount</div>
                                    <div className="col-span-3">
                                        {detailsData.type === 'complaints' ? 'Complaint Message' : 'Transaction / Date'}
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-4">
                                    {detailsData.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 sm:p-6 rounded-3xl border border-gray-100 bg-white hover:bg-gray-50 transition-all shadow-sm sm:min-w-[900px]"
                                        >
                                            <div className="sm:col-span-1 flex items-center justify-between sm:justify-start">
                                                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                                                    {idx + 1}
                                                </span>
                                            </div>

                                            {/* User Info */}
                                            <div className="sm:col-span-3 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                                                        {item.supporterName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-base text-gray-900">{item.supporterName}</p>
                                                        <p className="text-[10px] sm:hidden text-gray-500">{item.supporterEmail}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contact & Type */}
                                            <div className="sm:col-span-3 space-y-1">
                                                <p className={`hidden sm:block text-sm font-semibold break-words ${isDarkMode ? "text-cyan-400/80" : "text-blue-600"}`}>{item.supporterEmail || 'N/A'}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 uppercase border border-gray-200">
                                                        {item.supporterUserType || 'Student'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Amount */}
                                            <div className="sm:col-span-2">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 sm:hidden">Amount Paid:</span>
                                                    <span className="text-lg font-black text-emerald-600">
                                                        ₹{item.amount || '0'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Dynamic Column */}
                                            <div className="sm:col-span-3">
                                                {detailsData.type === 'complaints' ? (
                                                    <div className="p-3 rounded-2xl text-xs italic bg-red-50 text-red-600 border border-red-100">
                                                        "{item.complaintText}"
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-mono text-gray-500 bg-gray-100 p-2 rounded-lg break-all border border-gray-200">UTR: {item.transactionId || 'N/A'}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{item.verifiedAt || item.createdAt ? new Date(item.verifiedAt || item.createdAt).toLocaleString() : ''}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 sm:p-6 bg-white border-t border-gray-200 text-center">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-10 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold transition-all border border-gray-200"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignManagement;
