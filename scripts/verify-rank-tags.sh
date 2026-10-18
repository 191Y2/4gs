#!/bin/bash
# One-shot verification of OCTAGONHQ rank tags on event cards (EventsTab).
# Runs a throwaway dev server on :3100, drives agent-browser, then cleans up.
set -u
cd /home/z/my-project

PORT=3100
npx next dev -p $PORT > /tmp/ranktag-dev.log 2>&1 &
DEV_PID=$!

# wait for server
for i in $(seq 1 60); do
  curl -s -o /dev/null "http://127.0.0.1:$PORT" && break
  sleep 1
done
echo "== server up =="

agent-browser open "http://127.0.0.1:$PORT" || { kill $DEV_PID; exit 1; }
agent-browser wait --load networkidle
agent-browser wait 2500

# go to EVENTS tab
agent-browser eval "(() => { const bs=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='EVENTS'); bs[bs.length-1].click(); return 'tab-clicked'; })()"
agent-browser wait 2000

# create the week's event (fresh localStorage -> CREATE FIGHT NIGHT 1)
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/^CREATE /i.test(x.textContent.trim())); if(!b) return 'no-create-btn'; b.click(); return 'created'; })()"
agent-browser wait 1500

# open ADD BOUT on main card
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='ADD BOUT'); b[0].click(); return 'add-open'; })()"
agent-browser wait 1200

pick_fighter() { # $1 = corner button text, $2 = search query
  agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='$1'); b[b.length-1].click(); return 'picker-open'; })()"
  agent-browser wait 900
  # focus + fill search
  agent-browser eval "(() => { const t=Array.from(document.querySelectorAll('input')).find(i=>/Search name/.test(i.placeholder)); if(t){ t.focus(); return 'focused'; } return 'no-input'; })()"
  local REF
  REF=$(agent-browser snapshot -i -c 2>/dev/null | rg -o 'textbox "Search name[^"]*" \[ref=e[0-9]+\]' | rg -o 'e[0-9]+' | head -1)
  agent-browser fill "@$REF" "$2"
  agent-browser wait 700
  # click first fighter row inside the dialog
  agent-browser eval "(() => { const dlg=document.querySelector('[role=dialog]'); const b=Array.from(dlg.querySelectorAll('button')).find(x=>/$2/i.test(x.textContent)&&!/CLOSE|Search/i.test(x.textContent)); if(b){ b.click(); return 'picked'; } return 'no-row'; })()"
  agent-browser wait 900
}

pick_fighter "RED CORNER" "Aspinall"
pick_fighter "BLUE CORNER" "Gane"

echo "== add-bout preview cards =="
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>/HQ ·/.test(x.textContent)&&/(Aspinall|Gane)/.test(x.textContent)); return b.map(x=>x.textContent.trim().replace(/\s+/g,' ')).join(' || ') || 'none'; })()"

# add the bout to the card, then inspect the BoutRow
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>x.textContent.trim()==='ADD BOUT'&&/flex-1/.test(x.className)); if(!b){ const alt=Array.from(document.querySelectorAll('button')).find(x=>/ADD BOUT/.test(x.textContent)&&x.className.includes('red-grad')); if(alt){alt.click(); return 'added-alt';} return 'no-add-btn'; } b.click(); return 'added'; })()"
agent-browser wait 1500

echo "== bout row on the card =="
agent-browser eval "(() => { const row=Array.from(document.querySelectorAll('div')).find(d=>/Aspinall/.test(d.textContent)&&/Gane/.test(d.textContent)&&/HQ ·/.test(d.textContent)&&d.querySelectorAll('button').length>=2); return row ? row.textContent.trim().replace(/\s+/g,' ').slice(0,300) : 'row-not-found'; })()"

echo "== rank chips present =="
agent-browser eval "(() => { const chips=Array.from(document.querySelectorAll('span')).filter(s=>/^(C|UNRANKED|#([1-9]|1[0-5]))$/.test(s.textContent.trim())&&s.className.includes('shrink-0')); return 'count='+chips.length+' :: '+chips.map(c=>c.textContent.trim()).join(','); })()"

echo "== screenshot =="
agent-browser screenshot /home/z/my-project/rank-tags-check.png

kill $DEV_PID 2>/dev/null
echo "== done, server stopped =="
