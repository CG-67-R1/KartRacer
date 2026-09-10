#!/usr/bin/env bash
# Vision-QA every art part (v2). Extracts REAL verdict lines (PASS/REGEN kr-*.png)
# from hermes output, ignoring the prompt echo's format template and TUI frames.
# Usage: bash run_qa.sh [startAt]
set -u
BASE="C:/KartRacer/tools/art-gen"
QA="$BASE/qa"
QALOG="$BASE/qa.log"
RESULTS="$BASE/qa-results.md"

start="${1:-}"
started=0
echo "# KartRacer art QA — $(date)" > "$RESULTS"
echo "" >> "$RESULTS"
echo "=== qa v2 run $(date) ===" >> "$QALOG"

for f in "$QA"/*.txt; do
  name=$(basename "$f" .txt)
  if [ -n "$start" ] && [ $started -eq 0 ]; then
    if [ "$name" = "$start" ]; then started=1; else continue; fi
  fi
  echo "--- QA $name $(date +%H:%M:%S)" >> "$QALOG"
  out=$(hermes chat -q "$(cat "$f")" 2>>"$QALOG")
  echo "## $name" >> "$RESULTS"
  # Strip ANSI escapes and box-drawing, then keep only real verdicts:
  # lines with PASS/REGEN followed by an actual kr-*.png filename.
  echo "$out" \
    | sed -e 's/\x1b\[[0-9;]*m//g' -e 's/[│╭╮╰╯─]//g' \
    | grep -oE "(PASS|REGEN) kr-[a-z0-9-]+\.png[^\r]*" \
    >> "$RESULTS" || echo "(no verdicts — see qa.log for $name)" >> "$RESULTS"
  echo "" >> "$RESULTS"
done

echo "=== summary ===" >> "$RESULTS"
p=$(grep -c "^PASS kr-" "$RESULTS" || true)
r=$(grep -c "^REGEN kr-" "$RESULTS" || true)
echo "PASS: $p | REGEN: $r" >> "$RESULTS"
echo "QA complete: PASS $p, REGEN $r — see $RESULTS"
