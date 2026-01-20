// --- 1. EASTER EGG: PASSWORD CHECK ---
function checkPassword() {
    const input = document.getElementById('pass-input').value;
    const errorMsg = document.getElementById('error-msg');
    const overlay = document.getElementById('login-overlay');
    const musicBtn = document.getElementById('music-control');
    const bgMusic = document.getElementById('bg-music');

    // PASSWORD: TANGGAL LAHIR DIA (13-02-2006)
    const correctPassword = "13022006"; 

    if (input === correctPassword) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);

        bgMusic.play().then(() => {
            musicBtn.innerHTML = "🔊 Pause Music";
        }).catch(err => {
            console.log("Autoplay blocked");
        });
        
        musicBtn.classList.remove('hidden');
    } else {
        errorMsg.classList.remove('hidden');
        input.value = "";
    }
}

// --- 2. MUSIC CONTROL ---
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-control');
let isPlaying = true;

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

// --- 3. SCROLL ANIMATION ---
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// --- 4. TYPEWRITER EFFECT (SURAT SPECIAL) ---
// --- 4. OPEN LETTER & TYPEWRITER ---
function openLetter() {
    const envelope = document.getElementById('envelope-letter');
    const instruction = document.querySelector('.instruction-click');
    const closingQuote = document.getElementById('closing-quote');
    
    // Cek kalau amplop belum dibuka
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        instruction.style.display = 'none'; // Hilangkan teks instruksi
        
        // Mulai ngetik setelah animasi amplop selesai (1.5 detik)
        setTimeout(() => {
            typeWriter();
            closingQuote.classList.remove('hidden');
        }, 1500);
    }
}

const textElement = document.getElementById('typing-text');

// ISI SURAT UNTUK CRUSH (WARM & SUPPORTIVE)
const textContent = `Assalamu'alaikum, Ratu. ✨
Barakallahu fii umrik! Happy 20th Birthday!

Di umur yang baru ini, aku cuma mau berdoa semoga kamu selalu diberi kesehatan, dilancarkan kuliah Pendidikan Matematikanya, dan makin bersinar sebagai Duta Kampus UMRAH.

Semoga apa pun yang lagi Ratu hadapi sekarang diberi kemudahan, hati tetap tenang, dan selalu dikuatkan buat terus melangkah walau kadang capek tugas numpuk, hehe.

Tetap jadi diri Ratu yang ku kenal yaps. Aku akan selalu jadi supporter kamu dari sini. Semoge semua doa baik berbalik ke kamu yaa. Aamiin 🤲`;

let charIndex = 0;

function typeWriter() {
    if (charIndex < textContent.length) {
        if (textContent.charAt(charIndex) === '\n') {
            textElement.innerHTML += '<br>';
        } else {
            textElement.innerHTML += textContent.charAt(charIndex);
        }
        charIndex++;
        setTimeout(typeWriter, 40);
    }
}

const messageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typeWriter();
            messageObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('#message').forEach(el => messageObserver.observe(el));

// --- 5. CONFETTI ---
const wishSection = document.getElementById('wish');
const confettiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            var duration = 3 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            function randomInRange(min, max) { return Math.random() * (max - min) + min; }
            var interval = setInterval(function() {
                var timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                var particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
            confettiObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
confettiObserver.observe(wishSection);

// --- 6. CAMERA & WA ---
const video = document.getElementById('webcam');
const canvas = document.getElementById('photo-canvas');
const ctx = canvas.getContext('2d');
const btnStart = document.getElementById('btn-start-cam');
const btnSnap = document.getElementById('btn-snap');
const btnSend = document.getElementById('btn-send');
const btnRetake = document.getElementById('btn-retake');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        btnStart.classList.add('hidden');
        btnSnap.classList.remove('hidden');
    } catch (err) { alert("Gagal akses kamera: " + err); }
}

function takePicture() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    video.classList.add('hidden'); canvas.classList.remove('hidden');
    btnSnap.classList.add('hidden'); btnSend.classList.remove('hidden'); btnRetake.classList.remove('hidden');
}

function retake() {
    video.classList.remove('hidden'); canvas.classList.add('hidden');
    btnSnap.classList.remove('hidden'); btnSend.classList.add('hidden'); btnRetake.classList.add('hidden');
}

function sendToWA() {
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image; link.download = "Reaction-Birthday.png"; link.click();
    
    // GANTI NOMOR DI SINI (Nomor WA Kamu)
    const phoneNumber = "628xxxxxxxxxx"; 
    const message = "Bg Nabil, makasih ya websitenya bagus banget! Ini pap reaksiku hehe ✨";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    setTimeout(() => window.open(waUrl, '_blank'), 1000);
}

// --- 7. CURSOR SPARKLE EFFECT ---
const sparkleColor = "#c5a059"; // Warna emas sesuai tema
let sparkles = [];

function createSparkle(x, y) {
    const el = document.createElement("div");
    el.classList.add("sparkle");
    el.style.left = x + "px";
    el.style.top = y + "px";
    document.body.appendChild(el);
    
    // Hapus sparkle setelah animasi selesai
    setTimeout(() => {
        el.remove();
    }, 1000);
}

document.addEventListener("mousemove", (e) => {
    // Buat sparkle cuma kadang-kadang biar gak berat (1 dari 5 frame)
    if (Math.random() < 0.2) {
        createSparkle(e.clientX, e.clientY + window.scrollY);
    }
});

// Support Touch (buat HP)
document.addEventListener("touchmove", (e) => {
    if (Math.random() < 0.2) {
        const touch = e.touches[0];
        createSparkle(touch.clientX, touch.clientY + window.scrollY);
    }
});

// --- 8. TILT EFFECT FOR CARDS ---
VanillaTilt.init(document.querySelectorAll(".collage-item img, .polaroid"), {
    max: 15, // Maksimal kemiringan
    speed: 400,
    glare: true, // Efek kilap kaca
    "max-glare": 0.5,
});

// --- 9. SCROLL PROGRESS BAR ---
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
};