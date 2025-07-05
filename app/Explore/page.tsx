"use client";
import React from "react";
import { motion } from "framer-motion";

const capsules = [
  { id: 1, title: "Memories of 2020", creator: "Asmita", lockedUntil: "2025-12-31" },
  { id: 2, title: "Best Trip Ever", creator: "John", lockedUntil: "2024-07-15" },
  { id: 3, title: "Graduation Day", creator: "Emma", lockedUntil: "2026-09-10" },
];

const Explore = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-purple-400 mb-10"
      >
        Explore Capsules
      </motion.h1>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {capsules.map((capsule) => (
          <motion.div
            key={capsule.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-purple-500 transition-shadow"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-xl font-bold text-purple-300 mb-2">{capsule.title}</h2>
            <p className="text-sm text-gray-400">Created by: {capsule.creator}</p>
            <p className="text-sm text-gray-400">Locked Until: {capsule.lockedUntil}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Explore;

