/* LEONIDA LEDGER — GTA VI Trophy Guide & Tracker. Own code, written fresh. */
'use strict';
var STORE_KEY = 'leonida-ledger.progress.v1';
var SOURCES = [
  { n: 1, name: 'PowerPyx', title: 'GTA 6 Trophy Guide & Roadmap', url: 'powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/' },
  { n: 2, name: 'OutputLag', title: 'GTA 6 Trophy List: All 55 Trophies and Achievements (Steven Mills)', url: 'outputlag.com' },
  { n: 3, name: 'KeenGamer', title: 'GTA 6 Trophy Guide & Platinum Roadmap', url: 'keengamer.com' },
  { n: 4, name: 'eGamers', title: 'GTA 6 Trophy List: All 55 Trophies and Achievements, Plus the Hardest Ones', url: 'egamers.io' },
  { n: 5, name: 'Official list', title: 'PS5 trophy list as shipped in this contest\u2019s kit (mirrors Exophase and PSNProfiles)', url: 'exophase.com/game/grand-theft-auto-vi-psn/trophies/' },
  { n: 6, name: 'GTA-Zone', title: 'GTA 6 Trophies & Achievements (updated 18 Nov 2026)', url: 'gta-zone.com' },
  { n: 7, name: 'GTA Vibes', title: 'GTA 6 Trophy List & Achievements', url: 'gtavibes.com' },
  { n: 8, name: 'GTABase', title: 'GTA 6 trophy list + 100% thresholds', url: 'gtabase.com' },
  { n: 9, name: 'Push Square', title: 'GTA 6 trophy guide (no missable known; 250+ h total)', url: 'pushsquare.com' }
];
var STAGES = [
  { n: 1, name: 'Story spine', hours: '60\u201380 h', ids: [2,3,4,5,6,7,8,9,10,11,12,13], note: 'Play the story in order. The 12 story trophies pop automatically: four chapter completions, the final mission and seven named missions. No mission gold medals, no difficulty, nothing missable here. [1][5]' },
  { n: 2, name: 'Windows the story opens', hours: 'in-story', ids: [16,20,21,22,23,24,25,26,27,28,29,31,33,34,35,42], note: 'The side chains and activities the story introduces. All of them stay available after the story — the window is only about starting them when they appear, not finishing them. [1][2]' },
  { n: 3, name: '100% checklist grind', hours: '~100 h', ids: [14,15,17,18,19,30,32,40,41,43,47,48,52,54,55], note: 'After the credits, open Progress, then Stats, then 100% Completion. The checklist lines that need everything, and the ones that need only a part. [1][3][8]' },
  { n: 4, name: 'One-offs and riddles', hours: '10\u201320 h', ids: [36,37,38,39,44,45,46,49,50,51,53], note: 'Single feats and riddles, plus the two unconfirmed triggers shown as unconfirmed. Do them last, when you are strong and rich. [1][2]' },
  { n: 5, name: 'Platinum pops on its own', hours: '\u2014', ids: [1], note: 'Vice Got a Price! is awarded for holding the other 54. If it has not popped, filter the tracker to Unearned and clear the shortest stage first. [1][3]' }
];
var RULES = [
  { t: 'One playthrough is enough.', d: 'All 55 are offline, there is no difficulty setting, and free roam stays open after the credits. [1][5]' },
  { t: 'No mission replay — keep manual saves.', d: 'Keep a manual save at the start AND end of each chapter (10 saves of the 15 slots); rotate the other 5 for free-roam cleanup. [1]' },
  { t: 'Cheats off.', d: 'They disable trophies AND saving (61 cheats, none work before the credits anyway). [1]' },
  { t: 'Medals, relationship and Criminal Profile do not gate any trophy.', d: 'But the Irredeemable profile is permanent (cops shoot on sight more), so avoid excessive violence. [1][6]' }
];
var LEDGER100 = [
  { key: 'vehicles', label: 'Vehicles scanned (WAiNK)', target: 200, of: 277, part: 'part — 200 of 277', src: '[1]' },
  { key: 'animals', label: 'Animals studied (binoculars)', target: 100, of: 255, part: 'part — 100 of 255', src: '[1]' },
  { key: 'stunts', label: 'Stunts completed', target: 300, of: 397, part: 'part — 300 of 397 (trophy needs 250)', src: '[1]' },
  { key: 'challenges', label: 'Challenges completed', target: 70, of: 80, part: 'part — 70 of 80 (trophy needs 50)', src: '[1]' },
  { key: 'decks', label: 'Target Decks (Bret)', target: 15, of: 15, part: 'all 15', src: '[1]' },
  { key: 'bankjobs', label: 'Large Bank Jobs', target: 8, of: 8, part: 'all 8 (trophy needs 5)', src: '[1]' },
  { key: 'gangops', label: 'Illegal Gang Operations', target: 39, of: 39, part: 'all 39', src: '[1]' },
  { key: 'missions', label: 'Optional missions', target: 100, of: null, part: 'part — 100 (200\u2013300+ exist)', src: '[1]' },
  { key: 'meditations', label: 'Meditations', target: 15, of: 18, part: 'part — 15 of 18 (trophy needs 18)', src: '[1]' },
  { key: 'cardsets', label: 'Collectible Card sets', target: 3, of: 18, part: 'part — 3 of 18 sets', src: '[1]' },
  { key: 'waink', label: 'WAiNK scans', target: 100, of: null, part: 'part — 100 (more exist)', src: '[1]' },
  { key: 'races', label: 'Races won', target: 20, of: 40, part: 'part — 20 of 40', src: '[1]' },
  { key: 'drones', label: 'Top Fun Drone Race locations', target: 14, of: 14, part: 'all 14', src: '[1]' },
  { key: 'golds', label: 'Shooting Range gold medals', target: 42, of: 42, part: 'all 42', src: '[1]' },
  { key: 'garages', label: 'Garages purchased', target: 8, of: 8, part: 'all 8 purchasable', src: '[1]' },
  { key: 'laundered', label: 'Money laundered', target: 250000, of: null, part: 'cumulative $250,000', src: '[1]', money: true },
  { key: 'spent', label: 'Money spent', target: 100000, of: null, part: 'cumulative $100,000', src: '[1]', money: true }
];
var SAVES = [
  'Save 1: start of Chapter 1', 'Save 2: end of Chapter 1', 'Save 3: start of Chapter 2',
  'Save 4: end of Chapter 2', 'Save 5: start of Chapter 3', 'Save 6: end of Chapter 3',
  'Save 7: start of Chapter 4', 'Save 8: end of Chapter 4', 'Save 9: start of Chapter 5',
  'Save 10: before the final mission', 'Saves 11\u201315: free-roam cleanup (rotate)'
];
var DISAGREE = [
  { t: '#28 meditations — 18 vs 15', a: 'Guides say 18 spots for the trophy.', b: 'The 100% list stops at 15.', s: 'DIFFER' },
  { t: '#25 Strangers & Freaks — which 8 strands count', a: 'PowerPyx lists Kirk, Kyle, Yago and Pilot Pete as confirmed and says more are undiscovered.', b: 'OutputLag names the exclusions; no guide lists all eight qualifiers.', s: 'DIFFER' },
  { t: '#49 Bad Luck, I Guess — trigger unknown', a: 'Believed to be related to the Payday Loans store from the Prologue.', b: 'Belief only — no source confirms it.', s: 'UNCONFIRMED' },
  { t: '#51 Ten Pin — trigger unknown', a: 'Believed to be kicking enemies while driving a motorcycle.', b: 'Belief only — no source confirms it.', s: 'UNCONFIRMED' },
  { t: '#45 Capital Offense — method vs unconfirmed', a: 'PowerPyx gives a full method (blue Banshee, south Vice City showroom, Key Cloner).', b: 'Other lists mark the trigger unconfirmed.', s: 'DIFFER' },
  { t: '#29 Fair Game — which animal', a: 'Bret\u2019s questline is Jason-only; hunt the animals he requests.', b: 'Which animal exactly unlocks it is unconfirmed.', s: 'UNCONFIRMED' },
  { t: '#6 / #7 — final mission chapter', a: 'One guide\u2019s text repeats Chapter 4 (Starting From Zero) for the final mission.', b: 'The final mission\u2019s chapter is not cleanly pinned down; this guide gives no chapter number.', s: 'DIFFER' },
  { t: '#42 The Goodtime State — 52 areas vs unfog', a: 'The kit\u2019s starter list says all 52 areas of Leonida.', b: 'PowerPyx says fully unfog the whole map.', s: 'DIFFER' },
  { t: 'Missable count', a: 'PowerPyx flags 1 possibly missable (#28).', b: 'Push Square says no missable known; TechWiser (single source) warns 5 stranger chains have story windows.', s: 'DIFFER' },
  { t: 'Platinum time', a: 'PowerPyx: about 200 hours.', b: 'Push Square: above 250 hours.', s: 'DIFFER' }
];
var FILTERS = [
  { id: 'all', label: 'All 55', test: function (t) { return true; } },
  { id: 'story', label: 'Story 12', test: function (t) { return t.type === 'story'; } },
  { id: 'missable', label: 'Missable 2', test: function (t) { return !!t.missable; } },
  { id: 'collectibles', label: 'Collectibles 8', test: function (t) { return t.type === 'collectibles'; } },
  { id: 'activities', label: 'Activities 10', test: function (t) { return t.type === 'activities'; } },
  { id: 'side', label: 'Side chains 7', test: function (t) { return t.type === 'side'; } },
  { id: 'crime', label: 'Crime 9', test: function (t) { return t.type === 'crime' || t.id === 34 || t.id === 43; } },
  { id: 'riddles', label: 'Riddles 6', test: function (t) { return t.type === 'riddles' || t.id === 36; } },
  { id: 'money', label: 'Money 4', test: function (t) { return t.type === 'money' || t.id === 52; } },
  { id: 'online', label: 'Online 0', test: function (t) { return false; } },
  { id: 'unearned', label: 'Unearned only', test: function (t) { return !state.earned[t.id]; } }
];
var COUNTER_KEY = { 15: 'stunts', 17: 'golds', 18: 'drones', 19: 'races', 28: 'meditations', 30: 'cardsets', 31: 'waink', 32: 'challenges', 35: 'vehicles', 40: 'bankjobs', 43: 'gangs', 48: 'profile', 52: 'laundered', 53: 'spent', 54: 'garages', 55: 'registered' };
var SEED_EARNED = [2, 3, 8, 9, 16, 20, 21, 22, 23, 32, 33, 34, 35, 37, 41, 44, 53];
var SEED_COUNTERS = { vehicles: 118, animals: 34, stunts: 61, challenges: 52, decks: 6, bankjobs: 2, gangs: 4, gangops: 11, missions: 28, meditations: 9, cardsets: 1, waink: 44, races: 7, drones: 3, golds: 9, garages: 2, laundered: 48500, spent: 112000, profile: 180, registered: 3 };
var state = null;
var TROPHIES = [];
var BY_ID = {};
var currentView = 'ledger';
var currentFilter = 'all';
var selectedId = 28;
function seedState() {
  var earned = {};
  SEED_EARNED.forEach(function (id) { earned[id] = true; });
  return { earned: earned, counters: Object.assign({}, SEED_COUNTERS), revealed: {}, spoilers: true, seeded: true };
}
function loadState() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) { var s = JSON.parse(raw); if (s && s.earned) return s; }
  } catch (e) { /* fresh state */ }
  return seedState();
}
function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full or blocked */ }
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function money(n) { return '$' + fmt(n); }
function gradeLetter(g) { return { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' }[g] || '?'; }
function citeTags(nums) { return nums.map(function (n) { return '[' + n + ']'; }).join(''); }
function stepsOf(t) { return t.guide.split('\n').map(function (s) { return s.trim(); }).filter(Boolean); }
function stepCites(step) { var m = step.match(/\[(\d+)\]/g) || []; return m.map(function (x) { return parseInt(x.slice(1, -1), 10); }); }
function nonListCites(t) { var s = {}; stepsOf(t).forEach(function (st) { stepCites(st).forEach(function (n) { if (n !== 5) s[n] = true; }); }); return Object.keys(s).map(Number); }
function isSingleSource(t) { return t.sources.length <= 1; }
function isDiffer(t) { return [6, 7, 25, 28, 42].indexOf(t.id) >= 0; }
function isHiddenStory(t) { return t.type === 'story' && state.spoilers && !state.earned[t.id] && !state.revealed[t.id]; }
function counterVal(key) { return state.counters[key] || 0; }
function toast(msg) { var el = document.getElementById('toast'); el.textContent = msg; el.hidden = false; setTimeout(function () { el.hidden = true; }, 2600); }
function applyParams() {
  var q = new URLSearchParams(location.search);
  var v = q.get('view');
  if (v && ['ledger', 'roadmap', 'matrix', 'ledger100'].indexOf(v) >= 0) currentView = v;
  var o = parseInt(q.get('open') || '', 10);
  if (o >= 1 && o <= 55) selectedId = o;
  var sp = q.get('spoilers');
  if (sp === 'show') state.spoilers = false;
  if (sp === 'hide') state.spoilers = true;
}
fetch('data/trophies.json').then(function (r) { return r.json(); }).then(function (d) {
  TROPHIES = d.trophies || d;
  TROPHIES.forEach(function (t) { BY_ID[t.id] = t; });
  state = loadState();
  applyParams();
  bindChrome();
  renderAll();
}).catch(function (err) {
  document.getElementById('audit').textContent = 'Could not load data/trophies.json — open this app from a local static file server. ' + err;
});

function bindChrome() {
  document.querySelectorAll('#tabs .tab').forEach(function (btn) {
    btn.addEventListener('click', function () { setView(btn.getAttribute('data-view')); });
  });
  document.getElementById('spoilerBtn').addEventListener('click', function () {
    state.spoilers = !state.spoilers; saveState(); renderAll();
    toast(state.spoilers ? 'Spoilers hidden until earned' : 'Spoilers shown');
  });
  document.getElementById('exportBtn').addEventListener('click', doExport);
  document.getElementById('importBtn').addEventListener('click', function () {
    document.getElementById('importModal').hidden = false;
    document.getElementById('importMsg').textContent = '';
  });
  document.getElementById('importCloseBtn').addEventListener('click', function () {
    document.getElementById('importModal').hidden = true;
  });
  document.getElementById('importDoBtn').addEventListener('click', doImportText);
  document.getElementById('importFileBtn').addEventListener('click', function () {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', function (ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () { document.getElementById('importText').value = String(rd.result || ''); doImportText(); };
    rd.readAsText(f);
  });
}
function setView(v) {
  currentView = v;
  document.querySelectorAll('#tabs .tab').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-view') === v); });
  document.querySelectorAll('main .view').forEach(function (s) { s.classList.toggle('active', s.id === 'view-' + v); });
  renderView(v);
}
function renderAll() {
  renderHeader(); renderAudit();
  document.querySelectorAll('#tabs .tab').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-view') === currentView); });
  document.querySelectorAll('main .view').forEach(function (s) { s.classList.toggle('active', s.id === 'view-' + currentView); });
  renderView(currentView);
}
function renderView(v) {
  if (v === 'ledger') renderLedger();
  else if (v === 'roadmap') renderRoadmap();
  else if (v === 'matrix') renderMatrix();
  else if (v === 'ledger100') renderLedger100();
}
function earnedCount() { return TROPHIES.filter(function (t) { return state.earned[t.id]; }).length; }
function gradeCount(g) {
  var tot = TROPHIES.filter(function (t) { return t.grade === g; }).length;
  var got = TROPHIES.filter(function (t) { return t.grade === g && state.earned[t.id]; }).length;
  return got + '/' + tot;
}
function renderHeader() {
  var n = earnedCount();
  var pct = Math.round(n / TROPHIES.length * 100);
  document.getElementById('progressNum').textContent = n + '/55 earned (' + pct + '%)';
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('gradeCounts').textContent = 'P ' + gradeCount('platinum') + ' \u00b7 G ' + gradeCount('gold') + ' \u00b7 S ' + gradeCount('silver') + ' \u00b7 B ' + gradeCount('bronze');
  document.getElementById('spoilerBtn').textContent = state.spoilers ? 'Spoilers: hidden until earned' : 'Spoilers: shown';
}
function auditStats() {
  var totalSteps = 0, citedSteps = 0;
  TROPHIES.forEach(function (t) {
    stepsOf(t).forEach(function (s) { totalSteps++; if (/\[\d+\]/.test(s)) citedSteps++; });
  });
  var citedGuides = TROPHIES.filter(function (t) { return stepsOf(t).some(function (s) { return /\[\d+\]/.test(s); }); }).length;
  var single = TROPHIES.filter(isSingleSource).length;
  var differ = TROPHIES.filter(isDiffer).length;
  return { totalSteps: totalSteps, citedSteps: citedSteps, citedGuides: citedGuides, single: single, differ: differ };
}
function renderAudit() {
  var a = auditStats();
  document.getElementById('audit').textContent =
    '55 official \u00b7 1P 2G 6S 46B \u00b7 28 hidden \u00b7 ' + a.citedGuides + '/55 guides cite a source \u00b7 ' +
    a.citedSteps + '/' + a.totalSteps + ' steps cited \u00b7 9 sources read 20 Nov 2026 \u00b7 2 possibly missable \u00b7 7 watch \u00b7 5 unconfirmed \u00b7 ' +
    a.single + ' single-source \u00b7 ' + a.differ + ' disagree';
}
function renderLedger() {
  var f = FILTERS.find(function (x) { return x.id === currentFilter; }) || FILTERS[0];
  var chips = document.getElementById('filters');
  chips.innerHTML = FILTERS.map(function (x) {
    var n = TROPHIES.filter(x.test).length;
    return '<button class="chip' + (x.id === currentFilter ? ' active' : '') + '" data-filter="' + x.id + '">' + esc(x.label) + (x.id === 'unearned' ? ' ' + n : '') + '</button>';
  }).join('') + '<button class="chip" data-filter="grade">by grade</button>';
  chips.querySelectorAll('[data-filter]').forEach(function (b) {
    b.addEventListener('click', function () { currentFilter = b.getAttribute('data-filter'); renderLedger(); });
  });
  var shown = TROPHIES.filter(f.test);
  if (currentFilter === 'grade') {
    var order = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
    shown = shown.slice().sort(function (a, b) { return order[a.grade] - order[b.grade] || a.id - b.id; });
  }
  var nu = document.getElementById('nextup');
  var next = TROPHIES.filter(function (t) { return !state.earned[t.id]; })
    .sort(function (a, b) { return a.stage - b.stage || a.id - b.id; }).slice(0, 12);
  nu.innerHTML = next.map(function (t) {
    return '<li>' + esc(t.name) + ' <span class="tag">stage ' + t.stage + ' &middot; ' + citeTags(t.sources) + '</span>' +
      (t.missable ? ' <span class="flag miss">MISSABLE?</span>' : '') + '</li>';
  }).join('');
  var cl = document.getElementById('checklist');
  cl.innerHTML = '<div class="fine">' + shown.length + ' shown</div>' + shown.map(function (t) { return rowHtml(t); }).join('');
  cl.querySelectorAll('.trow').forEach(function (row) {
    row.addEventListener('click', function (ev) {
      var id = parseInt(row.getAttribute('data-id'), 10);
      if (ev.target && ev.target.type === 'checkbox') return;
      if (ev.target && ev.target.classList && ev.target.classList.contains('reveal')) return;
      selectedId = id; renderLedger();
    });
  });
  cl.querySelectorAll('.trow input[type=checkbox]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var id = parseInt(cb.getAttribute('data-id'), 10);
      if (cb.checked) state.earned[id] = true; else delete state.earned[id];
      saveState(); renderAll();
    });
  });
  cl.querySelectorAll('.reveal').forEach(function (b) {
    b.addEventListener('click', function (ev) {
      ev.stopPropagation();
      var id = parseInt(b.getAttribute('data-id'), 10);
      state.revealed[id] = true; saveState(); renderAll();
    });
  });
  renderDetail(BY_ID[selectedId] || TROPHIES[27]);
  renderSources();
}
function rowHtml(t) {
  var earned = !!state.earned[t.id];
  if (isHiddenStory(t)) {
    return '<div class="trow" data-id="' + t.id + '"><input type="checkbox" disabled> <div><div class="tname">Hidden trophy</div>' +
      '<div class="tdesc">Hidden until earned &middot; stage ' + t.stage + ' &middot; story</div>' +
      '<div class="tsrc"><button class="btn reveal" data-id="' + t.id + '" type="button">Reveal</button> <span class="flag hid">HIDDEN ON PSN</span></div></div></div>';
  }
  var flags = '';
  if (t.missable) flags += '<span class="flag miss">MISSABLE?</span>';
  if (t.watch) flags += '<span class="flag watch">WATCH</span>';
  if (t.unconfirmed) flags += '<span class="flag unc">UNCONFIRMED</span>';
  if (t.hidden) flags += '<span class="flag hid">HIDDEN ON PSN</span>';
  return '<div class="trow' + (earned ? ' earned' : '') + (t.id === selectedId ? ' sel' : '') + '" data-id="' + t.id + '">' +
    '<input type="checkbox" data-id="' + t.id + '"' + (earned ? ' checked' : '') + '> ' +
    '<span class="badge ' + gradeLetter(t.grade) + '">' + gradeLetter(t.grade) + '</span> ' +
    '<div><div class="tname">' + esc(t.name) + flags + '</div>' +
    '<div class="tdesc">' + esc(t.description) + '</div>' +
    '<div class="tsrc">' + citeTags(t.sources) + ' &middot; stage ' + t.stage + ' &middot; ' + esc(t.type) + '</div></div></div>';
}
function renderDetail(t) {
  var el = document.getElementById('detail');
  var earned = !!state.earned[t.id];
  var ck = COUNTER_KEY[t.id];
  var counterHtml = '';
  if (t.counter && ck) {
    var v = counterVal(ck);
    var unit = t.counter.unit || '';
    counterHtml = '<div class="counterbox"><span>YOUR COUNT</span><button class="cbtn" data-ck="' + ck + '" data-d="-1" type="button">\u2212</button>' +
      '<span class="cval">' + (unit ? money(v) : fmt(v)) + ' / ' + (unit ? money(t.counter.target) : fmt(t.counter.target)) + ' ' + esc(t.counter.label) + '</span>' +
      '<button class="cbtn" data-ck="' + ck + '" data-d="1" type="button">+</button></div>';
  }
  var miss = '';
  if (t.id === 28) {
    miss = '<div class="callout"><b>MISSABLE? POSSIBLY MISSABLE</b> — sources disagree, both versions shown. The Chapter 1 balcony meditation may vanish when Chapter 1 ends — do it in Chapter 1 and keep a manual save from the start of Chapter 1. [1][2]</div>';
  } else if (t.missable) {
    miss = '<div class="callout"><b>MISSABLE? POSSIBLY MISSABLE</b> — flagged, not confirmed. Sources disagree on which strands count; start every stranger chain when it appears. [1][6]</div>';
  } else if (t.unconfirmed) {
    miss = '<div class="callout amber"><b>UNCONFIRMED</b> — the trigger is not pinned down by the sources; the guide states the belief as a belief, never as a fact. [1]</div>';
  }
  var disagree = '';
  if (t.id === 28) {
    disagree = '<div class="callout amber"><b>SOURCES DISAGREE</b> — guides say 18 for the trophy; the 100% list stops at 15. Both shown; the counter tracks 18. [1][3][6]</div>';
  } else if (t.id === 42) {
    disagree = '<div class="callout amber"><b>SOURCES DISAGREE</b> — the kit\u2019s starter list says all 52 areas of Leonida; PowerPyx says fully unfog the whole map. Both shown. [1][8]</div>';
  } else if (t.id === 25) {
    disagree = '<div class="callout amber"><b>SOURCES DISAGREE</b> — which 8 strands count is disputed; no guide lists all eight qualifiers. [1][6]</div>';
  }
  var steps = stepsOf(t).map(function (s) {
    return '<li>' + esc(s.replace(/\[(\d+)\]/g, '')) + ' <span class="cite">' + (s.match(/\[(\d+)\]/g) || []).join('') + '</span></li>';
  }).join('');
  el.innerHTML = '<h2>' + esc(t.name) + '</h2>' +
    '<div class="meta">Trophy ' + t.id + ' of 55 &middot; ' + t.grade + ' &middot; stage ' + t.stage + ' &middot; ' + esc(t.type) +
    (t.missable ? ' &middot; possibly missable' : '') + (t.watch ? ' &middot; watch' : '') + (t.unconfirmed ? ' &middot; unconfirmed' : '') + '</div>' +
    '<label><input type="checkbox" id="detailEarned"' + (earned ? ' checked' : '') + '> Mark earned</label>' +
    '<div class="offdesc">OFFICIAL DESCRIPTION — ' + esc(t.description) + ' [5]</div>' +
    miss + disagree + counterHtml +
    '<h3>How to get it — in our own words</h3><ol class="steps">' + steps + '</ol>' +
    '<p class="fine">Sources: ' + citeTags(t.sources) + ' — read 20 Nov 2026 &middot; trophy ' + t.id + ' of 55 &middot; unofficial fan guide &middot; not affiliated with Rockstar Games or Sony.</p>';
  var cb = document.getElementById('detailEarned');
  if (cb) cb.addEventListener('change', function () {
    if (cb.checked) state.earned[t.id] = true; else delete state.earned[t.id];
    saveState(); renderAll();
  });
  el.querySelectorAll('.cbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-ck'), d = parseInt(b.getAttribute('data-d'), 10);
      state.counters[k] = Math.max(0, counterVal(k) + d); saveState(); renderAll();
    });
  });
}
function renderSources() {
  var counts = {};
  TROPHIES.forEach(function (t) { t.sources.forEach(function (n) { counts[n] = (counts[n] || 0) + 1; }); });
  document.getElementById('sources').innerHTML = SOURCES.map(function (s) {
    return '<li><span class="sname">[' + s.n + '] ' + esc(s.name) + '</span> — ' + esc(s.title) +
      '<br><span class="surl">' + esc(s.url) + '</span><br><span class="scount">cited by ' + (counts[s.n] || 0) + ' of 55 guides</span></li>';
  }).join('');
}

function renderRoadmap() {
  var el = document.getElementById('roadmap');
  var stageHtml = STAGES.map(function (st) {
    var chips = st.ids.map(function (id) {
      var t = BY_ID[id];
      var e = state.earned[id] ? ' earned' : '';
      return '<span class="stchip' + e + '">' + gradeLetter(t.grade) + ' ' + esc(t.name) + '</span>';
    }).join('');
    return '<div class="stage"><h2>Stage ' + st.n + ' — ' + esc(st.name) + ' (' + st.hours + ', ' + st.ids.length + ' trophies)</h2>' +
      '<div class="stmeta">FROM THE DESCRIPTIONS — ' + esc(st.note) + '</div><div class="chips-row">' + chips + '</div></div>';
  }).join('');
  var watch = TROPHIES.filter(function (t) { return t.missable || t.watch; });
  var watchHtml = watch.map(function (t) {
    var why = t.id === 28 ? 'Chapter 1 balcony meditation may vanish; do it in Chapter 1, keep a Chapter 1 save.' :
      t.id === 25 ? 'Which 8 strands count is disputed; start every stranger chain when it appears.' :
      t.id === 22 ? 'Lucia-only; starts in Chapter 3.' :
      t.id === 23 ? 'Kenton temporarily unavailable after Chapter 1; returns.' :
      t.id === 24 ? 'Starts after Coffee Break.' :
      t.id === 26 ? 'Starts in Chapter 3.' :
      t.id === 27 ? 'Jason-only; starts in Chapter 3.' :
      t.id === 29 ? 'Jason-only; which animal is unconfirmed.' :
      'Trigger not pinned down by every source.';
    return '<li><b>' + esc(t.name) + '</b> — ' + (t.missable ? 'POSSIBLY MISSABLE' : 'WATCH') + ': ' + esc(why) + ' ' + citeTags(t.sources) + '</li>';
  }).join('');
  el.innerHTML = '<div class="roadmap-cols"><div>' + stageHtml +
    '<div class="panel"><h2>Ground rules</h2><ol class="rules">' +
    RULES.map(function (r) { return '<li><b>' + esc(r.t) + '</b> ' + esc(r.d) + '</li>'; }).join('') + '</ol>' +
    '<h3>How this roadmap was built</h3><p class="fine">Stages group trophies by what their official description asks for; order and risk flags come from the cited pages, never from memory. [1][5]</p></div></div>' +
    '<div><div class="panel"><h2>Missable watch list</h2><p class="fine">9 flagged &middot; 46 safe after the credits</p><ol class="rules">' + watchHtml + '</ol></div>' +
    '<div class="panel"><h2>Safe after the credits</h2><p>Everything else is doable in free roam after the credits, with no mission replay needed, and all trophy-related quest givers return. [1]</p></div></div></div>';
}
function renderMatrix() {
  var el = document.getElementById('matrix');
  var a = auditStats();
  var n3 = TROPHIES.filter(function (t) { return t.sources.length >= 3; }).length;
  var n2 = TROPHIES.filter(function (t) { return t.sources.length === 2; }).length;
  var n1 = TROPHIES.filter(function (t) { return t.sources.length === 1; }).length;
  var perSrc = {};
  SOURCES.forEach(function (s) { perSrc[s.n] = 0; });
  TROPHIES.forEach(function (t) { t.sources.forEach(function (n) { perSrc[n] = (perSrc[n] || 0) + 1; }); });
  var head = '<tr><th>#</th><th>Trophy</th>' + SOURCES.map(function (s) { return '<th>[' + s.n + ']</th>'; }).join('') + '<th>Flag</th></tr>';
  var rows = TROPHIES.map(function (t) {
    var cells = SOURCES.map(function (s) {
      var c = stepsOf(t).filter(function (st) { return stepCites(st).indexOf(s.n) >= 0; }).length;
      if (c > 0) return '<td class="num">' + c + '</td>';
      if (t.sources.indexOf(s.n) >= 0) return '<td class="dot">&middot;</td>';
      return '<td></td>';
    }).join('');
    var flag = '';
    if (isDiffer(t)) flag = 'DIFFER';
    else if (isSingleSource(t)) flag = '1 SRC';
    else if (t.unconfirmed) flag = 'OPEN';
    return '<tr><td>' + t.id + '</td><td class="tname">' + esc(t.name) + '</td>' + cells + '<td class="flagcell">' + flag + '</td></tr>';
  }).join('');
  el.innerHTML = '<div class="panel"><h2>Trophy &times; source matrix</h2>' +
    '<p>Each row is a guide, each column a page we read on 20 Nov 2026. A number is how many of that guide&rsquo;s steps cite the page; a dot means the page is cited in the summary only; blank means not used. ' +
    n3 + ' guides on 3+ sources &middot; ' + n2 + ' on 2 sources &middot; ' + n1 + ' on 1 source &middot; ' +
    SOURCES.map(function (s) { return '[' + s.n + '] ' + esc(s.name) + ' ' + (perSrc[s.n] || 0); }).join(' &middot; ') + '</p>' +
    '<table class="matrix">' + head + rows + '</table></div>';
}
function renderLedger100() {
  var el = document.getElementById('ledger100');
  var lines = LEDGER100.map(function (L) {
    var v = counterVal(L.key);
    var disp = L.money ? money(v) + ' / ' + money(L.target) : fmt(v) + ' / ' + fmt(L.target) + (L.of ? ' of ' + fmt(L.of) : '');
    return '<div class="cline"><span class="clabel">' + esc(L.label) + ' <span class="cmeta">' + esc(L.part) + ' ' + L.src + '</span></span>' +
      '<button class="cbtn" data-ck="' + L.key + '" data-d="-1" type="button">\u2212</button>' +
      '<span class="cval">' + disp + '</span>' +
      '<button class="cbtn" data-ck="' + L.key + '" data-d="1" type="button">+</button></div>';
  }).join('');
  var saves = SAVES.map(function (s) { return '<span class="saveslot">' + esc(s) + '</span>'; }).join('');
  var dis = DISAGREE.map(function (d) {
    return '<div class="disagree"><b>' + esc(d.t) + '</b> <span class="status">' + d.s + '</span>' +
      '<div class="vs"><div>A: ' + esc(d.a) + '</div><div>B: ' + esc(d.b) + '</div></div></div>';
  }).join('');
  var earned = earnedCount();
  var revealed = Object.keys(state.revealed).length;
  var covered = TROPHIES.filter(function (t) { return isHiddenStory(t); }).length;
  var bytes = 0;
  try { bytes = (localStorage.getItem(STORE_KEY) || '').length; } catch (e) { bytes = 0; }
  el.innerHTML = '<div class="l100-grid">' +
    '<div class="panel full"><h2>A Long Road — 100% Completion</h2><p>Closer to 60% true completion &middot; checklist opens after the story &middot; nothing on it is missable. Each line states its source ([1] PowerPyx 100% guide) and whether it needs everything or only a part.</p>' + lines + '</div>' +
    '<div class="panel"><h2>Save-slot planner — 15 manual slots</h2><div class="savestrip">' + saves + '</div>' +
    '<p class="fine">No mission replay — these 10 saves are your only protection against the one possibly-missable trophy. [1]</p></div>' +
    '<div class="panel"><h2>Export / Import &amp; spoiler setting</h2>' +
    '<p><button class="btn" id="l100Export" type="button">Export</button> <button class="btn" id="l100Import" type="button">Import</button> ' +
    '<button class="btn" id="l100Spoiler" type="button">' + (state.spoilers ? 'Spoilers: hidden until earned' : 'Spoilers: shown') + '</button></p>' +
    '<p class="fine">Saved state: key ' + STORE_KEY + ' &middot; ' + fmt(bytes) + ' bytes in localStorage &middot; ' + earned + ' earned &middot; ' +
    Object.keys(state.counters).filter(function (k) { return state.counters[k] > 0; }).length + ' counters set &middot; ' +
    revealed + ' revealed by hand &middot; ' + covered + ' still covered.</p>' +
    '<p class="fine">Spoiler shield at work: the 12 story trophies stay covered until earned or revealed one by one (see the Ledger view — hidden rows carry a Reveal button each).</p></div>' +
    '<div class="panel full"><h2>Disagreement ledger — all 10, both versions shown</h2><p class="fine">Never silently resolved. Never invent a method for an unconfirmed trigger — label it UNCONFIRMED.</p>' + dis + '</div>' +
    '</div>';
  el.querySelectorAll('.cbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-ck'), d = parseInt(b.getAttribute('data-d'), 10);
      state.counters[k] = Math.max(0, counterVal(k) + d); saveState(); renderAll();
    });
  });
  var ex = document.getElementById('l100Export');
  if (ex) ex.addEventListener('click', doExport);
  var im = document.getElementById('l100Import');
  if (im) im.addEventListener('click', function () { document.getElementById('importModal').hidden = false; });
  var sp = document.getElementById('l100Spoiler');
  if (sp) sp.addEventListener('click', function () { state.spoilers = !state.spoilers; saveState(); renderAll(); });
}
function exportData() {
  return { app: 'leonida-ledger', version: 1, earned: state.earned, counters: state.counters, revealed: state.revealed, spoilers: state.spoilers };
}
function doExport() {
  var data = JSON.stringify(exportData(), null, 2);
  try {
    var blob = new Blob([data], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leonida-ledger-export.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  } catch (e) { /* download not available */ }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(data).catch(function () {});
  } catch (e) { /* clipboard not available */ }
  toast('Exported ' + earnedCount() + ' earned trophies and ' + Object.keys(state.counters).length + ' counters. Saved in this browser.');
}
function doImportText() {
  var msg = document.getElementById('importMsg');
  var raw = document.getElementById('importText').value;
  var data;
  try { data = JSON.parse(raw); } catch (e) { msg.textContent = 'Not valid JSON: ' + e.message; return; }
  if (!data || typeof data !== 'object' || !data.earned) { msg.textContent = 'That JSON is not a Leonida Ledger export (no earned map).'; return; }
  var n = Object.keys(data.earned).filter(function (k) { return data.earned[k]; }).length;
  var nc = data.counters ? Object.keys(data.counters).length : 0;
  state.earned = {};
  Object.keys(data.earned).forEach(function (k) { if (data.earned[k]) state.earned[parseInt(k, 10)] = true; });
  state.counters = data.counters || {};
  state.revealed = data.revealed || {};
  if (typeof data.spoilers === 'boolean') state.spoilers = data.spoilers;
  saveState(); renderAll();
  msg.textContent = 'Imported ' + n + ' earned trophies and ' + nc + ' counters. Saved in this browser.';
  toast('Imported ' + n + ' earned \u00b7 ' + nc + ' counters');
}
