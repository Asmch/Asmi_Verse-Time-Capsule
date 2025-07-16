"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("❌ Login failed:", result.error);
        setError(result.error);
        toast.error(result.error);
      } else if (result?.ok) {
        console.log("✅ Login successful");
        toast.success("Login successful!");
        router.push("/Profile"); // Auto-redirect to Profile after login
      }
    } catch (error: any) {
      console.error("🔥 Login error:", error);
      setError("Something went wrong. Please try again.");
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 } as any,
    },
  } as any;

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      backgroundColor: "#6D28D9",
      transition: { type: "spring", stiffness: 400 } as any,
    },
    tap: { scale: 0.95 },
  } as any;

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
          className="text-3xl sm:text-4xl font-bold text-purple-600 mb-4 sm:mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Login
        </motion.h1>

        <motion.hr
          className="mb-4 sm:mb-6 border-white/20"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        {error && (
          <div className="bg-red-500 text-white p-2 sm:p-3 rounded-md text-center mb-3 sm:mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 sm:space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block mb-1 sm:mb-2 text-sm font-medium">Email:</label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#8B5CF6' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Enter your email"
                  className="border-2 w-full p-2 sm:p-3 rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block mb-1 sm:mb-2 text-sm font-medium">Password:</label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#8B5CF6' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  placeholder="Enter your password"
                  className="border-2 w-full p-2 sm:p-3 pr-10 rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 focus:outline-none">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <Link href="/forgot-password">
                <span className="text-purple-300 hover:text-purple-100 text-sm font-medium transition-colors">Forgot Password?</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-1 sm:pt-2">
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="w-full bg-purple-800 py-2 sm:py-3 px-4 rounded-lg font-medium text-white shadow-lg focus:ring-2 focus:ring-purple-600 transition-all"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center pt-2 sm:pt-4">
              <p className="mb-1 sm:mb-2 text-sm">Not Registered?</p>
              <Link href="/JoinUs">
                <motion.span
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="inline-block bg-purple-800 py-2 sm:py-3 px-6 rounded-lg font-medium text-white shadow-lg cursor-pointer focus:ring-2 focus:ring-purple-600 transition-all"
                >
                  Register
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
