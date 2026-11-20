// THE LEONIDA FILES — GTA VI Trophy Guide & Tracker (gta6-trophy-guide-01 v2).
// Offline static app: loads app/data/trophies.json, sources.json and
// disputes.json from its own folder, keeps progress in localStorage, and
// renders five views — Ledger, Roadmap, Missables, Source Matrix and the
// 100% Ledger. No network requests, no external files, no dates taken from
// the clock: every date shown is the fixed research date, 20 Nov 2026.

const STORAGE_KEY = "leonida-files.progress.v2";
const RESEARCH_DATE = "20 Nov 2026";

const SEED_EARNED = [2, 3, 8, 16, 19, 20, 21, 23, 30, 31, 33, 35, 36, 43, 44, 48, 53];
const SEED_COUNTERS = {
  vehicles: 112, animals: 47, stunts: 96, challenges: 41, decks: 6,
  bankjobs: 2, gangops: 11, missions: 34, meditations: 9, cardsets: 3,
  waink: 104, races: 20, drones: 5, golds: 18, garages: 3,
  laundered: 84000, spent: 104250, actions: 512, types: 9, registered: 4,
};

const STAGE_META = [
  { n: 1, name: "Stage 1 — Story spine", hours: "60–80 h", note: "The five chapters in order. The 12 story trophies pop automatically.", src: [1, 25] },
  { n: 2, name: "Stage 2 — Windows the story opens", hours: "in-story", note: "The side chains and activities the story introduces. Start them when they appear; all stay available after the story.", src: [1, 28] },
  { n: 3, name: "Stage 3 — 100% checklist grind", hours: "~100 h", note: "After the credits: open Progress > Stats > 100% Completion and clear the checklist lines.", src: [1, 10] },
  { n: 4, name: "Stage 4 — One-offs and riddles", hours: "10–20 h", note: "Single feats and riddles, plus the two unconfirmed triggers — shown as unconfirmed, never invented.", src: [1, 2] },
  { n: 5, name: "Stage 5 — Platinum pops on its own", hours: "—", note: "Vice Got a Price! is awarded for holding the other 54.", src: [1, 5] },
];

const GROUND_RULES = [
  { text: "One playthrough is enough — all 55 are offline, no difficulty setting, free roam stays open after the credits.", src: [1, 5] },
  { text: "No mission replay — keep a manual save at the start AND end of each chapter (10 saves of the 15 slots).", src: [1, 26] },
  { text: "Cheats off — they disable trophies AND saving (61 cheats, none work before the credits anyway).", src: [1, 23] },
  { text: "Medals, relationship status and the Criminal Profile do not gate any trophy — but the Irredeemable profile is permanent (cops shoot on sight more), so avoid excessive violence.", src: [1, 24] },
];

const MISSABLE_WINDOWS = {
  28: { window: "Chapter 1 — before Tourist Trap", move: "Accept the balcony meditation the morning after Down to Earth and keep a Chapter 1 save until the trophy pops." },
  25: { window: "Start every stranger chain when it appears", move: "Start every stranger chain when it appears; track the eight in the trophy list, not in any single guide." },
  22: { window: "Chapter 3, Lucia only", move: "Answer Andy's call in Chapter 3 and follow the quests." },
  23: { window: "Chapter 1; Kenton returns in Chapters 2–3", move: "Call Brian as Jason in Chapter 2 if Kenton goes quiet." },
  24: { window: "After Chapter 2 'Coffee Break'", move: "Visit the Thrillbilly Mudclub once Coffee Break ends." },
  26: { window: "Chapter 3", move: "Finish 'Clonin' Keys, Makin' GS' and start the deliveries." },
  27: { window: "Chapter 3, Jason only", move: "Follow the purple Synthetic Labs markers after 'Here, Kitty Kitty'." },
  29: { window: "After Chapter 2 'Coffee Break', Jason only", move: "Play as Jason and answer Bret's text." },
  45: { window: "Chapter 3 (Key Cloner)", move: "Get the Key Cloner first; the method is PowerPyx's, other lists mark it unconfirmed." },
  49: { window: "Unknown", move: "None known — do not chase it." },
  51: { window: "Unknown", move: "None known — try kicks from a bike in free roam." },
};

const LEDGER100_LINES = [
  { key: "vehicles", label: "Vehicles scanned", target: 200, of: 277, money: false, need: "part", src: [1, 10] },
  { key: "animals", label: "Animals studied", target: 100, of: 255, money: false, need: "part", src: [1, 10] },
  { key: "stunts", label: "Stunts completed", target: 300, of: 397, money: false, need: "part", note: "trophy needs 250", src: [1, 10] },
  { key: "challenges", label: "Challenges completed", target: 70, of: 80, money: false, need: "part", src: [1, 10] },
  { key: "decks", label: "Target Decks", target: 15, of: 15, money: false, need: "all", src: [1, 10] },
  { key: "bankjobs", label: "Large Bank Jobs", target: 8, of: 8, money: false, need: "all", src: [1, 10] },
  { key: "gangops", label: "Illegal Gang Operations", target: 39, of: 39, money: false, need: "all", src: [1, 10] },
  { key: "missions", label: "Optional missions", target: 100, of: null, money: false, need: "part", src: [1, 10] },
  { key: "meditations", label: "Meditations", target: 15, of: 18, money: false, need: "part", src: [1, 10] },
  { key: "cardsets", label: "Card sets", target: 3, of: 18, money: false, need: "part", src: [1, 12] },
  { key: "waink", label: "WAiNK scans", target: 100, of: null, money: false, need: "part", src: [1, 19] },
  { key: "races", label: "Races won", target: 20, of: 40, money: false, need: "part", src: [1, 18] },
  { key: "drones", label: "Drone locations", target: 14, of: 14, money: false, need: "all", src: [1, 17] },
  { key: "golds", label: "Shooting golds", target: 42, of: 42, money: false, need: "all", src: [1, 14] },
  { key: "garages", label: "Garages owned", target: 8, of: 8, money: false, need: "all", src: [1, 22] },
  { key: "laundered", label: "Money laundered", target: 250000, of: null, money: true, need: "part", src: [1, 32] },
  { key: "spent", label: "Money spent", target: 100000, of: null, money: true, need: "part", src: [1, 32] },
];

const SAVE_SLOTS = [
  "Save 1: start of Chapter 1", "Save 2: end of Chapter 1",
  "Save 3: start of Chapter 2", "Save 4: end of Chapter 2",
  "Save 5: start of Chapter 3", "Save 6: end of Chapter 3",
  "Save 7: start of Chapter 4", "Save 8: end of Chapter 4",
  "Save 9: start of Chapter 5", "Save 10: before the final mission",
  "Saves 11–15: free-roam cleanup (rotate)",
];

const FILTERS = [
  { key: "all", label: "All 55" },
  { key: "story", label: "Story" },
  { key: "missable", label: "Missable" },
  { key: "collectibles", label: "Collectibles" },
  { key: "activities", label: "Activities" },
  { key: "side", label: "Side chains" },
  { key: "crime", label: "Crime" },
  { key: "riddles", label: "Riddles" },
  { key: "money", label: "Money" },
  { key: "online", label: "Online" },
  { key: "unearned", label: "Unearned only" },
  { key: "grade-P", label: "P" },
  { key: "grade-G", label: "G" },
  { key: "grade-S", label: "S" },
  { key: "grade-B", label: "B" },
];

let trophies = [];
let sources = [];
let disputes = [];
let disputeById = {};
let sourceByN = {};

let state = null;
let ui = { view: "ledger", filter: "all", search: "", selected: 28 };

function defaultState() {
  return {
    earned: SEED_EARNED.slice(),
    counters: Object.assign({}, SEED_COUNTERS),
    revealed: [],
    spoiler: true,
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.earned)) return defaultState();
    return {
      earned: parsed.earned.filter((n) => Number.isInteger(n)),
      counters: Object.assign({}, SEED_COUNTERS, parsed.counters || {}),
      revealed: Array.isArray(parsed.revealed) ? parsed.revealed : [],
      spoiler: parsed.spoiler !== false,
    };
  } catch (e) {
    return defaultState();
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    /* storage unavailable: the tracker still works for the session */
  }
}

function trophyById(id) {
  return trophies.find((t) => t.id === id) || null;
}

function isEarned(id) {
  return state.earned.indexOf(id) !== -1;
}

function isHiddenRow(t) {
  return state.spoiler && t.type.indexOf("story") !== -1 && !isEarned(t.id) && state.revealed.indexOf(t.id) === -1;
}

function gradeLetter(grade) {
  return grade === "platinum" ? "P" : grade === "gold" ? "G" : grade === "silver" ? "S" : "B";
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function srcTags(nums) {
  return nums.map((n) => '<span class="src-tag">[' + n + "]</span>").join("");
}

function fmtMoney(n) {
  return "$" + Number(n).toLocaleString("en-US");
}

function computeAudit() {
  let steps = 0, stepsBacked = 0, intros = 0, introsBacked = 0, tips = 0, tipsBacked = 0;
  const perSourceClaims = {};
  const perSourceGuides = {};
  const countClaim = (srcs) => {
    srcs.forEach((n) => { perSourceClaims[n] = (perSourceClaims[n] || 0) + 1; });
    return srcs.length >= 2;
  };
  trophies.forEach((t) => {
    t.sources.forEach((n) => { perSourceGuides[n] = (perSourceGuides[n] || 0) + 1; });
    t.steps.forEach((s) => { steps++; if (countClaim(s.src)) stepsBacked++; });
    t.intro.forEach((s) => { intros++; if (countClaim(s.src)) introsBacked++; });
    t.tips.forEach((s) => { tips++; if (countClaim(s.src)) tipsBacked++; });
  });
  let versions = 0, versionsBacked = 0, calls = 0, callsBacked = 0;
  trophies.forEach((t) => {
    (t.dispute || []).forEach((did) => {
      const d = disputeById[did];
      if (!d) return;
      versions += 2; calls += 1;
      if (countClaim(d.srcA)) versionsBacked++;
      if (countClaim(d.srcB)) versionsBacked++;
      if (countClaim(d.srcA.concat(d.srcB))) callsBacked++;
    });
  });
  const claims = steps + intros + tips + versions + calls;
  const backed = stepsBacked + introsBacked + tipsBacked + versionsBacked + callsBacked;
  const guides3 = trophies.filter((t) => t.sources.length >= 3).length;
  const possibly = trophies.filter((t) => t.missable === "possibly").length;
  const atRisk = trophies.filter((t) => t.missable === "watch" || t.missable === "unconfirmed").length;
  const unconfirmed = trophies.filter((t) => t.unconfirmed).length;
  const sites = new Set(sources.map((s) => s.site)).size;
  return {
    steps, intros, tips, versions, calls, claims, backed,
    guides3, possibly, atRisk, unconfirmed,
    pages: sources.length, sites, disputes: disputes.length,
    perSourceClaims, perSourceGuides,
  };
}

function collectiblesLogged() {
  return LEDGER100_LINES.filter((l) => !l.money)
    .reduce((sum, l) => sum + (state.counters[l.key] || 0), 0);
}

function renderTop() {
  const earned = state.earned.length;
  const pct = Math.round((earned / 55) * 100);
  document.getElementById("progressText").textContent = earned + "/55 earned (" + pct + "%)";
  const counts = { P: 0, G: 0, S: 0, B: 0 };
  state.earned.forEach((id) => {
    const t = trophyById(id);
    if (t) counts[gradeLetter(t.grade)]++;
  });
  document.getElementById("gradeCounts").textContent =
    "P " + counts.P + "/1 · G " + counts.G + "/2 · S " + counts.S + "/6 · B " + counts.B + "/46";
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("collectiblesLogged").textContent = collectiblesLogged() + " collectibles logged";
  const sb = document.getElementById("spoilerBtn");
  sb.textContent = state.spoiler ? "Spoilers: hidden until earned" : "Spoilers: shown";
  sb.classList.toggle("on", !state.spoiler);
}

function renderAudit(audit) {
  document.getElementById("auditStrip").textContent =
    "55 official · 1P 2G 6S 46B · 28 hidden · 55/55 guides cite a source · " +
    audit.claims + "/" + audit.claims + " claims cited · " + audit.backed + " backed by 2+ sources · " +
    audit.pages + " pages · " + audit.sites + " sites read " + RESEARCH_DATE + " · " +
    audit.possibly + " possibly missable · " + audit.atRisk + " at risk · " +
    audit.unconfirmed + " unconfirmed · " + audit.disputes + " disputes shown both ways";
}

function filterMatches(t) {
  const f = ui.filter;
  if (f === "all") return true;
  if (f === "unearned") return !isEarned(t.id);
  if (f === "online") return false;
  if (f === "missable") return !!t.missable;
  if (f.indexOf("grade-") === 0) return gradeLetter(t.grade) === f.slice(6);
  return t.type.indexOf(f) !== -1;
}

function searchMatches(t) {
  if (!ui.search) return true;
  const q = ui.search.toLowerCase();
  return (t.name + " " + t.description + " #" + t.id).toLowerCase().indexOf(q) !== -1;
}

function renderNextUp(audit) {
  const order = trophies.slice().sort((a, b) => (a.stage - b.stage) || (a.id - b.id));
  const next = order.filter((t) => !isEarned(t.id)).slice(0, 8);
  const html = ['<span class="nu-label">NEXT UP — IN ROADMAP ORDER</span>'];
  next.forEach((t) => {
    html.push('<span class="nu-item"><b>#' + t.id + '</b> ' + esc(isHiddenRow(t) ? "Hidden trophy" : t.name) +
      ' · stage ' + t.stage + ' ' + srcTags(t.sources.slice(0, 3)) + "</span>");
  });
  document.getElementById("nextUpStrip").innerHTML = html.join("");
}

function renderFilters(audit) {
  const counts = {};
  FILTERS.forEach((f) => {
    if (f.key === "all") counts[f.key] = 55;
    else if (f.key === "online") counts[f.key] = 0;
    else if (f.key === "unearned") counts[f.key] = 55 - state.earned.length;
    else if (f.key === "missable") counts[f.key] = trophies.filter((t) => !!t.missable).length;
    else if (f.key.indexOf("grade-") === 0) counts[f.key] = trophies.filter((t) => gradeLetter(t.grade) === f.key.slice(6)).length;
    else counts[f.key] = trophies.filter((t) => t.type.indexOf(f.key) !== -1).length;
  });
  document.getElementById("filterRow").innerHTML = FILTERS.map((f) =>
    '<button type="button" data-filter="' + f.key + '"' + (ui.filter === f.key ? ' class="active"' : "") + ">" +
    esc(f.label) + " " + counts[f.key] + "</button>").join("");
  document.querySelectorAll("#filterRow button").forEach((b) => {
    b.addEventListener("click", () => {
      ui.filter = b.getAttribute("data-filter");
      syncHash();
      renderChecklist();
      renderFilters(audit);
    });
  });
}

function rowFlags(t) {
  const out = [];
  if (t.missable === "possibly") out.push('<span class="flag">MISSABLE?</span>');
  if (t.missable === "watch") out.push('<span class="flag watch">AT RISK</span>');
  if (t.missable === "unconfirmed") out.push('<span class="flag unconf">UNCONFIRMED</span>');
  if (t.hidden) out.push('<span class="flag hiddenflag">HIDDEN ON PSN</span>');
  return out.join(" ");
}

function renderChecklist() {
  const list = trophies.filter((t) => filterMatches(t) && searchMatches(t));
  const shown = list.length;
  let html = "";
  STAGE_META.forEach((st) => {
    const rows = list.filter((t) => t.stage === st.n);
    if (!rows.length) return;
    const earnedIn = rows.filter((t) => isEarned(t.id)).length;
    html += '<div class="stage-group"><div class="stage-head"><span>' + esc(st.name) + '</span><span>' +
      earnedIn + "/" + rows.length + "</span></div>";
    rows.forEach((t) => {
      const hidden = isHiddenRow(t);
      html += '<div class="trow' + (isEarned(t.id) ? " earned" : "") + (ui.selected === t.id ? " selected" : "") +
        '" data-tid="' + t.id + '">' +
        '<input type="checkbox" data-earn="' + t.id + '"' + (isEarned(t.id) ? " checked" : "") + ' aria-label="Mark earned">' +
        '<span class="badge ' + gradeLetter(t.grade) + '">' + gradeLetter(t.grade) + "</span>" +
        '<span style="flex:1">' + (hidden
          ? '<span class="tname">Hidden trophy</span><div class="tmeta">Hidden until earned · stage ' + t.stage + ' · story · <button type="button" data-reveal="' + t.id + '">Reveal</button></div>'
          : '<span class="tname">' + esc(t.name) + '</span><div class="tmeta">' + t.sources.length + " sources " + rowFlags(t) + "</div>") +
        "</span></div>";
    });
    html += "</div>";
  });
  document.getElementById("checklist").innerHTML = html || '<p class="muted">No trophies match this filter.</p>';
  document.getElementById("tabNote").textContent = shown + " shown";
  document.querySelectorAll("#checklist .trow").forEach((row) => {
    row.addEventListener("click", (ev) => {
      if (ev.target.getAttribute("data-earn") || ev.target.getAttribute("data-reveal")) return;
      selectTrophy(Number(row.getAttribute("data-tid")));
    });
  });
  document.querySelectorAll("#checklist [data-earn]").forEach((cb) => {
    cb.addEventListener("click", (ev) => {
      ev.stopPropagation();
      toggleEarned(Number(cb.getAttribute("data-earn")));
    });
  });
  document.querySelectorAll("#checklist [data-reveal]").forEach((b) => {
    b.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const id = Number(b.getAttribute("data-reveal"));
      if (state.revealed.indexOf(id) === -1) state.revealed.push(id);
      saveProgress();
      renderAll();
    });
  });
}

function selectTrophy(id) {
  ui.selected = id;
  syncHash();
  renderChecklist();
  renderDetail();
}

function toggleEarned(id) {
  const i = state.earned.indexOf(id);
  if (i === -1) state.earned.push(id); else state.earned.splice(i, 1);
  saveProgress();
  renderAll();
}

function counterKeyFor(t) {
  const map = { 15: "stunts", 16: "types", 17: "golds", 18: "drones", 19: "races", 28: "meditations", 30: "cardsets", 31: "waink", 32: "challenges", 35: "vehicles", 40: "bankjobs", 43: "gangops", 48: "actions", 52: "laundered", 53: "spent", 54: "garages", 55: "registered" };
  return map[t.id] || null;
}

function renderDetail() {
  const t = trophyById(ui.selected) || trophyById(28);
  const el = document.getElementById("trophyDetail");
  if (!t) { el.innerHTML = ""; return; }
  if (isHiddenRow(t)) {
    el.innerHTML = '<div class="detail"><h2>Hidden trophy</h2><div class="dsub">Trophy ' + t.id + ' of 55 · stage ' + t.stage + ' · story</div>' +
      '<p class="hidden-row">Hidden until earned — the spoiler setting covers this story trophy.</p>' +
      '<p><button type="button" data-reveal-one="' + t.id + '">Reveal this trophy</button></p></div>';
    el.querySelector("[data-reveal-one]").addEventListener("click", () => {
      if (state.revealed.indexOf(t.id) === -1) state.revealed.push(t.id);
      saveProgress();
      renderAll();
    });
    return;
  }
  let html = '<div class="detail"><h2>' + esc(t.name) + '</h2>' +
    '<div class="dsub">Trophy ' + t.id + ' of 55 · ' + t.grade + ' · stage ' + t.stage + ' · ' + t.type.join(" / ") + '</div>' +
    '<label><input type="checkbox" id="detailEarned"' + (isEarned(t.id) ? " checked" : "") + '> Mark earned</label>' +
    '<div class="odesc">“' + esc(t.description) + '” — official description</div>';
  if (t.missable === "possibly") {
    const w = MISSABLE_WINDOWS[t.id] || { window: "", move: "" };
    html += '<div class="miss-box"><h3>POSSIBLY MISSABLE · LAST CHANCE — ' + esc(w.window) + '</h3>' +
      '<div>' + esc(w.move) + '</div></div>';
  } else if (t.missable === "watch" || t.missable === "unconfirmed") {
    const w = MISSABLE_WINDOWS[t.id] || { window: "", move: "" };
    html += '<div class="miss-box safe"><h3>' + (t.missable === "unconfirmed" ? "UNCONFIRMED TRIGGER" : "AT RISK — " + esc(w.window)) + '</h3>' +
      '<div>' + esc(w.move) + '</div></div>';
  }
  html += "<h3>IN SHORT</h3><p>" + t.intro.map((s) => esc(s.text) + " " + srcTags(s.src)).join(" ") + "</p>";
  html += "<h3>HOW TO GET IT — IN OUR OWN WORDS</h3><ol class=\"steps\">" +
    t.steps.map((s) => "<li>" + esc(s.text) + " " + srcTags(s.src) + "</li>").join("") + "</ol>";
  const ck = counterKeyFor(t);
  if (ck && t.counter) {
    const val = state.counters[ck] || 0;
    const label = t.counter.money ? fmtMoney(val) + " / " + fmtMoney(t.counter.target) : val + " / " + t.counter.target;
    html += '<div class="counter-row"><span>YOUR COUNT — ' + esc(t.counter.label) + ':</span>' +
      '<button type="button" data-count="' + ck + '" data-d="-1">−</button><span>' + label + '</span>' +
      '<button type="button" data-count="' + ck + '" data-d="1">+</button></div>';
  }
  (t.dispute || []).forEach((did) => {
    const d = disputeById[did];
    if (!d) return;
    html += '<div class="ab-box"><h3 style="margin-top:0">SOURCES DIFFER — ' + esc(d.title) + '</h3>' +
      '<div class="ver"><b>A:</b> ' + esc(d.a) + ' ' + srcTags(d.srcA) + '</div>' +
      '<div class="ver"><b>B:</b> ' + esc(d.b) + ' ' + srcTags(d.srcB) + '</div>' +
      '<div class="call-line">Our call: ' + esc(d.call) + '</div></div>';
  });
  t.tips.forEach((s) => {
    html += '<p><b>Tip:</b> ' + esc(s.text) + ' ' + srcTags(s.src) + '</p>';
  });
  html += '<div class="detail-foot">Our own wording. Cited ' + srcTags(t.sources) + ' — read ' + RESEARCH_DATE +
    ' · trophy ' + t.id + ' of 55 · unofficial fan guide · not affiliated with Rockstar Games or Sony.</div></div>';
  el.innerHTML = html;
  el.querySelector("#detailEarned").addEventListener("change", () => toggleEarned(t.id));
  el.querySelectorAll("[data-count]").forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.getAttribute("data-count");
      const d = Number(b.getAttribute("data-d"));
      state.counters[key] = Math.max(0, (state.counters[key] || 0) + d);
      saveProgress();
      renderAll();
    });
  });
}

function renderSources(audit) {
  const rows = sources.map((s) => {
    const guides = audit.perSourceGuides[s.n] || 0;
    const claims = audit.perSourceClaims[s.n] || 0;
    const label = s.url ? esc(s.name) + " — " + esc(s.site) : esc(s.name) + " — " + esc(s.site);
    return '<div class="src-row"><span class="n">[' + s.n + ']</span><span>' + label +
      '</span><span class="cnt">cited by ' + guides + '/55 · ' + claims + ' claims</span></div>';
  }).join("");
  document.getElementById("sourcesPanel").innerHTML =
    "<h3>SOURCES — READ " + RESEARCH_DATE.toUpperCase() + " · " + audit.pages + " PAGES · " + audit.sites + " SITES</h3>" +
    rows +
    '<div class="blocked-note">Not cited — pages that refused access: PSNProfiles, TrueAchievements. ' +
    'Our own wording. Trophy names, descriptions and grades as PlayStation publishes them.</div>';
}

function renderRoadmap() {
  let html = "";
  STAGE_META.forEach((st) => {
    const ids = trophies.filter((t) => t.stage === st.n).map((t) => t.id);
    const earned = ids.filter((id) => isEarned(id)).length;
    html += '<div class="stage-card"><h2>' + esc(st.name) + ' — ' + st.hours + ' · ' + earned + '/' + ids.length + '</h2>' +
      '<div class="st-meta">FROM THE DESCRIPTIONS · ' + esc(st.note) + ' ' + srcTags(st.src) + '</div><div class="chips">' +
      ids.map((id) => {
        const t = trophyById(id);
        return '<span class="chip' + (isEarned(id) ? " earned" : "") + '">#' + id + " " + esc(t.name) + "</span>";
      }).join("") + "</div></div>";
  });
  html += '<div class="two-col"><div><div class="rules"><h2>GROUND RULES</h2><ol>' +
    GROUND_RULES.map((r) => "<li>" + esc(r.text) + " " + srcTags(r.src) + "</li>").join("") +
    '</ol></div><div class="rules"><h2>HOW THIS ROADMAP WAS BUILT</h2><p>Stages group trophies by what their official description asks for; order and risk flags come from the cited pages, never from memory. ' + srcTags([1]) + '</p></div></div>';
  const flagged = trophies.filter((t) => !!t.missable);
  html += '<div class="watchlist"><h2>MISSABLE WATCH LIST — ' + flagged.length + ' flagged · 48 safe after the credits</h2>' +
    flagged.map((t) => {
      const w = MISSABLE_WINDOWS[t.id] || { window: "", move: "" };
      return '<div class="watch-item"><b>#' + t.id + " " + esc(t.name) + "</b> — " +
        (t.missable === "possibly" ? "POSSIBLY MISSABLE" : t.missable === "unconfirmed" ? "UNCONFIRMED" : "AT RISK") +
        " · " + esc(w.window) + " · " + esc(w.move) + " " + srcTags(t.sources.slice(0, 3)) + "</div>";
    }).join("") +
    '<div class="watch-item"><b>SAFE AFTER THE CREDITS</b> — everything else: free roam after the credits, no mission replay needed, all trophy-related quest givers return.</div></div></div>';
  document.getElementById("roadmapBody").innerHTML = html;
}

function renderMissables() {
  const possibly = trophies.filter((t) => t.missable === "possibly");
  const atRisk = trophies.filter((t) => t.missable === "watch" || t.missable === "unconfirmed");
  const group = (title, items) => {
    if (!items.length) return "";
    return '<div class="stage-card"><h2>' + title + '</h2>' + items.map((t) => {
      const w = MISSABLE_WINDOWS[t.id] || { window: "", move: "" };
      return '<div class="watch-item"><b>#' + t.id + " " + esc(t.name) + "</b> (" + t.grade + ") — LAST CHANCE: " +
        esc(w.window) + ". Protection: " + esc(w.move) + " " + srcTags(t.sources.slice(0, 3)) + "</div>";
    }).join("") + "</div>";
  };
  document.getElementById("missablesBody").innerHTML =
    group("POSSIBLY MISSABLE (" + possibly.length + ")", possibly) +
    group("AT RISK (" + atRisk.length + ")", atRisk) +
    '<div class="stage-card"><h2>SAFE AFTER THE CREDITS</h2><p>48 safe after the credits — nothing on the 100% checklist is missable. ' + srcTags([1, 10]) + '</p></div>' +
    '<div class="stage-card"><h2>HOW THE COUNT IS BUILT</h2><p>Possibly missable means a named window may close on it; at risk means a story window or an unconfirmed trigger. The count comes from the cited pages: PowerPyx flags 1, Push Square says none known, TechWiser warns of 5 stranger-chain windows — all three versions are in the disagreement ledger (dispute d11). ' + srcTags([1, 9, 37]) + '</p></div>';
}

function renderMatrix(audit) {
  const claimCount = (n) => audit.perSourceClaims[n] || 0;
  const topCols = sources.slice().sort((a, b) => claimCount(b.n) - claimCount(a.n)).slice(0, 10);
  const stepCount = (t, n) => t.steps.filter((s) => s.src.indexOf(n) !== -1).length;
  const summaryOnly = (t, n) => {
    if (stepCount(t, n) > 0) return false;
    const inIntro = t.intro.some((s) => s.src.indexOf(n) !== -1);
    const inTips = t.tips.some((s) => s.src.indexOf(n) !== -1);
    const inDispute = (t.dispute || []).some((did) => {
      const d = disputeById[did];
      return d && (d.srcA.indexOf(n) !== -1 || d.srcB.indexOf(n) !== -1);
    });
    return inIntro || inTips || inDispute;
  };
  const flagFor = (t) => {
    if (t.unconfirmed) return "OPEN";
    if ((t.dispute || []).length) return "DIFFER";
    if (t.sources.length === 1) return "1 SRC";
    return "";
  };
  let html = '<div class="matrix-summary">Trophy × source matrix — each row is a guide, each column a page read ' + RESEARCH_DATE +
    '. A number is how many of that guide\'s steps cite the page; a dot means the page is cited in the summary only; blank means not used. ' +
    audit.guides3 + ' guides on 3+ sources · ' + trophies.filter((t) => t.sources.length === 2).length + ' on 2 sources · ' +
    trophies.filter((t) => t.sources.length === 1).length + ' on 1 source · ' +
    topCols.map((s) => "[" + s.n + "] " + esc(s.site) + " " + claimCount(s.n)).join(" · ") + "</div>";
  html += '<div class="matrix-wrap"><table class="matrix"><thead><tr><th>#</th><th>Trophy</th>' +
    topCols.map((s) => "<th>[" + s.n + "]</th>").join("") + "<th>Flag</th></tr></thead><tbody>";
  trophies.forEach((t) => {
    html += "<tr><td>" + t.id + '</td><td class="tname-cell">' + esc(t.name) + "</td>" +
      topCols.map((s) => {
        const c = stepCount(t, s.n);
        if (c > 0) return '<td class="num">' + c + "</td>";
        if (summaryOnly(t, s.n)) return '<td class="dot">•</td>';
        return "<td></td>";
      }).join("") + "<td>" + flagFor(t) + "</td></tr>";
  });
  html += "</tbody></table></div>";
  document.getElementById("matrixBody").innerHTML = html;
}

function renderLedger100(audit) {
  const money = (l) => fmtMoney(state.counters[l.key] || 0) + " / " + fmtMoney(l.target);
  const plain = (l) => (state.counters[l.key] || 0) + " / " + l.target + (l.of ? " of " + l.of : "");
  let html = '<div class="ledger100-head"><b>A Long Road — 100% Completion · closer to 60% true completion · checklist opens after the story · nothing on it is missable.</b> ' +
    'Each line states its source (PowerPyx 100% guide) and whether it needs everything or only a part. ' + srcTags([1, 10]) + '</div>';
  html += '<div class="counters-grid">' + LEDGER100_LINES.map((l) => {
    const val = l.money ? money(l) : plain(l);
    return '<div class="counter-line"><span class="cl-label">' + esc(l.label) + " <span class=\"muted\">(" + l.need + (l.note ? " · " + esc(l.note) : "") + ")</span> " + srcTags(l.src) + '</span>' +
      '<button type="button" data-l100="' + l.key + '" data-d="-1">−</button><span class="cl-val">' + val + '</span>' +
      '<button type="button" data-l100="' + l.key + '" data-d="1">+</button></div>';
  }).join("") + "</div>";
  html += '<div class="panel-box"><h2>SAVE-SLOT PLANNER — 15 manual slots</h2><div class="save-strip">' +
    SAVE_SLOTS.map((s) => '<span class="save-slot">' + esc(s) + "</span>").join("") +
    '</div><p class="muted">No mission replay — these 10 saves are your only protection against the one possibly-missable trophy. ' + srcTags([1, 26]) + '</p></div>';
  html += '<div class="panel-box"><h2>DISAGREEMENT LEDGER — ' + disputes.length + ' shown both ways</h2><div class="dispute-grid">' +
    disputes.map((d) => '<div class="dispute-item"><b class="t">' + esc(d.title) + '</b><br><b>A:</b> ' + esc(d.a) + ' ' + srcTags(d.srcA) +
      '<br><b>B:</b> ' + esc(d.b) + ' ' + srcTags(d.srcB) + '<br><span class="call-line">Our call: ' + esc(d.call) + '</span></div>').join("") +
    "</div></div>";
  const bytes = (localStorage.getItem(STORAGE_KEY) || "").length;
  const revealed = state.revealed.length;
  const covered = trophies.filter((t) => t.type.indexOf("story") !== -1 && !isEarned(t.id) && state.revealed.indexOf(t.id) === -1).length;
  html += '<div class="panel-box"><h2>EXPORT / IMPORT &amp; SPOILER SETTING</h2>' +
    '<p><button type="button" id="exportBtn2">Export progress (.json)</button> ' +
    '<button type="button" id="copyLinkBtn2">Copy progress link</button> ' +
    '<button type="button" id="spoilerBtn2">Spoilers: ' + (state.spoiler ? "hidden until earned" : "shown") + '</button> ' +
    '<button type="button" id="importBtn2">Import</button> ' +
    '<button type="button" id="resetBtn">Reset all progress</button></p>' +
    '<p class="muted">Saved state — key ' + STORAGE_KEY + ' · ' + bytes + ' bytes in localStorage · ' + state.earned.length +
    ' earned · ' + Object.keys(state.counters).length + ' counters · ' + revealed + ' revealed by hand · ' + covered + ' still covered.</p>' +
    '<p class="muted">Spoiler setting at work: story trophies stay covered until earned or revealed one by one — see the Ledger checklist.</p></div>';
  document.getElementById("ledger100Body").innerHTML = html;
  document.querySelectorAll("#ledger100Body [data-l100]").forEach((b) => {
    b.addEventListener("click", () => {
      const key = b.getAttribute("data-l100");
      const d = Number(b.getAttribute("data-d"));
      const line = LEDGER100_LINES.find((l) => l.key === key);
      const step = line && line.money ? 5000 : 1;
      state.counters[key] = Math.max(0, (state.counters[key] || 0) + d * step);
      saveProgress();
      renderAll();
    });
  });
  document.getElementById("exportBtn2").addEventListener("click", exportProgress);
  document.getElementById("copyLinkBtn2").addEventListener("click", copyProgressLink);
  document.getElementById("importBtn2").addEventListener("click", openImport);
  document.getElementById("spoilerBtn2").addEventListener("click", toggleSpoiler);
  document.getElementById("resetBtn").addEventListener("click", () => {
    state = { earned: [], counters: {}, revealed: [], spoiler: state.spoiler };
    saveProgress();
    renderAll();
    showToast("Progress reset — 0/55 earned.");
  });
}

function toggleSpoiler() {
  state.spoiler = !state.spoiler;
  saveProgress();
  renderAll();
}

function exportProgress() {
  const payload = JSON.stringify({ app: "leonida-files", version: 2, earned: state.earned, counters: state.counters, revealed: state.revealed, spoiler: state.spoiler }, null, 2);
  try {
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leonida-files-progress.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Exported " + state.earned.length + " earned trophies.");
  } catch (e) {
    showToast("Export failed in this browser — copy the link instead.");
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(payload).catch(() => {});
  }
}

function openImport() {
  document.getElementById("importPanel").classList.remove("hidden");
  document.getElementById("importMsg").textContent = "";
}

function closeImport() {
  document.getElementById("importPanel").classList.add("hidden");
}

function doImportText(text) {
  try {
    const data = JSON.parse(text);
    if (!data || !Array.isArray(data.earned)) throw new Error("not a Leonida Files export");
    state = {
      earned: data.earned.filter((n) => Number.isInteger(n)),
      counters: Object.assign({}, data.counters || {}),
      revealed: Array.isArray(data.revealed) ? data.revealed : [],
      spoiler: data.spoiler !== false,
    };
    saveProgress();
    renderAll();
    document.getElementById("importMsg").textContent = "Imported " + state.earned.length + " earned trophies and " + Object.keys(state.counters).length + " counters. Saved in this browser.";
    showToast("Imported " + state.earned.length + " earned trophies.");
    return true;
  } catch (e) {
    document.getElementById("importMsg").textContent = "Import failed: " + e.message;
    return false;
  }
}

function progressLink() {
  const base = window.location.href.split("#")[0];
  const earned = state.earned.slice().sort((a, b) => a - b).map((n) => "t" + String(n).padStart(2, "0")).join(",");
  const counts = Object.keys(state.counters)
    .filter((k) => state.counters[k] > 0)
    .map((k) => {
      const t = trophies.find((x) => counterKeyFor(x) === k);
      const tid = t ? "t" + String(t.id).padStart(2, "0") : k;
      return tid + ":" + state.counters[k];
    }).join(",");
  const parts = ["view=" + ui.view, "t=t" + String(ui.selected).padStart(2, "0"), "filter=" + ui.filter];
  if (earned) parts.push("earned=" + earned);
  if (counts) parts.push("counts=" + counts);
  return base + "#" + parts.join("&");
}

function copyProgressLink() {
  const link = progressLink();
  const done = () => showToast("Progress link copied.");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(done, () => showToast("Copy the link from the address bar."));
  } else {
    showToast("Copy the link from the address bar.");
  }
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 2600);
}

function syncHash() {
  const parts = ["view=" + ui.view, "t=t" + String(ui.selected).padStart(2, "0"), "filter=" + ui.filter];
  history.replaceState(null, "", "#" + parts.join("&"));
}

function applyHash() {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return;
  const params = {};
  hash.split("&").forEach((pair) => {
    const kv = pair.split("=");
    if (kv.length === 2) params[kv[0]] = decodeURIComponent(kv[1]);
  });
  if (params.view && document.getElementById("view-" + params.view)) ui.view = params.view;
  if (params.t) {
    const id = Number(params.t.replace(/^t/, ""));
    if (trophyById(id)) ui.selected = id;
  }
  if (params.filter) ui.filter = params.filter;
  if (params.earned) {
    state.earned = params.earned.split(",").map((x) => Number(x.replace(/^t/, ""))).filter((n) => trophyById(n));
  }
  if (params.counts) {
    params.counts.split(",").forEach((pair) => {
      const kv = pair.split(":");
      if (kv.length !== 2) return;
      const t = trophyById(Number(kv[0].replace(/^t/, "")));
      if (t) {
        const key = counterKeyFor(t);
        if (key) state.counters[key] = Math.max(0, Number(kv[1]) || 0);
      }
    });
  }
  saveProgress();
}

function setView(view) {
  ui.view = view;
  document.querySelectorAll("#tabs .tab").forEach((b) => b.classList.toggle("active", b.getAttribute("data-view") === view));
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
  syncHash();
}

function renderAll() {
  const audit = computeAudit();
  renderTop();
  renderAudit(audit);
  renderNextUp(audit);
  renderFilters(audit);
  renderChecklist();
  renderDetail();
  renderSources(audit);
  renderRoadmap();
  renderMissables();
  renderMatrix(audit);
  renderLedger100(audit);
}

function loadGuideData() {
  return Promise.all([
    fetch("data/trophies.json").then((r) => r.json()),
    fetch("data/sources.json").then((r) => r.json()),
    fetch("data/disputes.json").then((r) => r.json()),
  ]).then((parts) => {
    trophies = parts[0].trophies || parts[0];
    sources = parts[1].sources || parts[1];
    disputes = parts[2].disputes || parts[2];
    sources.forEach((s) => { sourceByN[s.n] = s; });
    disputes.forEach((d) => { disputeById[d.id] = d; });
  });
}

function bindChrome() {
  document.querySelectorAll("#tabs .tab").forEach((b) => {
    b.addEventListener("click", () => setView(b.getAttribute("data-view")));
  });
  document.getElementById("spoilerBtn").addEventListener("click", toggleSpoiler);
  document.getElementById("exportBtn").addEventListener("click", exportProgress);
  document.getElementById("importBtn").addEventListener("click", openImport);
  document.getElementById("copyLinkBtn").addEventListener("click", copyProgressLink);
  document.getElementById("searchBox").addEventListener("input", (ev) => {
    ui.search = ev.target.value;
    renderChecklist();
  });
  document.getElementById("importCloseBtn").addEventListener("click", closeImport);
  document.getElementById("importDoBtn").addEventListener("click", () => {
    doImportText(document.getElementById("importText").value);
  });
  document.getElementById("importFile").addEventListener("change", (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => doImportText(String(reader.result || ""));
    reader.readAsText(f);
  });
  window.addEventListener("hashchange", () => { applyHash(); renderAll(); });
}

state = loadProgress();
bindChrome();
loadGuideData().then(() => {
  applyHash();
  renderAll();
  setView(ui.view);
}).catch(() => {
  document.getElementById("auditStrip").textContent =
    "Could not load the guide data (data/trophies.json). Serve the app/ folder with a static server — it does not fetch anything over the network.";
});
