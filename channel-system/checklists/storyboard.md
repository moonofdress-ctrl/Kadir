# Storyboard checklist

One page for the art director and the creative director, so they do not re-read the format book, the style guide, the cast and the gallery for every chapter (13 Nov 2026: eight chapter art directors each read about 70 KB before writing a shot). Condensed from FORMAT_BOOK 3, 6, 11, 12, 13 and STYLE_GUIDE. When they disagree the format book wins, and whoever installs a rule updates this page in the same commit (the improver checks it).

## Targets the lint checks
| Lint | Target |
|---|---|
| P1, P4, P5 | 3.5 s average shot; 12 shots or more in the first 30 s; at most one shot over 10 s a chapter |
| P2, P3, P6 | something new every 6 s; every shot moves, never the same move twice in a row; no move on more than a quarter of the shots |
| H1, H2, H4, H7, H8 | open on a scene; one big number by 0:30; the title question on a card by 0:45; the story's person `close` or `medium` with a `lower_third` by 0:12; no chapter card, `bars` or `line` before 0:45 |
| H9 | the Look gate is judged in `qa.md` (never skipped) |
| D1, D2, D3 | 50–75% of the picture time dark with one `light`; over a night set `dark` 0.5 or less and `r` 750 or more; two or more daylight shots in every chapter |
| D4, D5 | each place its own colour (`opts.palette`, from `look.md`); no colour on more than a third of the picture time; neighbouring places never share one |
| K1, K2 | six places or more a chapter; a place at most three times a chapter |
| W1, W2 | two pictures in three have nothing to read; one thing to read at a time |
| G1, G2, G5 | something happens in every picture; companies are living things; the hidden `piggy` about every three minutes |
| G7, G8, G9 | bodies move (an entrance, a `to` walk, a pose change, a prop `move`) in 60% of shots with figures; two or more figures and props in 80% of pictures; living things alone in a third at most |
| G10 | a market, street, stadium, red carpet, station or audience has `"extras"` 3 or more (a place tagged "empty ..." is exempt) |
| R1, R2, R3 | conversations cut between the faces (75% of lines on the speaker's own shot); an `"frame": "ots"` shot in each conversation of 3+ lines; two `"angle"` shots a chapter |
| M1, M2, M3, M4, X1 | the motif returns changed; callbacks in the second half; the viewer stand-in appears and owns the last shot; three grades or more; the last shot is a callback |
| J1 | every shot has `"explains"`: one plain sentence of what the viewer understands |
| C1, C2, C3 | a card about every 20 s, 8–16% of the runtime, none over 5.5 s |
| A9 | every place has its ambience (the set's own bed, or `"ambience"` on the shot) |

## Before writing a shot (the four questions)
Where are we (a specific place from `look.md`, never a plain wall)? Who is doing what with their body? Is there one thing to read, or none? Who plays the company (a living thing with a label on its first shot in a chapter)?

## Camera language
- Two figures talking: shot and reverse shot. Speaker A `close` or `medium` with `"focus"` on A's face, then B, cut on the line; one `"frame": "ots"` shot per conversation (B's shoulder in the near foreground, A's face beyond). Never a whole exchange in one shot facing the camera.
- `"angle": "low"` on whoever holds the power at the moment it shows; `"angle": "high"` on the small and the trapped.
- A push-in is for a realisation, not a habit. Dialogue may hold almost still.
- Shot sizes change at every cut: wide for a place, close for a face, a detail with `"focus"`.

## Keys (the full list is "Storyboard format" in `studio/README.md`; for a component you have not used, Grep its name in `studio/gallery/storyboard.json` and read that one shot)
- **Shot**: `id`, `cue`, `word`, `at`, `set`, `opts` (`night`, `palette`, set options), `place`, `camera` (`push_in`, `pull_out`, `pan_left`, `pan_right`, `tilt_up`, `tilt_down`, `still`, `shake`), `frame` (`medium`, `close`, `ots`), `angle` (`low`, `high`), `focus`, `grade` (`green`, `red`, `sepia`, `night`, `gold`), `light` (`x`, `y`, `r`, `color`, `dark`), `extras`, `ambience`, `sound`, `explains`, `motif`, `callback`.
- **Actor**: `who` or `thing` + `label`; `x`, `y`, `scale`, `flip`, `look`, `face`, `pose`, `prop`, `sign`, `tag`, `badge`, `hat`, `speaks` (line ids), `enter`, `acts` (`cue`, `word`, `to`, `dur`, `face`, `pose`).
- **Cards**: `{ "type": "card", "text", "emph" }`, `{ "type": "chapter", "number", "title" }`, `{ "type": "split", "panels" }`.
- **Faces**: neutral, plain, happy, shocked, scared, angry, smug, sad, confused, relieved, deadpan; loud ones (hooks, climaxes) panic, furious, crying, greedy. **Poses**: rest, hips, shrug, cheer, point, think, facepalm, hold, phone, wave, present, raise, carry, panic, grab, offer. **Hand props**: phone, bill, tablet, mug, stamp, cash, wallet, tag, pen, placard, briefcase, magnifier.
- **Living things**: box, chip, tower, dome, bank, factory, server, cloud, coin, bag, house, barrel, note, and the episode's own.
- **Overlays**: counter (`roll`), slam, lower_third, doc, post, calendar, clock, stamp, label, source, tag. **Story scenes** (`studio/README.md`, Story scenes): evidence board, timeline, map flight, money flow, split bar, chain, phone messages.
- **Sets**: the `SETS` table in `studio/engine/sets.js` (Grep its keys); new ones come from the scene builder through `build-requests.md`.

Keys added by the engine-v2 work (`ots`, `angle`, `palette`, `extras`, `ambience`, act sounds) work once `studio/README.md` documents them; write them from now on, the lint grades them WARN until then.
