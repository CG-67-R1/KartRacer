"""KartRacer daily gate for Hermes no-agent cron. Silent on pass; prints FAIL summary."""
import os
import subprocess
import sys
from pathlib import Path

DEFAULT_REPO = Path(r"C:\KartRacer")

def resolve_repo() -> Path:
    env_repo = os.environ.get("KART_RACER_REPO", "").strip()
    if env_repo:
        candidate = Path(env_repo)
        if (candidate / "scripts" / "hermes-daily-gate.mjs").exists():
            return candidate
    cwd = Path.cwd()
    if (cwd / "scripts" / "hermes-daily-gate.mjs").exists():
        return cwd
    if (DEFAULT_REPO / "scripts" / "hermes-daily-gate.mjs").exists():
        return DEFAULT_REPO
    raise SystemExit("Cannot find KartRacer repo (set KART_RACER_REPO or run with --workdir)")

REPO = resolve_repo()
SCRIPT = REPO / "scripts" / "hermes-daily-gate.mjs"

env = {**os.environ}
if not env.get("API_URL"):
    env["API_URL"] = "http://localhost:3001"

result = subprocess.run(
    ["node", str(SCRIPT)],
    cwd=REPO,
    capture_output=True,
    text=True,
    env=env,
)

out = f"{result.stdout or ''}{result.stderr or ''}".strip()
if result.returncode == 0 and not out:
    sys.exit(0)

if out:
    print(out)
else:
    print("KartRacer daily gate FAILED (non-zero exit, no output)")
sys.exit(result.returncode or 1)
