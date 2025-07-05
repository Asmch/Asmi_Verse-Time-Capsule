"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCube, FaLock, FaUnlock, FaTimes, FaEdit, FaTrashAlt } from 'react-icons/fa';
import Link from 'next/link';

const MyCapsules = () => {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCapsule, setSelectedCapsule] = useState<any>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCapsule, setEditCapsule] = useState<any>(null);
  const [editForm, setEditForm] = useState({ title: '', message: '', recipientName: '', recipientEmail: '', timeLock: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const fetchCapsules = async () => {
    try {
      const res = await fetch("/api/users/Mycapsules"); // lowercase route name
      const data = await res.json();
      console.log("Fetched capsules data:", data);

      if (data.success) {
        setCapsules(data.capsules);
      } else {
        setCapsules([]);
      }
    } catch (error) {
      console.error("Error fetching capsules:", error);
      setCapsules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  const handleEditClick = (capsule: any) => {
    setEditCapsule(capsule);
    setEditForm({
      title: capsule.title,
      message: capsule.message,
      recipientName: capsule.recipientName,
      recipientEmail: capsule.recipientEmail,
      timeLock: capsule.timeLock ? new Date(capsule.timeLock).toISOString().slice(0, 16) : '',
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCapsule) return;
    const res = await fetch('/api/users/Mycapsules', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capsuleId: editCapsule._id, update: editForm }),
    });
    const data = await res.json();
    if (data.success) {
      setEditModalOpen(false);
      setEditCapsule(null);
      fetchCapsules();
    } else {
      alert(data.error || 'Failed to update capsule');
    }
  };

  const handleDelete = async (capsuleId: string) => {
    if (!window.confirm('Are you sure you want to delete this capsule?')) return;
    setDeleteLoading(true);
    const res = await fetch('/api/users/Mycapsules', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capsuleId }),
    });
    const data = await res.json();
    setDeleteLoading(false);
    if (data.success) {
      fetchCapsules();
    } else {
      alert(data.error || 'Failed to delete capsule');
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white py-8 sm:py-12 px-2 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-2xl animate-spin-slow" style={{transform: 'translate(-50%, -50%)'}} />
      </div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-100 to-purple-400 mb-6 sm:mb-10 drop-shadow-lg z-10"
      >
        My Capsules
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-400 text-base sm:text-lg">Loading capsules...</p>
      ) : capsules.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 z-10">
          <img src="https://cdn-icons-png.flaticon.com/512/3208/3208720.png" alt="No Capsules" className="w-32 h-32 mb-4 opacity-80 animate-float" />
          <p className="text-purple-200 text-lg mb-4">You haven't created any capsules yet.</p>
          <Link href="/Create">
            <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/60 hover:scale-105 hover:shadow-purple-400/40">
              Create Your First Capsule
            </button>
          </Link>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-10"
        >
          {capsules.map((capsule: any) => {
            const isLocked = new Date(capsule.timeLock) > new Date();
            const now = new Date();
            const unlockDate = new Date(capsule.timeLock);
            const total = unlockDate.getTime() - new Date(capsule.createdAt).getTime();
            const elapsed = now.getTime() - new Date(capsule.createdAt).getTime();
            const progress = total > 0 ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 100;
            return (
              <motion.div
                key={capsule._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-purple-400/20 p-0 flex flex-col group transition-transform"
              >
                {/* Capsule Icon and Status */}
                <div className="flex items-center justify-between px-6 pt-6">
                  <div className="flex items-center gap-2">
                    <FaCube className="text-3xl text-purple-300 drop-shadow" />
                    <span className="text-lg font-bold text-purple-200 font-sans truncate max-w-[120px]">{capsule.title}</span>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${isLocked ? 'bg-purple-700/80 text-purple-100' : 'bg-green-600/80 text-white'}`}>
                    {isLocked ? <FaLock className="inline-block" /> : <FaUnlock className="inline-block" />}
                    {isLocked ? 'Locked' : 'Unlocked'}
                  </span>
                </div>
                {/* Media Preview */}
                {capsule.mediaUrl && (
                  <div className="px-6 pt-4">
                    <img
                      src={capsule.mediaUrl}
                      alt="Capsule Media"
                      className="rounded-lg max-h-40 object-cover w-full border border-purple-400/20 shadow-md"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between px-6 pb-6 pt-4">
                  <div>
                    <p className="text-purple-100 mb-1 text-sm sm:text-base font-sans">
                      <span className="font-semibold">Recipient:</span> {capsule.recipientName}
                    </p>
                    <p className="text-purple-100 mb-2 text-sm sm:text-base font-sans">
                      <span className="font-semibold">Unlock Date:</span> {new Date(capsule.timeLock).toLocaleDateString()}
                    </p>
                    {/* Progress Bar for locked capsules */}
                    {isLocked && (
                      <div className="w-full h-2 bg-purple-900/30 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-400 transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    )}
                  </div>
                  {isLocked && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-purple-700/40 text-purple-100 rounded hover:bg-purple-700/70 text-sm"
                        onClick={() => handleEditClick(capsule)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-red-700/40 text-red-100 rounded hover:bg-red-700/70 text-sm"
                        onClick={() => handleDelete(capsule._id)}
                        disabled={deleteLoading}
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCapsule(capsule)}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 px-4 py-2 rounded-full font-bold text-white transition w-full focus:ring-2 focus:ring-purple-500 shadow-lg"
                  >
                    View Capsule
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedCapsule && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-white/10 backdrop-blur-lg text-white rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-lg border border-purple-400/30"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              {/* Close X button */}
              <button
                onClick={() => {
                  setSelectedCapsule(null);
                  setPasswordInput("");
                  setPasswordError("");
                  setIsPasswordVerified(false);
                }}
                className="absolute top-4 right-4 text-purple-200 hover:text-purple-400 text-2xl font-bold focus:outline-none z-20"
                aria-label="Close"
              >
                <FaTimes />
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2 sm:mb-4">
                {selectedCapsule.title}
              </h2>
              {/* Password protection logic */}
              {selectedCapsule.password && !isPasswordVerified ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setPasswordError("");
                    setVerifying(true);
                    try {
                      const res = await fetch(`/api/Capsules/verify-password`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ capsuleId: selectedCapsule._id, password: passwordInput }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        setIsPasswordVerified(true);
                        if (data.capsule) setSelectedCapsule((prev: any) => ({ ...prev, ...data.capsule }));
                      } else {
                        setPasswordError(data.message || "Incorrect password. Please try again.");
                      }
                    } catch (err) {
                      setPasswordError("Something went wrong. Please try again.");
                    } finally {
                      setVerifying(false);
                    }
                  }}
                  className="flex flex-col gap-3 mt-4"
                >
                  <label className="text-purple-200 font-semibold">This capsule is password protected.</label>
                  <input
                    type="password"
                    className="rounded px-3 py-2 text-black"
                    placeholder="Enter password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    required
                  />
                  {passwordError && <span className="text-red-400 text-sm">{passwordError}</span>}
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 rounded-full font-bold text-white mt-2" disabled={verifying}>
                    {verifying ? "Verifying..." : "Verify Password"}
                  </button>
                </form>
              ) : (
                <>
                  <p className="text-gray-300 mb-1 sm:mb-2 text-sm sm:text-base">
                    <strong>Recipient:</strong> {selectedCapsule.recipientName}
                  </p>
                  <p className="text-gray-300 mb-1 sm:mb-2 text-sm sm:text-base">
                    <strong>Email:</strong> {selectedCapsule.recipientEmail}
                  </p>
                  <p className="text-gray-300 mb-1 sm:mb-2 text-sm sm:text-base">
                    <strong>Unlock Date:</strong>{" "}
                    {new Date(selectedCapsule.timeLock).toLocaleString()}
                  </p>
                  <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
                    <strong>Message:</strong> {selectedCapsule.message}
                  </p>
                  {selectedCapsule.mediaUrl && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-gray-300 font-medium mb-1 text-sm sm:text-base">
                        Attached Media:
                      </p>
                      <img
                        src={selectedCapsule.mediaUrl}
                        alt="Capsule Media"
                        className="rounded-lg max-h-72 sm:max-h-96 object-cover w-full border border-purple-400/30 shadow-lg"
                      />
                    </div>
                  )}
                </>
              )}
              <div className="text-right mt-3 sm:mt-4">
                <button
                  onClick={() => {
                    setSelectedCapsule(null);
                    setPasswordInput("");
                    setPasswordError("");
                    setIsPasswordVerified(false);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 px-4 py-2 rounded-full font-bold text-white focus:ring-2 focus:ring-purple-500 shadow-lg"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Capsule Modal */}
      {editModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white/10 backdrop-blur-lg text-white rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-lg border border-purple-400/30"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-4 right-4 text-purple-200 hover:text-purple-400 text-2xl font-bold focus:outline-none z-20"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Edit Capsule</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-2 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg font-sans"
                placeholder="Capsule Title"
                required
              />
              <textarea
                name="message"
                value={editForm.message}
                onChange={handleEditChange}
                rows={4}
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-2 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg font-sans"
                placeholder="Message (optional)"
              />
              <input
                type="text"
                name="recipientName"
                value={editForm.recipientName}
                onChange={handleEditChange}
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-2 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg font-sans"
                placeholder="Recipient Name"
                required
              />
              <input
                type="email"
                name="recipientEmail"
                value={editForm.recipientEmail}
                onChange={handleEditChange}
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-2 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg font-sans"
                placeholder="Recipient Email"
                required
              />
              <input
                type="datetime-local"
                name="timeLock"
                value={editForm.timeLock}
                onChange={handleEditChange}
                className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-2 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg font-sans"
                placeholder="Unlock Date & Time"
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-600/60 text-white hover:bg-gray-700/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold hover:from-purple-700 hover:to-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      <style jsx global>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MyCapsules;
