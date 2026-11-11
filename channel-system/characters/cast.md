# Cast

Five recurring characters plus a template for guest caricatures. Designs are deliberately different from other finance cartoon channels: no glasses-and-green-suit host, no bow ties.

## In the video: drawn in code
The cast is built into the engine (`studio/engine/rig.js`, the `CAST` table). Use the names below in `storyboard.json`:

| Name | Role in a story | Signature colour | Props that suit them |
|---|---|---|---|
| `BENNY` | The viewer: an ordinary saver | Mustard hoodie | `phone` (green or red screen) |
| `CHAD` | The hype trader | Purple hoodie and cap | `phone` |
| `HAL` | The fund manager | Navy suit, gold tie | `tablet`, `mug`, `cash` |
| `MARTHA` | The household that pays the bill | Teal cardigan | `bill` |
| `REGGIE` | Any regulator or rule-maker | Grey suit, red tie, lanyard | `stamp` |

Any other name gives a background figure with a palette picked from the name. A guest caricature is a figure with a `style` override (hair, glasses, clothes); see `STYLE_GUIDE.md` for the limits.

The viewer stand-in for an episode (usually `BENNY`, sometimes `MARTHA`) is named in the storyboard's `"viewer"` field and must own the final shot.

The descriptions below are the character bible. The image prompts under each character are for **thumbnail art only**; the video never uses generated images.

## Thumbnail art: model sheets (one-time, in Higgsfield)
1. Model: **Nano Banana Pro**, 2k, aspect 16:9 (expression sheets 1:1).
2. For each character, generate the **model sheet** first. Pick the best one and save it to `sheets/<name>_model.png` (or just tell Claude which generation to pull from your Higgsfield history).
3. Generate the expression and pose sheets with the chosen model sheet attached as an image reference.
4. Every later scene image attaches the model sheet as a reference so the character stays the same.

Each prompt below already includes the style lock from `STYLE_GUIDE.md`.

---

## 1. BENNY (host)
**Who:** 34, an ordinary saver. Has an S&P 500 index fund, a 401(k), a mortgage and a power bill. Every story is eventually about Benny's money, so the viewer sees themselves in him.
**Personality:** Curious, a little anxious, honest. Says what the viewer is thinking ("Wait, I own that?").
**Running gags:** checks his phone under the desk; his portfolio app has a face that mirrors his mood; his coffee mug changes slogan with the market.
**Look:** messy brown hair with one tall cowlick, freckles, big ears, no glasses. Mustard-yellow hoodie (#E8A317) over a white T-shirt, dark jeans, white sneakers. Prop: a smartphone with a cracked corner.
**Signature color:** mustard yellow.

Model sheet prompt:
```
Character model sheet of BENNY, a 34-year-old ordinary American office worker: messy brown hair with one tall cowlick, freckles, big ears, friendly slightly anxious face, no glasses, mustard-yellow hoodie over a white T-shirt, dark jeans, white sneakers, holding a smartphone with a cracked corner. Four full-body views in a row on a plain white background: front, three-quarter, side profile, back. Same proportions in every view.
Bold-outline editorial cartoon. Big head, small body (head about 1/3 of total height). Thick clean black outlines, flat colors with soft two-tone cel shading. Very expressive face: large round eyes, eyebrows doing most of the acting. No text, no letters, no logos, no watermarks.
```
Expression sheet prompt (attach the model sheet):
```
Expression sheet of the character in the reference image, head and shoulders only, 3x3 grid on plain white: neutral, happy, shocked with mouth open, terrified with sweat drops, angry, smug, crying, confused with one eyebrow up, relieved. Same character, same hoodie, same style. No text.
```
Pose sheet prompt (attach the model sheet):
```
Pose sheet of the character in the reference image, full body, plain white background, six poses in a row: checking phone in panic, pointing at something off-screen, shrugging, facepalm, cheering with both arms up, sitting at an office desk hiding a phone under it. Same character, same style. No text.
```

---

## 2. CHAD (the hype trader)
**Who:** 26, trades options on his phone, always buys the top and sells the bottom.
**Personality:** loud, overconfident, lovable. Talks in slogans.
**Running gags:** "Buy the dip!" at the worst possible moment; an energy-drink can that gets bigger as the market falls; his screen is always red when he looks at it.
**Look:** tall and lanky, backwards purple cap, sunglasses pushed up on his forehead, purple hoodie (#6B3FA0) with an abstract lightning-bolt pattern, cargo shorts, high-top sneakers. Prop: a phone held sideways, an energy-drink can.
**Signature color:** purple.

Model sheet prompt:
```
Character model sheet of CHAD, a 26-year-old overconfident amateur stock trader: tall and lanky, backwards purple cap, sunglasses pushed up on his forehead, big grin, purple hoodie with an abstract lightning-bolt pattern, cargo shorts, high-top sneakers, holding a phone sideways and an energy-drink can with no label. Four full-body views in a row on a plain white background: front, three-quarter, side profile, back. Same proportions in every view.
Bold-outline editorial cartoon. Big head, small body (head about 1/3 of total height). Thick clean black outlines, flat colors with soft two-tone cel shading. Very expressive face: large round eyes, eyebrows doing most of the acting. No text, no letters, no logos, no watermarks.
```

---

## 3. HAL (the hedge fund manager)
**Who:** 55, runs a big fund. Calm when everyone panics, because he sold yesterday.
**Personality:** smug, dry, speaks in short sentences. Never explains himself.
**Running gags:** "Locking in gains."; sips espresso from a tiny cup while the world burns; his tablet always shows a green line.
**Look:** short and round, slicked-back silver hair, thin moustache, tiny rectangular rimless glasses perched low, navy three-piece suit, gold watch, cufflinks. Prop: a tablet with a chart, a tiny espresso cup.
**Signature color:** navy and gold.

Model sheet prompt:
```
Character model sheet of HAL, a 55-year-old smug hedge fund manager: short and round, slicked-back silver hair, thin moustache, tiny rectangular rimless glasses perched low on his nose, navy three-piece suit, gold watch and cufflinks, calm half-smile, holding a tablet and a tiny espresso cup. Four full-body views in a row on a plain white background: front, three-quarter, side profile, back. Same proportions in every view.
Bold-outline editorial cartoon. Big head, small body (head about 1/3 of total height). Thick clean black outlines, flat colors with soft two-tone cel shading. Very expressive face: large round eyes, eyebrows doing most of the acting. No text, no letters, no logos, no watermarks.
```

---

## 4. MARTHA (the household)
**Who:** 52, nurse, two teenagers. Pays the power bill, the groceries and the retirement contributions. The person every macro story eventually lands on.
**Personality:** practical, sharp-tongued, unimpressed by Wall Street.
**Running gags:** reads every bill out loud; "Nobody reads a spending report. Everybody reads their power bill."; her kitchen-table calculator.
**Look:** curly auburn hair in a loose bun, reading glasses on a beaded chain around her neck, teal cardigan (#1F8A8A) over light scrubs, comfortable shoes. Prop: a utility bill, a pocket calculator.
**Signature color:** teal.

Model sheet prompt:
```
Character model sheet of MARTHA, a 52-year-old practical American nurse and mother: curly auburn hair in a loose bun, reading glasses hanging on a beaded chain around her neck, teal cardigan over light-blue scrubs, comfortable shoes, skeptical raised eyebrow, holding a paper utility bill and a pocket calculator. Four full-body views in a row on a plain white background: front, three-quarter, side profile, back. Same proportions in every view.
Bold-outline editorial cartoon. Big head, small body (head about 1/3 of total height). Thick clean black outlines, flat colors with soft two-tone cel shading. Very expressive face: large round eyes, eyebrows doing most of the acting. No text, no letters, no logos, no watermarks.
```

---

## 5. REGGIE (the regulator)
**Who:** a government official who arrives late with paperwork. Stands in for the SEC, the FTC, Congress, any rule-maker.
**Personality:** slow, procedural, quietly powerful.
**Running gags:** a giant rubber stamp that everyone fears; "Not yet."; forms in triplicate.
**Look:** tall and thin, grey suit, red tie, side-parted grey hair, heavy eyebrows, lanyard ID badge with no readable text. Prop: an oversized rubber stamp, a clipboard.
**Signature color:** grey with a red tie.

Model sheet prompt:
```
Character model sheet of REGGIE, a tall thin government regulator: grey suit, red tie, side-parted grey hair, heavy eyebrows, deadpan expression, lanyard ID badge with no readable text, holding an oversized rubber stamp and a clipboard. Four full-body views in a row on a plain white background: front, three-quarter, side profile, back. Same proportions in every view.
Bold-outline editorial cartoon. Big head, small body (head about 1/3 of total height). Thick clean black outlines, flat colors with soft two-tone cel shading. Very expressive face: large round eyes, eyebrows doing most of the acting. No text, no letters, no logos, no watermarks.
```

---

## 6. Guest caricatures (public figures)
Use when the story is about a specific public figure. Follow the limits in `STYLE_GUIDE.md`.

Template:
```
Bold-outline editorial cartoon caricature of a [ROLE, e.g. "tech CEO"] with [2–3 signature traits, e.g. "silver swept-back hair, black leather jacket, rectangular glasses"], [EMOTION], [ACTION / SITUATION]. Big head, small body, thick clean black outlines, flat colors with soft cel shading, exaggerated cartoon features, clearly a cartoon and not a photo. [BACKGROUND]. No text, no logos.
```
Save each approved guest in `sheets/guest_<name>.png` so the same likeness returns in later episodes.

## Voices (filled in once the voice decision is made)
| Character | Voice direction |
|---|---|
| Narrator | Calm, warm, documentary American male or female |
| Benny | Friendly, slightly nervous, mid-30s |
| Chad | Loud, fast, bro energy |
| Hal | Low, slow, smug |
| Martha | Dry, firm, no-nonsense |
| Reggie | Flat, bureaucratic |
