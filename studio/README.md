# Studio: the code-drawn video engine

Turns a storyboard and a set of voice clips into a HyperFrames composition. Every picture is drawn in code (SVG and HTML), so there is no image generation step in the video.

## Files

| Path | What |
|---|---|
| `engine/rig.js` | The character skeleton, the cast, expressions, poses, hats, badges, hand props, lip sync, and the living things (`THINGS`). |
| `engine/sets.js` | Sets (places) and world props (charts, the banknote, the tower, signs, banners, price tags, stalls, crates, the hidden piggy bank). |
| `engine/overlays.js` | Counters, slams, labels, stamps, tags, lower thirds, calendar, clock, document and post cards. |
| `engine/core.js` | Shot types (scene, card, chapter, split), camera, shot size, light, grades. |
| `engine/timing.js` | Line and shot timing, shared by the browser and the tools. |
| `tools/build.mjs` | Episode folder → `index.html` + `timing.json`. |
| `tools/retention-lint.mjs` | Checks script, storyboard and sound against `channel-system/FORMAT_BOOK.md`. |
| `tools/voice.mjs` | Scratch voice track: one Kokoro clip per script line. |
| `tools/mix.mjs` | The sound mix: voice levelling, music bed, effects, −14 LUFS. `tools/sounds.mjs` makes the house effects and bed in code; `tools/cues.mjs` decides where effects fall; `tools/audio-lib.mjs` reads, measures and limits audio. |
| `tools/screen-text.mjs` | Lists every word and number the picture shows, for the fact-checker's second pass. |
| `tools/stills.mjs` | Saves pictures: contact sheets of frames, the thumbnail, the cast's model sheets. |
| `tools/preview.mjs`, `sheet.html`, `cast.html`, `thumb.html` | Look at frames in a browser without rendering. |
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

To save frames as a picture instead (this is how agents and reviewers look at an episode):
```bash
node studio/tools/stills.mjs frames channel-system/episodes/<slug>
```
It writes `render/frames.jpg` in the episode folder: the first frame, the middle of every shot and the last second. `--t 0,3,9.5` picks moments, `--every 10` samples the whole episode. It needs Playwright with a Chromium (`npm install --no-save playwright` and `npx playwright install chromium`, once), or `CHROME_PATH` pointing at an installed Chrome.

Sound, once every line has a clip (`voice.mjs` makes a scratch track when there is no recording yet):
```bash
node studio/tools/voice.mjs channel-system/episodes/<slug>
```
```bash
node studio/tools/mix.mjs channel-system/episodes/<slug> --tighten
```
Then build again: the video plays `audio/mix.wav` when it matches the current timing, and the bare voice clips otherwise. WAV needs nothing installed; MP3 and other formats are decoded with FFmpeg.

Every word and number on screen, for the second fact-check:
```bash
node studio/tools/screen-text.mjs channel-system/episodes/<slug>
```

A vertical Short (1080×1920) from a range of lines. It becomes its own small episode folder, which is then mixed, linted, looked at and rendered like any other:
```bash
node studio/tools/build.mjs channel-system/episodes/<slug> --short L012-L020 --title "WHO PAYS THE FEE?" --name short1
```
```bash
node studio/tools/mix.mjs channel-system/episodes/<slug>/shorts/short1
```
```bash
node studio/tools/build.mjs channel-system/episodes/<slug>/shorts/short1
```

The thumbnail, from the first shot or from an illustration:
```bash
node studio/tools/stills.mjs thumb channel-system/episodes/<slug> --white "AMAZON KEEPS" --red "\$52"
```

Clips that do not exist yet are timed from their word count, so a storyboard can be built, linted and looked at before any voice is recorded. Add `--silent` to build without audio.

Rendering to MP4 needs HyperFrames and FFmpeg on the machine. `check` must pass first; a 19-second piece renders in about two minutes on a cloud machine:
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
- **Movement**: an act with `"to": [x, y]` walks the figure there (`"dur"` seconds); a prop with `"move": { "to": [x, y], "cue", "word", "dur" }` travels. Use them so something happens between cuts: the parcel lunges at the banknote, the crates ride the belt, the buyer steps back.
- **Subtitles** are on by default and rest during text cards; `"subtitles": false` at the top of the storyboard turns them off.
- **Split by chapter**: `storyboard.json` holds the header and every file in `storyboard/` (`ch1.json`, `ch2.json`...) adds its `"shots"`, in file-name order. Shot ids must be unique across files.
- **Shot size**: `"frame": "medium"` or `"close"` moves in on the figures; `"focus": [x, y]` aims it somewhere else.
- **Light**: `"light": { "x": 960, "y": 430, "r": 900, "color": "#ffd9a0", "dark": 0.6 }`: one source, darkness around it (screen position).
- **Living things**: an actor with `"thing": "box"` (or `chip`, `tower`, `dome`, `bank`, `factory`, `server`, `cloud`, `coin`, `bag`, `house`, `barrel`, `note`) and a `"label"`. It takes `face`, `pose`, `prop`, `speaks` and `acts` like a person.
- **On a figure**: `"hat"`, `"badge": "62"`, and hand props with text: `"prop": "placard", "sign": "SELL"`, `"prop": "tag", "tag": "$52"`.
- **Sound**: stamps, slams, cards, chapter cards and document cards get a soft effect by themselves. `"sound": "ding"` on a shot, panel or overlay adds one (`stamp`, `slam`, `card`, `chapter`, `paper`, `whoosh`, `ding`, `pop`, `tick`, `riser`); `"sound": false` removes one. Episode options: `"audio": { "music": "house" | "none", "music_db": -19, "climax": [5, 6], "sfx": true }`.
- **Grades**: `green`, `red`, `sepia`, `night`, `gold`.
- **Faces, poses, props, sets, overlays**: the lists at the top of `rig.js`, `sets.js` and `overlays.js`, each with a one-line comment showing its fields. `gallery/storyboard.json` has a working example of every one.
- `motif` and `callback` do not change the picture. They tell the lint which shots carry the anchor motif and which ones pay off an earlier image.

## Rules for engine code
- One paused GSAP timeline drives everything. No timers, no `Math.random`, no dates, no network.
- **No callbacks** (`onUpdate`, `call`): a seek does not fire them. Tween properties instead; `counter` shows how to do text.
- Set a transform pivot once, before the element moves (`gsap.set(el, { transformOrigin, smoothOrigin: false })`). Changing it later shifts the element.
- `svgOrigin` is in stage coordinates, so use it only on elements with no transformed parent.
- After any change, build the gallery and look at the frames.
