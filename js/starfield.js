// --- STARFIELD ANIMATION (OPTIMIZED FOR MOBILE) ---
const canvasStar = document.getElementById("starfield");
const ctxStar = canvasStar.getContext("2d");

let width, height, stars;
let isAnimating = true;

function initStars() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvasStar.width = width;
  canvasStar.height = height;

  stars = [];
  // Kurangi bintang untuk mobile (50 vs 200 desktop)
  const numStars = width > 768 ? 200 : 50;

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2,
      opacity: Math.random(),
      speed: Math.random() * 0.3 + 0.05, // Lebih lambat
    });
  }
}

function animateStars() {
  if (!isAnimating) {
    requestAnimationFrame(animateStars);
    return;
  }

  ctxStar.clearRect(0, 0, width, height);

  stars.forEach((star) => {
    ctxStar.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctxStar.beginPath();
    ctxStar.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctxStar.fill();

    star.y -= star.speed;

    if (star.y < 0) {
      star.y = height;
      star.x = Math.random() * width;
    }
  });

  requestAnimationFrame(animateStars);
}

// Pause saat tab tidak visible (hemat battery)
document.addEventListener("visibilitychange", () => {
  isAnimating = !document.hidden;
});

window.addEventListener("resize", initStars);
initStars();
animateStars();
