# Thumbnail prompts

Generated 13 Nov 2026 with FLUX 3 Image (flux3_image, 16:9, 1k), one batch, prompts exactly as below (style lock + scene). Raw pictures: `images/raw_a.png`, `raw_b.png`, `raw_c.png`; banded with `stills.mjs thumb --image` into `images/thumbnail_a.png`, `thumbnail_b.png`, `thumbnail_c.png` (+ `_small` 160x90). Checked on one contact sheet: no stray text, all read at 160x90. Pair A shows the first shot (`c1s01`).

Style lock (STYLE_GUIDE, Painted pictures), start of every prompt: "Bold editorial cartoon illustration: thick dark ink outlines, clean simple shapes, exaggerated proportions with big heads, vivid saturated colours, soft painted shading, one warm light source, deep teal-blue shadows, detailed textured background. No text, no letters, no numbers, no logos anywhere."

## A: thumbnail_a, shot c1s01, 0:00
Band to add afterwards: white `9 MONTHS PREGNANT`.
Scene: a cartoon caricature of a young woman founder with long straight blonde hair and a coral dress, heavily pregnant, gripping the edge of a small high table on a dark TV stage, nervous but determined, her face filling a third of the frame on the left. On the table a round-shouldered glass swing-top bottle with cartoon eyes and a small mouth glows amber, a blank price tag hanging face-down from its neck. One hard white spotlight from above, everything else deep navy. Keep the upper third plain and dark for the band.

## B: thumbnail_b, shot c1s10, 0:23
Band to add afterwards: white `VINEGAR?` red `$1.95B`.
Scene: extreme close-up of a glass swing-top bottle with big shocked cartoon eyes and white gloves on a dark stage; a blank paper price tag on a string at its neck flips over and glows gold as if lit from inside, lighting the bottle's face; the shadow of a giant can falls across the top edge. Keep the upper third plain and dark.

## C: thumbnail_c, shot c1s09, 0:21
Band to add afterwards: white `HE WAS WAITING`.
Scene: seen from high in dark theatre rafters, a giant plain navy cola can with a cartoon face, greedy grin and white gloves leans over the lighting rig, reaching down; far below, one lit disc of stage with a tiny glowing bottle on a small table. No brand shapes, no globe, no wave, no logo. Keep the upper third plain and dark.

Batch note: generate A, B and C in one batch, look at one contact sheet, then band them. If the first frame of the video changes, regenerate A.

## Second round, 13 Nov 2026 (replaces the round above)
The user did not understand the first three and said they did not look like our characters. Redone with FLUX 3 Image from two engine frames of the video as references (image 1 = Allison close-up at 0:04, image 2 = Allison and the bottle at 0:01), in the video's own flat style. Files: `images/thumb2_a.png` (band ONE SODA / $1.95B, main), `thumb2_b.png` (BOUGHT FOR / $1.95B), `thumb2_c.png` (SHE BET IT ALL); raw pictures `raw2_*.png`.
Shared start: "Make a YouTube thumbnail in exactly the same flat 2D vector cartoon style as image 1 and image 2: simple round shapes, thick dark outlines, flat colours with light soft shading, big white round eyes with small dark pupils, dark navy TV stage, one warm spotlight. Use the same characters: the blonde woman in the coral dress from image 1 and the small soda bottle character with a face from image 2." End: "The upper third of the image is plain dark navy and empty. No text, no letters, no numbers, no logos, no subtitles anywhere."
- A: the woman (pregnant, big head) large in the left half, grinning with wide shocked joy, hugging the smiling bottle to her cheek; a huge mountain of green cash stacks and gold coins spills across the stage and glows.
- B: from the upper right a giant plain navy soda can with a greedy grin pushes a huge open briefcase of cash toward the small bottle, which stares up open-mouthed; the woman beside it, hands on cheeks. No brand on the can.
- C: close shot, the woman, nine months pregnant, sweating, holds the bottle out toward the viewer; at her feet the things she bet: credit cards, car keys, a toy house.
