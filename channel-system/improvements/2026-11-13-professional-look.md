# Improvements after Poppi (13 Nov 2026)

The first improvements file. Items 1–14 were asked for by the user on 13 Nov 2026 (through the session that rendered Poppi) and installed on branch `claude/pro-rules-agents-7c96ba`; items A–D are open for the improver to ask, one at a time, from the top. Lint values for both episodes are in the FORMAT_BOOK 11 table.

## Installed (user's request, 13 Nov 2026)
| # | What | Why (evidence) | Changes | Status |
|---|---|---|---|---|
| 1 | The Look gate is never skipped: a 30 s draft render goes to the user beside the quality reference | Poppi skipped it; its faults were seen after the full render | FORMAT_BOOK 11, README, qa-reviewer, editor, art-director, lint H9, `_template/qa.md` | installed |
| 2 | An ambience bed per place, a sound per body action | Poppi: 0 of 72 places with a bed, 113 silent actions | FORMAT_BOOK 13, STYLE_GUIDE, scene-builder, lint A9, A10; engine-v2 | installed (engine keys pending) |
| 3 | Shot and reverse shot, over-the-shoulder, low and high angles, a cap on one camera move | Poppi: push_in on 30% of shots, no OTS in 32 conversations; episode 1: 9% of conversation lines on the speaker's own shot | FORMAT_BOOK 11, STYLE_GUIDE, art-director, checklist, lint R1–R3, P6; engine-v2 | installed (ots, angle pending) |
| 4 | Each place its own colour, neighbours different | Poppi: navy on 84% of the picture time, 102 of 147 place changes kept it | FORMAT_BOOK 11, STYLE_GUIDE, creative-director, scene-builder, lint D4, D5; engine-v2 `palette` | installed (palette pending) |
| 5 | Extras in crowded places | 0 of 34 crowd-place shots had a crowd in either episode | FORMAT_BOOK 11, STYLE_GUIDE, lint G10; engine-v2 `extras` | installed (extras pending) |
| 6 | Movement with weight (anticipation, settle, follow-through) checked on the draft | The user: figures stand, the camera moves | STYLE_GUIDE Figures, qa-reviewer; engine-v2 | installed |
| 7 | A fixed quality reference sheet | Episodes were judged against words, not pictures | `brand/quality_reference.jpg`, `brand/quality-reference.mjs`, STYLE_GUIDE | our six in; the rival's six wait for the user's screenshots |
| 8 | Parallel lanes after Gate 2; voice before the storyboard; packaging during the render | About a fifth of Poppi's added lines redid finished work; one step at a time for about 21 hours | README Pipeline, all agents | installed |
| 9 | One-page storyboard checklist and the episode's look plan | Eight art directors each read about 70 KB of rules | `checklists/storyboard.md`, `_template/look.md` | installed |
| 10 | The improver as the last step | Rules changed in bursts after bad results | `.claude/agents/improver.md`, README | installed |
| 11 | The animatic (blocking pass) before detail | Poppi's structural faults (one look, empty frames) were found after the detail | art-director, editor, creative-director | installed |
| 12 | A comedy punch-up pass | Skits carry retention; the rival's top comments are jokes | `.claude/agents/punch-up.md` | installed |
| 13 | A creative director who owns the look | Eight art directors drifted into one navy spotlight look | `.claude/agents/creative-director.md` | installed |
| 14 | Music cues per chapter with stingers; voice direction per line for ElevenLabs | One bed rotation; one reading tone for 12 minutes | FORMAT_BOOK 13, `_template/audio/music-cues.md`, voice-producer, `voice.mjs` (`dir`, `EL_DIR`) | installed |

## Open (the improver asks these, top first)
| # | What | Why | Cost | Changes | Status |
|---|---|---|---|---|---|
| A | The rival's six frames for the quality reference (the user takes six screenshots) | The top row of the sheet is grey | five minutes of the user's time | `brand/quality_reference/rival_1..6`, then `quality-reference.mjs` | asked 13 Nov 2026 |
| B | ElevenLabs plan: stay on Starter (about $6 a month, 30,000 credits, about two episodes) or move to Creator (about $22, about 121,000 credits) when the channel goes weekly | Poppi took 11,438 characters, plus revoiced lines | about $16 more a month | README Voice row | proposed; recommend Starter until a third episode falls in one month; prices from third-party pages in Oct 2026, check elevenlabs.io/pricing on the day |
| C | Measure R1–R3, D4, G10 on the rival's video, so these targets rest on a measurement and not only on our faults | LESSONS: a rule that copies another channel names its measurement | one session | FORMAT_BOOK 11 table | proposed |
| D | Try ElevenLabs' newer expressive model with audio tags on the Look gate's 30 s only | Delivery may carry more than settings per line | about 400 credits | `voice.mjs` | proposed |
