# YouTube package

Status 13 Nov 2026: refreshed for the final timing (ElevenLabs Lawrence voice, mixed with --tighten, 12:04 = 724.5 s). The three painted thumbnails are done (`images/thumbnail_a.png`, `thumbnail_b.png`, `thumbnail_c.png`); the full MP4 is rendered (`render/poppi-soda-billions.mp4`, -14.1 LUFS, -1.2 dBTP) and the three Shorts are built and rendered.

## Shelf check (FORMAT_BOOK 15)

Could see: one web search limited to youtube.com returned ten titles on the Poppi sale (below). Could not see: channel names, view counts, dates, thumbnails or bands. vidIQ is out of credits, and two watch-page fetches returned only the title. No views are stated here because none were seen.

Titles on the shelf: "How a Tiny Soda Brand Became a $2 Billion Pepsi Acquisition" (hashtag, Short-style); "PepsiCo buys prebiotic soda brand Poppi to gain a foothold in functional drinks" (two uploads); "Poppi's Founders: Building a $2 billion soda brand"; "Did PepsiCo Just Waste $2 Billion on Poppi?"; "'ENTIRE LIFE SAVINGS': Poppi's path from beverage experiment to $2 BILLION deal"; "Poppi's $1.95B Sale to PepsiCo Sparks Concerns Over Recipe Changes"; "How a Rebrand Turned Poppi Into a $2B Biz"; "Poppi Culture (soda billionaires, influencer beverage investors, ...)"; "Can Pepsi's poppi purchase help it go younger as Americans drink less soda?".

What it shows: the shelf is news clips, interviews and "how it got to $2B" stories. None of the titles mentions the tax benefit, the earnout cut or the lawsuit settlement (titles only; contents not seen). Their titles carry the figure; ours puts it in the band for B and C. Pair A's title is close to "How a Tiny Soda Brand Became a $2 Billion...": if the user wants more distance, use B's title for A. Repeat the shelf check on upload day, with views visible in YouTube itself.

## Three pairs

| Pair | Reason to click | Title | Thumbnail scene and time | Band (white + red) | What it promises, and where the video pays it |
|---|---|---|---|---|---|
| A (first frame) | Consequence | She Pitched This Soda 9 Months Pregnant. Then Pepsi Paid Up. | `c1s01`, 0:00 (painted, `images/thumbnail_a.png`): Allison Ellsworth, pregnant, coral dress, face a third of the frame; the swing-top bottle with a face glows amber on the pitch table, price tag face-down; one spotlight, navy dark | `9 MONTHS PREGNANT` | What she risked. Paid at 0:00, at 0:29 ("born ten days after this pitch"), at the birth itself (2:20) and in the end. |
| B | Contrast | Poppi's Price Tag Was Not What It Looked Like | `c1s10`, 0:20 (painted, `images/thumbnail_b.png`): close on the bottle, shocked, as the price tag flips and blazes gold; one figure | white `VINEGAR?` red `$1.95B` | A fortune for vinegar, and a number that shrinks. Hook at 0:22 (Benny: "Two billion dollars? For vinegar?"); tax benefit at 9:10; earnout at 9:31 and its cut at 10:11. |
| C | Open question | Who Was Watching Poppi's Pitch? | `c1s09`, 0:18 (painted, `images/thumbnail_c.png`): the navy giant can (no brand shapes) leans from the rafters toward the tiny glowing bottle | white `HE WAS WAITING` | Who the buyer was. Planted at 0:17 ("a cola giant will pay"); answered at 6:03 (PepsiCo's own try, Soulboost, was about to be reported dead) and 8:45 (the purchase announced). |

One title for all three pictures: **She Pitched This Soda 9 Months Pregnant. Then Pepsi Paid Up.** (chosen by the user on 13 Nov 2026; the thumbnail band carries $1.95B). If the test compares only pictures, use this one.

Start with: A with its own title. A judgment, not a measurement: it is the first frame, the face is largest, and a person in trouble is what the niche clicks on (FORMAT_BOOK 1). The three painted pictures are done (`images/thumbnail_a/b/c.png`; prompts in `prompts.md`, bands in `thumbnails.md`). Before upload the user checks each at 160x90 (face and number must read, lower right empty) and that A matches the first frame of the video. The scene times above follow the final timing (`c1s09` now 0:18, `c1s10` 0:20).

## Description, tags, pinned comment, Studio settings

In `youtube-upload.txt` (description 2,806 characters; limit 5,000, ours under 4,500). Every fact in it is verified in `factcheck.md`; allegations are worded as allegations; the founders' payout is "Fortune reported". Chapter stamps are from `timing.json` (final 12:04 build); chapter 1 is 0:00. Captions: `poppi-soda-billions.srt` (295 cues, rebuilt on 13 Nov from the word timings in `audio/*.words.json` and `timing.json`; last cue ends 12:03.6).

## End screen

The end screen starts at 11:59 (after text card `c8t06`, which ends 11:58.8), leaving 5.5 s of the 12:04 video with the right half clear. The cast's faces were moved to the left half (`qa.md`). Episode 1 (nvidia-ceo-probe, https://www.youtube.com/watch?v=_cfb_NZ1haE) is the only earlier video and its story is unrelated; add it as the video element only if the user wants, otherwise a Subscribe element alone.

## Disclosure

Narration: synthetic voice (ElevenLabs, narrator Lawrence - Bright and Informative; characters are synthetic voices too). The description says so. README.md records the user's decision of 12 Nov 2026 to disclose and set YouTube's altered-content label; the user re-reads YouTube's current text before upload. Characters are cartoons; no real person's voice or realistic face.

## A/B test note

YouTube compares up to three thumbnails (and titles) and picks by watch time. Nobody knows the winner in advance. Leave the result for the analyst.

## Shorts (FORMAT_BOOK 16): built and rendered 13 Nov 2026

No new first lines: each Short starts on a line that stands alone with its on-screen question, so every clip is Lawrence's. Files: `shorts/short<N>/` (storyboard and timing in git); the MP4 is `shorts/short<N>/render/short<N>.mp4` (not in git).

| # | Lesson | Lines | Length | Question on screen | Lint |
|---|---|---|---|---|---|
| 1 | Belief corrected: the headline price | L181-L186 | 0:22 | `WAS IT REALLY $1.95 BILLION?` | 0 failed, 5 warnings (H2, H3, P1, P2, G1: a 22 s Short, accepted) |
| 2 | Consequence: the bonus that shrank | L199-L205 | 0:37 | `WHERE DID THE BONUS GO?` | 0 failed, 0 warnings |
| 3 | Comparison: two offers | L028-L035 | 0:36 | `WHICH OFFER WAS LOWER?` | 0 failed, 1 warning (T3) |

Commands (from the repository root): `node studio/tools/build.mjs channel-system/episodes/poppi-soda-billions --short L181-L186 --title "WAS IT REALLY $1.95 BILLION?" --name short1` (likewise L199-L205 short2, L028-L035 short3), then `mix.mjs` and `build.mjs` on `shorts/short<N>`.
