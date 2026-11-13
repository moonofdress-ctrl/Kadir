# QA

Reviewed 13 Nov 2026 by the QA reviewer, from frames of the build (scratch voice and sound mix, 13:03, 317 shots). No render exists. The user waived Gate 2 and the Look gate for this episode, so this review is the only one before the full render; the user sees the result at Gate 3.

Sheets looked at (all in `render/`): `qa_open_01`-`05` (0-50 s, one frame a second), `qa_all_01`-`20` (one frame per shot to 9:46; the tool timed out after sheet 20), `qa_rest_01`-`04` and `qa_end_01` (9:48-12:18), `qa_tail_1`-`5` (12:19 to the end, last 30 s every 3 s), `qa_check_1`-`4` (the art directors' flagged names), `qa_fixed.jpg` and `qa_sharks.jpg` (the fixes below, after the rebuild).

## Retention lint (after the fixes)

```
Retention lint: poppi-soda-billions  (13:03, 317 shots, 2052 words)

  ok    H1  Opens on a scene, not a card or logo         scene
  ok    H2  The big number on screen in the first 30s    yes
  ok    H3  New picture every ~3s in the first 50s       22 setups, one per 2.3s
  ok    H4  Title question on a card by 0:45             0:37
  ok    H5  First character line by 0:25                 0:15
  ok    H6  Anchor motif planted in the first minute     word on the can at 0:15
  ok    H7  The story's person, close and named, by 0:12 0:03
  ok    H8  No chapter card, chart or lesson before 0:45 ok
  ok    P1  Average shot length                          2.5s
  ok    P2  Longest stretch with nothing new on screen   6.0s at 7:00
  ok    P3  Camera varies between shots                  0 repeats, 0/272 still
  ok    P4  12 or more shots in the first 30s            15 shots
  ok    P5  Few shots longer than 10s                    none
  ok    C1  A text card about every 20s                  45 cards, one per 17s
  ok    C2  Cards take 8-16% of the runtime              12.1%
  ok    C3  No card longer than 5.5s                     ok
  ok    S1  A character speaks every 30s                 118 skits, longest gap 32s at 6:09
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
  ok    T3  Short spoken sentences                       average 9.8 words, 1 over 25
  ok    T4  Viewer addressed directly                    4 lines
  ok    T5  Title question spoken by 0:45                0:37
  ok    T6  The promise and the chain are written        question yes, answer yes, 6 links in the chain
  ok    V1  Speaking pace                                157 wpm
  ok    V2  Length 12-15 minutes                         13:03
  ok    G1  Pictures show something happening            255 of 272 (94%)
  ok    G2  Companies and institutions are living things 161 pictures
  ok    G3  Faces fill the frame in skits                116 of 118 skits
  ok    G4  Facts are written inside the scene           28 signs, tags, labels and badges
  ok    G5  The hidden piggy bank                        6 pictures
  ok    D1  Half of the picture time is dark and lit     100%
  ok    D2  Dark, but the figures can be seen            ok
  ok    K1  Six or more places in every chapter          70 places in all
  ok    K2  No place more than three times a chapter     ok
  ok    W1  Two pictures in three have nothing to read   69 of 272 carry text (25%)
  ok    W2  One thing to read at a time                  ok
  ok    L1  Written props are readable                   ok
  ok    A1  Sound mix is made and up to date             ok
  ok    A2  Loudness -14 LUFS                            -14.01 LUFS
  ok    A3  Peaks under -1 dBTP                          -1.1 dBTP
  ok    A4  Quiet music bed under the voice              19 dB under (house bed (made in code))
  ok    A5  Music is credited                            ok
  WARN  A6  No dead air in the voice                     30 pauses over 0.25s, longest 0.3s at 0:55   -> want 10 or fewer (mix.mjs --tighten cuts them)
  ok    A7  Effects are rare                             57 (4.4 a minute)

  0 failed, 1 warnings, 52 passed
```

Before the fixes: 0 failed, 2 warnings (P3: c5s32 to c6s01, push_in on both sides of the chapter card; A6). P3 is fixed. A6 (30 pauses over 0.25 s, the longest 0.3 s) is a warning only: `mix.mjs --tighten` would cut them but retimes every shot, so it is left to the editor's judgement before the render (fix 15).

## Layout check

Before: `3:51 c3s17 "WELCOME" is covered by text "CANCELLED"` — a fault (both are words the viewer reads; text on text). Fixed: the CANCELLED banner now hangs across the hall's doors under the WELCOME sign (checked at 3:51.4).
After: `0 fault(s)`.

## Review

| Check | Result | Timestamp / shots |
|---|---|---|
| First frame is the thumbnail's scene (A: c1s01) | pass | 0:00, Allison at the lit table, bottle with tag face-down. (The grey frame at 0 s on the one-a-second sheet is the sheet's own first capture; a frame at 0.05 s shows the scene.) |
| Opening is a scene; named person close by 0:12; no chart, list or lesson before 0:45 | pass | Allison close and named at 0:04, Oza at 0:11; title card 0:37; first chapter-like card only after 0:45 |
| Understandable with the sound off | pass | pitch, kitchen, tank, rebrand, TikTok, court, buyer: each is acted by figures and living things |
| Film, not slide: dark with one light, sizes change, no two neighbouring same-size frames facing camera | pass, with the open items 11-13 | D1 100%; the kitchen in CH1 (0:42-0:50) and CH3 (4:07, 4:20) is lit flat, which the format book allows for "the viewer's own world" |
| Places tagged `place` look different from the set's other uses | pass, one weak | "school gym" (c5k22a-d, 7:15-7:22) reads as a dim room with bokeh, not a gym (open 13); "empty hall" c4s16 is the same WELCOME hall as CH3's convention hall, a deliberate callback |
| Each chapter is a scene | pass | none is narration over props with one joke at the end |
| Every shot a small joke; figures that only stand and talk | pass, minor | 5:02 c4s04 a can alone on a dark shelf while "$2.49" is only spoken; 11:05 c8s02, 12:07-12:15 c8s14/c8s15, 12:43 c8s23: the can is tiny at the bottom edge, half under the subtitle or behind the desk (open 12) |
| Story holds; question answered in the opening's words | pass | 12:54 card repeats "So how did Poppi make $1.95 billion?"; every chapter change works with because/so/but (CH4→5 "Because PepsiCo had tried", CH5→6 "But on Poppi's can", CH6→7 "The buyer could finally say its number", CH7→8 "But one piece of that price was never cash") |
| Allegations, models, forecasts named | pass | lawsuit claims are cards titled "the plaintiff's allegation"; Fortune's payout "reported", "no filing shows it"; Bloomberg's earnout attributed |
| Chapters open on a turn and end on a hook; no click-away stretch | pass | no stretch found; longest still stretch 6.0 s at 7:00 (P2 ok) |
| DEVICES paid off; motif changes each time | pass | MOTHER bottle → poppi can → GUT HEALTH gone (8:23) → a can that "just says soda" (12:15) → $1.95B tag torn to $1.65B (10:08) → coin → plain can with no word on the opening table (12:57); Oza's briefcase → tower (9:41-9:54) → lit empty chair (12:59) |
| Stops on the last line with a callback picture | pass | Benny alone in the front row of the opening stage, 13:00 |
| Another channel's look, logos, real brand designs | pass, one note | no logos. The COCA-COLA giant (6:55, c5s30a) is a red can with the engine's straight white band and the name in block letters: not Coca-Cola's script or wave, acceptable. OLIPOP and PEPSICO are names written on living things, as the format book asks |
| Real people | pass | Allison, Stephen, Oza, Laguarta are drawn as guest figures with name strips; the Sharks are shadow figures; no real person speaks (skit lines belong to the cast) |
| Guest figures the same in every chapter | pass | Allison (blonde, coral dress) 0:03 / 0:42 / 4:07 / 4:22 / 10:32 / 12:28; Stephen (beard, green check jacket) 0:53 / 1:22 / 4:29 / 10:32 / 12:33; Oza (grey sides, black suit) 0:11 / 2:07 / 2:52 / 3:19 / 4:46; Laguarta (white hair, grey suit, name strip) 7:25 / 9:35. No drift found |
| Something moves in every shot over 3 s | pass | P3 0 still; moves seen on the sheets |
| Cropped text, overlaps, empty background, figure off the floor | fixed 8 of 8 found that are storyboard edits; see fixes 1-9 | the art directors' flagged names are judged in the next table |
| Too dark to read on a phone | fixed | 1:53-1:58 c2s10b/c2s10c: the five Sharks' shadow figures were invisible, so the shots read as empty chairs (fix 9) |
| Sound | not judged by ear | A1-A7 ok except the A6 warning; mix -14.01 LUFS, -1.1 dBTP. The user should listen for music that fights the voice at Gate 3 |
| `factcheck.md` complete; on-screen figures match | pass | 74 claims, 0 removed; checked on screen: $1.95B, $400K/$4M, $1.6M, $500,000, $4M, $75K / $20M, $13M, $25M, +148%, $25,000, $1.85B, $8.9M, 2 g / 3 g / 5 g, $300M, $85/$15, $1.65B, $278M/$117M/$12M, $2.49, 26 Sep, 17 Mar, 19 May, 9 Dec, 5 Mar |

### The names the art directors flagged

| Name | Shot, time | What renders |
|---|---|---|
| blank label `"label": ""` | c2s15b, 3:05 | a bottle with an empty label: reads as "the word is gone", as meant. ok |
| long counter $20,000,000 → $75,000 | c3s20b, 4:24 | fits inside the frame at its widest ($10,181,259 at 4:25); not cut. ok |
| cheque and briefcase | c4s01, 4:46 | both draw; the can stood on the cheque's "$13M" at the end of its move. Fixed (fix 4) |
| doc card over `desk_top` | c4s14, 6:10 | the TODAY card appears with the quote at 6:12 and is readable. ok |
| giant's `offer` pose, gym skit | c5k22a-d, 7:15 | the pose draws (hands out, low); c5k22c put the giant's mouth under the subtitle. Fixed (fix 5) |
| `car` as a courier van | c5s32, 7:40 | draws a white sedan, with no envelope; the script asks for a courier van carrying one envelope. Open (fix 11) |
| `sweat` on a can | c6k24a/c, 8:04-8:09 | sweat drops show on the can. ok |
| `mug` / `espresso` hand props | c6k25b 8:28, c6k26a 8:41 | Martha holds a mug, Hal an espresso cup. ok |
| 0.6 s shot | c6k24c, 8:09 | 0.8 s on the build, carries the one-word line "Allegedly!" and reads. ok |
| cheque, train and car moves | c7s43a 10:18, c7s43d 10:25, c7k33a 10:51 | the cheque, the train with the can and the racing car all move and read. ok |
| FORTUNE newspaper | c7s44b, 10:33 | a newspaper with a face and FORTUNE in plain block letters, no masthead copy. ok |
| open `wallet` | c8s10, 11:47 | the giant holds a small brown open wallet; readable but small. ok |
| the can's `magnifier` | c8s01, 11:02 | the magnifier sat over the can's face and the can stood behind the cheque. Fixed (fix 8: magnifier removed, can beside the cheque) |
| `empty: true` seats | c8s26/c8s29, 12:51-13:03 | empty seats, Benny alone in the front row. ok |
| Jetty bottle colour | c8s19/s20/k37a/k37b, 12:26-12:43 | the same magenta bottle in all four shots, labelled JETTY once. ok |

### Seams between chapters

- CH5 → CH6 (7:40-7:48): c5s32 and c6s01 were the same night highway with push_in on both sides of the chapter card. c6s01 now pans left (fix 2); the same road on both sides stays, as the road to the court, and is acceptable.
- Other seams: no same place with the same move across a card; no figure changes look between chapters.

## Fixes

Made by QA in the storyboard, rebuilt and checked on frames (`render/qa_check_1.jpg`, `qa_fixed.jpg`, `qa_sharks.jpg`):

1. 3:51 c3s17 (ch3): CANCELLED banner covered WELCOME (layout fault). Banner moved to the doors, x 760, y 430, w 520. Done.
2. 7:48 c6s01 (ch6): camera repeat across the chapter card (P3). push_in → pan_left. Done.
3. 7:48 c6s01 (ch6): the class-action note's label "CLASS ACTION" is written twice on the note and both copies were cut ("SS ACTION / CLASS ACT"). Label "SUIT". Done.
4. 4:46-4:51 c4s01 (ch4): the can stood on the cheque's "$13M" when the cheque arrived. Cheque ends at x 1060, can at x 1560. Done.
5. 7:17 c5k22c (ch5): close shot left the giant's mouth under the subtitle on "You're popular vinegar." Focus y 560 → 780. Done.
6. 10:03 c7s42a (ch7): the $85/$15 bars stood behind the office desk under the red grade; the $15 bar and TAX BENEFIT were unreadable. Grade night, light moved left, bars at x 160, w 580. Done.
7. 10:08 c7s42b (ch7): the torn-tag close cut the can's face at the bottom edge. Focus y 520 → 680. Done.
8. 11:02 c8s01 (ch8): the magnifier covered the can's face and the can stood behind the cheque. Magnifier removed, can moved to x 1180. Done.
9. 1:53-1:58 c2s10b/c2s10c (ch2): the Sharks' shadow figures were invisible (two dark frames of empty chairs while "the investors pushed hard"). Light lowered onto them, `dark` 0.5 → 0.35. Done.

Open (not storyboard fixes I could verify, or too small to hold the render):

10. art-director (rule written, `art-director.md` 1f): the same faults by name are now a framing rule for the next episode.
11. 7:40 c5s32: the script's courier van with one envelope is drawn as a white sedan with nothing in it. Scene builder: a `van` prop (or the car with an envelope on the roof); minor, does not block the render.
12. 11:05 c8s02, 12:07 c8s14, 12:11 c8s15, 12:43 c8s23: the can is small at the bottom edge, half under the subtitle or behind the desk front. Art director: raise the can (y about 900) or scale 0.55; minor.
13. 7:15-7:22 c5k22a-d: the "school gym" reads as a dim room with coloured dots; a hoop or court lines would make it a gym. Scene builder; minor.
14. 9:50 c7k30b and 12:22 c8s18: the $1.95B tag overlaps the can's edge, so "$" is partly hidden at mid-shot. Art director: tag on the free side; minor.
15. Editor: A6, 30 pauses over 0.25 s (longest 0.3 s). Decide on `mix.mjs --tighten` before the render; if used, rebuild, rerun the lint and the layout check, and look at one sheet with `--t`.
16. User at Gate 3: listen to the mix for music that fights the voice; QA cannot hear it.

## What I could not judge

- The sound: loudness and peaks pass the lint, but the balance of music and voice, the effects and the scratch voice's delivery need ears.
- Motion between frames: the sheets show still frames; easing, timing of moves inside a shot and the subtitles' timing were judged only from the lint (P2, P3) and a few frames per shot.
- Frames from 9:46 to 9:48 and any shot whose middle frame fell on a card were seen only at their mid-point.

Verdict: pass
