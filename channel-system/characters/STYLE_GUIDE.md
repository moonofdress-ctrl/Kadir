# Style guide

From the second episode a video has two layers. **Places and figures are painted pictures**, generated in one fixed look and checked by a person. **Everything that is read is drawn in code** by the engine in `studio/`: cards, counters, charts, signs, tags, name strips and subtitles, in the house type and colours. The first episode was drawn in code alone and looked flat beside the reference channel (`LESSONS.md`).

The look is ours. Do not imitate another channel's figures, lettering, palette or signature objects.

## House look: cut paper and ink
- **Paper collage.** Flat shapes with an ink-navy outline (`#1b1d36`, 7 px) and a hard offset shadow, as if cut out and laid on a desk. A paper grain covers the whole frame.
- **Warm, bright base**: cream walls, kraft floors. Night scenes are navy, never black.
- **Accents**: red `#e0262b` (loss, danger), green `#1fa85b` (gain), mustard `#e8a317`, teal `#1f8a8a`, highlighter yellow `#ffe14d`.
- **Type**: Anton (capitals) for cards, counters, signs and labels; Inter Tight for small captions; Source Serif for quoted documents; IBM Plex Mono for sources and ticker boards. No handwriting fonts.
- **Colour follows the mood** through a grade over the whole shot: `green` euphoria, `red` panic, `sepia` history, `night` aftermath, `gold` money and vaults. Use three or more per episode.

## Figures
One skeleton for everybody (`studio/engine/rig.js`):
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
- **Safe area.** The camera crops up to 7% from each edge. Keep faces, text and numbers inside x 170–1750, y 110–970.
- Every held shot has something moving: the camera, drifting clouds, blinking boards, falling paper.
- Charts are props (`bars`, `line`, `note`), drawn on the `board` set or over a scene. They animate: bars grow, lines draw, the number arrives last.
- Scene props carry the facts: `sign`, `banner`, `pricetag`, `stall`, `podium`, `crates`, `cashpile`, `bunting`. A number on a price tag beats a number floating over the picture.
- **Shot size.** `"frame": "medium"` or `"close"` moves in until the faces fill the picture; the engine never crops a figure out. Use it in skits.
- **Light.** `"light": { "x", "y", "r", "color", "dark" }` puts one light source in the shot and darkens the rest: a doorway, a screen, a lamp.
- **The hidden piggy bank** (`piggy`, states `calm`, `cracked`, `asleep`, `rich`) is ours. Small, in a corner, about once every three minutes.

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
- **The sheets**: `sheets/style_painted.png` (one picture that fixes the look) and `sheets/<name>_painted.png` for each cast member and the chip (prompts in `cast.md`). They are attached as references to every generation. Made once, approved by the user, then not changed.
- **Room for the engine**: say in each prompt which part stays plain and dark (the upper third for a band or counter, or one side for a card), because the engine writes there.
- **Files**: 1920x1080 JPEG, under 500 KB, in the episode's `art/`, named by the picture's id in `art-requests.md`.
- **Never**: words, numbers, logos, a real person's realistic face, another channel's figures or objects.

## Thumbnail (house formula)
The thumbnail is a painted close-up in the same look, checked by a person: one face filling a third of the frame or more, one object, one situation, one strong background colour. `node studio/tools/stills.mjs thumb` makes one from the video's own first shot, or from an illustration, with the text band added.
1. Top band: the subject in white and one figure in red. Heavy sans, dark outline. Four words at most.
2. Centre: one character, one extreme emotion, holding or facing the story's object.
3. Background: one dramatic situation, darker and softer than the character.
4. Readable at 160×90 px.
5. **It shows the first frame of the video**: same scene, same object, same number.
