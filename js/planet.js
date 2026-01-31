/* === PLANET SATURNUS, TEKS BERPUTAR & ASTEROID FOTO (SPACED OUT) ===
   Update: 
   - Jarak antar foto diperlebar (tidak menumpuk)
   - Area orbit lebih luas
*/

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("planet-gallery");
  if (!container) return;

  // --- 1. SETUP SCENE ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.02); 

  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  // Mundurkan kamera sedikit lagi agar area luas terlihat utuh
  camera.position.set(0, 14, 30); 

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

  // --- 2. LIGHTING ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffd700, 1.5);
  sunLight.position.set(20, 10, 10);
  scene.add(sunLight);

  const pointLight = new THREE.PointLight(0xff00ff, 1, 50); 
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  // --- 3. PLANET (INTI) ---
  const planetGeo = new THREE.SphereGeometry(4, 64, 64);
  const planetMat = new THREE.MeshStandardMaterial({
    color: 0x3a0ca3, 
    roughness: 0.5,
    metalness: 0.2,
    emissive: 0x100020,
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  scene.add(planet);

  // --- 4. CINCIN TEKS UCAPAN ---
  function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128; 
    const context = canvas.getContext('2d');
    
    context.fillStyle = 'rgba(0,0,0,0)'; 
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'bold 60px "Playfair Display", serif';
    context.fillStyle = '#FFD700'; 
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    context.fillText(text + "   " + text + "   " + text, canvas.width / 2, canvas.height / 2);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping; 
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  const textString = "Happy 20th Birthday Ratu! ✨ Barakallahu Fii Umrik ✨";
  const textTexture = createTextTexture(textString);
  
  const textRingGeo = new THREE.CylinderGeometry(6.5, 6.5, 1.5, 64, 1, true);
  const textRingMat = new THREE.MeshBasicMaterial({
    map: textTexture,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
    alphaTest: 0.5 
  });
  const textRing = new THREE.Mesh(textRingGeo, textRingMat);
  scene.add(textRing);


  // --- 5. FOTO SEBAGAI ASTEROID (MODIFIKASI JARAK) ---
  function createCircleAlphaMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'black'; 
    ctx.fillRect(0, 0, 128, 128);
    
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2); 
    ctx.fillStyle = 'white'; 
    ctx.fill();
    
    return new THREE.CanvasTexture(canvas);
  }

  // UBAH 1: Kurangi jumlah foto agar lebih renggang (Misal 500, sebelumnya 800)
  const particlesCount = 500; 
  
  const photoGeo = new THREE.PlaneGeometry(1, 1); 
  
  const loader = new THREE.TextureLoader();
  const photoTexture = loader.load('../assets/images/foto-ratu.jpg');
  const alphaMapTexture = createCircleAlphaMap(); 

  const photoMat = new THREE.MeshBasicMaterial({
    map: photoTexture,
    alphaMap: alphaMapTexture, 
    transparent: true, 
    side: THREE.DoubleSide,
    alphaTest: 0.5, 
    color: 0xffffff
  });

  const photoMesh = new THREE.InstancedMesh(photoGeo, photoMat, particlesCount);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < particlesCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    
    // UBAH 2: Perlebar Radius (Jarak dari planet)
    // Sekarang mulai dari 9 sampai 24 (Area orbit lebih tebal & jauh)
    const radius = 9 + Math.random() * 15; 
    
    // UBAH 3: Perlebar Sebaran Vertikal (Naik Turun)
    // Sekarang sebarannya -3 sampai 3 (Total 6 unit), memberi ruang vertikal
    const heightSpread = (Math.random() - 0.5) * 6; 

    dummy.position.set(
      Math.cos(angle) * radius,
      heightSpread,
      Math.sin(angle) * radius
    );

    dummy.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    // Skala sedikit variatif
    const scale = 0.5 + Math.random() * 0.7;
    dummy.scale.set(scale, scale, scale);

    dummy.updateMatrix();
    photoMesh.setMatrixAt(i, dummy.matrix);
  }
  
  photoMesh.instanceMatrix.needsUpdate = true;
  scene.add(photoMesh);


  // --- 6. ANIMASI ---
  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    textTexture.offset.x -= 0.002; 
    photoMesh.rotation.y += 0.0008; // Putar sedikit lebih pelan agar elegan
    planet.rotation.y -= 0.002;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});