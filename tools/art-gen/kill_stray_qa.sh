#!/usr/bin/env bash
# Kill stray hermes/QA processes left over from the v1 QA run.
for p in $(ps aux | grep "/hermes" | grep -v grep | awk '{print $1}'); do
  kill -9 "$p" 2>/dev/null
done
sleep 2
echo "surviving hermes procs: $(ps aux | grep '/hermes' | grep -v grep | wc -l)"
