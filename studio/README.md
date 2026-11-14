# Studio: the code-drawn video engine

Turns a storyboard and a set of voice clips into a HyperFrames composition. Text, numbers, charts and figures are drawn in code (SVG and HTML). A place too costly to draw can be a painted background from the episode's `art/` folder (`"set": "picture"`), with the engine's figures and text over it.

## Files

| Path | What |
|---|---|
| `engine/rig.js` | Rig v2 (13 Nov 2026): the adult skeleton (neck, shoulders, elbowed arms with five-fingered hands, knees), the traits that make a person (build, jaw, nose, hair, clothes), the cast, expressions, arm poses (solved by inverse kinematics), hats, badges, hand props, lip sync, and the living things (`THINGS`, which keep their gloves). |
| `engine/sets.js` | Sets (places), their palettes (`PALETTES`, `SET_PALETTE`) and dressing (`DRESS`: back-wall objects, a foreground, a living detail; helpers in `D`), and world props (charts, the banknote, the tower, signs, banners, price tags, stalls, crates, the hidden piggy bank). |
| `engine/scenes.js` | Story and explainer scenes: evidence board, timeline tunnel, map flight, money flow, fund split, chain, phone messages (props), and their dark grounds (`evidence_wall`, `timeline_road`, `map_table`, `dark_stage`). |
| `engine/overlays.js` | Counters, slams, labels, stamps, tags, lower thirds, calendar, clock, document and post cards. |
| `engine/core.js` | Shot types (scene, card, chapter, split), camera, shot size, light, grades. |
| `engine/features.json` | The storyboard keys this engine supports, for the lint and the agents. Update it in the same commit as the engine code that adds a key. |
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
It writes `render/frames.jpg` in the episode folder: the first frame, the middle of every shot and the last second. `--t 0,3,9.5` picks moments, `--every 10` samples the whole episode. It needs a browser driver, once, in `studio/`: `npm install --no-save playwright-core` uses the Chrome or Edge already installed (set `CHROME_PATH` if it is somewhere unusual); or `npm install --no-save playwright` and `npx playwright install chromium` for Playwright's own. The sheet draws each frame in a small iframe and can drop an overlay or a colour grade that the video has (13 Nov 2026: the counter of Poppi `c3s20b` and its red grade were missing on the sheet, present in the render). Before calling a missing overlay a fault, render those few seconds: `cd studio && npx --yes hyperframes@0.9.26 render --start <s> --end <s> --quality draft -o <scratch>.mp4`.

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
- **Walking** (rig v2): a person's `"to"` is a real walk: the legs scissor and the swinging knee bends, the arms swing against the legs, the body bobs and leans into the walk and settles when it stops; the hair follows through. A living thing still rocks along. Gallery w01.
- **Entrances**: a person with no `"enter"` walks in from the nearer edge of the frame (`"enter": "walk"` asks for it); `"pop"`, `"slide_left"`, `"slide_right"`, `"rise"` and `"none"` work as before, and living things still pop in. Every storyboard written before 14 Nov names its entrance, so it plays as it did. Gallery w02.
- **Acts that use the body**: an act with `"act"`: `"sit"` (the thighs fold toward the camera and the body drops onto a seat; the hands go to the lap unless the act names a `pose`), `"stand"`, `"turn"` (the back to the camera; a second `"turn"` turns back), `"lean"` (toward the side the figure faces), `"lean_back"`, `"upright"`, `"slam"` (both hands down hard on a table, with a lean and a settle; put the table in front with the set's `tableFront` or a front prop), and `"handover"` with `"with": "WHO"` (the figure's prop passes into the other figure's hand: one reaches, the other gives, and the receiver keeps holding it). New arm poses for these: `reach`, `give`, `slam`, `lap`. Every act starts with a small move the other way and ends with a settle. Gallery w05-w08.
- **Extras** (crowds): `"extras": 6` on a shot or a panel adds that many background people (up to 14): the rig's skeleton with looks picked from the shot's id, smaller and a little greyer than the story's figures, standing behind them and behind every prop and sign. About a third walk across the frame, the rest stand and look toward the middle, some seen from behind; nobody looks at the camera. The same shot always gets the same people. `"opts": { "empty": true }` keeps a place empty. Use it in a market, street, stadium, red carpet, station or audience. Gallery w03-w04.
- **Subtitles** are on by default and rest during text cards; `"subtitles": false` at the top of the storyboard turns them off.
- **Split by chapter**: `storyboard.json` holds the header and every file in `storyboard/` (`ch1.json`, `ch2.json`...) adds its `"shots"`, in file-name order. Shot ids must be unique across files.
- **Shot size**: `"frame": "medium"` or `"close"` moves in on the figures; `"focus": [x, y]` aims it somewhere else.
- **Over the shoulder**: `"frame": "ots"` films a conversation over the listener's shoulder: the camera moves in on the speaker, whose face sits a third of the way in on their own side, and the listener is drawn from behind (back of the head, a shoulder), large and darkened in the other lower corner; it moves with the camera. The speaker is the first figure that `speaks`, the listener the next person; `"ots": { "speaker": "HAL", "listener": "BENNY" }` picks them. Cut a conversation as shot and reverse shot: the next shot swaps the two names. Gallery v17-v18.
- **Camera angle**: `"angle": "low"` looks up (lines meet above the frame: power, a looming boss), `"angle": "high"` looks down (lines meet below: someone small, a crowd seen from above). It is a perspective tilt of the whole world, so it adds to any camera move and shot size. Gallery v19-v20.
- **Light**: `"light": { "x": 960, "y": 430, "r": 900, "color": "#ffd9a0", "dark": 0.6 }`: one source, darkness around it (screen position). `"kind"` picks another kind of light; every old light works as before:
  - `"kind": "window"`: a soft slanted shaft of light from a window with its cross-bar shadow, the room dim around it (`x`, `y` the top of the window, `w` its width, `slant`, `color`, `dark`, default 0.42).
  - `"kind": "screen"`: cold light from below that breathes a little, as from a phone or a monitor (`x`, `y` where the screen is, `color`, `dark`, default 0.62).
  - `"kind": "neon"`: two coloured sources, magenta and cyan unless `color` and `color2` say otherwise; one tube buzzes now and then (`x`, `x2`, `y`, `dark`, default 0.4).
  - `"kind": "day"`: daylight: bright and warm, and the frame's vignette is off for the shot. It is not a dark picture.
  Gallery v13-v16.
- **Palette**: every place has one dominant colour of its own, with a day and a night look. `"opts": { "palette": "teal" }` on a shot or a panel; without it each set uses its default (`SET_PALETTE` in `sets.js`: kitchen amber, boardroom wood, pitch_stage plum, night_office violet, bank ochre, supermarket mint, back_shop olive, desk_top wood...). Palettes: `teal`, `green`, `blue`, `navy`, `red`, `amber`, `violet`, `wood`, `cream`, `pink`, `mint`, `slate`, `ochre`, `olive`, `plum`; each has a wall, a lower wall or cabinet colour, a floor, a trim, an accent and a lamp colour. The night look (`"night": true`, or the sets that are night unless `"night": false`) darkens the walls in the same colour; lamps keep theirs. The eight sets Poppi used most take the palette into their own colours and carry their dressing; any other set gets a wash of the palette's colour over its back layer when a shot names one. Gallery v03-v12.
- **Set dressing**: `kitchen`, `boardroom`, `pitch_stage`, `night_office`, `bank`, `supermarket`, `back_shop` and `desk_top` have eight or more things on the back wall (frames, a clock whose second hand moves, shelves with things on them, sconces, vents, posters, plants, cables), a foreground the camera passes (a plant, a rail, a TV camera, a cart, drifting slightly faster than the room) and one living detail (steam from a cup or a kettle, a blinking light, a shopper walking past, a flickering screen). `"opts": { "bare": true }` leaves it out. New sets use the helpers in `D` (`frame`, `clock`, `shelf`, `plant`, `cable`, `window`, `poster`, `sconce`, `vent`, `switch`, `steam`, `mug`, `fgPlant`, `fgEdge`, `fgRail`, `fgCamera`) and add an entry to `DRESS`.
- **An episode's own people**: `"cast": { "NAME": { traits } }` in the storyboard header draws the story's real people from the rig's skeleton, with no engine change (the keys, a full example and the rules for a good figure are in `channel-system/characters/cast.md` and `STYLE_GUIDE.md`, Figures). Gallery v21.
- **Living things**: an actor with `"thing": "box"` (or `chip`, `tower`, `dome`, `bank`, `factory`, `server`, `cloud`, `coin`, `bag`, `house`, `barrel`, `note`) and a `"label"`. It takes `face`, `pose`, `prop`, `speaks` and `acts` like a person.
- **On a figure**: `"hat"`, `"badge": "62"`, and hand props with text: `"prop": "placard", "sign": "SELL"`, `"prop": "tag", "tag": "$52"`.
- **Sound**: stamps, slams, cards, chapter cards and document cards get a soft effect by themselves. `"sound": "ding"` on a shot, panel or overlay adds one (`stamp`, `slam`, `card`, `chapter`, `paper`, `whoosh`, `ding`, `pop`, `tick`, `riser`); `"sound": false` removes one. Episode options: `"audio": { "music": "house" | "none", "music_db": -19, "climax": [5, 6], "sfx": true }`.
- **Ambience** (the sound of a place): every set declares an ambience bed (`SET_AMBIENCE` in `sets.js`): `room` (room tone), `office`, `studio`, `shop`, `market`, `street`, `outdoors`, `night`, `crowd`, `machine`. `mix.mjs` lays the bed of each picture under the voice and the music, cut with the picture (short fades at the cuts; cards and chapter cards are silent), about 21 to 28 dB under the voice. A shot takes another bed with `"ambience": "street"` (or `"opts": { "ambience": "street" }`), none with `"ambience": false`. Episode options: `"audio": { "ambience": false }` turns them off, `"ambience_db": -24` puts every bed at one level. The beds are 16-second loops made in code by `tools/sounds.mjs` (`node studio/tools/sounds.mjs` writes them to `assets/sounds/amb_*.wav` to listen to). `audio/mix.json` lists them: `ambience` (place, set, bed) and `ambience_default` (every picture has a bed).
- **Act sounds** (foley): the figures' body actions make their own small sounds, placed by `mix.mjs` from the storyboard with the engine's timing: steps for a walk (`"to"`, a walk-in entrance), `sit` for sitting, a cloth `rustle` for a pose change, a turn, a lean, a stand, a handover or a pop-in, `table` for a slam, `slide` for a prop that travels (`"move"`). They sit lower than the effects and do not count as effects (lint A7, A8). `"audio": { "foley": false }` turns them off. `audio/mix.json` reports `foley: { count, sounds }` (actions with a sound, and all the sounds).
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

**Rolling counter** (overlay `counter` with `"roll": true`; every old counter works as before; money is written as the narration says it, like any counter: `$1.95B` is `"to": 1.95, "decimals": 2, "suffix": "B"`, `$278M` is `"to": 278, "suffix": "M"`): the digits roll vertically like a slot machine to the target, the most significant one settling first, upward when the number rises and downward when it falls. The colour turns green when it rises fast (a fifth or more, or from zero) and red when it falls (a tenth or more); an explicit `"tone"` stays as written, `"tone": "auto"` is the default of a roll. `"tick": true` (or 1-3) puts the engine's `tick` effect on the first digits to settle, never closer than the mix's minimum spacing; it is opt-in because every tick counts toward lint A8, so use it on one counter in a few shots, not on all.
```json
{ "type": "counter", "roll": true, "tick": true, "from": 0, "to": 1.95, "decimals": 2, "prefix": "$", "suffix": "B", "cap": "SOLD FOR", "pos": "tr", "at": 0.4, "dur": 1.6 }
```

**Map flight** (`"set": "map_table"`, prop `map_flight`): Dallas to New York, Taiwan to Santa Clara. A dark map drawn in code from small embedded outlines (no tiles, no network); a dashed route draws from `from` to `to` with a plane on its tip, the camera follows it (`follow`: how close, 1 = the whole map), and the end city gets a pulse ring and a name plate. `map`: `"us"` (lower 48), `"world"` (centred between the two cities, so a Pacific crossing is one piece) or `"region"` (fitted to the two cities). A city is a name from the list in `scenes.js` (`CITIES`: dallas, new york, san francisco, santa clara, los angeles, seattle, chicago, houston, miami, taiwan, tokyo, london, ...) or `{ "name", "lat", "lon" }`. `dur` is the flight in seconds, `at`/`cue` when it takes off.
```json
{ "id": "m1", "cue": "L008", "set": "map_table", "opts": { "night": true }, "place": "the US map", "light": { "x": 960, "y": 540, "r": 1300, "dark": 0.3 },
  "props": [ { "type": "map_flight", "map": "us", "from": "dallas", "to": "new york", "dur": 2.4, "at": 0.4 } ] }
```

### Explainer scenes (second batch, `engine/scenes.js`)

Same rules as above, on the plain dark ground `"set": "dark_stage"`. **Every shot that uses one carries `"explains": "what it makes clear"`**, a note for the reviewer (the engine ignores it).

**Money flow** (prop `money_flow`): who paid whom. `parties` (2-5, in a row; same fields as board nodes: `id`, `kind` `face`|`badge`, `who`, `name`, `icon`, `color`) and `flows` (`from`, `to`, `amount` written as the narration says it, `coins: true` for coins instead of bills, `cue`/`word`/`at`). Each arrow draws itself on its cue, bills stream along it, the amount lands on it, the receiver pops.
```json
{ "id": "e01", "cue": "L010", "explains": "who paid whom when PepsiCo bought the soda", "set": "dark_stage", "opts": { "night": true }, "place": "the money table", "light": { "x": 960, "y": 560, "r": 1300, "dark": 0.45 },
  "props": [ { "type": "money_flow", "parties": [ { "id": "p", "kind": "badge", "icon": "building", "name": "PEPSICO" }, { "id": "f", "kind": "face", "who": "ALLISON_ELLSWORTH", "name": "FOUNDERS" } ],
    "flows": [ { "from": "p", "to": "f", "amount": "$1.95B", "at": 0.6 } ] } ] }
```

**Fund split** (prop `split_bar`): one amount, one bar. `total`, `note`, and `parts` (`label`, `amount`, `share` as a fraction of the bar, `color`, `cue`/`word`/`at`). On each part's cue it takes its colour, slides out of the bar and its label and amount stand under it. "Of every $100": `total` `"$100"` and amounts `"$40"`.
```json
{ "id": "e02", "cue": "L011", "explains": "where the $1.95B went", "set": "dark_stage", "opts": { "night": true }, "place": "the split", "light": { "x": 960, "y": 560, "r": 1300, "dark": 0.45 },
  "props": [ { "type": "split_bar", "total": "$1.95B", "note": "what PepsiCo paid", "parts": [ { "label": "TAXES", "amount": "$490M", "share": 0.25, "at": 0.8 }, { "label": "CASH", "amount": "$1.46B", "share": 0.75, "at": 2.0 } ] } ] }
```

**Cause and effect chain** (prop `chain`): the script's CHAIN line in one picture. `nodes` (3-5; `text`, a face `who` or a glyph `icon`/`color`, `cue`/`word`/`at`) and `links`: the word on the arrow after each box (`so` green, `but` red, anything else gold). Boxes light one at a time, the arrow into the active box glows, the rest dim.
```json
{ "id": "e03", "cue": "L013", "explains": "why rich on paper is not rich in the bank", "set": "dark_stage", "opts": { "night": true }, "place": "the chain", "light": { "x": 960, "y": 560, "r": 1300, "dark": 0.45 },
  "props": [ { "type": "chain", "nodes": [ { "text": "The sale happened", "icon": "coin", "at": 0.3 }, { "text": "Founders were rich", "who": "ALLISON_ELLSWORTH", "at": 1.8 }, { "text": "Only on paper", "icon": "bank", "at": 3.3 } ], "links": [ "so", "but" ] } ] }
```

**Phone messages** (prop `chat`): a phone with bubbles that appear one by one after a typing dot. **Only messages that are on the record** (court filing, post, interview): give `source` (printed on the phone) and show it with a `source` overlay too. A reconstruction must say so: `"reconstruction": true` puts a RECONSTRUCTION band on the phone for the whole shot (a chat with neither `source` nor `reconstruction` gets the band anyway and a console warning). `messages`: `from` `"them"` (default) or `"me"`, `text`, `cue`/`word`/`at`. Incoming messages get a soft `pop` through `tools/cues.mjs`: at most 3 per phone, never closer than the minimum spacing; `"sound": false` on the chat (or a message) silences them, so lint A8 stays in reach.
```json
{ "id": "e04", "cue": "L014", "explains": "the text message that is on the record", "set": "dark_stage", "opts": { "night": true }, "place": "the phone", "light": { "x": 960, "y": 520, "r": 1300, "dark": 0.45 },
  "props": [ { "type": "chat", "name": "Court filing", "source": "Exhibit 12, 2025", "messages": [ { "from": "them", "text": "Did you see the offer?", "at": 0.8 }, { "from": "me", "text": "I did.", "at": 3.0 } ] } ],
  "overlays": [ { "type": "source", "t": "Court filing, exhibit 12", "at": 0.4 } ] }
```

## Rules for engine code
- One paused GSAP timeline drives everything. No timers, no `Math.random`, no dates, no network.
- **No callbacks** (`onUpdate`, `call`): a seek does not fire them. Tween properties instead; `counter` shows how to do text.
- Set a transform pivot once, before the element moves (`gsap.set(el, { transformOrigin, smoothOrigin: false })`). Changing it later shifts the element.
- `svgOrigin` is in the coordinates of the element's parent, read before the element's own transform. The rig turns its joints this way: each joint is a group with no transform of its own inside a positioned wrapper, pivoted with `svgOrigin: "0 0"` (tested 13 Nov 2026 inside scaled and mirrored parents).
- A rotation that must keep something upright (a prop in a hand on a swinging arm) is the negative sum of the rotations above it, tweened with the same duration and ease, so it stays exact on every frame.
- `clip-path` ids are made from a counter (`rgN`), never from randomness; a clip goes on a group with no transform of its own (a clip on a transformed element moves with it).
- After any change, build the gallery and look at the frames.

## Places, things and keys added for episode 3 (14 Nov 2026)
- **New sets** (each takes `opts.palette`, `night`, and has its ambience bed in `SET_AMBIENCE`): `corner_office` (`view` wide|desk|door, `clock` "4:20", `clock_lit`, `plate` before|taped|unscrewed|two|rattle|frame|false, `chair` jacket|bare|agenda|false, `note`, `bare_desk`, `dark_right` for the end screen), `bus_stop` (`night` = rain, `rain`), `newsroom` (`screen` red; living things stand at y 735 or higher so the desk does not hide them), `diner`, `cinema` (`view` back, `house`, `jacket`), `records_office` (`drawer`), `tv_studio` (`outlet`, `card`), `theatre` (`dress` coat_check|box_office|dressing_room, `sign`, `pop`), `gym`, `rooftop` (`page`), `printing_press`, `laundromat`, `lobby` (`spin`), `garage` (`creeper`), `food_truck`, `library` (`fire`), `weather_station`, `auction_house` (`lot`), `hospital` (`number`), `radio_studio` (`air`), `sports_bar` (`count`), `lighthouse` (`fog`), `phone_booth` (`stamp`, `who: false`, `rain: false`). Back walls have eight or more objects; the floor from y 800 down is free for `"extras"`.
- **Dressings** (`opts.dress`, a whole look of an existing set, in `VARIANT` in `sets.js`): `trading_floor` dawn|exchange, `corridor` exec|doors|courthouse, `lawn` playground|park, `office` after_hours (`line` drop|rise)|cubicle, `back_shop` engraver|print, `night_office` recruiter, `pitch_stage` earnings (`squeal`), `farmers_market` night, `bank` counter (`sign`, `chart`, `name`), `street` shuttered, `kitchen` jar, `train_platform` night, `stadium` scoreboard, `bedroom` dusk, `boardroom` head_chair|two_chairs. A dress has its own bed as `SET_AMBIENCE["set:dress"]`.
- **Props**: `exec_chair` (state jacket|bare|agenda), `door_plate` (state, `act` press|rattle), `desk_phone` (`note`, `state` tangled, curl), `jacket`, `calculator`, `name_plate` (`tape`). **Living things**: `the_board` (`open`, `tip`), `desk_lamp`, `teleprinter` (`pile`), `printer` (`page`), `newspaper_box` (`turn`), `envelope`, `coreweave`, `nebius` (`wobble`, `ice`). **Guests**: `channel-system/episodes/nvidia-cfo-era/guests.json`.
- **Engine**: light kind `fire`; `"sound": "sting"`; ambience bed `rain` (a shot with `opts.rain: true` takes it); `opts.rain: true` draws rain over any set; `"frame": "ots"` accepts a living thing as the speaker.
