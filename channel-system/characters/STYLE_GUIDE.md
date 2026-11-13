# Style guide

**Figures, places and everything that is read are drawn in code** by the engine in `studio/` (decision of 13 Nov 2026: the rival is drawn in code too; FORMAT_BOOK 11, Painted pictures). Only thumbnails, and a background now and then, are painted. The plan of 12 Nov to paint places and figures is withdrawn.

The look is ours. Do not imitate another channel's figures, lettering, palette or signature objects.

## House look: cut paper and ink
- **Paper collage.** Flat shapes with an ink-navy outline (`#1b1d36`, 7 px) and a hard offset shadow, as if cut out and laid on a desk. A paper grain covers the whole frame.
- **Every place has its own colour** (13 Nov 2026; Poppi was navy on 84% of its picture time). A place takes one dominant colour family for its walls, its light and its big props, chosen by the creative director in the episode's `look.md` and set with the set option `palette` (engine-v2): brass and brown for a vault, cold teal for a lab or a server hall, amber wood for a courtroom, mint and red for a supermarket, pink for an influencer's loft, blue-violet for an office at night, sodium orange for a street at night. Two neighbouring places never share one. The cream walls and kraft floors are the base of the viewer's own world (a kitchen, a bus stop), not of every place. Night is dark in the place's own colour, never black and never navy everywhere.
- **Accents**: red `#e0262b` (loss, danger), green `#1fa85b` (gain), mustard `#e8a317`, teal `#1f8a8a`, highlighter yellow `#ffe14d`.
- **Type**: Anton (capitals) for cards, counters, signs and labels; Inter Tight for small captions; Source Serif for quoted documents; IBM Plex Mono for sources and ticker boards. No handwriting fonts.
- **Colour follows the mood** through a grade over the whole shot: `green` euphoria, `red` panic, `sepia` history, `night` aftermath, `gold` money and vaults. Use three or more per episode.

## Figures
**The target (13 Nov 2026, after Poppi; the user found the figures childish and too simple).** The rig is being redrawn to this, through `channel-system/engine-requests/2026-11-13-cast-and-places.md`; the user approves the new cast line-up sheet before an episode uses it:
- Adult proportions: the head about a third of the height, a neck, shoulders, a torso that differs by person (tall, broad, slight).
- Arms with elbows and hands with four fingers and a thumb, which grip what they hold. No floating mittens.
- A face with a jaw and cheek shape of its own, ears, a nose that differs by person, hair with volume, eyebrows and mouth that still do the acting.
- Two tones on skin and clothes (a shadow side), line weight that varies, clothes with collars, seams, pockets, buttons.
- A body that acts: a walk with legs and swinging arms, sitting, turning, reaching, handing over, idle weight shifts.
- **Movement with weight** (the animation principles, engine-v2): anticipation before a move (a crouch, a wind-up, a breath before a line that turns), overshoot and settle at the end of a move, follow-through on hair, coat tails, ties and loose arms, ease in and ease out, movement on arcs, and a secondary action while talking (a hand that taps, a foot that shifts). Nothing slides at a constant speed. The QA reviewer judges these on the Look gate's draft render.

**Now** (until the redraw lands), one skeleton for everybody (`studio/engine/rig.js`):
- Squircle head, about 45% of the height. Block body. **Floating mitten hands, no arms.** Short legs, big shoes.
- Tall white eyes with pupils, thick eyebrows that do most of the acting, a small nose.
- Eleven everyday expressions: neutral (a small smile), plain (no smile, for a real person saying something serious), happy, shocked, scared, angry, smug, sad, confused, relieved, deadpan. Four loud ones for hooks, climaxes and thumbnails: panic, furious, crying, greedy. One clear emotion at a time, changed on the word that causes it.
- Hand poses: rest, hips, shrug, cheer, point, think, facepalm, hold, phone, wave, present, raise, carry, panic, grab, offer.
- Things to wear and hold: a `hat` (party, crown, hardhat), a `badge` with a number (an age, a rank, a count), and hand props (phone, bill, tablet, mug, stamp, cash, wallet, price tag, pen, placard, briefcase, magnifier). A prop picks a fitting pose by itself.
- Mouths move with the words when a figure speaks. Figures blink and breathe when idle.
- Each cast member has one signature colour and one signature prop (`cast.md`).
- Crowds are the same skeleton with palettes picked by number, so they vary but never change between renders.

## Living things
Anything abstract in a story is drawn as a **living thing**: a plain object with the same eyes and mouth as the cast, white gloves, and its name written on it. It can talk, react and hold props like a person.

| `thing` | Stands for |
|---|---|
| `box` | a marketplace, a retailer, a delivery |
| `chip` | a chipmaker, computing power |
| `tower` | a corporation, a headquarters |
| `dome` | a parliament, a capital, "the regulators" |
| `bank` | a bank, a lender |
| `factory` | a manufacturer, the supply chain |
| `server` | a data center |
| `cloud` | cloud computing, the internet |
| `coin` | money, a currency, an index fund |
| `bag` | a fund, a budget, somebody's savings |
| `house` | a household, a town, the housing market |
| `barrel` | oil, energy, a commodity |
| `note` | a banknote: "your hundred dollars", a paycheque |

No logos and no shapes copied from a logo. The label is the company's or institution's name in our lettering, or a generic word (`MARKETPLACE`, `CHIPS`, `THE BRAND`).

## Sets and props
- A set is a function in `studio/engine/sets.js` that returns a back layer and a front layer; figures stand between them. Current sets: `studio`, `office`, `trading_floor`, `kitchen`, `street`, `suburb`, `server_room`, `lawn`, `stage`, `warehouse`, `board`, `night_city`, `plain`.
- New stories need new places. The scene builder adds them in the same construction: flat shapes, ink outline, cut shadow, no gradients except skies and spotlights.
- **A place has depth and detail** (13 Nov 2026: Poppi's vault, office and stage were a few flat shapes). Three layers: something in the foreground that the camera passes (a desk edge, a plant, a railing), the middle where figures act, and a back wall with eight or more objects that say where we are (shelves with things on them, framed pictures, cables, a clock, a window with a view). Something lives in the back: a passer-by, steam, a flickering screen, traffic. Every set has a day and a night version.
- **Safe area.** The camera crops up to 7% from each edge. Keep faces, text and numbers inside x 170–1750, y 110–970.
- Every held shot has something moving: the camera, drifting clouds, blinking boards, falling paper.
- Charts are props (`bars`, `line`, `note`), drawn on the `board` set or over a scene. They animate: bars grow, lines draw, the number arrives last.
- Scene props carry the facts: `sign`, `banner`, `pricetag`, `stall`, `podium`, `crates`, `cashpile`, `bunting`. A number on a price tag beats a number floating over the picture.
- **Shot size.** `"frame": "medium"` or `"close"` moves in until the faces fill the picture; the engine never crops a figure out. Use it in skits.
- **Camera language** (13 Nov 2026, engine-v2 keys): `"frame": "ots"` films a conversation over the listener's shoulder (the near shoulder and the back of the head large and dark in the foreground, the speaker's face beyond); `"angle": "low"` looks up at power, `"angle": "high"` looks down on the small. A conversation is cut as shot and reverse shot, never two figures facing the camera for the whole exchange (FORMAT_BOOK 11, Camera language and colour).
- **Crowds.** A market, street, stadium, red carpet, station or audience has background figures (`"extras": n`, engine-v2): the same skeleton in varied palettes, smaller and a little greyed, walking, queueing or cheering, never looking at the camera and never in front of a face or a sign. The story's figures act in front of them.
- **Sound of a place.** Every set carries an ambience bed (room tone, traffic, crowd, machines, rain) that the mix lays under the voice, and the figures' acts make their own small sounds (steps, a door, paper). The scene builder names the bed when it builds the set (FORMAT_BOOK 13).
- **Light.** `"light": { "x", "y", "r", "color", "dark" }` puts one light source in the shot and darkens the rest: a doorway, a screen, a lamp.
- **The hidden piggy bank** (`piggy`, states `calm`, `cracked`, `asleep`, `rich`) is ours. Small, in a corner, about once every three minutes.

## The quality reference
`channel-system/brand/quality_reference.jpg` is the fixed bar every episode is judged against: the top two rows are six frames of the rival's video, the bottom two our best six (Poppi). Build it with `node channel-system/brand/quality-reference.mjs` before looking: the sheet and the rival's frames are not in git, because the repository is public and they are another channel's pictures; the rival's frames are on the user's PC in `%USERPROFILE%\.kadir\quality_reference\`, ours in `brand/quality_reference/`. On a machine without them the top rows are grey: say so instead of judging against words. What the sheet shows on 13 Nov 2026: the rival's figures are as simple as ours; its lead is a colour of its own in every place, sets full of things, and the camera (an over-the-shoulder, a viewfinder). The QA reviewer puts every episode's look sheet and frame sheet beside it; a frame that would look poorer than our own row is a fault, and the aim is the top row. When an episode beats one of our six, the improver proposes the swap.

## Screen furniture
Counters, slams, labels, stamps, day tags, source chips, lower thirds, calendar pages, the corner clock, document cards and post cards live in `studio/engine/overlays.js`. Rules for using them are in `FORMAT_BOOK.md` section 11.

## Companies and logos
- **No real logos, no mascots made from logos.** A company appears as its name in our lettering on a sign, a building, a crate or a chip, or as a generic object for what it sells.
- Ticker boards in the background show made-up names. Real prices appear only as overlays with a source.

## Real people (guest caricatures)
Allowed, with these limits:
- Only public figures (CEOs, politicians, famous investors), only about their public role.
- Built from the same skeleton with two or three traits (hair, glasses, signature clothing). Clearly a cartoon, never realistic.
- A name strip (lower third) the first time they appear.
- No invented quotes presented as real, and no imitation of their voice. Real quotes go on a document or post card, verbatim, with source and date. Skit lines are obviously jokes.
- No sexual, degrading or hateful depictions; never shown endorsing a product.
- Lesser-known people in the story (analysts, officials) are drawn the same way: a caricature with two or three of their own traits and a name strip, only about what they said or did in public. The figure must not contradict the name (a man's name over a woman figure), and two named people in one episode must not share one look.

## Painted pictures
- **The look**: the cut-paper house look, painted. Thick ink-navy outlines, clean simple shapes, big heads, vivid saturated colour with soft painted shading, one clear light source with dark teal shadows around it, a detailed textured background behind simple figures. Clearly a cartoon, never realistic.
- **The style lock**, pasted at the start of every prompt: "Bold editorial cartoon illustration: thick dark ink outlines, clean simple shapes, exaggerated proportions with big heads, vivid saturated colours, soft painted shading, one warm light source, deep teal-blue shadows, detailed textured background. No text, no letters, no numbers, no logos anywhere."
- **Where it is used**: the three thumbnails, and a background for a place that is too costly to build as a set. Not the cast: the figures in the video are the engine's (decision of 13 Nov 2026; the rival's video is code-drawn like ours and only its thumbnails are painted). No painted cast sheets are made.
- **A background** shows the place and its one light, with no figures; the engine's figures act in front of it.
- **Room for the engine**: say in each prompt which part stays plain and dark (the upper third for a band or counter, or one side for a card), because the engine writes there.
- **Files**: 1920x1080 JPEG, under 500 KB, in the episode's `art/`, named by the picture's id in `art-requests.md`.
- **Never**: words, numbers, logos, a real person's realistic face, another channel's figures or objects.

## Thumbnail (house formula)
The thumbnail is a painted close-up in the same look, checked by a person: one figure or two (never more), one face filling a third of the frame or more, one object that glows, a dark ground. `node studio/tools/stills.mjs thumb --image` adds the text band to the painted picture.
1. Top band: the subject in white and one figure in red. Heavy sans, dark outline. Two to four words.
2. Centre: one character with one extreme emotion (a second only when the story is the two of them), holding or facing the story's object, which is the brightest thing in the picture.
3. Background: dark and soft, one situation, nothing to read.
4. Readable at 160×90 px.
5. **It shows the first frame of the video**: same scene, same object, same number.
