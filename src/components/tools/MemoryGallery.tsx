import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image as ImageIcon,
  Heart,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Upload,
  LayoutGrid,
  Maximize2,
  X,
} from 'lucide-react';
import { Memory } from '../../types';
import { playKeyTapSound, playUnlockSuccessSound } from '../../utils/audio';
import { triggerHeartBurst } from '../../utils/confetti';

interface MemoryGalleryProps {
  memories: Memory[];
  onAddMemory: (newMemory: Memory) => void;
  onDeleteMemory: (id: string) => void;
  friendName: string;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  friendName,
}) => {
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Memory | null>(null);
  const [viewMode, setViewMode] = useState<'polaroid' | 'grid'>('polaroid');

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLike = (id: string, currentLikes: number) => {
    playKeyTapSound(700);
    triggerHeartBurst(0.5, 0.5);
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? currentLikes) + 1,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const memory: Memory = {
      id: `m-custom-${Date.now()}`,
      title: newTitle.trim(),
      caption: newCaption.trim() || 'A sweet moment together.',
      date: newDate.trim() || 'Today',
      imageUrl:
        newImagePreview ||
        '/memories/our_beautiful_friendship.svg',
      likes: 1,
    };

    onAddMemory(memory);
    setNewTitle('');
    setNewCaption('');
    setNewDate('');
    setNewImagePreview(null);
    setShowAddModal(false);
    playUnlockSuccessSound();
    triggerHeartBurst(0.5, 0.5);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative z-10 pb-28">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          Birthday Tool #4
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-elegant text-slate-800 mt-2 mb-2">
          Sweet Memory Vault
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-sans-warm">
          A timeless collection of our favorite smiles, laughs, and moments together.
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-200 hover:shadow-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Memory</span>
          </button>

          <div className="inline-flex p-1 bg-white rounded-full border border-rose-200 shadow-sm">
            <button
              onClick={() => setViewMode('polaroid')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'polaroid'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-rose-500'
              }`}
            >
              Polaroid Style
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-rose-500'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Render */}
      {viewMode === 'polaroid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory, index) => {
            const likes = likesMap[memory.id] ?? memory.likes;
            const rotationDegree = index % 3 === 0 ? -1.5 : index % 3 === 1 ? 1 : 2;

            return (
              <motion.div
                key={memory.id}
                whileHover={{ y: -6, rotate: 0 }}
                style={{ transform: `rotate(${rotationDegree}deg)` }}
                className="bg-white p-4 pb-6 rounded-3xl shadow-xl shadow-rose-200/40 border border-rose-100 flex flex-col transition-all group relative"
              >
                {/* Photo frame */}
                <div
                  onClick={() => setSelectedPhoto(memory)}
                  className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-rose-50 relative cursor-pointer"
                >
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <Maximize2 className="w-3 h-3 text-rose-500" />
                      View Large
                    </span>
                  </div>
                </div>

                {/* Polaroid Text & Info */}
                <div className="pt-4 px-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-script text-2xl text-slate-800 font-bold">
                      {memory.caption || memory.title}
                    </h3>
                    {memory.date && (
                      <span className="text-[10px] text-rose-400 font-semibold bg-rose-50 px-2 py-0.5 rounded-full">
                        {memory.date}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-sans-warm line-clamp-2 leading-relaxed">
                    {memory.description || memory.caption}
                  </p>

                  {/* Actions: Like button + Delete if custom */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-rose-50">
                    <button
                      onClick={() => handleLike(memory.id, memory.likes)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-transform active:scale-125"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>{likes}</span>
                    </button>

                    {memory.id.startsWith('m-custom-') && (
                      <button
                        onClick={() => onDeleteMemory(memory.id)}
                        className="text-slate-300 hover:text-rose-500 p-1"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Modern Compact Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {memories.map((memory) => {
            const likes = likesMap[memory.id] ?? memory.likes;
            return (
              <div
                key={memory.id}
                onClick={() => setSelectedPhoto(memory)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-rose-100 shadow-md cursor-pointer"
              >
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                  <p className="font-script text-lg font-bold">{memory.caption || memory.title}</p>
                  <p className="text-[10px] text-rose-200 truncate">{memory.description || memory.caption}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Memory Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
                <h3 className="text-lg font-serif-elegant font-bold text-slate-800">
                  Add Personal Photo Memory
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 rounded-full bg-rose-50 text-slate-500 hover:bg-rose-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                {/* Image upload drop zone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Upload Photo
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-36 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 hover:bg-rose-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative transition-colors"
                  >
                    {newImagePreview ? (
                      <img
                        src={newImagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-center p-4">
                        <Upload className="w-6 h-6 text-rose-400 mb-1.5" />
                        <span className="text-xs font-semibold text-rose-600">
                          Click to select a photo from your device
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          PNG, JPG, WebP supported
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Memory Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. That Unforgettable Beach Walk"
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Date / Occasion
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Last Summer, That Rainy Tuesday..."
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Caption / Story
                  </label>
                  <textarea
                    rows={3}
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Write a sweet note about this moment..."
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400/30 resize-none"
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
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white text-xs font-semibold shadow-md shadow-rose-200 hover:shadow-lg"
                  >
                    Save Memory
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xl bg-white rounded-3xl p-4 shadow-2xl border border-rose-100 relative"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-4">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="px-2 pb-2 text-center">
                <h3 className="font-script text-3xl text-rose-600 font-bold mb-1">
                  {selectedPhoto.caption || selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-sans-warm mb-3">
                  {selectedPhoto.description || selectedPhoto.caption}
                </p>
                {selectedPhoto.date && (
                  <span className="text-[11px] text-rose-400 font-medium bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                    {selectedPhoto.date}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
