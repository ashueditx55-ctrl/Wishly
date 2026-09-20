import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Sparkles,
  PartyPopper,
  RotateCcw,
  Gift,
  Share2,
  Check,
  Award,
} from 'lucide-react';
import { BirthdaySettings } from '../../types';
import { playKeyTapSound, playUnlockSuccessSound } from '../../utils/audio';
import { triggerBirthdayConfetti, triggerHeartBurst } from '../../utils/confetti';

interface FinalBirthdayPageProps {
  settings: BirthdaySettings;
  onReplayStory: () => void;
}

export const FinalBirthdayPage: React.FC<FinalBirthdayPageProps> = ({
  settings,
  onReplayStory,
}) => {
  const [hugCount, setHugCount] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSendHug = () => {
    playUnlockSuccessSound();
    triggerHeartBurst(0.5, 0.5);
    triggerBirthdayConfetti();
    setHugCount((prev) => prev + 1);
  };

  const handleShare = () => {
    playKeyTapSound(550);
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    triggerHeartBurst(0.5, 0.5);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative z-10 pb-28 text-center">
      {/* Top Badge */}
      <span className="text-xs uppercase tracking-widest font-bold text-rose-500 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100">
        Birthday Tool #5 • The Grand Finale
      </span>

      {/* Main Luxury Birthday Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-6 bg-white rounded-3xl p-7 sm:p-10 shadow-2xl shadow-rose-200/60 border border-rose-100 relative overflow-hidden flex flex-col items-center"
      >
        {/* Subtle grid and glowing orb */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-100/60 blur-3xl pointer-events-none" />

        {/* Small Tag */}
        <span className="text-[11px] uppercase tracking-widest font-bold text-rose-400 bg-rose-50 px-3.5 py-1 rounded-full mb-5">
          ONCE AGAIN,
        </span>

        {/* Hero Portrait with Cute Glowing Ring (from video) */}
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="relative mb-6"
        >
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full p-2 bg-gradient-to-tr from-rose-400 via-pink-400 to-rose-200 shadow-2xl shadow-rose-300/60">
            <img
              src="/memories/khushi_hero_portrait.svg"
              alt={`Happy Birthday ${settings.friendName}`}
              className="w-full h-full object-cover rounded-full border-4 border-white"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Sparkle Badges */}
          <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-rose-500 border border-rose-100">
            <Sparkles className="w-5 h-5 text-rose-500" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-rose-500 border border-rose-100">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
          </div>
        </motion.div>

        {/* Big Greeting Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold font-script text-rose-600 mb-3 tracking-tight">
          Happy Birthday, {settings.friendName}!
        </h1>

        {/* Deep Emotional Message */}
        <div className="max-w-lg mx-auto bg-rose-50/50 p-6 rounded-2xl border border-rose-100 mb-8 font-sans-warm text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
          <p>
            I hope this little website made you smile as much as you make me smile every single day.
          </p>
          <p>
            You deserve the sweetest year imaginable—filled with peace in your heart, endless belly laughs, spontaneous adventures, and dreams coming true one by one.
          </p>
          <p className="font-semibold text-rose-600">
            Thank you for being you. I love you endlessly! 💕
          </p>
        </div>

        {/* Interactive Virtual Hug Counter */}
        <div className="flex flex-col items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleSendHug}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 text-white font-semibold text-sm shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition-all flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Send Birthday Hug &amp; Confetti ({hugCount})</span>
          </motion.button>
          <span className="text-[11px] text-slate-400 mt-2">
            Tap to shower {settings.friendName} with extra virtual hugs!
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-4 border-t border-rose-100">
          <button
            onClick={onReplayStory}
            className="flex-1 min-w-[140px] py-3 px-4 rounded-2xl bg-white border border-rose-200 text-slate-700 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>Relive Story</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 min-w-[140px] py-3 px-4 rounded-2xl bg-white border border-rose-200 text-slate-700 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Share Website</span>
              </>
            )}
          </button>
        </div>

        {/* Signoff */}
        <div className="mt-8 pt-4">
          <p className="font-script text-2xl text-rose-500">
            Always &amp; forever yours,
          </p>
          <p className="font-serif-elegant font-bold text-slate-800 text-sm mt-0.5">
            {settings.senderName}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
