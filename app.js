// Project video hover (works with 1 or many)

const videoList = Array.from(document.querySelectorAll('.project-vidbox > video'));
const hoverSign = document.querySelector('.hover-sign');

videoList.forEach((video)=>{
  video.addEventListener("mouseover", function(){
    video.play();
    if (hoverSign) hoverSign.classList.add("active");
  });
  video.addEventListener("mouseout", function(){
    video.pause();
    if (hoverSign) hoverSign.classList.remove("active");
  });
});

   /*
   * Three.js Icosahedron under #projects (no HTML/CSS changes) 
   */
(function addIcosahedron() {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;

  /* 
  * Create a host container (styled inline so we don't need CSS edits)
  */
  const host = document.createElement('div');
  host.id = 'three-icosa';
  Object.assign(host.style, {
    width: '100%',
    height: '320px',
    marginTop: '24px',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',

    /* subtle blue-violet glass so it fits the theme */

    background: 'linear-gradient(180deg, rgba(24,32,96,0.55), rgba(72,32,120,0.5))',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
  });
  projectsSection.appendChild(host);

  // Load THREE from CDN
  function loadThree() {
    return new Promise((resolve, reject) => {
      if (window.THREE) return resolve(window.THREE);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.min.js';
      s.onload = () => resolve(window.THREE);
      s.onerror = (e) => reject(new Error('Failed to load three.js'));
      document.head.appendChild(s);
    });
  }

  loadThree().then((THREE) => {
    const { Scene, PerspectiveCamera, WebGLRenderer, IcosahedronGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight, Clock, Color } = THREE;

    const scene = new Scene();
    const camera = new PerspectiveCamera(50, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.z = 3.1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    host.appendChild(renderer.domElement);

    // Icosahedron
    const geo = new IcosahedronGeometry(1.15, 0); // radius, detail
    const mat = new MeshStandardMaterial({
      color: 0x8a7cff,
      metalness: 0.55,
      roughness: 0.25,
      envMapIntensity: 0.9,
    });
    const ico = new Mesh(geo, mat);
    scene.add(ico);

    // Lights
    scene.add(new AmbientLight(0xffffff, 0.6));
    const key = new DirectionalLight(0xffe6a7, 0.9); key.position.set(3, 2, 2); scene.add(key);
    const rim = new DirectionalLight(0x7cc7ff, 0.7); rim.position.set(-3, -2, 1); scene.add(rim);

    // Animate
    const clock = new Clock();
    let rafId = null;
    function render() {
      rafId = requestAnimationFrame(render);
      const t = clock.getElapsedTime();
      ico.rotation.x += 0.005;
      ico.rotation.y += 0.007;

      // soft hue breathing
      const h = (0.68 + 0.04 * Math.sin(t * 0.9)) % 1;
      mat.color.setHSL(h, 0.65, 0.60);

      renderer.render(scene, camera);
    }

    // Resize
    function onResize() {
      const w = host.clientWidth;
      const h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // Start/stop when visible to save resources
    // Pause/resume based on visibility (not just pause)
const io = new IntersectionObserver(([entry]) => {
  running = entry.isIntersecting && !gameOver;
  if (running) { 
    // eat the first dt after resuming so it doesn’t spike
    clock.getDelta();
  }
}, { threshold: 0.15 });
io.observe(host);


    // Kick off if already visible
    if (host.getBoundingClientRect().top < window.innerHeight) render();
  }).catch(err => {
    console.warn('[three-icosa] Could not initialize Three.js:', err);
  });
})();



// 3D Tesseract

/*
* Right-edge 3D Tesseract (purple, wider, no overlay) 
*/
(function addRightTesseract() {
  // Remove any old left host
  const oldLeft = document.getElementById('left-tesseract');
  if (oldLeft) oldLeft.remove();

  // Create / reuse right host
  let host = document.getElementById('right-tesseract');
  if (!host) {
    host = document.createElement('div');
    host.id = 'right-tesseract';
    Object.assign(host.style, {
      position: 'fixed',
      right: '0',                 // right side
      top: '0',
      width: 'clamp(120px, 16vw, 260px)', 
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '0',                // above video (z:-1), below header (z:999)
      overflow: 'hidden',
      background: 'transparent',  
    });
    document.body.appendChild(host);
  } else {
    host.style.width = 'clamp(120px, 16vw, 260px)';
    host.style.background = 'transparent';
    host.innerHTML = '';
  }

  // Load THREE if needed
  function loadThree() {
    return new Promise((resolve, reject) => {
      if (window.THREE) return resolve(window.THREE);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.min.js';
      s.onload = () => resolve(window.THREE);
      s.onerror = () => reject(new Error('Failed to load three.js'));
      document.head.appendChild(s);
    });
  }

  loadThree().then((THREE) => {
    const {
      Scene, PerspectiveCamera, WebGLRenderer, CylinderGeometry, MeshStandardMaterial, Mesh,
      Vector3, AmbientLight, DirectionalLight, Clock
    } = THREE;

    // Tesseract vertices/edges in 4D
    const verts4 = [];
    for (let x = -1; x <= 1; x += 2)
    for (let y = -1; y <= 1; y += 2)
    for (let z = -1; z <= 1; z += 2)
    for (let w = -1; w <= 1; w += 2) verts4.push([x, y, z, w]);

    const edges = [];
    for (let i = 0; i < 16; i++) {
      for (let d = 0; d < 4; d++) {
        const j = i ^ (1 << d);
        if (j > i) edges.push([i, j]);
      }
    }

    // Three.js setup ----
    const scene = new Scene();
    const camera = new PerspectiveCamera(50, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true }); // alpha keeps it transparent
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(host.clientWidth, host.clientHeight);
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
    host.appendChild(renderer.domElement);

    // Lighting
    scene.add(new AmbientLight(0xffffff, 0.6));
    const key = new DirectionalLight(0xffe6a7, 0.5); key.position.set(3, 2, 2); scene.add(key);
    const rim = new DirectionalLight(0x7cc7ff, 0.5); rim.position.set(-3, -2, 1); scene.add(rim);

    // Purple thick edges (cylinders)
    const edgeMat = new MeshStandardMaterial({
      color: 0x9b59ff,
      metalness: 0.25,
      roughness: 0.35,
      emissive: 0x2a004a,
      emissiveIntensity: 0.55
    });
    const edgeRadius = 0.035;
    const cylGeo = new CylinderGeometry(edgeRadius, edgeRadius, 1, 20, 1, false);

    const up = new Vector3(0, 1, 0);
    const edgeMeshes = edges.map(() => new Mesh(cylGeo, edgeMat));
    edgeMeshes.forEach(m => { scene.add(m); m.matrixAutoUpdate = true; });

    // 4D rotation + projection
    function rotatePair(v, ia, ib, t) {
      const c = Math.cos(t), s = Math.sin(t);
      const A = v[ia], B = v[ib];
      v[ia] = A * c - B * s;
      v[ib] = A * s + B * c;
    }
    function project4Dto3D(v4, d4 = 3.2, scale = 1.7) {
      const [x, y, z, w] = v4;
      const k = d4 / (d4 - w);
      return new Vector3(x * k * scale, y * k * scale, z * k * scale);
    }

    const clock = new Clock();
    let rafId = null;

    function render() {
      rafId = requestAnimationFrame(render);
      const t = clock.getElapsedTime();

      const aXW = t * 0.35, aYW = t * 0.23, aZW = t * 0.29, aXY = t * 0.17;
      const pos3 = new Array(16);
      for (let i = 0; i < 16; i++) {
        const v = verts4[i].slice();
        rotatePair(v, 0, 3, aXW);
        rotatePair(v, 1, 3, aYW);
        rotatePair(v, 2, 3, aZW);
        rotatePair(v, 0, 1, aXY);
        pos3[i] = project4Dto3D(v);
      }

      // Update cylinders
      for (let e = 0; e < edges.length; e++) {
        const [i, j] = edges[e];
        const a = pos3[i], b = pos3[j];
        const mid = new Vector3().addVectors(a, b).multiplyScalar(0.5);
        const dir = new Vector3().subVectors(b, a);
        const len = dir.length();

        const m = edgeMeshes[e];
        m.position.copy(mid);
        m.scale.set(1, len, 1);
        m.quaternion.setFromUnitVectors(up, dir.normalize());
      }

      renderer.render(scene, camera);
    }

    function onResize() {
      const w = host.clientWidth;
      const h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
      else if (!rafId) { render(); }
    });

    render();
  }).catch(err => {
    console.warn('[right-tesseract] Could not initialize Three.js:', err);
  });
})();


// Three JS Game for fun

/* 
* "Game" nav item + Section + Forward-Progress Mini Game (Start key added) 
*/
(function addGameNavAndSectionEnhancedForward() {
  const CV_URL = 'https://www.linkedin.com/in/r-chatterjee-034342241/';

  // 1) Ensure "Game" in top nav
  const nav = document.querySelector('.top-nav');
  if (nav && !nav.querySelector('a[href="#game"]')) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#game';
    a.textContent = 'Game';
    li.appendChild(a);
    nav.appendChild(li);
  }

  // 2) Make or refresh #game section (wider frame)
  const projects = document.getElementById('projects');
  let gameSection = document.getElementById('game');
  if (!gameSection) {
    gameSection = document.createElement('section');
    gameSection.id = 'game';
    gameSection.className = 'game-section';
    gameSection.style.scrollMarginTop = '100px';
    const parent = (projects && projects.parentNode) || document.querySelector('.container') || document.body;
    parent.insertBefore(gameSection, (projects && projects.nextSibling) || null);
  }
  gameSection.innerHTML = `<h1 class="section-title autoDisplay">Mini Game 🎮</h1>`;

  // Host container (wide, bright)
  const host = document.createElement('div');
  host.id = 'game-host';
  Object.assign(host.style, {
    width: 'min(1200px, 96vw)',
    height: '440px',
    borderRadius: '16px',
    margin: '16px auto 0',
    position: 'relative',
    overflow: 'hidden',
    background: 'rgba(8, 12, 32, 0.22)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
  });
  gameSection.appendChild(host);

  // Flash overlay (for end-of-run glow)
  const flash = document.createElement('div');
  Object.assign(flash.style, {
    position: 'absolute', inset: '0', background: '#fff',
    opacity: '0', transition: 'opacity 220ms ease',
    pointerEvents: 'none'
  });
  host.appendChild(flash);

  // 3) Load Three.js once if needed
  function loadThree() {
    return new Promise((resolve, reject) => {
      if (window.THREE) return resolve(window.THREE);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.min.js';
      s.onload = () => resolve(window.THREE);
      s.onerror = () => reject(new Error('Failed to load three.js'));
      document.head.appendChild(s);
    });
  }

  loadThree().then((THREE) => {
    const {
      Scene, PerspectiveCamera, WebGLRenderer,
      BoxGeometry, MeshStandardMaterial, Mesh,
      PlaneGeometry, AmbientLight, DirectionalLight,
      Vector3, Clock
    } = THREE;

    // Scene setup
    const scene = new Scene();
    const camera = new PerspectiveCamera(60, host.clientWidth / host.clientHeight, 0.1, 100);

    // Player & camera initial Z (we’ll move forward per pass)
    const CAM_OFFSET_Z = 6.0;
    let playerZ = 0;               // more negative is "forward"
    let camZ = playerZ + CAM_OFFSET_Z;

    camera.position.set(0, 2.2, camZ);
    camera.lookAt(0, 1, playerZ);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(host.clientWidth, host.clientHeight);
    Object.assign(renderer.domElement.style, { width: '100%', height: '100%', display: 'block' });
    host.appendChild(renderer.domElement);

    // Lights
    scene.add(new AmbientLight(0xffffff, 0.85));
    const key = new DirectionalLight(0xfff2c2, 1.0); key.position.set(3, 5, 2); scene.add(key);
    const rim = new DirectionalLight(0x9cd3ff, 0.9); rim.position.set(-3, 2, 1); scene.add(rim);

    // Ground
    const ground = new Mesh(
      new PlaneGeometry(10, 400),
      new MeshStandardMaterial({ color: 0x0d1540, roughness: 0.85, metalness: 0.2, transparent: true, opacity: 0.72 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, camZ - 50);
    scene.add(ground);

    // Player cube
    const player = new Mesh(
      new BoxGeometry(0.9, 0.9, 0.9),
      new MeshStandardMaterial({ color: 0x00d0ff, metalness: 0.45, roughness: 0.33, emissive: 0x0077aa, emissiveIntensity: 0.9 })
    );
    player.position.set(0, 0.5, playerZ);
    scene.add(player);

    // Lanes & movement
    const lanes = [-2.0, 0, 2.0];
    let laneIndex = 1;
    function setLane(i) {
      laneIndex = Math.max(0, Math.min(2, i));
      player.position.x = lanes[laneIndex];
    }
    setLane(1);

    // Jump/Dash
    let y = 0.5, vy = 0, grounded = true;
    const GRAV = -18;
    const JUMP_V = 6.5;
    let dashTimer = 0;

    // Forward step per pass
    const FORWARD_STEP = 0.6;      // forward per obstacle passed
    let targetPlayerZ = playerZ;
    let targetCamZ = camZ;

    // Helpers
    const lerp = (a, b, t) => a + (b - a) * t;

    // Game state
    const obstacles = [];
    const clock = new Clock();
    let started = false;           // NEW: game must be started
    let running = false;           // only runs if visible AND started AND not gameOver
    let gameOver = false;
    let lastSpawn = 0;
    let spawnEvery = 0.95;
    let baseSpeed = 7.5;
    let score = 0;
    let passed = 0;
    let openedCV = false;

    // Spawn obstacles
    function spawnObstacle() {
      const lane = lanes[(Math.random() * 3) | 0];
      const tiny = Math.random() < 0.35;
      const s = tiny ? (0.28 + Math.random() * 0.22) : (0.65 + Math.random() * 0.5);

      const color = tiny ? 0x9cff00 : 0xff3b3b;
      const emissive = tiny ? 0x224400 : 0x550000;

      const box = new Mesh(
        new BoxGeometry(s, s, s),
        new MeshStandardMaterial({ color, metalness: 0.35, roughness: 0.28, emissive, emissiveIntensity: tiny ? 0.55 : 0.65 })
      );
      box.position.set(lane, s / 2, playerZ - 22); // in front of player
      box.userData.size = s;                       // store size (safer than geometry.parameters)
      scene.add(box);
      obstacles.push(box);
    }

    // HUD (score + obstacles + controls)
    const hud = document.createElement('div');
    Object.assign(hud.style, {
      position: 'absolute', left: '12px', top: '8px',
      fontSize: '14px', fontWeight: '800', color: '#fff',
      textShadow: '0 1px 2px rgba(0,0,0,0.6)', pointerEvents: 'none'
    });
    host.appendChild(hud);

    const controls = document.createElement('div');
    Object.assign(controls.style, {
      position: 'absolute', left: '12px', bottom: '10px',
      fontSize: '13px', fontWeight: '700', color: '#e6f3ff',
      textShadow: '0 1px 2px rgba(0,0,0,0.6)'
    });
    controls.innerHTML =
      'Start: <b>S</b> &nbsp;·&nbsp; Move: ←/A &rarr; →/D &nbsp;·&nbsp; Jump: ↑/W &nbsp;·&nbsp; Dash: Shift &nbsp;·&nbsp; Pause: P &nbsp;·&nbsp; Restart: R<br>' +
      'Each time you <b>pass an obstacle</b>, you move <b>forward</b>. Pass <b>10</b> to open your <b>LinkedIn CV</b>.';
    host.appendChild(controls);

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'absolute', inset: '0',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: '18px', fontWeight: '800',
      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)'
    });
    overlay.textContent = 'Press S to Start (or tap)';
    host.appendChild(overlay);

    function setOverlay(msg) { overlay.textContent = msg; overlay.style.display = 'flex'; }
    function clearOverlay()  { overlay.style.display = 'none'; }
    function updateHUD()     { hud.textContent = `Score: ${Math.floor(score)}   |   Obstacles: ${passed}/10`; }
    updateHUD();

    // Input
    window.addEventListener('keydown', (e) => {
      // Start
      if ((e.key === 's' || e.key === 'S') && !started) {
        started = true; running = true; clearOverlay(); clock.getDelta();
        return;
      }
      if (gameOver) {
        if (e.key === 'r' || e.key === 'R') reset(true); // restart immediately
        return;
      }
      if (!started) return; // ignore controls until started

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setLane(laneIndex - 1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setLane(laneIndex + 1);
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { if (grounded) { vy = JUMP_V; grounded = false; } }
      if (e.key === 'Shift') { dashTimer = 0.35; }
      if (e.key === 'p' || e.key === 'P') { running = !running; if (running) clock.getDelta(); }
      if (e.key === 'r' || e.key === 'R') reset(true);
    });

    // Tap to start on mobile
    host.addEventListener('click', () => {
      if (!started) { started = true; running = true; clearOverlay(); clock.getDelta(); }
    });

    // Touch move/jump after started
    let touchStart = null;
    host.addEventListener('touchstart', (e) => { touchStart = e.changedTouches[0]; }, { passive: true });
    host.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0];
      if (!touchStart) return;
      if (!started || gameOver) { touchStart = null; return; }
      const dx = t.clientX - touchStart.clientX;
      const dy = t.clientY - touchStart.clientY;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) setLane(laneIndex + 1); else if (dx < -30) setLane(laneIndex - 1);
      } else {
        if (dy < -30 && grounded) { vy = JUMP_V; grounded = false; }
      }
      touchStart = null;
    }, { passive: true });

    // Pause/resume based on visibility — only if started and not gameOver
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && started && !gameOver;
      if (running) clock.getDelta(); // eat first dt so it doesn't spike
    }, { threshold: 0.15 });
    io.observe(host);

    // Reset (if startNow=true, start immediately; else show "Press S")
    function reset(startNow = false) {
      for (const o of obstacles) scene.remove(o);
      obstacles.length = 0;

      setLane(1);
      y = 0.5; vy = 0; grounded = true;
      dashTimer = 0;

      playerZ = 0; targetPlayerZ = 0;
      camZ = CAM_OFFSET_Z; targetCamZ = CAM_OFFSET_Z;

      player.position.set(lanes[1], 0.5, playerZ);
      camera.position.z = camZ;
      ground.position.z = camZ - 50;

      lastSpawn = 0; spawnEvery = 0.95; baseSpeed = 7.5;
      score = 0; passed = 0; openedCV = false;
      gameOver = false;

      if (startNow) {
        started = true; running = true; clearOverlay(); clock.getDelta();
      } else {
        started = false; running = false; setOverlay('Press S to Start (or tap)');
      }

      flash.style.opacity = '0';
      updateHUD();
    }

    // Animate
    const clockObj = clock; // naming clarity
    function animate() {
      requestAnimationFrame(animate);
      const dt = clockObj.getDelta();

      // Smooth follow for playerZ and cameraZ
      playerZ = lerp(playerZ, targetPlayerZ, Math.min(1, dt * 6));
      camZ    = lerp(camZ,    targetCamZ,    Math.min(1, dt * 4));
      player.position.z = playerZ;
      camera.position.z = camZ;
      camera.lookAt(player.position.x, 1, playerZ);
      ground.position.z = camZ - 50;

      // Idle/dash visuals
      player.position.y = y;
      player.scale.setScalar(1 + (dashTimer > 0 ? 0.06 : 0.0));
      player.material.emissiveIntensity = dashTimer > 0 ? 1.0 : 0.9;

      if (running && !gameOver) {
        // Gravity & jump
        if (!grounded) {
          vy += GRAV * dt;
          y += vy * dt;
          if (y <= 0.5) { y = 0.5; vy = 0; grounded = true; }
        }

        // Spawning & difficulty ramp
        lastSpawn += dt;
        if (lastSpawn >= spawnEvery) {
          spawnObstacle();
          lastSpawn = 0;
          spawnEvery = Math.max(0.6, spawnEvery - 0.01);
          baseSpeed = Math.min(11.5, baseSpeed + 0.05);
        }

        // Move obstacles toward camera
        const speed = baseSpeed * (dashTimer > 0 ? 0.92 : 1.0);
        for (let i = obstacles.length - 1; i >= 0; i--) {
          const o = obstacles[i];
          o.position.z += speed * dt;

          // Passed the camera?
          if (o.position.z > camZ + 6.5) {
            scene.remove(o);
            obstacles.splice(i, 1);

            // Progress & score
            passed += 1;
            score += 15;
            updateHUD();

            // Step forward (more negative z)
            targetPlayerZ -= FORWARD_STEP;
            targetCamZ = targetPlayerZ + CAM_OFFSET_Z;

            // After 10 passes: flash + open CV (popup-safe)
            if (passed >= 10 && !openedCV) {
              openedCV = true;
              flash.style.opacity = '1';
              setTimeout(() => {
                const win = window.open(CV_URL, '_blank', 'noopener');
              
                flash.style.opacity = '0';
              }, 220);
            }
            continue;
          }

          // Collision (relative to player)
          const sz = o.userData.size ?? 0.6;
          const nearZ     = Math.abs(o.position.z - playerZ) < (sz * 0.5 + 0.55);
          const sameLane  = Math.abs(o.position.x - player.position.x) < (sz * 0.5 + 0.55);
          const jumpedOver= y > (sz + 0.55);
          const phased    = dashTimer > 0;

          if (nearZ && sameLane && !jumpedOver && !phased) {
            gameOver = true; running = false;
            setOverlay('Game Over — press R to restart');
          }
        }

        // Score over time
        score += dt * 8;
        updateHUD();

        // Dash decay
        if (dashTimer > 0) dashTimer = Math.max(0, dashTimer - dt);
      }

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    function onResize() {
      const w = host.clientWidth;
      const h = host.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);
  }).catch(err => {
    console.warn('[mini-game] Could not initialize Three.js:', err);
  });
})();