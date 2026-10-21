#!/bin/bash
# Title-fight fix E2E on static build:
#  1. champ Gaethje vs RETIRED legend Khabib -> must flag TITLE + 5 rounds
#  2. second title fight on same card (Volkanovski vs Aldo) -> multiple titles OK
#  3. run card -> belt can move to a retired legend
set -u
cd /home/z/my-project

PORT=8095
(cd out && python3 -m http.server $PORT > /tmp/titlefix-serve.log 2>&1 &)
SRV=$!
sleep 2

agent-browser open "http://127.0.0.1:$PORT/" || { kill $SRV; exit 1; }
agent-browser wait --load networkidle
agent-browser wait 2500

agent-browser eval "(() => { const bs=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='EVENTS'); bs[bs.length-1].click(); return 'tab'; })()"
agent-browser wait 1800
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/^CREATE /i.test(x.textContent.trim())); b.click(); return 'created'; })()"
agent-browser wait 1500

add_bout() { # $1 red search, $2 blue search
  agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='ADD BOUT'); b[0].click(); return 'add'; })()"
  agent-browser wait 1200
  pick_corner "RED CORNER" "$1"
  pick_corner "BLUE CORNER" "$2"
  agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/ADD BOUT/.test(x.textContent)&&/red-grad/.test(x.className)); b.click(); return 'added'; })()"
  agent-browser wait 1400
}
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

echo "== booking bout 1: Gaethje (champ) vs Khabib (retired legend) =="
add_bout "Gaethje" "Khabib"

echo "== add-bout title preview for bout 2 (re-open panel state) =="
agent-browser eval "(() => { const rows=Array.from(document.querySelectorAll('div')).filter(d=>/TITLE/.test(d.textContent)&&/Gaethje/.test(d.textContent)); const titleChips=Array.from(document.querySelectorAll('span')).filter(s=>s.textContent.trim()==='TITLE'); return 'title-chips='+titleChips.length; })()"

echo "== booking bout 2: Volkanovski (champ) vs Aldo (retired legend) =="
add_bout "Volkanovski" "Aldo"

echo "== card state: two TITLE fights on one card? =="
agent-browser eval "(() => { const t=document.body.innerText; const titleCount=(t.match(/TITLE/g)||[]).length; const hasGaethje=/Gaethje/.test(t)&&/Khabib/.test(t); const hasVolk=/Volkanovski/.test(t)&&/Aldo/.test(t); return 'title-badges='+titleCount+' gaethje-khabib='+hasGaethje+' volk-aldo='+hasVolk; })()"

echo "== run full card =="
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/RUN FULL CARD/.test(x.textContent)); b.click(); return 'run'; })()"
agent-browser wait 4000

echo "== results =="
agent-browser eval "(() => { const rows=Array.from(document.querySelectorAll('button')).filter(x=>/def\./.test(x.textContent)); return rows.map(r=>r.textContent.trim().replace(/\s+/g,' ')).join(' || ').slice(0,400); })()"

echo "== LW + FW champs after card (Divisions tab) =="
agent-browser eval "(() => { const bs=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='DIVISIONS'); bs[bs.length-1].click(); return 'div'; })()"
agent-browser wait 2000
agent-browser eval "(() => { const t=document.body.innerText.replace(/\s+/g,' '); const lw=t.match(/LIGHTWEIGHT.{0,220}/)?.[0]||'?'; const fw=t.match(/FEATHERWEIGHT.{0,220}/)?.[0]||'?'; return 'LW: '+lw.slice(0,200)+' || FW: '+fw.slice(0,200); })()"

echo "== console errors =="
agent-browser errors 2>/dev/null | head -5

kill $SRV 2>/dev/null
echo "== done =="
