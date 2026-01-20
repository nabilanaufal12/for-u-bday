// --- 1. EASTER EGG: PASSWORD CHECK ---
function checkPassword() {
    const input = document.getElementById('pass-input').value;
    const errorMsg = document.getElementById('error-msg');
    const overlay = document.getElementById('login-overlay');
    const musicBtn = document.getElementById('music-control');
    const bgMusic = document.getElementById('bg-music');

    // GANTI PASSWORD DI SINI (Format bebas, contoh tanggal)
    const correctPassword = "240226"; 

    if (input === correctPassword) {
        // Jika Benar:
        overlay.style.opacity = '0'; // Fade out overlay
        setTimeout(() => {
            overlay.style.display = 'none'; // Hilangkan overlay
        }, 1000);

        // Nyalakan Musik Otomatis
        bgMusic.play().then(() => {
            musicBtn.innerHTML = "🔊 Pause Music";
        }).catch(err => {
            console.log("Autoplay blocked, user must interact");
        });
        
        musicBtn.classList.remove('hidden'); // Munculkan tombol musik
        
    } else {
        // Jika Salah:
        errorMsg.classList.remove('hidden');
        input.value = ""; // Kosongkan input
    }
}

// --- 2. MUSIC CONTROL ---
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-control');
let isPlaying = true; // Asumsi sudah play setelah login

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

// --- 3. SCROLL ANIMATION (FADE IN) ---
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// --- 4. TYPEWRITER EFFECT (NGETIK SENDIRI) ---
const textElement = document.getElementById('typing-text');
const textContent = `Setiap pagi bangun, yang pertama muncul di kepala cuma kamu. Terima kasih sudah jadi alasan aku tersenyum setiap hari. Di umur yang baru ini, aku cuma mau bilang... "Kamu nggak perlu jadi sempurna buat dicintai. Just be you, that's enough." ❤️`;
let charIndex = 0;

function typeWriter() {
    if (charIndex < textContent.length) {
        textElement.innerHTML += textContent.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50); // Kecepatan ngetik
    }
}
// Trigger ngetik saat section message muncul
const messageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typeWriter();
            messageObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('#message').forEach(el => messageObserver.observe(el));

// --- 5. CONFETTI SURPRISE ---
const wishSection = document.getElementById('wish');
const confettiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Efek Confetti
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

// --- 6. CAMERA & WA LOGIC (SAMA SEPERTI SEBELUMNYA) ---
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
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1); // Mirror
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
    
    // GANTI NOMOR DI SINI
    const phoneNumber = "628123456789"; 
    const message = "Sayang, ini reaksiku! Bagus banget websitenya ❤️";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    setTimeout(() => window.open(waUrl, '_blank'), 1000);
}