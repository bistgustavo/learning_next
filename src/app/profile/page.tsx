"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function profile() {
  const [data, setData] = useState<{ username?: string; email?: string }>({});
  const router = useRouter();

  const logout = async () => {
    try {
      const response = await axios.get<{ message: string; success: boolean }>(
        "api/user/logout"
      );

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/login");
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getInfo = async () => {
    const response = await axios.get<{
      data: { username: string; email: string };
    }>("api/user/me");

    console.log(response.data);
    setData({
      username: response.data.data.username,
      email: response.data.data.email,
    });
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div
      className="p-6 w-full max-w-sm mx-auto
                backdrop-blur-xl bg-linear-to-br from-gray-900 via-blue-900 to-gray-800 border border-white/20
                rounded-2xl shadow-lg text-white"
    >
      <h1 className="text-xl font-semibold mb-2">Username : {data.username}</h1>
      <h2 className="text-lg font-medium">Email : {data.email}</h2>

      <button
        onClick={logout}
        className="p-5 bg-blue-500 text-white border hover:border-0 hover:cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}

export default profile;
