"use client";
import { useSession } from "next-auth/react";
import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ updated import
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaFileUpload, FaTrashAlt, FaCloudUploadAlt } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';

// TypeScript interface for the capsule data
interface CapsuleData {
  id: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  timeLock: string;
  createdAt: string;
}

// Event types and templates
const EVENT_TYPES = [
  { value: 'birthday', label: 'Birthday', icon: '🎂', templates: [
    'Happy Birthday, [Name]! Hope your day is filled with joy and laughter.',
    'Wishing you a fantastic birthday, [Name]! Enjoy your special day.',
    'Many happy returns of the day, [Name]! Stay blessed.'
  ] },
  { value: 'anniversary', label: 'Anniversary', icon: '💍', templates: [
    'Happy Anniversary, [Name]! Wishing you both endless love and happiness.',
    'Congratulations on another year together, [Name]!',
    'Cheers to your beautiful journey, [Name]!'
  ] },
  { value: 'newyear', label: 'New Year', icon: '🎉', templates: [
    'Happy New Year, [Name]! May your year be bright and successful.',
    'Wishing you a wonderful New Year, [Name]!',
    'Cheers to new beginnings, [Name]!'
  ] },
  { value: 'graduation', label: 'Graduation', icon: '🎓', templates: [
    'Congratulations on your graduation, [Name]! The future is yours.',
    'So proud of you, [Name]! Happy Graduation!',
    'Wishing you all the best for your next adventure, [Name]!'
  ] },
  { value: 'promotion', label: 'Promotion', icon: '🏆', templates: [
    'Congratulations on your promotion, [Name]! You earned it.',
    'So happy for your success, [Name]! Keep shining.',
    'Wishing you more achievements ahead, [Name]!'
  ] },
  { value: 'custom', label: 'Other Event', icon: '✨', templates: [
    'Congratulations, [Name]! You did it!',
    'Best wishes, [Name]!'
  ] },
];

// Event Capsule Form
const EventCapsuleForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [eventType, setEventType] = useState<string>('birthday');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [template, setTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('00:00');
  const [repeat, setRepeat] = useState<'never' | 'yearly' | 'monthly' | 'custom'>('never');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const isToday = date === minDate;
  const minTime = isToday ? today.toTimeString().slice(0,5) : undefined;

  // Update message when template changes
  useEffect(() => {
    if (template) {
      setMessage(template.replace('[Name]', recipientName || ''));
    }
  }, [template, recipientName]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setProgress(80);

    const incrementProgress = () => {
      setProgress(prev => (prev < 90 ? prev + 5 : prev));
    };

    const progressInterval = setInterval(incrementProgress, 300);

    try {
      let uploadedFileUrl = '';
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || 'File upload failed');
        uploadedFileUrl = uploadJson.url;
      }
      // Combine date and time
      const scheduledTime = date && time ? `${date}T${time}` : '';
      const capsuleData = {
        title: `${EVENT_TYPES.find(e => e.value === eventType)?.label || 'Event'} Capsule`,
        message,
        recipientName,
        recipientEmail,
        timeLock: scheduledTime,
        mediaUrl: uploadedFileUrl,
        password: password || undefined,
        capsuleType: 'event',
        eventType,
        repeat,
      };
      // Basic validation
      if (!recipientName || !recipientEmail || !scheduledTime) {
        setError('Please fill all required fields');
        setSubmitting(false);
        setProgress(0);
        return;
      }
      const response = await fetch('/api/Capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(capsuleData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event capsule');
      }
      setSubmitting(false);
      setProgress(100);
      setCompleted(true);
      setTimeout(() => {
        onBack();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setSubmitting(false);
      setProgress(0);
      toast.error('Failed to create capsule');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white/10 rounded-2xl p-8 mt-8 space-y-8 shadow-xl border border-purple-400/30">
      <button type="button" onClick={onBack} className="mb-4 text-blue-400 underline font-semibold cursor-pointer transition hover:text-blue-300">← Back</button>
      <h3 className="text-2xl font-bold mb-4 text-purple-100">Create Event Capsule</h3>
      {/* Event Type Selection */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Event Type</label>
        <div className="flex gap-3 flex-wrap">
          {EVENT_TYPES.map(e => (
            <button
              key={e.value}
              type="button"
              className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 text-lg font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${eventType === e.value ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/10 border-purple-400/30 text-purple-200 hover:bg-purple-700/10'}`}
              onClick={() => { setEventType(e.value); setTemplate(''); }}
            >
              <span>{e.icon}</span> {e.label}
            </button>
          ))}
        </div>
      </div>
      {/* Recipient Name & Email */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Recipient Name"
          className="flex-1 bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
          value={recipientName}
          onChange={e => setRecipientName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Recipient Email"
          className="flex-1 bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
          value={recipientEmail}
          onChange={e => setRecipientEmail(e.target.value)}
          required
        />
      </div>
      {/* Template Suggestions */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Choose a template or write your own</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {EVENT_TYPES.find(e => e.value === eventType)?.templates.map((t, idx) => (
            <button
              key={idx}
              type="button"
              className={`px-3 py-1 rounded-full border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-400 ${template === t ? 'bg-purple-500 text-white border-purple-400' : 'bg-white/10 text-purple-200 border-purple-400/30 hover:bg-purple-700/10'}`}
              onClick={() => setTemplate(t)}
            >
              {t.replace('[Name]', recipientName || 'Name')}
            </button>
          ))}
        </div>
        <textarea
          rows={4}
          className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
          placeholder="Write your message..."
          value={message}
          onChange={e => { setMessage(e.target.value); setTemplate(''); }}
          required
        />
      </div>
      {/* Date & Time Picker */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <label className="block text-purple-200 font-semibold mb-2">Date</label>
          <input
            type="date"
            className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={minDate}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-purple-200 font-semibold mb-2">Time</label>
          <input
            type="time"
            className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
            value={time}
            onChange={e => setTime(e.target.value)}
            min={minTime}
            required
          />
        </div>
      </div>
      {/* Repeat Option */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Repeat</label>
        <div className="relative">
          <select
            className="w-full bg-[#23272b] border border-purple-400/30 rounded-lg py-3 px-4 text-gray-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg appearance-none hover:border-purple-400"
            value={repeat}
            onChange={e => setRepeat(e.target.value as any)}
            style={{ color: '#e5e7eb', background: '#23272b' }}
          >
            <option value="never" style={{ background: '#23272b', color: '#e5e7eb' }}>Never</option>
            <option value="yearly" style={{ background: '#23272b', color: '#e5e7eb' }}>Every Year</option>
            <option value="monthly" style={{ background: '#23272b', color: '#e5e7eb' }}>Every Month</option>
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-300">▼</span>
        </div>
      </div>
      {/* File Upload */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Attach Media (optional)</label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${file ? 'border-purple-400 bg-purple-900/10' : 'border-purple-400/30 bg-white/5'} flex flex-col items-center justify-center gap-2`}
          onDragEnter={e => { e.preventDefault(); e.stopPropagation(); }}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setFile(e.dataTransfer.files[0]);
              setFilePreview(URL.createObjectURL(e.dataTransfer.files[0]));
            }
          }}
        >
          <input
            type="file"
            accept="image/*,video/*,audio/*,application/pdf"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
            <FaCloudUploadAlt className="text-4xl text-purple-400 mb-2 animate-bounce" />
            <span className="text-purple-200 font-medium">{file ? 'Change File' : 'Drag & drop or click to upload media/document'}</span>
            <span className="text-xs text-purple-300 mt-1">Image, video, audio, or PDF (max 10MB)</span>
          </label>
          {filePreview && (
            <div className="mt-4 flex flex-col items-center">
              {file?.type.startsWith('image/') && (
                <img src={filePreview} alt="Preview" className="max-h-32 rounded-lg shadow-lg mb-2" />
              )}
              {file?.type.startsWith('video/') && (
                <video src={filePreview} controls className="max-h-32 rounded-lg shadow-lg mb-2" />
              )}
              {file?.type.startsWith('audio/') && (
                <audio src={filePreview} controls className="w-full mb-2" />
              )}
              <button type="button" onClick={() => { setFile(null); setFilePreview(null); }} className="px-3 py-1 bg-red-500/80 text-white rounded-full text-sm font-semibold hover:bg-red-600/90 transition mt-2 cursor-pointer">Remove</button>
            </div>
          )}
        </div>
      </div>
      {/* Password Protection */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Set a password (optional)</label>
        <input
          type="password"
          className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg font-sans"
          placeholder="Set a password (optional)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {password && (
          <p className="text-purple-300 text-xs mb-2 ml-1">Receiver will be asked for this password while opening the capsule.</p>
        )}
      </div>
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/90 text-white p-2 rounded-md text-center text-sm font-semibold animate-shake">
          Error: {error}
        </div>
      )}
      {/* Progress Bar */}
      {(submitting || completed) && (
        <div className="w-full bg-purple-900/30 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-400 h-3 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {completed && (
        <div className="text-green-400 text-center font-bold text-lg mb-4 animate-pulse">Capsule Created!</div>
      )}
      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className={`relative bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-10 rounded-full shadow-xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/60 hover:scale-105 hover:shadow-purple-400/40 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={submitting}
        >
          {submitting ? 'Creating Capsule...' : 'Create Event Capsule'}
        </button>
      </div>
    </form>
  );
};

// Custom Capsule Form
const CustomCapsuleForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('00:00');
  const [repeat, setRepeat] = useState<'never' | 'yearly' | 'monthly'>('never');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const isToday = date === minDate;
  const minTime = isToday ? today.toTimeString().slice(0,5) : undefined;

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setProgress(80);

    const incrementProgress = () => {
      setProgress(prev => (prev < 90 ? prev + 5 : prev));
    };

    const progressInterval = setInterval(incrementProgress, 300);

    try {
      let uploadedFileUrl = '';
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || 'File upload failed');
        uploadedFileUrl = uploadJson.url;
      }
      // Combine date and time
      const scheduledTime = date && time ? `${date}T${time}` : '';
      const capsuleData = {
        title,
        message,
        recipientName,
        recipientEmail,
        timeLock: scheduledTime,
        mediaUrl: uploadedFileUrl,
        password: password || undefined,
        capsuleType: 'custom',
        repeat,
      };
      // Basic validation
      if (!title || !recipientName || !recipientEmail || !scheduledTime) {
        setError('Please fill all required fields');
        setSubmitting(false);
        setProgress(0);
        return;
      }
      const response = await fetch('/api/Capsules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(capsuleData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create custom capsule');
      }
      setSubmitting(false);
      setProgress(100);
      setCompleted(true);
      setTimeout(() => {
        onBack();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setSubmitting(false);
      setProgress(0);
      toast.error('Failed to create capsule');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white/10 rounded-2xl p-8 mt-8 space-y-8 shadow-xl border border-purple-400/30">
      <button type="button" onClick={onBack} className="mb-4 text-blue-400 underline font-semibold cursor-pointer transition hover:text-blue-300">← Back</button>
      <h3 className="text-2xl font-bold mb-4 text-purple-100">Create Custom Capsule</h3>
      {/* Capsule Title */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Capsule Title</label>
        <input
          type="text"
          className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
          placeholder="e.g. A Letter to My Future Self"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      {/* Recipient Name & Email */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <input
          type="text"
          placeholder="Recipient Name"
          className="flex-1 bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
          value={recipientName}
          onChange={e => setRecipientName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Recipient Email"
          className="flex-1 bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
          value={recipientEmail}
          onChange={e => setRecipientEmail(e.target.value)}
          required
        />
      </div>
      {/* Message */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Your Message</label>
        <textarea
          rows={4}
          className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
          placeholder="Write your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>
      {/* Date & Time Picker */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <label className="block text-purple-200 font-semibold mb-2">Date</label>
          <input
            type="date"
            className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={minDate}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-purple-200 font-semibold mb-2">Time</label>
          <input
            type="time"
            className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg"
            value={time}
            onChange={e => setTime(e.target.value)}
            min={minTime}
            required
          />
        </div>
      </div>
      {/* Repeat Option */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Repeat</label>
        <div className="relative">
          <select
            className="w-full bg-[#23272b] border border-purple-400/30 rounded-lg py-3 px-4 text-gray-100 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg appearance-none hover:border-purple-400"
            value={repeat}
            onChange={e => setRepeat(e.target.value as any)}
            style={{ color: '#e5e7eb', background: '#23272b' }}
          >
            <option value="never" style={{ background: '#23272b', color: '#e5e7eb' }}>Never</option>
            <option value="yearly" style={{ background: '#23272b', color: '#e5e7eb' }}>Every Year</option>
            <option value="monthly" style={{ background: '#23272b', color: '#e5e7eb' }}>Every Month</option>
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-300">▼</span>
        </div>
      </div>
      {/* File Upload */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Attach Media (optional)</label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${file ? 'border-purple-400 bg-purple-900/10' : 'border-purple-400/30 bg-white/5'} flex flex-col items-center justify-center gap-2`}
          onDragEnter={e => { e.preventDefault(); e.stopPropagation(); }}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setFile(e.dataTransfer.files[0]);
              setFilePreview(URL.createObjectURL(e.dataTransfer.files[0]));
            }
          }}
        >
          <input
            type="file"
            accept="image/*,video/*,audio/*,application/pdf"
            className="hidden"
            id="custom-file-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="custom-file-upload" className="flex flex-col items-center cursor-pointer">
            <FaCloudUploadAlt className="text-4xl text-purple-400 mb-2 animate-bounce" />
            <span className="text-purple-200 font-medium">{file ? 'Change File' : 'Drag & drop or click to upload media/document'}</span>
            <span className="text-xs text-purple-300 mt-1">Image, video, audio, or PDF (max 10MB)</span>
          </label>
          {filePreview && (
            <div className="mt-4 flex flex-col items-center">
              {file?.type.startsWith('image/') && (
                <img src={filePreview} alt="Preview" className="max-h-32 rounded-lg shadow-lg mb-2" />
              )}
              {file?.type.startsWith('video/') && (
                <video src={filePreview} controls className="max-h-32 rounded-lg shadow-lg mb-2" />
              )}
              {file?.type.startsWith('audio/') && (
                <audio src={filePreview} controls className="w-full mb-2" />
              )}
              <button type="button" onClick={() => { setFile(null); setFilePreview(null); }} className="px-3 py-1 bg-red-500/80 text-white rounded-full text-sm font-semibold hover:bg-red-600/90 transition mt-2 cursor-pointer">Remove</button>
            </div>
          )}
        </div>
      </div>
      {/* Password Protection */}
      <div>
        <label className="block text-purple-200 font-semibold mb-2">Set a password (optional)</label>
        <input
          type="password"
          className="w-full bg-white/10 border border-purple-400/30 rounded-lg py-3 px-4 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-lg font-sans"
          placeholder="Set a password (optional)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {password && (
          <p className="text-purple-300 text-xs mb-2 ml-1">Receiver will be asked for this password while opening the capsule.</p>
        )}
      </div>
      {/* Progress Bar */}
      {(submitting || completed) && (
        <div className="w-full bg-purple-900/30 rounded-full h-3 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-400 h-3 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {completed && (
        <div className="text-green-400 text-center font-bold text-lg mb-4 animate-pulse">Capsule Created!</div>
      )}
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/90 text-white p-2 rounded-md text-center text-sm font-semibold animate-shake">
          Error: {error}
        </div>
      )}
      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className={`relative bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-10 rounded-full shadow-xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400/60 hover:scale-105 hover:shadow-purple-400/40 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={submitting}
        >
          {submitting ? 'Creating Capsule...' : 'Create Custom Capsule'}
        </button>
      </div>
    </form>
  );
};

/**
 * CreateCapsule Component
 * Allows users to create a time capsule with optional media/document upload.
 * Handles form submission, file upload to Cloudinary, and progress feedback.
 */
const CreateCapsule = () => {
  // State for form submission and progress
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  // State for file upload and preview
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Drag-and-drop state
  const [dragActive, setDragActive] = useState(false);
  const [password, setPassword] = useState("");
  const [capsuleType, setCapsuleType] = useState<null | 'event' | 'custom'>(null);

  /**
   * Handles file input changes and sets preview for supported types.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else if (selectedFile.type.startsWith('video/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else if (selectedFile.type.startsWith('audio/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    } else {
      setFilePreview(null);
    }
  };

  /**
   * Handles form submission, uploads file to Cloudinary if present,
   * then submits capsule data to the backend.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setProgress(10);

    const incrementProgress = () => {
      setProgress(prev => (prev < 90 ? prev + 5 : prev));
    };

    const progressInterval = setInterval(incrementProgress, 300);

    try {
      const formElement = e.target as HTMLFormElement;
      const formData = new FormData(formElement);

      let uploadedFileUrl = '';
      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || 'File upload failed');
        uploadedFileUrl = uploadJson.url;
      }

      const capsuleData = {
        title: formData.get('title') as string,
        message: formData.get('message') as string,
        recipientName: formData.get('recipientName') as string,
        recipientEmail: formData.get('recipientEmail') as string,
        timeLock: formData.get('timeLock') as string,
        mediaUrl: uploadedFileUrl,
        password: password || undefined,
      };

      if (!capsuleData.title || !capsuleData.recipientName || !capsuleData.recipientEmail || !capsuleData.timeLock) {
        clearInterval(progressInterval);
        setError('Please fill all required fields');
        setIsSubmitting(false);
        setProgress(0);
        return;
      }

      const response = await fetch('/api/Capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(capsuleData),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create time capsule');
      }

      const result = await response.json();

      setProgress(100);

      if (result.success) {
        toast.success('Time capsule created successfully!');
        const newCapsule: CapsuleData = result.capsule;

        setTimeout(() => {
          router.push(`/my_capsules?newCapsule=${encodeURIComponent(JSON.stringify(newCapsule))}`);
        }, 800);
      } else {
        setError(result.message || 'Something went wrong');
        setIsSubmitting(false);
        setProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      setIsSubmitting(false);
      setProgress(0);
      toast.error('Failed to create capsule');
    }
  };

  // Drag-and-drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setFilePreview(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-8 px-2 bg-gradient-to-br from-purple-900 via-black to-blue-900 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-2xl animate-spin-slow" style={{transform: 'translate(-50%, -50%)'}} />
      </div>
      <div className="w-full max-w-5xl mx-auto z-10">
        {/* Capsule Type Selection Step */}
        {!capsuleType && (
          <div className="flex flex-col items-center gap-6 mt-12">
            <h2 className="text-2xl font-bold mb-4 text-purple-100">What type of capsule do you want to create?</h2>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full flex items-center gap-2 text-xl shadow-lg"
              onClick={() => setCapsuleType('event')}
            >
              🎉 Event Capsule <span className="text-sm text-purple-200">(Birthday, Anniversary, etc.)</span>
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full flex items-center gap-2 text-xl shadow-lg"
              onClick={() => setCapsuleType('custom')}
            >
              ✏️ Custom Capsule <span className="text-sm text-blue-200">(Personal, One-time, Daily, etc.)</span>
            </button>
          </div>
        )}
        {capsuleType === 'event' && (
          <EventCapsuleForm onBack={() => setCapsuleType(null)} />
        )}
        {capsuleType === 'custom' && <CustomCapsuleForm onBack={() => setCapsuleType(null)} />}
      </div>
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
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default CreateCapsule;
