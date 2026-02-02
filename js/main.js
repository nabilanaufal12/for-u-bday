// --- 1. LOGIN & MUSIC CONTROL ---
const bgMusic = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-control");
let isPlaying = false;

function checkPassword() {
  const input = document.getElementById("pass-input").value;
  const errorMsg = document.getElementById("error-msg");
  const overlay = document.getElementById("login-overlay");
  const correctPassword = "13022006"; // Sesuaikan tanggal lahir

  if (input === correctPassword) {
    // 1. Tambahkan efek WARP
    overlay.classList.add("warp-effect");

    // 2. Play Music
    bgMusic.play()
      .then(() => {
        isPlaying = true;
        musicBtn.innerHTML = "🔊 Pause Music";
        musicBtn.classList.remove("hidden");
      })
      .catch(console.error);

    // 3. Hapus overlay setelah animasi selesai
    setTimeout(() => {
      overlay.style.display = "none";
      // Trigger animasi masuk elemen Hero
      document.querySelector('.hero-content h1').style.animationPlayState = 'running';
    }, 1500); // Sesuai durasi CSS transition
    
  } else {
    errorMsg.classList.remove("hidden");
    input.value = "";
    // Animasi Shake
    const box = document.querySelector(".login-box");
    box.style.animation = "shake 0.5s";
    setTimeout(() => (box.style.animation = ""), 500);
  }
}

function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    musicBtn.innerHTML = "🔇 Play Music";
  } else {
    bgMusic.play();
    musicBtn.innerHTML = "🔊 Pause Music";
  }
  isPlaying = !isPlaying;
}

// --- 2. DRAG & DROP LOGIC (FIXED) ---
function makeDraggable(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  element.onmousedown = dragMouseDown;
  element.ontouchstart = dragMouseDown; // Support Touch

  function dragMouseDown(e) {
    e = e || window.event;

    // Jangan prevent default di sini agar user masih bisa scroll jika tidak sedang drag
    // Tapi kita butuh coordinate
    if (e.type === "touchstart") {
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
    } else {
      e.preventDefault(); // Mouse usually needs preventDefault to stop text selection
      pos3 = e.clientX;
      pos4 = e.clientY;
    }

    // Naikkan z-index saat dipegang
    element.style.zIndex = 1000;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;

    // Event Touch
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;

    // Hanya prevent default saat bergerak (dragging)
    // Ini mencegah layar ikut scroll saat kita geser foto
    if (e.cancelable) e.preventDefault();

    let clientX, clientY;
    if (e.type === "touchmove") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Hitung pergeseran
    pos1 = pos3 - clientX;
    pos2 = pos4 - clientY;
    pos3 = clientX;
    pos4 = clientY;

    // Set posisi baru
    element.style.top = element.offsetTop - pos2 + "px";
    element.style.left = element.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
    // element.style.zIndex = ""; // Biarkan z-index tinggi atau reset jika mau
  }
}

// Inisialisasi Draggable (Amplop & Polaroid)
window.onload = function () {
  const envelope = document.getElementById("envelope");
  if (envelope) makeDraggable(envelope);

  const polaroids = document.querySelectorAll(".draggable");
  polaroids.forEach((p) => makeDraggable(p));
};

// --- 3. TYPEWRITER & ENVELOPE ---
const textElement = document.getElementById("typing-text");
const textContent = `Assalamu'alaikum, Ratu. ✨
Barakallahu fii umrik! Happy 20th Birthday!

Di umur yang baru ini, aku cuma mau berdoa semoga kamu selalu diberi kesehatan, dilancarkan kuliah Pendidikan Matematikanya, dan makin bersinar sebagai Duta Kampus UMRAH.

Semoga apa pun yang lagi Ratu hadapi sekarang diberi kemudahan, hati tetap tenang, dan selalu dikuatkan buat terus melangkah walau kadang capek tugas numpuk, hehe.

Tetap jadi diri Ratu yang ku kenal yaps. Aku akan selalu jadi supporter kamu dari sini. Semoge semua doa baik berbalik ke kamu yaa. Aamiin 🤲`;

let charIndex = 0;
function typeWriter() {
  if (charIndex < textContent.length) {
    if (textContent.charAt(charIndex) === "\n") {
      textElement.innerHTML += "<br>";
    } else {
      textElement.innerHTML += textContent.charAt(charIndex);
    }
    charIndex++;
    setTimeout(typeWriter, 40);
  }
}

function openEnvelope() {
  const envelope = document.getElementById("envelope");
  const instruction = document.getElementById("instruction-text");
  const quote = document.getElementById("closing-quote");
  const letter = document.querySelector(".letter");

  if (!envelope.classList.contains("open")) {
    envelope.classList.add("open");
    if (instruction) instruction.style.opacity = "0";

    setTimeout(() => {
      typeWriter();
      if (quote) quote.classList.remove("hidden");
      // Jadikan surat draggable setelah keluar
      makeDraggable(letter);
    }, 800);
  }
}

// --- 4. ANIMASI LAINNYA ---
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.2 },
);
document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// Confetti
const wishSection = document.getElementById("wish");
if (wishSection) {
  const confettiObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        var end = Date.now() + 3 * 1000;
        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
        confettiObserver.unobserve(entry.target);
      }
    });
  });
  confettiObserver.observe(wishSection);
}

// Sparkle
function createSparkle(x, y) {
  const el = document.createElement("div");
  el.classList.add("sparkle");
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
document.addEventListener("mousemove", (e) => {
  if (Math.random() < 0.1) createSparkle(e.clientX, e.clientY + window.scrollY);
});
document.addEventListener("touchmove", (e) => {
  if (Math.random() < 0.1)
    createSparkle(e.touches[0].clientX, e.touches[0].clientY + window.scrollY);
});

// Tilt & Scroll
if (typeof VanillaTilt !== "undefined") {
  VanillaTilt.init(document.querySelectorAll(".collage-item img, .polaroid"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
  });
}
window.onscroll = function () {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
};

// Camera Logic
const video = document.getElementById("webcam");
const canvas = document.getElementById("photo-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const btnStart = document.getElementById("btn-start-cam");
const btnSnap = document.getElementById("btn-snap");
const btnSend = document.getElementById("btn-send");
const btnRetake = document.getElementById("btn-retake");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    btnStart.classList.add("hidden");
    btnSnap.classList.remove("hidden");
  } catch (err) {
    alert("Gagal akses kamera: " + err);
  }
}
function takePicture() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  video.classList.add("hidden");
  canvas.classList.remove("hidden");
  btnSnap.classList.add("hidden");
  btnSend.classList.remove("hidden");
  btnRetake.classList.remove("hidden");
}
function retake() {
  video.classList.remove("hidden");
  canvas.classList.add("hidden");
  btnSnap.classList.remove("hidden");
  btnSend.classList.add("hidden");
  btnRetake.classList.add("hidden");
}
function sendToWA() {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "Reaction-Birthday.png";
  link.click();
  const phoneNumber = "628xxxxxxxxxx";
  const message =
    "Makasih ya websitenya bagus banget! Ini pap reaksiku hehe ✨";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  setTimeout(() => window.open(waUrl, "_blank"), 1000);
}

/* --- TAMBAHAN DI BAGIAN BAWAH FILE --- */

// 5. MAGIC CURSOR
const cursor = document.createElement('div');
cursor.id = 'cursor';
document.body.appendChild(cursor);

const cursorBlur = document.createElement('div');
cursorBlur.id = 'cursor-blur';
document.body.appendChild(cursorBlur);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  
  // Efek delay sedikit pada blur agar smooth
  cursorBlur.style.left = e.clientX + 'px';
  cursorBlur.style.top = e.clientY + 'px';
});

// Hover effect pada elemen clickable (tombol/link)
const clickables = document.querySelectorAll('a, button, .polaroid, #envelope');
clickables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    cursor.style.backgroundColor = 'rgba(197, 160, 89, 0.2)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.backgroundColor = 'transparent';
  });
});

// 6. FLOATING HEARTS ANIMATION
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('floating-heart');
  heart.innerHTML = '❤';
  
  // Posisi Random
  heart.style.left = Math.random() * 100 + 'vw';
  
  // Ukuran Random
  const size = Math.random() * 20 + 10; 
  heart.style.fontSize = size + 'px';
  
  // Durasi Random
  heart.style.animationDuration = Math.random() * 5 + 10 + 's';
  
  document.body.appendChild(heart);
  
  // Hapus setelah animasi selesai
  setTimeout(() => {
    heart.remove();
  }, 15000);
}

// Munculkan hati setiap 300ms
setInterval(createHeart, 500);

// 7. ENHANCED SCROLL REVEAL (Lebih smooth)
const revealElements = document.querySelectorAll('.fade-in');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Tambahkan efek sedikit scale up saat muncul
      entry.target.style.transform = 'translateY(0) scale(1)';
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => {
  el.style.transition = 'all 1s cubic-bezier(0.5, 0, 0, 1)';
  el.style.transform = 'translateY(50px) scale(0.95)'; // Posisi awal
  revealObserver.observe(el);
});