// --- 1. SETUP SCROLL ANIMATION (FADE IN) ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2 // Muncul saat 20% elemen terlihat
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach((element) => {
    observer.observe(element);
});

// --- 2. CAMERA & AUDIO LOGIC ---
const video = document.getElementById('webcam');
const canvas = document.getElementById('photo-canvas');
const ctx = canvas.getContext('2d');
const bgMusic = document.getElementById('bg-music');

const btnStart = document.getElementById('btn-start-cam');
const btnSnap = document.getElementById('btn-snap');
const btnSend = document.getElementById('btn-send');
const btnRetake = document.getElementById('btn-retake');

async function startCamera() {
    try {
        // Coba putar musik saat user interaksi pertama (klik tombol kamera)
        if(bgMusic) bgMusic.play().catch(e => console.log("Audio play failed req interaction"));

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        
        btnStart.classList.add('hidden');
        btnSnap.classList.remove('hidden');
    } catch (err) {
        alert("Gagal akses kamera. Pastikan izin diberikan! Error: " + err);
    }
}

function takePicture() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Efek Mirror
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    video.classList.add('hidden');
    canvas.classList.remove('hidden');
    btnSnap.classList.add('hidden');
    btnSend.classList.remove('hidden');
    btnRetake.classList.remove('hidden');
}

function retake() {
    video.classList.remove('hidden');
    canvas.classList.add('hidden');
    btnSnap.classList.remove('hidden');
    btnSend.classList.add('hidden');
    btnRetake.classList.add('hidden');
}

function sendToWA() {
    // 1. Download Gambar
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = image;
    link.download = "Reaction-Birthday.png";
    link.click();

    // 2. Kirim ke WA (GANTI NOMOR DI SINI)
    // Format nomor harus kode negara tanpa + (misal: 628123...)
    const phoneNumber = "628123456789"; 
    
    const message = "Sayang, website-nya bagus banget! Ini foto reaksiku hehe ❤️";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
        window.open(waUrl, '_blank');
    }, 1000);
}