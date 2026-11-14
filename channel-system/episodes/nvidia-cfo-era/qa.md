# QA

## Look gate

Never skipped (FORMAT_BOOK 11). The first 30 seconds as a draft render (`render/look_draft.mp4`) and the look sheet (`render/look.jpg`), put beside `channel-system/brand/quality_reference.jpg`.

Date:
Judged by: (the user / QA, with the user sent the draft on <date>)
Beside the rival's row: (staging, light, colour per place, figures, crowds, how full the frame is)
Beside our own row: (better or poorer, frame by frame)
Motion on the draft: (anticipation, overshoot and settle, follow-through, walks, act sounds, ambience)
For the detail pass:
Look verdict:

## Retention lint

(paste the output of `node studio/tools/retention-lint.mjs channel-system/episodes/<slug>`)

## Review

| Check | Result | Timestamp |
|---|---|---|

## Fixes

1.

Verdict:

## Animatic

Build of 14 Nov 2026 (318 shots, 12:27, voice clips as made, house bed). Lint: 3 failed, 6 warnings, 60 passed. Layout check: 106 faults (see below). Frame sheets (12 frames per chapter): `render/animatic_ch1.jpg` to `render/animatic_ch8.jpg`. Names unified: COLETTE_KRESS, GIL_LURIA, JENSEN_HUANG, DAN_IVES, SUSANNAH_STREETER, BRET_KENWELL, HARVEY_JONES, FRANK_LEE; the header `"cast"` holds them (guests.json `_who` is not copied into it). ANALYST_4 is not cast.

Lint FAIL: G1 (139 of 285 pictures show something happening, want 85%), G7 (bodies move in 26%, want 60%), G8 (42% of pictures have fewer than two figures or props, want 20% or fewer). WARN: P2 (6.8 s with nothing new at 6:29), M1 (door plate 4 times, want 6+ incl. the last 75 s), G5 (piggy bank once, want 4 to 17), T5 (no title set in the header: set `title` words or the question line by 0:45), A6 (18 pauses over 0.25 s), H9 (Look draft not yet judged).

Structure problems by shot id:
- Text-only navy cards are many: c1t02 (48 s), c1t04 (72 s), c3p01 (217 s), c4t04 (318 s), c6t03 and c6t04 (448, 456 s), c7s18 (552 s), c8t07 (736 s). Most are the title question, "ONE" and "NEXT DOOR" and the date. Keep two or three; give the rest a figure or prop behind them (G1, G8).
- Empty green "document board" shots with nothing on them: c5s19 (391 s), c5s22 (407 s), c8s54 (700 s), c8s54c (712 s). Subtitle quotes sit on a blank oval: add the document card, the speaker or a prop (G1, G8).
- Single-figure or empty pictures where two are needed: c2s11b (empty theatre, one tiny walker), c2s13c (balance beam alone, no people), c3s22c (corridor, one prop face only), c4s05 (one figure far back), c4k11c (back of Kress only), c5s11 (Chad-like big back-of-head plus two small figures), c6s40b and c8s51 (door plate / moon only), c8s53c (phone booth with silhouette, no "NO COMMENT" separation).
- Calculator-desk close-ups repeat: c1 8-24 s, c4s07 (272 s), c5 344 s, c8 724 s. Same picture five times; vary the angle or move to the boardroom.
- c5s13 (375 s): earnings-call screen cuts across the desk, the three layers overlap and the podium hides a figure; recompose.
- Chapter 6 is a long run of the same blue bank with one banker (c6 472 to 489 s, three shots, no movement); chad and Nebius at c6k18c are good. P2: 6.8 s without change at 6:29 (ch 7, c7s20 area).
- c8k26c (653 s): "$109B" and Chad's cap cut by the frame; c8k27 (665 s) "NEXT QUARTER" cut by the edge. Layout faults are heaviest in ch 7 and 8 (c7s14, c7s15 "FUND" under a head; c7s28, c7s36 text off the frame; c8k26c/h, c8k27b-d, c8k29d, c8s56, c8s56b, c8k30a-b, c8k31a-b, c8k31b, c8s58a, c8s58: text covered by edge or heads). Art director to fix all 106.
- c8s58 (final, 747 s) shows Benny alone in the CFO office; the "0." text is hidden by a head. Last 75 s lack the door plate motif (M1).
- Chapter title cards are navy and identical (8 in a row): fine as a device, but chapter 1 to 8 give no change of palette between card and first shot except c7s18 to c7s19.
