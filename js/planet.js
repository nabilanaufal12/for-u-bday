/* === PLANET SATURNUS DENGAN 5 VARIASI FOTO === */

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("planet-gallery");
  if (!container) return;

  // --- 1. SETUP SCENE ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.02);

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );

  // Deteksi apakah mobile?
  const isMobile = window.innerWidth < 768;

  // Jika mobile, kamera mundur (Z lebih besar) dan naik sedikit (Y)
  // Desktop: (0, 14, 30) -> Mobile: (0, 20, 55)
  const camY = isMobile ? 20 : 14;
  const camZ = isMobile ? 55 : 30;

  camera.position.set(0, camY, camZ);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.capabilities.logarithmicDepthBuffer = true;
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.enableZoom = true;

  // --- 2. PLANET (INTI) ---
  // Dibuat duluan agar lighting bisa berefleksi dengan benar
  const planetGeo = new THREE.SphereGeometry(4, 64, 64);
  const planetMat = new THREE.MeshPhysicalMaterial({
    color: 0x3a0ca3, // Warna dasar ungu
    roughness: 0.4, // Sedikit mengkilap
    metalness: 0.1,
    clearcoat: 0.5, // Lapisan bening (seperti kaca/gas)
    clearcoatRoughness: 0.1,
    emissive: 0x1a0540, // Sedikit cahaya dari dalam (Glow)
    emissiveIntensity: 0.5,
  });
  // Tambahkan "Atmosphere Glow" (Mesh kedua sedikit lebih besar di belakang)
  const atmosphereGeo = new THREE.SphereGeometry(4.2, 64, 64); // Sedikit lebih besar dari planet (4.0)
  const atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0x6a0dad,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide, // Render bagian dalam agar terlihat seperti kabut
    blending: THREE.AdditiveBlending, // Efek cahaya menyala
  });
  const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  scene.add(atmosphere);
  const planet = new THREE.Mesh(planetGeo, planetMat);
  scene.add(planet);

  // --- 3. LIGHTING (DRAMATIC UPGRADE) ---

  // 1. Ambient Light (Nuansa Ungu Gelap)
  const ambientLight = new THREE.AmbientLight(0x4040a0, 0.5);
  scene.add(ambientLight);

  // 2. Main Sun Light (Cahaya Emas Utama)
  const sunLight = new THREE.DirectionalLight(0xffd700, 2);
  sunLight.position.set(50, 30, 50);
  sunLight.castShadow = true;
  scene.add(sunLight);

  // 3. Rim Light (Cahaya Biru dari Belakang - Efek Siluet)
  const rimLight = new THREE.SpotLight(0x00ffff, 3);
  rimLight.position.set(-30, 10, -10);
  // SpotLight secara default mengarah ke (0,0,0) dimana planet berada
  scene.add(rimLight);

  // 4. Point Light (Glow Tambahan di Tengah)
  const glowLight = new THREE.PointLight(0x6a0dad, 1.5, 100);
  scene.add(glowLight);

  // --- 4. CINCIN TEKS UCAPAN ---
  function createTextTexture(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 128;
    const context = canvas.getContext("2d");

    context.fillStyle = "rgba(0,0,0,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'bold 60px "Playfair Display", serif';
    context.fillStyle = "#FFD700";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText(
      text + "   " + text + "   " + text,
      canvas.width / 2,
      canvas.height / 2,
    );

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  const textString = "Happy 20th Birthday Habibah! ✨ Barakallahu Fii Umrik ✨";
  const textTexture = createTextTexture(textString);

  const textRingGeo = new THREE.CylinderGeometry(6.5, 6.5, 1.5, 64, 1, true);
  const textRingMat = new THREE.MeshBasicMaterial({
    map: textTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
    alphaTest: 0.5,
  });
  const textRing = new THREE.Mesh(textRingGeo, textRingMat);
  scene.add(textRing);

  // --- 5. FOTO SEBAGAI ASTEROID (MULTI-TEXTURE) ---
  function createCircleAlphaMap() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 128, 128);
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  const alphaMapTexture = createCircleAlphaMap();
  const loader = new THREE.TextureLoader();
  const photoGeo = new THREE.PlaneGeometry(1, 1);
  const dummy = new THREE.Object3D();

  // DAFTAR NAMA FOTO (Menggunakan path relatif terhadap index.html)
  const photoFiles = [
    "foto-1.jpg",
    "foto-2.jpg",
    "foto-3.jpg",
    "foto-4.jpg",
    "foto-5.jpg",
  ];

  // Total asteroid dibagi rata jumlah foto
  const totalParticles = 500;
  const particlesPerPhoto = Math.floor(totalParticles / photoFiles.length);

  // Loop untuk membuat Mesh berbeda tiap foto
  photoFiles.forEach((fileName) => {
    // Note: Path assets/images/ karena dipanggil dari index.html
    const texture = loader.load(`assets/images/${fileName}`);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      alphaMap: alphaMapTexture,
      transparent: true,
      side: THREE.DoubleSide,
      alphaTest: 0.5,
      color: 0xffffff,
    });

    const mesh = new THREE.InstancedMesh(photoGeo, material, particlesPerPhoto);

    // Sebar partikel untuk foto ini
    for (let i = 0; i < particlesPerPhoto; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 9 + Math.random() * 15; // Radius sebaran
      const heightSpread = (Math.random() - 0.5) * 6;

      dummy.position.set(
        Math.cos(angle) * radius,
        heightSpread,
        Math.sin(angle) * radius,
      );

      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );

      const scale = 0.5 + Math.random() * 0.7;
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;

    // Simpan referensi mesh untuk animasi rotasi nanti
    mesh.userData = { rotationSpeed: 0.0005 + Math.random() * 0.0005 };
    scene.add(mesh);

    // Masukkan ke array global biar bisa diakses di fungsi animate
    if (!window.asteroidMeshes) window.asteroidMeshes = [];
    window.asteroidMeshes.push(mesh);
  });

  // --- 6. ANIMASI ---
  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    textTexture.offset.x -= 0.002;
    planet.rotation.y -= 0.002;

    // Putar semua grup asteroid
    if (window.asteroidMeshes) {
      window.asteroidMeshes.forEach((mesh) => {
        mesh.rotation.y += 0.0008; // Kecepatan putar orbit
      });
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    // Update aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Update posisi kamera saat resize (opsional, biar mulus rotate screen)
    const isMobileNow = container.clientWidth < 768;
    const newY = isMobileNow ? 20 : 14;
    const newZ = isMobileNow ? 55 : 30;
    // Gunakan gsap atau lerp jika ingin halus, tapi set langsung juga oke
    camera.position.set(0, newY, newZ);
  });
});
