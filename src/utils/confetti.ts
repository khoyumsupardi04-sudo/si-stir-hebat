import confetti from 'canvas-confetti';

export function fireAchievementConfetti() {
  confetti({
    particleCount: 65,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#4C1D95', '#EC4899', '#7DD3FC', '#C4B5FD', '#FBBF24'],
  });
}

export function fireStarCelebration(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 35,
    spread: 55,
    origin: { x, y },
    ticks: 180,
    gravity: 0.8,
    colors: ['#F59E0B', '#FBBF24', '#EC4899', '#4C1D95', '#38BDF8'],
    shapes: ['star', 'circle'],
  });
}
