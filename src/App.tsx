import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PasscodeScreen } from './components/PasscodeScreen';
import { Navbar } from './components/Navbar';
import { BackgroundDecorations } from './components/BackgroundDecorations';
import { DashboardView } from './components/DashboardView';
import { StoryJourney } from './components/StoryJourney';
import { WishGenerator } from './components/tools/WishGenerator';
import { BirthdayMessageCard } from './components/tools/BirthdayMessageCard';
import { BirthdaySurprise } from './components/tools/BirthdaySurprise';
import { MemoryGallery } from './components/tools/MemoryGallery';
import { FinalBirthdayPage } from './components/tools/FinalBirthdayPage';
import { PersonalizeModal } from './components/PersonalizeModal';
import { TabType, BirthdaySettings, Memory } from './types';
import { INITIAL_MEMORIES } from './data/birthdayData';
import { toggleBirthdayMusic, stopBirthdayMusic, isMusicActive } from './utils/audio';

const STORAGE_KEY_SETTINGS = 'wishly_khushi_settings_v4';
const STORAGE_KEY_MEMORIES = 'wishly_khushi_memories_v4';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState<boolean>(false);

  // Settings state
  const [settings, setSettings] = useState<BirthdaySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      friendName: 'Khushi Kumari',
      senderName: 'Your Best Friend',
      birthdayDate: new Date().toISOString().split('T')[0],
      customLetterPage1: '',
      customLetterPage2: '',
      musicEnabled: false,
    };
  });

  // Memories state
  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEMORIES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MEMORIES;
  });

  // Save settings on update
  const handleUpdateSettings = (newSettings: BirthdaySettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
    } catch {}
  };

  // Memory handlers
  const handleAddMemory = (newMemory: Memory) => {
    const updated = [newMemory, ...memories];
    setMemories(updated);
    try {
      localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    try {
      localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(updated));
    } catch {}
  };

  const handleToggleMusic = () => {
    toggleBirthdayMusic((playing) => {
      setIsMusicPlaying(playing);
    });
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopBirthdayMusic();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF5F7] font-sans-warm text-slate-800 relative selection:bg-rose-200 selection:text-rose-900 flex flex-col">
      {/* Background Animated Atmosphere */}
      <BackgroundDecorations />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 flex items-center justify-center"
          >
            <PasscodeScreen
              onUnlock={() => setIsUnlocked(true)}
              friendName={settings.friendName}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full flex-1 flex flex-col"
          >
            {/* Top Navigation */}
            <Navbar
              currentTab={currentTab}
              onSelectTab={(tab) => setCurrentTab(tab)}
              friendName={settings.friendName}
              isMusicPlaying={isMusicPlaying}
              onToggleMusic={handleToggleMusic}
              onOpenPersonalize={() => setIsPersonalizeOpen(true)}
            />

            {/* Main Tab Content */}
            <main className="flex-1 w-full relative z-10">
              <AnimatePresence mode="wait">
                {currentTab === 'dashboard' && (
                  <motion.div
                    key="tab-dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DashboardView
                      settings={settings}
                      onSelectTab={(tab) => setCurrentTab(tab)}
                      onOpenPersonalize={() => setIsPersonalizeOpen(true)}
                    />
                  </motion.div>
                )}

                {currentTab === 'story' && (
                  <motion.div
                    key="tab-story"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StoryJourney
                      settings={settings}
                      memories={memories}
                      onFinishJourney={() => setCurrentTab('dashboard')}
                      onGoToTab={(tab) => setCurrentTab(tab)}
                    />
                  </motion.div>
                )}

                {currentTab === 'wishes' && (
                  <motion.div
                    key="tab-wishes"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <WishGenerator friendName={settings.friendName} />
                  </motion.div>
                )}

                {currentTab === 'message' && (
                  <motion.div
                    key="tab-message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BirthdayMessageCard
                      settings={settings}
                      onUpdateSettings={handleUpdateSettings}
                    />
                  </motion.div>
                )}

                {currentTab === 'surprise' && (
                  <motion.div
                    key="tab-surprise"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BirthdaySurprise friendName={settings.friendName} />
                  </motion.div>
                )}

                {currentTab === 'memories' && (
                  <motion.div
                    key="tab-memories"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MemoryGallery
                      memories={memories}
                      onAddMemory={handleAddMemory}
                      onDeleteMemory={handleDeleteMemory}
                      friendName={settings.friendName}
                    />
                  </motion.div>
                )}

                {currentTab === 'finale' && (
                  <motion.div
                    key="tab-finale"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FinalBirthdayPage
                      settings={settings}
                      onReplayStory={() => setCurrentTab('story')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personalization Modal */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        settings={settings}
        onSave={handleUpdateSettings}
      />
    </div>
  );
}
