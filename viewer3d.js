// Minimal dollhouse viewer for one suite. Reads the blueprint3d-style plan objects in data.js.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const WALL = 0.4, GLASS = 0.15, SLAB = 0.4;
const mat = {};
const m = (color, extra) => (mat[color + (extra ? JSON.stringify(extra) : '')] ??= new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra }));
const glass = () => m('#bcd6e4', { transparent: true, opacity: 0.28, roughness: 0.1, depthWrite: false });
const FLOOR = { wood: '#c99d6e', stone: '#d6d0c8', deck: '#b59b7c' };
const WET = /bath|ensuite|laundry/;

function box(w, hgt, d, color, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, hgt, d), typeof color === 'string' ? m(color) : color);
  mesh.position.set(x, y + hgt / 2, z);
  mesh.castShadow = mesh.receiveShadow = !mesh.material.transparent;
  return mesh;
}
function cyl(r, hgt, color, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, hgt, 20), m(color));
  mesh.position.set(x, y + hgt / 2, z);
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

// Furniture in local space: width w along x, depth d along z, back at -z.
const SIZES = { nightstand: [1.6, 1.5], chair: [1.5, 1.5], stool: [1.3, 1.3], wc: [1.6, 2.4], washer: [2.2, 2.2], lounger: [2.2, 6], planter: [3, 3] };
const BUILD = {
  bed: (w, d) => [box(w, 1.4, d, '#fbfaf8'), box(w, 3.2, 0.3, '#c9b8a3', 0, 0, -d / 2 + 0.15), box(w - 0.2, 0.15, d * 0.5, '#d8cfc2', 0, 1.4, d * 0.22),
    box(w * 0.4, 0.4, 1.1, '#ffffff', -w * 0.23, 1.4, -d / 2 + 1), box(w * 0.4, 0.4, 1.1, '#ffffff', w * 0.23, 1.4, -d / 2 + 1)],
  nightstand: (w, d) => [box(w, 1.9, d, '#b48a5f')],
  sofa: (w, d) => [box(w, 1.4, d, '#b8b0a4'), box(w, 1.5, 0.7, '#aaa196', 0, 1.4, -d / 2 + 0.35), box(0.5, 0.7, d, '#aaa196', -w / 2 + 0.25, 1.4), box(0.5, 0.7, d, '#aaa196', w / 2 - 0.25, 1.4)],
  coffee: (w, d) => [box(w, 1.3, d, '#8a6a4c')],
  console: (w, d) => [box(w, 2, d, '#ece8e2')],
  table: (w, d) => [box(w * 0.5, 2.35, d * 0.3, '#8a6a4c'), box(w, 0.15, d, '#a9835c', 0, 2.35)],
  desk: (w, d) => [box(w, 0.15, d, '#a9835c', 0, 2.35), box(w, 2.35, 0.15, '#8a6a4c', 0, 0, -d / 2 + 0.1)],
  chair: (w, d) => [box(w, 1.5, d, '#e3ddd3'), box(w, 1.6, 0.2, '#e3ddd3', 0, 1.5, -d / 2 + 0.1)],
  stool: () => [box(0.2, 2.2, 0.2, '#2b2b2b'), cyl(0.65, 0.3, '#2b2b2b', 0, 2.2, 0)],
  counter: (w, d, f) => [box(w, 3, d, f.cabinet), box(w + 0.05, 0.12, d + 0.05, f.counter, 0, 3), box(w, 2.4, 1.1, f.cabinet, 0, 5.4, -d / 2 + 0.55)],
  tall: (w, d, f) => [box(w, 7.8, d, f.cabinet)],
  island: (w, d, f) => [box(w - 0.6, 3, d - 0.6, f.islandBody), box(w, 0.15, d, f.island, 0, 3)],
  winebar: (w, d, f) => [box(w, 3.4, d, '#2f2a27'), box(w * 0.9, 2.6, 0.05, glass(), 0, 0.4, d / 2), box(w + 0.05, 0.12, d + 0.05, f.counter, 0, 3.4)],
  tub: (w, d) => [box(w, 1.8, d, '#fbfbfa'), box(w - 0.5, 0.02, d - 0.5, '#dfe8ec', 0, 1.8)],
  wc: (w, d) => [box(1.3, 1.3, 1.8, '#fbfbfa', 0, 0, 0.3), box(w, 2.6, 0.6, '#fbfbfa', 0, 0, -d / 2 + 0.3)],
  vanity: (w, d, f) => [box(w, 2.8, d, f.vanity), box(w + 0.05, 0.12, d + 0.05, '#f4f2ef', 0, 2.8), box(w, 2.5, 0.05, '#dfe6ea', 0, 4, -d / 2)],
  shower: (w, d, f) => [box(w, 0.1, d, f.stone), box(w, 7, d, glass(), 0, 0.1)],
  washer: (w, d) => [box(w, 2.8, d, '#f7f7f7'), cyl(0.6, 0.05, '#c9d2d8', 0, 1.1, d / 2)],
  shelf: (w, d) => [box(w, 7, d, '#efebe6')],
  fireplace: (w, d) => [box(w, 3.5, d, '#5d5753'), box(w * 0.7, 0.5, 0.05, m('#ff9a3c', { emissive: '#ff7a1a', emissiveIntensity: 1.2 }), 0, 1.3, d / 2), box(w * 0.9, 2.6, 0.12, '#2a2a2a', 0, 4.5)],
  lounger: (w, d) => [box(w, 1, d, '#efe9df'), box(w, 1.2, 1.6, '#efe9df', 0, 1, -d / 2 + 0.8)],
  planter: (w, d) => [box(w, 2, d, '#8d8a85'), new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 10), m('#6f8f5a')).translateY(3.2)],
};

const inside = ([x, y], pts) => pts.reduce((c, [xi, yi], i) => {
  const [xj, yj] = pts[(i + pts.length - 1) % pts.length];
  return (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi ? !c : c;
}, false);

export function createViewer(host, onPick) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f3f1ed');
  scene.add(new THREE.HemisphereLight('#ffffff', '#e8dccb', 2.4));
  const sun = new THREE.DirectionalLight('#fff4e5', 2.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.05;
  scene.add(sun, sun.target);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.5, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.screenSpacePanning = true;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;

  let group, walls = [], floors = [], radius = 40, selected;

  function resize() {
    const { clientWidth: w, clientHeight: hgt } = host;
    if (!w || !hgt) return;
    renderer.setSize(w, hgt);
    camera.aspect = w / hgt;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);

  function view(top) {
    const r = radius * Math.max(1, 1.2 / camera.aspect); // keep narrow (phone) screens framed
    controls.maxDistance = r * 4;
    camera.position.set(...(top ? [0, r * 2.2, 0.01] : [r * 0.7, r * 1.7, -r * 1.3]));
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function load(plan) {
    if (group) scene.remove(group);
    group = new THREE.Group();
    walls = []; floors = []; selected = null;
    const f = { islandBody: plan.finishes.cabinet, ...plan.finishes };
    const pts = Object.values(plan.corners);
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    radius = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2;
    group.position.set(-cx, 0, -cy);

    for (const room of plan.rooms) {
      const shape = new THREE.Shape(room.points.map(([x, y]) => new THREE.Vector2(x, -y)));
      const geo = new THREE.ExtrudeGeometry(shape, { depth: SLAB, bevelEnabled: false }).rotateX(-Math.PI / 2).translate(0, -SLAB, 0);
      const color = room.outdoor ? FLOOR.deck : WET.test(room.id) ? FLOOR.stone : FLOOR.wood;
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
      mesh.receiveShadow = true;
      mesh.userData.room = room;
      floors.push(mesh);
      group.add(mesh);
    }
    for (const w of plan.walls) {
      const a = plan.corners[w.corner1], b = plan.corners[w.corner2];
      const isGlass = w.type === 'glass', t = isGlass ? GLASS : WALL, hgt = w.height ?? plan.ceiling;
      const len = Math.hypot(b.x - a.x, b.y - a.y) + (isGlass ? 0 : WALL);
      const mesh = box(len, hgt, t, isGlass ? glass() : '#ffffff', (a.x + b.x) / 2, 0, (a.y + b.y) / 2);
      mesh.rotation.y = -Math.atan2(b.y - a.y, b.x - a.x);
      if (hgt > 4) walls.push(mesh);
      group.add(mesh);
    }
    for (const it of plan.items) {
      const rot = it.rotation ?? 0;
      const [sw, sd] = SIZES[it.item_type] ?? [];
      const W = it.width ?? (rot % 180 ? sd : sw), D = it.depth ?? (rot % 180 ? sw : sd);
      const [lw, ld] = rot % 180 ? [D, W] : [W, D];
      const item = new THREE.Group();
      item.add(...BUILD[it.item_type](lw, ld, f));
      item.position.set(it.xpos, 0, it.ypos);
      item.rotation.y = (-rot * Math.PI) / 180;
      const room = plan.rooms.find(r => inside([it.xpos, it.ypos], r.points));
      item.traverse(o => { o.userData.room = room; });
      group.add(item);
    }
    scene.add(group);
    Object.assign(sun.shadow.camera, { left: -radius, right: radius, top: radius, bottom: -radius, far: radius * 6 });
    sun.shadow.camera.updateProjectionMatrix();
    sun.position.set(-radius * 0.8, radius * 2, -radius * 1.2);
    controls.minDistance = radius * 0.5;
    resize();
    view(false);
  }

  function setXray(on) {
    for (const w of walls) {
      const hgt = w.geometry.parameters.height;
      w.scale.y = on ? 0.5 : 1;
      w.position.y = (hgt * w.scale.y) / 2;
    }
  }

  // click (not drag) picks a room
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let down;
  renderer.domElement.addEventListener('pointerdown', e => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(group.children, true).find(i => i.object.userData.room);
    const room = hit?.object.userData.room;
    if (selected) selected.material.emissive.set(0);
    selected = floors.find(fl => fl.userData.room === room);
    selected?.material.emissive.set('#2f6fd6').multiplyScalar(0.35);
    onPick(room);
  });

  return {
    load, setXray,
    topDown: () => view(true),
    start: () => renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); }),
    stop: () => renderer.setAnimationLoop(null),
  };
}
