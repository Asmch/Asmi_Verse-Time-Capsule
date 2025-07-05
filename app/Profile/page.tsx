"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { FaUserCircle, FaSignOutAlt, FaPlusCircle, FaBoxOpen, FaExclamationTriangle, FaMedal } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [capsuleCount, setCapsuleCount] = useState<number>(0);
  const [badgeMilestones, setBadgeMilestones] = useState<number[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/Login");
    } else {
      // Fetch capsule count for badges
      fetch("/api/users/Mycapsules?countOnly=1")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCapsuleCount(data.capsuleCount);
            const milestones = [1, 5, 10, 25, 50, 100].filter(m => data.capsuleCount >= m);
            setBadgeMilestones(milestones);
          }
        });
    }
  }, [status, router]);

  if (status === "loading") {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p className="text-center text-white">Redirecting to login...</p>;
  }

  const user = session?.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-6 sm:py-10 px-2 sm:px-6 relative overflow-hidden"
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-2xl animate-spin-slow" style={{transform: 'translate(-50%, -50%)'}} />
      </div>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-md p-6 sm:p-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-400/20 z-10"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar with initials or icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-5xl shadow-lg mb-2">
            {user?.image ? (
              <img src={user.image} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : <FaUserCircle />
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-purple-400">My Profile</h1>
          <p className="text-purple-300 text-center text-base sm:text-lg">Welcome to your Time Capsule, {user?.name}!</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full p-3 sm:p-4 bg-white/10 rounded-xl text-center border border-purple-400/10"
          >
            <h2 className="text-base sm:text-lg font-semibold text-purple-200">{user?.name}</h2>
            <p className="text-xs sm:text-sm text-purple-100">{user?.email}</p>
          </motion.div>
          <div className="flex flex-col gap-3 w-full mt-2">
            <button
              onClick={() => router.push('/my_capsules')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 shadow-md"
            >
              <FaBoxOpen /> View My Capsules
            </button>
            <button
              onClick={() => router.push('/Create')}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:ring-2 focus:ring-purple-500 shadow-md"
            >
              <FaPlusCircle /> Create Capsule
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:ring-2 focus:ring-red-500 shadow-md"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
          {/* Badges Section */}
          {badgeMilestones.length > 0 && (
            <div className="w-full mt-6 mb-2 p-4 bg-purple-900/20 rounded-xl border border-purple-400/30 flex flex-col items-center">
              <h3 className="text-lg font-bold text-purple-200 mb-2">Your Achievements</h3>
              <div className="flex gap-3 mb-2">
                {badgeMilestones.map(m => (
                  <span key={m} className="flex flex-col items-center">
                    <FaMedal className="text-yellow-400 text-3xl mb-1" />
                    <span className="text-purple-100 text-sm font-semibold">{m}</span>
                  </span>
                ))}
              </div>
              <ul className="text-purple-100 text-xs">
                {badgeMilestones.map(m => (
                  <li key={m}>🏅 Created {m} capsule{m > 1 ? 's' : ''}!</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-2 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl text-center w-full max-w-xs sm:max-w-sm border border-purple-400/20"
        >
          <div className="flex flex-col items-center mb-3">
            <FaExclamationTriangle className="text-3xl text-red-400 mb-2" />
            <Dialog.Title className="text-lg sm:text-xl font-bold text-red-300">Confirm Logout</Dialog.Title>
          </div>
          <p className="text-purple-100 my-2 sm:my-3 text-sm sm:text-base">Are you sure you want to log out?</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-3 sm:mt-4">
            <button
              onClick={() => {
                signOut({ callbackUrl: '/Login' });
                setIsModalOpen(false);
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:ring-2 focus:ring-red-500 w-full"
            >
              Yes, Logout
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:ring-2 focus:ring-gray-500 w-full"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </Dialog>

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
}
