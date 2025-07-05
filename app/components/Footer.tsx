"use client("
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';

const capsuleFacts = [
  "Did you know? The oldest known time capsule was buried in 1876!",
  "The Crypt of Civilization, sealed in 1940, is not to be opened until 8113 AD.",
  "Time capsules are often buried under cornerstone buildings or monuments.",
  "The International Time Capsule Society tracks time capsules worldwide.",
  "A time capsule can be digital, not just physical!",
  "Some time capsules are designed to be opened by future generations centuries from now.",
  "You can include photos, letters, and even digital files in a modern time capsule.",
  "The future is a mystery—what message would you send to it?",
  "Memory is the diary we all carry about with us. – Oscar Wilde",
  "Preserving memories today creates treasures for tomorrow."
];

const capsuleIdeas = [
  // Birthday & Special Occasions
  "Wish your loved one at exactly 12:00 AM on their birthday",
  "Send a birthday surprise to your future child on their 18th birthday",
  "Create a birthday message for your spouse's 50th birthday",
  "Wish your best friend at their exact birth time next year",
  "Send a birthday video to your future grandchild",
  
  // Anniversary & Relationships
  "Write a love letter for your 10th wedding anniversary",
  "Create a surprise message for your partner's proposal anniversary",
  "Send a romantic video for your 25th anniversary",
  "Write about your first date for your 5th anniversary",
  "Create a message about your relationship journey for your 15th anniversary",
  
  // Future Child & Family
  "Write a letter to your future son on his 16th birthday",
  "Create a message for your future daughter's graduation",
  "Send advice to your future child about life and love",
  "Write about your dreams for your future family",
  "Create a family history message for your future grandchildren",
  
  // Personal Growth & Milestones
  "Write a letter to yourself 5 years from now",
  "Create a message for your future self on your 30th birthday",
  "Send yourself advice about career decisions",
  "Write about your current goals for future motivation",
  "Create a message about your biggest dreams and aspirations",
  
  // Friendship & Relationships
  "Send a surprise message to your best friend on their wedding day",
  "Write a letter to your college roommate for your 10-year reunion",
  "Create a message for your childhood friend's milestone birthday",
  "Send a thank you note to someone who changed your life",
  "Write about your friendship journey for your best friend",
  
  // Career & Professional
  "Create a message for your future self about career achievements",
  "Write advice for your younger self about professional life",
  "Send a message to your future business partner",
  "Create a career milestone celebration for yourself",
  "Write about your entrepreneurial dreams for the future",
  
  // Life Lessons & Wisdom
  "Share life lessons you wish you knew earlier",
  "Write about your biggest mistakes and what you learned",
  "Create a message about your values and beliefs",
  "Send wisdom about relationships and love",
  "Write about your spiritual journey and growth",
  
  // Creative & Artistic
  "Create a time capsule of your current music playlist",
  "Write a poem or story for your future self",
  "Send a creative project you're working on",
  "Create a message about your artistic journey",
  "Write about your creative dreams and aspirations",
  
  // Health & Wellness
  "Send yourself motivation for fitness goals",
  "Write about your health journey and progress",
  "Create a message about mental health awareness",
  "Send encouragement for healthy lifestyle changes",
  "Write about your wellness goals and achievements",
  
  // Travel & Adventure
  "Create a message about your dream destinations",
  "Write about your travel bucket list",
  "Send a message about your favorite travel memories",
  "Create a travel diary for future adventures",
  "Write about your wanderlust and exploration dreams",
  
  // Technology & Future
  "Predict what technology will be like in 20 years",
  "Write about your hopes for future innovations",
  "Create a message about the digital age and its impact",
  "Send thoughts about AI and the future of humanity",
  "Write about your vision of the future world"
];

const Footer = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  // Sample demo capsule data
  const demoCapsule = {
    title: 'A Message to My Future Self',
    message: 'Remember to always chase your dreams and never give up, no matter the obstacles. The future is bright!',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    unlockDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toLocaleDateString(),
  };

  const [randomFact, setRandomFact] = useState('');
  const [capsuleIdea, setCapsuleIdea] = useState('');

  useEffect(() => {
    setRandomFact(capsuleFacts[Math.floor(Math.random() * capsuleFacts.length)]);
    setCapsuleIdea(capsuleIdeas[Math.floor(Math.random() * capsuleIdeas.length)]);
  }, []);

  const generateIdea = () => {
    let newIdea = capsuleIdeas[Math.floor(Math.random() * capsuleIdeas.length)];
    // Ensure a new idea is shown
    while (newIdea === capsuleIdea && capsuleIdeas.length > 1) {
      newIdea = capsuleIdeas[Math.floor(Math.random() * capsuleIdeas.length)];
    }
    setCapsuleIdea(newIdea);
  };

  return (
    <>
      <footer className="bg-black text-purple-300 py-12 mt-20">
        <motion.div
          className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div className="mb-4" whileHover={{ scale: 1.1 }}>
            <h3 className="text-3xl font-bold">AsmiVerse</h3>
            <p className="text-purple-400 mt-2">Preserve Moments. Unlock Memories.</p>
            <p className="text-sm text-purple-500 mt-4 italic">"Where your memories meet the future."</p>
          </motion.div>

          <motion.div className="mb-4 flex flex-col items-center justify-center" whileHover={{ scale: 1.05 }}>
            <span className="text-purple-600 text-lg font-semibold mb-2">Need inspiration?</span>
            <button
              className="bg-gradient-to-r from-purple-800 to-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-all text-base mb-3"
              onClick={generateIdea}
            >
              Generate a Capsule Idea
            </button>
            <motion.div
              key={capsuleIdea}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-purple-200 text-center text-base italic px-2"
            >
              {capsuleIdea}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-900/60 to-purple-800/60 rounded-lg shadow-lg px-4 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="font-semibold text-lg">Random Capsule Fact:</span>
            <span className="italic text-base mt-2 text-purple-200 text-center">{randomFact}</span>
          </motion.div>
        </motion.div>
        <motion.div
          className="text-center text-purple-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          © {new Date().getFullYear()} AsmiVerse. All Rights Reserved.
        </motion.div>
      </footer>
    </>
  )
}

export default Footer