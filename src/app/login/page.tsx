"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = React.useState(true);

  const router = useRouter();
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post<{
        data: { isVerified: boolean; message: string };
      }>("/api/user/login", user);

      if (response.data?.data?.isVerified) {
        toast.success("Login Success");
        router.push("/profile");
      } else {
        setError(response.data.data.message);
        toast.error(response.data.data.message);
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Error while Logging in";
      setError(msg);
      toast.error(msg);
      console.log("Error from backend:", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setDisableButton(false);
    }
  }, [user]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-blue-900 to-gray-800
 p-4"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-white text-center mb-6">
          {loading ? "processing" : "Welcome to Login Page"}
        </h3>

        <h4 className="text-xl font-semibold text-red-400 text-center mb-3">
          {error ? `${error}` : ""}
        </h4>

        <label htmlFor="email" className="text-white/90 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="w-full mt-1 mb-4 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 
                 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
        />

        <label htmlFor="password" className="text-white/90 font-medium">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "password" : "text"}
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full mt-1 mb-6 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60 
                 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
        </div>

        <button
          onClick={onLogin}
          className="w-full bg-white/30 hover:bg-white/40 text-white font-semibold py-2 rounded-lg 
                 backdrop-blur-md transition-all"
        >
          {disableButton ? "Enter Email and Password" : "Login"}
        </button>

        <Link
          href="/signup"
          className="block text-center text-white/80 mt-4 hover:text-white underline"
        >
          Go to SignUp
        </Link>
      </div>
    </div>
  );
}
