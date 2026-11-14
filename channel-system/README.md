# Channel system

A newsroom of agents that turns a market event into a 12–15 minute cartoon explainer, with three human approval gates. The engine in `../studio/` draws the whole video in code: the cast, the places, the light, the numbers and the subtitles, timed to the voice. Only the thumbnails are painted (and a background, when a place is too costly to draw). This was settled on 13 Nov 2026, after the rival's video on our first story was measured: it is made the same way, and it won on staging, not on paint (`LESSONS.md`; the targets are in `FORMAT_BOOK.md` 3, 4 and 11).

## Pipeline

Redesigned on 13 Nov 2026 so that independent steps run at the same time and every fault is found on something cheap (the lint, a frame sheet, a 30-second draft) before the one full render. Every gate stays. Lines marked `‖` run at the same time.

```
1  trend-scout       → topics/<date>.md: 3 scored topics             ─── GATE 1: you pick a topic
2  researcher        → research.md (sourced), brief.md
3  scriptwriter      → script.md (PROMISE, DEVICES, three openings; repeat check)
3b punch-up          → sharper skits and scene gags, punchup.md
4  fact-checker      → factcheck.md, fixes in the script             ─── GATE 2: you approve the script
                                                                         (the voice is already chosen: Voice row below)
5  ‖ voice-producer  → direction.md, "dir" per line, the published voice, mix --tighten
   ‖ creative-director → look.md (places, colour, light, crowds, ambience, camera moments),
                       audio/music-cues.md, build-requests.md
   ‖ scene-builder   → the new sets with palette and ambience, in batches of five, first-30-seconds sets first
   ‖ art-director ×N → blocking pass of every chapter at once (the animatic: places, light, frames, who, explains)
6  editor            → animatic build + lint + one frame sheet per chapter
   creative-director → structure fixes before any detail
7  art-director      → the first 30 seconds in full detail
   editor            → build + 30-second draft render                ─── LOOK GATE, never skipped: the draft and the
   qa-reviewer       → "## Look gate" in qa.md beside                    look sheet go to you beside the quality
                       brand/quality_reference.jpg                       reference; we wait only if you have not waived
8  ‖ art-director ×N → detail pass, one per chapter; each checks its own chapter (lint, layout, frames) before handing over
   ‖ illustrator     → three thumbnails from the Look gate frames
   ‖ fact-checker    → screen text, chapter by chapter as each lands
9  editor            → full build, lint, layout check, frames
10 qa-reviewer       → qa.md; fixes back; draft renders of the moments that move; repeat until "Verdict: pass"
11 ‖ editor          → the one full render (about an hour, in the background) and loudness
   ‖ packager        → captions, package.md, youtube-upload.txt, Shorts built and linted (rendered after)
   ‖ fact-checker    → currency check on the render day, for a story still moving
                                                                     ─── GATE 3: you approve and upload
12 analyst           → analytics at 48 h, 7 and 28 days (Shorts too), comments and reply drafts, learnings.md
13 improver          → improvements/<date>-<slug>.md: what to make better and why, asked one item at a time
                       in Turkish; only what you approve goes into the rules, agents, lint or an engine request
```

**Why this order** (measured from Poppi's git history on 13 Nov 2026; tokens are not in git, so lines rewritten stand for them). Poppi went from topic to script and fact-check in 30 minutes, then ran one step at a time for about 21 hours. About a fifth of the lines its commits added redid finished work: the whole episode revoiced and retimed after the storyboard (the voice was chosen in ten commits over three hours after the storyboards existed), script trims applied after the storyboard and the voice, `explains` written into 316 shots in a separate pass, a second QA round, the captions and the package written again after the render. And its look was judged only after the full render. So: the voice is recorded right after Gate 2 and the script is final before it (punch-up and fact-check first); sets, voice and the blocking pass run side by side; `explains` is written in the blocking pass; the structure is checked on the animatic and the look on a 30-second draft; each chapter checks itself before QA; packaging runs during the render. Eight chapter art directors each read about 70 KB of rules before writing; they now read one page (`checklists/storyboard.md`) and the episode's `look.md`.

**Rhythm** (approved by the user on 14 Nov 2026): two long episodes a week, Monday and Thursday 22:00 Turkey time (14:00 New York), and a Short every day between them. Once episodes 3 and 4 come out on this pipeline without a second QA round, move to one every two days (the rival's pace). **Dated plan** (improvement O): every `brief.md` has a Schedule line counted back from its upload slot: Gate 1 D-4, Gate 2 D-3, Look gate D-2, QA pass D-1, render the night before. Two episodes may be in flight at once, each on its own branch. The trend scout keeps five approved topics ready in `topics/backlog.md`, so Gate 1 never waits.

Two a week needs about 25,000 ElevenLabs characters a week: the Creator plan (about $22 a month); the user upgrades it on elevenlabs.io before episode 3.

Agent definitions live in `.claude/agents/` at the repository root, so every Claude Code session in this repo can run them by name.

Steps 5–9 are held to measured targets by one tool. A FAIL sends the episode back:

```bash
node studio/tools/retention-lint.mjs channel-system/episodes/<slug>
```

## Folders

| Path | What |
|---|---|
| `FORMAT_BOOK.md` | The rules for script, picture, sound, policy, packaging and Shorts. The single most important file. |
| `STORY_ROUTES.md` | Twelve ways to organise a money story so each beat makes the next one necessary. |
| `characters/STYLE_GUIDE.md` | The house look, limits for real people and logos, the thumbnail formula. |
| `characters/cast.md` | Recurring characters: who they are and how to use them. |
| `checklists/storyboard.md` | The storyboard targets, camera language and keys on one page, for the art directors and the creative director. |
| `brand/quality_reference.jpg` | The fixed quality bar: six of the rival's frames above our best six. Built on the machine by `brand/quality-reference.mjs`; neither it nor the rival's frames are in git (the repository is public), the rival's frames are in `%USERPROFILE%\.kadir\quality_reference\` on the user's PC. Every episode is judged beside it. |
| `improvements/` | The improver's ranked proposals after each upload, with what the user approved, declined and what was installed. |
| `episodes/_template/` | Empty episode folder to copy. |
| `episodes/demo/` | A 19-second demo with scratch voices, staged by the picture rules. |
| `research/` | How the rules were measured: the reference video's analysis and retention review. |
| `learnings.md` | Written by the analyst after each upload (created with the first one). |
| `LESSONS.md` | What went wrong while making each episode and which rule now prevents it. |
| `../studio/` | The engine, the build and lint tools and a gallery of every component. |

## Tools and who does what today

| Step | Tool | Status |
|---|---|---|
| Research, script, fact-check | Claude (web search, primary documents) | Ready |
| Pictures | The `studio/` engine: cast, sets, light, shot sizes, numbers and timing in code. New places are built per episode by the scene builder. | Ready; the lint holds the staging targets (P, D, K, W, S, H checks) |
| Frame check | `node studio/tools/stills.mjs frames <episode>` saves a contact sheet; `preview.mjs` for a browser | Ready (the contact sheet needs Playwright) |
| Voice | Decided by the user on 2026-11-12: a synthetic voice, disclosed in the video and the description, with YouTube's altered-content label set. Re-check the policy text before the first upload. Product: ElevenLabs (decided 13 Nov 2026; key in the cloud environment, Starter plan). Narrator: **Lawrence - Bright and Informative** (`ktkP7Nsj67dw2zcplQYt`), chosen by the user on 13 Nov 2026: bright, energetic, 19th of 700 voices by closeness to the rival's narrator, notice period 4015 days. Its sample reads at 234 wpm: set the speed so the episode lands at 160-175 wpm. Reserves: Tyler Cruz (`SA7eD52NRr8WAehitVt1`), Mike - POV/Storytime (`zfc8CJQpe8Kqyl0vvCzo`). Characters: BENNY = Liam (`TX3LPaxmHKxFdv7VOQHJ`), SODA = Charlie (`IKne3meq5aSn9XLyUdCD`); other characters from the library, American, notice period 730 days. Reasons: `episodes/poppi-soda-billions/voice-test/RESEARCH.md`. `studio/tools/voice.mjs --engine elevenlabs` makes the published track with word timings (built 13 Nov 2026, not yet run on an episode). | Ready; first run after the 17 Nov quota reset |
| Music and effects | `studio/tools/mix.mjs`: effects and a house music bed made in code, so nothing to license. Drop licensed tracks in `audio/music/` to use those instead (the YouTube Audio Library is the safe source). The creative director writes a cue sheet per chapter with stingers (`audio/music-cues.md`). | Ready; ambience per place, act sounds and the `sting` effect come with the engine-v2 work |
| Render to MP4 | HyperFrames (Apache 2.0) + FFmpeg | Tested in a cloud session; a local machine needs FFmpeg on its PATH |
| Thumbnail | Three painted pictures, generated with the image tool the session has or by the user from `prompts.md` (Gemini's Nano Banana Pro, Higgsfield), banded with `studio/tools/stills.mjs thumb --image` | Ready; three pictures an episode |
| Upload | The user, in YouTube Studio | Manual step |

## Keeping a full episode affordable
A 13-minute episode is about 250 lines and 200 shots: too much for one agent in one go.

- **Storyboard by chapter.** Run one art director per chapter, each writing `storyboard/ch<N>.json` with only that chapter's lines. They can run at the same time; the build joins the files.
- **Every agent has a fixed model**, so none of them inherits a more expensive one from the session. The steps that decide the episode's quality (scriptwriter, punch-up, fact-checker, creative director, art director, QA reviewer, improver) use `opus`. The steps that collect, build or follow a checklist (trend scout, researcher, scene builder, voice producer, editor, illustrator, packager, analyst) use `sonnet`; their work is checked afterwards by the fact-checker, the lint or the frame sheet. Change the `model:` line in an agent's definition to move it.
- **Tools before agents.** Voice (`voice.mjs`), sound (`mix.mjs`), frames (`stills.mjs`) and the checks are plain commands; an agent is needed only to judge the result.
- **Agents read sections, not files.** The token rules are in `CLAUDE.md` at the repository root: each agent reads only the parts of the format book, cast and style guide its step needs, reports in a few lines, and code search skips `vendor/`, the old `amazon-hidden-tax/` engines and `research/` (see `.ignore`).
- **A new session per gate.** The episode folder carries everything forward, so a new session after each gate starts with an empty conversation instead of paying for the old one on every turn.
- Render once, after QA passes. A 13-minute episode took 1 h 4 min on the user's laptop (2 workers); a fix found after the render costs the whole hour again. To look at a fix, render only that part (`--start <s> --end <s>`). Run the full render in the background.

## Running an episode

In a Claude Code session in this repo:
1. "Run trend-scout" → pick one of the three topics.
2. "Make the episode for <topic>" → the agents run steps 2–4 and stop at Gate 2.
3. Approve the script → the voice, the look plan, the sets and the animatic are made side by side; then the first 30 seconds are built and you get a 30-second draft video beside the quality reference (Look gate). Then the detail pass, QA, the render and the package run. When the session has no image tool, the illustrator hands you `prompts.md` and you generate the three thumbnails.

**When you say "do it all".** The user may waive Gate 1 and Gate 2 for an episode ("pick the topic and finish it"). The session records that in `brief.md` with the date, takes the trend scout's first topic, and replaces each waived approval with a check it can run itself: the fact-checker and the lint for the script. **The Look gate is never skipped** (13 Nov 2026): the 30-second draft is still sent to the user, and the QA reviewer writes the comparison in `qa.md`; with the gates waived the work goes on without waiting, and the user's "no" stops it where it is. Gate 3 is never waived: the upload is the user's, and the open choices are put to the user there, once, with a recommendation.
4. A few days after the upload, share the YouTube Studio numbers → the analyst updates `learnings.md`, and the improver asks you, one item at a time, what to make better for the next episode.
