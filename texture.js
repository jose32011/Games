/**
 * texture.js — Procedural canvas texture factory for Robot Arena 2
 * All textures are generated at runtime; no image files required.
 */
import * as THREE from 'three';

const cache = new Map();

function cached(key, fn) {
  if (cache.has(key)) return cache.get(key);
  const tex = fn();
  cache.set(key, tex);
  return tex;
}

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext('2d') };
}

function toTexture(canvas, repeat = 1) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 8;
  return tex;
}

// ── Noise helper ──────────────────────────────────────────────────────────────
function noise(ctx, w, h, alpha = 0.06) {
  const imageData = ctx.createImageData(w, h);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() * 255) | 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = (alpha * 255) | 0;
  }
  ctx.putImageData(imageData, 0, 0);
}

// ── 1. Brushed metal panel ─────────────────────────────────────────────────────
// Light-grey base, horizontal brush strokes, subtle panel-line grid, corner rivets
export function brushedMetal(tintHex = '#8a9a95', panelW = 256, panelH = 256) {
  const key = `bm_${tintHex}_${panelW}_${panelH}`;
  return cached(key, () => {
    const { canvas, ctx } = makeCanvas(panelW, panelH);

    // Base coat
    ctx.fillStyle = tintHex;
    ctx.fillRect(0, 0, panelW, panelH);

    // Brushed horizontal streaks
    for (let y = 0; y < panelH; y += 1) {
      const bright = 0.88 + Math.random() * 0.24;
      ctx.globalAlpha = 0.07 * Math.random();
      ctx.fillStyle = bright > 1 ? '#ffffff' : '#000000';
      ctx.fillRect(0, y, panelW, 1);
    }
    ctx.globalAlpha = 1;

    // Panel seam lines (inset border effect)
    const inset = 10;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(inset, inset, panelW - inset * 2, panelH - inset * 2);

    // Inner highlight edge (top + left)
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(inset + 1, panelH - inset);
    ctx.lineTo(inset + 1, inset + 1);
    ctx.lineTo(panelW - inset, inset + 1);
    ctx.stroke();

    // Corner rivets
    const rivets = [
      [inset + 5, inset + 5],
      [panelW - inset - 5, inset + 5],
      [inset + 5, panelH - inset - 5],
      [panelW - inset - 5, panelH - inset - 5],
    ];
    rivets.forEach(([rx, ry]) => {
      const g = ctx.createRadialGradient(rx - 1, ry - 1, 0, rx, ry, 4);
      g.addColorStop(0, 'rgba(255,255,255,0.7)');
      g.addColorStop(0.4, 'rgba(160,160,160,0.5)');
      g.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Subtle grain noise
    noise(ctx, panelW, panelH, 0.04);

    return toTexture(canvas);
  });
}

// ── 2. Dark structural metal ──────────────────────────────────────────────────
// Darker, more metallic, with a subtle cross-hatch texture for structural parts
export function darkMetal(panelW = 256, panelH = 256) {
  return cached(`dm_${panelW}_${panelH}`, () => {
    const { canvas, ctx } = makeCanvas(panelW, panelH);

    ctx.fillStyle = '#232830';
    ctx.fillRect(0, 0, panelW, panelH);

    // Cross-hatch
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < panelW; x += 16) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, panelH); ctx.stroke();
    }
    for (let y = 0; y < panelH; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(panelW, y); ctx.stroke();
    }

    // Sheen
    const g = ctx.createLinearGradient(0, 0, panelW, panelH);
    g.addColorStop(0, 'rgba(255,255,255,0.07)');
    g.addColorStop(1, 'rgba(0,0,0,0.12)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, panelW, panelH);

    noise(ctx, panelW, panelH, 0.035);
    return toTexture(canvas);
  });
}

// ── 3. Hazard stripes (yellow / black diagonal) ───────────────────────────────
export function hazardStripes(w = 256, h = 64, angle = 45) {
  return cached(`hz_${w}_${h}_${angle}`, () => {
    const { canvas, ctx } = makeCanvas(w, h);

    ctx.fillStyle = '#111416';
    ctx.fillRect(0, 0, w, h);

    const stripeW = 22;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-w, -h);
    for (let x = -w * 2; x < w * 4; x += stripeW * 2) {
      ctx.fillStyle = '#d4a820';
      ctx.fillRect(x, -h * 2, stripeW, h * 6);
    }
    ctx.restore();

    // Worn edge on top and bottom
    const worn = ctx.createLinearGradient(0, 0, 0, h);
    worn.addColorStop(0, 'rgba(0,0,0,0.55)');
    worn.addColorStop(0.15, 'rgba(0,0,0,0)');
    worn.addColorStop(0.85, 'rgba(0,0,0,0)');
    worn.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = worn;
    ctx.fillRect(0, 0, w, h);

    noise(ctx, w, h, 0.07);
    return toTexture(canvas);
  });
}

// ── 4. Tread / track texture ──────────────────────────────────────────────────
export function trackTread(w = 256, h = 64) {
  return cached(`tr_${w}_${h}`, () => {
    const { canvas, ctx } = makeCanvas(w, h);

    ctx.fillStyle = '#111214';
    ctx.fillRect(0, 0, w, h);

    const blockH = h * 0.5;
    const blockY = (h - blockH) / 2;
    const blockW = 18;
    const gap = 8;

    for (let x = 0; x < w; x += blockW + gap) {
      // Tread block
      ctx.fillStyle = '#2a2d30';
      ctx.fillRect(x, blockY, blockW, blockH);

      // Top highlight
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(x, blockY, blockW, 2);

      // Side shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(x + blockW - 2, blockY, 2, blockH);
    }

    // Rim lines
    ctx.fillStyle = '#1a1c1f';
    ctx.fillRect(0, 0, w, (h - blockH) / 2);
    ctx.fillRect(0, blockY + blockH, w, (h - blockH) / 2);

    noise(ctx, w, h, 0.05);
    return toTexture(canvas);
  });
}

// ── 5. Gun barrel / tube surface ──────────────────────────────────────────────
export function gunMetal(w = 128, h = 128) {
  return cached(`gm_${w}_${h}`, () => {
    const { canvas, ctx } = makeCanvas(w, h);

    ctx.fillStyle = '#1c1f22';
    ctx.fillRect(0, 0, w, h);

    // Axial highlight band
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.5)');
    g.addColorStop(0.3, 'rgba(255,255,255,0.18)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.08)');
    g.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Ring grooves every 24px
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 2;
    for (let y = 0; y < h; y += 24) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      // Highlight above groove
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, y + 2); ctx.lineTo(w, y + 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 2;
    }

    noise(ctx, w, h, 0.04);
    return toTexture(canvas);
  });
}

// ── 6. Worn paint / decal layer ───────────────────────────────────────────────
// A transparent overlay with scratches, chips, and edge wear
export function wornPaint(w = 256, h = 256) {
  return cached(`wp_${w}_${h}`, () => {
    const { canvas, ctx } = makeCanvas(w, h);

    ctx.clearRect(0, 0, w, h);

    // Random scratch lines
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 18; i++) {
      const x1 = Math.random() * w;
      const y1 = Math.random() * h;
      const len = 10 + Math.random() * 50;
      const angle = Math.random() * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + Math.cos(angle) * len, y1 + Math.sin(angle) * len);
      ctx.stroke();
    }

    // Paint chips (small dark patches)
    for (let i = 0; i < 12; i++) {
      const cx = Math.random() * w;
      const cy = Math.random() * h;
      const r = 2 + Math.random() * 5;
      ctx.fillStyle = `rgba(0,0,0,${0.2 + Math.random() * 0.25})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.5, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  });
}

// ── Material builders ─────────────────────────────────────────────────────────

/**
 * Create a brushed-metal MeshStandardMaterial tinted to `color`.
 * @param {number|string} color  - hex color (0xRRGGBB or '#rrggbb')
 * @param {object} overrides     - extra MeshStandardMaterial params
 */
export function metalMat(color, overrides = {}) {
  const hex = typeof color === 'number'
    ? '#' + color.toString(16).padStart(6, '0')
    : color;
  return new THREE.MeshStandardMaterial({
    map: brushedMetal(hex),
    color: new THREE.Color(color).multiplyScalar(1.1),   // slight boost so tint shows
    metalness: 0.65,
    roughness: 0.42,
    ...overrides,
  });
}

/** Dark structural material (frame, struts) */
export function structMat(overrides = {}) {
  return new THREE.MeshStandardMaterial({
    map: darkMetal(),
    color: 0x2a2e34,
    metalness: 0.8,
    roughness: 0.35,
    ...overrides,
  });
}

/** Hazard stripe material */
export function hazardMat() {
  return new THREE.MeshStandardMaterial({
    map: hazardStripes(),
    metalness: 0.3,
    roughness: 0.7,
  });
}

/** Rubber tread material */
export function treadMat() {
  return new THREE.MeshStandardMaterial({
    map: trackTread(),
    color: 0x181a1c,
    metalness: 0.05,
    roughness: 0.92,
  });
}

/** Gun barrel material */
export function gunMat() {
  return new THREE.MeshStandardMaterial({
    map: gunMetal(),
    color: 0x1a1d20,
    metalness: 0.88,
    roughness: 0.22,
  });
}
