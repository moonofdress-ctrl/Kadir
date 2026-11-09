#!/usr/bin/env python3
"""Build data/timeline.json: when each scene and each step starts, in seconds.

Two sources of truth, picked automatically:
  1. Real audio: if voiceover/steps/s{scene}_{step}.wav|mp3 exist for every step,
     each step lasts exactly as long as its audio clip (measured with ffprobe).
  2. Estimate: otherwise, words / WPM. Good enough for an animatic; replace with
     real audio before the final render.
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "all_scenes.json"
STEP_AUDIO = ROOT / "voiceover" / "steps"
OUT = ROOT / "data" / "timeline.json"

WPM = 155          # matches tools/build.py
STEP_PAD = 0.35    # breath after each step
LEAD_IN = 0.9      # title settles before the first line
TAIL = 0.7         # hold at the end of a scene


def audio_for(scene, step):
    for ext in ("wav", "mp3"):
        p = STEP_AUDIO / f"s{scene}_{step}.{ext}"
        if p.exists():
            return p
    return None


def duration_of(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=nw=1:nk=1", str(path)], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def main():
    scenes = json.loads(DATA.read_text(encoding="utf-8"))["scenes"]
    have_audio = all(audio_for(sc["scene"], st["step"]) for sc in scenes for st in sc["steps"])
    t = 0.0
    out = {"source": "audio" if have_audio else "estimate", "scenes": []}
    for sc in scenes:
        start = t
        cur = start + LEAD_IN
        steps = []
        for st in sc["steps"]:
            if have_audio:
                a = audio_for(sc["scene"], st["step"])
                d = duration_of(a) + STEP_PAD
                rel = str(a.relative_to(ROOT))
            else:
                words = len(re.findall(r"[A-Za-z0-9'’-]+", st["narration"]))
                d = max(2.5, words / WPM * 60 + STEP_PAD)
                rel = None
            steps.append({"step": st["step"], "start": round(cur, 3), "duration": round(d, 3), "audio": rel})
            cur += d
        dur = cur + TAIL - start
        out["scenes"].append({"scene": sc["scene"], "start": round(start, 3), "duration": round(dur, 3), "steps": steps})
        t = start + dur
    out["total"] = round(t, 3)
    OUT.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
    m, s = divmod(t, 60)
    print(f"timeline: {out['source']}, {len(scenes)} scenes, total {int(m)}:{s:04.1f}")
    for sc in out["scenes"]:
        a, b = divmod(sc["start"], 60)
        print(f"  scene {sc['scene']} at {int(a)}:{b:04.1f}  ({sc['duration']:.1f}s, {len(sc['steps'])} steps)")


if __name__ == "__main__":
    main()
