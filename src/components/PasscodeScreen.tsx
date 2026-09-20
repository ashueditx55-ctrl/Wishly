import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Delete, Lock, Unlock, Sparkles } from 'lucide-react';
import { playKeyTapSound, playErrorSound, playUnlockSuccessSound } from '../utils/audio';
import { triggerBirthdayConfetti, triggerHeartBurst } from '../utils/confetti';

interface PasscodeScreenProps {
  onUnlock: () => void;
  friendName?: string;
}

const CORRECT_PIN = '12409';
const PIN_LENGTH = 5;

export const PasscodeScreen: React.FC<PasscodeScreenProps> = ({ onUnlock, friendName = 'Cutie' }) => {
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const handleKeyPress = useCallback((digit: string) => {
    if (isUnlocked) return;
    if (pin.length < PIN_LENGTH) {
      playKeyTapSound(480 + pin.length * 60);
      const newPin = pin + digit;
      setPin(newPin);
      setIsError(false);
      setErrorMessage('');

      // If user filled all digits, auto-validate
      if (newPin.length === PIN_LENGTH) {
        validatePin(newPin);
      }
    }
  }, [pin, isUnlocked]);

  const handleDelete = useCallback(() => {
    if (isUnlocked || pin.length === 0) return;
    playKeyTapSound(380);
    setPin((prev) => prev.slice(0, -1));
    setIsError(false);
    setErrorMessage('');
  }, [isUnlocked, pin.length]);

  const validatePin = (inputPin: string) => {
    if (inputPin === CORRECT_PIN) {
      setIsUnlocked(true);
      playUnlockSuccessSound();
      triggerHeartBurst(0.5, 0.4);
      triggerBirthdayConfetti();
      setTimeout(() => {
        onUnlock();
      }, 1200);
    } else {
      playErrorSound();
      setIsError(true);
      setErrorMessage("Oops! That's not the secret code, try again ❤️");
      setTimeout(() => {
        setPin('');
      }, 650);
    }
  };

  const handleUnlockClick = () => {
    if (pin.length === PIN_LENGTH) {
      validatePin(pin);
    } else {
      setIsError(true);
      setErrorMessage(`Please enter all ${PIN_LENGTH} digits to unlock ✨`);
      playErrorSound();
    }
  };

  // Keyboard event listener for desktop users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        handleUnlockClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, handleDelete, pin]);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[92vh] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-200/60 border border-rose-100 flex flex-col items-center relative overflow-hidden"
      >
        {/* Subtle grid background inside card matching video */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Top Decorative Floating Heart Icon */}
        <motion.div
          animate={isUnlocked ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : { y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative mb-3"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-400 to-pink-300 flex items-center justify-center shadow-lg shadow-rose-300/50">
            {isUnlocked ? (
              <Unlock className="w-8 h-8 text-white transition-transform" />
            ) : (
              <Lock className="w-8 h-8 text-white transition-transform" />
            )}
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 items-center justify-center text-[9px] text-white">
              ♥
            </span>
          </span>
        </motion.div>

        {/* Headings */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center font-serif-elegant tracking-tight">
          Unlock Your Surprise
        </h1>
        <p className="text-sm sm:text-base text-rose-400 font-sans-warm font-medium mt-1 mb-6 text-center">
          Enter the secret code for {friendName} to begin ✨
        </p>

        {/* 5 Heart Indicators (from video) */}
        <motion.div
          animate={isError ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-3.5 mb-6 py-2 px-4 rounded-full bg-rose-50/80 border border-rose-100"
        >
          {Array.from({ length: PIN_LENGTH }).map((_, index) => {
            const isFilled = index < pin.length;
            return (
              <motion.div
                key={index}
                initial={false}
                animate={
                  isFilled
                    ? { scale: [0.8, 1.25, 1], transition: { duration: 0.2 } }
                    : { scale: 1 }
                }
                className="relative flex items-center justify-center"
              >
                {isFilled ? (
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500 drop-shadow-sm" />
                ) : (
                  <Heart className="w-6 h-6 text-rose-300 stroke-[1.8]" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Friendly Error Notice */}
        <AnimatePresence>
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-xs sm:text-sm text-rose-600 bg-rose-100/90 font-medium px-4 py-1.5 rounded-full mb-4 text-center shadow-sm"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unlock Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUnlockClick}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 bg-size-200 text-white font-semibold text-base shadow-md shadow-pink-300/40 hover:shadow-lg hover:shadow-pink-300/60 transition-all flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="w-5 h-5 text-rose-100" />
          <span>Unlock Surprise ✨</span>
        </motion.button>

        {/* Numeric Keypad (1 to 9, 0, Backspace) */}
        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <motion.button
              key={digit}
              whileHover={{ scale: 1.06, backgroundColor: '#fff1f2' }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleKeyPress(digit.toString())}
              className="h-14 sm:h-16 rounded-2xl bg-white border border-rose-100 text-slate-700 font-semibold text-xl sm:text-2xl shadow-sm hover:border-rose-200 transition-colors flex items-center justify-center active:bg-rose-100"
            >
              {digit}
            </motion.button>
          ))}

          {/* Empty spacer / Clear */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              playKeyTapSound(320);
              setPin('');
              setIsError(false);
              setErrorMessage('');
            }}
            className="h-14 sm:h-16 rounded-2xl bg-transparent text-rose-400 text-xs font-semibold flex items-center justify-center hover:bg-rose-50/50 transition-colors"
          >
            Clear
          </motion.button>

          {/* 0 digit */}
          <motion.button
            whileHover={{ scale: 1.06, backgroundColor: '#fff1f2' }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleKeyPress('0')}
            className="h-14 sm:h-16 rounded-2xl bg-white border border-rose-100 text-slate-700 font-semibold text-xl sm:text-2xl shadow-sm hover:border-rose-200 transition-colors flex items-center justify-center active:bg-rose-100"
          >
            0
          </motion.button>

          {/* Backspace Button */}
          <motion.button
            whileHover={{ scale: 1.06, backgroundColor: '#fff1f2' }}
            whileTap={{ scale: 0.92 }}
            onClick={handleDelete}
            aria-label="Delete last digit"
            className="h-14 sm:h-16 rounded-2xl bg-white border border-rose-100 text-rose-500 font-semibold shadow-sm hover:border-rose-200 transition-colors flex items-center justify-center active:bg-rose-100"
          >
            <Delete className="w-6 h-6 text-rose-500" />
          </motion.button>
        </div>

        {/* Footer soft note */}
        <p className="text-[11px] text-rose-300 font-sans-warm mt-5 text-center">
          Created with endless love for your special day 💕
        </p>
      </motion.div>
    </div>
  );
};
