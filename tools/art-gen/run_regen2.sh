#!/usr/bin/env bash
# Regen round 2: final 4 images (p02b hero + p19 tools). No marker games needed
# (28 markers already present; QA is running/queued on the existing set).
set -u
BASE="C:/KartRacer/tools/art-gen"
LOG="$BASE/run.log"

echo "=== regen2 run $(date) ===" >> "$LOG"
for f in "$BASE"/regen/*.txt; do
  name=$(basename "$f" .txt)
  echo "--- regen2:$name $(date +%H:%M:%S)" >> "$LOG"
  hermes chat -q "$(cat "$f")" >> "$LOG" 2>&1
  echo "--- regen2:$name finished rc=$? $(date +%H:%M:%S)" >> "$LOG"
done
n=$(ls "C:/KartRacer/app/assets/art" | wc -l)
echo "regen2 complete: $n files in app/assets/art"
