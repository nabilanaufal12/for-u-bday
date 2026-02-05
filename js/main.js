// --- 1. LOGIN & MUSIC CONTROL ---
const bgMusic = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-control");
let isPlaying = false;

function checkPassword() {
  const input = document.getElementById("pass-input").value;
  const errorMsg = document.getElementById("error-msg");
  const overlay = document.getElementById("login-overlay");

  // Password (DDMMYYYY)
  const correctPassword = "13022006";

  if (input === correctPassword) {
    // 1. Efek Warp (Hyperspace)
    overlay.classList.add("warp-effect");

    // 2. Mainkan Musik
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
        musicBtn.innerHTML = "🔊 Pause Music";
        musicBtn.classList.remove("hidden");
      })
      .catch(console.error);

    // 3. Tunggu animasi selesai (1.5 detik), lalu masuk
    setTimeout(() => {
      overlay.style.display = "none";

      // === AUTO SCROLL KE SECTION 1 (HERO) ===
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        // Scroll halus ke atas
        heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Mulai animasi teks Hero
      const heroTitle = document.querySelector(".hero-content h1");
      if (heroTitle) heroTitle.style.animationPlayState = "running";
    }, 1500);
  } else {
    // Jika Salah Password
    errorMsg.classList.remove("hidden");
    input.value = "";
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

// --- 2. DRAG & DROP LOGIC ---
function makeDraggable(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  element.onmousedown = dragMouseDown;
  element.ontouchstart = dragMouseDown; // Support Touch

  function dragMouseDown(e) {
    e = e || window.event;

    // PENTING: Mencegah scroll layar saat menyentuh objek draggable
    if (e.type === "touchstart") {
      // Jangan gunakan preventDefault di sini agar klik/tap tetap jalan
      // tapi kita atur touch-action di CSS (lihat poin tambahan di bawah)
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
    } else {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
    }

    element.style.zIndex = 1000;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    document.ontouchend = closeDragElement;
    document.ontouchmove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;

    // PENTING: Prevent default saat MOVE agar layar tidak ikut scroll
    if (e.type === "touchmove") {
      e.preventDefault(); // INI KUNCINYA AGAR LAYAR TIDAK GERAK
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    pos1 = pos3 - clientX;
    pos2 = pos4 - clientY;
    pos3 = clientX;
    pos4 = clientY;

    element.style.top = element.offsetTop - pos2 + "px";
    element.style.left = element.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }
}

// Inisialisasi Draggable
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

// Sparkle Effect
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

// Tilt & Scroll Progress
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
  const phoneNumber = "628xxxxxxxxxx"; // Ganti dengan nomor WA kamu
  const message =
    "Makasih ya websitenya bagus banget! Ini pap reaksiku hehe ✨";
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  setTimeout(() => window.open(waUrl, "_blank"), 1000);
}

// --- 5. MAGIC CURSOR ---
const cursor = document.createElement("div");
cursor.id = "cursor";
document.body.appendChild(cursor);

const cursorBlur = document.createElement("div");
cursorBlur.id = "cursor-blur";
document.body.appendChild(cursorBlur);

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
  cursorBlur.style.left = e.clientX + "px";
  cursorBlur.style.top = e.clientY + "px";
});

const clickables = document.querySelectorAll("a, button, .polaroid, #envelope");
clickables.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursor.style.backgroundColor = "rgba(197, 160, 89, 0.2)";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursor.style.backgroundColor = "transparent";
  });
});

// --- 6. FLOATING HEARTS ANIMATION ---
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("floating-heart");
  heart.innerHTML = "❤";
  heart.style.left = Math.random() * 100 + "vw";

  const size = Math.random() * 20 + 10;
  heart.style.fontSize = size + "px";
  heart.style.animationDuration = Math.random() * 5 + 10 + "s";

  document.body.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 15000);
}
setInterval(createHeart, 500);

// --- 7. ENHANCED SCROLL REVEAL ---
const revealElements = document.querySelectorAll(".fade-in");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.style.transform = "translateY(0) scale(1)";
      }
    });
  },
  { threshold: 0.15 },
);

revealElements.forEach((el) => {
  el.style.transition = "all 1s cubic-bezier(0.5, 0, 0, 1)";
  el.style.transform = "translateY(50px) scale(0.95)";
  revealObserver.observe(el);
});

// --- 8. MAGNETIC BUTTON EFFECT (Desktop Only) ---
if (window.innerWidth > 992) {
  const magnets = document.querySelectorAll(
    ".btn, .login-box button, #music-control",
  );

  magnets.forEach((magnet) => {
    magnet.addEventListener("mousemove", function (e) {
      const position = magnet.getBoundingClientRect();
      const x = e.pageX - position.left - position.width / 2;
      const y = e.pageY - position.top - position.height / 2;

      // Elemen bergerak sedikit mengikuti mouse (Magnetic)
      magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px) scale(1.1)`;
      // Kursor (lingkaran kuning) juga membesar
      const cursor = document.getElementById("cursor");
      if (cursor) {
        cursor.style.transform = "translate(-50%, -50%) scale(2)";
        cursor.style.background = "transparent";
        cursor.style.border = "1px solid #ffd700";
      }
    });

    magnet.addEventListener("mouseleave", function (e) {
      magnet.style.transform = "translate(0px, 0px) scale(1)";
      magnet.style.transition = "all 0.3s ease";

      const cursor = document.getElementById("cursor");
      if (cursor) {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.background = "transparent"; // Kembalikan ke style awal
      }

      setTimeout(() => {
        magnet.style.transition = ""; // Hapus transisi agar mousemove responsif lagi
      }, 300);
    });
  });
}
