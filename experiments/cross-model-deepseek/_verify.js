#!/usr/bin/env node
/* Dev-only verification harness (not part of the game).
   Extracts each demo's pure SIM core and checks:
   (a) the default "plausible-but-wrong" program FAILS,
   (b) the intended solution program WINS.
   Run: node _verify.js */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
let pass = 0, fail = 0;

function loadDemo(dir) {
  const html = fs.readFileSync(path.join(ROOT, dir, "index.html"), "utf8");
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error(dir + ": no script found");
  const sandbox = { module: { exports: {} }, exports: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(m[1], sandbox, { filename: dir + "/index.html" });
  return sandbox.module.exports.SIM;
}

function check(name, cond, extra) {
  if (cond) { pass++; console.log("  ✔ " + name); }
  else { fail++; console.log("  ✘ FAIL: " + name + (extra ? " — " + extra : "")); }
}

/* ---------------- demo-01 ---------------- */
console.log("demo-01 The Gravity Amendment");
{
  const SIM = loadDemo("demo-01");
  const flawed = SIM.run([{ t: 0, dir: "D" }], { moves: [], maxT: 60 });
  check("flawed default (gravity DOWN) does not win", !flawed.win, "win=" + flawed.win);
  // wait on the character-plate until the boulder latches (t≈24), then climb to the exit
  const moves01 = [];
  [[10,"L"],[11,"U"],[12,"U"],[13,"U"],[14,"U"],[15,"U"],[16,"L"],[17,"L"],[18,"L"],[19,"L"],[26,"U"],[27,"U"],[28,"U"]]
    .forEach(m=>moves01.push(m));
  const sol = SIM.run(
    [{ t: 0, dir: "R" }, { t: 10, dir: "D" }, { t: 20, dir: "L" }],
    { moves: moves01, maxT: 40 }
  );
  check("solution (R→D→L + hold the plate) wins", sol.win, "tick=" + sol.tick + " gate=" + sol.gate + " latched=" + sol.latched);
  check("...gate latched", sol.latched === true);
}

/* ---------------- demo-02 ---------------- */
console.log("demo-02 March the Oaf");
{
  const SIM = loadDemo("demo-02");
  const flawed = SIM.run([{ op: "WALK", k: 10 }], 200);
  check("flawed default (WALK 10) does not win", !flawed.win, "golem=" + flawed.golem + " gate=" + flawed.gate);
  const sol = SIM.run([
    { op: "WALK", k: 2 }, { op: "PUSH" }, { op: "WALK", k: 2 }, { op: "WALK", k: 1 }, { op: "SMASH" }, { op: "WALK", k: 6 }
  ], 200);
  check("solution (WALK2,PUSH,WALK2,WALK1,SMASH,WALK6) wins", sol.win, "golem=" + sol.golem + " gate=" + sol.gate);
  check("...pit bridged & plate latched", sol.pitFilled === true && sol.plate === true);
}

/* ---------------- demo-03 ---------------- */
console.log("demo-03 Echo Canyon");
{
  const SIM = loadDemo("demo-03");
  const badTape = [{x:3,y:7},{x:2,y:7},{x:2,y:7},{x:2,y:7},{x:2,y:7},{x:2,y:7},{x:2,y:7},{x:2,y:7},{x:2,y:7},{x:2,y:7}];
  const dash = { moves: [[0,"R"],[1,"R"],[2,"R"],[3,"R"],[4,"R"],[7,"R"]] };
  const flawed = SIM.run(badTape, dash, 20);
  check("flawed old song does not win", !flawed.win, "px=" + flawed.px + " fell=" + flawed.fell);
  const goodTape = [{x:6,y:7},{x:6,y:7},{x:6,y:7},{x:6,y:7},{x:6,y:6},{x:5,y:6},{x:4,y:6},{x:4,y:5},{x:4,y:5},{x:4,y:5}];
  const sol = SIM.run(goodTape, dash, 20);
  check("solution song (hold B1 → run to B2) + timed dash wins", sol.win, "px=" + sol.px + " fell=" + sol.fell + " tick=" + sol.tick);
}

/* ---------------- demo-04 ---------------- */
console.log("demo-04 The Whispering Grotto");
{
  const SIM = loadDemo("demo-04");
  const flawedCfg = {
    stones: [[6,6]], bells: [[3,4]], pipes: [[10,6]],
    rules: [{ sensor: "S1", actuator: "PIPE1" }], seed: 7,
    plan: { moves: [] }, maxT: 400
  };
  const flawed = SIM.run(flawedCfg);
  check("flawed default rig (pipe repels) does not win (seed 7)", !flawed.win, "gate=" + flawed.gate + " pool=" + flawed.poolCount);

  // find the seed where the intended rig latches EARLIEST (so the walk plan fits)
  let seedOK = null, latchTick = 1e9;
  for (let seed = 1; seed <= 80; seed++) {
    const solCfg = {
      stones: [[10,6]], bells: [[15,6]], pipes: [],
      rules: [{ sensor: "S1", actuator: "BELL1" }, { sensor: "SPOOL", actuator: "BELL1" }],
      seed: seed, plan: { moves: [] }, maxT: 400
    };
    const r = SIM.run(solCfg);
    if (r.gate) {
      const ev = r.events.find(e=>e.m.indexOf("settle in the basin") >= 0);
      const lt = ev ? ev.t : r.tick;
      if (lt < latchTick) { seedOK = seed; latchTick = lt; }
    }
  }
  check("intended rig latches for some seed", seedOK !== null, seedOK ? "seed=" + seedOK + " latch@" + latchTick : "no seed in 1..80");
  if (seedOK) {
    // explorer path: (2,8) → up 4 → right 14 → (16,4)
    const moves = [];
    for (let i = 0; i < 4; i++) moves.push([latchTick + 3 + i, "U"]);
    for (let i = 0; i < 14; i++) moves.push([latchTick + 7 + i, "R"]);
    const solCfg = {
      stones: [[10,6]], bells: [[15,6]], pipes: [],
      rules: [{ sensor: "S1", actuator: "BELL1" }, { sensor: "SPOOL", actuator: "BELL1" }],
      seed: seedOK, plan: { moves: moves }, maxT: 400
    };
    const sol = SIM.run(solCfg);
    check("solution rig + walk to gate wins", sol.win, "tick=" + sol.tick + " pool=" + sol.poolCount);
  }
}

/* ---------------- demo-05 ---------------- */
console.log("demo-05 The Dam That Breathes");
{
  const SIM = loadDemo("demo-05");
  const flawed = SIM.run([{ lt: 50, open: 30 }], { moves: [] }, 200);
  check("flawed default (stingy 30%) fails — dam bursts", flawed.bursted === true && !flawed.win, "bursted=" + flawed.bursted + " level=" + flawed.level.toFixed(1));
  // probe: find a 10-tick window where the ford (level<50) is open, after the gate latches
  const probe = SIM.run([{ lt: 55, open: 100 }], { moves: [] }, 120);
  let winStart = -1;
  for (let i = 0; i < probe.trace.length - 10; i++) {
    let ok = true;
    for (let j = 0; j < 10; j++) if (probe.trace[i + j].level >= SIM.FORD_MAX) { ok = false; break; }
    if (ok) { winStart = probe.trace[i].t; break; }
  }
  check("a ford window exists in the trace", winStart >= 0, "trace ticks=" + probe.trace.length);
  const moves = [];
  for (let i = 0; i < 5; i++) moves.push([winStart + i, "R"]);      // cross the ford
  for (let i = 0; i < 5; i++) moves.push([winStart + 5 + i, "R"]);   // onto the right bank
  for (let i = 0; i < 5; i++) moves.push([winStart + 10 + i, "R"]);  // to the gate
  const sol = SIM.run([{ lt: 55, open: 100 }], { moves: moves }, 120);
  check("solution (open wide, breathe at ~50, cross at low tide) wins", sol.win, "tick=" + sol.tick + " level=" + sol.level.toFixed(1) + " gate=" + sol.gate + " burst=" + sol.bursted);
  check("...never burst", !sol.bursted);
}

/* ---------------- demo-06 ---------------- */
console.log("demo-06 Mimic Moss");
{
  const SIM = loadDemo("demo-06");
  const flawedPlants = [[2,2,1],[3,2,1],[4,2,1],[5,2,1]];
  const flawed = SIM.run({ plants: flawedPlants, seed: 7, plan: { moves: [] }, maxT: 60 });
  check("flawed initial stub (gap at 6,2) does not win", !flawed.win, "first=" + flawed.firstColor + " second=" + flawed.secondColor);

  const RED = [[2,2,1],[3,2,1],[4,2,1],[5,2,1],[6,2,1],[6,3,1],[7,3,1],[8,4,1],[9,4,1],[10,4,1],[11,4,1],[12,4,1],[13,4,1]];
  const BLUE = [[2,3,2],[2,4,1],[3,4,1],[4,4,1],[5,4,1],[5,5,1],[5,6,1],[6,6,1],[7,6,1],[8,6,1],[9,6,1],[10,6,1],[11,6,1],[12,6,1],[13,6,1]];
  const plants = RED.concat(BLUE);
  const moves = [];
  for (let i = 19; i <= 29; i++) moves.push([i, "R"]);
  for (let i = 30; i <= 32; i++) moves.push([i, "U"]);
  let seedOK = null, sol = null;
  for (let seed = 1; seed <= 20 && !seedOK; seed++) {
    sol = SIM.run({ plants: plants, seed: seed, plan: { moves: moves }, maxT: 80 });
    if (sol.win) seedOK = seed;
  }
  check("solution wiring (red short, blue long via dye) + walk-in wins", seedOK !== null, seedOK ? "seed=" + seedOK + " tick=" + sol.tick : "no seed in 1..20");
  if (seedOK) check("...order is red then blue", sol.firstColor === "R" && sol.secondColor === "B");
}

console.log("\n==== " + pass + " passed, " + fail + " failed ====");

/* ---- phase 2: UI boot smoke test (DOM stub) ---- */
console.log("\nUI boot smoke test (full script executes boot() without throwing)");
function makeEl(){
  const t={children:[],style:{},classList:{add(){},remove(){},toggle(){}},dataset:{}};
  return new Proxy(t,{
    get(o,p){
      if(p==='addEventListener') return ()=>{};
      if(p==='appendChild'||p==='append') return ()=>{};
      if(p==='setAttribute') return ()=>{};
      if(p==='removeChild') return ()=>{};
      if(p==='querySelectorAll') return ()=>[];
      if(p==='getBoundingClientRect') return ()=>({left:0,top:0,width:640,height:480});
      if(p==='innerHTML') return "";
      if(p==='firstChild') return undefined;
      if(p in o) return o[p];
      return ()=>{};
    },
    set(o,p,v){ o[p]=v; return true; }
  });
}
for (const dir of ["demo-01","demo-02","demo-03","demo-04","demo-05","demo-06"]) {
  const html = fs.readFileSync(path.join(ROOT, dir, "index.html"), "utf8");
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  const documentStub = { getElementById:()=>makeEl(), createElementNS:()=>makeEl(), createElement:()=>makeEl(), querySelectorAll:()=>[] };
  const sandbox = { module:{exports:{}}, exports:{}, console, window:{addEventListener(){}}, document:documentStub, setInterval(){return 1;}, clearInterval(){} };
  vm.createContext(sandbox);
  try { vm.runInContext(m[1], sandbox, {filename:dir+"/index.html"}); check(dir+" boot() OK", true); }
  catch(e){ check(dir+" boot() OK", false, e.message); }
}

console.log("\n==== TOTAL: " + pass + " passed, " + fail + " failed ====");
process.exit(fail ? 1 : 0);
