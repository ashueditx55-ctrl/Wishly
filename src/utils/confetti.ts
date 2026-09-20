import confetti from 'canvas-confetti';

export function triggerBirthdayConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#f472b6', '#ec4899', '#fb7185', '#fda4af', '#fdf2f8', '#ffd1dc', '#ffffff'],
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function triggerHeartBurst(originX = 0.5, originY = 0.5) {
  confetti({
    particleCount: 40,
    spread: 70,
    origin: { x: originX, y: originY },
    colors: ['#fb7185', '#f43f5e', '#ec4899', '#ffccd5'],
    shapes: ['circle'],
    scalar: 1.2,
    zIndex: 9999,
  });
}

export function triggerStarSparkle() {
  confetti({
    particleCount: 50,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#f472b6', '#fbcfe8', '#fed7aa', '#ffffff'],
    shapes: ['star'],
    scalar: 0.9,
    zIndex: 9999,
  });
}
