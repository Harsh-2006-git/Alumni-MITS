import React, { useState } from 'react';
import {
    Upload, Download, CheckCircle, XCircle, Loader, FileText, AlertCircle, Trash2, Search
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const BulkRegister = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [notification, setNotification] = useState(null);

    const getAuthToken = () => {
        const authData = localStorage.getItem("auth");
        return authData ? JSON.parse(authData).accessToken : null;
    };

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
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
            showNotification("Please upload a CSV file", "error");
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile?.name.endsWith(".csv")) {
            setFile(selectedFile);
        } else {
            showNotification("Please upload a CSV file", "error");
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            showNotification("Please select a file first", "error");
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
            showNotification(
                `Bulk registration completed! ${result.summary.successful} successful, ${result.summary.failed} failed`
            );
        } catch (error) {
            showNotification(error.message, "error");
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
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Bulk Register Alumni</h2>
                    <p className="text-sm text-slate-500">Upload CSV files to register multiple alumni accounts simultaneously.</p>
                </div>
            </div>

            {notification && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-fade-in ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{notification.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${dragOver
                                ? "border-indigo-500 bg-indigo-50/50"
                                : "border-slate-200 bg-slate-50/50"
                            } group hover:border-indigo-400 hover:bg-slate-50 transition`}
                    >
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
                            <Upload className={`w-10 h-10 ${dragOver ? "text-indigo-600" : "text-slate-400"}`} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 mb-2">Drag & Drop CSV Here</h4>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Upload your prepared alumni data file. Ensure it follows the template format for successful processing.</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <label className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Upload className="w-5 h-5" />
                                Select File
                            </label>
                            <button
                                onClick={downloadSample}
                                className="w-full sm:w-auto px-8 py-3 border-2 border-indigo-100 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download Template
                            </button>
                        </div>
                    </div>

                    {file && (
                        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between animate-fade-in">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB • Ready to process</p>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="p-2 hover:bg-white rounded-lg transition text-slate-400 hover:text-rose-500">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!file || loading}
                        className="mt-8 w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <Loader className="w-6 h-6 animate-spin text-white" />
                                Processing Data Nodes...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Process and Register Alumni
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                            </span>
                        )}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-indigo-600" />
                        Usage Guidelines
                    </h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0">1</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Download Template</h4>
                                <p className="text-xs text-slate-500 mt-1">Start by downloading our standardized CSV template to ensure data compatibility.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Populate Data</h4>
                                <p className="text-xs text-slate-500 mt-1">Fill in mandatory fields: Full Name, Email, Phone, and Branch. Email must be unique.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0">3</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Upload & Verify</h4>
                                <p className="text-xs text-slate-500 mt-1">Upload the file and click process. The system will create verified accounts automatically.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0">4</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Review Results</h4>
                                <p className="text-xs text-slate-500 mt-1">Check the summary table for successful registrations and temporary passwords generated.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-800 leading-relaxed font-medium">Important: Do not modify the header row of the CSV template as it may cause processing errors.</p>
                    </div>
                </div>
            </div>

            {results && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-fade-up">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Processing Summary</h3>
                            <p className="text-sm text-slate-500 mt-1">Detailed breakdown of the bulk processing operation.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100">
                                Total: {results.summary.totalProcessed}
                            </div>
                            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100">
                                Success: {results.summary.successful}
                            </div>
                            <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold border border-rose-100">
                                Failed: {results.summary.failed}
                            </div>
                        </div>
                    </div>

                    {results.successfulRegistrations?.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Alumni Identity</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Registered Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">System Credentials</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {results.successfulRegistrations.map((alum, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black text-sm uppercase">
                                                        {alum.name?.[0]}
                                                    </div>
                                                    <span className="font-bold text-slate-800">{alum.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600 font-medium">{alum.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <code className="bg-slate-100 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-black tracking-wider border border-slate-200">
                                                        {alum.temporaryPassword}
                                                    </code>
                                                    <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-black uppercase">Active</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500 font-medium">No successful registrations to display. Check the CSV format for errors.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ChevronRight = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

export default BulkRegister;
