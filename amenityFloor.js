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
    11: { kind: 'indoor', finish: 'oak', polys: [[[900, 200], [1050, 200], [1050, 368], [1175, 368], [1175, 475], [900, 475]]] },
    12: { kind: 'indoor', finish: 'oak', polys: [[[1100, 475], [1175, 475], [1175, 425], [1240, 425], [1240, 560], [1100, 560]]] },
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

  /* Furniture traced from the plan, per space: [type, x, y, w, d, back?, colour?]
     x, y = footprint centre; w × d = footprint along image x × y (px); back = side the backrest
     faces (n|e|s|w, n = up in the image). Types are built in amenity3d.js. Space 1 is styled
     from its marketing photo (assets/06-amenity-gym.jpg): oak floor, black equipment, red-wheel
     spin bikes, a dark rubber zone, oak cabinet wall. */
  items: {
    1: [
      ['rubber', 1180, 1338, 260, 100], ['rubber', 1610, 1160, 330, 230],
      ...[1072, 1122, 1177, 1232, 1285].map(x => ['treadmill', x, 1333, 35, 85, 's']),
      ...[1077, 1142, 1207, 1275].map(x => ['elliptical', x, 1190, 35, 90, 's']),
      ['spin', 938, 1105, 22, 50], ['spin', 970, 1105, 22, 50], ['spin', 1010, 1105, 22, 50], ['spin', 945, 1255, 22, 50], ['spin', 990, 1255, 22, 50],
      ['machine', 1375, 1173, 60, 35], ['machine', 1375, 1233, 60, 35], ['machine', 1290, 1052, 60, 30],
      ['flatbench', 1370, 1305, 60, 15], ['flatbench', 1370, 1352, 60, 15],
      ['dbrack', 1582, 1225, 35, 100], ['rack', 1570, 1330, 70, 75],
      ['bench', 1677, 1075, 45, 20], ['bench', 1727, 1075, 45, 20], ['bench', 1677, 1125, 45, 20], ['bench', 1727, 1125, 45, 20],
      ['platform', 1702, 1200, 75, 25], ['platform', 1702, 1236, 75, 25],
      ['cabinetwall', 1500, 1044, 220, 14], ['plant', 1760, 1270, 18, 18],
    ],
    2: [
      ...[738, 778, 821].map(x => ['mat', x, 1138, 25, 75]),
      ...[720, 763, 803, 846].map(x => ['mat', x, 1234, 25, 75]),
      ['mirror', 660, 1190, 8, 180], ['glasswall', 880, 1190, 4, 210],
    ],
    3: [
      ...[731, 775, 818, 943, 988].map(x => ['mat', x, 1340, 27, 70, null, '#bfe0f0']),
      ['ball', 1655, 1333, 50, 50], ['flatbench', 1710, 1370, 24, 70],
    ],
    4: [
      ...[1032, 1092, 1167, 1227, 1302, 1364].map(y => ['lounger', 556, y, 88, 35, 'e']),
      ['sidetable', 588, 1128, 24, 24], ['sidetable', 588, 1265, 24, 24],
      ['bench', 435, 1055, 14, 120, null, '#4a4c50'], ['bench', 435, 1195, 14, 120, null, '#4a4c50'],
      ['bistro', 390, 1370, 34, 34],
    ],
    5: [
      ...[1010, 1060, 1110, 1160, 1210, 1260, 1310].flatMap((y, i) => [
        ['planterbed', 370, y, 34, 44, null, i % 2 ? '#c2402e' : '#5f8a3d'], ['planterbed', 410, y, 34, 44, null, i % 2 ? '#5f8a3d' : '#d9622b']]),
    ],
    6: [
      ['flag', 255, 968, 10, 10], ['flag', 222, 1225, 10, 10], ['flag', 253, 1362, 10, 10],
      ['bocce', 245, 1005, 8, 8, null, '#b0453a'], ['bocce', 268, 1010, 8, 8, null, '#3b6fb0'], ['bocce', 280, 1000, 8, 8, null, '#b0453a'],
      ['bocce', 232, 1335, 8, 8, null, '#3b6fb0'], ['bocce', 262, 1340, 8, 8, null, '#b0453a'],
    ],
    7: [
      ['pergola', 238, 375, 195, 340],
      ['sofa', 240, 232, 75, 30, 'n', '#efe9df'],
      ...[[165, 280], [165, 330], [170, 465], [170, 515]].map(([x, y]) => ['armchair', x, y, 38, 36, 'w', '#efe9df']),
      ...[[305, 280], [305, 330], [305, 465], [305, 515]].map(([x, y]) => ['armchair', x, y, 38, 36, 'e', '#efe9df']),
      ['firepit', 235, 377, 60, 28], ['coffee', 240, 490, 40, 34],
    ],
    8: [
      ['bbq', 470, 222, 80, 30],
      ['longtable', 548, 330, 130, 40], ...[505, 530, 555, 580].flatMap(x => [['chair', x, 302, 20, 18, 'n', '#3a3b3d'], ['chair', x, 358, 20, 18, 's', '#3a3b3d']]),
      ['longtable', 553, 478, 140, 40], ...[505, 530, 555, 580, 600].flatMap(x => [['chair', x, 450, 20, 18, 'n', '#3a3b3d'], ['chair', x, 506, 20, 18, 's', '#3a3b3d']]),
    ],
    9: [
      ['rug', 818, 438, 115, 285, null, '#cfc8bd'],
      ['pooltable', 813, 382, 60, 105], ['foosball', 815, 537, 70, 40],
      ['banquette', 798, 232, 185, 25, 'n', '#9c5b34'],
      ...[[710, 285], [710, 350], [718, 500], [730, 575]].map(([x, y]) => ['tub', x, y, 34, 34, null, '#d9cfc4']),
    ],
    10: [
      ['bar', 911, 760, 26, 260], ...[655, 690, 725, 760, 795, 830].map(y => ['stool', 886, y, 14, 14]),
      ['curvesofa', 815, 730, 70, 120, null, '#b5642c'], ['pouf', 772, 728, 40, 40, null, '#e6d6bf'],
      ['rug', 755, 1000, 90, 75, null, '#cfc8bd'], ['coffee', 770, 1012, 44, 30, null, '#e6d3a8'],
      ...[[730, 980], [760, 965], [800, 980], [725, 1015]].map(([x, y]) => ['tub', x, y, 24, 24, null, '#efe9df']),
      ...[925, 985, 1045].flatMap(x => [['table', x, 1020, 32, 32], ['chair', x, 985, 22, 20, 'n', '#4a4542']]),
      ['banquette', 965, 1052, 210, 28, 's', '#7a4128'], ['console', 775, 1064, 60, 8],
    ],
    11: [
      ...[285, 350, 412].flatMap(y => [['desk', 966, y, 40, 30], ['chair', 995, y, 20, 20, 'e', '#3a3b3d'], ['partition', 925, y + 30, 40, 6]]),
      ['tub', 1025, 235, 30, 30, null, '#d9cfc4'], ['tub', 1030, 270, 30, 30, null, '#d9cfc4'], ['plant', 1035, 382, 22, 22],
    ],
    12: [['pod', 1207, 460, 55, 58], ['pod', 1207, 523, 55, 58], ['curvewall', 1020, 482, 160, 10]],
    13: [
      ['table', 1218, 291, 125, 42, null, '#c9a57e'],
      ...[1175, 1205, 1235, 1265].flatMap(x => [['chair', x, 254, 22, 20, 'n'], ['chair', x, 328, 22, 20, 's']]),
      ['chair', 1145, 291, 20, 22, 'w'], ['chair', 1292, 291, 20, 22, 'e'], ['console', 1078, 290, 14, 80],
    ],
    14: [
      ['table', 1520, 325, 110, 40, null, '#efece8'], ...[1485, 1510, 1535, 1560].flatMap(x => [['chair', x, 298, 20, 18, 'n', '#6b4a36'], ['chair', x, 352, 20, 18, 's', '#6b4a36']]),
      ['chair', 1455, 325, 18, 20, 'w', '#6b4a36'], ['chair', 1590, 325, 18, 20, 'e', '#6b4a36'],
      ['round', 1702, 325, 60, 60, null, '#efece8'], ...[0, 60, 120, 180, 240, 300].map(a => ['chair', 1702 + 42 * Math.cos(a * Math.PI / 180), 325 + 42 * Math.sin(a * Math.PI / 180), 18, 18, null, '#6b4a36']),
      ['rug', 1515, 485, 150, 90, null, '#cbc3b6'], ['sofa', 1512, 425, 145, 40, 'n', '#d8d1c6'], ['coffee', 1510, 492, 55, 35, null, '#4a3a33'],
      ['armchair', 1450, 487, 34, 34, 'w', '#ece7df'], ['armchair', 1580, 487, 34, 34, 'e', '#ece7df'],
      ['counter', 1510, 540, 225, 20, 's'], ['counter', 1405, 320, 18, 140, 'w'],
    ],
    15: [
      ['bed', 1825, 355, 72, 80, 'e'], ['nightstand', 1858, 300, 16, 16], ['nightstand', 1858, 410, 16, 16],
      ['sofa', 1913, 345, 26, 72, 'e', '#ece7df'], ['armchair', 1890, 278, 30, 30, 'n', '#2f3133'],
      ['vanity', 1850, 505, 70, 18, 'n'], ['wc', 1797, 573, 16, 22], ['tubbath', 1870, 573, 50, 26],
    ],
    16: [
      ['banquette', 1695, 889, 80, 22, 'n', '#4f7a3c'], ['pouf', 1662, 912, 16, 16, null, '#e7e2d8'], ['pouf', 1718, 912, 16, 16, null, '#e7e2d8'],
      ['stroller', 1662, 1005, 22, 34], ['stroller', 1688, 1005, 22, 34], ['console', 1715, 1018, 50, 10],
    ],
    17: [
      ...[[1765, 885, '#7fb2e6'], [1790, 885, '#c77fd1'], [1800, 910, '#ec5fa8'], [1775, 905, '#8fd14f'], [1835, 945, '#8fd14f'], [1810, 962, '#7fb2e6'], [1900, 965, '#ec5fa8']]
        .map(([x, y, c]) => ['beanbag', x, y, 26, 26, null, c]),
      ['craft', 1920, 995, 80, 22], ['shelf', 1982, 1000, 40, 120],
      ['kidtable', 1865, 1180, 50, 80, null, '#fbfaf8'],
      ...[1150, 1175, 1200, 1225].flatMap((y, i) => [['pouf', 1832, y, 14, 14, null, ['#f4a6c8', '#a6d8f4', '#c8e6a0', '#f7e09a'][i]], ['pouf', 1898, y, 14, 14, null, ['#a6d8f4', '#c8e6a0', '#f4a6c8', '#a6d8f4'][i]]]),
      ['banquette', 1972, 1190, 60, 190, 'e', '#3b4a63'],
    ],
    18: [
      ['kidtable', 1820, 1350, 44, 44, null, '#bfe3f2'], ...[[1790, 1335, '#f4a6c8'], [1850, 1335, '#c8e6a0'], [1820, 1380, '#fbfaf8']].map(([x, y, c]) => ['pouf', x, y, 16, 16, null, c]),
      ['kidtable', 1892, 1408, 44, 44, null, '#bfe3f2'], ...[[1862, 1395, '#c8e6a0'], [1922, 1390, '#fbfaf8'], [1905, 1440, '#f4a6c8']].map(([x, y, c]) => ['pouf', x, y, 16, 16, null, c]),
    ],
  },
};
