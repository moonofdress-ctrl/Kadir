#!/usr/bin/env python3
"""Build ElevenLabs voiceover files from script/script_master.md.

Only lines starting with "> " are narration. Each "# PART" heading starts a new file.
Also prints word counts and an estimated duration per part, so the script can be
checked against the 9:30 target before any audio is generated.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "script" / "script_master.md"
OUT = ROOT / "voiceover"
WPM = 155  # documentary pace with ElevenLabs speed ~1.03 (default speed ~150 wpm)

TARGETS = {  # part -> (start_s, end_s) from the cue sheet
    1: (0, 108), 2: (108, 220), 3: (220, 315), 4: (315, 404), 5: (404, 480), 6: (480, 567),
}


def parse(text):
    parts, cur = [], None
    for line in text.splitlines():
        m = re.match(r"^# PART (\d+)\s+[—-]\s+(.*)$", line)
        if m:
            cur = {"n": int(m.group(1)), "title": m.group(2).strip(), "lines": [], "steps": 0}
            parts.append(cur)
            continue
        if cur is None:
            continue
        if line.startswith("**[Step"):
            cur["steps"] += 1
            cur["lines"].append("")  # paragraph break between steps
        elif line.startswith("> "):
            cur["lines"].append(line[2:].strip())
    return parts


def main():
    parts = parse(SRC.read_text(encoding="utf-8"))
    if len(parts) != 6:
        sys.exit(f"expected 6 parts, found {len(parts)}")
    OUT.mkdir(exist_ok=True)
    total_w = 0
    print(f"{'part':<6}{'words':>7}{'est':>8}{'slot':>8}{'diff':>7}  chars  title")
    for p in parts:
        body = "\n".join(p["lines"]).strip()
        body = re.sub(r"\n{3,}", "\n\n", body)
        # Guard: no cue markers or non-ASCII letters (e.g. Turkish notes) may leak into TTS text.
        if re.search(r"\[|\]|\*\*|<!--", body):
            sys.exit(f"part {p['n']}: cue markup leaked into narration")
        if re.search(r"[çğıöşüÇĞİÖŞÜ]", body):
            sys.exit(f"part {p['n']}: Turkish characters found in narration")
        words = len(re.findall(r"[A-Za-z0-9'’-]+", body))
        total_w += words
        est = words / WPM * 60
        a, b = TARGETS[p["n"]]
        slot = b - a
        (OUT / f"part{p['n']}.txt").write_text(body + "\n", encoding="utf-8")
        print(f"{p['n']:<6}{words:>7}{est:>7.0f}s{slot:>7}s{est - slot:>+6.0f}s  {len(body):>5}  {p['title']}")
    print(f"{'total':<6}{total_w:>7}{total_w / WPM:>7.2f}m  (target 9.50m)")


if __name__ == "__main__":
    main()
