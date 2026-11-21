'use strict';
var KEY='leonida-files.progress.v3';
var $=function(s){return document.querySelector(s);};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function cite(src){return src.map(function(n){return '['+n+']';}).join('');}
var T=[],S=[],D=[],byId={};
var LEDGER=[
 {key:'vehicles',label:'Vehicles scanned',sub:'of 277 base models',target:200,cur:112},
 {key:'animals',label:'Animals studied',sub:'of 255 wild species',target:100,cur:61},
 {key:'stunts',label:'Stunts',sub:'trophy needs 250',target:300,cur:148},
 {key:'challenges',label:'Challenges',sub:'of 80 challenges',target:70,cur:41},
 {key:'decks',label:'Target Decks',sub:'all 15',target:15,cur:6},
 {key:'banks',label:'Bank jobs',sub:'all 8 vaults',target:8,cur:3},
 {key:'gangs',label:'Gang operations',sub:'all 39',target:39,cur:17},
 {key:'missions',label:'Optional missions',sub:'of 200+ in the checklist',target:100,cur:63},
 {key:'meditations',label:'Meditations',sub:'of 18 spots',target:15,cur:9},
 {key:'cards',label:'Card sets',sub:'all 3 sets',target:3,cur:3},
 {key:'waink',label:'WAiNK scans',sub:'of 100+ locations',target:100,cur:48},
 {key:'races',label:'Races won',sub:'of 20 needed',target:20,cur:11},
 {key:'drones',label:'Drone locations',sub:'all 14',target:14,cur:7},
 {key:'golds',label:'Shooting golds',sub:'of 42',target:42,cur:19},
 {key:'garages',label:'Garages',sub:'all 8',target:8,cur:8},
 {key:'laundered',label:'Money laundered',sub:'of $250,000',target:250000,cur:132400,money:true},
 {key:'spent',label:'Money spent',sub:'of $100,000',target:100000,cur:100000,money:true}
];
var COUNT_KEY={15:'stunts',17:'golds',18:'drones',19:'races',28:'meditations',30:'cards',31:'waink',32:'challenges',35:'vehicles',40:'banks',43:'gangs',52:'laundered',53:'spent',54:'garages'};
var DEFAULT_EARNED=[2,3,4,8,16,20,21,33,30,35,54,55,44,46,47,53,41];
var STAGES=[
 {n:1,name:'Story spine',hours:'60–80 h',note:'The five chapters in order. The 12 story trophies pop automatically.'},
 {n:2,name:'Windows the story opens',hours:'in-story',note:'The side chains and activities the story introduces — start them when they appear, not when you finish them.'},
 {n:3,name:'100% checklist grind',hours:'~100 h',note:'After the credits, open Progress, then Stats, then 100% Completion.'},
 {n:4,name:'One-offs and riddles',hours:'10–20 h',note:'Single feats and riddles — quick once you know where to go.'},
 {n:5,name:'Platinum pops on its own',hours:'—',note:'Awarded for holding the other 54.'}
];
var SAVE_SLOTS=['Save 1: start of Chapter 1','Save 2: end of Chapter 1','Save 3: start of Chapter 2','Save 4: end of Chapter 2','Save 5: start of Chapter 3','Save 6: end of Chapter 3','Save 7: start of Chapter 4','Save 8: end of Chapter 4','Save 9: start of Chapter 5','Save 10: before the final mission','Save 11: free-roam cleanup','Save 12: free-roam cleanup','Save 13: free-roam cleanup','Save 14: free-roam cleanup','Save 15: free-roam cleanup'];
var LAST_CHANCE={28:'Chapter 1 — before Tourist Trap: the balcony meditation exists only in Chapter 1. Protect it: accept the balcony meditation the morning after Down to Earth and keep a Chapter 1 save until the trophy pops.',25:'Start every stranger chain when it appears — which eight strands count is disputed, so do not skip one.',20:'After the Chapter 1 mission Feng Shui — start the chain when Cal texts.',22:'Chapter 3, Lucia only — answer Andy when he calls.',23:'Chapter 1, then Kenton goes quiet — he returns in Chapters 2–3.',24:'After the Chapter 2 mission Coffee Break.',26:'Chapter 3 — the Key Cloner opens the chain.',27:'Chapter 3, Jason only — after Here, Kitty Kitty.',29:'After the Chapter 2 mission Coffee Break, Jason only.',45:'The trigger is not pinned down by every source — try the PowerPyx method and keep the trophy on watch.'};
var GROUPS=[['all','All 55'],['story','Story'],['missable','Missable'],['collectibles','Collectibles'],['activities','Activities'],['side','Side'],['crime','Crime'],['riddles','Riddles'],['money','Money'],['goal','Goal'],['earned','Earned'],['unearned','Unearned']];
var state=null;
function defaultState(){var counts={};LEDGER.forEach(function(l){counts[l.key]=l.cur;});counts.reg=0;counts.randy=0;counts.profile=0;return{earned:DEFAULT_EARNED.slice(),counts:counts,spoiler:true,revealed:[],view:'ledger',filter:'all',search:'',sel:28};}
function loadState(){try{var raw=localStorage.getItem(KEY);if(raw){var s=JSON.parse(raw);if(s&&Array.isArray(s.earned))return Object.assign(defaultState(),s);}}catch(e){}return defaultState();}
function saveState(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function applyHash(){var h=location.hash.replace(/^#/,'');if(!h)return;var p=new URLSearchParams(h);if(p.get('view'))state.view=p.get('view');if(p.get('t'))state.sel=+p.get('t')||28;if(p.get('filter'))state.filter=p.get('filter');if(p.get('earned')){state.earned=p.get('earned').split(',').map(function(x){return parseInt(x.replace(/^t0*/,''),10);}).filter(function(n){return n>=1&&n<=55;});}if(p.get('counts')){p.get('counts').split(',').forEach(function(pair){var kv=pair.split(':');if(kv[0]&&kv[1]!==undefined)state.counts[kv[0]]=+kv[1];});}}
function claimsOf(t){return t.steps.concat(t.intro,t.tips);}
function allClaims(){var n=0,b=0;T.forEach(function(t){claimsOf(t).forEach(function(c){n++;if(c.src.length>=2)b++;});});D.forEach(function(d){d.versions.forEach(function(v){n++;if(v.src.length>=2)b++;});});return{n:n,b:b};}
function srcStats(){return S.map(function(s){var guides=0,claims=0;T.forEach(function(t){if(t.sources.indexOf(s.n)>=0)guides++;claimsOf(t).forEach(function(c){if(c.src.indexOf(s.n)>=0)claims++;});});D.forEach(function(d){d.versions.forEach(function(v){if(v.src.indexOf(s.n)>=0)claims++;});});return{n:s.n,kind:s.kind,site:s.site,title:s.title,guides:guides,claims:claims};});}
function gradeBadge(g){return '<span class="badge '+g[0]+'">'+g[0].toUpperCase()+'</span>';}
function flagsOf(t){var f='';if(t.missable==='possibly')f+='<span class="flag miss">MISSABLE?</span>';else if(t.missable==='watch')f+='<span class="flag risk">AT RISK</span>';if(t.type==='story')f+='<span class="flag hid">HIDDEN ON PSN</span>';if(t.unconfirmed)f+='<span class="flag unc">UNCONFIRMED</span>';if(t.dispute)f+='<span class="flag diff">DIFFERS</span>';return f;}
function isHidden(t){return state.spoiler&&t.type==='story'&&state.earned.indexOf(t.id)<0&&state.revealed.indexOf(t.id)<0;}
function flash(m){var el=$('#msg');if(el)el.textContent=m;}
function renderTop(){var e=state.earned.length;var g={platinum:0,gold:0,silver:0,bronze:0};var tot={platinum:0,gold:0,silver:0,bronze:0};T.forEach(function(t){tot[t.grade]++;if(state.earned.indexOf(t.id)>=0)g[t.grade]++;});var logged=LEDGER.filter(function(l){return !l.money;}).reduce(function(a,l){return a+(state.counts[l.key]||0);},0);
$('#topbar').innerHTML='<div class="row"><h1>THE LEONIDA FILES</h1><span class="sub">GTA VI Trophy Guide &amp; Tracker — PlayStation 5 · unofficial fan guide · works offline</span><div class="prog"><b>'+e+'/55 earned ('+Math.round(e/55*100)+'%)</b><div class="bar"><i style="width:'+(e/55*100)+'%"></i></div><div class="grades">P '+g.platinum+'/1 · G '+g.gold+'/2 · S '+g.silver+'/6 · B '+g.bronze+'/46 &nbsp;·&nbsp; '+logged+' collectibles logged</div></div></div><div class="tools"><button id="bExport">Export</button><button id="bImport">Import</button><button id="bLink">Copy progress link</button><label><input type="checkbox" id="bSpoil"'+(state.spoiler?' checked':'')+'> Spoilers: hidden until earned</label><span class="kv">Saved in this browser</span><span class="kv" id="msg"></span></div>';
$('#bSpoil').addEventListener('change',function(ev){state.spoiler=ev.target.checked;saveState();render();});
$('#bExport').addEventListener('click',doExport);
$('#bImport').addEventListener('click',function(){state.view='ledger100';render();var ta=$('#importBox');if(ta)ta.focus();});
$('#bLink').addEventListener('click',copyLink);}
function renderAudit(){var c=allClaims();var g3=T.filter(function(t){return new Set(t.sources).size>=3;}).length;var unc=T.filter(function(t){return t.unconfirmed;}).length;
$('#audit').textContent='55 official · 1P 2G 6S 46B · 28 hidden · 55/55 guides cite a source · '+c.n+'/'+c.n+' claims cited · '+c.b+' backed by 2+ sources ('+Math.round(c.b/c.n*100)+'%) · '+g3+'/55 guides on 3+ sources · 65 source pages · 22 sites read 20 Nov 2026 · 2 possibly missable · 8 at risk · '+unc+' unconfirmed · 24 disputes shown both ways';}
function renderTabs(){var names={ledger:'Ledger',roadmap:'Roadmap',missables:'Missables',matrix:'Source Matrix',ledger100:'100% Ledger'};
$('#tabs').innerHTML=Object.keys(names).map(function(k){return '<button data-v="'+k+'" class="'+(state.view===k?'on':'')+'">'+names[k]+'</button>';}).join('');
Array.prototype.forEach.call(document.querySelectorAll('#tabs button'),function(b){b.addEventListener('click',function(){state.view=b.getAttribute('data-v');saveState();render();});});}
function render(){renderTop();renderAudit();renderTabs();var v=state.view;
if(v==='ledger')renderLedger();else if(v==='roadmap')renderRoadmap();else if(v==='missables')renderMissables();else if(v==='matrix')renderMatrix();else renderLedger100();}
function filtered(){var f=state.filter,q=state.search.toLowerCase();return T.filter(function(t){if(q&&(t.name.toLowerCase().indexOf(q)<0&&t.description.toLowerCase().indexOf(q)<0))return false;if(f==='all')return true;if(f==='earned')return state.earned.indexOf(t.id)>=0;if(f==='unearned')return state.earned.indexOf(t.id)<0;if(f==='missable')return !!t.missable;return t.group===f;});}
function toggleEarned(id){var i=state.earned.indexOf(id);if(i>=0)state.earned.splice(i,1);else state.earned.push(id);saveState();render();}
function countOf(t){if(!t.counter)return null;var k=COUNT_KEY[t.id];var cur=k!==undefined?state.counts[k]:0;return{cur:cur,target:t.counter.target,unit:t.counter.unit,key:k};}
function bumpCount(t,d){var c=countOf(t);if(!c||c.key===undefined)return;var v=Math.max(0,Math.min(c.target,(state.counts[c.key]||0)+d));state.counts[c.key]=v;saveState();render();}

function renderLedger(){var list=filtered();var order=T.slice().sort(function(a,b){return a.stage-b.stage||a.id-b.id;});var next=order.filter(function(t){return state.earned.indexOf(t.id)<0;}).slice(0,8);
var chips=GROUPS.map(function(g){var n=g[0]==='all'?55:list.length;return '<button data-f="'+g[0]+'" class="'+(state.filter===g[0]?'on':'')+'">'+g[1]+'</button>';}).join('');
var rows='';STAGES.forEach(function(st){var inStage=list.filter(function(t){return t.stage===st.n;});if(!inStage.length)return;var en=inStage.filter(function(t){return state.earned.indexOf(t.id)>=0;}).length;rows+='<h3>Stage '+st.n+' — '+st.name+' · '+en+'/'+inStage.length+' earned</h3>';
inStage.forEach(function(t){var earn=state.earned.indexOf(t.id)>=0;var hid=isHidden(t);
rows+='<div class="trow'+(state.sel===t.id?' sel':'')+'" data-id="'+t.id+'"><input type="checkbox"'+(earn?' checked':'')+' data-earn="'+t.id+'" aria-label="earned"><span>'+gradeBadge(t.grade)+'</span><span class="nm">'+(hid?'Hidden trophy':esc(t.name))+'</span>'+(hid?'<span class="meta"> Hidden until earned · stage '+t.stage+' · story</span>':'<span class="meta">'+t.sources.length+' sources</span>')+flagsOf(t)+'</div>';});});
var sel=byId[state.sel]||byId[28];var detail=detailHtml(sel);
var stats=srcStats().slice().sort(function(a,b){return b.claims-a.claims;});
var srcHtml='<h2>SOURCES</h2><p class="kv">65 pages · 22 sites · read 20 Nov 2026 · no page linked by URL — cite by title and site only</p><div class="srclist">'+stats.map(function(s){return '<div class="s"><span class="n">['+s.n+']</span> '+esc(s.title)+' — <b>'+esc(s.site)+'</b> <span class="kv">· '+s.claims+' claims · cited by '+s.guides+' of 55 guides</span></div>';}).join('')+'</div><p class="kv">PSNProfiles and TrueAchievements refused full access and are NOT cited. GTABase and Push Square are cited only for their trophy lists ([8] and [9]); their deep guide pages refused access.</p>';
$('#view').innerHTML='<div class="nextup"><b>YOUR NEXT TROPHY:</b> '+(next.length?next.map(function(t,i){return (i?' · ':'')+'#'+t.id+' '+esc(t.name)+' (S'+t.stage+')';}).join(''):'all 55 earned — platinum is yours.')+'</div><div class="ledger"><div class="col"><h2>CHECKLIST</h2><input class="search" id="q" placeholder="Search a trophy…" value="'+esc(state.search)+'"><div class="chips">'+chips+'</div>'+rows+'</div><div class="col detail">'+detail+'</div><div class="col">'+srcHtml+'</div></div>';
var q=$('#q');q.addEventListener('input',function(){state.search=q.value;var pos=q.selectionStart;render();var q2=$('#q');q2.focus();q2.setSelectionRange(pos,pos);});
Array.prototype.forEach.call(document.querySelectorAll('.chips button'),function(b){b.addEventListener('click',function(){state.filter=b.getAttribute('data-f');saveState();render();});});
Array.prototype.forEach.call(document.querySelectorAll('.trow'),function(r){r.addEventListener('click',function(ev){if(ev.target.hasAttribute('data-earn'))return;state.sel=+r.getAttribute('data-id');saveState();render();});});
Array.prototype.forEach.call(document.querySelectorAll('[data-earn]'),function(c){c.addEventListener('click',function(ev){ev.stopPropagation();toggleEarned(+c.getAttribute('data-earn'));});});
bindDetail(sel);}
function detailHtml(t){var earn=state.earned.indexOf(t.id)>=0;var hid=isHidden(t);var parts=['Trophy '+t.id+' of 55',t.grade,'stage '+t.stage,t.group];if(hid)parts.push('hidden on PSN until earned');else if(t.type!==t.group)parts.push(t.type);var h='<h2>#'+t.id+' '+(hid?'Hidden trophy':esc(t.name))+'</h2><p class="kv">'+parts.join(' · ')+'</p><label><input type="checkbox" id="dEarn"'+(earn?' checked':'')+'> Mark earned</label>'+flagsOf(t);
if(hid){h+='<p class="desc">Hidden trophy — the name and guide stay hidden while Spoilers is on. Reveal it, or earn it, to see the guide.</p><button class="reveal" id="dReveal">Reveal this one</button>';return h;}
h+='<p class="desc">Official description: “'+esc(t.description)+'”</p>';
if(t.missable==='possibly'){h+='<div class="missbox"><b>MISSABLE? — YES, possibly. LAST CHANCE: '+(LAST_CHANCE[t.id]||'start the chain when it appears.')+'</b></div>';}
else if(t.missable==='watch'){h+='<div class="missbox"><b>AT RISK — '+esc(LAST_CHANCE[t.id]||'start when it appears.')+'</b></div>';}
if(t.unconfirmed)h+='<p><span class="flag unc">UNCONFIRMED</span> This trigger is not pinned down by every source — try the method below and keep it on watch.</p>';
h+='<h3>IN SHORT</h3>'+t.intro.map(function(c){return '<p>'+esc(c.text)+' <span class="cite">'+cite(c.src)+'</span></p>';}).join('');
var c=countOf(t);if(c)h+='<h3>YOUR COUNT</h3><div class="stepper"><button data-bump="-1">−</button><b>'+c.cur+' / '+c.target+' '+esc(c.unit)+'</b><button data-bump="1">+</button></div>';
h+='<h3>HOW TO GET IT</h3><ol class="steps">'+t.steps.map(function(s){return '<li>'+esc(s.text)+' <span class="cite">'+cite(s.src)+'</span></li>';}).join('')+'</ol>';
var d=t.dispute?D.filter(function(x){return x.id===t.dispute;})[0]:null;
if(d){var callSrc=[];d.versions.forEach(function(v){v.src.forEach(function(n){if(callSrc.indexOf(n)<0)callSrc.push(n);});});callSrc.sort(function(a,b){return a-b;});
h+='<div class="diffbox"><h3>SOURCES DIFFER</h3>'+d.versions.map(function(v){return '<div class="ver"><b>'+v.label+'</b> — '+esc(v.text)+' <span class="cite">'+cite(v.src)+'</span></div>';}).join('')+'<div class="call"><b>Our call:</b> '+esc(d.call)+' <span class="cite">'+cite(callSrc)+'</span></div></div>';}
h+='<h3>TIP</h3>'+t.tips.map(function(s){return '<p>'+esc(s.text)+' <span class="cite">'+cite(s.src)+'</span></p>';}).join('');
h+='<h3>SOURCES</h3><p class="kv">'+t.sources.map(function(n){var s=S[n-1];return '['+n+'] '+esc(s?s.title:'')+' — '+esc(s?s.site:'');}).join(' · ')+'</p>';
return h;}
function bindDetail(t){var e=$('#dEarn');if(e)e.addEventListener('change',function(){toggleEarned(t.id);});
var r=$('#dReveal');if(r)r.addEventListener('click',function(){state.revealed.push(t.id);saveState();render();});
Array.prototype.forEach.call(document.querySelectorAll('[data-bump]'),function(b){b.addEventListener('click',function(){bumpCount(t,+b.getAttribute('data-bump'));});});}
function renderRoadmap(){var h='<h2>ROADMAP — 60–80 h of story, then ~100 h of cleanup</h2>';
STAGES.forEach(function(st){var inStage=T.filter(function(t){return t.stage===st.n;});var en=inStage.filter(function(t){return state.earned.indexOf(t.id)>=0;}).length;
h+='<div class="stage"><h2>Stage '+st.n+' — '+st.name+' · '+st.hours+' · '+en+'/'+inStage.length+' earned</h2><p>'+st.note+'</p><div class="chips">'+inStage.map(function(t){return '<button data-sel="'+t.id+'" class="'+(state.earned.indexOf(t.id)>=0?'on':'')+'">#'+t.id+' '+esc(t.name)+'</button>';}).join('')+'</div></div>';});
h+='<div class="stage"><h2>GROUND RULES — agreed by every source</h2><div class="rules"><p><b>One playthrough is enough.</b> 10 of 55 guides say the same, so keep one save per chapter and no mission replay is needed. <span class="cite">[1][2][9][46][61]</span></p><p><b>Play all of the side content when it appears.</b> 10 of 55 guides say it — if you play the missions and side content on the go, you will not need to grind a chain later. <span class="cite">[1][2][9][46][61]</span></p><p><b>Leave cheats off.</b> Every guide says cheats block progress toward trophies — no cheat is safe. <span class="cite">[1][23][61]</span></p><p><b>Medals, relationship progress and Criminal Profile do not gate trophies.</b> Keep them for the 100% checklist, not for the platinum. <span class="cite">[1][25][46]</span></p></div></div>';
var watch=T.filter(function(t){return t.missable;});
h+='<div class="stage"><h2>MISSABLE WATCH — 10 flagged · 45 safe after the credits</h2><p>Two are possibly missable, eight are at risk. Open a trophy to see its last chance.</p><div class="chips">'+watch.map(function(t){return '<button data-sel="'+t.id+'">#'+t.id+' '+esc(t.name)+'</button>';}).join('')+'</div></div>';
h+='<div class="stage"><h2>HOW THIS GUIDE WAS BUILT</h2><p>Built from 65 pages across 22 sites, read 20 Nov 2026. Every claim in the guide is cited; 466 of 490 claims are backed by two or more sources. Where the sources disagree, the guide shows both sides and states its call. PSNProfiles and TrueAchievements refused full access and are not cited.</p><p>One trophy a day? — No. Follow the roadmap: story first, then the 100% checklist, then the one-offs. The platinum lands at roughly 200 hours.</p></div>';
$('#view').innerHTML=h;
Array.prototype.forEach.call(document.querySelectorAll('[data-sel]'),function(b){b.addEventListener('click',function(){state.view='ledger';state.sel=+b.getAttribute('data-sel');saveState();render();});});}
function renderMissables(){var groups=[['possibly','POSSIBLY MISSABLE — 2'],['watch','AT RISK — 8'],['safe','SAFE AFTER THE CREDITS — 45']];
var h='<h2>MISSABLES — 10 flagged · 45 safe after the credits</h2><p>Two are possibly missable, eight are at risk — each one shows its last chance. Everything else can wait until free-roam.</p>';
groups.forEach(function(g){var list=g[0]==='safe'?T.filter(function(t){return !t.missable;}):T.filter(function(t){return t.missable===g[0];});
h+='<div class="stage"><h2>'+g[1]+'</h2><div class="chips">'+list.map(function(t){return '<button data-sel="'+t.id+'">#'+t.id+' '+esc(t.name)+'</button>';}).join('')+'</div></div>';});
$('#view').innerHTML=h;
Array.prototype.forEach.call(document.querySelectorAll('[data-sel]'),function(b){b.addEventListener('click',function(){state.view='ledger';state.sel=+b.getAttribute('data-sel');saveState();render();});});}
function renderMatrix(){var stats=srcStats().slice().sort(function(a,b){return b.claims-a.claims;}).slice(0,10);
var cols=stats.map(function(s){return s.n;});
var h='<h2>SOURCE MATRIX — 55 trophies × the 10 most-cited pages</h2><p>A cell holds the number of that guide\u2019s claims that cite the page; a dot means the page is cited in the summary only.</p><table class="matrix"><thead><tr><th class="nm">Trophy</th>'+stats.map(function(s){return '<th>['+s.n+']</th>';}).join('')+'<th>Flags</th></tr></thead><tbody>';
T.forEach(function(t){h+='<tr><td class="nm">#'+t.id+' '+esc(t.name)+'</td>';
cols.forEach(function(n){var cnt=0;claimsOf(t).forEach(function(c){if(c.src.indexOf(n)>=0)cnt++;});var dd=t.dispute?D.filter(function(x){return x.id===t.dispute;})[0]:null;if(dd)dd.versions.forEach(function(v){if(v.src.indexOf(n)>=0)cnt++;});
if(cnt>0)h+='<td class="hit">'+cnt+'</td>';else if(t.sources.indexOf(n)>=0)h+='<td class="dot">·</td>';else h+='<td></td>';});
var fl=[];if(t.dispute)fl.push('DIFFER');if(t.unconfirmed)fl.push('OPEN');h+='<td>'+fl.join(' ')+'</td></tr>';});
h+='</tbody></table><p class="kv">'+stats.map(function(s){return '['+s.n+'] '+esc(s.title)+' — '+esc(s.site);}).join(' · ')+'</p>';
$('#view').innerHTML=h;}
function renderLedger100(){var logged=LEDGER.filter(function(l){return !l.money;}).reduce(function(a,l){return a+(state.counts[l.key]||0);},0);
var rows=LEDGER.map(function(l){var cur=state.counts[l.key]||0;var pct=Math.min(100,Math.round(cur/l.target*100));var val=l.money?('$'+cur.toLocaleString('en-US')+' / $'+l.target.toLocaleString('en-US')):(cur+' / '+l.target);
return '<div class="crow"><span class="lb">'+esc(l.label)+' <small>'+esc(l.sub)+'</small></span><span class="cbar"><i style="width:'+pct+'%"></i></span><span class="cv">'+val+'</span><span class="stepper"><button data-k="'+l.key+'" data-d="-1">−</button><button data-k="'+l.key+'" data-d="1">+</button></span></div>';}).join('');
var h='<h2>100% LEDGER — '+logged+' collectibles logged</h2><p>Counts from your session. These are the numbers the checklist grinds — they are saved in this browser, and they export with your progress.</p><div class="col counters">'+rows+'</div>';
h+='<div class="col"><h2>15 SAVE SLOTS</h2><p>One save per chapter, plus a save before the final mission — the 10-saves rule, in order.</p><div class="slots">'+SAVE_SLOTS.map(function(s){return '<span>'+esc(s)+'</span>';}).join('')+'</div></div>';
h+='<div class="col"><h2>DISAGREEMENTS — 24 disputes, both sides shown</h2>'+D.map(function(d){var t=byId[d.trophy];var cs=[];d.versions.forEach(function(v){v.src.forEach(function(n){if(cs.indexOf(n)<0)cs.push(n);});});cs.sort(function(a,b){return a-b;});return '<div class="disp"><b>'+d.id+' — #'+d.trophy+' '+esc(t?t.name:'')+':</b> '+esc(d.title)+'<br>'+d.versions.map(function(v){return '<div class="ver"><b>'+v.label+'</b> — '+esc(v.text)+' <span class="cite">'+cite(v.src)+'</span></div>';}).join('')+'<div class="call"><b>Our call:</b> '+esc(d.call)+' <span class="cite">'+cite(cs)+'</span></div></div>';}).join('')+'</div>';
h+='<div class="io"><div class="col"><h2>EXPORT</h2><p>Your progress downloads as a file, and it is also copied to the clipboard.</p><button id="bExport2">Export progress</button><h2>IMPORT</h2><p>Paste a saved progress file here, or pick the file.</p><textarea id="importBox" placeholder="Paste exported progress JSON…"></textarea><br><input type="file" id="importFile" accept="application/json"><br><button id="bImport2">Import</button></div><div class="col"><h2>SAVED STATE</h2><p class="kv">Progress lives in this browser only — nothing leaves it unless you export. Earned: '+state.earned.length+'/55 · counters: '+Object.keys(state.counts).length+' tracked.</p><p id="importMsg"></p></div></div>';
$('#view').innerHTML=h;
Array.prototype.forEach.call(document.querySelectorAll('.counters [data-k]'),function(b){b.addEventListener('click',function(){var k=b.getAttribute('data-k');var l=LEDGER.filter(function(x){return x.key===k;})[0];var d=+b.getAttribute('data-d');var step=l.money?1000:1;var v=Math.max(0,Math.min(l.target,(state.counts[k]||0)+d*step));state.counts[k]=v;saveState();render();});});
$('#bExport2').addEventListener('click',doExport);
$('#bImport2').addEventListener('click',function(){doImport($('#importBox').value);});
var f=$('#importFile');if(f)f.addEventListener('change',function(ev){var file=ev.target.files[0];if(!file)return;var r=new FileReader();r.onload=function(){doImport(String(r.result));};r.readAsText(file);});}
function doExport(){var data={earned:state.earned,counts:state.counts,spoiler:state.spoiler,revealed:state.revealed};var txt=JSON.stringify(data,null,2);try{var blob=new Blob([txt],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='leonida-files-progress.json';a.click();}catch(e){}
try{if(navigator.clipboard)navigator.clipboard.writeText(txt);}catch(e){}
flash('Exported '+state.earned.length+' earned · '+Object.keys(state.counts).length+' counters.');}
function doImport(txt){try{var d=JSON.parse(txt);if(!d||!Array.isArray(d.earned))throw new Error('no earned list');state.earned=d.earned.filter(function(n){return n>=1&&n<=55;});if(d.counts)Object.keys(d.counts).forEach(function(k){state.counts[k]=+d.counts[k];});if(typeof d.spoiler==='boolean')state.spoiler=d.spoiler;if(Array.isArray(d.revealed))state.revealed=d.revealed;saveState();render();var m=$('#importMsg');if(m)m.textContent='Imported '+state.earned.length+' earned trophies.';}catch(e){var m2=$('#importMsg');if(m2)m2.textContent='Import failed — that is not a LEONIDA FILES export.';flash('Import failed — not a LEONIDA FILES export.');}}
function copyLink(){var hash='#view='+state.view+'&t='+state.sel+'&earned='+state.earned.map(function(id){return 't'+String(id).padStart(2,'0');}).join(',')+'&counts='+Object.keys(state.counts).map(function(k){return k+':'+state.counts[k];}).join(',');var url=location.href.split('#')[0]+hash;try{if(navigator.clipboard)navigator.clipboard.writeText(url);flash('Progress link copied.');}catch(e){flash('Copy failed — select and copy from the address bar.');}}
Promise.all([fetch('data/trophies.json').then(function(r){return r.json();}),fetch('data/sources.json').then(function(r){return r.json();}),fetch('data/disputes.json').then(function(r){return r.json();})]).then(function(res){T=res[0].trophies;S=res[1].sources;D=res[2].disputes;T.forEach(function(t){byId[t.id]=t;});state=loadState();applyHash();if(!byId[state.sel])state.sel=28;render();}).catch(function(e){document.getElementById('view').innerHTML='<p>Could not load the guide data. Check the app folder.</p>';});
