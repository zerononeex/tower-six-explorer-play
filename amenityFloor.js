// Traced geometry of the Level 5 amenity floor, for amenity3d.js.
//
// Source: assets/05-amenity-floor-birdseye.jpg (2084×1574), the developer's numbered bird's-eye plan
// that the Amenity Explorer already uses. Every coordinate below is a SOURCE PIXEL of that image
// (x → right, y → down; the plan's north arrow points right). Method: the image was overlaid with a
// 50 px grid and read in four full-resolution quadrant crops; each space's footprint is the floor
// finish / wall line around its published number, and each furniture item is the footprint of the
// object drawn there. Space names, numbering, copy and photos are NOT repeated here: they come
// from AMENITIES in data.js (space n ↔ AMENITIES[n − 1]).
//
// Scale: 42 px = 1 m, from objects of known size drawn in the plan (8-ft pool table ≈ 60 × 105 px,
// treadmills ≈ 35 × 85 px, chaise loungers ≈ 88 px long). It makes the plate ≈ 47 × 33 m.
export const AMENITY_FLOOR = {
  src: 'assets/05-amenity-floor-birdseye.jpg', w: 2084, h: 1574,
  pxPerM: 42,
  // whole slab: west roof terrace + top/bottom terrace strips + the building
  plate: [[58, 72], [1365, 72], [1365, 235], [2015, 235], [2015, 1462], [1350, 1462], [1350, 1400], [1105, 1400], [1105, 1452], [58, 1452]],
  // building envelope (interior floor); everything on the plate outside it is roof terrace
  building: [[655, 198], [1365, 198], [1365, 235], [2015, 235], [2015, 1300], [1610, 1300], [1610, 1398], [1030, 1398], [1030, 1300], [652, 1300], [652, 905], [690, 905], [690, 600], [655, 600]],
  // glass guard on the terrace edge (open polyline)
  guard: [[1365, 72], [58, 72], [58, 1452], [1105, 1452], [1105, 1400]],

  /* One entry per published space number. kind: indoor (low open-top walls) | outdoor (landscape,
     no walls). finish: floor material key in amenity3d.js. Space 3 has three zones on the plan,
     each carrying its own "3". label: where the plan prints the number (defaults to the explorer's
     hotspot x/y in data.js). */
  spaces: {
    1: { kind: 'indoor', finish: 'oak', polys: [[[880, 1080], [1240, 1080], [1240, 1035], [1780, 1035], [1780, 1295], [1610, 1295], [1610, 1395], [1030, 1395], [1030, 1300], [880, 1300]]] },
    2: { kind: 'indoor', finish: 'maple', polys: [[[652, 1080], [880, 1080], [880, 1300], [652, 1300]]] },
    3: { kind: 'outdoor', finish: 'rubber', polys: [
      [[655, 1305], [1030, 1305], [1030, 1388], [655, 1388]],
      [[1355, 1400], [1600, 1400], [1600, 1462], [1355, 1462]],
      [[1630, 1305], [1762, 1305], [1762, 1458], [1630, 1458]],
    ], labels: [[925, 1376], [1520, 1410], [1664, 1410]], finishes: ['rubber', 'rubber', 'deck'] },
    4: { kind: 'outdoor', finish: 'deck', polys: [[[430, 915], [612, 915], [612, 1395], [430, 1395]]] },
    5: { kind: 'outdoor', finish: 'soil', polys: [[[350, 915], [430, 915], [430, 1395], [350, 1395]]] },
    6: { kind: 'outdoor', finish: 'turf', polys: [[[125, 918], [350, 918], [350, 1390], [125, 1390]]] },
    7: { kind: 'outdoor', finish: 'deck', polys: [[[132, 198], [390, 198], [390, 545], [132, 545]]] },
    8: { kind: 'outdoor', finish: 'pavers', polys: [[[390, 198], [655, 198], [655, 600], [390, 600]]] },
    9: { kind: 'indoor', finish: 'stone', polys: [[[672, 200], [900, 200], [900, 600], [672, 600]]] },
    10: { kind: 'indoor', finish: 'stone', polys: [[[690, 600], [900, 600], [900, 560], [1088, 560], [1088, 1072], [652, 1072], [652, 905], [690, 905]]] },
    // 11 and 12 are one open oak room on the plan: no wall between them, and their south / west side is
    // the curved glass front (12's items), not a wall. `open` lists edges [x0, y0, x1, y1] that get no wall.
    11: { kind: 'indoor', finish: 'oak', polys: [[[900, 200], [1050, 200], [1050, 368], [1240, 368], [1240, 425], [1175, 425], [1175, 475], [1095, 480], [938, 475], [900, 475]]],
      open: [[1240, 425, 1175, 425], [1175, 425, 1175, 475], [1175, 475, 1095, 480], [1095, 480, 938, 475]] },
    12: { kind: 'indoor', finish: 'oak', polys: [[[1095, 480], [1175, 475], [1175, 425], [1240, 425], [1240, 560], [1135, 560], [1128, 515], [1112, 492]]],
      open: [[1095, 480, 1175, 475], [1175, 475, 1175, 425], [1175, 425, 1240, 425], [1135, 560, 1128, 515], [1128, 515, 1112, 492], [1112, 492, 1095, 480]] },
    13: { kind: 'indoor', finish: 'carpet', polys: [[[1050, 200], [1365, 200], [1365, 368], [1050, 368]]] },
    14: { kind: 'indoor', finish: 'oak', polys: [[[1395, 242], [1790, 242], [1790, 415], [1700, 415], [1700, 528], [1625, 528], [1625, 555], [1395, 555]]] },
    15: { kind: 'indoor', finish: 'carpet', polys: [[[1790, 252], [1940, 252], [1940, 490], [1900, 490], [1900, 588], [1790, 588]]] },
    16: { kind: 'indoor', finish: 'oak', polys: [[[1615, 872], [1748, 872], [1748, 1025], [1615, 1025]]] },
    17: { kind: 'indoor', finish: 'kids', polys: [[[1752, 872], [1840, 872], [1840, 940], [2012, 940], [2012, 1300], [1785, 1300], [1785, 1040], [1752, 1040]]] },
    18: { kind: 'outdoor', finish: 'deck', polys: [[[1765, 1305], [2008, 1305], [2008, 1458], [1765, 1458]]] },
  },

  // Non-amenity parts drawn on the plan: lift / stair cores, washrooms, back-of-house (solid white
  // blocks, not selectable) and corridors (floor only).
  cores: [
    { poly: [[1195, 568], [1422, 568], [1422, 662], [1195, 662]], top: '#3d4045' }, // elevators
    { poly: [[1195, 748], [1422, 748], [1422, 858], [1195, 858]], top: '#3d4045' }, // elevators
    { poly: [[1090, 868], [1442, 868], [1442, 968], [1090, 968]], top: '#c9c7c3' }, // stair
    { poly: [[1592, 728], [1792, 728], [1792, 830], [1592, 830]], top: '#c9c7c3' }, // stair
    { poly: [[70, 705], [180, 705], [180, 905], [70, 905]], top: '#d9d6d0' }, // terrace stair
    { poly: [[1450, 545], [1700, 545], [1700, 690], [1450, 690]] }, // washrooms
    { poly: [[928, 560], [1050, 560], [1050, 828], [928, 828]] }, // bar back-of-house
    { poly: [[1792, 590], [2015, 590], [2015, 868], [1792, 868]] }, // service block
    { poly: [[1240, 368], [1365, 368], [1365, 560], [1240, 560]] }, // service lobby
  ],
  corridors: [
    [[1088, 662], [1792, 662], [1792, 748], [1088, 748]],
    [[1700, 415], [1790, 415], [1790, 728], [1700, 728]],
    [[1442, 830], [1615, 830], [1615, 1000], [1442, 1000]],
  ],

  // Unnumbered roof-terrace landscape (between and around the numbered outdoor spaces)
  terrace: {
    decks: [[[70, 620], [330, 620], [330, 905], [70, 905]]],
    hedges: [[120, 128, 315, 198], [132, 198, 146, 540], [340, 255, 385, 360], [340, 435, 385, 532], [485, 805, 590, 870], [500, 600, 610, 700], [330, 700, 385, 775]],
    lavender: [[640, 128, 1255, 168]],
    trees: [[365, 190, 60], [555, 180, 62], [150, 595, 62], [355, 580, 50], [555, 560, 58], [270, 735, 55], [360, 915, 52], [550, 915, 58]],
    sets: [[200, 735], [440, 740]], // bistro table + 4 chairs
  },
};

/* ======================= DETAIL PASS: items + palettes, per space =======================
   items: every furniture / object footprint visible in the bird's-eye plan, re-traced space by
   space at full resolution on a 25 px grid. { type, x, y, w, d, rot, c? }
     x, y  footprint centre, in the plan's source pixels (same system as the room traces)
     w, d  the item's own width × depth in px, before rotation (w = side to side, d = back to front)
     rot   degrees clockwise in the image; 0 = the item's back toward the image top, 90 = back
           toward the image right, 180 = bottom, 270 = left. Round / symmetric items use 0.
     c     palette key (or a hex) for the item's main colour; otherwise the type's default key
   An item exists only if the plan (position + footprint) or the space's photo shows it; where the
   two disagree the plan governs position and the photo governs appearance. A few seats are hidden
   under the plan's own number chips: those are listed only where the visible half of a symmetric
   set implies them, and each is marked "under chip".

   palette: colours sampled from the space's marketing photo (median of a hand-picked region) or,
   for spaces SHAPE publishes no photo of, from the bird's-eye itself. `src` names the image.
   Sampling regions live in docs/verification/detail/palette-regions.json. */
const BIRD = 'assets/05-amenity-floor-birdseye.jpg';
const I = (type, x, y, w, d, rot = 0, c, more) => ({ type, x, y, w, d, rot, ...(c ? { c } : {}), ...more });
// seats around a centre, each with its back facing away from it (angles in image degrees, 0 = right)
const ring = (type, cx, cy, r, angles, w, d, c) => angles.map(a => I(type, Math.round(cx + r * Math.cos(a * Math.PI / 180)), Math.round(cy + r * Math.sin(a * Math.PI / 180)), w, d, a + 90, c));

const DETAIL = {
  1: { // Fitness Facility
    palette: { src: 'assets/06-amenity-gym.jpg', floor: '#a68b6f', wall: '#63605c', cabinet: '#9c8063', rubber: '#363231', frame: '#332f2d',
      black: '#15130e', accent: '#a52222', disc: '#615655' },
    items: [
      ...[1071, 1124, 1178, 1231, 1284].map(x => I('treadmill', x, 1331, 36, 84, 180)),
      ...[1077, 1144, 1210, 1277].map(x => I('recumbent', x, 1191, 37, 90, 0)),
      ...[937, 972, 1010].map(x => I('spin', x, 1105, 22, 48, 180)), ...[948, 990].map(x => I('spin', x, 1254, 22, 50, 180)),
      I('machine', 1290, 1052, 60, 33, 0), I('machine', 1377, 1175, 36, 60, 90), I('machine', 1377, 1233, 36, 60, 90),
      I('flatbench', 1371, 1306, 56, 15, 0), I('flatbench', 1371, 1354, 56, 15, 0),
      I('dbrack', 1579, 1225, 36, 100, 0), I('powerrack', 1571, 1330, 73, 84, 0),
      I('weightbench', 1700, 1077, 95, 21, 0), I('weightbench', 1700, 1127, 95, 21, 0),
      I('plyobox', 1702, 1200, 73, 26, 0), I('plyobox', 1702, 1237, 73, 26, 0),
      I('cabinetwall', 1492, 1042, 240, 15, 0),
    ],
  },
  2: { // Stretching / Yoga / Dance Studio
    palette: { src: BIRD, floor: '#d9c1a6', mat: '#33302f' },
    items: [
      ...[738, 779, 819].map(x => I('mat', x, 1137, 25, 72)), ...[720, 762, 804, 845].map(x => I('mat', x, 1233, 25, 72)),
      I('glasswall', 877, 1171, 178, 5, 90),
    ],
  },
  3: { // Outdoor Fitness Zones (three zones)
    palette: { src: BIRD, rubber: '#353842', mat: '#b8d2eb', deck: '#5b3429', ball: '#dee4f1', black: '#232530' },
    items: [
      ...[732, 774, 817, 942, 986].map(x => I('mat', x, 1340, 26, 72, 0, 'mat')),
      I('exball', 1654, 1333, 48, 48), I('mat', 1708, 1371, 27, 73, 0, 'black'), I('roller', 1742, 1374, 8, 30),
      I('dumbbell', 1732, 1396, 10, 20), I('kettlebell', 1747, 1446, 14, 14),
    ],
  },
  4: { // Quiet Chaise Lounge Area
    palette: { src: BIRD, deck: '#eb9862', fabric: '#ffffff', frame: '#3b3e4b', table: '#676360' },
    items: [
      ...[1033, 1093, 1166, 1228, 1304, 1365].map(y => I('lounger', 556, y, 37, 87, 90)),
      I('sidetable', 589, 1129, 25, 25), I('sidetable', 589, 1265, 25, 25),
      I('bench', 435, 1054, 16, 122, 0, 'frame'), I('bench', 435, 1196, 16, 122, 0, 'frame'),
    ],
  },
  5: { // Gardening Area: one raised bed in three planted rows of alternating crops, + a bistro set
    palette: { src: BIRD, red: '#7c3913', green: '#546034', pale: '#4e5929', table: '#666261', chair: '#4d4342', box: '#151b01' },
    items: [
      I('raisedbed', 387, 1162, 75, 330),
      ...[[1018, 'red'], [1062, 'green'], [1118, 'red'], [1172, 'green'], [1222, 'red'], [1285, 'green']].map(([y, c], i) => I('crop', 362, y, 22, [37, 51, 59, 50, 50, 76][i], 0, c)),
      ...[[1018, 'green'], [1062, 'red'], [1118, 'green'], [1172, 'red'], [1222, 'green'], [1285, 'red']].map(([y, c], i) => I('crop', 387, y, 22, [37, 51, 59, 50, 50, 76][i], 0, c)),
      I('crop', 412, 1162, 22, 330, 0, 'pale'),
      I('bistro', 383, 1355, 37, 37), ...[[365, 1335, 315], [412, 1338, 45], [365, 1380, 225], [412, 1378, 135]].map(([x, y, r]) => I('chair', x, y, 20, 20, r, 'chair')),
    ],
  },
  6: { // Putting Green & Bocce
    palette: { src: BIRD, turf: '#9bb549', lane: '#869f3c', red: '#dfaf6d', blue: '#b8c9bf', white: '#f9ffd1' },
    items: [
      I('boccelane', 250, 1172, 100, 435),
      I('hole', 254, 968, 10, 10), I('hole', 222, 1223, 10, 10), I('hole', 253, 1363, 10, 10),
      ...[[253, 991], [282, 992], [241, 1023], [243, 1084]].map(([x, y]) => I('bocceball', x, y, 6, 6, 0, 'red')),
      ...[[279, 1314], [230, 1327], [278, 1345], [234, 1359]].map(([x, y]) => I('bocceball', x, y, 6, 6, 0, 'blue')),
      I('golfball', 263, 1007, 4, 4), I('golfball', 254, 1269, 4, 4),
    ],
  },
  7: { // Firepit & Outdoor Social — styled from the developer's outdoor amenity terrace render
    palette: { src: 'assets/04-outdoor-amenity-terrace.jpg', deck: '#644f3c', sofa: '#dac7b7', cushion: '#ab9888', frame: '#221f1e',
      slats: '#30201a', rope: '#5d564a', firepit: '#8b715e', stone: '#7d7870', hedge: '#2a2f1b' },
    items: [
      I('pergola', 237, 376, 196, 338),
      I('sofa', 240, 242, 84, 43, 0),
      ...[277, 332, 466, 521].flatMap(y => [I('ropechair', 170, y, 42, 41, 270), I('ropechair', 307, y, 42, 41, 90)]),
      I('firepit', 234, 377, 57, 28), I('coffee', 237, 493, 45, 43, 0, 'firepit'),
    ],
  },
  8: { // BBQ & Outdoor Dining
    palette: { src: BIRD, pavers: '#f6e8d9', table: '#71685f', chair: '#515150', steel: '#dde1eb' },
    items: [
      I('bbq', 476, 227, 82, 35, 0),
      I('longtable', 546, 329, 132, 42), I('longtable', 546, 473, 133, 41),
      ...[501, 531, 561, 591].flatMap(x => [I('chair', x, 300, 22, 20, 0), I('chair', x, 360, 22, 20, 180), // two of the lower four under chip
        I('chair', x, 444, 22, 20, 0), I('chair', x, 503, 22, 20, 180)]),
    ],
  },
  9: { // Games Lounge
    palette: { src: BIRD, floor: '#eae3dd', rug: '#dccfc5', banquette: '#7b4936', chair: '#af948b', felt: '#677138', wood: '#f0d0b1',
      white: '#d2cecb', plant: '#6c823b' },
    items: [
      I('rug', 817, 437, 120, 295, 0, null, { shape: 'pill' }),
      I('banquette', 800, 236, 186, 37, 0, null, { low: true, seg: 2 }),
      I('pooltable', 814, 384, 58, 102), I('foosball', 813, 535, 80, 45),
      ...[[708, 288, 270], [708, 352, 270], [728, 498, 270], [730, 568, 270]].map(([x, y, r]) => I('tubchair', x, y, 32, 32, r)),
      I('sidetable', 700, 322, 13, 13, 0, 'white'), I('sidetable', 717, 525, 13, 13, 0, 'white'),
      I('plant', 697, 492, 18, 18), I('plant', 693, 583, 18, 18),
      I('console', 692, 238, 58, 33, 270), I('console', 705, 463, 56, 23, 0),
    ],
  },
  10: { // Bar & Social Lounge
    palette: { src: BIRD, upholstery: 'leather', floor: '#f0eee7', marble: '#d6d3ce', sofa: '#934315', banquette: '#5f392c', wood: '#d4b296',
      chair: '#90796d', rug: '#d1c4ba', side: '#f1dbc7', stool: '#a0693f', woodside: '#c39472', shell: '#ebe3dc', oval: '#d3b284',
      leather: '#613c33', bench: '#dec9b3', plant: '#67792e' },
    items: [
      I('bar', 912, 763, 280, 33, 90),
      ...[660, 700, 743, 785, 829, 871].map(y => I('stool', 888, y, 14, 15, 0, null, { seat: 'wood' })),
      I('banquette', 990, 840, 120, 25, 0, 'leather'), I('banquette', 944, 878, 50, 28, 270, 'leather'),
      I('rug', 799, 757, 88, 88, 0, 'rug'), I('curvesofa', 800, 763, 146, 24, 90), I('roundtable', 778, 764, 38, 38, 0, 'side', { kind: 'wood', h: 0.45 }),
      I('sidetable', 814, 682, 19, 19, 0, 'woodside'), I('sidetable', 816, 850, 19, 19, 0, 'woodside'),
      I('plant', 847, 688, 20, 20), I('plant', 847, 840, 20, 20),
      I('rug', 769, 995, 88, 88, 0, 'rug'), I('pebble', 766, 1017, 58, 32, 0, 'oval', { taper: 0.2, n: 2.2 }),
      ...[[755, 962, -11], [705, 987, -64], [815, 977, 51]].map(([x, y, r]) => I('shellchair', x, y, 30, 28, r)),
      I('plant', 666, 1017, 16, 16), I('plant', 675, 1042, 22, 22), I('bench', 788, 1062, 75, 17, 0, 'bench'),
      ...[922, 984, 1047].flatMap(x => [I('worktable', x, 1018, 39, 37), I('deskchair', x, 983, 26, 26, 0)]),
      I('deskchair', 888, 1015, 26, 26, 270), I('deskchair', 1081, 1015, 26, 26, 90),
      I('banquette', 988, 1051, 213, 32, 180),
    ],
  },
  11: { // Co-Working Space
    palette: { src: BIRD, floor: '#d9b585', wood: '#86523b', marble: '#efebe7', chair: '#a48b78', white: '#f9f1e7', lounge: '#ead4bf',
      plant: '#778624' },
    items: [
      I('carrel', 921, 288, 70, 33, 270), I('carrel', 921, 362, 70, 33, 270), I('carrel', 921, 435, 64, 33, 270),
      I('divider', 934, 325, 58, 6), I('divider', 934, 398, 58, 6),
      ...[288, 365, 438].flatMap(y => [I('desk', 963, y, 40, 40, 270), I('deskchair', 995, y, 24, 26, 90)]), // middle chair mostly under chip
      I('device', 971, 289, 4, 12), I('loungechair', 1028, 244, 33, 35, 315, 'lounge'), I('sidetable', 1036, 271, 12, 12, 0, 'white'),
      I('plant', 952, 238, 15, 15), I('plant', 1065, 393, 25, 25), I('plant', 1088, 388, 15, 15),
    ],
  },
  12: { // Private Study Pods
    palette: { src: BIRD, floor: '#d9ba8a', rug: '#725d4c', desk: '#e9e1db', pod: '#f3f3f7', chair: '#7c614f' },
    items: [
      I('pod', 1207, 461, 63, 65, 0), I('pod', 1207, 531, 63, 58, 0),
      // the see-through curved glass front of 11 + 12 (the plan's black frame line), with its doorway left OPEN at
      // x 1027–1055 on the straight run: the sliding leaf (the darker framed panel) is drawn parked beside it
      { ...I('glasscurve', 983, 476, 89, 10, 0), pts: [[938, 475], [1027, 476]] },
      { ...I('glasscurve', 1095, 517, 80, 85, 0), pts: [[1055, 477], [1095, 480], [1112, 492], [1128, 515], [1135, 560]] },
      I('glassdoor', 997, 478, 59, 8, 0),
    ],
  },
  13: { // Meeting Room
    palette: { src: BIRD, rug: '#dbcdc1', table: '#f6d4b4', chair: '#caaf9a', marble: '#f7f3ee' },
    items: [
      I('rug', 1215, 305, 285, 114),
      I('meetingtable', 1217, 290, 123, 46, 0, null, { taper: -0.32, n: 2.6, flat: 0.25 }), // boat-shaped: narrow rounded west end
      ...[1176, 1206, 1236, 1266].flatMap(x => [I('meetingchair', x, 254, 22, 22, 0), I('meetingchair', x, 328, 22, 22, 180)]),
      I('meetingchair', 1143, 292, 22, 22, 270),
      I('credenza', 1084, 295, 94, 17, 270),
    ],
  },
  14: { // Large Private Lounge with Kitchen
    // chair = the cognac leather of the seats, between their lit and shaded halves (an earlier sample sat in the seat shadow and read near-black); chairRim = the shell's lit outer edge; rug = its lit knit
    palette: { src: BIRD, floor: '#e3c69e', marble: '#f4f1ed', chair: '#6e4830', chairRim: '#977453', legs: '#51301b', sofa: '#c9bdb1', rug: '#af9d91',
      coffee: '#36281f', boucle: '#e0d4ca', stool: '#c9bfb8', counter: '#e6e2e0', plant: '#788620' },
    items: [
      I('marbletable', 1518, 333, 118, 50, 0, null, { n: 5 }),
      ...[1482, 1512, 1542].flatMap(x => [I('diningchair', x, 300, 20, 20, 0), I('diningchair', x, 368, 20, 20, 180)]),
      I('diningchair', 1449, 334, 20, 20, 270), I('diningchair', 1586, 333, 20, 20, 90),
      I('roundtable', 1702, 341, 63, 63, 0, 'marble'), ...ring('diningchair', 1702, 341, 43, [-125, -72, -11, 49, 115, 175], 20, 20),
      I('pier', 1628, 322, 33, 139, 0),
      I('counter', 1402, 327, 140, 21, 270), I('stool', 1420, 319, 13, 13, 90, 'stool', { seat: 'square' }), I('stool', 1420, 357, 13, 13, 90, 'stool', { seat: 'square' }),
      I('rug', 1512, 470, 151, 124),
      I('cloudsofa', 1518, 431, 125, 52, 0, 'sofa', { pillow: 'boucle' }),
      I('tubchair', 1447, 486, 30, 28, 270, 'boucle'), I('tubchair', 1582, 486, 30, 28, 90, 'boucle'), // backs to the room's sides, facing the coffee table
      I('pebble', 1511, 496, 58, 33, 0, 'coffee', { taper: 0.3, n: 2.6, h: 0.36 }), // dark pebble: fuller west end
      I('plant', 1415, 515, 25, 25), I('plant', 1440, 518, 15, 15),
      I('counter', 1532, 543, 232, 22, 180),
    ],
  },
  15: { // Furnished Guest Suite
    palette: { src: BIRD, tile: '#b0a49c', rug: '#867a72', bed: '#7f726b', daybed: '#dad0c7', black: '#272322', bath: '#b1a59f', wood: '#c9bfb4', white: '#b8b3ad' },
    items: [
      I('rug', 1844, 374, 108, 228),
      I('bed', 1825, 354, 82, 70, 270),
      I('daybed', 1912, 355, 85, 23, 90),
      I('loungechair', 1897, 286, 38, 38, 30, 'black'), I('sidetable', 1872, 274, 20, 20, 0, 'black'),
      I('wardrobe', 1893, 447, 81, 13, 90), I('divider', 1820, 496, 60, 6), // the bedroom / bathroom partition, west of the door
      I('wc', 1799, 573, 18, 27, 180), I('vanity', 1868, 577, 40, 21, 180), I('tilefloor', 1840, 545, 100, 90, 0, 'tile'), I('bathtub', 1907, 537, 35, 75),
    ],
  },
  16: { // Parents' Area
    palette: { src: BIRD, floor: '#e5c9a3', bench: '#465f3b', bolster: '#3e4b5e', pouf: '#e9e2dc', black: '#181613' },
    items: [
      I('banquette', 1696, 890, 88, 26, 0, 'bench', { low: true, seg: 1 }), I('bolster', 1657, 892, 7, 16), I('bolster', 1722, 892, 7, 16),
      I('pouf', 1662, 913, 13, 13, 0, 'pouf'), I('pouf', 1717, 913, 13, 13, 0, 'pouf'),
      I('stroller', 1657, 1007, 25, 33, 180), I('stroller', 1686, 1007, 25, 33, 180),
      I('mirror', 1741, 955, 55, 8, 90), I('rail', 1632, 978, 32, 10, -20), I('rail', 1722, 1019, 43, 8, 0),
    ],
  },
  17: { // Children's Indoor Play & Craft Room
    palette: { src: BIRD, floor: '#bca18a', mat: '#25262b', banquette: '#485970', white: '#fbfaf8', wood: '#a28b84', shelf: '#ddd4cb',
      pink: '#e288d6', green: '#99d459', blue: '#849ed6', paleblue: '#c4e2ef', palepink: '#f2d5ed', palegreen: '#e1e3af', plant: '#3e5a3a' },
    items: [
      I('playmat', 1795, 900, 76, 50), I('playmat', 1860, 951, 130, 52),
      ...[[1793, 887, 30, 'blue'], [1768, 910, 24, 'green'], [1803, 910, 28, 'pink'], [1845, 950, 32, 'green'], [1807, 963, 30, 'paleblue'], [1905, 967, 32, 'pink']]
        .map(([x, y, s, c]) => I('beanbag', x, y, s, s, 0, c)),
      I('bookshelf', 1844, 906, 62, 22, 270), I('toybins', 1943, 960, 33, 40),
      I('crafttable', 1922, 997, 75, 29),
      I('bookshelf', 1986, 1003, 127, 48, 90, 'wood'), I('coatrack', 1944, 1041, 38, 22),
      I('kidtable', 1866, 1184, 52, 85),
      ...[[1852, 1132, 0, 'palepink'], [1875, 1132, 0, 'paleblue'], [1830, 1158, 270, 'palegreen'], [1830, 1182, 270, 'paleblue'], [1830, 1207, 270, 'palepink'],
        [1902, 1155, 90, 'white'], [1902, 1182, 90, 'palegreen'], [1902, 1207, 90, 'paleblue'], [1852, 1237, 180, 'white'], [1875, 1237, 180, 'palegreen']]
        .map(([x, y, r, c]) => I('kidchair', x, y, 20, 20, r, c)),
      I('banquette', 1972, 1190, 196, 69, 90, 'banquette'), I('plant', 2003, 1102, 14, 22), I('plant', 2003, 1275, 14, 22),
      I('sink', 1791, 1206, 12, 20),
    ],
  },
  18: { // Children's Outdoor Play Area
    palette: { src: BIRD, deck: '#79473b', table: '#d9f0fe', pink: '#ead5f4', green: '#d8e9c3', yellow: '#c7c39f', white: '#f9fdfe',
      pier: '#edeef3' },
    items: [
      I('kidtable', 1818, 1346, 45, 45, 0, 'table'), I('kidtable', 1895, 1406, 42, 42, 0, 'table'),
      ...[[1808, 1320, 'pink'], [1846, 1338, 'green'], [1787, 1359, 'yellow'], [1826, 1381, 'white'], [1880, 1379, 'pink'], [1869, 1422, 'yellow'], [1913, 1433, 'white']]
        .map(([x, y, c]) => I('kidstool', x, y, 16, 16, 0, c)),
      I('pier', 1953, 1329, 32, 46, 0, 'pier'),
    ],
  },
};
for (const [n, d] of Object.entries(DETAIL)) Object.assign(AMENITY_FLOOR.spaces[n], d);
