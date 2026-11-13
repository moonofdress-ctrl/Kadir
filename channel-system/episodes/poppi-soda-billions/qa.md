# QA

Reviewed 13 Nov 2026 by the QA reviewer, from frames of the current build: Lawrence (ElevenLabs) voice, mix made with `--tighten`, 12:04, 316 shots. No full render exists. The user waived Gate 2 and the Look gate for this episode, so this review is the last one before the full render; the user sees the result at Gate 3. This replaces the review of the older 13:03 scratch-voice build.

Sheets looked at (all in `render/`, not in git): `qa_open_01`-`05` (0-50 s, one frame a second), `qa_all_01`-`06`, `qa_b00_*`, `qa_b01_*`, `qa_b02_01`, `qa_c1_*`, `qa_b03_01`, `qa_c2_*`, `qa_rest_00`-`03`, `qa_b05` (one frame in the middle of every shot, 0:00 to the end; the sheet tool timed out several times, so the run is split over these files), `qa_tail` (the last 30 s, every 3 s), `qa_fixed_1`-`5` (the fixes below, after the rebuild).

The contact sheet drops some overlays and grades on some frames (cards, lower thirds, counters and the night grades come out grey or flat on `qa_open_*` and `qa_all_*`). Checked with draft renders of a few seconds (scratch folder, not in the repo): 0-24 s (name strips, the "We know what they don't" card, the $1.95B counter and the dark grade all show), 4:02.9-4:06.6, 4:24.9-4:32.7, 5:05.3-5:08.9, 6:05.1-6:06.7, 10:29-10:33.

## Retention lint (after the fixes)

```
Retention lint: poppi-soda-billions  (12:04, 316 shots, 2035 words)

  ok    H1  Opens on a scene, not a card or logo         scene
  ok    H2  The big number on screen in the first 30s    yes
  ok    H3  New picture every ~3s in the first 50s       24 setups, one per 2.1s
  ok    H4  Title question on a card by 0:45             0:35
  ok    H5  First character line by 0:25                 0:14
  ok    H6  Anchor motif planted in the first minute     word on the can at 0:14
  ok    H7  The story's person, close and named, by 0:12 0:03
  ok    H8  No chapter card, chart or lesson before 0:45 ok
  ok    J1  Every shot says what it explains             0 of 316 shots without "explains"
  ok    P1  Average shot length                          2.3s
  ok    P2  Longest stretch with nothing new on screen   5.3s at 1:05
  ok    P3  Camera varies between shots                  0 repeats, 2/271 still
  ok    P4  12 or more shots in the first 30s            16 shots
  ok    P5  Few shots longer than 10s                    none
  ok    C1  A text card about every 20s                  45 cards, one per 16s
  ok    C2  Cards take 8-16% of the runtime              12.8%
  ok    C3  No card longer than 5.5s                     ok
  ok    S1  A character speaks every 30s                 118 skits, longest gap 30s at 5:42
  ok    S2  Dialogue is a quarter of the words           27%
  ok    S3  Two skits or more in every chapter           ok
  ok    M1  Anchor motif keeps returning                 word on the can: 28 times
  ok    M2  Opening images pay off late                  24 callbacks in the second half
  ok    M3  Viewer stand-in keeps appearing              BENNY: 29 shots
  ok    M4  Colour grade follows the mood                5 grades used
  ok    M5  6-9 chapters of 1-3 minutes                  8 chapters, 0 outside 40-200s
  ok    E1  Quotes shown as evidence                     18 evidence overlays for 15 quoted lines
  ok    X1  Last shot is a callback                      Benny alone in the front row, the opening's stage
  ok    T1  No intro phrases or calls to action          none
  ok    T2  No financial advice wording                  none
  ok    T3  Short spoken sentences                       average 9.8 words, 2 over 25
  ok    T4  Viewer addressed directly                    4 lines
  ok    T5  Title question spoken by 0:45                0:35
  ok    T6  The promise and the chain are written        question yes, answer yes, 6 links in the chain
  WARN  V1  Speaking pace                                169 wpm   -> want 150-165 wpm (reference: 157)
  ok    V2  Length 12-15 minutes                         12:04
  ok    G1  Pictures show something happening            254 of 271 (94%)
  ok    G2  Companies and institutions are living things 159 pictures
  ok    G3  Faces fill the frame in skits                116 of 118 skits
  ok    G4  Facts are written inside the scene           28 signs, tags, labels and badges
  ok    G5  The hidden piggy bank                        6 pictures
  ok    D1  Half of the picture time is dark and lit     100%
  ok    D2  Dark, but the figures can be seen            ok
  ok    K1  Six or more places in every chapter          72 places in all
  ok    K2  No place more than three times a chapter     ok
  ok    W1  Two pictures in three have nothing to read   68 of 271 carry text (25%)
  ok    W2  One thing to read at a time                  ok
  ok    L1  Written props are readable                   ok
  ok    A1  Sound mix is made and up to date             ok
  ok    A2  Loudness -14 LUFS                            -14.02 LUFS
  ok    A3  Peaks under -1 dBTP                          -1.03 dBTP
  ok    A4  Quiet music bed under the voice              19 dB under (house bed (made in code))
  ok    A5  Music is credited                            ok
  WARN  A6  No dead air in the voice                     33 pauses over 0.25s, longest 0.39s at 2:27   -> want 10 or fewer (mix.mjs --tighten cuts them)
  ok    A7  Effects are rare                             57 (4.7 a minute)
  ok    A8  Effects on at most one cut in five           18% of 316 shots

  0 failed, 2 warnings, 53 passed
```

The two warnings are known and accepted: V1 (Lawrence reads at 169 wpm; the voice was chosen by the user) and A6 (33 pauses over 0.25 s after `--tighten`, the longest 0.39 s: short breaths, not dead air).

## Layout check

Before and after the fixes: `0 fault(s)` (271 moments looked at).

## Review

| Check | Result | Timestamp / shots |
|---|---|---|
| First frame is the thumbnail's scene | pass | 0:00 c1s01, Allison on the lit pitch stage, MOTHER bottle on the table (the grey first cell of the one-a-second sheet is the sheet's own capture; the render shows the scene) |
| Opening is a scene; named person close by 0:12; no chart, list or lesson before 0:45 | pass | Allison close with her name strip at 0:04-0:05, Oza named at 0:10; the only number is the $1.95B counter at 0:19; title card 0:35 |
| Understandable with the sound off | pass | pitch, kitchen, tank, rebrand, TikTok, court, buyer are acted by figures and living things |
| Film, not slide | pass | the render frames are dark with one light (D1 100%); sizes change from cut to cut; no two neighbouring same-size frames facing camera found |
| Places tagged `place` look different | pass, one weak | "school gym" (c5k22a-d, 6:43-6:48) still reads as a dim room with coloured dots (open 12) |
| Each chapter is a scene | pass | none is narration over props with one joke at the end |
| Every shot a small joke | pass, minor | 1:41 c2s09c Allison half off the left edge; cans small at the bottom edge in c8s02, c8s23, c7s43d (open 13) |
| Story holds; question answered in the opening's words | pass | 11:54 card repeats "So how did Poppi make $1.95 billion?", answered "It changed the word on the can, not the soda... and the number was never quite that big"; chapter turns work as because/so/but |
| Allegations, models, forecasts named | pass | "The plaintiff's allegation" doc card, Fortune's figure "reported... No filing shows it", Bloomberg and Ken Shea attributed |
| Chapters open on a turn, end on a hook; no click-away stretch | pass | longest still stretch 5.3 s (P2) |
| DEVICES paid off; motif changes | pass | MOTHER → poppi → GUT HEALTH → NO FAULT (8:12, now readable) → $1.95B tag → $1.65B (10:04) → $12M → plain can on the opening table (11:59) |
| Stops on the last line with a callback | pass | Benny alone in the front row at 12:01-12:04 |
| End screen room (FORMAT_BOOK 8) | fixed, one open | the last 20 s had faces in the right half (c8k37b bottle, c8s23 coin, c8s24 giant, c8s25/c8s27 can, c8s26/c8s29 Benny); moved left. The c8t06 text card (11:54.7-11:58.8) is centred by the engine (open 10) |
| Another channel's look, logos | pass | no logos; COCA-COLA, OLIPOP, PEPSICO are block-letter names on living things |
| Real people | pass | Allison, Stephen, Oza, Laguarta are guest caricatures with name strips; the Sharks are shadow figures; no real person speaks an invented line |
| Something moves in every shot over 3 s | pass | P3 2/271 still, both short |
| Cropped text, overlaps, figure off the floor | fixed 7 found; see fixes 1-7 | |
| Rolling counters land on their number | pass, minor | c3s20b lands on $75,000; c8s06 lands on "$ 12M" with an empty digit slot after the "$" (open 11) |
| Sound | not judged by ear | A1-A8 ok except the two warnings; -14.02 LUFS, -1.03 dBTP. The user is listening to `render/poppi-mix-lawrence.mp3` for music that fights the voice |
| `factcheck.md` complete; on-screen figures match | pass | 88 lines, every row verified or corrected; checked on screen: $1.95B, $400K, $4M, $1.6M, $500,000, $13M, $75,000, $25M, +148%, $4M/$500M, $25,000, $1.85B, $8.9M, 2 g / 3 g / 5 g, $300M, $85/$15, $1.65B, $278M/$117M/$12M, $4 of $100, $2.49, DEC 9 SUNDAY, MAR 14 FRIDAY, MAR 17 MONDAY, MAY 19 MONDAY, SEP 26 FRIDAY (weekdays checked against 2018 and 2025 calendars) |

## Fixes

Made by QA in the storyboard, rebuilt, lint and layout check rerun (0 failed, 0 faults), checked on `qa_fixed_1`-`5`:

1. 8:31-8:36 c6s19, c6s20 (ch6, art-director): the flipping calendar showed "MAR 5 / FRIDAY" for about a second (5 March 2025 was a Wednesday; the old page had no weekday, so the new page's FRIDAY showed under it) and "MAR 14 / MONDAY" the same way. `from` pages now carry `"dow": "WEDNESDAY"` and `"dow": "FRIDAY"`. Done.
2. 4:24.9 c4b01 (ch4, art-director): the evidence board opened on 2 s of empty cork, and at zoom 1.7 the string label "led the $13M round" was cut to "und". First node on word 0, `"zoom": 1.3`. Done.
3. 4:02.9 c3s20a (ch3, art-director): the cash pile for "$20 million of revenue" stood below the frame, only a strip of green under the subtitle. Pile on the counter, y 960 → 690. Done.
4. 5:05.3 c4s08 (ch4, art-director): the $4M/$500M bars stood behind the desk, their labels in dark ink on a dark wall, the $500M on a wall picture. Bars at x 100, y 460, h 440, values in green (#6fd38a), light moved onto them. Done.
5. 6:05 c5s28b (ch5, art-director): the SOULBOOST label sat under the subtitles. Focus y 640 → 780. Done.
6. 8:12 c6s15 (ch6, art-director): the NO FAULT label (a motif payoff) sat under the subtitles. Focus y 640 → 760. Also 7:21 c6s05: GUT HEALTH can scale 0.55 → 0.75 (the label is still small; acceptable).
7. 11:45-12:04 c8k37b, c8s23, c8s24, c8s25, c8s26, c8s27, c8s29 (ch8, art-director): faces in the right half during the last 20 s, where the end screen goes. Figures and lights moved to x 520-760; c8s29 got `"focus": [960, 760]` so the camera no longer centres Benny. Done.

The rules that would have prevented 1, 2 and 7 are in `.claude/agents/art-director.md` 1f; the lesson is in `channel-system/LESSONS.md`.

Open (minor, do not block the render):

8. Packager: start the end screen at 11:59 (after the c8t06 card), which leaves 5.5 s with the right half clear.
9. 9:06 c7k30b and 11:28 c8s18: the $1.95B tag overlaps the can's edge, the "$" partly hidden (from the last review). Scene builder: draw the tag on the free side.
10. Scene builder: a text card cannot be set to the left half; c8t06 sits across the end-screen area for 4 s.
11. Scene builder: the rolling counter (`roll: true`) keeps an empty digit slot when the number gets shorter ("$ 12M" at 10:29).
12. 6:43-6:48 c5k22a-d: the "school gym" still needs a hoop or court lines (scene builder).
13. Art director: cans drawn small at the bottom edge (c8s02 10:14, c8s23 11:46, c7s43d 9:38); the `facepalm` pose puts a round hand over one eye and reads like a monocle (c1s15 0:43, c3s20c 4:06).
14. User at Gate 3: listen to the mix (`render/poppi-mix-lawrence.mp3`); QA cannot hear it.

## What I could not judge

- The sound by ear: balance of music and voice, effects, Lawrence's delivery.
- Motion between frames: judged from one frame per shot, the opening at one a second and the six short renders.
- The full MP4: no render exists; loudness of the final file must be measured after the render (`ffmpeg -i <file> -af ebur128=peak=true -f null -`).

Verdict: pass
