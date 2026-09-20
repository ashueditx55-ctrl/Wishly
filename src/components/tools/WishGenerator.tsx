import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Copy,
  Check,
  Shuffle,
  Heart,
  Plus,
  Smile,
  Flame,
  MessageCircleHeart,
  Quote,
} from 'lucide-react';
import { BirthdayWish } from '../../types';
import { INITIAL_WISHES } from '../../data/birthdayData';
import { playKeyTapSound, playUnlockSuccessSound } from '../../utils/audio';
import { triggerHeartBurst } from '../../utils/confetti';

interface WishGeneratorProps {
  friendName: string;
}

export const WishGenerator: React.FC<WishGeneratorProps> = ({ friendName }) => {
  const [wishes, setWishes] = useState<BirthdayWish[]>(INITIAL_WISHES);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'heartfelt' | 'cute' | 'funny' | 'emotional'
  >('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeWish, setActiveWish] = useState<BirthdayWish>(INITIAL_WISHES[0]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newWishText, setNewWishText] = useState<string>('');
  const [newWishCategory, setNewWishCategory] = useState<'heartfelt' | 'cute' | 'funny' | 'emotional'>('heartfelt');
  const [newWishTheme, setNewWishTheme] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Wishes', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'heartfelt', label: 'Heartfelt', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'cute', label: 'Cute & Sweet', icon: <Smile className="w-3.5 h-3.5" /> },
    { id: 'emotional', label: 'Emotional', icon: <MessageCircleHeart className="w-3.5 h-3.5" /> },
    { id: 'funny', label: 'Funny & Playful', icon: <Flame className="w-3.5 h-3.5" /> },
  ];

  const filteredWishes = wishes.filter(
    (w) => selectedCategory === 'all' || w.category === selectedCategory
  );

  const handleCopy = (text: string, id: string) => {
    playKeyTapSound(640);
    // Replace placeholder if any
    const formatted = text.replace(/Cutie/g, friendName);
    navigator.clipboard.writeText(formatted);
    setCopiedId(id);
    triggerHeartBurst(0.5, 0.4);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShuffle = () => {
    playKeyTapSound(520);
    const pool = filteredWishes.length > 0 ? filteredWishes : wishes;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setActiveWish(pool[randomIndex]);
    triggerHeartBurst(0.5, 0.5);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishText.trim()) return;

    const newWish: BirthdayWish = {
      id: `w-custom-${Date.now()}`,
      category: newWishCategory,
      theme: newWishTheme.trim() || 'My Personal Wish',
      emoji: newWishCategory === 'cute' ? '🎀' : newWishCategory === 'funny' ? '🎉' : '💌',
      text: newWishText.trim(),
    };

    setWishes([newWish, ...wishes]);
    setActiveWish(newWish);
    setNewWishText('');
    setNewWishTheme('');
    setShowAddModal(false);
    playUnlockSuccessSound();
    triggerHeartBurst(0.5, 0.5);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          Birthday Tool #1
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-elegant text-slate-800 mt-2 mb-2">
          Birthday Wish Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans-warm">
          Discover sweet, emotional, and adorable words crafted especially for {friendName}.
        </p>
      </div>

      {/* Featured Highlight Wish Card */}
      <motion.div
        key={activeWish.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-b from-white via-rose-50/40 to-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-200/50 border border-rose-100 mb-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeWish.emoji}</span>
            <div>
              <span className="text-xs uppercase font-bold text-rose-500 tracking-wider">
                {activeWish.theme}
              </span>
              <p className="text-[11px] text-slate-400 capitalize">{activeWish.category} Wish</p>
            </div>
          </div>
          
          <button
            onClick={() => handleCopy(activeWish.text, activeWish.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-rose-200 text-rose-600 text-xs font-semibold shadow-sm hover:bg-rose-50 transition-colors"
          >
            {copiedId === activeWish.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Wish</span>
              </>
            )}
          </button>
        </div>

        <div className="relative py-3">
          <Quote className="w-8 h-8 text-rose-200 absolute -top-1 -left-2 -z-0 opacity-60" />
          <p className="font-serif-elegant text-lg sm:text-xl text-slate-700 leading-relaxed italic relative z-10 px-2 sm:px-4">
            "{activeWish.text.replace(/Cutie/g, friendName)}"
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-rose-100">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Another Wish</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write Custom Wish</span>
          </button>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playKeyTapSound(480);
                setSelectedCategory(cat.id as any);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                active
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                  : 'bg-white text-slate-600 border-rose-100 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Wishes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredWishes.map((wish) => {
          const isCurrentActive = activeWish.id === wish.id;
          return (
            <motion.div
              key={wish.id}
              layout
              className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between ${
                isCurrentActive
                  ? 'border-rose-300 shadow-md shadow-rose-100 bg-rose-50/20'
                  : 'border-rose-100 hover:border-rose-200 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{wish.emoji}</span>
                    <span className="text-xs font-bold text-rose-500">
                      {wish.theme}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100/70 px-2 py-0.5 rounded-full">
                    {wish.category}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-sans-warm leading-relaxed">
                  "{wish.text.replace(/Cutie/g, friendName)}"
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-rose-50">
                <button
                  onClick={() => {
                    playKeyTapSound(500);
                    setActiveWish(wish);
                  }}
                  className="text-[11px] font-semibold text-rose-500 hover:text-rose-600"
                >
                  Feature above ↑
                </button>
                <button
                  onClick={() => handleCopy(wish.text, wish.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Copy Wish"
                >
                  {copiedId === wish.id ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Custom Wish Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100"
            >
              <h3 className="text-lg font-serif-elegant font-bold text-slate-800 mb-1">
                Write a Custom Wish
              </h3>
              <p className="text-xs text-rose-400 mb-4">
                Add your own personal words to the collection for {friendName}.
              </p>

              <form onSubmit={handleAddWish} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Theme / Title
                  </label>
                  <input
                    type="text"
                    value={newWishTheme}
                    onChange={(e) => setNewWishTheme(e.target.value)}
                    placeholder="e.g. My Favorite Human, 5 Years Strong..."
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={newWishCategory}
                    onChange={(e) => setNewWishCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
                  >
                    <option value="heartfelt">Heartfelt</option>
                    <option value="cute">Cute &amp; Sweet</option>
                    <option value="emotional">Emotional</option>
                    <option value="funny">Funny &amp; Playful</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Your Wish Message
                  </label>
                  <textarea
                    rows={4}
                    value={newWishText}
                    onChange={(e) => setNewWishText(e.target.value)}
                    placeholder={`Dear ${friendName}, on your birthday I just want to say...`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400/30 resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-rose-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white text-xs font-semibold shadow-sm hover:shadow-md"
                  >
                    Add to Collection
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
