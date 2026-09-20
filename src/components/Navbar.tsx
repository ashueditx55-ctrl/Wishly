import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Sparkles,
  Gift,
  Image,
  Mail,
  Volume2,
  VolumeX,
  Edit3,
  Award,
  BookOpen,
  Home,
} from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  friendName: string;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenPersonalize: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  friendName,
  isMusicPlaying,
  onToggleMusic,
  onOpenPersonalize,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'story', label: 'Story Journey', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'wishes', label: 'Wish Generator', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'message', label: 'Message Card', icon: <Mail className="w-4 h-4" /> },
    { id: 'surprise', label: 'Surprise & Cake', icon: <Gift className="w-4 h-4" /> },
    { id: 'memories', label: 'Memories', icon: <Image className="w-4 h-4" /> },
    { id: 'finale', label: 'Grand Finale', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Main Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm shadow-rose-100/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-400 to-pink-300 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-serif-elegant font-bold text-xl text-slate-800 tracking-tight">
                  Wishly
                </span>
                <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-rose-400 font-medium -mt-1">
                Personal Birthday Surprise
              </p>
            </div>
          </div>

          {/* Center Navigation for Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-rose-50/70 p-1.5 rounded-full border border-rose-100/80">
            {tabs.map((tab) => {
              const active = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'text-rose-600 shadow-sm'
                      : 'text-slate-600 hover:text-rose-500 hover:bg-rose-100/40'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-white rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Friend Name Personalizer Pill */}
            <button
              onClick={onOpenPersonalize}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200/80 shadow-sm transition-all"
              title="Personalize Name & Details"
            >
              <span className="text-rose-400">For:</span>
              <span className="max-w-[80px] sm:max-w-[120px] truncate">{friendName}</span>
              <Edit3 className="w-3 h-3 text-rose-400 ml-0.5" />
            </button>

            {/* Birthday Music Toggle */}
            <button
              onClick={onToggleMusic}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                isMusicPlaying
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-300 animate-gentle-pulse'
                  : 'bg-white text-rose-400 border-rose-200 hover:bg-rose-50'
              }`}
              aria-label={isMusicPlaying ? 'Mute Music' : 'Play Birthday Melody'}
              title={isMusicPlaying ? 'Mute Music' : 'Play Birthday Music Box'}
            >
              {isMusicPlaying ? (
                <Volume2 className="w-4 h-4 animate-bounce" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (for smooth mobile-first experience) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-rose-100 px-2 py-2 shadow-lg shadow-rose-200/50 flex items-center justify-around">
        {tabs.map((tab) => {
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                active ? 'text-rose-500 scale-105 font-bold' : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl ${
                  active ? 'bg-rose-100 text-rose-600' : 'bg-transparent'
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5 max-w-[50px] truncate">
                {tab.id === 'dashboard' ? 'Home' : tab.id === 'wishes' ? 'Wishes' : tab.id === 'surprise' ? 'Surprise' : tab.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
