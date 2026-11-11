# Studio: the code-drawn video engine

Turns a storyboard and a set of voice clips into a HyperFrames composition. Every picture is drawn in code (SVG and HTML), so there is no image generation step in the video.

## Files

| Path | What |
|---|---|
| `engine/rig.js` | The character skeleton, the cast, expressions, poses, hand props, lip sync. |
| `engine/sets.js` | Sets (places) and world props (charts, the banknote, the tower, signs). |
| `engine/overlays.js` | Counters, slams, labels, stamps, tags, lower thirds, calendar, clock, document and post cards. |
| `engine/core.js` | Shot types (scene, card, chapter, split), camera, grades. |
| `engine/timing.js` | Line and shot timing, shared by the browser and the tools. |
| `tools/build.mjs` | Episode folder → `index.html` + `timing.json`. |
| `tools/retention-lint.mjs` | Checks script and storyboard against `channel-system/FORMAT_BOOK.md`. |
| `tools/preview.mjs`, `sheet.html` | Look at frames in a browser without rendering. |
| `gallery/` | One silent reel that uses every component. Copy from its `storyboard.json`. |

## Commands (run from the repository root; Node 22+, no Python)

```bash
node studio/tools/build.mjs channel-system/episodes/<slug>
```
```bash
node studio/tools/retention-lint.mjs channel-system/episodes/<slug>
```
```bash
node studio/tools/preview.mjs
```

With the preview running, `http://127.0.0.1:8780/?fit&t=12.5` shows the frame at 12.5 seconds and `http://127.0.0.1:8780/sheet.html?t=2,6,11,15&cols=2` shows several frames side by side.

Clips that do not exist yet are timed from their word count, so a storyboard can be built, linted and looked at before any voice is recorded. Add `--silent` to build without audio.

Rendering to MP4 needs HyperFrames and FFmpeg on the machine:
```bash
cd studio && npm run check && npm run render
```

## Storyboard format

`channel-system/episodes/<slug>/storyboard.json`:

```json
{
  "episode": "slug", "title": "Why ...", "viewer": "BENNY",
  "shots": [
    { "id": "s01", "cue": "L001", "set": "office", "opts": { "screen": "red" }, "camera": "push_in", "grade": "red",
      "motif": "tower", "callback": "the bill",
      "actors": [ { "who": "BENNY", "x": 520, "face": "shocked", "prop": "phone", "speaks": ["L003"],
                    "acts": [ { "cue": "L002", "word": 4, "face": "angry", "pose": "shrug" } ] } ],
      "props": [ { "type": "bars", "x": 420, "y": 240, "w": 1080, "h": 620, "items": [ { "label": "2025", "val": 47, "show": "$47B" } ] } ],
      "overlays": [ { "type": "counter", "from": 0, "to": 400, "prefix": "-$", "suffix": "B", "tone": "red", "at": 0.5 } ] },
    { "id": "t01", "type": "card", "cue": "L004", "text": "So why did it happen?", "emph": ["why"] },
    { "id": "c02", "type": "chapter", "cue": "L010", "number": 2, "title": "The Top" },
    { "id": "p01", "type": "split", "cue": "L020", "panels": [ { "set": "street", "label": "LAND" }, { "set": "kitchen", "cue": "L020", "word": 3, "label": "POWER" } ] }
  ]
}
```

- **When things happen.** A shot starts on its `cue` line; add `"word": n` to start on the nth word of that line (counting from 0) or `"at": seconds` to shift it. The same three keys work on overlays, actors, `acts`, panels and prop parts. Without a cue, `at` counts from the start of the shot.
- **Shots are hard cuts** and last until the next shot starts.
- **Cameras**: `push_in`, `pull_out`, `pan_left`, `pan_right`, `tilt_up`, `tilt_down`, `still`, `shake`.
- **Grades**: `green`, `red`, `sepia`, `night`, `gold`.
- **Faces, poses, props, sets, overlays**: the lists at the top of `rig.js`, `sets.js` and `overlays.js`, each with a one-line comment showing its fields. `gallery/storyboard.json` has a working example of every one.
- `motif` and `callback` do not change the picture. They tell the lint which shots carry the anchor motif and which ones pay off an earlier image.

## Rules for engine code
- One paused GSAP timeline drives everything. No timers, no `Math.random`, no dates, no network.
- **No callbacks** (`onUpdate`, `call`): a seek does not fire them. Tween properties instead; `counter` shows how to do text.
- Set a transform pivot once, before the element moves (`gsap.set(el, { transformOrigin, smoothOrigin: false })`). Changing it later shifts the element.
- `svgOrigin` is in stage coordinates, so use it only on elements with no transformed parent.
- After any change, build the gallery and look at the frames.
