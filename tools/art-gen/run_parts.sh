#!/usr/bin/env bash
# Run every KartRacer art part through a hermes sub-session, sequentially.
# Usage: bash run_parts.sh [startAt]   (startAt = part filename prefix to resume from)
set -u
PROMPTS="C:/KartRacer/tools/art-gen/prompts"
LOG="C:/KartRacer/tools/art-gen/run.log"
ART="C:/KartRacer/app/assets/art"

start="${1:-}"
started=0
echo "=== art-gen run $(date) ===" >> "$LOG"
for f in "$PROMPTS"/*.txt; do
  name=$(basename "$f" .txt)
  if [ -n "$start" ] && [ $started -eq 0 ]; then
    if [ "$name" = "$start" ]; then started=1; else continue; fi
  fi
  echo "--- $name $(date +%H:%M:%S)" >> "$LOG"
  hermes chat -q "$(cat "$f")" >> "$LOG" 2>&1
  echo "--- $name done rc=$? $(date +%H:%M:%S)" >> "$LOG"
done

echo "=== inventory ===" >> "$LOG"
ls -la "$ART" >> "$LOG" 2>&1
echo "art-gen complete: $(ls "$ART" | wc -l) files in $ART"
