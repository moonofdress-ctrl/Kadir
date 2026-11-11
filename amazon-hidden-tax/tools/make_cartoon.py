#!/usr/bin/env python3
"""Build engine/cartoon/index.html for one episode of the cartoon format.

Usage: python3 make_cartoon.py <episode_dir> [--voices]

Reads <episode_dir>/script.md, shotlist.json, images/ and audio/.
- audio/lines.json is created from script.md if missing (N: = narrator, NAME: = character).
- --voices fills in missing clips with the free Kokoro scratch voice.
Timing comes from the real clip lengths; shots cut on their cue line.
"""
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINE = ROOT / "engine" / "cartoon"
GAP = 0.25          # pause after every line
SKIT_GAP = 0.45     # extra pause when the speaker changes between narrator and a character
TAIL = 1.2
VOICES = {"N": ("am_michael", "1.05"), "BENNY": ("am_adam", "1.0"), "CHAD": ("am_adam", "1.2"),
          "HAL": ("bm_george", "0.9"), "MARTHA": ("af_heart", "1.0"), "REGGIE": ("bm_george", "0.8")}


def parse_script(text):
    lines = []
    for raw in text.splitlines():
        m = re.match(r"^(N|[A-Z][A-Z]+):\s+(.+)$", raw.strip())
        if m:
            lines.append({"id": f"L{len(lines) + 1:03d}", "speaker": m.group(1), "text": m.group(2).strip()})
    return lines


def duration(p):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
                         capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def chunks(text, limit=46):
    out = []
    for sent in re.split(r'(?<=[.!?"])\s+(?=[A-Z"$])', text.strip()):
        while len(sent) > limit:
            cut = max(sent.rfind(c, 0, limit) for c in (", ", " — ", "... ", ": "))
            if cut < 18:
                cut = sent.rfind(" ", 0, limit)
            out.append(sent[:cut + 1].strip())
            sent = sent[cut + 1:].strip()
        if sent:
            out.append(sent)
    return out


def main():
    ep = Path(sys.argv[1]).resolve()
    want_voices = "--voices" in sys.argv
    slug = ep.name
    adir = ep / "audio"
    adir.mkdir(exist_ok=True)
    lj = adir / "lines.json"
    if not lj.exists():
        lj.write_text(json.dumps(parse_script((ep / "script.md").read_text(encoding="utf-8")), indent=2) + "\n", encoding="utf-8")
    lines = json.loads(lj.read_text(encoding="utf-8"))

    for ln in lines:
        wav = adir / f"{ln['id']}.wav"
        if not wav.exists() and want_voices:
            voice, speed = VOICES.get(ln["speaker"], VOICES["N"])
            tmp = adir / f"{ln['id']}.txt"
            tmp.write_text(ln["text"], encoding="utf-8")
            r = subprocess.run(["npx", "-y", "hyperframes@0.9.26", "tts", str(tmp), "-v", voice, "-s", speed, "-o", str(wav)],
                               cwd=ENGINE, capture_output=True, text=True)
            tmp.unlink()
            if r.returncode != 0:
                sys.exit(f"tts failed for {ln['id']}: {r.stderr[-500:]}")
        if not wav.exists():
            sys.exit(f"missing audio {wav} (run with --voices for a scratch track)")

    # timing
    t, prev = 0.6, None
    for ln in lines:
        if prev is not None and (prev == "N") != (ln["speaker"] == "N"):
            t += SKIT_GAP
        ln["d"] = round(duration(adir / f"{ln['id']}.wav"), 3)
        ln["a"] = round(t, 3)
        t += ln["d"] + GAP
        prev = ln["speaker"]
    total = round(t + TAIL, 3)

    subs = []
    for ln in lines:
        parts = chunks(ln["text"]); tot = sum(len(p) for p in parts); cur = ln["a"]
        for p in parts:
            d = ln["d"] * len(p) / tot
            text = (ln["speaker"].title() + ": " + p) if ln["speaker"] != "N" and p == parts[0] else p
            subs.append({"x": text, "a": round(cur, 3), "b": round(cur + d, 3), "who": ln["speaker"] != "N"})
            cur += d

    # assets
    out = ENGINE / "assets" / "ep" / slug
    if out.exists():
        shutil.rmtree(out)
    (out / "images").mkdir(parents=True)
    (out / "audio").mkdir()
    shots = json.loads((ep / "shotlist.json").read_text(encoding="utf-8"))["shots"]
    ids = {ln["id"] for ln in lines}

    def asset(rel):
        src = ep / rel
        if not src.exists():
            sys.exit(f"missing image {src}")
        shutil.copyfile(src, out / "images" / src.name)
        return f"assets/ep/{slug}/images/{src.name}"

    for s in shots:
        if s["cue"] not in ids:
            sys.exit(f"shot {s['id']} cues unknown line {s['cue']}")
        if s.get("image"):
            s["image"] = asset(s["image"])
        for c in s.get("characters", []):
            c["image"] = asset(c["image"])
    audio_tags = []
    for ln in lines:
        shutil.copyfile(adir / f"{ln['id']}.wav", out / "audio" / f"{ln['id']}.wav")
        audio_tags.append(f'      <audio id="a{ln["id"]}" src="assets/ep/{slug}/audio/{ln["id"]}.wav" data-start="{ln["a"]}" '
                          f'data-duration="{ln["d"]}" data-track-index="1"></audio>')

    def js(o):
        return json.dumps(o, ensure_ascii=False).replace("</", "<\\/")

    page = f"""<!doctype html>
<html lang="en" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>{slug}</title>
    <link rel="stylesheet" href="vendor/cartoon.css" />
    <script src="vendor/gsap.min.js"></script>
    <script src="vendor/cartoon-engine.js"></script>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1920" data-height="1080">
{chr(10).join(audio_tags)}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      Cartoon.build(tl, {js(shots)}, {js(lines)}, {js(subs)}, {total});
      tl.set({{}}, {{}}, {total});
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""
    (ENGINE / "index.html").write_text(page, encoding="utf-8")
    m, s = divmod(total, 60)
    print(f"{slug}: {len(lines)} lines, {len(shots)} shots, {len(subs)} subtitles, {int(m)}:{s:04.1f}")


if __name__ == "__main__":
    main()
