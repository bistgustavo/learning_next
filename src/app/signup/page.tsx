"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function signUpPage() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignUp = async () => {
    try {
      setLoading(true);

      const response = await axios.post<{ success: boolean; message: string }>(
        "/api/user/signup",
        user
      );
      console.log(response.data);

      if (response.data.success) {
        toast.success("user created!");

        setUser({
          email: "",
          password: "",
          username: "",
        });

        router.push("/login");
      } else {
        setError(response.data.message);
      }
    } catch (error: any) {
      console.log("Error logging in", error.message);
      toast.error("Something went wrong");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.username.length > 0 &&
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [user]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-blue-900 to-gray-800
 p-4"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl rounded-2xl p-8 w-full max-w-md text-white">
        <h3 className="text-2xl font-semibold text-center mb-6">
          {loading ? "processing" : "Welcome to Signup"}
        </h3>

        <h4 className="text-xl font-semibold text-center mb-6">
          {error ? `${error}` : ""}
        </h4>

        {/* Username */}
        <label htmlFor="username" className="font-medium">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="w-full mt-1 mb-4 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60
                 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
        />

        {/* Email */}
        <label htmlFor="email" className="font-medium">
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

        {/* Password + Eye */}
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full mt-1 mb-6 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/60
                   border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 pr-12"
          />

          {/* Eye Icon */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Button */}
        <button
          onClick={onSignUp}
          className="w-full bg-white/30 hover:bg-white/40 text-white font-semibold py-2 rounded-lg 
                 backdrop-blur-md transition-all"
        >
          {disableButton ? "Button Disabled" : "SignUp"}
        </button>

        <Link
          href="/login"
          className="block text-center text-white/80 mt-4 hover:text-white underline"
        >
          go to login
        </Link>
      </div>
    </div>
  );
}
