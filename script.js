// --- 1. MUSIC CONTROL ---
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-control');
let isPlaying = false;

// Fungsi play music otomatis saat ada interaksi pertama
function startMusic() {
    bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.remove('hidden');
        musicBtn.innerHTML = "🔊 Pause Music";
    }).catch(err => {
        console.log("Autoplay blocked");
        // Tampilkan tombol agar user bisa klik manual
        musicBtn.classList.remove('hidden');
        musicBtn.innerHTML = "🔇 Play Music";
    });
}

// Event listener untuk memancing autoplay di browser
document.body.addEventListener('click', () => { if(!isPlaying) startMusic(); }, { once: true });
document.body.addEventListener('scroll', () => { if(!isPlaying) startMusic(); }, { once: true });

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

// --- 2. SCROLL ANIMATION ---
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// --- 3. TYPEWRITER EFFECT (FIXED EMOJI) ---
const textElement = document.getElementById('typing-text');

// Isi surat yang sudah diperbaiki (Emoji aman)
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

// --- 4. OPEN LETTER FUNCTION (FIXED) ---
function openEnvelope() {
    const envelope = document.getElementById('envelope');
    const instruction = document.getElementById('instruction-text');
    const closingQuote = document.getElementById('closing-quote');
    const letter = document.querySelector('.letter');

    // Jika belum terbuka, buka animasi
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        
        // Hilangkan instruksi
        if(instruction) instruction.style.opacity = '0';
        
        // Mulai ngetik setelah surat keluar (delay 0.6s)
        setTimeout(() => {
            typeWriter();
            if(closingQuote) closingQuote.classList.remove('hidden');
            
            // Jadikan surat bisa digeser
            makeDraggable(letter);
        }, 800);
    }
}

// --- DRAG & DROP LOGIC (UNIVERSAL: Amplop + Surat + Polaroid) ---
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.onmousedown = dragMouseDown;
    element.ontouchstart = dragMouseDown; // Support HP

    function dragMouseDown(e) {
        // Stop bubbling biar klik amplop gak nutup surat (opsional)
        // e.stopPropagation(); 
        
        e = e || window.event;
        // e.preventDefault(); // Jangan prevent default biar bisa scroll halaman lain kalau ga pas di elemen

        if (e.type === 'touchstart') {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        } else {
            pos3 = e.clientX;
            pos4 = e.clientY;
        }
        
        // Angkat elemen ke paling atas saat dipegang
        element.style.zIndex = 200; 
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        
        // Event HP
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault(); // Penting biar ga scroll layar pas nge-drag objek

        let clientX, clientY;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Hitung posisi baru
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;

        // Set posisi
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

// Inisialisasi Draggable
// 1. Amplop (Bisa digeser dari awal)
const envelopeElement = document.getElementById('envelope');
if(envelopeElement) makeDraggable(envelopeElement);

// 2. Polaroid (Bisa digeser dari awal)
document.querySelectorAll('.draggable').forEach(polaroid => {
    makeDraggable(polaroid);
});

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
    
    // GANTI NOMOR WA KAMU DI SINI
    const phoneNumber = "628xxxxxxxxxx"; 
    const message = "Bg Nabil, makasih ya websitenya bagus banget! Ini pap reaksiku hehe ✨";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    setTimeout(() => window.open(waUrl, '_blank'), 1000);
}

// --- 7. CURSOR SPARKLE ---
const sparkleColor = "#c5a059"; 
function createSparkle(x, y) {
    const el = document.createElement("div");
    el.classList.add("sparkle");
    el.style.left = x + "px";
    el.style.top = y + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}
document.addEventListener("mousemove", (e) => {
    if (Math.random() < 0.2) createSparkle(e.clientX, e.clientY + window.scrollY);
});
document.addEventListener("touchmove", (e) => {
    if (Math.random() < 0.2) {
        const touch = e.touches[0];
        createSparkle(touch.clientX, touch.clientY + window.scrollY);
    }
});

// --- 8. TILT ---
VanillaTilt.init(document.querySelectorAll(".collage-item img, .polaroid"), {
    max: 15, speed: 400, glare: true, "max-glare": 0.5,
});

// --- LOGIC AMPLOP & SURAT ---
function openEnvelope() {
    const envelope = document.getElementById('envelope');
    const instruction = document.getElementById('instruction-text');
    const quote = document.getElementById('closing-quote');
    const letter = document.querySelector('.letter');

    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        instruction.style.opacity = '0'; // Sembunyikan instruksi
        
        // Mulai ngetik
        setTimeout(() => {
            typeWriter();
            quote.classList.remove('hidden');
            
            // Jadikan surat bisa digeser setelah keluar
            makeDraggable(letter);
        }, 1000);
    }
}

// --- LOGIC DRAG & DROP (UNIVERSAL: HP & LAPTOP) ---
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.onmousedown = dragMouseDown;
    element.ontouchstart = dragMouseDown; // Support HP

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        
        // Dapatkan posisi kursor awal
        if (e.type === 'touchstart') {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        } else {
            pos3 = e.clientX;
            pos4 = e.clientY;
        }
        
        // Angkat elemen ke paling atas saat di-klik
        element.style.zIndex = 100;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        
        // Event HP
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // e.preventDefault(); // Jangan prevent default di touchmove biar ga nge-freeze scroll halaman lain

        let clientX, clientY;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Hitung posisi baru
        pos1 = pos3 - clientX;
        pos2 = pos4 - clientY;
        pos3 = clientX;
        pos4 = clientY;

        // Set posisi elemen
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Stop moving
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
        
        // Kembalikan z-index normal (opsional, biar tumpukan tetap natural)
        // element.style.zIndex = ""; 
    }
}

// Aktifkan Drag untuk semua Polaroid
document.querySelectorAll('.draggable').forEach(polaroid => {
    makeDraggable(polaroid);
});

// --- 9. SCROLL BAR ---
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
};