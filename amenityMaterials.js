// Materials for the amenity floor model (amenity3d.js), all procedural: every texture is drawn
// in code on a canvas (wood grain, deck boarding, marble veining, fabric weave, bouclé, leather,
// rope weave, turf, brushed metal, rubber flecks, stone, pavers, foliage). One shared material per
// surface KIND; each item's colour rides on vertex colours, so the whole floor batches into one
// draw call per kind. Colours come from each space's sampled palette (amenityFloor.js).
import * as THREE from 'three';

const ENV_DEFAULT = 0.5; // share of the studio environment (amenity3d.js) each surface reflects; metals take more

/* kind → material parameters. tile = metres of surface per texture repeat (used by the UV pass). */
export const KINDS = {
  woodfloor: { roughness: 0.55, tile: 2.4 },
  wood: { roughness: 0.6, tile: 1.0 },
  marble: { roughness: 0.18, tile: 1.8 },
  fabric: { roughness: 0.95, tile: 0.4 },
  boucle: { roughness: 1, tile: 0.3 },
  leather: { roughness: 0.48, tile: 0.6 },
  rope: { roughness: 0.9, tile: 0.12 },
  rug: { roughness: 1, tile: 0.7 },
  turf: { roughness: 1, tile: 1.6 },
  deck: { roughness: 0.75, tile: 2.0 },
  metal: { roughness: 0.42, metalness: 0.55, tile: 0.6, env: 1 },
  chrome: { roughness: 0.2, metalness: 0.95, tile: 1, env: 1.2 },
  rubber: { roughness: 0.95, tile: 1.0 },
  stone: { roughness: 0.7, tile: 2.0 },
  pavers: { roughness: 0.9, tile: 1.8 },
  carpet: { roughness: 1, tile: 0.6 },
  foliage: { roughness: 0.9, tile: 1.0 },
  paint: { roughness: 0.45, tile: 1 },
  plain: { roughness: 0.85, tile: 1 },
};

/* ---------------- procedural textures (canvas, generated once) ----------------
   Each is a near-white luminance pattern; the palette colour multiplies it (vertex colour for
   batched items, material colour for floors), so one texture serves every colour of a kind. */
function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
function canvas(size, draw, seed = 7) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d'), r = rng(seed);
  draw(g, size, r);
  return c;
}
const grey = (v, a = 1) => `rgba(${v | 0},${v | 0},${v | 0},${a})`;
function speckle(g, s, r, n, lo, hi, size = 1, alpha = 0.5) {
  for (let i = 0; i < n; i++) { g.fillStyle = grey(lo + r() * (hi - lo), alpha); g.fillRect(r() * s, r() * s, size, size); }
}
// wood grain: long wavy streaks along u, darker early-wood bands, the odd knot
function grain(g, x0, y0, w, h, r, base, n = 26) {
  g.fillStyle = grey(base); g.fillRect(x0, y0, w, h);
  for (let i = 0; i < n; i++) {
    const y = y0 + r() * h, amp = 0.5 + r() * 2, f = 0.004 + r() * 0.01, ph = r() * 6;
    g.strokeStyle = grey(base - 25 - r() * 35, 0.25 + r() * 0.3); g.lineWidth = 0.6 + r() * 1.6;
    g.beginPath();
    for (let x = x0; x <= x0 + w; x += 8) g.lineTo(x, y + Math.sin(x * f + ph) * amp);
    g.stroke();
  }
  if (r() < 0.35) { const kx = x0 + r() * w, ky = y0 + r() * h; for (let k = 3; k > 0; k--) { g.strokeStyle = grey(base - 45, 0.35); g.beginPath(); g.ellipse(kx, ky, k * 4, k * 1.6, 0, 0, 7); g.stroke(); } }
}
const DRAW = {
  // engineered oak floor: 12 rows of planks, staggered end joints, per-plank tone
  woodfloor: (g, s, r) => {
    const rows = 12, ph = s / rows;
    for (let i = 0; i < rows; i++) {
      let x = -r() * s * 0.5;
      while (x < s) {
        const len = s * (0.35 + r() * 0.4);
        grain(g, x, i * ph, len, ph, r, 222 + r() * 30, 7);
        g.fillStyle = grey(150, 0.5); g.fillRect(x, i * ph, 1.2, ph);
        x += len;
      }
      g.fillStyle = grey(150, 0.55); g.fillRect(0, i * ph, s, 1.2);
    }
  },
  wood: (g, s, r) => grain(g, 0, 0, s, s, r, 238, 40),
  // decking: 14 boards with dark gaps, sun-weathered tone variation, grain
  deck: (g, s, r) => {
    const rows = 14, ph = s / rows;
    for (let i = 0; i < rows; i++) {
      let x = -r() * s;
      while (x < s) { const len = s * (0.6 + r() * 0.6); grain(g, x, i * ph, len, ph, r, 215 + r() * 40, 6); g.fillStyle = grey(60, 0.6); g.fillRect(x, i * ph, 1.5, ph); x += len; }
      g.fillStyle = grey(45, 0.85); g.fillRect(0, i * ph + ph - 2.5, s, 2.5);
    }
  },
  // marble: the plan's Calacatta-style top. White ground with faint clouds, a few bold grey veins
  // running on one diagonal (each with a soft halo and thin branches), drawn wrapped so the tile
  // repeats without a seam.
  marble: (g, s, r) => {
    g.fillStyle = grey(252); g.fillRect(0, 0, s, s);
    for (let i = 0; i < 30; i++) { const x = r() * s, y = r() * s, rad = 30 + r() * 90, gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, grey(232, 0.3)); gr.addColorStop(1, grey(232, 0)); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    const vein = (x, y, a, len, w, tone, alpha) => {
      const pts = [[x, y]];
      for (let k = 0; k < len; k++) { a += (r() - 0.5) * 0.5; x += Math.cos(a) * 7; y += Math.sin(a) * 7; pts.push([x, y]); }
      for (const [ox, oy] of [[0, 0], [s, 0], [-s, 0], [0, s], [0, -s], [s, s], [-s, -s], [s, -s], [-s, s]]) {
        for (const [lw, al] of [[w * 6, alpha * 0.12], [w * 2.2, alpha * 0.35], [w, alpha]]) {
          g.strokeStyle = grey(tone, al); g.lineWidth = lw; g.lineJoin = 'round';
          g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px + ox, py + oy) : g.moveTo(px + ox, py + oy))); g.stroke();
        }
      }
      return pts;
    };
    const dir = -0.65;
    for (let v = 0; v < 5; v++) {
      const pts = vein(r() * s, r() * s, dir + (r() - 0.5) * 0.5, 70 + r() * 40, 1.2 + r() * 2.2, 105 + r() * 50, 0.75);
      for (let b = 0; b < 3; b++) { const [bx, by] = pts[(r() * pts.length) | 0]; vein(bx, by, dir + (r() < 0.5 ? 0.9 : -0.9) + (r() - 0.5) * 0.6, 8 + r() * 18, 0.5 + r() * 0.9, 130 + r() * 40, 0.6); }
    }
  },
  // woven fabric: fine warp / weft lines over a noisy ground
  fabric: (g, s, r) => {
    g.fillStyle = grey(236); g.fillRect(0, 0, s, s);
    for (let i = 0; i < s; i += 2) { g.fillStyle = grey(215 + r() * 25, 0.5); g.fillRect(i, 0, 1, s); g.fillStyle = grey(210 + r() * 25, 0.4); g.fillRect(0, i, s, 1); }
    speckle(g, s, r, 3000, 200, 255, 1, 0.35);
  },
  // bouclé: a dense field of tiny looped curls
  boucle: (g, s, r) => {
    g.fillStyle = grey(232); g.fillRect(0, 0, s, s);
    for (let i = 0; i < 2600; i++) { const x = r() * s, y = r() * s, rad = 1.5 + r() * 3; g.strokeStyle = grey(r() < 0.5 ? 205 : 255, 0.55); g.lineWidth = 1; g.beginPath(); g.arc(x, y, rad, 0, 6.28); g.stroke(); }
  },
  // leather: mottled with fine pores
  leather: (g, s, r) => {
    g.fillStyle = grey(232); g.fillRect(0, 0, s, s);
    for (let i = 0; i < 60; i++) { const x = r() * s, y = r() * s, rad = 10 + r() * 40, gr = g.createRadialGradient(x, y, 0, x, y, rad); const v = r() < 0.5 ? 205 : 252; gr.addColorStop(0, grey(v, 0.25)); gr.addColorStop(1, grey(v, 0)); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    speckle(g, s, r, 4000, 180, 220, 1, 0.35);
  },
  // rope weave: over-under strands, as on the photo's lounge chairs
  rope: (g, s, r) => {
    g.fillStyle = grey(140); g.fillRect(0, 0, s, s);
    const n = 8, c = s / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const gr = (i + j) % 2 ? g.createLinearGradient(i * c, 0, i * c + c, 0) : g.createLinearGradient(0, j * c, 0, j * c + c);
      gr.addColorStop(0, grey(170)); gr.addColorStop(0.5, grey(255)); gr.addColorStop(1, grey(170));
      g.fillStyle = gr; g.fillRect(i * c + 1, j * c + 1, c - 2, c - 2);
    }
  },
  // rug: the plan's chunky salt-and-pepper knit. Rows of small loops, each light on top and dark
  // below, with the odd dark fleck
  rug: (g, s, r) => {
    g.fillStyle = grey(225); g.fillRect(0, 0, s, s);
    const p = 6;
    for (let y = 0; y < s; y += p) for (let x = (y / p) % 2 ? p / 2 : 0; x < s; x += p) {
      const v = r() < 0.1 ? 165 + r() * 30 : 215 + r() * 38;
      g.fillStyle = grey(v); g.beginPath(); g.ellipse(x, y, p * 0.55, p * 0.42, 0, 0, 6.28); g.fill();
      g.fillStyle = grey(v - 40, 0.35); g.fillRect(x - p * 0.4, y + p * 0.25, p * 0.8, 1);
    }
  },
  carpet: (g, s, r) => { g.fillStyle = grey(236); g.fillRect(0, 0, s, s); speckle(g, s, r, 9000, 205, 255, 1.5, 0.45); },
  // turf: thousands of blades + two broad mowing stripes
  turf: (g, s, r) => {
    g.fillStyle = grey(232); g.fillRect(0, 0, s, s);
    g.fillStyle = grey(255, 0.25); g.fillRect(0, 0, s, s / 2);
    for (let i = 0; i < 9000; i++) { const x = r() * s, y = r() * s; g.strokeStyle = grey(r() < 0.5 ? 175 : 255, 0.5); g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 2, y - 2 - r() * 3); g.stroke(); }
  },
  // matte metal: fine brushed streaks
  metal: (g, s, r) => { g.fillStyle = grey(235); g.fillRect(0, 0, s, s); for (let i = 0; i < 500; i++) { g.fillStyle = grey(205 + r() * 50, 0.35); g.fillRect(r() * s, r() * s, 10 + r() * 50, 1); } },
  // rubber gym floor: dark-on-dark EPDM flecks
  rubber: (g, s, r) => { g.fillStyle = grey(225); g.fillRect(0, 0, s, s); speckle(g, s, r, 6000, 150, 255, 2, 0.6); },
  // stone / concrete: cloudy, with pores
  stone: (g, s, r) => {
    g.fillStyle = grey(240); g.fillRect(0, 0, s, s);
    for (let i = 0; i < 70; i++) { const x = r() * s, y = r() * s, rad = 15 + r() * 60, gr = g.createRadialGradient(x, y, 0, x, y, rad); const v = r() < 0.5 ? 215 : 255; gr.addColorStop(0, grey(v, 0.3)); gr.addColorStop(1, grey(v, 0)); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    speckle(g, s, r, 2500, 150, 200, 1.2, 0.4);
  },
  // roof pavers: 3 × 3 slabs per tile, tone per slab, joints
  pavers: (g, s, r) => {
    const n = 3, c = s / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = grey(232 + r() * 20); g.fillRect(i * c, j * c, c, c); }
    speckle(g, s, r, 5000, 200, 255, 1, 0.35);
    g.fillStyle = grey(170, 0.8);
    for (let i = 0; i < n; i++) { g.fillRect(i * c, 0, 2, s); g.fillRect(0, i * c, s, 2); }
  },
  // foliage: overlapping leaf blobs, light tops / dark hollows
  foliage: (g, s, r) => {
    g.fillStyle = grey(190); g.fillRect(0, 0, s, s);
    for (let i = 0; i < 1600; i++) { const x = r() * s, y = r() * s, rad = 2 + r() * 5; g.fillStyle = grey(r() < 0.45 ? 140 : 255, 0.55); g.beginPath(); g.ellipse(x, y, rad, rad * 0.6, r() * 3, 0, 6.28); g.fill(); }
  },
  plain: (g, s, r) => { g.fillStyle = grey(246); g.fillRect(0, 0, s, s); speckle(g, s, r, 1500, 225, 255, 1, 0.3); },
};
const SIZE = { woodfloor: 512, deck: 512, marble: 512, turf: 256, pavers: 256, stone: 256, foliage: 256, rug: 256, carpet: 256 };

export function makeMaterials(renderer) {
  const mats = {}, aniso = Math.min(8, renderer?.capabilities.getMaxAnisotropy?.() ?? 4);
  let seed = 11;
  for (const [k, p] of Object.entries(KINDS)) {
    let map = null;
    if (DRAW[k]) {
      map = new THREE.CanvasTexture(canvas(SIZE[k] ?? 128, DRAW[k], seed += 7));
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = aniso;
    }
    mats[k] = new THREE.MeshStandardMaterial({ vertexColors: true, map, roughness: p.roughness, metalness: p.metalness ?? 0, envMapIntensity: p.env ?? ENV_DEFAULT });
  }
  mats.glass = new THREE.MeshStandardMaterial({ color: '#bcd6e4', transparent: true, opacity: 0.3, roughness: 0.1, depthWrite: false });
  mats.fire = new THREE.MeshStandardMaterial({ color: '#ffb057', emissive: '#ff7a1a', emissiveIntensity: 1.6 });
  return mats;
}

// floor slab material for one space (its own instance, so selection can tint it)
export const floorMaterial = (MAT, kind, color) =>
  new THREE.MeshStandardMaterial({ color, map: MAT[kind]?.map ?? null, roughness: KINDS[kind]?.roughness ?? 0.8, metalness: KINDS[kind]?.metalness ?? 0, envMapIntensity: KINDS[kind]?.env ?? ENV_DEFAULT });
