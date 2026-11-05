// All site data. Facts: docs/blueprint-tower-six.md §1. Prices: §8 (see SOURCES.md).

// Floor bands, calibrated in source pixels of assets/17-tower-west-elevation.jpg (750×540).
// The view is cropped to x 300–680; the canvas extends 29px below the photo because the
// lower podium floors are out of frame. Floor 39 = roof crown (y 4), floor 5 sits on the
// podium roof (y 512); measured slab pitch ≈ 14.5px.
export const TOWER = {
  imgW: 750, imgH: 540, cropX: 300, cropW: 380, canvasH: 569,
  shaftTop: 4, podiumTop: 512,
  right: 645, podiumLeft: 322, podiumRight: 660,
  // cascading terraces: [band top y ≥, left edge x]
  steps: [[0, 437], [358, 418], [383, 397], [405, 375], [428, 358], [448, 340], [475, 325]],
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
