#!/usr/bin/env python3
"""Write engine/amazon/index.html: one HyperFrames composition holding all six scenes.

Scene data and timing are inlined (the runtime forbids network fetches). If the
timeline was built from real audio, each step's voiceover clip is copied into the
project and placed on the timeline as an <audio> element.
"""
import html
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJ = ROOT / "engine" / "amazon"
scenes = json.loads((ROOT / "data" / "all_scenes.json").read_text(encoding="utf-8"))["scenes"]
timeline = json.loads((ROOT / "data" / "timeline.json").read_text(encoding="utf-8"))
total = timeline["total"]


def js(obj):
    # Safe to inline inside <script>: no closing tag sequences.
    return json.dumps(obj, ensure_ascii=False).replace("</", "<\\/")


scene_divs, audio = [], []
vo_dir = PROJ / "assets" / "vo"
for sc, t in zip(scenes, timeline["scenes"]):
    scene_divs.append(
        f'      <div id="scene-{sc["scene"]}" class="scene clip" data-start="{t["start"]}" '
        f'data-duration="{t["duration"]}" data-track-index="0"></div>')
    for st in t["steps"]:
        if st.get("audio"):
            vo_dir.mkdir(parents=True, exist_ok=True)
            src = ROOT / st["audio"]
            dst = vo_dir / src.name
            shutil.copyfile(src, dst)
            audio.append(
                f'      <audio id="vo-{sc["scene"]}-{st["step"]}" src="assets/vo/{html.escape(src.name)}" '
                f'data-start="{st["start"]}" data-duration="{round(st["duration"], 3)}" data-track-index="1"></audio>')

page = f"""<!doctype html>
<html lang="en" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Amazon's $69 Billion Hidden Tax</title>
    <link rel="stylesheet" href="vendor/scene.css" />
    <script src="vendor/gsap.min.js"></script>
    <script src="vendor/scene-engine.js"></script>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1920" data-height="1080">
{chr(10).join(scene_divs)}
{chr(10).join(audio)}
    </div>
    <script>
      const SCENES = {js(scenes)};
      const TIMELINE = {js(timeline)};
      const tl = gsap.timeline({{ paused: true }});
      SceneEngine.build("root", SCENES, TIMELINE, tl);
      tl.set({{}}, {{}}, {total});
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
"""
(PROJ / "index.html").write_text(page, encoding="utf-8")
print(f"index.html written: {len(scenes)} scenes, {len(audio)} audio clips, {total:.1f}s ({timeline['source']} timing)")
