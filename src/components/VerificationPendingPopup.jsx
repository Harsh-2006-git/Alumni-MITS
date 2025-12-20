
import { CheckCircle, ArrowRight } from "lucide-react";

export default function VerificationPendingPopup({ isOpen, onClose, isDarkMode }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all scale-100 ${isDarkMode ? "bg-slate-900 border border-slate-700" : "bg-white border border-gray-100"
                    }`}
            >
                <div className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? "bg-green-500/10" : "bg-green-50"
                        }`}>
                        <CheckCircle className={`w-8 h-8 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                    </div>

                    <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        Registration Successful!
                    </h3>

                    <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Your alumni account has been created and is currently <strong>under verification</strong>.
                        Once verified by the administration, you will be notified via email.
                    </p>

                    <button
                        onClick={onClose}
                        className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${isDarkMode
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            }`}
                    >
                        Return to Home
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
