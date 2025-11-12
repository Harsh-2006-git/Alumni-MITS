import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronDown,
  LayoutDashboard,
  AlertCircle,
  CheckCircle,
  Loader,
  Home,
} from "lucide-react";

// Utility Components
const Alert = ({ type = "success", message, onClose }) => {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div
      className={`${styles[type]} border rounded-lg p-4 mb-4 flex items-center justify-between animate-fade-in`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
        <span className="font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
        <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-xl border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ adminData, onLogout, onMenuClick, onHomeClick }) => {
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
              {/* Logo Space */}
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <img
                  src="/assets/images/mits-logo.png"
                  alt="MITS Logo"
                  className="w-15 h-15 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold hidden sm:block">
                  Alumni Portal
                </h1>
                <span className="text-xs text-white/80 hidden sm:block">
                  Admin Dashboard
                </span>
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

// Footer Component
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
                  className="w-18 h-18 object-contain"
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

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, gradient, loading = false }) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-300`}
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
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 0, label: "Alumni Management", icon: Users },
    { id: 1, label: "Bulk Register", icon: Upload },
    { id: 2, label: "Event", icon: Calendar },
    { id: 3, label: "Campaign", icon: TrendingUp },
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

// Alumni Management Component
const AlumniManagement = ({ onError, onSuccess }) => {
  const [alumni, setAlumni] = useState([]);
  const [nonVerifiedAlumni, setNonVerifiedAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const fetchAlumni = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found");

      const [verifiedResponse, nonVerifiedResponse] = await Promise.all([
        fetch("https://alumni-mits-l45r.onrender.com/alumni/all-alumni", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          "https://alumni-mits-l45r.onrender.com/alumni/all-nonvarified-alumni",
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
        `https://alumni-mits-l45r.onrender.com/alumni/${alumniId}/verify`,
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
        `https://alumni-mits-l45r.onrender.com/alumni/delete/${alumniId}`,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  const AlumniTable = ({ data, showActions, showDelete }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((alum) => (
            <tr key={alum.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {alum.name?.[0] || "A"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{alum.name}</p>
                    <p className="text-sm text-gray-500 md:hidden">
                      {alum.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">
                {alum.email}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">
                {alum.phone}
              </td>
              <td className="px-4 py-4 hidden sm:table-cell">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    alum.isVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {alum.isVerified ? "Verified" : "Pending"}
                </span>
              </td>
              <td className="px-4 py-4">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Alumni Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
            <h3 className="text-xl font-bold">Verified Alumni</h3>
            <p className="text-3xl font-bold mt-2">{alumni.length}</p>
          </div>
          <div className="p-6">
            {alumni.length > 0 ? (
              <AlumniTable data={alumni} showDelete={true} />
            ) : (
              <p className="text-center text-gray-500 py-8">
                No verified alumni found
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
            <h3 className="text-xl font-bold">Pending Verification</h3>
            <p className="text-3xl font-bold mt-2">
              {nonVerifiedAlumni.length}
            </p>
          </div>
          <div className="p-6">
            {nonVerifiedAlumni.length > 0 ? (
              <AlumniTable data={nonVerifiedAlumni} showActions={true} />
            ) : (
              <p className="text-center text-gray-500 py-8">
                No pending alumni
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        title={`Alumni Details - ${selectedAlumni?.name}`}
      >
        {selectedAlumni && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-3 text-purple-600">
                Basic Information
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">ID:</span> {selectedAlumni.id}
                </p>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedAlumni.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedAlumni.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {selectedAlumni.phone}
                </p>
                <p>
                  <span className="font-semibold">Branch:</span>{" "}
                  {selectedAlumni.branch || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3 text-purple-600">Status</h4>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedAlumni.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {selectedAlumni.isVerified ? "Verified" : "Pending"}
              </span>
            </div>
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

// Bulk Register Component
const BulkRegister = ({ onError, onSuccess }) => {
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
        "https://alumni-mits-l45r.onrender.com/auth/bulk-register-alumni",
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

// Event Management Component
const EventManagement = ({ onError, onSuccess }) => {
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
        "https://alumni-mits-l45r.onrender.com/event/all-event",
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
          `https://alumni-mits-l45r.onrender.com/event/delete/${eventId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to delete event");
        onSuccess("Event deleted successfully");
      } else {
        const response = await fetch(
          `https://alumni-mits-l45r.onrender.com/event/review/${eventId}`,
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500 md:hidden">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">
                    {event.location}
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        event.isScheduled
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {event.isScheduled ? "Scheduled" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
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
                        onClick={() => handleEventAction(event.id, "delete")}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
      >
        {selectedEvent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-3 text-purple-600">
                Basic Information
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Title:</span>{" "}
                  {selectedEvent.title}
                </p>
                <p>
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedEvent.description}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(selectedEvent.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {selectedEvent.location}
                </p>
                <p>
                  <span className="font-semibold">Organizer:</span>{" "}
                  {selectedEvent.organizer}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3 text-purple-600">
                Additional Details
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {selectedEvent.type}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedEvent.category}
                </p>
                <p>
                  <span className="font-semibold">Max Attendees:</span>{" "}
                  {selectedEvent.maxAttendees}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> $
                  {selectedEvent.price}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Campaign Management Component
const CampaignManagement = ({ onError, onSuccess }) => {
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
        "https://alumni-mits-l45r.onrender.com/campaign/all-campaign",
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
          `https://alumni-mits-l45r.onrender.com/campaign/delete/${campaignId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to delete campaign");
        onSuccess("Campaign deleted successfully");
      } else if (action === "approve") {
        const response = await fetch(
          `https://alumni-mits-l45r.onrender.com/campaign/${campaignId}/approval`,
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">
                  Target
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">
                  Raised
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">
                      {campaign.campaignTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      {campaign.categories}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-purple-600 hidden md:table-cell">
                    ${parseFloat(campaign.totalAmount).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-green-600 hidden lg:table-cell">
                    ${parseFloat(campaign.currentAmount).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        campaign.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {campaign.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
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
                        onClick={() =>
                          handleCampaignAction(campaign.id, "delete")
                        }
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        title="Campaign Details"
      >
        {selectedCampaign && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-3 text-purple-600">
                Campaign Information
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Title:</span>{" "}
                  {selectedCampaign.campaignTitle}
                </p>
                <p>
                  <span className="font-semibold">Tagline:</span>{" "}
                  {selectedCampaign.tagline}
                </p>
                <p>
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedCampaign.detailedDescription}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedCampaign.categories}
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-3 text-purple-600">
                Financial Details
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Target:</span> $
                  {parseFloat(selectedCampaign.totalAmount).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Raised:</span> $
                  {parseFloat(selectedCampaign.currentAmount).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Contact:</span>{" "}
                  {selectedCampaign.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {selectedCampaign.contact}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Main Dashboard Component
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

  const getAuthToken = () => {
    const authData = localStorage.getItem("auth");
    return authData ? JSON.parse(authData).accessToken : null;
  };

  const fetchStats = async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found");

      // Fetch all stats in parallel
      const [
        alumniResponse,
        nonVerifiedResponse,
        eventsResponse,
        campaignsResponse,
      ] = await Promise.all([
        fetch("https://alumni-mits-l45r.onrender.com/alumni/all-alumni", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          "https://alumni-mits-l45r.onrender.com/alumni/all-nonvarified-alumni",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        fetch("https://alumni-mits-l45r.onrender.com/event/all-event", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://alumni-mits-l45r.onrender.com/campaign/all-campaign", {
          headers: { Authorization: `Bearer ${token}` },
        }),
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

      <Header
        adminData={adminData}
        onLogout={handleLogout}
        onMenuClick={() => setSidebarOpen(true)}
        onHomeClick={handleHomeClick}
      />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 0 && (
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  icon={Users}
                  label="Total Alumni"
                  value={stats.totalAlumni}
                  gradient="from-purple-500 to-indigo-600"
                  loading={statsLoading}
                />
                <StatsCard
                  icon={Users}
                  label="Pending Verification"
                  value={stats.pendingAlumni}
                  gradient="from-orange-500 to-red-600"
                  loading={statsLoading}
                />
                <StatsCard
                  icon={Calendar}
                  label="Active Events"
                  value={stats.activeEvents}
                  gradient="from-blue-500 to-cyan-600"
                  loading={statsLoading}
                />
                <StatsCard
                  icon={TrendingUp}
                  label="Running Campaigns"
                  value={stats.activeCampaigns}
                  gradient="from-green-500 to-emerald-600"
                  loading={statsLoading}
                />
              </div>
            )}

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

            {activeTab === 0 && (
              <AlumniManagement onError={setError} onSuccess={setSuccess} />
            )}
            {activeTab === 1 && (
              <BulkRegister onError={setError} onSuccess={setSuccess} />
            )}
            {activeTab === 2 && (
              <EventManagement onError={setError} onSuccess={setSuccess} />
            )}
            {activeTab === 3 && (
              <CampaignManagement onError={setError} onSuccess={setSuccess} />
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
