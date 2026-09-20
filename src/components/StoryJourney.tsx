import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gift,
  Heart,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Mail,
  RotateCcw,
  CheckCircle2,
  Cake,
  PartyPopper,
} from 'lucide-react';
import { BirthdaySettings, Memory, QuizStep } from '../types';
import { BIRTHDAY_QUIZ } from '../data/birthdayData';
import { playKeyTapSound, playUnlockSuccessSound } from '../utils/audio';
import { triggerBirthdayConfetti, triggerHeartBurst } from '../utils/confetti';

interface StoryJourneyProps {
  settings: BirthdaySettings;
  memories: Memory[];
  onFinishJourney: () => void;
  onGoToTab: (tab: any) => void;
}

export const StoryJourney: React.FC<StoryJourneyProps> = ({
  settings,
  memories,
  onFinishJourney,
}) => {
  // Step tracker:
  // 0: Gift Box Wait
  // 1: Happy Birthday Cake Greeting
  // 2: Sweet Memories Polaroid
  // 3: You've Got Mail (Envelope unopened)
  // 4: Letter Page 1
  // 5: Letter Page 2
  // 6: Quiz (steps 0 to 4)
  // 7: Quiz Complete
  // 8: Final Surprise
  const [step, setStep] = useState<number>(0);
  const [memoryIndex, setMemoryIndex] = useState<number>(0);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  // Internal scoring map: { [questionIndex]: { option: string; isCorrect: boolean } }
  const [quizAnswers, setQuizAnswers] = useState<Record<number, { option: string; isCorrect: boolean }>>({});

  const nextStep = () => {
    playKeyTapSound(580);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    playKeyTapSound(440);
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleOpenGift = () => {
    playUnlockSuccessSound();
    triggerHeartBurst(0.5, 0.4);
    nextStep();
  };

  // Internal scoring logic (never displayed directly to Khushi)
  const checkIsCorrectAnswer = (optionIndex: number, optionText: string, currentQuiz: QuizStep): boolean => {
    const letters = ['A', 'B', 'C', 'D'];
    const letter = letters[optionIndex];

    // For questions with multiple accepted answers (e.g. Question 5 accepts both B and D)
    if (currentQuiz.correctAnswers && Array.isArray(currentQuiz.correctAnswers)) {
      return currentQuiz.correctAnswers.some((ans) => {
        const a = ans.trim().toUpperCase();
        return a === letter || optionText.trim().toLowerCase() === ans.trim().toLowerCase();
      });
    }

    if (currentQuiz.correctAnswer) {
      const a = currentQuiz.correctAnswer.trim().toUpperCase();
      return a === letter || optionText.trim().toLowerCase() === currentQuiz.correctAnswer.trim().toLowerCase();
    }

    return false;
  };

  const handleQuizAnswer = (option: string, optionIndex: number, currentQuiz: QuizStep) => {
    if (selectedQuizOption) return; // prevent multi-tap during transition
    setSelectedQuizOption(option);

    const isCorrect = checkIsCorrectAnswer(optionIndex, option, currentQuiz);
    setQuizAnswers((prev) => ({
      ...prev,
      [quizIndex]: { option, isCorrect },
    }));

    playKeyTapSound(640);
    triggerHeartBurst(0.5, 0.5);

    setTimeout(() => {
      if (quizIndex < BIRTHDAY_QUIZ.length - 1) {
        setQuizIndex((prev) => prev + 1);
        setSelectedQuizOption(null);
      } else {
        // Quiz complete
        playUnlockSuccessSound();
        triggerBirthdayConfetti();
        setStep(7);
      }
    }, 650);
  };

  const handleQuizBack = () => {
    if (quizIndex > 0) {
      setQuizIndex((prev) => prev - 1);
      setSelectedQuizOption(null);
    } else {
      prevStep();
    }
  };

  const handleRestart = () => {
    setStep(0);
    setMemoryIndex(0);
    setQuizIndex(0);
    setQuizAnswers({});
    setSelectedQuizOption(null);
  };

  const totalCorrect = Object.values(quizAnswers).filter((ans) => ans.isCorrect).length;

  return (
    <div className="relative z-10 w-full max-w-md mx-auto min-h-[80vh] flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {/* SCENE 0: Something special is waiting... (Gift Box) */}
        {step === 0 && (
          <motion.div
            key="scene-0"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white rounded-3xl p-8 shadow-2xl shadow-rose-200/60 border border-rose-100 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
            
            {/* Animated Gift Box Icon */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-50 to-pink-100 border border-rose-200 flex items-center justify-center mb-6 shadow-md shadow-rose-100"
            >
              <Gift className="w-10 h-10 text-rose-500 stroke-[1.8]" />
            </motion.div>

            <h2 className="text-2xl font-bold font-serif-elegant text-slate-800 tracking-tight mb-2">
              Something special is waiting...
            </h2>
            <p className="text-sm text-rose-400 font-medium mb-8">
              Tap the button to open it ✨
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpenGift}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 text-white font-semibold text-base shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Open It! ✨</span>
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 1: Happy Birthday, Cutie ❤️ */}
        {step === 1 && (
          <motion.div
            key="scene-1"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white rounded-3xl p-8 shadow-2xl shadow-rose-200/60 border border-rose-100 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Cute Birthday Cake Illustration */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mb-5 relative shadow-inner"
            >
              <Cake className="w-12 h-12 text-rose-500" />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute -top-1 right-2 text-xl"
              >
                ✨
              </motion.span>
            </motion.div>

            <h2 className="text-3xl font-bold font-script text-rose-600 mb-2">
              Happy Birthday, {settings.friendName} ❤️
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-sans-warm leading-relaxed mb-8 px-2">
              You fill my life with pure happiness and sweetness everyday 🌸
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={nextStep}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-base shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Let's explore</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 2: Sweet Memories (Polaroid Swipe) */}
        {step === 2 && (
          <motion.div
            key="scene-2"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="text-2xl font-bold font-serif-elegant text-slate-800 mb-1">
              Sweet Memories
            </h2>
            <p className="text-xs text-rose-400 font-medium mb-5">
              Swipe the photo to see next ✨
            </p>

            {/* Polaroid Frame */}
            <motion.div
              key={memoryIndex}
              initial={{ opacity: 0, rotate: memoryIndex % 2 === 0 ? -2 : 2, scale: 0.95 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="w-full bg-white p-4 pt-4 pb-6 rounded-3xl shadow-xl shadow-rose-200/50 border border-rose-100 flex flex-col items-center relative"
            >
              {/* Photo */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-rose-50 relative group">
                <img
                  src={memories[memoryIndex % memories.length]?.imageUrl || '/memories/our_beautiful_friendship.svg'}
                  alt={memories[memoryIndex % memories.length]?.title || 'Memory'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Caption & Description */}
              <p className="font-script text-2xl text-slate-800 mt-4 mb-1">
                {memories[memoryIndex % memories.length]?.caption || memories[memoryIndex % memories.length]?.title || 'Our Beautiful Friendship'}
              </p>
              <p className="text-xs text-slate-500 text-center px-4 font-sans-warm">
                {memories[memoryIndex % memories.length]?.description || memories[memoryIndex % memories.length]?.caption}
              </p>

              {/* Navigation dots & arrows */}
              <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-rose-50 px-2">
                <button
                  onClick={() => {
                    playKeyTapSound(400);
                    setMemoryIndex((prev) => (prev > 0 ? prev - 1 : memories.length - 1));
                  }}
                  className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex gap-1.5">
                  {memories.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === memoryIndex % memories.length
                          ? 'w-4 bg-rose-500'
                          : 'w-1.5 bg-rose-200'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => {
                    playKeyTapSound(500);
                    setMemoryIndex((prev) => (prev + 1) % memories.length);
                  }}
                  className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Next Action Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={nextStep}
              className="w-full mt-6 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-base shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition-all flex items-center justify-center gap-2"
            >
              <span>Read My Letter</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 3: You've Got Mail! 💌 */}
        {step === 3 && (
          <motion.div
            key="scene-3"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white rounded-3xl p-8 shadow-2xl shadow-rose-200/60 border border-rose-100 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Cute Envelope Icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-50 to-pink-100 border border-rose-200 flex items-center justify-center mb-5 shadow-sm"
            >
              <Mail className="w-10 h-10 text-rose-500 stroke-[1.8]" />
            </motion.div>

            <h2 className="text-2xl font-bold font-serif-elegant text-slate-800 mb-1">
              You've Got Mail! 💌
            </h2>
            <p className="text-xs sm:text-sm text-rose-400 font-medium mb-8">
              Tap to open your special letter
            </p>

            {/* Heart Wax Seal Tap Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playUnlockSuccessSound();
                triggerHeartBurst(0.5, 0.5);
                nextStep();
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-300/60 hover:shadow-rose-300/80 transition-all cursor-pointer"
            >
              <Heart className="w-8 h-8 fill-white" />
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 4: Letter Page 1 */}
        {step === 4 && (
          <motion.div
            key="scene-4"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.45 }}
            className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-rose-200/60 border border-rose-100 flex flex-col relative"
          >
            {/* Header / Page Count */}
            <div className="flex items-center justify-between pb-3.5 border-b border-rose-100/70 mb-5">
              <span className="text-sm sm:text-base text-slate-400 font-normal">Page 1 of 2</span>
              <div className="flex items-center gap-1.5">
                <span className="font-handwriting text-2xl sm:text-3xl text-[#FF1E6A] font-bold relative inline-block">
                  For My {settings.friendName || 'Khushi Kumari'}
                  <span className="block w-full h-[2px] bg-rose-300/80 rounded-full mt-0.5" />
                </span>
                <span className="text-2xl text-[#FF1E6A] font-light leading-none">
                  ♡
                </span>
              </div>
            </div>

            <h3 className="font-serif-elegant font-bold text-xl text-slate-800 mb-3 flex items-center gap-2">
              <span>Happy Birthday, {settings.friendName}</span>
              <span>🎂</span>
            </h3>

            <div className="text-xs sm:text-sm text-slate-600 font-sans-warm leading-relaxed space-y-3 mb-6">
              <p>
                Today is a beautiful reminder of how lucky I am to have someone as amazing as you in my life.
              </p>
              <p>
                You bring so much happiness, warmth, and positivity just by being yourself.
              </p>
              <p>
                Over time, so many wonderful memories and little moments have found a special place in my heart.
              </p>
              <p>
                No matter where life takes us, I will always cherish those moments and be grateful for having you in my life.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={nextStep}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md shadow-pink-300/40 hover:shadow-pink-300/60 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Read More</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 5: Letter Page 2 (Matching user design) */}
        {step === 5 && (
          <motion.div
            key="scene-5"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.45 }}
            className="w-full relative"
          >
            {/* Ambient Floating Hearts & Sparkles (from design) */}
            <div className="absolute -top-5 -left-4 text-rose-400 opacity-80 pointer-events-none select-none">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#FDA4AF" className="transform -rotate-12">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div className="absolute -top-3 -right-3 text-amber-400 opacity-80 pointer-events-none select-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24">
                <path d="M12 2L14 9L21 11L14 13L12 20L10 13L3 11L10 9Z"/>
              </svg>
            </div>
            <div className="absolute -bottom-4 -left-4 text-amber-400 opacity-80 pointer-events-none select-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24">
                <path d="M12 2L14 9L21 11L14 13L12 20L10 13L3 11L10 9Z"/>
              </svg>
            </div>
            <div className="absolute -bottom-3 -right-3 text-rose-400 opacity-80 pointer-events-none select-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FDA4AF" className="transform rotate-12">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            {/* Main Card Container */}
            <div className="w-full bg-white rounded-3xl sm:rounded-[28px] p-6 sm:p-8 shadow-2xl shadow-rose-200/60 border border-rose-100/90 flex flex-col relative">
              {/* Header: Page 2 of 2 and For My Khushi Kumari ♡ */}
              <div className="flex items-center justify-between pb-3.5 border-b border-rose-100/70 mb-5">
                <span className="text-sm sm:text-base text-slate-400 font-normal">
                  Page 2 of 2
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-handwriting text-2xl sm:text-3xl text-[#FF1E6A] font-bold relative inline-block">
                    For My {settings.friendName || 'Khushi Kumari'}
                    {/* Underline brush flourish */}
                    <span className="block w-full h-[2px] bg-rose-300/80 rounded-full mt-0.5" />
                  </span>
                  <span className="text-2xl text-[#FF1E6A] font-light leading-none">
                    ♡
                  </span>
                </div>
              </div>

              {/* Letter Paragraphs */}
              <div className="text-slate-700 font-sans-warm text-[15px] sm:text-base leading-relaxed space-y-4 mb-6">
                <p>
                  I hope your day is filled with love, laughter, happiness, and everything that makes you smile.
                </p>
                <p className="flex flex-wrap items-center gap-1.5">
                  <span>Happy Birthday, {settings.friendName || 'Khushi Kumari'}</span>
                  <span className="text-lg">💗</span>
                  <span>You are truly special to me.</span>
                </p>
              </div>

              {/* Highlight Callout Box: My Best Friend, Always */}
              <div className="w-full bg-[#FFF0F4] border border-[#FFD5E1] rounded-2xl py-5 px-3 sm:px-6 mb-7 flex items-center justify-between relative shadow-xs">
                {/* Left Doodle: Radiating Heart */}
                <div className="shrink-0 pl-1 sm:pl-2">
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 38 38"
                    fill="none"
                    className="text-[#FF2E74]"
                  >
                    {/* Radiating rays */}
                    <line x1="19" y1="6" x2="19" y2="2" stroke="#FF2E74" strokeWidth="2" strokeLinecap="round" />
                    <line x1="9" y1="10" x2="5" y2="7" stroke="#FF2E74" strokeWidth="2" strokeLinecap="round" />
                    <line x1="29" y1="10" x2="33" y2="7" stroke="#FF2E74" strokeWidth="2" strokeLinecap="round" />
                    <line x1="7" y1="19" x2="3" y2="19" stroke="#FF2E74" strokeWidth="2" strokeLinecap="round" />
                    <line x1="31" y1="19" x2="35" y2="19" stroke="#FF2E74" strokeWidth="2" strokeLinecap="round" />
                    {/* Outline Heart */}
                    <path
                      d="M19 28 C13 22 9.5 18 9.5 14 C9.5 10.5 12 8.5 15.5 8.5 C17.5 8.5 18.5 9.5 19 10 C19.5 9.5 20.5 8.5 22.5 8.5 C26 8.5 28.5 10.5 28.5 14 C28.5 18 25 22 19 28 Z"
                      stroke="#FF2E74"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Center Banner Title & Subtitle */}
                <div className="text-center px-2 sm:px-4 flex-1">
                  <div className="inline-block relative">
                    <h3 className="font-handwriting text-3xl sm:text-4xl text-[#E11D48] font-bold tracking-wide">
                      My Best Friend, Always
                    </h3>
                    {/* Elegant hand-drawn underline */}
                    <div className="w-full h-0.5 bg-rose-400/80 -mt-0.5 mb-1 rounded-full" />
                  </div>
                  <p className="font-sans-warm italic text-slate-500 text-xs sm:text-sm font-medium mt-1">
                    Same craziness, different day, forever us.
                  </p>
                </div>

                {/* Right Doodle: Sparkle Star */}
                <div className="shrink-0 pr-1 sm:pr-2">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    className="text-[#FF2E74]"
                  >
                    {/* 4-point sparkle */}
                    <path
                      d="M16 2 Q16 16 2 16 Q16 16 16 30 Q16 16 30 16 Q16 16 16 2 Z"
                      stroke="#FF2E74"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    {/* Satellite twinkle */}
                    <circle cx="26" cy="7" r="1.5" fill="#FF2E74" />
                  </svg>
                </div>
              </div>

              {/* Action Buttons: < Back and Continue > */}
              <div className="flex items-center gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={prevStep}
                  className="px-5 sm:px-6 py-3.5 rounded-2xl bg-white hover:bg-rose-50/50 border border-rose-200 text-slate-700 text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500 stroke-[2.5]" />
                  <span>Back</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF2B6D] via-[#FF267A] to-[#E60067] text-white font-bold text-sm sm:text-base shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCENE 6: Interactive Best Friends Quiz */}
        {step === 6 && (
          <motion.div
            key="scene-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="w-full flex flex-col items-center"
          >
            {/* Top Hearts Progress bar */}
            <div className="flex items-center gap-2.5 mb-4 bg-white/95 px-5 py-2.5 rounded-full border border-rose-100 shadow-sm">
              {BIRTHDAY_QUIZ.map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-all duration-300 ${
                    i <= quizIndex
                      ? 'text-rose-500 fill-rose-500 scale-110'
                      : 'text-rose-200 stroke-1'
                  }`}
                />
              ))}
            </div>

            {/* Quiz Question Card */}
            <div className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-rose-200/50 border border-rose-100 flex flex-col relative">
              <span className="text-[11px] uppercase tracking-wider font-bold text-rose-400 text-center mb-1">
                Question {quizIndex + 1} of {BIRTHDAY_QUIZ.length}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif-elegant text-slate-800 text-center mb-6">
                {BIRTHDAY_QUIZ[quizIndex].question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {BIRTHDAY_QUIZ[quizIndex].options.map((option, optIdx) => {
                  const letterPrefix = ['A', 'B', 'C', 'D'][optIdx];
                  const isSelected = (selectedQuizOption || quizAnswers[quizIndex]?.option) === option;

                  let buttonStyle = 'bg-white border-rose-100/90 text-slate-700 hover:border-rose-300 hover:bg-rose-50/50 shadow-xs';
                  if (isSelected) {
                    // Cute soft pink highlight for selected choice (never revealing answer key to Khushi)
                    buttonStyle = 'bg-rose-100 border-rose-400 text-rose-900 shadow-sm font-bold';
                  }

                  return (
                    <motion.button
                      key={option}
                      whileHover={!selectedQuizOption ? { scale: 1.01 } : {}}
                      whileTap={!selectedQuizOption ? { scale: 0.99 } : {}}
                      onClick={() => handleQuizAnswer(option, optIdx, BIRTHDAY_QUIZ[quizIndex])}
                      className={`w-full py-3.5 px-4 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between text-left cursor-pointer ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-rose-500 text-white shadow-xs'
                              : 'bg-rose-50 text-rose-500 border border-rose-200'
                          }`}
                        >
                          {letterPrefix}
                        </span>
                        <span className="text-slate-800 font-medium text-sm">
                          {option}
                        </span>
                      </div>
                      {isSelected && (
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0 animate-pulse" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigation Back button */}
              <div className="flex items-center justify-between pt-2.5 border-t border-rose-100/70">
                <button
                  onClick={handleQuizBack}
                  className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-rose-50 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>{quizIndex === 0 ? 'Back to Letter' : 'Previous Question'}</span>
                </button>
                <span className="text-xs text-rose-400 font-medium">
                  {quizIndex + 1}/{BIRTHDAY_QUIZ.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCENE 7: Quiz Complete! */}
        {step === 7 && (
          <motion.div
            key="scene-7"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white rounded-3xl p-8 shadow-2xl shadow-rose-200/60 border border-rose-100 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Score Badge */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-50 to-pink-100 border-2 border-rose-300 flex items-center justify-center mb-5 shadow-sm"
            >
              <span className="font-serif-elegant font-bold text-2xl text-rose-600">
                {totalCorrect}/5
              </span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-bold font-handwriting text-rose-600 mb-1">
              Best Friends Quiz Complete! ✨
            </h2>
            <p className="text-sm text-slate-600 font-sans-warm mb-8">
              {totalCorrect === 5
                ? 'You got 5 out of 5! You know our friendship by heart! 💕'
                : `You scored ${totalCorrect} out of 5! Best friends forever 💕`}
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={nextStep}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 text-white font-semibold text-base shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <Sparkles className="w-4 h-4 text-rose-100" />
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 8: Final Birthday Tribute */}
        {step === 8 && (
          <motion.div
            key="scene-8"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white rounded-3xl p-7 sm:p-8 shadow-2xl shadow-rose-200/60 border border-rose-100 flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Top Label */}
            <span className="text-[11px] uppercase tracking-widest font-bold text-rose-400 bg-rose-50 px-3 py-1 rounded-full mb-4">
              ONCE AGAIN,
            </span>

            {/* Heart-framed Hero Picture / Adorable mascot */}
            <div className="w-40 h-40 rounded-full p-2 bg-gradient-to-tr from-rose-300 via-pink-400 to-rose-200 shadow-xl mb-5">
              <img
                src="/memories/khushi_hero_portrait.svg"
                alt="Birthday Special"
                className="w-full h-full object-cover rounded-full border-2 border-white"
                referrerPolicy="no-referrer"
              />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-script text-rose-600 mb-3">
              Happy Birthday, {settings.friendName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-sans-warm leading-relaxed mb-6 px-3">
              I hope this birthday surprise brought the biggest smile to your face! Thank you for being the absolute best friend anyone could ask for. Happy Birthday, {settings.friendName || 'Khushi Kumari'}! 💖✨
            </p>

            <div className="w-full space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  triggerBirthdayConfetti();
                  handleRestart();
                }}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md shadow-pink-300/40 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Relive it</span>
              </motion.button>

              <button
                onClick={onFinishJourney}
                className="w-full py-2.5 px-6 rounded-2xl text-rose-500 text-xs font-semibold hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Explore All Birthday Tools</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
