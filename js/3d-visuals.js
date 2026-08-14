/**
 * ClinicOS: Animated 3D Multi-Strand Molecular DNA System (Light Background Theme)
 * Real-time 3D rotating Dark Blue & Pearl White DNA double-helices with organic wave motion,
 * multi-layer depth-of-field, floating particle aura, and interactive mouse/scroll physics.
 */

class Bio3DVisualizer {
  constructor(containerId = 'global-3d-background') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.strands = [];
    this.particlesGroup = null;
    this.clock = new THREE.Clock();

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.scrollOffset = 0;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, skipping 3D initialization.');
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 42);

    // 3. Renderer with transparent background & tone mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Bright Studio Lighting for Light Background
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.4);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    keyLight.position.set(25, 35, 35);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x097895, 2.2);
    rimLight.position.set(-30, -20, 25);
    this.scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x014459, 2.8, 70);
    pointLight.position.set(10, -5, 20);
    this.scene.add(pointLight);

    // 5. Build 3 Distinct Moving DNA Helices
    // Primary Foreground Helix (Deep Blue & Pearl White)
    this.createDNAStrand({
      id: 'main-foreground',
      numBasePairs: 70,
      radius: 5.8,
      heightStep: 0.8,
      angleStep: (Math.PI * 2) / 10.5,
      position: new THREE.Vector3(4.5, 0, 2),
      rotation: new THREE.Euler(0.28, 0.35, Math.PI / 5.2),
      rotSpeed: { x: 0.002, y: 0.012, z: 0.0015 },
      waveSpeed: 1.15,
      waveAmp: 0.8,
      isForeground: true
    });

    // Secondary Mid-Depth Helix
    this.createDNAStrand({
      id: 'secondary-depth',
      numBasePairs: 52,
      radius: 4.6,
      heightStep: 0.88,
      angleStep: (Math.PI * 2) / 10.5,
      position: new THREE.Vector3(-14, 3, -15),
      rotation: new THREE.Euler(-0.25, -0.45, -Math.PI / 4),
      rotSpeed: { x: -0.002, y: -0.008, z: 0.001 },
      waveSpeed: 0.85,
      waveAmp: 0.6,
      isForeground: false,
      opacity: 0.7
    });

    // Tertiary Background Helix
    this.createDNAStrand({
      id: 'tertiary-background',
      numBasePairs: 40,
      radius: 3.8,
      heightStep: 1.0,
      angleStep: (Math.PI * 2) / 10.5,
      position: new THREE.Vector3(18, -7, -25),
      rotation: new THREE.Euler(0.35, 0.25, Math.PI / 3),
      rotSpeed: { x: 0.001, y: 0.006, z: -0.002 },
      waveSpeed: 0.65,
      waveAmp: 0.45,
      isForeground: false,
      opacity: 0.45
    });

    // 6. Floating Molecular Particles
    this.buildParticles();

    // 7. Event Listeners for Parallax & Scroll Physics
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = ((e.clientX / window.innerWidth) * 2 - 1) * 0.8;
      this.targetMouseY = (-(e.clientY / window.innerHeight) * 2 + 1) * 0.5;
    });

    window.addEventListener('scroll', () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
      this.scrollOffset = (window.scrollY / maxScroll) * Math.PI * 3;
    });

    window.addEventListener('resize', () => this.onResize());

    // 8. Start Animation Loop
    this.animate();
  }

  createDNAStrand(config) {
    const group = new THREE.Group();

    // Molecular Materials for Light Background Contrast
    // Deep Astronaut Blue Sugar-Phosphate Strand
    const darkBlueMat = new THREE.MeshStandardMaterial({
      color: 0x5A9BD5,
      roughness: 0.22,
      metalness: 0.35,
      emissive: 0x01232D,
      emissiveIntensity: 0.35,
      transparent: !config.isForeground,
      opacity: config.opacity || 1.0
    });

    // Apollo Blue Chill Strand
    const blueChillMat = new THREE.MeshStandardMaterial({
      color: 0x097895,
      roughness: 0.24,
      metalness: 0.3,
      emissive: 0x054859,
      emissiveIntensity: 0.25,
      transparent: !config.isForeground,
      opacity: config.opacity || 1.0
    });

    // Pearl White Complementary Base Pairs
    const pearlWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.2,
      metalness: 0.15,
      emissive: 0xEDF8FD,
      emissiveIntensity: 0.15,
      transparent: !config.isForeground,
      opacity: config.opacity || 1.0
    });

    // Hydrogen Bond Material
    const bondMat = new THREE.MeshStandardMaterial({
      color: 0xCBD5E1,
      roughness: 0.35,
      metalness: 0.2,
      transparent: true,
      opacity: config.isForeground ? 0.85 : 0.4
    });

    const sphereGeom = new THREE.SphereGeometry(config.isForeground ? 0.44 : 0.34, 22, 22);
    const bondGeom = new THREE.CylinderGeometry(0.08, 0.08, config.radius * 2, 12);

    let prevPos1 = null;
    let prevPos2 = null;

    for (let i = 0; i < config.numBasePairs; i++) {
      const y = (i - config.numBasePairs / 2) * config.heightStep;
      const angle = i * config.angleStep;

      const x1 = Math.cos(angle) * config.radius;
      const z1 = Math.sin(angle) * config.radius;

      const x2 = Math.cos(angle + Math.PI) * config.radius;
      const z2 = Math.sin(angle + Math.PI) * config.radius;

      const pos1 = new THREE.Vector3(x1, y, z1);
      const pos2 = new THREE.Vector3(x2, y, z2);

      // Node 1 (Deep Blue Strand)
      const node1 = new THREE.Mesh(sphereGeom, darkBlueMat);
      node1.position.copy(pos1);
      group.add(node1);

      // Node 2 (Blue Chill / Pearl White Strand)
      const node2 = new THREE.Mesh(sphereGeom, i % 2 === 0 ? blueChillMat : pearlWhiteMat);
      node2.position.copy(pos2);
      group.add(node2);

      // Continuous Sugar-Phosphate Helical Backbone Ribbons
      if (prevPos1 && prevPos2) {
        const dist1 = prevPos1.distanceTo(pos1);
        const seg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, dist1, 8), darkBlueMat);
        seg1.position.copy(prevPos1.clone().add(pos1).multiplyScalar(0.5));
        seg1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos1.clone().sub(prevPos1).normalize());
        group.add(seg1);

        const dist2 = prevPos2.distanceTo(pos2);
        const seg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, dist2, 8), blueChillMat);
        seg2.position.copy(prevPos2.clone().add(pos2).multiplyScalar(0.5));
        seg2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos2.clone().sub(prevPos2).normalize());
        group.add(seg2);
      }

      prevPos1 = pos1;
      prevPos2 = pos2;

      // Nucleotide Base Pair Rung
      const bond = new THREE.Mesh(bondGeom, bondMat);
      bond.position.set(0, y, 0);
      bond.rotation.z = Math.PI / 2;
      bond.rotation.y = -angle;
      group.add(bond);
    }

    group.position.copy(config.position);
    group.rotation.copy(config.rotation);

    this.scene.add(group);

    this.strands.push({
      group,
      config,
      basePos: config.position.clone(),
      baseRot: config.rotation.clone()
    });
  }

  buildParticles() {
    this.particlesGroup = new THREE.Group();
    const count = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cNavy = new THREE.Color(0x014459);
    const cTeal = new THREE.Color(0x097895);
    const cOrange = new THREE.Color(0xFC8019);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 90;
      positions[i3 + 1] = (Math.random() - 0.5) * 70;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      const col = Math.random() > 0.6 ? cOrange : Math.random() > 0.3 ? cTeal : cNavy;
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.52,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const pointCloud = new THREE.Points(geometry, material);
    this.particlesGroup.add(pointCloud);
    this.scene.add(this.particlesGroup);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Mouse Easing (Parallax)
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Animate all 3 DNA Double Helices
    this.strands.forEach((strand, idx) => {
      const { group, config, basePos, baseRot } = strand;

      // 1. Continuous Multi-Axis Dynamic Rotation
      group.rotation.y = baseRot.y + elapsedTime * config.rotSpeed.y * 3.5 + this.scrollOffset * 0.2 + (idx === 0 ? this.mouseX * 0.4 : 0);
      group.rotation.x = baseRot.x + Math.sin(elapsedTime * 0.8 + idx) * 0.15 + (idx === 0 ? this.mouseY * 0.3 : 0);
      group.rotation.z = baseRot.z + Math.cos(elapsedTime * 0.6 + idx) * 0.08;

      // 2. Organic Wave Undulation (Living Biomolecular Motion)
      const wave = Math.sin(elapsedTime * config.waveSpeed + idx * 1.5) * config.waveAmp;
      group.position.y = basePos.y + wave;
      group.position.x = basePos.x + Math.cos(elapsedTime * 0.7 + idx) * (config.waveAmp * 0.5) + this.mouseX * (idx === 0 ? 3 : 1);
    });

    // Animate Floating Molecular Particles
    if (this.particlesGroup) {
      this.particlesGroup.rotation.y = elapsedTime * 0.02;
      this.particlesGroup.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

window.Bio3DVisualizer = Bio3DVisualizer;
