import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gift,
  Flame,
  Wind,
  Sparkles,
  Heart,
  PartyPopper,
  RefreshCw,
  Award,
} from 'lucide-react';
import {
  playKeyTapSound,
  playCandleBlowSound,
  playUnlockSuccessSound,
} from '../../utils/audio';
import { triggerBirthdayConfetti, triggerHeartBurst } from '../../utils/confetti';

interface BirthdaySurpriseProps {
  friendName: string;
}

interface MysteryBox {
  id: number;
  title: string;
  color: string;
  isOpen: boolean;
  surpriseTitle: string;
  surpriseText: string;
  emoji: string;
}

export const BirthdaySurprise: React.FC<BirthdaySurpriseProps> = ({ friendName }) => {
  // Candle state
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [wishMade, setWishMade] = useState<boolean>(false);

  // Mystery Gift Boxes
  const [boxes, setBoxes] = useState<MysteryBox[]>([
    {
      id: 1,
      title: 'Box #1',
      color: 'from-pink-400 to-rose-400',
      isOpen: false,
      surpriseTitle: 'Golden Friendship Coupon ☕️',
      surpriseText: 'Redeemable anytime for free late-night talks, cafe treats, and warm comforting hugs.',
      emoji: '🌸',
    },
    {
      id: 2,
      title: 'Box #2',
      color: 'from-rose-400 to-pink-500',
      isOpen: false,
      surpriseTitle: 'One Secret Wish Voucher 🌟',
      surpriseText: 'Make any wish right now! The universe and I promise to do everything possible to make it real.',
      emoji: '👑',
    },
    {
      id: 3,
      title: 'Box #3',
      color: 'from-pink-300 to-rose-300',
      isOpen: false,
      surpriseTitle: 'A Lifetime of Loyalty 🗝️',
      surpriseText: 'A promise to always be in your corner, cheer your wins, and hold your hand through everything.',
      emoji: '🤍',
    },
  ]);

  // Floating Balloons to pop
  const [balloons, setBalloons] = useState([
    { id: 1, text: 'You are so loved! 💕', popped: false, color: '#f43f5e' },
    { id: 2, text: 'Cutie pie forever! 🎀', popped: false, color: '#ec4899' },
    { id: 3, text: 'Shine bright! ✨', popped: false, color: '#fb7185' },
    { id: 4, text: 'Pure sunshine! ☀️', popped: false, color: '#fda4af' },
  ]);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    playCandleBlowSound();
    setCandlesLit(false);
    setWishMade(true);
    setTimeout(() => {
      triggerBirthdayConfetti();
      playUnlockSuccessSound();
    }, 400);
  };

  const handleRelightCandles = () => {
    playKeyTapSound(540);
    setCandlesLit(true);
    setWishMade(false);
  };

  const handleOpenBox = (id: number) => {
    playUnlockSuccessSound();
    triggerHeartBurst(0.5, 0.4);
    setBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, isOpen: true } : box))
    );
  };

  const handlePopBalloon = (id: number) => {
    playKeyTapSound(880);
    triggerHeartBurst(0.5, 0.5);
    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10 pb-28">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          Birthday Tool #3
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-elegant text-slate-800 mt-2 mb-2">
          Birthday Surprise &amp; Cake
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans-warm">
          Make a wish, blow out the candles, unwrap mystery gifts, and pop floating balloons!
        </p>
      </div>

      {/* SECTION 1: Interactive Birthday Cake */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-200/50 border border-rose-100 mb-8 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-300 via-pink-400 to-rose-300" />
        
        <span className="text-xs uppercase font-bold text-rose-500 tracking-wider mb-2">
          Make a Birthday Wish
        </span>
        <h2 className="text-2xl font-serif-elegant font-bold text-slate-800 mb-6">
          {candlesLit ? `Blow out the candles, ${friendName}! 🕯️` : `Wish Made! Happy Birthday! 🎉`}
        </h2>

        {/* The Animated Cake Stage */}
        <div className="relative w-64 h-56 flex flex-col items-center justify-end my-4 select-none">
          {/* Candle Flames & Smoke */}
          <div className="flex items-center justify-center gap-6 mb-1 z-20">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Flame */}
                {candlesLit ? (
                  <motion.div
                    animate={{
                      scaleY: [1, 1.25, 0.9, 1.1],
                      scaleX: [1, 0.9, 1.15, 1],
                      y: [0, -2, 1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + i * 0.15,
                      ease: 'easeInOut',
                    }}
                    className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-md shadow-amber-300/80 mb-0.5 cursor-pointer"
                    onClick={handleBlowCandles}
                  />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: [0.6, 0], y: -20 }}
                    transition={{ duration: 1.5 }}
                    className="w-1.5 h-4 text-xs text-slate-400 mb-1"
                  >
                    ☁️
                  </motion.div>
                )}

                {/* Candle Stick */}
                <div className="w-3 h-10 rounded-t-sm bg-gradient-to-r from-pink-200 via-white to-pink-300 border border-pink-300/40 relative shadow-sm">
                  {/* Candle stripes */}
                  <div className="absolute inset-0 bg-repeat-y opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f43f5e 0, #f43f5e 2px, transparent 2px, transparent 6px)' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Top Layer of Cake */}
          <div className="w-44 h-14 rounded-2xl bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 border-2 border-rose-300 shadow-md flex items-center justify-around px-4 relative z-10">
            {/* Frosting drips */}
            <span className="text-rose-400">🍓</span>
            <span className="text-rose-400">🤍</span>
            <span className="text-rose-400">🍓</span>
            <span className="text-rose-400">🤍</span>
            <span className="text-rose-400">🍓</span>
          </div>

          {/* Bottom Tier of Cake */}
          <div className="w-56 h-18 -mt-2 rounded-2xl bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 border-2 border-rose-400 shadow-lg flex items-center justify-around px-6 relative z-0">
            <span className="text-sm">🌸</span>
            <span className="text-sm">✨</span>
            <span className="text-sm font-script font-bold text-rose-700 text-lg">
              {friendName}
            </span>
            <span className="text-sm">✨</span>
            <span className="text-sm">🌸</span>
          </div>

          {/* Cake Stand */}
          <div className="w-64 h-3 bg-slate-200 rounded-full shadow-md mt-1 border border-slate-300/60" />
          <div className="w-20 h-4 bg-slate-300 rounded-b-xl shadow-inner" />
        </div>

        {/* Action button */}
        <div className="mt-4">
          {candlesLit ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleBlowCandles}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md shadow-pink-300/50 hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Wind className="w-4 h-4 animate-pulse" />
              <span>Blow Out Candles! 💨</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleRelightCandles}
              className="px-5 py-2.5 rounded-2xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Light Candles Again</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* SECTION 2: Mystery Gift Boxes */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <span className="text-xs uppercase font-bold text-rose-500 tracking-wider">
            Unwrap Your Gifts
          </span>
          <h2 className="text-2xl font-serif-elegant font-bold text-slate-800">
            3 Mystery Birthday Presents 🎁
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tap each present to untie the ribbon and see what's inside.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {boxes.map((box) => (
            <div
              key={box.id}
              className="bg-white rounded-3xl p-5 shadow-lg shadow-rose-100 border border-rose-100 flex flex-col items-center text-center relative overflow-hidden transition-all min-h-[220px]"
            >
              {!box.isOpen ? (
                <div className="flex flex-col items-center justify-center flex-1 py-4">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleOpenBox(box.id)}
                    className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${box.color} flex items-center justify-center shadow-lg shadow-rose-200 cursor-pointer mb-3 relative group`}
                  >
                    <Gift className="w-10 h-10 text-white stroke-[1.8]" />
                    <span className="absolute -top-1 -right-1 bg-white text-rose-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      Tap
                    </span>
                  </motion.div>
                  <p className="text-xs font-bold text-slate-700">{box.title}</p>
                  <button
                    onClick={() => handleOpenBox(box.id)}
                    className="mt-2 text-[11px] font-semibold text-rose-500 hover:text-rose-600"
                  >
                    Open Surprise ✨
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center flex-1 py-2"
                >
                  <span className="text-3xl mb-2">{box.emoji}</span>
                  <h3 className="font-serif-elegant font-bold text-rose-600 text-sm mb-1.5">
                    {box.surpriseTitle}
                  </h3>
                  <p className="text-xs text-slate-600 font-sans-warm leading-relaxed">
                    {box.surpriseText}
                  </p>
                  <span className="mt-auto pt-3 text-[10px] font-bold text-rose-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-rose-400" />
                    Unwrapped with love
                  </span>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Floating Balloons Pop Game */}
      <div className="bg-gradient-to-b from-white to-rose-50/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-200/40 border border-rose-100 text-center">
        <span className="text-xs uppercase font-bold text-rose-500 tracking-wider">
          Fun Mini-Activity
        </span>
        <h2 className="text-xl sm:text-2xl font-serif-elegant font-bold text-slate-800 mt-1 mb-2">
          Pop the Birthday Balloons! 🎈
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Tap each floating balloon to pop it and release a hidden compliment for {friendName}.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {balloons.map((balloon) => (
            <div
              key={balloon.id}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/80 border border-rose-100 min-h-[140px]"
            >
              {!balloon.popped ? (
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 2.2 + balloon.id * 0.4 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handlePopBalloon(balloon.id)}
                  className="w-14 h-18 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-md relative"
                  style={{ backgroundColor: balloon.color }}
                >
                  <span className="text-white text-xs font-bold">Pop!</span>
                  <div className="w-1 h-3 bg-amber-100/60 rounded-full absolute -bottom-1" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <Sparkles className="w-5 h-5 text-rose-400 mb-1" />
                  <p className="text-xs font-semibold text-rose-600 font-sans-warm">
                    {balloon.text}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
