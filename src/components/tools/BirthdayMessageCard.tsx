import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Heart,
  Sparkles,
  Copy,
  Check,
  Send,
  Eye,
  Edit2,
  RefreshCw,
} from 'lucide-react';
import { BirthdaySettings } from '../../types';
import { playKeyTapSound, playUnlockSuccessSound } from '../../utils/audio';
import { triggerBirthdayConfetti, triggerHeartBurst } from '../../utils/confetti';

interface BirthdayMessageCardProps {
  settings: BirthdaySettings;
  onUpdateSettings: (newSettings: BirthdaySettings) => void;
}

export const BirthdayMessageCard: React.FC<BirthdayMessageCardProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [friendName, setFriendName] = useState(settings.friendName);
  const [senderName, setSenderName] = useState(settings.senderName);
  const [message, setMessage] = useState(
    `Today is all about celebrating you! You bring so much sunshine, laughter, and comfort into my life just by being who you are. I hope your upcoming year is overflowing with big dreams coming true, endless cozy memories, and all the happiness in the universe.\n\nNever forget how deeply loved, valued, and special you are to me!`
  );
  const [cardTheme, setCardTheme] = useState<'blush' | 'cream' | 'sparkle'>('blush');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');

  const handleSaveAndPreview = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      friendName: friendName.trim() || 'Cutie',
      senderName: senderName.trim() || 'Your Best Friend',
    });
    setActiveTab('preview');
    setIsEnvelopeOpen(true);
    playUnlockSuccessSound();
    triggerHeartBurst(0.5, 0.4);
  };

  const handleCopyCardText = () => {
    const fullText = `Happy Birthday, ${friendName}!\n\n${message}\n\nWith all my love,\n${senderName}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    playKeyTapSound(600);
    triggerHeartBurst(0.5, 0.5);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeClasses = {
    blush: 'bg-gradient-to-b from-white via-rose-50/50 to-pink-50/40 border-rose-200 text-slate-700',
    cream: 'bg-gradient-to-b from-[#fffcf8] via-[#fff5eb] to-[#fff1e0] border-amber-200/70 text-amber-950',
    sparkle: 'bg-gradient-to-b from-white via-pink-50/30 to-purple-50/30 border-purple-200/60 text-slate-700',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          Birthday Tool #2
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-elegant text-slate-800 mt-2 mb-2">
          Personalized Birthday Card
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans-warm">
          Craft a custom heartfelt message and preview it in a luxury interactive card.
        </p>

        {/* Edit / Preview Pill */}
        <div className="inline-flex p-1 bg-white rounded-full border border-rose-200 shadow-sm mt-4">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Card</span>
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'edit'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-500'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Message</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Message Customizer */}
        <div
          className={`lg:col-span-5 bg-white rounded-3xl p-6 shadow-xl shadow-rose-200/40 border border-rose-100 ${
            activeTab === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-rose-100">
            <Mail className="w-4 h-4 text-rose-500" />
            <h2 className="font-serif-elegant font-bold text-slate-800 text-base">
              Card Content
            </h2>
          </div>

          <form onSubmit={handleSaveAndPreview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Recipient (Friend's Name)
              </label>
              <input
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="e.g. Cutie"
                className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/40 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400/30 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Your Personal Birthday Message
              </label>
              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt message here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/40 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400/30 resize-none font-sans-warm leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Sign-off (Your Name)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. With all my love, Ashu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-rose-50/40 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400/30 font-medium"
                required
              />
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Card Aesthetic Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'blush', label: 'Blush Pink', color: 'bg-rose-100 border-rose-300' },
                  { id: 'cream', label: 'Warm Cream', color: 'bg-amber-100 border-amber-300' },
                  { id: 'sparkle', label: 'Lilac Rose', color: 'bg-purple-100 border-purple-300' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setCardTheme(t.id as any)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      cardTheme === t.id
                        ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-xs shadow-md shadow-pink-300/40 hover:shadow-pink-300/60 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Update &amp; Preview Card</span>
            </button>
          </form>
        </div>

        {/* Right Preview: Elegant Card with Envelope Unfolding */}
        <div
          className={`lg:col-span-7 flex flex-col items-center ${
            activeTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Card Container */}
          <motion.div
            layout
            className={`w-full rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-200/60 border relative overflow-hidden transition-colors ${themeClasses[cardTheme]}`}
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 text-rose-300/60 text-lg">🌸</div>
            <div className="absolute top-3 right-3 text-rose-300/60 text-lg">✨</div>
            <div className="absolute bottom-3 left-3 text-rose-300/60 text-lg">✨</div>
            <div className="absolute bottom-3 right-3 text-rose-300/60 text-lg">🌸</div>

            {/* Card Content */}
            <div className="flex flex-col items-center text-center relative z-10 px-2 sm:px-6 py-2">
              {/* Top wax seal / badge */}
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-300/50 mb-4">
                <Heart className="w-6 h-6 fill-white" />
              </div>

              <span className="text-[11px] uppercase tracking-widest text-rose-500 font-bold mb-1">
                A Personal Birthday Note
              </span>

              <h3 className="font-script text-3xl sm:text-4xl text-rose-600 font-bold mb-4">
                Happy Birthday, {friendName}
              </h3>

              {/* Message Body */}
              <div className="font-sans-warm text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line text-left sm:text-center max-w-lg mb-6 bg-white/60 p-4 sm:p-6 rounded-2xl border border-rose-100/60 shadow-sm">
                {message}
              </div>

              {/* Closing / Sender */}
              <div className="pt-2">
                <p className="font-script text-2xl sm:text-3xl text-rose-600">
                  With all my love,
                </p>
                <p className="font-serif-elegant font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                  {senderName}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action toolbar below card */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={handleCopyCardText}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-rose-200 text-slate-700 text-xs font-semibold shadow-sm hover:bg-rose-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Card Text Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-rose-500" />
                  <span>Copy Message</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                triggerBirthdayConfetti();
                playUnlockSuccessSound();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-200 hover:shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate With Confetti</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
