// Hand-made pixel-art sprites for the /1999 page.
// Each sprite is a grid of characters; every character maps to a colour in PALETTE
// ("." is transparent). Horizontal runs of the same colour are merged into one <rect>
// so the SVGs stay tiny, and shape-rendering="crispEdges" keeps the pixels sharp.

const PALETTE: Record<string, string> = {
  k: "#000000",
  w: "#ffffff",
  l: "#c0c0c0",
  g: "#a0a0a0",
  G: "#606060",
  y: "#ffe45c",
  Y: "#d4a017",
  b: "#1d5ce0",
  B: "#0b2f8a",
  c: "#2a8f8f",
  n: "#2eb82e",
  N: "#1a7a1a",
  r: "#e02020",
  o: "#ff7f11",
  e: "#e9e1c7",
  E: "#b8ad8a",
  p: "#ff4fd8",
};

export const SPRITES = {
  folder: [
    "................",
    ".kkkkkk.........",
    "kyyyyyyk........",
    "kyyyyyyykkkkkkk.",
    "kwwwwwwwwwwwwwwk",
    "kyyyyyyyyyyyyyyk",
    "kyyyyyyyyyyyyyYk",
    "kyyyyyyyyyyyyyYk",
    "kyyyyyyyyyyyyyYk",
    "kyyyyyyyyyyyyyYk",
    "kyyyyyyyyyyyyyYk",
    "kyyyyyyyyyyyyyYk",
    "kyyyyyyyyyyyyyYk",
    "kYYYYYYYYYYYYYYk",
    "kkkkkkkkkkkkkkkk",
    "................",
  ],
  floppy: [
    "kkkkkkkkkkkkkkk.",
    "kbbbllllllgbbbbk",
    "kbbbllllkkgbbbbk",
    "kbbbllllkkgbbbbk",
    "kbbbllllllgbbbbk",
    "kbbbbbbbbbbbbbbk",
    "kbbbbbbbbbbbbbbk",
    "kbbwwwwwwwwwwbbk",
    "kbbwrrrrrrrrwbbk",
    "kbbwwwwwwwwwwbbk",
    "kbbwgggggggwwbbk",
    "kbbwwwwwwwwwwbbk",
    "kbbwgggggwwwwbbk",
    "kbbwwwwwwwwwwbbk",
    "kBBBBBBBBBBBBBBk",
    "kkkkkkkkkkkkkkkk",
  ],
  computer: [
    "..kkkkkkkkkkkk..",
    ".keeeeeeeeeeeek.",
    ".kekkkkkkkkkkek.",
    ".kekcccccccckek.",
    ".kekcwcccccckek.",
    ".kekcccccccckek.",
    ".kekcccccccckek.",
    ".kekcccccccckek.",
    ".kekkkkkkkkkkek.",
    ".keeeeeeeeeenek.",
    ".kkkkkkkkkkkkkk.",
    "....keeeeeek....",
    "..kkkkkkkkkkkk..",
    ".keEeEeEeEeEeEk.",
    ".keeeeeeeeeeeek.",
    "..kkkkkkkkkkkk..",
  ],
  envelope: [
    "................",
    "................",
    "kkkkkkkkkkkkkkkk",
    "kkwwwwwwwwwwwwkk",
    "kwkwwwwwwwwwwkwk",
    "kwwkwwwwwwwwkwwk",
    "kwwwkwwwwwwkwwwk",
    "kwwwwkwwwwkwwwwk",
    "kwwwwwkkkkwwwwwk",
    "kwwwwwwwwwwwwwwk",
    "kwwwwwwwwwwwwwwk",
    "kllllllllllllllk",
    "kkkkkkkkkkkkkkkk",
    "................",
  ],
  globe: [
    ".....kkkkkk.....",
    "...kkbbbbbbkk...",
    "..kbbnnbbbbbbk..",
    ".kbbnnnnbbnnbbk.",
    ".kbnnnnnbbnnnbk.",
    "kbbnnnnbbbbnnbbk",
    "kbbbnnbbbbbbbbbk",
    "kbbbbnbbbbnnnbbk",
    "kbbbbbbbbnnnnnbk",
    "kbbbbbbbbnnnnbbk",
    "kbbnnbbbbbnnbbbk",
    ".kbnnnbbbbbbbbk.",
    ".kbbnnbbbbbbbbk.",
    "..kbbbbbbbbbbk..",
    "...kkbbbbbbkk...",
    ".....kkkkkk.....",
  ],
  cone: [
    ".......kk.......",
    "......kook......",
    "......kwwk......",
    ".....kwwwwk.....",
    ".....koooook....",
    "....kooooooook..",
    "....kwwwwwwwwk..",
    "...kwwwwwwwwwwk.",
    "...koooooooooook",
    "..kooooooooooook",
    ".kkkkkkkkkkkkkkk",
    "kGGGGGGGGGGGGGGk",
    "kkkkkkkkkkkkkkkk",
  ],
  notepad: [
    ".kkkkkkkkkkkk...",
    ".kbbbbbbbbbbk...",
    ".kwwwwwwwwwwk...",
    ".kwGGGGGGwwwk...",
    ".kwwwwwwwwwwk...",
    ".kwGGGGGGGGwk...",
    ".kwwwwwwwwwwk...",
    ".kwGGGGGwwwwk...",
    ".kwwwwwwwwwwk...",
    ".kwGGGGGGGwwk...",
    ".kwwwwwwwwwwk...",
    ".kwGGGGwwwwwk...",
    ".kwwwwwwwwwwk...",
    ".kkkkkkkkkkkk...",
  ],
  bin: [
    "....kkkkkkkk....",
    "..kkllllllllkk..",
    ".kllwwwwwwwwllk.",
    ".kkkkkkkkkkkkkk.",
    "..kwlwlwlwlwlk..",
    "..kwlwlwlwlwlk..",
    "..kwlwlnlwlwlk..",
    "..kwlwnnnwlwlk..",
    "..kwlwlnlwlwlk..",
    "..kwlwlwlwlwlk..",
    "..kwlwlwlwlwlk..",
    "..kwlwlwlwlwlk..",
    "...kllllllllk...",
    "....kkkkkkkk....",
  ],
  star: [
    "...y...",
    "...y...",
    "..yyy..",
    "yyywyyy",
    "..yyy..",
    "...y...",
    "...y...",
  ],
  heart: [
    ".rr.rr.",
    "rrrrrrr",
    "rrwrrrr",
    "rrrrrrr",
    ".rrrrr.",
    "..rrr..",
    "...r...",
  ],
  arrow: [
    "k...........",
    "kk..........",
    "kwk.........",
    "kwwk........",
    "kwwwk.......",
    "kwwwwk......",
    "kwwwwwk.....",
    "kwwwwwwk....",
    "kwwwwwwwk...",
    "kwwwwwwwwk..",
    "kwwwwwkkkkk.",
    "kwwkwwk.....",
    "kwk.kwwk....",
    "kk..kwwk....",
    "k....kwwk...",
    ".....kwwk...",
    "......kk....",
  ],
  warning: [
    ".......kk.......",
    "......kyyk......",
    "......kyyk......",
    ".....kyyyyk.....",
    ".....kykkyk.....",
    "....kyykkyyk....",
    "....kyykkyyk....",
    "...kyyykkyyyk...",
    "...kyyykkyyyk...",
    "..kyyyyyyyyyyk..",
    "..kyyyykkyyyyk..",
    ".kyyyyykkyyyyyk.",
    ".kyyyyyyyyyyyyk.",
    "kkkkkkkkkkkkkkkk",
  ],
  info: [
    ".....kkkkkk.....",
    "...kkbbbbbbkk...",
    "..kbbbbwwbbbbk..",
    ".kbbbbbwwbbbbbk.",
    ".kbbbbbbbbbbbbk.",
    "kbbbbbwwwbbbbbbk",
    "kbbbbbbwwbbbbbbk",
    "kbbbbbbwwbbbbbbk",
    "kbbbbbbwwbbbbbbk",
    "kbbbbbbwwbbbbbbk",
    ".kbbbbwwwwbbbbk.",
    ".kbbbbbbbbbbbbk.",
    "..kbbbbbbbbbbk..",
    "...kkbbbbbbkk...",
    ".....kkkkkk.....",
  ],
  error: [
    ".....kkkkkk.....",
    "...kkrrrrrrkk...",
    "..krrrrrrrrrrk..",
    ".krrwwrrrrwwrrk.",
    ".krrwwwrrwwwrrk.",
    "krrrrwwwwwwrrrrk",
    "krrrrrwwwwrrrrrk",
    "krrrrrwwwwrrrrrk",
    "krrrrwwwwwwrrrrk",
    ".krrwwwrrwwwrrk.",
    ".krrwwrrrrwwrrk.",
    "..krrrrrrrrrrk..",
    "...kkrrrrrrkk...",
    ".....kkkkkk.....",
  ],
} as const;

export type SpriteName = keyof typeof SPRITES;

function toRects(rows: readonly string[]) {
  const rects: { x: number; y: number; w: number; fill: string }[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (ch !== "." && PALETTE[ch]) {
        rects.push({ x, y, w: end - x, fill: PALETTE[ch] });
      }
      x = end;
    }
  });
  return rects;
}

function dims(rows: readonly string[]) {
  return {
    w: Math.max(...rows.map((r) => r.length)),
    h: rows.length,
  };
}

export function Pixel({
  name,
  size = 32,
  className,
  title,
}: {
  name: SpriteName;
  /** rendered width in px; height follows the sprite's aspect ratio */
  size?: number;
  className?: string;
  title?: string;
}) {
  const rows = SPRITES[name];
  const { w, h } = dims(rows);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={(size * h) / w}
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {toRects(rows).map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}

/** Same sprite as a data: URL — used for the retro mouse cursor. */
export function spriteDataUrl(name: SpriteName, scale = 2) {
  const rows = SPRITES[name];
  const { w, h } = dims(rows);
  const body = toRects(rows)
    .map(
      (r) =>
        `<rect x='${r.x}' y='${r.y}' width='${r.w}' height='1' fill='${r.fill}'/>`
    )
    .join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w * scale}' height='${h * scale}' viewBox='0 0 ${w} ${h}' shape-rendering='crispEdges'>${body}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
