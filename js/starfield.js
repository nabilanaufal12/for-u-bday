// --- STARFIELD ANIMATION ---
const canvasStar = document.getElementById("starfield");
const ctxStar = canvasStar.getContext("2d");

let width, height, stars;

function initStars() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvasStar.width = width;
  canvasStar.height = height;

  stars = [];
  // Jumlah bintang disesuaikan ukuran layar (Desktop lebih banyak)
  const numStars = width > 768 ? 400 : 100; 

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2,
      opacity: Math.random(),
      speed: Math.random() * 0.5 + 0.1
    });
  }
}

function animateStars() {
  ctxStar.clearRect(0, 0, width, height);
  
  // Efek Nebula/Glow tipis (Opsional)
  // ctxStar.fillStyle = "rgba(20, 30, 50, 0.3)";
  // ctxStar.fillRect(0, 0, width, height);

  stars.forEach(star => {
    ctxStar.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctxStar.beginPath();
    ctxStar.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctxStar.fill();

    // Gerakan ke atas pelan (seperti terbang menembus ruang angkasa)
    star.y -= star.speed;
    
    // Reset jika keluar layar
    if (star.y < 0) {
      star.y = height;
      star.x = Math.random() * width;
    }
  });
  
  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", initStars);
initStars();
animateStars();