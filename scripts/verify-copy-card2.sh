#!/bin/bash
# Verify COPY CARD on completed (history) events: run the card, open history,
# expand the completed event, click COPY CARD, dump text with result lines.
set -u
cd /home/z/my-project

PORT=3100
npx next dev -p $PORT > /tmp/copycard2-dev.log 2>&1 &
DEV_PID=$!

for i in $(seq 1 60); do
  curl -s -o /dev/null "http://127.0.0.1:$PORT" && break
  sleep 1
done
echo "== server up =="

agent-browser open "http://127.0.0.1:$PORT" || { kill $DEV_PID; exit 1; }
agent-browser wait --load networkidle
agent-browser wait 2500
agent-browser eval "(() => { window.__copied=null; navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); }; return 'stubbed'; })()"

agent-browser eval "(() => { const bs=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='EVENTS'); bs[bs.length-1].click(); return 'tab'; })()"
agent-browser wait 1800
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/^CREATE /i.test(x.textContent.trim())); b.click(); return 'created'; })()"
agent-browser wait 1500

# book one bout: Volkanovski vs Topuria
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='ADD BOUT'); b[0].click(); return 'add'; })()"
agent-browser wait 1200
pick() {
  agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.trim()==='$1'); b[b.length-1].click(); return 'open'; })()"
  agent-browser wait 900
  agent-browser eval "(() => { const t=Array.from(document.querySelectorAll('input')).find(i=>/Search name/.test(i.placeholder)); t.focus(); return 'focus'; })()"
  REF=$(agent-browser snapshot -i -c 2>/dev/null | rg -o 'textbox "Search name[^"]*" \[ref=e[0-9]+\]' | rg -o 'e[0-9]+' | head -1)
  agent-browser fill "@$REF" "$2"
  agent-browser wait 700
  agent-browser eval "(() => { const dlg=document.querySelector('[role=dialog]'); const b=Array.from(dlg.querySelectorAll('button')).find(x=>/$2/i.test(x.textContent)&&!/CLOSE/i.test(x.textContent)); b.click(); return 'picked'; })()"
  agent-browser wait 900
}
pick "RED CORNER" "Volkanovski"
pick "BLUE CORNER" "Topuria"
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/ADD BOUT/.test(x.textContent)&&/red-grad/.test(x.className)); b.click(); return 'added'; })()"
agent-browser wait 1500

# run full card -> completes -> moves to history, week rolls
agent-browser eval "(() => { const b=Array.from(document.querySelectorAll('button')).find(x=>/RUN FULL CARD/.test(x.textContent)); b.click(); return 'run'; })()"
agent-browser wait 3000

echo "== expand history event =="
agent-browser eval "(() => { const rows=Array.from(document.querySelectorAll('button')).filter(x=>/UFC Fight Night 1|UFC Fight Night/.test(x.textContent)&&/def\./.test(x.textContent)); if(!rows.length) return 'no-history-row'; rows[0].click(); return 'expanded'; })()"
agent-browser wait 1000

echo "== history COPY CARD =="
agent-browser eval "(() => { window.__copied=null; const b=Array.from(document.querySelectorAll('button')).find(x=>x.textContent.trim()==='COPY CARD'); if(!b) return 'no-btn'; b.click(); return 'clicked'; })()"
agent-browser wait 800
agent-browser eval "window.__copied || 'clipboard-empty'"

kill $DEV_PID 2>/dev/null
echo "== done =="
