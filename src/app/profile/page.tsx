"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/utils/axiosInstance";

interface UserData {
  username: string;
  email: string;
  userId: string;
}

function Profile() {
  const [data, setData] = useState<UserData>({
    username: "",
    email: "",
    userId: "",
  });
  const [checkEmail, setCheckEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // FETCH USER INFO
  const getInfo = async () => {
    setLoading(true);

    try {
      console.log("Fetching user info...");

      const response = await api.get<{
        success: boolean;
        message: string;
        data: {
          _id: string;
          username: string;
          email: string;
          isVerified: boolean;
        };
      }>("/api/user/me", {
        withCredentials: true,
      });

      if (response.data.success) {
        const userData = {
          username: response.data.data.username,
          email: response.data.data.email,
          userId: response.data.data._id,
        };

        setData(userData);
        console.log("User data loaded:", userData);

        // Store in localStorage
        localStorage.setItem("userDetail", JSON.stringify(userData));
      }
    } catch (error: any) {
      console.error("Error fetching user info:", error);

      if (error.response?.status === 401) {
        console.log("Unauthorized, redirecting to login");
        toast.error("Session expired. Please login again.");

        // Clear localStorage
        localStorage.removeItem("userDetail");

        // Redirect to login
        router.push("/login");
      } else {
        toast.error("Failed to load user data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      const response = await api.get<{
        success: boolean;
        message: string;
      }>("/api/user/logout");

      if (response.data.success) {
        toast.success(response.data.message);

        // Clear localStorage
        localStorage.removeItem("userDetail");
        setData({ username: "", email: "", userId: "" });

        // Redirect to login
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message);
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    try {
      if (!data.email) {
        toast.error("User email not found. Please try again.");
        return;
      }

      setCheckEmail("Sending reset link...");

      const response = await api.post<{
        success: boolean;
        message: string;
      }>("/api/user/resetPasswordemail", {
        email: data.email,
        userId: data.userId,
      });

      if (response.data.success) {
        setCheckEmail("Check your email for the reset link");
        toast.success("Reset email sent successfully!");
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error("Failed to send reset email. Please try again.");
      setCheckEmail("");
    }
  };

  // Auto-fetch user data on mount
  useEffect(() => {
    getInfo();
  }, []);

  if (loading) {
    return (
      <div className="p-6 w-full max-w-sm mx-auto backdrop-blur-xl bg-linear-to-br from-gray-900 via-blue-900 to-gray-800 border border-white/20 rounded-2xl shadow-lg text-white">
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!data.email) {
    return (
      <div className="p-6 w-full max-w-sm mx-auto backdrop-blur-xl bg-linear-to-br from-gray-900 via-blue-900 to-gray-800 border border-white/20 rounded-2xl shadow-lg text-white">
        <p className="text-center">No user data found. Please login.</p>
        <button
          onClick={() => router.push("/login")}
          className="w-full mt-4 py-2 bg-blue-500 rounded font-medium hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-sm mx-auto backdrop-blur-xl bg-linear-to-br from-gray-900 via-blue-900 to-gray-800 border border-white/20 rounded-2xl shadow-lg text-white">
      <h1 className="text-xl font-semibold mb-2">Username: {data.username}</h1>
      <h2 className="text-lg font-medium mb-4">Email: {data.email}</h2>

      {checkEmail && (
        <p className="text-sm text-green-400 mb-3 p-2 bg-green-900/30 rounded">
          {checkEmail}
        </p>
      )}

      <button
        onClick={handleChangePassword}
        disabled={!!checkEmail}
        className={`w-full py-2 mb-3 rounded font-medium ${
          checkEmail
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600"
        }`}
      >
        {checkEmail ? "Reset Link Sent" : "Change Password"}
      </button>

      <button
        onClick={logout}
        className="w-full py-2 bg-red-500 rounded font-medium hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;
