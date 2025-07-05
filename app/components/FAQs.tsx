"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const Enhanced3DEffect = () => {
  const [rotate, setRotate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const faqData: FAQItem[] = [
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
    <>
      <div className="faq-section mt-10 sm:mt-16 max-w-4xl mx-auto text-purple-300 px-2 sm:px-4 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6">Frequently Asked Questions</h2>
        {faqData.map((faq, index) => (
          <div key={index} className="mb-3 sm:mb-4 border-b border-purple-400 pb-2 sm:pb-3">
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
    </>
  );
};

const App = () => {
  return (
    <>
      <Enhanced3DEffect />
    </>
  );
};

export default App;