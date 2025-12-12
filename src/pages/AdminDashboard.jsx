import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
import {
  Menu,
  X,
  LogOut,
  Users,
  Upload,
  Calendar,
  TrendingUp,
  Bell,
  Eye,
  Check,
  XCircle,
  Trash2,
  Download,
  LayoutDashboard,
  AlertCircle,
  CheckCircle,
  Loader,
  Home,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Briefcase,
  Globe,
  Github,
  Twitter,
  Link,
  DollarSign,
  Target,
  Clock,
  UserCheck,
  UserX,
  BarChart3,
} from "lucide-react";

// ==================== UTILITY COMPONENTS ====================
const Alert = ({ type = "success", message, onClose }) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`${styles[type]} border rounded-lg p-4 mb-4 flex items-center justify-between animate-fade-in`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : type === "error" ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-blue-600" />
        )}
        <span className="font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div
        className={`bg-white rounded-xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto animate-scale-in`}
      >
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const StatsCard = ({
  icon: Icon,
  label,
  value,
  gradient,
  loading = false,
  change,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 group`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold">
            {loading ? (
              <Loader className="w-8 h-8 animate-spin text-white/70" />
            ) : (
              value
            )}
          </p>
          {change && (
            <p
              className={`text-xs mt-1 ${
                change > 0 ? "text-green-200" : "text-red-200"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}% from last month
            </p>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

// Helper Components for Alumni Details
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-900">{value || "N/A"}</span>
  </div>
);

const SocialLinkRow = ({ icon: Icon, label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="font-medium text-gray-600 flex items-center gap-2">
      <Icon className="w-4 h-4" />
      {label}:
    </span>
    {value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        View Profile
      </a>
    ) : (
      <span className="text-gray-400">Not provided</span>
    )}
  </div>
);

// ==================== LAYOUT COMPONENTS ====================
const Header = ({
  adminData,
  onLogout,
  onMenuClick,
  onHomeClick,
  notifications = [],
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <img
                  src="/assets/images/mits-logo.png"
                  alt="MITS Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold">Alumni Portal</h1>
                <span className="text-xs text-white/80">Admin Dashboard</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onHomeClick}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
              title="Go to Home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-white/10 transition relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border animate-scale-in">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="p-4 border-b hover:bg-gray-50"
                        >
                          <p className="text-sm text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                {adminData?.name?.[0] || "A"}
              </div>
              <span className="text-sm font-medium">
                {adminData?.name || "Admin"}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 0, label: "Dashboard", icon: LayoutDashboard },
    { id: 1, label: "Alumni's", icon: Users },
    { id: 2, label: "Bulk Register", icon: Upload },
    { id: 3, label: "Event ", icon: Calendar },
    { id: 4, label: "Campaign ", icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="p-6 border-b flex items-center justify-between lg:justify-center">
          <h2 className="text-xl font-bold text-gray-800">Admin Menu</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <img
                  src="/assets/images/mits-logo.png"
                  alt="MITS Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">Alumni Portal</h3>
            </div>
            <p className="text-gray-300 max-w-md">
              Connecting alumni with their alma mater. Manage alumni data,
              events, and fundraising campaigns efficiently through our
              comprehensive admin portal.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Alumni
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Campaigns
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Alumni Portal. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// ==================== CONTENT PAGES ====================
// Page 1: Dashboard Overview
const DashboardOverview = ({ stats, loading, onTabChange }) => {
  const recentActivities = [
    {
      type: "alumni",
      message: "New alumni registration pending approval",
      time: "2 minutes ago",
    },
    {
      type: "event",
      message: "New event created: Alumni Meet 2024",
      time: "1 hour ago",
    },
    {
      type: "campaign",
      message: 'Campaign "Green Campus" reached 50% of goal',
      time: "3 hours ago",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          label="Total Alumni"
          value={stats.totalAlumni}
          gradient="from-purple-500 to-indigo-600"
          loading={loading}
          change={12}
        />
        <StatsCard
          icon={UserX}
          label="Pending Verification"
          value={stats.pendingAlumni}
          gradient="from-orange-500 to-red-600"
          loading={loading}
          change={-5}
        />
        <StatsCard
          icon={Calendar}
          label="Active Events"
          value={stats.activeEvents}
          gradient="from-blue-500 to-cyan-600"
          loading={loading}
          change={8}
        />
        <StatsCard
          icon={TrendingUp}
          label="Running Campaigns"
          value={stats.activeCampaigns}
          gradient="from-green-500 to-emerald-600"
          loading={loading}
          change={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onTabChange(1)}
              className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all text-left"
            >
              <Users className="w-8 h-8 mb-2" />
              <h4 className="font-bold">Manage Alumni</h4>
              <p className="text-sm text-white/80">
                View and verify alumni accounts
              </p>
            </button>
            <button
              onClick={() => onTabChange(2)}
              className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all text-left"
            >
              <Upload className="w-8 h-8 mb-2" />
              <h4 className="font-bold">Bulk Register</h4>
              <p className="text-sm text-white/80">
                Upload multiple alumni at once
              </p>
            </button>
            <button
              onClick={() => onTabChange(3)}
              className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all text-left"
            >
              <Calendar className="w-8 h-8 mb-2" />
              <h4 className="font-bold">Event Management</h4>
              <p className="text-sm text-white/80">Manage campus events</p>
            </button>
            <button
              onClick={() => onTabChange(4)}
              className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all text-left"
            >
              <TrendingUp className="w-8 h-8 mb-2" />
              <h4 className="font-bold">Campaigns</h4>
              <p className="text-sm text-white/80">
                Oversee fundraising campaigns
              </p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${
                    activity.type === "alumni"
                      ? "bg-purple-500"
                      : activity.type === "event"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Page 2: Alumni Management
const AlumniManagementPage = ({ onError, onSuccess }) => {
  
  const [alumni, setAlumni] = useState([]);
  const [nonVerifiedAlumni, setNonVerifiedAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const fetchAlumni = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found");

      const [verifiedResponse, nonVerifiedResponse] = await Promise.all([
        fetch(`${BASE_URL}/alumni/all-alumni`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `${BASE_URL}/alumni/all-nonvarified-alumni`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      if (!verifiedResponse.ok || !nonVerifiedResponse.ok) {
        throw new Error("Failed to fetch alumni");
      }

      const verifiedData = await verifiedResponse.json();
      const nonVerifiedData = await nonVerifiedResponse.json();

      setAlumni(verifiedData.data || []);
      setNonVerifiedAlumni(nonVerifiedData.data || []);
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleVerifyAlumni = async (alumniId, action) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${BASE_URL}/alumni/${alumniId}/verify`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) throw new Error("Failed to update alumni status");

      const result = await response.json();
      onSuccess(result.message);
      fetchAlumni();
    } catch (error) {
      onError(error.message);
    }
  };

  const handleDeleteAlumni = async (alumniId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${BASE_URL}/alumni/delete/${alumniId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete alumni");

      onSuccess("Alumni deleted successfully");
      setDeleteConfirm(null);
      fetchAlumni();
    } catch (error) {
      onError(error.message);
    }
  };

  const filteredAlumni = alumni.filter(
    (alum) =>
      alum.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNonVerifiedAlumni = nonVerifiedAlumni.filter(
    (alum) =>
      alum.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alum.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const AlumniCard = ({ alum, showActions, showDelete }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {alum.name?.[0] || "A"}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{alum.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Mail className="w-4 h-4" />
              <span>{alum.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Phone className="w-4 h-4" />
              <span>{alum.phone}</span>
            </div>
            {alum.profile?.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{alum.profile.location}</span>
              </div>
            )}
            {alum.profile?.branch && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Building className="w-4 h-4" />
                <span>{alum.profile.branch}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              alum.isVerified
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {alum.isVerified ? (
              <>
                <UserCheck className="w-4 h-4" />
                Verified
              </>
            ) : (
              <>
                <UserX className="w-4 h-4" />
                Pending
              </>
            )}
          </span>

          <div className="flex items-center gap-2">
            {showActions && (
              <>
                <button
                  onClick={() => handleVerifyAlumni(alum.id, "accept")}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                  title="Accept"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleVerifyAlumni(alum.id, "reject")}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  title="Reject"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </>
            )}
            {showDelete && (
              <button
                onClick={() => setDeleteConfirm(alum)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSelectedAlumni(alum)}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Alumni Management</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search alumni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <Users className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Verified Alumni</h3>
                <p className="text-3xl font-bold mt-2">{alumni.length}</p>
              </div>
              <UserCheck className="w-12 h-12 text-white/80" />
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map((alum) => (
                <AlumniCard key={alum.id} alum={alum} showDelete={true} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-lg">
                No verified alumni found
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Pending Verification</h3>
                <p className="text-3xl font-bold mt-2">
                  {nonVerifiedAlumni.length}
                </p>
              </div>
              <UserX className="w-12 h-12 text-white/80" />
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredNonVerifiedAlumni.length > 0 ? (
              filteredNonVerifiedAlumni.map((alum) => (
                <AlumniCard key={alum.id} alum={alum} showActions={true} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-white rounded-xl shadow-lg">
                No pending alumni
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alumni Details Modal */}
      <Modal
        isOpen={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        title={`Alumni Details - ${selectedAlumni?.name}`}
        size="lg"
      >
        {selectedAlumni && (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {selectedAlumni.name?.[0] || "A"}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedAlumni.name}
                </h3>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{selectedAlumni.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{selectedAlumni.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        selectedAlumni.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedAlumni.isVerified ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Verified
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4" />
                          Pending Verification
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-purple-600 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Basic Information
                </h4>
                <div className="space-y-3">
                  <InfoRow label="User ID" value={selectedAlumni.id} />
                  <InfoRow
                    label="Location"
                    value={selectedAlumni.profile?.location}
                  />
                  <InfoRow
                    label="Branch"
                    value={selectedAlumni.profile?.branch}
                  />
                  <InfoRow
                    label="Batch"
                    value={selectedAlumni.profile?.batch}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-lg text-purple-600 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Social Links
                </h4>
                <div className="space-y-3">
                  <SocialLinkRow
                    icon={Link}
                    label="LinkedIn"
                    value={selectedAlumni.profile?.linkedin}
                  />
                  <SocialLinkRow
                    icon={Github}
                    label="GitHub"
                    value={selectedAlumni.profile?.github}
                  />
                  <SocialLinkRow
                    icon={Twitter}
                    label="Twitter"
                    value={selectedAlumni.profile?.twitter}
                  />
                  <SocialLinkRow
                    icon={Globe}
                    label="Portfolio"
                    value={selectedAlumni.profile?.portfolio}
                  />
                </div>
              </div>
            </div>

            {selectedAlumni.profile?.education &&
              selectedAlumni.profile.education.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-purple-600 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </h4>
                  <div className="space-y-3">
                    {selectedAlumni.profile.education.map((edu, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{edu.stream}</p>
                            <p className="text-gray-600">{edu.institution}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>
                              {new Date(edu.from).getFullYear()} -{" "}
                              {new Date(edu.to).getFullYear()}
                            </p>
                            <p>GPA: {edu.gpa}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {selectedAlumni.profile?.experience &&
              selectedAlumni.profile.experience.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-purple-600 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experience
                  </h4>
                  <div className="space-y-3">
                    {selectedAlumni.profile.experience.map((exp, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{exp.position}</p>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>
                              {new Date(exp.from).toLocaleDateString()} -{" "}
                              {exp.to
                                ? new Date(exp.to).toLocaleDateString()
                                : "Present"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <strong>{deleteConfirm?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteAlumni(deleteConfirm?.id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Page 3: Bulk Register
const BulkRegisterPage = ({ onError, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.name.endsWith(".csv")) {
      setFile(droppedFile);
    } else {
      onError("Please upload a CSV file");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.name.endsWith(".csv")) {
      setFile(selectedFile);
    } else {
      onError("Please upload a CSV file");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      onError("Please select a file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = getAuthToken();
      const response = await fetch(
        `${BASE_URL}/auth/bulk-register-alumni`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Upload failed");

      setResults(result);
      onSuccess(
        `Bulk registration completed! ${result.summary.successful} successful, ${result.summary.failed} failed`
      );
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = () => {
    const sample = `name,email,phone,branch,batchYear,location,linkedinUrl
Harsh Manmode,24it10ha60@mitsgwl.ac.in,9876543210,Computer Science,2020-2024,New York,https://linkedin.com/in/harshmanmode
Jane Smith,jane.smith@example.com,9876543211,Electronics Engineering,2021-2025,Delhi,https://linkedin.com/in/janesmith
Raj Kumar,raj.kumar@example.com,9876543212,Mechanical Engineering,2019-2023,Bangalore,
Priya Singh,priya.singh@example.com,9876543213,Civil Engineering,2022-2026,Mumbai,https://linkedin.com/in/priyasingh
Amit Sharma,amit.sharma@example.com,9876543214,Information Technology,2020-2024,Hyderabad,
Neha Verma,neha.verma@example.com,9876543215,Electrical Engineering,2021-2025,Pune,https://linkedin.com/in/nehaverma`;

    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_alumni.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Bulk Register Alumni</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Upload CSV File</h3>

          <div
            onDragOver={handleDragOver}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragOver
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <Upload
              className={`w-16 h-16 mx-auto mb-4 ${
                dragOver ? "text-purple-600" : "text-gray-400"
              }`}
            />
            <h4 className="text-lg font-semibold mb-2">Drag & Drop CSV Here</h4>
            <p className="text-gray-500 mb-4">or</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <label className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
                Select File
              </label>
              <button
                onClick={downloadSample}
                className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Download Sample
              </button>
            </div>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">{file.name}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!file || loading}
            className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : (
              "Upload and Process"
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Instructions</h3>
          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                1
              </span>
              <span>Download the sample CSV template</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                2
              </span>
              <span>Fill in alumni details (name, email, phone, branch)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                3
              </span>
              <span>Upload the completed CSV file</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                4
              </span>
              <span>System will automatically create accounts</span>
            </li>
          </ol>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-4">Upload Results</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
              Total: {results.summary.totalProcessed}
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
              Success: {results.summary.successful}
            </span>
            <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium">
              Failed: {results.summary.failed}
            </span>
          </div>

          {results.successfulRegistrations?.length > 0 && (
            <div className="overflow-x-auto">
              <h4 className="font-bold mb-2">Successful Registrations:</h4>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Temp Password</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.successfulRegistrations.map((alum, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2">{alum.name}</td>
                      <td className="px-4 py-2">{alum.email}</td>
                      <td className="px-4 py-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">
                          {alum.temporaryPassword}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Page 4: Event Management
const EventManagementPage = ({ onError, onSuccess }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const fetchEvents = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${BASE_URL}/event/all-event`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      onError(error.message);
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

      if (action === "delete") {
        const response = await fetch(
          `${BASE_URL}/event/delete/${eventId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to delete event");
        onSuccess("Event deleted successfully");
      } else {
        const response = await fetch(
          `${BASE_URL}/event/review/${eventId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ action }),
          }
        );

        if (!response.ok) throw new Error("Failed to update event");

        const result = await response.json();
        onSuccess(result.message);
      }

      fetchEvents();
    } catch (error) {
      onError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
            <p className="text-gray-600 mt-1">{event.description}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.maxAttendees} max attendees
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {event.price === 0 ? "Free" : `$${event.price}`}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              event.isScheduled
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {event.isScheduled ? "Scheduled" : "Pending"}
          </span>

          <div className="flex items-center gap-2">
            {!event.isScheduled && (
              <button
                onClick={() => handleEventAction(event.id, "accept")}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                title="Accept"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleEventAction(event.id, "reject")}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              title="Reject"
            >
              <XCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => setSelectedEvent(event)}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Event Management</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{events.length}</h3>
            <p className="text-gray-600">Total Events</p>
          </div>
        </div>

        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="text-center py-8 text-gray-500">
              No events found
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Calendar className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedEvent.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {selectedEvent.description}
                </p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedEvent.isScheduled
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedEvent.isScheduled
                      ? "Scheduled"
                      : "Pending Approval"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-purple-600">
                  Event Information
                </h4>
                <div className="space-y-3">
                  <InfoRow
                    label="Date"
                    value={new Date(selectedEvent.date).toLocaleDateString()}
                  />
                  <InfoRow label="Location" value={selectedEvent.location} />
                  <InfoRow label="Organizer" value={selectedEvent.organizer} />
                  <InfoRow
                    label="Organizer Email"
                    value={selectedEvent.organizerEmail}
                  />
                  <InfoRow
                    label="Price"
                    value={
                      selectedEvent.price === 0
                        ? "Free"
                        : `$${selectedEvent.price}`
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-lg text-purple-600">
                  Event Details
                </h4>
                <div className="space-y-3">
                  <InfoRow label="Category" value={selectedEvent.category} />
                  <InfoRow label="Type" value={selectedEvent.type} />
                  <InfoRow
                    label="Max Attendees"
                    value={selectedEvent.maxAttendees}
                  />
                  <InfoRow
                    label="Created"
                    value={new Date(
                      selectedEvent.createdAt
                    ).toLocaleDateString()}
                  />
                </div>
              </div>
            </div>

            {selectedEvent.image && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-purple-600">
                  Event Image
                </h4>
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// Page 5: Campaign Management
const CampaignManagementPage = ({ onError, onSuccess }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const fetchCampaigns = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
       `${BASE_URL}/campaign/all-campaign`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch campaigns");

      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCampaignAction = async (
    campaignId,
    action,
    isApproved = null
  ) => {
    try {
      const token = getAuthToken();

      if (action === "delete") {
        const response = await fetch(
          `${BASE_URL}/campaign/delete/${campaignId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to delete campaign");
        onSuccess("Campaign deleted successfully");
      } else if (action === "approve") {
        const response = await fetch(
          `${BASE_URL}/campaign/${campaignId}/approval`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isApproved }),
          }
        );

        if (!response.ok) throw new Error("Failed to update campaign");

        const result = await response.json();
        onSuccess(result.message);
      }

      fetchCampaigns();
    } catch (error) {
      onError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const CampaignCard = ({ campaign }) => {
    const progress = (campaign.currentAmount / campaign.totalAmount) * 100;

    return (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900">
                {campaign.campaignTitle}
              </h3>
              <p className="text-gray-600 mt-1">{campaign.tagline}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Goal: ${parseFloat(campaign.totalAmount).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Raised: ${parseFloat(campaign.currentAmount).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(campaign.endDate).toLocaleDateString()}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                campaign.isApproved
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {campaign.isApproved ? "Approved" : "Pending"}
            </span>

            <div className="flex items-center gap-2">
              {!campaign.isApproved && (
                <button
                  onClick={() =>
                    handleCampaignAction(campaign.id, "approve", true)
                  }
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                  title="Approve"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() =>
                  handleCampaignAction(campaign.id, "approve", false)
                }
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedCampaign(campaign)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Campaign Management</h2>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{campaigns.length}</h3>
            <p className="text-gray-600">Total Campaigns</p>
          </div>
        </div>

        <div className="space-y-4">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No campaigns found
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        title="Campaign Details"
        size="lg"
      >
        {selectedCampaign && (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedCampaign.campaignTitle}
                </h3>
                <p className="text-gray-600 mt-2">{selectedCampaign.tagline}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCampaign.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedCampaign.isApproved
                      ? "Approved"
                      : "Pending Approval"}
                  </span>
                  <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {selectedCampaign.categories}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-purple-600">
                  Campaign Information
                </h4>
                <div className="space-y-3">
                  <InfoRow
                    label="Description"
                    value={selectedCampaign.detailedDescription}
                  />
                  <InfoRow
                    label="Category"
                    value={selectedCampaign.categories}
                  />
                  <InfoRow
                    label="Start Date"
                    value={new Date(
                      selectedCampaign.startDate
                    ).toLocaleDateString()}
                  />
                  <InfoRow
                    label="End Date"
                    value={new Date(
                      selectedCampaign.endDate
                    ).toLocaleDateString()}
                  />
                  <InfoRow
                    label="Contact Email"
                    value={selectedCampaign.email}
                  />
                  <InfoRow
                    label="Contact Phone"
                    value={selectedCampaign.contact}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-lg text-purple-600">
                  Financial Details
                </h4>
                <div className="space-y-3">
                  <InfoRow
                    label="Target Amount"
                    value={`$${parseFloat(
                      selectedCampaign.totalAmount
                    ).toLocaleString()}`}
                  />
                  <InfoRow
                    label="Raised Amount"
                    value={`$${parseFloat(
                      selectedCampaign.currentAmount
                    ).toLocaleString()}`}
                  />
                  <InfoRow
                    label="Progress"
                    value={`${Math.round(
                      (selectedCampaign.currentAmount /
                        selectedCampaign.totalAmount) *
                        100
                    )}%`}
                  />
                  <InfoRow
                    label="Project Link"
                    value={
                      <a
                        href={selectedCampaign.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Project
                      </a>
                    }
                  />
                  <InfoRow
                    label="GitHub"
                    value={
                      selectedCampaign.github ? (
                        <a
                          href={selectedCampaign.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Repository
                        </a>
                      ) : (
                        "N/A"
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {selectedCampaign.images && selectedCampaign.images.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-purple-600">
                  Campaign Images
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedCampaign.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Campaign image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
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

// ==================== MAIN ADMIN DASHBOARD ====================
const AdminDashboard = ({ setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    totalAlumni: 0,
    pendingAlumni: 0,
    activeEvents: 0,
    activeCampaigns: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  const notifications = [
    { message: "New alumni registration requires approval", time: "5 min ago" },
    {
      message: 'Event "Tech Symposium" is scheduled for tomorrow',
      time: "1 hour ago",
    },
  ];

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found");

      const [
        alumniResponse,
        nonVerifiedResponse,
        eventsResponse,
        campaignsResponse,
      ] = await Promise.all([
        fetch(`${BASE_URL}/alumni/all-alumni`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `${BASE_URL}/alumni/all-nonvarified-alumni`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch(`${BASE_URL}/event/all-event`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `${BASE_URL}/campaign/all-campaign`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      if (
        !alumniResponse.ok ||
        !nonVerifiedResponse.ok ||
        !eventsResponse.ok ||
        !campaignsResponse.ok
      ) {
        throw new Error("Failed to fetch statistics");
      }

      const alumniData = await alumniResponse.json();
      const nonVerifiedData = await nonVerifiedResponse.json();
      const eventsData = await eventsResponse.json();
      const campaignsData = await campaignsResponse.json();

      setStats({
        totalAlumni: alumniData.data?.length || 0,
        pendingAlumni: nonVerifiedData.data?.length || 0,
        activeEvents: eventsData.events?.length || 0,
        activeCampaigns: campaignsData.campaigns?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load dashboard statistics");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsedAuth = JSON.parse(authData);
      setAdminData(parsedAuth.user || { userType: "admin" });
    }
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  // Render the active content page
  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <DashboardOverview
            stats={stats}
            loading={statsLoading}
            onTabChange={setActiveTab}
          />
        );
      case 1:
        return (
          <AlumniManagementPage onError={setError} onSuccess={setSuccess} />
        );
      case 2:
        return <BulkRegisterPage onError={setError} onSuccess={setSuccess} />;
      case 3:
        return (
          <EventManagementPage onError={setError} onSuccess={setSuccess} />
        );
      case 4:
        return (
          <CampaignManagementPage onError={setError} onSuccess={setSuccess} />
        );
      default:
        return (
          <DashboardOverview
            stats={stats}
            loading={statsLoading}
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>

      {/* HEADER */}
      <Header
        adminData={adminData}
        onLogout={handleLogout}
        onMenuClick={() => setSidebarOpen(true)}
        onHomeClick={handleHomeClick}
        notifications={notifications}
      />

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* ALERTS */}
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError("")}
              />
            )}
            {success && (
              <Alert
                type="success"
                message={success}
                onClose={() => setSuccess("")}
              />
            )}

            {/* DYNAMIC CONTENT - This is where different pages render */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;
