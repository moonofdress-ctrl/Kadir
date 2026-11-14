# QA

## Look gate

Never skipped (FORMAT_BOOK 11). The first 30 seconds as a draft render (`render/look_draft.mp4`) and the look sheet (`render/look.jpg`), put beside `channel-system/brand/quality_reference.jpg`.

Date: 14 Nov 2026
Judged by: QA, not by the user (the user is not in this session; the draft `render/look_draft.mp4`, `render/look.jpg` and `render/look_motion.jpg` go to the user with the Turkish summary). Lint after the build: 2 failed (G1, G7), 3 warnings (G8, A6, H9), 64 passed; A9 53 of 53 places, A10 239 sounds.
Beside the rival's row: the rival half of `brand/quality_reference.jpg` is grey on this machine (the rival's frames are not here), so this is judged from FORMAT_BOOK and research section 9 in words. 14 cuts in the first 30 s (rival 12, our episode 2 had 9). The named person (Kress) is in a medium close-up with her name at 5.6 s and in close-up at 10.7 s (rival: by 0:12). One place for the scene (the corner office, night, one lamp), the board chair cut in once (boardroom, green-lit, low angle), daylight arrives at 26 s (Martha's kitchen, yellow). Dark-with-one-light share in 0-30 s: about 11 of 12 sheet frames (D1 wants half to three quarters across the chapter; the kitchen and later chapters must bring the day). One number on screen ($4.0T at 21 s, plus the 4.0 on the calculator), as the rival does. No crowd is needed in these places. Shot and reverse: one OTS (c1k01b, chip foreground, Hal in the doorway); no other conversation in 0-30 s.
Beside our own row: better on figures (Kress, Harvey Jones and Martha read as adults with arms, hands and suits; our bottom row is big-headed children), on colour per place (violet office, green boardroom, yellow kitchen; neighbours differ) and on fullness (dressed desk, city window, lamp, clock, chart). Poorer or equal in three frames: c1s09 (22.5 s) is cluttered and overlapped, worse than our row's clean two-shots; c1s05 (10 s) and c1s10 (25 s) repeat the c1s01 wide at the same size, so the office reads like one fixed camera (P6); c1t01 (20 s) is a navy text card, as in our row.
Motion on the draft (2 frames a second 0-10 s, 1 a second 10-30 s, 10 a second at 1.6-3.2 s and 5 a second at 16.8-20 s): the INTERIM tape slaps across the plate in about 0.6 s with a pin bounce (reads as a move, not a slide; overshoot is too fast to judge at 10 fps); Kress changes pose (hand to chin at 8.5 s, points at the calculator at 11-13 s); Harvey lowers his paper (16-17 s); Hal gestures in the doorway (18-19 s); the coin travels into the jar (27-30 s); the counter rolls 3.4 to 4.0 at 21 s. No walk in 0-30 s, so legs and arms on a walk are not tested yet. Static: c1s01 (0-2.4 s, five identical frames, the "think" pose is invisible at that size, the pan is barely seen); c1s03 (4.1-5.6 s, chair and steam only); c1k01a (16.7-17.7 s, the chip stands still). The door plate is blank for one frame at 2.5 s after the cut (shorter than the 0.6 s reported, but visible). Sound from `audio/mix.json`: office bed on the corner office and boardroom, room bed on the kitchen, a card sound at 19.7 s and a riser at 21.0 s, mix -14.02 LUFS, peak -1.1 dB. I cannot hear the draft: the user should listen for the music fighting the voice and for the tape slap and coin having a sound.
For the detail pass (by shot id):
1. c1s05 (8.6 s) and c1s10 (24.6 s): the same wide as c1s01 at the same size, three times in 26 s. Change c1s05 to a low angle across the empty chair toward Kress, and c1s10 to a high angle or a push-in on the chip; keep c1s01 as the only wide. (scene-builder)
2. c1s09 (21.0-24.6 s): the chip sits in Kress's place behind the CFO plate, the lamp crosses the chip, the calculator and the sticky note cover Kress's face. Put Kress at her desk in front, the chip beside the desk, the lamp clear of both; keep $4.0T clear of the window. (scene-builder)
3. c1s04 (5.6-8.6 s): the COLETTE KRESS lower third sits on top of the desk nameplate (text on text). Move the nameplate right or lift the lower third. (scene-builder)
4. c1s02 (2.44-2.6 s): the door shows no plate for the first frame(s); show the plate from the cut. (editor / engine)
5. c1s01 (0-2.4 s) and c1k01a (16.7-17.7 s): something must move beyond the camera: Kress lifts a page or the lamp flickers in c1s01; the chip walks in (with legs) in c1k01a rather than standing. (scene-builder)
6. c1k01b (17.7 s): Hal (grey hair, suit) stands in the doorway one shot after Harvey Jones (grey hair, suit) is named; a viewer can read Hal as the board chair. Give Hal his usual cardigan/colour or keep the name strip off the frame before him; check STYLE_GUIDE Real people. (art-director)
7. c1t01 (19.7 s): keep the title card (one is the device), but it is the only frame with no picture; do not add more text cards in chapter 1 (lint G1, G8). (storyboard)
Look verdict: pass (by QA, not by the user; the figures, light and colour per place clear the gate; items 1-7 go into the detail pass before the full render)

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
