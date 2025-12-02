"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function Page() {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);
  const [token, setToken] = useState("");

  const verifyUserEmail = async () => {
    try {
      await axios.post("api/user/verifyemail", { token });
      setIsVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>

        <p className="text-gray-500 mt-2">
          {token ? (
            <>
              Token detected:{" "}
              <span className="font-semibold text-gray-700 flex-wrap">
                {token}
              </span>
            </>
          ) : (
            "No verification token found."
          )}
        </p>

        {/* LOADING / PROCESSING */}
        {!isVerified && !error && (
          <div className="mt-6 flex justify-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {isVerified && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-green-600">
              Email Verified Successfully!
            </h2>
            <Link
              href="/login"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-red-600">
              Verification Failed!
            </h2>
            <p className="text-gray-500 mt-1">Invalid or expired token.</p>
            <Link
              href="/signup"
              className="inline-block mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition"
            >
              Go Back
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
