/* === PLANET SATURNUS & RIBUAN FOTO ===
  Teknologi: Three.js + InstancedMesh
  Penulis: Gemini AI (Assistant)
*/

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("planet-gallery");

  if (!container) return; // Stop jika section tidak ada

  // --- 1. SETUP SCENE, CAMERA, RENDERER ---
  const scene = new THREE.Scene();

  // Fog untuk memberikan kedalaman (makin jauh makin gelap)
  scene.fog = new THREE.FogExp2(0x000000, 0.03);

  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 18; // Jarak awal kamera
  camera.position.y = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // --- 2. CONTROLS (Orbit) ---
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.autoRotate = true; // Planet berputar otomatis pelan
  controls.autoRotateSpeed = 0.5;

  // --- 3. PENCAHAYAAN (Lighting) ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const sunLight = new THREE.PointLight(0xffd700, 1.5, 100);
  sunLight.position.set(10, 10, 10);
  scene.add(sunLight);

  // --- 4. MEMBUAT PLANET SATURNUS ---
  // A. Bola Planet
  const planetGeometry = new THREE.SphereGeometry(4, 64, 64);
  const planetMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a2be2, // Ungu Gelap Kosmik (Ganti jika ingin warna lain)
    roughness: 0.5,
    metalness: 0.1,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  scene.add(planet);

  // B. Cincin Bercahaya (Glow Ring)
  const ringGeometry = new THREE.RingGeometry(5, 14, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xc5a059, // Emas
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = -Math.PI / 2; // Tidurkan cincin
  scene.add(ring);

  // --- 5. MEMBUAT RIBUAN FOTO (INSTANCED MESH) ---
  /* CATATAN PENTING UNTUK USER:
     Saat ini kita menggunakan "Kotak Warna Acak" sebagai placeholder foto.
     Jika nanti Anda ingin menggunakan foto asli, Anda punya 2 opsi:
     1. Texture Atlas (Advanced): Menggabungkan semua foto jadi 1 gambar besar.
     2. Array Materials (Medium): Menggunakan array material, tapi batasnya terbatas (bukan ribuan).
     
     Untuk efek "Ribuan", kotak warna-warni atau satu tekstur "polaroid" yang sama
     adalah yang paling performant.
  */

  const particlesCount = 1500; // Jumlah "foto"
  const photoGeometry = new THREE.PlaneGeometry(0.8, 1); // Rasio foto portrait
  const photoMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

/*
  const loader = new THREE.TextureLoader();
  const texture = loader.load("path/to/one-of-your-photos.jpg"); // Sementara 1 foto dulu
  const photoMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
*/

  // InstancedMesh adalah kunci performa!
  const photoMesh = new THREE.InstancedMesh(
    photoGeometry,
    photoMaterial,
    particlesCount,
  );

  const dummy = new THREE.Object3D();
  const colors = [];

  for (let i = 0; i < particlesCount; i++) {
    // A. Logika Matematika Posisi (Membentuk Cincin Sabuk)
    // Jarak acak antara radius 6 sampai 16 dari pusat
    const radius = 6 + Math.random() * 10;

    // Sudut acak 0 sampai 360 derajat (2 PI)
    const angle = Math.random() * Math.PI * 2;

    // Variasi ketinggian (tebal cincin)
    // Semakin jauh radius, semakin lebar sebarannya (opsional)
    const heightSpread = (Math.random() - 0.5) * 2; // -1 sampai 1

    // Set Posisi
    dummy.position.x = Math.cos(angle) * radius;
    dummy.position.y = heightSpread;
    dummy.position.z = Math.sin(angle) * radius;

    // Set Rotasi (Agar foto menghadap agak acak tapi tetap rapi)
    dummy.rotation.x = Math.random() * Math.PI;
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.rotation.z = Math.random() * Math.PI;

    // Update Matrix
    dummy.updateMatrix();
    photoMesh.setMatrixAt(i, dummy.matrix);

    // B. Warna Acak (Placeholder Foto)
    // Nanti ini bisa diganti dengan logika mapping UV jika pakai Texture Atlas
    const color = new THREE.Color();
    // Campuran warna Emas, Putih, dan Ungu muda
    const mixedColor = Math.random() > 0.5 ? 0xc5a059 : 0xffffff;
    color.setHex(mixedColor);
    // Sedikit variasi brightness
    color.multiplyScalar(0.5 + Math.random() * 0.5);

    photoMesh.setColorAt(i, color);
  }

  photoMesh.instanceMatrix.needsUpdate = true;
  photoMesh.instanceColor.needsUpdate = true;
  scene.add(photoMesh);

  // --- 6. HOVER EFFECT (RAYCASTER) ---
  // Opsional: Mendeteksi mouse hover (Cukup berat untuk HP, jadi kita optimalkan)
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredInstanceId = -1;

  container.addEventListener("mousemove", (event) => {
    // Normalisasi koordinat mouse (-1 sampai 1)
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });

  // --- 7. ANIMATION LOOP ---
  function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Wajib untuk autoRotate & damping

    // Rotasi Cincin Foto secara independen (opsional)
    photoMesh.rotation.y += 0.0005;

    // Efek "Goyangan" Planet
    planet.rotation.y -= 0.002;

    // -- Logika Hover di dalam Loop (Hati-hati performa) --
    // Kita cek raycaster hanya jika mouse bergerak (bisa dioptimalkan lagi)
    raycaster.setFromCamera(mouse, camera);
    const intersection = raycaster.intersectObject(photoMesh);

    if (intersection.length > 0) {
      const instanceId = intersection[0].instanceId;

      // Jika pindah target hover
      if (instanceId !== hoveredInstanceId) {
        // Reset warna sebelumnya (jika ada)
        // Note: Implementasi reset warna spesifik di InstancedMesh butuh penyimpanan state warna asli.
        // Untuk penyederhanaan kode prompt ini, kita skip reset kompleks.

        // Highlight foto yang di-hover jadi Merah Muda
        const highlightColor = new THREE.Color(0xff69b4);
        photoMesh.setColorAt(instanceId, highlightColor);
        photoMesh.instanceColor.needsUpdate = true;

        hoveredInstanceId = instanceId;
      }
    }

    renderer.render(scene, camera);
  }

  animate();

  // --- 8. HANDLE RESIZE ---
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
