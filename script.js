// --- KONFIGURASI ---
const videoElement = document.getElementsByClassName('input_video')[0];
const cursor = document.getElementById('virtual-cursor');
const envelope = document.getElementById('envelope');
const galleryTrack = document.getElementById('gallery-track');
const gallerySection = document.getElementById('gallery-section');

let isGalleryOpen = false;
let previousX = 0; // Untuk melacak gerakan kiri/kanan
let sensitivity = 2.5; // Kecepatan scroll

// --- 1. FUNGSI SETUP MEDIA PIPE ---
const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(onResults);

// --- 2. LOGIC UTAMA (LOOP SETIAP FRAME) ---
function onResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    
    // Titik penting: 8 = Telunjuk, 4 = Ibu Jari
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];

    // 1. Pindahkan Kursor Virtual
    // Kita flip koordinat X karena kamera itu seperti cermin
    const x = (1 - indexTip.x) * window.innerWidth;
    const y = indexTip.y * window.innerHeight;
    
    cursor.style.display = "block";
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    // 2. LOGIC HALAMAN INTRO (MENCUBIT)
    if (!isGalleryOpen) {
        checkPinchToOpen(x, y, indexTip, thumbTip);
    } 
    // 3. LOGIC HALAMAN GALERI (GESER)
    else {
        handleScrollGesture(indexTip.x);
    }
  } else {
    cursor.style.display = "none";
  }
}

// Fungsi Deteksi Cubitan (Pinch)
function checkPinchToOpen(cursorX, cursorY, index, thumb) {
    // Hitung jarak Euclidean antara telunjuk dan jempol
    const distance = Math.hypot(index.x - thumb.x, index.y - thumb.y);
    const pinchThreshold = 0.05; // Semakin kecil, semakin rapat cubitannya

    // Cek apakah kursor ada di area Amplop
    const rect = envelope.getBoundingClientRect();
    const isOverEnvelope = (cursorX > rect.left && cursorX < rect.right && 
                            cursorY > rect.top && cursorY < rect.bottom);

    // Jika di atas amplop DAN mencubit
    if (isOverEnvelope && distance < pinchThreshold) {
        openTheEnvelope();
    }
}

// Fungsi Animasi Buka Amplop
function openTheEnvelope() {
    envelope.style.animation = "openEnvelope 1s forwards";
    setTimeout(() => {
        document.getElementById('intro-section').classList.add('hidden');
        gallerySection.classList.remove('hidden');
        isGalleryOpen = true;
    }, 800);
}

// Fungsi Scroll Galeri
function handleScrollGesture(currentX) {
    // MediaPipe X: 0 (Kiri Layar) - 1 (Kanan Layar)
    // Ingat kamera di-mirror: Gerak tangan ke Kanan = X mengecil (mendekati 0)
    
    // Hitung selisih pergerakan
    let delta = previousX - currentX; 
    
    // Jika pergerakan signifikan
    if (Math.abs(delta) > 0.005) { 
        // Scroll container
        // Kalau tangan ke kiri (di kamera terlihat ke kanan), konten geser ke kanan
        gallerySection.scrollLeft += (delta * window.innerWidth * sensitivity);
    }
    
    previousX = currentX;
}

// --- 3. FUNGSI START & KAMERA ---
function startExperience() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('intro-section').classList.remove('hidden');

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 1280,
        height: 720
    });
    camera.start();
}

// --- 4. FALLBACK (JIKA KAMERA RUSAK) ---
function enableFallback() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('intro-section').classList.remove('hidden');
    alert("Mode Manual Aktif: Klik amplop untuk membuka, gunakan mouse/touch untuk geser foto.");
    
    // Ubah event listener untuk mouse click
    envelope.addEventListener('click', openTheEnvelope);
    
    // Izinkan scroll bar biasa
    gallerySection.style.overflowX = 'scroll';
}