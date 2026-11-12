# QA

Reviewed 2026-11-12 on the render `render/nvidia-ceo-probe.mp4` (1920x1080, 30 fps, 13:09), frames pulled from the MP4: 1 fps for 0:00-0:50, one frame every 5 s for the rest, 1 fps for the last 30 s, plus spot checks. Timestamps below are render times (screen-text.md still carries the old, longer timings, see fix 20).

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

Render measured with `ffmpeg -af ebur128=peak=true`: integrated -14.0 LUFS, true peak -1.1 dBFS, LRA 1.7 LU.

## Review

| Check | Result | Timestamp / note |
|---|---|---|
| Lint | PASS (0 fail, 3 warn: M5, V1 166 wpm, A6 26 short pauses) | |
| First frame = thumbnail A scene | PASS with note | 0:00 tent, chip on the pole, Benny with phone, Martha with bill. The -$430B counter only appears from about 0:01; thumbnail A (thumbnails.md) wants the chip `panic`, gloves up: in the render it is calm. No thumbnail PNG made yet. |
| First sentence has number + contradiction | PASS | 0:00-0:08 "lost about four hundred and thirty billion dollars ... no one had reported it selling one chip less". |
| Sound-off clarity | PASS | Subtitles on, title card at 0:13, every number drawn. Exception: the 0:12 counter never reaches its value (fix 1). |
| Every number and quote drawn | PASS with fix | All quotes on document cards with source and date. 0:12 counter stops at -$594 on screen (cut before it lands on -$600). |
| Every shot a small joke | FAIL (partial) | Figures that only stand and talk: 0:33-0:36 board pair (c1, "It starts on a Sunday"); 0:40-0:44 Hal beside the slice chart; 4:40-4:45 two directors under NO REASON TO BELIEVE; 4:55 two directors at the dark tent; 5:40-5:45 analyst standing beside the bars; 11:20-11:25 two directors (FINDINGS GO TO THE BOARD); 11:50 Hal and Chad on the stage (WHOEVER LEADS IT); 12:39-12:46 cleaner standing by the chair. |
| Story holds: question answered in the opening's words | PASS | Card at 12:56 repeats the title; last line "Because one man's trouble made everyone look up at the same time ... and count the poles" answers PROMISE ("rests on one man"). |
| Chapter changes work with because/so/but | PASS | All eight links in script.md Self-check use but/so; none is a bare "and". |
| Allegations, models, forecasts named | PASS | ALLEGED: FRAUD, CLAIM (REPORTED), UNNAMED SOURCES, (A FORECAST), (OUR SUM), SIZE, NOT A FORECAST, NOT A CLOSE, NOT A FORECAST all on screen. |
| Chapters open on a turn, end on a hook | PASS | e.g. CH7 ends "And then, on Wednesday, it went up." (8:50), CH8 ends "And Wednesday wasn't over." (10:00). |
| Stretch where I would click away | WARN | 10:55-11:55: the Harvard-guide procedure (committee, lawyers, findings, deadline) is four boardroom/street shots of directors standing, with two overlap faults (fixes 13, 14). Densest, least visual minute. |
| Plants paid off, motif changes | PASS | Tent: daylight full crowd -> dark blue tent -> night tent with crowd looking up. Red phone -> green on the bus (9:30) -> red on the night bus (10:55). Empty chair 0:24 -> 2:10 -> 8:45 -> 12:39. $100,000 jar 1:15 -> 5:50 -> 10:45 -> last shot. $7 strip 0:45 -> 9:30 -> 10:40 -> 12:47. |
| Stops on the last line with a callback picture | PASS | 13:04-13:09 Benny and the jar under the one pole, "...and count the poles." No outro. |
| Other channels / logos | WARN | No logos seen. The office poster DO WHAT YOU LOVE (1:55, 2:20, 3:45, 4:35, 7:10, 10:10) is WeWork's well-known neon slogan; swap it. |
| Real people within style-guide limits | FAIL | (a) The JENSEN HUANG lower third sits next to a full figure twice: 3:40-3:45 (purple-suit REPORTER) and 4:35 (blue-jacket STAFFER holding a phone, "email to staff"): both read as Huang drawn, which the script excludes. (b) 12:39-12:46 a man in the blue jacket stands with his hand on the NEXT chair while the narration says "nobody named": reads as a successor (script: "no successor ... implied or drawn"). The same neutral blue-jacket figure is also Dan Ives (2:15, 5:40), Sen. Bennet (6:55) and the staffer, so viewers may link them. (c) 12:25 ADAM SPATACCO lower third over a woman figure at the stall. Name strips over neutral figures are otherwise within the guide. |
| Motion in every shot over 3 s | PASS | Lint P3 0 still; nothing static seen beyond camera-only moves. |
| Cropped text, overlaps, empty background, figure off floor | FAIL | See fixes 2-17. Empty half-frame: 4:14-4:22 (split panel 2 missing about 8 s) and 11:13-11:17. No figure off the floor seen. |
| Sound A1-A7 | PASS (A6 warn) | Render -14.0 LUFS, -1.1 dBTP. I cannot hear it: the user must listen for music fighting the voice, especially under the dense CH9 lines. |
| factcheck.md complete, figures match | FAIL (open items) | Row 40 (Sen. Bennet release) still "unverifiable", yet the scene and lower third are in at 6:55. WSJ/NYT texts unread; 12 Nov trading must be re-checked before upload (factcheck.md lines 182, 213). On-screen figures I checked match their rows: -$430B, -$600+, 7.3%, -4.27%, -5.47%, 9.5%, $500->$200, $7.5B, -0.65%, ~-1.5%, -$59B, -5%, 14%, $108B, ~$109B, $1B+, >8%, -$500 to -$600, dates 8, 9, 10, 11, 17, 18 Nov 2026, 24 Aug 2011, 5 May 2025, 27 and 29 Sep 2018. screen-text.md timings are stale (run to 14:30 on a 13:09 video). |

## Fixes

1. 0:11-0:13, c1s04 (art-director): the -$600 counter is cut at -$594; lengthen the shot or shorten the roll so it lands and holds about 1 s. The counter also sits on the SALE sign; move it off the sign.
2. 0:01-0:04, 0:55, 1:20, 12:10 (scene-builder, engine overlay): the counter's dark drop-shadow reads as a grey smudge on light skies (covers the sun at 0:01). Tighten or lighten it. "VALUE LOST IN TWO DAYS (ABOUT)" red on orange is low-contrast.
3. 0:12 and 9:28-9:32, c1s04 and c8 bus shot (art-director): "UNDER $7" and the $7 strip overlap the SALE / TODAY ONLY sign. Move the note left or the sign right.
4. 1:00 (art-director): BORING FUND sign half behind Martha's bun.
5. 1:50 (art-director): START-UP and ONE OF EARTH'S BIGGEST signs overlap each other.
6. 3:28-3:32, c4 Singapore street (art-director): the street-lamp pole crosses "US RULES: NOT OURS TO ENFORCE" ("E|NFORCE") for the whole shot. Same pole fault at 5:20 (TUESDAY MORNING, plus INFLATION: HOT overlapping it), 6:30 (WE DENY IT), 11:05 (LAW), 12:25-12:30 (NEWS, and NEXT QUARTER: WEAK? over the lamp). Move signs or the lamp (scene-builder if the street set should keep the pole clear of sign slots).
7. 3:40-3:45 and 4:35 (art-director): remove the full figure beside the JENSEN HUANG lower third (or drop the lower third and keep the source line on the document card) so no figure reads as Huang.
8. 4:14-4:22, c5 split "WHO SAYS" (art-director): right half stays empty navy about 8 s; bring panel 2 in earlier. Same at 11:13-11:17 (THE COMMITTEE DRIVES).
9. 4:25 (art-director): UNNAMED SOURCES stamp covers a figure's head and the PHARMACY sign; NOTHING PROVEN IN PUBLIC sits on the figure.
10. 4:30 (art-director): EMAIL TO STAFF and SAME DAY signs overlap.
11. 5:45 (art-director): DAN IVES lower third overlaps the green TODAY bar.
12. 6:00 (art-director): OUTPERFORM and NEUTRAL tags cover the BAIRD and street signs.
13. 11:25 (art-director): the yellow banner "PUBLISHED? GUIDE DOESN'T SAY" is hidden behind the two directors' heads; unreadable. Raise it above the heads.
14. 11:30 (art-director): the NOV ? MEETING? calendar covers "DEADLINE: ?".
15. 9:15-9:25, c8 (art-director): AT THE CLOSE: DEMAND UNCHANGED sticker covers the CHIP FACTORY label; the source line covers SALES FORECAST; NO CHANGE ANNOUNCED stamp covers the chart title and $108B.
16. 8:05-8:15 (art-director): ALLEGED: FRAUD sign partly behind the SEC figure's head. 7:40: VISITOR badge cut by the arm. 8:00: CHAIRMAN label cropped at the right edge. 10:45: "-$500 TO -$600" touches the left edge.
17. 12:15 (art-director): "$1B+ A DAY" and EVERY DAY sign overlap. 12:20: split-panel labels sit on the figure and the dome.
18. 12:39-12:46, c9s54 (art-director): the CLEANER reads as a successor at the NEXT chair. Give him a duster/mop and walk him away from the chair, or cut him so the chair is alone.
19. 12:25, c9s53b (art-director): ADAM SPATACCO lower third over a woman figure; use a neutral figure that does not contradict the name.
20. Every shot listed under "Every shot a small joke" (art-director): give each standing figure an action (hand over, stamp, walk, point at the written fact). Priority 10:55-11:55.
21. Office poster DO WHAT YOU LOVE (art-director): replace with our own gag text.
22. After the layout fixes (editor): rebuild, re-run `screen-text.mjs` so screen-text.md times match the 13:09 cut, re-run the lint and `npm run check` (32 small texts, 5 low-contrast texts at 0:44, 6:35 and 12:25 still open), re-render.
23. Row 40, Sen. Bennet (fact-checker): open the release by hand, or cut line and scene c6s41 (6:55). Also: read the WSJ/NYT texts, and re-check 12 Nov trading before upload; the script is "as of Wednesday night".
24. A6 and V1 (voice-producer): run `mix.mjs --tighten` only if the user hears the pauses; pace 166 wpm is one over the band, acceptable.
25. Thumbnail (illustrator): not made yet; thumbnails.md pair B describes a sign CHIPS SOLD: NOT ONE LESS that the render now shows as CHIP SALES: NO DROP REPORTED; update before making it. Pair A wants the chip in `panic`; the 0:00 shot has it calm (art-director if the first shot should change to match).
26. User: listen to the whole mix for music fighting the voice; QA cannot hear it.

Verdict: **fix first** (real-person/successor readings at 3:40, 4:35, 12:39; one unverified on-screen claim at 6:55; about 20 overlap faults).
