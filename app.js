import { TOWER, ZONES, FAMILIES, AMENITIES, PLANS } from './data.js';

const $ = (s, el = document) => el.querySelector(s);
const h = (tag, attrs = {}, html = '') => Object.assign(document.createElement(tag), attrs, html && { innerHTML: html });
const FLOORS = 39;

/* ---------- Tower explorer ---------- */
const bands = $('#bands');
const list = $('#floor-list');
const pct = (v, of) => `${(v / of) * 100}%`;
// image is cropped horizontally to the tower and the canvas extends below the photo
Object.assign($('#elev-img').style, { width: pct(TOWER.imgW, TOWER.cropW), left: pct(-TOWER.cropX, TOWER.cropW), height: pct(TOWER.imgH, TOWER.canvasH) });
bands.style.aspectRatio = `${TOWER.cropW} / ${TOWER.canvasH}`;

const shaftPitch = (TOWER.podiumTop - TOWER.shaftTop) / (FLOORS - 4);
const podiumPitch = (TOWER.canvasH - TOWER.podiumTop) / 4;
for (let n = 1; n <= FLOORS; n++) {
  const podium = n <= 4;
  const top = podium ? TOWER.podiumTop + (4 - n) * podiumPitch : TOWER.shaftTop + (FLOORS - n) * shaftPitch;
  const left = podium ? TOWER.podiumLeft : TOWER.steps.filter(([y]) => top >= y).pop()[1];
  const right = podium ? TOWER.podiumRight : TOWER.right;
  const b = h('button', { type: 'button', className: 'band' + (podium ? ' podium' : ''), ariaLabel: `Floor ${n}` });
  b.dataset.n = n;
  b.dataset.label = podium ? `Podium · Floor ${n}` : `Floor ${n}`;
  Object.assign(b.style, {
    top: pct(top, TOWER.canvasH), height: pct(podium ? podiumPitch : shaftPitch, TOWER.canvasH),
    left: pct(left - TOWER.cropX, TOWER.cropW), width: pct(right - left, TOWER.cropW),
  });
  bands.append(b);
  list.prepend(h('li', {}, `<button type="button" data-n="${n}">${n}</button>`));
}

let floor = 0;
const zonesFor = n => ZONES.filter(z => n >= z.from && n <= z.to);
function selectFloor(n) {
  floor = Math.min(FLOORS, Math.max(1, n));
  document.querySelectorAll('[data-n]').forEach(el => el.classList.toggle('sel', +el.dataset.n === floor));
  $('#floor-num').value = floor;
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
bands.addEventListener('click', e => e.target.dataset.n && selectFloor(+e.target.dataset.n));
list.addEventListener('click', e => e.target.dataset.n && selectFloor(+e.target.dataset.n));
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
