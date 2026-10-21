#!/bin/bash
# Title-fight + all-prime E2E on the static build:
#  1. TWO title fights on ONE card: Gaethje(LW champ) vs Khabib(legend) +
#     Volkanovski(FW champ) vs Aldo(legend) — both must show TITLE
#  2. run card -> belt can move to legends; champs update
#  3. reload persistence (replay, no retired guard)
#  4. no RETIRED chips anywhere; everyone prime
set -u
cd /home/z/my-project

PORT=8097
(cd out && python3 -m http.server $PORT > /tmp/prime-serve.log 2>&1 &)
SRV=$!
sleep 2

agent-browser open "http://127.0.0.1:$PORT/" || { kill $SRV; exit 1; }
agent-browser wait --load networkidle
agent-browser wait 2500

agent-browser eval "(() => { const bs=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='EVENTS'); bs[bs.length-1].click(); return 'tab'; })()"
agent-browser wait 1800
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/^CREATE /i.test(x.textContent.trim())); b.click(); return 'created'; })()"
agent-browser wait 1500

pick_corner() { # $1 corner, $2 query
  agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='$1'); b[b.length-1].click(); return 'open'; })()"
  agent-browser wait 900
  agent-browser eval "(() => { const t=Array.from(document.querySelectorAll('input')).find(i=>/Search name/.test(i.placeholder)); t.focus(); return 'focus'; })()"
  REF=$(agent-browser snapshot -i -c 2>/dev/null | rg -o 'textbox "Search name[^"]*" \[ref=e[0-9]+\]' | rg -o 'e[0-9]+' | head -1)
  agent-browser fill "@$REF" "$2"
  agent-browser wait 600
  agent-browser eval "(() => { const dlg=document.querySelector('[role=dialog]'); const b=Array.from(dlg.querySelectorAll('button')).find(x=>/$2/i.test(x.textContent)&&/OVR/.test(x.textContent)); b.click(); return 'picked'; })()"
  agent-browser wait 900
}
add_bout() { # $1 red query, $2 blue query
  agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='ADD BOUT'); b[0].click(); return 'add'; })()"
  agent-browser wait 1200
  pick_corner "RED CORNER" "$1"
  pick_corner "BLUE CORNER" "$2"
  agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/ADD BOUT/.test(x.textContent)&&/red-grad/.test(x.className)); b.click(); return 'added'; })()"
  agent-browser wait 1400
}

echo "== bout 1: Gaethje (champ) vs Khabib (legend) =="
add_bout "Gaethje" "Khabib"
echo "== bout 2: Volkanovski (champ) vs Aldo (legend) =="
add_bout "Volkanovski" "Aldo"

echo "== card title badges (expect 2) =="
agent-browser eval "(() => { const chips=Array.from(document.querySelectorAll('span')).filter(s=>s.textContent.trim()==='TITLE'); return 'title-badges='+chips.length; })()"

echo "== retired chips anywhere (expect 0) =="
agent-browser eval "(() => { const chips=Array.from(document.querySelectorAll('span,div')).filter(s=>s.textContent.trim()==='RETIRED'); return 'retired-chips='+chips.length; })()"

echo "== run full card =="
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/RUN FULL CARD/.test(x.textContent)); b.click(); return 'run'; })()"
agent-browser wait 4000

echo "== results =="
agent-browser eval "(() => { const rows=Array.from(document.querySelectorAll('button')).filter(x=>/def\./.test(x.textContent)); return rows.map(r=>r.textContent.trim().replace(/\s+/g,' ')).join(' || ').slice(0,400); })()"

echo "== champs after card (Divisions) =="
agent-browser eval "(() => { const bs=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='DIVISIONS'); bs[bs.length-1].click(); return 'div'; })()"
agent-browser wait 2000
agent-browser eval "(() => { const t=document.body.innerText.replace(/\s+/g,' '); const lw=t.match(/LIGHTWEIGHT.{0,150}/)?.[0]||'?'; const fw=t.match(/FEATHERWEIGHT.{0,150}/)?.[0]||'?'; return 'LW: '+lw.slice(0,140)+' || FW: '+fw.slice(0,140); })()"

echo "== reload persistence =="
agent-browser reload
agent-browser wait --load networkidle
agent-browser wait 2500
agent-browser eval "(() => { const bs=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='DIVISIONS'); bs[bs.length-1].click(); return 'div-again'; })()"
agent-browser wait 2000
agent-browser eval "(() => { const t=document.body.innerText.replace(/\s+/g,' '); const lw=t.match(/LIGHTWEIGHT.{0,150}/)?.[0]||'?'; const fw=t.match(/FEATHERWEIGHT.{0,150}/)?.[0]||'?'; return 'AFTER-RELOAD LW: '+lw.slice(0,140)+' || FW: '+fw.slice(0,140); })()"

echo "== console errors =="
agent-browser errors 2>/dev/null | head -5

kill $SRV 2>/dev/null
echo "== done =="
