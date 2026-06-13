(function () {
  if (typeof THREE === 'undefined') return;

  var isMobile = window.innerWidth < 900;
  var container = document.getElementById('canvas-container');
  if (!container) return;

  var renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.set(0, 20, 50);

  var castleLight = new THREE.PointLight(0x00d4ff, 1.8, 160);
  castleLight.position.set(0, 15, 0);
  scene.add(castleLight);

  var rimLight = new THREE.PointLight(0xc9a356, 0.6, 100);
  rimLight.position.set(30, 0, 20);
  scene.add(rimLight);

  /* Gold particles */
  var gCount = isMobile ? 60 : 220;
  var gGeo   = new THREE.BufferGeometry();
  var gPos   = new Float32Array(gCount * 3);
  for (var i = 0; i < gCount; i++) {
    gPos[i*3]   = (Math.random() - 0.5) * 120;
    gPos[i*3+1] = Math.random() * 80 - 10;
    gPos[i*3+2] = (Math.random() - 0.5) * 80;
  }
  gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
  var goldParticles = new THREE.Points(gGeo, new THREE.PointsMaterial({
    color: 0xc9a356, size: 0.08, transparent: true, opacity: 0.6, sizeAttenuation: true
  }));
  scene.add(goldParticles);

  /* Cyan particles */
  var cCount = isMobile ? 30 : 110;
  var cGeo   = new THREE.BufferGeometry();
  var cPos   = new Float32Array(cCount * 3);
  for (var j = 0; j < cCount; j++) {
    cPos[j*3]   = (Math.random() - 0.5) * 90;
    cPos[j*3+1] = Math.random() * 65;
    cPos[j*3+2] = (Math.random() - 0.5) * 60;
  }
  cGeo.setAttribute('position', new THREE.BufferAttribute(cPos, 3));
  var cyanParticles = new THREE.Points(cGeo, new THREE.PointsMaterial({
    color: 0x00ccff, size: 0.05, transparent: true, opacity: 0.35, sizeAttenuation: true
  }));
  scene.add(cyanParticles);

  var scrollY = 0;
  var rotY    = 0;

  window.addEventListener('scroll', function () {
    scrollY = window.scrollY;
  }, { passive: true });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function maxScroll() { return Math.max(1, document.body.scrollHeight - window.innerHeight); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    requestAnimationFrame(animate);

    var t = scrollY / maxScroll();
    rotY += 0.00015;

    camera.position.x = lerp(camera.position.x, Math.sin(rotY) * 8, 0.03);
    camera.position.y = lerp(camera.position.y, 20 - t * 12, 0.03);
    camera.lookAt(0, 8, 0);

    castleLight.intensity  = 1.8 + Math.sin(Date.now() * 0.0008) * 0.4;
    castleLight.position.x = Math.sin(rotY * 2) * 10;

    goldParticles.rotation.y += 0.00022;
    cyanParticles.rotation.y -= 0.00016;
    cyanParticles.rotation.x += 0.00007;

    renderer.render(scene, camera);
  }

  animate();
})();
