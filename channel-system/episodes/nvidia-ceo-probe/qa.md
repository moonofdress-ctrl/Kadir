# QA: nvidia-ceo-probe (build of 12 Nov 2026, after the two merged branches)

Judged from frames of the current build (203 shots, 13:09), not a render. Frames: 0:00-0:49 at 1 s, one frame per shot for the whole cut, the last 30 s, and `--t` lists inside every named or flagged shot. Timestamps are build time.
Earlier reviews (render of 12 Nov and older builds) are in git history.

## Retention lint

```
Retention lint: nvidia-ceo-probe  (13:09, 203 shots, 2188 words)

  ok    H1  Opens on a scene, not a card or logo         scene
  ok    H2  Big number on screen in the first 8s         yes
  ok    H3  New picture every ~3s in the first 50s       18 setups, one per 2.8s
  ok    H4  Title question on a card by 0:30             0:13
  ok    H5  First skit by 0:40                           0:15
  ok    H6  Anchor motif planted in the first minute     tent at 0:00
  ok    P1  Average shot length                          3.9s
  ok    P2  Longest stretch with nothing new on screen   5.8s at 3:29
  ok    P3  Camera varies between shots                  0 repeats, 0/149 still
  ok    C1  A text card about every 20s                  47 cards, one per 17s
  ok    C2  Cards take 8-16% of the runtime              14.0%
  ok    C3  No card longer than 5.5s                     ok
  ok    S1  A skit every 50-70s                          22 skits, longest gap 71s
  ok    M1  Anchor motif keeps returning                 tent: 17 times
  ok    M2  Opening images pay off late                  17 callbacks in the second half
  ok    M3  Viewer stand-in keeps appearing              BENNY: 39 shots
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
  ok    G1  Pictures show something happening            163 of 166 (98%)
  ok    G2  Companies and institutions are living things 82 pictures
  ok    G3  Faces fill the frame in skits                22 of 22 skits
  ok    G4  Facts are written inside the scene           217 signs, tags, labels and badges
  ok    G5  The hidden piggy bank                        5 pictures
  ok    L1  Written props are readable                   ok
  ok    A1  Sound mix is made and up to date             ok
  ok    A2  Loudness -14 LUFS                            -14.02 LUFS
  ok    A3  Peaks under -1 dBTP                          -1.04 dBTP
  ok    A4  Quiet music bed under the voice              19 dB under (house bed (made in code))
  ok    A5  Music is credited                            ok
  WARN  A6  No dead air in the voice                     26 pauses over 0.25s, longest 0.29s at 1:05   -> want 11 or fewer (mix.mjs --tighten cuts them)
  ok    A7  Effects are rare                             66 (5 a minute)

  0 failed, 3 warnings, 38 passed
```

## Layout check (`studio/tools/layout-check.mjs`)

55 rows, exit 1. Judged one by one against the frames:
- **Fix (text the viewer must read):** c3k04 INSURE / ANYTHING (frame edge), c7n08 APPLE, c7n08x BERKSHIRE (tent flags behind Benny on the line about that company), c3k04b 1 POLE, c6k10 IT'S FINE, c2p11 NEWS, c7n02b APPLE 2011. Not flagged by the tool but seen in frames: c2s07 price tag 500 INSIDE, c5s26 NEWSPAPER label under the REPORTED tag, c9p50d badges INDEPENDENT and COMMITTEE under the hands, c7n08b TESLA -13.9% (arrives as the shot cuts).
- **Fine (background):** shop names behind heads or cards (GROCER, BANK, CAFE, CHINA, CHIPS crates, TAX, HARBOUR, LAW, OFFICES, BAIRD/BANK fascia, BOARD door sign, PHARMACY, BAKERY, NEWS/BANK in panels), office posters behind document cards (KEY PEOPLE, PLAN A / PLAN B, BUY / SELL), SALE / TODAY ONLY bus posters behind counters and heads, DON'T PANIC panel poster, c1s06 NOV (calendar is clear one second later), c2s09 NVIDIA on the plank (the chip carries the name), c9s49h banner (reads whole), c9p53 NOV, c9s54b CAFE, c7n06c BAKERY, c7n02 READY (reads in the frame).

## Checks

- **Lint:** PASS (0 failed; M5, V1, A6 warnings).
- **First frame and first sentence:** PASS. 0:00 is the tent with the chip on the pole and the counter running to -$430B; the line carries the number and "no one had reported it selling one chip less".
- **Sound off:** PASS. Title question carded at 0:13, every money figure is a counter, tag or bar, every quote is a document card with source and date. One exception: c7n08b's TESLA -13.9% (fix 6).
- **Every shot a small joke:** PASS with notes. Places are specific, institutions are living things (dome, tower, bank, chip, factory, cloud). Figures that only stand and talk: c3s17 Ives 2:20-2:26 (holds a pen, no business), c4s24b Huang 3:44-3:50 and c5s27b 4:34-4:41 (stand beside the card; acceptable for a real person quoted), c6s36b Ives 5:53-5:55, c9s53d Hal 12:33-12:37. Not blocking.
- **Story holds:** PASS. The close answers the title in nearly the opening's words ("one man", "the empty chair"). Chapter changes: CH1>2 but, CH2>3 so, CH3>4 because, CH4>5 but, CH5>6 so, CH6>7 so, CH8>9 but. CH7>8 only works as "and": the card at 8:56 literally reads AND THEN, ON WEDNESDAY (fix 17). Allegations, forecasts and opinions are tagged (REPORTED, AN ALLEGATION, UNNAMED SOURCES, A FORECAST, NOT A FACT, OPINION, SNAPSHOT, NOT A CLOSE).
- **Turns and hooks:** PASS. Each chapter opens on a card that turns and ends on a skit or card hook. No stretch where I would click away; the slowest stretch is the CH9 card run 10:58-11:05 (c9t04, c9s50), still under 6 s per picture.
- **Devices paid off:** PASS. -$600 phone (0:12) > -$600+ jar (1:22) > -$500 TO -$600 (10:46); NEXT chair at 0:25, 2:20, 8:46, 12:42; "seven" at 1:01, 9:31, 10:41; "We're Wednesday" 9:10 > "It's still Wednesday" 10:55; kitchen for rent 3:08 > 6:43 > 9:51; tent motif changes each time (dusk, stage, crowd under it, blue night tent, four small tents, night with Benny alone).
- **Ending:** PASS. Stops on "...and count the poles." over Benny with the jar under the one pole (callback).
- **Other channels, logos, real people:** FAIL. No logos; tickers are made up; company names in house lettering. Named caricatures: Ives (dark slick hair, orange patterned cardigan), Huang (grey hair, round glasses, black jacket), Bennet (grey swept hair, no glasses, suit), Spatacco (brown skin, light hair, green shirt, no glasses): four different looks, each strip sits with its own figure, each figure stands clear of its card, "-25% TO -30%" is uncovered in c6s36, Huang has no smile in c5s27b. Failing items: unlabelled humans that read as real people in c7n02/c7n02b (Jobs, then Cook, as one figure), c5s31 (the plaintiff), c2s08b (a Trefis employee). Board directors (identical green figures under THE BOARD / INDEPENDENT DIRECTORS signs) read as the institution and pass. Hal's grey hair, glasses and suit sit close to Huang's look (note 18).
- **Movement in shots over 3 s:** PASS on the lint (P3 0/149 still) and the frames I compared; motion itself can only be confirmed on a render.
- **Cropped text, overlaps, empty backgrounds, floor:** FAIL. c3k04 cropped poster, c7n06 Reggie half out of frame, name strip over Ives' body in c3s16 and c6s36, tent flags hidden in c7n08 / c7n08x. No empty backgrounds; nobody off the floor.
- **Sound:** lint A1-A7 pass (A6 warning). No render, so no ebur128 measurement. I cannot hear it: the user must listen for music fighting the voice, the 166 wpm pace and the 26 short pauses.
- **Fact check:** PASS for the screen. Every on-screen figure seen matches factcheck.md (-$430B, -$600 / -$600+, 7.3%, ~8%, 10% / ~0.7%, -25% TO -30%, -$1,900, $500 > $200, $7.5B REPORTED, -5.41%, -$59B, -5%, -0.65% / ~-1.5%, ~-9.5%, -13.9%, $108B, ~$109B, $1B+ A DAY, MORE THAN -8%, -$500 TO -$600). c9s50f already shows WSJ REPORTS: BOARD MET. NO DECISION (factcheck Q4). The open items below are known.
- **Tool note:** single `--t` frames at 0:35, 5:48 and 6:57 sometimes draw in the fallback sans; the same shots in the one-per-shot sheet use the house lettering, so this is the frame grabber racing the font. Check once on the render.

## Fixes

Blocking (art director unless named):
1. c7n02 / c7n02b, 7:21-7:30: one unlabelled human (STAGEHAND, hard hat, glasses) is on screen while Jobs and then Cook are named, so it reads as both men with one look and no strip; replace with a living thing (APPLE box carrying the spare pole) or draw no person. Also frees the APPLE 2011 flag his head covers.
2. c5s31, 5:10-5:15: unlabelled SHAREHOLDER human holds the lawsuit and reads as the real plaintiff; replace with a living thing (bag or coin labelled SHAREHOLDERS) and keep the LAWSUIT tag off its head.
3. c2s08b, 0:52-0:57: unnamed human with a TREFIS badge reads as a Trefis employee; make Trefis a labelled tower or box holding the magnifier.
4. c7n08, 8:30-8:34: Benny stands in front of the APPLE tent while "Apple had an heir ready... lost less than one percent" is spoken; move him off the flag.
5. c7n08x, 8:34-8:37: Benny's head covers the BERKSHIRE flag on "and still lost five percent"; stop his walk short of the flag or raise the flags.
6. c7n08b, 8:44-8:46: the bars shot is about 2 s; ~-9.5% lands with half a second left and TESLA -13.9% only fades in as it cuts; lengthen the shot or bring the numbers in together early.
7. c3k04, 2:04-2:08: the INSURE / ANYTHING poster is cut by the frame edge ("URE / HING"), so the insurance-office joke is lost; move it inside x 170-1750.

Not blocking:
8. c3s16 2:13-2:20 and c6s36 5:45-5:53: the DAN IVES strip is drawn over Ives' own body; put the strip on the other side or move him clear of it.
9. c7n06, 8:05-8:09: Reggie (SEC) is half out of frame on the right, face and badge cut.
10. c2s07, 0:35-0:40: price tag 500 INSIDE is clipped by the chip and Martha's hand.
11. c9p50d, 11:19-11:23: the badges INDEPENDENT and COMMITTEE are under the figures' hands; label the lawyer figure LAWYERS in plain view so it cannot read as either named author (Markel, Murray) of the card before it.
12. c3k04b, 2:08-2:10: the 1 POLE sign hides behind Reggie's head on the punchline "One."
13. c6k10, 6:19-6:23: IT'S FINE poster clipped at the left edge.
14. c2p11, 1:27-1:31: NEWS sign behind Benny's head in the DIDN'T READ THE HEADLINE panel.
15. c5s26, 4:14-4:20: the REPORTED tag covers the NEWSPAPER character's label ("EWSPAPER").
16. c7n07, 8:23-8:26: an ELON MUSK strip with no figure beside it labels empty floor; drop it (the card already names him) or tuck it under the card.
17. c7t06 / c8 open, 8:56: card AND THEN, ON WEDNESDAY makes the CH7>CH8 change an "and"; "But on Wednesday," (scriptwriter, then voice-producer).
18. c9s52b, 11:52-11:57: Hal (grey hair, glasses, dark suit) at the leader's podium can read as Huang; give the podium figure Hal's signature prop or put Chad there.
19. c1k01b, 0:20-0:23: the YOU OWN THIS card sits over Benny's mouth while Hal speaks; lift it.

## Open before upload (do not decide this verdict)

- Listen (user): scratch voice, V1 166 wpm, A6 pauses, music against the voice; render and measure -14 LUFS / peak under -1 dB.
- factcheck.md: re-record L151 (voice-producer); 12 Nov close and any board decision (CH9 s49d-s56 change if the board acts); Bennet release as PRIMARY; WSJ/NYT texts unread; 8 vs 10 Nov board statement date; thumbnail B band; Gate 3.

Verdict: fix first
