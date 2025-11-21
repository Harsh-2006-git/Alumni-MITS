import { useState } from "react";
import { X, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const ForgotPasswordPopup = ({ isOpen, onClose, isDarkMode }) => {
  const [step, setStep] = useState(1); // 1: Email check, 2: OTP send, 3: Reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userData, setUserData] = useState(null);

  if (!isOpen) return null;

  // Check email status
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        "https://alumni-mits-l45r.onrender.com/auth/check",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (data.isRegistered && data.isVerified) {
          setUserData(data.data);
          setStep(2);
          setMessage({
            type: "success",
            text: "Email verified! You can now request an OTP.",
          });
        } else if (data.isRegistered && !data.isVerified) {
          setMessage({
            type: "error",
            text: "Your account is not verified. Please verify your account first.",
          });
        }
      } else {
        setMessage({
          type: "error",
          text: data.message || "Email not found in our alumni database",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to check email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        "https://alumni-mits-l45r.onrender.com/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            action: "send-otp",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStep(3);
        setMessage({
          type: "success",
          text: "OTP sent successfully to your email!",
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to send OTP",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to send OTP. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        "https://alumni-mits-l45r.onrender.com/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
            action: "verify-reset",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Password reset successfully! You can now login with your new password.",
        });

        // Close popup after success
        setTimeout(() => {
          onClose();
          resetForm();
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to reset password",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage({ type: "", text: "" });
    setUserData(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${
          isDarkMode
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Reset Password
          </h2>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-slate-800 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                    step >= stepNumber
                      ? "bg-purple-600 border-purple-600 text-white"
                      : isDarkMode
                      ? "border-slate-600 text-slate-400"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step > stepNumber
                        ? "bg-purple-600"
                        : isDarkMode
                        ? "bg-slate-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs mt-2">
            <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
              Check Email
            </span>
            <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
              Send OTP
            </span>
            <span className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
              Reset
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Message Display */}
          {message.text && (
            <div
              className={`flex items-center gap-3 p-3 rounded-lg mb-4 ${
                message.type === "error"
                  ? isDarkMode
                    ? "bg-red-500/10 border border-red-500/20 text-red-300"
                    : "bg-red-50 border border-red-200 text-red-700"
                  : isDarkMode
                  ? "bg-green-500/10 border border-green-500/20 text-green-300"
                  : "bg-green-50 border border-green-200 text-green-700"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          {/* Step 1: Email Check */}
          {step === 1 && (
            <form onSubmit={handleCheckEmail} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Alumni Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl outline-none transition ${
                      isDarkMode
                        ? "bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                        : "bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    }`}
                    placeholder="Enter your registered email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Checking...
                  </span>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Send */}
          {step === 2 && userData && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-slate-800" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-purple-500/20" : "bg-purple-100"
                    }`}
                  >
                    <CheckCircle
                      className={`w-5 h-5 ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {userData.name}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {userData.email}
                    </p>
                  </div>
                </div>
              </div>

              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Click the button below to receive an OTP on your registered
                email.
              </p>

              <button
                onClick={handleSendOTP}
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP to Email"
                )}
              </button>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Enter OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      value={otp[index] || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        // Handle paste and multiple digit input
                        if (value.length > 1) {
                          const pastedOtp = value.slice(0, 6);
                          setOtp(pastedOtp);

                          // Focus next available input
                          const nextIndex = Math.min(pastedOtp.length, 5);
                          document.getElementById(`otp-${nextIndex}`)?.focus();
                          return;
                        }

                        // Handle single digit input
                        const newOtp = otp.split("");
                        newOtp[index] = value;
                        const joinedOtp = newOtp.join("").slice(0, 6);
                        setOtp(joinedOtp);

                        // Auto-focus next input
                        if (value && index < 5) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace
                        if (e.key === "Backspace") {
                          if (!otp[index] && index > 0) {
                            document
                              .getElementById(`otp-${index - 1}`)
                              ?.focus();
                          }
                        }

                        // Handle arrow keys
                        if (e.key === "ArrowLeft" && index > 0) {
                          document.getElementById(`otp-${index - 1}`)?.focus();
                        }
                        if (e.key === "ArrowRight" && index < 5) {
                          document.getElementById(`otp-${index + 1}`)?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData
                          .getData("text")
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        if (pastedData) {
                          setOtp(pastedData);

                          // Focus next available input after paste
                          const nextIndex = Math.min(pastedData.length, 5);
                          setTimeout(() => {
                            document
                              .getElementById(`otp-${nextIndex}`)
                              ?.focus();
                          }, 0);
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      className={`w-12 h-12 text-center text-lg font-semibold rounded-xl outline-none transition-all ${
                        isDarkMode
                          ? "bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                          : "bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                      }`}
                      maxLength={1}
                      id={`otp-${index}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl outline-none transition ${
                      isDarkMode
                        ? "bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                        : "bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    }`}
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl outline-none transition ${
                      isDarkMode
                        ? "bg-slate-800 border border-slate-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                        : "bg-white border border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
                    }`}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Resetting Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t ${
            isDarkMode ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <p
            className={`text-xs text-center ${
              isDarkMode ? "text-gray-500" : "text-gray-600"
            }`}
          >
            Need help? Contact alumni support
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
