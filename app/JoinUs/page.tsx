'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from "react-hot-toast"
import { useRouter } from 'next/navigation'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'

const JoinUs = () => {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    
    // Basic validation
    if (!name || !email || !password) {
      toast.error("Please fill all fields")
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }
    
    // Password validation (at least 6 characters)
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    try {
      setLoading(true)
      
      // Using the original API endpoint path from your code
      const response = await axios.post("/api/users/JoinUs", { 
        name, 
        email, 
        password 
      })
      
      console.log("Signup successful", response.data)
      setIsSignupSuccessful(true)
      toast.success("Signup successful! Redirecting to login...")
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/Login")
      }, 1500)
      
    } catch (error:any) {
      // TypeScript fix for error handling
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        "Registration failed. Please try again.";
      
      console.error("Signup Failed", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 } as any,
    },
  } as any;

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      backgroundColor: '#6D28D9',
      transition: { type: 'spring', stiffness: 400 } as any,
    },
    tap: { scale: 0.95 },
  } as any;

  // Redirect if signup was successful
  if (isSignupSuccessful) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <motion.div
          className="border-2 border-white/25 w-full max-w-md p-8 rounded-lg shadow-2xl bg-gray-800 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="text-green-500 text-6xl mb-4"
          >
            ✓
          </motion.div>
          <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
          <p className="mb-4">Redirecting you to login...</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <motion.div
              className="bg-green-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-2xl animate-spin-slow" style={{transform: 'translate(-50%, -50%)'}} />
      </div>
      <motion.div
        className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-purple-400/20 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl font-bold text-purple-600 mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Join Us
        </motion.h1>

        <motion.hr
          className="mb-6 border-white/20"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <form onSubmit={handleSubmit}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">Enter your Name:</label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#8B5CF6' }}
                  transition={{ type: 'spring', stiffness: 300 } as any}
                  type="text"
                  id="name"
                  value={name}
                  placeholder="Enter your name"
                  className="border-2 w-full p-2 rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Enter your Email:</label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#8B5CF6' }}
                  transition={{ type: 'spring', stiffness: 300 } as any}
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Enter your email"
                  className="border-2 w-full p-2 rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block mb-2 text-sm font-medium">Create a Password:</label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#8B5CF6' }}
                  transition={{ type: 'spring', stiffness: 300 } as any}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  placeholder="Create a password"
                  className="border-2 w-full p-2 pr-10 rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 focus:outline-none">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-3 sm:py-4 px-8 rounded-full font-bold text-lg text-white shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-400/60 hover:scale-105 hover:shadow-purple-400/40 transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Join Us"}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center pt-4">
              <p className="mb-2">Already Registered?</p>
              <Link href="/Login" legacyBehavior>
                <a>
                  <motion.span
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="inline-block bg-purple-800 py-2 px-6 rounded-lg font-medium text-white shadow-lg cursor-pointer"
                  >
                    Login
                  </motion.span>
                </a>
              </Link>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}

export default JoinUs