// Parametric furniture kit for the amenity floor model. Each item type is a small builder that
// takes the item's footprint (w × d metres, back at −z, floor at y = 0), the space palette and the
// item record, and emits low-poly parts tagged with a surface kind (amenityMaterials.js) and a
// colour. amenity3d.js places, UV-maps and batches the parts — nothing here touches the scene.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const WALL_H = 1.2;

/* Fallback colours for palette keys a space doesn't define (shared look with the unit viewer). */
const DEF = {
  black: '#1d1d1f', frame: '#2c2d30', metal: '#55585d', steel: '#b4b8bc', chrome: '#c9ccd0', white: '#f4f2ee', wood: '#a9835c',
  fabric: '#d8d1c6', sofa: '#d8d1c6', cushion: '#c9bfb2', chair: '#5a504a', leather: '#5a3a2c', marble: '#efebe6', table: '#a9835c',
  rug: '#cfc8bd', plant: '#557a3c', pot: '#3b3b3b', pale: '#e8e2d8', accent: '#c4262e', disc: '#8d9196', rubber: '#2f3033',
  glass: '#bcd6e4', mat: '#2a2b2e', felt: '#3f7d3a', banquette: '#7a4128', boucle: '#ece7df', counter: '#ece8e2',
  bed: '#7f726b', firepit: '#8a7f74', stone: '#8a857c', concrete: '#c9c4bb', side: '#d9c3a5', shelf: '#c9a273',
};

const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), vp = new THREE.Vector3(), vs = new THREE.Vector3();
const clean = g => { // non-indexed, position / normal / uv only, so everything merges
  const n = g.index ? g.toNonIndexed() : g;
  for (const a of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(a)) n.deleteAttribute(a);
  n.clearGroups();
  return n;
};

/* One kit context per item: collects parts. Positions are part centres except y, which is the
   part's bottom (so stacking reads naturally). o = { rx, ry, rz, sx, sy, sz } */
export function kit(P) {
  const parts = [];
  const col = c => (c?.[0] === '#' ? c : P[c] ?? DEF[c] ?? '#cccccc');
  const add = (geo, h, kind, c, x, y, z, o = {}) => {
    const g = clean(geo);
    e.set(o.rx ?? 0, o.ry ?? 0, o.rz ?? 0);
    m4.compose(vp.set(x, y + h / 2, z), q.setFromEuler(e), vs.set(o.sx ?? 1, o.sy ?? 1, o.sz ?? 1));
    g.applyMatrix4(m4);
    parts.push({ geo: g, kind, color: col(c) });
  };
  const k = {
    parts, col, P,
    box: (kind, c, w, h, d, x = 0, y = 0, z = 0, o) => add(new THREE.BoxGeometry(w, h, d), h, kind, c, x, y, z, o),
    rbox: (kind, c, w, h, d, r, x = 0, y = 0, z = 0, o) => add(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2) * 0.999), h, kind, c, x, y, z, o),
    cyl: (kind, c, r, h, x = 0, y = 0, z = 0, o = {}) => add(new THREE.CylinderGeometry(o.r2 ?? r, r, h, o.seg ?? 16), h, kind, c, x, y, z, o),
    ball: (kind, c, r, x = 0, y = 0, z = 0, o = {}) => add(new THREE.SphereGeometry(r, o.seg ?? 12, o.hseg ?? 8), 2 * r * (o.sy ?? 1), kind, c, x, y, z, o),
    torus: (kind, c, R, r, x = 0, y = 0, z = 0, o = {}) => add(new THREE.TorusGeometry(R, r, 6, o.seg ?? 20, o.arc ?? Math.PI * 2), 0, kind, c, x, y, z, o),
    // a rod between two points (legs, rails, bars)
    rod: (kind, c, r, a, b, seg = 6) => {
      const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), len = A.distanceTo(B);
      const g = clean(new THREE.CylinderGeometry(r, r, len, seg));
      g.applyMatrix4(m4.compose(A.clone().add(B).multiplyScalar(0.5), q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()), vs.set(1, 1, 1)));
      parts.push({ geo: g, kind, color: col(c) });
    },
    // a curved band (chair backs, C-sofas): a ring sector of radial thickness t round a centre line of
    // radius R, from angle a0 to a1 (θ from −z, the back, toward +x), extruded h up from y with a soft
    // rounded edge, so wrap-around backs read as one smooth shell
    arc: (kind, c, R, t, h, y, a0, a1, n, cx = 0, cz = 0) => {
      const m = Math.max(10, n * 3), pts = [];
      for (let i = 0; i <= m; i++) { const a = a0 + (a1 - a0) * i / m; pts.push([(R + t / 2) * Math.sin(a), -(R + t / 2) * Math.cos(a)]); }
      for (let i = m; i >= 0; i--) { const a = a0 + (a1 - a0) * i / m; pts.push([(R - t / 2) * Math.sin(a), -(R - t / 2) * Math.cos(a)]); }
      k.slab(kind, c, pts, h, cx, y, cz, Math.min(0.02, t / 3, h / 3));
    },
    legs: (kind, c, w, d, h, r = 0.02, inset = 0.05) => [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => k.cyl(kind, c, r, h, a * (w / 2 - inset), 0, b * (d / 2 - inset), { seg: 6 })),
    // a slab of thickness h whose top-view outline is pts ([x, z] metres), with a soft rounded edge
    slab: (kind, c, pts, h, x = 0, y = 0, z = 0, bevel = Math.min(0.015, h / 3)) => {
      const s = new THREE.Shape(pts.map(([px, pz]) => new THREE.Vector2(px, -pz)));
      const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.001, h - 2 * bevel), bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 4 });
      g.rotateX(-Math.PI / 2).translate(0, bevel, 0); // extrusion runs up from y = 0
      add(g, 0, kind, c, x, y, z);
    },
  };
  return k;
}

/* Top-view outline of an organic tabletop, w × d metres, as [x, z] points. A superellipse
   (n = 2 is an ellipse, larger n squarer with softly bowed sides); taper > 0 narrows the +x end and
   taper < 0 the −x end, as the plan's pebble and boat-shaped tops do; flat straightens the back (−z)
   edge. */
export function outline(w, d, { n = 2, taper = 0, flat = 0, seg = 56 } = {}) {
  const pts = [], e = 2 / n;
  for (let i = 0; i < seg; i++) {
    const t = (i / seg) * 2 * Math.PI, c = Math.cos(t), s = Math.sin(t);
    const x = Math.sign(c) * Math.abs(c) ** e;
    let z = Math.sign(s) * Math.abs(s) ** (s < 0 ? e / (1 + 3 * flat) : e);
    z *= (1 - taper * x) / (1 + Math.abs(taper));
    pts.push([x * w / 2, z * d / 2]);
  }
  return pts;
}
const shapeOf = it => ({ n: it.n ?? 2, taper: it.taper ?? 0, flat: it.flat ?? 0 });

/* ---------------- seating ---------------- */
const upholstery = P => P.upholstery ?? 'fabric';
function sofa(k, w, d, c = 'sofa', kind = 'fabric', { arms = true, seatH = 0.42, backH = 0.8 } = {}) {
  const arm = arms ? Math.min(0.2, w * 0.14) : 0, back = Math.min(0.22, d * 0.3), base = 0.14;
  k.box('wood', 'black', w - 0.06, 0.05, d - 0.06, 0, 0, 0); // recessed dark plinth
  k.rbox(kind, c, w, base, d, 0.03, 0, 0.05, 0);
  const n = Math.max(1, Math.round((w - 2 * arm) / 0.75)), cw = (w - 2 * arm) / n;
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + arm + cw * (i + 0.5);
    k.rbox(kind, c, cw - 0.015, seatH - base - 0.05, d - back - 0.02, 0.06, x, base + 0.05, back / 2);
    k.rbox(kind, c, cw - 0.02, backH - seatH + 0.05, back, 0.07, x, seatH - 0.05, -d / 2 + back / 2, { rx: -0.08 });
  }
  if (arms) for (const s of [-1, 1]) k.rbox(kind, c, arm, seatH + 0.14 - base, d, 0.07, s * (w / 2 - arm / 2), base + 0.05, 0);
}
function shellSeat(k, w, d, c, kind, seatH = 0.44, backH = 0.78) { // a chair whose back wraps round in an arc
  const r = Math.min(w, d) / 2;
  k.rbox(kind, c, w * 0.86, 0.08, d * 0.8, 0.035, 0, seatH - 0.08, 0.02);
  k.arc(kind, c, r * 0.88, 0.05, backH - seatH + 0.06, seatH - 0.06, -1.25, 1.25, 7, 0, 0.02);
}
const B = {
  sofa: (k, w, d, it) => sofa(k, w, d, it.c ?? 'sofa', it.c === 'boucle' ? 'boucle' : upholstery(k.P)),
  loungechair: (k, w, d, it) => { // low rounded lounge chair on a swivel base
    k.cyl('metal', 'black', w * 0.22, 0.12, 0, 0, 0, { seg: 12 });
    k.rbox(it.c === 'black' ? 'leather' : 'boucle', it.c ?? 'boucle', w * 0.9, 0.22, d * 0.85, 0.08, 0, 0.12, 0.03);
    k.arc(it.c === 'black' ? 'leather' : 'boucle', it.c ?? 'boucle', Math.min(w, d) * 0.4, 0.12, 0.42, 0.3, -1.6, 1.6, 7, 0, 0.03);
  },
  ropechair: (k, w, d) => { // the photo's woven rope lounge chair: dark frame, rope shell, cream cushion
    for (const s of [-1, 1]) {
      k.rod('metal', 'frame', 0.015, [s * w * 0.4, 0, d * 0.4], [s * w * 0.42, 0.36, d * 0.2]);
      k.rod('metal', 'frame', 0.015, [s * w * 0.4, 0, -d * 0.35], [s * w * 0.42, 0.36, -d * 0.1]);
    }
    k.arc('rope', 'rope', Math.min(w, d) * 0.44, 0.04, 0.48, 0.3, -1.9, 1.9, 9, 0, 0.04);
    k.rbox('rope', 'rope', w * 0.8, 0.06, d * 0.72, 0.03, 0, 0.3, 0.06);
    k.rbox('fabric', 'cushion', w * 0.7, 0.09, d * 0.6, 0.04, 0, 0.36, 0.08);
  },
  chair: (k, w, d, it) => { // outdoor / bistro chair: slim metal frame, slatted seat and back
    const c = it.c ?? 'chair';
    k.legs('metal', c, w * 0.9, d * 0.9, 0.44, 0.012);
    for (let i = 0; i < 4; i++) k.box('metal', c, w * 0.9, 0.02, d * 0.17, 0, 0.44, -d * 0.35 + i * d * 0.22);
    for (let i = 0; i < 3; i++) k.box('metal', c, w * 0.9, 0.06, 0.02, 0, 0.55 + i * 0.1, -d * 0.43, { rx: -0.1 });
    k.rod('metal', c, 0.012, [-w * 0.42, 0.44, -d * 0.42], [-w * 0.42, 0.85, -d * 0.48]);
    k.rod('metal', c, 0.012, [w * 0.42, 0.44, -d * 0.42], [w * 0.42, 0.85, -d * 0.48]);
  },
  diningchair: (k, w, d, it) => { // the plan's cognac leather shell chair: a lighter outer shell wrapping a darker seat, slim dark-wood legs
    const legs = it.legs ?? 'legs';
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.rod('wood', legs, 0.014, [a * w * 0.36, 0, b * d * 0.36], [a * w * 0.3, 0.42, b * d * 0.3]);
    const r = Math.min(w, d) / 2;
    k.rbox('leather', it.c ?? 'chair', w * 0.84, 0.09, d * 0.78, 0.04, 0, 0.4, 0.03);
    k.arc('leather', it.rim ?? 'chairRim', r * 0.9, 0.045, 0.42, 0.42, -1.9, 1.9, 11, 0, 0.03); // outer shell
    k.arc('leather', it.c ?? 'chair', r * 0.78, 0.05, 0.36, 0.48, -1.7, 1.7, 9, 0, 0.03); // padded inner back
  },
  meetingchair: (k, w, d, it) => { // the plan's taupe shell chair on four slim black legs (the black dots round the table)
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.rod('metal', 'black', 0.011, [a * w * 0.42, 0, b * d * 0.42], [a * w * 0.28, 0.42, b * d * 0.28]);
    shellSeat(k, w, d, it.c ?? 'chair', 'fabric', 0.47, 0.82);
  },
  deskchair: (k, w, d, it) => { // swivel task chair: five-star base, shell seat, black arms
    for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5; k.rod('metal', 'black', 0.012, [0, 0.04, 0], [Math.sin(a) * w * 0.42, 0.02, Math.cos(a) * w * 0.42]); }
    k.cyl('chrome', 'chrome', 0.022, 0.4, 0, 0.03, 0, { seg: 8 });
    shellSeat(k, w, d, it.c ?? 'chair', 'fabric', 0.47, 0.82);
    for (const s of [-1, 1]) k.rbox('metal', 'black', 0.035, 0.03, d * 0.5, 0.012, s * w * 0.44, 0.64, 0.02);
  },
  shellchair: (k, w, d, it) => { k.legs('wood', 'wood', w * 0.8, d * 0.8, 0.4, 0.014); shellSeat(k, w, d, it.c ?? 'shell', 'boucle', 0.44, 0.74); },
  tubchair: (k, w, d, it) => { // the plan's rounded barrel armchair: soft square seat, a thick back that wraps into the arms
    const r = Math.min(w, d) / 2, c = it.c ?? 'chair', kind = it.kind ?? 'boucle';
    k.rbox(kind, c, w * 0.92, 0.3, d * 0.9, 0.1, 0, 0.04, 0.01);
    k.rbox(kind, c, w * 0.7, 0.12, d * 0.62, 0.05, 0, 0.32, 0.08); // seat cushion
    k.arc(kind, c, r * 0.8, r * 0.34, 0.36, 0.3, -2.25, 2.25, 13, 0, 0.02);
    k.cyl('wood', 'black', r * 0.6, 0.04, 0, 0, 0.01, { seg: 14 });
  },
  cloudsofa: (k, w, d, it) => { // the plan's curvy sofa: one long seat, two pillow-shaped back bolsters, rounded rolled arms, a throw cushion
    const c = it.c ?? 'sofa', kind = it.kind ?? 'boucle', arm = Math.min(0.26, w * 0.1), back = d * 0.32;
    k.rbox(kind, c, w - 0.1, 0.16, d - 0.1, 0.05, 0, 0.04, 0);
    k.rbox(kind, c, w - 2 * arm + 0.04, 0.16, d - back - 0.04, 0.08, 0, 0.2, back / 2); // seat
    for (const s of [-1, 1]) {
      k.rbox(kind, c, (w - 2 * arm) / 2 + arm * 0.6, 0.42, back, back * 0.48, s * (w / 4 - arm * 0.05), 0.2, -d / 2 + back / 2); // bolster
      k.rbox(kind, c, arm, 0.44, d * 0.92, arm * 0.48, s * (w / 2 - arm / 2), 0.04, 0.01); // rolled arm
    }
    k.rbox(kind, it.pillow ?? c, 0.36, 0.32, 0.14, 0.06, -w / 2 + arm + 0.3, 0.32, -d / 2 + back + 0.06, { ry: 0.5, rx: -0.3 });
  },
  banquette: (k, w, d, it) => {
    const c = it.c ?? 'banquette', kind = c === 'leather' || k.P.upholstery === 'leather' ? 'leather' : 'fabric';
    if (it.low) { // the plan's window bench: one plinth, it.seg long seat cushions, a slim back roll on the wall side
      const n = it.seg ?? 2;
      k.box('wood', 'black', w - 0.04, 0.06, d - 0.06, 0, 0, 0);
      for (let i = 0; i < n; i++) k.rbox(kind, c, w / n - 0.02, 0.36, d * 0.8, 0.06, -w / 2 + (i + 0.5) * w / n, 0.06, d * 0.1);
      k.rbox(kind, c, w, 0.26, d * 0.22, 0.06, 0, 0.36, -d * 0.39);
      return;
    }
    sofa(k, w, d, c, kind, { arms: false, seatH: 0.46, backH: 0.88 });
  },
  curvesofa: (k, w, d, it) => { // C-shaped sofa, convex side at the back (−z)
    const c = it.c ?? 'sofa', R = w / 2 - d / 2, kind = 'fabric';
    k.arc(kind, c, R, d, 0.42, 0, -1.4, 1.4, 12, 0, R * 0.55);
    k.arc(kind, c, R + d * 0.38, d * 0.24, 0.38, 0.38, -1.4, 1.4, 12, 0, R * 0.55);
  },
  daybed: (k, w, d) => { k.box('wood', 'black', w, 0.18, d, 0, 0, 0); k.rbox('fabric', 'daybed', w * 0.98, 0.18, d * 0.8, 0.06, 0, 0.18, d * 0.1); k.rbox('leather', 'black', w, 0.3, d * 0.22, 0.05, 0, 0.3, -d * 0.39); },
  stool: (k, w, d, it) => {
    if (it.seat === 'square') { // counter stool: upholstered rounded-square seat with a low back, four light legs
      for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.rod('wood', it.legs ?? 'wood', 0.013, [a * w * 0.42, 0, b * d * 0.42], [a * w * 0.34, 0.62, b * d * 0.34]);
      k.rbox('boucle', it.c, w, 0.08, d, 0.05, 0, 0.62, 0);
      k.rbox('boucle', it.c, w, 0.18, 0.06, 0.03, 0, 0.68, -d / 2 + 0.03);
      return;
    }
    if (it.seat === 'wood') { // the plan's tan timber bar stool: square seat, four legs, footrest ring
      k.rbox('wood', it.c ?? 'stool', w, 0.05, d, 0.012, 0, 0.7, 0);
      for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.rod('wood', it.c ?? 'stool', 0.016, [a * w * 0.45, 0, b * d * 0.45], [a * w * 0.38, 0.7, b * d * 0.38]);
      for (const s of [-1, 1]) { k.box('wood', it.c ?? 'stool', w * 0.8, 0.02, 0.02, 0, 0.28, s * d * 0.42); k.box('wood', it.c ?? 'stool', 0.02, 0.02, d * 0.8, s * w * 0.42, 0.28, 0); }
      return;
    }
    k.cyl('metal', 'black', 0.02, 0.62, 0, 0, 0, { seg: 8 }); k.cyl('metal', 'black', w * 0.42, 0.02, 0, 0, 0); k.torus('metal', 'black', w * 0.3, 0.008, 0, 0.25, 0, { rx: Math.PI / 2 }); k.cyl('leather', it.c ?? (k.P.stool ? 'stool' : 'wood'), w / 2, 0.06, 0, 0.62, 0, { seg: 16 });
  },
  kidstool: (k, w, d, it) => k.cyl('paint', it.c ?? 'white', w / 2, 0.3, 0, 0, 0, { seg: 16 }),
  kidchair: (k, w, d, it) => { const c = it.c ?? 'white'; k.legs('paint', 'white', w * 0.8, d * 0.8, 0.3, 0.012); k.rbox('paint', c, w * 0.9, 0.04, d * 0.85, 0.015, 0, 0.3, 0); k.rbox('paint', c, w * 0.9, 0.24, 0.035, 0.015, 0, 0.32, -d * 0.42); },
  bolster: (k, w, d, it) => k.rbox('fabric', it.c ?? 'bolster', w, 0.36, d, Math.min(w, d) * 0.45, 0, 0.42, 0), // end cushion propped on a bench
  pouf: (k, w, d, it) => { k.cyl('boucle', it.c ?? 'pale', w / 2, 0.34, 0, 0, 0, { seg: 18 }); k.cyl('boucle', it.c ?? 'pale', w * 0.44, 0.04, 0, 0.34, 0, { seg: 18 }); },
  beanbag: (k, w, d, it) => { k.ball('fabric', it.c, w / 2, 0, 0, 0, { sy: 0.55, seg: 14 }); k.ball('fabric', it.c, w * 0.32, 0, 0.18, -w * 0.18, { sy: 0.8, seg: 10 }); },
  lounger: (k, w, d) => { // chaise: low frame, flat mattress, raised back at −z
    k.box('metal', 'fabric', w, 0.22, d, 0, 0, 0);
    k.rbox('fabric', 'fabric', w * 0.94, 0.08, d * 0.62, 0.035, 0, 0.22, d * 0.17);
    k.rbox('fabric', 'fabric', w * 0.94, 0.08, d * 0.36, 0.035, 0, 0.32, -d * 0.3, { rx: 0.55 });
  },
  bed: (k, w, d) => {
    k.box('fabric', 'bed', w, 0.32, d, 0, 0, 0);
    k.rbox('fabric', 'bed', w * 0.97, 0.2, d * 0.95, 0.06, 0, 0.3, d * 0.01);
    k.rbox('fabric', 'black', w * 0.99, 0.06, d * 0.3, 0.03, 0, 0.47, d * 0.18); // dark runner across the bed, as drawn
    for (const s of [-1, 1]) k.rbox('fabric', 'black', w * 0.42, 0.12, 0.2, 0.05, s * w * 0.23, 0.48, -d / 2 + 0.2);
    k.rbox('fabric', 'bed', w, 1.0, 0.1, 0.03, 0, 0, -d / 2 + 0.05);
  },
};

/* ---------------- tables & surfaces ---------------- */
const pedestal = (k, h, c = 'black', r = 0.05) => { k.cyl('metal', c, r, h, 0, 0, 0, { seg: 10 }); k.cyl('metal', c, r * 4, 0.03, 0, 0, 0, { seg: 16 }); };
Object.assign(B, {
  marbletable: (k, w, d, it) => { // the plan's veined white top: a soft rectangle with gently bowed sides, on two marble slab legs
    k.slab('marble', 'marble', outline(w, d, { n: it.n ?? 3.6 }), 0.05, 0, 0.71, 0, 0.012);
    for (const s of [-1, 1]) k.rbox('marble', 'marble', 0.1, 0.71, d * 0.5, 0.03, s * w * 0.3, 0, 0);
  },
  roundtable: (k, w, d, it) => { // marble (or, with kind 'wood', timber) disc on a pedestal; it.h for a low side table
    const h = it.h ?? 0.72, kind = it.kind ?? 'marble';
    k.cyl(kind, it.c ?? 'marble', w / 2, 0.04, 0, h, 0, { seg: 32 });
    if (kind === 'wood') { k.cyl('wood', it.c, w * 0.22, h, 0, 0, 0, { seg: 16, r2: w * 0.14 }); return; }
    pedestal(k, h, it.base ?? 'black', w * 0.08);
  },
  pebble: (k, w, d, it) => { // the plan's organic pebble-shaped table: thick rounded top over a recessed plinth of the same outline
    const h = it.h ?? 0.38, c = it.c ?? 'oval', kind = it.kind ?? 'wood', o = shapeOf(it);
    k.slab(kind, c, outline(w * 0.8, d * 0.72, o), h - 0.06, 0, 0, 0, 0.01);
    k.slab(kind, c, outline(w, d, o), 0.06, 0, h - 0.06, 0, 0.022);
  },
  worktable: (k, w, d) => { k.box('wood', 'wood', w, 0.04, d, 0, 0.71, 0); for (const s of [-1, 1]) k.box('wood', 'wood', 0.04, 0.71, d * 0.9, s * (w / 2 - 0.04), 0, 0); },
  desk: (k, w, d) => { k.box('marble', 'marble', w, 0.04, d, 0, 0.72, 0); k.box('paint', 'white', w * 0.96, 0.72, 0.03, 0, 0, -d / 2 + 0.03); k.box('paint', 'white', 0.03, 0.72, d * 0.9, -w / 2 + 0.03, 0, 0); k.box('paint', 'white', 0.03, 0.72, d * 0.9, w / 2 - 0.03, 0, 0); },
  longtable: (k, w, d) => { // outdoor dining table: slatted metal top on four legs
    const n = Math.round(d / 0.08);
    for (let i = 0; i < n; i++) k.box('metal', 'table', w, 0.03, d / n - 0.012, 0, 0.71, -d / 2 + (i + 0.5) * d / n);
    k.box('metal', 'table', w - 0.1, 0.06, 0.04, 0, 0.66, -d / 2 + 0.06); k.box('metal', 'table', w - 0.1, 0.06, 0.04, 0, 0.66, d / 2 - 0.06);
    k.legs('metal', 'table', w, d, 0.71, 0.025, 0.08);
  },
  meetingtable: (k, w, d, it) => { // the plan's boat-shaped oak top (narrow, rounded west end), on two slab legs
    k.slab('wood', 'table', outline(w, d, shapeOf(it)), 0.05, 0, 0.71, 0, 0.012);
    for (const s of [-1, 1]) k.rbox('wood', 'table', 0.08, 0.71, d * 0.45, 0.03, s * w * 0.28, 0, 0);
  },
  bistro: (k, w) => { k.box('metal', 'table', w, 0.03, w, 0, 0.71, 0); k.legs('metal', 'table', w, w, 0.71, 0.018); },
  coffee: (k, w, d, it) => k.rbox('stone', it.c ?? 'stone', w, 0.38, d, 0.03, 0, 0, 0),
  sidetable: (k, w, d, it) => { k.cyl('stone', it.c ?? 'table', w / 2, 0.03, 0, 0.45, 0, { seg: 16 }); k.cyl('stone', it.c ?? 'table', w * 0.3, 0.45, 0, 0, 0, { seg: 12, r2: w * 0.2 }); },
  kidtable: (k, w, d, it) => {
    const c = it.c ?? 'white';
    if (Math.abs(w - d) < 0.05) { k.cyl('paint', c, w / 2, 0.04, 0, 0.5, 0, { seg: 24 }); k.cyl('paint', 'white', 0.05, 0.5, 0, 0, 0, { seg: 10 }); return; }
    k.rbox('paint', c, w, 0.04, d, 0.015, 0, 0.52, 0); k.legs('paint', c, w, d, 0.52, 0.02);
  },
  crafttable: (k, w, d) => { // white craft table; the plan shows coloured pots / dots of supplies on it
    k.box('paint', 'white', w, 0.55, d, 0, 0, 0);
    ['pink', 'blue', 'green', 'palegreen', 'paleblue', 'palepink'].forEach((c, i) => k.cyl('paint', c, 0.045, 0.06, -w / 2 + 0.12 + i * (w - 0.24) / 5, 0.55, (i % 2 ? 1 : -1) * d * 0.18, { seg: 10 }));
  },
  console: (k, w, d, it) => k.box('paint', it.c ?? 'white', w, 0.75, d, 0, 0, 0),
  credenza: (k, w, d) => { k.box('paint', 'black', w * 0.96, 0.06, d * 0.9, 0, 0, 0); k.box('marble', 'marble', w, 0.66, d, 0, 0.06, 0); },
  counter: (k, w, d) => { // kitchen run: cabinets, recessed kick, stone top
    k.box('paint', 'black', w - 0.02, 0.1, d - 0.06, 0, 0, -0.03);
    k.box('paint', 'counter', w, 0.78, d, 0, 0.1, 0);
    for (let x = -w / 2 + 0.6; x < w / 2 - 0.1; x += 0.6) k.box('paint', 'black', 0.008, 0.7, 0.005, x, 0.14, d / 2 + 0.002);
    k.box('marble', 'marble', w + 0.03, 0.04, d + 0.04, 0, 0.88, 0.02);
  },
  bar: (k, w, d) => { // marble-clad bar: body, top, brass-dark foot rail on the guest side (+z)
    k.box('marble', 'marble', w, 1.02, d, 0, 0, 0);
    k.box('marble', 'marble', w + 0.06, 0.05, d + 0.12, 0, 1.02, 0.03);
    k.rod('metal', 'black', 0.02, [-w / 2 + 0.1, 0.18, d / 2 + 0.12], [w / 2 - 0.1, 0.18, d / 2 + 0.12]);
  },
  pier: (k, w, d, it) => k.box('paint', it.c ?? 'white', w, WALL_H, d, 0, 0, 0),
});

/* ---------------- games ---------------- */
Object.assign(B, {
  pooltable: (k, w, d) => {
    for (const s of [-1, 1]) for (const t of [-1, 1]) k.box('wood', 'wood', 0.14, 0.6, 0.14, s * (w / 2 - 0.15), 0, t * (d / 2 - 0.22));
    k.box('wood', 'wood', w, 0.14, d, 0, 0.6, 0);
    k.box('fabric', 'felt', w - 0.16, 0.03, d - 0.16, 0, 0.72, 0);
    for (const s of [-1, 1]) { k.rbox('wood', 'wood', 0.09, 0.06, d, 0.02, s * (w / 2 - 0.045), 0.72, 0); k.rbox('wood', 'wood', w, 0.06, 0.09, 0.02, 0, 0.72, s * (d / 2 - 0.045)); }
    for (const s of [-1, 1]) for (const t of [-1, 0, 1]) k.cyl('rubber', 'black', 0.045, 0.012, s * (w / 2 - 0.09), 0.775, t * (d / 2 - 0.09), { seg: 10 });
    k.ball('paint', 'white', 0.028, 0, 0.75, -d * 0.28);
    ['#e2b23a', '#2a4fa0', '#b8322a', '#5a2a7a', '#d86a2a', '#1f6a3a', '#7a1f1f'].forEach((c, i) => k.ball('paint', c, 0.028, ((i % 3) - 1) * 0.058 + (i > 2 ? 0.029 : 0), 0.75, d * 0.18 + Math.floor(i / 3) * 0.05));
    k.rod('wood', 'wood', 0.008, [w * 0.32, 0.79, -d * 0.1], [w * 0.36, 0.79, d * 0.36]); // the cue drawn on the table
  },
  foosball: (k, w, d) => {
    const bw = w * 0.82, bd = d * 0.85;
    k.legs('wood', 'wood', bw * 0.8, d * 0.7, 0.6, 0.035, 0.06);
    // the plan's pale-wood cabinet with rounded (stadium) ends, the green pitch set in its top
    k.slab('wood', 'wood', outline(bw, bd, { n: 5 }), 0.26, 0, 0.6, 0, 0.02);
    k.slab('fabric', 'felt', outline(bw - 0.12, bd - 0.1, { n: 6 }), 0.02, 0, 0.86, 0, 0);
    for (const s of [-1, 1]) k.box('paint', 'white', 0.015, 0.003, bd - 0.14, s * (bw / 2 - 0.12), 0.881, 0); // goal lines
    for (let i = 0; i < 8; i++) {
      const x = -bw / 2 + 0.12 + i * (bw - 0.24) / 7;
      k.rod('chrome', 'chrome', 0.008, [x, 0.94, -d / 2 - 0.05], [x, 0.94, d / 2 + 0.05]);
      k.cyl('rubber', 'black', 0.018, 0.08, x, 0.9, i % 2 ? d / 2 + 0.08 : -d / 2 - 0.08, { rx: Math.PI / 2, seg: 8 });
      for (const t of [-1, 0, 1]) k.box('paint', i % 2 ? '#b8322a' : '#2a4fa0', 0.02, 0.08, 0.03, x, 0.88, t * d * 0.22);
    }
  },
});

/* ---------------- fitness ---------------- */
Object.assign(B, {
  treadmill: (k, w, d) => { // console at the back (−z)
    k.box('metal', 'black', w, 0.18, d, 0, 0, 0);
    k.box('rubber', 'rubber', w * 0.72, 0.012, d * 0.82, 0, 0.18, d * 0.06);
    for (const s of [-1, 1]) {
      k.box('metal', 'black', 0.08, 0.04, d * 0.8, s * (w / 2 - 0.04), 0.18, d * 0.07);
      k.rod('metal', 'black', 0.03, [s * (w / 2 - 0.06), 0.18, -d / 2 + 0.12], [s * (w / 2 - 0.08), 1.25, -d / 2 + 0.22]);
      k.rod('metal', 'black', 0.018, [s * (w / 2 - 0.08), 1.0, -d / 2 + 0.2], [s * (w / 2 - 0.08), 1.0, -d / 2 + 0.55]);
    }
    k.rbox('metal', 'black', w * 0.95, 0.3, 0.16, 0.04, 0, 1.18, -d / 2 + 0.22, { rx: -0.5 });
    k.box('paint', '#20304a', w * 0.6, 0.18, 0.01, 0, 1.24, -d / 2 + 0.3, { rx: -0.5 });
  },
  recumbent: (k, w, d) => { // recumbent cross-trainer: seat + back at −z, console + footplates at +z
    k.box('metal', 'black', 0.14, 0.12, d * 0.85, 0, 0, 0);
    k.rbox('fabric', 'black', w * 0.85, 0.1, 0.42, 0.04, 0, 0.42, -d / 2 + 0.38);
    k.rbox('fabric', 'black', w * 0.85, 0.55, 0.1, 0.04, 0, 0.5, -d / 2 + 0.12, { rx: -0.35 });
    k.box('metal', 'black', 0.1, 0.42, 0.12, 0, 0, -d / 2 + 0.38);
    for (const s of [-1, 1]) {
      k.rod('metal', 'metal', 0.018, [s * w * 0.3, 0.5, -d / 2 + 0.6], [s * w * 0.45, 1.0, -d / 2 + 0.9]);
      k.box('rubber', 'black', 0.18, 0.04, 0.32, s * w * 0.28, 0.16, d / 2 - 0.2);
    }
    k.rod('metal', 'black', 0.04, [0, 0.12, d / 2 - 0.45], [0, 1.0, d / 2 - 0.38]);
    k.rbox('metal', 'black', w * 0.6, 0.22, 0.08, 0.03, 0, 0.98, d / 2 - 0.36, { rx: 0.4 });
  },
  spin: (k, w, d) => { // spin bike: flywheel at the back (−z) with the photo's red rim, saddle at +z
    k.box('metal', 'black', w * 0.9, 0.06, 0.1, 0, 0, -d / 2 + 0.06); k.box('metal', 'black', w * 0.9, 0.06, 0.1, 0, 0, d / 2 - 0.06);
    k.rod('metal', 'black', 0.03, [0, 0.06, -d / 2 + 0.06], [0, 0.06, d / 2 - 0.06]);
    k.cyl('chrome', 'disc', 0.26, 0.05, 0, 0.32, -d / 2 + 0.28, { rz: Math.PI / 2, seg: 22 });
    k.torus('paint', 'accent', 0.26, 0.022, 0, 0.32, -d / 2 + 0.28, { ry: Math.PI / 2, seg: 22 });
    k.rod('metal', 'black', 0.03, [0, 0.06, d / 2 - 0.15], [0, 0.95, d / 2 - 0.25]);
    k.rod('metal', 'black', 0.03, [0, 0.35, -d / 2 + 0.28], [0, 1.02, -d / 2 + 0.32]);
    k.rbox('leather', 'black', 0.16, 0.06, 0.26, 0.025, 0, 0.95, d / 2 - 0.25);
    k.box('metal', 'black', 0.42, 0.04, 0.06, 0, 1.02, -d / 2 + 0.32);
  },
  machine: (k, w, d) => { // selectorised machine: weight-stack tower at −z, seat + pad, arm
    k.box('metal', 'black', w, 0.06, d, 0, 0, 0);
    k.box('metal', 'black', w * 0.85, 1.9, 0.14, 0, 0.06, -d / 2 + 0.1);
    k.box('metal', 'metal', w * 0.4, 0.75, 0.1, 0, 0.12, -d / 2 + 0.2);
    k.rbox('leather', 'black', w * 0.5, 0.1, 0.42, 0.04, 0, 0.45, d * 0.12);
    k.box('metal', 'black', 0.08, 0.45, 0.08, 0, 0.06, d * 0.12);
    k.rbox('leather', 'black', w * 0.5, 0.6, 0.1, 0.04, 0, 0.6, -d / 2 + 0.36);
    k.rod('metal', 'metal', 0.025, [-w * 0.38, 1.6, -d / 2 + 0.18], [-w * 0.38, 1.2, d * 0.3]);
    k.rod('metal', 'metal', 0.025, [w * 0.38, 1.6, -d / 2 + 0.18], [w * 0.38, 1.2, d * 0.3]);
  },
  flatbench: (k, w, d) => { k.rbox('leather', 'black', w, 0.08, d, 0.035, 0, 0.38, 0); for (const s of [-1, 1]) k.box('metal', 'metal', 0.05, 0.38, d * 0.8, s * w * 0.35, 0, 0); },
  weightbench: (k, w, d) => { // bench pad with a loaded barbell on uprights, as drawn on the plan
    const bar = 0.92;
    for (const s of [-1, 1]) { k.box('metal', 'black', 0.05, bar + 0.06, 0.05, s * (w / 2 - 0.06), 0, 0); k.box('metal', 'black', 0.05, 0.03, d * 1.1, s * (w / 2 - 0.06), 0, 0); }
    k.rod('chrome', 'chrome', 0.014, [-w / 2 + 0.02, bar, 0], [w / 2 - 0.02, bar, 0], 8);
    for (const x of [w * 0.18, w * 0.24]) k.cyl('rubber', 'black', 0.2, 0.04, x, bar - 0.2, 0, { rz: Math.PI / 2, seg: 18 });
    k.rbox('leather', 'black', w * 0.18, 0.08, d * 1.3, 0.03, -w * 0.08, 0.38, 0);
    k.box('metal', 'metal', 0.05, 0.38, 0.05, -w * 0.08, 0, 0);
  },
  dbrack: (k, w, d) => { // two-tier dumbbell rack, dumbbells in pairs along its length (d)
    for (const t of [-1, 1]) k.box('metal', 'black', w, 0.75, 0.05, 0, 0, t * (d / 2 - 0.05));
    k.box('metal', 'black', w, 0.03, d, 0, 0.42, 0, { rx: 0 }); k.box('metal', 'black', w, 0.03, d, 0, 0.72, 0);
    const n = Math.floor(d / 0.24);
    for (let i = 0; i < n; i++) for (const [y, x] of [[0.45, -w * 0.18], [0.75, w * 0.18]]) {
      const z = -d / 2 + 0.14 + i * (d - 0.28) / (n - 1);
      k.rod('chrome', 'chrome', 0.012, [x - 0.12, y + 0.05, z], [x + 0.12, y + 0.05, z]);
      for (const s of [-1, 1]) k.cyl('rubber', 'black', 0.05, 0.06, x + s * 0.1, y + 0.05, z, { rz: Math.PI / 2, seg: 10 });
    }
  },
  powerrack: (k, w, d) => { // the photo's rack: four uprights, top frame, loaded bar on J-hooks
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) k.box('metal', 'frame', 0.07, 2.1, 0.07, a * (w / 2 - 0.04), 0, b * (d / 2 - 0.04));
    for (const s of [-1, 1]) { k.box('metal', 'frame', w, 0.06, 0.06, 0, 2.05, s * (d / 2 - 0.04)); k.box('metal', 'frame', 0.06, 0.06, d, s * (w / 2 - 0.04), 2.05, 0); k.box('metal', 'frame', 0.06, 0.06, d, s * (w / 2 - 0.04), 0, 0); }
    k.rod('chrome', 'chrome', 0.014, [-w / 2 - 0.35, 1.35, -d / 2 + 0.06], [w / 2 + 0.35, 1.35, -d / 2 + 0.06], 8);
    for (const s of [-1, 1]) for (const o of [0.12, 0.18]) k.cyl('rubber', 'black', 0.22, 0.045, s * (w / 2 + o), 1.13, -d / 2 + 0.06, { rz: Math.PI / 2, seg: 18 });
  },
  plyobox: (k, w, d) => { k.rbox('rubber', 'black', w, 0.06, d, 0.02, 0, 0, 0); k.box('paint', '#e07a2f', 0.1, 0.062, d * 0.7, w / 2 - 0.1, 0, 0); },
  cabinetwall: (k, w, d) => { // the photo's oak cabinet wall: panels, a towel cubby niche
    k.box('wood', 'cabinet', w, WALL_H, d, 0, 0, 0);
    for (let x = -w / 2 + 0.45; x < w / 2 - 0.1; x += 0.45) k.box('paint', '#3a2e24', 0.01, WALL_H - 0.04, 0.01, x, 0.02, d / 2 + 0.003);
    k.box('paint', '#3a3632', w * 0.16, 0.7, 0.02, -w * 0.2, 0.25, d / 2 + 0.005);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) k.box('fabric', 'white', w * 0.06, 0.12, 0.02, -w * 0.24 + c * w * 0.08, 0.32 + r * 0.22, d / 2 + 0.012);
  },
  mat: (k, w, d, it) => k.rbox('rubber', it.c ?? 'mat', w, 0.012, d, 0.005, 0, 0, 0),
  exball: (k, w) => k.ball('paint', 'ball', w * 0.42, 0, 0, 0, { seg: 18, hseg: 12 }),
  dumbbell: (k, w, d) => { k.rod('chrome', 'chrome', 0.012, [0, 0.05, -d * 0.4], [0, 0.05, d * 0.4]); for (const s of [-1, 1]) k.cyl('rubber', 'black', 0.05, 0.07, 0, 0, s * d * 0.32, { rx: Math.PI / 2, seg: 8 }); },
  kettlebell: (k, w) => { k.ball('metal', 'black', w * 0.4, 0, 0, 0, { seg: 10 }); k.torus('metal', 'black', w * 0.22, 0.015, 0, w * 0.75, 0, { arc: Math.PI, seg: 10 }); },
  roller: (k, w, d) => k.cyl('rubber', 'black', w / 2, d, 0, w / 2 - d / 2, 0, { rx: Math.PI / 2, seg: 12 }),
  glasswall: (k, w, d) => { k.box('glass', 'glass', w, WALL_H, d, 0, 0, 0); k.box('metal', 'frame', w, 0.04, 0.05, 0, WALL_H - 0.04, 0); k.box('metal', 'frame', w, 0.04, 0.05, 0, 0, 0); },
});

/* ---------------- work & rooms ---------------- */
Object.assign(B, {
  carrel: (k, w, d) => { k.box('wood', 'wood', w, 1.25, 0.05, 0, 0, -d / 2 + 0.025); k.box('wood', 'wood', w, 0.04, d, 0, 1.21, 0); },
  divider: (k, w, d) => k.box('paint', 'white', w, 1.25, d, 0, 0, 0),
  pod: (k, w, d) => { // study pod: white shell on three sides, marble desk with the drawn device, chair, rug
    k.rbox('rug', 'rug', w * 0.9, 0.012, d * 0.62, 0.005, 0, 0, d * 0.12);
    k.box('paint', 'pod', w, 1.6, 0.05, 0, 0, -d / 2 + 0.025);
    for (const s of [-1, 1]) k.box('paint', 'pod', 0.05, 1.6, d, s * (w / 2 - 0.025), 0, 0);
    k.box('marble', 'desk', w * 0.88, 0.04, 0.5, 0, 0.72, -d / 2 + 0.3);
    k.rbox('metal', 'black', 0.3, 0.02, 0.1, 0.006, 0, 0.76, -d / 2 + 0.26); // the small black device drawn on each desk
    const c = kit(k.P); B.meetingchair(c, 0.5, 0.5, { c: 'chair' });
    c.parts.forEach(p => { p.geo.rotateY(Math.PI); p.geo.translate(0, 0, d * 0.12); k.parts.push(p); }); // facing the desk
  },
  glasscurve: () => {}, // built in plan space by amenity3d.js (needs the item's pts)
  wardrobe: (k, w, d) => { k.box('wood', 'wood', w, WALL_H, d, 0, 0, 0); for (let x = -w / 2 + w / 3; x < w / 2 - 0.05; x += w / 3) k.box('paint', '#3a2e24', 0.008, WALL_H - 0.06, 0.01, x, 0.03, d / 2 + 0.003); },
  wc: (k, w, d) => { k.box('paint', 'white', w * 0.8, 0.4, d * 0.3, 0, 0.3, -d / 2 + d * 0.15); k.cyl('paint', 'white', w * 0.45, 0.4, 0, 0, d * 0.12, { seg: 16, sz: 1.3 }); },
  vanity: (k, w, d) => { k.box('wood', 'wood', w, 0.5, d, 0, 0.32, 0); k.box('marble', 'white', w, 0.05, d, 0, 0.82, 0); k.cyl('paint', 'white', d * 0.3, 0.02, 0, 0.87, 0, { seg: 16 }); },
  stroller: (k, w, d) => {
    for (const s of [-1, 1]) for (const t of [-1, 1]) k.cyl('rubber', 'black', 0.09, 0.03, s * w * 0.42, 0, t * d * 0.36, { rz: Math.PI / 2, seg: 12 });
    k.rod('metal', 'black', 0.012, [-w * 0.42, 0.09, -d * 0.36], [-w * 0.42, 0.45, d * 0.1]); k.rod('metal', 'black', 0.012, [w * 0.42, 0.09, -d * 0.36], [w * 0.42, 0.45, d * 0.1]);
    k.rbox('fabric', 'black', w * 0.8, 0.28, d * 0.55, 0.08, 0, 0.42, d * 0.05);
    k.arc('fabric', 'black', w * 0.38, 0.03, 0.25, 0.68, -1.6, 1.6, 6, 0, -d * 0.05);
    k.rod('metal', 'black', 0.012, [-w * 0.4, 0.5, -d * 0.2], [-w * 0.4, 1.0, -d * 0.48]); k.rod('metal', 'black', 0.012, [w * 0.4, 0.5, -d * 0.2], [w * 0.4, 1.0, -d * 0.48]);
    k.rod('metal', 'black', 0.015, [-w * 0.4, 1.0, -d * 0.48], [w * 0.4, 1.0, -d * 0.48]);
  },
  mirror: (k, w, d) => { k.box('metal', 'black', w, 1.0, d, 0, 0.1, 0); k.box('chrome', '#dfe8ec', w - 0.06, 0.94, 0.01, 0, 0.13, d / 2 + 0.002); },
  rail: (k, w, d) => { k.box('metal', 'black', w, 0.06, d, 0, 0.9, 0); for (const s of [-1, 1]) k.box('metal', 'black', 0.03, 0.9, 0.03, s * w * 0.4, 0, 0); },
  playmat: (k, w, d) => k.rbox('fabric', 'mat', w, 0.16, d, 0.05, 0, 0, 0),
  bookshelf: (k, w, d, it) => { const c = it.c ?? 'shelf'; k.box('wood', c, w, 0.03, d, 0, 0, 0); for (const s of [-1, 1]) k.box('wood', c, 0.03, WALL_H, d, s * (w / 2 - 0.015), 0, 0); k.box('wood', c, w, WALL_H, 0.02, 0, 0, -d / 2 + 0.01); for (let y = 0.3; y < WALL_H; y += 0.3) k.box('wood', c, w, 0.025, d, 0, y, 0); },
  toybins: (k, w, d) => { for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) k.rbox('paint', 'paleblue', w / 2 - 0.02, 0.28, d / 3 - 0.02, 0.03, (c - 0.5) * w / 2, 0, (r - 1) * d / 3); },
  coatrack: (k, w, d) => { for (const y of [0.55, 0.95]) k.rod('chrome', 'chrome', 0.012, [-w / 2, y, 0], [w / 2, y, 0]); for (const s of [-1, 1]) for (const t of [-1, 1]) k.box('metal', 'white', 0.03, 1.0, 0.03, s * w / 2, 0, t * d * 0.4); },
  sink: (k, w, d) => { k.box('paint', 'white', w, 0.2, d, 0, 0.65, 0); k.box('metal', 'black', w * 0.5, 0.012, d * 0.5, 0, 0.85, 0); },
});

/* ---------------- outdoor ---------------- */
Object.assign(B, {
  pergola: (k, w, d) => { // the photo's pergola: black steel frame, dark timber slat roof
    const H = 2.6, p = 0.12;
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1], [-1, 0], [1, 0]]) k.box('metal', 'frame', p, H, p, a * (w / 2 - p / 2), 0, b * (d / 2 - p / 2));
    for (const s of [-1, 1]) { k.box('metal', 'frame', p, 0.22, d, s * (w / 2 - p / 2), H, 0); k.box('metal', 'frame', w, 0.22, p, 0, H, s * (d / 2 - p / 2)); }
    for (let z = -d / 2 + 0.3; z < d / 2 - 0.15; z += 0.5) k.box('wood', 'slats', w - 2 * p, 0.1, 0.06, 0, H + 0.08, z);
  },
  firepit: (k, w, d) => { // rectangular concrete fire table with a fire-glass trough and flames
    k.rbox('stone', 'firepit', w, 0.4, d, 0.02, 0, 0, 0);
    k.box('stone', '#2a2826', w * 0.7, 0.012, d * 0.4, 0, 0.4, 0);
    for (let i = 0; i < 5; i++) k.parts.push(...flame(k, -w * 0.28 + i * w * 0.14, 0.41, 0, 0.05 + (i % 2) * 0.03));
  },
  bbq: (k, w, d) => { // built-in stainless BBQ station: base cabinet, worktop, grill hood
    k.box('metal', 'steel', w, 0.86, d, 0, 0, 0);
    for (let x = -w / 2 + w / 4; x < w / 2; x += w / 4) k.box('paint', '#5a5f66', 0.008, 0.7, 0.008, x, 0.08, d / 2 + 0.003);
    k.box('chrome', 'steel', w + 0.02, 0.04, d + 0.04, 0, 0.86, 0);
    k.cyl('chrome', 'steel', d * 0.38, w * 0.5, 0, 0.88, 0, { rz: Math.PI / 2, seg: 14 });
    for (let i = 0; i < 4; i++) k.cyl('metal', 'black', 0.02, 0.03, -w * 0.18 + i * w * 0.12, 0.7, d / 2 + 0.01, { rx: Math.PI / 2, seg: 8 });
  },
  raisedbed: (k, w, d) => { k.box('wood', 'box', w, 0.45, d, 0, 0, 0); k.box('stone', '#3a2a1e', w - 0.1, 0.02, d - 0.1, 0, 0.44, 0); },
  crop: (k, w, d, it) => { // a planted row in the raised bed: soft mounds of foliage
    const n = Math.max(1, Math.round(d / 0.32));
    for (let i = 0; i < n; i++) k.ball('foliage', it.c, w * 0.48, 0, 0.36, -d / 2 + (i + 0.5) * d / n, { sy: 0.75, seg: 8, hseg: 6, sz: (d / n) / w });
  },
  boccelane: (k, w, d) => k.box('turf', 'lane', w, 0.012, d, 0, 0, 0),
  hole: k => { k.cyl('rubber', 'black', 0.06, 0.006, 0, 0, 0, { seg: 12 }); k.cyl('paint', 'white', 0.008, 1.3, 0, 0, 0, { seg: 6 }); k.box('fabric', '#d33', 0.01, 0.17, 0.26, 0, 1.1, 0.13); },
  bocceball: (k, w, d, it) => k.ball('paint', it.c, 0.055, 0, 0, 0, { seg: 10 }),
  golfball: k => k.ball('paint', 'white', 0.025, 0, 0, 0, { seg: 8 }),
  bench: (k, w, d, it) => { k.rbox('stone', it.c ?? 'frame', w, 0.08, d, 0.02, 0, 0.38, 0); for (const t of [-1, 1]) k.box('stone', it.c ?? 'frame', w * 0.9, 0.38, 0.06, 0, 0, t * d * 0.35); },
});

/* ---------------- decor ---------------- */
Object.assign(B, {
  rug: (k, w, d, it) => { // square-cornered as drawn, unless the plan shows a round or pill-shaped (stadium) rug
    if (Math.abs(w - d) < 0.05) k.cyl('rug', it.c ?? 'rug', w / 2, 0.014, 0, 0, 0, { seg: 40 });
    else if (it.shape === 'pill') k.slab('rug', it.c ?? 'rug', outline(w, d, { n: 2.6 }), 0.014, 0, 0, 0, 0);
    else k.rbox('rug', it.c ?? 'rug', w, 0.014, d, 0.006, 0, 0, 0);
  },
  device: (k, w, d) => k.rbox('metal', 'black', w, 0.02, d, 0.006, 0, 0, 0), // small black desk device, as drawn (too small to tell which)
  tilefloor: (k, w, d, it) => k.box('pavers', it.c ?? 'tile', w, 0.012, d, 0, 0, 0),
  bathtub: (k, w, d) => { // freestanding-look white tub against the wall: rim, inner basin, chrome filler
    k.rbox('paint', 'white', w, 0.56, d, 0.06, 0, 0, 0);
    k.slab('paint', '#e9eef0', outline(w * 0.74, d * 0.84, { n: 3 }), 0.012, 0, 0.555, 0, 0);
    k.cyl('chrome', 'chrome', 0.02, 0.18, 0, 0.56, -d / 2 + 0.08, { seg: 8 });
  },
  plant: (k, w) => { // potted plant: pot + clustered leaf mounds
    k.cyl('stone', 'pot', w * 0.3, 0.32, 0, 0, 0, { seg: 12, r2: w * 0.36 });
    [[0, 0.32, 0, 0.42], [w * 0.15, 0.42, w * 0.08, 0.32], [-w * 0.14, 0.45, -w * 0.06, 0.3], [0, 0.55, -w * 0.12, 0.28]]
      .forEach(([x, y, z, r]) => k.ball('foliage', 'plant', w * r, x, y, z, { seg: 8, hseg: 6 }));
  },
});

// flickering-free flame: a few emissive cones (kind 'fire' is unlit-ish and never casts shadow)
function flame(k, x, y, z, h) {
  const g = clean(new THREE.ConeGeometry(0.035, h, 6));
  g.translate(x, y + h / 2, z);
  return [{ geo: g, kind: 'fire', color: '#ffb057' }];
}

export const BUILDERS = B;
