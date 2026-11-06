// Stylized 3D massing model of the whole tower: the Tower Explorer's second view.
// Generated procedurally from the TOWER calibration in data.js (measured on assets/18-tower-six-hero.jpg).
// The renderings are references for proportion, colour and mood only; nothing is textured with a photo.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const FLOORS = 39;
/* Scale. Model units are metres, but only proportions come from the image: the typical slab
   spacing at the corner (~36 image px) is taken as an assumed 3.1 m floor-to-floor, and widths on
   both faces are multiplied by √2 because the hero sees both faces at roughly 45°. */
const TYPICAL_H = 3.1;
const FORESHORTEN = Math.SQRT2;
// Right face (not part of the photo calibration, read off the same image at the upper floors):
// the vertical white fin where the right face steps back, and the face's far edge.
const RIGHT_FIN_X = 1712, RIGHT_EDGE_X = 1840;
const SET = 1.2; // the wing / right-back planes sit this far behind the shaft faces
const PODIUM_EXTRA_DEPTH = 12, PODIUM_PROUD = 1.5, RETAIL_RECESS = 1.5; // assumed (not visible in the hero)
const HORIZON = '#b08f7c';
const SLAB = 0.35, LEDGE = 0.9, LEDGE_FRONT = 1.5, CAP_H = 7;

const C = {
  front: '#a9bccb', bronze: '#a08672', back: '#8c9cab', wingFront: '#cfd7dc', wingSide: '#b9c3ca',
  podium: '#4a525b', podiumWarm: '#5a5048', retail: '#8d6c4b', retailSide: '#7a5d41',
  slab: '#f3f1ec', podiumSlab: '#4a4e54', cap: '#c9cacb', deck: '#a49d92',
  plaza: '#b9ae9f', street: '#767a80', road: '#46484c', planter: '#5f7d47', trunk: '#5a4636',
  gold: '#ffd45c', goldFill: '#f0b43c', glow: '#ffc27a', pin: '#b0773f',
};

// fixed seed: the same windows glow and the same trees grow on every load
function rng(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Floor-by-floor massing from the photo calibration. Exported so the derivation can be checked. */
export function towerPlan(T) {
  const typ = (T.slabs[37][0] - T.slabs[1][0]) / 36; // image px per typical floor at the corner
  const sx = TYPICAL_H / typ * FORESHORTEN;
  const X = px => (px - T.cornerX) * sx; // along the front face: 0 at the corner, negative toward the wing
  const J = X(T.joinX), F = X(RIGHT_FIN_X), D = X(RIGHT_EDGE_X), PR = X(T.podiumRightX), PD = D + PODIUM_EXTRA_DEPTH;
  const edge = n => X(T.leftEdge.find(([a, b]) => n >= a && n <= b)[2]);
  const floors = [];
  let y = 0;
  for (let n = 1; n <= FLOORS; n++) {
    // floor n spans slab k = 39 − n down to 40 − n; double-height floors (1, 2, 39) show up as ~2× spacing
    const r = (T.slabs[40 - n][0] - T.slabs[39 - n][0]) / typ;
    const h = (r > 1.25 ? r : 1) * TYPICAL_H;
    const parts = n <= 2 ? [{ x0: edge(n), x1: PR, z0: -PD + 1, z1: PODIUM_PROUD - RETAIL_RECESS, kind: 'retail' }]
      : n <= 4 ? [{ x0: edge(n), x1: PR, z0: -PD, z1: PODIUM_PROUD, kind: 'podium' }]
      : [{ x0: J, x1: 0, z0: -F, z1: 0, kind: 'shaft' },
        { x0: J, x1: -SET, z0: -D, z1: -F, kind: 'shaftR' },
        { x0: edge(n), x1: J, z0: -D + 1.5, z1: -SET, kind: 'wing' }];
    floors[n] = { n, y0: y, h, parts };
    y += h;
  }
  return { floors, roof: y, J, F, D, PR, PD, sx };
}

// Box face order in BoxGeometry: +x, −x, +y, −y, +z, −z. Glass colours per face, and which faces are outside.
const FACES = {
  shaft: { col: [C.bronze, C.front, C.front, C.front, C.front, C.back], out: [0, 4] },
  shaftR: { col: [C.bronze, C.back, C.back, C.back, C.bronze, C.back], out: [0, 5] },
  wing: { col: [C.wingSide, C.wingSide, C.wingFront, C.wingFront, C.wingFront, C.wingSide], out: [1, 4, 5] },
  podium: { col: [C.podiumWarm, C.podium, C.podium, C.podium, C.podium, C.podium], out: [0, 1, 4, 5] },
  retail: { col: [C.retail, C.retailSide, C.retail, C.retail, C.retail, C.retailSide], out: [0, 1, 4, 5] },
};
const GLOW_P = { shaft: 0.09, shaftR: 0.09, wing: 0.08, podium: 0.12, retail: 0.35 };

function boxGeo(x0, x1, y0, y1, z0, z1) {
  return new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0).translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
}
// glass box: per-face vertex colours, and u scaled to the face's length so the mullion texture repeats every 1.5 m
function glassGeo(p, y0, y1) {
  const g = boxGeo(p.x0, p.x1, y0, y1, p.z0, p.z1);
  const col = new Float32Array(24 * 3), uv = g.attributes.uv.array;
  const lens = [p.z1 - p.z0, p.z1 - p.z0, 0, 0, p.x1 - p.x0, p.x1 - p.x0];
  const c = new THREE.Color();
  for (let f = 0; f < 6; f++) {
    c.set(FACES[p.kind].col[f]);
    for (let v = f * 4; v < f * 4 + 4; v++) {
      c.toArray(col, v * 3);
      if (lens[f]) uv[v * 2] *= lens[f] / 1.5; else uv[v * 2] = uv[v * 2 + 1] = 0.5;
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}
const expand = (p, l, lf) => ({ x0: p.x0 - l, x1: p.x1 + l, z0: p.z0 - l, z1: p.z1 + lf });

function mullionTexture() {
  const cv = Object.assign(document.createElement('canvas'), { width: 64, height: 64 });
  const g = cv.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#c2c7cc'; g.fillRect(0, 0, 3, 64); // mullion
  g.fillStyle = '#d3d6d8'; g.fillRect(0, 56, 64, 8); // spandrel band at the slab
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function radialTexture() {
  const cv = Object.assign(document.createElement('canvas'), { width: 128, height: 128 });
  const g = cv.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(20,16,12,.55)'); gr.addColorStop(0.55, 'rgba(20,16,12,.25)'); gr.addColorStop(1, 'rgba(20,16,12,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(cv);
}
// dusk sky dome: also baked into the environment map so the glass picks up the sky
function skyDome() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: { top: { value: new THREE.Color('#1c2539') }, mid: { value: new THREE.Color('#4c5674') },
      horizon: { value: new THREE.Color(HORIZON) }, ground: { value: new THREE.Color(HORIZON) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform vec3 top, mid, horizon, ground; varying vec3 vP;
      void main(){ float h = vP.y;
        vec3 c = h > 0.0 ? mix(mix(horizon, mid, smoothstep(0.0, 0.22, h)), top, smoothstep(0.22, 0.8, h)) : mix(horizon, ground, smoothstep(0.0, 0.08, -h));
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(3000, 32, 16), mat);
}

export function createTower3D(host, { T, label, onPick, onAmenity, amenityLabel }) {
  const plan = towerPlan(T);
  const { floors, roof, J, F, D, PR, PD } = plan;
  const rand = rng(6);

  /* ---------- renderer, scene, lights ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // static scene: render the shadow map once
  renderer.domElement.className = 't3d-canvas';
  host.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const sky = skyDome();
  scene.add(sky);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(skyDome());
  scene.environment = pmrem.fromScene(envScene, 0.02).texture;
  pmrem.dispose();
  scene.fog = new THREE.Fog(HORIZON, 420, 1500); // fog fades the ground into the sky's horizon colour

  scene.add(new THREE.HemisphereLight('#c8d2e4', '#5e5246', 1.0));
  // the hero's sun: warm, low, from the right
  const sun = new THREE.DirectionalLight('#ffbf86', 2.1);
  const cx = (floors[1].parts[0].x0 + PR) / 2, cz = -PD / 2;
  sun.position.set(cx + 420, 150, cz + 140);
  sun.target.position.set(cx, 0, cz);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -170, right: 170, top: 170, bottom: -170, near: 50, far: 1000 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.4;
  scene.add(sun, sun.target);

  /* ---------- building ---------- */
  const mullions = mullionTexture();
  const mat = {
    glass: new THREE.MeshStandardMaterial({ vertexColors: true, map: mullions, roughness: 0.3, metalness: 0.15, envMapIntensity: 0.6 }),
    slab: new THREE.MeshStandardMaterial({ color: C.slab, roughness: 0.75 }),
    podiumSlab: new THREE.MeshStandardMaterial({ color: C.podiumSlab, roughness: 0.7 }),
    cap: new THREE.MeshStandardMaterial({ color: C.cap, roughness: 0.95 }),
    deck: new THREE.MeshStandardMaterial({ color: C.deck, roughness: 0.95 }),
    glow: new THREE.MeshBasicMaterial({ color: C.glow }),
    planter: new THREE.MeshStandardMaterial({ color: C.planter, roughness: 0.9, flatShading: true }),
    gold: new THREE.MeshStandardMaterial({ color: C.gold, emissive: C.goldFill, emissiveIntensity: 0.9, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    goldFill: new THREE.MeshBasicMaterial({ color: C.goldFill, transparent: true, opacity: 0.28, depthWrite: false }),
    goldLine: new THREE.LineBasicMaterial({ color: C.gold }),
  };
  const bucket = { glass: [], slab: [], podiumSlab: [], cap: [], deck: [] };
  const slabGeo = [], glassBand = [], glows = [];

  for (let n = 1; n <= FLOORS; n++) {
    const f = floors[n], podium = n <= 4;
    // slab under floor n; on a terrace step it spans the bigger floor below, so the terrace is its roof
    const under = n >= 6 ? floors[n - 1].parts : f.parts;
    const sg = under.map(p => { const e = podium ? expand(p, 0.15, 0.15) : expand(p, LEDGE, LEDGE_FRONT);
      return boxGeo(e.x0, e.x1, f.y0, f.y0 + (podium ? 0.5 : SLAB), e.z0, e.z1); });
    slabGeo[n] = mergeGeometries(sg);
    bucket[podium ? 'podiumSlab' : 'slab'].push(...sg);
    const gy0 = f.y0 + (podium ? 0.5 : SLAB), gy1 = f.y0 + f.h;
    glassBand[n] = f.parts.map(p => boxGeo(p.x0 - 0.12, p.x1 + 0.12, gy0, gy1, p.z0 - 0.12, p.z1 + 0.12));
    for (const p of f.parts) {
      bucket.glass.push(glassGeo(p, gy0, gy1));
      // warm lit windows on the outside faces
      const gh = (gy1 - gy0) * (p.kind === 'retail' ? 0.75 : 0.62), gyc = gy0 + (gy1 - gy0) * 0.47;
      for (const face of FACES[p.kind].out) {
        const alongX = face >= 4, len = alongX ? p.x1 - p.x0 : p.z1 - p.z0, cnt = Math.floor(len / 3);
        for (let i = 0; i < cnt; i++) {
          if (rand() > GLOW_P[p.kind]) continue;
          const t = (i + 0.5) / cnt;
          const pos = alongX ? [p.x0 + t * len, gyc, face === 4 ? p.z1 + 0.05 : p.z0 - 0.05]
            : [face === 0 ? p.x1 + 0.05 : p.x0 - 0.05, gyc, p.z0 + t * len];
          glows.push({ pos, rotY: [Math.PI / 2, -Math.PI / 2, 0, 0, 0, Math.PI][face], w: len / cnt * 0.62, h: gh });
        }
      }
    }
  }
  // roof plates over floor 39, then the mechanical crown cap on the shaft (no floor inside it)
  for (const p of floors[FLOORS].parts) { const e = expand(p, LEDGE + 0.5, LEDGE_FRONT + 0.4); bucket.slab.push(boxGeo(e.x0, e.x1, roof, roof + 0.9, e.z0, e.z1)); }
  bucket.cap.push(boxGeo(J + 0.3, -0.3, roof + 0.9, roof + 0.9 + CAP_H, -F - 7, -0.3));
  // white vertical fins: at the shaft/wing join on the front, and where the right face steps back
  const y5 = floors[5].y0;
  bucket.slab.push(boxGeo(J - 0.25, J + 0.25, y5, roof, -0.2, LEDGE_FRONT + 0.2), boxGeo(-0.2, LEDGE + 0.4, y5, roof, -F - 0.25, -F + 0.25));
  // podium roof deck (the amenity level sits on it), and retail columns under the recessed base
  const pod = floors[4].parts[0];
  bucket.deck.push(boxGeo(pod.x0 - 0.15, pod.x1 + 0.15, y5, y5 + 0.3, pod.z0 - 0.15, pod.z1 + 0.15));
  const y3 = floors[3].y0;
  for (let x = floors[1].parts[0].x0 + 3; x < PR - 2; x += 7.5) bucket.podiumSlab.push(new THREE.CylinderGeometry(0.45, 0.45, y3, 8).translate(x, y3 / 2, PODIUM_PROUD - 0.6));

  const building = new THREE.Group();
  const meshes = {};
  for (const [k, list] of Object.entries(bucket)) {
    const mesh = new THREE.Mesh(mergeGeometries(list), mat[k]);
    mesh.castShadow = mesh.receiveShadow = true;
    meshes[k] = mesh;
    building.add(mesh);
  }
  const glowMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mat.glow, glows.length);
  const o = new THREE.Object3D();
  glows.forEach((g, i) => { o.position.set(...g.pos); o.rotation.set(0, g.rotY, 0); o.scale.set(g.w, g.h, 1); o.updateMatrix(); glowMesh.setMatrixAt(i, o.matrix); });
  building.add(glowMesh);
  scene.add(building);

  /* ---------- landscape ---------- */
  const trees = [], planters = [];
  const tree = (x, y, z, s) => trees.push({ x, y, z, s });
  const planter = (x0, x1, y, z0, z1, hgt = 0.6) => planters.push({ x: (x0 + x1) / 2, y: y + hgt / 2, z: (z0 + z1) / 2, w: x1 - x0, h: hgt, d: z1 - z0 });
  const yDeck = y5 + 0.3;
  // podium roof: greenery strips on its edges, trees along the rim right of the tower (as in the hero)
  planter(1.5, PR - 0.5, yDeck, pod.z1 - 1.6, pod.z1 - 0.4);
  planter(PR - 1.6, PR - 0.4, yDeck, pod.z0 + 1, pod.z1 - 1.6);
  planter(pod.x0 + 0.5, floors[5].parts[2].x0 - 1.5, yDeck, pod.z1 - 1.6, pod.z1 - 0.4);
  for (let x = 3; x < PR - 2; x += 4.2) tree(x + rand() - 0.5, yDeck, pod.z1 - 3 - rand() * 2, 0.75 + rand() * 0.3);
  for (let z = pod.z1 - 7; z > pod.z0 + 3; z -= 5) tree(PR - 3 - rand(), yDeck, z, 0.7 + rand() * 0.3);
  for (let x = pod.x0 + 2; x < floors[5].parts[2].x0 - 2; x += 4) tree(x, yDeck, pod.z1 - 3, 0.55);
  // terraces: low planting along each stepped roof, and a small tree or two
  for (let n = 5; n < FLOORS; n++) {
    const a = floors[n].parts[2], b = floors[n + 1].parts[2];
    if (a.x0 >= b.x0 - 0.5) continue;
    const y = floors[n + 1].y0 + SLAB;
    planter(a.x0 - 0.4, b.x0 - 0.6, y, a.z1, a.z1 + 1.1, 0.5);
    planter(a.x0 - 0.4, a.x0 + 0.8, y, a.z0, a.z1, 0.5);
    tree(a.x0 + 1.2, y, a.z1 - 1, 0.4);
    if (b.x0 - a.x0 > 4) tree((a.x0 + b.x0) / 2, y, a.z0 + 3, 0.35);
  }
  // ground
  const ground = new THREE.Mesh(new THREE.CircleGeometry(1600, 48).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: C.street, roughness: 1 }));
  ground.receiveShadow = true;
  const plazaPad = 14, px0 = floors[1].parts[0].x0 - plazaPad, px1 = PR + plazaPad, pz0 = pod.z0 - plazaPad, pz1 = pod.z1 + plazaPad;
  const plaza = new THREE.Mesh(boxGeo(px0, px1, 0, 0.08, pz0, pz1), new THREE.MeshStandardMaterial({ color: C.plaza, roughness: 1 }));
  plaza.receiveShadow = true;
  const roadMat = new THREE.MeshStandardMaterial({ color: C.road, roughness: 1 });
  const roadA = new THREE.Mesh(boxGeo(-1400, 1400, 0, 0.1, pz1 + 2, pz1 + 18), roadMat);
  const roadB = new THREE.Mesh(boxGeo(px1 + 4, px1 + 20, 0, 0.1, -1400, 1400), roadMat);
  roadA.receiveShadow = roadB.receiveShadow = true;
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ map: radialTexture(), transparent: true, depthWrite: false }));
  catcher.position.set(cx, 0.12, cz);
  catcher.scale.set(px1 - px0 + 50, 1, pz1 - pz0 + 50);
  scene.add(ground, plaza, roadA, roadB, catcher);
  // street trees on both sides of both roads, and clusters on the ground like the hero's foreground
  const clear = (x, z) => !(x > px0 - 2 && x < px1 + 2 && z > pz0 - 2 && z < pz1 + 2) && !(z > pz1 && z < pz1 + 20) && !(x > px1 + 2 && x < px1 + 22);
  for (let s = -260; s < 260; s += 14) {
    for (const z of [pz1 - 0.5, pz1 + 20.5]) if (rand() < 0.7) tree(cx + s + rand() * 3, 0, z, 0.75 + rand() * 0.3);
    for (const x of [px1 + 2, px1 + 22]) if (rand() < 0.7) tree(x, 0, cz + s + rand() * 3, 0.75 + rand() * 0.3);
  }
  for (const [qx, qz, cnt] of [[px0 - 25, pz1 + 45, 9], [px0 - 10, pz1 + 85, 6], [px1 + 55, pz1 + 50, 6], [px0 - 40, pz0 - 20, 6], [px1 + 50, pz0 - 30, 6]]) {
    for (let i = 0; i < cnt; i++) { const x = qx + (rand() - 0.5) * 45, z = qz + (rand() - 0.5) * 40; if (clear(x, z)) tree(x, 0, z, 0.8 + rand() * 0.4); }
  }
  const crowns = [];
  const trunkMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22, 0.32, 1, 5).translate(0, 0.5, 0), new THREE.MeshStandardMaterial({ color: C.trunk, roughness: 1 }), trees.length);
  trees.forEach((t, i) => {
    o.position.set(t.x, t.y, t.z); o.rotation.set(0, 0, 0); o.scale.set(t.s, 3.2 * t.s, t.s); o.updateMatrix(); trunkMesh.setMatrixAt(i, o.matrix);
    const k = 2 + (rand() < 0.5 ? 1 : 0);
    for (let j = 0; j < k; j++) crowns.push({ x: t.x + (rand() - 0.5) * 1.6 * t.s, y: t.y + (3.4 + j * 1.5 + rand() * 0.6) * t.s, z: t.z + (rand() - 0.5) * 1.6 * t.s, r: (2.1 - j * 0.45) * t.s });
  });
  const crownMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ roughness: 0.95, flatShading: true }), crowns.length);
  const green = new THREE.Color();
  crowns.forEach((c, i) => {
    o.position.set(c.x, c.y, c.z); o.rotation.set(rand() * 3, rand() * 3, 0); o.scale.setScalar(c.r); o.updateMatrix(); crownMesh.setMatrixAt(i, o.matrix);
    crownMesh.setColorAt(i, green.setHSL(0.24 + rand() * 0.07, 0.28 + rand() * 0.12, 0.22 + rand() * 0.08));
  });
  const planterMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat.planter, planters.length);
  planters.forEach((p, i) => { o.position.set(p.x, p.y, p.z); o.rotation.set(0, 0, 0); o.scale.set(p.w, p.h, p.d); o.updateMatrix(); planterMesh.setMatrixAt(i, o.matrix); });
  for (const m of [trunkMesh, crownMesh, planterMesh]) { m.castShadow = true; m.receiveShadow = true; scene.add(m); }
  // anonymous context masses in the distance (not models of real buildings)
  const ctxMat = new THREE.MeshStandardMaterial({ color: '#8b9097', roughness: 1, transparent: true, opacity: 0.28, depthWrite: false });
  const ctx = [];
  for (let i = 0; i < 11; i++) {
    const a = i / 11 * Math.PI * 2 + rand() * 0.4, r = 420 + rand() * 420, w = 25 + rand() * 30, d = 20 + rand() * 25, hgt = 10 + rand() * 40;
    ctx.push(boxGeo(-w / 2, w / 2, 0, hgt, -d / 2, d / 2).rotateY(rand() * Math.PI).translate(cx + Math.cos(a) * r, 0, cz + Math.sin(a) * r));
  }
  scene.add(new THREE.Mesh(mergeGeometries(ctx), ctxMat));

  /* ---------- amenity pin (Level 5, on the podium roof) ---------- */
  const pinBase = new THREE.Vector3(PR * 0.55, yDeck, pod.z1 - 12);
  const pinTop = pinBase.clone().setY(yDeck + 9);
  const pinMat = new THREE.MeshStandardMaterial({ color: C.pin, emissive: C.pin, emissiveIntensity: 0.5 });
  const pin = new THREE.Group();
  pin.add(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 9, 6).translate(0, 4.5, 0), pinMat), new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12).translate(0, 9, 0), pinMat));
  pin.position.copy(pinBase);
  pin.traverse(m => { m.userData.amenity = true; });
  scene.add(pin);
  const pinBtn = Object.assign(document.createElement('button'), { type: 'button', className: 't3d-pin', textContent: amenityLabel });
  pinBtn.addEventListener('click', onAmenity);
  const chip = Object.assign(document.createElement('span'), { className: 'floor-chip', hidden: true });
  host.append(chip, pinBtn);

  /* ---------- selection highlight ---------- */
  const hiSlab = new THREE.Mesh(undefined, mat.gold);
  const hiFill = new THREE.Mesh(undefined, mat.goldFill);
  const hiLine = new THREE.LineSegments(undefined, mat.goldLine);
  hiSlab.visible = hiFill.visible = hiLine.visible = false;
  hiFill.renderOrder = 2;
  scene.add(hiSlab, hiFill, hiLine);
  let floor = 0;
  function setFloor(n) {
    floor = n || 0;
    const on = floor >= 1 && floor <= FLOORS;
    hiSlab.visible = hiFill.visible = hiLine.visible = on;
    if (!on) { chip.hidden = true; return; }
    hiSlab.geometry = slabGeo[floor];
    hiFill.geometry.dispose?.();
    hiFill.geometry = mergeGeometries(glassBand[floor]);
    hiLine.geometry.dispose?.();
    hiLine.geometry = mergeGeometries(glassBand[floor].map(g => new THREE.EdgesGeometry(g)));
    chip.textContent = label(floor);
    chip.hidden = false;
  }
  hiFill.geometry = new THREE.BufferGeometry();
  hiLine.geometry = new THREE.BufferGeometry();

  /* ---------- camera + controls ---------- */
  const H = roof + 0.9 + CAP_H;
  const center = new THREE.Vector3(cx, H * 0.45, cz);
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 5000);
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, screenSpacePanning: true, minDistance: 40, maxDistance: 700,
    minPolarAngle: 0.12, maxPolarAngle: Math.PI / 2 - 0.04, rotateSpeed: 0.7, autoRotateSpeed: 0.45 });
  controls.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  // slow auto-rotate until the first pointer interaction, then never again
  controls.addEventListener('start', () => { controls.autoRotate = false; });
  // panning stays near the building and above the ground
  controls.addEventListener('change', () => {
    const t = controls.target;
    t.y = THREE.MathUtils.clamp(t.y, 2, H);
    const dx = t.x - cx, dz = t.z - cz, r = Math.hypot(dx, dz);
    if (r > 120) { t.x = cx + dx * 120 / r; t.z = cz + dz * 120 / r; }
  });
  // wheel at a zoom limit scrolls the page instead of being swallowed (no scroll trap)
  host.addEventListener('wheel', e => {
    if (e.ctrlKey) return;
    const d = camera.position.distanceTo(controls.target);
    if ((e.deltaY > 0 && d >= controls.maxDistance * 0.99) || (e.deltaY < 0 && d <= controls.minDistance * 1.01)) e.stopPropagation();
  }, { capture: true });

  function view(azimuthDeg = 45) {
    const a = THREE.MathUtils.degToRad(azimuthDeg), el = THREE.MathUtils.degToRad(7);
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dist = Math.max(H * 0.58 / tanV, 62 / (tanV * camera.aspect)); // whole tower + podium in frame, also on a phone
    controls.target.copy(center);
    camera.position.set(cx + Math.sin(a) * Math.cos(el) * dist, center.y + Math.sin(el) * dist, cz + Math.cos(a) * Math.cos(el) * dist);
    controls.update();
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return false;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    return true;
  }
  let framed = false;
  new ResizeObserver(() => { if (resize() && !framed) { framed = true; view(); } }).observe(host);

  /* ---------- picking: a tap (not a drag) selects the floor under it ---------- */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  const pickables = [meshes.glass, meshes.slab, meshes.podiumSlab, meshes.deck, meshes.cap, pin];
  const floorAtY = y => { for (let n = 1; n <= FLOORS; n++) { const f = floors[n]; if (y >= f.y0 - 0.01 && y < f.y0 + f.h) return n; } return 0; };
  const hitAt = (clientX, clientY) => {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    camera.updateMatrixWorld();
    ray.setFromCamera(ptr, camera);
    return ray.intersectObjects(pickables, true)[0];
  };
  const pointers = new Map();
  let gesture = null;
  const el = renderer.domElement;
  el.addEventListener('pointerdown', e => {
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 1) gesture = { x: e.clientX, y: e.clientY, multi: false, moved: false };
    else if (gesture) gesture.multi = true;
  });
  el.addEventListener('pointermove', e => {
    if (gesture && pointers.has(e.pointerId) && Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) > 6) gesture.moved = true;
    if (e.pointerType === 'mouse' && !pointers.size) { const h = hitAt(e.clientX, e.clientY); el.style.cursor = h && h.object !== meshes.cap ? 'pointer' : 'grab'; }
  });
  const up = e => {
    if (!pointers.delete(e.pointerId)) return;
    const g = gesture;
    if (pointers.size) return;
    gesture = null;
    if (e.type !== 'pointerup' || !g || g.multi || g.moved) return; // a rotate / pan / pinch never selects
    const hit = hitAt(e.clientX, e.clientY);
    if (!hit) return;
    if (hit.object.userData.amenity) return onAmenity();
    if (hit.object === meshes.cap) return; // the crown cap has no floor
    const n = floorAtY(hit.point.y);
    if (n) onPick(n);
  };
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);

  /* ---------- overlays + loop ---------- */
  const v = new THREE.Vector3();
  const toScreen = p => { v.copy(p).project(camera); return [(v.x + 1) / 2 * host.clientWidth, (1 - v.y) / 2 * host.clientHeight, v.z < 1]; };
  let frame = 0;
  function overlays() {
    const [px, py, ok] = toScreen(pinTop);
    pinBtn.hidden = !ok;
    pinBtn.style.transform = `translate(${Math.round(px)}px, ${Math.round(py)}px) translate(-50%, calc(-100% - 6px))`;
    if (frame++ % 10 === 0) { // fade the pin label when the tower is in front of it
      ray.set(camera.position, v.copy(pinTop).sub(camera.position).normalize());
      const hit = ray.intersectObjects([meshes.glass, meshes.slab, meshes.cap], false)[0];
      pinBtn.classList.toggle('behind', !!hit && hit.distance < camera.position.distanceTo(pinTop) - 1);
    }
    if (floor) {
      // chip beside the selected floor: at its outermost glass corner that faces the camera
      const f = floors[floor];
      let best = null;
      for (const p of f.parts) for (const x of [p.x0, p.x1]) for (const z of [p.z0, p.z1]) {
        const [sx, sy, vis] = toScreen(v.set(x, f.y0 + f.h / 2, z));
        if (vis && (!best || sx < best[0])) best = [sx, sy];
      }
      if (best) { chip.style.left = `${Math.max(best[0], 4)}px`; chip.style.top = `${best[1]}px`; chip.classList.toggle('inside', best[0] < chip.offsetWidth + 10); }
    }
  }
  let wanted = false, onScreen = true, running = false;
  const tick = () => { controls.update(); renderer.render(scene, camera); overlays(); };
  const sync = () => {
    const go = wanted && onScreen;
    if (go === running) return;
    running = go;
    renderer.setAnimationLoop(go ? tick : null);
  };
  new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; sync(); }).observe(host);
  renderer.shadowMap.needsUpdate = true;

  const api = {
    setFloor,
    start() { resize(); wanted = true; sync(); },
    stop() { wanted = false; sync(); },
    view,
    // viewport coordinates of a floor's front-face centre (used by the verification script)
    camera, controls,
    info: () => ({ ...renderer.info.render }),
    floorPoint(n) {
      const f = floors[n], p = f.parts[0], r = el.getBoundingClientRect();
      camera.updateMatrixWorld();
      const [x, y] = toScreen(v.set((p.x0 + p.x1) / 2, f.y0 + f.h / 2, p.z1 + 0.2));
      return { x: r.left + x, y: r.top + y };
    },
    plan,
  };
  host.tower3d = api; // handle for devtools and the verification script
  return api;
}
