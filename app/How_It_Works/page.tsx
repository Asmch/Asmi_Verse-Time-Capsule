"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaPenFancy, FaLock, FaUserFriends, FaMagic } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";

const steps = [
  {
    title: "Start Your Capsule",
    description:
      "Begin by giving your time capsule a meaningful title and writing a heartfelt message. You can even add photos, videos, or audio to make it extra special!",
    icon: <FaPenFancy className="text-2xl text-purple-300" />,
  },
  {
    title: "Choose When to Unlock",
    description:
      "Set the exact date and time you want your capsule to be revealed. It could be a birthday, anniversary, or any moment in the future you want to make unforgettable.",
    icon: <FaLock className="text-2xl text-blue-300" />,
  },
  {
    title: "Add a Recipient",
    description:
      "Enter the name and email of the person who will receive your capsule. It could be yourself, a friend, or a loved one—surprise them with a message from the past!",
    icon: <FaUserFriends className="text-2xl text-indigo-300" />,
  },
  {
    title: "Seal & Relax",
    description:
      "Lock your capsule and let us take care of the rest. We'll keep it safe and deliver it right on time, so you can focus on making new memories.",
    icon: <FaMagic className="text-2xl text-pink-300" />,
  },
];

const HowItWorks = () => {
  const { user } = useAuth();
  const router = require('next/navigation').useRouter();

  console.log("Current user in HowItWorks:", user);

  const handleGetStarted = () => {
    if (user) {
      router.push("/Create");
    } else {
      router.push("/JoinUs");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen py-16 px-4 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-black to-blue-900"
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-2xl animate-spin-slow" style={{transform: 'translate(-50%, -50%)'}} />
      </div>
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-100 to-purple-400 mb-4 z-10 text-center drop-shadow-lg"
      >
        How It Works
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-lg md:text-xl text-purple-200 mb-12 z-10 text-center max-w-2xl"
      >
        Creating a time capsule is simple, magical, and meaningful. Here's how you can preserve memories for the future in just a few steps!
      </motion.p>
      <div className="relative w-full max-w-3xl z-10 flex flex-col items-center">
        {/* Timeline vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/30 to-blue-500/30 rounded-full" style={{zIndex:0}} />
        <div className="space-y-12 w-full">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative flex items-start group"
            >
              {/* Timeline dot */}
              <div className="flex flex-col items-center mr-6 z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg border-4 border-purple-900/40">
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 w-1 bg-gradient-to-b from-purple-400/30 to-blue-400/30 my-1" />
                )}
              </div>
              {/* Step card */}
              <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-purple-400/20 group-hover:scale-[1.03] transition-transform">
                <h2 className="text-2xl font-semibold text-purple-200 mb-2 font-sans">{step.title}</h2>
                <p className="text-purple-100 text-lg leading-relaxed font-sans">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* CTA Button */}
      <div className="mt-16 z-10 flex justify-center">
        <button
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-4 px-12 rounded-full shadow-xl text-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/60 hover:scale-105 hover:shadow-purple-400/40"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};

export default HowItWorks;
