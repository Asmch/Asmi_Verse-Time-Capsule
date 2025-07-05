"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";

const ResetPasswordPageInner = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        toast.success("Password reset successful! You can now login.");
        setTimeout(() => router.push("/Login"), 2000);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white px-2 sm:px-4 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-2xl animate-spin-slow" style={{transform: 'translate(-50%, -50%)'}} />
      </div>
      <motion.div
        className="relative w-full max-w-md p-4 sm:p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-purple-400/20 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-purple-600 mb-4 sm:mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Reset Password
        </motion.h1>
        <motion.hr
          className="mb-4 sm:mb-6 border-white/20"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        {success ? (
          <div className="bg-green-500 text-white p-3 rounded-md text-center mb-4">
            Password reset successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium">New Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  placeholder="Enter new password"
                  className="border-2 w-full p-3 rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm new password"
                  className="border-2 w-full p-3 rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-800 py-3 px-4 rounded-lg font-medium text-white shadow-lg focus:ring-2 focus:ring-purple-600 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
              <div className="text-center pt-2">
                <Link href="/Login" legacyBehavior>
                  <a className="text-purple-300 hover:text-purple-100 text-sm font-medium transition-colors">Back to Login</a>
                </Link>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const ResetPasswordPage = () => (
  <Suspense fallback={<div className="text-center text-white p-8">Loading...</div>}>
    <ResetPasswordPageInner />
  </Suspense>
);

export default ResetPasswordPage; 