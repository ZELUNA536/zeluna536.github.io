// Minimal 3D engine (no external libs)
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const gl = canvas.getContext("webgl");

canvas.width = innerWidth;
canvas.height = innerHeight;
gl.viewport(0,0,canvas.width,canvas.height);
gl.clearColor(0.02,0.02,0.05,1);

// Player
let player = { x:0, y:1.6, z:5 };
let keys = {};
let yaw = 0, pitch = 0;

// Basic loop
function loop(){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  update();
  requestAnimationFrame(loop);
}

function update(){
  let speed = keys["shift"] ? 0.15 : 0.08;
  if(keys["w"]) player.z -= speed;
  if(keys["s"]) player.z += speed;
  if(keys["a"]) player.x -= speed;
  if(keys["d"]) player.x += speed;
}

// Input
onkeydown = e => keys[e.key.toLowerCase()] = true;
onkeyup = e => keys[e.key.toLowerCase()] = false;
onmousemove = e => {
  yaw += e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
};

// Intro start
document.getElementById("intro").onclick = () => {
  document.getElementById("intro").style.display = "none";
  canvas.requestPointerLock();
  loop();
};

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// PLAYER
let player = { x: 0, z: 0, rot: 0 };
let keys = {};
let torch = false;

// SUBTITLES
function subtitle(text){
  let s = document.getElementById("subtitle");
  s.innerText = text;
  setTimeout(()=>s.innerText="", 3000);
}

// FACTORY MAP (simple grid)
const map = [
  "111111111111",
  "100000000001",
  "101111011101",
  "100001000001",
  "101101111101",
  "100000000001",
  "111111111111"
];

const tileSize = 80;

// INPUT
onkeydown = e => {
  keys[e.key.toLowerCase()] = true;
  if(e.key === "t"){
    torch = !torch;
    subtitle(torch ? "Torch ON" : "Torch OFF");
  }
};
onkeyup = e => keys[e.key.toLowerCase()] = false;
onmousemove = e => player.rot += e.movementX * 0.002;

// CORE LOOP
function loop(){
  update();
  render();
  requestAnimationFrame(loop);
}

// MOVEMENT
function update(){
  let speed = keys["shift"] ? 2.5 : 1.5;
  if(keys["w"]){
    player.x += Math.cos(player.rot) * speed;
    player.z += Math.sin(player.rot) * speed;
  }
  if(keys["s"]){
    player.x -= Math.cos(player.rot) * speed;
    player.z -= Math.sin(player.rot) * speed;
  }
}

// RENDER ENGINE
function render(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Fake 3D raycasting
  for(let x=0;x<canvas.width;x++){
    let rayAngle = player.rot - 0.6 + (x/canvas.width)*1.2;
    let dist = 0;
    let hit = false;

    while(!hit && dist < 800){
      dist += 5;
      let rx = Math.floor((player.x + Math.cos(rayAngle)*dist)/tileSize);
      let rz = Math.floor((player.z + Math.sin(rayAngle)*dist)/tileSize);
      if(map[rz] && map[rz][rx] === "1"){
        hit = true;
      }
    }

    let wallHeight = 60000 / dist;
    let shade = 200 - dist*0.3;
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(x, canvas.height/2-wallHeight/2, 1, wallHeight);
  }

  // FOG
  ctx.fillStyle = "rgba(20,20,30,0.4)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // FLASHLIGHT
  if(torch){
    let g = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, 50,
      canvas.width/2, canvas.height/2, 300
    );
    g.addColorStop(0,"rgba(255,255,200,0.4)");
    g.addColorStop(1,"rgba(0,0,0,0.9)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}

// INTRO
document.getElementById("intro").onclick = ()=>{
  document.getElementById("intro").style.display="none";
  canvas.requestPointerLock();
  subtitle("Subject 09 regained consciousness");
  loop();
};

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// PLAYER
let player = { x: 120, z: 120, rot: 0 };
let keys = {};
let torch = false;
let fear = 0;

// ENEMY (THE WATCHER)
let enemy = {
  x: 400,
  z: 400,
  active: true,
  visible: false
};

// SUBTITLES
function subtitle(text){
  let s = document.getElementById("subtitle");
  s.innerText = text;
  setTimeout(()=>s.innerText="", 3000);
}

// FACTORY MAP
const map = [
  "111111111111",
  "100000000001",
  "101111011101",
  "100001000001",
  "101101111101",
  "100000000001",
  "111111111111"
];

const tileSize = 80;

// INPUT
onkeydown = e => {
  keys[e.key.toLowerCase()] = true;
  if(e.key === "t"){
    torch = !torch;
    subtitle(torch ? "Torch ON" : "Torch OFF");
  }
};
onkeyup = e => keys[e.key.toLowerCase()] = false;
onmousemove = e => player.rot += e.movementX * 0.002;

// CORE LOOP
function loop(){
  update();
  render();
  psychologicalEffects();
  requestAnimationFrame(loop);
}

// MOVEMENT
function update(){
  let speed = keys["shift"] ? 2.5 : 1.5;
  if(keys["w"]){
    player.x += Math.cos(player.rot) * speed;
    player.z += Math.sin(player.rot) * speed;
  }
  if(keys["s"]){
    player.x -= Math.cos(player.rot) * speed;
    player.z -= Math.sin(player.rot) * speed;
  }

  // ENEMY STALKING (SLOW, CREEPY)
  let dx = player.x - enemy.x;
  let dz = player.z - enemy.z;
  let dist = Math.sqrt(dx*dx + dz*dz);

  if(dist < 300){
    enemy.x += dx * 0.002;
    enemy.z += dz * 0.002;
    fear += 0.05;
  }

  if(dist < 120){
    enemy.visible = true;
    fear += 0.2;
  } else {
    enemy.visible = false;
  }
}

// RENDER ENGINE (RAYCAST)
function render(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let x=0;x<canvas.width;x++){
    let rayAngle = player.rot - 0.6 + (x/canvas.width)*1.2;
    let dist = 0;
    let hit = false;

    while(!hit && dist < 800){
      dist += 5;
      let rx = Math.floor((player.x + Math.cos(rayAngle)*dist)/tileSize);
      let rz = Math.floor((player.z + Math.sin(rayAngle)*dist)/tileSize);
      if(map[rz] && map[rz][rx] === "1"){
        hit = true;
      }
    }

    let wallHeight = 60000 / dist;
    let shade = 200 - dist*0.3;
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(x, canvas.height/2-wallHeight/2, 1, wallHeight);
  }

  // ENEMY SILHOUETTE
  if(enemy.visible){
    ctx.fillStyle = "rgba(255,0,0,0.6)";
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 40, 0, Math.PI*2);
    ctx.fill();
  }

  // FOG
  ctx.fillStyle = "rgba(20,20,30,0.4)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // FLASHLIGHT
  if(torch){
    let g = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, 50,
      canvas.width/2, canvas.height/2, 300
    );
    g.addColorStop(0,"rgba(255,255,200,0.4)");
    g.addColorStop(1,"rgba(0,0,0,0.9)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}

// PSYCHOLOGICAL EFFECTS
function psychologicalEffects(){
  // SCREEN DISTORTION
  if(fear > 30){
    ctx.fillStyle = "rgba(255,0,0,0.05)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // HALLUCINATIONS
  if(fear > 50 && Math.random() < 0.01){
    subtitle("You are not alone.");
  }

  if(fear > 70 && Math.random() < 0.008){
    subtitle("It remembers you.");
  }

  if(fear > 90){
    subtitle("Your mind is not yours anymore.");
    enemy.x = player.x + Math.random()*200 - 100;
    enemy.z = player.z + Math.random()*200 - 100;
    fear = 40;
  }
}

// INTRO
document.getElementById("intro").onclick = ()=>{
  document.getElementById("intro").style.display="none";
  canvas.requestPointerLock();
  subtitle("Subject 09 regained consciousness");
  loop();
};

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// PLAYER
let player = { x: 120, z: 120, rot: 0 };
let keys = {};
let torch = false;
let fear = 0;

// ENEMY
let enemy = { x: 400, z: 400, active: true, visible: false };

// WEATHER
let weather = {
  rain: true,
  storm: false,
  fog: true,
  lightning: false
};

// RAIN PARTICLES
let rainDrops = [];
for(let i=0;i<200;i++){
  rainDrops.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    speed: 4+Math.random()*6
  });
}

// SUBTITLES
function subtitle(text){
  let s = document.getElementById("subtitle");
  s.innerText = text;
  setTimeout(()=>s.innerText="", 3000);
}

// MAP
const map = [
  "111111111111",
  "100000000001",
  "101111011101",
  "100001000001",
  "101101111101",
  "100000000001",
  "111111111111"
];
const tileSize = 80;

// INPUT
onkeydown = e => {
  keys[e.key.toLowerCase()] = true;
  if(e.key === "t"){
    torch = !torch;
    subtitle(torch ? "Torch ON" : "Torch OFF");
  }
};
onkeyup = e => keys[e.key.toLowerCase()] = false;
onmousemove = e => player.rot += e.movementX * 0.002;

// MAIN LOOP
function loop(){
  update();
  render();
  psychologicalEffects();
  weatherSystem();
  requestAnimationFrame(loop);
}

// MOVEMENT + ENEMY
function update(){
  let speed = keys["shift"] ? 2.5 : 1.5;
  if(keys["w"]){
    player.x += Math.cos(player.rot) * speed;
    player.z += Math.sin(player.rot) * speed;
  }
  if(keys["s"]){
    player.x -= Math.cos(player.rot) * speed;
    player.z -= Math.sin(player.rot) * speed;
  }

  let dx = player.x - enemy.x;
  let dz = player.z - enemy.z;
  let dist = Math.sqrt(dx*dx + dz*dz);

  if(dist < 300){
    enemy.x += dx * 0.002;
    enemy.z += dz * 0.002;
    fear += 0.05;
  }

  enemy.visible = dist < 120;
}

// RENDER ENGINE
function render(){
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // RAYCAST WALLS
  for(let x=0;x<canvas.width;x++){
    let rayAngle = player.rot - 0.6 + (x/canvas.width)*1.2;
    let dist = 0;
    let hit = false;

    while(!hit && dist < 800){
      dist += 5;
      let rx = Math.floor((player.x + Math.cos(rayAngle)*dist)/tileSize);
      let rz = Math.floor((player.z + Math.sin(rayAngle)*dist)/tileSize);
      if(map[rz] && map[rz][rx] === "1") hit = true;
    }

    let wallHeight = 60000 / dist;
    let shade = 200 - dist*0.3;
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(x, canvas.height/2-wallHeight/2, 1, wallHeight);

    // WATER REFLECTION
    ctx.fillStyle = `rgba(${shade},${shade},${shade},0.15)`;
    ctx.fillRect(x, canvas.height/2+wallHeight/2, 1, wallHeight/3);
  }

  // ENEMY
  if(enemy.visible){
    ctx.fillStyle = "rgba(255,0,0,0.6)";
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 40, 0, Math.PI*2);
    ctx.fill();
  }

  // FOG
  if(weather.fog){
    ctx.fillStyle = "rgba(20,20,30,0.4)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // FLASHLIGHT
  if(torch){
    let g = ctx.createRadialGradient(
      canvas.width/2, canvas.height/2, 50,
      canvas.width/2, canvas.height/2, 300
    );
    g.addColorStop(0,"rgba(255,255,200,0.4)");
    g.addColorStop(1,"rgba(0,0,0,0.9)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // LIGHTNING FLASH
  if(weather.lightning){
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}

// WEATHER SYSTEM
function weatherSystem(){
  if(weather.rain){
    ctx.strokeStyle = "rgba(180,180,255,0.6)";
    rainDrops.forEach(r=>{
      ctx.beginPath();
      ctx.moveTo(r.x,r.y);
      ctx.lineTo(r.x,r.y+10);
      ctx.stroke();
      r.y += r.speed;
      if(r.y > canvas.height){
        r.y = -10;
        r.x = Math.random()*canvas.width;
      }
    });
  }

  // RANDOM STORM
  if(Math.random() < 0.002){
    weather.lightning = true;
    setTimeout(()=>weather.lightning=false,100);
  }
}

// PSYCHOLOGICAL EFFECTS
function psychologicalEffects(){
  if(fear > 40){
    ctx.fillStyle = "rgba(255,0,0,0.05)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  if(fear > 60 && Math.random() < 0.01){
    subtitle("The factory is breathing.");
  }

  if(fear > 80 && Math.random() < 0.008){
    subtitle("The walls are watching you.");
  }

  if(fear > 100){
    subtitle("You were never supposed to wake up.");
    enemy.x = player.x + Math.random()*200 - 100;
    enemy.z = player.z + Math.random()*200 - 100;
    fear = 50;
  }
}

// INTRO
document.getElementById("intro").onclick = ()=>{
  document.getElementById("intro").style.display="none";
  canvas.requestPointerLock();
  subtitle("Subject 09 regained consciousness");
  loop();
};

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// PLAYER
let player = { x: 120, z: 120, rot: 0 };
let keys = {};
let torch = false;
let fear = 0;
let body = localStorage.getItem("body") || "male";

// ENEMY
let enemy = { x: 400, z: 400, visible: false };

// WEATHER
let weather = { rain:true, fog:true, lightning:false };

// STORY
let memories = [
  "Memory Fragment: You signed the contract willingly.",
  "Memory Fragment: Section 9 was never abandoned.",
  "Memory Fragment: The experiments used human minds.",
  "Memory Fragment: You are not a visitor. You are a subject."
];
let memoryIndex = 0;

// SAVE SYSTEM
let save = {
  fear: 0,
  memory: 0
};

// SUBTITLES
function subtitle(text){
  let s = document.getElementById("subtitle");
  s.innerText = text;
  setTimeout(()=>s.innerText="", 4000);
}

// INPUT
onkeydown = e => {
  keys[e.key.toLowerCase()] = true;

  if(e.key==="t"){
    torch=!torch;
    subtitle(torch?"Torch ON":"Torch OFF");
  }

  if(e.key==="m"){
    body = body==="male"?"female":"male";
    localStorage.setItem("body", body);
    subtitle("Body switched: "+body);
  }

  if(e.key==="f"){
    triggerMemory();
  }
};
onkeyup = e => keys[e.key.toLowerCase()] = false;
onmousemove = e => player.rot += e.movementX * 0.002;

// MEMORY SYSTEM
function triggerMemory(){
  if(memoryIndex < memories.length){
    subtitle(memories[memoryIndex]);
    memoryIndex++;
    saveGame();
  } else {
    subtitle("All memories recovered.");
  }
}

// SAVE
function saveGame(){
  save.fear = fear;
  save.memory = memoryIndex;
  localStorage.setItem("echoSave", JSON.stringify(save));
}

// LOAD
let loaded = JSON.parse(localStorage.getItem("echoSave"));
if(loaded){
  fear = loaded.fear;
  memoryIndex = loaded.memory;
}

// MAIN LOOP
function loop(){
  update();
  render();
  psychological();
  weatherSystem();
  endingCheck();
  requestAnimationFrame(loop);
}

// MOVEMENT + ENEMY
function update(){
  let speed = keys["shift"]?2.5:1.5;
  if(keys["w"]){
    player.x += Math.cos(player.rot)*speed;
    player.z += Math.sin(player.rot)*speed;
  }
  if(keys["s"]){
    player.x -= Math.cos(player.rot)*speed;
    player.z -= Math.sin(player.rot)*speed;
  }

  let dx = player.x - enemy.x;
  let dz = player.z - enemy.z;
  let dist = Math.sqrt(dx*dx+dz*dz);

  if(dist < 300){
    enemy.x += dx*0.002;
    enemy.z += dz*0.002;
    fear += 0.05;
  }

  enemy.visible = dist < 120;
}

// RENDER
function render(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // WORLD
  for(let i=0;i<canvas.width;i++){
    let ray = player.rot-0.6+(i/canvas.width)*1.2;
    let d=0;
    while(d<800) d+=5;
    let h=60000/d;
    let shade=200-d*0.3;
    ctx.fillStyle=`rgb(${shade},${shade},${shade})`;
    ctx.fillRect(i,canvas.height/2-h/2,1,h);
  }

  // ENEMY
  if(enemy.visible){
    ctx.fillStyle="rgba(255,0,0,0.6)";
    ctx.beginPath();
    ctx.arc(canvas.width/2,canvas.height/2,40,0,Math.PI*2);
    ctx.fill();
  }

  // FOG
  if(weather.fog){
    ctx.fillStyle="rgba(20,20,30,0.4)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // TORCH
  if(torch){
    let g=ctx.createRadialGradient(
      canvas.width/2,canvas.height/2,50,
      canvas.width/2,canvas.height/2,300
    );
    g.addColorStop(0,"rgba(255,255,200,0.4)");
    g.addColorStop(1,"rgba(0,0,0,0.9)");
    ctx.fillStyle=g;
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}

// WEATHER
function weatherSystem(){
  if(Math.random()<0.002){
    weather.lightning=true;
    setTimeout(()=>weather.lightning=false,100);
  }
  if(weather.lightning){
    ctx.fillStyle="rgba(255,255,255,0.2)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}

// PSYCHOLOGY
function psychological(){
  if(fear>40){
    ctx.fillStyle="rgba(255,0,0,0.05)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
  if(fear>70 && Math.random()<0.01){
    subtitle("You chose this body.");
  }
}

// ENDING
function endingCheck(){
  if(memoryIndex>=memories.length && fear>120){
    subtitle("ENDING UNLOCKED: You were the experiment.");
    subtitle("The factory never trapped you.");
    subtitle("You built it.");
    saveGame();
    fear=0;
  }
}

// INTRO
document.getElementById("intro").onclick=()=>{
  document.getElementById("intro").style.display="none";
  canvas.requestPointerLock();
  subtitle("Subject 09 regained consciousness");
  loop();
};
