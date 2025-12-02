"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/utils/axiosInstance";
import { Concert_One } from "next/font/google";

function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });
  const [userId, setUserId] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: { _id: string };
        }>("/api/user/me");
        if (!response.data.success) {
          toast.error("Please login first");
          router.push("/login");
        }
        console.log(response.data.data._id);
        setUserId(response.data.data._id);
      } catch (error) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("One lowercase letter");

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("One number");

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push("One special character");

    setPasswordStrength({
      score,
      feedback: feedback.length > 0 ? feedback.join(", ") : "Strong password",
    });
  };

  // Handle new password change
  useEffect(() => {
    if (newPassword) {
      checkPasswordStrength(newPassword);
    } else {
      setPasswordStrength({ score: 0, feedback: "" });
    }
  }, [newPassword]);

  // Password validation
  const validateForm = () => {
    if (!newPassword.trim()) {
      toast.error("Please enter new password");
      return false;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please choose a stronger password");
      return false;
    }

    return true;
  };

  // Get password strength color
  const getStrengthColor = () => {
    if (passwordStrength.score === 0) return "bg-gray-200";
    if (passwordStrength.score <= 2) return "bg-red-500";
    if (passwordStrength.score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post<{
        success: boolean;
        message: string;
      }>("/api/user/forgetpassword", {
        password: newPassword,
        userId,
      });

      if (response.data.success) {
        toast.success("Password changed successfully!");

        setNewPassword("");
        setConfirmPassword("");

        // Optional: Redirect to profile or show success message
        setTimeout(() => {
          router.push("/profile");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Change password error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field:  "new" | "confirm") => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Change Password
            </h1>
            <p className="text-gray-600">
              Update your password to keep your account secure
            </p>
          </div>

          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/profile"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Profile
            </Link>
          </div>

          {/* Password Change Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.new ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Password Strength:</span>
                    <span
                      className={`font-medium ${
                        passwordStrength.score <= 2
                          ? "text-red-600"
                          : passwordStrength.score <= 3
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {passwordStrength.score <= 2
                        ? "Weak"
                        : passwordStrength.score <= 3
                        ? "Medium"
                        : "Strong"}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {passwordStrength.feedback}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:border-blue-500 outline-none transition ${
                    confirmPassword && newPassword !== confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.confirm ? "🙈" : "👁️"}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                Password Requirements:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center">
                  <span
                    className={`mr-2 ${
                      newPassword.length >= 8
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {newPassword.length >= 8 ? "✓" : "○"}
                  </span>
                  At least 8 characters long
                </li>

                <li className="flex items-center">
                  <span
                    className={`mr-2 ${
                      /[a-z]/.test(newPassword)
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {/[a-z]/.test(newPassword) ? "✓" : "○"}
                  </span>
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <span
                    className={`mr-2 ${
                      /[0-9]/.test(newPassword)
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {/[0-9]/.test(newPassword) ? "✓" : "○"}
                  </span>
                  One number
                </li>
                <li className="flex items-center">
                  <span
                    className={`mr-2 ${
                      /[^A-Za-z0-9]/.test(newPassword)
                        ? "text-green-500"
                        : "text-blue-500"
                    }`}
                  >
                    {/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "○"}
                  </span>
                  One special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Changing Password...
                </span>
              ) : (
                "Change Password"
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 mb-3">Security Tips:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Use a unique password you don't use elsewhere
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Consider using a password manager
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Enable two-factor authentication if available
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Never share your password with anyone
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
