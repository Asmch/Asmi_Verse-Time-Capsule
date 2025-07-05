"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Toast from './Toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Dialog } from '@headlessui/react';
import { FaQuoteLeft, FaUserCircle } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import Link from "next/link";

const Enhanced3DEffect = ({ handleCTAClick }: { handleCTAClick: () => void }) => {
  const testimonialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hover: { scale: 1.02, boxShadow: '0 0 20px rgba(128, 0, 255, 0.5)' }
  };

  // Move particles state outside the callback
  type Particle = { width: number; height: number; left: number; top: number; y: number; duration: number; delay: number };
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }).map(() => ({
        width: Math.random() * 6 + 4,
        height: Math.random() * 6 + 4,
        left: Math.random() * 100,
        top: Math.random() * 100,
        y: Math.random() * 40 + 20,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 2
      }))
    );
  }, []);

  return (
    <>
      <div className="relative h-screen overflow-hidden bg-black">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-full h-full bg-gradient-to-br from-purple-800 via-black to-black opacity-40"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1], rotate: [0, 0, 0, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Particles Layer - client only */}
          {particles.length > 0 && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {particles.map((particle, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full bg-purple-400/30"
                  style={{
                    width: `${particle.width}px`,
                    height: `${particle.height}px`,
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    filter: 'blur(1px)'
                  }}
                  animate={{
                    y: [0, particle.y, 0],
                    opacity: [0.7, 0.3, 0.7]
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay
                  }}
                />
              ))}
            </div>
          )}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            className="relative"
            animate={{
              rotateY: [0, 10, 0, -10, 0],
              rotateX: [0, -10, 0, 10, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="absolute -inset-6 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, rgba(168, 85, 247, 0.8), rgba(139, 92, 246, 0.6), rgba(168, 85, 247, 0.4), rgba(139, 92, 246, 0.6), rgba(168, 85, 247, 0.8))",
                filter: "blur(20px)"
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.img
              src="https://img.freepik.com/free-photo/illustration-circle-with-abstract-neon-light-effects-great-futuristic-background_181624-24417.jpg"
              alt="AsmiVerse Portal - A circular portal with neon light effects"
              className="w-96 h-96 object-cover rounded-full shadow-2xl"
              style={{
                boxShadow: '0 0 60px 20px #a855f7, 0 0 40px 15px rgba(139, 92, 246, 0.6)',
                transform: 'perspective(1000px) rotateX(5deg)'
              }}
              whileHover={{ scale: 1.07 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-4">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-100 to-purple-300 mb-4 drop-shadow-lg">
                Preserve Moments. Unlock Memories.
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="text-xl md:text-2xl font-medium text-purple-100 mb-2 drop-shadow">
                Create digital time capsules to surprise your future self or loved ones.
              </h2>
            </motion.div>
            <motion.div
              className="flex flex-col items-center justify-center gap-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold py-4 px-10 rounded-full shadow-2xl shadow-purple-600/40 relative overflow-hidden group text-xl animate-pulse ring-2 ring-purple-400/60 hover:ring-4 hover:shadow-purple-400/60 focus:outline-none focus:ring-4 focus:ring-purple-500/80 transition-all duration-300"
                whileHover={{ scale: 1.12, boxShadow: '0 0 48px 12px #a855f7' }}
                whileTap={{ scale: 0.98 }}
                aria-label="Create your capsule"
                onClick={handleCTAClick}
              >
                <span className="relative z-10">Create Your Capsule Now</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 flex flex-col items-center"
            >
              <span className="bg-gradient-to-r from-purple-700/80 to-purple-400/80 text-white px-8 py-4 rounded-full text-2xl font-semibold shadow-2xl tracking-wide animate-fadeIn border-2 border-purple-400/40 drop-shadow-lg">
                Your Memories, Your Legacy
              </span>
            </motion.div>
          </motion.div>
        </div>
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <svg className="w-10 h-10 text-purple-300 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>
      <div className="perspective-container mt-32 mb-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-200 to-blue-400">Features That Transcend Time</h2>
          <p className="text-lg text-purple-200 mt-2 mb-2">Why AsmiVerse is more than just a time capsule.</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6">
          {[{
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            ),
            title: 'A Portal to the Past',
            desc: 'Much like unlocking a mysterious box filled with secrets, your time capsule holds the power to transport you back in time.',
            color: 'from-purple-400 to-blue-500',
            border: 'border-purple-500/20',
            shadow: 'shadow-purple-900/20',
            hover: 'group-hover:text-purple-300',
          }, {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            ),
            title: 'Secure & Private',
            desc: 'Our encrypted system ensures that everything you store remains safe, private, and untouched until the moment you decide to open it.',
            color: 'from-blue-400 to-indigo-500',
            border: 'border-blue-500/20',
            shadow: 'shadow-blue-900/20',
            hover: 'group-hover:text-blue-300',
          }, {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ),
            title: 'Set Unlock Date',
            desc: 'Schedule the exact day and time you want your time capsule to be revealed — whether it\'s a year from now or a decade later.',
            color: 'from-indigo-400 to-violet-500',
            border: 'border-indigo-500/20',
            shadow: 'shadow-indigo-900/20',
            hover: 'group-hover:text-indigo-300',
          }, {
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            ),
            title: 'Share or Preserve',
            desc: 'Share your memories with loved ones or keep them as a private treasure, waiting for the perfect moment to unveil in the future.',
            color: 'from-violet-400 to-purple-500',
            border: 'border-violet-500/20',
            shadow: 'shadow-violet-900/20',
            hover: 'group-hover:text-violet-300',
          }].map((feature, i) => (
            <motion.div
              key={feature.title}
              className={`group hover:z-10 relative transform transition-all duration-500 ease-out hover:scale-105 ${i % 2 === 0 ? 'even:mt-8 md:even:mt-16' : 'odd:mt-8 md:odd:mt-16'}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <div className={`card-glow absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500`}></div>
              <div className={`relative flex flex-col md:flex-row bg-gradient-to-br from-black/80 via-black/90 to-black border ${feature.border} rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg ${feature.shadow}`}>
                <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
                  <h3 className={`text-2xl font-bold text-white mb-3 ${feature.hover} transition-colors duration-300`}>{feature.title}</h3>
                  <p className="text-purple-200/80 leading-relaxed mb-6">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="relative flex flex-col items-center mt-28 w-full z-10">
        {/* Animated background shapes for testimonials */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 left-1/3 w-40 h-40 bg-purple-700/20 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-blue-700/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        <span className='text-4xl font-bold text-center text-purple-200 p-2 relative'>
          Our Testimonials
          <div className="h-1 w-24 bg-purple-400 mt-2 mx-auto rounded-full"></div>
        </span>
        <div className="tests mt-10 text-purple-300 w-full max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {[
              {
                name: "Asmita P.",
                location: "Bangalore",
                text: "The experience of unlocking memories I had almost forgotten was surreal. This time capsule doesn't just store files — it preserves emotions, laughter, and nostalgia. It's a treasure chest of my most precious moments."
              },
              {
                name: "Rudra C.",
                location: "Mumbai",
                text: "I used the time capsule to propose to my partner with a hidden video message set to unlock on our anniversary. It was the most heartfelt surprise. This tool is magical for creating unforgettable moments!"
              },
              {
                name: "Nidhi K.",
                location: "Noida",
                text: "I stored videos and letters for my daughter to unlock on her 18th birthday. When she opened it, her reaction was priceless. The encryption and privacy features made it all the more reliable."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="relative bg-white/10 backdrop-blur-lg border border-purple-400/30 rounded-2xl shadow-xl p-8 flex flex-col items-center min-w-[320px] max-w-md mx-auto group hover:scale-105 transition-transform duration-300"
                variants={testimonialVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <FaQuoteLeft className="absolute top-4 left-4 text-purple-400 text-2xl opacity-30 group-hover:opacity-60 transition-opacity" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-2xl shadow-lg">
                    <FaUserCircle />
                  </div>
                  <div className="flex flex-col">
                    <span className='text-lg font-bold text-purple-200'>{testimonial.name}</span>
                    <span className='text-sm text-purple-300'>{testimonial.location}</span>
                  </div>
                </div>
                <p className='font-medium mt-2 text-purple-100 text-center leading-relaxed'>{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full max-w-4xl mx-auto mt-24 z-10 px-4 sm:px-6">
        {/* Animated background shapes for FAQs */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-700/20 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-blue-700/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1.2s' }} />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 text-purple-200">Frequently Asked Questions</h2>
        <FAQsAccordion />
      </div>
    </>
  );
};

const App = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  const [demoOpen, setDemoOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/dashboard")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data.totalCapsules > 0) {
            // Handle capsules data if needed
          }
        });
    }
  }, [session]);

  const handleCTAClick = () => {
    if (user) {
      router.push('/Create');
    } else {
      setToast({ show: true, message: 'Please log in or register to create a capsule.', type: 'error' });
      router.push('/Login'); // or '/JoinUs' if you prefer registration first
    }
  };

  // Sample demo capsule data
  const demoCapsule = {
    title: 'A Message to My Future Self',
    message: 'Remember to always chase your dreams and never give up, no matter the obstacles. The future is bright!',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    unlockDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toLocaleDateString(),
  };

  return (
    <>
      <Enhanced3DEffect handleCTAClick={handleCTAClick} />
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <Dialog open={demoOpen} onClose={() => setDemoOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2">
        <Dialog.Panel className="bg-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full text-white relative">
          <button
            onClick={() => setDemoOpen(false)}
            className="absolute top-3 right-3 text-purple-400 hover:text-purple-200 text-2xl font-bold focus:outline-none"
            aria-label="Close demo capsule"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-purple-300 mb-2">{demoCapsule.title}</h2>
          <p className="mb-3 text-purple-200">{demoCapsule.message}</p>
          <img src={demoCapsule.mediaUrl} alt="Demo Capsule" className="rounded-lg mb-3 w-full max-h-48 object-cover" />
          <div className="text-sm text-purple-400">Unlock Date: <span className="font-semibold">{demoCapsule.unlockDate}</span></div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

// Reverted FAQsAccordion to original simple version
const FAQsAccordion = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const faqData = [
    { question: "What is a Digital Time Capsule?", answer: "A Digital Time Capsule is a secure digital space where you can store memories, messages, and media to be unlocked at a specific future date." },
    { question: "How does AsmiVerse work?", answer: "AsmiVerse allows users to upload content, set an unlock date, and securely store it until the chosen time. It uses encryption to keep your data private." },
    { question: "Is my data secure?", answer: "Yes, we use advanced encryption techniques to ensure your data remains safe and private until you decide to unlock it." },
    { question: "Can I choose when to unlock the capsule?", answer: "Absolutely! You can set any future date and time for your time capsule to unlock." },
    { question: "Can I share my capsule with others?", answer: "Yes, you can choose to keep it private or share the capsule link with friends and family." }
  ];
  const toggleFAQ = (index: number): void => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };
  return (
    <div className="mt-6 space-y-4">
      {faqData.map((faq, index) => (
        <div key={index} className="mb-3 sm:mb-4 border-b border-purple-400 pb-2 sm:pb-3 bg-white/5 rounded-lg px-2 sm:px-4">
          <div 
            className="flex justify-between items-center cursor-pointer py-2 sm:py-3"
            onClick={() => toggleFAQ(index)}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold leading-snug">{faq.question}</h3>
            <span className="text-2xl sm:text-3xl">{activeFAQ === index ? '-' : '+'}</span>
          </div>
          {activeFAQ === index && (
            <p className="mt-2 text-base sm:text-lg text-purple-200 leading-relaxed">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;

export function HomeNavbar() {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/dashboard")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data.totalCapsules > 0) {
            // Handle capsules data if needed
          }
        });
    }
  }, [session]);

  return (
    <nav className="flex items-center gap-6">
      <Link href="/" className="font-bold text-purple-200 hover:text-purple-400">Home</Link>
      <Link href="/How_It_Works" className="font-bold text-purple-200 hover:text-purple-400">How It Works</Link>
      <Link href="/Create" className="font-bold text-purple-200 hover:text-purple-400">Create Capsule</Link>
      <Link href="/my_capsules" className="font-bold text-purple-200 hover:text-purple-400">My Capsules</Link>
      {/* ...existing user/profile logic... */}
    </nav>
  );
}