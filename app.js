import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111414);
scene.fog = new THREE.Fog(0x111414, 22, 52);
const loader = new GLTFLoader();
const proceduralArena = [];
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, .1, 100);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('game').prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xbac2be, 0x34302a, 1.8));
const sun = new THREE.DirectionalLight(0xffefcf, 3.1);
sun.position.set(-8, 14, 9);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

const mats = {
  floor: new THREE.MeshStandardMaterial({color: 0xaaa89c, roughness: .95}),
  dark: new THREE.MeshStandardMaterial({color: 0x25282a, roughness: .7, metalness: .6}),
  yellow: new THREE.MeshStandardMaterial({color: 0xe0b92c, roughness: .7}),
  red: new THREE.MeshStandardMaterial({color: 0xa93d2d, metalness: .35, roughness: .55}),
  black: new THREE.MeshStandardMaterial({color: 0x111416, metalness: .8, roughness: .25})
};

function box(x, y, z, size, material) {
  const object = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  object.position.set(x, y, z);
  object.castShadow = object.receiveShadow = true;
  scene.add(object);
  if (proceduralArena) proceduralArena.push(object);
  return object;
}

box(0, -.25, 0, [30, .5, 21], mats.floor);
const grid = new THREE.GridHelper(30, 15, 0x77756d, 0x96948b);
grid.position.y = .015;
scene.add(grid);
const arenaObstacles = [
  {minX: -1.6, maxX: 1.6, minZ: -.85, maxZ: .85},
  {minX: -9.8, maxX: -7.3, minZ: -2.2, maxZ: -.8},
  {minX: 7.3, maxX: 9.8, minZ: -2.2, maxZ: -.8},
  {minX: -9.8, maxX: -7.3, minZ: .8, maxZ: 2.2},
  {minX: 7.3, maxX: 9.8, minZ: .8, maxZ: 2.2}
];
const arenaBounds = {minX: -10.8, maxX: 10.8, minZ: -7.2, maxZ: 7.2};
for (let x = -14; x <= 14; x += 2) {
  box(x, .04, -10.5, [1.15, .06, .4], mats.yellow).rotation.y = Math.PI / 5;
  box(x, .04, 10.5, [1.15, .06, .4], mats.yellow).rotation.y = Math.PI / 5;
}
for (const z of [-10.7, 10.7]) {
  box(0, .65, z, [30, 1.3, .35], mats.dark);
  box(0, 1.8, z, [30, .12, .12], mats.yellow);
  for (let x = -13; x <= 13; x += 2.4) box(x, 2.4, z, [.12, 1.1, .18], mats.dark);
}
for (const x of [-15, 15]) box(x, 1.2, 0, [.4, 2, 21], mats.dark);
for (let i = 0; i < 8; i++) {
  const x = -12 + i * 3.5;
  box(x, 4.7, -10, [2.5, 3, .5], mats.dark);
  box(x, 4.7, -9.65, [2, .25, .08], mats.red);
}
proceduralArena.forEach(object => { object.visible = true; });

function robot(color, playerTeam = false) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.45, .55, 1.55),
    new THREE.MeshStandardMaterial({color, metalness: .6, roughness: .35}));
  body.position.y = .65;
  body.castShadow = true;
  group.add(body);
  const top = new THREE.Mesh(new THREE.BoxGeometry(.82, .35, .85),
    new THREE.MeshStandardMaterial({color: playerTeam ? 0xb4bd7c : 0x555b5b, metalness: .5}));
  top.position.set(0, 1.08, -.05);
  top.castShadow = true;
  group.add(top);
  for (const x of [-.85, .85]) {
    const wheel = new THREE.Mesh(new THREE.BoxGeometry(.22, .48, 1.45), mats.black);
    wheel.position.set(x, .38, 0);
    group.add(wheel);
  }
  scene.add(group);
  return group;
}

const player = robot(0x56a48c, true);
player.position.set(0, 0, 5);
const botConfigs = [
  {x: -5, z: -2, color: 0xb84432, size: 'medium', gun: 'cannon', engine: 'standard', name: 'VULCAN'},
  {x: 5, z: -3, color: 0x3b7199, size: 'small', gun: 'laser', engine: 'sprint', name: 'ION'},
  {x: -6, z: 3, color: 0xc35b31, size: 'large', gun: 'shotgun', engine: 'tank', name: 'BULL'},
  {x: 5, z: 3, color: 0xa44b34, size: 'medium', gun: 'laser', engine: 'hover', name: 'WRAITH'}
];
const bots = botConfigs.map(config => {
  const r = robot(config.color);
  r.position.set(config.x, 0, config.z);
  return {...config, r, health: 100, fire: Math.random() * 1.5, respawn: 0, target: player};
});

function resolveArenaCollision(position, radius = .85) {
  arenaObstacles.forEach(obstacle => {
    const minX = obstacle.minX;
    const maxX = obstacle.maxX;
    const minZ = obstacle.minZ;
    const maxZ = obstacle.maxZ;
    const nearestX = THREE.MathUtils.clamp(position.x, minX, maxX);
    const nearestZ = THREE.MathUtils.clamp(position.z, minZ, maxZ);
    const dx = position.x - nearestX;
    const dz = position.z - nearestZ;
    if (dx * dx + dz * dz >= radius * radius) return;
    if (Math.abs(dx) > Math.abs(dz)) {
      position.x = dx < 0 ? minX - radius : maxX + radius;
    } else {
      position.z = dz < 0 ? minZ - radius : maxZ + radius;
    }
  });
  position.x = THREE.MathUtils.clamp(position.x, arenaBounds.minX + radius, arenaBounds.maxX - radius);
  position.z = THREE.MathUtils.clamp(position.z, arenaBounds.minZ + radius, arenaBounds.maxZ - radius);
}

function separateRobots() {
  const active = [player, ...bots.filter(bot => bot.respawn <= 0).map(bot => bot.r)];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const first = active[i], second = active[j];
      const delta = new THREE.Vector2(first.position.x - second.position.x, first.position.z - second.position.z);
      const distance = delta.length();
      if (distance >= 1.7 || distance === 0) continue;
      delta.normalize().multiplyScalar((1.7 - distance) / 2);
      first.position.x += delta.x;
      first.position.z += delta.y;
      second.position.x -= delta.x;
      second.position.z -= delta.y;
      resolveArenaCollision(first.position);
      resolveArenaCollision(second.position);
    }
  }
}

let selectedEngine = 'standard';
let robotTint = 0x56a48c;
function applyTint(root, color) {
  root.traverse(object => {
    if (!object.isMesh || !object.material) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach(material => {
      if (material.color) material.color.lerp(new THREE.Color(color), .2);
    });
  });
}
function addModel(group, path, color) {
  return new Promise((resolve, reject) => loader.load(path, gltf => {
    while (group.children.length) group.remove(group.children[0]);
    const model = gltf.scene;
    model.traverse(object => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    model.scale.setScalar(1.9 / Math.max(size.x, size.z, size.y || 1));
    model.rotation.set(0, Math.PI, 0);
    const centered = new THREE.Box3().setFromObject(model);
    model.position.y = -centered.min.y;
    applyTint(model, color);
    group.add(model);
    resolve();
  }, undefined, reject));
}
function loadArenaAsset() {
  return new Promise((resolve, reject) => loader.load('assets/glb-arenas/arena_classic.glb', gltf => {
    proceduralArena.forEach(object => { object.visible = false; });
    grid.visible = false;
    const arena = gltf.scene;
    arena.traverse(object => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    const bounds = new THREE.Box3().setFromObject(arena);
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 29 / Math.max(size.x, size.z);
    arena.scale.setScalar(scale);
    arena.position.y = -bounds.min.y * scale;
    scene.add(arena);
    resolve();
  }, undefined, reject));
}
function selection(name) {
  return document.querySelector(`input[name="${name}"]:checked`).value;
}

const buildScreen = document.getElementById('buildScreen');
const launchButton = document.getElementById('launch');
const loadStatus = document.getElementById('loadStatus');
const colorPicker = document.getElementById('robotColor');
colorPicker.addEventListener('input', () => {
  document.getElementById('colorValue').textContent = colorPicker.value.toUpperCase();
});
launchButton.addEventListener('click', async () => {
  launchButton.disabled = true;
  loadStatus.textContent = 'LOADING ROBOT TEXTURES…';
  const size = selection('size');
  const gun = selection('gun');
  selectedEngine = selection('engine');
  robotTint = new THREE.Color(colorPicker.value);
  const playerPath = `assets/glb/robot_${size}_${gun}_${selectedEngine}.glb`;
  try {
    await Promise.all([
      addModel(player, playerPath, robotTint),
      ...bots.map(bot => addModel(bot.r, `assets/glb/robot_${bot.size}_${bot.gun}_${bot.engine}.glb`, bot.color)),
      loadArenaAsset()
    ]);
    gameStarted = true;
    buildScreen.remove();
    document.getElementById('feed').textContent = 'SYSTEM: BATTLE ONLINE — DESTROY ALL HOSTILES';
  } catch (error) {
    console.error('Asset loading failed', error);
    loadStatus.textContent = 'ASSET LOAD FAILED — CHECK THE LOCAL ASSETS';
    launchButton.disabled = false;
  }
});

const shots = [], sparks = [];
const input = {x: 0, y: 0, fire: false, boost: false};
let health = 100, points = 0, enemyScore = 0, last = performance.now(), match = 295, gameStarted = false;
function shoot(from, to, color, owner = 'b') {
  const direction = new THREE.Vector3().subVectors(to, from).normalize();
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(.1, 8, 8), new THREE.MeshBasicMaterial({color}));
  mesh.position.copy(from);
  scene.add(mesh);
  shots.push({mesh, v: direction, life: 1, owner, color});
}
function burst(position, color) {
  for (let i = 0; i < 8; i++) {
    const spark = new THREE.Mesh(new THREE.BoxGeometry(.06, .06, .06), new THREE.MeshBasicMaterial({color}));
    spark.position.copy(position);
    spark.userData.v = new THREE.Vector3((Math.random() - .5) * 4, Math.random() * 3, (Math.random() - .5) * 4);
    spark.userData.life = .5;
    scene.add(spark);
    sparks.push(spark);
  }
}
function firePlayer() {
  const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(player.quaternion);
  shoot(player.position.clone().add(new THREE.Vector3(0, 1, -.9)),
    player.position.clone().add(direction.multiplyScalar(14)), 0xffdd5a, 'p');
}
function respawnBot(bot) {
  bot.health = 100;
  bot.respawn = 0;
  bot.r.visible = true;
  bot.r.position.set((Math.random() > .5 ? 1 : -1) * (5 + Math.random() * 6), 0, -5 + Math.random() * 10);
  resolveArenaCollision(bot.r.position);
  bot.fire = 1;
}
function update(dt) {
  const engineFactor = {standard: 1, sprint: 1.35, tank: .72, hover: 1.15}[selectedEngine] || 1;
  const speed = (input.boost ? 6.5 : 3.8) * engineFactor;
  player.position.x = THREE.MathUtils.clamp(player.position.x + input.x * speed * dt, -12, 12);
  player.position.z = THREE.MathUtils.clamp(player.position.z + input.y * speed * dt, -8, 8);
  resolveArenaCollision(player.position);
  if (Math.abs(input.x) + Math.abs(input.y) > .1) player.rotation.y = Math.atan2(input.x, input.y);
  if (input.fire && (!update.cooldown || update.cooldown <= 0)) {
    firePlayer();
    update.cooldown = .28;
  }
  update.cooldown = (update.cooldown || 0) - dt;

  bots.forEach((bot, index) => {
    if (bot.respawn > 0) {
      bot.respawn -= dt;
      if (bot.respawn <= 0) respawnBot(bot);
      return;
    }
    bot.fire -= dt;
    const target = bot.target || player;
    const distance = bot.r.position.distanceTo(target.position);
    const dx = target.position.x - bot.r.position.x;
    const dz = target.position.z - bot.r.position.z;
    if (distance > 4) {
      const botSpeed = bot.engine === 'sprint' ? 1.25 : bot.engine === 'tank' ? .52 : .78;
      bot.r.position.x += Math.sign(dx) * dt * botSpeed;
      bot.r.position.z += Math.sign(dz) * dt * botSpeed;
      resolveArenaCollision(bot.r.position);
    }
    bot.r.rotation.y = Math.atan2(dx, dz);
    if (distance < 13 && bot.fire <= 0) {
      shoot(bot.r.position.clone().add(new THREE.Vector3(0, 1, -.8)), target.position, 0xff6848);
      bot.fire = bot.gun === 'shotgun' ? 2 : bot.gun === 'laser' ? 1.1 : 1.55 + index * .2;
    }
  });
  separateRobots();
  resolveArenaCollision(player.position);
  bots.forEach(bot => {
    if (bot.respawn <= 0) resolveArenaCollision(bot.r.position);
  });

  for (let i = shots.length - 1; i >= 0; i--) {
    const shot = shots[i];
    shot.mesh.position.addScaledVector(shot.v, dt * 15);
    shot.life -= dt;
    if (shot.life <= 0 || Math.abs(shot.mesh.position.x) > 16 || Math.abs(shot.mesh.position.z) > 12) {
      scene.remove(shot.mesh);
      shots.splice(i, 1);
      continue;
    }
    if (shot.owner === 'p') {
      const hit = bots.find(bot => bot.respawn <= 0 && shot.mesh.position.distanceTo(bot.r.position) < 1);
      if (hit) {
        hit.health -= 34;
        burst(shot.mesh.position, 0xffbb44);
        if (hit.health <= 0) {
          points++;
          hit.r.visible = false;
          hit.respawn = 3;
          document.getElementById('feed').textContent = `${hit.name}: DESTROYED — +1`;
        }
        scene.remove(shot.mesh);
        shots.splice(i, 1);
      }
    } else if (shot.mesh.position.distanceTo(player.position) < 1) {
      health -= 12;
      burst(player.position, 0xff5544);
      scene.remove(shot.mesh);
      shots.splice(i, 1);
    }
  }
  if (health <= 0) {
    enemyScore++;
    health = 100;
    player.position.set(0, 0, 5);
    document.getElementById('feed').textContent = 'NOVA-7: DESTROYED — REDEPLOYING';
  }
  sparks.forEach((spark, index) => {
    spark.position.addScaledVector(spark.userData.v, dt);
    spark.userData.v.y -= 8 * dt;
    spark.userData.life -= dt;
    if (spark.userData.life <= 0) {
      scene.remove(spark);
      sparks.splice(index, 1);
    }
  });
  document.getElementById('health').textContent = Math.max(0, Math.round(health));
  document.getElementById('healthBar').style.width = `${health}%`;
  document.getElementById('score').textContent = `${String(points).padStart(2, '0')} — ${String(enemyScore).padStart(2, '0')}`;
}
function loop(time) {
  const dt = Math.min(.04, (time - last) / 1000);
  last = time;
  if (gameStarted) update(dt);
  const target = player.position.clone().add(new THREE.Vector3(0, 1, -2));
  const desired = player.position.clone().add(new THREE.Vector3(0, 4.7, 7.8));
  camera.position.lerp(desired, .1);
  camera.lookAt(target);
  renderer.render(scene, camera);
  if (gameStarted) {
    match = Math.max(0, match - dt);
    document.getElementById('timer').textContent = `${Math.floor(match / 60).toString().padStart(2, '0')}:${Math.floor(match % 60).toString().padStart(2, '0')}`;
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
addEventListener('keydown', event => {
  if (event.key === 'w') input.y = -1;
  if (event.key === 's') input.y = 1;
  if (event.key === 'a') input.x = -1;
  if (event.key === 'd') input.x = 1;
  if (event.code === 'Space') input.boost = true;
  if (event.code === 'Enter') input.fire = true;
});
addEventListener('keyup', event => {
  if (['w', 's'].includes(event.key)) input.y = 0;
  if (['a', 'd'].includes(event.key)) input.x = 0;
  if (event.code === 'Space') input.boost = false;
  if (event.code === 'Enter') input.fire = false;
});
document.getElementById('fire').onpointerdown = () => { input.fire = true; };
document.getElementById('fire').onpointerup = () => { input.fire = false; };
document.getElementById('boost').onpointerdown = () => { input.boost = true; };
document.getElementById('boost').onpointerup = () => { input.boost = false; };
const joystick = document.getElementById('joystick');
const knob = joystick.firstElementChild;
const moveJoystick = event => {
  const rect = joystick.getBoundingClientRect();
  const x = event.clientX - rect.left - 56;
  const y = event.clientY - rect.top - 56;
  input.x = THREE.MathUtils.clamp(x / 35, -1, 1);
  input.y = THREE.MathUtils.clamp(y / 35, -1, 1);
  knob.style.transform = `translate(${THREE.MathUtils.clamp(x, -35, 35)}px,${THREE.MathUtils.clamp(y, -35, 35)}px)`;
};
joystick.onpointerdown = event => { joystick.setPointerCapture(event.pointerId); moveJoystick(event); };
joystick.onpointermove = moveJoystick;
joystick.onpointerup = () => { input.x = input.y = 0; knob.style.transform = ''; };
joystick.onpointercancel = joystick.onpointerup;
