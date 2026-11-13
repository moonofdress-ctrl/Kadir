# Studio: the code-drawn video engine

Turns a storyboard and a set of voice clips into a HyperFrames composition. Text, numbers, charts and figures are drawn in code (SVG and HTML). A place too costly to draw can be a painted background from the episode's `art/` folder (`"set": "picture"`), with the engine's figures and text over it.

## Files

| Path | What |
|---|---|
| `engine/rig.js` | The character skeleton, the cast, expressions, poses, hats, badges, hand props, lip sync, and the living things (`THINGS`). |
| `engine/sets.js` | Sets (places) and world props (charts, the banknote, the tower, signs, banners, price tags, stalls, crates, the hidden piggy bank). |
| `engine/scenes.js` | Story scenes: evidence board, timeline tunnel, map flight (props), and their dark grounds (`evidence_wall`, `timeline_road`, `map_table`). |
| `engine/overlays.js` | Counters, slams, labels, stamps, tags, lower thirds, calendar, clock, document and post cards. |
| `engine/core.js` | Shot types (scene, card, chapter, split), camera, shot size, light, grades. |
| `engine/timing.js` | Line and shot timing, shared by the browser and the tools. |
| `tools/build.mjs` | Episode folder → `index.html` + `timing.json`. |
| `tools/retention-lint.mjs` | Checks script, storyboard and sound against `channel-system/FORMAT_BOOK.md`. |
| `tools/voice.mjs` | Scratch voice track: one Kokoro clip per script line. |
| `tools/mix.mjs` | The sound mix: voice levelling, music bed, effects, −14 LUFS. `tools/sounds.mjs` makes the house effects and bed in code; `tools/cues.mjs` decides where effects fall; `tools/audio-lib.mjs` reads, measures and limits audio. |
| `tools/screen-text.mjs` | Lists every word and number the picture shows, for the fact-checker's second pass. |
| `tools/layout-check.mjs` | Opens the build in a browser and lists text that something covers, names beside figures and counters cut short. |
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
It writes `render/frames.jpg` in the episode folder: the first frame, the middle of every shot and the last second. `--t 0,3,9.5` picks moments, `--every 10` samples the whole episode. It needs a browser driver, once, in `studio/`: `npm install --no-save playwright-core` uses the Chrome or Edge already installed (set `CHROME_PATH` if it is somewhere unusual); or `npm install --no-save playwright` and `npx playwright install chromium` for Playwright's own.

What covers what, read from the real picture (about half a minute for a 13-minute episode):
```bash
node studio/tools/layout-check.mjs channel-system/episodes/<slug>
```
It lists every text that something covers late in its shot (a lamp pole over a sign, a tag over a sign, a head in front of a banner, text past the edge) and every counter whose shot is too short. A background shop name behind a head is fine; anything the viewer is meant to read is a fault. Run it after every build, before QA.

Sound, once every line has a clip (`voice.mjs` makes a scratch track when there is no recording yet):
```bash
node studio/tools/voice.mjs channel-system/episodes/<slug>
```
The published voice is ElevenLabs (narrator Lawrence; voices in `EL_VOICES` in `tools/voice.mjs`). Check the cost first, then voice; each line also gets `audio/<id>.words.json`, the measured time of every word, which the build uses for subtitles and word cues (`mix.mjs --tighten` keeps it in step). It needs FFmpeg and the ElevenLabs key in the cloud environment:
```bash
node studio/tools/voice.mjs channel-system/episodes/<slug> --engine elevenlabs --force --dry-run
```
```bash
node studio/tools/voice.mjs channel-system/episodes/<slug> --engine elevenlabs --force
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
- **Place**: `"place": "embassy dining room"` on a shot or panel names the place when a set is dressed to read as somewhere else. The lint counts places by this tag, else by the set's name (K1, K2), dark pictures by `light`, the `night` grade or a set's `night` option (D1), and things to read by labelled props, actor labels and overlays (W1, W2).
- **Painted backgrounds**: `"set": "picture", "opts": { "src": "art/harbour.jpg", "shows": "a container harbour at night", "dim": 0.2 }`. The file is in the episode folder (1920x1080 JPEG); the build copies it. Cameras, grades, lights, props and overlays work over it; `dim` darkens it under text. The lint reads `shows` and `living` (G1, G2) and fails when a file is missing (G6). `gallery/` has an example (g25).
- **Faces, poses, props, sets, overlays**: the lists at the top of `rig.js`, `sets.js` and `overlays.js`, each with a one-line comment showing its fields. `gallery/storyboard.json` has a working example of every one.
- `motif` and `callback` do not change the picture. They tell the lint which shots carry the anchor motif and which ones pay off an earlier image.

## Story scenes (`engine/scenes.js`, demo: `channel-system/episodes/demo-story-scenes/`)

Three world props that carry their own camera. Each belongs on its dark ground (add `"light"` and `"place"` as for any shot); timed only from the timeline, so a seek gives the same frame.

**Evidence board** (`"set": "evidence_wall"`, prop `board_web`): who backed whom, who owns what. Nodes are cast or guest faces (`"kind": "face"`, `"who"`), logo-free badges (`"kind": "badge"`, `"icon"`: `building`, `can`, `coin`, `bank`, `person`, `plane`, `"color"`) and document cards (`"kind": "doc"`, `"title"`), each with a name strip (`name`) and an optional line under the picture (`sub`). A node lights up on its `cue`/`word`/`at`: the camera eases to it and the others dim and soften. Red strings (`edges`, with an optional `label`) draw themselves one at a time, on their own cue or just after the later of their two nodes. Nodes without `x`/`y` zigzag across the board; at the end the camera pulls back and lights everything (`"overview": seconds after the last node`, or `false`). `"zoom"` sets how close the camera goes (1.7).
```json
{ "id": "b1", "cue": "L001", "set": "evidence_wall", "opts": { "night": true }, "place": "evidence wall", "light": { "x": 960, "y": 470, "r": 1100, "dark": 0.55 },
  "props": [ { "type": "board_web", "nodes": [
    { "id": "r", "kind": "face", "who": "ROHAN_OZA", "name": "ROHAN OZA", "sub": "the connector", "cue": "L001", "word": 11 },
    { "id": "c", "kind": "badge", "icon": "can", "name": "CAVU", "cue": "L002", "word": 5 } ],
    "edges": [ { "from": "r", "to": "c", "label": "backed by" } ] } ] }
```

**Timeline tunnel** (`"set": "timeline_road"`, prop `timeline`): a company's history in one shot. Years stand as roadside billboards down a night road, nearer is earlier. On each year's `cue`/`word`/`at` the camera glides one step: the year it leaves slides off to the left, dim and blurred, and the next lights up with its caption (`caption`) and a small face (`who`) or glyph (`icon`, `color`). Three to five years fit; the first is lit from the start of the shot.
```json
{ "id": "t1", "cue": "L004", "set": "timeline_road", "opts": { "night": true }, "place": "the road of years", "light": { "x": 960, "y": 520, "r": 1200, "dark": 0.5 },
  "props": [ { "type": "timeline", "years": [
    { "year": "2015", "caption": "A kitchen and a soda", "who": "ALLISON_ELLSWORTH", "cue": "L004", "word": 3 },
    { "year": "2018", "caption": "A few thousand stores", "icon": "can", "color": "#8a3fb6", "cue": "L005", "word": 2 } ] } ] }
```

**Rolling counter** (overlay `counter` with `"roll": true`; every old counter works as before): the digits roll vertically like a slot machine to the target, the most significant one settling first, upward when the number rises and downward when it falls. The colour turns green when it rises fast (a fifth or more, or from zero) and red when it falls (a tenth or more); an explicit `"tone"` stays as written, `"tone": "auto"` is the default of a roll. `"tick": true` (or 1-3) puts the engine's `tick` effect on the first digits to settle, never closer than the mix's minimum spacing; it is opt-in because every tick counts toward lint A8, so use it on one counter in a few shots, not on all.
```json
{ "type": "counter", "roll": true, "tick": true, "from": 0, "to": 1950, "prefix": "$", "suffix": "M", "cap": "SOLD FOR", "pos": "tr", "at": 0.4, "dur": 1.6 }
```

**Map flight** (`"set": "map_table"`, prop `map_flight`): Dallas to New York, Taiwan to Santa Clara. A dark map drawn in code from small embedded outlines (no tiles, no network); a dashed route draws from `from` to `to` with a plane on its tip, the camera follows it (`follow`: how close, 1 = the whole map), and the end city gets a pulse ring and a name plate. `map`: `"us"` (lower 48), `"world"` (centred between the two cities, so a Pacific crossing is one piece) or `"region"` (fitted to the two cities). A city is a name from the list in `scenes.js` (`CITIES`: dallas, new york, san francisco, santa clara, los angeles, seattle, chicago, houston, miami, taiwan, tokyo, london, ...) or `{ "name", "lat", "lon" }`. `dur` is the flight in seconds, `at`/`cue` when it takes off.
```json
{ "id": "m1", "cue": "L008", "set": "map_table", "opts": { "night": true }, "place": "the US map", "light": { "x": 960, "y": 540, "r": 1300, "dark": 0.3 },
  "props": [ { "type": "map_flight", "map": "us", "from": "dallas", "to": "new york", "dur": 2.4, "at": 0.4 } ] }
```

## Rules for engine code
- One paused GSAP timeline drives everything. No timers, no `Math.random`, no dates, no network.
- **No callbacks** (`onUpdate`, `call`): a seek does not fire them. Tween properties instead; `counter` shows how to do text.
- Set a transform pivot once, before the element moves (`gsap.set(el, { transformOrigin, smoothOrigin: false })`). Changing it later shifts the element.
- `svgOrigin` is in stage coordinates, so use it only on elements with no transformed parent.
- After any change, build the gallery and look at the frames.
