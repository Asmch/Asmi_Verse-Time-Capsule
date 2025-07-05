"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from "@/context/AuthContext";
import { FaUserCircle, FaSignOutAlt, FaUser, FaHome, FaQuestionCircle, FaPlusCircle, FaBoxOpen } from 'react-icons/fa';
import FAQs from "./FAQs";
import { useRouter } from "next/navigation";

const Hero = () => {
  const { user } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const loggedInNavItems = [
    { label: "Home", href: "/Home" },
    { label: "How It Works", href: "/How_It_Works" },
    { label: "Create Capsule", href: "/Create" },
    { label: "My Capsules", href: "/my_capsules" },
  ];

  const guestNavItems = [
    { label: "Home", href: "/Home" },
    { label: "How It Works", href: "/How_It_Works" },
    { label: "FAQs", href: "/FAQs" },
  ];

  const navItems = user ? loggedInNavItems : guestNavItems;

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 * i, duration: 0.3 },
    }),
    hover: {
      scale: 1.1,
      color: "#c4b5fd",
      transition: { type: "spring", stiffness: 300 },
    },
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[12vh] w-full bg-white/10 backdrop-blur-lg text-purple-200 flex justify-between items-center border-purple-500/30 border-b-2 px-6 sticky top-0 z-50 relative overflow-hidden"
      >
        {/* Animated background shapes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-700/20 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-blue-700/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.2s' }} />
        </div>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-2 text-3xl font-extrabold cursor-pointer select-none"
        >
          <FaBoxOpen className="text-purple-400 text-2xl" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-600">Asmi</span>
          <span className="text-purple-200">Verse</span>
        </motion.div>
        {/* Desktop Navigation */}
        <motion.ul className="hidden md:flex gap-8 items-center cursor-pointer z-10">
          {navItems.map((item, i) => (
            <Link key={item.label} href={item.href} passHref>
              <motion.li
                custom={i}
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={navItemVariants}
                onHoverStart={() => setHoveredItem(item.label)}
                onHoverEnd={() => setHoveredItem(null)}
                className={`relative text-lg font-medium transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-purple-700/20 hover:text-purple-100 ${hoveredItem === item.label ? 'shadow-lg' : ''}`}
              >
                {item.label === 'Home' && <FaHome className="inline-block mr-1 text-purple-300" />}
                {item.label === 'How It Works' && <FaQuestionCircle className="inline-block mr-1 text-purple-300" />}
                {item.label === 'Create Capsule' && <FaPlusCircle className="inline-block mr-1 text-purple-300" />}
                {item.label === 'My Capsules' && <FaBoxOpen className="inline-block mr-1 text-purple-300" />}
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-purple-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: hoveredItem === item.label ? "100%" : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.li>
            </Link>
          ))}
        </motion.ul>
        {/* Profile or Join Us */}
        <div className="z-10">
          {user ? (
            <>
              {/* Desktop: direct navigation */}
              <button
                className="hidden md:flex items-center gap-2 text-purple-200 hover:text-purple-100 focus:outline-none"
                onClick={() => router.push('/Profile')}
                aria-label="Profile"
              >
                <FaUserCircle className="text-3xl cursor-pointer hover:text-purple-300 transition-all rounded-full" />
              </button>
              {/* Mobile/Tablet: keep dropdown/menu as before */}
              <div className="md:hidden relative group">
                <button className="flex items-center gap-2 text-purple-200 hover:text-purple-100 focus:outline-none">
                  <FaUserCircle className="text-3xl cursor-pointer hover:text-purple-300 transition-all rounded-full" />
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg border border-purple-400/20 py-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50">
                  <button onClick={() => router.push('/Profile')} className="block w-full text-left px-4 py-2 text-purple-200 hover:bg-purple-700/30 hover:text-white transition-colors">Profile</button>
                  <button onClick={() => { router.push('/api/auth/signout'); }} className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-700/30 hover:text-white transition-colors flex items-center gap-2"><FaSignOutAlt /> Logout</button>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => router.push('/Login')}
              className="hidden md:block bg-gradient-to-r from-purple-700 to-purple-900 px-6 py-2 rounded-full shadow-lg text-white font-bold"
            >
              Join Us
            </button>
          )}
        </div>
        {/* Hamburger Menu Button (Mobile) */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={32} /> : <FaBars size={32} />}
        </button>
      </motion.header>
      {/* Mobile Menu rendered outside header for proper overlay */}
      {menuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300 }}
          className="fixed top-0 right-0 h-screen w-2/3 bg-black/80 text-white flex flex-col items-center justify-center gap-6 z-[999]"
        >
          <button
            className="absolute top-4 right-4 text-3xl text-purple-200 hover:text-purple-400 focus:outline-none z-[1000]"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            &times;
          </button>
          {navItems.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.1 }}
              className="text-xl font-semibold cursor-pointer w-full text-center py-2"
              onClick={() => {
                setMenuOpen(false);
                router.push(item.href);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setMenuOpen(false);
                  router.push(item.href);
                }
              }}
            >
              {item.label}
            </motion.div>
          ))}
          {user ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-xl font-semibold cursor-pointer w-full text-center py-2"
              onClick={() => {
                setMenuOpen(false);
                router.push('/Profile');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setMenuOpen(false);
                  router.push('/Profile');
                }
              }}
            >
              Profile
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-purple-700 to-purple-900 px-6 py-2 rounded-full shadow-lg text-white font-bold"
              onClick={() => {
                setMenuOpen(false);
                router.push('/Login');
              }}
            >
              Join Us
            </motion.button>
          )}
        </motion.div>
      )}
    </>
  );
};

export default Hero;
