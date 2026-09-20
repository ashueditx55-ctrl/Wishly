import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Heart, Sparkles, Calendar, User } from 'lucide-react';
import { BirthdaySettings } from '../types';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BirthdaySettings;
  onSave: (newSettings: BirthdaySettings) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [friendName, setFriendName] = useState(settings.friendName);
  const [senderName, setSenderName] = useState(settings.senderName);
  const [birthdayDate, setBirthdayDate] = useState(settings.birthdayDate);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      friendName: friendName.trim() || 'Cutie',
      senderName: senderName.trim() || 'Someone who loves you',
      birthdayDate: birthdayDate || settings.birthdayDate,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <h2 className="text-lg font-serif-elegant font-bold text-slate-800">
                Personalize Wishly
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-400" />
                Friend's Name / Nickname
              </label>
              <input
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="e.g. Cutie, Sarah, Aayushi..."
                className="w-full px-4 py-2.5 rounded-2xl bg-rose-50/50 border border-rose-200 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                Your Name / Sign-off
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Always yours, Ashu..."
                className="w-full px-4 py-2.5 rounded-2xl bg-rose-50/50 border border-rose-200 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                Birthday Date
              </label>
              <input
                type="date"
                value={birthdayDate}
                onChange={(e) => setBirthdayDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-rose-50/50 border border-rose-200 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 transition-all"
              />
              <p className="text-[11px] text-rose-400 mt-1">
                Used to show the celebration status and birthday countdown.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-200 hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
