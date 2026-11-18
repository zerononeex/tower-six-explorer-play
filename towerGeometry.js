// Builds each floor's highlight polygon (image-pixel coordinates) from the TOWER calibration.
const line = (x0, y0, x1, y1) => x => y0 + (y1 - y0) * (x - x0) / (x1 - x0);

export function floorPolygon(T, n) {
  const shaft = (k, x) => { const [yc, yjs] = T.slabs[k]; return line(T.joinX, yjs, T.cornerX, yc)(x); };
  const wing = (k, x) => { const [, , yjw, yw] = T.slabs[k]; return line(T.wingX, yw, T.joinX, yjw)(x); };
  const xL = T.leftEdge.find(([a, b]) => n >= a && n <= b)[2];
  const xR = n <= 4 ? T.podiumRightX : T.cornerX;
  const top = 39 - n, bot = 40 - n;
  const pts = [
    [xR, shaft(top, xR)], [T.joinX, shaft(top, T.joinX)], [T.joinX, wing(top, T.joinX)], [xL, wing(top, xL)],
    [xL, wing(bot, xL)], [T.joinX, wing(bot, T.joinX)], [T.joinX, shaft(bot, T.joinX)], [xR, shaft(bot, xR)],
  ];
  return pts.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
}
