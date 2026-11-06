// Dollhouse 3D model of the whole Level 5 amenity floor: the Amenities section's second view.
// Geometry comes from AMENITY_FLOOR (amenityFloor.js), traced from the published bird's-eye plan;
// names / numbers / photos come from AMENITIES (data.js). Rooms are stylized low-poly, in the unit
// viewer's style (viewer3d.js) — no photo is used as a texture.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const WALL_H = 1.2, WALL_T = 0.15, CORE_H = 1.5, GUARD_H = 1.0;
const FINISH = {
  oak: '#cfa97a', maple: '#e0c9a0', stone: '#dcd6cd', carpet: '#b9b4ad', kids: '#e3cfa6',
  rubber: '#3a3c40', deck: '#a0603a', soil: '#6b5844', turf: '#6fae4a', pavers: '#e6e0d6',
};
const C = { plate: '#e9e4db', interior: '#d3cec6', corridor: '#aaa59d', wall: '#fbfaf8', core: '#f4f2ee', black: '#1f1f21', dark: '#2c2d30',
  hedge: '#557a3c', lavender: '#7d6aa8', trunk: '#6a5040', canopy: '#5d8a45', sel: '#ff9d2e' };

const mats = {};
const m = (color, extra) => (mats[color + (extra ? JSON.stringify(extra) : '')] ??= new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra }));
const glass = () => m('#bcd6e4', { transparent: true, opacity: 0.3, roughness: 0.1, depthWrite: false });
const shade = o => { o.castShadow = o.receiveShadow = !o.material.transparent; return o; };
function box(w, h, d, color, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof color === 'string' ? m(color) : color);
  o.position.set(x, y + h / 2, z);
  return shade(o);
}
function cyl(r, h, color, x = 0, y = 0, z = 0, seg = 20) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), m(color));
  o.position.set(x, y + h / 2, z);
  return shade(o);
}
function ball(r, color, x = 0, y = 0, z = 0, sy = 1) {
  const o = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m(color));
  o.position.set(x, y + r * sy, z);
  o.scale.y = sy;
  return shade(o);
}
// seating: seat height s, back height b, back at −z
const seat = (w, d, c, s = 0.42, b = 0.82, arms = true) => [box(w, s, d, c), box(w, b - s, 0.18, c, 0, s, -d / 2 + 0.09),
  ...(arms ? [box(0.16, 0.2, d, c, -w / 2 + 0.08, s), box(0.16, 0.2, d, c, w / 2 - 0.08, s)] : [])];
const tableOn = (w, d, c, h = 0.74) => [box(w, 0.05, d, c, 0, h - 0.05), box(Math.min(w, d) * 0.25, h - 0.05, Math.min(w, d) * 0.25, C.dark)];

/* Furniture in local metres: w along x, d along z, back at −z. c = optional colour. */
const BUILD = {
  rubber: (w, d) => [box(w, 0.015, d, '#2a2b2e')],
  treadmill: (w, d) => [box(w, 0.22, d, C.black), box(w * 0.7, 0.02, d * 0.8, '#3b3c40', 0, 0.22, 0.05), box(0.06, 1.2, 0.06, C.black, -w / 2 + 0.05, 0, -d / 2 + 0.1),
    box(0.06, 1.2, 0.06, C.black, w / 2 - 0.05, 0, -d / 2 + 0.1), box(w, 0.25, 0.22, '#111', 0, 1.15, -d / 2 + 0.12)],
  elliptical: (w, d) => [box(w * 0.6, 0.25, d, C.black), box(0.12, 1.5, 0.12, '#55585d', 0, 0, -d / 2 + 0.15), box(w, 0.06, 0.4, '#55585d', 0, 0.35, 0.1)],
  spin: (w, d) => {
    const wheel = cyl(0.27, 0.07, '#c4262e', 0, 0, 0, 24); wheel.rotation.z = Math.PI / 2; wheel.position.set(0, 0.3, -d / 2 + 0.25);
    const hub = cyl(0.2, 0.09, '#b8bcc0', 0, 0, 0, 20); hub.rotation.z = Math.PI / 2; hub.position.set(0, 0.3, -d / 2 + 0.25);
    return [box(w, 0.06, d, C.black), box(0.07, 0.9, 0.07, C.black, 0, 0, 0.1), box(0.18, 0.06, 0.3, C.black, 0, 0.9, 0.15), box(0.07, 1.0, 0.07, C.black, 0, 0, -d / 2 + 0.45), box(0.4, 0.05, 0.08, C.black, 0, 1.0, -d / 2 + 0.45), wheel, hub];
  },
  machine: (w, d) => [box(w, 0.08, d, C.black), box(0.14, 1.9, 0.14, '#4a4c50', -w / 2 + 0.12, 0, 0), box(w * 0.5, 0.45, d * 0.6, '#2b2b2b', w * 0.15, 0, 0), box(0.25, 0.9, 0.2, '#6a6d72', -w / 2 + 0.3, 0.1, 0)],
  flatbench: (w, d) => [box(w, 0.45, d, '#222')],
  dbrack: (w, d) => [box(w, 0.75, d, '#2a2a2a'), ...[-0.3, 0, 0.3].map(z => box(w * 0.8, 0.12, d * 0.25, '#555', 0, 0.75, z * d))],
  rack: (w, d) => {
    const posts = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => box(0.08, 2.2, 0.08, '#1b1b1b', a * (w / 2 - 0.05), 0, b * (d / 2 - 0.05)));
    const bar = cyl(0.02, w + 0.4, '#9aa0a6', 0, 0, 0); bar.rotation.z = Math.PI / 2; bar.position.y = 1.3;
    const plates = [-1, 1].map(s => { const p = cyl(0.22, 0.06, '#111', 0, 0, 0); p.rotation.z = Math.PI / 2; p.position.set(s * (w / 2 + 0.12), 1.3, 0); return p; });
    return [...posts, box(w, 0.08, d, '#1b1b1b', 0, 2.2), bar, ...plates];
  },
  bench: (w, d, c = '#222') => [box(w, 0.45, d, c)],
  platform: (w, d) => [box(w, 0.05, d, '#1b1b1b'), box(0.12, 0.06, d, '#e07a2f', w / 2 - 0.06)],
  cabinetwall: (w, d) => [box(w, WALL_H, d, '#c9a273')], // full-height oak wall in the photo; cut at wall height
  plant: w => [cyl(w * 0.4, 0.4, '#3b3b3b'), ball(w * 0.6, '#4f7d3a', 0, 0.35, 0, 1.4)],
  mat: (w, d, c = '#26272a') => [box(w, 0.012, d, c)],
  mirror: (w, d) => [box(w, 1.15, d, '#e4ecf0')],
  glasswall: (w, d) => [box(w, WALL_H, d, glass())],
  ball: w => [ball(w * 0.45, '#e8d9c0')],
  lounger: (w, d) => { const back = box(w, 0.08, 0.7, '#f4f1ea', 0, 0.38, -d / 2 + 0.3); back.rotation.x = 0.7; return [box(w, 0.32, d, '#f4f1ea'), back]; },
  sidetable: w => [cyl(w / 2, 0.45, '#3d3f42')],
  bistro: w => [...tableOn(w * 0.7, w * 0.7, '#4a4c50'), ...[0, 1, 2, 3].map(i => { const a = i * Math.PI / 2; return box(0.4, 0.45, 0.4, '#4a4c50', Math.cos(a) * w * 0.75, 0, Math.sin(a) * w * 0.75); })],
  planterbed: (w, d, c) => [box(w, 0.35, d, '#7a6a58'), box(w * 0.86, 0.22, d * 0.86, c, 0, 0.35)],
  flag: () => [cyl(0.09, 0.01, '#111'), cyl(0.012, 1.3, '#f2f2f2'), box(0.02, 0.18, 0.28, '#d33', 0, 1.1, 0.14)],
  bocce: (w, d, c) => [ball(0.06, c)],
  pergola: (w, d) => {
    const o = [];
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1], [-1, 0], [1, 0]]) o.push(box(0.15, 2.6, 0.15, '#3a3633', a * (w / 2 - 0.1), 0, b * (d / 2 - 0.1)));
    o.push(box(0.15, 0.2, d, '#3a3633', -w / 2 + 0.1, 2.6), box(0.15, 0.2, d, '#3a3633', w / 2 - 0.1, 2.6));
    for (let z = -d / 2 + 0.2; z <= d / 2; z += 0.38) o.push(box(w, 0.12, 0.06, '#efeae2', 0, 2.8, z));
    return o;
  },
  sofa: (w, d, c = '#d8d1c6') => seat(w, d, c),
  armchair: (w, d, c = '#ece7df') => seat(w, d, c),
  banquette: (w, d, c) => seat(w, d, c, 0.45, 0.9, false),
  firepit: (w, d) => [box(w, 0.42, d, '#5a5550'), box(w * 0.7, 0.06, d * 0.35, m('#ff9a3c', { emissive: '#ff7a1a', emissiveIntensity: 1.2 }), 0, 0.42)],
  coffee: (w, d, c = '#8a6a4c') => [box(w, 0.4, d, c)],
  bbq: (w, d) => [box(w, 0.9, d, '#9aa0a6'), box(w * 0.9, 0.05, d * 0.8, '#2a2a2a', 0, 0.9)],
  longtable: (w, d) => [box(w, 0.05, d, '#3a3b3d', 0, 0.7), box(0.08, 0.7, d * 0.8, '#3a3b3d', -w / 2 + 0.2), box(0.08, 0.7, d * 0.8, '#3a3b3d', w / 2 - 0.2)],
  table: (w, d, c = '#a9835c') => tableOn(w, d, c),
  round: (w, d, c = '#efece8') => [cyl(w / 2, 0.05, c, 0, 0.7), cyl(0.08, 0.7, C.dark)],
  kidtable: (w, d, c) => Math.abs(w - d) < 0.05 ? [cyl(w / 2, 0.04, c, 0, 0.5), cyl(0.06, 0.5, '#fbfaf8')] : tableOn(w, d, c, 0.55),
  chair: (w, d, c = '#e3ddd3') => seat(w, d, c, 0.45, 0.85, false),
  rug: (w, d, c) => [box(w, 0.012, d, c)],
  pooltable: (w, d) => [box(w, 0.72, d, '#6e4a2e'), box(w * 0.84, 0.04, d * 0.9, '#3f7d3a', 0, 0.72)],
  foosball: (w, d) => {
    const rods = [-0.3, -0.1, 0.1, 0.3].map(f => { const r = cyl(0.015, d * 1.25, '#c0c4c8', 0, 0, 0, 8); r.rotation.x = Math.PI / 2; r.position.set(f * w, 0.95, 0); return r; });
    return [box(w, 0.85, d, '#c9b08a'), box(w * 0.9, 0.02, d * 0.85, '#3f7d3a', 0, 0.85), ...rods];
  },
  tub: (w, d, c) => [cyl(w / 2, 0.42, c), box(w, 0.32, 0.12, c, 0, 0.42, -d / 2 + 0.06)],
  bar: (w, d) => [box(w, 1.05, d, '#ece9e4'), box(w + 0.08, 0.05, d + 0.08, '#f8f7f5', 0, 1.05)],
  stool: (w, d, c = '#5a4a3a') => [cyl(0.03, 0.75, '#2b2b2b'), cyl(w / 2, 0.06, c, 0, 0.72)],
  pouf: (w, d, c) => [cyl(w / 2, 0.32, c)],
  curvesofa: (w, d, c) => { // C-shaped sofa opening west (−x)
    const r = d / 2 - 0.35, o = [];
    for (let a = -80; a <= 80; a += 20) {
      const t = a * Math.PI / 180, g = new THREE.Group();
      g.add(box(0.75, 0.42, 0.7 * r * 0.4 + 0.25, c), box(0.18, 0.4, 0.7 * r * 0.4 + 0.25, c, 0.3, 0.42));
      g.position.set(Math.cos(t) * r - w / 2 + 0.4, 0, Math.sin(t) * r);
      g.rotation.y = -t;
      o.push(g);
    }
    return o;
  },
  console: (w, d) => [box(w, 0.8, d, '#ece8e2')],
  desk: (w, d) => [box(w, 0.04, d, '#fbfaf8', 0, 0.72), box(w, 0.72, 0.04, '#fbfaf8', 0, 0, -d / 2 + 0.02)],
  partition: (w, d) => [box(w, 1.25, d, '#8a5a3a')],
  pod: (w, d) => [box(w, 1.6, 0.08, '#9a6740', 0, 0, -d / 2 + 0.04), box(0.08, 1.6, d, '#9a6740', -w / 2 + 0.04), box(0.08, 1.6, d, '#9a6740', w / 2 - 0.04),
    box(w * 0.8, 0.04, 0.45, '#fbfaf8', 0, 0.72, -d / 2 + 0.3), ...seat(0.42, 0.42, '#3a3b3d', 0.45, 0.85, false).map(o => (o.position.z += 0.1, o))],
  curvewall: (w, d) => [box(w, WALL_H, d, glass()), box(w, 0.05, d, '#1b1b1b', 0, WALL_H)],
  counter: (w, d) => [box(w, 0.9, d, '#ece8e2'), box(w + 0.04, 0.04, d + 0.04, '#f7f5f2', 0, 0.9)],
  nightstand: (w, d) => [box(w, 0.55, d, '#b48a5f')],
  bed: (w, d) => [box(w, 0.5, d, '#fbfaf8'), box(w, 1.1, 0.12, '#55575b', 0, 0, -d / 2 + 0.06), box(w - 0.1, 0.06, d * 0.4, '#8b8d91', 0, 0.5, d * 0.25)],
  vanity: (w, d) => [box(w, 0.85, d, '#efebe6')],
  wc: (w, d) => [box(w, 0.42, d, '#fbfbfa')],
  tubbath: (w, d) => [box(w, 0.55, d, '#fbfbfa'), box(w - 0.15, 0.01, d - 0.15, '#dfe8ec', 0, 0.55)],
  stroller: (w, d) => [box(w, 0.25, d * 0.8, '#2a2a2a', 0, 0.25), box(w, 0.35, d * 0.4, '#3a3a3a', 0, 0.5, -d * 0.2), ...[-1, 1].flatMap(s => [-1, 1].map(t => cyl(0.08, 0.05, '#111', s * w * 0.4, 0, t * d * 0.35)))],
  beanbag: (w, d, c) => [ball(w / 2, c, 0, 0, 0, 0.6)],
  craft: (w, d) => [box(w, 0.6, d, '#fbfaf8'), ...['#f4a6c8', '#a6d8f4', '#c8e6a0', '#f7e09a', '#c77fd1'].map((c, i) => box(0.12, 0.08, 0.12, c, -w / 2 + 0.2 + i * (w - 0.3) / 4, 0.6))],
  shelf: (w, d) => [box(w, 1.1, d, '#c9a273')],
};
const BACK_ANGLE = { n: 0, e: -Math.PI / 2, s: Math.PI, w: Math.PI / 2 };

export function createAmenity3D(host, { F, spaces, onPick }) {
  const S = 1 / F.pxPerM;
  const xs = F.plate.map(p => p[0]), ys = F.plate.map(p => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const W = (Math.max(...xs) - Math.min(...xs)) * S, D = (Math.max(...ys) - Math.min(...ys)) * S;
  const X = px => (px - cx) * S, Z = py => (py - cy) * S;
  const V2 = ([x, y]) => new THREE.Vector2(X(x), -Z(y));

  /* ---------- renderer, scene, lights ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false; // static scene
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.className = 'a3d-canvas';
  host.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f3f1ed');
  scene.add(new THREE.HemisphereLight('#ffffff', '#e8dccb', 2.2));
  const sun = new THREE.DirectionalLight('#fff4e5', 2.4);
  sun.position.set(-18, 40, -22);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 120 });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  const root = new THREE.Group();
  scene.add(root);
  const pickables = [];
  let sizes = {}; // per label chip (and its selected state): [full width, number width, height], measured once shown

  // flat slab from a pixel polygon: top at y, thickness t
  function slab(poly, color, y, t = 0.05) {
    const geo = new THREE.ExtrudeGeometry(new THREE.Shape(poly.map(V2)), { depth: t, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, y - t, 0);
    const o = new THREE.Mesh(geo, typeof color === 'string' ? m(color) : color);
    o.receiveShadow = true;
    root.add(o);
    return o;
  }
  function wallsAround(poly, h, color, userData) {
    poly.forEach((a, i) => {
      const b = poly[(i + 1) % poly.length];
      const ax = X(a[0]), az = Z(a[1]), bx = X(b[0]), bz = Z(b[1]);
      const o = box(Math.hypot(bx - ax, bz - az) + WALL_T, h, WALL_T, color, (ax + bx) / 2, 0.06, (az + bz) / 2);
      o.rotation.y = -Math.atan2(bz - az, bx - ax);
      Object.assign(o.userData, userData);
      root.add(o);
      if (userData) pickables.push(o);
    });
  }
  function place(parts, x, y, back, space) {
    const g = new THREE.Group();
    g.add(...parts);
    g.position.set(X(x), 0.06, Z(y));
    g.rotation.y = BACK_ANGLE[back] ?? 0;
    if (space) { g.traverse(o => { o.userData.space = space; }); pickables.push(g); }
    root.add(g);
    return g;
  }
  function item([type, x, y, w, d, back, c], space) {
    const [lw, ld] = back === 'e' || back === 'w' ? [d * S, w * S] : [w * S, d * S];
    return place(BUILD[type](lw, ld, c ?? undefined), x, y, back, space);
  }

  /* ---------- plate, building, cores ---------- */
  slab(F.plate, C.plate, 0, 0.35);
  slab(F.building, C.interior, 0.02);
  F.corridors.forEach(p => slab(p, C.corridor, 0.035));
  for (const c of F.cores) {
    const geo = new THREE.ExtrudeGeometry(new THREE.Shape(c.poly.map(V2)), { depth: CORE_H, bevelEnabled: false }).rotateX(-Math.PI / 2);
    const o = new THREE.Mesh(geo, [m(c.top ?? C.core), m(C.core)]);
    o.castShadow = o.receiveShadow = true;
    root.add(o);
  }
  // terrace guard (glass) on the plate edge
  F.guard.forEach((a, i) => {
    const b = F.guard[i + 1];
    if (!b) return;
    const ax = X(a[0]), az = Z(a[1]), bx = X(b[0]), bz = Z(b[1]);
    const o = box(Math.hypot(bx - ax, bz - az), GUARD_H, 0.05, glass(), (ax + bx) / 2, 0, (az + bz) / 2);
    o.rotation.y = -Math.atan2(bz - az, bx - ax);
    root.add(o);
  });

  /* ---------- unnumbered terrace landscape ---------- */
  const T = F.terrace;
  T.decks.forEach(p => slab(p, FINISH.deck, 0.08, 0.08));
  T.hedges.forEach(([x0, y0, x1, y1]) => root.add(box((x1 - x0) * S, 0.7, (y1 - y0) * S, C.hedge, X((x0 + x1) / 2), 0, Z((y0 + y1) / 2))));
  T.lavender.forEach(([x0, y0, x1, y1]) => root.add(box((x1 - x0) * S, 0.45, (y1 - y0) * S, C.lavender, X((x0 + x1) / 2), 0, Z((y0 + y1) / 2))));
  T.sets.forEach(([x, y]) => place(BUILD.bistro(34 * S), x, y));
  T.trees.forEach(([x, y, r]) => place([cyl(0.12, 1.6, C.trunk), ball(r * S * 0.85, C.canopy, 0, 1.3, 0, 0.8)], x, y));

  /* ---------- the 18 spaces ---------- */
  const floorMeshes = {}, rims = {}, labelAt = {};
  const rimMat = new THREE.MeshBasicMaterial({ color: C.sel });
  function rim(poly, y) {
    const g = new THREE.Group();
    poly.forEach((a, i) => {
      const b = poly[(i + 1) % poly.length];
      const ax = X(a[0]), az = Z(a[1]), bx = X(b[0]), bz = Z(b[1]);
      const o = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(bx - ax, bz - az) + 0.3, 0.1, 0.3), rimMat);
      o.position.set((ax + bx) / 2, y + 0.05, (az + bz) / 2);
      o.rotation.y = -Math.atan2(bz - az, bx - ax);
      g.add(o);
    });
    g.visible = false;
    root.add(g);
    return g;
  }
  for (const sp of spaces) {
    const def = F.spaces[sp.n];
    floorMeshes[sp.n] = def.polys.map((poly, k) => {
      const finish = FINISH[def.finishes?.[k] ?? def.finish];
      const mesh = slab(poly, new THREE.MeshStandardMaterial({ color: finish, roughness: 0.8 }), def.kind === 'outdoor' ? 0.09 : 0.06, 0.04);
      mesh.userData.space = sp.n;
      pickables.push(mesh);
      if (def.kind === 'indoor') wallsAround(poly, WALL_H, C.wall, { space: sp.n });
      (rims[sp.n] ??= []).push(rim(poly, def.kind === 'indoor' ? WALL_H + 0.06 : 0.12));
      return mesh;
    });
    labelAt[sp.n] = def.labels ?? [[sp.x / 100 * F.w, sp.y / 100 * F.h]];
    (F.items[sp.n] ?? []).forEach(it => item(it, sp.n));
  }

  /* ---------- labels: number chip (the plan's numbering) + name ---------- */
  const layer = document.createElement('div');
  layer.className = 'a3d-labels';
  host.append(layer);
  const chips = [];
  for (const sp of spaces) labelAt[sp.n].forEach(([x, y]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'a3d-chip';
    b.dataset.n = sp.n;
    b.setAttribute('aria-label', `${sp.n}. ${sp.name}`);
    b.innerHTML = `<b>${sp.n}</b><span>${sp.name}</span>`;
    b.addEventListener('click', () => onPick(sp.n - 1));
    layer.append(b);
    chips.push({ el: b, p: new THREE.Vector3(X(x), 1.7, Z(y)) });
  });

  /* ---------- camera + controls (rotate / zoom / pan only) ---------- */
  const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 400);
  const controls = new OrbitControls(camera, renderer.domElement);
  const R = Math.hypot(W, D) / 2;
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, screenSpacePanning: true, minDistance: 8, maxDistance: R * 4,
    maxPolarAngle: Math.PI / 2 - 0.06, rotateSpeed: 0.7 });
  controls.addEventListener('change', () => { // keep the target on the plate
    const t = controls.target;
    t.x = THREE.MathUtils.clamp(t.x, -W / 2, W / 2); t.z = THREE.MathUtils.clamp(t.z, -D / 2, D / 2); t.y = THREE.MathUtils.clamp(t.y, 0, 6);
  });
  host.addEventListener('wheel', e => { // at a zoom limit the wheel scrolls the page
    const d = camera.position.distanceTo(controls.target);
    if ((e.deltaY > 0 && d >= controls.maxDistance * 0.99) || (e.deltaY < 0 && d <= controls.minDistance * 1.01)) e.stopPropagation();
  }, { capture: true });

  function view(top = false) {
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    controls.target.set(0, 0, 0);
    if (top) { // straight down, image orientation (x right, plan "up" up)
      const dist = Math.max(D * 0.53 / tanV, W * 0.53 / (tanV * camera.aspect));
      camera.position.set(0, dist, 0.001);
    } else { // from the plan's lower-left corner, ~50° down
      const dist = Math.max(D * 0.72 / tanV, W * 0.62 / (tanV * camera.aspect));
      camera.position.set(-dist * 0.38, dist * 0.78, dist * 0.5);
    }
    controls.update();
  }
  function resize() {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return false;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    host.classList.toggle('narrow', w < 640);
    sizes = {}; // chip widths change with the narrow layout
    return true;
  }
  let framed = false;
  new ResizeObserver(() => { if (resize() && !framed) { framed = true; view(); } }).observe(host);

  /* ---------- picking: a tap (not a drag) selects the space under it ---------- */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  const hitAt = (clientX, clientY) => {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    camera.updateMatrixWorld();
    ray.setFromCamera(ptr, camera);
    return ray.intersectObjects(pickables, true).find(h => h.object.userData.space)?.object.userData.space;
  };
  const el = renderer.domElement, pointers = new Set();
  let gesture = null;
  el.addEventListener('pointerdown', e => {
    pointers.add(e.pointerId);
    gesture = pointers.size === 1 ? { x: e.clientX, y: e.clientY, moved: false, multi: false } : gesture && { ...gesture, multi: true };
  });
  el.addEventListener('pointermove', e => {
    if (gesture && pointers.has(e.pointerId) && Math.hypot(e.clientX - gesture.x, e.clientY - gesture.y) > 6) gesture.moved = true;
    if (e.pointerType === 'mouse' && !pointers.size) el.style.cursor = hitAt(e.clientX, e.clientY) ? 'pointer' : 'grab';
  });
  const up = e => {
    if (!pointers.delete(e.pointerId) || pointers.size) return;
    const g = gesture;
    gesture = null;
    if (e.type !== 'pointerup' || !g || g.multi || g.moved) return; // rotate / pan / pinch never selects
    const n = hitAt(e.clientX, e.clientY);
    if (n) onPick(n - 1);
  };
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);

  /* ---------- selection ---------- */
  let selected = 0;
  function select(i) {
    const n = i == null ? 0 : i + 1;
    if (selected) { floorMeshes[selected].forEach(o => o.material.emissive.set(0)); rims[selected].forEach(g => { g.visible = false; }); }
    selected = n;
    if (n) { floorMeshes[n].forEach(o => o.material.emissive.set(C.sel).multiplyScalar(0.35)); rims[n].forEach(g => { g.visible = true; }); }
    chips.forEach(c => c.el.classList.toggle('sel', +c.el.dataset.n === n));
  }

  /* ---------- loop ---------- */
  const v = new THREE.Vector3();
  // Chips are anchored on their number. Every visible number is an obstacle; a name is shown only
  // where it covers no other number and no name already shown (the selected space goes first,
  // and always shows its name).
  const overlap = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
  function overlays() {
    const w = host.clientWidth, h = host.clientHeight;
    const vis = [];
    chips.forEach((c, i) => {
      v.copy(c.p).project(camera);
      const on = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      c.el.hidden = !on;
      if (!on) return;
      const sel = c.el.classList.contains('sel'), key = `${i}${sel ? 's' : ''}`;
      if (sel) c.el.classList.remove('short');
      if (!sizes[key]?.[0]) { // measure with the name showing
        const was = c.el.classList.contains('short');
        c.el.classList.remove('short');
        sizes[key] = [c.el.offsetWidth, c.el.firstChild.offsetWidth, c.el.offsetHeight];
        if (was && !sel) c.el.classList.add('short');
      }
      const [full, num, ht] = sizes[key], r = num / 2;
      const x = Math.round((v.x + 1) / 2 * w), y = Math.round((1 - v.y) / 2 * h);
      const flip = x - r + full > w; // no room on the right: the name goes on the left of the number
      vis.push({ c, sel, x, y, r, circle: [x - r, y - r, x + r, y + r],
        box: flip ? [x + r - full, y - ht / 2, x + r, y + ht / 2] : [x - r, y - ht / 2, x - r + full, y + ht / 2], flip });
    });
    vis.sort((a, b) => b.sel - a.sel);
    const names = [];
    for (const k of vis) {
      const short = !k.sel && (vis.some(o => o !== k && overlap(k.box, o.circle)) || names.some(n => overlap(k.box, n)));
      if (!short) names.push(k.box);
      k.c.el.classList.toggle('short', short);
      k.c.el.classList.toggle('flip', k.flip && !short);
      k.c.el.style.transform = `translate(${short ? k.x - k.r : k.box[0]}px, ${k.y}px) translateY(-50%)`;
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
    select, view,
    topDown: () => view(true),
    start() { resize(); wanted = true; sync(); },
    stop() { wanted = false; sync(); },
    camera, controls,
    // viewport point of a plan-image pixel on the floor (used by the verification script)
    pointAt(px, py) {
      const r = el.getBoundingClientRect();
      camera.updateMatrixWorld();
      v.set(X(px), 0.1, Z(py)).project(camera);
      return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
    },
  };
  host.amenity3d = api;
  return api;
}
