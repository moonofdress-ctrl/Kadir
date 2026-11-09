#!/usr/bin/env python3
"""Generate a free scratch voiceover, one clip per step, with Kokoro (via `hyperframes tts`).

Output: voiceover/steps/s{scene}_{step}.wav. Then tools/timeline.py times every step
from its real clip. Replace these files with ElevenLabs clips (same names) for the final.
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "voiceover" / "steps"
VOICE = sys.argv[1] if len(sys.argv) > 1 else "am_michael"
SPEED = sys.argv[2] if len(sys.argv) > 2 else "1.0"

scenes = json.loads((ROOT / "data" / "all_scenes.json").read_text(encoding="utf-8"))["scenes"]
OUT.mkdir(parents=True, exist_ok=True)
for sc in scenes:
    for st in sc["steps"]:
        dst = OUT / f"s{sc['scene']}_{st['step']}.wav"
        if dst.exists():
            continue
        txt = OUT / f"s{sc['scene']}_{st['step']}.txt"
        txt.write_text(st["narration"], encoding="utf-8")
        r = subprocess.run(["npx", "-y", "hyperframes@0.9.26", "tts", str(txt), "-v", VOICE, "-s", SPEED, "-o", str(dst)],
                           cwd=ROOT / "engine" / "amazon", capture_output=True, text=True)
        txt.unlink()
        if r.returncode != 0 or not dst.exists():
            sys.exit(f"tts failed for {dst.name}:\n{r.stdout[-800:]}\n{r.stderr[-800:]}")
        print(f"ok {dst.name}", flush=True)
print("done")
