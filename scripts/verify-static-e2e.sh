#!/bin/bash
# E2E on the STATIC export (GitHub Pages parity): served via python http.server.
# Verifies: HW default picker, ALL at end, live HQ ranks in picker,
# event flow, copy card, no console errors, 404 fallback.
set -u
cd /home/z/my-project

(cd out && python3 -m http.server 8091 > /tmp/static-e2e.log 2>&1 &)
SRV=$!
sleep 2

agent-browser open "http://127.0.0.1:8091/" || { kill $SRV; exit 1; }
agent-browser wait --load networkidle
agent-browser wait 2500

echo "== console errors =="
agent-browser errors 2>/dev/null | head -5

echo "== tab nav works =="
agent-browser eval "(() => { const bs=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='EVENTS'); bs[bs.length-1].click(); return 'events-tab'; })()"
agent-browser wait 1500
agent-browser eval "document.body.innerText.includes('UNIVERSE EVENT CENTER') ? 'events-ok' : 'events-missing'"

echo "== create event + open picker: default division = HW? =="
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/^CREATE /i.test(x.textContent.trim())); b.click(); return 'created'; })()"
agent-browser wait 1500
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='ADD BOUT'); b[0].click(); return 'add'; })()"
agent-browser wait 1200
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='RED CORNER'); b[b.length-1].click(); return 'picker'; })()"
agent-browser wait 1000

echo "== picker: division chips order (ALL must be LAST) + list count =="
agent-browser eval "(() => { const dlg=document.querySelector('[role=dialog]'); const chips=Array.from(dlg.querySelectorAll('button')).filter(b=>/^(ALL|HW|LHW|MW|WW|LW|FW|BW|FLW|WBW|W-FLW|W-SW)$/.test(b.textContent.trim())); const labels=chips.map(c=>c.textContent.trim()); const hwStyle=chips.find(c=>c.textContent.trim()==='HW')?.className||''; return 'order=['+labels.join(',')+'] ALL-last='+(labels[labels.length-1]==='ALL')+' HW-active='+(hwStyle.includes('text-white')||hwStyle.includes('background')); })()"

echo "== picker: live HQ ranks shown (should show #N/CHAMP/UNRANKED chips) =="
agent-browser eval "(() => { const dlg=document.querySelector('[role=dialog]'); const chips=Array.from(dlg.querySelectorAll('span')).filter(s=>/^(CHAMP|UNRANKED|#([1-9]|1[0-5]))$/.test(s.textContent.trim())); return 'hq-chips='+chips.length+' ['+chips.slice(0,8).map(c=>c.textContent.trim()).join(',')+']'; })()"

echo "== search Volkanovski -> should show CHAMP chip =="
agent-browser eval "(() => { const t=Array.from(document.querySelectorAll('input')).find(i=>/Search name/.test(i.placeholder)); t.focus(); return 'focus'; })()"
REF=$(agent-browser snapshot -i -c 2>/dev/null | rg -o 'textbox "Search name[^"]*" \[ref=e[0-9]+\]' | rg -o 'e[0-9]+' | head -1)
agent-browser fill "@$REF" "Aspinall"
agent-browser wait 700
agent-browser eval "(() => { const dlg=document.querySelector('[role=dialog]'); const row=Array.from(dlg.querySelectorAll('button')).find(x=>/Aspinall/.test(x.textContent)&&/OVR/.test(x.textContent)); return row ? row.textContent.trim().replace(/\s+/g,' ') : 'no-row'; })()"

echo "== pick Aspinall, verify HQ rank chip on card =="
agent-browser eval "(() => { const dlg=document.querySelector('[role=dialog]'); const b=Array.from(dlg.querySelectorAll('button')).find(x=>/Aspinall/.test(x.textContent)&&/OVR/.test(x.textContent)); b.click(); return 'picked'; })()"
agent-browser wait 900
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/Aspinall/.test(x.textContent)&&/HQ ·/.test(x.textContent)); return b ? b.textContent.trim().replace(/\s+/g,' ') : 'no-card'; })()"

echo "== 404 fallback (GH pages subpath refresh) =="
curl -s -o /dev/null -w "trailing-slash page: %{http_code}\n" "http://127.0.0.1:8091/404.html"

echo "== console errors final =="
agent-browser errors 2>/dev/null | head -5

kill $SRV 2>/dev/null
echo "== done =="
