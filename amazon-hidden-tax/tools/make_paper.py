#!/usr/bin/env python3
"""Write engine/paper/index.html: the full film in the Paper Trail look.

Inputs: data/all_scenes.json, data/timeline.json, voiceover/steps/*.wav.
This script owns every cue time (receipt lines, cuts, stamps, kinetic lines), so the
visuals in vendor/paper-engine.js and the sound effects placed here always agree.
"""
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJ = ROOT / "engine" / "paper"
scenes = json.loads((ROOT / "data" / "all_scenes.json").read_text(encoding="utf-8"))["scenes"]
T = json.loads((ROOT / "data" / "timeline.json").read_text(encoding="utf-8"))
STEP_PAD = 0.35

# cue = fraction of the step's spoken duration
CUES = {
    (1, 2): {"sale": .08, "line": .62}, (1, 3): {"line": .55}, (1, 4): {"line": .6}, (1, 5): {"line": .62}, (1, 6): {"line": .4},
    (1, 7): {"keep": .3, "took": .62},
    (2, 4): {"stamp": .5},
    (3, 2): {"zoom": .3, "hl1": .52, "hl2": .58, "drift": .78, "hl3": .86}, (3, 3): {"stamp": .5, "reply": .68},
    (4, 2): {"head": .05, "line": .62}, (4, 3): {"line": .5}, (4, 4): {"line": .5}, (4, 5): {"line": .6}, (4, 6): {"line": .12, "stamp": .3},
    (5, 4): {"stamp": .55},
    (6, 3): {"cut1": .42, "cut2": .58},
}
SFX = {"cut1": "snip", "cut2": "snip", "sale": "printer", "line": "printer", "head": "printer", "keep": "printer", "took": "printer", "stamp": "thud"}

# kinetic lines: (big, small, sentence index, fraction inside that sentence)
KINETIC = {
    (1, 1): [("$100", "SPENT WITH A SELLER ON AMAZON", 0, 0), ("$52", "NEVER REACHES THE SELLER", 0, .55),
             ("YOU PAY TOO", "EVEN IF YOU NEVER SHOP THERE · FTC ALLEGATION", 4, 0), ("$68.6 BILLION", "AMAZON AD REVENUE · 2025", 5, .3),
             ("$188M", "EVERY SINGLE DAY", 6, 0), ("FOLLOW $100", "WHO ACTUALLY GETS YOUR MONEY?", 7, 0)],
    (2, 1): [("HOW?", "FROM ONLINE BOOKSTORE TO TOLL COLLECTOR", 0, 0), ("FORM 10-K", "LINE ITEM: ADVERTISING SERVICES", 1, 0),
             ("$68.6 BILLION", "UP 22% IN A SINGLE YEAR", 2, 0), ("> HALF", "OF ALL NEWSPAPER REVENUE ON EARTH ($125.7B)", 3, .25),
             ("NOT ALL SELLERS", "STREAMING ADS COUNT TOO", 4, 0)],
}
FOOTAGE = {  # (scene, step) -> clips played back to back under the kinetic lines
    (1, 1): [("mk_20770.mp4", 7.8), ("warehouse_aerial.mp4", 16.3), ("mk_42137.mp4", 13.3)],
    (2, 1): [("mk_47627.mp4", 13.5), ("mk_31155.mp4", 9.2), ("mk_20847.mp4", 6.4)],
}
FOOTAGE_SPAN = {5: (1, 3, [("mk_42137.mp4", 13.3), ("mk_20770.mp4", 7.8), ("warehouse_aerial.mp4", 16.3), ("mk_31155.mp4", 9.2), ("mk_47627.mp4", 13.5)])}



def sentence_times(text, start, dur):
    """Start time of each sentence, sharing the step's time out by character count."""
    sents = re.split(r'(?<=[.!?"])\s+(?=[A-Z"$])', text.strip())
    total = sum(len(s) for s in sents)
    out, cur = [], start
    for s in sents:
        d = dur * len(s) / total
        out.append((cur, d))
        cur += d
    return out


def caption_chunks(text, limit=46):
    out = []
    for sent in re.split(r'(?<=[.!?"])\s+(?=[A-Z"$])', text.strip()):
        while len(sent) > limit:
            cut = max(sent.rfind(c, 0, limit) for c in (", ", " — ", "... ", ": "))
            if cut < 18:
                cut = sent.rfind(" ", 0, limit)
            out.append(sent[:cut + 1].strip()); sent = sent[cut + 1:].strip()
        if sent:
            out.append(sent)
    return out


videos, audio, kin, subs = [], [], {}, []
vo_dir = PROJ / "assets" / "vo"
vo_dir.mkdir(parents=True, exist_ok=True)
for sc, ts in zip(scenes, T["scenes"]):
    audio.append((ts["start"] + 0.05, "sfx/whoosh.wav", 0.5, 0.35))
    for st, tt in zip(sc["steps"], ts["steps"]):
        key = (sc["scene"], st["step"])
        speech = tt["duration"] - STEP_PAD
        tt["cues"] = {k: round(tt["start"] + f * speech, 3) for k, f in CUES.get(key, {}).items()}
        for k, t in tt["cues"].items():
            if k in SFX:
                audio.append((t, f"sfx/{SFX[k]}.wav", 0.45, 0.5 if SFX[k] == "thud" else 0.3))
                if sc["scene"] == 1 and k == "line":
                    audio.append((t - 0.3, "sfx/snip.wav", 0.2, 0.45))
        parts = caption_chunks(st["narration"]); tot = sum(len(p) for p in parts); cur_s = tt["start"]
        for p in parts:
            d = speech * len(p) / tot
            subs.append({"x": p, "a": round(cur_s, 3), "b": round(cur_s + d, 3)}); cur_s += d
        if key in KINETIC:
            st_times = sentence_times(st["narration"], tt["start"], speech)
            lines = []
            for big, small, si, frac in KINETIC[key]:
                s0, sd = st_times[min(si, len(st_times) - 1)]
                lines.append({"big": big, "small": small, "t": round(s0 + frac * sd + 0.15, 3)})
                audio.append((lines[-1]["t"] - 0.1, "sfx/whoosh.wav", 0.5, 0.22))
            kin[f"{key[0]}-{key[1]}"] = lines
            cur, stop = tt["start"], tt["start"] + tt["duration"]
            for name, length in FOOTAGE[key]:
                if cur >= stop - 0.2:
                    break
                d = min(length, stop - cur)
                videos.append(f'      <video id="v{len(videos)}" class="foot-vid clip" src="assets/video/{name}" muted playsinline data-start="{round(cur, 3)}" '
                              f'data-duration="{round(d, 3)}" data-track-index="2"></video>')
                cur += d
        if tt.get("audio"):
            src = ROOT / tt["audio"]
            shutil.copyfile(src, vo_dir / src.name)
            audio.append((tt["start"], f"vo/{src.name}", round(tt["duration"], 3), 1.0))

for scn, (s0, s1, clips) in FOOTAGE_SPAN.items():
    st_list = T["scenes"][scn - 1]["steps"]; cur, stop = st_list[s0 - 1]["start"], st_list[s1 - 1]["start"] + st_list[s1 - 1]["duration"]
    for name, length in clips:
        if cur >= stop - 0.2:
            break
        d = min(length, stop - cur)
        videos.append(f'      <video id="v{len(videos)}" class="foot-vid clip" src="assets/video/{name}" muted playsinline data-start="{round(cur, 3)}" data-duration="{round(d, 3)}" data-track-index="2"></video>')
        cur += d

scene_divs = [f'      <div id="scene-{sc["scene"]}" class="seg clip" data-start="{ts["start"]}" data-duration="{ts["duration"]}" data-track-index="0"></div>'
              for sc, ts in zip(scenes, T["scenes"])]
audio_tags = [f'      <audio id="a{i}" src="assets/{src}" data-start="{round(max(0, t), 3)}" data-duration="{d}" data-volume="{v}" data-track-index="{3 if src.startswith("vo/") else 4}"></audio>'
              for i, (t, src, d, v) in enumerate(sorted(audio))]


def js(o):
    return json.dumps(o, ensure_ascii=False).replace("</", "<\\/")


page = f"""<!doctype html>
<html lang="en" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Amazon's $69 Billion Hidden Tax</title>
    <link rel="stylesheet" href="vendor/paper.css" />
    <script src="vendor/gsap.min.js"></script>
    <script src="vendor/paper-engine.js"></script>
  </head>
  <body>
{(PROJ / "_parts_svg.html").read_text()}
    <div id="root" data-composition-id="main" data-start="0" data-duration="{T["total"]}" data-width="1920" data-height="1080">
{chr(10).join(videos)}
{chr(10).join(scene_divs)}
{chr(10).join(audio_tags)}
    </div>
    <script type="module">
      import * as THREE from "./vendor/three.module.js";
      const SCENES = {js(scenes)};
      const TIMELINE = {js(T)};
      const KINETIC = {js(kin)};
      const SUBS = {js(subs)};
{(PROJ / "_parts_toll.js").read_text()}
      const tl = gsap.timeline({{ paused: true }});
      Paper.build(tl, SCENES, TIMELINE, {{ kinetic: KINETIC, toll, subs: SUBS }});
      tl.set({{}}, {{}}, {T["total"]});
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""
(PROJ / "index.html").write_text(page, encoding="utf-8")
m, s = divmod(T["total"], 60)
print(f"index.html: {len(scenes)} scenes, {len(videos)} footage clips, {len(audio_tags)} audio clips, {int(m)}:{s:04.1f}")
