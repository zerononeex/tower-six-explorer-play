// All site data. Facts: docs/blueprint-tower-six.md §1. Prices: §8 (see SOURCES.md).

// Tower explorer calibration, in source pixels of assets/18-tower-six-hero.jpg (2084×2040).
// Floors are drawn on the tower's FRONT-LEFT face, which reads as two planes split at x = joinX:
// the main shaft (joinX → cornerX, the sharp slab corner) and the left wing, which becomes the
// white terraced block on the lower tower. `slabs[k]` is one slab-EDGE line (the slab's bright
// front lip), measured individually at both ends of each plane:
//   [y at cornerX, y at joinX on the shaft, y at joinX on the wing, y at wingX on the wing]
// k = 39 − floor: floor n spans slab k = 39 − n (its ceiling) down to k = 40 − n (its floor).
// k 0 is the mechanical cap's base line (shaft) / the wing roof's fascia; k 35 is the podium roof
// under floor 5; k 36–37 are the rental levels' slabs; k 38–39 split the double-height podium
// levels 1–2 down to grade.
export const TOWER = {
  src: 'assets/18-tower-six-hero.jpg', w: 2084, h: 2040,
  view: [1000, 250, 900, 1700], // displayed crop (viewBox), still in the image's pixel space
  cornerX: 1650, joinX: 1478, wingX: 1348, podiumRightX: 1800,
  slabs: [
    [359, 426, 448.7, 492], // k 0
    [423, 488.9, 493, 539.7], // k 1
    [458.9, 521.8, 526.9, 571.4], // k 2
    [495.4, 555.5, 561, 602.6], // k 3
    [531.8, 589.1, 594.6, 633.7], // k 4
    [568.3, 622.7, 627.2, 665.2], // k 5
    [604.8, 656.4, 661, 695.7], // k 6
    [641.3, 689.4, 693.1, 727.3], // k 7
    [677.2, 723.1, 726, 758.1], // k 8
    [713.2, 756.3, 759.5, 789.3], // k 9
    [749.8, 789.3, 793.2, 819.9], // k 10
    [786.3, 822.9, 826.8, 850.6], // k 11
    [822.3, 856.1, 859.9, 881.2], // k 12
    [858.4, 888.1, 892, 912.2], // k 13
    [894.4, 921.2, 925.1, 943], // k 14
    [929.6, 955.8, 958.1, 973.8], // k 15
    [965.7, 988.3, 991.2, 1003.8], // k 16
    [1001.7, 1020.8, 1024.2, 1034.6], // k 17
    [1039.1, 1054.8, 1057.9, 1065.4], // k 18
    [1076.2, 1089.5, 1092, 1096.4], // k 19
    [1111.3, 1123.3, 1125.4, 1128.1], // k 20
    [1147.6, 1156, 1157.3, 1158], // k 21
    [1183.8, 1187.9, 1190.7, 1189.1], // k 22
    [1220.9, 1221.4, 1222.7, 1219.3], // k 23
    [1255.2, 1253.7, 1258.4, 1251.2], // k 24
    [1290.6, 1287.1, 1290.7, 1282.4], // k 25
    [1326.3, 1320.9, 1324, 1313.7], // k 26
    [1364.4, 1353.7, 1358, 1345.2], // k 27
    [1399.1, 1386.8, 1391, 1376.6], // k 28
    [1434.9, 1419.8, 1425.4, 1408.6], // k 29
    [1470.6, 1452.2, 1458.3, 1440], // k 30
    [1506.3, 1486.9, 1492.6, 1472.6], // k 31
    [1542, 1518.5, 1525.9, 1503.4], // k 32
    [1577.8, 1551.6, 1559.8, 1536.4], // k 33
    [1613.3, 1583.1, 1594.3, 1568.8], // k 34
    [1648.9, 1617.3, 1628.5, 1601.4], // k 35
    [1684.4, 1650, 1662.1, 1634.3], // k 36
    [1719.8, 1682.9, 1696.3, 1666.7], // k 37
    [1788, 1749, 1763, 1737], // k 38
    [1857, 1817.4, 1831.4, 1805.4], // k 39
  ],
  // left silhouette per floor range [from, to, x]: the wing edge, then the terrace steps (each
  // terrace is the roof of the two floors below it), then the podium
  leftEdge: [[1, 2, 1072], [3, 4, 1088], [5, 6, 1117], [7, 8, 1162], [9, 10, 1200], [11, 12, 1247], [13, 14, 1300], [15, 39, 1348]],
};

export const ZONES = [
  { from: 1, to: 2, name: 'Podium', line: 'Retail and office, plus the 4,500 SF hotel-inspired Lobby Lounge.', image: 'assets/07-lobby-lounge.jpg', imageAlt: 'Lobby Lounge rendering' },
  { from: 3, to: 4, name: 'Podium — Rental homes', line: 'Rental homes on levels 3 and 4 — not part of the 369 condominiums.' },
  { from: 5, to: 5, name: 'Level 5 — Amenity floor', line: '18 amenity spaces on one floor.', link: '#amenities' },
  { from: 5, to: 19, name: 'Garden / City homes', line: 'Views begin at floor 5.', plans: true },
  { from: 20, to: 33, name: 'Sky homes', line: 'Parking included with homes above floor 20.', plans: true },
  { from: 34, to: 39, name: 'Cascading terraces + Penthouse Collection', line: 'Only 4 penthouse homes.', plans: true },
];

const GRID_FEB26 = 'Price grid: mikestewart.ca, Feb 2026';
export const FAMILIES = [
  { id: 'studio', name: 'Studio', beds: '0', homes: 26, sf: '399–460', price: 'From $649,000', priceSrc: GRID_FEB26 },
  { id: '1bed', name: '1 Bed', beds: '1', homes: 11, sf: '560–588', price: 'From $758,000', priceSrc: GRID_FEB26 },
  { id: '1bed-a', name: '1 Bed (adaptable)', beds: '1', homes: 32, sf: '588–589' },
  { id: '1den', name: '1 Bed + Den', beds: '1', homes: 100, sf: '612–751' },
  { id: '2bed', name: '2 Bed', beds: '2', homes: 79, sf: '779–900', price: '$759,000–$1,161,000', priceSrc: GRID_FEB26, plan: '2b2b' },
  { id: '2bed-a', name: '2 Bed (adaptable)', beds: '2', homes: 24, sf: '886' },
  { id: '2den', name: '2 Bed + Den', beds: '2', homes: 16, sf: '868–1,627' },
  { id: '3bed', name: '3 Bed', beds: '3', homes: 73, sf: '906–1,083', price: 'From $1,335,000', priceSrc: GRID_FEB26 },
  { id: '3bed-a', name: '3 Bed (adaptable)', beds: '3', homes: 4, sf: '1,003' },
  { id: '3den', name: '3 Bed + Den', beds: '3', homes: 4, sf: '1,180–1,240' },
  { id: 'ph', name: 'Penthouse Collection', beds: 'ph', homes: 4, sf: 'PH1: 1,417 + 1,007 outdoor', price: 'PH1 $2,379,000', priceSrc: 'mikestewart.ca price grid, Oct 2025', plan: 'ph1' },
];

export const AMENITIES = [
  ['Fitness Facility', 'An indoor fitness facility on the amenity floor.', 71.0, 78.4, 'assets/06-amenity-gym.jpg'],
  ['Stretching/Yoga/Dance Studio', 'A dedicated studio for stretching, yoga and dance.', 38.5, 76.8],
  ['Outdoor Fitness Zones', 'Outdoor fitness zones for training in the open air.', 44.4, 87.6],
  ['Quiet Chaise Lounge Area', 'A quiet chaise lounge area for unwinding outdoors.', 25.2, 74.3],
  ['Gardening Area', 'A gardening area for residents.', 18.8, 74.3],
  ['Putting Green & Bocce', 'An outdoor putting green and bocce court.', 12.3, 74.3],
  ['Firepit & Outdoor Social', 'A firepit and outdoor social area.', 10.7, 18.4],
  ['BBQ & Outdoor Dining', 'BBQ stations with outdoor dining tables.', 26.3, 23.8],
  ['Games Lounge', 'A games lounge.', 39.2, 30.4],
  ['Bar & Social Lounge', 'A bar and social lounge for gathering.', 51.4, 58.4],
  ['Co-Working Space', 'A co-working space for working from home.', 48.8, 23.8],
  ['Private Study Pods', 'Private study pods for focused work.', 54.2, 32.6],
  ['Meeting Room', 'A meeting room.', 62.7, 18.4],
  ['Large Private Lounge with Kitchen', 'A large private lounge with its own kitchen.', 78.3, 28.1],
  ['Furnished Guest Suite', 'A furnished guest suite for visiting friends and family.', 88.1, 27.9],
  ["Parents' Area", "A parents' area with bench seating and stroller parking.", 80.8, 60.2],
  ["Children's Indoor Play & Craft Room", "A children's indoor play and craft room.", 88.5, 67.2],
  ["Children's Outdoor Play Area", "A children's outdoor play area.", 92.5, 88.6],
].map(([name, line, x, y, image], i) => ({ n: i + 1, name, line, x, y, image }));

// 3D unit plans. Format mirrors furnishup/blueprint3d's serialized plan
// (corners / walls / rooms / items); units are feet, x → east, y → south (into the suite).
// Room image lookup: assets/rooms/<planId>-<roomId>.jpg first, then room.image, else none.
// Adding a plan = adding one object here.
const SCHEME_NOTE = 'marketing image — scheme shown, not this plan’s room';
export const PLANS = {
  '2b2b': {
    id: '2b2b', name: '2 Bedroom / 2 Bath', sf: 890, ceiling: 9, ceilingLabel: '9\'0"',
    source: 'Oct 2025 published grid (2Bd/2Ba, 890 SF)',
    finishes: { cabinet: '#36312e', counter: '#e8e6e3', island: '#e8e6e3', stone: '#d9d4cf', vanity: '#36312e' },
    corners: {"c0":{x:0,y:0},"c1":{x:0,y:12},"c2":{x:11,y:0},"c3":{x:0,y:18},"c4":{x:8,y:12},"c5":{x:0,y:25},"c6":{x:2,y:18},"c7":{x:3,y:25},"c8":{x:4.8,y:18},"c9":{x:8,y:18},"c10":{x:6,y:25},"c11":{x:11,y:25},"c12":{x:11,y:12},"c13":{x:8.2,y:18},"c14":{x:10.8,y:18},"c15":{x:11,y:18},"c16":{x:11,y:9},"c17":{x:26,y:0},"c18":{x:11,y:11.8},"c19":{x:11,y:15},"c20":{x:26,y:25},"c21":{x:26,y:10},"c22":{x:35.6,y:0},"c23":{x:26,y:12.8},"c24":{x:26,y:13},"c25":{x:26,y:15},"c26":{x:27,y:13},"c27":{x:26,y:21},"c28":{x:27,y:21},"c29":{x:35.6,y:25},"c30":{x:29.8,y:13},"c31":{x:35.6,y:13},"c32":{x:29.8,y:21},"c33":{x:35.6,y:21}},
    walls: [{corner1:"c0",corner2:"c1"},{corner1:"c0",corner2:"c2",type:"glass"},{corner1:"c1",corner2:"c3"},{corner1:"c1",corner2:"c4"},{corner1:"c3",corner2:"c5"},{corner1:"c3",corner2:"c6"},{corner1:"c5",corner2:"c7"},{corner1:"c8",corner2:"c9"},{corner1:"c10",corner2:"c11"},{corner1:"c4",corner2:"c9"},{corner1:"c4",corner2:"c12"},{corner1:"c9",corner2:"c13"},{corner1:"c14",corner2:"c15"},{corner1:"c2",corner2:"c16"},{corner1:"c2",corner2:"c17",type:"glass"},{corner1:"c18",corner2:"c12"},{corner1:"c12",corner2:"c19"},{corner1:"c19",corner2:"c15"},{corner1:"c11",corner2:"c20"},{corner1:"c17",corner2:"c21"},{corner1:"c17",corner2:"c22",type:"glass"},{corner1:"c23",corner2:"c24"},{corner1:"c24",corner2:"c25"},{corner1:"c24",corner2:"c26"},{corner1:"c25",corner2:"c27"},{corner1:"c27",corner2:"c20"},{corner1:"c27",corner2:"c28"},{corner1:"c20",corner2:"c29"},{corner1:"c30",corner2:"c31"},{corner1:"c32",corner2:"c33"},{corner1:"c22",corner2:"c31"},{corner1:"c31",corner2:"c33"},{corner1:"c33",corner2:"c29"}],
    rooms: [
      { id: 'bedroom2', name: 'Bedroom 2', points: [[0, 0], [11, 0], [11, 12], [0, 12]] },
      { id: 'living', name: 'Living / Dining', points: [[11, 0], [26, 0], [26, 15], [11, 15]] },
      { id: 'primary', name: 'Primary Bedroom', points: [[26, 0], [35.6, 0], [35.6, 13], [26, 13]] },
      { id: 'bathroom', name: 'Bathroom', points: [[0, 12], [8, 12], [8, 18], [0, 18]] },
      { id: 'laundry', name: 'Laundry', points: [[8, 12], [11, 12], [11, 18], [8, 18]], image: 'assets/11-bathroom.jpg', imageNote: SCHEME_NOTE },
      { id: 'entry', name: 'Entry', points: [[0, 18], [11, 18], [11, 25], [0, 25]] },
      { id: 'kitchen', name: 'Kitchen', points: [[11, 15], [26, 15], [26, 25], [11, 25]], image: 'assets/08-kitchen-new.jpg', imageNote: SCHEME_NOTE },
      { id: 'ensuite', name: 'Ensuite', points: [[26, 13], [35.6, 13], [35.6, 21], [26, 21]] },
      { id: 'closet', name: 'Walk-in Closet', points: [[26, 21], [35.6, 21], [35.6, 25], [26, 25]] },
    ],
    // xpos/ypos = footprint centre (ft); width along x, depth along y; rotation = side the
    // item's back faces (0 north/window, 90 east, 180 south, 270 west)
    items: [
      { item_type: 'bed', xpos: 5.5, ypos: 8.6, width: 5, depth: 6.6, rotation: 180 },
      { item_type: 'nightstand', xpos: 2.2, ypos: 11.1 }, { item_type: 'nightstand', xpos: 8.8, ypos: 11.1 },
      { item_type: 'sofa', xpos: 24.3, ypos: 6, width: 3, depth: 7, rotation: 90 },
      { item_type: 'coffee', xpos: 20.4, ypos: 6, width: 2, depth: 3.5 },
      { item_type: 'console', xpos: 11.9, ypos: 5, width: 1.5, depth: 6, rotation: 270 },
      { item_type: 'table', xpos: 18.5, ypos: 12, width: 5, depth: 3 },
      { item_type: 'chair', xpos: 17.4, ypos: 9.8 }, { item_type: 'chair', xpos: 19.6, ypos: 9.8 },
      { item_type: 'chair', xpos: 17.4, ypos: 14.2, rotation: 180 }, { item_type: 'chair', xpos: 19.6, ypos: 14.2, rotation: 180 },
      { item_type: 'counter', xpos: 17.5, ypos: 24, width: 11, depth: 2, rotation: 180 },
      { item_type: 'tall', xpos: 24.5, ypos: 23.9, width: 3, depth: 2.2, rotation: 180 },
      { item_type: 'island', xpos: 17.5, ypos: 19.5, width: 8.5, depth: 3.5 },
      { item_type: 'stool', xpos: 15.5, ypos: 17.2 }, { item_type: 'stool', xpos: 17.5, ypos: 17.2 }, { item_type: 'stool', xpos: 19.5, ypos: 17.2 },
      { item_type: 'tub', xpos: 2.6, ypos: 13.35, width: 5, depth: 2.5 },
      { item_type: 'wc', xpos: 6.9, ypos: 13.3 },
      { item_type: 'vanity', xpos: 7.1, ypos: 16.2, width: 1.8, depth: 3, rotation: 90 },
      { item_type: 'washer', xpos: 9.9, ypos: 13.3, rotation: 90 }, { item_type: 'washer', xpos: 9.9, ypos: 15.6, rotation: 90 },
      { item_type: 'console', xpos: 9, ypos: 24.3, width: 3.5, depth: 1.2, rotation: 180 },
      { item_type: 'bed', xpos: 32.1, ypos: 6.5, width: 6.6, depth: 5, rotation: 90 },
      { item_type: 'nightstand', xpos: 34.7, ypos: 3.2 }, { item_type: 'nightstand', xpos: 34.7, ypos: 9.8 },
      { item_type: 'vanity', xpos: 30.5, ypos: 20, width: 5, depth: 1.8, rotation: 180 },
      { item_type: 'shower', xpos: 33.5, ypos: 15.1, width: 4, depth: 4 },
      { item_type: 'wc', xpos: 34.6, ypos: 19.7, rotation: 90 },
      { item_type: 'shelf', xpos: 31, ypos: 24.1, width: 8, depth: 1.8, rotation: 180 },
    ],
  },
  ph1: {
    id: 'ph1', name: 'Penthouse PH1', sf: 1417, outdoorSf: 1007, ceiling: 11 + 7 / 12, ceilingLabel: '11\'7"',
    source: 'Published penthouse features (gas fireplace, wine bar, open living/kitchen)',
    finishes: { cabinet: '#ebe6df', counter: '#d8d5d3', island: '#bdb8b6', stone: '#b8aea6', vanity: '#c8b49a', islandBody: '#bdb8b6' },
    corners: {"c0":{x:0,y:0},"c1":{x:0,y:17},"c2":{x:6,y:0},"c3":{x:0,y:27.25},"c4":{x:8.5,y:17},"c5":{x:12,y:27.25},"c6":{x:11.3,y:17},"c7":{x:12,y:17},"c8":{x:12,y:0},"c9":{x:20,y:0},"c10":{x:20,y:17},"c11":{x:20,y:27.25},"c12":{x:36,y:0},"c13":{x:20,y:18},"c14":{x:20,y:20.8},"c15":{x:26,y:27.25},"c16":{x:29.5,y:27.25},"c17":{x:36,y:27.25},"c18":{x:36,y:12},"c19":{x:42,y:0},"c20":{x:36,y:14.8},"c21":{x:36,y:15},"c22":{x:38,y:15},"c23":{x:52,y:27.25},"c24":{x:40.8,y:15},"c25":{x:52,y:15},"c26":{x:47,y:0},"c27":{x:52,y:0},"c28":{x:0,y:-16},"c29":{x:59,y:-16},"c30":{x:59,y:9},"c31":{x:52,y:9}},
    walls: [{corner1:"c0",corner2:"c1"},{corner1:"c0",corner2:"c2",type:"glass"},{corner1:"c1",corner2:"c3"},{corner1:"c1",corner2:"c4"},{corner1:"c3",corner2:"c5"},{corner1:"c6",corner2:"c7"},{corner1:"c8",corner2:"c9",type:"glass"},{corner1:"c7",corner2:"c5"},{corner1:"c7",corner2:"c10"},{corner1:"c5",corner2:"c11"},{corner1:"c9",corner2:"c12",type:"glass"},{corner1:"c10",corner2:"c13"},{corner1:"c14",corner2:"c11"},{corner1:"c11",corner2:"c15"},{corner1:"c16",corner2:"c17"},{corner1:"c12",corner2:"c18"},{corner1:"c12",corner2:"c19",type:"glass"},{corner1:"c20",corner2:"c21"},{corner1:"c21",corner2:"c17"},{corner1:"c21",corner2:"c22"},{corner1:"c17",corner2:"c23"},{corner1:"c24",corner2:"c25"},{corner1:"c26",corner2:"c27",type:"glass"},{corner1:"c27",corner2:"c25",type:"glass"},{corner1:"c25",corner2:"c23"},{corner1:"c28",corner2:"c29",type:"glass",height:3.5},{corner1:"c29",corner2:"c30",type:"glass",height:3.5},{corner1:"c30",corner2:"c31",type:"glass",height:3.5},{corner1:"c0",corner2:"c28",type:"glass",height:3.5}],
    rooms: [
      { id: 'living', name: 'Living', points: [[0, 0], [20, 0], [20, 17], [0, 17]], image: 'assets/12-ph-living.jpg' },
      { id: 'kitchen', name: 'Kitchen & Wine Bar', points: [[20, 0], [36, 0], [36, 15], [20, 15]], image: 'assets/13-ph-kitchen.jpg' },
      { id: 'primary', name: 'Primary Bedroom', points: [[36, 0], [52, 0], [52, 15], [36, 15]] },
      { id: 'ensuite', name: 'Ensuite', points: [[36, 15], [52, 15], [52, 27.25], [36, 27.25]], image: 'assets/14-ph-ensuite.jpg' },
      { id: 'den', name: 'Den', points: [[0, 17], [12, 17], [12, 27.25], [0, 27.25]] },
      { id: 'bathroom', name: 'Bathroom', points: [[12, 17], [20, 17], [20, 27.25], [12, 27.25]] },
      { id: 'entry', name: 'Entry & Laundry', points: [[20, 15], [36, 15], [36, 27.25], [20, 27.25]] },
      { id: 'terrace', name: 'Terrace', outdoor: true, points: [[0, -16], [59, -16], [59, 9], [52, 9], [52, 0], [0, 0]], image: 'assets/15-ph-balcony.jpg' },
    ],
    items: [
      { item_type: 'fireplace', xpos: 0.8, ypos: 8.5, width: 1.4, depth: 6, rotation: 270 },
      { item_type: 'sofa', xpos: 11, ypos: 8.5, width: 3, depth: 8, rotation: 90 },
      { item_type: 'coffee', xpos: 6.5, ypos: 8.5, width: 2.5, depth: 4 },
      { item_type: 'table', xpos: 16, ypos: 13, width: 6.5, depth: 3.5 },
      { item_type: 'chair', xpos: 14, ypos: 10.6 }, { item_type: 'chair', xpos: 16, ypos: 10.6 }, { item_type: 'chair', xpos: 18, ypos: 10.6 },
      { item_type: 'chair', xpos: 14, ypos: 15.4, rotation: 180 }, { item_type: 'chair', xpos: 16, ypos: 15.4, rotation: 180 }, { item_type: 'chair', xpos: 18, ypos: 15.4, rotation: 180 },
      { item_type: 'counter', xpos: 35, ypos: 9.5, width: 2, depth: 11, rotation: 90 },
      { item_type: 'tall', xpos: 34.9, ypos: 2, width: 2.2, depth: 4, rotation: 90 },
      { item_type: 'island', xpos: 28, ypos: 7.5, width: 9.5, depth: 3.5 },
      { item_type: 'stool', xpos: 25.5, ypos: 9.9 }, { item_type: 'stool', xpos: 27.5, ypos: 9.9 }, { item_type: 'stool', xpos: 29.5, ypos: 9.9 },
      { item_type: 'winebar', xpos: 26, ypos: 14, width: 5, depth: 1.8, rotation: 180 },
      { item_type: 'bed', xpos: 48.6, ypos: 7.5, width: 6.6, depth: 5, rotation: 90 },
      { item_type: 'nightstand', xpos: 51.2, ypos: 4.2 }, { item_type: 'nightstand', xpos: 51.2, ypos: 10.8 },
      { item_type: 'tub', xpos: 39.9, ypos: 25.8, width: 5, depth: 2.5 },
      { item_type: 'vanity', xpos: 45.5, ypos: 26.2, width: 6, depth: 1.8, rotation: 180 },
      { item_type: 'shower', xpos: 50.1, ypos: 25.1, width: 3.5, depth: 4 },
      { item_type: 'wc', xpos: 50.7, ypos: 18.6, rotation: 90 },
      { item_type: 'sofa', xpos: 6, ypos: 25.7, width: 6, depth: 2.8, rotation: 180 },
      { item_type: 'desk', xpos: 1.3, ypos: 21, width: 2.2, depth: 5, rotation: 270 },
      { item_type: 'wc', xpos: 13.1, ypos: 18.6, rotation: 270 },
      { item_type: 'vanity', xpos: 13, ypos: 22, width: 1.8, depth: 3.5, rotation: 270 },
      { item_type: 'shower', xpos: 17.9, ypos: 25.1, width: 4, depth: 4 },
      { item_type: 'washer', xpos: 32.4, ypos: 26.1, rotation: 180 }, { item_type: 'washer', xpos: 34.7, ypos: 26.1, rotation: 180 },
      { item_type: 'console', xpos: 22.5, ypos: 26.5, width: 4, depth: 1.2, rotation: 180 },
      { item_type: 'lounger', xpos: 40, ypos: -9 }, { item_type: 'lounger', xpos: 43, ypos: -9 },
      { item_type: 'table', xpos: 15, ypos: -8, width: 6, depth: 3 },
      { item_type: 'chair', xpos: 13.5, ypos: -10.2 }, { item_type: 'chair', xpos: 16.5, ypos: -10.2 },
      { item_type: 'chair', xpos: 13.5, ypos: -5.8, rotation: 180 }, { item_type: 'chair', xpos: 16.5, ypos: -5.8, rotation: 180 },
      { item_type: 'sofa', xpos: 28, ypos: -13.5, width: 8, depth: 3 },
      { item_type: 'planter', xpos: 2, ypos: -14 }, { item_type: 'planter', xpos: 57, ypos: -14 }, { item_type: 'planter', xpos: 57, ypos: 6.5 },
    ],
  },
};
