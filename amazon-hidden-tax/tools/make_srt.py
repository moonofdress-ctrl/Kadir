#!/usr/bin/env python3
"""Write youtube/captions.en.srt from the script and data/timeline.json.

Each step's narration is split into caption lines (max 2 lines of ~42 characters).
Inside a step, time is shared out by character count, so captions are exact at step
boundaries and approximate inside a step. Re-run after the final voice is in place.
"""
import json
import re
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
scenes = json.loads((ROOT / "data" / "all_scenes.json").read_text(encoding="utf-8"))["scenes"]
timeline = json.loads((ROOT / "data" / "timeline.json").read_text(encoding="utf-8"))
STEP_PAD = 0.35  # matches tools/timeline.py: silence after each step's audio
MAX = 84         # two lines of 42


def chunks(text):
    """Split narration into caption-sized pieces at sentence and clause breaks."""
    out = []
    for sent in re.split(r"(?<=[.!?])\s+", text.strip()):
        while len(sent) > MAX:
            cut = max(sent.rfind(c, 0, MAX) for c in (", ", " — ", "... ", "; ", ": "))
            if cut < 30:
                cut = sent.rfind(" ", 0, MAX)
            out.append(sent[:cut + 1].strip())
            sent = sent[cut + 1:].strip()
        if sent:
            out.append(sent)
    return out


def stamp(t):
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main():
    n, blocks = 0, []
    for sc, t in zip(scenes, timeline["scenes"]):
        for st, ts in zip(sc["steps"], t["steps"]):
            parts = chunks(st["narration"])
            total = sum(len(p) for p in parts)
            cur, speech = ts["start"], ts["duration"] - STEP_PAD
            for p in parts:
                d = speech * len(p) / total
                n += 1
                lines = textwrap.wrap(p, 42)
                if len(lines) > 2:
                    lines = textwrap.wrap(p, (len(p) + 1) // 2 + 4)[:2]
                blocks.append(f"{n}\n{stamp(cur)} --> {stamp(cur + d - 0.04)}\n" + "\n".join(lines) + "\n")
                cur += d
    out = ROOT / "youtube" / "captions.en.srt"
    out.write_text("\n".join(blocks), encoding="utf-8")
    print(f"{out.relative_to(ROOT)}: {n} captions, timing source: {timeline['source']}")


if __name__ == "__main__":
    main()
