"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Profile() {
  const [data, setData] = useState<{
    username?: string;
    email?: string;
    userId?: string;
  }>({});
  const [checkEmail, setCheckEmail] = useState("");
  const router = useRouter();

  // LOGOUT
  const logout = async () => {
    try {
      interface LogoutResponse {
        success: boolean;
        message: string;
      }

      const response = await axios.get<LogoutResponse>("/api/user/logout");

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    try {
      const userDetail = localStorage.getItem("userDetail");

      if (!userDetail) {
        toast.error("User detail not found. Please log in again.");
        return;
      }

      const parsed = JSON.parse(userDetail);

      setCheckEmail("Sending reset link...");

      interface ResetPasswordResponse {
        success: boolean;
        message: string;
      }

      const res = await axios.post<ResetPasswordResponse>(
        "/api/user/resetPasswordEmail",
        {
          email: parsed.email,
          userId: parsed.userId,
        }
      );

      if (res.data.success) {
        setCheckEmail("Click the link in your email to reset password");
        toast.success("Reset email sent");
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error("Error sending reset email");
    }
  };

  // FETCH USER INFO
  interface UserInfoResponse {
    data: {
      username: string;
      email: string;
      _id: string;
    };
  }

  const getInfo = async () => {
    try {
      const response = await axios.get<UserInfoResponse>("/api/user/me");

      setData({
        username: response.data.data.username,
        email: response.data.data.email,
        userId: response.data.data._id,
      });
    } catch (error: any) {
      toast.error("Failed to load user data");
    }
  };

  // SAVE DATA TO LOCAL STORAGE ONLY AFTER IT CHANGES
  useEffect(() => {
    if (data?.email) {
      localStorage.setItem("userDetail", JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div
      className="p-6 w-full max-w-sm mx-auto
      backdrop-blur-xl bg-linear-to-br from-gray-900 via-blue-900 to-gray-800 
      border border-white/20 rounded-2xl shadow-lg text-white"
    >
      <h1 className="text-xl font-semibold mb-2">Username: {data.username}</h1>
      <h2 className="text-lg font-medium mb-4">Email: {data.email}</h2>

      {checkEmail && (
        <p className="text-sm text-green-400 mb-2">{checkEmail}</p>
      )}

      <button
        onClick={handleChangePassword}
        className="w-full py-2 mb-3 bg-yellow-500 rounded font-medium hover:bg-yellow-600"
      >
        Change Password
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
