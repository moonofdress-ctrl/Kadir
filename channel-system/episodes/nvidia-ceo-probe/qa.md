# QA: nvidia-ceo-probe (step 9, render of 12 Nov 2026)

Reviewed on `render/nvidia-ceo-probe.mp4` (1920x1080, 13:09.3). Frames pulled from the render: 0:00-0:50 at 1 s, the whole cut at 5 s, and `--t` lists inside each flagged shot. The voice is the scratch Kokoro track; pace and pauses are judged with that in mind. Timestamps are render time.

**Verdict: FAIL. 7 findings block upload (all art director). 13 more are advice.**

## Retention lint

```
Retention lint: nvidia-ceo-probe  (13:09, 200 shots, 2186 words)

  ok    H1  Opens on a scene, not a card or logo         scene
  ok    H2  Big number on screen in the first 8s         yes
  ok    H3  New picture every ~3s in the first 50s       18 setups, one per 2.8s
  ok    H4  Title question on a card by 0:30             0:13
  ok    H5  First skit by 0:40                           0:15
  ok    H6  Anchor motif planted in the first minute     tent at 0:00
  ok    P1  Average shot length                          3.9s
  ok    P2  Longest stretch with nothing new on screen   5.8s at 3:29
  ok    P3  Camera varies between shots                  0 repeats, 0/146 still
  ok    C1  A text card about every 20s                  47 cards, one per 17s
  ok    C2  Cards take 8-16% of the runtime              14.0%
  ok    C3  No card longer than 5.5s                     ok
  ok    S1  A skit every 50-70s                          22 skits, longest gap 71s
  ok    M1  Anchor motif keeps returning                 tent: 17 times
  ok    M2  Opening images pay off late                  17 callbacks in the second half
  ok    M3  Viewer stand-in keeps appearing              BENNY: 36 shots
  ok    M4  Colour grade follows the mood                5 grades used
  WARN  M5  6-9 chapters of 1-3 minutes                  9 chapters, 1 outside 40-200s   -> want 6-9 chapters
  ok    E1  Quotes shown as evidence                     20 evidence overlays for 3 quoted lines
  ok    X1  Last shot is a callback                      Benny's jar and the one pole
  ok    T1  No intro phrases or calls to action          none
  ok    T2  No financial advice wording                  none
  ok    T3  Short spoken sentences                       average 8.9 words, 2 over 25
  ok    T4  Viewer addressed directly                    8 lines
  ok    T5  Title question spoken by 0:25                0:13
  ok    T6  The promise and the chain are written        question yes, answer yes, 7 links in the chain
  WARN  V1  Speaking pace                                166 wpm   -> want 150-165 wpm (reference: 157)
  ok    V2  Length 12-15 minutes                         13:09
  ok    G1  Pictures show something happening            161 of 163 (99%)
  ok    G2  Companies and institutions are living things 75 pictures
  ok    G3  Faces fill the frame in skits                22 of 22 skits
  ok    G4  Facts are written inside the scene           201 signs, tags, labels and badges
  ok    G5  The hidden piggy bank                        5 pictures
  ok    L1  Written props are readable                   ok
  ok    A1  Sound mix is made and up to date             ok
  ok    A2  Loudness -14 LUFS                            -14.02 LUFS
  ok    A3  Peaks under -1 dBTP                          -1.04 dBTP
  ok    A4  Quiet music bed under the voice              19 dB under (house bed (made in code))
  ok    A5  Music is credited                            ok
  WARN  A6  No dead air in the voice                     26 pauses over 0.25s, longest 0.29s at 1:05   -> want 11 or fewer (mix.mjs --tighten cuts them)
  ok    A7  Effects are rare                             68 (5.2 a minute)

  0 failed, 3 warnings, 38 passed
```

## Review

| Check | Result | Where |
|---|---|---|
| First frame is thumbnail A's scene | PASS | 0:00 tent, chip on the pole, Benny with phone, Martha with bill; counter rolls in from 0:01 |
| First sentence carries the number and the contradiction | PASS | "$430B ... no one had reported it selling one chip less" |
| Readable with the sound off; every number and quote drawn | PASS with advice | Numbers are counters, bars and cards; quotes are doc cards. Several qualifier captions are too small (advice 6); one key limit is hidden (B6) |
| Every shot a small joke | PASS with advice | Stand-and-talk shots listed in advice 4 |
| Story: question answered in the opening's words | PASS | Title asked at 0:13 and 12:59, answered with "Not because anyone reported it selling one chip less" |
| Story: chapter changes with because / so / but / unless | PASS | CH1-2 "But first", CH2-3 "so" (He looks up / one pole), CH3-4 "Because", CH4-5 "so" (days later), CH5-6 "because" (two fears), CH6-7 "but how big", CH7-8 "but it went up", CH8-9 "but Wednesday wasn't over". None works only as "and"; CH6-7 is the weakest |
| Allegations, models and forecasts named | PASS | AN ALLEGATION, REPORTED, A FORECAST, OUR SUM, OPINION, NOT CONFIRMED BY NVIDIA, SIZE, NOT A FORECAST |
| Each chapter opens on a turn and ends on a hook | PASS | No stretch where I would click away; the slowest is 11:05-11:30 (how a review works) |
| Devices paid off; motif changes | PASS | Tent: whole, rope snapped (5:35), two ropes gone / Benny under it (7:04), night (13:00). Phone, NEXT chair, $7 strip, "We're Wednesday", kitchen, jar all return |
| Stops on the last line with a callback picture | PASS | "...and count the poles." ends about 13:08, 1 s hold on Benny, jar and pole. Final 9 s are very dark (advice 10) |
| Editorial limit: CEO never speaks, only the tent pole | **FAIL** | Drawn figures under "JENSEN HUANG" name strips and acting out his email: 3:40-3:50, 4:28-4:40 (B1) |
| Editorial limit: the woman in the reports not named or drawn | **FAIL** | A woman figure (REPORTER) is drawn under the former-executive lines and at the dock as the $7.5B is described: 4:24, 6:24, 10:29 (B2) |
| Editorial limit: Jobs, Buffett, Musk not drawn | PASS | Stagehand, Berkshire building, SEC official; Musk only on a quote card (8:24) |
| Editorial limit: CH9 a Wednesday-night snapshot, no successor, decision or Thursday event | PASS with one fix | Text and calendar hold (STILL WED 11 NOV, AS OF WEDNESDAY NIGHT, NO DECISION YET). A figure beside the NEXT chair at 12:39 reads as a candidate (B7) |
| Other channels' figures, lettering, objects; logos; real people | PASS with advice | No logos; tickers are made-up. Named minor people shown as figures (advice 1). "DO WHAT YOU LOVE" poster is a known co-working slogan (advice 5) |
| Something moves in every shot over 3 s | PASS | Camera moves in every shot (P3); weakest are the standing boardroom shots in advice 4 |
| Cropped text, overlaps, empty background, figure off the floor | **FAIL** | Empty two-thirds of frame for 9 s (B3), ~$109B smear over the envelope (B5), hidden tag (B6); overlaps in advice 5 |
| Empty right side, c5p26 (4:15-4:27) | **FAIL: a gap** | Only panel 1 is drawn from 4:15 to 4:24 (about 9 s, two-thirds navy). Panels 2 and 3 enter at L060 words 22 and 25 |
| Empty right side, c6p42 (7:06-7:08) | PASS: a build | Right half empty for about 1.5 s, panel 2 enters on "If he stays" |
| Empty right side, c7n06c (8:18-8:20) | PASS as a build, FAIL in content | Empty about 1.5 s, then the "HE WAS / DEFENDANT" panel shows the SEC official (B4) |
| ~$109B, c9s52e (12:08-12:14) | **FAIL** | The counter's dark plate renders as a black smear across the bar post and over the RESULTS envelope's edge; the same smear sits behind -$430B (0:01-0:04), -$600 (0:11-0:13) and -$600+ (1:20) (B5) |
| Moved screen text still attached and readable | PASS except UNNAMED SOURCES | BAN SALES TO CHINA? (2:29) sits over the Washington dome. NO NEW STATEMENT (10:30) on the podium. WHOEVER LEADS IT (11:50) over the empty podium. c3s14b (1:56) reads as the continuation of c3s14 but opens on lowercase (advice 2). UNNAMED SOURCES lands over China's denial and the REPORTER's head, not over the reports (B3) |
| Text under 28 px | Advice | Which ones a viewer must read: advice 6 |
| Sound | PASS (measured), not heard | Render: -14.0 LUFS integrated, true peak -1.2 dBFS, LRA 1.7 LU. I cannot hear it: **the user should listen for music that fights the voice**, especially under CH9. V1 and A6 are scratch-voice warnings (advice 8) |
| factcheck.md complete; on-screen figures match | PASS with advice | Every figure I read on screen matches a verified row: -$430B, -$600, 7.3%, -4.27%, -5.47%, -25% to -30%, -$1,900 / $2,000 (S6), $500 to $200, $7.5B, -0.65% / -1.5%, -$59B, -5%, 14%, 9.5%, $108B, ~$109B, 8%, -$500 to -$600, $1B+ a day. screen-text.md's time column is stale (advice 7) |

## Fixes

### Blocking upload

1. **B1. The CEO is drawn outside the tent pole.** c4s24b (3:40-3:50): the REPORTER stands beside the "JENSEN HUANG, Nvidia chief executive, to Bloomberg" lower third, so she reads as him. c5s27 (4:28-4:33): a STAFFER reads the email at night under "EMAIL TO STAFF", so he reads as the writer. c5s27b (4:33-4:40): the same STAFFER stands beside the "JENSEN HUANG, email to staff" lower third. Fix: drop the figure from c4s24b and c5s27b (card and lower third alone, or the chip / pole beside them). In c5s27, show the email arriving on Benny's phone or a laptop with a face. **Owner: art director.**
2. **B2. A woman is drawn where the story is about the woman in the reports.** The REPORTER (woman, bun, purple suit) shrugs under "NOTHING PROVEN IN PUBLIC" right after "a former Megaspeed executive" (c5p26, 4:24-4:28). She stands alone at the customs dock while the narration says "the former executive helped arrange about $7.5B" (c6s38, 6:24-6:29); research.md says that executive is the woman in the reports. She also stands alone at the boardroom podium after the second-relationship and removal reports (c9s49d2, 10:29-10:33). Fix: replace the REPORTER in these three shots with the newspaper or notebook living thing used in CH9 (s49b-d). Use the same figure in c4s24 (3:35) and c4s24b for consistency. **Owner: art director.**
3. **B3. c5p26 (4:15-4:27) is a gap, not a build.** For about 9 s only the left third (CLAIM (REPORTED)) is drawn and the rest is empty navy. Fix: bring panel 2 in at word 8 (WHO SAYS tag) and panel 3 at word 17 (AN ALLEGATION), or start full-width and split on the denial. Move the UNNAMED SOURCES stamp onto panel 1 (the reports), so it does not read as China's denial or the figure being "unnamed sources". **Owner: art director.**
4. **B4. c7n06c (8:19-8:21): the DEFENDANT is the SEC.** The "HE WAS" panel stamps DEFENDANT over REGGIE, who is wearing the SEC badge. The pole from `poleOnly` is not visible. Fix: show the bare pole (the stand-in for the CEO, not Musk) under the stamp and take REGGIE out of that panel. **Owner: art director.**
5. **B5. Counter plates smear.** On c9s52e (12:08-12:14) the dark plate behind "~$109B" is a blurred black band across the high-jump post that cuts into the RESULTS envelope. The same smear sits behind the counters on light skies: c1s01 (0:01-0:04, the thumbnail scene), c1s04 (0:11-0:13, over the SALE poster) and c2s10 (1:20). Fix: on c9s52e move the counter into clear sky away from the envelope (the chalk mark already says ANALYSTS ~$109B, so the counter can also go). On light sets set `"plate": false` or use a solid card plate. **Owner: art director.**
6. **B6. c9s50e (11:25-11:29): "PUBLISHED? GUIDE DOESN'T SAY" is hidden behind the two directors' heads.** It is the only on-screen carrier of that limit, and L1 missed it. Fix: raise the tag above the heads or put it on the front layer. **Owner: art director.**
7. **B7. c9s54 (12:39-12:44): a man stands beside the NEXT chair under "NOBODY NAMED".** The CLEANER has no duster and looks like the figure labelled JENSEN HUANG at 4:35, so he reads as a candidate or the CEO in the empty chair. Fix: give him the duster passing over the seat (as storyboarded) and keep him clear of the chair, or remove him. **Owner: art director.**

### Advice (does not block)

1. **Named minor people shown as figures.** ANALYST as Dan Ives (c3s16, c3s17, 2:13-2:24; c6s36, c6s36b, 5:43-5:56), SENATOR as Michael Bennet (c6s41, 6:53-6:58), and COLUMNIST, a woman, beside the man's name Adam Spatacco (c9s53b, 12:23-12:28). The format book asks for a name strip, not a figure. The palette generator also makes ANALYST, STAFFER, SENATOR and CLEANER the same topknot man in a blue jacket, so one face carries four identities. Use a thing (tablet or note with a face) or a cast member who is plainly not that person. Art director.
2. **c3s14b (1:56):** the quote opens on lowercase "particularly". Prefix "…" as the board card does ("…the target"). Art director.
3. **WHOEVER LEADS IT (11:50)** floats between Hal and Chad. Pin it to the podium front. Art director.
4. **Shots where figures only stand and talk** (give each an action): c1s06 board (0:28-0:31), c2s07b Hal beside the bars on graph paper (0:40-0:44), c5s28 board behind the table (4:40-4:47), c6s36 analyst beside the chart (5:43-5:52), c6s36b analyst shrug on a plain office wall (5:53-5:56), c7n08b Benny on graph paper (8:48-8:53), c9s50d panels (11:14-11:20), c9s50e directors (11:20-11:29), c9s52b Hal and Chad (11:50-11:54). Art director.
5. **Overlaps and cropping:**
   - "YOU OWN THIS" sticker over Benny's mouth (k01, 0:16-0:23).
   - Hal's face behind the monitor (k10, 6:13-6:18).
   - Calendar over the SEC doc card corner (8:24-8:28).
   - "AT THE CLOSE: DEMAND UNCHANGED" over the CHIP FACTORY label (9:13-9:17).
   - Source line over "SALES FORECAST" (9:20).
   - NO CHANGE ANNOUNCED stamp over the title and $108B (9:25).
   - "DEADLINE: ?" cut to "EADLINE" by the calendar (11:30).
   - "$1B+ A DAY" over the EVERY DAY sign (12:15).
   - The "DO WHAT YOU LOVE" poster is cropped at the left edge in most doc-card shots (2:20, 3:40, 4:35, 6:15, 8:25, 10:10) and is a known slogan; give the office set our own poster.

   Owner: art director.
6. **Small text (29 under 28 px): what must be read.**
   - Must read: the counter captions that carry the qualifier (VALUE LOST IN TWO DAYS (ABOUT); MY INDEX FUND: NVIDIA SLICE (ON $100K); NVIDIA'S TWO-DAY FALL, ON $100K (OUR SUM); SALES THE EX-EXECUTIVE HELPED ARRANGE (REPORTED); UP TO ABOUT: OUR SUM ON HIS WHAT-IF; ROUGHLY, ON $100K, IF IT HOLDS (OUR SUM); ANALYST ESTIMATE, PER A MOTLEY FOOL TALLY). Red on orange at 0:01 is not legible.
   - Must read: the CH9 newspaper mastheads (10:10, 10:20, 11:35), the only on-screen sign of which paper reported what. The WSJ masthead in the dark at 10:20 cannot be read; add a label tag.
   - Must read: MEGASPEED on the tower on first mention (2:50-2:55).
   - Can stay small: WASHINGTON / LAWMAKERS / HOUSE on domes that also carry a sign, ticker names, OUTSIDE LAW FIRM, THE REST, 499 OTHERS, COREWEAVE (tagged), BERKSHIRE VALUE, source lines.

   Owner: art director.
7. **screen-text.md is stale.** Rows run to 13:37 on a 13:09 cut, and ids differ (c9s52c/d against the built c9s52e). Re-run `screen-text.mjs` and re-tick the rows. The words I checked still match. Owner: editor (fact-check pass).
8. **Voice.** V1 166 wpm and A6 (26 pauses) are on the scratch track. With the final voice, aim for 150-165 wpm, run `mix.mjs --tighten`, re-lint and re-measure the render. Owner: voice.
9. **M5.** One chapter is outside 40-200 s; by the render CH1 runs 0:00-0:32 as the cardless opening. No change needed. Owner: editor (scriptwriter only if the editor disagrees).
10. **Final shots too dark.** c9s56 and c9s57 (13:00-13:09) are under a heavy vignette, and the s56 sky shows a dusk sun under a flag saying NIGHT. Lift the light on Benny, the jar and the pole. Art director.
11. **"SALE TODAY ONLY" poster.** It sits behind the Nvidia loss on the bus (0:10-0:23, 10:55) and can read as "buy the dip". Swap it for a neutral ad. Art director.
12. **Short empty waits in builds.** About 3 s at 1:24-1:27 (c2s10b) and 11:15-11:18 (c9s50d). Cut them to about 1.5 s or show the set behind. Art director.
13. **Gate 3.** Per brief.md the user re-reads CH8 and CH9 before upload. After B1, B2 and B7, rebuild, re-render and re-pull frames at the times above. Owner: editor.

## Re-check 2026-11-12

Judged from frames of the current build (201 shots, 13:09), pulled with `stills.mjs frames --t` at each shot below. The mp4s in render/ are older than the fixes and were not used. Lint today: `0 failed, 3 warnings, 38 passed` (A2 -14.02 LUFS, A3 -1.04 dBTP on the mix; A6 26 pauses, scratch voice). Shot times below are from the current build.

### The seven blockers

| # | Shots (time) | Result | What I saw |
|---|---|---|---|
| B1 | c4s24 (3:35-3:41), c4s24b (3:41-3:50), c5s27 (4:30-4:35), c5s27b (4:35-4:42) | **Cleared** | c4s24: two newspapers with a magnifier at the tent, NVIDIA flag on the pole. c4s24b: doc card plus the JENSEN HUANG strip; the only figure is a newspaper in the far corner, which reads as the press, not as him. c5s27: Benny in the kitchen reading the email on his phone under SAME DAY / EMAIL TO STAFF. c5s27b: card and strip only. Nobody can be read as the CEO |
| B2 | c5s26 (4:14-4:24), c5p26 (4:24-4:30), c6s38 (6:25-6:28), c9s49d2 (10:29-10:32) | **Cleared** | c5s26: Benny on his phone at the news street, newspaper at the kiosk. Panel 3 of c5p26 is an old man in glasses with a magnifier (an inspector), not a woman. c6s38: newspaper THE INFORMATION at the customs dock. c9s49d2: newspaper at the podium. No REPORTER is left in ch1-ch9 (Grep: REPORTER, STAFFER, COLUMNIST, ANALYST, SENATOR, no matches) |
| B3 | c5p26 (4:24-4:30) | **Cleared (now a build, with advice)** | Panel 2 (CHINA DENIES IT) is in by 4:24.5, panel 3 (NOTHING PROVEN IN PUBLIC) at about 4:27.2. The right third is empty for about 2.7 s, not 9 s. UNNAMED SOURCES lands at about 4:26.5 on panel 1 (the news kiosk, CLAIM (REPORTED)), clear of China's denial |
| B4 | c7n06c (8:18-8:20) | **Cleared** | Panel 2: DEFENDANT stamp over a bare pole signed TESLA'S CEO, HE WAS at the foot. No person drawn. Panel 1 is the TESLA box company. Empty for about 1.5 s before panel 2: a build |
| B5 | c1s01 (0:00-0:05), c1s04 (0:12-0:13), c2s10 (1:16-1:23), c9s52e (12:08-12:14) | **Cleared** | No black smear on any counter; the counters have an outline and no dark plate. c9s52e: ~$109B sits in clear sky at top left; the RESULTS envelope is fully visible. c1s04: the red caption MY INDEX FUND: NVIDIA SLICE (ON $100K) reads over the bus windows at full size, but it is thin (advice 6 stays). New overlap in c2s10, see advice 15 |
| B6 | c9s50e (11:22-11:28) | **Cleared** | PUBLISHED? GUIDE DOESN'T SAY is a yellow tag in front of the two directors' heads, fully readable. It covers their eyes and the calendar's edge for about a second; acceptable |
| B7 | c9s54 (12:39-12:46) | **Cleared** | Only the NEXT chair, AS OF WED 11 NOV, NIGHT: NOBODY NAMED, and the Nvidia chip watching from the floor. Nothing reads as a successor. The room is bare (pale wall), but the chair is the joke |

### Replacement shots for Ives, Bennet and Spatacco

All still make sense as pictures: c3s16 / c3s17 (2:14-2:26) doc cards with DAN IVES strip and the empty NEXT chair; c6s36 (5:45-5:54) the IF HE IS REMOVED (ANALYST VIEW) bars with the chip reacting; c6s36b (5:54-5:56) Benny under a NOT A FACT stamp with a FORECAST tag; c6s41 (6:53-6:59) a Senate dome with a letter and the MICHAEL BENNET strip; c9s53b (12:25-12:30) an AI SPENDING cloud at an OPINION stall with the ADAM SPATACCO strip. Weakest: c3s16-c3s17 are 11 s of cards with no one acting (advice 4 still applies).

### New finding

**B8 (blocking). c9s49b (10:08-10:12): a man in a suit stands alone on the night trading floor as the narration says "Two newspapers published reports. Both rest on people they did not name."** It is the CLEANER (`ch9.json` c9s49b, `"who": "CLEANER"`), the same topknot man in a blue jacket that B7 removed from c9s54. He has no duster, no label and a deadpan face, half in shadow, beside the two newspapers, in the shot that introduces the reports about the CEO's private life. He reads as the CEO. Fix: remove the actor, or give him the mop/duster and push him to the edge away from the newspapers. **Owner: art director.**

### New advice (does not block)

14. **c5p26 (4:24.5-4:27.2):** the right third is still empty navy for about 2.7 s. Bring panel 3 in about 1 s earlier (on "unnamed"). Art director.
15. **c2s10 (1:21-1:23):** the -$600+ counter and its caption NVIDIA'S TWO-DAY FALL, ON $100K (OUR SUM) run across Benny's hair; the minus sign sits on the sun and touches the red marker, so the number can read as "$600+". Move the counter left above the jar or move Benny right. Art director.
16. **Small overlaps in the new shots:** c9s52e caption crossed by the left high-jump post (12:08-12:14); c6s41 MICHAEL BENNET strip covers the Senate dome's base (6:53); c9s53b the AI SPENDING label on the cloud is half hidden by the OPINION stall (12:25-12:28). Art director.
17. **c9p50d (11:15-11:22):** the COMMITTEE figure has the same face and jacket as the CLEANER. With the badge and briefcase under LAWYERS ANSWER TO THE COMMITTEE ONLY he reads as a lawyer, so it does not block; a different palette would end the one-face-many-people problem (advice 1). Art director.

### Verdict

**FAIL, one blocker left.** All seven blockers are cleared (B1 c4s24, c4s24b, c5s27, c5s27b; B2 c5s26, c6s38, c9s49d2; B3 c5p26; B4 c7n06c; B5 c1s01, c1s04, c2s10, c9s52e; B6 c9s50e; B7 c9s54). New blocker B8 in c9s49b. After B8 the picture passes this review.

### What remains before upload

1. B8: take the CLEANER out of c9s49b (art director), rebuild, lint, re-pull a frame at 10:08-10:12 (editor).
2. The final voice replaces the scratch voice; then `mix.mjs --tighten`, re-lint (V1, A6) (voice, editor).
3. Remake the full render from the current build; measure it with ebur128 (-14 LUFS, true peak under -1 dB) and pull a frame sheet from the mp4 (editor). render/nvidia-ceo-probe.mp4 and render/preview.mp4 are older than all fixes and must not be uploaded.
4. Out of date against Thursday's reporting (factcheck.md Q9): L132 and c9s49b (TWO REPORTS undercounts), L151 and c9s50f (WSJ REPORTS: COULD MEET SOON; the meeting has reportedly happened), L162 and c9s54 / thumbnail C (NOBODY NAMED while a search and an interim are reported). Scriptwriter and art director, then the fact-checker on the day of upload (also L032 / c3s15, L112, L138).
5. Thumbnail B's band (SAME SALES -9.5%) back with the art director (factcheck.md Q8).
6. Gate 3: the user re-reads CH8 and CH9.
7. The user listens to the final mix for music that fights the voice, especially under CH9. I cannot hear it.
8. Advice 14-17 above, and the open advice from the first review (1, 4, 5, 6, 10, 11, 12), at the art director's discretion.

## After the re-check, 2026-11-12

- B8 (c9s49b): the unlabelled man in a suit is replaced by BENNY, panicking at his red phone (storyboard/ch9.json). Checked on one frame at 610.5 s: the figure reads as the viewer, not the CEO. Build 201 shots, lint `0 failed, 3 warnings, 38 passed`, `npm run check` passed. Not yet re-reviewed by QA.
- The advice items of the re-check (c5p26 right third, the c2s10 counter over Benny's hair, small overlaps in c9s52e, c6s41, c9s53b, the COMMITTEE figure's face in c9p50d) are open.
- screen-text.md was restored from git with its Checked column filled; the c9s49b change adds no wording.
