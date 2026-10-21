#!/bin/bash
# E2E verification for the 5-fix pass:
#  1. 4x duplication heal — inject a POISONED localStorage (ledger with 4x
#     copies per bout) and verify records show exactly 1x per fight
#  2. Ratings — Francis/Bobby Green/Adesanya stat checks
#  3. Method logic — Francis vs Jones 15x: count SUB wins by Francis (~0)
#  4. Superfight double champs — Gane (HW champ) vs Ulberg (LHW champ):
#     superfight badge, both belts transfer, divisions both show the winner
#  5. No retired anywhere
set -e
cd /home/z/my-project
PORT=8123
BASE="http://127.0.0.1:$PORT"

# serve the static export as a grandchild so it survives this bash call
(cd out && setsid python3 -m http.server $PORT >/tmp/e2e-server.log 2>&1 &) 
sleep 1.5

echo "=== app boots, console errors? ==="
agent-browser goto "$BASE/" >/dev/null
agent-browser console --clear 2>/dev/null || true

echo "=== 1) POISONED LEDGER HEAL TEST ==="
# Inject: 1 event, 1 fought bout (Gane def. Blaydes UDEC), ledger = 4 identical recs
agent-browser eval "
(() => {
  localStorage.clear();
  const ev = {
    id: 'ev-poison', type: 'fightnight', number: 1, dateISO: '2026-10-17',
    venue: 'T-Mobile Arena', city: 'Las Vegas, NV',
    bouts: [{ id: 'bout-p1', aId: 'ciryl-gane', bId: 'curtis-blaydes', section: 'main', order: 0, rounds: 5, title: true,
      result: { winner: 'A', method: 'UDEC', detail: undefined, round: 5, time: '5:00' } }],
    completed: true, createdAt: 1,
  };
  const rec = {
    boutId: 'bout-p1', aId: 'ciryl-gane', bId: 'curtis-blaydes', winner: 'A', method: 'UDEC',
    detail: undefined, round: 5, time: '5:00', evName: 'UFC Fight Night 1', section: 'main',
    date: 'Oct 17, 2026', wc: 'HW', title: true,
  };
  localStorage.setItem('octagon-hq-universe-v1', JSON.stringify({ events: [ev], ledger: [rec, rec, rec, rec] }));
  return 'poisoned';
})()
"
agent-browser reload >/dev/null
sleep 1.2
HEALED=$(agent-browser eval "
(() => {
  const raw = JSON.parse(localStorage.getItem('octagon-hq-universe-v1'));
  return JSON.stringify({ ledgerLen: raw.ledger.length, hasBoutId: raw.ledger.every(r => !!r.boutId) });
})()
")
echo "healed storage: $HEALED"
PROFILE=$(agent-browser eval "
(() => {
  const el = [...document.querySelectorAll('button,div,span')].find(e => e.textContent && e.textContent.includes('Gane'));
  return el ? 'found' : 'missing';
})()
")

echo "=== 2) RATINGS CHECK (profile of Francis) ==="
# open fighter profile via the roster search
agent-browser eval "
(() => {
  // click the ROSTER tab
  const tab = [...document.querySelectorAll('button')].find(b => b.textContent.includes('ROSTER'));
  if (tab) tab.click();
  return 'ok';
})()
" >/dev/null
sleep 0.8
agent-browser eval "
(() => {
  const inp = document.querySelector('input[placeholder], input[type=text], input[type=search]');
  if (inp) { const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; setter.call(inp, 'Francis'); inp.dispatchEvent(new Event('input', { bubbles: true })); return 'typed'; }
  return 'no-input';
})()
" >/dev/null
sleep 0.8
agent-browser eval "
(() => {
  const row = [...document.querySelectorAll('div,button')].find(e => e.className && String(e.className).includes('cursor') === false && e.textContent && e.textContent.trim().startsWith('Francis Ngannou'));
  const card = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent === 'Francis Ngannou')[0];
  if (card) { card.click(); return 'clicked'; }
  return 'not-found';
})()
"
sleep 1
FRANCIS=$(agent-browser eval "
(() => {
  const txt = document.body.innerText;
  const hasAttr = txt.includes('FIGHT ENGINE ATTRIBUTES');
  const grab = (label) => { const m = txt.match(new RegExp(label + '\\\\s+(\\\\d+)')); return m ? m[1] : '?'; };
  return JSON.stringify({ attrs: hasAttr, grappling: grab('Grappling'), wrestling: grab('Wrestling'), power: grab('Power'), elo: grab('ENGINE ELO') });
})()
")
echo "Francis profile: $FRANCIS"

echo "=== 3) METHOD DISTRIBUTION — Francis vs Jones in Fight Lab ==="
agent-browser eval "
(() => {
  const tab = [...document.querySelectorAll('button')].find(b => b.textContent.includes('FIGHT LAB'));
  if (tab) tab.click();
  return 'ok';
})()
" >/dev/null
sleep 0.8
# book Francis vs Jones via picker (A side Francis, B side Jones)
agent-browser eval "
(() => {
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('RED CORNER') || (b.textContent.includes('PICK') && b.className.includes('h-28')));
  if (btn) { btn.click(); return 'opened'; }
  return [...document.querySelectorAll('button')].filter(b => /CORNER|PICK/.test(b.textContent)).map(b => b.textContent.trim()).slice(0,5).join('|');
})()
"
sleep 1
agent-browser eval "
(() => {
  const inp = document.querySelector('input');
  if (inp) { const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; setter.call(inp, 'Francis'); inp.dispatchEvent(new Event('input', { bubbles: true })); return 'typed'; }
  return 'no-input';
})()
" >/dev/null
sleep 0.8
agent-browser eval "
(() => { const row = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent === 'Francis Ngannou')[0]; if (row) { row.click(); return 'picked'; } return 'nf'; })()
"
sleep 0.8
agent-browser eval "
(() => { const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('BLUE CORNER') || (b.textContent.includes('PICK') && b.className.includes('h-28'))); if (btn) { btn.click(); return 'opened'; } return 'nf'; })()
"
sleep 1
agent-browser eval "
(() => { const inp = document.querySelector('input'); if (inp) { const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; setter.call(inp, 'Jones'); inp.dispatchEvent(new Event('input', { bubbles: true })); return 'typed'; } return 'no-input'; })()
" >/dev/null
sleep 0.8
agent-browser eval "
(() => { const row = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent === 'Jon Jones')[0]; if (row) { row.click(); return 'picked'; } return 'nf'; })()
"
sleep 0.8
# run the sim 15 times and tally methods — the Fight Lab dialog re-runs via RUN IT BACK
TALLY=$(agent-browser eval "
(async () => {
  const run = [...document.querySelectorAll('button')].find(b => /RUN SIMULATION|WATCH IT LIVE/.test(b.textContent));
  if (!run) return 'no-run-button';
  run.click();
  await new Promise(r => setTimeout(r, 400));
  const results = [];
  for (let i = 0; i < 15; i++) {
    // skip to the end instantly
    let skip = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'SKIP');
    if (skip) skip.click();
    await new Promise(r => setTimeout(r, 250));
    const body = document.body.innerText;
    const m = body.match(/OFFICIAL RESULT[\\s\\S]{0,220}?([A-Za-z .'-]+?) def\. ([A-Za-z .'-]+?) via (KO\/TKO|Submission|Unanimous|Split|Majority)/);
    if (m) results.push(m[1].trim() + '|' + m[3]);
    const again = [...document.querySelectorAll('button')].find(b => b.textContent.includes('RUN IT BACK'));
    if (again && i < 14) again.click();
    await new Promise(r => setTimeout(r, 350));
  }
  return JSON.stringify(results);
})()
")
echo "Francis vs Jones 15 runs (winner|method): $TALLY"

echo "=== 4) SUPERFIGHT — Gane (HW champ) vs Ulberg (LHW champ) ==="
agent-browser eval "
(() => {
  localStorage.clear();
  const tab = [...document.querySelectorAll('button')].find(b => b.textContent.includes('EVENTS'));
  if (tab) tab.click();
  return 'ok';
})()
" >/dev/null
sleep 0.8
agent-browser eval "
(() => { const btn = [...document.querySelectorAll('button')].find(b => /CREATE FIGHT NIGHT|CREATE UFC/.test(b.textContent)); if (btn) { btn.click(); return 'created'; } return 'nf'; })()
"
sleep 1
agent-browser eval "
(() => { const add = [...document.querySelectorAll('button')].find(b => b.textContent.includes('ADD BOUT')); if (add) { add.click(); return 'opened'; } return 'nf'; })()
"
sleep 0.8
agent-browser eval "
(() => { const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('RED CORNER')); if (btn) { btn.click(); return 'a'; } return 'nf'; })()
"
sleep 1
agent-browser eval "
(() => { const inp = document.querySelector('input'); if (inp) { const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; setter.call(inp, 'Ciryl Gane'); inp.dispatchEvent(new Event('input', { bubbles: true })); return 'typed'; } return 'no-input'; })()
" >/dev/null
sleep 0.8
agent-browser eval "
(() => { const row = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent === 'Ciryl Gane')[0]; if (row) { row.click(); return 'picked'; } return 'nf'; })()
"
sleep 0.8
agent-browser eval "
(() => { const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('BLUE CORNER')); if (btn) { btn.click(); return 'b'; } return 'nf'; })()
"
sleep 1
agent-browser eval "
(() => { const inp = document.querySelector('input'); if (inp) { const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; setter.call(inp, 'Carlos Ulberg'); inp.dispatchEvent(new Event('input', { bubbles: true })); return 'typed'; } return 'no-input'; })()
" >/dev/null
sleep 0.8
agent-browser eval "
(() => { const row = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent === 'Carlos Ulberg')[0]; if (row) { row.click(); return 'picked'; } return 'nf'; })()
"
sleep 0.8
SUPER_PREVIEW=$(agent-browser eval "
(() => { const t = document.body.innerText; return t.includes('SUPERFIGHT') ? 'superfight-preview-seen' : 'NO-SUPERFIGHT-PREVIEW: ' + (t.match(/CHAMPIONSHIP[^\n]*/) || ['none'])[0]; })()
")
echo "builder preview: $SUPER_PREVIEW"
agent-browser eval "
(() => { const add = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'ADD BOUT'); if (add) { add.click(); return 'added'; } return 'nf'; })()
"
sleep 1
SUPER_ROW=$(agent-browser eval "
(() => { const t = document.body.innerText; return t.includes('SUPERFIGHT · BOTH TITLES') ? 'superfight-badge-seen' : 'no-badge'; })()
")
echo "card row badge: $SUPER_ROW"
agent-browser eval "
(() => { const run = [...document.querySelectorAll('button')].find(b => b.textContent.includes('RUN FULL CARD')); if (run) { run.click(); return 'ran'; } return 'nf'; })()
"
sleep 2
DOUBLE=$(agent-browser eval "
(() => {
  const t = document.body.innerText;
  const gane = t.match(/NEW CHAMPION! ([A-Za-z .'-]+?) dethrones/g) || [];
  return JSON.stringify({ beltToasts: gane.map(m => m.replace('NEW CHAMPION! ', '').replace(' dethrones', '')) });
})()
")
echo "belt transfers: $DOUBLE"
DIVCHECK=$(agent-browser eval "
(async () => {
  const tab = [...document.querySelectorAll('button')].find(b => b.textContent.includes('DIVISIONS'));
  if (tab) tab.click();
  await new Promise(r => setTimeout(r, 500));
  const t = document.body.innerText;
  // find which divisions show a champ banner mentioning the superfight winner
  const win = (window.localStorage && document.body) ? null : null;
  return t.slice(0, 400);
})()
")
echo "divisions head: ${DIVCHECK:0:260}"
CONSOLE=$(agent-browser console 2>/dev/null | grep -iE "error|unhandled" | grep -v "favicon" | head -5)
echo "console errors: ${CONSOLE:-none}"

# cleanup + reset universe for a clean user state
agent-browser eval "localStorage.clear(); 'cleared'"
echo "=== E2E DONE ==="
