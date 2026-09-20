import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Sparkles,
  Gift,
  Image,
  Mail,
  Award,
  BookOpen,
  ArrowRight,
  PartyPopper,
  Clock,
  Cake,
} from 'lucide-react';
import { BirthdaySettings, TabType } from '../types';
import { triggerBirthdayConfetti, triggerHeartBurst } from '../utils/confetti';
import { playUnlockSuccessSound, playKeyTapSound } from '../utils/audio';

interface DashboardViewProps {
  settings: BirthdaySettings;
  onSelectTab: (tab: TabType) => void;
  onOpenPersonalize: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  settings,
  onSelectTab,
  onOpenPersonalize,
}) => {
  // Simple countdown to birthday
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      let target = new Date(settings.birthdayDate);
      if (isNaN(target.getTime())) {
        target = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      }
      // If birthday already passed this year, set to today's celebration!
      const diff = target.getTime() - now.getTime();

      if (diff <= 0 && Math.abs(diff) < 24 * 60 * 60 * 1000) {
        // Today is birthday!
        setTimeLeft(null);
      } else {
        const days = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((Math.abs(diff) / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((Math.abs(diff) / 1000 / 60) % 60);
        const seconds = Math.floor((Math.abs(diff) / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.birthdayDate]);

  const handleCelebrate = () => {
    playUnlockSuccessSound();
    triggerBirthdayConfetti();
    triggerHeartBurst(0.5, 0.4);
  };

  const tools = [
    {
      id: 'wishes' as TabType,
      title: 'Wish Generator',
      desc: 'Emotional, cute, funny, and heartfelt wishes crafted for you.',
      icon: <Sparkles className="w-5 h-5 text-rose-500" />,
      tag: 'Tool #1',
      bg: 'from-rose-50 to-pink-50',
    },
    {
      id: 'message' as TabType,
      title: 'Birthday Message Card',
      desc: 'A personalized love letter and custom birthday card.',
      icon: <Mail className="w-5 h-5 text-rose-500" />,
      tag: 'Tool #2',
      bg: 'from-pink-50 to-rose-50',
    },
    {
      id: 'surprise' as TabType,
      title: 'Surprise & Cake',
      desc: 'Blow out the candles, unwrap mystery gifts, and pop balloons.',
      icon: <Gift className="w-5 h-5 text-rose-500" />,
      tag: 'Tool #3',
      bg: 'from-rose-50 to-pink-50',
    },
    {
      id: 'memories' as TabType,
      title: 'Memory Vault',
      desc: 'Polaroid photos and cherished moments we shared together.',
      icon: <Image className="w-5 h-5 text-rose-500" />,
      tag: 'Tool #4',
      bg: 'from-pink-50 to-rose-50',
    },
    {
      id: 'finale' as TabType,
      title: 'Final Birthday Page',
      desc: 'A grand birthday greeting and personal gift finale.',
      icon: <Award className="w-5 h-5 text-rose-500" />,
      tag: 'Tool #5',
      bg: 'from-rose-50 to-pink-50',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 relative z-10 pb-28">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-rose-200/50 border border-rose-100 relative overflow-hidden mb-8"
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-rose-100/50 blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>A Special Website Just For You</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold font-script text-rose-600 tracking-tight leading-tight">
              Happy Birthday, {settings.friendName}! 🎂
            </h1>

            <p className="text-xs sm:text-base text-slate-600 font-sans-warm mt-2 max-w-lg leading-relaxed">
              Welcome to your personal birthday haven—where every page was created to bring warmth, joy, and smiles to your heart.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  playKeyTapSound(550);
                  onSelectTab('story');
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Start Birthday Story Experience</span>
              </motion.button>

              <button
                onClick={handleCelebrate}
                className="px-4 py-3 rounded-2xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-1.5"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Confetti Shower</span>
              </button>
            </div>
          </div>

          {/* Right Floating Mascot / Greeting Cake */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-rose-100 via-pink-50 to-rose-100 border-2 border-rose-200 p-2 flex items-center justify-center shadow-lg shadow-rose-200 shrink-0 relative"
          >
            <img
              src="/memories/khushi_hero_portrait.svg"
              alt={settings.friendName}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-2 bg-white text-rose-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-md border border-rose-100">
              For {settings.friendName} ❤️
            </span>
          </motion.div>
        </div>

        {/* Celebration / Countdown Bar */}
        <div className="mt-8 pt-6 border-t border-rose-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Cake className="w-4 h-4 text-rose-500" />
            <span>Celebration Status:</span>
            <span className="text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              🎉 Today is Your Special Day!
            </span>
          </div>

          <button
            onClick={onOpenPersonalize}
            className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 underline"
          >
            Change Name or Birthday Date →
          </button>
        </div>
      </motion.div>

      {/* Primary Video Journey Card Banner */}
      <motion.div
        whileHover={{ y: -3 }}
        onClick={() => onSelectTab('story')}
        className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-rose-300/50 mb-8 cursor-pointer relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="inline-block text-[10px] uppercase tracking-wider font-bold bg-white/30 px-2.5 py-0.5 rounded-full mb-1">
              Video Reference Story Mode
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-elegant">
              The Interactive Birthday Journey
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 font-sans-warm mt-0.5">
              Secret Surprise → Cake Greeting → Sweet Memories → Love Mail → 5-Question Quiz → Finale!
            </p>
          </div>
        </div>

        <div className="px-5 py-2.5 rounded-xl bg-white text-rose-600 text-xs font-bold shadow-md hover:bg-rose-50 transition-colors flex items-center gap-1.5 shrink-0">
          <span>Play Story</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </motion.div>

      {/* 5 Birthday Tools Section */}
      <div className="mb-4">
        <div className="text-center sm:text-left mb-6">
          <h2 className="text-2xl font-serif-elegant font-bold text-slate-800">
            Personal Birthday Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Explore every special tool crafted for {settings.friendName}'s birthday.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTab(tool.id)}
              className="bg-white rounded-3xl p-6 shadow-lg shadow-rose-100 border border-rose-100 hover:border-rose-200 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition-colors">
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                    {tool.tag}
                  </span>
                </div>

                <h3 className="font-serif-elegant font-bold text-slate-800 text-lg mb-1 group-hover:text-rose-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-500 font-sans-warm leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-rose-50 flex items-center justify-between text-xs font-semibold text-rose-500">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
