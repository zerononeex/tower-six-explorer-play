import { TOWER, ZONES, FAMILIES, AMENITIES, PLANS } from './data.js';
import { floorPolygon } from './towerGeometry.js';

const $ = (s, el = document) => el.querySelector(s);
const h = (tag, attrs = {}, html = '') => Object.assign(document.createElement(tag), attrs, html && { innerHTML: html });
const FLOORS = 39;

/* ---------- Tower explorer ---------- */
const svg = $('#tower-svg');
const floorsG = $('#floors');
const chip = $('#floor-chip');
const list = $('#floor-list');
const wrap = $('.tower-wrap');
const thumb = $('#scrub-thumb');
const SVGNS = 'http://www.w3.org/2000/svg';
const [vx, vy, vw, vh] = TOWER.view;
svg.setAttribute('viewBox', TOWER.view.join(' '));
Object.entries({ href: TOWER.src, width: TOWER.w, height: TOWER.h }).forEach(([k, v]) => $('#tower-img').setAttribute(k, v));

const label = n => n <= 4 ? `Podium · Floor ${n}` : `Floor ${n}`;
const polys = [];
for (let n = 1; n <= FLOORS; n++) {
  const pts = floorPolygon(TOWER, n);
  const p = document.createElementNS(SVGNS, 'polygon');
  p.setAttribute('points', pts.map(pt => pt.join(',')).join(' '));
  p.setAttribute('class', 'floor');
  p.setAttribute('tabindex', '0');
  p.setAttribute('role', 'button');
  p.setAttribute('aria-label', label(n));
  p.dataset.n = n;
  // chip anchor: left edge mid-height, in % of the displayed crop
  const [xl, yt] = pts[3], yb = pts[4][1];
  p.dataset.cx = (xl - vx) / vw * 100;
  p.dataset.cy = ((yt + yb) / 2 - vy) / vh * 100;
  p.dataset.ry = ((pts[0][1] + pts[7][1]) / 2 - vy) / vh * 100; // rail thumb: level with the floor at the corner
  floorsG.append(p);
  polys[n] = p;
  list.prepend(h('li', {}, `<button type="button" data-n="${n}">${n}</button>`));
}
const showChip = p => {
  if (!p) { chip.hidden = true; return; }
  chip.textContent = label(+p.dataset.n);
  chip.style.left = `${p.dataset.cx}%`;
  chip.style.top = `${p.dataset.cy}%`;
  chip.classList.toggle('inside', p.dataset.cx < 30); // no room to the left of the podium
  chip.hidden = false;
};

let floor = 0;
const zonesFor = n => ZONES.filter(z => n >= z.from && n <= z.to);
function selectFloor(n) {
  floor = Math.min(FLOORS, Math.max(1, n));
  document.querySelectorAll('[data-n]').forEach(el => el.classList.toggle('sel', +el.dataset.n === floor));
  $('#floor-num').value = floor;
  showChip(polys[floor]);
  thumb.style.top = `${polys[floor].dataset.ry}%`;
  thumb.hidden = false;
  const zones = zonesFor(floor);
  const fams = FAMILIES.filter(f => floor >= 34 || f.id !== 'ph');
  $('#floor-panel').innerHTML = `<h2>Floor ${floor}</h2>` + zones.map(z => `
    <div class="zone">
      <h3>${z.name}</h3><p class="muted">Floors ${z.from === z.to ? z.from : `${z.from}–${z.to}`}</p>
      <p>${z.line}</p>
      ${z.image ? `<img src="${z.image}" alt="${z.imageAlt}">` : ''}
      ${z.link ? `<a href="${z.link}">Explore the amenity floor →</a>` : ''}
    </div>`).join('') + (zones.some(z => z.plans) ? `
    <h3>Representative plans for this floor</h3>
    <p class="muted small">Plans are published by type, not floor by floor. 3D models exist for 2 Bed and the Penthouse Collection.</p>
    <div class="plan-btns">${fams.map(f => f.plan
      ? `<button type="button" class="btn" data-plan="${f.plan}">${f.name} · 3D</button>`
      : `<button type="button" disabled title="3D model not built yet">${f.name}</button>`).join('')}</div>` : '');
}
floorsG.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.n) { e.preventDefault(); selectFloor(+e.target.dataset.n); }
});
floorsG.addEventListener('pointerover', e => e.target.dataset.n && showChip(e.target));
floorsG.addEventListener('focusin', e => showChip(e.target));
const restoreChip = () => showChip(polys[floor]);
floorsG.addEventListener('pointerleave', restoreChip);
floorsG.addEventListener('focusout', restoreChip);
list.addEventListener('click', e => e.target.dataset.n && selectFloor(+e.target.dataset.n));
/* Tower as controller: a vertical drag (touch or mouse) or the wheel scrubs floors; a tap selects
   the floor under it, and tapping the already-selected floor scrolls to its panel. */
const floorAt = (x, y) => document.elementsFromPoint(x, y).find(el => el.classList?.contains('floor'));
const tapFloor = p => {
  if (!p) return;
  const n = +p.dataset.n;
  if (n === floor) $('#floor-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  else selectFloor(n);
};
// one floor per ~60% of a floor's on-screen height (a floor is ~36 image px), never under 10px
const stepPx = () => Math.max(10, 0.6 * 36 * wrap.getBoundingClientRect().height / vh);
let drag = null;
wrap.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  drag = { id: e.pointerId, y0: e.clientY, y: e.clientY, acc: 0, moved: false };
  wrap.setPointerCapture(e.pointerId);
});
wrap.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.id) return;
  if (!drag.moved && Math.abs(drag.y0 - e.clientY) < 6) return;
  if (!drag.moved) { drag.moved = true; drag.y = drag.y0; }
  drag.acc += drag.y - e.clientY; // up is positive
  drag.y = e.clientY;
  const step = stepPx();
  let n = floor || 20;
  while (drag.acc >= step) { drag.acc -= step; n++; }
  while (drag.acc <= -step) { drag.acc += step; n--; }
  // saturate at the ends: excess travel is dropped, so reversing moves straight back
  if (n >= FLOORS) { n = FLOORS; drag.acc = Math.min(drag.acc, 0); }
  if (n <= 1) { n = 1; drag.acc = Math.max(drag.acc, 0); }
  if (n !== floor) selectFloor(n);
});
const endDrag = e => {
  if (!drag || e.pointerId !== drag.id) return;
  const wasTap = !drag.moved && e.type === 'pointerup';
  drag = null;
  if (wasTap) tapFloor(floorAt(e.clientX, e.clientY));
  else restoreChip();
};
wrap.addEventListener('pointerup', endDrag);
wrap.addEventListener('pointercancel', endDrag);
let wheelAcc = 0;
wrap.addEventListener('wheel', e => {
  const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
  const dir = Math.sign(dy);
  const cur = floor || 20;
  // pass through to page scroll at the ends
  if (!dir || (dir > 0 && cur === 1) || (dir < 0 && cur === FLOORS)) { wheelAcc = 0; return; }
  e.preventDefault();
  wheelAcc += dy;
  const steps = Math.trunc(wheelAcc / 50); // ~2 floors per mouse-wheel notch
  if (!steps && floor) return;
  wheelAcc -= steps * 50;
  selectFloor(cur - steps);
}, { passive: false });

$('#floor-down').onclick = () => selectFloor(floor ? floor - 1 : 1);
$('#floor-up').onclick = () => selectFloor(floor + 1);

/* ---------- Plan finder ---------- */
$('#plan-cards').innerHTML = FAMILIES.map(f => `
  <article class="card" data-beds="${f.beds}">
    <h3>${f.name}</h3>
    <p>${f.homes} homes · ${f.sf} SF</p>
    ${f.price ? `<p class="price">${f.price}<small>${f.priceSrc}</small></p>` : ''}
    ${f.plan ? `<button type="button" class="btn" data-plan="${f.plan}">Open 3D model</button>` : ''}
  </article>`).join('');
$('#plan-chips').addEventListener('click', e => {
  const beds = e.target.dataset.beds;
  if (!beds) return;
  e.currentTarget.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === e.target));
  document.querySelectorAll('#plan-cards .card').forEach(c => { c.hidden = beds !== 'all' && c.dataset.beds !== beds; });
});

/* ---------- Tabs / crossfades (schemes, kitchens, penthouse) ---------- */
document.querySelectorAll('[data-tabs]').forEach(root => root.addEventListener('click', e => {
  const i = e.target.dataset.for;
  if (i === undefined) return;
  root.querySelectorAll('[data-for]').forEach(b => b.setAttribute('aria-pressed', b.dataset.for === i));
  root.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('on', t.dataset.tab === i));
}));

/* ---------- Amenity explorer ---------- */
const spots = $('#hotspots');
AMENITIES.forEach(a => {
  const spot = h('button', { type: 'button', className: 'spot', ariaLabel: `${a.n}. ${a.name}`, textContent: a.n });
  spot.style.cssText = `left:${a.x}%;top:${a.y}%`;
  spots.append(spot);
  $('#amenity-list').append(h('li', {}, `<button type="button">${a.n}. ${a.name}</button>`));
});
const pickAmenity = i => {
  const a = AMENITIES[i];
  [...spots.querySelectorAll('.spot')].forEach((s, j) => s.classList.toggle('sel', j === i));
  $('#amenity-card').innerHTML = `<h3>${a.n}. ${a.name}</h3><p>${a.line}</p>${a.image ? `<img src="${a.image}" alt="${a.name}">` : ''}`;
};
spots.addEventListener('click', e => e.target.classList.contains('spot') && pickAmenity(+e.target.textContent - 1));
$('#amenity-list').addEventListener('click', e => {
  const li = e.target.closest('li');
  if (li) pickAmenity([...li.parentNode.children].indexOf(li));
});

/* ---------- Register (demo) ---------- */
$('#register-form').addEventListener('submit', e => {
  e.preventDefault();
  $('#register-msg').textContent = 'Demo only — nothing was sent or saved.';
});

/* ---------- 3D viewer ---------- */
const dlg = $('#viewer');
const info = $('#room-info');
const ftIn = ft => { const i = Math.round(ft * 12); return `${Math.floor(i / 12)}'${i % 12}"`; };
const area = pts => Math.abs(pts.reduce((s, [x, y], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return s + x * y2 - x2 * y; }, 0) / 2);
let viewer, plan;

const loadImage = src => new Promise((ok, fail) => Object.assign(new Image(), { onload: () => ok(src), onerror: fail, src }));
async function pickRoom(room) {
  if (!room) return;
  const xs = room.points.map(p => p[0]), ys = room.points.map(p => p[1]);
  const dims = `${ftIn(Math.max(...xs) - Math.min(...xs))} × ${ftIn(Math.max(...ys) - Math.min(...ys))} · ${Math.round(area(room.points))} SF`;
  // dropped-in room image (assets/rooms/<planId>-<room>.jpg) wins over the mapped render
  const dropped = `assets/rooms/${plan.id}-${room.id}.jpg`;
  const src = await loadImage(dropped).catch(() => room.image && loadImage(room.image).catch(() => null));
  if (!src) {
    info.innerHTML = `<b>${room.name}</b> · ${dims} — Marketing image not published for this room`;
    return;
  }
  info.innerHTML = `<b>${room.name}</b> · ${dims}`;
  $('#lb-img').src = src;
  $('#lb-img').alt = room.name;
  $('#lb-title').textContent = room.name;
  $('#lb-note').textContent = src === dropped ? '— concept image for this plan' : room.imageNote ? `— ${room.imageNote}` : `— ${plan.name} marketing image`;
  $('#lightbox').showModal();
}

async function openPlan(id) {
  plan = PLANS[id];
  $('#viewer-title').textContent = plan.name;
  $('#viewer-specs').textContent = `${plan.sf.toLocaleString()} SF interior${plan.outdoorSf ? ` + ${plan.outdoorSf.toLocaleString()} SF terrace` : ''} · ceiling ${plan.ceilingLabel} · ${plan.source}`;
  info.textContent = 'Drag to rotate · scroll or pinch to zoom · right-drag or two fingers to pan · click a room.';
  dlg.showModal();
  try {
    viewer ??= (await import('./viewer3d.js')).createViewer($('#viewer-canvas'), pickRoom);
  } catch {
    info.textContent = 'The 3D viewer could not load Three.js from unpkg.com — check your connection.';
    return;
  }
  $('#v-xray').setAttribute('aria-pressed', false);
  viewer.load(plan);
  viewer.start();
}
document.addEventListener('click', e => { const id = e.target.dataset?.plan; if (id) openPlan(id); });
$('#v-close').onclick = () => dlg.close();
dlg.addEventListener('close', () => viewer?.stop());
$('#v-top').onclick = () => viewer?.topDown();
$('#v-xray').onclick = e => {
  const on = e.target.getAttribute('aria-pressed') !== 'true';
  e.target.setAttribute('aria-pressed', on);
  viewer?.setXray(on);
};
$('#lb-close').onclick = () => $('#lightbox').close();
