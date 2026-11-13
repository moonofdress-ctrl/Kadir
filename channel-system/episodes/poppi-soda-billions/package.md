# YouTube package

Status 13 Nov 2026: written while the full render runs. Thumbnails are NOT painted yet (image credits not approved); Shorts are NOT built yet.

## Shelf check (FORMAT_BOOK 15)

Could see: one web search limited to youtube.com returned ten titles on the Poppi sale (below). Could not see: channel names, view counts, dates, thumbnails or bands. vidIQ is out of credits, and two watch-page fetches returned only the title. No views are stated here because none were seen.

Titles on the shelf: "How a Tiny Soda Brand Became a $2 Billion Pepsi Acquisition" (hashtag, Short-style); "PepsiCo buys prebiotic soda brand Poppi to gain a foothold in functional drinks" (two uploads); "Poppi's Founders: Building a $2 billion soda brand"; "Did PepsiCo Just Waste $2 Billion on Poppi?"; "'ENTIRE LIFE SAVINGS': Poppi's path from beverage experiment to $2 BILLION deal"; "Poppi's $1.95B Sale to PepsiCo Sparks Concerns Over Recipe Changes"; "How a Rebrand Turned Poppi Into a $2B Biz"; "Poppi Culture (soda billionaires, influencer beverage investors, ...)"; "Can Pepsi's poppi purchase help it go younger as Americans drink less soda?".

What it shows: the shelf is news clips, interviews and "how it got to $2B" stories. None of the titles mentions the tax benefit, the earnout cut or the lawsuit settlement (titles only; contents not seen). Their titles carry the figure; ours puts it in the band for B and C. Pair A's title is close to "How a Tiny Soda Brand Became a $2 Billion...": if the user wants more distance, use B's title for A. Repeat the shelf check on upload day, with views visible in YouTube itself.

## Three pairs

| Pair | Reason to click | Title | Thumbnail scene and time | Band (white + red) | What it promises, and where the video pays it |
|---|---|---|---|---|---|
| A (first frame) | Consequence | How Poppi Made $1.95 Billion From Soda | `c1s01`, 0:00: Allison Ellsworth, pregnant, coral dress, face a third of the frame; the swing-top bottle with a face glows amber on the pitch table, price tag face-down; one spotlight, navy dark | `9 MONTHS PREGNANT` | What she risked. Paid at 0:00, at the birth ten days later (2:32) and in the end. |
| B | Contrast | Poppi's Price Tag Was Not What It Looked Like | `c1s10`, 0:23: close on the bottle, shocked, as the price tag flips and blazes gold; one figure | white `VINEGAR?` red `$1.95B` | A fortune for vinegar, and a number that shrinks. Hook at 0:24 (Benny: "For vinegar?"); tax benefit at 9:56; earnout at 11:02. |
| C | Open question | Who Was Watching Poppi's Pitch? | `c1s09`, 0:21: the navy giant can (no brand shapes) leans from the rafters toward the tiny glowing bottle | white `HE WAS WAITING` | Who the buyer was. Planted at 0:17 ("a cola giant will pay"); answered at 6:28 (PepsiCo's own try was scrapped) and 9:32 (the purchase). |

One title for all three pictures: **How Poppi Made $1.95 Billion From Soda** (the script's title, A's title). If the test compares only pictures, use this one.

Start with: A with its own title. A judgment, not a measurement: it is the first frame, the face is largest, and a person in trouble is what the niche clicks on (FORMAT_BOOK 1). The prompts for the three painted pictures are in `prompts.md`; bands are as in `thumbnails.md`. After painting: band with `stills.mjs thumb`, check each `_small.png` at 160x90, keep the lower right empty, and confirm A matches the first frame of the video.

## Description, tags, pinned comment, Studio settings

In `youtube-upload.txt` (description 2,806 characters; limit 5,000, ours under 4,500). Every fact in it is verified in `factcheck.md`; allegations are worded as allegations; the founders' payout is "Fortune reported". Chapter stamps are from `timing.json`; chapter 1 is 0:00. Captions: `poppi-soda-billions.srt` (290 cues from `audio/lines.json` and `timing.json`).

## End screen

No earlier episode to link yet. Suggest a Subscribe element only; add the newest episode once episode 2 exists.

## Disclosure

Narration: synthetic voice (the free Kokoro scratch voice; no paid final voice chosen). The description says so. README.md records the user's decision of 12 Nov 2026 to disclose and set YouTube's altered-content label; the user re-reads YouTube's current text before upload. Characters are cartoons; no real person's voice or realistic face.

## A/B test note

YouTube compares up to three thumbnails (and titles) and picks by watch time. Nobody knows the winner in advance. Leave the result for the analyst.

## Shorts plan (FORMAT_BOOK 16): NOT BUILT YET

Run nothing until the full render has finished (build writes in `studio/`). Times from `timing.json`.

| # | Lesson | Lines (time) | New first line | Question on screen |
|---|---|---|---|---|
| 1 | Belief corrected: the headline price | L181-L186 (9:56-10:20, about 25 s) | "PepsiCo announced it would buy Poppi for one point nine five billion dollars. Read the press release." | `WAS IT REALLY $1.95 BILLION?` |
| 2 | Consequence: the bonus that shrank | L199-L205 (11:02-11:42, about 40 s) | "PepsiCo's Poppi deal came with a bonus, called an earnout." (L199 says "that earnout") | `WHERE DID THE BONUS GO?` |
| 3 | Comparison: two offers | L029-L035 (1:44-2:19, about 35 s) | "2018. Allison Ellsworth pitches her vinegar soda on a television stage." (L029 says "the ask") | `WHICH OFFER WAS LOWER?` |

Commands (from the repository root):
1. `node studio/tools/build.mjs channel-system/episodes/poppi-soda-billions --short L181-L186 --title "WAS IT REALLY $1.95 BILLION?" --name short1`
2. `node studio/tools/build.mjs channel-system/episodes/poppi-soda-billions --short L199-L205 --title "WHERE DID THE BONUS GO?" --name short2`
3. `node studio/tools/build.mjs channel-system/episodes/poppi-soda-billions --short L029-L035 --title "WHICH OFFER WAS LOWER?" --name short3`

Notes: each new first line needs a scratch-voice clip and a line before the range (the command alone does not add it). Short 3 contains L030-L033 (the objections and a skit); trim if the lint flags length. Mix, lint and look at each Short's frames before rendering.
