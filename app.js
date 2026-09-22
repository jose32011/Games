import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { metalMat, structMat, hazardMat, treadMat, gunMat, brushedMetal, wornPaint } from './texture.js';
import { TEAMS, pickOpponents } from './teams.js';

// ── Renderer / Scene ──────────────────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111414);
scene.fog = new THREE.Fog(0x111414, 22, 52);

const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('game').prepend(renderer.domElement);

const loader = new GLTFLoader();

// ── Lighting ──────────────────────────────────────────────────────────────────
scene.add(new THREE.HemisphereLight(0xbac2be, 0x34302a, 1.8));
const sun = new THREE.DirectionalLight(0xffefcf, 3.1);
sun.position.set(-8, 14, 9);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 60;
sun.shadow.camera.left = -20;
sun.shadow.camera.right = 20;
sun.shadow.camera.top = 15;
sun.shadow.camera.bottom = -15;
scene.add(sun);

// Fill light from opposite side
const fill = new THREE.DirectionalLight(0x8ec5d4, 0.6);
fill.position.set(10, 8, -6);
scene.add(fill);

// ── Procedural Arena ──────────────────────────────────────────────────────────
const proceduralArena = [];

// Floor with panel texture
const floorTex = brushedMetal('#6e706a', 512, 512);
floorTex.repeat.set(6, 4);
const floorMat = new THREE.MeshStandardMaterial({
  map: floorTex, color: 0x8a8c86, roughness: 0.9, metalness: 0.1
});

const mats = {
  floor: floorMat,
  dark:   structMat(),
  yellow: new THREE.MeshStandardMaterial({ color: 0xe0b92c, roughness: 0.6, metalness: 0.3 }),
  red:    new THREE.MeshStandardMaterial({ color: 0xa93d2d, metalness: 0.35, roughness: 0.55 }),
  black:  new THREE.MeshStandardMaterial({ color: 0x111416, metalness: 0.8, roughness: 0.25 }),
};

function box(x, y, z, size, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = mesh.receiveShadow = true;
  scene.add(mesh);
  proceduralArena.push(mesh);
  return mesh;
}

box(0, -0.25, 0, [30, 0.5, 21], mats.floor);
const grid = new THREE.GridHelper(30, 15, 0x55534d, 0x6e6c66);
grid.position.y = 0.016;
scene.add(grid);

const arenaObstacles = [
  { minX: -1.6, maxX: 1.6,  minZ: -0.85, maxZ: 0.85 },
  { minX: -9.8, maxX: -7.3, minZ: -2.2,  maxZ: -0.8 },
  { minX:  7.3, maxX:  9.8, minZ: -2.2,  maxZ: -0.8 },
  { minX: -9.8, maxX: -7.3, minZ:  0.8,  maxZ:  2.2 },
  { minX:  7.3, maxX:  9.8, minZ:  0.8,  maxZ:  2.2 },
];
const arenaBounds = { minX: -10.8, maxX: 10.8, minZ: -7.2, maxZ: 7.2 };

for (let x = -14; x <= 14; x += 2) {
  box(x, 0.04, -10.5, [1.15, 0.06, 0.4], mats.yellow).rotation.y = Math.PI / 5;
  box(x, 0.04,  10.5, [1.15, 0.06, 0.4], mats.yellow).rotation.y = Math.PI / 5;
}
for (const z of [-10.7, 10.7]) {
  box(0, 0.65, z, [30, 1.3, 0.35], mats.dark);
  box(0, 1.8,  z, [30, 0.12, 0.12], mats.yellow);
  for (let x = -13; x <= 13; x += 2.4) box(x, 2.4, z, [0.12, 1.1, 0.18], mats.dark);
}
for (const x of [-15, 15]) box(x, 1.2, 0, [0.4, 2, 21], mats.dark);
for (let i = 0; i < 8; i++) {
  const x = -12 + i * 3.5;
  box(x, 4.7, -10,    [2.5, 3, 0.5],  mats.dark);
  box(x, 4.7, -9.65,  [2, 0.25, 0.08], mats.red);
}

// ── Robot builder ─────────────────────────────────────────────────────────────
/**
 * @param {number}  color   - hex tint
 * @param {boolean} isPlayer
 * @param {string}  size    - 'small' | 'medium' | 'large'
 * @param {string}  gun     - 'laser' | 'cannon' | 'shotgun'
 * @param {string}  engine  - 'standard' | 'sprint' | 'tank' | 'hover'
 * @param {string}  chassis - 'tracked' | 'standing' | 'walking'
 * @param {string}  armor   - 'light' | 'medium' | 'heavy'
 */
function buildRobot(color = 0x56a48c, isPlayer = false, size = 'medium',
                    gun = 'laser', engine = 'standard',
                    chassis = 'tracked', armor = 'medium') {
  const group = new THREE.Group();
  const s = { small: 0.78, medium: 1.0, large: 1.28 }[size] ?? 1.0;

  const armour    = metalMat(color);
  const structure = structMat();
  const hazard    = hazardMat();
  const tread     = treadMat();
  const barrel    = gunMat();
  const accent    = new THREE.MeshStandardMaterial({
    color: isPlayer ? 0xd4e06a : 0x4a5050, metalness: 0.55, roughness: 0.4,
  });
  // armor thickness affects plate sizes
  const armorScale = { light: 0.7, medium: 1.0, heavy: 1.35 }[armor] ?? 1.0;

  function part(geo, mat, px, py, pz, rx = 0, ry = 0, rz = 0) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(px, py, pz);
    mesh.rotation.set(rx, ry, rz);
    mesh.castShadow = true; mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }

  // ── GUN (shared across all chassis) ──────────────────────────────────────
  function addGun(gunY) {
    if (gun === 'cannon') {
      part(new THREE.CylinderGeometry(0.09*s, 0.12*s, 0.72*s, 12), barrel, 0, gunY, -0.66*s, Math.PI/2, 0, 0);
      part(new THREE.TorusGeometry(0.1*s, 0.025*s, 8, 16), barrel, 0, gunY, -1.0*s);
      part(new THREE.BoxGeometry(0.26*s, 0.26*s, 0.28*s), structure, 0, gunY, -0.28*s);
    } else if (gun === 'laser') {
      for (const lx of [-0.14*s, 0.14*s]) {
        part(new THREE.CylinderGeometry(0.035*s, 0.04*s, 0.9*s, 10), barrel, lx, gunY, -0.72*s, Math.PI/2, 0, 0);
        part(new THREE.CylinderGeometry(0.05*s, 0.035*s, 0.06*s, 10), accent, lx, gunY, -1.17*s, Math.PI/2, 0, 0);
      }
      part(new THREE.BoxGeometry(0.38*s, 0.18*s, 0.28*s), structure, 0, gunY, -0.3*s);
    } else if (gun === 'shotgun') {
      for (const [sx2, sy2] of [[-0.16*s, gunY+0.06*s], [0, gunY], [0.16*s, gunY+0.06*s]]) {
        part(new THREE.CylinderGeometry(0.045*s, 0.05*s, 0.65*s, 10), barrel, sx2, sy2, -0.66*s, Math.PI/2, 0, 0);
      }
      part(new THREE.BoxGeometry(0.5*s, 0.22*s, 0.32*s), structure, 0, gunY, -0.3*s);
      part(new THREE.BoxGeometry(0.1*s, 0.1*s, 0.2*s), structure, 0.22*s, gunY-0.1*s, -0.52*s);
    } else if (gun === 'railgun') {
      // Long slim single rail barrel with charge coils
      part(new THREE.CylinderGeometry(0.05*s, 0.06*s, 1.2*s, 10), barrel, 0, gunY, -0.86*s, Math.PI/2, 0, 0);
      // Charge coil rings along barrel
      for (let ci = 0; ci < 4; ci++) {
        part(new THREE.TorusGeometry(0.09*s, 0.018*s, 6, 12), accent, 0, gunY, -0.32*s - ci*0.22*s);
      }
      // Rail guides
      for (const rx of [-0.07*s, 0.07*s]) {
        part(new THREE.BoxGeometry(0.04*s, 0.04*s, 1.1*s), structure, rx, gunY, -0.75*s);
      }
      part(new THREE.BoxGeometry(0.22*s, 0.2*s, 0.22*s), structure, 0, gunY, -0.18*s);
    } else if (gun === 'plasma') {
      // Wide plasma projector — orb emitter on a short mount
      part(new THREE.SphereGeometry(0.14*s, 10, 8), accent, 0, gunY+0.04*s, -0.72*s);
      part(new THREE.CylinderGeometry(0.06*s, 0.1*s, 0.36*s, 10), barrel, 0, gunY, -0.44*s, Math.PI/2, 0, 0);
      // Side vanes
      for (const vx of [-0.18*s, 0.18*s]) {
        part(new THREE.BoxGeometry(0.06*s, 0.22*s, 0.28*s), structure, vx, gunY, -0.54*s);
      }
      part(new THREE.BoxGeometry(0.34*s, 0.18*s, 0.24*s), structure, 0, gunY, -0.24*s);
    } else if (gun === 'flail') {
      // Overhead flail arm — vertical axle + chain + ball
      part(new THREE.CylinderGeometry(0.04*s, 0.05*s, 0.42*s, 8), barrel, 0, gunY+0.3*s, -0.26*s); // axle
      part(new THREE.CylinderGeometry(0.025*s, 0.025*s, 0.3*s, 6), structure, 0.08*s, gunY+0.14*s, -0.48*s, 0.4, 0, 0.3); // chain link 1
      part(new THREE.CylinderGeometry(0.025*s, 0.025*s, 0.3*s, 6), structure, 0.14*s, gunY-0.04*s, -0.62*s, 0.6, 0, 0.2); // chain link 2
      part(new THREE.SphereGeometry(0.13*s, 10, 8), barrel, 0.18*s, gunY-0.18*s, -0.74*s); // ball
      // Spike studs on ball
      for (let si = 0; si < 6; si++) {
        const sa = si * Math.PI / 3;
        part(new THREE.CylinderGeometry(0.02*s, 0.01*s, 0.1*s, 6), structure,
          0.18*s + Math.cos(sa)*0.14*s, gunY-0.18*s + Math.sin(sa)*0.14*s, -0.74*s,
          0, 0, sa);
      }
      part(new THREE.BoxGeometry(0.28*s, 0.22*s, 0.28*s), structure, 0, gunY, -0.2*s);
    } else if (gun === 'spinner') {
      // Horizontal spinner disc — like a BattleBot bar spinner
      part(new THREE.CylinderGeometry(0.42*s, 0.38*s, 0.1*s, 16), barrel, 0, gunY-0.1*s, -0.52*s, 0, 0, 0);
      // Spinner teeth
      for (let ti = 0; ti < 3; ti++) {
        const ta = ti * (Math.PI * 2 / 3);
        part(new THREE.BoxGeometry(0.08*s, 0.08*s, 0.28*s), accent,
          Math.cos(ta)*0.36*s, gunY-0.1*s, -0.52*s + Math.sin(ta)*0.36*s, 0, ta, 0);
      }
      // Motor housing
      part(new THREE.CylinderGeometry(0.12*s, 0.14*s, 0.28*s, 12), structure, 0, gunY, -0.52*s);
    } else if (gun === 'sword') {
      // Energy sword — long blade with hilt
      part(new THREE.BoxGeometry(0.08*s, 0.04*s, 1.1*s), barrel, 0, gunY, -0.65*s); // blade
      part(new THREE.BoxGeometry(0.12*s, 0.08*s, 0.18*s), structure, 0, gunY, -0.08*s); // hilt
      part(new THREE.BoxGeometry(0.18*s, 0.06*s, 0.06*s), accent, 0, gunY, 0.04*s); // pommel
      // Energy glow effect (blade tip)
      part(new THREE.ConeGeometry(0.04*s, 0.12*s, 8), accent, 0, gunY, -1.2*s, 0, 0, Math.PI/2);
    } else if (gun === 'chainsaw') {
      // Chainsaw — spinning blade with teeth
      part(new THREE.BoxGeometry(0.26*s, 0.28*s, 0.32*s), structure, 0, gunY, -0.18*s); // motor housing
      part(new THREE.CylinderGeometry(0.16*s, 0.16*s, 0.06*s, 16), barrel, 0, gunY, -0.42*s, 0, 0, 0); // blade disc
      // Teeth around the blade
      for (let ti = 0; ti < 8; ti++) {
        const ta = ti * (Math.PI / 4);
        part(new THREE.BoxGeometry(0.04*s, 0.04*s, 0.08*s), accent,
          Math.cos(ta)*0.18*s, gunY, -0.42*s + Math.sin(ta)*0.18*s, 0, ta, 0);
      }
      // Handle
      part(new THREE.BoxGeometry(0.12*s, 0.06*s, 0.16*s), structure, 0, gunY-0.1*s, 0.06*s);
    }
  }

  // ── TURRET HEAD (shared) ──────────────────────────────────────────────────
  function addTurret(turretY) {
    part(new THREE.CylinderGeometry(0.42*s, 0.44*s, 0.1*s, 16), structure, 0, turretY, -0.05*s);
    part(new THREE.BoxGeometry(0.78*s, 0.32*s, 0.88*s), armour, 0, turretY+0.21*s, -0.05*s);
    part(new THREE.BoxGeometry(0.44*s, 0.06*s, 0.48*s), accent, 0, turretY+0.4*s, -0.04*s);
    for (const [bx, bz] of [[-0.16*s,-0.16*s],[0.16*s,-0.16*s],[-0.16*s,0.16*s],[0.16*s,0.16*s]]) {
      part(new THREE.CylinderGeometry(0.025*s, 0.025*s, 0.06*s, 8), structure, bx, turretY+0.44*s, bz-0.04*s);
    }
    // antenna
    part(new THREE.CylinderGeometry(0.02*s, 0.03*s, 0.28*s, 8), structure, 0.2*s, turretY+0.58*s, 0.28*s);
    part(new THREE.SphereGeometry(0.035*s, 8, 8), accent, 0.2*s, turretY+0.75*s, 0.28*s);
  }

  // ════════════════════════════════════════════════════════════════════════════
  if (chassis === 'tracked') {
    // ── TRACKED chassis (original low-profile tank) ───────────────────────
    const ap = armorScale;
    // Hull
    part(new THREE.BoxGeometry(1.5*s, 0.42*s*ap, 1.7*s), armour, 0, 0.58*s, 0);
    part(new THREE.BoxGeometry(1.6*s, 0.1*s, 1.8*s), structure, 0, 0.35*s, 0);
    part(new THREE.BoxGeometry(1.4*s, 0.22*s, 0.36*s), armour, 0, 0.45*s, -0.94*s, -0.22, 0, 0);
    part(new THREE.BoxGeometry(1.55*s, 0.16*s, 0.12*s), structure, 0, 0.46*s, 0.87*s);
    // Sponsons
    for (const side of [-1,1]) {
      const sx = side*0.84*s;
      part(new THREE.BoxGeometry(0.18*s, 0.38*s*ap, 1.62*s), armour, sx, 0.52*s, 0);
      part(new THREE.BoxGeometry(0.22*s, 0.1*s, 1.72*s), structure, sx, 0.3*s, 0);
      part(new THREE.BoxGeometry(0.18*s, 0.12*s, 0.08*s), hazard, sx, 0.62*s, -0.8*s);
    }
    // Turret
    addTurret(0.86*s);
    addGun(1.0*s + 0.21*s);

    // Drive
    if (engine === 'hover') {
      for (const [hx,hz] of [[-0.5*s,-0.55*s],[0.5*s,-0.55*s],[-0.5*s,0.55*s],[0.5*s,0.55*s]]) {
        part(new THREE.CylinderGeometry(0.22*s, 0.18*s, 0.14*s, 12), structure, hx, 0.17*s, hz);
        part(new THREE.TorusGeometry(0.2*s, 0.03*s, 6, 12), barrel, hx, 0.13*s, hz);
      }
      part(new THREE.BoxGeometry(1.1*s, 0.04*s, 1.4*s), accent, 0, 0.14*s, 0);
    } else {
      for (const side of [-1,1]) {
        const tx = side*0.72*s;
        part(new THREE.BoxGeometry(0.28*s, 0.36*s, 1.68*s), tread, tx, 0.26*s, 0);
        part(new THREE.CylinderGeometry(0.2*s, 0.2*s, 0.28*s, 16), structure, tx, 0.28*s, -0.78*s, 0, 0, Math.PI/2);
        part(new THREE.CylinderGeometry(0.18*s, 0.18*s, 0.28*s, 16), structure, tx, 0.24*s, 0.76*s, 0, 0, Math.PI/2);
        for (let wi=0; wi<3; wi++) {
          part(new THREE.CylinderGeometry(0.14*s, 0.14*s, 0.26*s, 12), mats.black, tx, 0.18*s, -0.42*s+wi*0.42*s, 0, 0, Math.PI/2);
        }
        if (engine === 'sprint') part(new THREE.CylinderGeometry(0.1*s, 0.15*s, 0.24*s, 10), barrel, tx, 0.5*s, 0.97*s, -0.3, 0, 0);
        if (engine === 'tank')   part(new THREE.BoxGeometry(0.06*s, 0.28*s, 1.8*s), structure, side*0.96*s, 0.36*s, 0);
        if (engine === 'jet')    part(new THREE.CylinderGeometry(0.1*s, 0.15*s, 0.44*s, 10), barrel, tx, 0.6*s, 0.97*s, -0.4, 0, 0);
      }
      if (engine === 'standard') {
        for (const ex of [-0.3*s, 0, 0.3*s]) part(new THREE.BoxGeometry(0.1*s, 0.14*s, 0.08*s), structure, ex, 0.64*s, 0.88*s);
      }
    }
    // Panel bolts
    for (const side of [-1,1]) for (let bi=0; bi<4; bi++) {
      part(new THREE.BoxGeometry(0.04*s,0.04*s,0.04*s), structure, side*0.76*s, 0.81*s, -0.55*s+bi*0.37*s);
    }

  } else if (chassis === 'standing') {
    // ── STANDING bipedal robot ────────────────────────────────────────────
    // Torso
    const ap = armorScale;
    part(new THREE.BoxGeometry(1.0*s, 0.9*s*ap, 0.7*s), armour, 0, 1.4*s, 0);
    // Chest plate
    part(new THREE.BoxGeometry(0.8*s, 0.5*s, 0.1*s), armour, 0, 1.5*s, -0.4*s);
    // Waist
    part(new THREE.CylinderGeometry(0.28*s, 0.35*s, 0.2*s, 12), structure, 0, 0.9*s, 0);
    // Hip plate
    part(new THREE.BoxGeometry(1.1*s, 0.18*s, 0.65*s), structure, 0, 0.78*s, 0);
    // Shoulder pads
    for (const side of [-1,1]) {
      part(new THREE.BoxGeometry(0.22*s, 0.32*s*ap, 0.6*s), armour, side*0.66*s, 1.7*s, 0);
      // Shoulder joint sphere
      part(new THREE.SphereGeometry(0.14*s, 10, 8), structure, side*0.66*s, 1.7*s, 0);
      // Upper arm (humerus)
      part(new THREE.BoxGeometry(0.2*s, 0.5*s, 0.2*s), structure, side*0.66*s, 1.32*s, 0);
      // Elbow joint
      part(new THREE.SphereGeometry(0.12*s, 10, 8), structure, side*0.66*s, 1.05*s, 0);
      // Forearm (ulna/radius)
      part(new THREE.BoxGeometry(0.18*s, 0.42*s, 0.18*s), armour, side*0.66*s, 0.88*s, 0.05*s, 0.2*side, 0, 0);
      // Wrist joint
      part(new THREE.SphereGeometry(0.1*s, 8, 8), structure, side*0.66*s, 0.66*s, 0.05*s);
      // Hand/claw
      part(new THREE.BoxGeometry(0.16*s, 0.14*s, 0.12*s), structure, side*0.66*s, 0.58*s, 0.08*s);
      // Finger claws
      for (const fi of [-0.04*s, 0, 0.04*s]) {
        part(new THREE.BoxGeometry(0.03*s, 0.06*s, 0.08*s), barrel, side*0.66*s + fi, 0.52*s, 0.12*s, 0.3, 0, 0);
      }
    }
    // Hazard stripe across chest
    part(new THREE.BoxGeometry(0.7*s, 0.1*s, 0.08*s), hazard, 0, 1.28*s, -0.4*s);
    // Head / turret
    addTurret(2.05*s);
    addGun(2.26*s);

    // Legs — two thick legs with knee joint and foot
    for (const side of [-1,1]) {
      const lx = side*0.32*s;
      // Upper leg
      part(new THREE.BoxGeometry(0.28*s, 0.55*s, 0.32*s), structure, lx, 0.45*s, 0);
      // Knee cap
      part(new THREE.SphereGeometry(0.18*s, 10, 8), structure, lx, 0.16*s, 0.04*s);
      // Lower leg
      part(new THREE.BoxGeometry(0.24*s, 0.48*s, 0.28*s), armour, lx, -0.22*s, 0.02*s);
      // Foot
      part(new THREE.BoxGeometry(0.32*s, 0.1*s, 0.52*s), structure, lx, -0.48*s, 0.08*s);
      // Foot toe
      part(new THREE.BoxGeometry(0.28*s, 0.08*s, 0.16*s), structure, lx, -0.48*s, -0.34*s);
      // Ankle detail
      part(new THREE.CylinderGeometry(0.08*s, 0.08*s, 0.3*s, 8), barrel, lx, -0.42*s, 0, 0, 0, Math.PI/2);
    }
    // Engine exhaust on back
    if (engine === 'sprint') {
      for (const ex of [-0.28*s, 0.28*s]) part(new THREE.CylinderGeometry(0.08*s, 0.12*s, 0.35*s, 10), barrel, ex, 1.3*s, 0.42*s, -0.3, 0, 0);
    } else if (engine === 'hover') {
      for (const [hx,hz] of [[-0.3*s,0.1*s],[0.3*s,0.1*s]]) {
        part(new THREE.CylinderGeometry(0.18*s, 0.14*s, 0.12*s, 12), structure, hx, -0.45*s, hz);
        part(new THREE.TorusGeometry(0.16*s, 0.025*s, 6, 12), barrel, hx, -0.48*s, hz);
      }
    } else if (engine === 'jet') {
      // Backpack-style rocket boosters
      for (const ex of [-0.32*s, 0.32*s]) {
        part(new THREE.CylinderGeometry(0.1*s, 0.14*s, 0.48*s, 10), barrel, ex, 1.45*s, 0.48*s, -0.4, 0, 0);
        part(new THREE.TorusGeometry(0.12*s, 0.02*s, 6, 10), accent, ex, 1.28*s, 0.62*s);
      }
    }

  } else if (chassis === 'walking') {
    // ── WALKING quad-leg spider chassis ──────────────────────────────────
    const ap = armorScale;
    // Central body — wide flat hexagonal-ish hull
    part(new THREE.BoxGeometry(1.4*s, 0.38*s*ap, 1.2*s), armour, 0, 0.9*s, 0);
    // Raised centre spine
    part(new THREE.BoxGeometry(0.5*s, 0.28*s, 1.0*s), structure, 0, 1.19*s, 0);
    // Under-plate
    part(new THREE.BoxGeometry(1.5*s, 0.1*s, 1.3*s), structure, 0, 0.7*s, 0);
    // Side armour flares
    for (const side of [-1,1]) {
      part(new THREE.BoxGeometry(0.14*s, 0.32*s*ap, 1.1*s), armour, side*0.84*s, 0.9*s, 0);
      part(new THREE.BoxGeometry(0.14*s, 0.1*s, 1.2*s), hazard, side*0.9*s, 0.74*s, 0);
    }
    // Turret on top
    addTurret(1.38*s);
    addGun(1.59*s);

    // Four legs (front-left, front-right, rear-left, rear-right)
    for (const [lx, lz, lry] of [
      [-0.65*s, -0.52*s, -0.35], [0.65*s, -0.52*s, 0.35],
      [-0.65*s,  0.52*s,  0.35], [0.65*s,  0.52*s, -0.35],
    ]) {
      // Hip socket
      part(new THREE.SphereGeometry(0.13*s, 8, 8), structure, lx, 0.82*s, lz);
      // Upper leg (angled outward)
      const ul = new THREE.Mesh(new THREE.BoxGeometry(0.14*s, 0.5*s, 0.14*s), structure);
      ul.position.set(lx + Math.sign(lx)*0.16*s, 0.56*s, lz + Math.sign(lz)*0.1*s);
      ul.rotation.set(Math.sign(lz)*0.4, 0, Math.sign(lx)*0.5);
      ul.castShadow = true;
      group.add(ul);
      // Knee
      part(new THREE.SphereGeometry(0.11*s, 8, 8), structure,
           lx + Math.sign(lx)*0.32*s, 0.28*s, lz + Math.sign(lz)*0.2*s);
      // Lower leg (angled down to ground)
      const ll = new THREE.Mesh(new THREE.BoxGeometry(0.12*s, 0.46*s, 0.12*s), armour);
      ll.position.set(lx + Math.sign(lx)*0.38*s, 0.06*s, lz + Math.sign(lz)*0.25*s);
      ll.rotation.set(Math.sign(lz)*0.6, 0, Math.sign(lx)*0.3);
      ll.castShadow = true;
      group.add(ll);
      // Claw foot
      part(new THREE.BoxGeometry(0.22*s, 0.07*s, 0.18*s), mats.black,
           lx + Math.sign(lx)*0.44*s, -0.12*s, lz + Math.sign(lz)*0.3*s);
    }
    // Engine details
    if (engine === 'hover') {
      for (const [hx,hz] of [[-0.45*s,0],[0.45*s,0]]) {
        part(new THREE.CylinderGeometry(0.2*s, 0.16*s, 0.12*s, 12), structure, hx, 0.66*s, hz);
        part(new THREE.TorusGeometry(0.18*s, 0.025*s, 6, 12), barrel, hx, 0.62*s, hz);
      }
    } else if (engine === 'sprint') {
      for (const ex of [-0.3*s,0.3*s]) part(new THREE.CylinderGeometry(0.07*s, 0.11*s, 0.28*s, 10), barrel, ex, 1.1*s, 0.65*s, -0.35, 0, 0);
    } else if (engine === 'jet') {
      // Dual rear rocket pods
      for (const ex of [-0.38*s, 0.38*s]) {
        part(new THREE.CylinderGeometry(0.12*s, 0.16*s, 0.5*s, 10), barrel, ex, 0.95*s, 0.68*s, -0.4, 0, 0);
        part(new THREE.TorusGeometry(0.13*s, 0.022*s, 6, 10), accent, ex, 0.72*s, 0.86*s);
      }
    }
  }

  } else if (chassis === 'wedge') {
    // ── WEDGE / FLIPPER chassis ───────────────────────────────────────────
    const ap = armorScale;
    // Main wedge body — sloped front
    part(new THREE.BoxGeometry(1.6*s, 0.3*s*ap, 1.8*s), armour, 0, 0.5*s, 0);
    // Wedge nose ramp (heavily angled front plate)
    part(new THREE.BoxGeometry(1.55*s, 0.08*s, 0.7*s), armour, 0, 0.24*s, -0.88*s, -0.55, 0, 0);
    // Under plate
    part(new THREE.BoxGeometry(1.65*s, 0.08*s, 1.9*s), structure, 0, 0.18*s, 0);
    // Rear raised block
    part(new THREE.BoxGeometry(1.4*s, 0.36*s, 0.48*s), armour, 0, 0.52*s, 0.7*s);
    // Hazard stripes on ramp
    part(new THREE.BoxGeometry(1.3*s, 0.06*s, 0.5*s), hazard, 0, 0.22*s, -0.82*s, -0.5, 0, 0);
    // Flipper arm (flat plate on front)
    part(new THREE.BoxGeometry(1.4*s, 0.06*s, 0.6*s), structure, 0, 0.32*s, -1.0*s, -0.1, 0, 0);
    // Side armour bars
    for (const side of [-1,1]) {
      part(new THREE.BoxGeometry(0.12*s, 0.32*s*ap, 1.72*s), armour, side*0.88*s, 0.44*s, 0);
      part(new THREE.BoxGeometry(0.14*s, 0.1*s, 1.82*s), structure, side*0.92*s, 0.28*s, 0);
    }
    // Low turret pod (wedge has a flat low-profile turret)
    part(new THREE.CylinderGeometry(0.3*s, 0.32*s, 0.08*s, 14), structure, 0, 0.7*s, 0.3*s);
    part(new THREE.BoxGeometry(0.6*s, 0.22*s, 0.7*s), armour, 0, 0.78*s, 0.28*s);
    part(new THREE.BoxGeometry(0.32*s, 0.05*s, 0.38*s), accent, 0, 0.9*s, 0.28*s);
    addGun(0.78*s);
    // Tracks
    for (const side of [-1,1]) {
      const tx = side*0.76*s;
      part(new THREE.BoxGeometry(0.26*s, 0.3*s, 1.72*s), tread, tx, 0.2*s, 0);
      part(new THREE.CylinderGeometry(0.18*s,0.18*s,0.26*s,14), structure, tx,0.22*s,-0.8*s,0,0,Math.PI/2);
      part(new THREE.CylinderGeometry(0.16*s,0.16*s,0.26*s,14), structure, tx,0.18*s,0.78*s,0,0,Math.PI/2);
      if (engine === 'sprint') part(new THREE.CylinderGeometry(0.09*s,0.13*s,0.22*s,10), barrel, tx,0.44*s,0.92*s,-0.3,0,0);
      if (engine === 'jet')    part(new THREE.CylinderGeometry(0.1*s,0.14*s,0.42*s,10), barrel, tx,0.58*s,0.92*s,-0.4,0,0);
    }
  }

  scene.add(group);
  return group;
}

// ── Collision helpers ─────────────────────────────────────────────────────────
function resolveArenaCollision(position, radius = 0.85) {
  arenaObstacles.forEach(o => {
    const nx = THREE.MathUtils.clamp(position.x, o.minX, o.maxX);
    const nz = THREE.MathUtils.clamp(position.z, o.minZ, o.maxZ);
    const dx = position.x - nx, dz = position.z - nz;
    if (dx * dx + dz * dz >= radius * radius) return;
    if (Math.abs(dx) > Math.abs(dz)) {
      position.x = dx < 0 ? o.minX - radius : o.maxX + radius;
    } else {
      position.z = dz < 0 ? o.minZ - radius : o.maxZ + radius;
    }
  });
  position.x = THREE.MathUtils.clamp(position.x, arenaBounds.minX + radius, arenaBounds.maxX - radius);
  position.z = THREE.MathUtils.clamp(position.z, arenaBounds.minZ + radius, arenaBounds.maxZ - radius);
}

function separateRobots() {
  const active = [player, ...bots.filter(b => b.respawn <= 0).map(b => b.r)];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i], b = active[j];
      const d = new THREE.Vector2(a.position.x - b.position.x, a.position.z - b.position.z);
      const len = d.length();
      if (len >= 1.7 || len === 0) continue;
      d.normalize().multiplyScalar((1.7 - len) / 2);
      a.position.x += d.x; a.position.z += d.y;
      b.position.x -= d.x; b.position.z -= d.y;
      resolveArenaCollision(a.position);
      resolveArenaCollision(b.position);
    }
  }
}

// ── Opponent selection UI ─────────────────────────────────────────────────────
// Populate team picker from Teams.txt data before the build screen
let selectedTeamIndex = 44; // default: Radio F Software

function buildTeamPicker() {
  const container = document.getElementById('teamPicker');
  if (!container) return;

  TEAMS.forEach(team => {
    const card = document.createElement('label');
    card.className = 'teamCard';
    card.title = team.motto; // tooltip on hover
    card.innerHTML = `
      <input type="radio" name="team" value="${team.index}" ${team.index === selectedTeamIndex ? 'checked' : ''}>
      <img class="teamLogo" src="${team.logo}" alt="${team.name}" title="${team.name}" onerror="this.style.display='none'">
      <span class="teamName">${team.name}<span class="teamMotto">${team.motto}</span></span>`;
    container.appendChild(card);
  });

  container.addEventListener('change', e => {
    selectedTeamIndex = parseInt(e.target.value, 10);
  });
}
buildTeamPicker();

// ── Bot configs (pulled from selected team at launch) ─────────────────────────
let activeBotConfigs = pickOpponents(selectedTeamIndex, 1);

// ── Player robot ──────────────────────────────────────────────────────────────
let selectedSize = 'medium', selectedGun = 'laser', selectedEngine = 'standard';
let robotTint = 0x56a48c;

// Start with a placeholder robot centered for build preview
let player = buildRobot(robotTint, true, 'medium', 'laser', 'standard', 'tracked', 'medium');
player.position.set(0, 0, 0);

// Show team screen by default
document.getElementById('teamScreen').style.display = 'grid';

// ── Bot configs ───────────────────────────────────────────────────────────────
const SPAWN_POSITIONS = [
  { x: -5, z: -2 }, { x: 5, z: -3 }, { x: -6, z: 3 }, { x: 5, z: 3 },
  { x: -8, z: 0 }, { x: 8, z: 0 },
];

function spawnBots(botConfigs) {
  // Remove any existing bots from scene
  bots.forEach(b => scene.remove(b.r));
  bots.length = 0;

  botConfigs.slice(0, 1).forEach((cfg, i) => {
    const pos = SPAWN_POSITIONS[i] || { x: (Math.random() - 0.5) * 16, z: (Math.random() - 0.5) * 12 };
    const r = buildRobot(cfg.color, false, cfg.size, cfg.gun, cfg.engine, cfg.chassis || 'tracked', cfg.armor || 'medium');
    r.position.set(pos.x, 0, pos.z);
    bots.push({
      ...cfg,
      r,
      health: 100,
      fire: Math.random() * 1.5,
      respawn: 0,
      target: null,
      // aiType-specific state
      spinCharge: 0,          // spinner: spin-up timer
      lastFlipTime: 0,        // flipper: cooldown
      circleAngle: Math.random() * Math.PI * 2, // evader: orbit angle
      regroupTimer: 0,        // pusher: regroup cooldown
    });
  });
}

const bots = [];
spawnBots(activeBotConfigs);

// ── GLB model loader (used when GLB assets are available) ─────────────────────
function applyTint(root, color) {
  const worn = wornPaint();
  root.traverse(obj => {
    if (!obj.isMesh || !obj.material) return;
    const mats2 = Array.isArray(obj.material) ? obj.material : [obj.material];
    mats2.forEach(mat => {
      if (mat.color) mat.color.lerp(new THREE.Color(color), 0.2);
      mat.metalness  = Math.max(mat.metalness  ?? 0, 0.45);
      mat.roughness  = Math.min(mat.roughness  ?? 1, 0.55);
      // Overlay worn scratches via alphaMap on a clone so we don't share state
      if (!mat._wornApplied) {
        const m2 = mat.clone();
        m2.alphaMap = worn;
        m2.transparent = true;
        m2._wornApplied = true;
        obj.material = Array.isArray(obj.material)
          ? obj.material.map(x => (x === mat ? m2 : x))
          : m2;
      }
    });
  });
}

function addModel(group, path, color) {
  return new Promise((resolve, reject) =>
    loader.load(path, gltf => {
      while (group.children.length) group.remove(group.children[0]);
      const model = gltf.scene;
      model.traverse(obj => {
        if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; }
      });
      const bounds = new THREE.Box3().setFromObject(model);
      const size   = bounds.getSize(new THREE.Vector3());
      model.scale.setScalar(1.9 / Math.max(size.x, size.z, size.y || 1));
      model.rotation.set(0, Math.PI, 0);
      const centered = new THREE.Box3().setFromObject(model);
      model.position.y = -centered.min.y;
      applyTint(model, color);
      group.add(model);
      resolve();
    }, undefined, reject)
  );
}

function loadArenaAsset() {
  const arenaConfig = PARTS.arena.find(a => a.id === buildState.arena) || PARTS.arena[0];
  const arenaPath = `assets/glb-arenas/${arenaConfig.file}`;
  return new Promise((resolve, reject) =>
    loader.load(arenaPath, gltf => {
      proceduralArena.forEach(o => { o.visible = false; });
      grid.visible = false;
      const arena = gltf.scene;
      arena.traverse(obj => {
        if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; }
      });
      const bounds = new THREE.Box3().setFromObject(arena);
      const sz     = bounds.getSize(new THREE.Vector3());
      const scale  = 29 / Math.max(sz.x, sz.z);
      arena.scale.setScalar(scale);
      arena.position.y = -bounds.min.y * scale;
      scene.add(arena);
      resolve();
    }, undefined, reject)
  );
}

// ── Multiplayer PeerJS Setup ───────────────────────────────────────────────
let peer = null;
let conn = null;
let isHost = false;
let gameCode = null;
let opponentReady = false;

// Initialize PeerJS
function initPeer() {
  peer = new Peer();
  
  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    if (isHost) {
      gameCode = id.slice(-6).toUpperCase();
      document.getElementById('roomCode').textContent = gameCode;
    }
  });

  peer.on('connection', (connection) => {
    conn = connection;
    setupConnection();
  });

  peer.on('error', (err) => {
    console.error('PeerJS error:', err);
    const statusEl = document.getElementById('lobbyStatus');
    if (statusEl) {
      statusEl.textContent = 'Connection error: ' + err.type;
      statusEl.className = 'lobbyStatus err';
    }
  });
}

function setupConnection() {
  conn.on('open', () => {
    console.log('Connection established');
    if (isHost) {
      document.getElementById('waitingStatus').textContent = 'Opponent connected! Build your robot.';
      document.getElementById('goToBuildBtn').style.display = 'block';
    } else {
      document.getElementById('waitingStatus').textContent = 'Connected to host! Build your robot.';
      document.getElementById('goToBuildBtn').style.display = 'block';
    }
  });

  conn.on('data', (data) => {
    handlePeerData(data);
  });

  conn.on('close', () => {
    console.log('Connection closed');
    document.getElementById('feed').textContent = 'OPPONENT DISCONNECTED';
  });
}

function handlePeerData(data) {
  switch (data.type) {
    case 'position':
      // Update opponent position (for multiplayer)
      if (bots.length > 0) {
        bots[0].r.position.set(data.x, data.y, data.z);
        bots[0].r.rotation.y = data.rotation;
      }
      break;
    case 'shoot':
      // Handle opponent shooting
      if (bots.length > 0) {
        const from = new THREE.Vector3(data.from.x, data.from.y, data.from.z);
        const to = new THREE.Vector3(data.to.x, data.to.y, data.to.z);
        shoot(from, to, 0xff6848, 'b');
      }
      break;
    case 'ready':
      opponentReady = data.ready;
      updateReadyStatus();
      break;
    case 'start':
      if (isHost) {
        startMultiplayerGame();
      }
      break;
  }
}

function updateReadyStatus() {
  const slot1Ready = document.getElementById('slot1Ready');
  if (slot1Ready) {
    slot1Ready.textContent = opponentReady ? 'READY' : '';
  }
}

function sendToPeer(data) {
  if (conn && conn.open) {
    conn.send(data);
  }
}

// Lobby event handlers
document.getElementById('createBtn')?.addEventListener('click', () => {
  isHost = true;
  document.getElementById('lobbyScreen').style.display = 'none';
  document.getElementById('waitingScreen').style.display = 'grid';
  initPeer();
});

document.getElementById('joinBtn')?.addEventListener('click', () => {
  const code = document.getElementById('joinCode').value.trim().toUpperCase();
  if (code.length !== 6) {
    document.getElementById('lobbyStatus').textContent = 'Please enter a 6-character code';
    document.getElementById('lobbyStatus').className = 'lobbyStatus err';
    return;
  }
  
  isHost = false;
  initPeer();
  
  peer.on('open', (id) => {
    // Try to connect to host
    conn = peer.connect(code.toLowerCase() + id.slice(-6));
    setupConnection();
    
    conn.on('error', (err) => {
      document.getElementById('lobbyStatus').textContent = 'Could not connect to game';
      document.getElementById('lobbyStatus').className = 'lobbyStatus err';
    });
  });
});

document.getElementById('copyCodeBtn')?.addEventListener('click', () => {
  if (gameCode) {
    navigator.clipboard.writeText(gameCode);
    document.getElementById('copyCodeBtn').textContent = '✓';
    setTimeout(() => {
      document.getElementById('copyCodeBtn').textContent = '⧉';
    }, 2000);
  }
});

document.getElementById('goToBuildBtn')?.addEventListener('click', () => {
  document.getElementById('waitingScreen').style.display = 'none';
  document.getElementById('teamScreen').style.display = 'grid';
});

// ── Build screen — Bot Lab tap-builder ───────────────────────────────────────
const buildState = {
  chassis: 'tracked',
  size:    'medium',
  gun:     'laser',
  engine:  'standard',
  armor:   'medium',
  color:   0x56a48c,
  arena:   'classic',
};

// Part stats for the top bar display
const PART_STATS = {
  chassis: { tracked: {w:100,s:'STD'}, standing: {w:85,s:'MED'}, walking: {w:120,s:'SLW'}, wedge: {w:90,s:'FAS'} },
  size:    { small: {w:-20,s:'+SPD'}, medium: {w:0,s:'STD'}, large: {w:+40,s:'-SPD'} },
  armor:   { light: {a:'LGT'}, medium: {a:'MED'}, heavy: {a:'HVY'} },
  engine:  { standard: {s:'STD'}, sprint: {s:'FAS'}, tank: {s:'SLW'}, hover: {s:'HOV'}, jet: {s:'JET'} },
};

const PARTS = {
  chassis: [
    { id:'tracked',  label:'Tracked Tank',    icon:'🦿', desc:'Low-profile armoured hull', weight:100, speed:'STD' },
    { id:'standing', label:'Standing Biped',  icon:'🤖', desc:'Upright humanoid frame',     weight:85,  speed:'MED' },
    { id:'walking',  label:'Walking Spider',  icon:'🕷', desc:'Quad-leg assault frame',     weight:120, speed:'SLW' },
    { id:'wedge',    label:'Wedge Flipper',   icon:'🔺', desc:'Low wedge with flipper arm', weight:90,  speed:'FAS' },
  ],
  size: [
    { id:'small',  label:'Small',  icon:'▪', desc:'Lightweight + fast',    weight:-20, speed:'+SPD' },
    { id:'medium', label:'Medium', icon:'▬', desc:'Balanced frame',         weight:0,   speed:'STD'  },
    { id:'large',  label:'Large',  icon:'▪', desc:'Heavy + slow',           weight:+40, speed:'-SPD' },
  ],
  gun: [
    { id:'laser',   label:'Laser Twins',   icon:'⚡', desc:'Rapid twin energy beams', dps:'HIGH',   rng:'MED'  },
    { id:'cannon',  label:'Heavy Cannon',  icon:'💥', desc:'Single heavy shell',       dps:'MED',    rng:'HIGH' },
    { id:'shotgun', label:'Spread Burst',  icon:'🔫', desc:'Wide close-range spray',   dps:'V.HIGH', rng:'LOW'  },
    { id:'flail',   label:'Flail Arm',     icon:'🔨', desc:'Overhead swinging ball',  dps:'MED',    rng:'MED'  },
    { id:'railgun', label:'Railgun',       icon:'⚡', desc:'Charged rail projectile',  dps:'HIGH',   rng:'HIGH' },
    { id:'plasma',  label:'Plasma Thrower',icon:'🔮', desc:'Wide plasma orb emitter',  dps:'HIGH',   rng:'MED'  },
    { id:'spinner', label:'Bar Spinner',   icon:'🔄', desc:'Horizontal spinning disc',  dps:'V.HIGH', rng:'LOW'  },
    { id:'sword',   label:'Energy Sword',  icon:'⚔', desc:'Long energy blade',        dps:'HIGH',   rng:'MED'  },
    { id:'chainsaw',label:'Chainsaw',      icon:'🪚', desc:'Spinning blade weapon',     dps:'V.HIGH', rng:'LOW'  },
  ],
  engine: [
    { id:'standard', label:'Standard Drive', icon:'⚙', desc:'Balanced power output',  spd:'STD',  boost:'MED'  },
    { id:'sprint',   label:'Sprint Boost',   icon:'💨', desc:'Speed +35%, boost burn', spd:'+35%', boost:'HIGH' },
    { id:'tank',     label:'Tank Drive',     icon:'🛡', desc:'Slow but extra armour',  spd:'-28%', boost:'LOW'  },
    { id:'hover',    label:'Hover Pods',     icon:'🌀', desc:'Float and strafe',        spd:'+15%', boost:'MED'  },
    { id:'jet',      label:'Jet Boosters',   icon:'🚀', desc:'Rocket boost thrust',    spd:'+25%', boost:'V.HIGH' },
  ],
  armor: [
    { id:'light',  label:'Light Plating',  icon:'◇', desc:'Thin, fast reaction',    hp:60,  wt:'-10' },
    { id:'medium', label:'Medium Armour',  icon:'◈', desc:'Standard protection',    hp:100, wt:'STD' },
    { id:'heavy',  label:'Heavy Plating',  icon:'◆', desc:'Max HP, slower',         hp:160, wt:'+30' },
  ],
  arena: [
    { id:'classic',    label:'Classic Arena',   icon:'🏟', desc:'Standard battle arena',      file:'arena_classic.glb' },
    { id:'arena',      label:'Arena',           icon:'🏗', desc:'Industrial arena',            file:'arena_arena.glb' },
    { id:'colosseum',  label:'Colosseum',       icon:'🏛', desc:'Ancient Roman arena',         file:'arena_colosseum.glb' },
    { id:'gauntlet',   label:'Gauntlet',        icon:'⚔', desc:'Narrow combat corridor',      file:'arena_gauntlet.glb' },
    { id:'pillars',    label:'Pillars',         icon:'🏛', desc:'Open arena with pillars',     file:'arena_pillars.glb' },
  ],
};

const CATEGORIES = [
  { id:'chassis', label:'CHASSIS', icon:'⬡' },
  { id:'gun',     label:'WEAPONS', icon:'◎' },
  { id:'engine',  label:'MOBILITY',icon:'⚙' },
  { id:'size',    label:'SIZE',    icon:'⤡' },
  { id:'armor',   label:'ARMOR',   icon:'◆' },
  { id:'arena',   label:'ARENA',   icon:'🏟' },
  { id:'color',   label:'COLOR',   icon:'🎨' },
];

let activeBuildCategory = 'chassis';
let buildCamAngle = 0.6;

function rebuildPreview() {
  scene.remove(player);
  player = buildRobot(
    buildState.color, true,
    buildState.size, buildState.gun, buildState.engine,
    buildState.chassis, buildState.armor
  );
  player.position.set(0, 0, 0);
  updateBotLabStats();
}

function updateBotLabStats() {
  const w = (PART_STATS.chassis[buildState.chassis]?.w ?? 100)
          + (PART_STATS.size[buildState.size]?.w ?? 0);
  const sp = PART_STATS.engine[buildState.engine]?.s ?? 'STD';
  const ar = PART_STATS.armor[buildState.armor]?.a ?? 'MED';
  const wEl = document.getElementById('blWeight');
  const sEl = document.getElementById('blSpeed');
  const aEl = document.getElementById('blArmor');
  if (wEl) wEl.textContent = w;
  if (sEl) sEl.textContent = sp;
  if (aEl) aEl.textContent = ar;
}

function renderPartList(categoryId) {
  const list = document.getElementById('partGrid');
  list.innerHTML = '';

  if (categoryId === 'color') {
    const hex = '#' + buildState.color.toString(16).padStart(6,'0');
    list.innerHTML = `
      <div class="blColorRow2">
        <label>
          <input id="buildColorPicker" type="color" value="${hex}">
          <span>TAP TO CHOOSE COLOR</span>
        </label>
        <div class="blColorPreview" id="blColorPreview" style="background:${hex}"></div>
      </div>`;
    document.getElementById('buildColorPicker').addEventListener('input', e => {
      buildState.color = parseInt(e.target.value.replace('#',''), 16);
      document.getElementById('blColorPreview').style.background = e.target.value;
      const swEl = document.getElementById('blColorName');
      if (swEl) swEl.textContent = e.target.value.toUpperCase();
      rebuildPreview();
    });
    return;
  }

  if (categoryId === 'arena') {
    const options = PARTS[categoryId] || [];
    options.forEach(opt => {
      const selected = buildState[categoryId] === opt.id;
      const row = document.createElement('button');
      row.className = 'blPartRow' + (selected ? ' selected' : '');

      row.innerHTML = `
        <div class="blPartThumb">${opt.icon}</div>
        <div class="blPartInfo">
          <div class="blPartName">${opt.label}</div>
          <div class="blPartDesc">${opt.desc}</div>
        </div>
        <div class="blPartCheck">✓</div>`;

      row.addEventListener('pointerdown', () => {
        buildState[categoryId] = opt.id;
        renderPartList(categoryId);
      });
      list.appendChild(row);
    });
    return;
  }

  const options = PARTS[categoryId] || [];
  options.forEach(opt => {
    const selected = buildState[categoryId] === opt.id;
    const row = document.createElement('button');
    row.className = 'blPartRow' + (selected ? ' selected' : '');

    // Build meta tags depending on category
    let metaHtml = '';
    if (opt.weight !== undefined) metaHtml += `<span class="blPartStat">WT ${opt.weight > 0 ? '+':''  }${opt.weight}</span>`;
    if (opt.speed  !== undefined) metaHtml += `<span class="blPartStat">SPD ${opt.speed}</span>`;
    if (opt.dps    !== undefined) metaHtml += `<span class="blPartStat">DPS ${opt.dps}</span>`;
    if (opt.rng    !== undefined) metaHtml += `<span class="blPartStat">RNG ${opt.rng}</span>`;
    if (opt.spd    !== undefined) metaHtml += `<span class="blPartStat">SPD ${opt.spd}</span>`;
    if (opt.boost  !== undefined) metaHtml += `<span class="blPartStat">BOOST ${opt.boost}</span>`;
    if (opt.hp     !== undefined) metaHtml += `<span class="blPartStat">HP ${opt.hp}</span>`;
    if (opt.wt     !== undefined) metaHtml += `<span class="blPartStat">WT ${opt.wt}</span>`;

    row.innerHTML = `
      <div class="blPartThumb">${opt.icon}</div>
      <div class="blPartInfo">
        <div class="blPartName">${opt.label}</div>
        <div class="blPartMeta">${metaHtml}</div>
        <div class="blPartDesc">${opt.desc}</div>
      </div>
      <div class="blPartCheck">✓</div>`;

    row.addEventListener('pointerdown', () => {
      buildState[categoryId] = opt.id;
      rebuildPreview();
      renderPartList(categoryId);
    });
    list.appendChild(row);
  });
}

function renderCategoryTabs() {
  const bar = document.getElementById('catBar');
  bar.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'blCatBtn' + (cat.id === activeBuildCategory ? ' active' : '');
    btn.innerHTML = `<span class="blCatIcon">${cat.icon}</span><span class="blCatLabel">${cat.label}</span>`;
    btn.addEventListener('pointerdown', () => {
      activeBuildCategory = cat.id;
      renderCategoryTabs();
      renderPartList(cat.id);
    });
    bar.appendChild(btn);
  });
}

// ── Screen flow: Team Select → Build → Battle ─────────────────────────────
const teamScreen  = document.getElementById('teamScreen');
const buildScreen = document.getElementById('buildScreen');

document.getElementById('teamContinueBtn').addEventListener('click', () => {
  teamScreen.style.display  = 'none';
  buildScreen.style.display = '';
  renderCategoryTabs();
  renderPartList(activeBuildCategory);
  updateBotLabStats();
});

document.getElementById('multiplayerBtn')?.addEventListener('click', () => {
  teamScreen.style.display = 'none';
  document.getElementById('lobbyScreen').style.display = 'grid';
});

// Bottom bar color picker sync
const bottomColorPicker = document.getElementById('buildColorPicker');
if (bottomColorPicker) {
  bottomColorPicker.addEventListener('input', e => {
    buildState.color = parseInt(e.target.value.replace('#',''), 16);
    const nameEl = document.getElementById('blColorName');
    if (nameEl) nameEl.textContent = e.target.value.toUpperCase();
    rebuildPreview();
  });
}

const launchButton = document.getElementById('launch');
const loadStatus   = document.getElementById('loadStatus');

launchButton && launchButton.addEventListener('click', async () => {
  launchButton.disabled = true;
  loadStatus.textContent = 'LOADING ARENA…';

  selectedSize   = buildState.size;
  selectedGun    = buildState.gun;
  selectedEngine = buildState.engine;
  robotTint      = new THREE.Color(buildState.color);

  // Final robot at arena spawn position
  scene.remove(player);
  player = buildRobot(robotTint.getHex(), true, selectedSize, selectedGun, selectedEngine, buildState.chassis, buildState.armor);
  player.position.set(0, 0, 5);

  // Send ready status to peer if multiplayer
  if (conn && conn.open) {
    sendToPeer({ type: 'ready', ready: true });
  }

  // For single player or when host
  if (!conn || isHost) {
    activeBotConfigs = pickOpponents(selectedTeamIndex, 1);
    spawnBots(activeBotConfigs);

    const chosenTeam = TEAMS.find(t => t.index === selectedTeamIndex);
    if (chosenTeam) {
      document.getElementById('feed').textContent =
        `VS ${chosenTeam.name.toUpperCase()} — "${chosenTeam.motto}"`;
    }
  } else {
    // For multiplayer guest, wait for host to start
    document.getElementById('feed').textContent = 'WAITING FOR HOST TO START MATCH...';
    sendToPeer({ type: 'ready', ready: true });
    
    // Wait for host to send start signal
    const waitForStart = () => {
      if (gameStarted) return;
      setTimeout(waitForStart, 100);
    };
    waitForStart();
    return;
  }

  try {
    await loadArenaAsset();
    gameStarted = true;
    buildScreen.style.display = 'none';
    setTimeout(() => {
      document.getElementById('feed').textContent = 'BATTLE ONLINE — DESTROY ALL HOSTILES';
    }, 3000);
  } catch (err) {
    console.error('Asset loading failed', err);
    loadStatus.textContent = 'ASSET LOAD FAILED — CHECK LOCAL ASSETS';
    launchButton.disabled = false;
  }
});

function startMultiplayerGame() {
  if (opponentReady) {
    document.getElementById('feed').textContent = 'MULTIPLAYER MATCH STARTING...';
    sendToPeer({ type: 'start' });
    
    // Start the game
    activeBotConfigs = pickOpponents(selectedTeamIndex, 1);
    spawnBots(activeBotConfigs);
    
    loadArenaAsset().then(() => {
      gameStarted = true;
      buildScreen.style.display = 'none';
      document.getElementById('feed').textContent = 'MULTIPLAYER BATTLE ONLINE';
    });
  }
}

// ── Combat ────────────────────────────────────────────────────────────────────
const shots = [], sparks = [];
const input = { x: 0, y: 0, fire: false, boost: false };
let health = 100, points = 0, enemyScore = 0;
let last = performance.now(), match = 295, gameStarted = false;

function shoot(from, to, color, owner = 'b') {
  const dir  = new THREE.Vector3().subVectors(to, from).normalize();
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshBasicMaterial({ color })
  );
  mesh.position.copy(from);
  scene.add(mesh);
  shots.push({ mesh, v: dir, life: 1, owner });
}

function burst(position, color) {
  for (let i = 0; i < 10; i++) {
    const spark = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.06, 0.06),
      new THREE.MeshBasicMaterial({ color })
    );
    spark.position.copy(position);
    spark.userData.v    = new THREE.Vector3((Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4);
    spark.userData.life = 0.5;
    scene.add(spark);
    sparks.push(spark);
  }
}

function firePlayer() {
  const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(player.quaternion);
  const from = player.position.clone().add(new THREE.Vector3(0, 1.1, -0.9));
  const to = player.position.clone().add(dir.multiplyScalar(14));
  shoot(from, to, 0xffdd5a, 'p');
  
  // Send shoot data to peer for multiplayer
  if (conn && conn.open) {
    sendToPeer({
      type: 'shoot',
      from: { x: from.x, y: from.y, z: from.z },
      to: { x: to.x, y: to.y, z: to.z }
    });
  }
}

function respawnBot(bot) {
  bot.health = 100;
  bot.respawn = 0;
  bot.r.visible = true;
  bot.r.position.set((Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 6), 0, -5 + Math.random() * 10);
  resolveArenaCollision(bot.r.position);
  bot.fire = 1;
}

// ── Main update ───────────────────────────────────────────────────────────────
function update(dt) {
  const engineFactor = { standard: 1, sprint: 1.35, tank: 0.72, hover: 1.15, jet: 1.25 }[selectedEngine] ?? 1;
  const speed = (input.boost ? 6.5 : 3.8) * engineFactor;

  player.position.x = THREE.MathUtils.clamp(player.position.x + input.x * speed * dt, -12, 12);
  player.position.z = THREE.MathUtils.clamp(player.position.z + input.y * speed * dt,  -8,  8);
  resolveArenaCollision(player.position);

  if (Math.abs(input.x) + Math.abs(input.y) > 0.1)
    player.rotation.y = Math.atan2(input.x, input.y);

  // Animate tracks (rotate road wheels)
  if (selectedEngine !== 'hover') {
    const moving = Math.abs(input.x) + Math.abs(input.y) > 0.05;
    if (moving) {
      player.traverse(obj => {
        if (obj.isMesh && obj.geometry instanceof THREE.CylinderGeometry) {
          obj.rotation.x += (input.y > 0 ? 1 : -1) * dt * 4;
        }
      });
    }
  }

  if (input.fire && (!update.cooldown || update.cooldown <= 0)) {
    firePlayer();
    update.cooldown = 0.28;
  }
  update.cooldown = (update.cooldown || 0) - dt;

  // Bot AI — behavior driven by aiType (maps to Python AI classes in robots/AI/)
  bots.forEach((bot, index) => {
    if (bot.respawn > 0) {
      bot.respawn -= dt;
      if (bot.respawn <= 0) respawnBot(bot);
      return;
    }
    bot.fire -= dt;
    const target   = player;
    const distance = bot.r.position.distanceTo(target.position);
    const dx = target.position.x - bot.r.position.x;
    const dz = target.position.z - bot.r.position.z;
    const baseSpeed = bot.engine === 'sprint' ? 1.25 : bot.engine === 'tank' ? 0.52 : 0.78;

    switch (bot.aiType) {

      // ── Rammer.py: Charge only — straight full-speed ram ─────────────────
      case 'rammer': {
        bot.r.rotation.y = Math.atan2(dx, dz);
        // accelerate harder as it closes in
        const ramSpeed = baseSpeed * (distance < 5 ? 1.4 : 1.0);
        if (distance > 1.2) {
          bot.r.position.x += Math.sign(dx) * dt * ramSpeed;
          bot.r.position.z += Math.sign(dz) * dt * ramSpeed;
        }
        if (distance < 13 && bot.fire <= 0) {
          shoot(bot.r.position.clone().add(new THREE.Vector3(0, 1.1, -0.8)), target.position, 0xff6848);
          bot.fire = bot.gun === 'shotgun' ? 2 : 1.8;
        }
        break;
      }

      // ── Pusher.py: Charge + Shove — tries to push player toward walls ────
      case 'pusher': {
        bot.r.rotation.y = Math.atan2(dx, dz);
        if (distance > 4) {
          bot.r.position.x += Math.sign(dx) * dt * baseSpeed;
          bot.r.position.z += Math.sign(dz) * dt * baseSpeed;
        } else {
          // Shove: aim to get behind player relative to nearest wall
          bot.regroupTimer = (bot.regroupTimer || 0) - dt;
          const nearWallX = target.position.x > 0 ? arenaBounds.maxX : arenaBounds.minX;
          const shoveDx = nearWallX - target.position.x;
          const shoveDz = target.position.z;
          // drive to the opposite side of target from the wall
          const approachX = target.position.x - Math.sign(shoveDx) * 2;
          const adx = approachX - bot.r.position.x;
          const adz = shoveDz - bot.r.position.z;
          if (bot.regroupTimer > 0) {
            // push phase: full throttle through target
            bot.r.position.x += Math.sign(dx) * dt * baseSpeed * 1.3;
            bot.r.position.z += Math.sign(dz) * dt * baseSpeed * 1.3;
          } else {
            // regroup: flank
            bot.r.position.x += Math.sign(adx) * dt * baseSpeed;
            bot.r.position.z += Math.sign(adz) * dt * baseSpeed;
            if (Math.abs(adx) < 1.5 && Math.abs(adz) < 1.5) bot.regroupTimer = 1.5;
          }
        }
        if (distance < 11 && bot.fire <= 0) {
          shoot(bot.r.position.clone().add(new THREE.Vector3(0, 1.1, -0.8)), target.position, 0xff6848);
          bot.fire = 1.6 + index * 0.15;
        }
        break;
      }

      // ── Spinner.py: Engage + spin-up — circles, rushes when ready ────────
      case 'spinner': {
        // circle the player, closing in as spinCharge builds
        bot.spinCharge = Math.min(1, (bot.spinCharge || 0) + dt * 0.35);
        bot.circleAngle = (bot.circleAngle || 0) + dt * (0.8 + bot.spinCharge * 0.6);
        const orbitR = 5 - bot.spinCharge * 2.5;
        const orbitX = target.position.x + Math.sin(bot.circleAngle) * orbitR;
        const orbitZ = target.position.z + Math.cos(bot.circleAngle) * orbitR;
        const odx = orbitX - bot.r.position.x;
        const odz = orbitZ - bot.r.position.z;
        bot.r.position.x += odx * dt * baseSpeed * 1.2;
        bot.r.position.z += odz * dt * baseSpeed * 1.2;
        bot.r.rotation.y = Math.atan2(dx, dz);
        // rush in when fully spun-up
        if (bot.spinCharge >= 0.9 && distance < 3.5) {
          bot.spinCharge = 0;
          shoot(bot.r.position.clone().add(new THREE.Vector3(0, 1.1, -0.8)), target.position, 0xff8833);
          bot.fire = 0.6;
        }
        if (distance < 13 && bot.fire <= 0 && bot.spinCharge > 0.5) {
          shoot(bot.r.position.clone().add(new THREE.Vector3(0, 1.1, -0.8)), target.position, 0xff8833);
          bot.fire = 1.1;
        }
        break;
      }

      // ── Flipper.py: Engage + fire on contact — careful approach, burst ───
      case 'flipper': {
        bot.r.rotation.y = Math.atan2(dx, dz);
        // slow, careful approach; accelerates only when very close
        const flipSpeed = distance < 3 ? baseSpeed * 1.6 : baseSpeed * 0.7;
        if (distance > 1.5) {
          bot.r.position.x += Math.sign(dx) * dt * flipSpeed;
          bot.r.position.z += Math.sign(dz) * dt * flipSpeed;
        }
        // fire when in contact range — burst of shots (simulates flip)
        const now = performance.now() / 1000;
        if (distance < 2.2 && now - (bot.lastFlipTime || 0) > 2.5) {
          bot.lastFlipTime = now;
          for (let s = 0; s < 3; s++) {
            const spread = new THREE.Vector3(
              (Math.random() - 0.5) * 0.4,
              0.5 + Math.random() * 0.5,
              -1
            ).normalize();
            const from = bot.r.position.clone().add(new THREE.Vector3(0, 1.2, -0.5));
            const to   = from.clone().add(spread.multiplyScalar(12));
            shoot(from, to, 0xff44aa);
          }
        } else if (distance < 10 && bot.fire <= 0) {
          shoot(bot.r.position.clone().add(new THREE.Vector3(0, 1.1, -0.8)), target.position, 0xff44aa);
          bot.fire = 1.3;
        }
        break;
      }

      // ── Chopper.py / SimpleWeapon: overhead strike, close range focused ──
      case 'chopper': {
        bot.r.rotation.y = Math.atan2(dx, dz);
        if (distance > 2.5) {
          bot.r.position.x += Math.sign(dx) * dt * baseSpeed * 1.1;
          bot.r.position.z += Math.sign(dz) * dt * baseSpeed * 1.1;
        }
        // chop: fires downward arc when adjacent
        if (distance < 2.8 && bot.fire <= 0) {
          const chop1 = bot.r.position.clone().add(new THREE.Vector3(0, 2, -0.5));
          const chop2 = target.position.clone().add(new THREE.Vector3(0, 0, 0));
          shoot(chop1, chop2, 0xffcc00);
          shoot(chop1.clone().add(new THREE.Vector3(0.3, 0, 0)), chop2, 0xffcc00);
          bot.fire = 1.4 + index * 0.1;
        } else if (distance < 8 && bot.fire <= 0) {
          shoot(bot.r.position.clone().add(new THREE.Vector3(0, 1.1, -0.8)), target.position, 0xffcc00);
          bot.fire = 2.2;
        }
        break;
      }

      // ── SimpleWeapon.py / evader: keeps distance, strafe-fires ───────────
      case 'evader':
      default: {
        // orbit and kite — same as spinner but no spin-up, just fires at range
        bot.circleAngle = (bot.circleAngle || 0) + dt * 0.9;
        const keepDist = 6;
        const ex = target.position.x + Math.sin(bot.circleAngle) * keepDist;
        const ez = target.position.z + Math.cos(bot.circleAngle) * keepDist;
        const edx = ex - bot.r.position.x;
        const edz = ez - bot.r.position.z;
        bot.r.position.x += edx * dt * baseSpeed * 1.1;
        bot.r.position.z += edz * dt * baseSpeed * 1.1;
        bot.r.rotation.y = Math.atan2(dx, dz);
        if (distance < 14 && bot.fire <= 0) {
          shoot(bot.r.position.clone().add(new THREE.Vector3(0, 1.1, -0.8)), target.position, 0xff6848);
          bot.fire = bot.gun === 'laser' ? 0.95 : 1.4 + index * 0.15;
        }
        break;
      }
    }

    resolveArenaCollision(bot.r.position);
  });

  separateRobots();
  resolveArenaCollision(player.position);
  bots.forEach(bot => { if (bot.respawn <= 0) resolveArenaCollision(bot.r.position); });

  // Projectile update + hit detection
  for (let i = shots.length - 1; i >= 0; i--) {
    const shot = shots[i];
    shot.mesh.position.addScaledVector(shot.v, dt * 15);
    shot.life -= dt;
    if (shot.life <= 0 || Math.abs(shot.mesh.position.x) > 16 || Math.abs(shot.mesh.position.z) > 12) {
      scene.remove(shot.mesh); shots.splice(i, 1); continue;
    }
    if (shot.owner === 'p') {
      const hit = bots.find(b => b.respawn <= 0 && shot.mesh.position.distanceTo(b.r.position) < 1);
      if (hit) {
        hit.health -= 34;
        burst(shot.mesh.position, 0xffbb44);
        if (hit.health <= 0) {
          points++;
          hit.r.visible = false;
          hit.respawn   = 3;
          document.getElementById('feed').textContent = `${hit.name}: DESTROYED — +1`;
        }
        scene.remove(shot.mesh); shots.splice(i, 1);
      }
    } else if (shot.mesh.position.distanceTo(player.position) < 1) {
      health -= 12;
      burst(player.position, 0xff5544);
      scene.remove(shot.mesh); shots.splice(i, 1);
    }
  }

  if (health <= 0) {
    enemyScore++;
    health = 100;
    player.position.set(0, 0, 5);
    document.getElementById('feed').textContent = 'NOVA-7: DESTROYED — REDEPLOYING';
  }

  // Sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    const sp = sparks[i];
    sp.position.addScaledVector(sp.userData.v, dt);
    sp.userData.v.y -= 8 * dt;
    sp.userData.life -= dt;
    if (sp.userData.life <= 0) { scene.remove(sp); sparks.splice(i, 1); }
  }

  // HUD
  document.getElementById('health').textContent    = Math.max(0, Math.round(health));
  document.getElementById('healthBar').style.width = `${Math.max(0, health)}%`;
  document.getElementById('score').textContent     = `${String(points).padStart(2,'0')} — ${String(enemyScore).padStart(2,'0')}`;
}

// ── Render loop ───────────────────────────────────────────────────────────────
function loop(time) {
  const dt = Math.min(0.04, (time - last) / 1000);
  last = time;

  if (gameStarted) {
    update(dt);
    const target  = player.position.clone().add(new THREE.Vector3(0, 1, -2));
    const desired = player.position.clone().add(new THREE.Vector3(0, 4.7, 7.8));
    camera.position.lerp(desired, 0.1);
    camera.lookAt(target);
  } else {
    // Build-screen orbit cam: slowly rotate around preview robot
    buildCamAngle += dt * 0.4;
    const camR = 4.0;
    // Standing robots are taller — raise camera
    const camH = buildState.chassis === 'standing' ? 2.8 : (buildState.chassis === 'wedge' ? 1.2 : 1.8);
    const lookH = buildState.chassis === 'standing' ? 1.4 : (buildState.chassis === 'wedge' ? 0.5 : 0.8);
    camera.position.set(
      Math.sin(buildCamAngle) * camR,
      camH,
      Math.cos(buildCamAngle) * camR
    );
    camera.lookAt(0, lookH, 0);
  }

  renderer.render(scene, camera);

  if (gameStarted) {
    match = Math.max(0, match - dt);
    document.getElementById('timer').textContent =
      `${Math.floor(match / 60).toString().padStart(2,'0')}:${Math.floor(match % 60).toString().padStart(2,'0')}`;
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ── Input ─────────────────────────────────────────────────────────────────────
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
addEventListener('keydown', e => {
  if (e.key === 'w') input.y = -1;
  if (e.key === 's') input.y =  1;
  if (e.key === 'a') input.x = -1;
  if (e.key === 'd') input.x =  1;
  if (e.code === 'Space') input.boost = true;
  if (e.code === 'Enter') input.fire  = true;
});
addEventListener('keyup', e => {
  if (['w','s'].includes(e.key)) input.y = 0;
  if (['a','d'].includes(e.key)) input.x = 0;
  if (e.code === 'Space') input.boost = false;
  if (e.code === 'Enter') input.fire  = false;
});

document.getElementById('fire').onpointerdown  = () => { input.fire  = true;  };
document.getElementById('fire').onpointerup    = () => { input.fire  = false; };
document.getElementById('boost').onpointerdown = () => { input.boost = true;  };
document.getElementById('boost').onpointerup   = () => { input.boost = false; };

const joystick = document.getElementById('joystick');
const knob     = joystick.firstElementChild;
const moveJoy  = e => {
  const r = joystick.getBoundingClientRect();
  const x = e.clientX - r.left  - 56;
  const y = e.clientY - r.top   - 56;
  input.x = THREE.MathUtils.clamp(x / 35, -1, 1);
  input.y = THREE.MathUtils.clamp(y / 35, -1, 1);
  knob.style.transform = `translate(${THREE.MathUtils.clamp(x,-35,35)}px,${THREE.MathUtils.clamp(y,-35,35)}px)`;
};
joystick.onpointerdown  = e => { joystick.setPointerCapture(e.pointerId); moveJoy(e); };
joystick.onpointermove  = moveJoy;
const joystickRelease = () => { input.x = input.y = 0; knob.style.transform = ''; };
joystick.onpointerup    = joystickRelease;
joystick.onpointercancel = joystickRelease;
