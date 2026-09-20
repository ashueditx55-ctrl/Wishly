import React, { useMemo } from 'react';

export const BackgroundDecorations: React.FC = () => {
  // Generate stable random particles
  const floatingHearts = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.2) + 2}%`,
      delay: `${(i * 0.7) % 5}s`,
      duration: `${6 + (i % 4) * 2}s`,
      size: 12 + (i % 3) * 6,
      opacity: 0.25 + (i % 3) * 0.15,
      type: i % 3 === 0 ? '❤️' : i % 3 === 1 ? '✨' : '🌸',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Soft pink ambient gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-rose-100/60 blur-3xl" />

      {/* Top Birthday Bunting Garland (exact match from video) */}
      <div className="absolute top-0 left-0 right-0 h-16 flex justify-between px-2 overflow-hidden opacity-85">
        <svg className="w-full h-12" viewBox="0 0 1000 60" preserveAspectRatio="none" fill="none">
          {/* Swag string */}
          <path
            d="M0,8 Q250,30 500,8 Q750,30 1000,8"
            stroke="#f472b6"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          {/* Hanging Pennants */}
          {[
            { x: 30, color: '#f43f5e' },
            { x: 90, color: '#ec4899' },
            { x: 150, color: '#fb7185' },
            { x: 210, color: '#fda4af' },
            { x: 270, color: '#f43f5e' },
            { x: 330, color: '#ec4899' },
            { x: 390, color: '#fb7185' },
            { x: 450, color: '#fda4af' },
            { x: 510, color: '#f43f5e' },
            { x: 570, color: '#ec4899' },
            { x: 630, color: '#fb7185' },
            { x: 690, color: '#fda4af' },
            { x: 750, color: '#f43f5e' },
            { x: 810, color: '#ec4899' },
            { x: 870, color: '#fb7185' },
            { x: 930, color: '#fda4af' },
          ].map((flag, idx) => (
            <polygon
              key={idx}
              points={`${flag.x - 12},10 ${flag.x + 12},10 ${flag.x},38`}
              fill={flag.color}
              opacity="0.65"
            />
          ))}
        </svg>
      </div>

      {/* Floating gentle particles */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute"
          style={{
            left: heart.left,
            bottom: '-20px',
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            animation: `floatUp ${heart.duration} linear infinite`,
            animationDelay: heart.delay,
          }}
        >
          {heart.type}
        </div>
      ))}

      {/* Bottom cloud silhouettes (from video footer) */}
      <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-pink-100/50 to-transparent flex items-end justify-around opacity-70">
        <span className="text-2xl opacity-40 transform translate-y-2">☁️</span>
        <span className="text-3xl opacity-50 transform translate-y-1">☁️</span>
        <span className="text-2xl opacity-40 transform translate-y-2">☁️</span>
        <span className="text-4xl opacity-60">☁️</span>
        <span className="text-3xl opacity-50 transform translate-y-1">☁️</span>
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-105vh) rotate(35deg) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
